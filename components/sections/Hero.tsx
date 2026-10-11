import Image from "next/image";

import { heroPolaroids } from "@/lib/site-config";
import type { SiteView } from "@/lib/settings";

export function Hero({ site }: { site: SiteView }) {
  const lead = heroPolaroids[0];

  return (
    <section
      id="top"
      className="relative flex min-h-[88vh] items-center justify-center overflow-hidden pt-12 pb-20"
    >
      {/* broadcast grid field + glow orbs */}
      <div aria-hidden className="bg-broadcast-grid absolute inset-0 opacity-40" />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -left-40 size-96 rounded-full bg-green/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 -bottom-40 size-96 rounded-full bg-yellow/10 blur-3xl"
      />

      <div className="wrap relative z-10 text-center">
        {/* tagline badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-green/40 bg-kraft-2 px-4 py-1.5 font-brand text-xs font-bold tracking-[0.2em] text-green uppercase shadow-[0_0_20px_rgba(0,245,212,0.35)]">
          Truth · Knowledge · Impact
        </div>

        {/* headline — gradient on the second line */}
        <h1 className="mx-auto mb-6 max-w-5xl font-brand text-[clamp(38px,7vw,72px)] leading-tight font-black tracking-tight text-white">
          We make your
          <br />
          <span className="bg-gradient-to-r from-green via-white to-yellow bg-clip-text text-transparent">
            notice board worth stopping at.
          </span>
        </h1>

        <p className="mx-auto mb-10 max-w-3xl text-[16px] leading-relaxed text-ink-2 sm:text-xl">
          {site.name} is the advertising wing of {site.owner}. Posters, reels,
          campaigns and website listings for schools and local businesses across{" "}
          {site.city} — built for broadcast, not from a template.
        </p>

        {/* max-w-md squeezed the pair until the labels wrapped mid-phrase;
            buttons now take their natural width. */}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="#enquire"
            className="flex w-full items-center justify-center gap-3 rounded-lg bg-green px-8 py-4 font-brand text-sm font-bold tracking-wider whitespace-nowrap text-kraft uppercase shadow-[0_0_20px_rgba(0,245,212,0.35)] transition-all hover:scale-105 hover:bg-white sm:w-auto"
          >
            {site.sampleOffer}
          </a>
          <a
            href="#services"
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-deep-border bg-kraft-2 px-8 py-4 font-brand text-sm font-bold tracking-wider whitespace-nowrap text-white uppercase transition-all hover:border-green hover:text-green sm:w-auto"
          >
            Media Services
          </a>
        </div>

        {/* ── lower-third featured card ── */}
        <div className="mx-auto mt-16 max-w-4xl rounded-xl bg-gradient-to-r from-green via-yellow to-green p-1 shadow-2xl">
          <div className="flex flex-col items-center justify-between gap-6 rounded-lg border border-deep-border bg-kraft p-6 text-left md:flex-row">
            <div className="flex items-center gap-4">
              <div className="flex size-14 shrink-0 items-center justify-center rounded-lg border border-green bg-green/10 text-2xl text-green">
                <Image
                  src={lead.src}
                  alt={lead.alt}
                  width={24}
                  height={24}
                  className="size-6 rounded object-cover"
                />
              </div>
              <div>
                <span className="font-brand text-xs font-bold tracking-widest text-yellow uppercase">
                  Featured work
                </span>
                <h3 className="mt-0.5 font-brand text-xl font-bold text-white">
                  {lead.caption}
                </h3>
                <p className="mt-1 text-xs text-ink-3">{lead.alt}</p>
              </div>
            </div>
            <div className="shrink-0">
              <span className="inline-block rounded bg-yellow px-4 py-2 font-brand text-xs font-black tracking-wider text-kraft uppercase">
                Real campaign
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}