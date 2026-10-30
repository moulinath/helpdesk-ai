# HelpDesk AI — Delivery Playbook

The step-by-step plan for this project. Claude Code: follow the phase named in
`docs/04-delivery/PROGRESS.md`. Each phase ends at a gate; prepare it with `/gate` and stop until the user
signs it off. Timings assume part-time work, about 4 weeks in total.

---

## Phase 0 — Setup (half a day)

**Goal:** a working repo where every later phase leaves evidence automatically.

1. Check prerequisites and tell the user what is missing: Node.js LTS, Git, GitHub CLI (`gh`) logged in,
   `.env.local` with `ANTHROPIC_API_KEY` (never print the key). Accounts the user creates themselves:
   GitHub, Anthropic Console (with a monthly spend limit), Vercel, Neon or Supabase.
2. `git init`, commit the starter kit, create the GitHub repo `helpdesk-ai` (ask the user: public or private).
3. Create `docs/04-delivery/RAID-log.md` with the starting risks below.
4. Create `.env.example` and a `.gitignore` that excludes `.env*` except `.env.example`.

Starting risks for the RAID log: scope creep; AI misclassifies an urgent ticket; API cost on a public demo;
code the user doesn't understand; over-claiming AI's role in the CV; customer data in prompts.

**Gate 0:** repo pushed, RAID log exists, prerequisites confirmed.

---

## Phase 1 — Business requirements (2–3 days)

**Role:** you are a senior business analyst; the user is the product owner. Challenge assumptions.

1. **Interview** the user one question at a time (10–12 questions): business problem, goals and KPIs,
   users, current pain points, scope in/out, constraints, risks, how AI should and should not be used.
   The fictional client is a mid-size online retailer. If the user wants baseline figures, suggest:
   agents spend ~4 min reading/routing each ticket; urgent issues share the queue with routine ones;
   customers wait hours for acknowledgement. Label all such figures "assumed".
2. Write `docs/01-requirements/BRD.md`.
3. Write `personas.md`: Sofia Martínez (customer), Daniel Kim (new agent, primary), Amara Okafor
   (experienced agent), Priya Shah (team lead), each with a current-vs-future journey. (Names changed
   at the PO's request in the BA interview, 2026-10-30.)
4. Write `user-stories.md`: INVEST stories, Given/When/Then acceptance criteria, MoSCoW priority.
   Starting backlog: US-01 to US-10 as listed in `PROGRESS.md`.
5. Write `nfrs.md`: triage p95 < 5 s; submit < 1 s; WCAG 2.2 AA; only ticket text sent to AI; AI output
   validated before saving; graceful fallback when AI is unavailable.

**Gate 1:** every story has acceptance criteria; MVP scope frozen; AI usage boundaries written down.

---

## Phase 2 — UX design (2 days)

1. Write `docs/02-design/ux-spec.md`: customer and agent user flows, screen-by-screen spec, empty /
   loading / error states, AI trust cues (label AI content "AI-suggested", show confidence, one-click
   override).
2. Screens: Submit ticket · Ticket status (customer) · Agent queue · Ticket detail (agent).
3. Scaffold the Next.js app now (TypeScript, Tailwind, shadcn/ui, ESLint) and build clickable low-fidelity
   prototypes with hardcoded data under `src/app/(prototype)`.
4. CX principles to record and later test: acknowledgement in < 3 s even if AI is slow; AI never sends
   without human approval; every AI label explained and reversible; keyboard and screen-reader usable.
5. Ask the user to show the prototype to 2 people (10 min each) and paste notes into
   `docs/02-design/prototype-feedback.md`. Apply the fixes.

**Gate 2:** UX spec approved, prototype feedback applied.

---

## Phase 3 — Architecture (1–2 days)

Use plan mode.

1. Write `docs/03-architecture/architecture.md`: component diagram (Mermaid), data model, API routes,
   AI integration design (structured output, Zod validation, 10 s timeout, one retry, fallback), security
   and privacy controls, cost estimate per 1,000 tickets.
2. Data model minimum: `Ticket`, `Triage` (category, priority, sentiment, draft, confidence,
   promptVersion, model, latencyMs), `Reply` (body, sentBy, aiDraftEdited), `Agent`, `Feedback`.
3. Write 5 ADRs in `docs/03-architecture/adr/`: framework; database + ORM; AI model choice;
   sync vs async triage; auth approach.
4. Run the `architecture-reviewer` subagent ("find the weaknesses"). Fix findings or log them in the RAID
   log as accepted risks.

**Gate 3:** architecture and ADRs reviewed; reviewer findings resolved or accepted.

---

## Phase 4 — Build (two sprints of about 4 days)

1. Write `docs/04-delivery/sprint-plan.md`:
   - Sprint 1: CI pipeline, US-01, US-02, US-03, US-09. Demo: a ticket is submitted, saved, triaged, or
     safely falls back.
   - Sprint 2: US-04, US-05, US-06, US-07, US-08 (US-10 if time). Demo: agent approves an AI draft,
     customer sees reply, lead sees dashboard.
2. **CI first:** `.github/workflows/ci.yml` running install, typecheck, lint, Vitest with coverage, Prisma
   migrate against a test database, Playwright against the built app, axe scan. Fail on any error.
3. Implement each story with `/story US-XX`.
4. AI feature: Anthropic TypeScript SDK with tool use / structured output forcing a JSON schema; a small
   FAQ file (`src/ai/faq.md`, 10–15 Q&As for a fictional retailer) as context for drafts. Create
   `tests/fixtures/tickets.json` with 25–30 sample tickets and expected labels (include urgent and tricky
   cases).
5. Delivery hygiene: one-line standup notes in the dev log, story-count burndown in `PROGRESS.md`, remind
   the user to record a 2-minute demo at the end of each sprint, write a short retro after each sprint in
   `docs/04-delivery/retros.md`.

**Gate 4:** both sprint demos done; all Must stories merged with green CI.

---

## Phase 5 — Testing (2–3 days, plus continuous CI)

1. Write `docs/05-testing/test-strategy.md`: test pyramid, traceability matrix (story → tests → PR),
   AI evaluation approach, entry/exit criteria for UAT.

| Test type | Tool | Exit target |
| --- | --- | --- |
| Unit | Vitest | 80% line coverage on `src/lib` and `src/ai` |
| Integration | Vitest + test Postgres | all API routes covered |
| End-to-end | Playwright | ≥ 1 test per story, all green |
| AI evaluation | `scripts/eval-triage.ts` | user sets accuracy target (e.g. 85%); zero urgent tickets missed |
| AI robustness | Vitest | prompt injection, empty/huge/abusive/non-English input → safe output or "Needs triage" |
| Accessibility | axe-core in Playwright | zero serious violations |
| Security | `npm audit`, `/review`, OWASP checklist | no high/critical open |
| Performance | simple load script | submit < 1 s, triage p95 < 5 s |

2. Build and run `/eval`. Then improve the prompt as `triage.v2.md`, re-run, and record v1 vs v2.
3. Log defects as GitHub Issues with severity labels; link fix PRs.
4. Write `docs/05-testing/test-summary.md`.

**Gate 5:** exit criteria met, or remaining gaps listed as accepted risks.

---

## Phase 6 — User acceptance testing (3–4 days elapsed)

1. Write `docs/06-uat/uat-plan.md`: objectives, participants (2–3 "customers", 2–3 "agents"),
   environment (staging/preview URL), 6–8 scenario scripts (e.g. urgent delivery complaint, override a
   wrong AI category, reply to an angry customer), success criteria, post-test survey (SUS + 3 open
   questions), defect triage process, consent to quote anonymised feedback.
2. The user runs 30-minute sessions and pastes raw notes into `docs/06-uat/raw/`. Ask agents:
   "Did you trust the AI draft? Why or why not?"
3. Write `docs/06-uat/uat-report.md`: task success per scenario, SUS score, top 5 issues by severity, AI
   trust findings, recommended fixes. Create a GitHub Issue per Must-fix.
4. Fix, ask the user to re-run failed scenarios, then draft `uat-signoff.md` for the user to approve.

**Gate 6:** the user records a go / no-go decision.

---

## Phase 7 — Release and portfolio packaging (2 days)

Release checklist:
- Production env vars in Vercel; API spend limit confirmed with the user
- Production migrations run; demo data seeded
- Demo agent login for reviewers; rate limit on ticket submission
- AI feature flag to disable triage if cost or errors spike
- Sentry + analytics live; GitHub release `v1.0.0` with notes
- `docs/04-delivery/runbook.md`: rollback, disabling AI

Portfolio package:
1. `README.md` as a case study for a delivery/engineering-manager audience: outcome first, problem,
   solution, live link, demo video, architecture diagram, stack, results, "How AI was used to build this",
   and an honest "Where AI needed human correction" section. Link every artifact in `docs/`.
2. `docs/portfolio/metrics.md`: stories delivered, test count and coverage, AI eval v1 vs v2, SUS score,
   time to first response before vs after (simulated), share of code by Claude Code vs edited by the user.
3. `docs/04-delivery/retrospective.md`: what AI accelerated, where it went wrong, governance added.
4. `docs/portfolio/cv-and-interview.md`: a CV line with real numbers filled in, and draft answers to:
   delegate-vs-keep-human; an example where Claude Code was wrong and how the process caught it; how AI
   quality was measured; scaling this to a team of 8; what to do differently.

**Final gate:** live URL works, README reviewed by the user, evidence checklist complete.

---

## Evidence checklist (keep ticking in PROGRESS.md)
- Plan-mode screenshots for ≥ 3 phases (remind the user to take them)
- AI dev log entry per session
- 5 ADRs
- Traceability matrix story → test → PR
- Green CI runs and preview links on PRs
- AI eval v1 and v2
- UAT report, SUS score, sign-off
- Demo video and live URL
- Retrospective
