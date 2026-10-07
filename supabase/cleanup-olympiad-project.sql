-- ══════════════════════════════════════════════════════════════════════
--  CLEANUP — remove everything Media House added to the Olympiad project
--
--  Run this in the JTSA Olympiad project's SQL editor to put it back
--  exactly as it was. Only touches the `media_house` schema, which is
--  entirely self-contained.
--
--  ⚠ If Media House moves to its own Supabase project, do this.
-- ══════════════════════════════════════════════════════════════════════

begin;

-- Drop the schema and everything inside it, in one shot.
-- CASCADE also removes the policies, grants, functions and the enum types.
drop schema if exists media_house cascade;

-- Remove the auto-create profile trigger we added to auth.users.
-- (No-op if it was never created.)
drop trigger if exists on_auth_user_created on auth.users;

-- IMPORTANT: clear the persistent PostgREST schema override.
-- A previous version of our setup script ran
--     alter role authenticator set pgrst.db_schemas = 'public, media_house';
-- A per-role `set` survives the schema being dropped. Once media_house no
-- longer exists, PostgREST fails to build its schema cache and every table in
-- the project returns HTTP 503 ("Could not query the database for the schema
-- cache"). Resetting restores the dashboard's own value.
alter role authenticator reset pgrst.db_schemas;

commit;

-- Ask PostgREST to re-read its configuration.
notify pgrst, 'reload config';

-- ── Verify the override is gone (expect 0 rows) ─────────────────────
-- select rolname, setconfig
-- from pg_db_role_setting s
-- join pg_roles r on r.oid = s.setrole
-- where rolname = 'authenticator';

-- ── Then, by hand in the dashboard ──────────────────────────────────
-- Project Settings -> Data API -> Settings
-- In "Extra search path", remove the  media_house  chip so only
-- `public` and `extensions` remain.
--
-- ── Verify nothing Olympiad-related was touched ─────────────────────
-- select table_schema, count(*)
-- from information_schema.tables
-- where table_schema in ('public','auth')
-- group by 1;
--
-- 'public' should show your original 25 tables, unchanged.