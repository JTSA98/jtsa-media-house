import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { sendMail, templates, emailConfigured } from "@/lib/email";
import { fetchSettings, settingBool } from "@/lib/settings";

export const runtime = "nodejs";

/**
 * Client approved a milestone → email the agency.
 *
 * Called by the portal after a successful status update. The client already
 * has a session, so we re-check it here rather than trusting the request body.
 * Failures return 200 with ok:false — a client approving work must never be
 * shown an error because mail is down.
 */
export async function POST(request: Request) {
  if (!isSupabaseConfigured) {
    return NextResponse.json({ ok: false, skipped: true });
  }

  try {
    const { projectId, milestoneId, title } = (await request.json()) as {
      projectId?: string;
      milestoneId?: string;
      title?: string;
    };

    if (!projectId) {
      return NextResponse.json({ ok: false, error: "missing project" });
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ ok: false, error: "not signed in" }, { status: 401 });
    }

    // The milestone must belong to a project this client owns.
    const { data: rows } = await supabase
      .from("project_milestones")
      .select("id,title,projects!inner(id,title,reference,profiles!inner(id))")
      .eq("id", milestoneId ?? "")
      .eq("project_id", projectId);

    const row = (rows ?? [])[0] as unknown as
      | { title: string; projects: { id: string; title: string; reference: string } }
      | undefined;

    if (!row) {
      return NextResponse.json({ ok: false, error: "not your milestone" }, { status: 403 });
    }

    if (!emailConfigured()) {
      return NextResponse.json({ ok: false, skipped: true });
    }

    const settings = await fetchSettings();
    if (!settingBool(settings, "notify.milestone_approved", true)) {
      return NextResponse.json({ ok: true, skipped: true });
    }

    const to = process.env.ADMIN_NOTIFY_EMAIL ?? process.env.BREVO_SENDER_EMAIL;
    if (!to) {
      return NextResponse.json({ ok: false, skipped: true });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name,email")
      .eq("id", user.id)
      .single();

    const site = process.env.NEXT_PUBLIC_SITE_URL ?? "";
    const { subject, html } = templates.milestoneApproved(
      {
        name: (profile as { full_name?: string } | null)?.full_name ?? "A client",
        email: user.email ?? "",
      },
      {
        title: row.projects.title,
        reference: row.projects.reference,
        milestone: row.title,
        portalUrl: `${site}/portal/${projectId}`,
      },
    );

    const result = await sendMail({
      to,
      subject,
      html,
      kind: "milestone_approved",
    });

    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: message });
  }
}