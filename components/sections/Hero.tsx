import Image from "next/image";

import { Tape } from "@/components/ui/paper";
import { heroPolaroids } from "@/lib/site-config";
import type { SiteView } from "@/lib/settings";

export function Hero({ site }: { site: SiteView }) {
  return (
    <header id="top" className="pt-16 pb-8">
      <div className="wrap grid items-center gap-14 lg:grid-cols-[1.06fr_0.94fr]">
        {/* ── copy ── */}
        <div>
          <span className="inline-flex items-center gap-2 border-2 border-ink bg-white px-[15px] py-[7px] text-[11.5px] font-bold tracking-[0.14em] uppercase shadow-[3px_3px_0_var(--color-ink)] -rotate-1.5">
            <span className="size-2 rounded-full bg-red" />
            Ad Agency · Dhanbad · A Sub-Venture of JTSA
          </span>

          <p className="hand -rotate-2 mt-6 text-[clamp(21px,2.7vw,31px)] text-green">
            Aaj ka Prachar, Kal ki Pehchaan ✎
          </p>

          <h1 className="mt-4 text-[clamp(42px,7.4vw,90px)] leading-[0.94] font-extrabold tracking-[-0.038em] uppercase">
            We make your
            <br />
            notice board
            <br />
            worth <span className="marker">stopping</span>
            <br />
            <span className="text-green">at.</span>
          </h1>

          <p className="mt-6 max-w-[45ch] text-[17px] leading-[1.75] text-ink-2">
            JTSA Media House is the advertising wing of{" "}
            <b className="border-b-[2.5px] border-yellow font-bold text-ink">
              Jharkhand Talent Search Association
            </b>
            . Posters, reels, campaigns and website listings for{" "}
            <b className="border-b-[2.5px] border-yellow font-bold text-ink">
              schools and local businesses
            </b>{" "}
            across Dhanbad — made by hand, not from a template.
          </p>

          <div className="mt-8 flex flex-wrap gap-3.5">
            <a href="#enquire" className="btn btn-green text-[15.5px] px-[38px] py-[19px]">
              Get a Free Design Sample
            </a>
            <a href="#pricing" className="btn btn-yellow text-[15.5px] px-[38px] py-[19px]">
              See Pricing
            </a>
          </div>

          <dl className="mt-9 grid grid-cols-2 gap-x-7 gap-y-5 border-t-2 border-dashed border-ink/25 pt-6 sm:grid-cols-4">
            {site.stats.map((s) => (
              <div key={s.label}>
                <dt className="sr-only">{s.label}</dt>
                <dd>
                  <b className="block text-[30px] leading-none font-extrabold tracking-[-0.03em] text-green">
                    {s.value}
                  </b>
                  <span className="text-[10.5px] font-bold tracking-[0.16em] text-ink-2 uppercase">
                    {s.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* ── polaroid stack ── */}
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
                className={`absolute bg-white pt-3 pb-11 pr-3 pl-3 shadow-[0_16px_38px_rgba(43,38,32,0.3)] ${pos}`}
              >
                <Tape className="-top-[13px] left-1/2 w-[96px] -translate-x-1/2" rotate={-4} />
                <div className="relative h-[206px] w-full overflow-hidden">
                  <Image
                    src={p.src}
                    alt={p.alt}
                    fill
                    sizes="(max-width: 1024px) 60vw, 340px"
                    className="object-cover"
                  />
                </div>
                <figcaption className="hand absolute right-3 bottom-2 left-3 text-center text-[21px] leading-none text-[#5A5148]">
                  {p.caption}
                </figcaption>
              </figure>
            );
          })}

          <div className="hand-note absolute -top-3 -right-2 z-60 rotate-6 text-[23px]">
            50+ schools
            <br />
            already in ✌
          </div>
          <div className="hand-note bottom-[96px] -left-4 z-60 -rotate-7 text-[20px]">
            48 hour
            <br />
            delivery ⚡
          </div>
        </div>
      </div>
    </header>
  );
}