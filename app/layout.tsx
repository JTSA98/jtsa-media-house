import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Space_Grotesk } from "next/font/google";

import "./globals.css";
import { site } from "@/lib/site-config";
import { AmbientBackdrop } from "@/components/AmbientBackdrop";
import { RevealOnScroll } from "@/components/RevealOnScroll";

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-brand",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#020F07",
};

export const metadata: Metadata = {
  metadataBase: new URL(site.mainSite),
  title: {
    default: `${site.name} — Commercial Advertising, Hoardings & 4K Reels in Dhanbad`,
    template: `%s · ${site.name}`,
  },
  description:
    "JTSA Media House is the commercial advertising and growth agency of Jharkhand Talent Search Association. Roadside hoardings, 4K viral reels, social retainers, and branding for gold showrooms, gyms, and retail brands in Dhanbad.",
  keywords: [
    "commercial ad agency Dhanbad",
    "JTSA Media House",
    "jewellery showroom advertisement Dhanbad",
    "gym advertising campaign Jharkhand",
    "4k commercial reels Dhanbad",
    "flex hoardings Dhanbad",
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
      className={`${sans.variable} ${spaceGrotesk.variable}`}
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