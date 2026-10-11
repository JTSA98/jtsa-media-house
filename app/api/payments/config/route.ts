import { NextResponse } from "next/server";

import { paymentsLive } from "@/lib/payments";

export const runtime = "nodejs";

/**
 * What the browser needs to render Pay buttons: whether online payment
 * is live, and the public key id. The secret never leaves the server.
 */
export async function GET() {
  const { live, keyId } = await paymentsLive();
  return NextResponse.json({ enabled: live, keyId });
}
