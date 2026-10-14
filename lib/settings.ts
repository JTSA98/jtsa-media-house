import "server-only";

import { cache } from "react";

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { normBand } from "@/lib/utils";
import { PLAN_REGISTRY_KEY } from "@/lib/plan-keys";
import {
  budgetBands,
  budgetMids,
  comparisonCards,
  festivePhases,
  intensityLevels,
  launchPerks,
  pillars,
  recallPrinciple,
  sectors,
} from "@/lib/site-config";

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
  | "budgets"
  | "hero"
  | "compare"
  | "pillars"
  | "sectors"
  | "festive"
  | "calculator"
  | "notify"
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
export const fetchSettings: () => Promise<SettingsMap> = cache(async (): Promise<SettingsMap> => {
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
      if (row.value === null) continue;
      /* Empty values are dropped so `setting()` falls through to its code
         default. The package registry is the exception: an empty value there
         means "no packages exist", which is a real state the admin can reach
         by deleting the last one. Dropping it would silently bring all six
         default tiers back. */
      if (row.value !== "" || row.key === PLAN_REGISTRY_KEY) map[row.key] = row.value;
    }
    return map;
  } catch {
    return EMPTY;
  }
});

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

export interface BudgetOption {
  label: string;
  mid: number;
}

/**
 * Registration budget bands + their pipeline values, from site_settings
 * (budget.bands + budget.mids, parallel pipe lists). Falls back to the
 * code defaults when the database is unreachable — never hardcoded at
 * the call site.
 */
export function budgetOptions(s: SettingsMap): BudgetOption[] {
  const labels = settingList(s["budget.bands"]);
  const mids = settingList(s["budget.mids"]).map((v) => Number(v));
  const L = labels.length ? labels : budgetBands;
  return L.map((label, i) => ({
    label,
    mid:
      Number.isFinite(mids[i]) && mids[i] >= 0
        ? mids[i]
        : (budgetMids[i] ?? 0),
  }));
}

/** Band label → pipeline rupees, dash-tolerant on both sides. */
export function budgetMidMap(s: SettingsMap): Record<string, number> {
  const map: Record<string, number> = {};
  for (const o of budgetOptions(s)) map[normBand(o.label)] = o.mid;
  return map;
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
  budgets: "Budget bands",
  hero: "Hero section",
  compare: "Why combo",
  pillars: "360 Architecture",
  sectors: "Sector playbooks",
  festive: "Festive campaign",
  calculator: "ROI calculator",
  notify: "Lead notifications",
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
  "budgets",
  "hero",
  "compare",
  "pillars",
  "sectors",
  "festive",
  "calculator",
  "notify",
  "general",
];

/** India country code, prepended to wa.me links only — never to the number
 *  shown on screen, which stays a plain local 10-digit number. */
export const toWhatsappDigits = (local: string | null | undefined): string => {
  const d = (local ?? "").replace(/\D/g, "");
  if (!d) return "";
  return d.length === 10 ? `91${d}` : d;
};

/**
 * A view of the site assembled from settings + code defaults. Components
 * read from this instead of importing site-config directly, so a value
 * changed in /admin/settings shows up on the next page load.
 */
export async function getSiteView() {
  const s = await fetchSettings();

  const rawPhone = setting(s, "site.phone", "9304336590");
  const rawDigits = setting(s, "site.phone_digits", "9304336590");
  /* Both are concatenated into wa.me and tel: URLs. A "+", a space or a 91
     prefix typed into the admin panel would silently produce a dead link, so
     keep digits only here rather than trusting the stored string. */
  const digits = rawDigits.replace(/\D/g, "") || "9304336590";
  const phone = rawPhone.replace(/\D/g, "") || digits;
  /* WhatsApp reads the number after wa.me/ as a FULL international number. A
     bare 10-digit value opens the country picker and never reaches the
     contact, so +91 goes in here — link only. phoneDigits stays local
     because that is what tel: and the visible number want. */
  const whatsappDigits = toWhatsappDigits(digits);
  const socials = [
    { label: "Instagram", href: setting(s, "social.instagram", "") },
    { label: "Facebook", href: setting(s, "social.facebook", "") },
    { label: "WhatsApp", href: `https://wa.me/${whatsappDigits}` },
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
    whatsappDigits,
    email: setting(s, "site.email", "hello@jtsamediahouse.in"),
    upiId: setting(s, "site.upi", "jtsamedia@upi"),
    socials: socials.filter((x) => x.href !== ""),
    paymentsEnabled: settingBool(s, "payments.enabled", false),
    paymentNote: setting(
      s,
      "payments.note",
      "Pay by UPI or at your school office. Receipt issued either way.",
    ),
    /* Client-login links (nav + footer). Hidden for now — the portal
       routes keep working for anyone with the URL; this only controls
       whether visitors are pointed at them. Flip portal.client_login
       to true when the influencer login launches. */
    clientLoginVisible: settingBool(s, "portal.client_login", false),
    /* Standalone annual membership pass + offline add-on rates. Both are
       priced in the admin panel like everything else. */
    vipPass: {
      price: setting(s, "vip.pass_price", "999"),
      period: "per year",
      benefit: setting(
        s,
        "vip.pass_benefit",
        "Flat 20% off every individual combo and offline order for 365 days",
      ),
    },
    offlineRates: {
      leaflets: setting(s, "offline.leaflets.rate", "₹300 – ₹450"),
      newspaper: setting(s, "offline.newspaper.rate", "₹250 – ₹350"),
      flex: setting(s, "offline.flex.rate", "₹12 – ₹18"),
      auto: setting(s, "offline.auto.rate", "₹150 – ₹250"),
      hoardings: setting(s, "offline.hoardings.rate", "₹450 – ₹800"),
    },
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