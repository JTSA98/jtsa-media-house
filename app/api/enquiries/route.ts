import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendMail, templates, emailConfigured } from "@/lib/email";
import { fetchSettings, settingBool } from "@/lib/settings";

export const runtime = "nodejs";

/**
 * Public campaign booking → enquiries table + an email to the agency.
 *
 * The insert uses the service role key rather than the browser's anon key, so
 * that saving the lead and mailing the owner happen together and the client
 * never sees a database credential. The booking form POSTs here instead of
 * writing directly.
 *
 * The insert is the source of truth. If mail fails the lead is still saved
 * and visible in the admin panel, so we still return ok:true — the visitor
 * should never be told their booking failed because an email did not go out.
 */

const MAX = { business: 120, phone: 32, email: 160, requirements: 2000 };

const clean = (v: unknown, max: number) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

const digitsOnly = (v: string) => v.replace(/\D/g, "");

export async function POST(request: Request) {
  let body: Record<string, unknown>;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }

  const business = clean(body.business, MAX.business);
  const phone = clean(body.phone, MAX.phone);
  const email = clean(body.email, MAX.email).toLowerCase();
  const sector = clean(body.sector, 80);
  const packageId = clean(body.package, 60);
  const packageLabel = clean(body.packageLabel, 120);
  const requirements = clean(body.requirements, MAX.requirements);

  const missing = (
    [
      ["business", business],
      ["phone", phone],
      ["sector", sector],
      ["package", packageId],
    ] as const
  )
    .filter(([, v]) => !v)
    .map(([k]) => k);

  if (missing.length) {
    return NextResponse.json(
      { ok: false, error: `Missing: ${missing.join(", ")}` },
      { status: 400 },
    );
  }

  const digits = digitsOnly(phone);
  if (digits.length < 10) {
    return NextResponse.json(
      { ok: false, error: "Enter a valid 10-digit phone number" },
      { status: 400 },
    );
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: "Enter a valid email" }, { status: 400 });
  }

  // A wa.me link is only usable when we have the full number with country code.
  const whatsappDigits = digits.length >= 11 ? digits : "";

  let admin;
  try {
    admin = createAdminClient();
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        error:
          err instanceof Error
            ? err.message
            : "Server is not configured for bookings yet",
      },
      { status: 503 },
    );
  }

  const { data: inserted, error: insertError } = await admin
    .from("enquiries")
    .insert({
      name: business,
      phone,
      email: email || null,
      client_type: "other",
      service: packageId,
      event_note: `${sector} — campaign booking`,
      message: [requirements ? `Notes: ${requirements}` : ""].filter(Boolean).join("\n") || null,
    })
    .select("id")
    .single();

  if (insertError) {
    return NextResponse.json({ ok: false, error: insertError.message }, { status: 500 });
  }

  // Saved. Anything past this point must not be able to fail the request.
  const notified = await notifyAgency({
    lead: {
      business,
      phone,
      email: email || null,
      sector,
      packageId,
      packageLabel: packageLabel || packageId,
      requirements: requirements || null,
      whatsappDigits,
    },
  });

  return NextResponse.json({ ok: true, id: inserted?.id ?? null, notified });
}

async function notifyAgency({
  lead,
}: {
  lead: {
    business: string;
    phone: string;
    email: string | null;
    sector: string;
    packageId: string;
    packageLabel: string;
    requirements: string | null;
    whatsappDigits: string;
  };
}) {
  const settings = await fetchSettings();

  // The owner can switch these off or repoint them from /admin/settings.
  if (!settingBool(settings, "notify.new_enquiry", true)) {
    return { sent: false, skipped: true, reason: "Lead emails are switched off" };
  }

  if (!emailConfigured()) {
    return { sent: false, skipped: true, reason: "Brevo is not configured" };
  }

  const to =
    settings["notify.admin_email"] ||
    process.env.ADMIN_NOTIFY_EMAIL ||
    process.env.BREVO_SENDER_EMAIL;
  if (!to) {
    return { sent: false, skipped: true, reason: "No recipient configured" };
  }

  // The form's wa.me fallback is only useful when we have the full number,
  // country code included. 10 local digits is all we ever get from the form.
  const agencyDigits = lead.whatsappDigits || (settings["site.phone_digits"] ?? "").slice(-10);

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/\/+$/, "");

  const { subject, html } = templates.campaignBooking({
    business: lead.business,
    phone: lead.phone,
    email: lead.email,
    sector: lead.sector,
    packageLabel: lead.packageLabel,
    packageId: lead.packageId,
    requirements: lead.requirements,
    whatsappDigits: agencyDigits,
    siteUrl,
  });

  const result = await sendMail({ to, subject, html, kind: "new_enquiry" });
  return { sent: result.ok, skipped: result.skipped ?? false, error: result.error ?? null };
}