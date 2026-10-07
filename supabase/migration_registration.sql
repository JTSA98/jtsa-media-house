-- ======================================================================
--  Migration ? client self-registration
--
--  Extends media_house / public profiles with the questions a client
--  answers when they register: organisation, what kind of work they do,
--  budget band and so on.
--
--  Run this once in the Media House project's SQL editor.
--  Safe to re-run.
-- ======================================================================

-- --- new columns on profiles -----------------------------------------
alter table public.profiles add column if not exists business_type   text;
alter table public.profiles add column if not exists work_description text;
alter table public.profiles add column if not exists budget_band      text;
alter table public.profiles add column if not exists area             text;
alter table public.profiles add column if not exists referral         text;
alter table public.profiles add column if not exists onboarded_at    timestamptz;

-- --- have the trigger carry registration answers through -------------
-- The profile row is created from raw_user_meta_data, so anything the
-- register form passes at signUp lands here automatically ? even when
-- email confirmation means there is no session yet.
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
    case when new.raw_user_meta_data ? 'organisation'
         then now() else null end
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Let a client update their own profile (same rule as before, unchanged
-- ownership check ? this policy already existed, recreated for clarity).
drop policy if exists "profiles_own_row" on public.profiles;
create policy "profiles_own_row" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);