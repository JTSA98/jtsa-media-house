// ─── Site-wide content and contact details ────────────────────────────
// Single source of truth. Everything in the UI reads from here so the
// placeholders are easy to swap for the real values before launch.

export const site = {
  name: "JTSA Media House",
  shortName: "JMH",
  tagline: "Aaj ka Prachar, Kal ki Pehchaan",
  owner: "Jharkhand Talent Search Association",
  ownerShort: "JTSA",
  udyam: "UDYAM-JH-04-0091747",
  city: "Dhanbad",
  state: "Jharkhand",
  startedYear: 2026,

  // ── Replace before launch ──────────────────────────────────────────
  email: "commercial@jtsamediahouse.in",
  // Plain 10-digit local number, no "+" and no 91 prefix: this value is fed
  // straight into wa.me and tel: links, where either would break them.
  phone: "9304336590",
  phoneDigits: "9304336590",
  /* wa.me needs the full international number. phoneDigits above stays local
     for tel: and on-screen display. */
  whatsappDigits: "919304336590",
  upiId: "jtsamedia@upi",
  mainSite: "https://jtsa.in",
} as const;

export const social = [
  { label: "Instagram", href: "#" },
  { label: "Facebook", href: "#" },
  { label: "WhatsApp", href: `https://wa.me/${site.whatsappDigits}` },
  { label: "YouTube", href: "#" },
] as const;

// ─── Marketing copy ───────────────────────────────────────────────────

export const heroStats = [
  { value: "85+", label: "Commercial Brands" },
  { value: "₹40L+", label: "Client Revenue Driven" },
  { value: "500+", label: "Creatives Shipped" },
  { value: "48h", label: "Typical Turnaround" },
] as const;

export type Service = {
  slug: string;
  num: string;
  title: string;
  body: string;
  tags: string[];
  price: string;
  priceNote: string;
};

export const services: Service[] = [
  {
    slug: "posters-banners",
    num: "01",
    title: "Mega Hoardings & Outdoor Flex",
    body: "Bank More, Steel Gate, and Highway prime hoardings, showroom fascia flex, and roll-up standees. Designed in Hindi or English, weather-proof industrial print delivered inside Dhanbad.",
    tags: ["Frontlit / Backlit", "10x5 to 40x20 ft", "Roadside Billboards", "Roll-Up Standees", "2 Revisions"],
    price: "₹35 / sq.ft",
    priceNote: "design included",
  },
  {
    slug: "social-campaigns",
    num: "02",
    title: "Commercial Social Retainers",
    body: "12 posts + 4 video reels monthly for jewellery showrooms, gyms, and retail stores. Captions scripted, graphics designed, Dhanbad audience ad boosts managed, with monthly ROI reports.",
    tags: ["12 Posts", "4 Video Reels", "Ad Boost Setup", "Dhanbad Targeting", "Monthly ROI Report"],
    price: "₹9,999",
    priceNote: "per month retainer",
  },
  {
    slug: "video-reels",
    num: "03",
    title: "4K Commercial Video & Reels",
    body: "Thirty-second vertical video shot on-location in Dhanbad. Macro gold shoots, high-energy gym transformations, or showroom walkthroughs with Hindi voiceover & kinetic text.",
    tags: ["30s 4K Vertical", "Hindi Voiceover", "Kinetic Subtitles", "Custom Thumbnail", "Location Shoot"],
    price: "₹4,999",
    priceNote: "per production reel",
  },
  {
    slug: "website-listing",
    num: "04",
    title: "JTSA Verified Business Directory",
    body: "A permanent verified commercial page on the JTSA website, where thousands of Dhanbad residents visit every week. Photo gallery, showroom timings, map pin, and tap-to-call button.",
    tags: ["Verified Profile", "Tap to Call", "Google Map Pin", "Monthly Presence"],
    price: "₹999",
    priceNote: "per month",
  },
];

export type Audience = {
  heading: string;
  highlight: string;
  intro: string;
  points: { title: string; body: string }[];
};

export const audiences: Audience[] = [
  {
    heading: "For",
    highlight: "Gold & Jewellery Showrooms",
    intro:
      "Dhanteras, Akshaya Tritiya, and Wedding Season campaigns. High-impact billboards at Bank More & Steel Gate with 4K macro video reels.",
    points: [
      { title: "Festive & Wedding Season Blitz", body: "Coordinated roadside hoardings, promotional flyers, and social reels on one schedule." },
      { title: "4K Macro Jewellery Shoots", body: "Close-up macro video reels highlighting bridal collections, sparkle, and hallmark trust." },
      { title: "Prime Highway & City Billboards", body: "High-visibility flex hoardings at Bank More, Hirapur, and main Dhanbad crossings." },
      { title: "Hyper-Targeted Local Footfall Ads", body: "Meta ad campaigns targeting high-income Dhanbad families for festive shopping." },
      { title: "Official GST & Udyam Receipts", body: "Complete corporate accounting compliance with instant digital invoices." },
    ],
  },
  {
    heading: "For",
    highlight: "Gyms & Fitness Centers",
    intro:
      "High-energy 30-sec kinetic reels, annual membership enrollment drives, and city hotspot promotional standees.",
    points: [
      { title: "Viral Workout Reels", body: "Kinetic transformation videos with hard-hitting sound design and trainer spotlights." },
      { title: "New Year & Seasonal Member Blitz", body: "Massive enrollment campaigns driving hundreds of annual memberships." },
      { title: "Showroom & Facility Walkthroughs", body: "30s 4K tours showcasing world-class equipment and personal training facilities." },
      { title: "Local Market Hotspot Standees", body: "Deluxe 6x2.5 ft roll-up standees placed at popular Dhanbad malls and markets." },
      { title: "Predictable Monthly Budget", body: "Fixed monthly fee with zero agency retainer surprises." },
    ],
  },
];

export type WorkItem = { src: string; alt: string; caption: string };

export const work: WorkItem[] = [
  { src: "/images/real-win.jpg", alt: "Commercial Campaign in Dhanbad", caption: "Festive Launch Campaign" },
  { src: "/images/campaign-poster.jpeg", alt: "Prime Roadside Flex Hoarding", caption: "Outdoor Flex Hoarding" },
  { src: "/images/real-cert.jpg", alt: "Commercial Video Shoot", caption: "4K Commercial Reel" },
  { src: "/images/real-exam.jpg", alt: "Mega Event Branding", caption: "City Center Display" },
  { src: "/images/real-study.jpg", alt: "Retail Social Campaign", caption: "Social Series" },
  { src: "/images/real-science.jpg", alt: "Showroom Display Standee", caption: "Roll-up Standee" },
];

export const heroPolaroids = [
  { src: "/images/real-win.jpg", alt: "Commercial Showcase", caption: "Festive Campaign Flex" },
  { src: "/images/campaign-poster.jpeg", alt: "Prime Billboard Hoarding", caption: "Bank More Billboard" },
  { src: "/images/real-cert.jpg", alt: "Commercial Video Shoot", caption: "4K Commercial Reel" },
];

export const processSteps = [
  { n: "1", title: "Brief Your Campaign", body: "WhatsApp or call us with your showroom launch, festive sale date, or growth target. A free preliminary draft comes back within 24 hours." },
  { n: "2", title: "We Script & Design", body: "Our creative team scripts the copy and designs high-res print/video drafts with two revisions included. Bilingual Hindi or English." },
  { n: "3", title: "You Approve", body: "Nothing goes to the printing press or digital ad platform without your sign-off. Pay conveniently via UPI, bank transfer, or corporate invoice." },
  { n: "4", title: "We Deploy & Deliver", body: "Flex hoardings and standees delivered print-ready in Dhanbad. Digital social ad campaigns go live with weekly performance tracking." },
];

export type Testimonial = { quote: string; name: string; role: string; initials: string };

export const testimonials: Testimonial[] = [
  {
    quote: "Our Dhanteras jewellery collection hoardings at Bank More were up two days before our deadline. Footfall increased by 35% compared to last festive season.",
    name: "Showroom Director",
    role: "Jewellery & Gold House · Dhanbad",
    initials: "JD",
  },
  {
    quote: "The 30-sec reels shot by JTSA brought over 120 new gym membership inquiries in our first month. The video quality looked like a national fitness brand.",
    name: "Fitness Club Founder",
    role: "Gym & Crossfit Hub · Saraidhela",
    initials: "FC",
  },
  {
    quote: "From store opening hoardings to Instagram reels, JTSA Media House handled everything under one roof. Clean pricing with zero agency headaches.",
    name: "General Manager",
    role: "Automobile Dealership · Dhanbad",
    initials: "AD",
  },
];

export const oneTimeWork = [
  { price: "₹35 / sq.ft", label: "Flex printing, design included" },
  { price: "₹1,799", label: "Roll-up aluminum standee complete" },
  { price: "₹499", label: "Promo poster — design + print" },
  { price: "₹14,999", label: "Half-day on-location commercial shoot" },
];

export type Plan = {
  /** Stable key. Settings and the payment API both key off this, so a
      rename in the admin panel never orphans a price row. */
  id: string;
  name: string;
  price: string;
  /** who it is for */
  tagline: string;
  /** digital deliverables */
  features: string[];
  /** physical ground execution bundled with the tier */
  physical: string[];
  badge?: string;
  highlight?: boolean;
  /** Button wording. Defaults to the last word of the name, which collides
   *  once several tiers end in the same word. */
  cta?: string;
  /** billing period shown after the price */
  period: string;
};

export const plans: Plan[] = [
  {
    id: "nano",
    name: "2-Influencer Nano Starter Combo",
    cta: "Starter",
    price: "4,999",
    tagline: "Cafes, small boutiques, new coaching batches",
    features: [
      "2 local micro-creators (5K–15K)",
      "2 high-quality Instagram reels",
      "4 promotional stories with tags",
      "~15,000 estimated local reach",
    ],
    /* Entry tier is digital only in the source rate card — no ground add-on,
       so the card omits the physical column rather than showing it empty. */
    physical: [],
    period: "per campaign",
  },
  {
    id: "micro",
    name: "3-Influencer Micro Growth Combo",
    cta: "Growth",
    price: "9,999",
    tagline: "Growing retail shops, popular coaching hubs",
    features: [
      "3 local creators (10K–25K)",
      "3 dedicated reels + co-authoring",
      "6 stories with direct WhatsApp link",
      "~30,000 estimated local reach",
    ],
    physical: [],
    period: "per campaign",
  },
  {
    id: "silver",
    name: "4-Influencer Silver Combo",
    price: "14,999",
    tagline: "Cafes, boutiques, coaching batches",
    features: [
      "4 micro local creators (5K–20K)",
      "4 dedicated Instagram reels",
      "8 promotional stories with tags",
      "~35,000 estimated local reach",
    ],
    physical: ["500 B2B leaflets", "1 standee banner"],
    period: "per campaign",
  },
  {
    id: "gold",
    name: "5-Influencer Gold Growth Pack",
    price: "24,999",
    tagline: "Schools, jewellery, retail showrooms",
    features: [
      "5 mid-tier local creators (10K–50K)",
      "5 cinematic reels + co-authoring",
      "10 stories with direct link tags",
      "~80,000 estimated local reach",
    ],
    physical: ["1,000 leaflets", "2 premium standees"],
    badge: "Most Popular",
    highlight: true,
    period: "per campaign",
  },
  {
    id: "platinum",
    name: "10-Influencer Platinum Swarm",
    price: "49,999",
    tagline: "Grand openings and mega sales",
    features: [
      "10 regional mixed-tier creators",
      "10 simultaneous reel drops",
      "20 stories + live on-site coverage",
      "~200,000 estimated local reach",
    ],
    physical: ["2,500 leaflets", "Durga pandal slot"],
    period: "per campaign",
  },
  {
    id: "vip",
    name: "VIP Premium Annual Membership",
    price: "1,19,999",
    tagline: "Established institutions, yearly umbrella",
    features: [
      "4 combo campaigns a year (1 per quarter)",
      "Dedicated videographer & scriptwriter",
      "Permanent standee in 10+ partner hubs",
      "5,000 yearly direct leaflet drops",
    ],
    physical: ["Year-round ground presence"],
    badge: "15 Slots Only",
    period: "per year",
  },
];

/* ─── Offline / ground add-ons ───────────────────────────────────────
   Physical execution priced per unit, quoted separately from the
   digital creator tiers above. */
export type OfflineAddOn = {
  id: string;
  title: string;
  body: string;
  rate: string;
  unit: string;
  points: string[];
  onRequest?: boolean;
};

export const offlineAddOns: OfflineAddOn[] = [
  {
    id: "leaflets",
    title: "Hand-to-Hand Leaflet Dropping",
    body: "School gates, coaching corridors and busy market hubs like Bank More and City Centre.",
    rate: "₹300 – ₹450",
    unit: "per 1,000 copies",
    points: ["Direct audience engagement", "Live photo/GPS proof updates"],
  },
  {
    id: "newspaper",
    title: "Newspaper Leaflet Insertion",
    body: "Morning delivery flyers inside the local dailies.",
    rate: "₹250 – ₹350",
    unit: "per 1,000 copies",
    points: ["Guaranteed residential doorstep reach", "Minimum order: 2,000 copies"],
  },
  {
    id: "flex",
    title: "Flex Pasting & Wall Banners",
    body: "Street pole flex banners and market wall posters across prime student areas.",
    rate: "₹12 – ₹18",
    unit: "per sq. ft.",
    points: ["Printing + mounting included", "High-frequency street exposure"],
  },
  {
    id: "auto",
    title: "Auto-Rickshaw Branding",
    body: "Moving hood banners on autos traversing key routes in Dhanbad.",
    rate: "₹150 – ₹250",
    unit: "per auto / month",
    points: ["Moving city-wide visibility", "Minimum order: 10 autos"],
  },
  {
    id: "hoardings",
    title: "Hoardings & Banners",
    body: "Mounted street banners and prime junction holding spaces.",
    rate: "₹450 – ₹800",
    unit: "per banner",
    points: ["Key traffic intersections", "Durga Puja pandal gates available"],
  },
  {
    id: "press",
    title: "Media Partner Collaboration",
    body: "Press briefings, live news channel interviews and news features.",
    rate: "On request",
    unit: "quoted per slot",
    points: ["Priced as per media house norms"],
    onRequest: true,
  },
];

/** Standalone membership pass, quoted separately from the tiers above. */
export const vipPass = {
  price: "999",
  period: "per year",
  benefit: "Flat 20% off every individual combo and offline order for 365 days",
};

// ═══════════════════════════════════════════════════════════════════
//  Launch-site content. Every field carries a stable id so the same
//  string can be overridden from /admin/settings under
//  <group>.<id>.<field> without the keys ever drifting.
// ═══════════════════════════════════════════════════════════════════

export interface CmpCard {
  id: string;
  label: string;
  title: string;
  body: string;
  impact: string;
}

/** "Why Combo" — traditional methods and where they fall short. */
export const comparisonCards: CmpCard[] = [
  {
    id: "single-reel",
    label: "Traditional Method 1",
    title: "Single Influencer Reel",
    body: "60%+ of their audience lives outside Dhanbad. Followers are fragmented and isolated.",
    impact: "High cost, zero footfall conversions for local stores and schools.",
  },
  {
    id: "passive-leaflets",
    label: "Traditional Method 2",
    title: "Passive Leaflets",
    body: "Distributed without an active pitch or any digital verification anchor.",
    impact: "95% material waste, zero trackable customer leads.",
  },
  {
    id: "social-ads",
    label: "Traditional Method 3",
    title: "Uncoordinated Social Ads",
    body: "Generic graphics that lack hyper-local cultural context or creator trust.",
    impact: "Wasted ad spend, easily ignored sponsored posts.",
  },
  {
    id: "static-flex",
    label: "Traditional Method 4",
    title: "Static Billboards / Flex",
    body: "Expensive upfront, entirely passive, with zero digital retargeting capability.",
    impact: "Massive fixed cost with no lead generation analytics.",
  },
];

export const recallPrinciple = {
  title: "The Multi-Touchpoint Recall Principle",
  body: "A local customer in Dhanbad needs to see a brand at least 5 to 7 times across online reels and physical street touchpoints within 48 hours before making a buying or admission decision.",
};

export interface Pillar {
  id: string;
  label: string;
  title: string;
  body: string;
  points: string[];
}

/** The 360° engine — three pillars. */
export const pillars: Pillar[] = [
  {
    id: "digital",
    label: "Pillar 01: Digital Army",
    title: "Multi-Creator Swarms",
    body: "4, 5 and 10 local influencers drop synchronised video content within a tight 48-hour window, overwhelming the local feed to create a genuine viral trend.",
    points: [
      "Simultaneous Instagram reels and stories",
      "Co-authoring and hyper-local geo tags",
      "Combined 35K to 200K+ estimated local views",
    ],
  },
  {
    id: "physical",
    label: "Pillar 02: Ground Trust",
    title: "Physical Dominance",
    body: "High-visibility physical presence validates online excitement. Strategic pandal banners, promotional canopy hubs and hand-to-hand leaflet drops across prime spots.",
    points: [
      "Top Durga Puja pandal gates and LED screens",
      "Canopy hubs at Bank More and City Centre",
      "Targeted school and coaching gate flyer drops",
    ],
  },
  {
    id: "conversion",
    label: "Pillar 03: Conversion",
    title: "QR Bridge & Footfall",
    body: "Every flyer, standee and banner carries an interactive QR code pointing straight at creator reels, WhatsApp offers and walk-in coupon verification.",
    points: [
      "Instant lead capture and WhatsApp integration",
      "Exclusive JTSA festive VIP coupons",
      "Transparent post-campaign analytics report",
    ],
  },
];

export interface Sector {
  id: string;
  tab: string;
  title: string;
  subtitle: string;
  digital: string[];
  physical: string[];
  impact: string;
  recommended: { digital: string; ground: string; locations: string };
}

/** Sector playbooks — the four tabs. */
export const sectors: Sector[] = [
  {
    id: "education",
    tab: "Education & Coaching",
    title: "Educational Institutions & Coaching Hubs",
    subtitle: "Admission surge model for schools, NEET/JEE coaching and colleges",
    digital: [
      "Peer-to-peer reels by popular college creators reviewing campus facilities.",
      "Topper testimonial production: high-quality cinematic interviews.",
      "Hyper-local campaign aimed at parents within 15km.",
    ],
    physical: [
      "School-gate leaflet drops, synchronised during exit hours.",
      "Parent counselling booths near exam centres on testing days.",
      "Hostel and mess standees in student residential zones.",
    ],
    impact: "Increases inquiry call volume by an average of 250% during admission cycles.",
    recommended: {
      digital: "5 to 10 local creators",
      ground: "1,000+ pamphlet drops and standees",
      locations: "Bank More, City Centre, Saraidhela",
    },
  },
  {
    id: "retail",
    tab: "Retail & Showrooms",
    title: "Retail Showrooms, Fashion & Electronics",
    subtitle: "Festive shopping blitz for showrooms and megastores",
    digital: [
      "In-store creator experience: shop-with-me and festive haul reels.",
      "Collection discounts and store walkthroughs by 5-10 local creators.",
      "Flash Instagram countdown stories before Dhanteras and Durga Puja.",
    ],
    physical: [
      "JTSA VIP discount coupons handed out in high-footfall markets.",
      "Standee placement in partner cafes and youth hangouts.",
      "Promotional festive canopy at Bank More and City Centre.",
    ],
    impact: "Drives immediate physical store walk-ins and festive stock clearance.",
    recommended: {
      digital: "5 to 10 local creators",
      ground: "1,000+ pamphlet drops and standees",
      locations: "Bank More, City Centre, Saraidhela",
    },
  },
  {
    id: "hospitality",
    tab: "Restaurants & Cafes",
    title: "Restaurants, Cafes & Food Outlets",
    subtitle: "Food creator swarm and ambience experience engine",
    digital: [
      "Food blogger swarm: 4-6 creators invited for an exclusive tasting night.",
      "Cinematic reels covering signature dishes, festive menus and decor.",
      "Google review drive initiated by creators to boost local rankings.",
    ],
    physical: [
      "QR table standees encouraging customers to post reels for discounts.",
      "Co-branded tent cards across hospitality partner hubs.",
      "Festive menu flyers in high-density residential apartments.",
    ],
    impact: "Routinely yields 10,000+ local views per reel, driving weekend bookings.",
    recommended: {
      digital: "4 to 6 food creators",
      ground: "800 pamphlets and table stands",
      locations: "City Centre, Bank More",
    },
  },
  {
    id: "b2b",
    tab: "Real Estate & Health",
    title: "Real Estate, Clinics & High-Value B2B",
    subtitle: "Trust-building and authoritative lead generation model",
    digital: [
      "Site tour reels hosted by trusted regional anchors.",
      "Doctor and specialist spotlights establishing authority.",
      "Direct WhatsApp lead generation ads with booking links.",
    ],
    physical: [
      "Targeted flyer drops in high-income residential neighbourhoods.",
      "Standee placement in premium diagnostic labs and commercial hubs.",
      "VIP invitation cards for site visits and clinic discounts.",
    ],
    impact: "Captures high-intent verified leads with maximum trustworthiness.",
    recommended: {
      digital: "3 to 5 specialist creators",
      ground: "600 premium pamphlets and stands",
      locations: "Premium residential sectors",
    },
  },
];

export interface Phase {
  id: string;
  label: string;
  title: string;
  points: string[];
}

/** Festive rollout — three phases. */
export const festivePhases: Phase[] = [
  {
    id: "pre-puja",
    label: "Phase 1: Pre-Puja Hype",
    title: "Saptami to Navami Surge",
    points: [
      "Teaser posts across all partner creators introducing the brand deal.",
      "B2B outreach offering inaugural launch discounts.",
      "Inauguration banners placed across key pandal routes.",
    ],
  },
  {
    id: "puja",
    label: "Phase 2: On-Ground Pandal Surge",
    title: "Puja Live Coverage",
    points: [
      "JTSA ground teams deploying festive coupons to visitors.",
      "Creator combos filming live pandal walk-throughs and store tags.",
      "Real-time stories to drive footfall through the festive week.",
    ],
  },
  {
    id: "diwali",
    label: "Phase 3: Dhanteras & Diwali Blitz",
    title: "High-Ticket Purchase Blitz",
    points: [
      "Product showcases and store walk-throughs 48h before Dhanteras.",
      "Targeted B2B corporate gifting catalogues and WhatsApp outreach.",
      "High-intensity 3-day creator swarm for immediate sales.",
    ],
  },
];

export interface Perk {
  id: string;
  headline: string;
  body: string;
}

/** Launch special — three perks. */
export const launchPerks: Perk[] = [
  {
    id: "discount",
    headline: "10% Flat Off",
    body: "Early-bird discount on the Silver and Gold combo packages.",
  },
  {
    id: "flyers",
    headline: "Free 1,000 Flyers",
    body: "Complimentary festive pandal leaflet distribution included.",
  },
  {
    id: "reel",
    headline: "Launch Reel Slot",
    body: "Featured spot in the JTSA official opening broadcast across handles.",
  },
];

/**
 * ROI calculator bases, one per combo tier. The slider multiplies these
 * by the chosen intensity, so every number below is editable in admin.
 */
export interface CalcBase {
  id: string;
  label: string;
  views: number;
  flyers: number;
  creators: string;
  leadsLow: number;
  leadsHigh: number;
  score: number;
  /** how fast views scale with intensity (0-1) */
  viewRate: number;
  /** how fast the score climbs with intensity */
  scoreStep: number;
}

export const calcBases: CalcBase[] = [
  {
    id: "nano",
    label: "2-Influencer Nano Starter Combo",
    views: 15000,
    flyers: 0,
    creators: "2 Creators",
    leadsLow: 15,
    leadsHigh: 35,
    score: 4.2,
    viewRate: 1.3,
    scoreStep: 0.5,
  },
  {
    id: "micro",
    label: "3-Influencer Micro Growth Combo",
    views: 30000,
    flyers: 0,
    creators: "3 Creators",
    leadsLow: 25,
    leadsHigh: 60,
    score: 5.4,
    viewRate: 1.15,
    scoreStep: 0.5,
  },
  {
    id: "silver",
    label: "4-Influencer Silver Combo",
    views: 35000,
    flyers: 500,
    creators: "4 Creators",
    leadsLow: 40,
    leadsHigh: 90,
    score: 6.5,
    viewRate: 1,
    scoreStep: 0.5,
  },
  {
    id: "gold",
    label: "5-Influencer Gold Growth Pack",
    views: 80000,
    flyers: 1000,
    creators: "5 Creators",
    leadsLow: 100,
    leadsHigh: 220,
    score: 7.8,
    viewRate: 0.9,
    scoreStep: 0.5,
  },
  {
    id: "platinum",
    label: "10-Influencer Platinum Swarm",
    views: 200000,
    flyers: 2500,
    creators: "10 Creators",
    leadsLow: 250,
    leadsHigh: 500,
    score: 8.9,
    viewRate: 0.85,
    scoreStep: 0.3,
  },
  {
    id: "vip",
    label: "VIP Annual Membership",
    views: 500000,
    flyers: 5000,
    creators: "Dedicated Network",
    leadsLow: 0,
    leadsHigh: 0,
    score: 10,
    viewRate: 1,
    scoreStep: 0,
  },
];

/** Slider positions for the calculator intensity control. */
export const intensityLevels = [
  "Single Weekend Push",
  "Festive 3-Day Blitz",
  "10-Day Festival Dominance",
];

export type FaqItem = { q: string; a: string };

export const faqs: FaqItem[] = [
  {
    q: "How fast can you deliver an outdoor flex hoarding or billboard in Dhanbad?",
    a: "Standard print and design jobs are finalized within 48 hours, with a first concept draft shared on WhatsApp within 24 hours. Emergency same-day turnaround is available for urgent showroom openings.",
  },
  {
    q: "Do you shoot commercial video reels on location at our showroom or gym?",
    a: "Yes. Our video team shoots on-location across Dhanbad (Bank More, Saraidhela, Steel Gate, Govindpur, etc.) using professional cinema-grade gear, lighting, and audio equipment.",
  },
  {
    q: "Do you charge extra for Facebook or Instagram ad budget?",
    a: "No. The ad spend is paid directly by you to Meta/Google, meaning you keep full control over your budget and retain account ownership. Our fee covers strategy, scripting, production, publishing, and weekly analytics.",
  },
  {
    q: "Can we get a free preliminary design sample first?",
    a: "Yes. Share your showroom name, upcoming sale, or campaign concept on WhatsApp. We will craft one preliminary design draft within 24 hours completely free of charge.",
  },
  {
    q: "Do you design in Hindi as well as English?",
    a: "Both. High-converting commercial advertising in Dhanbad requires culturally resonant Hindi copywriting alongside modern English. Bilingual proofing and typography are standard across all tiers.",
  },
  {
    q: "Do you provide official GST invoices?",
    a: "Yes. JTSA Media House is an officially registered enterprise (UDYAM-JH-04-0091747). All corporate and commercial orders receive formal business invoices.",
  },
];

export const paymentOptions = [
  { n: "01", title: "Online — UPI / Bank Transfer", body: "Pay instantly via any UPI app or NEFT/RTGS with same-day GST receipt." },
  { n: "02", title: "Corporate Invoice & Offline Settlement", body: "Authorized billing for companies and established commercial partners." },
  { n: "03", title: "Free design sample first", body: "We design one draft concept before any money moves." },
];

// ─── Budget bands ───────────────────────────────────────────────────
// FALLBACKS only. The live values come from site_settings (budget.bands
// + budget.mids), editable at /admin/settings. These exist so the
// registration form still renders if the database is unreachable.
export const budgetBands: string[] = [
  "Under ₹5,000",
  "₹5,000 — ₹10,000",
  "₹10,000 — ₹25,000",
  "₹25,000 — ₹50,000",
  "Above ₹50,000",
  "Not sure yet",
];

/** Rough pipeline value per band, parallel to budgetBands. */
export const budgetMids: number[] = [5000, 10000, 25000, 50000, 100000, 0];