# JTSA Media House

Official website for **JTSA Media House**, the advertising and creative division of
Jharkhand Talent Search Association (JTSA) — Dhanbad, Jharkhand.

## What this is

- A marketing homepage (scrapbook / paper-collage art direction) for the agency.
- A **client portal** where paying customers can log in and track how much of their
  project is done — milestone progress, deliverables, invoices and updates.

## Stack

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- Supabase (auth + Postgres + row level security)

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run typecheck
```

## Environment variables

Copy `.env.example` to `.env.local` and fill in:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only key (admin client) |

The site renders fine without Supabase configured — the portal simply stays in
"demo mode". See `lib/supabase/config.ts`.

## Project structure

```
app/
  layout.tsx            root layout, fonts, metadata
  page.tsx              homepage (scrapbook design)
  login/page.tsx        client login
  portal/
    layout.tsx          portal shell + auth guard
    page.tsx            project list (all projects for the signed-in client)
    [id]/page.tsx       single project: milestone tracking, deliverables, invoice
components/
  sections/             homepage sections
  portal/               portal widgets
  ui/                   shared primitives (Tape, Polaroid, Btn, etc.)
lib/
  supabase/             clients (browser / server / admin)
  data.ts               static content used by the homepage
  utils.ts              helpers
supabase/
  schema.sql            tables, RLS policies, triggers, seed data
types/
  database.ts           generated-style TypeScript types
```

## Supabase setup

This site uses its **own dedicated Supabase project**, fully separate from the
JTSA Olympiad site. Different database, different logins — a mistake here can
never reach the Olympiad data.

1. Create a new project at supabase.com/dashboard. Use the same region as the
   Olympiad project (`ap-southeast-2`).
2. Run `supabase/schema.sql` in its SQL editor. Re-runnable.
3. Copy the project URL, anon key and service role key into `.env.local`
   (see `.env.example`), plus `NEXT_PUBLIC_SITE_URL`.
4. Create a login under Authentication → Users. The trigger creates the
   matching `profiles` row.
5. Restart `npm run dev`.

Full walkthrough, including how to expose the schema to PostgREST and how to
verify row level security: **[docs/SUPABASE-SETUP.md](./docs/SUPABASE-SETUP.md)**

## Design notes

The art direction is deliberately **not** the same as the main Olympiad site. That
site uses soft claymorphism; this one uses a printed-paper collage look:

- kraft paper background with a grain overlay
- washi tape strips and tilted polaroids with hand-written captions
- marker highlighter blocks behind key words
- Caveat / Patrick Hand for the handwritten layer, Karla for structure
- hard 2.5px ink borders and offset "printed" shadows instead of soft shadows

## Contact placeholders

Phone, email, UPI id and social links are placeholders in
`lib/site-config.ts` — replace them before going live.