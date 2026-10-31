# Prototype feedback — HelpDesk AI

| | |
| --- | --- |
| Version | 0.2 (prototype built and reviewed by the a11y subagent; human reviews pending) |
| Date | 2026-10-31 |
| Inputs | [UX spec](ux-spec.md) v1.0 · decisions UX-1 to UX-7 |
| Gate | Gate 2 needs: 2 human reviews recorded here, fixes applied |

## 1. How to run the prototype

```bash
npm install
npm run build && npm run start
```

Then open <http://localhost:3000/prototype>. The index lists every screen and the sample tickets.

**Hosted copy for reviewers:** <https://helpdesk-ai-prototype-eta.vercel.app/prototype> (separate
Vercel project `helpdesk-ai-prototype`, redeploy with `npx vercel deploy --prod`). The message to
send reviewers is in [reviewer-brief.md](reviewer-brief.md).
Each screen has an amber **Prototype** bar for switching between its loading, empty and error states.

- **Nothing is real.** All data is hardcoded in `src/app/(prototype)/prototype/_data/sample.ts`.
  There is no database and no AI call, and sign-in accepts any password.
- **Sign-in:** `daniel@larkfield.example` signs in as an agent and lands on the queue.
  `priya@larkfield.example` signs in as the team lead and lands on the dashboard.
- **Removal:** the prototypes live at `/prototype/*`, so the real routes stay free. They are removed
  before release (RAID R14).

| Screen | URL | Sample scenarios |
| --- | --- | --- |
| S1 Submit | `/prototype/support` | sending · validation errors · server error · rate limited |
| S2 Confirmation | `/prototype/support/confirmation` | copy link |
| S3 Status | `/prototype/t/9fK2xQ7pLmV4` (in progress) · `…/Nd3kLs9vQe2B` (received) · `…/Ps4nGv7cXr2D` (replied, not rated) · `…/Zk9qBt5mLw3H` (replied and rated) · `…/Rf7mWc3kTy9J` (HD-24817 replied, for review task 3) | loading · rating fails |
| S4 Sign-in | `/prototype/agent/sign-in` | signing in · wrong details · rate limited |
| S5 Queue | `/prototype/agent/queue` | loading · empty · error · new tickets · new urgent ticket |
| S6 Ticket | `/prototype/agent/tickets/HD-24817` and others (below) | loading · AI still running · send fails |
| S7 Dashboard | `/prototype/agent/dashboard` | empty period · one widget fails · agent (403) |
| S8 Not found | `/prototype/t/not-a-real-link` | — |

S6 sample tickets:

| Ticket | Scenario |
| --- | --- |
| HD-24817 | Urgent, high confidence, FAQ-grounded draft |
| HD-24811 | Labels already confirmed by Amara |
| HD-24809 | AI unavailable: needs triage, no draft |
| HD-24805 | Low confidence; 135 words, so the summary shows |
| HD-24802 | 111 words, so no summary |
| HD-24799 | Non-English, no draft |
| HD-24795 | No FAQ match |
| HD-24790 | Already replied (read-only view) |

## 2. Review script (10 minutes per reviewer)

**Who:** 2 people who haven't seen the spec, ideally one who has done customer-service work.
Run it on a laptop. Do the customer part on a phone, or with a narrow browser window.

**Say first:** "This is a rough prototype with fake data. I'm testing the design, not you. Please
think aloud. There are no wrong answers."

**Customer tasks (about 4 min):**
1. "You were charged twice for an order. Contact support." Start at `/prototype/support`.
   - Watch: does the reviewer understand the private link? Do they copy it?
2. "Later, you come back to check on it." Open the status page from the confirmation.
   - Ask: "What's happening with your request now?"
3. "Your request has been answered. Read the reply and tell the shop what you thought." Use
   `/prototype/t/Rf7mWc3kTy9J` (the same double-charge ticket, a day later, now answered).

**Agent tasks (about 5 min):**

Sign in as `daniel@larkfield.example`.

4. "Which ticket would you work on first, and why?"
   - Ask: "What does 'AI · unconfirmed' tell you?"
5. "Open HD-24817. Check what the AI suggested. Fix anything you disagree with and send the reply."
   - Watch: do they use **Why?**, the sources and **Confirm labels**?
   - After sending: "You're back in the queue. Is that what you expected?" (UX-4)
6. "Open HD-24805, then HD-24802."
   - Ask: "Was the summary on the first one useful? Did you miss one on the second?" (UX-2: the
     threshold is 125 words.)

**Wrap-up (about 1 min):**
- "Is there anything you'd trust less, or more, because the AI suggested it?"
- "What confused you most?"

## 3. Automated checks (Claude Code, 2026-10-31)

- **Build:** `npm run typecheck`, `npm run lint` and `npm run build` all pass (31 routes).
- **axe-core 4.10.2** (wcag2a/aa, 2.1 a/aa, 2.2 aa, best-practice), run on 28 URL and state
  combinations. Two violations were found and fixed on the first run:
  - **serious `target-size`:** the error-summary links on S1 were under 24 px.
  - **moderate `page-has-heading-one`:** the loading skeletons on S3 and S6 had no h1.

  Re-run after the fixes: 0 violations.
- **Manual pass in the browser (375 px, 768 px, 1280 px):**
  - S1 validation: focus moves to the first invalid field, and the error summary links to each field.
  - S1 → S2 flow.
  - S3 rating, then the "Thanks for your feedback" state.
  - S4 → S5 flow.
  - S6: override priority → "override logged" → Approve → the confirm dialog (focus starts on
    *Keep editing*) → back to S5 with the "Reply sent" toast.
  - S6 stacks to one column at 768 px.
- **Not done yet:** screen-reader testing with VoiceOver, and Playwright and axe in CI. Both are
  Phase 4/5 work (RAID R8).

## 4. Accessibility and spec review (`ux-accessibility-reviewer` subagent)

The subagent read the code against the spec and returned **5 Must-fix and 25 Should-fix** findings.
All 5 Must-fix items are fixed. Of the Should-fix items, 24 are fixed and 1 is recorded as a
deliberate deviation (§7). Re-checked afterwards: axe found 0 violations on 27 URLs, and focus
behaviour was checked in the browser.

| # | Screen | Finding | Fix |
| --- | --- | --- | --- |
| M1 | All customer screens | Tab title "· HelpDesk AI" and the meta description mentioned AI (breaks P5) | Customer titles are now "… · Larkfield Goods"; neutral description; S8 has its own title |
| M2 | S3 | After rating, focus dropped to the page body and the thanks message wasn't announced | Focus moves to the "Thanks for your feedback." heading |
| M3 | S5 | The long-ticket summary had no visible AI label | Visible "AI summary:" with an icon |
| M4 | S5 | Refresh removed the focused button | Focus moves to the Queue heading; Refresh now adds the new rows |
| M5 | S6 | AI label and confidence weren't linked to the Category/Priority selects, or the draft label to the editor | `aria-describedby` on both selects and on the reply editor |
| S | All | Static notes used `role="alert"`; errors could be announced twice | `role="note"` for static content; one live region per error |
| S | S5/S6 | "Confirmed (Amara)" didn't match §4 | "Confirmed by Amara" (spec S5 line aligned) |
| S | S1 | `disabled` on Submit dropped focus; `maxLength` silently cut text; empty email got the format message; no retry button; "under 120" wording | `aria-disabled` + submit guard; `maxLength` removed; "Please enter your email."; "Try again" button; "120 characters or fewer" |
| S | S2 | "Copied" showed even when the clipboard write failed | Shows "Couldn't copy. Select the link and copy it." instead |
| S | S3 | The rating radiogroup had no accessible name | `aria-labelledby` points to the question |
| S | S4 | Focus loss while loading; errors not linked to the fields; no skip link or header | `aria-disabled`; `aria-invalid`/`aria-describedby`; `name` attributes; skip link and header |
| S | S5 | "See replied tickets" lost focus | Focus moves to the active tab |
| S | S6 | Confirm button lost focus; Needs triage only showed High as a placeholder; no sentiment confidence; Show contact lost focus; HD-24820 had no draft; discard couldn't be undone; could send with unconfirmed labels; KB "not found" answer was labelled AI; edit-level wording | `aria-disabled`; High preselected with a "default" note; sentiment confidence shown; focus moves to the revealed contact; draft added; "Restore AI draft"; warning in the send dialog; label only shown when a source is cited; per-level wording |
| S | S7 | 403 only via the prototype bar; chart labels hidden from screen readers | 403 also for the agent role; only the bar shapes are hidden |
| S | S8 | Unmatched `/prototype/*` URLs got Next's 404; no generic error page | Catch-all route calls `notFound()`; `error.tsx` with the same calm copy and a retry |
| Nit | Index | HD-24805 described as 136 words (`wordCount` gives 135) | Corrected |

**Where Claude Code's first build was wrong:** all of the above. These issues shipped in the first
pass and the axe run didn't catch them. Focus loss after a component unmounts was the most common
problem (5 places).

## 5. Human reviews

_Paste notes here after each session. Keep quotes verbatim where you can._

### Reviewer 1
- Who / role: _(to fill)_
- Date: 2026-10-31 · unmoderated (written reply to the [reviewer brief](reviewer-brief.md), hosted link)
- Task results (completed? where did they hesitate?):
  - Tasks 1–3: completed, "Not slowed down". Didn't use the private link: "had no reason to".
  - Task 4: would pick the Urgent ticket "as it stuck out". Didn't say what "AI · unconfirmed" means.
  - Task 5: opened **Why?** and the sources. Landing back on the queue "was expected" (supports UX-4).
  - Task 6: "Summary was useful and missed on the second one" (HD-24802, 111 words, no summary).
- Quotes:
  - "The response was wrong as it talked about sending a different color rather than addressing my
    concern on double charge."
  - "Screen (as an agent) was busy."
  - "As an agent, probably the screen could be a bit more intuitive."
  - Trust: "No" (nothing trusted more or less because the AI suggested it).
- Issues seen:
  1. **Task 3 showed someone else's reply.** Cause: a flaw in the review script, not the design.
     Task 3 links to HD-24790 ("Wrong colour sent", customer Aisha), which has nothing to do with the
     double-charge ticket the reviewer submitted in task 1. Claude Code wrote the script and missed
     this. Still useful: a customer assumes the reply on their status page answers *their* ticket.
  2. **S6 ticket detail feels busy** to an agent. No specific element named; needs a follow-up.
  3. **UX-2 summary threshold (125 words) may be too high:** the summary was missed on a 111-word
     ticket.
  4. The meaning of "AI · unconfirmed" wasn't answered, so P3 (AI visible) is untested here.

### Reviewer 2
- Who / role:
- Date:
- Task results:
- Quotes:
- Issues seen:

## 6. Changes from feedback

| # | Feedback | Source | Change | Status |
| --- | --- | --- | --- | --- |
| F1 | Task 3 reply didn't match the reviewer's ticket | R1 | Add a replied double-charge sample (follow-on to HD-24817) and point task 3 at it, so tasks 1–3 tell one story | Done 2026-10-31: new status page `/prototype/t/Rf7mWc3kTy9J`; brief and script updated; redeployed |
| F2 | Agent ticket screen (S6) is busy | R1 | Wait for Reviewer 2 and ask what felt busy. Candidates: collapse Ask the KB and Why? by default, move contact and sentiment below the fold | Proposed |
| F3 | Summary missed on a 111-word ticket | R1 | Consider lowering the UX-2 threshold (for example to 100 words). Decide after Reviewer 2 | Proposed |

## 7. Notes and deviations from the spec

- **Team-lead demo account:** it's `priya@larkfield.example`, not `lead@…` as first planned.
  Priya is the lead persona.
- **New-ticket notices (UX-3):** the "new tickets" and "new urgent ticket" notices appear 2.5 s after
  load when chosen in the prototype bar. That stands in for the 30 s check.
- **Dashboard 403:** shown for the agent role (the default before signing in) and through the
  prototype bar ("Agent (403)"). To see the dashboard, sign in as `priya@larkfield.example`.
- **Description counter (S1):** the spec says the counter is "announced politely". The prototype
  announces it only within 200 characters of the limit, because announcing every keystroke drowns
  out what the user is typing. The visible counter always updates, and it's read when the field is
  focused. To be confirmed at Gate 2.
- **Sending with unconfirmed labels (S6):** allowed. The send dialog warns that sending confirms the
  labels as they are, and that's logged. Check this against US-06 in Phase 4.
- **Dashboard charts:** plain CSS bars at low fidelity; the chart library is a Phase 4 decision.
  The figures are sample data (assumed).
