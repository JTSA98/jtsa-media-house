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
    <header className="sticky top-0 z-50 border-b-[2.5px] border-ink bg-ink text-kraft">
      <div className="wrap flex items-center justify-between gap-4 py-3.5">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center border-2 border-kraft bg-red text-[13px] font-extrabold text-white">
            ADM
          </span>
          <span>
            <b className="block text-[15px] leading-tight font-extrabold tracking-[-0.02em] text-white">
              {site.name} — Admin
            </b>
            <span className="block text-[10px] font-bold tracking-[0.2em] text-kraft/60 uppercase">
              Clients · Requests · Projects
            </span>
          </span>
        </div>

        <nav className="hidden items-center gap-1 sm:flex">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-1.5 border-2 border-transparent px-3 py-1.5 text-[12px] font-bold transition hover:border-kraft"
            >
              <Icon size={13} /> {label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 sm:flex">
          <span className="border-2 border-kraft/40 px-3 py-1.5 text-[12px] font-bold">
            {email}
          </span>
          <button
            type="button"
            onClick={signOut}
            className="flex items-center gap-2 border-2 border-kraft bg-kraft px-3.5 py-1.5 text-[12px] font-extrabold text-ink transition hover:bg-yellow"
          >
            <LogOut size={13} /> Sign out
          </button>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          className="flex size-[42px] items-center justify-center border-2 border-kraft sm:hidden"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open ? (
        <div className="wrap flex flex-col gap-2 pb-4 sm:hidden">
          <p className="text-[12px] font-bold text-kraft/70">{email}</p>
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 border-2 border-kraft px-3 py-2 text-[13px] font-bold text-kraft"
            >
              <Icon size={14} /> {label}
            </Link>
          ))}
          <Link
            href="/"
            className="flex items-center gap-2 border-2 border-kraft px-3 py-2 text-[13px] font-bold text-kraft"
          >
            <Users size={14} /> Public website
          </Link>
          <button
            type="button"
            onClick={signOut}
            className="flex items-center justify-center gap-2 border-2 border-kraft bg-kraft px-3 py-2 text-[13px] font-extrabold text-ink"
          >
            <LogOut size={14} /> Sign out
          </button>
        </div>
      ) : null}
    </header>
  );
}