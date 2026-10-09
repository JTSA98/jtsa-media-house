"use client";

import { useOptimistic, useState, useTransition } from "react";
import { Check, CircleSlash, FileText, Loader2, MessageSquare } from "lucide-react";

import { milestoneStatusMeta } from "@/components/portal/status";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { cn, dueLabel, formatDate, formatDateTime } from "@/lib/utils";
import type { MilestoneStatus, ProjectDetail } from "@/types/database";

/**
 * The tracking timeline. Clients can move a milestone between
 * "Ready for your review" and "Approved", and can request changes —
 * this is what makes the portal two-way rather than read-only.
 */
export function MilestoneTracker({ project }: { project: ProjectDetail }) {
  return (
    <ol className="relative flex flex-col">
      {project.milestones.map((m, i) => (
        <MilestoneRow
          key={m.id}
          projectId={project.id}
          milestoneId={m.id}
          title={m.title}
          description={m.description}
          status={m.status}
          dueDate={m.due_date}
          completedAt={m.completed_at}
          deliverables={m.deliverables}
          isLast={i === project.milestones.length - 1}
          canRespond={m.status === "submitted" || m.status === "revision"}
        />
      ))}
    </ol>
  );
}

function MilestoneRow({
  projectId,
  milestoneId,
  title,
  description,
  status,
  dueDate,
  completedAt,
  deliverables,
  isLast,
  canRespond,
}: {
  projectId: string;
  milestoneId: string;
  title: string;
  description: string | null;
  status: MilestoneStatus;
  dueDate: string | null;
  completedAt: string | null;
  deliverables: { id: string; label: string; file_url: string | null; version: number | null }[];
  isLast: boolean;
  canRespond: boolean;
}) {
  const meta = milestoneStatusMeta[status];

  return (
    <li className="relative flex gap-4 pb-7 last:pb-0">
      {/* spine */}
      {!isLast ? (
        <span
          aria-hidden
          className="absolute top-8 bottom-0 left-[15px] w-[2.5px] border-l-2 border-dashed border-ink/30"
        />
      ) : null}

      {/* marker */}
      <span
        aria-hidden
        className={cn(
          "relative z-10 flex size-8 shrink-0 items-center justify-center text-[12px] font-extrabold",
          meta.dot,
        )}
      >
        {meta.sign}
      </span>

      <div className="min-w-0 flex-1 pt-1">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="text-[17px] leading-tight font-extrabold tracking-[-0.015em]">
              {title}
            </h3>
            {description ? (
              <p className="mt-1 text-[14px] leading-[1.7] text-ink-2">{description}</p>
            ) : null}
          </div>

          <div className="flex shrink-0 flex-col items-end gap-1.5">
            <span
              className={cn(
                "border-2 border-ink px-2 py-[2px] text-[10px] font-extrabold tracking-[0.1em] uppercase",
                meta.chip,
              )}
            >
              {meta.label}
            </span>
            {status !== "approved" && dueDate ? (
              <span className="text-[11.5px] font-semibold text-ink-3">
                Due {formatDate(dueDate)} · {dueLabel(dueDate)}
              </span>
            ) : null}
            {completedAt ? (
              <span className="text-[11.5px] font-semibold text-ink-3">
                Done {formatDateTime(completedAt)}
              </span>
            ) : null}
          </div>
        </div>

        {deliverables.length ? (
          <ul className="mt-3 flex flex-col gap-1.5">
            {deliverables.map((f) => (
              <li key={f.id}>
                <a
                  href={f.file_url ?? "#"}
                  target={f.file_url ? "_blank" : undefined}
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 border-2 border-ink bg-white px-2.5 py-1.5 text-[12.5px] font-bold transition hover:bg-sticky hover:shadow-[0_8px_22px_rgba(2,6,12,0.5)]"
                >
                  <FileText size={14} className="shrink-0 text-green" />
                  <span className="truncate">{f.label}</span>
                  {f.version ? (
                    <span className="shrink-0 text-[10px] font-extrabold text-ink-3">
                      v{f.version}
                    </span>
                  ) : null}
                </a>
              </li>
            ))}
          </ul>
        ) : null}

        {canRespond ? (
<MilestoneResponse
            projectId={projectId}
            milestoneId={milestoneId}
            status={status}
            title={title}
          />
        ) : null}
      </div>
    </li>
  );
}

function MilestoneResponse({
  projectId,
  milestoneId,
  status,
  title,
}: {
  projectId: string;
  milestoneId: string;
  status: MilestoneStatus;
  title: string;
}) {
  const [note, setNote] = useState("");
  const [pending, startTransition] = useTransition();
  const [local, setLocal] = useState<MilestoneStatus>(status);

  const current = isSupabaseConfigured
    ? local
    : (demoAction(status) ?? status);

  async function setStatus(next: MilestoneStatus, withNote?: string) {
    if (!isSupabaseConfigured) {
      // Demo mode: reflect the change locally so the flow is reviewable.
      setLocal(next);
      return;
    }

    const supabase = createClient();
    const patch: Record<string, unknown> = { status: next };

    if (next === "approved") patch.completed_at = new Date().toISOString();
    if (withNote?.trim()) {
      await supabase
        .from("project_updates")
        .insert({
          project_id: projectId,
          title: next === "approved" ? "Step approved" : "Change requested",
          body: withNote.trim(),
          author_name: "Client",
        });
    }

    await supabase
      .from("project_milestones")
      .update(patch)
      .eq("id", milestoneId);

    setLocal(next);

    // Tell the agency by email the moment a client approves a step.
    if (next === "approved") {
      void notifyApproval({ projectId, milestoneId, title, note: withNote });
    }
  }

  /**
   * Fire-and-forget notification. Lives in an API route so the Brevo key
   * never reaches the browser.
   */
  async function notifyApproval(input: {
    projectId: string;
    milestoneId: string;
    title: string;
    note?: string;
  }) {
    try {
      await fetch("/api/notify/approval", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
    } catch {
      // never block the client's approval on email
    }
  }

  function demoAction(s: MilestoneStatus): MilestoneStatus {
    return s === "submitted" ? "submitted" : s === "revision" ? "revision" : s;
  }

  return (
    <div className="mt-3.5 border-[2.5px] border-dashed border-ink/35 bg-sticky p-4">
      <p className="mb-3 flex items-center gap-2 text-[13.5px] font-extrabold">
        <MessageSquare size={15} className="text-green" />
        {status === "submitted"
          ? "This is ready for you — approve it or ask for a change."
          : "We are reworking this. Approve it once it looks right."}
      </p>

      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        rows={2}
        placeholder="Optional note — e.g. please make the headline bolder"
        className="field !text-[13.5px]"
      />

      <div className="mt-3 flex flex-wrap gap-2.5">
        <button
          type="button"
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              await setStatus("approved", note);
              setNote("");
            })
          }
          className="btn btn-green !px-4 !py-2 !text-[12.5px] disabled:opacity-60"
        >
          {pending ? (
            <Loader2 size={14} className="mr-1.5 animate-spin" />
          ) : (
            <Check size={14} className="mr-1.5" />
          )}
          Approve this step
        </button>

        <button
          type="button"
          disabled={pending || current === "revision"}
          onClick={() =>
            startTransition(async () => {
              await setStatus("revision", note || "Please revise this step.");
              setNote("");
            })
          }
          className="btn btn-white !px-4 !py-2 !text-[12.5px] disabled:opacity-50"
        >
          <CircleSlash size={14} className="mr-1.5" />
          Request changes
        </button>
      </div>

      {current !== status ? (
        <p className="mt-2.5 text-[12px] font-bold text-green">
          Saved — this step now reads “{milestoneStatusMeta[current].label}”.
        </p>
      ) : null}
    </div>
  );
}