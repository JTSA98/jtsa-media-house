"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

import type { SiteView } from "@/lib/settings";

const LINKS = [
  { href: "#services", label: "Services" },
  { href: "#rooms", label: "Who We Serve" },
  { href: "#work", label: "Our Work" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

export function NavBar({ site }: { site: SiteView }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <div className="border-b border-white/10 bg-black/40 px-5 py-2 text-[11px] tracking-[0.14em] text-ink-2 uppercase">
        <div className="mx-auto flex max-w-[1220px] flex-wrap justify-between gap-4">
          <p>
            Admission season <b className="font-bold text-yellow">2026</b> slots are
            open — <span className="text-ink-3">first reply within 24 hours</span>
          </p>
          <p>
            <b className="font-bold text-yellow">{site.udyam}</b> · {site.city},{" "}
            {site.state}
          </p>
        </div>
      </div>

      <nav className="sticky top-0 z-80 border-b border-white/10 bg-kraft/88 backdrop-blur-xl">
        <div className="wrap flex items-center justify-between gap-5 py-4">
          <Link href="#top" className="flex items-center gap-3">
            {/* `-dark` = the brand artwork with its opaque black panel knocked out
                to transparent, so it sits directly on the slate ground */}
            <img
              src="/brand/logo-horizontal-dark.png"
              alt={site.name}
              width={124}
              height={44}
              className="h-11 w-auto"
            />
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
            <Link
              href="/portal"
              className="px-3 py-2 text-[12px] font-semibold tracking-[0.12em] text-ink-2 uppercase transition hover:text-green"
            >
              Client Login
            </Link>
            <a
              href="#enquire"
              className="btn btn-green ml-3 !px-[18px] !py-2.5 !text-[12px] !tracking-[0.1em] !uppercase"
            >
              Get a Quote
            </a>
          </div>

          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="flex size-[46px] items-center justify-center border border-white/15 bg-kraft-2 text-green lg:hidden"
          >
            <Menu size={20} strokeWidth={2.5} />
          </button>
        </div>
      </nav>

      {/* full-screen drawer */}
      <div
        className={`fixed inset-0 z-90 flex flex-col items-center justify-center gap-5 bg-kraft transition-transform duration-400 lg:hidden ${
          open ? "translate-y-0" : "-translate-y-full"
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
        <Link
          href="/portal"
          onClick={() => setOpen(false)}
          className="text-[24px] font-bold tracking-[0.06em] text-green uppercase"
        >
          Client Login
        </Link>
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