# ADR 0002 — Database and ORM: Postgres on Neon, with Prisma

- **Status:** Accepted (Gate 3, 2026-10-31)
- **Date:** 2026-10-31

## Context
The data is relational and small: tickets with one triage, one reply and one rating, agents, and
audit rows (label changes, contact reveals, AI call logs). We need transactions (send a reply and
mark labels checked together), unique constraints (one rating per ticket), a sequence for `HD-`
references, and simple aggregates for the dashboard. The charter names PostgreSQL (Neon or Supabase)
and Prisma. Free tier only.

## Options
| Option | For | Against |
| --- | --- | --- |
| **Neon Postgres + Prisma** | Serverless Postgres with a free tier; Vercel integration; database branches, so integration tests and previews don't touch production data | Cold start after idle (assumed ~0.5–1 s on first query); Prisma adds a client to the bundle |
| Supabase Postgres + Prisma | Free tier; extras (auth, storage) | Extras unused (we use Auth.js); free projects pause when idle and branching isn't on the free tier (both assumed from vendor docs; not re-checked) |
| SQLite / Turso + Drizzle | Very light | Off-charter; weaker fit for the dashboard queries and migrations story |
| Drizzle instead of Prisma | Lighter, SQL-like | Charter names Prisma; Prisma's schema file doubles as data-model documentation |

## Decision
Postgres on Neon via the Vercel integration, accessed through Prisma with migrations checked into
the repo. Use Neon's pooled connection string for the app and the direct one for migrations. Rate
limits live in a Postgres table, so no Redis is needed.

## Consequences
- Three long-lived branches, not one per preview (the free tier limits branch count, assumed): `main` (production), `preview` (shared by PR previews) and `test` (integration tests, reset per CI run).
- Atomic counters (`INSERT … ON CONFLICT DO UPDATE … RETURNING`) keep the rate limiter race-free without Redis.
- The first request after idle may be slower; NFR-01 (< 1 s p95) is measured warm and cold separately
  in Phase 5 (RAID R20).
- All personal data sits in one place, which keeps the 90-day retention job simple.
- Raw SQL is limited to the lost-job sweep and dashboard aggregates, in `src/server/db`.
