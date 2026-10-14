import "server-only";

import {
  comparisonCards,
  festivePhases,
  intensityLevels,
  launchPerks,
  pillars,
  recallPrinciple,
  sectors,
} from "@/lib/site-config";
import { setting, settingList, type SettingsMap } from "@/lib/settings";

/**
 * Resolvers for the launch-site content.
 *
 * Each list in lib/site-config is the code default; every field can be
 * overridden from /admin/settings under `<group>.<id>.<field>`. List
 * fields (bullet arrays) are stored pipe-separated.
 *
 * Kept in its own module so lib/settings.ts does not have to import the
 * whole content model, and so this can grow without bloating the site
 * view builder.
 */

export type CmpCardView = (typeof comparisonCards)[number];
export type PillarView = (typeof pillars)[number];
export type SectorView = (typeof sectors)[number];
export type PhaseView = (typeof festivePhases)[number];
export type PerkView = (typeof launchPerks)[number];

export function comparisonCardsView(s: SettingsMap): CmpCardView[] {
  return comparisonCards.map((c) => ({
    ...c,
    label: setting(s, `compare.${c.id}.label`, c.label),
    title: setting(s, `compare.${c.id}.title`, c.title),
    body: setting(s, `compare.${c.id}.body`, c.body),
    impact: setting(s, `compare.${c.id}.impact`, c.impact),
  }));
}

export function recallPrincipleView(s: SettingsMap) {
  return {
    title: setting(s, "recall.title", recallPrinciple.title),
    body: setting(s, "recall.body", recallPrinciple.body),
  };
}

export function pillarsView(s: SettingsMap): PillarView[] {
  return pillars.map((p) => {
    const pts = settingList(s[`pillars.${p.id}.points`]);
    return {
      ...p,
      label: setting(s, `pillars.${p.id}.label`, p.label),
      title: setting(s, `pillars.${p.id}.title`, p.title),
      body: setting(s, `pillars.${p.id}.body`, p.body),
      points: pts.length ? pts : p.points,
    };
  });
}

export function sectorsView(s: SettingsMap): SectorView[] {
  return sectors.map((x) => {
    const digital = settingList(s[`sectors.${x.id}.digital`]);
    const physical = settingList(s[`sectors.${x.id}.physical`]);
    return {
      ...x,
      tab: setting(s, `sectors.${x.id}.tab`, x.tab),
      title: setting(s, `sectors.${x.id}.title`, x.title),
      subtitle: setting(s, `sectors.${x.id}.subtitle`, x.subtitle),
      impact: setting(s, `sectors.${x.id}.impact`, x.impact),
      digital: digital.length ? digital : x.digital,
      physical: physical.length ? physical : x.physical,
      recommended: {
        digital: setting(
          s,
          `sectors.${x.id}.rec_digital`,
          x.recommended.digital,
        ),
        ground: setting(
          s,
          `sectors.${x.id}.rec_ground`,
          x.recommended.ground,
        ),
        locations: setting(
          s,
          `sectors.${x.id}.rec_locations`,
          x.recommended.locations,
        ),
      },
    };
  });
}

export function festivePhasesView(s: SettingsMap): PhaseView[] {
  return festivePhases.map((p) => {
    const pts = settingList(s[`festive.${p.id}.points`]);
    return {
      ...p,
      label: setting(s, `festive.${p.id}.label`, p.label),
      title: setting(s, `festive.${p.id}.title`, p.title),
      points: pts.length ? pts : p.points,
    };
  });
}

export function launchPerksView(s: SettingsMap): PerkView[] {
  return launchPerks.map((p) => ({
    ...p,
    headline: setting(s, `perks.${p.id}.headline`, p.headline),
    body: setting(s, `perks.${p.id}.body`, p.body),
  }));
}

function num(s: SettingsMap, key: string, fallback: number): number {
  const v = Number(s[key]);
  return Number.isFinite(v) && v >= 0 ? v : fallback;
}

/* calcBasesView moved to lib/plans.ts — the calculator's tier list now comes
   from plans.registry, so a package added in /admin/settings gets a
   calculator entry automatically. Re-exported here so existing imports of
   "@/lib/content" keep working. */
export { calcBasesView, type CalcBaseView } from "@/lib/plans";

export function intensityView(s: SettingsMap): string[] {
  const list = settingList(s["calc.intensity_labels"]);
  return list.length === intensityLevels.length ? list : intensityLevels;
}