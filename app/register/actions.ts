"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export type RegisterState = {
  error: string | null;
  /** set when the account was created but email confirmation is on */
  needsConfirmation?: boolean;
};

const CLIENT_TYPES = ["school", "business", "other"] as const;

export async function registerClient(
  _prev: RegisterState,
  formData: FormData,
): Promise<RegisterState> {
  const get = (k: string) => String(formData.get(k) ?? "").trim();

  const fullName = get("fullName");
  const email = get("email").toLowerCase();
  const phone = get("phone");
  const password = get("password");
  const organisation = get("organisation");
  const clientType = get("clientType");
  const businessType = get("businessType");
  const workDescription = get("workDescription");
  const budgetBand = get("budgetBand");
  const area = get("area");
  const referral = get("referral");

  // ── validation ──────────────────────────────────────────────────────
  if (!fullName) return { error: "Please tell us your name." };
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Please enter a valid email address." };
  }
  if (!phone || phone.replace(/\D/g, "").length < 10) {
    return { error: "Please enter a 10-digit phone or WhatsApp number." };
  }
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }
  if (!organisation) {
    return { error: "Please enter your organisation or business name." };
  }
  if (!CLIENT_TYPES.includes(clientType as (typeof CLIENT_TYPES)[number])) {
    return { error: "Please choose what kind of account this is." };
  }
  if (!workDescription) {
    return { error: "Please tell us briefly what you do — it helps us quote accurately." };
  }

  if (!isSupabaseConfigured) {
    return {
      error:
        "Registration needs Supabase to be connected. Email us and we will set your login up by hand.",
    };
  }

  // ── create the login, carrying the answers as metadata ──────────────
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // Without this the confirmation email points at whatever Supabase has
      // as its Site URL, which is not necessarily this Next.js app.
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/portal`,
      data: {
        full_name: fullName,
        phone,
        client_type: clientType,
        organisation,
        business_type: businessType || null,
        work_description: workDescription,
        budget_band: budgetBand || null,
        area: area || null,
        referral: referral || null,
      },
    },
  });

  if (error) {
    if (/already/i.test(error.message)) {
      return {
        error:
          "That email already has an account. Use Sign in instead, or email us and we will reset it.",
      };
    }
    return { error: error.message };
  }

  // ── confirm before we send them through ─────────────────────────────
  if (!data.session) {
    return { error: null, needsConfirmation: true };
  }

  // ── record the brief as an enquiry too, so nothing is lost ─────────
  await supabase.from("enquiries").insert({
    name: fullName,
    phone,
    email,
    client_type: clientType,
    service: workDescription.slice(0, 120),
    event_note: organisation,
    message: [
      businessType ? `Type: ${businessType}` : null,
      budgetBand ? `Budget: ${budgetBand}` : null,
      area ? `Area: ${area}` : null,
      workDescription,
    ]
      .filter(Boolean)
      .join("\n"),
  });

  // Fire and forget — registration must not wait on, or fail because of, mail.
  void notifyAdminOfEnquiry({
    name: fullName,
    email,
    phone,
    clientType,
    organisation,
    businessType,
    budgetBand,
    area,
    referral,
    workDescription,
  });

  redirect("/portal");
}

/**
 * Best-effort admin notification for a new enquiry. Runs after the redirect
 * is queued, so a mail failure can never break registration.
 */
export async function notifyAdminOfEnquiry(input: {
  name: string;
  email: string;
  phone: string;
  clientType: string;
  organisation: string;
  businessType: string;
  budgetBand: string;
  area: string;
  referral: string;
  workDescription: string;
}) {
  try {
    const [{ sendMail, templates, emailConfigured }, { isSupabaseConfigured }, { fetchSettings, settingBool, setting }] =
      await Promise.all([
        import("@/lib/email"),
        import("@/lib/supabase/config"),
        import("@/lib/settings"),
      ]);

    if (!isSupabaseConfigured || !emailConfigured()) return;

    const s = await fetchSettings();
    if (!settingBool(s, "notify.new_enquiry", true)) return;

    const to = process.env.ADMIN_NOTIFY_EMAIL || process.env.BREVO_SENDER_EMAIL;
    if (!to) return;

    const site = process.env.NEXT_PUBLIC_SITE_URL ?? "";
    const { subject, html } = templates.newEnquiry(
      { name: input.name, organisation: input.organisation },
      {
        phone: input.phone,
        email: input.email,
        client_type: input.clientType,
        budget: setting(s, "", input.budgetBand),
        requirement: input.workDescription,
        area: input.area,
        referral: input.referral,
        portalUrl: `${site}/admin`,
      },
    );

    await sendMail({ to, subject, html, kind: "new_enquiry" });
  } catch {
    // never surface mail problems to the person registering
  }
}