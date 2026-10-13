import { Building, MapPin, Phone } from "lucide-react";

import { BookingForm } from "@/components/sections/BookingForm";
import type { SiteView } from "@/lib/settings";

export function Booking({
  site,
  packages,
  sectors,
  kicker,
  heading,
  body,
  capNote,
}: {
  site: SiteView;
  packages: { id: string; label: string }[];
  sectors: string[];
  kicker: string;
  heading: string;
  body: string;
  capNote: string;
}) {
  return (
    <section id="booking" className="relative border-t border-white/5 bg-kraft/50 py-20">
      <div className="wrap">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* left: direct info */}
          <div className="space-y-6 lg:col-span-5">
            <span className="text-xs font-bold tracking-widest text-amber-400 uppercase">
              {kicker}
            </span>
            <h2 className="text-2xl font-extrabold text-white sm:text-4xl">
              {heading}
            </h2>
            <p className="text-sm leading-relaxed text-ink-2">{body}</p>

            <div className="space-y-4 pt-4">
              <a
                href={`tel:${site.phoneDigits}`}
                className="glass-card group flex items-center gap-4 rounded-2xl border border-amber-500/30 p-4 transition hover:border-amber-500"
              >
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-xl text-amber-400 transition-all group-hover:bg-amber-500 group-hover:text-kraft">
                  <Phone size={18} />
                </div>
                <div>
                  <span className="block text-xs text-ink-3">
                    Direct operations hotline
                  </span>
                  <span className="text-lg font-extrabold text-white transition-colors group-hover:text-amber-400">
                    {site.phone}
                  </span>
                </div>
              </a>

              <div className="glass-card flex items-center gap-4 rounded-2xl border border-white/10 p-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-indigo/20 text-xl text-indigo">
                  <MapPin size={18} />
                </div>
                <div>
                  <span className="block text-xs text-ink-3">Headquarters</span>
                  <span className="text-sm font-bold text-white">
                    {site.city}, {site.state}
                  </span>
                </div>
              </div>

              <div className="glass-card flex items-center gap-4 rounded-2xl border border-white/10 p-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-violet/20 text-xl text-violet">
                  <Building size={18} />
                </div>
                <div>
                  <span className="block text-xs text-ink-3">Parent body</span>
                  <span className="text-sm font-bold text-white">{site.owner}</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/5 bg-white/5 p-4 text-xs text-ink-3">
              <div className="mb-1 font-bold text-emerald">{capNote}</div>
              <p>{site.udyam} · Government of India, MSME</p>
            </div>
          </div>

          {/* right: form */}
          <div className="lg:col-span-7">
            <BookingForm site={site} packages={packages} sectors={sectors} />
          </div>
        </div>
      </div>
    </section>
  );
}