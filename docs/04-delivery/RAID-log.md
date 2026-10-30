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
| R7 | API key still unavailable when Phase 4 starts, blocking US-03/US-04 and the AI eval | L | H | AI client behind an interface with a mock; "Needs triage" fallback (US-09) lets Sprint 1 proceed without a live key | Claude Code | Open |

## Assumptions
| ID | Assumption | Validated? |
| --- | --- | --- |
| A1 | Anthropic API key (with spend limit) is available before Phase 4 starts | No |

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
