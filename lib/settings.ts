import "server-only";

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

/**
 * Site settings come from the database so they can be edited at
 * /admin/settings without a redeploy. The values in lib/site-config.ts
 * remain the fallback — if the table is missing or the query fails, the
 * site still renders exactly as before.
 */

export type SettingGroup =
  | "contact"
  | "brand"
  | "social"
  | "payments"
  | "stats"
  | "enquiry"
  | "prices"
  | "plans"
  | "services"
  | "general";

export interface SettingRow {
  key: string;
  value: string | null;
  group_name: SettingGroup;
  label: string | null;
  hint: string | null;
  sort_order: number;
  updated_at: string;
}

export type SettingsMap = Record<string, string>;

const EMPTY: SettingsMap = {};

/** Every setting, as key → value. Empty when unavailable. */
export async function fetchSettings(): Promise<SettingsMap> {
  if (!isSupabaseConfigured) return EMPTY;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("key,value")
      .order("group_name")
      .order("sort_order");

    if (error || !data) return EMPTY;

    const map: SettingsMap = {};
    for (const row of data as { key: string; value: string | null }[]) {
      if (row.value !== null && row.value !== "") map[row.key] = row.value;
    }
    return map;
  } catch {
    return EMPTY;
  }
}

/** Settings rows with their metadata, for rendering the admin form. */
export async function fetchSettingRows(): Promise<SettingRow[]> {
  if (!isSupabaseConfigured) return [];

  const supabase = await createClient();
  const { data } = await supabase
    .from("site_settings")
    .select("*")
    .order("group_name")
    .order("sort_order");

  return (data ?? []) as SettingRow[];
}

/** Read a single setting, falling back to the code default. */
export function setting(
  s: SettingsMap,
  key: string,
  fallback: string,
): string {
  const v = s[key];
  return v === undefined || v === "" ? fallback : v;
}

export function settingBool(s: SettingsMap, key: string, fallback: boolean): boolean {
  const v = s[key];
  if (v === undefined) return fallback;
  return v === "true" || v === "1" || v === "yes";
}

/** Split the pipe-delimited feature lists used for plans and testimonials. */
export function settingList(value: string | undefined): string[] {
  if (!value) return [];
  return value
    .split("|")
    .map((v) => v.trim())
    .filter(Boolean);
}

export const groupLabels: Record<SettingGroup, string> = {
  contact: "Contact details",
  brand: "Brand & tagline",
  social: "Social links",
  payments: "Payments",
  stats: "Numbers on the homepage",
  enquiry: "Enquiry form",
  prices: "One-time pricing",
  plans: "Monthly retainer plans",
  services: "Service prices",
  general: "Other",
};

export const groupOrder: SettingGroup[] = [
  "contact",
  "brand",
  "social",
  "payments",
  "enquiry",
  "stats",
  "prices",
  "plans",
  "services",
  "general",
];

/**
 * A view of the site assembled from settings + code defaults. Components
 * read from this instead of importing site-config directly, so a value
 * changed in /admin/settings shows up on the next page load.
 */
export async function getSiteView() {
  const s = await fetchSettings();

  const phone = setting(s, "site.phone", "+91 00000 00000");
  const digits = setting(s, "site.phone_digits", "910000000000");
  const socials = [
    { label: "Instagram", href: setting(s, "social.instagram", "") },
    { label: "Facebook", href: setting(s, "social.facebook", "") },
    { label: "WhatsApp", href: `https://wa.me/${digits}` },
    { label: "YouTube", href: setting(s, "social.youtube", "") },
  ];

  return {
    raw: s,
    name: setting(s, "brand.name", "JTSA Media House"),
    tagline: setting(s, "brand.tagline", "Aaj ka Prachar, Kal ki Pehchaan"),
    promise: setting(s, "brand.promise", "Naam Bada Kar Denge"),
    owner: setting(s, "brand.owner", "Jharkhand Talent Search Association"),
    ownerShort: setting(s, "brand.short", "JTSA"),
    udyam: setting(s, "site.udyam", "UDYAM-JH-04-0091747"),
    city: setting(s, "site.city", "Dhanbad"),
    state: setting(s, "site.state", "Jharkhand"),
    phone,
    phoneDigits: digits,
    email: setting(s, "site.email", "hello@jtsamediahouse.in"),
    upiId: setting(s, "site.upi", "jtsamedia@upi"),
    socials: socials.filter((x) => x.href !== ""),
    paymentsEnabled: settingBool(s, "payments.enabled", false),
    paymentNote: setting(
      s,
      "payments.note",
      "Pay by UPI or at your school office. Receipt issued either way.",
    ),
    enquiryEnabled: settingBool(s, "enquiry.enabled", true),
    enquiryWhatsapp: settingBool(s, "enquiry.whatsapp", true),
    replyNote: setting(
      s,
      "enquiry.reply_note",
      "We reply within 24 hours, usually much sooner.",
    ),
    sampleOffer: setting(s, "enquiry.sample_offer", "Get a Free Design Sample"),
    stats: [
      { value: setting(s, "stats.0", "50+"), label: "Partner Schools" },
      { value: setting(s, "stats.1", "1,000+"), label: "Students Reached" },
      { value: setting(s, "stats.2", "500+"), label: "Creatives Shipped" },
      { value: setting(s, "stats.3", "48h"), label: "Typical Turnaround" },
    ],
  };
}

export type SiteView = Awaited<ReturnType<typeof getSiteView>>;