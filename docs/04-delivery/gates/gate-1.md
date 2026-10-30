# Gate 1 — Requirements

Prepared by Claude Code on 2026-10-30. Criteria from `PLAYBOOK.md` (Phase 1).

| Criterion | Evidence | Status |
| --- | --- | --- |
| Every story has acceptance criteria | [user-stories.md](../../01-requirements/user-stories.md): 12 stories, 54 Given/When/Then ACs (3–6 each), each with ≥ 1 unhappy path | Met |
| MoSCoW on every story | Same file: 9 Must + US-12 Must, 1 Should (US-10), 1 Could (US-11) | Met |
| MVP scope frozen | [BRD §6](../../01-requirements/BRD.md#6-scope): In / Out with reasons | Met, on your sign-off |
| AI usage boundaries written down | [BRD §7](../../01-requirements/BRD.md#7-ai-usage-boundaries): 6 "should", 7 "must never", classification rules | Met |
| BRD | [BRD.md](../../01-requirements/BRD.md): problem, goals, KPIs (measured vs simulated), scope, constraints, success/failure criteria, current vs future flow | Met |
| Personas with current-vs-future journeys | [personas.md](../../01-requirements/personas.md): Sofia, Daniel, Amara, Priya | Met |
| NFRs | [nfrs.md](../../01-requirements/nfrs.md): 17 NFRs, each with a measure, a verification method and a source | Met |
| Assumed figures labelled | All non-PO figures marked "assumed"; RAID A3 | Met |

## Scope changes against the charter, for you to approve
| Change | Origin |
| --- | --- |
| US-10 Customer rates reply: Could → **Should** | You, interview Q12 |
| US-11 Ask the knowledge base (agent-only): **new, Could** | You, interview Q8 (instead of a customer chatbot) |
| US-12 Agent sign-in: **new, Must, Sprint 1** | Claude Code: the charter has "agent auth" in scope but no story covered it |
| Long-ticket summary inside US-03 | You, interview Q9 |
| Roadmap additions: customer chatbot, suggested answers, FAQ editing, feedback routing | Interview |

## New assumptions in the stories (not from the interview), for you to accept or change
- **US-01:** field limits (subject 5–120 characters, description 20–5,000); rate limit of 5 tickets per
  10 min per IP.
- **US-02 / NFR-09:** status token ≥ 128 bits of randomness; reference format `HD-24817`.
- **US-09:** "Needs triage" tickets are treated as **High** until an agent sets a priority, so a failed
  AI call can't bury a possibly urgent ticket.
- **NFR-17:** browser support (latest 2 versions of the major browsers; 360 px width).

## Risks if approved
- R11: the 2-week target vs a ~4-week playbook.
- R7: the API key is needed around day 5–6.
- US-12 adds Sprint 1 work.

## On approval, Claude Code will
1. Update the MVP scope in `CLAUDE.md` and the sprint lists in `PLAYBOOK.md` to match.
2. Mark Gate 1 signed in `PROGRESS.md`, move to Phase 2, and add a dev-log entry.

## Decision
- [ ] Approve  - [ ] Approve with risks / changes  - [ ] Reject

**Decision:**
**Date:**
