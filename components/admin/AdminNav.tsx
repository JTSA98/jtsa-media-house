"use client";

import Link from "next/link";
import { useState } from "react";
import { LayoutDashboard, LogOut, Menu, Settings, Users, X } from "lucide-react";

import { site } from "@/lib/site-config";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminNav({ email }: { email: string | null }) {
  const [open, setOpen] = useState(false);

  async function signOut() {
    const { createClient } = await import("@/lib/supabase/client");
    await createClient().auth.signOut();
    window.location.href = "/login";
  }

  return (
    // was `bg-ink text-kraft`; the token flip turned that into a white bar
    // with near-white text, so the palette is now explicit
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/50 backdrop-blur-xl">
      <div className="wrap flex items-center justify-between gap-4 py-3.5">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-sm border border-red/40 bg-red/12 text-[12px] font-bold tracking-[0.06em] text-red">
            ADM
          </span>
          <span>
            <b className="block text-[14px] leading-tight font-semibold tracking-[0.02em] text-ink">
              {site.name} — Admin
            </b>
            <span className="block text-[9.5px] font-semibold tracking-[0.18em] text-ink-3 uppercase">
              Clients · Requests · Projects
            </span>
          </span>
        </div>

        <nav className="hidden items-center gap-1 sm:flex">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-1.5 rounded-sm border border-transparent px-3 py-1.5 text-[11.5px] font-semibold tracking-[0.08em] text-ink-2 uppercase transition hover:border-green/40 hover:text-green"
            >
              <Icon size={13} /> {label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 sm:flex">
          <span className="rounded-sm border border-white/12 px-3 py-1.5 text-[11.5px] text-ink-2">
            {email}
          </span>
          <button
            type="button"
            onClick={signOut}
            className="flex items-center gap-2 rounded-sm border border-white/12 bg-white/6 px-3.5 py-1.5 text-[11.5px] font-semibold tracking-[0.06em] text-ink uppercase transition hover:border-green/40 hover:text-green"
          >
            <LogOut size={13} /> Sign out
          </button>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          className="flex size-[42px] items-center justify-center rounded-sm border border-white/12 text-ink-2 sm:hidden"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open ? (
        <div className="wrap flex flex-col gap-2 pb-4 sm:hidden">
          <p className="text-[12px] text-ink-3">{email}</p>
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-sm border border-white/12 px-3 py-2 text-[12.5px] font-semibold text-ink-2"
            >
              <Icon size={14} /> {label}
            </Link>
          ))}
          <Link
            href="/"
            className="flex items-center gap-2 rounded-sm border border-white/12 px-3 py-2 text-[12.5px] font-semibold text-ink-2"
          >
            <Users size={14} /> Public website
          </Link>
          <button
            type="button"
            onClick={signOut}
            className="flex items-center justify-center gap-2 rounded-sm border border-white/12 bg-white/6 px-3 py-2 text-[12.5px] font-semibold text-ink"
          >
            <LogOut size={14} /> Sign out
          </button>
        </div>
      ) : null}
    </header>
  );
}