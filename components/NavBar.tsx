"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, CalendarCheck, Menu, Phone, X } from "lucide-react";

import type { SiteView } from "@/lib/settings";

const LINKS = [
  { href: "#why-combo", label: "Why Combo?" },
  { href: "#solution", label: "360° Architecture" },
  { href: "#packages", label: "Packages" },
  { href: "#sectors", label: "Sector Playbooks" },
  { href: "#festive", label: "Festive Offer" },
  { href: "#calculator", label: "ROI Calculator" },
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
      <header className="fixed top-0 right-0 left-0 z-50 border-b border-white/10 bg-kraft/80 backdrop-blur-md">
        <div className="wrap">
          <div className="flex h-20 items-center justify-between gap-4">
            <Link href="#top" className="group flex shrink-0 items-center gap-3">
              <div className="flex size-10 items-center justify-center overflow-hidden rounded-xl bg-kraft-2 shadow-lg shadow-violet/20 transition group-hover:shadow-amber-400/20">
                <img
                  src="/brand/jtsa-official-mark.png"
                  alt={site.name}
                  width={40}
                  height={40}
                  className="size-full scale-110 object-contain"
                />
              </div>
              <div className="min-w-0">
                <span className="block text-[15px] leading-none font-extrabold tracking-tight whitespace-nowrap text-white sm:text-xl">
                  JTSA <span className="text-gradient-festive">MEDIA HOUSE</span>
                </span>
                <span className="mt-1 hidden text-[10px] font-semibold tracking-wider text-amber-400 uppercase sm:block">
                  {site.city} &amp; {site.state}
                </span>
              </div>
            </Link>

            {/* Six links + a phone chip + CTA need real width; they only
                appear from xl so they never crowd the wordmark. */}
            <nav className="hidden items-center gap-5 text-sm font-medium text-ink-2 xl:flex">
              {LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="whitespace-nowrap transition-colors hover:text-amber-400"
                >
                  {l.label}
                </a>
              ))}
              {site.clientLoginVisible ? (
                <Link href="/portal" className="whitespace-nowrap transition-colors hover:text-amber-400">
                  Client Login
                </Link>
              ) : null}
            </nav>

            <div className="hidden items-center gap-4 sm:flex">
              <a
                href={`tel:${site.phoneDigits}`}
                className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-ink-2 transition-colors hover:border-amber-500/50 hover:text-white"
              >
                <Phone size={13} className="text-amber-400" />
                {site.phone}
              </a>
              <a
                href="#booking"
                className="glow-effect inline-flex shrink-0 items-center justify-center rounded-xl bg-festive-gradient px-5 py-2.5 text-xs font-bold tracking-wider whitespace-nowrap text-white uppercase shadow-lg transition-transform hover:scale-105"
              >
                Book a Slot
              </a>
            </div>

            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className="rounded-lg p-2 text-ink-2 transition hover:bg-white/5 hover:text-white xl:hidden"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* mobile drawer — visibility gated so hidden links stay out of the
          tab order */}
      <div
        className={`fixed inset-0 z-90 flex flex-col bg-kraft-2 transition-[transform,visibility] duration-400 [transition-behavior:allow-discrete] xl:hidden ${
          open ? "visible translate-y-0" : "invisible -translate-y-full"
        }`}
        aria-hidden={!open}
      >
        {/* ambient wash so the panel is not a flat black sheet */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            backgroundImage:
              "linear-gradient(rgba(99,102,241,.10) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,.10) 1px, transparent 1px)",
            backgroundSize: "52px 52px",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 -right-32 h-[460px] w-[460px] rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(closest-side, rgba(139,92,246,.28), transparent 70%)",
          }}
        />

        <div className="relative flex min-h-0 flex-1 flex-col">
          <div className="flex shrink-0 items-center justify-between px-5 pt-5 pb-5 sm:px-8">
            <span className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center overflow-hidden rounded-xl bg-kraft shadow-lg shadow-violet/25">
                <img
                  src="/brand/jtsa-official-mark.png"
                  alt=""
                  width={40}
                  height={40}
                  className="size-full scale-110 object-contain"
                />
              </span>
              <span className="text-[15px] leading-none font-extrabold tracking-tight text-white">
                JTSA{" "}
                <span className="text-gradient-festive">MEDIA HOUSE</span>
              </span>
            </span>

            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="-mr-2 rounded-xl p-2 text-ink-2 transition hover:bg-white/10 hover:text-white"
            >
              <X size={22} />
            </button>
          </div>

          <nav className="min-h-0 flex-1 overflow-y-auto px-5 sm:px-8">
            <p className="px-1 pb-4 text-[10px] font-bold tracking-[0.22em] text-ink-3 uppercase">
              Explore
            </p>

            <ul className="flex flex-col gap-1.5">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="group flex items-center justify-between gap-3 rounded-2xl border border-white/8 bg-white/4 px-4 py-4 text-[17px] font-bold tracking-tight text-white transition-colors hover:border-indigo-400/40 hover:bg-white/8"
                  >
                    {l.label}
                    <ArrowRight
                      size={17}
                      aria-hidden
                      className="shrink-0 text-ink-3 transition-transform group-hover:translate-x-0.5 group-hover:text-amber-400"
                    />
                  </a>
                </li>
              ))}
              {site.clientLoginVisible ? (
                <li>
                  <Link
                    href="/portal"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-white/8 bg-white/4 px-4 py-4 text-[17px] font-bold tracking-tight text-amber-400"
                  >
                    Client Login
                    <ArrowRight size={17} aria-hidden className="shrink-0" />
                  </Link>
                </li>
              ) : null}
            </ul>
          </nav>

          <div className="shrink-0 border-t border-white/10 bg-kraft/60 px-5 pt-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] backdrop-blur-md sm:px-8">
            <div className="flex flex-col gap-2.5">
              <a
                href={`tel:${site.phoneDigits}`}
                className="flex items-center justify-center gap-2 rounded-2xl border border-amber-500/30 bg-amber-500/8 px-4 py-3.5 text-sm font-bold text-amber-400 transition-colors hover:bg-amber-500/14"
              >
                <Phone size={15} />
                Call {site.phone}
              </a>
              <a
                href="#booking"
                onClick={() => setOpen(false)}
                className="glow-effect flex items-center justify-center rounded-2xl bg-festive-gradient px-4 py-3.5 text-xs font-black tracking-wider text-white uppercase"
              >
                <CalendarCheck size={15} className="mr-2" />
                Book a Slot
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}