import type { Metadata, Viewport } from "next";
import { Inter, Montserrat } from "next/font/google";

import "./globals.css";
import { site } from "@/lib/site-config";
import { AmbientBackdrop } from "@/components/AmbientBackdrop";
import { RevealOnScroll } from "@/components/RevealOnScroll";

/* Brand & Design Kit type stack:
   Montserrat 700/800 — headings, uppercase, wide tracking
   Inter — body and UI
   The CSS variable names are deliberately kept as --font-karla /
   --font-hand so existing class names keep resolving. A second,
   full-weight Montserrat load was dropped: nothing used it. */
const karla = Inter({
  subsets: ["latin"],
  variable: "--font-karla",
  display: "swap",
});

const display = Montserrat({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-hand",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#0B192C",
};

export const metadata: Metadata = {
  metadataBase: new URL(site.mainSite),
  title: {
    default: `${site.name} — Posters, Reels & Campaigns for Schools and Shops in Dhanbad`,
    template: `%s · ${site.name}`,
  },
  description:
    "JTSA Media House is the advertising arm of Jharkhand Talent Search Association. Posters, banners, reels, social campaigns and website listings for schools and local businesses in Dhanbad.",
  keywords: [
    "ad agency Dhanbad",
    "JTSA Media House",
    "school admission poster Dhanbad",
    "social media campaign Jharkhand",
    "reel making Dhanbad",
    "flex printing Dhanbad",
    "standee design Jharkhand",
  ],
  openGraph: {
    type: "website",
    title: `${site.name} — ${site.tagline}`,
    description:
      "Posters, reels, social campaigns and website listings for schools and local businesses in Dhanbad.",
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: `${site.name} — Posters, Reels & Campaigns in Dhanbad`,
      },
    ],
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description:
      "Posters, reels, social campaigns and website listings for schools and local businesses in Dhanbad.",
    images: ["/og.jpg"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${karla.variable} ${display.variable}`}
    >
      <body>
        <AmbientBackdrop />
        {/* Mounted once here — not per page — so [data-reveal] blocks on
            EVERY route (portal cards included) resolve instead of hiding. */}
        <RevealOnScroll />
        {children}
      </body>
    </html>
  );
}