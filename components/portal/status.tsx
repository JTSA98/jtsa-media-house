import type { MilestoneStatus, ProjectStatus } from "@/types/database";
import { cn } from "@/lib/utils";

export const projectStatusMeta: Record<
  ProjectStatus,
  { label: string; className: string; blurb: string }
> = {
  enquiry: {
    label: "Enquiry",
    className: "bg-kraft-3 text-ink",
    blurb: "Received. We will confirm scope and quote shortly.",
  },
  active: {
    label: "In Progress",
    className: "bg-green text-white",
    blurb: "Creative work is underway.",
  },
  review: {
    label: "Awaiting Your Review",
    className: "bg-yellow text-ink",
    blurb: "We have sent something for you to approve.",
  },
  delivered: {
    label: "Delivered",
    className: "bg-ink text-white",
    blurb: "All deliverables handed over and closed.",
  },
  closed: {
    label: "Closed",
    className: "bg-ink-3 text-white",
    blurb: "Project archived.",
  },
};

export const milestoneStatusMeta: Record<
  MilestoneStatus,
  { label: string; dot: string; chip: string; sign: string }
> = {
  pending: {
    label: "Not started",
    dot: "bg-white border-2 border-ink",
    chip: "bg-kraft-3 text-ink",
    sign: "○",
  },
  in_progress: {
    label: "Working on it",
    dot: "bg-yellow border-2 border-ink",
    chip: "bg-yellow text-ink",
    sign: "◐",
  },
  submitted: {
    label: "Ready for your review",
    dot: "bg-blue text-white border-2 border-ink",
    chip: "bg-[#2B5EA8] text-white",
    sign: "◑",
  },
  revision: {
    label: "Changes requested",
    dot: "bg-red text-white border-2 border-ink",
    chip: "bg-red text-white",
    sign: "↻",
  },
  approved: {
    label: "Approved",
    dot: "bg-green text-white border-2 border-ink",
    chip: "bg-green text-white",
    sign: "●",
  },
};

export const invoiceStatusMeta: Record<
  "draft" | "issued" | "paid" | "overdue",
  { label: string; chip: string }
> = {
  draft: { label: "Draft", chip: "bg-kraft-3 text-ink" },
  issued: { label: "Awaiting payment", chip: "bg-yellow text-ink" },
  paid: { label: "Paid", chip: "bg-green text-white" },
  overdue: { label: "Overdue", chip: "bg-red text-white" },
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