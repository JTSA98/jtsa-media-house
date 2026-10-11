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
  phone: "+91 00000 00000",
  phoneDigits: "910000000000",
  upiId: "jtsamedia@upi",
  mainSite: "https://jtsa.in",
} as const;

export const social = [
  { label: "Instagram", href: "#" },
  { label: "Facebook", href: "#" },
  { label: "WhatsApp", href: `https://wa.me/${site.phoneDigits}` },
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
  name: string;
  price: string;
  features: string[];
  badge?: string;
  highlight?: boolean;
};

export const plans: Plan[] = [
  { name: "Starter", price: "4,999", features: ["8 social posts", "2 reels", "1 outdoor banner design", "Monthly ROI report"] },
  {
    name: "Commercial Scale",
    price: "9,999",
    features: ["12 posts + 4 full reels", "Dhanbad ad boost management", "2 hoarding designs", "Verified JTSA directory listing", "Priority 24h turnaround"],
    badge: "Most Chosen",
    highlight: true,
  },
  { name: "Corporate Dominance", price: "19,999", features: ["20 posts + 8 reels", "Full campaign roadmap", "On-location commercial shoot", "Unlimited billboard layouts", "Everything in Scale"] },
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