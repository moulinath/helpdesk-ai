# Decision log

Where the delivery manager rejected or changed something Claude Code proposed. Claude Code adds a row
whenever that happens, without being asked (CLAUDE.md, "My role"). Decisions where the user accepted the
proposal as it stood are in the gate files and the dev log, not here.

Rows dated before 2026-11-01 were **back-filled on 2026-11-01** from `ai-dev-log.md`, which recorded
them at the time. Where the dev log didn't record the reason, the "Why" column says so rather than
guessing.

| Date | Phase | What Claude proposed | What I decided | Why |
| --- | --- | --- | --- | --- |
| 2026-10-30 | 1 Requirements | Persona names as first drafted | More ethnically diverse persona names | Not recorded at the time (back-filled) |
| 2026-10-30 | 1 Requirements | A lower new-agent time target (figure not recorded) | Raised it to ~2 minutes | Not recorded at the time (back-filled) |
| 2026-10-30 | 1 Requirements | A lower draft-approval target (figure not recorded) | Raised it to ≥ 85% | Not recorded at the time (back-filled) |
| 2026-10-30 | 1 Requirements | Quality counter-metric: ≥ 95% of sampled approved replies correct | Lowered it to ≥ 90% | Not recorded at the time (back-filled) |
| 2026-10-30 | 1 Requirements | US-10 (customer rates reply) at a lower priority | Promoted it to Should | Not recorded at the time (back-filled) |
| 2026-10-30 | 2 UX design | Summarise tickets longer than ~150 words | 125 words (lowered again to 100 after prototype review F3) | Not recorded at the time (back-filled) |
| 2026-10-30 | 2 UX design | Customer rating as Yes/No ("helpful / not helpful") | 1–5 CSAT | Not recorded at the time (back-filled) |
