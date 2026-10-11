import "server-only";

import crypto from "node:crypto";

import { createAdminClient } from "@/lib/supabase/admin";
import {
  fetchSettings,
  setting,
  settingBool,
  type SettingsMap,
} from "@/lib/settings";
import {
  oneTimeWork,
  plans as defaultPlans,
  services as defaultServices,
} from "@/lib/site-config";

/* ======================================================================
   Online payments (Razorpay) — server-only.
   - Amounts resolve here from site_settings / the project row. The
     browser only ever names an item; it never states a price.
   - Razorpay is called over plain REST (no SDK), so there is one less
     dependency to rot.
   ====================================================================== */

export interface Payable {
  kind: "plan" | "job";
  key: string;
  title: string;
  subtitle: string;
  amountPaise: number;
}

/** "₹1,799" → 179900. "4,999" → 499900. null when no digits found. */
export function parsePaise(display: string): number | null {
  const digits = display.replace(/[^\d]/g, "");
  if (!digits) return null;
  const rupees = Number(digits);
  if (!Number.isFinite(rupees) || rupees <= 0) return null;
  return Math.round(rupees * 100);
}

/**
 * Everything a visitor may buy online, priced from /admin/settings.
 * Flex is per-sq.ft so it sells as a flat advance (pay.flex_advance);
 * portal dues resolve per project, not here.
 */
export function payablesFromSettings(s: SettingsMap): Payable[] {
  const items: Payable[] = [];

  for (const p of defaultPlans) {
    const k = p.name.toLowerCase();
    const paise = parsePaise(setting(s, `plan.${k}.price`, p.price));
    if (paise === null) continue;
    items.push({
      kind: "plan",
      key: `plan.${k}`,
      title: `${setting(s, `plan.${k}.name`, p.name)} — monthly retainer`,
      subtitle: "First month, charged now. We confirm on WhatsApp before work starts.",
      amountPaise: paise,
    });
  }

  const jobs: Array<{ key: string; title: string; priceKey: string; fallback: string; subtitle: string }> = [
    {
      key: "job.poster",
      title: "Poster — design + print",
      priceKey: "price.poster",
      fallback: oneTimeWork[2].price,
      subtitle: "One poster, designed and printed.",
    },
    {
      key: "job.standee",
      title: "Roll-up standee with design",
      priceKey: "price.standee",
      fallback: oneTimeWork[1].price,
      subtitle: "Standee + design, delivered in Dhanbad.",
    },
    {
      key: "job.shoot",
      title: "Half-day event shoot",
      priceKey: "price.shoot",
      fallback: oneTimeWork[3].price,
      subtitle: "Half-day shoot, edited reel included.",
    },
  ];

  for (const j of jobs) {
    const paise = parsePaise(setting(s, j.priceKey, j.fallback));
    if (paise === null) continue;
    items.push({ kind: "job", key: j.key, title: j.title, subtitle: j.subtitle, amountPaise: paise });
  }

  for (const svc of defaultServices) {
    const paise = parsePaise(
      setting(s, `service.${svc.slug}.price`, svc.price),
    );
    if (paise === null) continue;
    items.push({
      kind: "job",
      key: `service.${svc.slug}`,
      title: svc.title,
      subtitle: setting(s, `service.${svc.slug}.price_note`, svc.priceNote),
      amountPaise: paise,
    });
  }

  const flexAdvance = parsePaise(setting(s, "pay.flex_advance", "500"));
  if (flexAdvance !== null) {
    items.push({
      kind: "job",
      key: "job.flex_advance",
      title: "Flex printing — advance",
      subtitle: "Flat advance. Adjusted against the final per-sq.ft bill.",
      amountPaise: flexAdvance,
    });
  }

  return items;
}

export function findPayable(s: SettingsMap, key: string): Payable | null {
  return payablesFromSettings(s).find((p) => p.key === key) ?? null;
}

/* ── gateway config ───────────────────────────────────────────────── */

export function razorpayKeys(): { keyId: string; secret: string } | null {
  const keyId = process.env.RAZORPAY_KEY_ID ?? "";
  const secret = process.env.RAZORPAY_KEY_SECRET ?? "";
  if (!keyId || !secret) return null;
  return { keyId, secret };
}

/** True only when keys exist AND the admin flipped payments on. */
export async function paymentsLive(): Promise<{
  live: boolean;
  keyId: string | null;
}> {
  const keys = razorpayKeys();
  if (!keys) return { live: false, keyId: null };
  const s = await fetchSettings();
  const enabled = settingBool(s, "payments.enabled", false);
  return { live: enabled, keyId: enabled ? keys.keyId : null };
}

/* ── Razorpay REST ────────────────────────────────────────────────── */

const API = "https://api.razorpay.com/v1";

function authHeader(secret: string, keyId: string): string {
  return `Basic ${Buffer.from(`${keyId}:${secret}`).toString("base64")}`;
}

export interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
}

export async function createRazorpayOrder(opts: {
  amountPaise: number;
  currency: string;
  receipt: string;
  notes: Record<string, string>;
}): Promise<RazorpayOrder> {
  const keys = razorpayKeys();
  if (!keys) throw new Error("Razorpay keys are not configured.");

  const res = await fetch(`${API}/orders`, {
    method: "POST",
    headers: {
      Authorization: authHeader(keys.secret, keys.keyId),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: opts.amountPaise,
      currency: opts.currency,
      receipt: opts.receipt,
      notes: opts.notes,
    }),
  });

  const body = (await res.json().catch(() => ({}))) as {
    id?: string;
    amount?: number;
    currency?: string;
    error?: { description?: string };
  };

  if (!res.ok || !body.id) {
    throw new Error(body.error?.description ?? "Razorpay refused the order.");
  }

  return { id: body.id, amount: body.amount ?? opts.amountPaise, currency: body.currency ?? opts.currency };
}

export interface RazorpayPayment {
  id: string;
  contact: string | null;
  email: string | null;
  method: string | null;
}

export async function getRazorpayPayment(paymentId: string): Promise<RazorpayPayment | null> {
  const keys = razorpayKeys();
  if (!keys) return null;

  const res = await fetch(`${API}/payments/${paymentId}`, {
    headers: { Authorization: authHeader(keys.secret, keys.keyId) },
  });
  if (!res.ok) return null;
  const body = (await res.json()) as {
    id?: string;
    contact?: string;
    email?: string;
    method?: string;
  };
  if (!body.id) return null;
  return {
    id: body.id,
    contact: body.contact ?? null,
    email: body.email ?? null,
    method: body.method ?? null,
  };
}

/** Checkout callback signature: HMAC(order_id|payment_id) with the secret. */
export function verifyCheckoutSignature(opts: {
  orderId: string;
  paymentId: string;
  signature: string;
}): boolean {
  const keys = razorpayKeys();
  if (!keys) return false;
  const expected = crypto
    .createHmac("sha256", keys.secret)
    .update(`${opts.orderId}|${opts.paymentId}`)
    .digest("hex");
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(opts.signature, "utf8");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

/** Webhook signature: HMAC(raw body) with the secret. */
export function verifyWebhookSignature(rawBody: string, signature: string): boolean {
  const keys = razorpayKeys();
  if (!keys) return false;
  const expected = crypto.createHmac("sha256", keys.secret).update(rawBody).digest("hex");
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(signature, "utf8");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

/* ── ledger ───────────────────────────────────────────────────────── */

export interface PendingPayment {
  purpose: "plan" | "job" | "due";
  itemKey: string;
  itemLabel: string;
  projectId: string | null;
  amountPaise: number;
  currency: string;
  orderId: string;
}

export async function insertPendingPayment(p: PendingPayment): Promise<string> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("payments")
    .insert({
      purpose: p.purpose,
      item_key: p.itemKey,
      item_label: p.itemLabel,
      project_id: p.projectId,
      amount_paise: p.amountPaise,
      currency: p.currency,
      razorpay_order_id: p.orderId,
      status: "pending",
    })
    .select("id")
    .single();

  if (error || !data) throw new Error(error?.message ?? "Could not record the payment.");
  return (data as { id: string }).id;
}

export interface AppliedPayment {
  ok: boolean;
  duplicate?: boolean;
  reason?: string;
  paymentId?: string;
  projectId?: string | null;
  amountPaise?: number;
}

/**
 * Flip a pending row to paid. Idempotent — the webhook and the checkout
 * callback both call this, and the second one is a harmless no-op.
 */
export async function applySuccessfulPayment(opts: {
  orderId: string;
  paymentId: string;
}): Promise<AppliedPayment> {
  const admin = createAdminClient();

  const { data: row } = await admin
    .from("payments")
    .select("*")
    .eq("razorpay_order_id", opts.orderId)
    .single();

  const payment = row as unknown as {
    id: string;
    status: string;
    purpose: string;
    item_key: string;
    item_label: string;
    project_id: string | null;
    amount_paise: number;
  } | null;

  if (!payment) return { ok: false, reason: "unknown order" };
  if (payment.status === "paid") return { ok: true, duplicate: true, paymentId: payment.id };

  const gateway = await getRazorpayPayment(opts.paymentId);

  const { error: updErr } = await admin
    .from("payments")
    .update({
      status: "paid",
      razorpay_payment_id: opts.paymentId,
      verified_at: new Date().toISOString(),
      payer_name: null,
      payer_phone: gateway?.contact ?? null,
      payer_email: gateway?.email ?? null,
      raw: {
        payment_id: opts.paymentId,
        method: gateway?.method ?? null,
      },
    })
    .eq("id", payment.id);

  if (updErr) return { ok: false, reason: updErr.message };

  if (payment.purpose === "due" && payment.project_id) {
    // Grow what the client has paid. Never overshoot the agreed figure.
    const { data: project } = await admin
      .from("projects")
      .select("id,paid_amount,agreed_amount")
      .eq("id", payment.project_id)
      .single();

    const proj = project as unknown as {
      paid_amount: number | null;
      agreed_amount: number | null;
    } | null;

    if (proj) {
      const rupees = payment.amount_paise / 100;
      const next = Math.round(((proj.paid_amount ?? 0) + rupees) * 100) / 100;
      const capped =
        proj.agreed_amount !== null ? Math.min(next, proj.agreed_amount) : next;
      await admin.from("projects").update({ paid_amount: capped }).eq("id", payment.project_id);
    }
  } else {
    // A plan or job bought outright lands in the admin pipeline as a
    // request, so it is handled by the existing flow — no new UI needed.
    await admin.from("enquiries").insert({
      name: "Online payment",
      phone: gateway?.contact ?? "not shared",
      email: gateway?.email ?? null,
      client_type: "other",
      service: payment.item_label,
      message: `Paid online — order ${opts.orderId}, payment ${opts.paymentId}, ${payment.amount_paise / 100} ${"INR"}. Confirm on WhatsApp before starting work.`,
    });
  }

  return {
    ok: true,
    paymentId: payment.id,
    projectId: payment.project_id,
    amountPaise: payment.amount_paise,
  };
}

export function receipt(): string {
  return `jmh-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
