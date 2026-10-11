import { NextResponse } from "next/server";

import { isSupabaseConfigured } from "@/lib/supabase/config";
import {
  applySuccessfulPayment,
  verifyCheckoutSignature,
} from "@/lib/payments";

export const runtime = "nodejs";

/**
 * Checkout callback landed on a paid order → verify the signature, then
 * flip the ledger row. The webhook does the same job independently, so
 * whichever arrives first wins and the other is a no-op.
 */
export async function POST(request: Request) {
  if (!isSupabaseConfigured) {
    return NextResponse.json({ ok: false, error: "payments unavailable" }, { status: 503 });
  }

  try {
    const { orderId, paymentId, signature } = (await request.json()) as {
      orderId?: string;
      paymentId?: string;
      signature?: string;
    };

    if (!orderId || !paymentId || !signature) {
      return NextResponse.json({ ok: false, error: "missing fields" }, { status: 400 });
    }

    if (!verifyCheckoutSignature({ orderId, paymentId, signature })) {
      return NextResponse.json({ ok: false, error: "bad signature" }, { status: 400 });
    }

    const applied = await applySuccessfulPayment({ orderId, paymentId });
    if (!applied.ok) {
      return NextResponse.json({ ok: false, error: applied.reason ?? "unknown order" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, duplicate: applied.duplicate ?? false });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
