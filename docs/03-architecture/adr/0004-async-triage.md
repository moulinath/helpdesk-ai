# ADR 0004 — Triage runs after the response, with a lost-job sweep

- **Status:** Proposed (Gate 3)
- **Date:** 2026-10-31

## Context
The customer must see a reference number in under 3 s whatever the AI does (P1, NFR-02, US-01 AC3).
An AI call can take up to 10 s, and with one retry up to ~20 s (NFR-04). If triage fails or never
finishes, the ticket must still end up somewhere an agent sees it (US-09).

## Options
| Option | For | Against |
| --- | --- | --- |
| Sync: call the AI inside the submit request | Simplest | Customer waits up to 20 s; breaks P1 outright |
| **`after()` in the submit action, plus a sweep** | No extra service; work starts the moment the response is sent; free | If the function is killed mid-call, nothing retries it, so a sweep is needed |
| Queue service (Inngest, QStash, Vercel Queues) | Durable retries, visibility | A new service and account for a demo with a few tickets a day; more moving parts |
| Cron that triages pending tickets | Durable | Vercel Hobby cron runs at most once a day (assumed; checked at setup): tickets would wait hours |

## Decision
Save the ticket with `triageState = pending`, register triage with `after()`, then redirect to the
confirmation. **`after()` must be called before `redirect()`**, because `redirect()` throws. The
submit route sets `maxDuration = 60`. The agents' 30 s queue poll (`GET /api/agent/queue-status`)
first moves any ticket still `pending` after 2 minutes to `needs_triage` and logs it as `lost`; pages
never write during render. A late triage result only fills labels nobody has set (conditional
update), so it can't overwrite an agent. Agents can always set labels themselves while triage is
pending, and their values win.

## Consequences
- P1 holds: the request does one insert and returns.
- A ticket never stays stuck; at worst it lands in "Needs triage" 2 minutes later, which is the
  agreed fallback anyway.
- Lost triage isn't retried automatically. At demo volume that's acceptable; a queue service is the
  upgrade path if volume grows (roadmap).
- Tests drive the triage function directly with a fake AI client; the `after()` wiring gets one
  integration test that fails if triage never runs (the reviewer's M1).
