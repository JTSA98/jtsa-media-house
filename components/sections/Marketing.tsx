import type { CSSProperties } from "react";
import { ChevronRight } from "lucide-react";

import { PayButton } from "@/components/payments/PayButton";
import { services } from "@/lib/site-config";
import type { SiteView } from "@/lib/settings";
import { setting } from "@/lib/settings";

export function SectionHead({
  kicker,
  title,
  highlight,
  body,
}: {
  kicker: string;
  title: string;
  highlight?: string;
  body?: string;
}) {
  return (
    <div className="mx-auto mb-16 max-w-3xl text-center" data-reveal>
      <p className="mb-2 font-brand text-xs font-bold tracking-[0.25em] text-green uppercase">
        {kicker}
      </p>
      <h2 className="font-brand text-3xl font-black text-white sm:text-5xl">
        {title}
        {highlight ? (
          <>
            {" "}
            <span className="text-green">{highlight}</span>
          </>
        ) : null}
      </h2>
      {body ? <p className="mt-4 text-sm text-ink-2">{body}</p> : null}
    </div>
  );
}

/* ── Services: four glass cards ──────────────────────────────────── */

export function Services({ site }: { site: SiteView }) {
  return (
    <section id="services" className="border-t border-deep-border bg-kraft-2/30 py-24">
      <div className="wrap">
        <SectionHead
          kicker="Core capabilities"
          title="Media & broadcast"
          highlight="services"
          body="Fixed price, fixed deadline, one clear owner on every job."
        />

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {services.map((s, i) => {
            const price = setting(site.raw, `service.${s.slug}.price`, s.price);
            const note = setting(site.raw, `service.${s.slug}.price_note`, s.priceNote);
            const gold = i % 2 === 1;

            return (
              <article
                key={s.slug}
                data-reveal
                style={{ "--d": `${i * 80}ms` } as CSSProperties}
                className="glass-card glass-card-hover group relative rounded-xl p-8"
              >
                <div
                  className={`mb-6 flex size-14 items-center justify-center rounded-lg border text-2xl transition-all ${
                    gold
                      ? "border-yellow/40 bg-yellow/10 text-yellow group-hover:bg-yellow group-hover:text-kraft"
                      : "border-green/40 bg-green/10 text-green group-hover:bg-green group-hover:text-kraft"
                  }`}
                >
                  <span className="font-brand text-lg font-black">{s.num}</span>
                </div>

                <h3 className="mb-3 font-brand text-xl font-bold text-white">
                  {s.title}
                </h3>
                <p className="text-xs leading-relaxed text-ink-3">{s.body}</p>

                <div className="mt-6 border-t border-deep-border pt-4">
                  <p className="font-brand text-2xl font-black tracking-tight text-green">
                    {price}
                  </p>
                  <p className="mt-0.5 text-[10px] font-bold tracking-widest text-ink-3 uppercase">
                    {note}
                  </p>
                </div>

                <PayButton
                  kind="job"
                  itemKey={`service.${s.slug}`}
                  label={`Pay ${price} online`}
                  className="mt-5"
                />
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ── Stats band ──────────────────────────────────────────────────── */

export function StatsBand({ site }: { site: SiteView }) {
  return (
    <section className="border-y border-deep-border bg-kraft-2/50 py-12">
      <div className="wrap">
        <div className="grid grid-cols-2 gap-6 text-center md:grid-cols-4">
          {site.stats.map((s, i) => (
            <div
              key={s.label}
              data-reveal
              style={{ "--d": `${i * 70}ms` } as CSSProperties}
              className="rounded-lg border border-deep-border bg-kraft p-4"
            >
              <div
                className={`font-brand text-2xl font-black sm:text-3xl ${
                  i % 3 === 1 ? "text-yellow" : i % 3 === 2 ? "text-white" : "text-green"
                }`}
              >
                {s.value}
              </div>
              <div className="mt-1 text-xs font-semibold tracking-wider text-ink-3 uppercase">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Audiences ───────────────────────────────────────────────────── */

export function Audiences({ site: _site }: { site: SiteView }) {
  const cards = [
    {
      heading: "For",
      highlight: "Schools",
      intro:
        "Admission season, exam results, science day, sports day, annual functions — the moments a school actually needs to fill.",
      points: [
        ["Admission season package", "Posters, banners, standees and reels on one schedule."],
        ["Result-day creative", "Same-day designs the moment results drop."],
        ["Event coverage", "Reels from exam day, prize distribution and certification day."],
        ["Free website listing", "Partner schools get the first JTSA listing at no cost."],
        ["Offline payment", "Pay at the school office, exactly like the Olympiad process."],
      ],
    },
    {
      heading: "For",
      highlight: "Local Business",
      intro:
        "Shops, coaching centres, clinics, showrooms and service businesses that need regular visibility without a big agency retainer.",
      points: [
        ["Openings & offers", "Creative for a new shop, sale or festival."],
        ["Social on a budget", "12 posts and 4 reels a month, fixed price."],
        ["Short video", "Product reels shot on location in Dhanbad."],
        ["Get found locally", "Website listing with map pin and tap-to-call."],
        ["Pay how you like", "UPI online, or cash at a partner school."],
      ],
    },
  ];

  return (
    <section id="rooms" className="py-24">
      <div className="wrap">
        <SectionHead
          kicker="Who we work with"
          title="Two kinds of"
          highlight="client, one team"
          body="We started with schools because we already knew how they work. Now local businesses use the same process."
        />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {cards.map((a, i) => (
            <div
              key={a.highlight}
              data-reveal
              style={{ "--d": `${i * 90}ms` } as CSSProperties}
              className="glass-card glass-card-hover rounded-xl border border-deep-border p-8"
            >
              <h3 className="font-brand text-2xl font-black text-white sm:text-3xl">
                {a.heading} <span className="text-green">{a.highlight}</span>
              </h3>
              <p className="my-5 text-sm leading-relaxed text-ink-2">{a.intro}</p>

              <div className="space-y-3 text-sm text-ink-2">
                {a.points.map(([title, body]) => (
                  <div
                    key={title}
                    className="rounded-lg border border-deep-border bg-kraft/50 p-4 transition-colors hover:border-green/50"
                  >
                    <div className="flex items-start gap-2.5">
                      <ChevronRight size={15} className="mt-0.5 shrink-0 text-green" />
                      <div>
                        <b className="block font-brand text-ink">{title}</b>
                        <p className="mt-1 text-[13px] text-ink-3">{body}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export { SectionHead as Head };