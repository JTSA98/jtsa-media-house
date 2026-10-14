import { NavBar } from "@/components/NavBar";
import { SiteFooter } from "@/components/SiteFooter";
import { Hero } from "@/components/sections/Hero";
import { Architecture, WhyCombo } from "@/components/sections/Comparison";
import { SectorPlaybooks } from "@/components/sections/SectorPlaybooks";
import { RoiCalculator } from "@/components/sections/RoiCalculator";
import { Festive } from "@/components/sections/Festive";
import { Booking } from "@/components/sections/Booking";
import { Pricing } from "@/components/sections/Content";
import { getSiteView, setting, settingList } from "@/lib/settings";
import {
  calcBasesView,
  comparisonCardsView,
  festivePhasesView,
  intensityView,
  launchPerksView,
  pillarsView,
  recallPrincipleView,
  sectorsView,
} from "@/lib/content";
import {
  faqs,
  offlineAddOns,
  oneTimeWork,
  plans as defaultPlans,
  sectors,
  site as siteDefaults,
} from "@/lib/site-config";

// always read fresh — settings change without a deploy
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const site = await getSiteView();

  // Prices, plans and the service price labels all come from settings,
  // falling back to the values in lib/site-config.ts.
  // payKey/payLabel ride along so the Pay buttons charge exactly what is
  // shown — the API re-resolves the amount server-side from the same keys.
  const flexAdvance = setting(site.raw, "pay.flex_advance", "500");
  const oneTime = [
    { price: setting(site.raw, "price.flex", oneTimeWork[0].price), label: setting(site.raw, "price.flex_note", oneTimeWork[0].label), payKey: "job.flex_advance", payLabel: `Pay ₹${flexAdvance} advance` },
    { price: setting(site.raw, "price.standee", oneTimeWork[1].price), label: setting(site.raw, "price.standee_note", oneTimeWork[1].label), payKey: "job.standee", payLabel: `Pay ${setting(site.raw, "price.standee", oneTimeWork[1].price)} online` },
    { price: setting(site.raw, "price.poster", oneTimeWork[2].price), label: setting(site.raw, "price.poster_note", oneTimeWork[2].label), payKey: "job.poster", payLabel: `Pay ${setting(site.raw, "price.poster", oneTimeWork[2].price)} online` },
    { price: setting(site.raw, "price.shoot", oneTimeWork[3].price), label: setting(site.raw, "price.shoot_note", oneTimeWork[3].label), payKey: "job.shoot", payLabel: `Pay ${setting(site.raw, "price.shoot", oneTimeWork[3].price)} online` },
  ];

  const plans = defaultPlans.map((p) => {
    const features = settingList(site.raw[`plan.${p.id}.features`]);
    const physical = settingList(site.raw[`plan.${p.id}.physical`]);
    const price = setting(site.raw, `plan.${p.id}.price`, p.price);
    return {
      id: p.id,
      name: setting(site.raw, `plan.${p.id}.name`, p.name),
      tagline: setting(site.raw, `plan.${p.id}.tagline`, p.tagline),
      price,
      features: features.length ? features : p.features,
      physical: physical.length ? physical : p.physical,
      badge: setting(site.raw, `plan.${p.id}.badge`, p.badge ?? "") || undefined,
      cta: p.cta,
      highlight: p.highlight,
      period: p.period,
      payKey: `plan.${p.id}`,
      payLabel: `Pay ₹${price} online`,
    };
  });

  /* Structured data for search: what we are + the questions we answer.
     No invented ratings, reviews or phone numbers — only claims already
     on the page. */
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfessionalService",
        name: site.name,
        description:
          "High-impact roadside hoardings, 4K commercial reels, social retainers, and branding for jewellery showrooms, gyms, automobile dealers, and retail businesses in Dhanbad.",
        areaServed: `${site.city}, ${site.state}`,
        url: siteDefaults.mainSite,
        priceRange: "₹₹",
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  /* Launch-site content, resolved from admin settings with code defaults. */
  const s = site.raw;
  const heroView = {
    badge: setting(
      s,
      "hero.badge",
      "Durga Puja & Diwali Festive Edition — now booking",
    ),
    titleTop: setting(
      s,
      "hero.title_top",
      "Single influencers don't give results.",
    ),
    titleGradient: setting(
      s,
      "hero.title_gradient",
      "We give you a digital creator army + physical ground dominance.",
    ),
    body: setting(
      s,
      "hero.body",
      "Multi-influencer digital swarms paired with high-touch physical pandal, canopy and B2B ground distribution for unmissable market authority.",
    ),
    stats: [0, 1, 2, 3].map((i) => ({
      value: setting(s, `hero.stat_${i}.value`, ["360°", "200K+", "5-7 Touch", "250%"][i]),
      label: setting(
        s,
        `hero.stat_${i}.label`,
        ["Regional Funnel", "Views / Campaign", "Recall Principle", "Avg Lead Surge"][i],
      ),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <NavBar site={site} />
      <main>
        <Hero site={site} view={heroView} />

        <WhyCombo
          cards={comparisonCardsView(s)}
          recall={recallPrincipleView(s)}
          heading={setting(s, "solution.heading", "The JTSA 360° hybrid marketing engine")}
          subheading={setting(s, "whycombo.heading", "Why most regional campaigns stall out")}
          body={setting(
            s,
            "whycombo.body",
            "Traditional single-channel promotions waste budget with negligible walk-ins. Here is how each one breaks down.",
          )}
        />

        <Architecture
          pillars={pillarsView(s)}
          heading="JTSA 360° Hybrid Marketing Engine"
          subheading={setting(s, "solution.subheading", "The 360° hybrid marketing engine")}
          body={setting(
            s,
            "solution.body",
            "We pair digital creator swarms with high-impact physical ground execution to create total regional dominance.",
          )}
        />

        <Pricing
          oneTime={oneTime}
          plans={plans}
          site={site}
          offlineAddOns={offlineAddOns}
        />

        <SectorPlaybooks
          sectors={sectorsView(s)}
          heading="Sector-specific execution models"
          subheading={setting(s, "sectors.heading", "Sector-specific execution models")}
          body={setting(
            s,
            "sectors.body",
            "We don't use generic strategies. Pick your industry to see how the model applies.",
          )}
        />

        <Festive
          phases={festivePhasesView(s)}
          perks={launchPerksView(s)}
          badge={setting(s, "festive.badge", "Festive grand opening launch")}
          heading={setting(s, "festive.heading", "Durga Puja & Diwali campaign blitz")}
          body={setting(
            s,
            "festive.body",
            "Eastern India's biggest consumer spending window. Capitalise on footfall and festive digital traffic with a structured rollout.",
          )}
          perkHeading={setting(s, "perks.heading", "Grand opening inaugural client special")}
          perkIntro={setting(
            s,
            "perks.intro",
            "Book any combo before the season starts to receive exclusive launch perks:",
          )}
        />

        <RoiCalculator
          bases={calcBasesView(s)}
          levels={intensityView(s)}
          sectors={sectors.map((x) => ({ id: x.id, label: x.tab }))}
          heading="Campaign ROI and reach estimator"
          subheading={setting(s, "calc.heading", "Campaign ROI & reach estimator")}
          body={setting(
            s,
            "calc.body",
            "Simulate your estimated local reach, physical touchpoints and expected lead potential based on the package and intensity you pick.",
          )}
          note={setting(
            s,
            "calc.note",
            "Estimates are modelled from regional campaign benchmarks and are indicative, not guaranteed.",
          )}
        />

        <Booking
          site={site}
          packages={plans.map((p) => ({ id: p.id, label: `${p.name} (₹${p.price})` }))}
          sectors={sectors.map((x) => x.tab)}
          kicker={setting(s, "booking.kicker", "Official registration")}
          heading={setting(s, "booking.heading", "Book your campaign slot")}
          body={setting(
            s,
            "booking.body",
            "Festive demand is high, so creator combo slots are capped per zone to prevent audience saturation. Secure your slot now.",
          )}
          capNote={setting(s, "booking.sla", "Quality assurance SLA")}
        />
      </main>
      <SiteFooter site={site} />
    </>
  );
}