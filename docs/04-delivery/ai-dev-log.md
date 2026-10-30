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
