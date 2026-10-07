# Setting up Supabase

Media House uses its **own Supabase project**, completely separate from the
JTSA Olympiad site. Different project ref, different database, different logins.

```
jtsa-olympiad        → students, schools, results, orders …   (untouched)
jtsa-media-house     → profiles, projects, milestones …
```

Nothing is shared, so a mistake here can never reach the Olympiad data, and
vice versa.

---

## 1. Create the project

[supabase.com/dashboard](https://supabase.com/dashboard) → **New project**

- **Organization** — your existing org, or a new one
- **Name** — `jtsa-media-house`
- **Database password** — save this somewhere safe, you will need it
- **Region** — pick the same region as the Olympiad project
  (`ap-southeast-2`) so the data stays in the same jurisdiction

Free tier is fine to start.

---

## 2. Run the schema

**SQL Editor** → New query → paste all of
[`supabase/schema.sql`](../supabase/schema.sql) → **Run**

When Supabase warns about "destructive operations" and "creates a table without
RLS", choose **Run and enable RLS**. Both are false positives — the
`drop … if exists` statements only make the script re-runnable, and RLS is
enabled explicitly for all eight tables further down.

Re-runnable by design: `if not exists` everywhere, `drop policy if exists`
before each `create policy`, demo seed guarded.

Nothing else needs changing on this fresh project — it already exposes
`public`, which is where the tables live.

---

## 3. Environment variables

```bash
cp .env.example .env.local
```

**Project Settings → API**

| Variable | Which key |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | *anon public* |
| `SUPABASE_SERVICE_ROLE_KEY` | *service_role* — server only, never commit |
| `NEXT_PUBLIC_SITE_URL` | your site URL, for magic-link redirects |

Restart `npm run dev`. The portal switches from demo mode to live by itself.

---

## 4. Create a client login

**Authentication → Users → Add user**

Email + password, or *Email OTP* for the magic-link flow the login page
offers. The `on_auth_user_created` trigger creates the matching `profiles` row.

### Optional: the seeded demo project

Create the user with the email `demo@client.test` **first**, then re-run
`schema.sql`. The seed attaches to that login and inserts a project with
milestones, deliverables, invoices and updates — useful for showing the portal
to someone before real data exists.

---

## 5. Verify

```sql
select table_name from information_schema.tables
where table_schema = 'public' order by 1;
```

Expect 8 tables: `deliverables`, `enquiries`, `invoices`, `profiles`,
`project_milestones`, `project_updates`, `projects`, `services`.

### Check row level security

Sign in as one client, open DevTools → Network, and look at any
`/rest/v1/…` response. RLS means it only ever contains rows where
`client_id` matches that login. To be sure, create a second login and confirm
each portal shows only its own project.

---

## Cleaning up the Olympiad project

Media House briefly lived inside the Olympiad project. To remove it,
[`supabase/cleanup-olympiad-project.sql`](../supabase/cleanup-olympiad-project.sql)
drops the whole `media_house` schema, then remove the `media_house` chip from
**Project Settings → Data API → Settings → Extra search path**.