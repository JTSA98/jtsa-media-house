import Image from "next/image";

import { SectionHead } from "@/components/sections/Marketing";
import { Tape } from "@/components/ui/paper";
import { faqs, paymentOptions, processSteps, testimonials } from "@/lib/site-config";
import { FaqAccordion } from "@/components/sections/FaqAccordion";
import { EnquiryForm } from "@/components/sections/EnquiryForm";
import type { SiteView } from "@/lib/settings";

export function Process({ site: _site }: { site: SiteView }) {
  const tints = ["bg-sticky", "bg-kraft-2", "bg-white", "bg-[#DFF0E2]"];
  const tilts = [
    "md:-rotate-[1.2deg]",
    "md:rotate-[0.9deg]",
    "md:-rotate-[0.6deg]",
    "md:rotate-[1.4deg]",
  ];

  return (
    <section id="process" className="pt-5 pb-20">
      <div className="wrap">
        <SectionHead kicker="how it works" title="Four steps," highlight="no surprises" />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((s, i) => (
            <div
              key={s.n}
              data-reveal
              className={`relative border-[2.5px] border-ink p-6 shadow-[5px_5px_0_var(--color-ink)] ${tints[i]} ${tilts[i]}`}
            >
              <Tape className="-top-3 right-4 h-[22px] w-20 rotate-[5deg]" />
              <span className="hand block text-[46px] leading-[0.8] text-green">
                {s.n}
              </span>
              <h4 className="my-3 text-[18px] font-extrabold tracking-[-0.015em] uppercase">
                {s.title}
              </h4>
              <p className="text-[13.5px] leading-[1.7] text-ink-2">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Voices({ site: _site }: { site: SiteView }) {
  const tilts = ["md:-rotate-[0.8deg]", "md:rotate-[0.6deg]", "md:-rotate-[0.4deg]"];

  return (
    <section id="voices" className="pt-5 pb-20">
      <div className="wrap">
        <SectionHead kicker="what they said" title="Notes back from" highlight="clients" />

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <blockquote
              key={t.name}
              data-reveal
              className={`relative flex flex-col border-[2.5px] border-ink p-7 shadow-[5px_5px_0_var(--color-ink)] ${
                i === 1 ? "bg-sticky" : "bg-white"
              } ${tilts[i]}`}
            >
              <Tape className="-top-[13px] left-1/2 w-[112px] -translate-x-1/2" rotate={-3} />
              <p aria-label="Five out of five" className="mb-3 text-[15px] tracking-[3px] text-red">
                ★★★★★
              </p>
              <q className="hand mb-5 block text-[25px] leading-[1.32] text-ink [&::before]:content-none [&::after]:content-none">
                {t.quote}
              </q>
              <footer className="mt-auto flex items-center gap-3.5 border-t-[1.5px] border-dashed border-ink/25 pt-4">
                <span
                  aria-hidden
                  className="flex size-11 shrink-0 -rotate-4 items-center justify-center border-[2.5px] border-ink bg-green text-[16px] font-extrabold text-white"
                >
                  {t.initials}
                </span>
                <span>
                  <b className="block text-[14px] font-extrabold">{t.name}</b>
                  <span className="text-[12.5px] text-ink-2">{t.role}</span>
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
        <div
          data-reveal
          className="card-paper -rotate-[0.4deg] p-7 md:p-8"
        >
          <h4 className="mb-4 text-[20px] font-extrabold tracking-[-0.02em] uppercase">
            One-time work
          </h4>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {oneTime.map((o) => (
              <div key={o.price}>
                <b className="block text-[22px] leading-tight font-extrabold text-green">
                  {o.price}
                </b>
                <span className="text-[12.5px] text-ink-2">{o.label}</span>
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
              className={`relative flex flex-col border-[2.5px] border-ink p-7 shadow-[5px_5px_0_var(--color-ink)] ${
                i === 1
                  ? "rotate-[0.8deg] bg-sticky shadow-[7px_7px_0_var(--color-green)]"
                  : "bg-white " + ["md:-rotate-[1deg]", "", "md:-rotate-[0.5deg]"][i]
              }`}
            >
              {p.badge ? (
                <span className="absolute -top-[15px] right-3.5 rotate-3 border-[2.5px] border-ink bg-red px-3 py-1.5 text-[11px] font-extrabold tracking-[0.13em] text-white uppercase">
                  {p.badge}
                </span>
              ) : null}

              <h3 className="hand text-[36px] leading-none">{p.name}</h3>
              <p className="text-[clamp(32px,3.4vw,44px)] leading-none font-extrabold tracking-[-0.03em]">
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
                className={`btn mt-auto w-full ${
                  i === 1 ? "btn-yellow" : "bg-green text-white"
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
        <div data-reveal className="mx-auto max-w-[860px] border-t-[2.5px] border-ink">
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

        <div
          data-reveal
          className="relative border-[2.5px] border-ink bg-white p-7 shadow-[7px_7px_0_var(--color-ink)] md:p-14"
        >
          <Tape className="-top-[14px] left-[12%] -rotate-3" />

          <div className="grid gap-10 lg:grid-cols-[1.04fr_0.96fr]">
            <EnquiryForm />

            <div className="rotate-[0.5deg] border-[2.5px] border-ink bg-kraft-2 p-6 shadow-[5px_5px_0_var(--color-ink)] md:p-7">
              <h4 className="text-[21px] font-extrabold tracking-[-0.02em] uppercase">
                Pay how you like
              </h4>
              <p className="my-1.5 text-[13.5px] text-ink-2">
                We keep it the same as the Olympiad process, so nothing is new for you.
              </p>

              <div className="my-5 flex items-center gap-4 border-[2.5px] border-dashed border-green bg-white p-3.5">
                <div
                  aria-hidden
                  className="flex size-[78px] shrink-0 items-center justify-center bg-ink text-[9px] leading-[1.25] font-extrabold text-white"
                >
                  UPI
                  <br />
                  QR
                </div>
                <div>
                  <b className="block text-[13.5px] font-bold">Online payment</b>
                  <code className="font-mono text-[12.5px] font-bold text-green">{site.upiId}</code>
                </div>
              </div>

              <div className="flex flex-col gap-2.5">
                {paymentOptions.map((o) => (
                  <div
                    key={o.n}
                    className="flex gap-3 border-2 border-ink bg-white p-3.5 text-[13px] leading-[1.68] text-ink-2 transition hover:translate-x-[3px] hover:border-green hover:bg-sticky"
                  >
                    <i className="shrink-0 font-extrabold text-green">{o.n}</i>
                    <span>
                      <b className="mb-0.5 block font-bold text-ink">{o.title}</b>
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
    <section className="relative overflow-hidden bg-green py-20 text-center text-white">
      <div aria-hidden className="absolute -top-28 -left-20 size-[300px] rounded-full bg-white/9" />
      <div aria-hidden className="absolute -right-14 -bottom-22 size-[220px] rounded-full bg-yellow/22" />

      <h2 className="relative z-10 text-[clamp(34px,6.4vw,78px)] leading-none font-extrabold tracking-[-0.035em] uppercase">
        Got a date?
        <br />
        We&apos;ll make it loud.
      </h2>
      <p className="relative z-10 mx-auto mt-5 max-w-[52ch] text-[16px] text-white/93">
        Admission season, results day, a shop opening, a festival sale — one
        conversation is enough to start.
      </p>
      <div className="relative z-10 mt-9 flex flex-wrap justify-center gap-3">
        <a href="#enquire" className="btn btn-yellow text-[15.5px] px-[38px] py-[19px]">
          Get a Free Design Sample
        </a>
        <a href={`tel:+${site.phoneDigits}`} className="btn btn-white text-[15.5px] px-[38px] py-[19px]">
          {site.phone}
        </a>
      </div>
    </section>
  );
}