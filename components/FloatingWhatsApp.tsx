"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";

/**
 * Floating WhatsApp button.
 *
 * Opens wa.me with a prefilled message. It is a tap-through link, not an
 * automatic send — WhatsApp's Cloud API would need Meta Business approval and
 * pre-approved templates before it could message anyone unprompted, and the
 * recipient would have to have opted in first.
 *
 * Hidden on the staff and client areas: it is a sales surface for visitors,
 * and a floating "message us" button over the admin panel just gets in the way.
 */

const HIDDEN_PREFIXES = [
  "/admin",
  "/portal",
  "/login",
  "/staff-login",
];

export function FloatingWhatsApp({
  digits,
  message,
  label = "Chat with us",
  sublabel = "",
  dismissible = true,
}: {
  digits: string;
  message: string;
  label?: string;
  sublabel?: string;
  dismissible?: boolean;
}) {
  const path = usePathname() ?? "";
  const [dismissed, setDismissed] = useState(false);
  const [ring, setRing] = useState(false);

  // One attention pulse, a few seconds after the visitor lands. Not a loop —
  // a permanently throbbing badge reads as an ad.
  useEffect(() => {
    const t = setTimeout(() => setRing(true), 2200);
    const t2 = setTimeout(() => setRing(false), 7200);
    return () => {
      clearTimeout(t);
      clearTimeout(t2);
    };
  }, []);

  if (!digits || dismissed) return null;
  if (HIDDEN_PREFIXES.some((p) => path === p || path.startsWith(p + "/"))) return null;

  const href = `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;

  return (
    <div className="pointer-events-none fixed right-4 bottom-4 z-40 flex items-center gap-2 sm:right-6 sm:bottom-6">
      {dismissible ? (
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Hide the WhatsApp button for this visit"
          className="pointer-events-auto flex size-8 items-center justify-center rounded-full border border-white/15 bg-kraft-2/90 text-ink-3 backdrop-blur transition-colors hover:text-white"
        >
          <X size={14} />
        </button>
      ) : null}

      <div className="pointer-events-auto relative">
        {ring ? (
          <span
            aria-hidden
            className="absolute inset-0 animate-ping rounded-2xl bg-[#25D366] opacity-60"
          />
        ) : null}

        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`WhatsApp ${label}`}
          className="group flex items-center gap-3 rounded-2xl bg-[#25D366] py-3.5 pr-5 pl-4 font-bold text-white shadow-[0_12px_32px_rgba(37,211,102,0.35)] transition-all hover:brightness-105 hover:shadow-[0_16px_40px_rgba(37,211,102,0.45)]"
        >
          <svg
            aria-hidden
            viewBox="0 0 24 24"
            className="size-6 shrink-0 fill-white"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.6.14-.14.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.47s1.06 2.86 1.21 3.06c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.28.17-1.41-.07-.13-.27-.2-.57-.35z" />
            <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.87 9.87 0 0 0 4.79 1.22h.01c5.46 0 9.9-4.45 9.91-9.91C21.97 6.45 17.5 2 12.04 2zm0 18.13a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.24-8.23a8.18 8.18 0 0 1 8.23 8.24c0 4.54-3.7 8.23-8.23 8.23z" />
          </svg>

          <span className="flex flex-col items-start leading-tight">
            <span className="text-[13px] font-extrabold">{label}</span>
            {sublabel ? (
              <span className="text-[10px] font-medium tracking-wide opacity-90">
                {sublabel}
              </span>
            ) : null}
          </span>
        </a>
      </div>
    </div>
  );
}