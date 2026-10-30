# Start here (for you, the human)

This folder is a starter kit. Once it's in place, Claude Code knows the whole plan, tracks its own
progress, and stops at each gate for your sign-off. You don't need the original chat.

## One-time setup (about 30 minutes)
1. Install: Node.js LTS, Git, GitHub CLI (`gh auth login`), and Claude Code.
2. Create accounts: GitHub, Anthropic Console (create an API key and set a monthly spend limit),
   Vercel, and Neon or Supabase (free tiers are fine).
3. Put this folder where you keep projects and rename it `helpdesk-ai`.
4. Copy `.env.example` to `.env.local` and paste your `ANTHROPIC_API_KEY`. (Claude Code is blocked from
   reading `.env` files by `.claude/settings.json`.)
5. Open a terminal in the folder and run `claude`.

## Your first message to Claude Code
> Read CLAUDE.md, PLAYBOOK.md and PROGRESS.md. Then /next.

## Every session after that
- Start: `claude` in the folder, then `/next` (or `/status` if you've been away).
- During: approve or adjust plans; review PRs and the Vercel preview before merging.
- End: say "wrap up" or run `/log`. This keeps PROGRESS.md current so the next session picks up cold.

## Commands
| Command | What it does |
| --- | --- |
| `/next` | Works out and proposes the next step |
| `/story US-03` | Builds one user story on its own branch, with tests and a PR |
| `/review` | Fresh subagent reviews the current diff |
| `/gate` | Prepares the gate sign-off pack, then waits for you |
| `/log` | Updates the AI dev log and PROGRESS.md |
| `/eval` | Runs the AI triage evaluation |
| `/status` | Plain-English progress summary |

## Things only you can do
- Answer the BA interview in Phase 1 as the product owner.
- Sign off each gate.
- Get 2 people for the prototype check and 4–6 for UAT.
- Take plan-mode screenshots (3+ phases) and record two short sprint demos.
- Merge PRs.

## If something feels off
- Claude Code skipped a gate: "Stop. Check PROGRESS.md; Gate N isn't signed."
- Context getting long: run `/log`, then start a fresh session with `/next`.
- Hook too slow: remove the `PostToolUse` block from `.claude/settings.json`.
