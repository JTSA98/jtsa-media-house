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
      <div className="bg-ink px-5 py-2 text-[12.5px] text-kraft">
        <div className="mx-auto flex max-w-[1220px] flex-wrap justify-between gap-4">
          <p>
            Admission season <b className="font-bold text-yellow">2026</b> slots are
            open — <span className="text-[#A79E92]">first reply within 24 hours</span>
          </p>
          <p>
            <b className="font-bold text-yellow">{site.udyam}</b> · {site.city},{" "}
            {site.state}
          </p>
        </div>
      </div>

      <nav className="sticky top-0 z-80 border-b-2 border-dashed border-ink/22 bg-kraft/94 backdrop-blur-[10px]">
        <div className="wrap flex items-center justify-between gap-5 py-4">
          <Link href="#top" className="flex items-center gap-3">
            <span className="-rotate-3 flex size-11 items-center justify-center border-[2.5px] border-ink bg-green text-[15px] font-extrabold tracking-[-0.02em] text-white shadow-[3px_3px_0_var(--color-ink)]">
              {site.ownerShort}
            </span>
            <span>
              <b className="block text-[17px] leading-[1.1] font-extrabold tracking-[-0.02em]">
                {site.name}
              </b>
              <span className="mt-0.5 block text-[9.5px] font-bold tracking-[0.26em] text-ink-2 uppercase">
                Advertising &amp; Creative
              </span>
            </span>
          </Link>

          <div className="hidden items-center gap-1 lg:flex">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="-rotate-[0.5deg] px-3 py-2 text-[13.5px] font-bold transition hover:-rotate-2 hover:scale-[1.06] hover:bg-yellow"
              >
                {l.label}
              </a>
            ))}
            <Link
              href="/portal"
              className="px-3 py-2 text-[13.5px] font-bold transition hover:-rotate-2 hover:bg-yellow"
            >
              Client Login
            </Link>
            <a
              href="#enquire"
              className="btn btn-green ml-3 !px-[18px] !py-2 !text-[13px]"
            >
              Get a Quote
            </a>
          </div>

          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="flex size-[46px] items-center justify-center border-[2.5px] border-ink bg-yellow shadow-[3px_3px_0_var(--color-ink)] lg:hidden"
          >
            <Menu size={22} strokeWidth={2.5} />
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
          className="absolute top-5 right-[5vw] flex size-[46px] items-center justify-center border-[2.5px] border-ink bg-red shadow-[3px_3px_0_var(--color-ink)]"
        >
          <X size={24} strokeWidth={3} />
        </button>

        {LINKS.map((l, i) => (
          <a
            key={l.href}
            href={l.href}
            onClick={() => setOpen(false)}
            className={`-rotate-1 text-[26px] font-extrabold ${i % 2 ? "rotate-1" : ""}`}
          >
            {l.label}
          </a>
        ))}
        <Link
          href="/portal"
          onClick={() => setOpen(false)}
          className="-rotate-1 text-[26px] font-extrabold"
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