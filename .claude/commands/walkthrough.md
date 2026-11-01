---
description: Explain the build so far as a 5-minute client presentation, then check the PM's understanding
---
The user is the delivery manager, not an engineer. Help them present the project confidently.

1. Read `docs/04-delivery/PROGRESS.md`, `docs/03-architecture/architecture.md`, the merged PRs
   (`gh pr list --state merged`) and the code that's actually on `main`. Describe only what's built and
   merged; say clearly what's planned but not built yet.
2. Write a walkthrough the user could present to a client in about 5 minutes (roughly 600–750 words),
   in plain English with no jargon, or with each technical term explained in a few words. Cover:
   - **What it does:** the customer's journey and the agent's journey, as they work today.
   - **How the AI part works:** what goes to the model, what comes back, and what a person still
     decides.
   - **How it's kept safe:** human approval, what data never reaches the AI, validation, fallbacks,
     rate limits, cost caps, sign-in. Only claim what's built; label the rest "planned".
   - **The key trade-offs:** 3–4 choices made, what was given up for each, and why.
3. Ask exactly 3 questions that check understanding rather than recall, for example "What happens if
   the AI is down when a customer submits?" or "Why does the dashboard show time to triage?". Ask them
   one message, then wait.
4. When the user answers, give short, kind feedback on each answer: what's right, and what's missing or
   wrong. Then append to `docs/04-delivery/walkthroughs.md`: the date, the build state (last merged
   PR), the 3 questions, the user's answers word for word, and your feedback.
5. Don't change any other file.
