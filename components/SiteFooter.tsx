import Link from "next/link";

import type { SiteView } from "@/lib/settings";

export function SiteFooter({ site }: { site: SiteView }) {
  return (
    <footer className="border-t border-white/10 bg-kraft py-12 text-xs text-ink-3">
      <div className="wrap">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-3">
            <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-tr from-indigo to-amber-500">
              <img
                src="/brand/jtsa-official-mark.png"
                alt={site.name}
                width={24}
                height={24}
                className="size-6 scale-110 object-contain"
              />
            </div>
            <div>
              <span className="block text-sm font-extrabold text-white">
                JTSA MEDIA HOUSE
              </span>
              <span className="text-[10px] text-ink-3">
                {site.city} &amp; {site.state} regional marketing network
              </span>
            </div>
          </div>

          <nav className="flex flex-wrap justify-center gap-6 text-ink-3">
            {[
              ["#why-combo", "Why Combo"],
              ["#solution", "360° Architecture"],
              ["#packages", "Packages"],
              ["#sectors", "Sectors"],
              ["#calculator", "ROI Calculator"],
            ].map(([href, label]) => (
              <a key={href} href={href} className="transition-colors hover:text-white">
                {label}
              </a>
            ))}
            {site.clientLoginVisible ? (
              <Link href="/portal" className="transition-colors hover:text-white">
                Client Portal
              </Link>
            ) : null}
          </nav>

          <div className="text-center md:text-right">
            <p>© 2026 {site.name}. All rights reserved.</p>
            <p className="mt-1 text-[10px] text-ink-3">
              {site.udyam} · {site.ownerShort}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}