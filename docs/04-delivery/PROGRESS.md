# Progress tracker

Claude Code updates this file at the end of every session (`/log`). The user signs gates.

**Current phase:** 2 — UX design
**Next step:** Phase 2 step 1: run `/next`, plan (plan mode) and write `docs/02-design/ux-spec.md`
(customer + agent flows, 4 screens, empty/loading/error states, AI trust cues) from the Gate 1
requirements. Remind the user to book 2 prototype reviewers.
**Blocked on:** nothing

| Phase | Status | Gate | Signed off by user |
| --- | --- | --- | --- |
| 0 Setup | Done | Repo, CLAUDE.md, CI skeleton (deferred to Phase 4) | 2026-10-30, with risks R7, R8 |
| 1 Requirements | Done | Gate 1: MVP scope + stories with acceptance criteria | 2026-10-30, approved |
| 2 UX design | Not started (next) | Gate 2: UX spec + prototype feedback applied | — |
| 3 Architecture | Not started | Gate 3: architecture + 5 ADRs reviewed | — |
| 4 Build (Sprint 1) | Not started | Sprint 1 demo | — |
| 4 Build (Sprint 2) | Not started | Sprint 2 demo | — |
| 5 Testing | Not started | Gate 5: exit criteria met | — |
| 6 UAT | Not started | Gate 6: go / no-go | — |
| 7 Release + portfolio | Not started | Live URL, README case study | — |

## Story board (Phase 4)
| Story | Status | Branch / PR |
| --- | --- | --- |
| US-01 Submit ticket | Not started | |
| US-02 Confirmation + status link | Not started | |
| US-03 AI triage | Not started | |
| US-04 AI draft reply (FAQ-grounded) | Not started | |
| US-05 Agent queue by priority | Not started | |
| US-06 Edit/approve draft, record override | Not started | |
| US-07 Customer views status + reply | Not started | |
| US-08 Team-lead dashboard | Not started | |
| US-09 AI fallback "Needs triage" | Not started | |
| US-10 Customer rates reply (Should, promoted at interview) | Not started | |
| US-11 Ask the knowledge base, agent-only (Could) | Not started | |
| US-12 Agent sign-in (Must, added at Gate 1) | Not started | |

## Open decisions for the user
- Book 2 prototype reviewers and 4–6 UAT participants now (2-week target, RAID R11).
- Before Phase 4 (~day 5–6): confirm the Anthropic API key is created with a spend limit (RAID I1/D1).
- Start of Phase 4 (before CI): make the repo public after a full-history secret scan and enabling
  GitHub secret scanning (free Actions minutes + branch protection). Agreed in principle 2026-10-30.
