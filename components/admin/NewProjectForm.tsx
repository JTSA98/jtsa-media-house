"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { AlertCircle, CheckCircle2, FolderPlus, Loader2 } from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import type { Enquiry, Profile, Service } from "@/types/database";

const STARTER_MILESTONES = [
  ["Design brief & scope", "Confirm what we are making, for whom, and by when."],
  ["First creative set", "The opening designs for approval."],
  ["Client approval", "Sign-off on the creative."],
  ["Print / publish", "Files delivered or campaign goes live."],
  ["Handover & report", "Final files, and a report if it was a campaign."],
];

export function NewProjectForm({
  requests,
  clients,
  services,
  defaultRequestId,
}: {
  requests: Enquiry[];
  clients: Profile[];
  services: Service[];
  defaultRequestId?: string;
}) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<string | null>(null);

  const [requestId, setRequestId] = useState(defaultRequestId ?? "");
  const [clientId, setClientId] = useState("");
  const [serviceId, setServiceId] = useState(services[0]?.id ?? "");
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [amount, setAmount] = useState("");
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [dueDate, setDueDate] = useState("");
  const [withMilestones, setWithMilestones] = useState(true);

  // Picking a won request fills the rest in for you.
  function pickRequest(id: string) {
    setRequestId(id);
    const r = requests.find((x) => x.id === id);
    if (!r) return;

    const org = r.event_note?.trim();
    if (org && !title) setTitle(`${org} — Campaign`);
    if (r.service && !summary) setSummary(r.service);

    // find the matching client account by organisation, then by name
    const byOrg = clients.find(
      (c) => c.organisation?.toLowerCase() === org?.toLowerCase(),
    );
    const byName = clients.find(
      (c) => c.full_name?.toLowerCase() === r.name.toLowerCase(),
    );
    const match = byOrg ?? byName;
    if (match) setClientId(match.id);

    const amt = r.message?.match(/Budget:\s*(.+)/)?.[1];
    if (amt && !amount) {
      const mid = { "Under â‚¹5,000": "5000", "â‚¹5,000 – â‚¹10,000": "10000", "â‚¹10,000 – â‚¹25,000": "25000", "â‚¹25,000 – â‚¹50,000": "50000", "Above â‚¹50,000": "100000" }[amt];
      if (mid) setAmount(mid);
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);

    const supabase = createClient();

    let resolvedClient = clientId;

    // If the enquiry came from someone with no account, create a bare
    // profile is not possible without an auth user — so require a client.
    if (!resolvedClient) {
      setError("Choose which client this project belongs to.");
      setBusy(false);
      return;
    }
    if (!title.trim()) {
      setError("Give the project a title.");
      setBusy(false);
      return;
    }

    const reference = await nextReference();

    const { data: project, error: insErr } = await supabase
      .from("projects")
      .insert({
        client_id: resolvedClient,
        service_id: serviceId || null,
        title: title.trim(),
        reference,
        status: "active",
        summary: summary.trim() || null,
        start_date: startDate || null,
        due_date: dueDate || null,
        agreed_amount: amount ? Number(amount) : null,
        paid_amount: 0,
        source_request_id: requestId || null,
      })
      .select("id")
      .single();

    if (insErr || !project) {
      setError(insErr?.message ?? "Could not create the project.");
      setBusy(false);
      return;
    }

    if (withMilestones) {
      const rows = STARTER_MILESTONES.map(([t, d], i) => ({
        project_id: project.id,
        title: t,
        description: d,
        status: "pending" as const,
        due_date: dueDate || null,
        client_visible: true,
        sort_order: i + 1,
      }));
      const { error: msErr } = await supabase
        .from("project_milestones")
        .insert(rows);
      if (msErr) {
        setError(`Project created, but the steps failed: ${msErr.message}`);
        setBusy(false);
        return;
      }
    }

    // link the enquiry to this project
    if (requestId) {
      await supabase
        .from("enquiries")
        .update({ status: "won", handled_at: new Date().toISOString() })
        .eq("id", requestId);
    }

    setCreated(project.id);
    setBusy(false);
    startTransition(() => router.refresh());
  }

  return (
    <div className="card-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2.5 text-[13px] font-extrabold tracking-[0.2em] text-ink-3 uppercase">
            <span className="inline-block h-[2.5px] w-8 bg-red" />
            Start a new project
          </h2>
          <p className="mt-1.5 text-[13.5px] text-ink-2">
            Turns a won request into a tracked project the client can see.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="btn btn-green !px-4 !py-2 !text-[12.5px]"
        >
          <FolderPlus size={15} className="mr-2" />
          {open ? "Close" : "New project"}
        </button>
      </div>

      {open ? (
        <form onSubmit={submit} className="mt-5 flex flex-col gap-4 border-t-2 border-dashed border-ink/25 pt-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="req" className="mb-1.5 block text-[10.5px] font-extrabold tracking-[0.18em] text-ink-3 uppercase">
                From a request
              </label>
              <select
                id="req"
                value={requestId}
                onChange={(e) => pickRequest(e.target.value)}
                className="field !py-2.5 !text-[13px]"
              >
                <option value="">None — start fresh</option>
                {requests.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.event_note || r.name} — {r.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="cli" className="mb-1.5 block text-[10.5px] font-extrabold tracking-[0.18em] text-ink-3 uppercase">
                Client <span className="text-red">*</span>
              </label>
              <select
                id="cli"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                required
                className="field !py-2.5 !text-[13px]"
              >
                <option value="">Choose‚</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.organisation || c.full_name || c.email}
                    {c.email ? ` Â· ${c.email}` : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="ttl" className="mb-1.5 block text-[10.5px] font-extrabold tracking-[0.18em] text-ink-3 uppercase">
              Project title <span className="text-red">*</span>
            </label>
            <input
              id="ttl"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Admission Season 2026 — Social Campaign"
              className="field !py-2.5 !text-[13.5px]"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="svc" className="mb-1.5 block text-[10.5px] font-extrabold tracking-[0.18em] text-ink-3 uppercase">
                Service
              </label>
              <select
                id="svc"
                value={serviceId}
                onChange={(e) => setServiceId(e.target.value)}
                className="field !py-2.5 !text-[13px]"
              >
                <option value="">Not set</option>
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="amt" className="mb-1.5 block text-[10.5px] font-extrabold tracking-[0.18em] text-ink-3 uppercase">
                Agreed amount (â‚¹)
              </label>
              <input
                id="amt"
                value={amount}
                onChange={(e) => setAmount(e.target.value.replace(/[^\d]/g, ""))}
                inputMode="numeric"
                placeholder="9999"
                className="field !py-2.5 !text-[13.5px]"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="st" className="mb-1.5 block text-[10.5px] font-extrabold tracking-[0.18em] text-ink-3 uppercase">
                Start date
              </label>
              <input
                id="st"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="field !py-2.5 !text-[13px]"
              />
            </div>
            <div>
              <label htmlFor="du" className="mb-1.5 block text-[10.5px] font-extrabold tracking-[0.18em] text-ink-3 uppercase">
                Due date
              </label>
              <input
                id="du"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="field !py-2.5 !text-[13px]"
              />
            </div>
          </div>

          <div>
            <label htmlFor="sum" className="mb-1.5 block text-[10.5px] font-extrabold tracking-[0.18em] text-ink-3 uppercase">
              Summary the client will see
            </label>
            <textarea
              id="sum"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              rows={3}
              className="field !text-[13.5px]"
            />
          </div>

          <label className="flex items-center gap-2.5 text-[13px] font-bold">
            <input
              type="checkbox"
              checked={withMilestones}
              onChange={(e) => setWithMilestones(e.target.checked)}
              className="size-4"
            />
            Add the 5 standard steps (brief â†’ creative â†’ approval â†’ delivery â†’ report)
          </label>

          {error ? (
            <p className="flex items-start gap-2 border-[2.5px] border-red bg-red/10 px-3.5 py-3 text-[13px] text-ink">
              <AlertCircle size={16} className="mt-0.5 shrink-0 text-red" />
              {error}
            </p>
          ) : null}

          {created ? (
            <p className="flex items-start gap-2 border-[2.5px] border-green bg-green/10 px-3.5 py-3 text-[13px] text-ink">
              <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-green" />
              Project created. It is now in the list below and live in the
              client&apos;s portal.
            </p>
          ) : null}

          <button type="submit" disabled={busy} className="btn btn-green w-fit disabled:opacity-60">
            {busy ? (
              <>
                <Loader2 size={16} className="mr-2 animate-spin" /> Creating‚
              </>
            ) : (
              <>
                <FolderPlus size={16} className="mr-2" /> Create project
              </>
            )}
          </button>
        </form>
      ) : null}
    </div>
  );
}

/** JMH-2026-004 — increments past whatever already exists. */
async function nextReference(): Promise<string> {
  const supabase = createClient();
  const year = new Date().getFullYear();

  const { data } = await supabase
    .from("projects")
    .select("reference")
    .like("reference", `JMH-${year}-%`);

  const nums = (data ?? [])
    .map((r: { reference: string }) => {
      const m = r.reference.match(/(\d+)$/);
      return m ? parseInt(m[1], 10) : 0;
    })
    .filter((n: number) => Number.isFinite(n));

  const next = (nums.length ? Math.max(...nums) : 0) + 1;
  return `JMH-${year}-${String(next).padStart(3, "0")}`;
}