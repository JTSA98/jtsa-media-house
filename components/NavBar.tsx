"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, Send, X } from "lucide-react";

import type { SiteView } from "@/lib/settings";

const LINKS = [
  { href: "#top", label: "Home" },
  { href: "#services", label: "Services" },
  { href: "#rooms", label: "Who We Serve" },
  { href: "#work", label: "Our Work" },
  { href: "#process", label: "How It Works" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

/* Ticker copy is brand-agnostic on purpose — these are service lines and
   an availability note, not claims about events or viewership numbers. */
const TICKER = [
  "Ad Agency · Dhanbad · A Sub-Venture of JTSA",
  "Posters, Flex, Standees & Reels",
  "Typical turnaround 48 hours",
  "Free design sample before you pay",
];

export function NavBar({ site }: { site: SiteView }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      {/* ── broadcast lower-third ticker ── */}
      <div className="sticky top-0 z-50 border-b border-deep-border bg-kraft text-xs">
        <div className="mx-auto flex max-w-[1220px] flex-wrap items-center">
          <div className="cut-badge relative z-10 flex items-center gap-2 bg-green px-4 py-2 font-brand text-xs font-black tracking-wider text-kraft uppercase shadow-lg">
            <span className="inline-block size-2 animate-ping rounded-full bg-red-600" />
            JTSA Media
            <span className="ml-1 rounded bg-kraft px-1.5 py-0.5 text-[10px] text-green">
              Open
            </span>
          </div>

          <div className="relative flex flex-1 items-center overflow-hidden bg-black/40 py-1.5">
            <div className="animate-ticker flex items-center gap-8 font-medium tracking-wide text-ink-2">
              {[0, 1].map((dup) => (
                /* the second copy is loop filler — hidden from AT so the
                   ticker is not announced twice */
                <span key={dup} aria-hidden={dup === 1} className="inline-flex">
                  {TICKER.map((line) => (
                    <span key={line} className="inline-flex items-center gap-2">
                      <b className="text-white">{line}</b>
                      <span className="text-green">|</span>
                    </span>
                  ))}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── main navbar ── */}
      <nav className="sticky top-[33px] z-40 border-b border-deep-border bg-kraft/90 backdrop-blur-md">
        <div className="wrap">
          <div className="flex h-20 items-center justify-between">
            <Link href="#top" className="group flex shrink-0 items-center gap-3">
              <div className="flex size-11 items-center justify-center overflow-hidden rounded-lg border border-deep-border bg-kraft-2 transition-all group-hover:border-green group-hover:shadow-[0_0_20px_rgba(0,245,212,0.35)]">
                <img
                  src="/brand/jtsa-official-mark.png"
                  alt={site.name}
                  width={44}
                  height={44}
                  className="size-full scale-105 object-contain"
                />
              </div>
              <div>
                <span className="font-brand text-2xl font-black tracking-wider text-white">
                  JTSA
                </span>
                <div className="-mt-1 font-brand text-[9px] font-bold tracking-[0.25em] text-green uppercase">
                  Media House
                </div>
              </div>
            </Link>

            <div className="hidden items-center gap-7 text-sm font-semibold tracking-wide lg:flex">
              {LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="text-ink-2 transition-colors hover:text-green"
                >
                  {l.label}
                </a>
              ))}
              {site.clientLoginVisible ? (
                <Link href="/portal" className="text-ink-2 transition-colors hover:text-green">
                  Client Login
                </Link>
              ) : null}
            </div>

            <div className="hidden items-center gap-4 lg:flex">
              <a
                href="#enquire"
                className="inline-flex items-center justify-center rounded-md bg-green px-6 py-2.5 font-brand text-xs font-bold tracking-widest text-kraft uppercase transition-all duration-300 shadow-[0_0_20px_rgba(0,245,212,0.35)] hover:bg-white hover:shadow-[0_0_20px_rgba(255,184,0,0.35)]"
              >
                <Send size={13} className="mr-2" />
                Get a Quote
              </a>
            </div>

            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className="rounded-md p-2 text-ink-2 transition hover:text-green lg:hidden"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* ── mobile drawer ──
          `invisible` when closed matters: an off-canvas panel stays in
          the tab order, so keyboard users could focus invisible links. */}
      <div
        className={`fixed inset-0 z-90 flex flex-col items-center justify-center gap-5 bg-kraft transition-[transform,visibility] duration-400 [transition-behavior:allow-discrete] lg:hidden ${
          open ? "visible translate-y-0" : "invisible -translate-y-full"
        }`}
        aria-hidden={!open}
      >
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close menu"
          className="absolute top-5 right-[5vw] p-2 text-ink-2 transition hover:text-green"
        >
          <X size={26} />
        </button>

        {LINKS.map((l) => (
          <a
            key={l.href}
            href={l.href}
            onClick={() => setOpen(false)}
            className="font-brand text-[24px] font-bold tracking-wide text-ink uppercase"
          >
            {l.label}
          </a>
        ))}
        {site.clientLoginVisible ? (
          <Link
            href="/portal"
            onClick={() => setOpen(false)}
            className="font-brand text-[24px] font-bold tracking-wide text-green uppercase"
          >
            Client Login
          </Link>
        ) : null}
        <a
          href="#enquire"
          onClick={() => setOpen(false)}
          className="btn btn-green mt-4"
        >
          Get a Quote
        </a>
      </div>
    </>
  );
}