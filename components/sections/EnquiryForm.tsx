"use client";

import { useState } from "react";
import { Check, Loader2, Send } from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { site } from "@/lib/site-config";
import type { FaqItem } from "@/lib/site-config";

const CLIENT_TYPES = [
  "School",
  "Coaching centre",
  "Shop / Showroom",
  "Clinic / Service",
  "Other",
];

const SERVICES = [
  "Posters & Banners",
  "Social Media Campaign",
  "Video / Reel",
  "Website Listing",
  "Full package",
];

type State = "idle" | "sending" | "sent" | "error";

export function EnquiryForm() {
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    setError(null);

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries()) as Record<
      string,
      string
    >;

    // No Supabase yet → hand the enquiry to WhatsApp instead of losing it.
    if (!isSupabaseConfigured) {
      const text = [
        "New enquiry — JTSA Media House",
        "",
        `Name: ${data.name}`,
        `Phone: ${data.phone}`,
        `I am a: ${data.clientType}`,
        `Need: ${data.service}`,
        `Event & date: ${data.event}`,
        data.message ? `Notes: ${data.message}` : "",
      ]
        .filter(Boolean)
        .join("\n");

      window.open(
        `https://wa.me/${site.phoneDigits}?text=${encodeURIComponent(text)}`,
        "_blank",
      );

      form.reset();
      setState("sent");
      return;
    }

    const supabase = createClient();

    const { error: insertError } = await supabase
      .from("enquiries")
      .insert({
      name: data.name,
      phone: data.phone,
      email: data.email || null,
      client_type: data.clientType,
      service: data.service,
      event_note: data.event,
      message: data.message || null,
    });

    if (insertError) {
      setError(insertError.message);
      setState("error");
      return;
    }

    form.reset();
    setState("sent");
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Your name" name="name" required placeholder="Full name" />
        <Field label="Phone / WhatsApp" name="phone" type="tel" required placeholder="10-digit number" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="mb-4">
          <label htmlFor="clientType" className="mb-2 block text-[10.5px] font-extrabold tracking-[0.2em] text-ink-3 uppercase">
            You are a
          </label>
          <select id="clientType" name="clientType" className="field cursor-pointer">
            {CLIENT_TYPES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="service" className="mb-2 block text-[10.5px] font-extrabold tracking-[0.2em] text-ink-3 uppercase">
            Need
          </label>
          <select id="service" name="service" className="field cursor-pointer">
            {SERVICES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <Field label="Event & date" name="event" required placeholder="e.g. Admission open — 15 June" />
      <Field
        label="Anything else"
        name="message"
        placeholder="Number of students, budget, language preference, or the message you want people to read."
      />

      <button
        type="submit"
        disabled={state === "sending"}
        className="btn btn-green !px-[34px] !py-[16px] !text-[13px] !tracking-[0.1em] !uppercase disabled:opacity-60"
      >
        {state === "sending" ? (
          <>
            <Loader2 size={18} className="mr-2 animate-spin" /> Sending…
          </>
        ) : (
          <>
            <Send size={17} className="mr-2" /> Send &amp; Get a Free Sample
          </>
        )}
      </button>

      {state === "sent" ? (
        <p className="mt-4 flex items-center rounded-sm border border-green/40 bg-green/8 px-4 py-3.5 text-center text-[14px] font-medium text-ink">
          <Check size={18} className="mr-2 shrink-0 text-green" />
          Thank you — your enquiry is noted. We reply within 24 hours, usually sooner.
        </p>
      ) : null}

      {state === "error" ? (
        <p className="mt-4 rounded-sm border border-red/40 bg-red/8 px-4 py-3.5 text-[13.5px] text-ink-2">
          Could not save that just now — {error}. Please WhatsApp or call us on{" "}
          <a href={`tel:${site.phoneDigits}`} className="font-semibold text-green underline">
            {site.phone}
          </a>
          .
        </p>
      ) : null}
    </form>
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
      <label htmlFor={name} className="mb-2 block text-[10.5px] font-extrabold tracking-[0.2em] text-ink-3 uppercase">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="field"
      />
    </div>
  );
}

export type { FaqItem };