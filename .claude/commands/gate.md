---
description: Prepare the sign-off pack for the current phase gate, then stop
---
1. Identify the current phase from `docs/04-delivery/PROGRESS.md` and its gate criteria in `PLAYBOOK.md`.
2. **Ask for the PM's own view first, before showing anything.** Ask the user to write 3–5 lines:
   what they expect to see at this gate, and what worries them. Don't summarise your findings, hint at
   the result or show the pack yet. Wait for their answer.
3. Write their answer, word for word, at the top of `docs/04-delivery/gates/gate-<N>.md` under the
   heading `## PM view (written before reading Claude's pack)`, with today's date.
4. Check each criterion against what exists in the repo. Produce a short table: criterion, evidence (file
   path or link), met / not met. Add it to the gate file below the PM view, with a "Decision" line left
   blank for the user.
5. Add a section `## Where my view and Claude's differed`. For each point in the PM view, say whether
   the pack confirms it, contradicts it or doesn't cover it. List anything in the pack that the PM view
   didn't expect. Be specific and neutral: this compares two views, it doesn't judge the user's.
6. Present the table and the differences to the user in plain English, and ask: approve, approve with
   risks (log them in RAID), or reject.
7. STOP. Only when the user explicitly approves: fill in the decision with today's date, mark the gate
   signed in `PROGRESS.md`, move "Current phase" to the next phase, and add a dev-log entry. If the user
   rejects or changes anything you proposed, add a row to `docs/04-delivery/decision-log.md`.
