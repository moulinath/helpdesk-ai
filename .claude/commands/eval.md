---
description: Run the AI triage evaluation and record results
---
0. If `tests/fixtures/tickets.json` has fewer than 5 tickets marked `"author": "PM"`, remind the user to
   write about 5 of the trickiest tickets themselves (with the labels they expect) before relying on the
   results.
1. If `scripts/eval-triage.ts` does not exist, create it: run every ticket in `tests/fixtures/tickets.json`
   through the real triage service, compare against expected labels, and output overall and per-category
   accuracy, a confusion table, urgent-ticket recall, average latency and token cost. Report the
   PM-authored tickets separately as well as in the totals.
2. Run it (prompt version: $ARGUMENTS, default the latest).
3. Write results to `docs/05-testing/ai-eval-<prompt-version>.md`, with a comparison to any previous
   version's results.
4. Summarise for the user in 3–4 lines and suggest one prompt change if targets are missed.
