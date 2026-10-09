import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";

import "./globals.css";
import { site } from "@/lib/site-config";
import { AmbientBackdrop } from "@/components/AmbientBackdrop";

/* Brand & Design Kit type stack:
   Montserrat — headings, uppercase, wide tracking
   Inter — body and UI
   The CSS variable names are deliberately kept as --font-karla /
   --font-caveat / --font-hand so existing class names keep resolving. */
const karla = Inter({
  subsets: ["latin"],
  variable: "--font-karla",
  display: "swap",
});

const caveat = Montserrat({
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
});

const patrickHand = Montserrat({
  subsets: ["latin"],
  weight: "700",
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
      className={`${karla.variable} ${caveat.variable} ${patrickHand.variable}`}
    >
      <body>
        <AmbientBackdrop />
        {children}
      </body>
    </html>
  );
}