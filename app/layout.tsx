import type { Metadata } from "next";
import { Caveat, Karla, Patrick_Hand } from "next/font/google";

import "./globals.css";
import { site } from "@/lib/site-config";

const karla = Karla({
  subsets: ["latin"],
  variable: "--font-karla",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
});

const patrickHand = Patrick_Hand({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-hand",
  display: "swap",
});

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
    images: ["/images/real-win.jpg"],
    locale: "en_IN",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${karla.variable} ${caveat.variable} ${patrickHand.variable} grain`}
    >
      <body>{children}</body>
    </html>
  );
}