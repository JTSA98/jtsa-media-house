"use client";

import { useState } from "react";
import { Info, TrendingUp } from "lucide-react";

import type { CalcBaseView } from "@/lib/content";

export interface CalculatorInput {
  id: string;
  label: string;
}

export function RoiCalculator({
  bases,
  levels,
  sectors,
  heading,
  subheading,
  body,
  note,
}: {
  bases: CalcBaseView[];
  levels: string[];
  sectors: CalculatorInput[];
  heading: string;
  subheading: string;
  body: string;
  note: string;
}) {
  /* Default to Gold explicitly rather than by index — a positional default
     silently changed tier whenever a cheaper one was added to the list. */
  const [pkg, setPkg] = useState(
    bases.find((b) => b.id === "gold")?.id ?? bases[1]?.id ?? bases[0]?.id ?? "gold",
  );
  const [intensity, setIntensity] = useState(2);

  const base = bases.find((b) => b.id === pkg) ?? bases[0];
  if (!base) return null;

  const isVip = base.id === "vip";
  const views = Math.round(base.views * intensity * base.viewRate);
  const flyers = Math.round(base.flyers * intensity);
  const score = Math.min(
    10,
    Number((base.score + (intensity - 1) * base.scoreStep).toFixed(1)),
  );

  const leads = isVip
    ? "Continuous year-round stream"
    : `${base.leadsLow * intensity} – ${base.leadsHigh * intensity} inquiries`;

  return (
    <section id="calculator" className="relative py-20">
      <div className="wrap">
        <div className="mx-auto mb-16 max-w-3xl text-center" data-reveal>
          <p className="mb-3 text-xs font-bold tracking-widest text-amber-400 uppercase">
            Interactive planning tool
          </p>
          <h2 className="text-2xl font-extrabold text-white sm:text-4xl">
            {subheading}
          </h2>
          <p className="mt-4 text-sm text-ink-3 sm:text-base">{body}</p>
        </div>

        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
          {/* inputs */}
          <div className="glass-card space-y-6 rounded-3xl border border-white/10 p-6 sm:p-8 lg:col-span-7">
            <div>
              <label
                htmlFor="calc-sector"
                className="mb-2 block text-xs font-bold tracking-wider text-ink-2 uppercase"
              >
                1. Select your sector / business type
              </label>
              <select id="calc-sector" className="field cursor-pointer">
                {sectors.map((s) => (
                  <option key={s.id}>{s.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="calc-package"
                className="mb-2 block text-xs font-bold tracking-wider text-ink-2 uppercase"
              >
                2. Choose a combo package tier
              </label>
              <select
                id="calc-package"
                className="field cursor-pointer"
                value={pkg}
                onChange={(e) => setPkg(e.target.value)}
              >
                {bases.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="calc-duration"
                  className="text-xs font-bold tracking-wider text-ink-2 uppercase"
                >
                  3. Campaign duration / push intensity
                </label>
                <span className="text-xs font-extrabold text-amber-400">
                  {levels[intensity - 1]}
                </span>
              </div>
              <input
                id="calc-duration"
                type="range"
                min={1}
                max={levels.length}
                value={intensity}
                onChange={(e) => setIntensity(Number(e.target.value))}
                className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-kraft accent-amber-500"
              />
              <div className="mt-1 flex justify-between text-[10px] text-ink-3">
                {levels.map((l) => (
                  <span key={l} className="max-w-[30%] text-center">
                    {l}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-start gap-2 rounded-2xl border border-white/5 bg-white/5 p-4 text-xs text-ink-3">
              <Info size={14} className="mt-0.5 shrink-0 text-indigo" />
              <span>{note}</span>
            </div>
          </div>

          {/* output */}
          <div className="glass-card rounded-3xl border border-amber-500/30 bg-gradient-to-b from-kraft-2 to-indigo-950/40 p-6 sm:p-8 lg:col-span-5">
            <h3 className="mb-6 text-xs font-bold tracking-widest text-amber-400 uppercase">
              Estimated campaign metrics
            </h3>

            <div className="space-y-6">
              <div>
                <span className="mb-1 block text-xs tracking-wider text-ink-3 uppercase">
                  Estimated local views / impressions
                </span>
                <div
                  className="text-3xl font-extrabold text-white sm:text-4xl"
                  aria-live="polite"
                >
                  {views.toLocaleString("en-IN")}+
                </div>
                <span className="text-[10px] font-semibold text-emerald">
                  High hyper-local density in the region
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-4">
                <div>
                  <span className="mb-1 block text-xs tracking-wider text-ink-3 uppercase">
                    Physical drops
                  </span>
                  <div className="text-xl font-bold text-amber-400">
                    {flyers.toLocaleString("en-IN")}
                  </div>
                </div>
                <div>
                  <span className="mb-1 block text-xs tracking-wider text-ink-3 uppercase">
                    Creators active
                  </span>
                  <div className="text-xl font-bold text-violet">
                    {base.creators}
                  </div>
                </div>
              </div>

              <div className="border-t border-white/10 pt-4">
                <span className="mb-1 block text-xs tracking-wider text-ink-3 uppercase">
                  Estimated lead / inquiry potential
                </span>
                <div className="text-2xl font-extrabold text-emerald">{leads}</div>
                <p className="mt-1 text-[10px] text-ink-3">
                  Based on QR scans and WhatsApp click-through rates.
                </p>
              </div>

              <div className="border-t border-white/10 pt-4">
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1 font-bold text-ink-2">
                    <TrendingUp size={12} /> Multi-touchpoint score
                  </span>
                  <span className="font-extrabold text-amber-400">
                    {score} / 10
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-kraft">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo to-amber-500"
                    style={{ width: `${score * 10}%` }}
                  />
                </div>
              </div>

              <a
                href="#booking"
                className="block w-full rounded-xl bg-amber-500 py-3.5 text-center text-xs font-extrabold tracking-wider text-kraft uppercase transition-all hover:bg-amber-400"
              >
                Lock in this campaign
              </a>
            </div>
          </div>
        </div>

        <p className="sr-only">{heading}</p>
      </div>
    </section>
  );
}