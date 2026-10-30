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
| R8 | No CI until Phase 4 (accepted at Gate 0); a regression in early scaffolding goes unnoticed | L | L | Phases 1–3 are docs and prototypes; CI is the first Phase 4 task, before any story | Claude Code | Accepted |
| R9 | FAQ has no owner (out of MVP scope); in real use it goes stale and drafts drift from policy | M | M | Stated as an MVP assumption (A2); content ownership on roadmap; drafts cite their FAQ entry | User | Accepted |
| R10 | Automation bias: agents approve AI drafts without reading them, hidden by high approval and speed targets | M | H | Counter-metric: ≥ 90% of sampled approved replies correct; AI content labelled; UAT trust question | Claude Code | Open |
| R11 | 2-week target vs ~4-week playbook; UAT participant availability can't be compressed | H | M | Target, not hard date; slippage tracked in PROGRESS.md; book UAT participants now; Coulds built last | User | Open |
| R12 | Public demo exceeds the $5/month API cap | M | M | Rate limit on submission, AI on/off switch, Haiku-class model, spend limit in Console | User | Open |
| R13 | Long-ticket AI summary omits a critical detail | M | H | Full text always visible; summary labelled AI-suggested; eval includes buried-detail tickets | Claude Code | Open |

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

## Dependencies
| ID | Dependency | Needed by | Status |
| --- | --- | --- | --- |
| D1 | Anthropic API key with spend limit | Phase 4 | Deferred to Phase 4 (see I1) |
| D2 | Vercel + Postgres accounts | Phase 4 | Open |
| D3 | 4–6 UAT participants | Phase 6 | Open |
