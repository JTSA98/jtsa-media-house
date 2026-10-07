"use client";

import Link from "next/link";
import { useActionState } from "react";
import { AlertCircle, Loader2, LogIn, ShieldCheck, UserPlus } from "lucide-react";

import { signIn, type LoginState } from "@/app/login/actions";
import { site } from "@/lib/site-config";

const initial: LoginState = { error: null };

export function LoginForm({ demoMode }: { demoMode: boolean }) {
  const [state, formAction, pending] = useActionState(signIn, initial);

  return (
    <div className="card-white relative p-7 shadow-[7px_7px_0_var(--color-ink)] md:p-10">
      <span aria-hidden className="tape -top-[14px] left-[14%] -rotate-3" />

      <h1 className="text-[clamp(26px,4vw,38px)] leading-none font-extrabold tracking-[-0.032em] uppercase">
        Client <span className="text-green">login</span>
      </h1>
      <p className="mt-2.5 text-[14.5px] leading-[1.75] text-ink-2">
        Sign in to see how much of your project is done — milestones, files and
        invoices.
      </p>

      {demoMode ? (
        <p className="mt-5 border-[2.5px] border-dashed border-ink/40 bg-sticky p-3.5 text-[13px] leading-[1.7]">
          <b>Supabase not connected yet.</b> Press Sign in to preview the portal with
          sample data.
        </p>
      ) : null}

      <form action={formAction} className="mt-6 flex flex-col gap-4">
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-[10.5px] font-extrabold tracking-[0.2em] text-ink-3 uppercase"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="you@yourschool.edu"
            autoComplete="email"
            className="field"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-[10.5px] font-extrabold tracking-[0.2em] text-ink-3 uppercase"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            placeholder="••••••••"
            autoComplete="current-password"
            className="field"
          />
        </div>

        {state.error ? (
          <p className="flex items-start gap-2 border-[2.5px] border-red bg-[#FBE7E2] px-3.5 py-3 text-[13px] text-ink">
            <AlertCircle size={16} className="mt-0.5 shrink-0 text-red" />
            {state.error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={pending}
          className="btn btn-green w-full !py-[17px] disabled:opacity-60"
        >
          {pending ? (
            <>
              <Loader2 size={17} className="mr-2 animate-spin" /> Signing in…
            </>
          ) : (
            <>
              <LogIn size={17} className="mr-2" /> Sign in
            </>
          )}
        </button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <span className="h-[2px] flex-1 bg-ink/20" />
        <span className="text-[11px] font-extrabold tracking-[0.2em] text-ink-3 uppercase">
          or
        </span>
        <span className="h-[2px] flex-1 bg-ink/20" />
      </div>

      <Link href="/register" className="btn btn-yellow w-full !py-[16px]">
        <UserPlus size={17} className="mr-2" />
        Register my business
      </Link>

      <p className="mt-2.5 text-center text-[12.5px] leading-[1.7] text-ink-3">
        New school, shop or client? Register once and track every campaign in one
        place.
      </p>

      <p className="mt-7 border-t-2 border-dashed border-ink/25 pt-5 text-[13px] leading-[1.75] text-ink-2">
        Trouble signing in, or you were registered by us?{" "}
        <a href={`mailto:${site.email}`} className="font-bold text-green underline">
          Email us
        </a>{" "}
        with your business name and we will reset it, or call{" "}
        <a href={`tel:${site.phoneDigits}`} className="font-bold text-green underline">
          {site.phone}
        </a>
        .
      </p>

      <Link
        href="/staff-login"
        className="mt-4 flex items-center justify-center gap-2 border-2 border-ink bg-ink px-3 py-2.5 text-[12.5px] font-extrabold text-kraft transition hover:bg-red hover:text-white"
      >
        <ShieldCheck size={14} /> Owner / staff sign in
      </Link>

      <Link
        href="/"
        className="mt-3 block text-center text-[12.5px] font-bold text-ink-2 underline hover:text-green"
      >
        ← Back to the website
      </Link>
    </div>
  );
}