import type { RequestStatus } from "@/types/database";
import { cn } from "@/lib/utils";

export const requestStatusMeta: Record<
  RequestStatus,
  { label: string; chip: string; blurb: string }
> = {
  // `text-ink` is light on the dark ground, so every chip now carries an
// explicit border and a tinted fill rather than a flat saturated block.
  new: {
    label: "New",
    chip: "bg-red/12 text-red border border-red/35",
    blurb: "Just registered — needs a first reply.",
  },
  contacted: {
    label: "Contacted",
    chip: "bg-yellow/12 text-yellow border border-yellow/35",
    blurb: "We have reached out, waiting on them.",
  },
  quoted: {
    label: "Quoted",
    chip: "bg-[#2B5EA8]/18 text-[#8FB4E8] border border-[#2B5EA8]/45",
    blurb: "Quote sent, awaiting a decision.",
  },
  won: {
    label: "Working",
    chip: "bg-green/12 text-green border border-green/35",
    blurb: "Signed off — project is live in the portal.",
  },
  lost: {
    label: "Not going ahead",
    chip: "bg-white/8 text-ink-3 border border-white/15",
    blurb: "Declined or gone quiet.",
  },
};

export const requestStatuses: RequestStatus[] = [
  "new",
  "contacted",
  "quoted",
  "won",
  "lost",
];

export function AdminBadge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-block border-2 border-ink px-2 py-[2px] text-[10px] font-extrabold tracking-[0.1em] whitespace-nowrap uppercase",
        className,
      )}
    >
      {children}
    </span>
  );
}