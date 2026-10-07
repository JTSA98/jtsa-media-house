"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { AlertCircle, Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";

import { adminSignIn, type AdminLoginState } from "@/app/staff-login/actions";

const initial: AdminLoginState = { error: null };

export function AdminLoginForm({ allowListCount }: { allowListCount: number }) {
  const [state, formAction, pending] = useActionState(adminSignIn, initial);
  const [show, setShow] = useState(false);

  return (
    <div className="card-white relative p-7 shadow-[7px_7px_0_rgba(0,0,0,0.92)] md:p-10">
      <span aria-hidden className="tape -top-[14px] left-[14%] -rotate-3" />

      <div className="mb-4 flex size-14 items-center justify-center border-[2.5px] border-ink bg-red text-white">
        <ShieldCheck size={26} strokeWidth={2.5} />
      </div>

      <h1 className="text-[clamp(24px,3.6vw,34px)] leading-none font-extrabold tracking-[-0.032em] uppercase">
        Staff sign in
      </h1>
      <p className="mt-2.5 text-[14px] leading-[1.75] text-ink-2">
        Restricted to owner accounts. Client logins are refused here even if they
        know this page exists.
      </p>

      {allowListCount === 0 ? (
        <p className="mt-5 border-[2.5px] border-red bg-[#FBE7E2] px-3.5 py-3 text-[13px] leading-[1.7]">
          <b>No admin allow-list configured.</b> Add your email to{" "}
          <code className="font-mono">ADMIN_EMAILS</code> in <code className="font-mono">.env.local</code>{" "}
          and restart the server.
        </p>
      ) : null}

      <form action={formAction} className="mt-6 flex flex-col gap-4">
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-[10.5px] font-extrabold tracking-[0.2em] text-ink-3 uppercase"
          >
            Owner email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="username"
            placeholder="you@yourdomain.com"
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
          <div className="relative">
            <input
              id="password"
              name="password"
              type={show ? "text" : "password"}
              required
              autoComplete="current-password"
              placeholder="••••••••"
              className="field !pr-12"
            />
            <button
              type="button"
              onClick={() => setShow((v) => !v)}
              aria-label={show ? "Hide password" : "Show password"}
              className="absolute top-1/2 right-3 -translate-y-1/2 border-2 border-ink bg-white p-1.5 text-ink transition hover:bg-sticky"
            >
              {show ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        {state.error ? (
          <p
            className={`flex items-start gap-2 border-[2.5px] px-3.5 py-3 text-[13px] text-ink ${
              state.notAllowed
                ? "border-ink bg-sticky"
                : "border-red bg-[#FBE7E2]"
            }`}
          >
            <AlertCircle
              size={16}
              className={`mt-0.5 shrink-0 ${state.notAllowed ? "text-ink" : "text-red"}`}
            />
            {state.error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={pending || allowListCount === 0}
          className="btn btn-green w-full !py-[17px] disabled:opacity-50"
        >
          {pending ? (
            <>
              <Loader2 size={17} className="mr-2 animate-spin" /> Checking…
            </>
          ) : (
            <>
              <ShieldCheck size={17} className="mr-2" /> Enter staff area
            </>
          )}
        </button>
      </form>

      <div className="mt-7 space-y-2 border-t-2 border-dashed border-ink/25 pt-5 text-center text-[12.5px]">
        <p className="text-ink-2">
          Are you a client?{" "}
          <Link href="/login" className="font-bold text-green underline">
            Sign in here instead
          </Link>
        </p>
        <Link href="/" className="block font-bold text-ink-2 underline hover:text-green">
          ← Back to the website
        </Link>
      </div>
    </div>
  );
}