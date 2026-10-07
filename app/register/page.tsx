import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Lock } from "lucide-react";

import { RegisterForm } from "@/components/portal/RegisterForm";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { site } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Register",
  description: `Create a ${site.name} client account to track your campaign.`,
};

export default function RegisterPage() {
  const perks = [
    "A percentage bar for the whole project",
    "Milestones you can approve or send back",
    "Print files, reels and designs to download",
    "Invoices and what is still payable",
    "Written updates from the team",
  ];

  return (
    <div className="grid-paper min-h-screen">
      <header className="border-b-[2.5px] border-ink bg-kraft">
        <div className="wrap flex items-center justify-between py-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="-rotate-3 flex size-11 items-center justify-center border-[2.5px] border-ink bg-green text-[15px] font-extrabold text-white shadow-[3px_3px_0_var(--color-ink)]">
              {site.shortName}
            </span>
            <span>
              <b className="block text-[16px] leading-[1.15] font-extrabold tracking-[-0.02em]">
                {site.name}
              </b>
              <span className="block text-[10px] font-bold tracking-[0.22em] text-ink-2 uppercase">
                New client
              </span>
            </span>
          </Link>
          <Link href="/login" className="text-[13px] font-extrabold text-ink-2 underline hover:text-green">
            Already registered? Sign in
          </Link>
        </div>
      </header>

      <main className="wrap grid items-start gap-10 py-12 lg:grid-cols-[1fr_1.15fr] lg:py-16">
        <div className="lg:sticky lg:top-8">
          <p className="hand -rotate-2 text-[clamp(22px,3vw,32px)] text-red">
            Naam Bada Kar Denge
          </p>
          <h2 className="mt-2 text-[clamp(30px,5vw,56px)] leading-none font-extrabold tracking-[-0.035em] uppercase">
            One account.<br />
            <span className="text-green">Everything tracked.</span>
          </h2>
          <p className="mt-4 max-w-[46ch] text-[15.5px] leading-[1.85] text-ink-2">
            Register once and you get a private page for every project we run for
            you. No chasing us for status updates — it is all on your screen.
          </p>

          <ul className="mt-8 flex flex-col gap-3">
            {perks.map((t) => (
              <li key={t} className="flex items-start gap-3 text-[15px] text-ink-2">
                <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-green" />
                {t}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-ink-3">
            <span className="flex items-center gap-1.5">
              <Lock size={13} /> Only you can see your files
            </span>
            <span>Free to register</span>
          </div>
        </div>

        <div className="lg:col-span-1">
          {!isSupabaseConfigured ? (
            <p className="mb-5 border-[2.5px] border-dashed border-ink/40 bg-sticky p-4 text-[13px] leading-[1.75]">
              <b className="block">Supabase not connected</b>
              Registration needs the database. Email{" "}
              <a href={`mailto:${site.email}`} className="font-bold text-green underline">
                {site.email}
              </a>{" "}
              and we will set your login up by hand.
            </p>
          ) : null}

          <RegisterForm />
        </div>
      </main>

      <footer className="wrap pb-10 text-center">
        <Link href="/" className="text-[12.5px] font-bold text-ink-2 underline hover:text-green">
          ← Back to the website
        </Link>
      </footer>
    </div>
  );
}