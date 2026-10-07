"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { isAllowlistedEmail } from "@/lib/admin-auth";

export type AdminLoginState = {
  error: string | null;
  /** the email is not on the admin list — shown without leaking which ones are */
  notAllowed?: boolean;
};

/**
 * Staff-only sign in. Refuses before touching Supabase if the email is not
 * on the ADMIN_EMAILS list, so a client account can never even attempt it.
 */
export async function adminSignIn(
  _prev: AdminLoginState,
  formData: FormData,
): Promise<AdminLoginState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Enter both your email and password." };
  }

  if (!isSupabaseConfigured) {
    return { error: "Supabase is not configured on this server." };
  }

  // Gate 1 — the allow-list you control in .env.local
  if (!isAllowlistedEmail(email)) {
    return {
      error: "That address is not authorised for the staff area.",
      notAllowed: true,
    };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    // Deliberately vague about which half was wrong.
    return { error: "Email or password is incorrect." };
  }

  // Gate 2 — the database flag. If someone is on the list but not promoted
  // in the database, do not let them in.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Could not confirm your session. Try again." };

  const { data: me } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!(me as { is_admin?: boolean } | null)?.is_admin) {
    await supabase.auth.signOut();
    return {
      error:
        "This account has not been granted staff access yet. Ask the site owner to promote it.",
      notAllowed: true,
    };
  }

  redirect("/admin");
}