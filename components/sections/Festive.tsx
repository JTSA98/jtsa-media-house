import type { CSSProperties } from "react";
import { Check, Sparkles } from "lucide-react";

import type { PhaseView, PerkView } from "@/lib/content";

const PHASE_EDGES = [
  "border-t-amber-400",
  "border-t-violet",
  "border-t-indigo",
] as const;

const PHASE_LABELS = ["text-amber-400", "text-violet", "text-indigo"] as const;

export function Festive({
  phases,
  perks,
  badge,
  heading,
  body,
  perkHeading,
  perkIntro,
}: {
  phases: PhaseView[];
  perks: PerkView[];
  badge: string;
  heading: string;
  body: string;
  perkHeading: string;
  perkIntro: string;
}) {
  return (
    <section id="festive" className="relative border-t border-white/5 bg-kraft/50 py-20">
      <div className="wrap">
        <div className="mx-auto mb-16 max-w-3xl text-center" data-reveal>
          <span className="mb-3 inline-block rounded-full border border-amber-500/30 bg-amber-500/20 px-3 py-1 text-xs font-extrabold tracking-widest text-amber-300 uppercase">
            {badge}
          </span>
          <h2 className="text-2xl font-extrabold text-white sm:text-4xl">
            {heading}
          </h2>
          <p className="mt-4 text-sm text-ink-3 sm:text-base">{body}</p>
        </div>

        {/* rollout timeline */}
        <div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          {phases.map((p, i) => (
            <div
              key={p.id}
              data-reveal
              style={{ "--d": `${i * 90}ms` } as CSSProperties}
              className={`glass-card glass-card-hover rounded-2xl border-t-2 p-6 ${
                PHASE_EDGES[i] ?? PHASE_EDGES[0]
              }`}
            >
              <div
                className={`mb-2 text-xs font-bold tracking-widest uppercase ${
                  PHASE_LABELS[i] ?? PHASE_LABELS[0]
                }`}
              >
                {p.label}
              </div>
              <h3 className="mb-3 text-lg font-bold text-white">{p.title}</h3>
              <ul className="space-y-2 text-xs text-ink-2">
                {p.points.map((pt) => (
                  <li key={pt} className="flex items-start gap-2">
                    <Check
                      size={13}
                      className={`mt-0.5 shrink-0 ${
                        PHASE_LABELS[i] ?? PHASE_LABELS[0]
                      }`}
                    />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* launch special */}
        <div
          data-reveal
          className="glass-card mx-auto max-w-4xl rounded-3xl border border-amber-500/40 bg-gradient-to-r from-amber-500/10 via-kraft-2 to-indigo-950/30 p-8 text-center"
        >
          <h3 className="mb-2 text-2xl font-black tracking-wide text-amber-400 uppercase">
            {perkHeading}
          </h3>
          <p className="mb-6 flex items-center justify-center gap-2 text-sm text-ink-2">
            <Sparkles size={15} className="text-amber-400" />
            {perkIntro}
          </p>

          <div className="grid grid-cols-1 gap-4 text-left sm:grid-cols-3">
            {perks.map((p) => (
              <div
                key={p.id}
                className="rounded-xl border border-white/5 bg-kraft/60 p-4"
              >
                <div className="mb-1 text-lg font-bold text-amber-400">
                  {p.headline}
                </div>
                <div className="text-xs text-ink-3">{p.body}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}