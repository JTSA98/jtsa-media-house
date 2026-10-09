import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, CircleDollarSign, FolderOpen } from "lucide-react";

import { ProgressBar } from "@/components/portal/Progress";
import { projectStatusMeta } from "@/components/portal/status";
import {
  countByStatus,
  loadClientProjects,
  outstandingBalance,
  projectProgress,
} from "@/lib/data";
import { supabaseConfigProblem, isSupabaseConfigured } from "@/lib/supabase/config";
import { cn, formatDate, formatINR } from "@/lib/utils";

export default async function PortalPage() {
  const { mode, profile, projects } = await loadClientProjects();

  const active = projects.filter((p) => p.status === "active" || p.status === "review");
  const closed = projects.filter((p) => p.status === "delivered" || p.status === "closed");

  return (
    <div className="flex flex-col gap-10">
      {/* ── header ── */}
      <header className="relative">
        <p className="hand -rotate-2 text-[clamp(22px,3vw,32px)] text-red">
          {profile.organisation ? `${profile.organisation}` : "Your projects"}
        </p>
        <h1 className="mt-1.5 text-[clamp(32px,5.4vw,60px)] leading-none font-extrabold tracking-[-0.035em] uppercase">
          Project <span className="text-green">tracker</span>
        </h1>
        <p className="mt-3 max-w-[62ch] text-[15.5px] leading-[1.8] text-ink-2">
          Everything we are making for you, step by step — what is done, what is in
          progress, what is waiting on your approval, and what is still to be paid.
        </p>

        {mode === "demo" ? (
          <div className="mt-6 border-[2.5px] border-dashed border-ink/40 bg-sticky p-4">
            <b className="block text-[14px]">Demo mode — showing sample data</b>
            <p className="mt-1 text-[13px] leading-[1.7] text-ink-2">
              {supabaseConfigProblem} Until then this page previews the real layout with
              a sample school account.
            </p>
            <Link href="/login" className="btn btn-yellow mt-3 !px-4 !py-2 !text-[12.5px]">
              Go to login
            </Link>
          </div>
        ) : null}
      </header>

      {/* ── no projects ── */}
      {projects.length === 0 ? (
        <div className="card-white relative p-10 text-center">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center border-[2.5px] border-ink bg-sticky">
            <FolderOpen size={26} className="text-green" />
          </div>
          <h2 className="text-[22px] font-extrabold tracking-[-0.02em] uppercase">
            No projects yet
          </h2>
          <p className="mx-auto mt-2 max-w-[46ch] text-[14.5px] text-ink-2">
            Once you approve a quote, your project appears here with live milestones,
            files and invoices.
          </p>
          <Link href="/#enquire" className="btn btn-green mt-6">
            Start an enquiry
          </Link>
        </div>
      ) : null}

      {/* ── active projects ── */}
      {active.length ? (
        <section>
          <h2 className="mb-5 flex items-center gap-3 text-[13px] font-extrabold tracking-[0.2em] text-ink-3 uppercase">
            <span className="inline-block h-[2.5px] w-10 bg-green" />
            Live projects ({active.length})
          </h2>
          <div className="flex flex-col gap-7">
            {active.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        </section>
      ) : null}

      {/* ── finished projects ── */}
      {closed.length ? (
        <section>
          <h2 className="mb-5 flex items-center gap-3 text-[13px] font-extrabold tracking-[0.2em] text-ink-3 uppercase">
            <span className="inline-block h-px w-10 bg-white/25" />
            Delivered &amp; closed ({closed.length})
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {closed.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

function ProjectCard({
  project,
}: {
  project: Awaited<ReturnType<typeof loadClientProjects>>["projects"][number];
}) {
  const progress = projectProgress(project);
  const counts = countByStatus(project.milestones);
  const due = outstandingBalance(project);
  const status = projectStatusMeta[project.status];

  return (
    <article
      data-reveal
      className="card-white relative overflow-hidden"
    >
      <div className="flex flex-col md:flex-row">
        {/* cover */}
        <div className="relative h-52 shrink-0 border-b-[2.5px] border-ink md:h-auto md:w-56 md:border-r-[2.5px] md:border-b-0">
          {project.cover_image ? (
            <Image
              src={project.cover_image}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 224px"
              className="object-cover"
            />
          ) : (
            <div className="flex size-full items-center justify-center bg-kraft-2">
              <FolderOpen size={30} className="text-ink-3" />
            </div>
          )}
          <span
            className={cn(
              "absolute top-3 left-3 border-2 border-ink px-2.5 py-1 text-[10px] font-extrabold tracking-[0.12em] uppercase",
              status.className,
            )}
          >
            {status.label}
          </span>
        </div>

        {/* body */}
        <div className="flex min-w-0 flex-1 flex-col gap-4 p-6">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[10.5px] font-extrabold tracking-[0.18em] text-ink-3 uppercase">
                {project.reference}
              </p>
              <h3 className="mt-0.5 text-[clamp(19px,2.4vw,25px)] leading-tight font-extrabold tracking-[-0.022em]">
                {project.title}
              </h3>
            </div>
            <p className="hand -rotate-2 shrink-0 bg-sticky px-2.5 py-1 text-[22px] text-green">
              {progress}% done
            </p>
          </div>

          <ProgressBar value={progress} />

          <ul className="flex flex-wrap gap-x-5 gap-y-1 text-[13px] text-ink-2">
            <li>
              <b className="font-extrabold text-ink">{counts.approved}</b>/{counts.total} steps approved
            </li>
            {counts.awaiting ? (
              <li className="font-bold text-[#2B5EA8]">
                {counts.awaiting} waiting on you
              </li>
            ) : null}
            {counts.inProgress ? (
              <li className="font-bold text-ink">{counts.inProgress} in progress</li>
            ) : null}
          </ul>

          <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex flex-wrap gap-x-5 gap-y-1 text-[12.5px] text-ink-2">
              <span className="flex items-center gap-1.5">
                <CalendarDays size={13} className="text-green" />
                Due {formatDate(project.due_date)}
              </span>
              <span className="flex items-center gap-1.5">
                <CircleDollarSign size={13} className="text-green" />
                {formatINR(project.paid_amount ?? 0)} paid
                {due > 0 ? (
                  <b className="text-red"> · {formatINR(due)} due</b>
                ) : (
                  <b className="text-green"> · settled</b>
                )}
              </span>
            </div>

            <Link
              href={`/portal/${project.id}`}
              className="btn btn-green !px-4 !py-2 !text-[12.5px]"
            >
              Open tracker <ArrowRight size={14} className="ml-2" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}