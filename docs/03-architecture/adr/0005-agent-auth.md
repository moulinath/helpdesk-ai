# ADR 0005 — Agent auth: Auth.js Credentials with seeded accounts

- **Status:** Proposed (Gate 3)
- **Date:** 2026-10-31

## Context
Agents and the team lead sign in (US-12); customers never do: they use an unguessable link (US-02).
Reviewers of the public demo need ready-made accounts (US-12 AC5). Two roles: `agent` and `lead`
(only leads see the dashboard, US-08). The charter names Auth.js. No paid services.

## Options
| Option | For | Against |
| --- | --- | --- |
| **Auth.js v5, Credentials provider, seeded accounts** | Works with no email service; demo accounts are easy to hand out; role fits in the session | We own password storage and brute-force protection |
| Auth.js magic link (email) | No passwords | Needs an email provider and a real inbox per reviewer |
| Auth.js GitHub OAuth | No passwords, trusted provider | Reviewers need GitHub accounts; mapping GitHub users to roles needs an allow-list anyway |
| Hosted auth (Clerk, Auth0) | Feature-rich | Off-charter, another account, more data leaving the app |

## Decision
Auth.js v5 with the Credentials provider. Seed one agent and one lead; passwords hashed with
argon2id. JWT session cookie (HTTP-only, Secure, SameSite=Lax, 8 h) carrying `agentId` and `role`.
Sign-in rate-limited (5 tries per 15 min per IP + email) with a generic error message.
`requireAgent()` / `requireLead()` at the top of every agent page, Server Action and Route Handler;
they also look the agent up and reject inactive ones. `proxy.ts` redirects signed-out users as a
first check.

## Consequences
- No email or OAuth setup; reviewers get the demo credentials in the README.
- Credentials sign-in requires JWT sessions in Auth.js. Because `requireAgent()` checks the database,
  deactivating an agent takes effect on their next request, not after 8 hours.
- The demo passwords are public by design, so anyone can read every ticket and use Ask the KB within
  its limits. The demo holds fictional data only (BRD §8; RAID R19).
- Auth.js v5 must be checked for compatibility with Next.js 16 at the start of US-12 (RAID).
