# AI development log

One entry per Claude Code session, newest at the bottom. This is the main evidence of how AI was used
and governed. Claude Code appends entries via `/log`; the user can edit them.

## Template
### YYYY-MM-DD · Phase N · short title
- **Asked:** what the user asked for
- **Produced:** files, PRs, decisions proposed
- **Human changes / corrections:** what the user changed and why
- **What went wrong:** AI mistakes, dead ends, how they were caught
- **Standup:** one line — done / next / blocked

---

### 2026-10-30 · Phase 0 · Project charter and playbook
- **Asked:** plan an AI-engineered portfolio project covering the full delivery lifecycle.
- **Produced:** product concept (HelpDesk AI), stack, 8-phase playbook with gates, CLAUDE.md, slash
  commands, review subagents, hooks.
- **Human changes / corrections:** user chose the domain (support triage), stack (Next.js + TypeScript),
  AI in the product as well as in the build, and a delivery-manager framing.
- **What went wrong:** n/a
- **Standup:** done planning / next: Phase 0 setup in Claude Code / blocked: none

### 2026-10-30 · Phase 0 · Git, private repo, key deferral
- **Asked:** read the charter, playbook and progress; make the repo private; run `/next`.
- **Produced:** plan (approved) for the rest of Phase 0; `git init` on `main`; checked `.env.local` is
  git-ignored before the first commit; initial commit; private repo
  [moulinath/helpdesk-ai](https://github.com/moulinath/helpdesk-ai) created and pushed; RAID log updated
  (R7, A1, I1, D1) for the deferred Anthropic API key; Gate 0 pack.
- **Human changes / corrections:** user chose a private repo, and deferred the Anthropic API key to
  Phase 4 because of a payment issue. Prerequisites were checked by the user, not by Claude Code.
- **What went wrong:** one combined shell read was blocked by the permission classifier because it
  counted lines in `.env.local` (the key file Claude Code must not read). Re-ran without touching it.
  Also noticed `PROGRESS.md` lists "CI skeleton" for Gate 0 while the playbook puts CI in Phase 4;
  flagged in the gate pack for the user to decide.
- **Standup:** done Phase 0 setup / next: Gate 0 sign-off, then Phase 1 BA interview / blocked: none
  (API key needed only from Phase 4)

### 2026-10-30 · Phase 0 · Gate 0 signed
- **Asked:** sign off Gate 0.
- **Produced:** recorded the decision in `gates/gate-0.md`; added R8 (no CI until Phase 4, accepted);
  moved `PROGRESS.md` to Phase 1.
- **Human changes / corrections:** user approved with risks and accepted deferring both the API key and
  the CI skeleton to Phase 4.
- **What went wrong:** n/a
- **Standup:** done Gate 0 / next: Phase 1 BA interview / blocked: none

### 2026-10-30 · Phase 1 · BA interview, requirements, Gate 1 signed
- **Asked:** run the BA interview; write the BRD, personas, user stories and NFRs; prepare Gate 1.
- **Produced:** `interview-notes.md` (12 questions, with follow-ups), `BRD.md`, `personas.md`,
  `user-stories.md` (12 stories, 54 acceptance criteria), `nfrs.md` (17 NFRs), `gates/gate-1.md`; RAID
  A2–A5, R9–R13; scope and sprint lists updated in `CLAUDE.md` and `PLAYBOOK.md` after sign-off.
- **Human changes / corrections:**
  - **Background:** user accepted the BA's assumed figures for operation size and pain points; the BA
    nudged the user to give their own answers on goals and AI boundaries.
  - **Answers in the user's own words:** goals; product-feedback category; long-ticket summaries;
    "AI must not raise or lower priority"; $5 cap; 2-week target; UX/CX worry; the no-go rule.
  - **Targets:** user raised the new-agent time to ~2 min and draft approval to ≥ 85%, and lowered the
    proposed quality counter-metric from 95% to 90%.
  - **Changes the user asked for:** more ethnically diverse persona names; a chatbot (narrowed to an
    agent-only "Ask the KB" as a Could after BA pushback); US-10 promoted to Should.
- **What went wrong / caught:**
  - The user's "AI must not raise priority" conflicted with the priority-sorted queue. The BA surfaced
    the conflict and the user chose "AI sets the initial priority only".
  - The original backlog had no story for agent auth, although the charter has it in scope. Added US-12.
  - A traceability row first pointed US-01's rate limit at the wrong NFR; fixed before commit.
- **Standup:** done Phase 1 + Gate 1 / next: Phase 2 UX spec / blocked: none (book prototype
  reviewers; API key needed ~day 5–6)

### 2026-10-30 · Phase 2 · UX spec and UX decisions
- **Asked:** plan and write the UX spec; then go through the open UX questions one at a time; wrap up.
- **Produced:** `docs/02-design/ux-spec.md`:
  - 5 testable CX principles and 4 Mermaid flows.
  - 8 screens (S1–S8), each with a low-fi wireframe and loading, empty and error states.
  - AI trust-cue table, microcopy, WCAG 2.2 AA notes, responsive rules.
  - §8 decisions UX-1 to UX-7.

  Carried the decisions into `user-stories.md` (US-03, US-08, US-10), `BRD.md` and `nfrs.md`.
- **Human changes / corrections:**
  - Summary threshold set to 125 words (BA proposed ~150).
  - Rating changed to 1–5 CSAT over the BA's recommended Yes/No. US-10 AC1/AC3 and US-08 AC3 updated
    and annotated as a post-Gate-1 change.
  - Chose back-to-queue after sending, with a wellbeing rationale ("agents need at least a split-second
    to recoup").
  - Accepted: hybrid queue refresh, logged contact reveal, defaults plus light brand, the confidence
    bands.
- **What went wrong / caught:**
  - The BA suggested "Northwind" as the fictional brand. That's Microsoft's well-known sample company,
    so the BA corrected itself and replaced it with "Larkfield Goods".
  - The first pass of decision edits left a stale "helpful / not helpful" label in a flow diagram and
    "~150 words" in three requirements docs. Caught by a grep and fixed.
  - The NFR threshold note was garbled by a sed replacement and tidied in a follow-up commit.
  - Mermaid rendering on GitHub not yet visually checked.
- **Standup:** done UX spec + decisions / next: plan Next.js scaffold + clickable prototypes / blocked:
  none (prototype reviewers still to book)

### 2026-10-31 · Phase 2 · Next.js scaffold and clickable prototypes (S1–S8)
- **Asked:** `/next`, which meant planning and building Phase 2 step 3: scaffold the app and build
  low-fi prototypes of S1–S8, then check them with the `ux-accessibility-reviewer` subagent.
- **Produced:** branch `phase-2/prototype` (PR to `main`):
  - The app: Next.js 16.4 (App Router, Cache Components) with TypeScript strict plus
    `noUncheckedIndexedAccess`, Tailwind v4, ESLint and shadcn/ui (Radix, Nova). There's a
    `typecheck` script, and the edit hook now runs it.
  - Clickable prototypes at `/prototype/*`:
    - Each screen's loading, empty and error states are switched with `?state=`.
    - Sample tickets at 111 and 135 words test the UX-2 summary threshold.
    - The flows covered are override → confirm → approve → back to the queue with a toast,
      CSAT rating, and a role-based 403.
  - `docs/02-design/prototype-feedback.md`: how to run it, a 10-minute review script, the automated
    and subagent results, and empty sections for the 2 human reviews.
  - RAID: R14 (remove the prototype before release) and D4 (prototype reviewers).
  - UX spec: the teal contrast ratio was measured at 5.47:1.
- **Human changes / corrections:** the plan was approved as proposed; no corrections this session.
- **What went wrong / caught:**
  - **Next.js 16 surprises:** the bundled docs showed that Cache Components disables
    `dynamicParams` and requires Suspense around `useSearchParams`. I read the docs before writing
    any pages, so this didn't cause rework. The shadcn CLI also needed a preset flag to run without
    prompts.
  - **Lint caught one issue:** I had written to a ref during render in S1. Replaced it with an id
    lookup.
  - **axe found 2 issues, both fixed:** the S1 error-summary links were under 24 px (serious), and
    the loading skeletons had no h1.
  - **The subagent found much more than axe.** It returned 5 Must-fix and 25 Should-fix items that
    were all my mistakes:
    - AI wording leaked into customer tab titles, breaking P5.
    - Focus was lost when controls unmounted, in 5 places.
    - AI labels weren't linked to their selects for screen readers.
    - The queue summary had no visible AI label.
    - Smaller issues: microcopy, `maxLength` cutting text, and sample-data inconsistencies.

    I fixed all the Must-fix items and 24 of the Should-fix ones; the 25th, about the description
    counter, is logged as a deviation. Lesson: an automated a11y scan passing doesn't mean the spec
    is met.
  - **Tests:** there are no Vitest or Playwright tests yet, since the prototypes are throwaway (R8).
    I haven't done a VoiceOver pass either.
- **Standup:** done scaffold + S1–S8 prototypes + a11y review / next: user runs 2 prototype reviews,
  then apply feedback and `/gate` / blocked: reviewers not yet booked

### 2026-10-31 · Phase 2 · Prototype reviews, feedback applied, Gate 2 signed
- **User asked:** how to run the reviews; then a shareable link, the exact message for reviewers and
  what to expect of them; then to record each review, apply the changes and prepare Gate 2.
- **Produced:**
  - Hosted prototype on a separate Vercel project (`helpdesk-ai-prototype`), with `.vercelignore`
    keeping `.env*` and `docs/` out of the upload, and `vercel.json` pinning the Next.js preset.
  - `docs/02-design/reviewer-brief.md`: the message to send, with direct links and 7 questions.
  - Both reviews in `prototype-feedback.md` §5; changes F1–F6 in §6, applied and redeployed.
  - Spec v1.1 (UX-2 lowered to 100 words; UX-8 to UX-11 added), BRD §7 and NFRs aligned.
  - `gates/gate-2.md`; RAID R15–R17 and I2 added, R14 updated, D4 closed.
- **Human changes / corrections:**
  - The user ran both reviews (an experienced online shopper and a support agent) and approved all
    proposed changes, the 2 deviations and Gate 2 with risks.
  - An earlier "review" reply ("I would need interactive browser control") looked like it came from
    an AI tool; I said it couldn't count as a human review, and the user found real reviewers.
- **What went wrong / caught:**
  - **My review script had a broken story.** Task 3 linked to an unrelated "wrong colour" ticket, so
    Reviewer 1 thought the reply was wrong. Fixed (F1) before Reviewer 2.
  - **My "Copy link" copied a made-up address** (`support.larkfieldgoods.example`), so Reviewer 2's
    pasted link opened an empty page. Fixed (F4).
  - **My first rewrite of the dashboard 403 note was wrong** (it said the dashboard opens without
    signing in). I checked `role.ts` before committing and corrected it.
  - **First Vercel deploy failed:** the new project had no framework preset. Fixed with `vercel.json`.
  - `vercel link` wrote a `VERCEL_OIDC_TOKEN` into `.env.local` (gitignored; not read). Reported to
    the user.
  - A summary I wrote for HD-24802 was 27 words against the 25-word rule; trimmed to 22.
  - I didn't type a password into the public site, so the agent sign-in on the hosted copy wasn't
    exercised by me; the user was asked to try it once.
  - Checks: typecheck, lint, build pass; axe 0 violations on the 8 changed pages (live). Still no
    VoiceOver pass (R17) and no Vitest/Playwright (R8).
- **Standup:** done reviews + F1–F6 + Gate 2 / next: merge PR #1, delete the review Vercel project,
  then Phase 3 architecture / blocked: nothing

### 2026-10-31 · Phase 3 · Architecture, 5 ADRs, independent review
- **User asked:** `/next` → Phase 3; approved the plan as proposed.
- **Produced:** `docs/03-architecture/architecture.md` v0.2 (components, data model, lifecycle,
  AI integration, security and privacy, cost per 1,000 tickets, traceability, test seams);
  ADRs 0001–0005; `architecture-review.md`; RAID R18–R23; BRD and user stories aligned with the
  Gate 2 decisions (UX-2 100 words, UX-8 wording) and the new thresholds.
- **Human changes / corrections:** none yet; 3 open questions in §11 go to the user at Gate 3.
- **What went wrong / caught:**
  - **The `architecture-reviewer` subagent found 5 Must-fix and 11 Should-fix gaps in my v0.1**, all
    real. Worst: my sequence put `redirect()` before `after()`; since `redirect()` throws, triage
    would never have run (M1). My "$5 at the very worst" cost claim ignored long tickets and was off
    by ~20% (M4). I also hadn't covered customers signing tickets with their own name (M5), tokens
    leaking into telemetry (M3), or a late AI result overwriting an agent's labels (M2).
  - The reviewer was partly wrong once: it doubted the prompt prefix was long enough to cache; the
    API reference gives 512 tokens as Haiku 5.5's minimum. Caching was dropped anyway (costs more at
    demo volume).
  - I looked prices up in the Claude API reference rather than quoting from memory; they're still
    labelled "assumed" until checked on the pricing page when the key exists. Vendor claims about
    Supabase and Vercel cron limits are labelled assumed too.
  - All 4 Mermaid diagrams parse (Mermaid 11.4.1).
- **Standup:** done architecture + ADRs + review / next: user decides Gate 3 and the 3 open
  questions / blocked: Gate 3 sign-off

### 2026-10-31 · Phase 3 · Gate 3 signed
- **User asked:** "Gate 3: approve", with answers to the 3 open questions: yes to the urgent keyword
  safety net, accept the 20% edit threshold, yes to "time to triage". Move to Phase 4.
- **Produced:** gate-3.md decision filled in; architecture v1.0 §11 rewritten as decisions, §6.3 gains
  the `check_priority` row; US-05 AC6 added; US-08 AC3 and ux-spec S5/S7 reworded; ADRs 0001–0005
  marked Accepted; RAID R18 wording; PROGRESS moved to Phase 4 Sprint 1.
- **Human changes / corrections:** the user accepted all 3 recommendations as proposed. That widens
  US-05 (a new AC) after Gate 1's scope freeze, with their explicit approval here.
- **What went wrong / caught:** nothing new. Noted for Phase 4: the "Check priority" flag doesn't change
  the sort, so a flagged Normal ticket still sits low in the queue; if UAT shows agents miss it, sorting
  flagged tickets with High is a candidate change (needs the user's call).
- **Standup:** done Gate 3 / next: merge PR #2, sprint plan, CI / blocked: nothing

### 2026-10-31 · Phase 4 · Sprint plan
- **User asked:** `/next` → the sprint plan; approved the plan as proposed. Mid-turn: "repo can be
  public with any required scan etc".
- **Produced:** `docs/04-delivery/sprint-plan.md` (Sprint 1 order: CI, US-12, US-01, US-02, US-09,
  US-03; Definition of Done; demo script; burndown; user dependencies); `retros.md` template;
  PROGRESS story board with branch names.
- **Human changes / corrections:** none to the plan. The user decided the repo goes public.
- **What went wrong / caught:** my plan said branch protection on private repos needs a paid plan
  and that GitHub Free gives ~2,000 private Actions minutes; both from memory, so labelled assumed.
- **Standup:** done sprint plan / next: secret scan, repo public, then item 0 Foundation + CI /
  blocked: nothing

### 2026-10-31 · Phase 4 · Repo made public
- **User asked:** make the repo public "with any required scan"; then, after my question about their
  email in commit history, "is there any issue with leaving the email id visible", and "yes" to
  leaving it and using the noreply address from now on.
- **Produced:** full-history gitleaks scan (31 commits, all refs: 11 hits, all the made-up status
  tokens in the prototype sample data; no real secrets; a regex check for Anthropic, GitHub, AWS,
  private-key, Postgres and Vercel token patterns found none). Repo set to public; GitHub secret
  scanning and push protection on; this repo's git email set to the GitHub noreply address; RAID R24.
- **What went wrong / caught:** I paused before going public to flag the email exposure instead of
  flipping visibility straight after the scan. My first sprint-plan and PROGRESS text said the repo
  was public before it was; correct now.
- **Standup:** done repo public / next: merge PR #3, then item 0 Foundation + CI / blocked: nothing
