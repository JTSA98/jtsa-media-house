"use client";

import { useState } from "react";
import {
  Building,
  GraduationCap,
  MapPin,
  Printer,
  TrendingUp,
  Utensils,
} from "lucide-react";

import type { SectorView } from "@/lib/content";

/* Static maps — Tailwind cannot extract interpolated class names. */
const TABS = [
  { id: "education", icon: GraduationCap },
  { id: "retail", icon: Printer },
  { id: "hospitality", icon: Utensils },
  { id: "b2b", icon: Building },
] as const;

const TAB_ICON: Record<string, typeof GraduationCap> = {
  education: GraduationCap,
  retail: Printer,
  hospitality: Utensils,
  b2b: Building,
};

export function SectorPlaybooks({
  sectors,
  heading,
  subheading,
  body,
}: {
  sectors: SectorView[];
  heading: string;
  subheading: string;
  body: string;
}) {
  const [active, setActive] = useState(sectors[0]?.id ?? "education");
  const current = sectors.find((s) => s.id === active) ?? sectors[0];

  if (!current) return null;

  return (
    <section id="sectors" className="relative py-20">
      <div className="wrap">
        <div className="mx-auto mb-16 max-w-3xl text-center" data-reveal>
          <p className="mb-3 text-xs font-bold tracking-widest text-indigo uppercase">
            Tailored playbooks
          </p>
          <h2 className="text-2xl font-extrabold text-white sm:text-4xl">
            {subheading}
          </h2>
          <p className="mt-4 text-sm text-ink-3 sm:text-base">{body}</p>
        </div>

        {/* tabs */}
        <div className="mb-10 flex flex-wrap justify-center gap-2 sm:gap-4">
          {sectors.map((s) => {
            const Icon = TAB_ICON[s.id] ?? Printer;
            const on = s.id === active;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setActive(s.id)}
                aria-pressed={on}
                className={`rounded-xl px-5 py-3 text-xs font-bold transition-all sm:text-sm ${
                  on
                    ? "bg-amber-500 text-kraft shadow-lg"
                    : "glass-card text-ink-3 hover:text-white"
                }`}
              >
                <Icon size={14} className="mr-2 inline-block" />
                {s.tab}
              </button>
            );
          })}
        </div>

        {/* panel */}
        <div
          className="glass-card rounded-3xl border border-white/10 p-6 sm:p-10"
          role="tabpanel"
          aria-label={current.title}
        >
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
            <div className="space-y-6 lg:col-span-7">
              <div>
                <span className="text-xs font-bold tracking-wider text-amber-400 uppercase">
                  Sector playbook
                </span>
                <h3 className="mt-1 text-2xl font-extrabold text-white">
                  {current.title}
                </h3>
                <p className="mt-1 text-xs font-medium text-ink-2">
                  {current.subtitle}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-2">
                <div className="space-y-2 rounded-2xl border border-white/5 bg-kraft/60 p-4">
                  <span className="block text-xs font-bold tracking-wider text-indigo uppercase">
                    Digital execution
                  </span>
                  <ul className="space-y-1.5 text-xs text-ink-2">
                    {current.digital.map((d) => (
                      <li key={d} className="flex items-start gap-2">
                        <span className="mt-0.5 shrink-0 text-indigo">✓</span>
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2 rounded-2xl border border-white/5 bg-kraft/60 p-4">
                  <span className="block text-xs font-bold tracking-wider text-amber-400 uppercase">
                    Physical ground drive
                  </span>
                  <ul className="space-y-1.5 text-xs text-ink-2">
                    {current.physical.map((d) => (
                      <li key={d} className="flex items-start gap-2">
                        <span className="mt-0.5 shrink-0 text-amber-400">✓</span>
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-emerald/30 bg-emerald/10 p-4 text-xs text-emerald">
                <TrendingUp size={18} className="shrink-0" />
                <div>
                  <b>Expected campaign impact:</b> {current.impact}
                </div>
              </div>
            </div>

            {/* recommended package */}
            <div className="lg:col-span-5">
              <div className="glass-card rounded-2xl border border-white/10 bg-gradient-to-b from-indigo-950/20 to-kraft-2 p-6">
                <h4 className="mb-4 text-xs font-bold tracking-wider text-ink-2 uppercase">
                  Recommended sector package
                </h4>
                <div className="space-y-3">
                  {[
                    ["Digital swarm:", current.recommended.digital],
                    ["Ground execution:", current.recommended.ground],
                    ["Target locations:", current.recommended.locations],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="flex items-center justify-between gap-3 border-b border-white/5 pb-2 text-xs text-ink-2"
                    >
                      <span>{label}</span>
                      <span
                        className={`text-right font-bold ${
                          label === "Target locations:"
                            ? "text-amber-400"
                            : "text-white"
                        }`}
                      >
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
                <a
                  href="#booking"
                  className="mt-6 block w-full rounded-xl bg-gradient-to-r from-amber-500 to-indigo-600 py-3 text-center text-xs font-bold tracking-wider text-white uppercase transition-all"
                >
                  Request this pitch
                </a>
                <p className="mt-3 flex items-center justify-center gap-1 text-[10px] text-ink-3">
                  <MapPin size={11} /> Tailored for {current.title}
                </p>
              </div>
            </div>
          </div>
        </div>

        <p className="sr-only">{heading}</p>
      </div>
    </section>
  );
}