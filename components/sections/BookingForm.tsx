"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, Send, ShieldCheck } from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { SiteView } from "@/lib/settings";

type State = "idle" | "sending" | "sent" | "error";

export function BookingForm({
  site,
  packages,
  sectors,
}: {
  site: SiteView;
  packages: { id: string; label: string }[];
  sectors: string[];
}) {
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

    const digits = data.phone.replace(/\D/g, "");
    const wa = digits.length >= 10 ? digits.slice(-10) : "";

    if (!isSupabaseConfigured) {
      const text = [
        "Campaign booking — JTSA Media House",
        "",
        `Business: ${data.business}`,
        `Phone: ${data.phone}`,
        `Sector: ${data.sector}`,
        `Package: ${data.package}`,
        data.requirements ? `Notes: ${data.requirements}` : "",
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
        name: data.business,
        phone: data.phone,
        email: data.email || null,
        client_type: "other",
        service: data.package,
        event_note: `${data.sector} — campaign booking`,
        message: [
          data.requirements ? `Notes: ${data.requirements}` : "",
          wa ? `WhatsApp: https://wa.me/${wa}` : "",
        ]
          .filter(Boolean)
          .join("\n") || null,
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
    <div className="glass-card relative rounded-3xl border border-white/10 p-6 sm:p-10">
      <form onSubmit={onSubmit} noValidate className="space-y-4">
        <h3 className="mb-2 text-lg font-extrabold text-white">
          Request a pitch &amp; reserve your package
        </h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="book-business"
              className="mb-1 block text-xs font-bold text-ink-2 uppercase"
            >
              Business name *
            </label>
            <input
              id="book-business"
              name="business"
              required
              placeholder="e.g. Apex Academy"
              className="field"
            />
          </div>
          <div>
            <label
              htmlFor="book-phone"
              className="mb-1 block text-xs font-bold text-ink-2 uppercase"
            >
              Phone / WhatsApp *
            </label>
            <input
              id="book-phone"
              name="phone"
              type="tel"
              required
              placeholder="10-digit mobile number"
              className="field"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="book-sector"
              className="mb-1 block text-xs font-bold text-ink-2 uppercase"
            >
              Business sector *
            </label>
            <select id="book-sector" name="sector" required className="field cursor-pointer">
              <option value="">Select sector</option>
              {sectors.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="book-package"
              className="mb-1 block text-xs font-bold text-ink-2 uppercase"
            >
              Preferred package *
            </label>
            <select id="book-package" name="package" required className="field cursor-pointer">
              {packages.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label
            htmlFor="book-req"
            className="mb-1 block text-xs font-bold text-ink-2 uppercase"
          >
            Requirements / target date
          </label>
          <textarea
            id="book-req"
            name="requirements"
            rows={3}
            placeholder="Tell us about your festive goals or location details."
            className="field"
          />
        </div>

        <button
          type="submit"
          disabled={state === "sending"}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-festive-gradient py-4 text-xs font-black tracking-wider text-white uppercase shadow-xl shadow-violet-600/20 transition-all hover:opacity-95 disabled:opacity-60"
        >
          {state === "sending" ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Sending…
            </>
          ) : (
            <>
              <Send size={15} /> Lock in your slot
            </>
          )}
        </button>

        <p className="text-center text-[10px] text-ink-3">
          Our regional strategist will confirm creator availability shortly.
        </p>
      </form>

      {state === "sent" ? (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 rounded-3xl bg-kraft-2/95 p-8 text-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-emerald/20 text-3xl text-emerald">
            <CheckCircle2 size={30} />
          </div>
          <h4 className="text-2xl font-extrabold text-white">
            Campaign request received
          </h4>
          <p className="max-w-sm text-xs text-ink-3">
            Our {site.city} team has your details and will call you on the number
            you registered.
          </p>
          <button
            type="button"
            onClick={() => setState("idle")}
            className="rounded-xl bg-white/10 px-6 py-2 text-xs font-bold tracking-wider text-white uppercase hover:bg-white/20"
          >
            Close
          </button>
        </div>
      ) : null}

      {state === "error" ? (
        <p className="mt-3 rounded-lg border border-red/40 bg-red/10 p-3 text-[13px] text-ink-2">
          Could not save that just now — {error}. Please call us on{" "}
          <a href={`tel:${site.phoneDigits}`} className="font-semibold text-amber-400 underline">
            {site.phone}
          </a>
          .
        </p>
      ) : null}

      <p className="mt-5 flex items-start gap-2 rounded-2xl border border-white/5 bg-white/5 p-4 text-xs text-ink-3">
        <ShieldCheck size={15} className="mt-0.5 shrink-0 text-emerald" />
        <span>
          <b className="text-emerald">Quality assurance SLA.</b> If an assigned
          creator misses the scheduled date, we replace them with an equivalent
          or higher-tier creator at no additional cost.
        </span>
      </p>
    </div>
  );
}