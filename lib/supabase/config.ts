// ─── Supabase environment ─────────────────────────────────────────────
// The site must build and render even when Supabase is not configured,
// so `isSupabaseConfigured` gates the portal rather than crashing.

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const isSupabaseConfigured =
  Boolean(supabaseUrl) && Boolean(supabaseAnonKey);

export const supabaseConfigProblem = isSupabaseConfigured
  ? null
  : "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local, then run supabase/schema.sql.";