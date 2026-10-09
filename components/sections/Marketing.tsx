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
      <p className="text-[11px] font-semibold tracking-[0.3em] text-green uppercase">
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
          kicker="what we actually do"
          title="Four things,"
          highlight="done properly"
          body="No retainers disguised as agency fees. Every job gets a fixed price, a fixed deadline and one clear owner."
        />

<div className="grid gap-6 md:grid-cols-2">
          {services.map((s, i) => (
            <article
              key={s.slug}
              data-reveal
              className="card-paper relative rounded-sm p-8 transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-green/35 hover:shadow-[0_24px_60px_rgba(0,245,212,0.1)]"
            >
              <p className="text-[11px] font-bold tracking-[0.24em] text-green">
                {s.num}
              </p>
              <h3 className="display mt-3 text-[clamp(19px,2.1vw,24px)]">
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
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function StatsBand({ site }: { site: SiteView }) {
  return (
<div className="grid grid-cols-2 border-y border-white/10 bg-black/25 md:grid-cols-4">
      {site.stats.map((s, i) => (
        <div
          key={s.label}
          className={`px-5 py-9 text-center ${
            i !== site.stats.length - 1 ? "border-r border-white/10" : ""
          } ${i < 2 ? "border-b border-white/10 md:border-b-0" : ""} ${
            i % 2 === 1 ? "md:border-r-0" : ""
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
  return (
    <section id="rooms" className="py-20">
      <div className="wrap">
        <SectionHead
          kicker="who we work with"
          title="Two kinds of"
          highlight="client, one team"
          body="We started with schools because we already knew how they work. Now local businesses use the same process."
        />

        <div className="grid gap-6 md:grid-cols-2">
          {[
            {
              tilt: "md:-rotate-[0.6deg]",
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
              tilt: "md:rotate-[0.5deg]",
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
].map((a) => (
            <div key={a.highlight} data-reveal className="card-paper rounded-sm p-8">
              <h3 className="display text-[clamp(21px,2.4vw,28px)]">
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
                      <b className="mb-px block font-semibold text-ink">{title}</b>
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
          kicker="pinned to the wall"
          title="Recent"
          highlight="work"
          body="Real campaigns from the last admission season. No stock photos, no mock-ups."
        />

        <div className="grid gap-6 px-2.5 py-3 sm:grid-cols-2 lg:grid-cols-3">
          {work.map((w, i) => (
<figure
              key={w.src + i}
              data-reveal
              className="group relative rounded-sm border border-white/12 bg-kraft-2 p-2.5 pb-9 shadow-[0_18px_44px_rgba(2,6,12,0.55)] transition duration-300 hover:z-20 hover:border-green/35 hover:scale-[1.03]"
            >
              <div className="relative h-[212px] w-full overflow-hidden rounded-sm">
                <Image
                  src={w.src}
                  alt={w.alt}
                  fill
                  sizes="(max-width: 640px) 92vw, (max-width: 1024px) 44vw, 30vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="absolute right-3 bottom-2.5 left-3 truncate text-center text-[10.5px] font-semibold tracking-[0.14em] text-ink-3 uppercase">
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
    "Posters",
    "Banners",
    "Flex",
    "Standees",
    "Reels",
    "Social Ads",
    "Website Listing",
    "48h Delivery",
  ];

  return (
<div className="my-6 overflow-hidden border-y border-white/10 bg-black/35 py-4 whitespace-nowrap">
      <div className="animate-marquee inline-block">
        {[0, 1].map((dup) => (
          <span key={dup}>
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