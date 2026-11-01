# Sprint plan — Phase 4 (Build)

| | |
| --- | --- |
| Version | 1.0 (2026-10-31) |
| Inputs | [PLAYBOOK](../../PLAYBOOK.md) Phase 4 · [user stories](../01-requirements/user-stories.md) · [architecture](../03-architecture/architecture.md) v1.0 · [RAID](RAID-log.md) |
| Capacity | Two sprints of about 4 days each (assumed, from the PLAYBOOK) |

## 1. Sprint goals
- **Sprint 1:** a ticket is submitted, saved, and triaged, or safely falls back to "Needs triage";
  agents must sign in. Items: CI, US-12, US-01, US-02, US-09, US-03.
- **Sprint 2:** an agent approves an AI draft, the customer sees and rates the reply, and the lead
  sees the dashboard. Items: US-04, US-05 (including AC6 "Check priority", added at Gate 3), US-06,
  US-07, US-08 ("time to triage", Gate 3), US-10 (Should), US-11 (Could, only if time).

## 2. Sprint 1 order
Each item is one branch and one PR. Each starts with its own plan, approved by the user.

| # | Item | Branch | Why this order | Main outputs |
| --- | --- | --- | --- | --- |
| 0 | Foundation + CI | `chore/ci-foundation` | Every story needs a database and tests; closes R8 | Prisma with the Sprint 1 tables (`Ticket`, `Triage`, `Agent`, `AiCallLog`, `RateLimit`); Vitest; Playwright with axe; `.env.example`; `.github/workflows/ci.yml` (install, typecheck, lint, Vitest with coverage, Prisma migrate against a Postgres service container, build, Playwright and axe); one smoke test per level |
| 1 | US-12 Agent sign-in | `story/US-12-agent-sign-in` | Highest technical risk (R23), so early | Auth.js v5 + Next.js 16 spike first; then Credentials sign-in, argon2id, `requireAgent()` / `requireLead()`, `proxy.ts`, seeded demo accounts. A new ADR if the spike fails |
| 2 | US-01 Submit ticket | `story/US-01-submit-ticket` | The core flow | Form and Server Action, Zod, rate limit (HMAC keys), honeypot; `after()` registered **before** `redirect()` (architecture §4.1, finding M1) |
| 3 | US-02 Confirmation + status link | `story/US-02-status-link` | Needs US-01 | 128-bit token stored as SHA-256; confirmation at `/t/{token}?new=1`; generic "not found" for bad links |
| 4 | US-09 AI fallback | `story/US-09-ai-fallback` | Works without the API key | `AiClient` interface and a fake; `AI_TRIAGE_ENABLED` switch; daily dollar cap; lost-job sweep; "Needs triage" |
| 5 | US-03 AI triage | `story/US-03-ai-triage` | Live calls need the key; tests use the fake | Anthropic SDK client (`messages.parse` + Zod); `src/ai/prompts/triage.v1.md`; `src/ai/faq.md`; `redact()`; §6.3 checks including `check_priority`; `AiCallLog` per attempt; `tests/fixtures/tickets.json` (25–30 tickets, urgent and tricky cases) |

Sprint 2's order is planned at the Sprint 1 retro.

## 3. Definition of Done (every story)
- [ ] Every acceptance criterion has a test: unit or integration in Vitest, plus at least one
      Playwright test per story.
- [ ] Every input and every AI output is checked with Zod.
- [ ] No `any` without a comment explaining why.
- [ ] axe reports 0 serious violations on the story's pages.
- [ ] Typecheck, lint and tests pass locally, and CI is green.
- [ ] `/review` (the code-reviewer subagent) is run; its findings are fixed or logged in RAID.
- [ ] `.env.example`, ADRs and RAID are updated where the story touched them.
- [ ] The PR links the story and lists each acceptance criterion with the test that covers it.
- [ ] The user merges the PR. Claude Code doesn't merge unless asked.

## 4. Sprint 1 demo (about 2 minutes, recorded by the user)
1. Submit a ticket; the reference appears within 3 s.
2. Open the status link.
3. Sign in as the demo agent.
4. Show the ticket's triage result (database or logs; the queue screen comes in Sprint 2).
5. Turn the AI off and submit another ticket: it lands in "Needs triage".
6. Open a wrong status link: "not found".

## 5. Burndown (story count)
| Sprint | Day | Done | Left | Note |
| --- | --- | --- | --- | --- |
| 1 | 0 | 0 | 6 | Plan written |
| 1 | 0 | 1 | 5 | Item 0 (CI) merged, PR #4; `main` protected |
| 1 | 1 | 1 | 5 | US-12 in review; Auth.js spike passed (R23 closed) |

## 6. What the user provides, and by when
| What | Needed before | RAID |
| --- | --- | --- |
| Make the repo public: **done 2026-10-31**. gitleaks scanned all 31 commits (11 hits, all fake prototype status tokens); GitHub secret scanning and push protection on | Item 0 | Gate 0, R24 |
| A Neon account and a Vercel production project; the user puts the database URLs in `.env.local` | Preview deploys (local dev and CI use plain Postgres) | D2 |
| An Anthropic API key with a spend limit, plus a separate key for eval and development | US-03's live check (tests don't need it) | I1, D1, R7 |
| Record the 2-minute demo; read the retro | End of Sprint 1 | — |

## 7. Sprint 1 risks
- **R7 / I1:** no API key yet. US-09 and US-03 are built against the fake, so only the live check waits.
- **R8:** no CI until item 0 lands.
- **R20:** cold starts on Neon and Vercel.
- **R23:** Auth.js v5 compatibility with Next.js 16; spiked first in US-12.
- **R14:** prototype routes stay until they're deleted before release.
- **R11:** the 2-week target is tight; slippage is shown in the burndown.
