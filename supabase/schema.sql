-- ══════════════════════════════════════════════════════════════════════
--  JTSA Media House — client project tracking
--
--  For a DEDICATED Supabase project (its own project ref, its own
--  database, its own logins). Nothing to do with the Olympiad site.
--
--  Run this once in the Media House project's SQL editor.
--  Safe to re-run.
-- ══════════════════════════════════════════════════════════════════════

create extension if not exists "pgcrypto";

-- NOTE: deliberately no `alter role authenticator set pgrst.db_schemas` here.
-- A per-role `set` is persistent, so if this schema is ever dropped the setting
-- survives and breaks PostgREST's schema cache for the whole project (503s).
-- A dedicated project already exposes `public`, so nothing needs changing.

-- ─── Enums ────────────────────────────────────────────────────────────
do $$ begin
  create type project_status as enum ('enquiry','active','review','delivered','closed');
exception when duplicate_object then null; end $$;

do $$ begin
  create type milestone_status as enum ('pending','in_progress','submitted','approved','revision');
exception when duplicate_object then null; end $$;

do $$ begin
  create type invoice_status as enum ('draft','issued','paid','overdue');
exception when duplicate_object then null; end $$;

do $$ begin
  create type client_type as enum ('school','business','other');
exception when duplicate_object then null; end $$;

-- ─── profiles ─────────────────────────────────────────────────────────
-- A login row for whoever uses the client portal.
create table if not exists public.profiles (
  id               uuid primary key references auth.users(id) on delete cascade,
  full_name        text,
  phone            text,
  email            text,
  client_type      public.client_type,
  organisation     text,
  -- registration answers
  business_type    text,
  work_description text,
  budget_band      text,
  area             text,
  referral         text,
  onboarded_at     timestamptz,
  created_at       timestamptz not null default now()
);

-- Auto-create a portal profile whenever a login is created. Anything the
-- register form passes as user metadata is carried straight through — this
-- works even when email confirmation means there is no session yet.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles
    (id, full_name, email, phone, client_type, organisation,
     business_type, work_description, budget_band, area, referral, onboarded_at)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.email,
    nullif(new.raw_user_meta_data->>'phone', ''),
    nullif(new.raw_user_meta_data->>'client_type', '')::public.client_type,
    nullif(new.raw_user_meta_data->>'organisation', ''),
    nullif(new.raw_user_meta_data->>'business_type', ''),
    nullif(new.raw_user_meta_data->>'work_description', ''),
    nullif(new.raw_user_meta_data->>'budget_band', ''),
    nullif(new.raw_user_meta_data->>'area', ''),
    nullif(new.raw_user_meta_data->>'referral', ''),
    case when new.raw_user_meta_data ? 'organisation' then now() else null end
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─── services catalogue ───────────────────────────────────────────────
create table if not exists public.services (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  title       text not null,
  blurb       text,
  base_price  numeric(12,2),
  price_unit  text,
  turnaround  text,
  sort_order  int
);

-- ─── projects ─────────────────────────────────────────────────────────
create table if not exists public.projects (
  id             uuid primary key default gen_random_uuid(),
  client_id      uuid not null references public.profiles(id) on delete cascade,
  service_id     uuid references public.services(id) on delete set null,
  title          text not null,
  reference      text unique not null,
  status         public.project_status not null default 'enquiry',
  summary        text,
  start_date     date,
  due_date       date,
  delivered_at   timestamptz,
  agreed_amount  numeric(12,2),
  paid_amount    numeric(12,2) not null default 0,
  cover_image    text,
  created_at     timestamptz not null default now()
);

create index if not exists projects_client_id_idx on public.projects(client_id);

-- ─── milestones ───────────────────────────────────────────────────────
create table if not exists public.project_milestones (
  id             uuid primary key default gen_random_uuid(),
  project_id     uuid not null references public.projects(id) on delete cascade,
  title          text not null,
  description    text,
  status         public.milestone_status not null default 'pending',
  due_date       date,
  completed_at   timestamptz,
  client_visible boolean not null default true,
  sort_order     int
);

create index if not exists milestones_project_idx on public.project_milestones(project_id);

-- ─── deliverables ─────────────────────────────────────────────────────
create table if not exists public.deliverables (
  id           uuid primary key default gen_random_uuid(),
  project_id   uuid not null references public.projects(id) on delete cascade,
  milestone_id uuid references public.project_milestones(id) on delete set null,
  label        text,
  file_url     text,
  file_type    text,
  version      int,
  created_at   timestamptz not null default now()
);

create index if not exists deliverables_project_idx on public.deliverables(project_id);

-- ─── invoices ─────────────────────────────────────────────────────────
create table if not exists public.invoices (
  id             uuid primary key default gen_random_uuid(),
  project_id     uuid not null references public.projects(id) on delete cascade,
  invoice_number text not null,
  description    text,
  amount         numeric(12,2) not null,
  status         public.invoice_status not null default 'draft',
  due_date       date,
  paid_at        timestamptz,
  created_at     timestamptz not null default now(),
  unique (project_id, invoice_number)
);

-- ─── progress updates ─────────────────────────────────────────────────
create table if not exists public.project_updates (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid not null references public.projects(id) on delete cascade,
  title       text not null,
  body        text not null,
  author_name text,
  created_at  timestamptz not null default now()
);

create index if not exists updates_project_idx on public.project_updates(project_id);

-- ─── enquiries from the website ───────────────────────────────────────
create table if not exists public.enquiries (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  phone       text not null,
  email       text,
  client_type text,
  service     text,
  event_note  text,
  message     text,
  handled     boolean not null default false,
  created_at  timestamptz not null default now()
);

-- ─── grants ───────────────────────────────────────────────────────────
grant select on all tables in schema public to anon, authenticated;
grant insert on public.enquiries to anon, authenticated;
grant update on
  public.projects,
  public.project_milestones,
  public.project_updates
  to authenticated;

-- ── Row level security ────────────────────────────────────────────────
-- Every table is owner-scoped. A client can only ever reach their own rows.
alter table public.profiles           enable row level security;
alter table public.projects           enable row level security;
alter table public.project_milestones enable row level security;
alter table public.deliverables       enable row level security;
alter table public.invoices           enable row level security;
alter table public.project_updates    enable row level security;
alter table public.enquiries          enable row level security;

-- helper: does the signed-in user own this project?
create or replace function public.owns_project(p uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.projects
    where id = p and client_id = auth.uid()
  );
$$;

create or replace function public.owns_milestone(m uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1
    from public.project_milestones pm
    join public.projects p on p.id = pm.project_id
    where pm.id = m and p.client_id = auth.uid()
  );
$$;

-- profiles: own row only
drop policy if exists "profiles_own_row" on public.profiles;
create policy "profiles_own_row" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

-- SECURITY: the policy above is FOR ALL, which would let a client UPDATE
-- every column of their own row — including is_admin, so they could promote
-- themselves. Restrict UPDATE to the columns a client should control.
revoke update on public.profiles from authenticated;
grant update (
  full_name, phone, organisation,
  business_type, work_description, budget_band, area, referral
) on public.profiles to authenticated;

-- services: public catalogue
drop policy if exists "services_public_read" on public.services;
create policy "services_public_read" on public.services
  for select using (true);

-- projects: owner only
drop policy if exists "projects_owner_all" on public.projects;
create policy "projects_owner_all" on public.projects
  for all using (auth.uid() = client_id) with check (auth.uid() = client_id);

-- milestones: owner sees their own; may move status
drop policy if exists "milestones_owner_read" on public.project_milestones;
create policy "milestones_owner_read" on public.project_milestones
  for select using (public.owns_project(project_id));
drop policy if exists "milestones_owner_update" on public.project_milestones;
create policy "milestones_owner_update" on public.project_milestones
  for update using (public.owns_milestone(id))
  with check (public.owns_milestone(id));

-- deliverables: owner reads
drop policy if exists "deliverables_owner_read" on public.deliverables;
create policy "deliverables_owner_read" on public.deliverables
  for select using (public.owns_project(project_id));

-- invoices: owner reads
drop policy if exists "invoices_owner_read" on public.invoices;
create policy "invoices_owner_read" on public.invoices
  for select using (public.owns_project(project_id));

-- updates: owner reads, owner may add a note
drop policy if exists "updates_owner_read" on public.project_updates;
create policy "updates_owner_read" on public.project_updates
  for select using (public.owns_project(project_id));
drop policy if exists "updates_owner_insert" on public.project_updates;
create policy "updates_owner_insert" on public.project_updates
  for insert with check (public.owns_project(project_id));

-- enquiries: anyone may submit; only the agency reads them
drop policy if exists "enquiries_public_insert" on public.enquiries;
create policy "enquiries_public_insert" on public.enquiries
  for insert with check (true);

-- ══════════════════════════════════════════════════════════════════════
--  Seed data
-- ══════════════════════════════════════════════════════════════════════

insert into public.services (slug, title, blurb, base_price, price_unit, turnaround, sort_order) values
  ('posters-banners',   'Posters & Banners',      'Admission posters, result-day banners, flex and standees. Hindi or English, print-ready.', 299,  'per design', '48 hours', 1),
  ('social-campaigns',  'Social Media Campaigns', 'Instagram, Facebook and WhatsApp. Captions, design, publishing, boosting and a monthly report.', 4999, 'per month',   '7 days',    2),
  ('video-reels',       'Video & Reels',          'Thirty-second vertical video with subtitles, thumbnail and optional Hindi voiceover.', 4999, 'per reel',    '5 days',    3),
  ('website-listing',   'Website Listing',        'A permanent page on the JTSA website with photo, address, timings and tap-to-call.', 999, 'per month', '2 days',    4)
on conflict (slug) do nothing;

-- Demo project, attached to whichever login uses demo@client.test.
-- Create that login first (Authentication -> Users -> Add user), then
-- re-run this whole file. The block is a no-op once it has seeded.
do $$
declare
  demo_client  uuid;
  demo_project uuid;
  demo_service uuid;
begin
  select id into demo_client
  from public.profiles
  where email = 'demo@client.test'
  limit 1;

  if demo_client is null then
    raise notice 'No demo@client.test login found - skipping demo project seed.';
    return;
  end if;

  if exists (select 1 from public.projects where reference = 'JMH-2026-001') then
    return; -- already seeded
  end if;

  select id into demo_service from public.services where slug = 'social-campaigns';

  insert into public.projects
    (client_id, service_id, title, reference, status, summary,
     start_date, due_date, agreed_amount, paid_amount, cover_image)
  values
    (demo_client, demo_service, 'Admission Season 2026 — Social Campaign', 'JMH-2026-001', 'active',
     'Full social campaign for the 2026 admission season: 12 posts, 4 reels, boost management and a monthly report.',
     current_date - 14, current_date + 16, 9999, 4999, '/images/real-exam.jpg')
  returning id into demo_project;

  insert into public.project_milestones
    (project_id, title, description, status, due_date, completed_at, sort_order) values
    (demo_project, 'Brand & audience brief',       'Collect fee structure, admission dates, target classes and tone.', 'approved',    current_date - 12, current_date - 12, 1),
    (demo_project, 'Content calendar',             'Twelve post slots mapped to the admission calendar.',                  'approved',    current_date - 9,  current_date - 9,  2),
    (demo_project, 'Poster & banner creative set', 'Four print-ready designs in Hindi and English.',                         'in_progress', current_date + 3,  null,               3),
    (demo_project, 'First 6 posts published',      'Instagram and Facebook, with captions written.',                        'submitted',   current_date + 8,  null,               4),
    (demo_project, 'Reel shoot & edit',            'One day on location, four vertical cuts with subtitles.',             'pending',     current_date + 14, null,               5),
    (demo_project, 'Monthly report handover',      'Reach, saves, enquiries and next-month recommendations.',              'pending',     current_date + 16, null,               6);

  insert into public.project_updates (project_id, title, body, author_name) values
    (demo_project, 'Brief approved',          'Thanks — everything in the brief is locked. Creative work starts today.',          'JTSA Media House'),
    (demo_project, 'Print files with printer','Flex artwork is at the printer. Print-ready PDFs are in Deliverables.',          'JTSA Media House');

  insert into public.invoices
    (project_id, invoice_number, description, amount, status, due_date, paid_at) values
    (demo_project, 'INV-2026-001', '50% advance — Social Campaign, Admission Season 2026', 4999.50, 'paid',    current_date - 12, current_date - 12),
    (demo_project, 'INV-2026-002', 'Balance on delivery',                                4999.50, 'issued', current_date + 16, null);
end $$;