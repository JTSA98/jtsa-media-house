import { NextResponse } from "next/server";

import { isSupabaseConfigured } from "@/lib/supabase/config";
import { applySuccessfulPayment, verifyWebhookSignature } from "@/lib/payments";

export const runtime = "nodejs";

/**
 * Razorpay webhook — the reliable half of the confirmation. The checkout
 * callback can be lost (tab closed, network blip); this cannot, because
 * Razorpay retries it. Same apply function, idempotent by construction.
 *
 * Configure in the Razorpay dashboard: payment.captured → this URL.
 */
export async function POST(request: Request) {
  if (!isSupabaseConfigured) {
    return NextResponse.json({ ok: false, skipped: true });
  }

  const raw = await request.text();
  const signature = request.headers.get("x-razorpay-signature") ?? "";

  if (!verifyWebhookSignature(raw, signature)) {
    return NextResponse.json({ ok: false, error: "bad signature" }, { status: 400 });
  }

  try {
    const event = JSON.parse(raw) as {
      event?: string;
      payload?: {
        payment?: { entity?: { id?: string; order_id?: string; captured?: boolean } };
      };
    };

    if (event.event === "payment.captured") {
      const entity = event.payload?.payment?.entity;
      if (entity?.id && entity.order_id) {
        await applySuccessfulPayment({ orderId: entity.order_id, paymentId: entity.id });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
