"use client";

import Link from "next/link";
import { useState } from "react";
import { FolderOpen, LogOut, Menu, X } from "lucide-react";

import { site } from "@/lib/site-config";
import type { Profile } from "@/types/database";

export function PortalNavClient({ profile }: { profile?: Profile | null }) {
  const [open, setOpen] = useState(false);

  async function signOut() {
    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  return (
    <header className="border-b-[2.5px] border-ink bg-kraft">
      <div className="wrap flex items-center justify-between gap-4 py-4">
        <Link href="/portal" className="flex items-center gap-3">
          <span className="-rotate-3 flex size-11 items-center justify-center border-[2.5px] border-ink bg-green text-[15px] font-extrabold text-white shadow-[0_8px_22px_rgba(2,6,12,0.5)]">
            {site.shortName}
          </span>
          <span>
            <b className="block text-[16px] leading-[1.15] font-extrabold tracking-[-0.02em]">
              Client Portal
            </b>
            <span className="block text-[10px] font-bold tracking-[0.22em] text-ink-2 uppercase">
              Project tracking
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-3 sm:flex">
          {profile?.full_name ? (
            <span className="hand rotate-1 bg-sticky px-3 py-1.5 text-[19px]">
              Hi, {profile.full_name.split(" ")[0]} 👋
            </span>
          ) : null}
          <button
            type="button"
            onClick={signOut}
            className="flex items-center gap-2 border-[2.5px] border-ink bg-white px-3.5 py-2 text-[12.5px] font-extrabold transition hover:bg-sticky hover:shadow-[0_8px_22px_rgba(2,6,12,0.5)]"
          >
            <LogOut size={14} /> Sign out
          </button>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle portal menu"
          className="flex size-[42px] items-center justify-center border-[2.5px] border-ink bg-yellow shadow-[0_8px_22px_rgba(2,6,12,0.5)] sm:hidden"
        >
          {open ? <X size={20} strokeWidth={2.5} /> : <Menu size={20} strokeWidth={2.5} />}
        </button>
      </div>

      {open ? (
        <div className="wrap flex flex-col gap-2.5 pb-4 sm:hidden">
          <Link
            href="/"
            className="flex items-center gap-2 border-2 border-ink bg-white px-3 py-2 text-[13px] font-bold"
          >
            <FolderOpen size={14} /> Back to website
          </Link>
          <button
            type="button"
            onClick={signOut}
            className="flex items-center justify-center gap-2 border-[2.5px] border-ink bg-white px-3 py-2.5 text-[13px] font-extrabold"
          >
            <LogOut size={14} /> Sign out
          </button>
        </div>
      ) : null}
    </header>
  );
}