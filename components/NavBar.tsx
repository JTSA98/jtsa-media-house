"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Calculator, Menu, Phone, X } from "lucide-react";

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
              <div className="hidden sm:block">
                <span className="block text-xl leading-none font-extrabold tracking-tight text-white">
                  JTSA <span className="text-gradient-festive">MEDIA HOUSE</span>
                </span>
                <span className="mt-1 block text-[10px] font-semibold tracking-wider text-amber-400 uppercase">
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
                href={`tel:+${site.phoneDigits}`}
                className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-ink-2 transition-colors hover:border-amber-500/50 hover:text-white"
              >
                <Phone size={13} className="text-amber-400" />
                {site.phone}
              </a>
              <a
                href="#booking"
                className="glow-effect inline-flex items-center justify-center rounded-xl bg-festive-gradient px-5 py-2.5 text-xs font-bold tracking-wider text-white uppercase shadow-lg transition-transform hover:scale-105"
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
        className={`fixed inset-0 z-90 flex flex-col items-center justify-center gap-5 bg-kraft transition-[transform,visibility] duration-400 [transition-behavior:allow-discrete] xl:hidden ${
          open ? "visible translate-y-0" : "invisible -translate-y-full"
        }`}
        aria-hidden={!open}
      >
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close menu"
          className="absolute top-5 right-[5vw] rounded-lg p-2 text-ink-2 transition hover:text-white"
        >
          <X size={24} />
        </button>

        {LINKS.map((l) => (
          <a
            key={l.href}
            href={l.href}
            onClick={() => setOpen(false)}
            className="text-[22px] font-bold tracking-wide text-ink"
          >
            {l.label}
          </a>
        ))}
        {site.clientLoginVisible ? (
          <Link
            href="/portal"
            onClick={() => setOpen(false)}
            className="text-[22px] font-bold tracking-wide text-amber-400"
          >
            Client Login
          </Link>
        ) : null}
        <a
          href={`tel:+${site.phoneDigits}`}
          className="mt-2 flex items-center gap-2 rounded-lg border border-amber-500/30 bg-white/5 px-4 py-2.5 text-sm font-semibold text-amber-400"
        >
          <Phone size={14} />
          Call {site.phone}
        </a>
        <a
          href="#booking"
          onClick={() => setOpen(false)}
          className="btn mt-4 bg-festive-gradient text-white"
        >
          <Calculator size={15} className="mr-2" />
          Book a Slot
        </a>
      </div>
    </>
  );
}