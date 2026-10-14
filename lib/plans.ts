import { calcBases as defaultCalcBases, plans as defaultPlans } from "@/lib/site-config";
import { setting, settingList, type SettingsMap } from "@/lib/settings";
import {
  PLAN_REGISTRY_KEY,
  type CalcBaseView,
  type PlanView,
} from "@/lib/plan-keys";

/**
 * The package catalogue, resolved from the database. Server-only.
 *
 * Until this existed, the tier list was a hardcoded array in site-config and
 * every other module iterated that array directly — so adding or removing a
 * package meant a code edit, a migration run and a deploy.
 *
 * plans.registry holds the active tier ids in display order, pipe-separated,
 * matching the list convention already used for features and bullet points.
 * Everything else — the pricing grid, the booking dropdown, the ROI
 * calculator and the payment line items — resolves through here, so the
 * registry is the single place that decides what exists.
 *
 * The registry is authoritative on purpose: a tier removed here stays removed
 * even if its rows are still in site_settings. Removing a package in
 * /admin/settings also deletes its rows, so this is belt and braces.
 *
 * The key names and shapes live in lib/plan-keys.ts so the browser can share
 * them without pulling `server-only` into the client bundle.
 */

export {
  PLAN_REGISTRY_KEY,
  planSettingKeys,
  slugifyPlanId,
} from "@/lib/plan-keys";
export type { CalcBaseView, PlanView } from "@/lib/plan-keys";

/** "nano-starter" -> "Nano Starter", used when a tier has no name saved yet. */
function humanise(id: string): string {
  return id
    .split("-")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

const num = (v: string | undefined, fallback: number): number => {
  const n = Number(String(v ?? "").replace(/[^0-9.\-]/g, ""));
  return Number.isFinite(n) && n > 0 ? n : fallback;
};

/**
 * Active tier ids in display order.
 *
 * An absent registry row falls back to the code defaults, which is the case
 * until the migration has been run — so the site is never empty on day one.
 *
 * A registry row that exists but is empty means "no packages", and is
 * respected. Treating that the same as absent would silently resurrect all six
 * default tiers the moment the last package was deleted.
 */
export function planIds(s: SettingsMap): string[] {
  const raw = s[PLAN_REGISTRY_KEY];
  if (raw === undefined) return defaultPlans.map((p) => p.id);
  return settingList(raw);
}

export function planView(s: SettingsMap, id: string): PlanView {
  const d = defaultPlans.find((p) => p.id === id);
  const name = setting(s, `plan.${id}.name`, d?.name ?? humanise(id));
  const price = setting(s, `plan.${id}.price`, d?.price ?? "");

  const features = settingList(s[`plan.${id}.features`]);
  const physical = settingList(s[`plan.${id}.physical`]);

  return {
    id,
    name,
    cta: setting(s, `plan.${id}.cta`, d?.cta ?? name.split(" ").slice(-1)[0] ?? ""),
    price,
    tagline: setting(s, `plan.${id}.tagline`, d?.tagline ?? ""),
    features: features.length ? features : (d?.features ?? []),
    physical: physical.length ? physical : (d?.physical ?? []),
    badge: setting(s, `plan.${id}.badge`, d?.badge ?? ""),
    highlight: (s[`plan.${id}.highlight`] ?? (d?.highlight ? "true" : "")) === "true",
    period: setting(s, `plan.${id}.period`, d?.period ?? "per campaign"),
    payKey: `plan.${id}`,
    payLabel: `Pay ₹${price} online`,
  };
}

export function plansView(s: SettingsMap): PlanView[] {
  return planIds(s).map((id) => planView(s, id));
}

/* ─── ROI calculator ──────────────────────────────────────────────────
   The calculator keeps its own numbers per tier (views, lead band, score).
   They resolve against the same registry so a new package immediately has a
   calculator entry, scaled from its price until someone edits the figures. */

/** Gold is the reference tier; everything else scales off its price. */
const CALC_REFERENCE = { price: 24999, views: 80000, flyers: 1000 };

export function calcBaseView(s: SettingsMap, id: string): CalcBaseView {
  const d = defaultCalcBases.find((b) => b.id === id);
  const plan = planView(s, id);

  const price = num(plan.price, CALC_REFERENCE.price);
  const ratio = price / CALC_REFERENCE.price;
  const guessViews = Math.round((CALC_REFERENCE.views * ratio) / 500) * 500;
  const guessLeads = Math.max(5, Math.round((100 * ratio) / 5) * 5);
  const guessFlyers = Math.max(0, Math.round((CALC_REFERENCE.flyers * ratio) / 50) * 50);

  // Flyers is the one figure allowed to be genuinely zero — the digital-only
  // entry tiers have no ground drops, so an absent row must read as 0 rather
  // than fall through to the price-scaled guess.
  const rawFlyers = s[`calc.${id}.flyers`];
  const flyers =
    rawFlyers === undefined
      ? (d?.flyers ?? guessFlyers)
      : Math.max(0, Number(String(rawFlyers).replace(/[^0-9]/g, "")) || 0);

  return {
    id,
    label: setting(s, `calc.${id}.label`, d?.label ?? plan.name),
    views: num(s[`calc.${id}.views`], d?.views ?? guessViews),
    flyers,
    creators: setting(s, `calc.${id}.creators`, d?.creators ?? (plan.cta || "Custom")),
    leadsLow: num(s[`calc.${id}.leads_low`], d?.leadsLow ?? guessLeads),
    leadsHigh: num(s[`calc.${id}.leads_high`], d?.leadsHigh ?? guessLeads * 3),
    score: num(s[`calc.${id}.score`], d?.score ?? 6),
    viewRate: num(s[`calc.${id}.view_rate`], d?.viewRate ?? 1),
    scoreStep: num(s[`calc.${id}.score_step`], d?.scoreStep ?? 0.5),
  };
}

export function calcBasesView(s: SettingsMap): CalcBaseView[] {
  return planIds(s).map((id) => calcBaseView(s, id));
}