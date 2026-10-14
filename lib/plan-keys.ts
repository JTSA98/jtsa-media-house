/**
 * Pure plan helpers, safe to import from client components.
 *
 * lib/plans.ts does the database resolution and is server-only. The admin
 * package manager needs the same key names and shapes in the browser, and
 * importing them from the server module drags `server-only` into the client
 * bundle, which fails the build. So the vocabulary lives here and plans.ts
 * builds on it.
 */

export const PLAN_REGISTRY_KEY = "plans.registry";

/** Lowercase, dash-separated, stable across renames of the display name. */
export function slugifyPlanId(name: string): string {
  const s = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  return s || "tier";
}

export interface PlanView {
  id: string;
  name: string;
  /** Button wording; defaults to the last word of the name. */
  cta: string;
  price: string;
  tagline: string;
  features: string[];
  physical: string[];
  badge: string;
  /** Rendered as the emphasised card. At most one at a time. */
  highlight: boolean;
  period: string;
  payKey: string;
  payLabel: string;
}

export interface CalcBaseView {
  id: string;
  label: string;
  views: number;
  flyers: number;
  creators: string;
  leadsLow: number;
  leadsHigh: number;
  score: number;
  viewRate: number;
  scoreStep: number;
}

/** Every settings row belonging to a tier, used when deleting one. */
export function planSettingKeys(id: string): string[] {
  const planFields = [
    "name",
    "cta",
    "price",
    "tagline",
    "features",
    "physical",
    "badge",
    "highlight",
    "period",
  ];
  const calcFields = [
    "label",
    "views",
    "flyers",
    "creators",
    "leads_low",
    "leads_high",
    "score",
    "view_rate",
    "score_step",
  ];
  return [
    ...planFields.map((f) => `plan.${id}.${f}`),
    ...calcFields.map((f) => `calc.${id}.${f}`),
  ];
}