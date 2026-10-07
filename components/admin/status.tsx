import type { RequestStatus } from "@/types/database";
import { cn } from "@/lib/utils";

export const requestStatusMeta: Record<
  RequestStatus,
  { label: string; chip: string; blurb: string }
> = {
  new: {
    label: "New",
    chip: "bg-red text-white",
    blurb: "Just registered — needs a first reply.",
  },
  contacted: {
    label: "Contacted",
    chip: "bg-yellow text-ink",
    blurb: "We have reached out, waiting on them.",
  },
  quoted: {
    label: "Quoted",
    chip: "bg-[#2B5EA8] text-white",
    blurb: "Quote sent, awaiting a decision.",
  },
  won: {
    label: "Working",
    chip: "bg-green text-white",
    blurb: "Signed off — project is live in the portal.",
  },
  lost: {
    label: "Not going ahead",
    chip: "bg-ink-3 text-white",
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