import "server-only";

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { isAllowlistedEmail } from "@/lib/admin-auth";
import { projectProgress, outstandingBalance } from "./data";
import type {
  Enquiry,
  Invoice,
  Profile,
  Project,
  ProjectMilestone,
  ProjectUpdate,
} from "@/types/database";

export type AdminView = {
  isConfigured: boolean;
  isAdmin: boolean;
  signedInAs: string | null;
  /** signed in fine, but the email is not in ADMIN_EMAILS */
  notAllowlisted?: boolean;
  clients: Profile[];
  requests: Enquiry[];
  projects: Array<
    Project & {
      client: Profile | null;
      service_title: string | null;
      milestones: ProjectMilestone[];
      invoices: Invoice[];
      updates: ProjectUpdate[];
      progress: number;
      balance: number;
    }
  >;
};

/**
 * Everything the admin panel needs in one round trip. RLS decides what
 * actually comes back: if this login is not an admin, the private tables
 * return nothing, which `isAdmin` reports.
 */
export async function loadAdminData(): Promise<AdminView> {
  const empty: AdminView = {
    isConfigured: isSupabaseConfigured,
    isAdmin: false,
    signedInAs: null,
    clients: [],
    requests: [],
    projects: [],
  };

  if (!isSupabaseConfigured) return empty;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { ...empty, signedInAs: null };

  // Gate 1: is this email on the allow-list you control in .env.local?
  if (!isAllowlistedEmail(user.email)) {
    return {
      ...empty,
      isAdmin: false,
      signedInAs: user.email ?? null,
      notAllowlisted: true,
    };
  }

  // Gate 2: does the database also mark this account as admin?
  const { data: me } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const isAdmin = Boolean((me as Profile | null)?.is_admin);

  if (!isAdmin) {
    return { ...empty, isAdmin: false, signedInAs: user.email ?? null };
  }

  const [clientsRes, requestsRes, projectsRes] = await Promise.all([
    supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false }),
    supabase
      .from("enquiries")
      .select("*")
      .order("created_at", { ascending: false }),
    supabase
      .from("projects")
      .select(
        `
        *,
        service:services ( title ),
        project_milestones ( * ),
        invoices ( * ),
        project_updates ( * )
      `,
      )
      .order("created_at", { ascending: false }),
  ]);

  const clients = (clientsRes.data ?? []) as Profile[];
  const requests = (requestsRes.data ?? []) as Enquiry[];

  const byId = new Map(clients.map((c) => [c.id, c]));

  const projects = ((projectsRes.data ?? []) as unknown as Record<string, unknown>[]).map(
    (row) => {
      const base = row as unknown as Project;
      const service = row.service as { title: string } | null;
      const milestones = (row.project_milestones ?? []) as ProjectMilestone[];
      const invoices = (row.invoices ?? []) as Invoice[];
      const updates = (row.project_updates ?? []) as ProjectUpdate[];

      return {
        ...base,
        client: byId.get(base.client_id) ?? null,
        service_title: service?.title ?? null,
        milestones,
        invoices,
        updates,
        progress: projectProgress({ status: base.status, milestones }),
        balance: outstandingBalance(base),
      };
    },
  );

  return {
    isConfigured: true,
    isAdmin: true,
    signedInAs: user.email ?? null,
    clients,
    requests,
    projects,
  };
}

export type AdminSummary = {
  clients: number;
  newRequests: number;
  openRequests: number;
  activeProjects: number;
  collected: number;
  outstanding: number;
  pipeline: number;
};

export function summarise(v: AdminView): AdminSummary {
  const collected = v.projects.reduce((s, p) => s + (p.paid_amount ?? 0), 0);
  const outstanding = v.projects.reduce((s, p) => s + p.balance, 0);
  const pipeline = v.requests
    .filter((r) => r.status === "new" || r.status === "contacted" || r.status === "quoted")
    .reduce((s, r) => s + estimateValue(r), 0);

  return {
    clients: v.clients.filter((c) => !c.is_admin).length,
    newRequests: v.requests.filter((r) => r.status === "new").length,
    openRequests: v.requests.filter(
      (r) => r.status !== "won" && r.status !== "lost",
    ).length,
    activeProjects: v.projects.filter(
      (p) => p.status === "active" || p.status === "review",
    ).length,
    collected,
    outstanding,
    pipeline,
  };
}

/** Rough rupee value of a request, from the budget band the client picked. */
export function estimateValue(r: Enquiry): number {
  const band = r.message?.match(/Budget:\s*(.+)/)?.[1]?.trim();

  switch (band) {
    case "Under ₹5,000":
      return 5000;
    case "₹5,000 – ₹10,000":
      return 10000;
    case "₹10,000 – ₹25,000":
      return 25000;
    case "₹25,000 – ₹50,000":
      return 50000;
    case "Above ₹50,000":
      return 100000;
    default:
      return 0;
  }
}