# RAID log

## Risks
| ID | Risk | Likelihood | Impact | Mitigation | Owner | Status |
| --- | --- | --- | --- | --- | --- | --- |
| R1 | Scope creep | M | M | MVP frozen at Gate 1; extras to roadmap | User | Open |
| R2 | AI misclassifies an urgent ticket | M | H | Human approval on every reply; urgent cases in eval set; low-confidence flag | Claude Code | Open |
| R3 | API cost on a public demo | M | M | Spend limit, rate limit, AI feature flag | User | Open |
| R4 | Code the user doesn't understand | M | M | Review every diff; ask for explanations; log corrections | User | Open |
| R5 | Over-claiming AI's role in CV | L | H | Dev log records who did what | User | Open |
| R6 | Customer PII in prompts | L | H | Only ticket text sent; fictional demo data | Claude Code | Open |
| R7 | API key still unavailable when Phase 4 starts, blocking US-03/US-04 and the AI eval | M (raised from L: 2-week target puts Phase 4 at ~day 5–6) | H | AI client behind an interface with a mock; "Needs triage" fallback (US-09) lets Sprint 1 proceed without a live key | Claude Code | Open |
| R8 | No CI until Phase 4 (accepted at Gate 0); a regression in early scaffolding goes unnoticed | L | L | Phases 1–3 are docs and prototypes; CI is the first Phase 4 task, before any story | Claude Code | Closed 2026-10-31: CI in PR #4 (typecheck, lint, migrate + drift check, Vitest, build, Playwright + axe, gitleaks); a deliberate type error was blocked |
| R9 | FAQ has no owner (out of MVP scope); in real use it goes stale and drafts drift from policy | M | M | Stated as an MVP assumption (A2); content ownership on roadmap; drafts cite their FAQ entry | User | Accepted |
| R10 | Automation bias: agents approve AI drafts without reading them, hidden by high approval and speed targets | M | H | Counter-metric: ≥ 90% of sampled approved replies correct; AI content labelled; UAT trust question | Claude Code | Open |
| R11 | 2-week target vs ~4-week playbook; UAT participant availability can't be compressed | H | M | Target, not hard date; slippage tracked in PROGRESS.md; book UAT participants now; Coulds built last | User | Open |
| R12 | Public demo exceeds the $5/month API cap | M | M | Rate limit on submission, AI on/off switch, Haiku-class model, spend limit in Console | User | Open |
| R13 | Long-ticket AI summary omits a critical detail | M | H | Full text always visible; summary labelled AI-suggested; eval includes buried-detail tickets | Claude Code | Open |
| R14 | Phase 2 prototype routes (`/prototype/*`, fake sign-in, sample data) ship to production | L | M | Pages are `noindex`; delete `src/app/(prototype)` as a Phase 7 release-checklist item; Gate 6 checks it's gone. The public review copy (Vercel project `helpdesk-ai-prototype`, 2026-10-31) is deleted now that Gate 2 is signed (user, in the Vercel dashboard) | Claude Code | Open |
| R15 | Prototype evidence is thin: 2 unmoderated reviews with written answers, no think-aloud; Reviewer 1 saw the first version of task 3 | M | M | Accepted at Gate 2. UAT (Phase 6) is moderated and think-aloud, with 4–6 participants (D3) | User | Accepted |
| R16 | Changed wording (F4 private link, F5 "AI suggestion · not checked" / "Mark labels as checked") not yet seen by any user | M | M | Accepted at Gate 2. UAT script asks what the labels and the link mean | Claude Code | Accepted |
| R17 | No screen-reader test yet (axe and the a11y subagent only) | M | H | Accepted at Gate 2. VoiceOver pass on S1, S3, S5, S6 in Phase 5; exit criterion for Gate 5 | Claude Code | Accepted |
| R18 | One abuser uses up the daily AI budget ($0.15), so new tickets go to "Needs triage" for everyone until midnight UTC | L | M | Accepted at Gate 3 (2026-10-31). Honeypot field, per-IP limit; agents still answer by hand; cap and limit tunable by env var | User | Accepted |
| R19 | Demo credentials are public: anyone can read every ticket and use Ask the KB | H | L | Accepted. Fictional data only; demo notice; KB limit 20/hour per agent; daily AI budget | User | Accepted |
| R20 | Cold starts (Neon wake-up + function start) push submit over NFR-01's 1 s p95 | M | M | Measure warm and cold separately in Phase 5; report both; customer still sees the reference with no AI wait | Claude Code | Open |
| R21 | Status-link paths (with tokens) appear in Vercel's own request logs | M | L | Accepted. Owner-only, short-lived; Sentry and Analytics scrub `/t/<token>` (architecture §7.4) | User | Accepted |
| R22 | A triage killed mid-call isn't retried; Neon and Vercel are single points of failure | L | L | Accepted for demo volume. Sweep moves stuck tickets to "Needs triage" within 2 min; queue service is the upgrade path (ADR 0004) | Claude Code | Accepted |
| R23 | Auth.js v5 doesn't work cleanly with Next.js 16 | M | M | Spike at the start of US-12; fall back to a minimal signed-cookie session if blocked (new ADR) | Claude Code | Closed 2026-10-31: spike passed. next-auth 5.0.0-beta.32 (pinned) works with Next 16.4 + Cache Components: Credentials sign-in, `auth()` inside Suspense (after `connection()`), `proxy.ts`, sign-out, production build. Still a beta: re-check on upgrade |
| R24 | The owner's personal email is visible in public commit history (more spam, targeted phishing) | M | L | Accepted by the user 2026-10-31. Rewriting history wouldn't remove it (PR refs keep the old commits). New commits use the GitHub noreply address; the user turns on "Keep my email private" and "Block command line pushes that expose my email" | User | Accepted |
| R25 | The sign-in rate limit keys on the X-Forwarded-For address. Vercel overwrites that header, but behind any other host a client could set it and get fresh limits | L | M | Accepted for the Vercel demo only. Behind another host the limit could be bypassed entirely (each spoofed address is a fresh key), so changing host means keying on a trusted address or adding a per-email limit | Claude Code | Accepted |

## Assumptions
| ID | Assumption | Validated? |
| --- | --- | --- |
| A1 | Anthropic API key (with spend limit) is available before Phase 4 starts | No |
| A2 | The FAQ is fixed and correct for the MVP; nobody edits it in-app | Yes (PO, interview Q6) |
| A3 | Operation size: ~300 tickets/day, 8 agents, 1 lead; ~4 min to read/route a ticket (all assumed) | No (assumed figures) |
| A4 | English-only MVP; non-English tickets go to a human with no AI draft | Yes (PO, interview Q11) |
| A5 | Story-level values: field limits, 5 tickets/10 min/IP rate limit, ≥ 128-bit status token, "Needs triage" treated as High, browser support (NFR-17) | Accepted by PO at Gate 1; values still assumed, not measured |

## Issues
| ID | Issue | Raised | Owner | Status |
| --- | --- | --- | --- | --- |
| I1 | Anthropic Console payment issue; API key not yet created | 2026-10-30 | User | Open |
| I2 | PR moulinath/helpdesk-ai#1 (scaffold, prototypes, Phase 2 docs) not merged; Phase 3 must start from `main` | 2026-10-31 | User | Closed 2026-10-31 (merged, 56b6b36) |

## Dependencies
| ID | Dependency | Needed by | Status |
| --- | --- | --- | --- |
| D1 | Anthropic API key with spend limit | Phase 4 | Deferred to Phase 4 (see I1) |
| D2 | Vercel + Postgres accounts | Phase 4 | Partly met 2026-10-31: Neon account and database created. Still needed: Vercel production project, with Neon's pooled URL as `DATABASE_URL` and direct URL as `DIRECT_URL` in Vercel env vars (not `.env.local`) |
| D3 | 4–6 UAT participants | Phase 6 | Open. UAT script must ask agents whether S6 feels busy and which parts (prototype review F2) |
| D4 | 2 prototype reviewers, 10 min each | Gate 2 | Closed 2026-10-31 (an online shopper and a support agent; unmoderated) |
