"use client";

import { useState, useTransition } from "react";
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  Check,
  Loader2,
  Plus,
  Trash2,
  X,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import {
  PLAN_REGISTRY_KEY,
  planSettingKeys,
  slugifyPlanId,
} from "@/lib/plan-keys";
import type { CalcBaseView, PlanView } from "@/lib/plan-keys";

/**
 * Package manager.
 *
 * Until this existed the tier list was a hardcoded array, so adding or
 * removing a package meant editing code, writing a migration and deploying.
 * Now the admin owns the catalogue: this screen writes plans.registry and the
 * per-tier rows, and the public site resolves everything from them.
 *
 * Deleting removes the tier's rows rather than just hiding it, so a removed
 * package does not linger in the table or resurface if the registry is ever
 * hand-edited.
 */

type Res = { kind: "ok" | "err"; text: string };
type Msg = Res | null;

export function PlanManager({
  plans,
  calcBases,
}: {
  plans: PlanView[];
  calcBases: CalcBaseView[];
}) {
  const [open, setOpen] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [msg, setMsg] = useState<Msg>(null);
  const [pending, startTransition] = useTransition();

  function run(work: () => Promise<Msg>) {
    setMsg(null);
    startTransition(async () => setMsg(await work()));
  }

/** Rewrite the registry after a reorder, add or delete. */
  async function setRegistry(ids: string[]): Promise<Res> {
    const supabase = createClient();
    const { error } = await supabase
      .from("site_settings")
      .upsert(
        [{ key: PLAN_REGISTRY_KEY, value: ids.join("|") }],
        { onConflict: "key" },
      );
    if (error) return { kind: "err", text: error.message };
    return { kind: "ok", text: "Saved. Reload the page to see the new order." };
  }

  function move(id: string, dir: -1 | 1) {
    const ids = plans.map((p) => p.id);
    const i = ids.indexOf(id);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= ids.length) return;
    [ids[i], ids[j]] = [ids[j], ids[i]];
    void run(() => setRegistry(ids));
  }

function remove(p: PlanView) {
    // The pricing grid, booking dropdown and calculator are all driven by the
    // registry. Removing the last package would empty all three, which is
    // almost certainly not what was meant.
    if (plans.length <= 1) {
      setMsg({
        kind: "err",
        text: "This is the only package left. Add another before removing this one.",
      });
      return;
    }

    const ok = window.confirm(
      `Remove "${p.name}"?\n\nIts pricing, feature list and calculator figures are deleted too. Past orders and bookings that reference it are not affected.`,
    );
    if (!ok) return;

    void run(async () => {
      const supabase = createClient();
      const ids = plans.map((x) => x.id).filter((x) => x !== p.id);

      // Registry first: even if the row delete fails, the tier is already
      // off the public site.
      const reg = await setRegistry(ids);
      if (reg.kind === "err") return reg;

      const { error } = await supabase
        .from("site_settings")
        .delete()
        .in("key", planSettingKeys(p.id));
      if (error) return { kind: "err", text: error.message };

      setOpen(null);
      return {
        kind: "ok",
        text: `Removed ${p.name}. Reload to see it gone from the site.`,
      };
    });
  }

  return (
    <section className="card-white overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-black/40 px-5 py-3">
        <span className="text-[11px] font-semibold tracking-[0.18em] text-ink uppercase">
          Packages — {plans.length} live
        </span>
        <button
          type="button"
          onClick={() => setAdding((v) => !v)}
          className="flex items-center gap-1.5 text-[11px] font-bold text-green underline"
        >
          {adding ? <X size={13} /> : <Plus size={13} />}
          {adding ? "Cancel" : "Add package"}
        </button>
      </div>

      {adding ? (
        <AddPlan
          onDone={() => {
            setAdding(false);
            setMsg({ kind: "ok", text: "Package created. Reload to see it live." });
          }}
        />
      ) : null}

      <ul className="divide-y divide-black/15">
        {plans.map((p, i) => (
          <li key={p.id}>
            <div className="flex flex-wrap items-center gap-3 px-5 py-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-extrabold">
                  {p.name}
                  {p.highlight ? (
                    <span className="ml-2 border border-green/40 bg-green/10 px-1.5 text-[9px] tracking-widest text-green uppercase">
                      featured
                    </span>
                  ) : null}
                </p>
                <p className="font-mono text-[11px] text-ink-3">
                  {p.id} · ₹{p.price || "—"} · {p.period}
                </p>
              </div>

              <div className="flex items-center gap-1">
                <IconBtn
                  label="Move up"
                  disabled={i === 0 || pending}
                  onClick={() => move(p.id, -1)}
                >
                  <ArrowUp size={13} />
                </IconBtn>
                <IconBtn
                  label="Move down"
                  disabled={i === plans.length - 1 || pending}
                  onClick={() => move(p.id, 1)}
                >
                  <ArrowDown size={13} />
                </IconBtn>
                <button
                  type="button"
                  onClick={() => setOpen(open === p.id ? null : p.id)}
                  className="px-2 text-[11px] font-bold underline"
                >
                  {open === p.id ? "Close" : "Edit"}
                </button>
                <IconBtn label="Delete" danger disabled={pending} onClick={() => remove(p)}>
                  <Trash2 size={13} />
                </IconBtn>
              </div>
            </div>

            {open === p.id ? (
              <EditPlan
                plan={p}
                base={calcBases.find((c) => c.id === p.id) ?? null}
                onSaved={() =>
                  setMsg({ kind: "ok", text: `${p.name} saved. Reload to see it live.` })
                }
              />
            ) : null}
          </li>
        ))}
      </ul>

      {msg ? (
        <p
          className={`flex items-start gap-2 border-t-2 px-5 py-3 text-[12.5px] ${
            msg.kind === "ok" ? "border-green/40 text-ink" : "border-red bg-red/10 text-ink"
          }`}
        >
          {msg.kind === "ok" ? (
            <Check size={14} className="mt-0.5 shrink-0 text-green" />
          ) : (
            <AlertCircle size={14} className="mt-0.5 shrink-0 text-red" />
          )}
          {msg.text}
        </p>
      ) : null}
    </section>
  );
}

function IconBtn({
  children,
  label,
  onClick,
  disabled,
  danger,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className={`border-2 p-1.5 transition disabled:opacity-30 ${
        danger
          ? "border-red/40 text-red hover:bg-red/10"
          : "border-ink hover:bg-black/15"
      }`}
    >
      {children}
    </button>
  );
}

/* ── edit ─────────────────────────────────────────────────────────── */

function EditPlan({
  plan,
  base,
  onSaved,
}: {
  plan: PlanView;
  base: CalcBaseView | null;
  onSaved: () => void;
}) {
  const [state, setState] = useState<Msg>(null);
  const [pending, startTransition] = useTransition();

  function save(fd: FormData) {
    setState(null);
    startTransition(async () => {
      // collect() emits plan.{id}.*; this form already knows which tier it is.
      const rows = collect(fd).map((r) => ({
        ...r,
        key: r.key.replace("{id}", plan.id),
      }));
      const supabase = createClient();
      const { error } = await supabase.from("site_settings").upsert(rows, {
        onConflict: "key",
      });
      setState(
        error
          ? { kind: "err", text: error.message }
          : { kind: "ok", text: "Saved." },
      );
      if (!error) onSaved();
    });
  }

  return (
    <form action={save} className="border-t border-black/15 bg-black/20 px-5 py-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field name="name" label="Name" defaultValue={plan.name} />
        <Field name="price" label="Price" defaultValue={plan.price} hint="e.g. 4,999" />
        <Field name="tagline" label="Who it is for" defaultValue={plan.tagline} wide />
        <Field
          name="features"
          label="What is included"
          type="textarea"
          defaultValue={plan.features.join("\n")}
          wide
        />
        <Field
          name="physical"
          label="Physical ground add-ons"
          type="textarea"
          defaultValue={plan.physical.join("\n")}
          hint="Leave empty for a digital-only package."
          wide
        />
        <Field name="cta" label="Button word" defaultValue={plan.cta} hint="Shown as: Book {word}" />
        <Field name="badge" label="Badge" defaultValue={plan.badge} hint="Leave empty for none." />
        <Field name="period" label="Billing period" defaultValue={plan.period} hint="e.g. per campaign" />
        <Field
          name="highlight"
          label="Featured card"
          type="select"
          options={[
            ["false", "No"],
            ["true", "Yes"],
          ]}
          defaultValue={plan.highlight ? "true" : "false"}
          hint="Only keep this on for one package."
        />
      </div>

      <CalcFields base={base} />

      <div className="mt-4 flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="btn btn-green disabled:opacity-60"
        >
          {pending ? <Loader2 size={15} className="mr-2 animate-spin" /> : null}
          Save {plan.id}
        </button>
        {state ? (
          <span className="text-[12.5px]">
            {state.kind === "ok" ? (
              <span className="text-green">{state.text}</span>
            ) : (
              <span className="text-red">{state.text}</span>
            )}
          </span>
        ) : null}
      </div>
    </form>
  );
}

/* ── create ───────────────────────────────────────────────────────── */

function AddPlan({ onDone }: { onDone: () => void }) {
  const [name, setName] = useState("");
  const [state, setState] = useState<Msg>(null);
  const [pending, startTransition] = useTransition();

  const id = slugifyPlanId(name);

  function create(fd: FormData) {
    setState(null);
    if (!name.trim()) {
      setState({ kind: "err", text: "Give the package a name first." });
      return;
    }

    startTransition(async () => {
      const supabase = createClient();

      // Refuse to overwrite a live tier — two packages sharing an id would
      // make the pricing grid render the same card twice.
      const { data: clash } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", PLAN_REGISTRY_KEY)
        .maybeSingle();

      const existing = String(clash?.value ?? "")
        .split("|")
        .filter(Boolean);
      if (existing.includes(id)) {
        setState({ kind: "err", text: `"${id}" already exists. Pick another name.` });
        return;
      }

      const rows = collect(fd).map((r) => ({
        ...r,
        key: r.key.replace("{id}", id),
      }));

      const { error } = await supabase.from("site_settings").upsert(rows, {
        onConflict: "key",
      });
      if (error) {
        setState({ kind: "err", text: error.message });
        return;
      }

      const { error: regErr } = await supabase
        .from("site_settings")
        .upsert(
          [{ key: PLAN_REGISTRY_KEY, value: [...existing, id].join("|") }],
          { onConflict: "key" },
        );

      if (regErr) {
        setState({ kind: "err", text: regErr.message });
        return;
      }
      onDone();
    });
  }

  return (
    <form action={create} className="border-b border-black/20 bg-black/30 px-5 py-4">
      <div className="mb-3">
        <Field
          name="name"
          label="Package name"
          value={name}
          onChange={(v) => setName(v)}
          placeholder="e.g. 6-Influencer Pro Growth Combo"
          hint={`Saved as "${id || "..."}" — this id is permanent and links past orders to this package.`}
          wide
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Field name="price" label="Price" placeholder="19,999" />
        <Field name="tagline" label="Who it is for" placeholder="Growing brands and institutes" />
        <Field
          name="features"
          label="What is included"
          type="textarea"
          placeholder={"6 local creators\n6 dedicated reels\n12 stories with tags"}
          hint="One per line."
          wide
        />
        <Field
          name="physical"
          label="Physical ground add-ons"
          type="textarea"
          placeholder={"1,500 leaflets\n2 standees"}
          hint="One per line. Leave empty for a digital-only package."
          wide
        />
        <Field name="cta" label="Button word" placeholder="Growth" />
        <Field name="badge" label="Badge" placeholder="New" hint="Leave empty for none." />
        <Field name="period" label="Billing period" placeholder="per campaign" />
        <Field
          name="highlight"
          label="Featured card"
          type="select"
          options={[
            ["false", "No"],
            ["true", "Yes"],
          ]}
          defaultValue="false"
        />
      </div>

      <CalcFields base={null} />

      <div className="mt-4 flex items-center gap-3">
        <button type="submit" disabled={pending} className="btn btn-green disabled:opacity-60">
          {pending ? (
            <Loader2 size={15} className="mr-2 animate-spin" />
          ) : (
            <Plus size={15} className="mr-2" />
          )}
          Create package
        </button>
        {state ? (
          <span className="text-[12.5px]">
            {state.kind === "ok" ? (
              <span className="text-green">{state.text}</span>
            ) : (
              <span className="text-red">{state.text}</span>
            )}
          </span>
        ) : null}
      </div>
    </form>
  );
}

/* ── shared fields ────────────────────────────────────────────────── */

function CalcFields({ base }: { base: CalcBaseView | null }) {
  return (
    <details className="mt-4 border border-black/25 bg-white/40 px-3 py-2">
      <summary className="cursor-pointer text-[11px] font-bold tracking-[0.14em] text-ink-2 uppercase">
        ROI calculator figures
      </summary>
      <p className="mt-1.5 text-[11.5px] text-ink-3">
        {base
          ? "These drive the reach, lead band and score the calculator shows for this package."
          : "Leave these blank and the calculator estimates them from the price. Set them to control the numbers exactly."}
      </p>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <Field
          name="calc_views"
          label="Estimated views"
          type="number"
          defaultValue={base ? String(base.views) : ""}
        />
        <Field
          name="calc_flyers"
          label="Physical drops"
          type="number"
          defaultValue={base ? String(base.flyers) : ""}
        />
        <Field name="calc_creators" label="Creators" defaultValue={base?.creators ?? ""} />
        <Field
          name="calc_leads_low"
          label="Leads low"
          type="number"
          defaultValue={base ? String(base.leadsLow) : ""}
        />
        <Field
          name="calc_leads_high"
          label="Leads high"
          type="number"
          defaultValue={base ? String(base.leadsHigh) : ""}
        />
        <Field
          name="calc_score"
          label="Score / 10"
          type="number"
          defaultValue={base ? String(base.score) : ""}
        />
      </div>
    </details>
  );
}

function Field({
  name,
  label,
  defaultValue,
  value,
  onChange,
  placeholder,
  hint,
  type = "text",
  options,
  wide,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  value?: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  hint?: string;
  type?: "text" | "textarea" | "number" | "select";
  options?: [string, string][];
  wide?: boolean;
}) {
  const cls = "field !py-2.5 !text-[13px]";

  return (
    <div className={wide ? "sm:col-span-2" : undefined}>
      <label
        htmlFor={`pm-${name}`}
        className="mb-1 block text-[10.5px] font-extrabold tracking-[0.16em] text-ink-3 uppercase"
      >
        {label}
      </label>

      {type === "textarea" ? (
        <textarea
          id={`pm-${name}`}
          name={name}
          defaultValue={defaultValue}
          placeholder={placeholder}
          rows={4}
          className={cls}
        />
      ) : type === "select" ? (
        <select
          id={`pm-${name}`}
          name={name}
          defaultValue={defaultValue}
          className={`${cls} cursor-pointer`}
        >
          {options?.map(([v, l]) => (
            <option key={v} value={v}>
              {l}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={`pm-${name}`}
          name={name}
          type={type}
          defaultValue={defaultValue}
          value={value}
          onChange={onChange ? (e) => onChange(e.target.value) : undefined}
          placeholder={placeholder}
          className={cls}
        />
      )}

      {hint ? <p className="mt-1 text-[11.5px] text-ink-3">{hint}</p> : null}
    </div>
  );
}

/** FormData -> site_settings rows. `{id}` in a key is filled in by AddPlan. */
function collect(fd: FormData): { key: string; value: string }[] {
  const str = (k: string) => String(fd.get(k) ?? "").trim();
  const numOrBlank = (k: string) => {
    const v = str(k);
    return v === "" ? "" : v;
  };

  const rows: { key: string; value: string }[] = [];
  const push = (field: string, value: string) => {
    if (value !== "") rows.push({ key: `plan.{id}.${field}`, value });
  };

  // Lists are stored pipe-separated, matching every other list in settings.
  push("name", str("name"));
  push("cta", str("cta"));
  push("price", str("price"));
  push("tagline", str("tagline"));
  push("badge", str("badge"));
  push("period", str("period"));

  const features = str("features");
  if (features) push("features", features.split("\n").map((l) => l.trim()).filter(Boolean).join("|"));

  const physical = str("physical");
  if (physical) push("physical", physical.split("\n").map((l) => l.trim()).filter(Boolean).join("|"));

  const hl = str("highlight");
  if (hl) push("highlight", hl);

  const calc: [string, string][] = [
    ["calc_views", "views"],
    ["calc_flyers", "flyers"],
    ["calc_creators", "creators"],
    ["calc_leads_low", "leads_low"],
    ["calc_leads_high", "leads_high"],
    ["calc_score", "score"],
  ];
  for (const [field, suffix] of calc) {
    const v = numOrBlank(field);
    if (v !== "") rows.push({ key: `calc.{id}.${suffix}`, value: v });
  }

  return rows;
}