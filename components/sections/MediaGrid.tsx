"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Play, X } from "lucide-react";

import { work } from "@/lib/site-config";

/* Categories are derived from the real captions in lib/site-config —
   no new claims, just grouping the six existing work images. */
const FILTERS = [
  { id: "all", label: "All" },
  { id: "campaign", label: "Campaigns" },
  { id: "reel", label: "Reels" },
] as const;

type FilterId = (typeof FILTERS)[number]["id"];

function categoryOf(caption: string): Exclude<FilterId, "all"> {
  const c = caption.toLowerCase();
  if (c.includes("reel")) return "reel";
  if (c.includes("series")) return "reel";
  if (c.includes("module")) return "reel";
  return "campaign";
}

export function Work() {
  const [filter, setFilter] = useState<FilterId>("all");
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const visible = work.filter(
    (w, i) => filter === "all" || categoryOf(w.caption) === filter,
  );
  const current = open === null ? null : work[open];

  return (
    <section id="work" className="relative py-24">
      <div className="wrap">
        {/* heading row + filter tabs */}
        <div className="mb-12 flex flex-col items-start justify-between md:flex-row md:items-end">
          <div>
            <div className="mb-2 font-brand text-xs font-bold tracking-[0.25em] text-green uppercase">
              Portfolio showcase
            </div>
            <h2 className="font-brand text-3xl font-black text-white sm:text-4xl">
              Our recent work
            </h2>
          </div>

          <div className="mt-4 flex flex-wrap gap-2 md:mt-0">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                aria-pressed={filter === f.id}
                className={`rounded-md px-4 py-2 font-brand text-xs font-bold transition-all ${
                  filter === f.id
                    ? "bg-green text-kraft"
                    : "border border-deep-border bg-kraft-2 text-ink-2 hover:text-white"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {visible.map((w) => {
            const i = work.indexOf(w);
            const reel = categoryOf(w.caption) === "reel";

            return (
              <article
                key={w.src + i}
                data-reveal
                className="glass-card glass-card-hover group overflow-hidden rounded-xl border border-deep-border"
              >
                <button
                  type="button"
                  onClick={() => setOpen(i)}
                  aria-label={`View ${w.caption}`}
                  className="relative block h-48 w-full cursor-pointer overflow-hidden bg-black/30"
                >
                  <Image
                    src={w.src}
                    alt={w.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute inset-0 z-10 bg-gradient-to-t from-kraft to-transparent" />
                  <span
                    className={`absolute top-3 left-3 z-20 rounded px-2.5 py-1 font-brand text-[10px] font-extrabold tracking-wider uppercase ${
                      reel
                        ? "bg-green text-kraft"
                        : "bg-yellow text-kraft"
                    }`}
                  >
                    {reel ? "Reel" : "Print"}
                  </span>
                  <span className="absolute inset-0 z-20 flex items-center justify-center">
                    <span
                      className={`flex size-12 items-center justify-center rounded-full border bg-kraft/80 transition-transform group-hover:scale-110 ${
                        reel
                          ? "border-green text-green"
                          : "border-yellow text-yellow"
                      }`}
                    >
                      <Play size={16} className="ml-0.5" fill="currentColor" />
                    </span>
                  </span>
                </button>

                <div className="p-6">
                  <span className="font-mono text-[11px] text-ink-3">
                    {reel ? "Video asset" : "Print asset"}
                  </span>
                  <h3
                    className={`mt-1 font-brand text-lg font-bold transition-colors ${
                      reel ? "group-hover:text-green" : "group-hover:text-yellow"
                    }`}
                  >
                    {w.caption}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-xs text-ink-3">{w.alt}</p>
                </div>
              </article>
            );
          })}
        </div>

        {visible.length === 0 ? (
          <p className="py-12 text-center text-sm text-ink-3">
            Nothing in this category yet.
          </p>
        ) : null}
      </div>

      {/* ── lightbox ──
          Replaces the YouTube modal from the reference layout: we have
          no video URLs yet, so a full-size image is the honest version. */}
      {current ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={current.caption}
          onClick={() => setOpen(null)}
          className="fixed inset-0 z-95 flex items-center justify-center bg-black/90 p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl overflow-hidden rounded-xl border border-deep-border bg-kraft shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-deep-border bg-kraft-2 p-4">
              <h3 className="font-brand text-sm font-bold text-white">
                {current.caption}
              </h3>
              <button
                type="button"
                onClick={() => setOpen(null)}
                aria-label="Close"
                className="p-1 text-ink-2 transition hover:text-green"
              >
                <X size={22} />
              </button>
            </div>
            <div className="relative aspect-video bg-black">
              <Image
                src={current.src}
                alt={current.alt}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}