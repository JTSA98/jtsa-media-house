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
  email: "hello@jtsamediahouse.in",
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
  { value: "50+", label: "Partner Schools" },
  { value: "1,000+", label: "Students Reached" },
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
    title: "Posters & Banners",
    body: "Admission posters, result-day banners, event flex and standees. Designed in Hindi or English, delivered print-ready inside Dhanbad — or as a digital file if you print it yourself.",
    tags: ["A4 · A3 · A2", "Flex", "Standee", "Hindi + English", "2 revisions"],
    price: "₹299",
    priceNote: "from, per design",
  },
  {
    slug: "social-campaigns",
    num: "02",
    title: "Social Media Campaigns",
    body: "Instagram, Facebook and WhatsApp. We write the captions, design the posts, publish them, manage the boost and send one plain-English report at the end of the month. Ad spend is paid by you directly to the platform.",
    tags: ["12 posts", "4 reels", "Boosting", "Caption writing", "Monthly report"],
    price: "₹4,999",
    priceNote: "per month",
  },
  {
    slug: "video-reels",
    num: "03",
    title: "Video & Reels",
    body: "Thirty-second vertical video for admission season, results day, festivals or a shop's product. Shot on phone or camera, cut with captions, a thumbnail, and a Hindi or English voiceover if you want one.",
    tags: ["30s vertical", "Hindi VO", "Subtitles", "Thumbnail", "Event coverage"],
    price: "₹4,999",
    priceNote: "per reel",
  },
  {
    slug: "website-listing",
    num: "04",
    title: "Website Listing",
    body: "Your own permanent page on the JTSA website, where students, parents and teachers already visit every week. Photo, description, address, timings and a tap-to-call button. Partner schools get the first listing free.",
    tags: ["Own page", "Tap to call", "Map pin", "Monthly"],
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
    highlight: "Schools",
    intro:
      "Admission season, exam results, science day, sports day, annual functions — the moments a school actually needs to fill.",
    points: [
      { title: "Admission season package", body: "Posters, banners, standees and reels on one schedule." },
      { title: "Result-day creative", body: "Same-day designs the moment results drop." },
      { title: "Event coverage", body: "Reels from exam day, prize distribution and certification day." },
      { title: "Free website listing", body: "Partner schools get the first JTSA listing at no cost." },
      { title: "Offline payment", body: "Pay at the school office, exactly like the Olympiad process." },
    ],
  },
  {
    heading: "For",
    highlight: "Local Business",
    intro:
      "Shops, coaching centres, clinics, showrooms and service businesses that need regular visibility without a big agency retainer.",
    points: [
      { title: "Openings & offers", body: "Creative for a new shop, sale or festival." },
      { title: "Social on a budget", body: "12 posts and 4 reels a month, fixed price." },
      { title: "Short video", body: "Product reels shot on location in Dhanbad." },
      { title: "Get found locally", body: "Website listing with map pin and tap-to-call." },
      { title: "Pay how you like", body: "UPI online, or cash at a partner school." },
    ],
  },
];

export type WorkItem = { src: string; alt: string; caption: string };

export const work: WorkItem[] = [
  { src: "/images/real-exam.jpg", alt: "Students during the JTSA examination", caption: "exam campaign" },
  { src: "/images/real-win.jpg", alt: "Prize distribution at a JTSA event", caption: "result day banner" },
  { src: "/images/real-study.jpg", alt: "Students studying together", caption: "study series" },
  { src: "/images/campaign-poster.jpeg", alt: "JTSA admission campaign poster", caption: "admission poster" },
  { src: "/images/real-cert.jpg", alt: "Certificate handover at JTSA", caption: "certification reel" },
  { src: "/images/real-science.jpg", alt: "Science activity at JTSA", caption: "science module" },
];

export const heroPolaroids = [
  { src: "/images/real-exam.jpg", alt: "Examination day", caption: "exam day — flex + poster" },
  { src: "/images/real-win.jpg", alt: "Prize distribution", caption: "result day banner" },
  { src: "/images/real-cert.jpg", alt: "Certificate handover", caption: "certification reel" },
];

export const processSteps = [
  { n: "1", title: "Tell us the date", body: "WhatsApp or call us with the event, the date and what you want people to do. A free sample design comes back within 24 hours." },
  { n: "2", title: "We design", body: "You get the first draft with two revisions included. Hindi or English, print-ready or social-ready — your call." },
  { n: "3", title: "You approve", body: "Nothing goes live or to the printer until you say yes. Pay by UPI, or offline at your school office." },
  { n: "4", title: "We deliver & post", body: "Print delivered inside Dhanbad, or files sent to you. Social campaigns go live and report back monthly." },
];

export type Testimonial = { quote: string; name: string; role: string; initials: string };

export const testimonials: Testimonial[] = [
  {
    quote: "Admission posters were ready the same evening we asked. Two changes, both done. Our notice board finally looked like an event.",
    name: "Parent Representative",
    role: "Partner School · Dhanbad",
    initials: "PS",
  },
  {
    quote: "We asked for one reel and they asked about our fees first. Then sent us a plan we could actually afford. Very different from other agencies.",
    name: "Coaching Centre Owner",
    role: "Local Business",
    initials: "RK",
  },
  {
    quote: "The listing on the JTSA website brought three phone calls in the first week. Small thing, but it pays for itself.",
    name: "Showroom Manager",
    role: "Local Business",
    initials: "AM",
  },
];

export const oneTimeWork = [
  { price: "₹35 / sq.ft", label: "Flex printing, design included" },
  { price: "₹1,799", label: "Roll-up standee with design" },
  { price: "₹499", label: "Poster — design + print" },
  { price: "₹14,999", label: "Half-day event shoot" },
];

export type Plan = {
  name: string;
  price: string;
  features: string[];
  badge?: string;
  highlight?: boolean;
};

export const plans: Plan[] = [
  { name: "Starter", price: "4,999", features: ["8 social posts", "2 reels", "1 poster design", "Monthly report"] },
  {
    name: "Growth",
    price: "9,999",
    features: ["12 posts + 4 reels", "Boost management", "2 poster designs", "Website listing", "Priority support"],
    badge: "Most Chosen",
    highlight: true,
  },
  { name: "Premium", price: "19,999", features: ["20 posts + 8 reels", "Full campaign strategy", "Event shoot coverage", "Everything in Growth"] },
];

export type FaqItem = { q: string; a: string };

export const faqs: FaqItem[] = [
  {
    q: "How fast can you deliver a poster?",
    a: "Most one-time designs come back within 48 hours, and a first draft usually lands the same evening. Event-day urgent work is possible — call instead of emailing.",
  },
  {
    q: "Do you charge for ad spend on Facebook or Instagram?",
    a: "No. Ad spend is paid by you directly to the platform, so you keep full control of the budget and the account stays yours. Our fee covers strategy, design, publishing and the monthly report.",
  },
  {
    q: "How can I pay?",
    a: "Two ways. UPI online, or offline at your school office if you are a partner school — the same process used for the Olympiad. Receipts are issued either way.",
  },
  {
    q: "Can I get a free sample first?",
    a: "Yes. Tell us the event and the date, and we will send one free design sample within 24 hours. If you do not like it, there is nothing to pay and no obligation.",
  },
  {
    q: "Do you design in Hindi as well as English?",
    a: "Both. Most school work in Dhanbad is bilingual, so Hindi and English versions are standard at no extra cost on poster and banner packages.",
  },
  {
    q: "I'm a shop or clinic, not a school. Can I still get listed?",
    a: "Yes. Phase one was built around schools, but the same process works for coaching centres, clinics, showrooms and service businesses. Start with a one-time poster or reel, then move to a monthly plan if it works.",
  },
];

export const paymentOptions = [
  { n: "01", title: "Online — UPI", body: "Pay from any UPI app. Receipt sent on the same day." },
  { n: "02", title: "Offline — at your school", body: "Partner schools pay at the school office, exactly like the Olympiad fee." },
  { n: "03", title: "Free design sample first", body: "We design one draft before any money moves." },
];