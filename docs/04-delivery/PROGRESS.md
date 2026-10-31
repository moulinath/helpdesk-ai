# Progress tracker

Claude Code updates this file at the end of every session (`/log`). The user signs gates.

**Current phase:** 3 — Architecture
**Next step:** Gate 3 sign-off (the user's part). Read `docs/04-delivery/gates/gate-3.md`, answer
the 3 open questions in `docs/03-architecture/architecture.md` §11 (urgent keyword safety net;
20% edit-level threshold; dashboard "time to triage" instead of "time to acknowledgement"), and
approve, approve with risks, or reject. After sign-off, merge the `phase-3/architecture` PR and
start Phase 4 Sprint 1 with CI setup (R8), then `/story US-12` or `/story US-01`.
**Blocked on:** the user's Gate 3 decision

| Phase | Status | Gate | Signed off by user |
| --- | --- | --- | --- |
| 0 Setup | Done | Repo, CLAUDE.md, CI skeleton (deferred to Phase 4) | 2026-10-30, with risks R7, R8 |
| 1 Requirements | Done | Gate 1: MVP scope + stories with acceptance criteria | 2026-10-30, approved |
| 2 UX design | Done | Gate 2: UX spec + prototype feedback applied | 2026-10-31, with risks R15–R17, R14, I2 |
| 3 Architecture | Gate prepared (architecture v0.2, 5 ADRs, review applied) | Gate 3: architecture + 5 ADRs reviewed | — |
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
- Book 4–6 UAT participants now (2-week target, RAID R11, D3). Run UAT moderated with think-aloud (R15).
- Delete the Vercel project `helpdesk-ai-prototype` (Vercel dashboard → Settings → Delete), RAID R14.
- Glance at the 4 Mermaid flows in `docs/02-design/ux-spec.md` on GitHub to confirm they render.
- Before Phase 4 (~day 5–6): confirm the Anthropic API key is created with a spend limit (RAID I1/D1).
- Start of Phase 4 (before CI): make the repo public after a full-history secret scan and enabling
  GitHub secret scanning (free Actions minutes + branch protection). Agreed in principle 2026-10-30.
