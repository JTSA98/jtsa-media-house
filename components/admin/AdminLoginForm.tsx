"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { AlertCircle, Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";

import { adminSignIn, type AdminLoginState } from "@/app/admin/login/actions";

const initial: AdminLoginState = { error: null };

export function AdminLoginForm({ allowListCount }: { allowListCount: number }) {
  const [state, formAction, pending] = useActionState(adminSignIn, initial);
  const [show, setShow] = useState(false);

  return (
    <div className="glass-card relative p-7 md:p-10">
      
      <div className="mb-4 flex size-14 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-300">
        <ShieldCheck size={26} strokeWidth={2.5} />
      </div>

      <h1 className="text-[clamp(22px,3vw,30px)] font-extrabold tracking-[-0.03em] text-white">
        Staff sign in
      </h1>
      <p className="mt-2.5 text-[14px] leading-[1.75] text-ink-2">
        Restricted to owner accounts. Anyone not on the allow-list is refused here.
      </p>

      {allowListCount === 0 ? (
        <p className="mt-5 rounded-xl border border-red/40 bg-red/10 px-3.5 py-3 text-[13px] leading-[1.7] text-ink-2">
          <b className="text-red">No admin allow-list configured.</b> Add your email to{" "}
          <code className="font-mono text-ink-2">ADMIN_EMAILS</code> in <code className="font-mono text-ink-2">.env.local</code>{" "}
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
              className="absolute top-1/2 right-3 -translate-y-1/2 rounded-lg bg-white/10 p-1.5 text-ink-2 transition hover:bg-white/20 hover:text-white"
            >
              {show ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        {state.error ? (
          <p
            className={`flex items-start gap-2 rounded-xl px-3.5 py-3 text-[13px] text-ink-2 ${
              state.notAllowed
                ? "border border-white/10 bg-white/5"
                : "border border-red/40 bg-red/10"
            }`}
          >
            <AlertCircle
              size={16}
              className={`mt-0.5 shrink-0 ${state.notAllowed ? "text-amber-400" : "text-red"}`}
            />
            {state.error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={pending || allowListCount === 0}
          className="flex w-full items-center justify-center rounded-xl bg-festive-gradient !py-[17px] text-xs font-black tracking-wider text-white uppercase transition hover:opacity-95 disabled:opacity-50"
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

      <p className="mt-7 border-t border-white/10 pt-5 text-center text-[12.5px] text-ink-3">
        <Link href="/" className="font-bold text-ink-2 underline hover:text-white">
          ← Back to the website
        </Link>
      </p>
    </div>
  );
}