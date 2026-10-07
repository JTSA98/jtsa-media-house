import "server-only";

import { isSupabaseConfigured } from "./supabase/config";
import { createClient } from "./supabase/server";
import type {
  Project,
  ProjectDetail,
  ProjectMilestone,
  Deliverable,
  Invoice,
  ProjectUpdate,
  Profile,
  Service,
} from "@/types/database";

// ─── Demo fallback ────────────────────────────────────────────────────
// The portal has to render before Supabase is connected, otherwise the
// reviewer sees an error page instead of the design. These fixtures mirror
// the shape of the real query results exactly.

export const demoProfile: Profile = {
  id: "00000000-0000-0000-0000-000000000001",
  full_name: "Priya Sharma",
  phone: "+91 00000 00000",
  email: "demo@client.test",
  client_type: "school",
  organisation: "Springdale Public School, Dhanbad",
  business_type: null,
  work_description: null,
  budget_band: "₹10,000 – ₹25,000",
  area: "Hirapur, Dhanbad",
  referral: "JTSA Olympiad website",
onboarded_at: "2026-01-12T00:00:00.000Z",
  is_admin: false,
  created_at: "2026-01-12T00:00:00.000Z",
};

export const demoServices: Service[] = [
  {
    id: "00000000-0000-0000-0000-000000000010",
    slug: "posters-banners",
    title: "Posters & Banners",
    blurb: "Admission posters, result-day banners, flex and standees.",
    base_price: 299,
    price_unit: "per design",
    turnaround: "48 hours",
    sort_order: 1,
  },
  {
    id: "00000000-0000-0000-0000-000000000011",
    slug: "social-campaigns",
    title: "Social Media Campaigns",
    blurb: "Instagram, Facebook and WhatsApp, end to end.",
    base_price: 4999,
    price_unit: "per month",
    turnaround: "7 days",
    sort_order: 2,
  },
];

const d = (days: number) => {
  const t = new Date();
  t.setDate(t.getDate() + days);
  return t.toISOString().slice(0, 10);
};

export const demoProjects: ProjectDetail[] = [
  {
    id: "00000000-0000-0000-0000-000000000100",
    client_id: demoProfile.id,
    service_id: demoServices[1].id,
    title: "Admission Season 2026 — Social Campaign",
    reference: "JMH-2026-001",
    status: "active",
    summary:
      "Full social campaign for the 2026 admission season: 12 posts, 4 reels, boost management and a monthly report.",
    start_date: d(-14),
    due_date: d(16),
    delivered_at: null,
    agreed_amount: 9999,
    paid_amount: 4999,
    cover_image: "/images/real-exam.jpg",
    created_at: "2026-01-12T00:00:00.000Z",
    service: demoServices[1],
    milestones: [
      {
        id: "00000000-0000-0000-0000-000000000201",
        project_id: "00000000-0000-0000-0000-000000000100",
        title: "Brand & audience brief",
        description: "Collect fee structure, admission dates, target classes and tone.",
        status: "approved",
        due_date: d(-12),
        completed_at: `${d(-12)}T10:00:00.000Z`,
        client_visible: true,
        sort_order: 1,
        deliverables: [],
      },
      {
        id: "00000000-0000-0000-0000-000000000202",
        project_id: "00000000-0000-0000-0000-000000000100",
        title: "Content calendar",
        description: "Twelve post slots mapped to the admission calendar.",
        status: "approved",
        due_date: d(-9),
        completed_at: `${d(-9)}T15:30:00.000Z`,
        client_visible: true,
        sort_order: 2,
        deliverables: [
          {
            id: "00000000-0000-0000-0000-000000000301",
            project_id: "00000000-0000-0000-0000-000000000100",
            milestone_id: "00000000-0000-0000-0000-000000000202",
            label: "Admission calendar — April to July.xlsx",
            file_url: "#",
            file_type: "xlsx",
            version: 2,
            created_at: `${d(-9)}T15:35:00.000Z`,
          },
        ],
      },
      {
        id: "00000000-0000-0000-0000-000000000203",
        project_id: "00000000-0000-0000-0000-000000000100",
        title: "Poster & banner creative set",
        description: "Four print-ready designs in Hindi and English.",
        status: "in_progress",
        due_date: d(3),
        completed_at: null,
        client_visible: true,
        sort_order: 3,
        deliverables: [
          {
            id: "00000000-0000-0000-0000-000000000302",
            project_id: "00000000-0000-0000-0000-000000000100",
            milestone_id: "00000000-0000-0000-0000-000000000203",
            label: "Admission poster — draft 1.pdf",
            file_url: "#",
            file_type: "pdf",
            version: 1,
            created_at: `${d(-2)}T12:00:00.000Z`,
          },
        ],
      },
      {
        id: "00000000-0000-0000-0000-000000000204",
        project_id: "00000000-0000-0000-0000-000000000100",
        title: "First 6 posts published",
        description: "Instagram and Facebook, with captions written.",
        status: "pending",
        due_date: d(8),
        completed_at: null,
        client_visible: true,
        sort_order: 4,
        deliverables: [],
      },
      {
        id: "00000000-0000-0000-0000-000000000205",
        project_id: "00000000-0000-0000-0000-000000000100",
        title: "Reel shoot & edit",
        description: "One day on location, four vertical cuts with subtitles.",
        status: "pending",
        due_date: d(14),
        completed_at: null,
        client_visible: true,
        sort_order: 5,
        deliverables: [],
      },
      {
        id: "00000000-0000-0000-0000-000000000206",
        project_id: "00000000-0000-0000-0000-000000000100",
        title: "Monthly report handover",
        description: "Reach, saves, enquiries and next-month recommendations.",
        status: "pending",
        due_date: d(16),
        completed_at: null,
        client_visible: true,
        sort_order: 6,
        deliverables: [],
      },
    ],
    invoices: [
      {
        id: "00000000-0000-0000-0000-000000000401",
        project_id: "00000000-0000-0000-0000-000000000100",
        invoice_number: "INV-2026-001",
        description: "50% advance — Social Campaign, Admission Season 2026",
        amount: 4999.5,
        status: "paid",
        due_date: d(-12),
        paid_at: `${d(-12)}T11:20:00.000Z`,
        created_at: `${d(-12)}T09:00:00.000Z`,
      },
      {
        id: "00000000-0000-0000-0000-000000000402",
        project_id: "00000000-0000-0000-0000-000000000100",
        invoice_number: "INV-2026-002",
        description: "Balance on delivery",
        amount: 4999.5,
        status: "issued",
        due_date: d(16),
        paid_at: null,
        created_at: `${d(-12)}T09:05:00.000Z`,
      },
    ],
    updates: [
      {
        id: "00000000-0000-0000-0000-000000000501",
        project_id: "00000000-0000-0000-0000-000000000100",
        title: "Brief approved",
        body: "Thanks — everything in the brief is locked. Creative work starts today.",
        author_name: "JTSA Media House",
        created_at: `${d(-9)}T16:00:00.000Z`,
      },
      {
        id: "00000000-0000-0000-0000-000000000502",
        project_id: "00000000-0000-0000-0000-000000000100",
        title: "Print files with the printer",
        body: "Flex artwork is at the printer. Print-ready PDFs are in Deliverables.",
        author_name: "JTSA Media House",
        created_at: `${d(-2)}T12:10:00.000Z`,
      },
    ],
  },
  {
    id: "00000000-0000-0000-0000-000000000101",
    client_id: demoProfile.id,
    service_id: demoServices[0].id,
    title: "Annual Function — Poster & Banner Set",
    reference: "JMH-2025-114",
    status: "delivered",
    summary:
      "Print-ready poster, flex banner and standee for the 2025 annual function, delivered inside Dhanbad.",
    start_date: d(-70),
    due_date: d(-62),
    delivered_at: `${d(-62)}T18:00:00.000Z`,
    agreed_amount: 2498,
    paid_amount: 2498,
    cover_image: "/images/real-win.jpg",
    created_at: `${d(-72)}T10:00:00.000Z`,
    service: demoServices[0],
    milestones: [
      {
        id: "00000000-0000-0000-0000-000000000207",
        project_id: "00000000-0000-0000-0000-000000000101",
        title: "Design brief & theme",
        description: "Theme, colours, venue and timing confirmed.",
        status: "approved",
        due_date: d(-69),
        completed_at: `${d(-69)}T12:00:00.000Z`,
        client_visible: true,
        sort_order: 1,
        deliverables: [],
      },
      {
        id: "00000000-0000-0000-0000-000000000208",
        project_id: "00000000-0000-0000-0000-000000000101",
        title: "Poster, flex & standee design",
        description: "Three designs, Hindi and English, two revisions each.",
        status: "approved",
        due_date: d(-66),
        completed_at: `${d(-66)}T17:00:00.000Z`,
        client_visible: true,
        sort_order: 2,
        deliverables: [
          {
            id: "00000000-0000-0000-0000-000000000303",
            project_id: "00000000-0000-0000-0000-000000000101",
            milestone_id: "00000000-0000-0000-0000-000000000208",
            label: "Annual function — print pack.zip",
            file_url: "#",
            file_type: "zip",
            version: 3,
            created_at: `${d(-66)}T17:10:00.000Z`,
          },
        ],
      },
      {
        id: "00000000-0000-0000-0000-000000000209",
        project_id: "00000000-0000-0000-0000-000000000101",
        title: "Print & delivery",
        description: "Printed inside Dhanbad and delivered to the school office.",
        status: "approved",
        due_date: d(-62),
        completed_at: `${d(-62)}T18:00:00.000Z`,
        client_visible: true,
        sort_order: 3,
        deliverables: [],
      },
    ],
    invoices: [
      {
        id: "00000000-0000-0000-0000-000000000403",
        project_id: "00000000-0000-0000-0000-000000000101",
        invoice_number: "INV-2025-114",
        description: "Poster, flex & standee — full payment",
        amount: 2498,
        status: "paid",
        due_date: d(-66),
        paid_at: `${d(-66)}T09:30:00.000Z`,
        created_at: `${d(-68)}T10:00:00.000Z`,
      },
    ],
    updates: [
      {
        id: "00000000-0000-0000-0000-000000000503",
        project_id: "00000000-0000-0000-0000-000000000101",
        title: "Delivered",
        body: "All three items printed and delivered to the school office. Files are in Deliverables.",
        author_name: "JTSA Media House",
        created_at: `${d(-62)}T18:10:00.000Z`,
      },
    ],
  },
];

// ─── Derived values ───────────────────────────────────────────────────

/** Weight per milestone status, used to turn milestones into a % done. */
export const MILESTONE_WEIGHT: Record<ProjectMilestone["status"], number> = {
  pending: 0,
  revision: 0.35,
  in_progress: 0.6,
  submitted: 0.85,
  approved: 1,
};

/** Which statuses count as "finished" for the headline percentage. */
export const SETTLED_STATUSES: ProjectMilestone["status"][] = ["approved"];

export function projectProgress(p: {
  status: Project["status"];
  milestones: { status: ProjectMilestone["status"] }[];
}): number {
  if (p.status === "delivered" || p.status === "closed") return 100;
  if (!p.milestones.length) return 0;

  const total = p.milestones.reduce(
    (sum, m) => sum + MILESTONE_WEIGHT[m.status],
    0,
  );

  return Math.round((total / p.milestones.length) * 100);
}

export function countByStatus(milestones: { status: ProjectMilestone["status"] }[]) {
  return {
    total: milestones.length,
    approved: milestones.filter((m) => SETTLED_STATUSES.includes(m.status)).length,
    inProgress: milestones.filter((m) => m.status === "in_progress").length,
    awaiting: milestones.filter(
      (m) => m.status === "submitted" || m.status === "revision",
    ).length,
    pending: milestones.filter((m) => m.status === "pending").length,
  };
}

export function outstandingBalance(p: {
  agreed_amount: number | null;
  paid_amount: number | null;
}) {
  const agreed = p.agreed_amount ?? 0;
  const paid = p.paid_amount ?? 0;
  return Math.max(0, agreed - paid);
}

// ─── Data access ──────────────────────────────────────────────────────

export type DataMode = "live" | "demo";

/**
 * Loads the signed-in client's projects with everything the portal needs.
 * Falls back to demo fixtures when Supabase is not configured, so the design
 * is always reviewable.
 */
export async function loadClientProjects(): Promise<{
  mode: DataMode;
  profile: Profile;
  projects: ProjectDetail[];
}> {
  if (!isSupabaseConfigured) {
    return { mode: "demo", profile: demoProfile, projects: demoProjects };
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { mode: "live", profile: demoProfile, projects: [] };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: rows, error } = await supabase
    .from("projects")
    .select(
      `
      *,
      service:services ( id, title, slug, turnaround ),
      project_milestones ( * ),
      deliverables ( * ),
      invoices ( * ),
      project_updates ( * )
    `,
    )
    .eq("client_id", user.id)
    .order("created_at", { ascending: false });

  if (error || !rows?.length) {
    return {
      mode: "live",
      profile: profile ?? demoProfile,
      projects: [],
    };
  }

  const projects: ProjectDetail[] = rows.map((row) => {
    const raw = row as unknown as Record<string, unknown>;
    const service = (raw.service ?? null) as ProjectDetail["service"];

    return {
      ...(raw as unknown as Project),
      service,
      milestones: ((raw.project_milestones ?? []) as ProjectMilestone[])
        .map((m) => ({
          ...m,
          deliverables: ((raw.deliverables ?? []) as Deliverable[]).filter(
            (f) => f.milestone_id === m.id,
          ),
        }))
        .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)),
      invoices: ((raw.invoices ?? []) as Invoice[]).sort((a, b) =>
        a.invoice_number.localeCompare(b.invoice_number),
      ),
      updates: ((raw.project_updates ?? []) as ProjectUpdate[]).sort(
        (a, b) => b.created_at.localeCompare(a.created_at),
      ),
    };
  });

  return {
    mode: "live",
    profile: (profile as Profile) ?? demoProfile,
    projects,
  };
}

export async function getSignedInEmail(): Promise<string | null> {
  if (!isSupabaseConfigured) return null;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.email ?? null;
}