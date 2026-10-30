---
description: Implement one user story end to end on its own branch (e.g. /story US-03)
---
Implement user story $ARGUMENTS.

1. Read the story and its acceptance criteria in `docs/01-requirements/user-stories.md`, plus
   `docs/03-architecture/architecture.md` and CLAUDE.md.
2. Create a branch `feat/$ARGUMENTS-<short-slug>` from an up-to-date main.
3. Enter plan mode: list files to change, tests to write (unit + at least one Playwright test that maps to
   the acceptance criteria), and any risks. Wait for approval.
4. Build it. Run typecheck, lint, unit and e2e tests until green.
5. Run the `code-reviewer` subagent on the diff and fix its must-fix findings.
6. Commit with a clear message, push, and open a PR with `gh pr create` whose body lists: the story, the
   acceptance criteria and which test covers each, and anything the user should check on the preview URL.
7. Update the story board in `PROGRESS.md` and the traceability matrix if it exists.
8. Tell the user the PR link and what to check before merging. Do not merge yourself.
