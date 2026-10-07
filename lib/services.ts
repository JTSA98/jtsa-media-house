import "server-only";

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { Service } from "@/types/database";

/** The service catalogue, for pickers in the admin panel. */
export async function fetchServices(): Promise<Service[]> {
  if (!isSupabaseConfigured) return [];

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("services")
      .select("*")
      .order("sort_order");

    return (data ?? []) as Service[];
  } catch {
    return [];
  }
}