# Gate 2 — UX design

Prepared by Claude Code on 2026-10-31. Criteria from `PLAYBOOK.md` (Phase 2): "UX spec approved,
prototype feedback applied", plus the five Phase 2 steps.

| Criterion | Evidence | Status |
| --- | --- | --- |
| UX spec: user flows, screen-by-screen spec, empty / loading / error states, AI trust cues | [ux-spec.md](../../02-design/ux-spec.md) v1.1: 4 Mermaid flows (§2), 8 screens with states (§3), trust cues (§4), microcopy (§5), WCAG 2.2 AA (§6), responsive (§7), decisions UX-1 to UX-7 (§8) | Met |
| Screens: Submit, Ticket status, Agent queue, Ticket detail | ux-spec §3 S1, S3, S5, S6, plus S2 Confirmation, S4 Sign-in, S7 Dashboard, S8 Not found | Met |
| Next.js scaffolded; clickable low-fi prototypes with hardcoded data under `src/app/(prototype)` | `src/app/(prototype)/prototype/` (36 routes build); live copy <https://helpdesk-ai-prototype-eta.vercel.app/prototype>; [moulinath/helpdesk-ai#1](https://github.com/moulinath/helpdesk-ai/pull/1) | Met (PR open, not merged) |
| CX principles recorded, with how each will be tested | ux-spec §1: P1–P5 (acknowledge < 3 s, human approves, AI visible and reversible, keyboard and screen reader, calm copy), each with a test method | Met (tests run in Phase 4/5) |
| Keyboard and screen-reader usable | [prototype-feedback.md](../../02-design/prototype-feedback.md) §3–§4: axe 0 violations (27 URLs, then 8 changed pages after F2–F6); `ux-accessibility-reviewer` found 5 Must + 25 Should, 29 fixed, 1 documented deviation | Met for the prototype. No VoiceOver pass yet |
| Prototype shown to 2 people, notes recorded | prototype-feedback §5: Reviewer 1 (experienced online shopper), Reviewer 2 (support agent), 2026-10-31, using [reviewer-brief.md](../../02-design/reviewer-brief.md) | Met (unmoderated, written replies) |
| Fixes applied | prototype-feedback §6: F1 task 3 story, F3 summary threshold 125 → 100, F4 private link, F5 label wording, F6 reviewer's own text; F2 "busy screen" no change, carried to UAT (RAID D3) | Met |
| UX spec approved | This sign-off | Your decision |

## What the reviews confirmed
- Both went to the Urgent ticket first, used **Why?** and the sources, and expected to land back on
  the queue after sending (UX-4).
- Both found the long-ticket summary useful and missed it on a 111-word ticket (led to F3).
- Neither said they'd trust a suggestion more because the AI made it.

## Changes to agreed decisions, for you to approve
| Change | Why | Where |
| --- | --- | --- |
| UX-2 summary threshold **125 → 100 words** | 2 of 2 reviewers missed the summary at 111 words | ux-spec §4, §8; BRD §7 item 3 (a threshold, not a scope change); nfrs.md |
| AI state labels: **"AI suggestion · not checked"** / **"✓ Checked by <name>"**; button **"Mark labels as checked"** | 0 of 2 reviewers understood "AI · unconfirmed" | ux-spec §3 S5–S6, §4 |
| Private link card says what it's for | Reviewer 2: "No idea what the private link was supposed to do" | ux-spec §3 S2, §5 |

## Deviations from the spec, for you to confirm (prototype-feedback §7)
- **Description counter** is announced to screen readers only within 200 characters of the limit,
  not on every keystroke.
- **Sending with unchecked labels** is allowed; the send dialog warns that sending marks them as
  checked, and that's logged. Re-check against US-06 in Phase 4.

## Risks if approved
- **Thin evidence:** 2 unmoderated reviews with written answers, so no think-aloud. Reviewer 1 used
  the first version of task 3, which pointed at an unrelated ticket (fixed as F1).
- **F5 and F4 untested with people:** the new wording hasn't been seen by a reviewer. Check at UAT.
- **No screen-reader test** (VoiceOver) yet; axe and the subagent review only. Planned for Phase 5.
- **R14:** prototype routes and the public Vercel project `helpdesk-ai-prototype` must be removed
  (Vercel project after this gate; routes before release).
- **PR #1 not merged:** Phase 3 work should start from `main` once you've merged it.

## Decision
Decision: _(for the user: approve / approve with risks / reject, with date)_

## On approval, Claude Code will
1. Mark Gate 2 signed in `PROGRESS.md`, move "Current phase" to 3 — Architecture, and add a dev-log
   entry.
2. Log any risks you accept in the RAID log.
