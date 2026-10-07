"use client";

import { useState, useTransition } from "react";
import { Check, Loader2, Save } from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import { requestStatusMeta, requestStatuses } from "@/components/admin/status";
import type { RequestStatus } from "@/types/database";

/**
 * Moves a request through its lifecycle and records who changed it.
 * Writes are allowed only for admins — the RLS policy rejects anyone else.
 */
export function RequestStatusControl({
  requestId,
  initialStatus,
  initialNote,
  handledBy,
}: {
  requestId: string;
  initialStatus: RequestStatus;
  initialNote: string | null;
  handledBy: string | null;
}) {
  const [status, setStatus] = useState<RequestStatus>(initialStatus);
  const [note, setNote] = useState(initialNote ?? "");
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function save() {
    setSaved(false);
    startTransition(async () => {
      const supabase = createClient();
      const { error } = await supabase
        .from("enquiries")
        .update({
          status,
          admin_note: note.trim() || null,
          handled: status === "won" || status === "lost",
          handled_at: new Date().toISOString(),
          handled_by: handledBy,
        })
        .eq("id", requestId);

      if (!error) setSaved(true);
    });
  }

  const dirty =
    status !== initialStatus || note.trim() !== (initialNote ?? "").trim();

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-1.5">
        {requestStatuses.map((s) => {
          const meta = requestStatusMeta[s];
          const active = status === s;

          return (
            <button
              key={s}
              type="button"
              onClick={() => {
                setStatus(s);
                setSaved(false);
              }}
              aria-pressed={active}
              title={meta.blurb}
              className={`border-2 border-ink px-2.5 py-1 text-[11px] font-extrabold tracking-[0.06em] uppercase transition ${
                active
                  ? `${meta.chip} shadow-[2px_2px_0_var(--color-ink)]`
                  : "bg-white text-ink-3 hover:bg-sticky"
              }`}
            >
              {meta.label}
            </button>
          );
        })}
      </div>

      <input
        value={note}
        onChange={(e) => {
          setNote(e.target.value);
          setSaved(false);
        }}
        placeholder="Internal note — e.g. called on 12 Oct, sending quote"
        className="field !py-2 !text-[12.5px]"
      />

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={save}
          disabled={pending || !dirty}
          className="btn btn-green !px-3 !py-1.5 !text-[11.5px] disabled:opacity-40"
        >
          {pending ? (
            <Loader2 size={13} className="mr-1.5 animate-spin" />
          ) : saved ? (
            <Check size={13} className="mr-1.5" />
          ) : (
            <Save size={13} className="mr-1.5" />
          )}
          {saved ? "Saved" : "Save"}
        </button>
        <span className="text-[11px] text-ink-3">{requestStatusMeta[status].blurb}</span>
      </div>
    </div>
  );
}

/** Small inline editor for an agency's own project status. */
export function ProjectStatusControl({
  projectId,
  initialStatus,
}: {
  projectId: string;
  initialStatus: string;
}) {
  const [status, setStatus] = useState(initialStatus);
  const [pending, startTransition] = useTransition();

  const options = ["enquiry", "active", "review", "delivered", "closed"];

  return (
    <select
      value={status}
      disabled={pending}
      onChange={(e) => {
        const next = e.target.value;
        setStatus(next);
        startTransition(async () => {
          const supabase = createClient();
          await supabase
            .from("projects")
            .update({
              status: next,
              delivered_at:
                next === "delivered" ? new Date().toISOString() : null,
            })
            .eq("id", projectId);
        });
      }}
      className="field !w-auto !py-1.5 !text-[12px] font-bold capitalize"
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}