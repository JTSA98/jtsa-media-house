import { NavBar } from "@/components/NavBar";
import { SiteFooter } from "@/components/SiteFooter";
import { Hero } from "@/components/sections/Hero";
import {
  Audiences,
  Services,
  StatsBand,
} from "@/components/sections/Marketing";
import { Work } from "@/components/sections/MediaGrid";
import {
  BigCta,
  Enquire,
  Faq,
  Pricing,
  Process,
  Voices,
} from "@/components/sections/Content";
import { getSiteView, setting, settingList } from "@/lib/settings";
import {
  faqs,
  offlineAddOns,
  oneTimeWork,
  plans as defaultPlans,
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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <NavBar site={site} />
      <main>
        <Hero site={site} />
        <StatsBand site={site} />
        <Services site={site} />
        <Process site={site} />
        <Work />
        <Audiences site={site} />
        <Voices site={site} />
        <Pricing
          oneTime={oneTime}
          plans={plans}
          site={site}
          offlineAddOns={offlineAddOns}
        />
        <Faq site={site} />
        <Enquire site={site} />
        <BigCta site={site} />
      </main>
      <SiteFooter site={site} />
    </>
  );
}