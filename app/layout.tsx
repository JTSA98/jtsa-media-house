import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";

import "./globals.css";
import { site } from "@/lib/site-config";
import { fetchSettings, settingBool, setting } from "@/lib/settings";
import { AmbientBackdrop } from "@/components/AmbientBackdrop";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";

/* Brand & Design Kit type stack (per the layout reference):
   Montserrat — headings, uppercase, wide tracking
   Plus Jakarta Sans — body and UI
   Variable names kept as --font-sans / --font-brand so the existing
   class names keep resolving. */
const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const display = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-brand",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#0B0F19",
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

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const s = await fetchSettings();

  return (
    <html
      lang="en"
      className={`${sans.variable} ${display.variable}`}
    >
      <body>
        <AmbientBackdrop />
        {/* Mounted once here — not per page — so [data-reveal] blocks on
            EVERY route (portal cards included) resolve instead of hiding. */}
        <RevealOnScroll />
        {children}

        {settingBool(s, "wa.enabled", true) ? (
          <FloatingWhatsApp
            digits={setting(s, "site.phone_digits", "")}
            label={setting(s, "wa.label", "Chat with us")}
            sublabel={setting(s, "wa.sublabel", "")}
            message={setting(
              s,
              "wa.prefill",
              `Hi ${site.name}, I'd like to know more about your campaign packages.`,
            )}
          />
        ) : null}
      </body>
    </html>
  );
}