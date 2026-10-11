import type { CSSProperties } from "react";
import { PayButton } from "@/components/payments/PayButton";
import { services, work } from "@/lib/site-config";
import type { SiteView } from "@/lib/settings";
import { setting } from "@/lib/settings";
import Image from "next/image";

function SectionHead({
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
    <div className="relative mb-13 text-center" data-reveal>
      <p className="text-[11px] font-bold tracking-[0.3em] text-green uppercase">
        {kicker}
      </p>
      <h2 className="display mt-4 text-[clamp(28px,4.6vw,52px)]">
        {title}
        {highlight ? (
          <>
            <br />
            <span className="text-green">{highlight}</span>
          </>
        ) : null}
      </h2>
      {body ? <p className="mx-auto mt-4 max-w-[54ch] text-[15.5px] text-ink-2">{body}</p> : null}
    </div>
  );
}

export function Services({ site }: { site: SiteView }) {
  return (
    <section id="services" className="py-20">
      <div className="wrap">
        <SectionHead
          kicker="commercial capabilities"
          title="Engineered for"
          highlight="Maximum Footfall & Revenue"
          body="No vague retainers disguised as agency fees. Every project gets high-res production, guaranteed delivery timelines, and measurable Dhanbad impact."
        />

        <div className="grid gap-6 md:grid-cols-2">
          {services.map((s, i) => (
            <article
              key={s.slug}
              data-reveal
              style={{ "--d": `${i * 80}ms` } as CSSProperties}
              className="bento-card rounded-2xl p-8"
            >
              <p className="text-[11px] font-bold tracking-[0.24em] text-green">
                {s.num}
              </p>
              <h3 className="display mt-3 text-[clamp(19px,2.1vw,24px)] text-white">
                {s.title}
              </h3>
              <p className="mb-5 text-[14.5px] leading-[1.72] text-ink-2">{s.body}</p>

              <div className="mb-5 flex flex-wrap gap-1.5">
                {s.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-white/14 bg-white/6 px-2.5 py-[3px] text-[10.5px] font-semibold tracking-[0.06em] text-ink-2"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <p className="text-[30px] leading-none font-extrabold tracking-[-0.02em] text-green">
                {setting(site.raw, `service.${s.slug}.price`, s.price)}
                <small className="mt-1 block text-[10.5px] font-bold tracking-[0.14em] text-ink-3 uppercase">
                  {setting(site.raw, `service.${s.slug}.price_note`, s.priceNote)}
                </small>
              </p>
              <PayButton
                kind="job"
                itemKey={`service.${s.slug}`}
                label={`Pay ${setting(site.raw, `service.${s.slug}.price`, s.price)} online`}
                className="mt-5 max-w-[280px]"
              />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function StatsBand({ site }: { site: SiteView }) {
  return (
    <div className="grid grid-cols-2 border-y border-white/10 bg-black/40 md:grid-cols-4">
      {site.stats.map((s, i) => (
        <div
          key={s.label}
          className={`border-white/10 px-5 py-9 text-center ${
            i % 2 === 0 ? "border-r" : ""
          } ${i < 2 ? "border-b md:border-b-0" : ""} ${
            i < site.stats.length - 1 ? "md:border-r" : "md:border-r-0"
          }`}
        >
          <b className="block text-[clamp(32px,4vw,46px)] leading-none font-bold tracking-[-0.02em] text-green">
            {s.value}
          </b>
          <span className="mt-3 block text-[10px] font-semibold tracking-[0.2em] text-ink-3 uppercase">
            {s.label}
          </span>
        </div>
      ))}
    </div>
  );
}

export function Audiences({ site: _site }: { site: SiteView }) {
  const sectors = [
    {
      heading: "For",
      highlight: "Gold & Jewellery Showrooms",
      intro:
        "Dhanteras, Akshaya Tritiya, and Wedding Season campaigns. High-impact billboards at Bank More & Steel Gate with 4K macro video reels.",
      points: [
        ["Festive & Wedding Season Blitz", "Coordinated roadside hoardings, promotional flyers, and social reels on one schedule."],
        ["4K Macro Jewellery Shoots", "Close-up macro video reels highlighting bridal collections, sparkle, and hallmark trust."],
        ["Prime Highway & City Billboards", "High-visibility flex hoardings at Bank More, Hirapur, and main Dhanbad crossings."],
        ["Hyper-Targeted Local Footfall Ads", "Meta ad campaigns targeting high-income Dhanbad families for festive shopping."],
        ["Corporate GST Invoicing", "Complete business accounting compliance with instant digital receipts."],
      ],
    },
    {
      heading: "For",
      highlight: "Gyms & Fitness Centers",
      intro:
        "High-energy 30-sec kinetic reels, annual membership enrollment drives, and city hotspot promotional standees.",
      points: [
        ["Viral Workout Reels", "Kinetic transformation videos with hard-hitting sound design and trainer spotlights."],
        ["Seasonal Membership Drives", "Massive enrollment campaigns driving hundreds of annual memberships."],
        ["Showroom Walkthroughs", "30s 4K tours showcasing world-class equipment and personal training facilities."],
        ["City Hotspot Standees", "Deluxe 6x2.5 ft roll-up standees placed at popular Dhanbad malls and markets."],
        ["Predictable Retainer Budget", "Fixed monthly fee with zero agency retainer surprises."],
      ],
    },
    {
      heading: "For",
      highlight: "Auto Dealers & Mega Retail",
      intro:
        "Grand showroom openings, new vehicle launches, and festival discount clearance campaigns with high-impact outdoor flex.",
      points: [
        ["Grand Opening Blitz", "Mega flex hoardings, directional street signage, and showroom launch coverage."],
        ["Festive Clearance Drives", "High-urgency promotional graphics and reels designed for immediate footfall."],
        ["Inquiry Automation", "Click-to-WhatsApp digital ads connecting car/bike buyers directly to your sales floor."],
        ["Showroom Hardware", "Roll-up aluminum standees and high-gloss promotional brochures."],
      ],
    },
    {
      heading: "For",
      highlight: "Corporates & Real Estate",
      intro:
        "Residential project booking drives, healthcare announcements, industrial films, and regional Dhanbad brand presence.",
      points: [
        ["Real Estate Project Launches", "3D architectural render flex, site boundary branding, and booking launch reels."],
        ["Healthcare Announcements", "New doctor onboarding campaigns and hospital department banners."],
        ["Official JTSA Directory Page", "Verified institutional profile on the high-traffic JTSA ecosystem."],
        ["Corporate Billing", "Official GST invoices with flexible NEFT/RTGS payment settlement."],
      ],
    },
  ];

  return (
    <section id="sectors" className="py-20">
      <div className="wrap">
        <SectionHead
          kicker="commercial industries"
          title="Engineered for"
          highlight="Dhanbad's Top Sectors"
          body="Whether you operate a high-turnover jewelry showroom, a premium gym, an auto dealership, or a corporate enterprise, we have specialized advertising playbooks."
        />

        <div className="grid gap-6 md:grid-cols-2">
          {sectors.map((a) => (
            <div key={a.highlight} data-reveal className="bento-card rounded-2xl p-8">
              <h3 className="display text-[clamp(21px,2.4vw,28px)] text-white">
                {a.heading} <span className="text-green">{a.highlight}</span>
              </h3>
              <p className="my-5 text-[14.5px] text-ink-2">{a.intro}</p>
              <ul className="flex flex-col">
                {a.points.map(([title, body]) => (
                  <li
                    key={title}
                    className="flex items-start gap-3 border-b border-white/8 py-3.5 text-[14.5px] text-ink-2 last:border-b-0"
                  >
                    <span aria-hidden className="shrink-0 font-bold text-green">
                      ✓
                    </span>
                    <span>
                      <b className="mb-px block font-semibold text-white">{title}</b>
                      {body}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Work({ site: _site }: { site: SiteView }) {
  return (
    <section id="work" className="pt-5 pb-20">
      <div className="wrap">
        <SectionHead
          kicker="proven commercial impact"
          title="Selected Commercial"
          highlight="Campaigns & Print"
          body="Real hoardings, commercial video shoots, and print hardware executed across Dhanbad. No stock graphics."
        />

        <div className="grid gap-6 px-2.5 py-3 sm:grid-cols-2 lg:grid-cols-3">
          {work.map((w, i) => (
            <figure
              key={w.src + i}
              data-reveal
              style={{ "--d": `${(i % 3) * 80}ms` } as CSSProperties}
              className="bento-card group relative rounded-2xl p-3 pb-9 transition duration-300 hover:z-20 hover:scale-[1.02]"
            >
              <div className="relative h-[212px] w-full overflow-hidden rounded-xl">
                <Image
                  src={w.src}
                  alt={w.alt}
                  fill
                  sizes="(max-width: 640px) 92vw, (max-width: 1024px) 44vw, 30vw"
                  className="object-cover group-hover:scale-105 transition duration-500"
                />
              </div>
              <figcaption className="absolute right-3 bottom-2.5 left-3 truncate text-center text-[11px] font-bold tracking-[0.14em] text-green uppercase">
                {w.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export function MarqueeBand({ site: _site }: { site: SiteView }) {
  const items = [
    "Jewellery Campaigns",
    "Gym Transformation Reels",
    "Mega Roadside Hoardings",
    "Showroom Standees",
    "4K Commercial Video",
    "Dhanbad Ad Targeting",
    "Corporate Retainers",
    "48h Express Delivery",
  ];

  return (
    <div className="marquee-band my-6 overflow-hidden border-y border-white/10 bg-black/40 py-4 whitespace-nowrap">
      <div className="animate-marquee inline-block">
        {[0, 1].map((dup) => (
          <span key={dup} aria-hidden={dup === 1}>
            {items.map((label) => (
              <span
                key={label}
                className="mr-11 inline-block text-[12px] font-bold tracking-[0.22em] text-ink-2 uppercase"
              >
                {label} <i className="not-italic text-green">✦</i>
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}

export { SectionHead };