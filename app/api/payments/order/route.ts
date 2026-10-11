import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { fetchSettings, setting } from "@/lib/settings";
import {
  createRazorpayOrder,
  findPayable,
  insertPendingPayment,
  paymentsLive,
  receipt,
} from "@/lib/payments";

export const runtime = "nodejs";

type OrderBody =
  | { kind: "plan" | "job"; key: string }
  | { kind: "due"; projectId: string };

/**
 * Create a Razorpay order. The amount is ALWAYS resolved on the server —
 * from site_settings for plans/jobs, from the project row for dues.
 * Anything the browser sends besides the item identity is ignored.
 */
export async function POST(request: Request) {
  if (!isSupabaseConfigured) {
    return NextResponse.json({ ok: false, error: "payments unavailable" }, { status: 503 });
  }

  const { live, keyId } = await paymentsLive();
  if (!live || !keyId) {
    return NextResponse.json(
      { ok: false, error: "Online payment is not switched on. Pay by UPI instead." },
      { status: 403 },
    );
  }

  try {
    const body = (await request.json()) as OrderBody;
    const settings = await fetchSettings();
    const currency = setting(settings, "payments.currency", "INR");

    if (body.kind === "due") {
      return await dueOrder(body.projectId, currency, keyId);
    }

    const item = findPayable(settings, body.key);
    if (!item) {
      return NextResponse.json({ ok: false, error: "unknown item" }, { status: 400 });
    }

    const order = await createRazorpayOrder({
      amountPaise: item.amountPaise,
      currency,
      receipt: receipt(),
      notes: { purpose: item.kind, item_key: item.key },
    });

    await insertPendingPayment({
      purpose: item.kind,
      itemKey: item.key,
      itemLabel: item.title,
      projectId: null,
      amountPaise: item.amountPaise,
      currency,
      orderId: order.id,
    });

    return NextResponse.json({
      ok: true,
      orderId: order.id,
      amount: item.amountPaise,
      currency,
      keyId,
      title: item.title,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

async function dueOrder(projectId: string, currency: string, keyId: string) {
  if (!projectId) {
    return NextResponse.json({ ok: false, error: "missing project" }, { status: 400 });
  }

  // Session client, so RLS decides: a client only ever reads their own rows.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ ok: false, error: "not signed in" }, { status: 401 });
  }

  const { data: project } = await supabase
    .from("projects")
    .select("id,title,reference,agreed_amount,paid_amount,client_id")
    .eq("id", projectId)
    .eq("client_id", user.id)
    .single();

  const p = project as unknown as {
    id: string;
    title: string;
    reference: string;
    agreed_amount: number | null;
    paid_amount: number | null;
  } | null;

  if (!p) {
    return NextResponse.json({ ok: false, error: "not your project" }, { status: 403 });
  }

  const due = Math.max(0, (p.agreed_amount ?? 0) - (p.paid_amount ?? 0));
  if (due <= 0) {
    return NextResponse.json({ ok: false, error: "nothing due" }, { status: 400 });
  }

  const amountPaise = Math.round(due * 100);

  const order = await createRazorpayOrder({
    amountPaise,
    currency,
    receipt: receipt(),
    notes: { purpose: "due", project_id: p.id },
  });

  await insertPendingPayment({
    purpose: "due",
    itemKey: `due.${p.id}`,
    itemLabel: `Balance — ${p.title} (${p.reference})`,
    projectId: p.id,
    amountPaise,
    currency,
    orderId: order.id,
  });

  return NextResponse.json({
    ok: true,
    orderId: order.id,
    amount: amountPaise,
    currency,
    keyId,
    title: `Balance — ${p.title}`,
  });
}
