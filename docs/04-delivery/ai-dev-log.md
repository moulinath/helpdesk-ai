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
