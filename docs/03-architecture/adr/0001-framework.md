# ADR 0001 — Framework: Next.js 16 App Router on Vercel

- **Status:** Proposed (Gate 3)
- **Date:** 2026-10-31

## Context
One developer and a 2-week target. The product has a public customer form and status page, a
signed-in agent workspace, a small dashboard and background AI work. The charter names Next.js,
TypeScript, Tailwind and shadcn/ui, and Phase 2 already scaffolded Next.js 16 with the prototypes.
Hosting must be free at demo volume.

## Options
| Option | For | Against |
| --- | --- | --- |
| **Next.js 16 App Router on Vercel** | One codebase for UI and server; Server Actions for forms; `after()` for work after the response; preview deploys per PR; already scaffolded | Fast-moving framework (Cache Components, `proxy.ts`); tied to Vercel's limits on function duration |
| Remix / React Router 7 | Clean form and loader model | Would discard the Phase 2 scaffold; no built-in "after response" hook on Vercel |
| Separate API (Express/Fastify) + React SPA | Clear split | Two deploys, CORS, double the plumbing for one developer |

## Decision
Next.js 16 App Router, TypeScript strict, deployed on Vercel. Server Components for reads, Server
Actions for every write, Route Handlers only for Auth.js and the cron job. `proxy.ts` guards agent
routes; every action checks the session again.

## Consequences
- The prototype scaffold carries straight into Phase 4.
- We follow Next.js 16 conventions from the bundled docs (`node_modules/next/dist/docs`), not memory:
  e.g. `useSearchParams` inside `<Suspense>`, `proxy.ts` instead of `middleware.ts`.
- Background triage depends on `after()` and the route's `maxDuration` (see ADR 0004).
- Moving off Vercel later means replacing preview deploys and cron, not rewriting the app.
