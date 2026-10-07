import type { Metadata } from "next";
import Link from "next/link";

import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { hasAdminAllowList, adminEmails } from "@/lib/admin-auth";
import { site } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Staff sign in",
  robots: { index: false, follow: false },
};

export default function StaffLoginPage() {
  return (
    <div className="grid-paper min-h-screen">
      <header className="border-b-[2.5px] border-ink bg-ink text-kraft">
        <div className="wrap flex items-center justify-between py-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex size-11 items-center justify-center border-2 border-kraft bg-red text-[15px] font-extrabold text-white">
              ADM
            </span>
            <span>
              <b className="block text-[16px] leading-[1.15] font-extrabold tracking-[-0.02em] text-white">
                {site.name}
              </b>
              <span className="block text-[10px] font-bold tracking-[0.22em] text-kraft/60 uppercase">
                Staff area
              </span>
            </span>
          </Link>
          <Link
            href="/login"
            className="text-[13px] font-extrabold text-kraft underline hover:text-yellow"
          >
            Client sign in
          </Link>
        </div>
      </header>

      <main className="wrap grid items-center gap-10 py-12 lg:grid-cols-[1fr_0.95fr] lg:py-20">
        <div>
          <p className="hand -rotate-2 text-[clamp(22px,3vw,32px)] text-red">
            Owners and staff only
          </p>
          <h2 className="mt-2 text-[clamp(30px,5vw,58px)] leading-none font-extrabold tracking-[-0.035em] uppercase">
            See every client.<br />
            <span className="text-green">Move every request.</span>
          </h2>
          <ul className="mt-8 flex flex-col gap-3 text-[15px] text-ink-2">
            {[
              "Every registration, with contact details ready to tap",
              "Request status: new → contacted → quoted → working",
              "Live project progress and outstanding balances",
              "Notes on each request, with who changed it and when",
            ].map((t) => (
              <li key={t} className="flex items-start gap-3">
                <span aria-hidden className="shrink-0 font-extrabold text-green">
                  ✓
                </span>
                {t}
              </li>
            ))}
          </ul>

          <p className="mt-8 max-w-[52ch] border-[2.5px] border-dashed border-ink/35 bg-sticky p-4 text-[13px] leading-[1.75]">
            <b className="block">Access is limited to a fixed list of emails</b>
            Only addresses listed in <code className="font-mono">ADMIN_EMAILS</code>{" "}
            can get past this screen, and each one must also be promoted in the
            database by hand. A client can register, sign in and use the portal —
            but never reach the staff area.
            {hasAdminAllowList ? (
              <>
                {" "}
                Currently{" "}
                <b>
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
  );
}