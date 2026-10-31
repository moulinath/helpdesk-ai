# Non-functional requirements

Sources:
- **PB** = `PLAYBOOK.md`
- **CH** = `CLAUDE.md` charter
- **INT** = [BA interview](interview-notes.md)
- **assumed** = proposed by the BA, not measured or required by the product owner

| ID | Category | Requirement | Measure / target | How it's verified | Source |
| --- | --- | --- | --- | --- | --- |
| NFR-01 | Performance | Ticket submission responds quickly | Server response < 1 s (p95) | Load script, Phase 5 | PB |
| NFR-02 | Performance | Customer sees confirmation fast, whatever the AI is doing | Reference number shown < 3 s after submit | Playwright timing + load script | INT, PB |
| NFR-03 | Performance | AI triage completes quickly | p95 < 5 s per ticket | AI call logs, `/eval` run | PB |
| NFR-04 | Resilience | AI calls are time-boxed with a fallback | 10 s timeout, 1 retry, then "Needs triage"; 100% of failures end in a valid state | Vitest with a mocked slow/failing AI client | CH |
| NFR-05 | Data integrity | Every AI response is schema-validated before use or storage | 100% of AI outputs pass Zod validation or are discarded | Unit tests; validation-failure logs | CH |
| NFR-06 | Privacy | Only ticket subject and description go to the AI | 0 occurrences of name/email in AI payloads | Unit test on the payload builder; log review | CH, INT |
| NFR-07 | Security | Prompt-injection resistance | Injection cases in the eval set produce labels based on real content only | `/eval` + Vitest robustness tests | PB, INT |
| NFR-08 | Observability | Every AI call is logged; prompts are versioned files | Log has prompt version, model, latency, tokens, outcome for 100% of calls; released prompt files never edited | Unit test; code review | CH |
| NFR-09 | Security | Customer status links can't be guessed or enumerated | Token ≥ 128 bits of randomness (assumed); invalid links give a generic "not found" | Unit test; Playwright | CH, assumed |
| NFR-10 | Security | Agent and lead pages and APIs need sign-in; roles enforced; no known vulnerable dependencies | 100% of agent routes protected; 0 high/critical `npm audit` issues; OWASP checklist passed | Integration tests; `/review`; `npm audit` in CI | CH, PB |
| NFR-11 | Language | English-only MVP | Non-English tickets accepted and flagged for a human, with no AI draft | Eval set includes non-English tickets | INT |
| NFR-12 | Cost | AI spend stays within budget | ≤ $5/month; submission rate limit (5 per 10 min per IP, assumed); AI on/off switch | Console spend limit; integration test for switch and rate limit | INT, PB |
| NFR-13 | Accessibility | All screens meet WCAG 2.2 AA | 0 serious/critical axe violations; full keyboard and screen-reader use | axe-core in Playwright; manual keyboard check | CH, PB |
| NFR-14 | Safety | No AI content reaches a customer without agent approval | 0 paths that send unapproved content | Automated test across send paths; code review | CH, INT |
| NFR-15 | Data protection | Fictional data only; data minimised and retained for a limited time | Only necessary fields stored; 90-day retention policy documented (assumed) | Architecture review, Phase 3 | INT, assumed |
| NFR-16 | AI quality | Triage is accurate and never misses urgent tickets | ≥ 85% accuracy (category + priority, assumed); **0 urgent missed** (Gate 5 blocker) | `/eval` v1 and v2 | PB, INT |
| NFR-17 | Compatibility | Works on current browsers and phone-width screens | Latest 2 versions of Chrome, Safari, Firefox and Edge; 360 px width (assumed) | Playwright projects (Chromium, WebKit, Firefox) | assumed |

## Notes
- **NFR-16 reads together with the BRD counter-metric:** at least 90% of sampled approved replies are
  correct. Accuracy alone isn't treated as proof of value.
- **Thresholds set in Phase 3:** the edit-size thresholds (none / minor / major). Already agreed at UX
  review: confidence bands (UX-1, recalibrated after `/eval`) and the long-ticket summary threshold of
  100 words (UX-2; lowered from 125 after prototype review, 2026-10-31).
- **The public demo needs NFR-12 before it goes live** (release checklist, Phase 7).
