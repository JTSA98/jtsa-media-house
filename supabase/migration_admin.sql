-- ======================================================================
--  Migration ? admin panel
--
--  1. Marks logins as admins
--  2. Adds request status tracking to enquiries
--  3. Gives admins RLS access to every table (clients can still only see
--     their own rows)
--
--  Run this once in the Media House project's SQL editor.
--  Safe to re-run.
--
--  LAST STEP: promote yourself to admin ? see the bottom of this file.
-- ======================================================================

-- --- 1. admin flag on profiles ---------------------------------------
alter table public.profiles add column if not exists is_admin boolean not null default false;

-- --- 2. request status on enquiries ----------------------------------
alter table public.enquiries add column if not exists status      text not null default 'new';
alter table public.enquiries add column if not exists admin_note  text;
alter table public.enquiries add column if not exists handled_at   timestamptz;
alter table public.enquiries add column if not exists handled_by   text;

-- keep the trigger in step with the admin flag
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

-- --- 3. is_admin() helper --------------------------------------------
-- security definer so the check cannot be spoofed by the caller
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select is_admin from public.profiles where id = auth.uid()),
    false
  );
$$;

grant execute on function public.is_admin() to anon, authenticated;

-- --- 3b. SECURITY: stop a client promoting themselves ---------------
-- "profiles_own_row" is FOR ALL, so on its own it lets a signed-in client
-- UPDATE every column of their own row ? including is_admin. Without this,
-- anyone who registers can make themselves an admin.
revoke update on public.profiles from authenticated;

grant update (
  full_name,
  phone,
  organisation,
  business_type,
  work_description,
  budget_band,
  area,
  referral
) on public.profiles to authenticated;

-- --- 4. admin policies -----------------------------------------------
-- Every table gets: "owner can see their own" (already in place) plus
-- "an admin can see and manage everything".

-- profiles ------------------------------------------------------------
drop policy if exists "admin read all profiles" on public.profiles;
create policy "admin read all profiles" on public.profiles
  for select using (public.is_admin());

drop policy if exists "admin update all profiles" on public.profiles;
create policy "admin update all profiles" on public.profiles
  for update using (public.is_admin()) with check (public.is_admin());

-- projects ------------------------------------------------------------
drop policy if exists "admin read all projects" on public.projects;
create policy "admin read all projects" on public.projects
  for select using (public.is_admin());

drop policy if exists "admin manage all projects" on public.projects;
create policy "admin manage all projects" on public.projects
  for all using (public.is_admin()) with check (public.is_admin());

-- milestones ----------------------------------------------------------
drop policy if exists "admin read all milestones" on public.project_milestones;
create policy "admin read all milestones" on public.project_milestones
  for select using (public.is_admin());

drop policy if exists "admin manage all milestones" on public.project_milestones;
create policy "admin manage all milestones" on public.project_milestones
  for all using (public.is_admin()) with check (public.is_admin());

-- deliverables --------------------------------------------------------
drop policy if exists "admin read all deliverables" on public.deliverables;
create policy "admin read all deliverables" on public.deliverables
  for select using (public.is_admin());

drop policy if exists "admin manage all deliverables" on public.deliverables;
create policy "admin manage all deliverables" on public.deliverables
  for all using (public.is_admin()) with check (public.is_admin());

-- invoices ------------------------------------------------------------
drop policy if exists "admin read all invoices" on public.invoices;
create policy "admin read all invoices" on public.invoices
  for select using (public.is_admin());

drop policy if exists "admin manage all invoices" on public.invoices;
create policy "admin manage all invoices" on public.invoices
  for all using (public.is_admin()) with check (public.is_admin());

-- updates -------------------------------------------------------------
drop policy if exists "admin read all updates" on public.project_updates;
create policy "admin read all updates" on public.project_updates
  for select using (public.is_admin());

drop policy if exists "admin insert updates" on public.project_updates;
create policy "admin insert updates" on public.project_updates
  for insert with check (public.is_admin());

-- enquiries -----------------------------------------------------------
drop policy if exists "admin read all enquiries" on public.enquiries;
create policy "admin read all enquiries" on public.enquiries
  for select using (public.is_admin());

drop policy if exists "admin manage enquiries" on public.enquiries;
create policy "admin manage enquiries" on public.enquiries
  for all using (public.is_admin()) with check (public.is_admin());

-- ======================================================================
--  Promote yourself (and only yourself) to admin
-- ======================================================================
-- Replace the email below with your own, then run this separately:
--
--   update public.profiles
--      set is_admin = true
--    where email = 'jtsaofficial@gmail.com';
--
-- Promote as many people as need it ? keep it to staff only, since an
-- admin can read every client's details and invoices.
-- ======================================================================