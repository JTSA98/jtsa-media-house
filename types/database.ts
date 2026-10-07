// ─── Database types ────────────────────────────────────────────────────
// Kept in sync with supabase/schema.sql

export type ProjectStatus = "enquiry" | "active" | "review" | "delivered" | "closed";
export type MilestoneStatus = "pending" | "in_progress" | "submitted" | "approved" | "revision";
export type InvoiceStatus = "draft" | "issued" | "paid" | "overdue";
export type RequestStatus = "new" | "contacted" | "quoted" | "won" | "lost";

export interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  email: string | null;
  client_type: "school" | "business" | "other" | null;
  organisation: string | null;
  business_type: string | null;
  work_description: string | null;
  budget_band: string | null;
  area: string | null;
  referral: string | null;
  onboarded_at: string | null;
  is_admin: boolean;
  created_at: string;
}

export interface Service {
  id: string;
  slug: string;
  title: string;
  blurb: string | null;
  base_price: number | null;
  price_unit: string | null;
  turnaround: string | null;
  sort_order: number | null;
}

export interface Project {
  id: string;
  client_id: string;
  service_id: string | null;
  title: string;
  reference: string;
  status: ProjectStatus;
  summary: string | null;
  start_date: string | null;
  due_date: string | null;
  delivered_at: string | null;
  agreed_amount: number | null;
  paid_amount: number | null;
  cover_image: string | null;
  created_at: string;
}

export interface ProjectMilestone {
  id: string;
  project_id: string;
  title: string;
  description: string | null;
  status: MilestoneStatus;
  due_date: string | null;
  completed_at: string | null;
  client_visible: boolean;
  sort_order: number | null;
}

export interface Deliverable {
  id: string;
  project_id: string;
  milestone_id: string | null;
  label: string;
  file_url: string | null;
  file_type: string | null;
  version: number | null;
  created_at: string;
}

export interface Invoice {
  id: string;
  project_id: string;
  invoice_number: string;
  description: string | null;
  amount: number;
  status: InvoiceStatus;
  due_date: string | null;
  paid_at: string | null;
  created_at: string;
}

export interface Enquiry {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  client_type: string | null;
  service: string | null;
  event_note: string | null;
  message: string | null;
  status: RequestStatus;
  admin_note: string | null;
  handled_at: string | null;
  handled_by: string | null;
  handled: boolean;
  created_at: string;
}

export interface ProjectUpdate {
  id: string;
  project_id: string;
  title: string;
  body: string;
  author_name: string | null;
  created_at: string;
}

export interface ProjectMilestoneView extends ProjectMilestone {
  deliverables: Deliverable[];
}

export interface ProjectDetail extends Project {
  service: Pick<Service, "id" | "title" | "slug" | "turnaround"> | null;
  milestones: ProjectMilestoneView[];
  invoices: Invoice[];
  updates: ProjectUpdate[];
}