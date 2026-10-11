"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { AlertCircle, CheckCircle2, Loader2, MailCheck, UserPlus } from "lucide-react";

import { registerClient, type RegisterState } from "@/app/register/actions";
import { budgetBands, site } from "@/lib/site-config";

const initial: RegisterState = { error: null };

const CLIENT_TYPES = [
  { value: "business", label: "Commercial business or showroom" },
  { value: "corporate", label: "Corporate enterprise or builder" },
  { value: "institution", label: "School or educational institution" },
  { value: "other", label: "Something else" },
];

const BUSINESS_TYPES = [
  "Gold & jewellery showroom",
  "Gym & fitness center",
  "Automobile / bike dealership",
  "Retail store / mega shop",
  "Real estate / builder",
  "Hospital / healthcare",
  "Restaurant / hospitality",
  "Coaching centre / institution",
  "Other commercial",
];

/* Bands come from /admin/settings (budget.bands) via props. The import
   below is fallback only, for when the database is unreachable. */
const BUDGET_FALLBACK = budgetBands;

const REFERRALS = [
  "Outdoor hoarding / billboard in Dhanbad",
  "Instagram or Facebook reel",
  "Direct business recommendation",
  "WhatsApp",
  "JTSA official ecosystem",
  "Google Search",
];

export function RegisterForm({ budgets }: { budgets?: string[] }) {
  const [state, action, pending] = useActionState(registerClient, initial);
  const [clientType, setClientType] = useState("business");
  const budgetOptions = budgets?.length ? budgets : BUDGET_FALLBACK;

  if (state.needsConfirmation) {
    return (
      <div className="card-white relative p-7 shadow-[0_22px_56px_rgba(2,6,12,0.55)] md:p-10">
        
        <MailCheck size={40} className="mb-4 text-green" />
        <h1 className="text-[clamp(24px,3.6vw,34px)] leading-none font-extrabold tracking-[-0.032em] uppercase">
          Check your inbox
        </h1>
        <p className="mt-3 text-[15px] leading-[1.8] text-ink-2">
          Your account is created. We have sent a confirmation link to your email —
          open it once to activate your login, then sign in.
        </p>
        <p className="mt-4 border-[2.5px] border-dashed border-ink/35 bg-sticky p-4 text-[13.5px] leading-[1.75]">
          <b>We already have your brief</b> — organisation, budget and what you
          need. Expect a reply within 24 hours, usually much sooner.
        </p>
        <Link href="/login" className="btn btn-green mt-6">
          Go to sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="card-white relative p-7 shadow-[0_22px_56px_rgba(2,6,12,0.55)] md:p-10">
      

      <p className="hand -rotate-2 text-[clamp(20px,2.6vw,28px)] text-red">
        Join the portal
      </p>
      <h1 className="mt-1 text-[clamp(26px,4vw,40px)] leading-none font-extrabold tracking-[-0.032em] uppercase">
        Register your <span className="text-green">business</span>
      </h1>
      <p className="mt-3 text-[14.5px] leading-[1.75] text-ink-2">
        Create a login to track your campaign — milestones, files and invoices —
        the moment we start work. No password to remember later.
      </p>

      <form action={action} className="mt-7 flex flex-col gap-4">
        {/* ── who you are ── */}
        <Field label="Your name" name="fullName" required placeholder="Full name" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Email" name="email" type="email" required placeholder="you@organisation.com" />
          <Field label="Phone / WhatsApp" name="phone" type="tel" required placeholder="10-digit number" />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="mb-2 block text-[10.5px] font-extrabold tracking-[0.2em] text-ink-3 uppercase">
            Choose a password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            placeholder="At least 8 characters"
            autoComplete="new-password"
            className="field"
          />
        </div>

        <div className="h-px bg-ink/15" />

        {/* ── your organisation ── */}
        <p className="-mt-1 text-[11px] font-extrabold tracking-[0.2em] text-green uppercase">
          About your work
        </p>

        <Field
          label="Organisation or business name"
          name="organisation"
          required
          placeholder="e.g. Springdale Public School, or Sharma Electronics"
        />

        <fieldset className="mb-4">
          <legend className="mb-2 text-[10.5px] font-extrabold tracking-[0.2em] text-ink-3 uppercase">
            This is
          </legend>
          <div className="grid gap-2 sm:grid-cols-3">
            {CLIENT_TYPES.map((t) => (
              <label
                key={t.value}
                className={`flex cursor-pointer items-center gap-2.5 border p-3 text-[13px] font-semibold transition ${
                  clientType === t.value
                    ? "border-green bg-green/12 text-ink"
                    : "border-white/14 bg-white/4 text-ink-2 hover:border-green/40 hover:bg-white/7"
                }`}
              >
                <input
                  type="radio"
                  name="clientType"
                  value={t.value}
                  checked={clientType === t.value}
                  onChange={() => setClientType(t.value)}
                  className="accent-current"
                />
                {t.label}
              </label>
            ))}
          </div>
        </fieldset>

        {clientType !== "school" ? (
          <Select label="Kind of business" name="businessType" options={BUSINESS_TYPES} placeholder="Choose one" />
        ) : null}

        <div className="mb-4">
          <label htmlFor="workDescription" className="mb-2 block text-[10.5px] font-extrabold tracking-[0.2em] text-ink-3 uppercase">
            What do you do, and what do you need from us? <span className="text-red">*</span>
          </label>
          <textarea
            id="workDescription"
            name="workDescription"
            required
            rows={4}
            placeholder="e.g. We run a coaching centre for classes 9–12 and need admission posters plus Instagram reels every month."
            className="field"
          />
          <p className="mt-1.5 text-[12px] text-ink-3">
            This is what we read first — it decides what we quote and how fast.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Select label="Monthly budget" name="budgetBand" options={budgetOptions} placeholder="Choose a range" />
          <Field label="Area in Dhanbad" name="area" placeholder="e.g. Barkak deh, Hirapur" />
        </div>

        <Select label="How did you hear about us?" name="referral" options={REFERRALS} placeholder="Choose one (optional)" />

        {state.error ? (
          <p className="flex items-start gap-2 border-[2.5px] border-red bg-red/10 px-3.5 py-3 text-[13px] text-ink">
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
              <Loader2 size={17} className="mr-2 animate-spin" /> Creating your account‚
            </>
          ) : (
            <>
              <UserPlus size={17} className="mr-2" /> Create my account
            </>
          )}
        </button>

        <p className="flex items-start gap-2 text-[12.5px] leading-[1.7] text-ink-3">
          <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-green" />
          By registering you agree we may contact you about your enquiry. Your details
          are never shared with anyone.
        </p>
      </form>

      <p className="mt-7 border-t-2 border-dashed border-ink/25 pt-5 text-[13px] leading-[1.75] text-ink-2">
        Already registered?{" "}
        <Link href="/login" className="font-bold text-green underline">
          Sign in instead
        </Link>{" "}
        — or call{" "}
        <a href={`tel:${site.phoneDigits}`} className="font-bold text-green underline">
          {site.phone}
        </a>
        .
      </p>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div className="mb-4">
      <label
        htmlFor={name}
        className="mb-2 block text-[10.5px] font-extrabold tracking-[0.2em] text-ink-3 uppercase"
      >
        {label}
        {required ? <span className="ml-1 text-red">*</span> : null}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        autoComplete={name === "email" ? "email" : name === "phone" ? "tel" : undefined}
        className="field"
      />
    </div>
  );
}

function Select({
  label,
  name,
  options,
  placeholder,
}: {
  label: string;
  name: string;
  options: string[];
  placeholder: string;
}) {
  return (
    <div className="mb-4">
      <label
        htmlFor={name}
        className="mb-2 block text-[10.5px] font-extrabold tracking-[0.2em] text-ink-3 uppercase"
      >
        {label}
      </label>
      <select id={name} name={name} defaultValue="" className="field cursor-pointer">
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}