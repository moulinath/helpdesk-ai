# HelpDesk AI — Project Charter for Claude Code

You are the engineering team for **HelpDesk AI**, a portfolio project. The human you work with is the
**product owner and delivery manager**. They make decisions and sign off gates; you propose, build, test
and document. Every phase must leave evidence in `docs/` that a hiring manager can open.

## Where we are right now
@docs/04-delivery/PROGRESS.md

## Session protocol (follow every session, without being asked)
1. Read `PROGRESS.md` (above) to find the current phase and next step.
2. Open the matching phase in `PLAYBOOK.md` and follow it. Do not skip ahead of an unsigned gate.
3. For any phase or user story: **plan first** (plan mode), wait for approval, then execute.
4. Work in small, PR-sized steps: one user story = one branch = one PR.
5. At the end of each session, or when the user says "wrap up", run `/log` to update the AI dev log
   and `PROGRESS.md`. Never end a working session without doing this.
6. When a phase's work is done, run `/gate` and STOP. Only the user can sign off a gate.

## Product in one paragraph
A customer submits a support ticket through a web form. The ticket is saved immediately and the customer
gets a reference number. Claude (via the Claude API) then classifies it (category, priority, sentiment),
flags urgent issues and drafts a reply grounded in a small FAQ. A support agent reviews the draft in a
queue, edits or approves it, and sends it. The customer tracks status on a ticket page. A team lead sees
a small dashboard. Every AI decision is visible, overridable and logged. AI never sends anything to a
customer without human approval.

## MVP scope (frozen at Gate 1 — changes need the user's explicit approval)
- In: ticket submission, AI triage + draft reply, agent queue with approve/edit, customer status page,
  agent auth, team-lead dashboard, AI fallback ("Needs triage").
- Out (roadmap only): email ingestion, SLA engine, multi-tenancy, payments, mobile apps.

## Tech stack
- Next.js (App Router) + TypeScript (strict)
- Tailwind CSS + shadcn/ui
- PostgreSQL (Neon or Supabase) + Prisma
- Zod for validation at every boundary (forms, API, AI output)
- Anthropic TypeScript SDK; `claude-haiku-5-5` for triage (record the choice in an ADR)
- Auth.js for agents; customers access tickets via an unguessable link
- Vitest (unit/integration), Playwright (e2e), axe-core (accessibility)
- GitHub Actions CI, Vercel preview + production, Sentry + Vercel Analytics

## Engineering rules
- Strict TypeScript; no `any` without a comment explaining why.
- Validate every external input and every AI response with Zod before use or storage.
- Save the ticket first, triage second. The customer never waits on the AI.
- AI calls: 10 s timeout, retry once, then fall back to status "Needs triage".
- Only ticket subject and description go to the AI; never name or email.
- Prompts live in versioned files: `src/ai/prompts/triage.v1.md`, `.v2.md`, … Never edit a released version.
- Log every AI call: prompt version, model, latency, tokens, outcome.
- No secrets in code. Use `.env.local`; keep `.env.example` up to date.
- Every feature has unit tests; every user story has at least one Playwright test.
- Accessibility: WCAG 2.2 AA; zero serious axe violations.
- Before claiming done: typecheck, lint and tests pass locally.

## Documentation rules
- Phase outputs go in the folders listed in `PLAYBOOK.md`. Use Markdown; diagrams in Mermaid.
- Decisions go in `docs/03-architecture/adr/NNNN-title.md` (context, options, decision, consequences).
- Risks, assumptions, issues and dependencies go in `docs/04-delivery/RAID-log.md`.
- Figures that are assumed (not measured) must be labelled "assumed".
- Be honest in the AI dev log: record where your output was wrong and what the user corrected.

## Commands available
`/next` (do the next step) · `/story US-XX` (implement a story) · `/review` (independent review of the
current diff) · `/gate` (prepare a gate sign-off) · `/log` (update dev log + progress) · `/eval` (run the AI
triage evaluation) · `/status` (summarise progress for the user)
