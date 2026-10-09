import type { CSSProperties } from "react";
import Image from "next/image";

import { SectionHead } from "@/components/sections/Marketing";
import { faqs, paymentOptions, processSteps, testimonials } from "@/lib/site-config";
import { FaqAccordion } from "@/components/sections/FaqAccordion";
import { CopyUpi, EnquiryForm } from "@/components/sections/EnquiryForm";
import type { SiteView } from "@/lib/settings";

export function Process({ site: _site }: { site: SiteView }) {
  return (
    <section id="process" className="pt-5 pb-20">
      <div className="wrap">
        <SectionHead kicker="how it works" title="Four steps," highlight="no surprises" />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((s, i) => (
            <div
              key={s.n}
              data-reveal
              style={{ "--d": `${i * 80}ms` } as CSSProperties}
              className="card-paper relative rounded-sm p-6"
            >
              <span className="block text-[34px] leading-none font-bold tracking-[-0.02em] text-green">
                {s.n}
              </span>
              <div className="accent-rule my-4" />
              <h4 className="display text-[16px]">{s.title}</h4>
              <p className="mt-3 text-[13.5px] leading-[1.7] text-ink-2">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Voices({ site: _site }: { site: SiteView }) {
  return (
    <section id="voices" className="pt-5 pb-20">
      <div className="wrap">
        <SectionHead
          kicker="what they said"
          title="Notes back from"
          highlight="clients"
          body="Real notes from admission season and shop openings across Dhanbad."
        />

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <blockquote
              key={t.name}
              data-reveal
              style={{ "--d": `${i * 80}ms` } as CSSProperties}
              className="card-paper relative flex flex-col rounded-sm p-7"
            >
              <p aria-label="Five out of five" className="mb-4 text-[13px] tracking-[3px] text-yellow">
                ★★★★★
              </p>
              <q className="mb-5 block text-[17px] leading-[1.55] text-ink [&::before]:content-none [&::after]:content-none">
                {t.quote}
              </q>
              <footer className="mt-auto flex items-center gap-3.5 border-t border-white/10 pt-4">
                <span
                  aria-hidden
                  className="flex size-11 shrink-0 items-center justify-center rounded-full border border-green/35 bg-green/10 text-[14px] font-bold text-green"
                >
                  {t.initials}
                </span>
                <span>
                  <b className="block text-[14px] font-semibold text-ink">{t.name}</b>
                  <span className="text-[12.5px] text-ink-3">{t.role}</span>
                </span>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Pricing({ oneTime, plans, site }: { oneTime: { price: string; label: string }[]; plans: { name: string; price: string; features: string[]; badge?: string; highlight?: boolean }[]; site: SiteView }) {
  return (
    <section id="pricing" className="pt-5 pb-20">
      <div className="wrap">
        <SectionHead
          kicker="plain, honest pricing"
          title="Pick a"
          highlight="plan"
          body="One-time jobs below. Monthly retainers underneath. Every price is final — nothing hidden."
        />

        {/* one-time work */}
<div data-reveal className="card-paper rounded-sm p-7 md:p-8">
          <h4 className="display mb-5 text-[15px] text-ink-2">One-time work</h4>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {oneTime.map((o) => (
              <div key={o.price}>
                <b className="block text-[22px] leading-tight font-bold text-green">
                  {o.price}
                </b>
                <span className="mt-1 block text-[12.5px] text-ink-2">{o.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* retainers */}
        <div className="mt-8 grid items-start gap-6 md:grid-cols-3">
          {plans.map((p, i) => (
            <div
              key={p.name}
              data-reveal
              style={{ "--d": `${i * 80}ms` } as CSSProperties}
className={`relative flex flex-col rounded-sm p-7 ${
                p.highlight
                  ? "border border-green/45 bg-kraft-3 shadow-[0_24px_60px_rgba(0,245,212,0.12)]"
                  : "card-paper"
              }`}
            >
              {p.badge ? (
                <span className="absolute -top-3 right-4 rounded-full border border-yellow/40 bg-kraft-3 px-3 py-1 text-[10px] font-bold tracking-[0.16em] text-yellow uppercase">
                  {p.badge}
                </span>
              ) : null}

              <h3 className="display text-[15px] text-ink-2">{p.name}</h3>
              <p className="mt-3 text-[clamp(30px,3.2vw,42px)] leading-none font-bold tracking-[-0.02em]">
                ₹{p.price}
                <small className="text-[13px] font-bold tracking-[0.04em] text-ink-3">
                  {" "}
                  /month
                </small>
              </p>

              <ul className="my-5 flex flex-col gap-2.5">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-[14px] leading-[1.6] text-ink-2">
                    <span aria-hidden className="shrink-0 font-extrabold text-green">
                      ✓
                    </span>
                    {f}
                  </li>
                ))}
              </ul>

              <a
                href="#enquire"
className={`btn mt-auto w-full !tracking-[0.1em] !uppercase ${
                  p.highlight ? "btn-yellow" : "btn-green"
                }`}
              >
                {i === 0 ? "Start Here" : i === 1 ? "Choose Growth" : "Go Premium"}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Faq({ site: _site }: { site: SiteView }) {
  return (
    <section id="faq" className="pt-5 pb-20">
      <div className="wrap">
        <SectionHead kicker="questions we actually get" title="Ask away" />
<div data-reveal className="mx-auto max-w-[860px] border-t border-white/12">
          <FaqAccordion items={faqs} />
        </div>
      </div>
    </section>
  );
}

export function Enquire({ site }: { site: SiteView }) {
  return (
    <section id="enquire" className="pt-5 pb-20">
      <div className="wrap">
        <SectionHead
          kicker="let's start"
          title="Tell us the date,"
          highlight="we'll do the rest"
          body="Send the details and you'll have a free design sample back within 24 hours."
        />

<div data-reveal className="card-paper relative rounded-sm p-7 md:p-12">
          <div className="grid gap-10 lg:grid-cols-[1.04fr_0.96fr]">
            <EnquiryForm />

            <div className="rounded-sm border border-white/12 bg-black/25 p-6 md:p-7">
              <h4 className="display text-[14px] text-ink-2">Pay how you like</h4>
              <p className="my-3 text-[13.5px] text-ink-2">
                We keep it the same as the Olympiad process, so nothing is new for you.
              </p>

              {/* was a box labelled "UPI QR" with no code in it — a
                  placeholder dressed as a QR. Now the honest version: the
                  ID itself, one tap to copy. */}
              <div className="my-5 flex flex-wrap items-center gap-4 rounded-sm border border-green/35 bg-green/5 p-4">
                <span
                  aria-hidden
                  className="flex h-[52px] shrink-0 items-center rounded-sm bg-kraft-3 px-4 text-[15px] font-extrabold tracking-[0.08em] text-green"
                >
                  UPI
                </span>
                <span className="min-w-0 flex-1">
                  <b className="block text-[13.5px] font-semibold text-ink">
                    Online payment
                  </b>
                  <code className="font-mono text-[13px] font-semibold break-all text-green">
                    {site.upiId}
                  </code>
                </span>
                <CopyUpi upiId={site.upiId} />
              </div>

              <div className="flex flex-col gap-2.5">
                {paymentOptions.map((o) => (
                  <div
                    key={o.n}
                    className="flex gap-3 rounded-sm border border-white/10 bg-white/4 p-3.5 text-[13px] leading-[1.68] text-ink-2 transition hover:border-green/35 hover:bg-white/7"
                  >
                    <i className="shrink-0 font-bold text-green">{o.n}</i>
                    <span>
                      <b className="mb-0.5 block font-semibold text-ink">{o.title}</b>
                      {o.body}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function BigCta({ site }: { site: SiteView }) {
  return (
// was a solid teal band; now a dark panel so the teal stays reserved
    // for accents and the section does not out-shout the hero
    <section className="relative overflow-hidden border-y border-white/10 bg-black/45 py-20 text-center">
      <div aria-hidden className="absolute -top-28 -left-20 size-[300px] rounded-full bg-green/8" />
      <div aria-hidden className="absolute -right-14 -bottom-22 size-[220px] rounded-full bg-yellow/10" />

      <p className="relative z-10 text-[11px] font-semibold tracking-[0.3em] text-green uppercase">
        Truth · Knowledge · Impact
      </p>
      <h2 className="display relative z-10 mt-5 text-[clamp(30px,5.4vw,64px)]">
        Got a date?
        <br />
        We&apos;ll make it loud.
      </h2>
      <p className="relative z-10 mx-auto mt-6 max-w-[52ch] text-[15.5px] text-ink-2">
        Admission season, results day, a shop opening, a festival sale — one
        conversation is enough to start.
      </p>
      <div className="relative z-10 mt-9 flex flex-wrap justify-center gap-3">
        <a
          href="#enquire"
          className="btn btn-green !px-[34px] !py-[16px] !text-[13px] !tracking-[0.1em] !uppercase"
        >
          Get a Free Design Sample
        </a>
        <a
          href={`tel:+${site.phoneDigits}`}
          className="btn btn-white !px-[34px] !py-[16px] !text-[13px] !tracking-[0.1em] !uppercase"
        >
          {site.phone}
        </a>
      </div>
    </section>
  );
}