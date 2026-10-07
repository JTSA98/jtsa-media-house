import Link from "next/link";
import { Lock, ShieldAlert } from "lucide-react";

import { loadAdminData } from "@/lib/admin-data";
import { AdminNav } from "@/components/admin/AdminNav";

export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const view = await loadAdminData();

  // Not signed in, or signed in without admin rights. RLS already blocks
  // the data — this just makes the refusal readable.
  if (!view.isAdmin) {
    return (
      <div className="grid-paper flex min-h-screen items-center justify-center p-6">
        <div className="card-white max-w-[540px] p-9 text-center">
          <ShieldAlert size={40} className="mx-auto mb-4 text-red" />
          <h1 className="text-[26px] leading-none font-extrabold tracking-[-0.03em] uppercase">
            Staff only
          </h1>

          {view.notAllowlisted ? (
            <p className="mt-3 text-[14.5px] leading-[1.8] text-ink-2">
              You are signed in as{" "}
              <b className="text-ink">{view.signedInAs}</b>, but that address is not
              in the staff allow-list. Client accounts can use the{" "}
              <Link href="/portal" className="font-bold text-green underline">
                project portal
              </Link>{" "}
              — just not this page.
            </p>
          ) : view.signedInAs ? (
            <p className="mt-3 text-[14.5px] leading-[1.8] text-ink-2">
              You are signed in as{" "}
              <b className="text-ink">{view.signedInAs}</b>, but this account has not
              been granted staff access. Ask the site owner to promote it.
            </p>
          ) : (
            <p className="mt-3 text-[14.5px] leading-[1.8] text-ink-2">
              Sign in with a staff account to see clients, requests and projects.
            </p>
          )}

          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link href="/staff-login" className="btn btn-green">
              <Lock size={16} className="mr-2" /> Staff sign in
            </Link>
            <Link href="/portal" className="btn btn-white">
              Client portal
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <AdminNav email={view.signedInAs} />
      <main className="wrap py-8">{children}</main>
    </div>
  );
}