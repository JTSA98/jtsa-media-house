import type { Metadata } from "next";
import Link from "next/link";
import { Lock } from "lucide-react";

import { LoginForm } from "@/components/portal/LoginForm";
import { isSupabaseConfigured, supabaseConfigProblem } from "@/lib/supabase/config";
import { site } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Client Login",
  description: `Sign in to track your ${site.name} project.`,
};

export default function LoginPage() {
  return (
    <div className="grid-paper min-h-screen">
      <header className="border-b-[2.5px] border-ink bg-kraft">
        <div className="wrap flex items-center justify-between py-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="-rotate-3 flex size-11 items-center justify-center border-[2.5px] border-ink bg-green text-[15px] font-extrabold text-white shadow-[0_8px_22px_rgba(2,6,12,0.5)]">
              {site.shortName}
            </span>
            <span>
              <b className="block text-[16px] leading-[1.15] font-extrabold tracking-[-0.02em]">
                {site.name}
              </b>
              <span className="block text-[10px] font-bold tracking-[0.22em] text-ink-2 uppercase">
                Client portal
              </span>
            </span>
          </Link>
          <Link href="/" className="text-[13px] font-extrabold text-ink-2 underline hover:text-green">
            Back to site
          </Link>
        </div>
      </header>

      <main className="wrap grid items-center gap-10 py-12 lg:grid-cols-[1fr_0.9fr] lg:py-20">
        <div>
          <p className="hand -rotate-2 text-[clamp(22px,3vw,32px)] text-red">
            Know where your project stands
          </p>
          <h2 className="mt-2 text-[clamp(32px,5.6vw,62px)] leading-none font-extrabold tracking-[-0.035em] uppercase">
            Every step,<br />
            <span className="text-green">as it happens</span>
          </h2>
          <ul className="mt-8 flex flex-col gap-3.5">
            {[
              "A percentage bar for the whole project",
              "Milestones you can approve or send back",
              "Print files, reels and designs to download",
              "Invoices and what is still payable",
              "Written updates from the team",
            ].map((t) => (
              <li key={t} className="flex items-start gap-3 text-[15.5px] text-ink-2">
                <span aria-hidden className="shrink-0 font-extrabold text-green">
                  ✓
                </span>
                {t}
              </li>
            ))}
          </ul>

          {!isSupabaseConfigured ? (
            <p className="mt-8 max-w-[52ch] border-[2.5px] border-dashed border-ink/40 bg-sticky p-4 text-[13px] leading-[1.75]">
              <b className="block">Setup needed</b>
              {supabaseConfigProblem}
            </p>
          ) : null}
        </div>

        <LoginForm demoMode={!isSupabaseConfigured} />
      </main>

      <footer className="wrap pb-10 text-center">
        <p className="flex items-center justify-center gap-2 text-[12.5px] text-ink-3">
          <Lock size={13} /> Your files and invoices are visible only to your account.
        </p>
      </footer>
    </div>
  );
}