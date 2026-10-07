import "server-only";

import { createClient } from "@supabase/supabase-js";

/**
 * Admin client. Bypasses row level security — server-only, never import this
 * from a client component. Use it for work a client must not be able to forge
 * themselves, e.g. writing progress updates as the agency.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local",
    );
  }

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}