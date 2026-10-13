import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";

import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { hasAdminAllowList, adminEmails } from "@/lib/admin-auth";
import { site } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Staff sign in",
  robots: { index: false, follow: false },
};

/**
 * Staff sign-in.
 *
 * Lives at /admin/login and is deliberately OUTSIDE the guarded admin layout
 * (the guard lives in the (protected) route group). If this page sat under the
 * guard, signing out would bounce you straight back to a "Staff only" screen
 * pointing at a login page you cannot reach — a loop.
 *
 * Two independent gates still apply before /admin renders anything: the email
 * must be in ADMIN_EMAILS, and the profile must have is_admin set in the
 * database. Both are checked in app/admin/(protected)/layout.tsx.
 */
export default function AdminLoginPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-kraft-2">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.55]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(99,102,241,.09) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,.09) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-56 left-1/2 h-[560px] w-[900px] -translate-x-1/2 rounded-full opacity-70 blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, rgba(99,102,241,.30), rgba(139,92,246,.14) 55%, transparent 72%)",
        }}
      />

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-6 sm:px-8">
        <header className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-xl bg-festive-gradient text-[13px] font-black tracking-tight text-white">
              ADM
            </span>
            <span>
              <b className="block text-[15px] leading-[1.15] font-extrabold tracking-[-0.02em] text-white">
                {site.name}
              </b>
              <span className="block text-[10px] font-bold tracking-[0.22em] text-ink-3 uppercase">
                Staff area
              </span>
            </span>
          </Link>

          <Link
            href="/"
            className="flex items-center gap-2 text-[12px] font-bold tracking-wider text-ink-2 uppercase transition-colors hover:text-white"
          >
            <ArrowLeft size={14} /> Back to site
          </Link>
        </header>

        <main className="grid flex-1 items-center gap-12 py-12 lg:grid-cols-[1fr_0.95fr] lg:py-16">
          <div>
            <p className="text-[11px] font-bold tracking-[0.2em] text-amber-400 uppercase">
              Owners and staff only
            </p>
            <h1 className="mt-3 text-[clamp(30px,5vw,54px)] leading-[1.02] font-extrabold tracking-[-0.035em] text-white uppercase">
              See every client.
              <br />
              <span className="text-gradient-festive">Move every request.</span>
            </h1>

            <ul className="mt-8 flex flex-col gap-3 text-[15px] text-ink-2">
              {[
                "Every booking, with contact details ready to tap",
                "Request status: new → contacted → quoted → working",
                "Live project progress and outstanding balances",
                "Notes on each request, with who changed it and when",
              ].map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <ShieldCheck
                    size={16}
                    aria-hidden
                    className="mt-1 shrink-0 text-emerald"
                  />
                  {t}
                </li>
              ))}
            </ul>

            <p className="mt-8 max-w-[54ch] rounded-2xl border border-white/10 bg-white/5 p-5 text-[13px] leading-[1.75] text-ink-3">
              <b className="block text-ink-2">
                Access is limited to a fixed list of emails
              </b>
              Only addresses listed in{" "}
              <code className="font-mono text-ink-2">ADMIN_EMAILS</code> can get
              past this screen, and each one must also be promoted in the database
              by hand. Nobody can add themselves.
              {hasAdminAllowList ? (
                <>
                  {" "}
                  Currently{" "}
                  <b className="text-ink-2">
                    {adminEmails.length === 1
                      ? "1 address is"
                      : `${adminEmails.length} addresses are`}
                  </b>{" "}
                  allowed.
                </>
              ) : null}
            </p>
          </div>

          <AdminLoginForm allowListCount={hasAdminAllowList ? adminEmails.length : 0} />
        </main>
      </div>
    </div>
  );
}