# Progress tracker

Claude Code updates this file at the end of every session (`/log`). The user signs gates.

**Current phase:** 4 — Build (Sprint 1)
**Next step:** Sprint 1 item 0, Foundation + CI (`chore/ci-foundation`): plan first, then Prisma
with the Sprint 1 tables, Vitest, Playwright with axe, `.env.example` and `.github/workflows/ci.yml`
with a Postgres service container. Order after that: US-12 (Auth.js spike first), US-01, US-02,
US-09, US-03 (`docs/04-delivery/sprint-plan.md` §2). The repo is public as of 2026-10-31.
**Blocked on:** nothing (Anthropic API key with a spend limit needed for US-03's live check, RAID I1/D1)

| Phase | Status | Gate | Signed off by user |
| --- | --- | --- | --- |
| 0 Setup | Done | Repo, CLAUDE.md, CI skeleton (deferred to Phase 4) | 2026-10-30, with risks R7, R8 |
| 1 Requirements | Done | Gate 1: MVP scope + stories with acceptance criteria | 2026-10-30, approved |
| 2 UX design | Done | Gate 2: UX spec + prototype feedback applied | 2026-10-31, with risks R15–R17, R14, I2 |
| 3 Architecture | Done | Gate 3: architecture + 5 ADRs reviewed | 2026-10-31, approved (3 decisions: all yes) |
| 4 Build (Sprint 1) | In progress (sprint plan done; 0 of 6 items) | Sprint 1 demo | — |
| 4 Build (Sprint 2) | Not started | Sprint 2 demo | — |
| 5 Testing | Not started | Gate 5: exit criteria met | — |
| 6 UAT | Not started | Gate 6: go / no-go | — |
| 7 Release + portfolio | Not started | Live URL, README case study | — |

## Story board (Phase 4)
| Story | Status | Branch / PR |
| --- | --- | --- |
| US-01 Submit ticket | Sprint 1, planned | `story/US-01-submit-ticket` |
| US-02 Confirmation + status link | Sprint 1, planned | `story/US-02-status-link` |
| US-03 AI triage | Sprint 1, planned | `story/US-03-ai-triage` |
| US-04 AI draft reply (FAQ-grounded) | Not started | |
| US-05 Agent queue by priority | Not started | |
| US-06 Edit/approve draft, record override | Not started | |
| US-07 Customer views status + reply | Not started | |
| US-08 Team-lead dashboard | Not started | |
| US-09 AI fallback "Needs triage" | Sprint 1, planned | `story/US-09-ai-fallback` |
| US-10 Customer rates reply (Should, promoted at interview) | Not started | |
| US-11 Ask the knowledge base, agent-only (Could) | Not started | |
| US-12 Agent sign-in (Must, added at Gate 1) | Sprint 1, planned | `story/US-12-agent-sign-in` |

## Open decisions for the user
- Book 4–6 UAT participants now (2-week target, RAID R11, D3). Run UAT moderated with think-aloud (R15).
- Delete the Vercel project `helpdesk-ai-prototype` (Vercel dashboard → Settings → Delete), RAID R14.
- Glance at the 4 Mermaid flows in `docs/02-design/ux-spec.md` on GitHub to confirm they render.
- Merge the `phase-4/sprint-plan` PR.
- Before US-03: confirm the Anthropic API key is created with a spend limit (RAID I1/D1).
