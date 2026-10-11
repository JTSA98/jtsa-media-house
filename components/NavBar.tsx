"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

import type { SiteView } from "@/lib/settings";

const LINKS = [
  { href: "#services", label: "Services" },
  { href: "#sectors", label: "Commercial Sectors" },
  { href: "#work", label: "Our Work" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
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
      {/* Top corporate strip */}
      <div className="border-b border-white/10 bg-black/60 px-5 py-2 text-[11px] tracking-[0.14em] text-ink-2 uppercase">
        <div className="mx-auto flex max-w-[1220px] flex-wrap items-center justify-between gap-4">
          <p className="flex items-center gap-2">
            <span className="inline-block size-2 rounded-full bg-green animate-pulse" />
            Commercial Growth & Advertising Wing · <b className="font-bold text-yellow">JTSA</b>
          </p>
          <p>
            <b className="font-bold text-yellow">{site.udyam}</b> · {site.city},{" "}
            {site.state}
          </p>
        </div>
      </div>

      <nav className="sticky top-0 z-80 border-b border-white/10 bg-kraft/90 backdrop-blur-xl">
        <div className="wrap flex items-center justify-between gap-5 py-3.5">
          <Link href="#top" className="flex shrink-0 items-center gap-3 group">
            <div className="size-11 overflow-hidden rounded-xl border border-green/40 p-0.5 shadow-md transition group-hover:scale-105">
<img
                  src="/brand/jtsa-official-mark.png"
                  alt="JTSA Media House"
                  width={44}
                  height={44}
                  className="size-full rounded-[10px] object-contain"
                />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-brand text-2xl font-black tracking-tight text-white transition group-hover:text-green">
                  JTSA
                </span>
                <span className="rounded-md border border-green/30 bg-green/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-green">
                  MEDIA HOUSE
                </span>
              </div>
              <p className="text-[10px] font-semibold tracking-wider text-green-2">
                आज का प्रचार, कल की पहचान
              </p>
            </div>
          </Link>

          <div className="hidden items-center gap-1 lg:flex">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="px-3 py-2 text-[12px] font-semibold tracking-[0.12em] text-ink-2 uppercase transition hover:text-green"
              >
                {l.label}
              </a>
            ))}
            {/* Hidden until the influencer login launches — see
                portal.client_login. The /portal routes stay live. */}
            {site.clientLoginVisible ? (
              <Link
                href="/portal"
                className="px-3 py-2 text-[12px] font-semibold tracking-[0.12em] text-ink-2 uppercase transition hover:text-green"
              >
                Client Login
              </Link>
            ) : null}
            <a
              href="#enquire"
              className="btn btn-green ml-3 !px-[18px] !py-2.5 !text-[12px] !tracking-[0.1em] !uppercase shadow-lg"
            >
              Book Consultation
            </a>
          </div>

          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="flex size-[46px] items-center justify-center border border-white/15 bg-kraft-2 text-green lg:hidden rounded-xl"
          >
            <Menu size={20} strokeWidth={2.5} />
          </button>
        </div>
      </nav>

      {/* full-screen drawer.
          `invisible` when closed matters: an off-canvas panel is still in
          the tab order, so keyboard users could focus links they cannot
          see. Visibility removes them from sequential focus. */}
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
          className="absolute top-5 right-[5vw] flex size-[46px] items-center justify-center border border-white/15 bg-kraft-2 text-green"
        >
          <X size={22} strokeWidth={3} />
        </button>

        {LINKS.map((l) => (
          <a
            key={l.href}
            href={l.href}
            onClick={() => setOpen(false)}
            className="text-[24px] font-bold tracking-[0.06em] text-ink uppercase"
          >
            {l.label}
          </a>
        ))}
        {site.clientLoginVisible ? (
          <Link
            href="/portal"
            onClick={() => setOpen(false)}
            className="text-[24px] font-bold tracking-[0.06em] text-green uppercase"
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