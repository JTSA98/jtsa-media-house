-- ══════════════════════════════════════════════════════════════════════
--  Migration — file delivery, email log, project creation
--
--  1. Storage bucket for deliverable files (posters, PDFs, reels)
--  2. An email_log table so nothing silently disappears
--  3. Extra columns so an admin can create a project from a won request
--
--  Run this once in the Media House project's SQL editor.
--  Safe to re-run.
-- ══════════════════════════════════════════════════════════════════════

-- ─── 1. storage bucket ───────────────────────────────────────────────
-- Public read: clients follow a link and see the file. Admin upload is
-- gated by the policies below, so a signed-out visitor cannot write.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media-house-files',
  'media-house-files',
  true,
  26214400, -- 25 MB
  array[
    'image/png','image/jpeg','image/webp','image/gif',
    'application/pdf',
    'video/mp4','video/quicktime','video/webm',
    'application/zip',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit;

-- Clients may read any file in the bucket.
drop policy if exists "files public read" on storage.objects;
create policy "files public read" on storage.objects
  for select using (bucket_id = 'media-house-files');

-- Only admins may upload, overwrite or remove.
drop policy if exists "files admin write" on storage.objects;
create policy "files admin write" on storage.objects
  for insert with check (
    bucket_id = 'media-house-files' and public.is_admin()
  );

drop policy if exists "files admin update" on storage.objects;
create policy "files admin update" on storage.objects
  for update using (
    bucket_id = 'media-house-files' and public.is_admin()
  ) with check (
    bucket_id = 'media-house-files' and public.is_admin()
  );

drop policy if exists "files admin delete" on storage.objects;
create policy "files admin delete" on storage.objects
  for delete using (
    bucket_id = 'media-house-files' and public.is_admin()
  );

-- ─── 2. email log ────────────────────────────────────────────────────
-- Every notification attempt is recorded. If Brevo is down or misconfigured,
-- this is how you see what never went out.
create table if not exists public.email_log (
  id          uuid primary key default gen_random_uuid(),
  to_email    text not null,
  subject     text not null,
  kind        text not null,
  project_id  uuid references public.projects(id) on delete set null,
  status      text not null default 'sent',
  error       text,
  created_at  timestamptz not null default now()
);

create index if not exists email_log_created_idx on public.email_log(created_at desc);

alter table public.email_log enable row level security;

drop policy if exists "email_log admin read" on public.email_log;
create policy "email_log admin read" on public.email_log
  for select using (public.is_admin());

drop policy if exists "email_log admin write" on public.email_log;
create policy "email_log admin write" on public.email_log
  for insert with check (public.is_admin());

-- ─── 3. project creation support ─────────────────────────────────────
-- Where an enquiry turned into a project, and who set it up.
alter table public.projects add column if not exists source_request_id uuid references public.enquiries(id) on delete set null;
alter table public.projects add column if not exists created_by     text;

-- ─── 4. admin mail settings ──────────────────────────────────────────
insert into public.site_settings (key, value, group_name, label, hint, sort_order) values
  ('notify.new_enquiry',        'true',  'notifications', 'Email me on a new enquiry',    '', 1),
  ('notify.milestone_approved', 'true',  'notifications', 'Email me when a client approves', '', 2),
  ('notify.new_project',        'false', 'notifications', 'Email me when a project is created', '', 3),
  ('notify.from',               'JTSA Media House', 'notifications', 'Sender name', 'Shown in the From line.', 4),
  ('notify.reply_to',           '',     'notifications', 'Reply-to address', 'Where replies land. Blank uses the sender address.', 5),
  ('notify.client_updates',     'false', 'notifications', 'Email clients on project updates', 'Off by default so you do not flood their inbox.', 6)
on conflict (key) do nothing;

notify pgrst, 'reload config';