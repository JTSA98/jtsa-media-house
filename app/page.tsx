import { NavBar } from "@/components/NavBar";
import { SiteFooter } from "@/components/SiteFooter";
import { Hero } from "@/components/sections/Hero";
import {
  Audiences,
  MarqueeBand,
  Services,
  StatsBand,
  Work,
} from "@/components/sections/Marketing";
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
  const oneTime = [
    { price: setting(site.raw, "price.flex", oneTimeWork[0].price), label: setting(site.raw, "price.flex_note", oneTimeWork[0].label) },
    { price: setting(site.raw, "price.standee", oneTimeWork[1].price), label: setting(site.raw, "price.standee_note", oneTimeWork[1].label) },
    { price: setting(site.raw, "price.poster", oneTimeWork[2].price), label: setting(site.raw, "price.poster_note", oneTimeWork[2].label) },
    { price: setting(site.raw, "price.shoot", oneTimeWork[3].price), label: setting(site.raw, "price.shoot_note", oneTimeWork[3].label) },
  ];

  const plans = defaultPlans.map((p) => {
    const k = p.name.toLowerCase();
    const features = settingList(site.raw[`plan.${k}.features`]);
    return {
      name: setting(site.raw, `plan.${k}.name`, p.name),
      price: setting(site.raw, `plan.${k}.price`, p.price),
      features: features.length ? features : p.features,
      badge: setting(site.raw, `plan.${k}.badge`, p.badge ?? "") || undefined,
      highlight: p.highlight,
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
          "Posters, reels, social campaigns and website listings for schools and local businesses in Dhanbad.",
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
        <MarqueeBand site={site} />
        <Services site={site} />
        <StatsBand site={site} />
        <Audiences site={site} />
        <Work site={site} />
        <Process site={site} />
        <Voices site={site} />
        <Pricing oneTime={oneTime} plans={plans} site={site} />
        <Faq site={site} />
        <Enquire site={site} />
        <BigCta site={site} />
      </main>
      <SiteFooter site={site} />
    </>
  );
}