import Link from "next/link";
import {
  Banknote,
  Briefcase,
  Inbox,
  Mail,
  Phone,
  TrendingUp,
  Users,
} from "lucide-react";

import { ProjectStatusControl, RequestStatusControl } from "@/components/admin/controls";
import { FileUploader } from "@/components/admin/FileUploader";
import { NewProjectForm } from "@/components/admin/NewProjectForm";
import { AdminBadge, requestStatusMeta } from "@/components/admin/status";
import { ProgressBar } from "@/components/portal/Progress";
import { estimateValue, loadAdminData, summarise } from "@/lib/admin-data";
import { fetchServices } from "@/lib/services";
import { projectStatusMeta } from "@/components/portal/status";
import { formatDate, formatDateTime, formatINR } from "@/lib/utils";
import type { Enquiry, Profile } from "@/types/database";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const view = await loadAdminData();
  const s = summarise(view);

  return (
    <div className="flex flex-col gap-9">
      <header>
        <p className="hand -rotate-2 text-[clamp(20px,2.6vw,28px)] text-red">
          Everything in one place
        </p>
        <h1 className="mt-1 text-[clamp(28px,4.6vw,52px)] leading-none font-extrabold tracking-[-0.035em] uppercase">
          Control <span className="text-green">room</span>
        </h1>
      </header>

      {/* ── stats ── */}
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Tile icon={<Users size={18} />} label="Registered clients" value={s.clients} />
        <Tile
          icon={<Inbox size={18} />}
          label="New requests"
          value={s.newRequests}
          tone={s.newRequests > 0 ? "red" : "green"}
        />
        <Tile icon={<Briefcase size={18} />} label="Active projects" value={s.activeProjects} />
        <Tile
          icon={<Banknote size={18} />}
          label="Collected"
          value={formatINR(s.collected)}
          small
        />
        <Tile
          icon={<TrendingUp size={18} />}
          label="Open pipeline"
          value={formatINR(s.pipeline)}
          small
          tone="yellow"
        />
        <Tile
          icon={<Banknote size={18} />}
          label="Outstanding"
          value={formatINR(s.outstanding)}
          small
          tone={s.outstanding > 0 ? "red" : "green"}
        />
        <Tile
          icon={<Inbox size={18} />}
          label="Open requests"
          value={s.openRequests}
        />
        <Tile icon={<Briefcase size={18} />} label="Total projects" value={view.projects.length} />
      </section>

      {/* ── requests ── */}
      <section>
        <SectionHead
          title="Requests"
          note="Every registration and enquiry, newest first. Set a status so you know what is done."
        />
        {view.requests.length === 0 ? (
          <Empty>No requests yet. They appear here the moment someone registers.</Empty>
        ) : (
          <div className="flex flex-col gap-5">
            {view.requests.map((r) => (
              <RequestRow key={r.id} request={r} admin={view.signedInAs} />
            ))}
          </div>
        )}
      </section>

      {/* ── clients ── */}
      <section>
        <SectionHead
          title="Clients"
          note="Everyone with an account. Tap a phone number or email to contact them directly."
        />
        {view.clients.length === 0 ? (
          <Empty>No client accounts yet.</Empty>
        ) : (
          <div className="-mx-2 overflow-x-auto px-2">
            <table className="w-full min-w-[900px] border-collapse">
              <thead>
                <tr className="border-b-[2.5px] border-ink">
                  {["Client", "Contact", "Organisation", "Work", "Budget", "Joined"].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-3 py-2.5 text-left text-[10.5px] font-extrabold tracking-[0.16em] text-ink-3 uppercase"
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {view.clients.map((c) => (
                  <tr
                    key={c.id}
                    className="border-b border-dashed border-ink/25 align-top transition hover:bg-sticky"
                  >
                    <td className="px-3 py-3">
                      <b className="block text-[14px] font-extrabold">
                        {c.full_name ?? "—"}
                      </b>
                      {c.is_admin ? (
                        <AdminBadge className="mt-1 bg-red/12 text-red border border-red/35">Admin</AdminBadge>
                      ) : null}
                      <span className="text-[12px] text-ink-3">{c.client_type ?? ""}</span>
                    </td>
                    <td className="px-3 py-3 text-[13px]">
                      {c.email ? (
                        <a
                          href={`mailto:${c.email}?subject=${encodeURIComponent(`Hello ${c.full_name ?? ""} — your ${siteName()} project`)}`}
                          className="flex items-center gap-1.5 font-bold text-green underline"
                        >
                          <Mail size={12} /> {c.email}
                        </a>
                      ) : null}
                      {c.phone ? (
                        <a
                          href={`tel:${c.phone.replace(/\s/g, "")}`}
                          className="mt-1 flex items-center gap-1.5 font-bold text-green underline"
                        >
                          <Phone size={12} /> {c.phone}
                        </a>
                      ) : null}
                    </td>
                    <td className="px-3 py-3 text-[13.5px]">
                      <b className="block">{c.organisation ?? "—"}</b>
                      {c.area ? (
                        <span className="text-[12px] text-ink-3">{c.area}</span>
                      ) : null}
                    </td>
                    <td className="max-w-[260px] px-3 py-3 text-[12.5px] text-ink-2">
                      <span className="block font-bold text-ink">
                        {c.business_type ?? "—"}
                      </span>
                      {c.work_description
                        ? `${c.work_description.slice(0, 90)}${
                            c.work_description.length > 90 ? "…" : ""
                          }`
                        : null}
                    </td>
                    <td className="px-3 py-3 text-[12.5px] font-bold whitespace-nowrap">
                      {c.budget_band ?? "—"}
                    </td>
                    <td className="px-3 py-3 text-[12.5px] whitespace-nowrap text-ink-3">
                      {formatDate(c.onboarded_at ?? c.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ── start a project ── */}
      <NewProjectForm
        requests={view.requests}
        clients={view.clients.filter((c) => !c.is_admin)}
        services={await fetchServices()}
      />

      {/* ── projects ── */}
      <section>
        <SectionHead
          title="Projects"
          note="Live work. Change a status here and the client sees it immediately."
        />
        {view.projects.length === 0 ? (
          <Empty>
            No projects yet. Use &ldquo;Start a new project&rdquo; above, straight
            from a won request.
          </Empty>
        ) : (
          <div className="flex flex-col gap-4">
            {view.projects.map((p) => {
              const meta = projectStatusMeta[p.status];

              return (
                <article key={p.id} className="card-white p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-extrabold tracking-[0.16em] text-ink-3 uppercase">
                          {p.reference}
                        </span>
                        <AdminBadge className={meta.className}>{meta.label}</AdminBadge>
                      </div>
                      <h3 className="mt-1 text-[19px] leading-tight font-extrabold tracking-[-0.02em]">
                        {p.title}
                      </h3>
                      <p className="text-[13px] text-ink-2">
                        {p.client?.organisation ?? p.client?.full_name ?? "—"}
                        {p.service_title ? ` · ${p.service_title}` : ""}
                      </p>
                    </div>

                    <div className="flex shrink-0 flex-col items-end gap-2">
                      <span className="hand rotate-2 bg-sticky px-2.5 py-1 text-[20px] text-green">
                        {p.progress}%
                      </span>
                      <ProjectStatusControl
                        projectId={p.id}
                        initialStatus={p.status}
                      />
                    </div>
                  </div>

                  <ProgressBar value={p.progress} className="my-4" />

                  <div className="mb-4">
                    <FileUploader projectId={p.id} />
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 text-[12.5px] text-ink-2">
                    <span>
                      Due {formatDate(p.due_date)} · {p.milestones.length} steps ·{" "}
                      {p.invoices.length} invoices
                    </span>
                    <span className="flex items-center gap-4">
                      <span>
                        Paid <b className="text-green">{formatINR(p.paid_amount ?? 0)}</b>
                      </span>
                      {p.balance > 0 ? (
                        <span>
                          Due <b className="text-red">{formatINR(p.balance)}</b>
                        </span>
                      ) : (
                        <span className="font-bold text-green">settled</span>
                      )}
                      <Link
                        href={`/portal/${p.id}`}
                        className="font-extrabold text-green underline"
                      >
                        Open tracker
                      </Link>
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

function siteName() {
  return "JTSA Media House";
}

function RequestRow({
  request,
  admin,
}: {
  request: Enquiry;
  admin: string | null;
}) {
  const meta = requestStatusMeta[request.status];
  const value = estimateValue(request);
  const digits = request.phone.replace(/\D/g, "");
  const wa = digits.length >= 10 ? digits.slice(-10) : "";

  const body = [
    `Hi ${request.name},`,
    `This is JTSA Media House — you registered with us${request.event_note ? ` for ${request.event_note}` : ""}.`,
    request.service ? `\n\nYou mentioned: ${request.service}` : "",
  ].join("");

  return (
    <article className="card-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <AdminBadge className={meta.chip}>{meta.label}</AdminBadge>
            <span className="text-[11.5px] text-ink-3">
              {formatDateTime(request.created_at)}
            </span>
            {value > 0 ? (
              <span className="text-[11.5px] font-bold text-ink-2">
                est. {formatINR(value)}
              </span>
            ) : null}
          </div>

          <h3 className="mt-1.5 text-[19px] leading-tight font-extrabold tracking-[-0.02em]">
            {request.name}
            {request.event_note ? (
              <span className="ml-2 text-[14px] font-bold text-green">
                {request.event_note}
              </span>
            ) : null}
          </h3>

          <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-[13px]">
            {request.email ? (
              <a
                href={`mailto:${request.email}?subject=${encodeURIComponent("Your JTSA Media House enquiry")}&body=${encodeURIComponent(body)}`}
                className="flex items-center gap-1.5 font-bold text-green underline"
              >
                <Mail size={12} /> {request.email}
              </a>
            ) : null}
            {request.phone ? (
              <a
                href={`tel:${digits}`}
                className="flex items-center gap-1.5 font-bold text-green underline"
              >
                <Phone size={12} /> {request.phone}
              </a>
            ) : null}
            {wa ? (
              <a
                href={`https://wa.me/91${wa}?text=${encodeURIComponent(body)}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 font-bold text-green underline"
              >
                <Phone size={12} /> WhatsApp
              </a>
            ) : null}
          </div>

          {request.message ? (
            <pre className="mt-3 max-w-full overflow-x-auto border-2 border-dashed border-ink/25 bg-sticky p-3 font-sans text-[13px] leading-[1.7] whitespace-pre-wrap text-ink">
              {request.message}
            </pre>
          ) : null}
        </div>

        <div className="w-full shrink-0 sm:w-[280px]">
          <RequestStatusControl
            requestId={request.id}
            initialStatus={request.status}
            initialNote={request.admin_note}
            handledBy={admin}
          />
        </div>
      </div>
    </article>
  );
}

function Tile({
  icon,
  label,
  value,
  small,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  small?: boolean;
  tone?: "green" | "red" | "yellow";
}) {
  return (
    <div className="card-white p-4">
      <div className="flex items-center gap-2 text-ink-3">
        {icon}
        <span className="text-[10.5px] font-extrabold tracking-[0.14em] uppercase">
          {label}
        </span>
      </div>
      <p
        className={`mt-2 leading-none font-extrabold tracking-[-0.03em] ${
          small ? "text-[clamp(22px,2.6vw,32px)]" : "text-[clamp(28px,3.4vw,42px)]"
        } ${
          tone === "red"
            ? "text-red"
            : tone === "yellow"
              ? "text-yellow"
              : "text-green"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function SectionHead({ title, note }: { title: string; note: string }) {
  return (
    <div className="mb-4">
      <h2 className="flex items-center gap-3 text-[13px] font-extrabold tracking-[0.2em] text-ink-3 uppercase">
        <span className="inline-block h-[2.5px] w-8 bg-red" />
        {title}
      </h2>
      <p className="mt-1.5 text-[13.5px] text-ink-2">{note}</p>
    </div>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return (
    <div className="card-white p-8 text-center text-[14.5px] text-ink-2">
      {children}
    </div>
  );
}