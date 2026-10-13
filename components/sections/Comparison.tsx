import type { CSSProperties } from "react";
import { ArrowRight, Ban, MapPin, Megaphone, UserX } from "lucide-react";

import type {
  CmpCardView,
  PillarView,
} from "@/lib/content";

/* Static icon map — Tailwind cannot extract interpolated class names. */
const CMP_ICONS = [UserX, Ban, Megaphone, MapPin] as const;

export function WhyCombo({
  cards,
  recall,
  heading,
  subheading,
  body,
}: {
  cards: CmpCardView[];
  recall: { title: string; body: string };
  heading: string;
  subheading: string;
  body: string;
}) {
  return (
    <section id="why-combo" className="relative border-t border-white/5 bg-kraft/50 py-20">
      <div className="wrap">
        <div className="mx-auto mb-16 max-w-3xl text-center" data-reveal>
          <p className="mb-3 text-xs font-bold tracking-widest text-amber-400 uppercase">
            Market problem diagnostic
          </p>
          <h2 className="text-2xl font-extrabold text-white sm:text-4xl">
            {heading}
          </h2>
          <p className="mt-4 text-sm text-ink-3 sm:text-base">{body}</p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {cards.map((c, i) => {
            const Icon = CMP_ICONS[i] ?? Megaphone;
            return (
              <article
                key={c.id}
                data-reveal
                style={{ "--d": `${i * 70}ms` } as CSSProperties}
                className="glass-card glass-card-hover group relative overflow-hidden rounded-2xl p-6"
              >
                <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-red/10 text-xl text-red">
                  <Icon size={20} />
                </div>
                <span className="text-xs font-semibold tracking-wider text-red uppercase">
                  {c.label}
                </span>
                <h3 className="mt-1 mb-2 text-lg font-bold text-white">{c.title}</h3>
                <p className="mb-4 text-xs text-ink-3">{c.body}</p>
                <p className="rounded-xl border border-red/20 bg-red/5 p-3 text-xs text-red-300">
                  <b>Impact:</b> {c.impact}
                </p>
              </article>
            );
          })}
        </div>

        {/* recall principle callout */}
        <div
          data-reveal
          className="glass-card mt-12 flex flex-col items-center justify-between gap-6 rounded-3xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-violet/10 to-indigo/10 p-6 sm:p-8 md:flex-row"
        >
          <div className="flex items-center gap-4">
            <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-amber-500/20 text-3xl text-amber-400">
              <ArrowRight size={26} />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white sm:text-xl">
                {recall.title}
              </h3>
              <p className="mt-1 text-xs text-ink-2 sm:text-sm">{recall.body}</p>
            </div>
          </div>
          <a
            href="#solution"
            className="shrink-0 rounded-xl bg-amber-500 px-6 py-3 text-xs font-extrabold tracking-wider text-kraft uppercase transition-all hover:bg-amber-400"
          >
            See the solution
          </a>
        </div>
      </div>
    </section>
  );
}

const PILLAR_EDGES = [
  "border-t-indigo",
  "border-t-amber-400",
  "border-t-violet",
] as const;

const PILLAR_ICONS = [Megaphone, MapPin, ArrowRight] as const;

export function Architecture({
  pillars,
  heading,
  subheading,
  body,
}: {
  pillars: PillarView[];
  heading: string;
  subheading: string;
  body: string;
}) {
  return (
    <section id="solution" className="relative py-20">
      <div className="wrap">
        <div className="mx-auto mb-16 max-w-3xl text-center" data-reveal>
          <p className="mb-3 text-xs font-bold tracking-widest text-indigo uppercase">
            Ecosystem blueprint
          </p>
          <h2 className="text-2xl font-extrabold text-white sm:text-4xl">
            {subheading}
          </h2>
          <p className="mt-4 text-sm text-ink-3 sm:text-base">{body}</p>
        </div>

        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-3">
          {pillars.map((p, i) => {
            const Icon = PILLAR_ICONS[i] ?? Megaphone;
            const edge = PILLAR_EDGES[i] ?? PILLAR_EDGES[0];
            return (
              <article
                key={p.id}
                data-reveal
                style={{ "--d": `${i * 90}ms` } as CSSProperties}
                className={`glass-card glass-card-hover rounded-3xl border-t-4 p-8 ${edge} ${
                  i === 1 ? "lg:-translate-y-4" : ""
                }`}
              >
                <div className="mb-6 flex size-14 items-center justify-center rounded-2xl bg-white/5 text-2xl text-indigo">
                  <Icon size={22} />
                </div>
                <span className="text-xs font-bold tracking-widest text-amber-400 uppercase">
                  {p.label}
                </span>
                <h3 className="mt-2 mb-3 text-xl font-extrabold text-white">
                  {p.title}
                </h3>
                <p className="mb-6 text-xs leading-relaxed text-ink-2 sm:text-sm">
                  {p.body}
                </p>
                <ul className="space-y-2.5 text-xs text-ink-3">
                  {p.points.map((pt) => (
                    <li key={pt} className="flex items-start gap-2">
                      <span className="mt-0.5 shrink-0 text-indigo">✓</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>

        <p className="sr-only">{heading}</p>
      </div>
    </section>
  );
}