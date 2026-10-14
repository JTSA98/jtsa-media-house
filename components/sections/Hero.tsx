import { ArrowRight, Calculator } from "lucide-react";

import type { SiteView } from "@/lib/settings";

export type HeroStat = { value: string; label: string };
export type HeroView = {
  badge: string;
  titleTop: string;
  titleGradient: string;
  body: string;
  stats: HeroStat[];
};

const FALLBACK_STATS: HeroStat[] = [
  { value: "360°", label: "Regional Funnel" },
  { value: "200K+", label: "Views / Campaign" },
  { value: "5-7 Touch", label: "Recall Principle" },
  { value: "250%", label: "Avg Lead Surge" },
];

/* Static class strings — Tailwind only generates what it can see in the
   source, so these cannot be built by interpolation. */
const ACCENTS = [
  { text: "text-indigo", edge: "border-t-indigo/30" },
  { text: "text-violet", edge: "border-t-violet/30" },
  { text: "text-amber-400", edge: "border-t-amber-400/30" },
  { text: "text-emerald", edge: "border-t-emerald/30" },
] as const;

export function Hero({ site, view }: { site: SiteView; view: HeroView }) {
  const stats = view.stats.length === 4 ? view.stats : FALLBACK_STATS;

  return (
    <section
      id="top"
      className="relative flex min-h-[90vh] items-center justify-center overflow-hidden pt-28 pb-20"
    >
      <div className="wrap relative z-10 text-center">
        {/* festive badge */}
        <div className="glass-card mb-8 inline-flex animate-pulse items-center gap-2 rounded-full border border-amber-500/30 px-4 py-2">
          <span className="size-2.5 rounded-full bg-amber-400" />
          <span className="text-xs font-semibold tracking-wider text-amber-300 uppercase sm:text-sm">
            {view.badge}
          </span>
        </div>

        {/* headline */}
        <h1 className="mx-auto mb-6 max-w-5xl text-[clamp(30px,6vw,68px)] leading-[1.15] font-extrabold tracking-tight text-white">
          {view.titleTop}
          <br className="hidden sm:block" />
          <span className="text-gradient-festive">{view.titleGradient}</span>
        </h1>

        <p className="mx-auto mb-10 max-w-3xl text-[16px] leading-relaxed font-normal text-ink-2 sm:text-xl">
          {view.body}
        </p>

        {/* dual CTA */}
        <div className="mb-16 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="#packages"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-festive-gradient px-8 py-4 text-sm font-bold tracking-wider text-white uppercase shadow-xl shadow-violet-600/25 transition-all hover:scale-105 sm:w-auto"
          >
            Explore Creator Bundles
            <ArrowRight size={15} />
          </a>
          <a
            href="#calculator"
            className="glass-card flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 px-8 py-4 text-sm font-bold tracking-wider text-ink-2 uppercase transition-all hover:bg-white/10 sm:w-auto"
          >
            <Calculator size={15} className="text-amber-400" />
            Calculate Campaign ROI
          </a>
        </div>

        {/* trust stats */}
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((s, i) => {
            const a = ACCENTS[i] ?? ACCENTS[0];
            return (
              <div
                key={s.label}
                data-reveal
                className={`glass-card ${a.edge} rounded-2xl border-t p-4 text-center`}
              >
                <div className={`mb-1 text-2xl font-extrabold sm:text-3xl ${a.text}`}>
                  {s.value}
                </div>
                <div className="text-xs font-medium tracking-wider text-ink-3 uppercase">
                  {s.label}
                </div>
              </div>
            );
          })}
        </div>

        <p className="mt-8 text-xs text-ink-3">
          Serving {site.city}, {site.state} — {site.ownerShort} registered,{" "}
          {site.udyam}
        </p>
      </div>
    </section>
  );
}