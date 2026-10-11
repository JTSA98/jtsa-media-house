-- ======================================================================
--  Migration — online payments (Razorpay)
--
--  A ledger of every online payment attempt. Rows start as `pending`
--  when a Razorpay order is created and flip to `paid` only after the
--  signature is verified (checkout callback or webhook — both funnel
--  through the same apply function, so double delivery is harmless).
--
--  Money facts are NEVER trusted from the browser: the API resolves the
--  amount from site_settings / the project row on the server.
--
--  Run once in the Media House project's SQL editor. Safe to re-run.
-- ======================================================================

create table if not exists public.payments (
  id                uuid primary key default gen_random_uuid(),
  created_at        timestamptz not null default now(),
  verified_at       timestamptz,

  -- what was bought
  purpose           text not null,          -- 'plan' | 'job' | 'due'
  item_key          text not null,          -- e.g. 'plan.growth', 'job.poster'
  item_label        text not null,          -- human line for receipts/admin
  project_id        uuid references public.projects(id) on delete set null,

  -- who paid (captured from Razorpay, best effort)
  payer_name        text,
  payer_phone       text,
  payer_email       text,

  -- money
  amount_paise      int not null check (amount_paise > 0),
  currency          text not null default 'INR',

  -- razorpay trail
  razorpay_order_id   text unique,
  razorpay_payment_id text,
  status            text not null default 'pending',  -- pending|paid|failed
  raw               jsonb
);

create index if not exists payments_status_idx on public.payments(status);
create index if not exists payments_project_idx on public.payments(project_id);
create index if not exists payments_created_idx on public.payments(created_at desc);

alter table public.payments enable row level security;

-- nobody reads payments from the browser; the API uses the service role.
-- admins read everything through the existing is_admin() helper.
drop policy if exists "payments admin all" on public.payments;
create policy "payments admin all" on public.payments
  for all using (public.is_admin()) with check (public.is_admin());

-- clients may see their own project payments (receipts in the portal).
drop policy if exists "payments own project read" on public.payments;
create policy "payments own project read" on public.payments
  for select using (
    project_id in (
      select id from public.projects where client_id = auth.uid()
    )
  );
