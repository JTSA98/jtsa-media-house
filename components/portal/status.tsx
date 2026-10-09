import type { MilestoneStatus, ProjectStatus } from "@/types/database";
import { cn } from "@/lib/utils";

export const projectStatusMeta: Record<
  ProjectStatus,
  { label: string; className: string; blurb: string }
> = {
  enquiry: {
    label: "Enquiry",
    className: "bg-white/8 text-ink-2 border border-white/15",
    blurb: "Received. We will confirm scope and quote shortly.",
  },
  active: {
    label: "In Progress",
    className: "bg-green/12 text-green border border-green/35",
    blurb: "Creative work is underway.",
  },
  review: {
    label: "Awaiting Your Review",
    className: "bg-yellow/12 text-yellow border border-yellow/35",
    blurb: "We have sent something for you to approve.",
  },
  delivered: {
    label: "Delivered",
    // was `bg-ink text-white` — both tokens are light now, so this
    // would have rendered as white-on-white
    className: "bg-green/15 text-green border border-green/35",
    blurb: "All deliverables handed over and closed.",
  },
  closed: {
    label: "Closed",
    className: "bg-white/8 text-ink-3 border border-white/15",
    blurb: "Project archived.",
  },
};

export const milestoneStatusMeta: Record<
  MilestoneStatus,
  { label: string; dot: string; chip: string; sign: string }
> = {
  pending: {
    label: "Not started",
    dot: "bg-ink-3 border border-white/25",
    chip: "bg-white/8 text-ink-3 border border-white/15",
    sign: "○",
  },
  in_progress: {
    label: "Working on it",
    dot: "bg-yellow border border-yellow/45",
    chip: "bg-yellow/12 text-yellow border border-yellow/35",
    sign: "◐",
  },
  submitted: {
    label: "Ready for your review",
    dot: "bg-[#2B5EA8] border border-[#2B5EA8]/60",
    chip: "bg-[#2B5EA8]/18 text-[#8FB4E8] border border-[#2B5EA8]/45",
    sign: "◑",
  },
  revision: {
    label: "Changes requested",
    dot: "bg-red border border-red/45",
    chip: "bg-red/12 text-red border border-red/35",
    sign: "↻",
  },
  approved: {
    label: "Approved",
    dot: "bg-green border border-green/45",
    chip: "bg-green/12 text-green border border-green/35",
    sign: "●",
  },
};

export const invoiceStatusMeta: Record<
  "draft" | "issued" | "paid" | "overdue",
  { label: string; chip: string }
> = {
  draft: { label: "Draft", chip: "bg-white/8 text-ink-3 border border-white/15" },
  issued: { label: "Awaiting payment", chip: "bg-yellow/12 text-yellow border border-yellow/35" },
  paid: { label: "Paid", chip: "bg-green/12 text-green border border-green/35" },
  overdue: { label: "Overdue", chip: "bg-red/12 text-red border border-red/35" },
};

/** Small pill badge with a hard printed border. */
export function Badge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-block border-2 border-ink px-2.5 py-[3px] text-[10.5px] font-extrabold tracking-[0.12em] uppercase",
        className,
      )}
    >
      {children}
    </span>
  );
}