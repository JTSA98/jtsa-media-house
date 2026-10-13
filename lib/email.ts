import "server-only";

/**
 * Transactional email through Brevo.
 *
 * Same shape as the Olympiad site's src/lib/email.ts so there is one pattern
 * to maintain. Sending never throws at the caller: a failed email is logged
 * to public.email_log and swallowed, because a client approving a milestone
 * must not be shown an error just because mail is down.
 */

const brevoKey = () => process.env.BREVO_API_KEY ?? "";
const brevoSender = () => process.env.BREVO_SENDER_EMAIL ?? "";
const brevoName = () => process.env.BREVO_SENDER_NAME ?? "JTSA Media House";

export const emailConfigured = () =>
  Boolean(brevoKey() && brevoSender());

type Kind =
  | "new_enquiry"
  | "milestone_approved"
  | "new_project"
  | "invoice_issued"
  | "project_update";

export interface MailResult {
  ok: boolean;
  skipped?: boolean;
  error?: string;
}

async function logMail(entry: {
  to: string;
  subject: string;
  kind: Kind;
  status: "sent" | "failed" | "skipped";
  error?: string;
}) {
  // Imported lazily so this module stays usable without Supabase configured.
  try {
    const { createAdminClient } = await import("@/lib/supabase/admin");
    const admin = createAdminClient();
    await admin.from("email_log").insert({
      to_email: entry.to,
      subject: entry.subject,
      kind: entry.kind,
      status: entry.status,
      error: entry.error ?? null,
    });
  } catch {
    // Logging must never break the request either.
  }
}

export async function sendMail(opts: {
  to: string;
  subject: string;
  html: string;
  text?: string;
  kind: Kind;
}): Promise<MailResult> {
  const key = brevoKey();
  const sender = brevoSender();

  if (!key || !sender) {
    await logMail({
      to: opts.to,
      subject: opts.subject,
      kind: opts.kind,
      status: "skipped",
      error: "Brevo not configured (BREVO_API_KEY / BREVO_SENDER_EMAIL)",
    });
    return { ok: false, skipped: true };
  }

  try {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": key,
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({
        sender: { email: sender, name: brevoName() },
        to: [{ email: opts.to }],
        subject: opts.subject,
        htmlContent: opts.html,
        textContent: opts.text ?? stripHtml(opts.html),
      }),
      signal: AbortSignal.timeout(20_000),
    });

    if (!res.ok) {
      const detail = (await res.text()).slice(0, 300);
      await logMail({
        to: opts.to,
        subject: opts.subject,
        kind: opts.kind,
        status: "failed",
        error: `HTTP ${res.status}: ${detail}`,
      });
      return { ok: false, error: `HTTP ${res.status}` };
    }

    await logMail({
      to: opts.to,
      subject: opts.subject,
      kind: opts.kind,
      status: "sent",
    });
    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    await logMail({
      to: opts.to,
      subject: opts.subject,
      kind: opts.kind,
      status: "failed",
      error: message,
    });
    return { ok: false, error: message };
  }
}

function stripHtml(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|h\d|li)>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

// ─── templates ────────────────────────────────────────────────────────

const shell = (heading: string, body: string) => `
<div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#141A26">
  <div style="border-bottom:3px solid #6366F1;padding-bottom:14px;margin-bottom:20px">
    <div style="font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#6366F1;font-weight:700">JTSA Media House</div>
  </div>
  <h1 style="font-size:20px;margin:0 0 16px">${heading}</h1>
  <div style="font-size:14px;line-height:1.7;color:#3D4759">${body}</div>
  <div style="border-top:1px dashed #D6DBE4;margin-top:26px;padding-top:14px;font-size:12px;color:#7A838F">
    A Sub-Venture of Jharkhand Talent Search Association · Dhanbad<br>
    UDYAM-JH-04-0091747
  </div>
</div>`;

const button = (href: string, label: string) =>
  `<p style="margin:20px 0">
    <a href="${escapeHtml(href)}" style="display:inline-block;background:#6366F1;color:#fff;text-decoration:none;padding:12px 22px;font-weight:700">${escapeHtml(label)}</a>
  </p>`;

const row = (label: string, value?: string | null) =>
  value
    ? `<p style="margin:6px 0"><strong>${label}:</strong> ${escapeHtml(value)}</p>`
    : "";

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export const templates = {
  newEnquiry(to: { name: string; organisation?: string | null }, enquiry: {
    organisation?: string | null;
    phone: string;
    email?: string | null;
    client_type?: string | null;
    budget?: string | null;
    requirement?: string | null;
    area?: string | null;
    referral?: string | null;
    portalUrl: string;
  }) {
    const subject = `New enquiry — ${enquiry.organisation ?? to.name}`;
    const html = shell(
      `${escapeHtml(enquiry.organisation ?? to.name)} just registered`,
      `
      ${row("Contact", to.name)}
      ${row("Phone", enquiry.phone)}
      ${row("Email", enquiry.email)}
      ${row("Type", enquiry.client_type)}
      ${row("Budget", enquiry.budget)}
      ${row("Area", enquiry.area)}
      ${row("Heard about us", enquiry.referral)}
      ${row("What they need", enquiry.requirement)}
      <p style="margin:20px 0">
        <a href="${enquiry.portalUrl}" style="display:inline-block;background:#1B7A45;color:#fff;text-decoration:none;padding:12px 22px;font-weight:700">Open the admin panel</a>
      </p>`,
    );
    return { subject, html };
  },

  /**
   * A campaign booking from the public Booking section. Kept separate from
   * newEnquiry because the form asks for sector and package, which the older
   * enquiry form has no concept of.
   */
  campaignBooking(lead: {
    business: string;
    phone: string;
    email?: string | null;
    sector: string;
    packageLabel: string;
    packageId: string;
    requirements?: string | null;
    whatsappDigits: string;
    siteUrl: string;
  }) {
    const subject = `New campaign booking — ${lead.business} (${lead.sector})`;
    const html = shell(
      `${escapeHtml(lead.business)} wants to book a campaign`,
      `
      ${row("Sector", lead.sector)}
      ${row("Package", lead.packageLabel)}
      ${row("Phone", lead.phone)}
      ${lead.email ? row("Email", lead.email) : ""}
      ${row("Requirements / target date", lead.requirements)}
      ${button(
        `https://wa.me/${lead.whatsappDigits}?text=${encodeURIComponent(
          `Hi JTSA, I just booked the ${lead.packageLabel} for ${lead.business}. My number is ${lead.phone}.`,
        )}`,
        `Message ${lead.business} on WhatsApp`,
      )}
      ${button(`${lead.siteUrl}/admin`, "Open the admin panel")}`,
    );
    return { subject, html };
  },

  milestoneApproved(
    to: { name: string; email: string },
    project: { title: string; reference: string; milestone: string; portalUrl: string },
  ) {
    const subject = `Approved: ${project.milestone} — ${project.title}`;
    const html = shell(
      "You approved a step",
      `
      <p>Hi ${escapeHtml(to.name)},</p>
      <p>You approved <strong>${escapeHtml(project.milestone)}</strong> on
      <strong>${escapeHtml(project.title)}</strong> (${escapeHtml(project.reference)}).</p>
      <p>We will start the next step and post an update in your portal.</p>
      <p style="margin:20px 0">
        <a href="${project.portalUrl}" style="display:inline-block;background:#1B7A45;color:#fff;text-decoration:none;padding:12px 22px;font-weight:700">View your project</a>
      </p>`,
    );
    return { subject, html };
  },

  newProject(
    to: { name: string; email: string },
    project: { title: string; reference: string; amount?: number | null; portalUrl: string },
  ) {
    const subject = `Project opened: ${project.title}`;
    const html = shell(
      "A new project is open",
      `
      ${row("Project", project.title)}
      ${row("Reference", project.reference)}
      ${project.amount ? row("Value", `₹${project.amount.toLocaleString("en-IN")}`) : ""}
      <p style="margin:20px 0">
        <a href="${project.portalUrl}" style="display:inline-block;background:#1B7A45;color:#fff;text-decoration:none;padding:12px 22px;font-weight:700">View your project</a>
      </p>`,
    );
    return { subject, html };
  },
};