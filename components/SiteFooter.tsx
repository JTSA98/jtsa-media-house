import Link from "next/link";
import { Download } from "lucide-react";

import type { SiteView } from "@/lib/settings";

export function SiteFooter({ site }: { site: SiteView }) {
  return (
    <footer className="bg-ink pt-14 pb-8 text-kraft">
      <div className="wrap">
        <div className="grid gap-11 md:grid-cols-2 lg:grid-cols-[1.7fr_1fr_1fr_1.3fr]">
          <div>
            <b className="block text-[19px] font-extrabold tracking-[-0.02em] text-white">
              {site.name}
            </b>
            <p className="mt-3.5 max-w-[36ch] text-[13.5px] leading-[1.85] text-[#A79E92]">
              A Sub-Venture of {site.owner}. Registered organisation —{" "}
              {site.udyam}. Rooted in {site.city}, ready for tomorrow.
            </p>
          </div>

          <div>
            <p className="hand mb-4 text-[24px] leading-none text-yellow">Explore</p>
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
            <p className="hand mb-4 text-[24px] leading-none text-yellow">Social</p>
            <div className="flex flex-col gap-2.5">
              {site.socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  className="w-fit text-[13.5px] font-semibold transition hover:translate-x-1.5 hover:text-yellow"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="hand mb-4 text-[24px] leading-none text-yellow">Reach us</p>
            <div className="flex flex-col gap-3.5 text-[13.5px] text-[#A79E92]">
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
                  <b className="block font-bold text-white">{site.udyam}</b>
                  Government of India, MSME
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap justify-between gap-4 border-t-[1.5px] border-dashed border-kraft/24 pt-6 text-[12.5px] text-[#8A8175]">
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
            <a href="#" className="transition hover:text-yellow">
              Privacy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}