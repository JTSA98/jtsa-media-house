import Link from "next/link";
import type { Metadata } from "next";

import { PortalNavClient } from "@/components/portal/PortalNavClient";
import { getSignedInEmail } from "@/lib/data";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { site } from "@/lib/site-config";
import type { Profile } from "@/types/database";

export const metadata: Metadata = {
  title: "Client Portal",
  description:
    "Track your JTSA Media House project — milestones, deliverables, invoices and progress.",
};

export default async function PortalLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  let profile: Profile | null = null;

  if (isSupabaseConfigured) {
    const email = await getSignedInEmail();
    if (email) {
      profile = {
        id: "",
        full_name: null,
        email,
        phone: null,
        client_type: null,
        organisation: null,
        business_type: null,
        work_description: null,
        budget_band: null,
        area: null,
        referral: null,
        onboarded_at: null,
        is_admin: false,
        created_at: "",
      };
    }
  }

  return (
    <div className="grid-paper min-h-screen">
      <PortalNavClient profile={profile} />
      <main className="wrap py-10 md:py-14">{children}</main>

      <footer className="wrap pb-10">
        <p className="text-center text-[12.5px] text-ink-3">
          Need something changed urgently?{" "}
          <a
            href={`https://wa.me/${site.phoneDigits}`}
            className="font-bold text-green underline"
          >
            WhatsApp {site.name}
          </a>{" "}
          or call{" "}
          <a href={`tel:${site.phoneDigits}`} className="font-bold text-green underline">
            {site.phone}
          </a>
          .{" "}
          <Link href="/" className="underline">
            Back to the website
          </Link>
        </p>
      </footer>
    </div>
  );
}