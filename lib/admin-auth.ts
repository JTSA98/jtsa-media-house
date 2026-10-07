/**
 * Who is allowed into /admin.
 *
 * Two independent gates must both pass:
 *
 *   1. the login's email appears in ADMIN_EMAILS (this file, env var), and
 *   2. the database profile has is_admin = true
 *
 * The env list is the one you control. The database flag is set by SQL that
 * only you run — a client cannot change it (see the column-level grant in
 * supabase/schema.sql), so nobody can add themselves.
 */

/** Allow-list of admin emails. Never ship a wildcard. */
export const adminEmails = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export function isAllowlistedEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return adminEmails.includes(email.trim().toLowerCase());
}

/** True when an allow-list is actually configured — surfaced in the UI. */
export const hasAdminAllowList = adminEmails.length > 0;