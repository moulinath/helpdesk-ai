# ADR 0003 — AI model: `claude-haiku-5-5`

- **Status:** Proposed (Gate 3)
- **Date:** 2026-10-31

## Context
Each ticket needs one AI call: category, priority, sentiment with confidences, a reason, a summary
for long tickets, and a short FAQ-grounded draft. Agents may also ask the FAQ questions (US-11).
Constraints: ≤ $5/month (NFR-12), p95 < 5 s (NFR-03), 0 urgent tickets missed in the eval (NFR-16).
The charter names `claude-haiku-5-5` for triage and asks for the choice to be recorded here.

## Options
| Option | Price per M tokens (in / out) | For | Against |
| --- | --- | --- | --- |
| **Claude Haiku 5.5** (`claude-haiku-5-5`) | $0.10 / $0.50 | Built for high-volume classification; ~$0.53 per 1,000 typical tickets, ~$1.38 worst case (architecture §8); fast | Smaller model: draft quality and urgent recall must be proven by the eval |
| Claude Sonnet 5.5 (`claude-sonnet-5-5`) | $2 / $10 | Stronger reasoning and writing | ~20× the cost (~$10.60 per 1,000 tickets): the $5 cap covers only ~470 tickets |
| Haiku for triage, Sonnet for drafts | mixed | Better drafts | Two calls per ticket, more latency, more failure paths, ~10× cost |

Prices are Anthropic's list prices for prompts up to 100K tokens, as given in the Claude API reference
on 2026-10-31 (assumed until re-checked on the pricing page when the key is created).

## Decision
`claude-haiku-5-5` for triage, drafts and Ask the KB, with structured output (`messages.parse` +
Zod), `effort: "low"`, thinking disabled and `max_tokens: 1024` to start. No prompt caching in the
MVP: at demo volume nearly every call would be a cache write, which costs more. The model ID lives
in one config constant and is written to every `Triage` and `AiCallLog` row.

## Consequences
- Cost sits far under the cap at demo volume. A daily **dollar** cap from `AiCallLog.costUsd`
  ($0.15/day, triage and KB together) and the Console spend limit guard against abuse.
- `/eval` and development use a separate API key or workspace with its own limit.
- **Re-check after `/eval` (Phase 5):** if urgent recall or accuracy misses NFR-16, first raise
  effort, then add thinking, then consider Sonnet 5.5 for drafts only. Any change is a new ADR.
- Haiku 5.5 has safety classifiers with no server-side fallback: a refusal is a failed attempt; two
  refusals end in "Needs triage" flagged `review_now` and sorted with Urgent, because safety tickets
  are the likeliest to be refused.
- Its tokenizer counts ~30% more tokens than older models (Anthropic migration notes); the assumed
  token counts include that and are measured in `/eval`.
