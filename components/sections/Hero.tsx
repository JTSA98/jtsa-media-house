import Image from "next/image";

import { heroPolaroids } from "@/lib/site-config";
import type { SiteView } from "@/lib/settings";

export function Hero({ site }: { site: SiteView }) {
  return (
    <header id="top" className="pt-20 pb-14">
      <div className="wrap grid items-center gap-14 lg:grid-cols-[1.06fr_0.94fr]">
        {/* ── copy ── */}
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-green/30 bg-green/8 px-[15px] py-[7px] text-[11px] font-semibold tracking-[0.18em] text-green uppercase">
            <span className="size-1.5 rounded-full bg-green" />
            Ad Agency · Dhanbad · A Sub-Venture of JTSA
          </span>

          <p className="mt-7 text-[11px] font-semibold tracking-[0.3em] text-yellow uppercase">
            Truth · Knowledge · Impact
          </p>

          <h1 className="display mt-5 text-[clamp(40px,7vw,84px)]">
            We make your
            <br />
            notice board
            <br />
            worth <span className="text-green">stopping</span>
            <br />
            at.
          </h1>

          <div className="accent-rule mt-7" />

          <p className="mt-7 max-w-[46ch] text-[16.5px] leading-[1.8] text-ink-2">
            JTSA Media House is the advertising wing of{" "}
            <b className="font-semibold text-ink">Jharkhand Talent Search Association</b>
            . Posters, reels, campaigns and website listings for{" "}
            <b className="font-semibold text-ink">
              schools and local businesses
            </b>{" "}
            across Dhanbad — built for broadcast, not from a template.
          </p>

          <div className="mt-8 flex flex-wrap gap-3.5">
            <a
              href="#enquire"
              className="btn btn-green !px-[34px] !py-[17px] !text-[13px] !tracking-[0.1em] !uppercase"
            >
              Get a Free Design Sample
            </a>
            <a
              href="#pricing"
              className="btn btn-white !px-[34px] !py-[17px] !text-[13px] !tracking-[0.1em] !uppercase"
            >
              See Pricing
            </a>
          </div>

          <dl className="mt-11 grid grid-cols-2 gap-x-7 gap-y-6 border-t border-white/10 pt-7 sm:grid-cols-4">
            {site.stats.map((s) => (
              <div key={s.label}>
                <dt className="sr-only">{s.label}</dt>
                <dd>
                  <b className="block text-[30px] leading-none font-bold tracking-[-0.02em] text-green">
                    {s.value}
                  </b>
                  <span className="mt-2 block text-[10px] font-semibold tracking-[0.16em] text-ink-3 uppercase">
                    {s.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* ── work stack ── */}
        <div className="relative mx-auto h-[440px] w-full max-w-[480px] sm:h-[520px]">
          {heroPolaroids.map((p, i) => {
            const pos = [
              "left-0 top-0 w-[63%] -rotate-6 z-30",
              "right-0 top-[96px] w-[57%] rotate-[6.5deg] z-20",
              "bottom-[6px] left-[14%] w-[54%] -rotate-[1.6deg] z-40",
            ][i];

            return (
              <figure
                key={p.src}
                className={`absolute rounded-sm border border-white/12 bg-kraft-2 p-2.5 pb-8 shadow-[0_18px_44px_rgba(2,6,12,0.6)] ${pos}`}
              >
                <div className="relative h-[206px] w-full overflow-hidden rounded-sm">
                  <Image
                    src={p.src}
                    alt={p.alt}
                    fill
                    sizes="(max-width: 1024px) 60vw, 340px"
                    className="object-cover"
                  />
                </div>
                <figcaption className="absolute right-3 bottom-2.5 left-3 truncate text-center text-[10.5px] font-semibold tracking-[0.14em] text-ink-3 uppercase">
                  {p.caption}
                </figcaption>
              </figure>
            );
          })}

          <div className="absolute -top-3 -right-2 z-60 rounded-sm border border-green/25 bg-kraft-3 px-4 py-3 text-[13px] font-semibold tracking-[0.06em] text-green shadow-[0_14px_34px_rgba(0,245,212,0.12)]">
            50+ schools
            <br />
            already in
          </div>
          <div className="absolute bottom-[96px] -left-4 z-60 rounded-sm border border-yellow/25 bg-kraft-3 px-4 py-3 text-[13px] font-semibold tracking-[0.06em] text-yellow shadow-[0_14px_34px_rgba(255,184,0,0.12)]">
            48 hour
            <br />
            delivery
          </div>
        </div>
      </div>
    </header>
  );
}