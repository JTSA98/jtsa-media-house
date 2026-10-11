import Link from "next/link";

import type { SiteView } from "@/lib/settings";

export function SiteFooter({ site }: { site: SiteView }) {
  return (
    <footer className="border-t border-deep-border bg-kraft pt-16 pb-8 text-[13px] text-ink-2">
      <div className="wrap">
        <div className="mb-12 grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded border border-deep-border bg-kraft-2">
                <img
                  src="/brand/jtsa-official-mark.png"
                  alt={site.name}
                  width={24}
                  height={24}
                  className="size-6 scale-105 object-contain"
                />
              </div>
              <div>
                <span className="font-brand text-xl font-black text-white">JTSA</span>
                <div className="font-brand text-[8px] font-bold tracking-[0.2em] text-green uppercase">
                  Media House
                </div>
              </div>
            </div>
            <p className="text-[11px] leading-relaxed text-ink-3">
              A Sub-Venture of {site.owner}. Registered organisation — {site.udyam}.
            </p>
            <div className="font-brand text-[10px] font-bold text-yellow">
              Truth · Knowledge · Impact
            </div>
          </div>

          {/* quick links */}
          <div>
            <h4 className="mb-4 font-brand text-xs font-bold tracking-wider text-white uppercase">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {[
                ["#top", "Home"],
                ["#services", "Services"],
                ["#rooms", "Who We Serve"],
                ["#work", "Our Work"],
                ["#process", "How It Works"],
                ["#pricing", "Pricing"],
                ["#faq", "FAQ"],
              ].map(([href, label]) => (
                <li key={href}>
                  <a href={href} className="transition-colors hover:text-green">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* broadcast desk */}
          <div>
            <h4 className="mb-4 font-brand text-xs font-bold tracking-wider text-white uppercase">
              Reach Us
            </h4>
            <ul className="space-y-2.5">
              <li className="flex items-start gap-2">
                <span className="text-green" aria-hidden>
                  ◎
                </span>
                <span>
                  {site.city}, {site.state}, India
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green" aria-hidden>
                  ✉
                </span>
                <a href={`mailto:${site.email}`} className="break-all hover:text-green">
                  {site.email}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green" aria-hidden>
                  ☎
                </span>
                <a href={`tel:+${site.phoneDigits}`} className="hover:text-green">
                  {site.phone}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green" aria-hidden>
                  ◈
                </span>
                <span>{site.udyam}</span>
              </li>
            </ul>
          </div>

          {/* social */}
          <div>
            <h4 className="mb-4 font-brand text-xs font-bold tracking-wider text-white uppercase">
              Official Channels
            </h4>
            <p className="mb-4 text-[11px] text-ink-3">
              Follow our live video broadcasts and daily stories.
            </p>
            <div className="flex gap-3">
              {site.socials.map((s) =>
                s.href && s.href !== "#" ? (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener"
                    aria-label={s.label}
                    className="flex size-10 items-center justify-center rounded border border-deep-border bg-kraft-2 transition-all hover:border-green hover:text-green"
                  >
                    {s.label.slice(0, 2)}
                  </a>
                ) : (
                  <span
                    key={s.label}
                    title="Coming soon"
                    aria-label={`${s.label} — coming soon`}
                    className="flex size-10 cursor-not-allowed items-center justify-center rounded border border-deep-border bg-kraft-2 text-ink-3/50"
                  >
                    {s.label.slice(0, 2)}
                  </span>
                ),
              )}
            </div>
          </div>
        </div>

        {/* bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-deep-border/60 pt-8 text-[10px] text-ink-3 md:flex-row">
          <div>© 2026 {site.name}. All rights reserved.</div>
          <div className="flex gap-4">
            {site.clientLoginVisible ? (
              <Link href="/portal" className="hover:underline">
                Client Portal
              </Link>
            ) : null}
            <span>Designed to the official Brand Guidelines</span>
          </div>
        </div>
      </div>
    </footer>
  );
}