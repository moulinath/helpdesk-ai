---
description: Prepare the sign-off pack for the current phase gate, then stop
---
1. Identify the current phase from `docs/04-delivery/PROGRESS.md` and its gate criteria in `PLAYBOOK.md`.
2. Check each criterion against what exists in the repo. Produce a short table: criterion, evidence (file
   path or link), met / not met.
3. Write it to `docs/04-delivery/gates/gate-<N>.md` with a "Decision" line left blank for the user.
4. Present the table to the user and ask: approve, approve with risks (log them in RAID), or reject.
5. STOP. Only when the user explicitly approves: fill in the decision with today's date, mark the gate
   signed in `PROGRESS.md`, move "Current phase" to the next phase, and add a dev-log entry.
