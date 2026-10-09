import Link from "next/link";
import { Download } from "lucide-react";

import type { SiteView } from "@/lib/settings";

export function SiteFooter({ site }: { site: SiteView }) {
  return (
// was `bg-ink text-kraft`, which inverted when the tokens flipped:
    // the footer must stay the darkest band on the page
    <footer className="border-t border-white/10 bg-black/45 pt-14 pb-8">
      <div className="wrap">
        <div className="grid gap-11 md:grid-cols-2 lg:grid-cols-[1.7fr_1fr_1fr_1.3fr]">
          <div>
            <img
              src="/brand/logo-horizontal-dark.png"
              alt={site.name}
              width={186}
              height={65}
              className="h-14 w-auto"
            />
            <p className="mt-5 text-[11px] font-semibold tracking-[0.3em] text-yellow uppercase">
              Truth · Knowledge · Impact
            </p>
            <p className="mt-4 max-w-[36ch] text-[13.5px] leading-[1.85] text-ink-3">
              A Sub-Venture of {site.owner}. Registered organisation &mdash;{" "}
              {site.udyam}. Rooted in {site.city}, ready for tomorrow.
            </p>
          </div>

          <div>
            <p className="mb-4 text-[11px] font-semibold tracking-[0.22em] text-ink-3 uppercase">
              Explore
            </p>
            <div className="flex flex-col gap-2.5">
              {[
                ["#services", "Services"],
                ["#rooms", "Who We Serve"],
                ["#work", "Our Work"],
                ["#pricing", "Pricing"],
                ["#faq", "FAQ"],
              ].map(([href, label]) => (
                <a
                  key={href}
                  href={href}
                  className="w-fit text-[13.5px] font-semibold transition hover:translate-x-1.5 hover:text-yellow"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-4 text-[11px] font-semibold tracking-[0.22em] text-ink-3 uppercase">
              Social
            </p>
            <div className="flex flex-col gap-2.5">
              {/* Only wired-up profiles are links. The "#" placeholders
                  used to jump back to the top of the page — worse than
                  no link at all. Real URLs go live in admin settings. */}
              {site.socials.map((s) =>
                s.href && s.href !== "#" ? (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener"
                    className="w-fit text-[13.5px] font-semibold transition hover:translate-x-1.5 hover:text-yellow"
                  >
                    {s.label}
                  </a>
                ) : (
                  <span
                    key={s.label}
                    className="w-fit text-[13.5px] font-semibold text-ink-3/60"
                    title="Coming soon"
                  >
                    {s.label}
                  </span>
                ),
              )}
            </div>
          </div>

          <div>
            <p className="mb-4 text-[11px] font-semibold tracking-[0.22em] text-ink-3 uppercase">
              Reach us
            </p>
            <div className="flex flex-col gap-3.5 text-[13.5px] text-ink-3">
              <p className="flex gap-3">
                <i className="shrink-0 font-extrabold text-yellow">✉</i>
                <span>
                  <a href={`mailto:${site.email}`} className="font-bold text-white hover:text-yellow">
                    {site.email}
                  </a>
                </span>
              </p>
              <p className="flex gap-3">
                <i className="shrink-0 font-extrabold text-yellow">☎</i>
                <span>
                  <a href={`tel:${site.phoneDigits}`} className="font-bold text-white hover:text-yellow">
                    {site.phone}
                  </a>
                  <br />
                  {site.city}, {site.state}
                </span>
              </p>
              <p className="flex gap-3">
                <i className="shrink-0 font-extrabold text-yellow">◎</i>
                <span>
                  <b className="block font-semibold text-ink">{site.udyam}</b>
                  Government of India, MSME
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap justify-between gap-4 border-t border-white/10 pt-6 text-[12.5px] text-ink-3">
          <p>
            © 2026 {site.name}. A Sub-Venture of {site.ownerShort}. All
            rights reserved.
          </p>
          <div className="flex gap-5">
            <a
              href="/JTSA-Ad-Agency-Research.pdf"
              className="flex items-center gap-1.5 transition hover:text-yellow"
              download
            >
              <Download size={13} /> Research PDF
            </a>
            <Link href="/portal" className="transition hover:text-yellow">
              Client Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}