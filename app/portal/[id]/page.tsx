import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  CircleDollarSign,
  Clock,
  Download,
  Megaphone,
  Receipt,
} from "lucide-react";

import { MilestoneTracker } from "@/components/portal/MilestoneTracker";
import { ProgressDial } from "@/components/portal/Progress";
import { invoiceStatusMeta, projectStatusMeta } from "@/components/portal/status";
import {
  countByStatus,
  loadClientProjects,
  outstandingBalance,
  projectProgress,
} from "@/lib/data";
import { cn, formatDate, formatDateTime, formatINR } from "@/lib/utils";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { mode, projects } = await loadClientProjects();

  const project = projects.find((p) => p.id === id);

  if (!project) {
    return (
      <div className="card-white p-10 text-center">
        <h1 className="text-[24px] font-extrabold tracking-[-0.02em] uppercase">
          Project not found
        </h1>
        <p className="mx-auto mt-2 max-w-[48ch] text-[14.5px] text-ink-2">
          {mode === "demo"
            ? "This is demo data. Run the Supabase schema and sign in to see live projects."
            : "It may belong to another account, or the link may be out of date."}
        </p>
        <Link href="/portal" className="btn btn-green mt-6">
          Back to my projects
        </Link>
      </div>
    );
  }

  const progress = projectProgress(project);
  const counts = countByStatus(project.milestones);
  const due = outstandingBalance(project);
  const status = projectStatusMeta[project.status];

  return (
    <div className="flex flex-col gap-9">
      <Link
        href="/portal"
        className="flex w-fit items-center gap-2 text-[13px] font-extrabold text-ink-2 transition hover:gap-3 hover:text-green"
      >
        <ArrowLeft size={15} /> All projects
      </Link>

      {/* ── summary ── */}
      <header className="card-white relative overflow-hidden">
        <div className="flex flex-col gap-6 p-6 md:flex-row md:items-center md:p-8">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <span
                className={cn(
                  "border-2 border-ink px-2.5 py-1 text-[10px] font-extrabold tracking-[0.12em] uppercase",
                  status.className,
                )}
              >
                {status.label}
              </span>
              <span className="text-[10.5px] font-extrabold tracking-[0.18em] text-ink-3 uppercase">
                {project.reference}
              </span>
            </div>

            <h1 className="mt-2.5 text-[clamp(26px,4.4vw,44px)] leading-[1.05] font-extrabold tracking-[-0.032em]">
              {project.title}
            </h1>

            {project.summary ? (
              <p className="mt-2.5 max-w-[62ch] text-[15px] leading-[1.8] text-ink-2">
                {project.summary}
              </p>
            ) : null}

            <p className="hand mt-3 -rotate-1 text-[21px] text-red">
              {status.blurb}
            </p>

            <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 text-[13.5px] sm:grid-cols-4">
              <Meta label="Service" value={project.service?.title ?? "—"} />
              <Meta
                label="Started"
                value={formatDate(project.start_date)}
                icon={<CalendarDays size={13} />}
              />
              <Meta
                label="Due"
                value={formatDate(project.due_date)}
                icon={<Clock size={13} />}
              />
              <Meta
                label="Turnaround"
                value={project.service?.turnaround ?? "—"}
                icon={<Megaphone size={13} />}
              />
            </dl>
          </div>

          <div className="flex shrink-0 flex-row items-center gap-5 md:flex-col md:gap-3">
            <ProgressDial value={progress} label="complete" />
            <div className="text-[12.5px] text-ink-2">
              <b className="block text-ink">{counts.approved} of {counts.total}</b>
              steps approved
            </div>
          </div>
        </div>

        {/* cover strip */}
        {project.cover_image ? (
          <div className="relative h-40 border-t-[2.5px] border-ink md:h-52">
            <Image
              src={project.cover_image}
              alt=""
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>
        ) : null}
      </header>

      <div className="grid gap-9 lg:grid-cols-[1.5fr_1fr]">
        {/* ── milestones ── */}
        <section className="card-white p-6 md:p-8">
          <h2 className="mb-1.5 flex items-center gap-2.5 text-[13px] font-extrabold tracking-[0.2em] text-ink-3 uppercase">
            <span className="inline-block h-[2.5px] w-8 bg-green" />
            Step by step
          </h2>
          <p className="mb-6 text-[14px] leading-[1.75] text-ink-2">
            {counts.awaiting
              ? `${counts.awaiting} step${counts.awaiting > 1 ? "s" : ""} waiting for your approval below.`
              : "Nothing needs your approval right now. We will post here when something is ready."}
          </p>

          <MilestoneTracker project={project} />
        </section>

        <div className="flex flex-col gap-9">
          {/* ── money ── */}
          <section className="card-paper p-6">
            <h2 className="mb-4 flex items-center gap-2.5 text-[13px] font-extrabold tracking-[0.2em] text-ink-3 uppercase">
              <span className="inline-block h-[2.5px] w-8 bg-green" />
              Payment
            </h2>

            <div className="mb-5">
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-[13px] font-bold tracking-[0.14em] text-ink-2 uppercase">
                  Agreed
                </span>
                <b className="text-[22px] font-extrabold">
                  {formatINR(project.agreed_amount ?? 0)}
                </b>
              </div>
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-[13px] font-bold tracking-[0.14em] text-ink-2 uppercase">
                  Paid
                </span>
                <b className="text-[22px] font-extrabold text-green">
                  {formatINR(project.paid_amount ?? 0)}
                </b>
              </div>
              <div className="mt-2 flex items-baseline justify-between gap-3 border-t-2 border-dashed border-ink/30 pt-2">
                <span className="text-[13px] font-bold tracking-[0.14em] text-ink-2 uppercase">
                  Balance
                </span>
                <b className={cn("text-[22px] font-extrabold", due > 0 ? "text-red" : "text-green")}>
                  {formatINR(due)}
                </b>
              </div>
            </div>

            <ul className="flex flex-col gap-3">
              {project.invoices.map((inv) => {
                const meta = invoiceStatusMeta[inv.status];

                return (
                  <li
                    key={inv.id}
                    className="border-2 border-ink bg-white p-3.5 text-[13px]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <b className="block font-extrabold">{inv.invoice_number}</b>
                        <span className="text-[12.5px] text-ink-2">{inv.description}</span>
                      </div>
                      <div className="shrink-0 text-right">
                        <b className="block font-extrabold">{formatINR(inv.amount)}</b>
                        <span
                          className={cn(
                            "mt-1 inline-block border-2 border-ink px-1.5 py-[1px] text-[9.5px] font-extrabold tracking-[0.1em] uppercase",
                            meta.chip,
                          )}
                        >
                          {meta.label}
                        </span>
                      </div>
                    </div>
                    <p className="mt-1.5 flex items-center gap-1.5 text-[11.5px] text-ink-3">
                      <Receipt size={12} />
                      {inv.status === "paid"
                        ? `Paid ${formatDate(inv.paid_at)}`
                        : `Due ${formatDate(inv.due_date)}`}
                    </p>
                  </li>
                );
              })}
            </ul>

            {due > 0 ? (
              <p className="mt-4 border-[2.5px] border-dashed border-green bg-white p-3.5 text-[13px] leading-[1.7]">
                <b className="block text-green">Balance payable</b>
                Pay by UPI — the ID and QR are on the homepage, or ask us for a fresh
                invoice on WhatsApp.
              </p>
            ) : null}
          </section>

          {/* ── updates ── */}
          <section className="card-white p-6">
            <h2 className="mb-4 flex items-center gap-2.5 text-[13px] font-extrabold tracking-[0.2em] text-ink-3 uppercase">
              <span className="inline-block h-[2.5px] w-8 bg-green" />
              Updates
            </h2>

            {project.updates.length === 0 ? (
              <p className="text-[14px] text-ink-2">No updates yet.</p>
            ) : (
              <ol className="flex flex-col gap-4">
                {project.updates.map((u) => (
                  <li key={u.id} className="border-b-[1.5px] border-dashed border-ink/25 pb-4 last:border-b-0 last:pb-0">
                    <b className="block text-[14.5px] font-extrabold">{u.title}</b>
                    <p className="mt-1 text-[13.5px] leading-[1.7] text-ink-2">{u.body}</p>
                    <p className="mt-1.5 text-[11.5px] text-ink-3">
                      {u.author_name ?? "JTSA Media House"} · {formatDateTime(u.created_at)}
                    </p>
                  </li>
                ))}
              </ol>
            )}
          </section>

          {/* ── all files ── */}
          <section className="card-paper p-6">
            <h2 className="mb-4 flex items-center gap-2.5 text-[13px] font-extrabold tracking-[0.2em] text-ink-3 uppercase">
              <span className="inline-block h-[2.5px] w-8 bg-green" />
              All files
            </h2>

            {project.milestones.every((m) => m.deliverables.length === 0) ? (
              <p className="text-[14px] text-ink-2">
                Nothing shared yet. Files appear here as each step is delivered.
              </p>
            ) : (
              <ul className="flex flex-col gap-2">
                {project.milestones.flatMap((m) =>
                  m.deliverables.map((f) => (
                    <li key={f.id}>
                      <a
                        href={f.file_url ?? "#"}
                        target={f.file_url ? "_blank" : undefined}
                        rel="noreferrer"
                        className="flex items-center gap-2.5 border-2 border-ink bg-white px-3 py-2.5 text-[13px] font-bold transition hover:bg-sticky hover:shadow-[0_8px_22px_rgba(2,6,12,0.5)]"
                      >
                        <Download size={14} className="shrink-0 text-green" />
                        <span className="min-w-0 flex-1 truncate">{f.label}</span>
                        <span className="shrink-0 text-[10.5px] text-ink-3">{m.title}</span>
                      </a>
                    </li>
                  )),
                )}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function Meta({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div>
      <dt className="flex items-center gap-1.5 text-[10.5px] font-extrabold tracking-[0.16em] text-ink-3 uppercase">
        {icon}
        {label}
      </dt>
      <dd className="mt-0.5 font-bold">{value}</dd>
    </div>
  );
}