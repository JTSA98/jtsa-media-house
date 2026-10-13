import type { CSSProperties } from "react";
import { Check, Play } from "lucide-react";

import { PayButton } from "@/components/payments/PayButton";
import { SectionHead } from "@/components/sections/Marketing";
import { FaqAccordion } from "@/components/sections/FaqAccordion";
import { CopyUpi, EnquiryForm } from "@/components/sections/EnquiryForm";
import { faqs, offlineAddOns, paymentOptions, processSteps, testimonials, vipPass } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import type { SiteView } from "@/lib/settings";

/* ── Featured broadcast block (the reference layout's "Olympiad" panel,
      fed with our real process steps) ─────────────────────────────── */

export function Process({ site: _site }: { site: SiteView }) {
  return (
    <section id="process" className="relative py-24">
      <div className="wrap">
        <div className="mb-12 flex flex-col items-start justify-between md:flex-row md:items-end">
          <div>
            <div className="mb-2 font-brand text-xs font-bold tracking-[0.25em] text-green uppercase">
              How it works
            </div>
            <h2 className="font-brand text-3xl font-black text-white sm:text-4xl">
              From brief to broadcast
            </h2>
          </div>
          <p className="mt-4 max-w-md text-sm text-ink-3 md:mt-0">
            Four steps, no surprises. You approve before anything goes to the
            printer or goes live.
          </p>
        </div>

        <div className="glass-card overflow-hidden rounded-2xl border border-deep-border p-6 sm:p-8">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
            {/* left: steps */}
            <div className="space-y-6 lg:col-span-7">
              <div className="lower-third inline-flex items-center overflow-hidden rounded bg-kraft border border-green/50">
                <span className="bg-green px-3 py-1 font-brand text-xs font-black text-kraft">
                  JTSA Media
                </span>
                <span className="px-4 py-1 text-xs font-bold tracking-wider text-white uppercase">
                  The standard process
                </span>
              </div>

              <h3 className="font-brand text-2xl font-extrabold text-white sm:text-3xl">
                Four steps, four clean handoffs
              </h3>

              <div className="grid grid-cols-1 gap-4 text-xs font-semibold sm:grid-cols-2">
                {processSteps.map((s, i) => (
                  <div
                    key={s.n}
                    data-reveal
                    style={{ "--d": `${i * 70}ms` } as CSSProperties}
                    className="flex items-start gap-2.5 rounded-lg border border-deep-border bg-kraft/50 p-3.5 text-ink-2"
                  >
                    <Check size={15} className="mt-0.5 shrink-0 text-green" />
                    <div>
                      <b className="block font-brand text-[13px] text-white">
                        {s.n}. {s.title}
                      </b>
                      <p className="mt-1 text-[12px] leading-relaxed font-normal text-ink-3">
                        {s.body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-4 pt-2">
                <a
                  href="#enquire"
                  className="flex items-center gap-2 rounded bg-yellow px-6 py-3 font-brand text-xs font-bold text-kraft transition-all hover:bg-white"
                >
                  <Play size={13} fill="currentColor" /> Start a project
                </a>
                <a
                  href="#services"
                  className="rounded border border-slate-600 px-6 py-3 font-brand text-xs font-bold text-white transition-all hover:border-green hover:text-green"
                >
                  View services
                </a>
              </div>
            </div>

            {/* right: preview panel */}
            <div className="lg:col-span-5">
              <div className="relative overflow-hidden rounded-xl border-2 border-deep-border transition-colors hover:border-green">
                <div className="relative flex h-64 w-full flex-col justify-between bg-black/40 p-6">
                  <div className="flex items-start justify-between">
                    <span className="rounded bg-red-600 px-2 py-0.5 font-brand text-[10px] font-bold tracking-widest text-white uppercase">
                      ● In progress
                    </span>
                    <span className="font-mono text-xs text-ink-3">
                      {processSteps.length} steps
                    </span>
                  </div>

                  <div className="my-auto flex items-center justify-center">
                    <div className="flex size-16 items-center justify-center rounded-full bg-green/90 text-xl font-bold text-kraft shadow-[0_0_20px_rgba(0,245,212,0.35)] transition-transform hover:scale-110">
                      <Play size={22} className="ml-1" fill="currentColor" />
                    </div>
                  </div>

                  <div>
                    <p className="font-brand text-xs font-bold text-green">
                      STEP 01
                    </p>
                    <p className="font-brand text-sm font-bold text-white">
                      {processSteps[0].title}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Testimonials ────────────────────────────────────────────────── */

export function Voices({ site: _site }: { site: SiteView }) {
  return (
    <section id="voices" className="border-y border-deep-border bg-kraft-2/40 py-24">
      <div className="wrap">
        <SectionHead
          kicker="What they said"
          title="Notes back from"
          highlight="clients"
          body="Real notes from admission season and shop openings across Dhanbad."
        />

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <blockquote
              key={t.name}
              data-reveal
              style={{ "--d": `${i * 80}ms` } as CSSProperties}
              className="glass-card glass-card-hover flex flex-col rounded-xl p-7"
            >
              <p aria-label="Five out of five" className="mb-4 tracking-[3px] text-yellow">
                ★★★★★
              </p>
              <q className="mb-5 block text-[16px] leading-[1.6] text-ink [&::before]:content-none [&::after]:content-none">
                {t.quote}
              </q>
              <footer className="mt-auto flex items-center gap-3 border-t border-deep-border pt-4">
                <span
                  aria-hidden
                  className="flex size-11 shrink-0 items-center justify-center rounded-full border border-green/35 bg-green/10 font-brand text-sm font-bold text-green"
                >
                  {t.initials}
                </span>
                <span>
                  <b className="block font-brand text-sm font-semibold text-white">
                    {t.name}
                  </b>
                  <span className="text-xs text-ink-3">{t.role}</span>
                </span>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Pricing ─────────────────────────────────────────────────────── */

export function Pricing({
  oneTime,
  plans,
  site,
  offlineAddOns: addOns,
}: {
  oneTime: { price: string; label: string; payKey: string; payLabel: string }[];
  plans: {
    id: string;
    name: string;
    tagline: string;
    price: string;
    features: string[];
    physical: string[];
    badge?: string;
    highlight?: boolean;
    period: string;
    payKey: string;
    payLabel: string;
  }[];
  site: SiteView;
  offlineAddOns: (typeof offlineAddOns)[number][];
}) {
  /* rates resolve from the admin panel; the shape stays in site-config */
  const rateFor = (id: string): string | null => {
    const r = site.offlineRates as Record<string, string>;
    return r[id] ?? null;
  };
  return (
    <section id="packages" className="py-24">
      <div className="wrap">
        <SectionHead
          kicker="Official rate card"
          title="Creator combos &"
          highlight="ground packages"
          body="Every tier bundles a digital creator swarm with physical ground execution. One price, one team."
        />

        {/* ── combo tiers ── */}
        <div className="grid items-start gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {plans.map((p, i) => (
            <div
              key={p.id}
              data-reveal
              style={{ "--d": `${i * 80}ms` } as CSSProperties}
              className={cn(
                "glass-card relative flex flex-col rounded-xl p-7",
                p.highlight &&
                  "border-2 border-yellow/60 bg-gradient-to-b from-kraft-2/80 to-kraft shadow-[0_0_30px_-10px_rgba(255,184,0,0.4)]",
              )}
            >
              {p.badge ? (
                <span
                  className={cn(
                    "absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 font-brand text-[10px] font-black tracking-widest uppercase",
                    p.highlight
                      ? "bg-yellow text-kraft"
                      : "border border-yellow/40 bg-kraft text-yellow",
                  )}
                >
                  {p.badge}
                </span>
              ) : null}

              <h3 className="mt-1 font-brand text-lg font-extrabold text-white">
                {p.name}
              </h3>
              <p className="mt-1.5 text-[11px] leading-relaxed text-ink-3">
                {p.tagline}
              </p>

              <div className="mt-5 rounded-xl border border-deep-border bg-kraft/60 p-4">
                <p className="font-brand text-[30px] leading-none font-black tracking-tight text-white">
                  ₹{p.price}
                </p>
                <p className="mt-1 text-[11px] font-semibold text-ink-3">
                  {p.period}
                </p>
              </div>

              <p className="mt-5 mb-2 font-brand text-[10px] font-bold tracking-widest text-green uppercase">
                Digital
              </p>
              <ul className="flex flex-col gap-2">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-[13px] leading-snug text-ink-2">
                    <Check size={14} className="mt-0.5 shrink-0 text-green" />
                    {f}
                  </li>
                ))}
              </ul>

              <p className="mt-5 mb-2 font-brand text-[10px] font-bold tracking-widest text-yellow uppercase">
                Physical ground
              </p>
              <ul className="flex flex-col gap-2">
                {p.physical.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-[13px] leading-snug text-ink-2">
                    <Check size={14} className="mt-0.5 shrink-0 text-yellow" />
                    {f}
                  </li>
                ))}
              </ul>

              <a
                href="#enquire"
                className={`btn mt-auto w-full !text-[12px] !tracking-[0.1em] !uppercase ${
                  p.highlight ? "btn-yellow" : "btn-green"
                }`}
                style={{ marginTop: "1.75rem" }}
              >
                Book {p.name.split(" ").slice(-1)[0]}
              </a>
              <PayButton
                kind="plan"
                itemKey={p.payKey}
                label={p.payLabel}
                className="mt-2.5"
              />
            </div>
          ))}
        </div>

        {/* ── standalone VIP pass ── */}
        <div
          data-reveal
          className="mt-8 flex flex-col items-center justify-between gap-6 rounded-2xl border border-yellow/30 bg-kraft-2/70 p-7 md:flex-row md:p-8"
        >
          <div className="max-w-2xl">
            <span className="mb-3 inline-block rounded-full border border-yellow/30 bg-yellow/10 px-3 py-1 font-brand text-[10px] font-bold tracking-widest text-yellow uppercase">
              Standalone annual option
            </span>
            <h3 className="font-brand text-2xl font-extrabold text-white md:text-3xl">
              Prefer to pay as you go?
            </h3>
            <p className="mt-2 text-[13.5px] leading-relaxed text-ink-2">
              Take the <b className="text-yellow">₹{site.vipPass.price}</b>{" "}
              membership pass instead of a combo and unlock {site.vipPass.benefit}.
            </p>
          </div>
          <div className="shrink-0 text-center">
            <p className="font-brand text-4xl font-black text-yellow">
              ₹{site.vipPass.price}
              <span className="text-xs font-normal text-ink-3">
                {" "}
                {site.vipPass.period}
              </span>
            </p>
            <a href="#enquire" className="btn btn-yellow mt-3">
              Get VIP Pass
            </a>
          </div>
        </div>

        {/* ── one-time design work ── */}
        <div data-reveal className="glass-card mt-8 rounded-xl border border-deep-border p-7 md:p-8">
          <h4 className="mb-5 font-brand text-xs font-bold tracking-[0.2em] text-ink-3 uppercase">
            One-time design & print
          </h4>
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {oneTime.map((o) => (
              <div key={o.price} className="flex flex-col">
                <b className="font-brand text-2xl leading-tight font-black text-green">
                  {o.price}
                </b>
                <span className="mt-1 block text-xs text-ink-2">{o.label}</span>
                <PayButton
                  kind="job"
                  itemKey={o.payKey}
                  label={o.payLabel}
                  className="mt-3"
                />
              </div>
            ))}
          </div>
        </div>

        {/* ── offline rate card ── */}
        <div className="mt-16">
          <div className="mb-10 text-center" data-reveal>
            <p className="mb-2 font-brand text-xs font-bold tracking-[0.25em] text-green uppercase">
              Physical &amp; ground services
            </p>
            <h3 className="font-brand text-2xl font-black text-white sm:text-3xl">
              On-ground marketing rate card
            </h3>
            <p className="mx-auto mt-3 max-w-[54ch] text-sm text-ink-3">
              Quote any single service on its own, without taking a combo.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {addOns.map((o, i) => (
              <article
                key={o.id}
                data-reveal
                style={{ "--d": `${(i % 3) * 70}ms` } as CSSProperties}
                className={cn(
                  "glass-card glass-card-hover rounded-xl p-6",
                  o.onRequest && "border-dashed",
                )}
              >
                <h4 className="font-brand text-lg font-bold text-white">
                  {o.title}
                </h4>
                <p className="mt-2 text-[13px] leading-relaxed text-ink-3">
                  {o.body}
                </p>
                <p className="mt-4 font-brand text-2xl font-extrabold text-white">
                  {rateFor(o.id) ?? o.rate}
                  <span className="text-[11px] font-normal text-ink-3">
                    {" "}
                    {o.unit}
                  </span>
                </p>
                <ul className="mt-4 flex flex-col gap-1.5">
                  {o.points.map((p) => (
                    <li key={p} className="flex items-start gap-2 text-xs text-ink-2">
                      <Check size={13} className="mt-0.5 shrink-0 text-green" />
                      {p}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── FAQ ─────────────────────────────────────────────────────────── */

export function Faq({ site: _site }: { site: SiteView }) {
  return (
    <section id="faq" className="border-t border-deep-border bg-kraft-2/30 py-24">
      <div className="wrap">
        <SectionHead kicker="Questions we actually get" title="Ask away" />
        <div
          data-reveal
          className="glass-card mx-auto max-w-[900px] rounded-xl border border-deep-border px-6 md:px-8"
        >
          <FaqAccordion items={faqs} />
        </div>
      </div>
    </section>
  );
}

/* ── Enquiry ─────────────────────────────────────────────────────── */

export function Enquire({ site }: { site: SiteView }) {
  return (
    <section id="enquire" className="relative py-24">
      <div className="wrap">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <div className="mb-2 font-brand text-xs font-bold tracking-[0.25em] text-green uppercase">
            Let&apos;s start
          </div>
          <h2 className="font-brand text-3xl font-black text-white sm:text-5xl">
            Submit a press release or inquiry
          </h2>
          <p className="mt-3 text-sm text-ink-2">
            Send the details and you&apos;ll have a free design sample back within 24
            hours.
          </p>
        </div>

        <div
          data-reveal
          className="glass-card relative rounded-2xl border border-deep-border p-8 shadow-2xl sm:p-12"
        >
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
            <EnquiryForm />

            <div className="rounded-xl border border-deep-border bg-kraft/60 p-6">
              <h4 className="font-brand text-xs font-bold tracking-[0.2em] text-ink-3 uppercase">
                Pay how you like
              </h4>
              <p className="my-3 text-[13px] text-ink-2">
                Same process as the Olympiad, so nothing is new for you.
              </p>

              <div className="my-5 flex flex-wrap items-center gap-4 rounded-lg border border-green/35 bg-green/5 p-4">
                <span
                  aria-hidden
                  className="flex h-[52px] shrink-0 items-center rounded bg-kraft-2 px-4 font-brand text-sm font-black tracking-widest text-green"
                >
                  UPI
                </span>
                <span className="min-w-0 flex-1">
                  <b className="block text-[13.5px] font-semibold text-white">
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
                    className="flex gap-3 rounded-lg border border-deep-border bg-kraft/50 p-3.5 text-[13px] leading-relaxed text-ink-2 transition-colors hover:border-green/50"
                  >
                    <span className="shrink-0 font-brand font-bold text-green">
                      {o.n}
                    </span>
                    <span>
                      <b className="mb-0.5 block font-brand text-white">{o.title}</b>
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

/* ── Closing CTA ─────────────────────────────────────────────────── */

export function BigCta({ site }: { site: SiteView }) {
  return (
    <section className="relative overflow-hidden border-y border-deep-border bg-black/45 py-24 text-center">
      <div aria-hidden className="absolute -top-28 -left-20 size-[300px] rounded-full bg-green/8" />
      <div aria-hidden className="absolute -right-14 -bottom-22 size-[220px] rounded-full bg-yellow/10" />

      <p className="relative z-10 font-brand text-xs font-bold tracking-[0.3em] text-green uppercase">
        Truth · Knowledge · Impact
      </p>
      <h2 className="relative z-10 mt-5 font-brand text-[clamp(30px,5.4vw,60px)] font-black text-white">
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
          className="flex items-center justify-center gap-2 rounded-lg bg-green px-8 py-4 font-brand text-[13px] font-bold tracking-[0.1em] text-kraft uppercase shadow-[0_0_20px_rgba(0,245,212,0.35)] transition-all hover:bg-white"
        >
          {site.sampleOffer}
        </a>
        <a
          href={`tel:+${site.phoneDigits}`}
          className="flex items-center justify-center rounded-lg border border-deep-border bg-kraft-2 px-8 py-4 font-brand text-[13px] font-bold tracking-[0.1em] text-white uppercase transition-all hover:border-green hover:text-green"
        >
          {site.phone}
        </a>
      </div>
    </section>
  );
}