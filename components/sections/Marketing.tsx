import { Tape } from "@/components/ui/paper";
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
    <div className="shead relative mb-13 text-center" data-reveal>
      <Tape className="-top-[26px] left-1/2 -translate-x-1/2" />
      <p className="hand -rotate-[1.6deg] text-[29px] leading-none text-red">
        {kicker}
      </p>
      <h2 className="mt-2.5 text-[clamp(30px,5.2vw,56px)] leading-none font-extrabold tracking-[-0.032em] uppercase">
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
              className={`card-paper relative p-8 transition-[transform,box-shadow,background-color] duration-200 hover:translate-x-1 hover:-translate-y-1 hover:bg-sticky hover:shadow-[10px_10px_0_rgba(43,38,32,0.92)] md:hover:rotate-0 ${
                i % 2 === 0 ? "md:-rotate-[0.7deg]" : "md:rotate-[0.6deg]"
              }`}
            >
              <Tape className="-top-[13px] left-1/2 w-[112px] -translate-x-1/2" rotate={-2.5} />

              <p className="text-[12px] font-extrabold tracking-[0.22em] text-green">
                {s.num}
              </p>
              <h3 className="mt-2.5 text-[clamp(21px,2.5vw,29px)] leading-[1.1] font-extrabold tracking-[-0.022em] uppercase">
                {s.title}
              </h3>
              <p className="mb-5 text-[14.5px] leading-[1.72] text-ink-2">{s.body}</p>

              <div className="mb-5 flex flex-wrap gap-1.5">
                {s.tags.map((t) => (
                  <span
                    key={t}
                    className="border-2 border-ink bg-white px-2 py-[3px] text-[11px] font-bold"
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
    <div className="grid grid-cols-2 border-y-[2.5px] border-ink bg-kraft-2 md:grid-cols-4">
      {site.stats.map((s, i) => (
        <div
          key={s.label}
          className={`px-5 py-8 text-center ${
            i !== site.stats.length - 1 ? "border-r-2 border-dashed border-ink/25" : ""
          } ${i < 2 ? "border-b-2 border-dashed border-ink/25 md:border-b-0" : ""} ${
            i % 2 === 1 ? "md:border-r-0" : ""
          }`}
        >
          <b className="block text-[clamp(34px,4.4vw,52px)] leading-none font-extrabold tracking-[-0.035em] text-green">
            {s.value}
          </b>
          <span className="mt-2 block text-[10.5px] font-bold tracking-[0.18em] text-ink-2 uppercase">
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
          ].map((a, i) => (
            <div
              key={a.highlight}
              data-reveal
              className={`card-white p-8 ${a.tilt}`}
            >
              <h3 className="text-[clamp(24px,3vw,34px)] leading-[1.05] font-extrabold tracking-[-0.025em] uppercase">
                {a.heading} <span className="text-green">{a.highlight}</span>
              </h3>
              <p className="my-4 text-[14.5px] text-ink-2">{a.intro}</p>
              <ul className="flex flex-col">
                {a.points.map(([title, body]) => (
                  <li
                    key={title}
                    className="flex items-start gap-3 border-b-[1.5px] border-dashed border-ink/20 py-3 text-[14.5px] text-ink-2 last:border-b-0"
                  >
                    <span aria-hidden className="shrink-0 font-extrabold text-green">
                      ✓
                    </span>
                    <span>
                      <b className="mb-px block font-bold text-ink">{title}</b>
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
              className={`group relative bg-white pt-3 pr-3 pb-[42px] pl-3 shadow-[0_13px_30px_rgba(43,38,32,0.25)] transition duration-200 hover:z-20 hover:rotate-0 hover:scale-[1.06] hover:shadow-[0_22px_46px_rgba(43,38,32,0.36)] ${
                ["-rotate-[2.6deg]", "rotate-[1.7deg]", "-rotate-[1.1deg]", "rotate-[2.7deg]", "-rotate-[1.8deg]", "rotate-[1.2deg]"][i]
              }`}
            >
              <Tape className="-top-3 left-1/2 h-[23px] w-[92px] -translate-x-1/2" rotate={-4} />
              <div className="relative h-[212px] w-full overflow-hidden">
                <Image
                  src={w.src}
                  alt={w.alt}
                  fill
                  sizes="(max-width: 640px) 92vw, (max-width: 1024px) 44vw, 30vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="hand absolute right-3 bottom-2 left-3 text-center text-[20px] leading-none text-[#5A5148]">
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
    <div className="marq my-6 -rotate-[0.8deg] scale-[1.035] overflow-hidden bg-ink py-[15px] whitespace-nowrap text-kraft">
      <div className="animate-marquee inline-block">
        {[0, 1].map((dup) => (
          <span key={dup}>
            {items.map((label) => (
              <span key={label} className="mr-11 inline-block text-[19px] font-extrabold uppercase">
                {label} <i className="not-italic text-yellow">✦</i>
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}

export { SectionHead };