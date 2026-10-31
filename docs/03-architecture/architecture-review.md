# Architecture review — Gate 3

| | |
| --- | --- |
| Reviewer | `architecture-reviewer` subagent (independent; read-only) |
| Reviewed | [architecture.md](architecture.md) v0.1 and ADRs 0001–0005, against the BRD, user stories, NFRs, UX spec §8 and `CLAUDE.md` |
| Date | 2026-10-31 |
| Result | 5 Must-fix, 11 Should-fix, 8 Consider. All Must-fix and Should-fix items resolved in v0.2; Consider items resolved or accepted in RAID |

## Findings and resolutions

| ID | Finding (short) | Resolution | Where |
| --- | --- | --- | --- |
| M1 | `redirect()` before `after()` would mean triage never runs | `after()` is registered before `redirect()`; integration test fails if triage never runs | §4.1, ADR 0004 |
| M2 | A late triage result could overwrite agent labels and turn `replied` back to `in_progress` | Conditional updates in one transaction; triage never touches status | §4.2, §3 |
| M3 | Status-link tokens would reach Sentry, Analytics and request logs | Sentry and Analytics scrub `/t/<token>`; request-log residual accepted | §7.4, RAID R21 |
| M4 | Worst case is ~$6/month, not $5; KB not counted; no `max_tokens`; eval could share the key | Daily **dollar** cap ($0.15) from `AiCallLog.costUsd`, KB included; `max_tokens: 1024`; separate key for eval/dev; worst case recalculated | §6.6, §8, ADR 0003 |
| M5 | Customers sign tickets with their name and email, so the payload type alone doesn't keep PII out | `redact()` removes the submitted name, email, any email pattern and phone-like numbers before the call; tests | §6.2 |
| S1 | One bad citation or summary word count fails the whole triage | Code computes `summaryRequired`; a bad summary or draft is dropped and flagged; labels kept; ≤ 25-word check | §6.2, §6.3 |
| S2 | Sweep wrote during render; attempts logged only at the end; no `lost` outcome | Sweep runs in the queue-status handler; `AiCallLog` per attempt, written at once; `lost` outcome | §4.3, §3 |
| S3 | Labels set before the AI result arrived were logged as overrides | `aiLabelsShown` from the form; `set_without_ai` | §4.4 |
| S4 | Queue sort for `needs_triage`/`pending` and the 30 s poll weren't designed | Sort order and `GET /api/agent/queue-status` defined | §4.3 |
| S5 | "In progress" set by a GET; customers saw it after AI only | `in_progress` set only by `openTicket` / `checkLabels` | §3, §4.4 |
| S6 | No edit level when there was no draft; `rewritten` ≠ "unused" in US-06/US-08 | `no_draft` (left out of G3); `rewritten` renamed `unused` | §6.5 |
| S7 | How the confirmation page gets the plaintext token was undefined | Confirmation is `/t/{token}?new=1`, so the token is never stored and the ref alone opens nothing | §4.1 |
| S8 | Plain SHA-256 of an IP is reversible; rows never purged; counter race | HMAC with a secret; atomic upsert; purged daily | §3, §7.4, ADR 0002 |
| S9 | Refusals (likely safety tickets) landed as High; NFR-16 rests on the model alone | Refusals flagged `review_now` and sorted with Urgent; keyword safety net put to the user (§11 Q1) | §6.1, §11 |
| S10 | Prisma error messages can carry emails into Sentry | `beforeSend` replaces Prisma messages with the error code; test | §7.4 |
| S11 | Caching would cost more at demo volume; prices and the +30% tokenizer figure stated as fact | Caching dropped for the MVP; prices and token counts labelled assumed, with source | §6.1, §8, ADR 0003 |
| C1 | Cold starts make NFR-01 p95 < 1 s unlikely | Measure warm and cold separately | RAID R20 |
| C2 | `latencyMs` is per attempt; "time to ack" is ~0 by design | `triageCompletedAt` added; dashboard metric put to the user (§11 Q3) | §3, §11 |
| C3 | Cascade vs set-null contradiction; retention deletes open tickets | `onDelete` per relation stated; open-ticket deletion accepted for the demo | §3, §7.4 |
| C4 | Double send hits the unique constraint; sending with no labels | Friendly "already has a reply"; labels required before sending | §4.5 |
| C5 | `rateReply` didn't need a Reply; public demo creds; no KB limit; JWT revocation | Reply required; KB 20/hour; `requireAgent()` checks the database | §4.6, §4.7, §7.1, RAID R19 |
| C6 | No `faqVersion`; KB prompt unnamed; "never edit a released prompt" unenforced | `faqVersion` on `Triage` and the log; `kb.v1.md`; CI hash check | §3, §6.2 |
| C7 | Some choices had no stated alternatives | "Choices considered" notes for rate limiting, polling and structured output | §5, §6.1 |
| C8 | One IP can use up the day's cap; single points of failure; injected URLs in drafts | Accepted (R18, R22); honeypot field; drafts plain text; `url_in_draft` flag | §4.1, §6.3, §7.4 |

## Where the reviewer was partly wrong
- **S11, "the prefix may be under the minimum cacheable length":** the Claude API reference gives
  512 tokens as the minimum for Haiku 5.5, and the prefix is ~2,500, so it would cache. The
  conclusion still stands (caching costs more at demo volume), so caching is dropped anyway.

## Where Claude Code's v0.1 was wrong
All 24 findings were gaps or errors in the first draft. The most serious: the `redirect()`/`after()`
order (M1) would have silently disabled triage, and the "$5 at the very worst" claim (M4) was off by
~20% because it ignored long tickets.
