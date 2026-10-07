import { createBrowserClient } from "@supabase/ssr";

import { supabaseAnonKey, supabaseUrl } from "./config";

/** Browser-side Supabase client. Safe to call in client components. */
export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}