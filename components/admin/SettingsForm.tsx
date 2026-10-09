"use client";

import { useActionState, useState, useTransition } from "react";
import { AlertCircle, Check, Loader2, Save, Trash2 } from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import type { SettingGroup, SettingRow } from "@/lib/settings";

export type SettingsState = {
  error: string | null;
  saved: number | null;
};

export async function saveSettings(
  _prev: SettingsState,
  formData: FormData,
): Promise<SettingsState> {
  const supabase = createClient();

  // Every field is named settings:<key>
  const updates: { key: string; value: string }[] = [];
  for (const [name, value] of formData.entries()) {
    if (name.startsWith("settings:")) {
      updates.push({
        key: name.slice("settings:".length),
        value: String(value),
      });
    }
  }

  if (updates.length === 0) return { error: "Nothing to save.", saved: null };

  // upsert so new keys can be added from this page too
  const { error } = await supabase.from("site_settings").upsert(updates, {
    onConflict: "key",
  });

  if (error) return { error: error.message, saved: null };

  return { error: null, saved: updates.length };
}

const TOGGLES: Record<string, string> = {
  "payments.enabled": "Accept online payment",
  "enquiry.enabled": "Show the enquiry form",
  "enquiry.whatsapp": "Show the WhatsApp button",
};

export function SettingsForm({
  rows,
  groups,
  labels,
}: {
  rows: SettingRow[];
  groups: SettingGroup[];
  labels: Record<string, string>;
}) {
  const [state, action, pending] = useActionState(saveSettings, {
    error: null,
    saved: null,
  });
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    contact: true,
    brand: true,
    payments: true,
  });

  const byGroup = groups
    .map((g) => ({ group: g, items: rows.filter((r) => r.group_name === g) }))
    .filter((x) => x.items.length > 0);

  return (
    <form action={action} className="flex flex-col gap-5">
      {byGroup.map(({ group, items }) => {
        const isOpen = openGroups[group] ?? false;

        return (
          <section key={group} className="card-white overflow-hidden">
            <button
              type="button"
              onClick={() => setOpenGroups((s) => ({ ...s, [group]: !s[group] }))}
              className="flex w-full items-center justify-between gap-3 bg-black/40 px-5 py-3 text-left"
            >
              <span className="text-[11px] font-semibold tracking-[0.18em] text-ink uppercase">
                {labels[group] ?? group}
              </span>
              <span className="text-[11px] font-bold opacity-70">
                {isOpen ? "Hide" : `Edit ${items.length}`}
              </span>
            </button>

            {isOpen ? (
              <div className="grid gap-4 p-5 sm:grid-cols-2">
                {items.map((row) => (
                  <SettingField key={row.key} row={row} />
                ))}
              </div>
            ) : null}
          </section>
        );
      })}

      {/* save bar */}
      <div className="sticky bottom-0 flex flex-wrap items-center gap-3 border-[2.5px] border-ink bg-kraft-2 p-4 shadow-[0_14px_34px_rgba(2,6,12,0.5)]">
        <button
          type="submit"
          disabled={pending}
          className="btn btn-green disabled:opacity-60"
        >
          {pending ? (
            <>
              <Loader2 size={16} className="mr-2 animate-spin" /> Saving‚
            </>
          ) : (
            <>
              <Save size={16} className="mr-2" /> Save all settings
            </>
          )}
        </button>

        {state.saved !== null && !state.error ? (
          <span className="flex items-center border-2 border-green bg-green/10 px-3 py-2 text-[13px] font-bold text-ink">
            <Check size={15} className="mr-1.5 text-green" />
            {state.saved} setting{state.saved === 1 ? "" : "s"} saved
          </span>
        ) : null}

        {state.error ? (
          <span className="flex items-center border-2 border-red bg-red/10 px-3 py-2 text-[13px] text-ink">
            <AlertCircle size={15} className="mr-1.5 text-red" />
            {state.error}
          </span>
        ) : null}

        <span className="ml-auto text-[12px] text-ink-3">
          Changes appear on the public site immediately.
        </span>
      </div>
    </form>
  );
}

function SettingField({ row }: { row: SettingRow }) {
  const isToggle = row.key in TOGGLES;
  const isLong = row.key.endsWith(".features");
  const wide = isLong || row.key === "payments.note" || row.key === "enquiry.reply_note";

  return (
    <div className={wide ? "sm:col-span-2" : undefined}>
      <label
        htmlFor={row.key}
        className="mb-1.5 flex items-baseline gap-2 text-[10.5px] font-extrabold tracking-[0.16em] text-ink-3 uppercase"
      >
        <span>{row.label || row.key}</span>
        {isToggle ? (
          <span className="text-[9px] tracking-normal text-green normal-case">on / off</span>
        ) : null}
      </label>

      {isToggle ? (
        <select
          id={row.key}
          name={`settings:${row.key}`}
          defaultValue={row.value ?? "false"}
          className="field !py-2.5 text-[13px] font-bold"
        >
          <option value="true">On</option>
          <option value="false">Off</option>
        </select>
      ) : isLong ? (
        <textarea
          id={row.key}
          name={`settings:${row.key}`}
          defaultValue={row.value ?? ""}
          rows={4}
          placeholder="One item per line"
          className="field !text-[13px]"
        />
      ) : (
        <input
          id={row.key}
          name={`settings:${row.key}`}
          defaultValue={row.value ?? ""}
          className="field !py-2.5 text-[13.5px]"
        />
      )}

      {row.hint ? (
        <p className="mt-1 text-[11.5px] text-ink-3">{row.hint}</p>
      ) : null}
    </div>
  );
}

/** Reveal a masked secret without ever sending it to the browser. */
export function SecretStatus({
  name,
  configured,
  label,
}: {
  name: string;
  configured: boolean;
  label: string;
}) {
  const [show, setShow] = useState(false);

  return (
    <div className="border-2 border-ink bg-white p-3.5">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[12.5px] font-extrabold">{label}</span>
        <span
          className={`border-2 border-ink px-2 py-[1px] text-[10px] font-extrabold uppercase ${
            configured ? "bg-green/12 text-green border-green/35" : "bg-red/12 text-red border-red/35"
          }`}
        >
          {configured ? "configured" : "missing"}
        </span>
      </div>
      <p className="mt-1 font-mono text-[11.5px] text-ink-3">
        {show ? name : "•".repeat(28)}
      </p>
      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        className="mt-2 text-[11px] font-extrabold text-green underline"
      >
        {show ? "hide" : "show name only"}
      </button>
    </div>
  );
}