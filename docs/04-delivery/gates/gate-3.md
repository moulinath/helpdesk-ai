# Gate 3 — Architecture

Prepared by Claude Code on 2026-10-31. Criteria from `PLAYBOOK.md` (Phase 3): "architecture and ADRs
reviewed; reviewer findings resolved or accepted", plus the four Phase 3 steps.

| Criterion | Evidence | Status |
| --- | --- | --- |
| Component diagram (Mermaid) | [architecture.md](../../03-architecture/architecture.md) §2 | Met |
| Data model incl. `Ticket`, `Triage` (category, priority, sentiment, draft, confidence, promptVersion, model, latencyMs), `Reply` (body, sentBy, aiDraftEdited), `Agent`, `Feedback` | §3 + ER diagram. `latencyMs` lives on `AiCallLog` per attempt (plus `triageCompletedAt`); `aiDraftEdited` is the richer `editLevel` | Met (2 fields reshaped, explained) |
| API routes | §5: Server Actions and Route Handlers, who can call each, input, effect | Met |
| AI integration: structured output, Zod, 10 s timeout, one retry, fallback | §6.1–6.3, sequence diagram §4.2 | Met |
| Security and privacy controls | §7: auth, hashed tokens, redaction, telemetry scrubbing, headers, retention | Met |
| Cost estimate per 1,000 tickets | §8: ≈ $0.53 typical, ≈ $1.38 worst case; daily $0.15 cap keeps the worst month ≈ $4.50 | Met (figures assumed until `/eval`) |
| 5 ADRs: framework; database + ORM; AI model; sync vs async triage; auth | [adr/0001–0005](../../03-architecture/adr/) | Met |
| `architecture-reviewer` run; findings fixed or accepted | [architecture-review.md](../../03-architecture/architecture-review.md): 5 Must + 11 Should fixed in v0.2; 8 Consider fixed or accepted (RAID R18–R22) | Met |
| Mermaid renders | All 4 diagrams parse with Mermaid 11.4.1 | Met (check on GitHub too) |
| Every Must story and NFR traced | §9 | Met |

## Decisions for you in this gate
1. **Urgent safety net (§11 Q1).** Add a keyword check (charges, safety, account access) that flags
   "check priority" when the AI says Normal? It never changes the priority itself. Recommended: yes.
   It's new behaviour, so it changes US-05's scope slightly.
2. **Edit-level threshold (§11 Q2):** 20% character edit distance between "minor" and "major". Assumed;
   checked at UAT. Recommended: accept.
3. **Dashboard metric (§11 Q3):** replace "time to acknowledgement" (always ~0 by design) with
   "time to triage". Changes the wording of US-08 AC3. Recommended: yes.

## Changes from earlier decisions
- The confirmation page (S2) is served at `/t/{token}?new=1`, so the token is never stored. It looks
  the same as the UX spec; only the URL changes.
- Customer status "In progress" appears when an agent opens the ticket, not when the AI finishes.
- Sending a reply needs a category and priority set (by the AI or the agent).

## Risks if approved
- R18 one abuser can use up the day's AI budget (AI off for everyone until midnight UTC).
- R19 public demo credentials expose every (fictional) ticket.
- R20 cold starts may break NFR-01's 1 s p95.
- R21 status-link paths in Vercel's own request logs.
- R22 a killed triage isn't retried (lands in "Needs triage").
- R23 Auth.js v5 compatibility with Next.js 16, checked at the start of US-12.
- All cost and token figures are assumed until `/eval` and the pricing page confirm them.

## Decision
Decision: _(for the user: approve / approve with risks / reject, with date, plus answers to 1–3)_

## On approval, Claude Code will
1. Record your answers in `architecture.md` §11 and update US-05 / US-08 if you said yes.
2. Mark the ADRs Accepted, Gate 3 signed in `PROGRESS.md`, move to Phase 4 (Sprint 1), and add a
   dev-log entry.
