# BA interview notes

- **Date:** 2026-10-30
- **Interviewer:** Claude Code (acting as senior business analyst)
- **Interviewee:** the user (product owner)
- **Client:** fictional mid-size online retailer. All people and data are fictional.

How to read this:
- **PO** = the product owner's answer, kept close to verbatim.
- **Assumed** = a figure or answer suggested by the BA and accepted by the PO without their own data.
- **Challenge** = where the BA pushed back, and how it was resolved.

---

## Q1 · Business problem
- **PO:** "Highly manual process and dependent on individual knowledge/expertise level."
- **Follow-up (what does that cost?):** PO chose **slow onboarding**: know-how isn't written down, so new
  agents take weeks to become useful.
- **Challenge:** the MVP doesn't fix onboarding directly. The claim we can test is "a new agent produces
  acceptable replies sooner", helped by FAQ-grounded drafts and AI triage suggestions. PO agreed.

## Q2 · Size of the operation (assumed)
- About 300 tickets a day, 8 agents (about 2 new starters per quarter), 1 team lead.
- Channels: web form and email. **MVP covers the web form only.**
- **Derived:** about 37 tickets per agent per day, which at about 4 min to read and route each is roughly
  2.5 hrs per agent per day before any reply is written.
- **Note:** results describe the web-form share of tickets only. Don't over-claim.

## Q3 · Current process and pain points (assumed)
- Single first-in-first-out queue. About 4 min to read, categorise and judge urgency per ticket.
- Agents search old replies or ask a senior for the right answer.
- Urgent tickets (failed time-critical delivery, double charge) wait behind routine "where's my order"
  questions.
- No acknowledgement until an agent picks the ticket up, often hours later.
- **Hidden cost:** new starters' questions slow the senior agents down too.
- Two separate delays are measured separately: acknowledgement and first response.
- **BA note:** PO accepted the BA's suggestions for Q1 follow-up, Q2 and Q3. PO was encouraged to give
  their own answers on goals and AI boundaries, and did.

## Q4 · Goals
- **PO:**
  1. Faster acknowledgement and first response.
  2. Productivity of new agents improves.
  3. Better use of AI for retrieval from the existing knowledge base.
- **Challenge:** goal 3 described a means, not an outcome. Reworded and accepted as: *"Agents find the
  right, policy-consistent answer from the knowledge base in seconds."*
- **Challenge:** urgent-first handling wasn't among the goals. Agreed it's a **guardrail**, not a goal:
  *no urgent ticket is missed or deprioritised by the AI.*

## Q5 · KPIs
| Goal | KPI | Baseline | Target | Source of target | Measurable in this project? |
| --- | --- | --- | --- | --- | --- |
| 1 | Time to acknowledgement | ~3 hrs (assumed) | < 3 s | assumed | Measured: app logs |
| 1 | Time to first response | ~6 hrs (assumed) | < 1 hr | assumed | Simulated in UAT |
| 2 | Time for a new agent to handle a ticket | ~10 min (assumed) | **~2 min** | **PO** | UAT: new vs experienced agents |
| 2 | Weeks to full productivity | ~6 weeks (assumed) | ~3 weeks | assumed | Not measurable; expected outcome only |
| 3 | AI drafts approved with no or minor edits | n/a | **≥ 85%** | **PO** | Measured: edit tracking (US-06) |
| 3 | Triage accuracy (category + priority) | n/a | ≥ 85% | assumed | Measured: `/eval` |
| Guardrail | Urgent tickets missed by the AI | n/a | 0 | playbook | Measured: `/eval` |
| Counter-metric | Sampled approved replies that are correct and policy-consistent | n/a | **≥ 90%** | **PO** (BA proposed 95%) | Lead/PO review of a UAT + eval sample |

- **Challenge:** PO raised two targets (2 min, ≥ 85%). Both are stretch targets, and together they're what
  rubber-stamping would also look like (automation bias). Resolved by adding the counter-metric above.

## Q6 · Users
- **PO:** split agents into new and experienced. Knowledge base ownership is **out of MVP scope**. Use
  more ethnically diverse persona names.
- Personas (fictional):
  - **Sofia Martínez:** customer.
  - **Daniel Kim:** new agent, about 3 weeks in. Primary agent persona, for goal 2.
  - **Amara Okafor:** experienced agent. Secondary persona.
  - **Priya Shah:** team lead.
- The playbook's placeholder names (Priya, Arjun, Meera) were replaced.
- Logged: assumption that the FAQ is fixed and correct for the MVP; risk that an FAQ nobody owns goes
  stale (RAID A2, R9).

## Q7 · Categories and priority
- **Categories (7):** Delivery · Returns & refunds · Payment & billing · Product question ·
  **Product feedback** (added by PO) · Account & login · Other.
- **Boundaries:**
  - *Product question* = the customer wants an answer.
  - *Product feedback* = an opinion or suggestion, no action needed. Normal priority, thank-you draft,
    visible on the dashboard; passing it on to a product team is out of scope.
  - *A broken item with a remedy wanted* = Returns & refunds, or Urgent if it's a safety issue.
- **Priority (assumed definitions):**
  - **Urgent:** wrongful charge, product safety issue, delivery failure on a time-critical order,
    account compromise, legal or regulatory threat.
  - **High:** late beyond the promised date, damaged or wrong item, promised refund not received.
  - **Normal:** everything else.
- **Challenge, accepted:** sentiment doesn't drive priority. It's shown separately as a tone signal, so
  anger isn't rewarded with queue position.

## Q8 · Scope check
- **In (charter MVP, unchanged):** ticket submission · AI triage · FAQ-grounded draft · agent queue by
  priority with approve/edit · customer status page (unguessable link) · agent auth · team-lead dashboard
  · "Needs triage" fallback.
- **PO request:** add a chatbot (simple design).
- **Challenge:** a customer-facing chatbot breaks the charter rule "AI never sends anything to a customer
  without human approval", adds a public prompt-injection surface and API cost, and risks pushing out a
  Must story.
- **Decision (option b):**
  - **US-11 "Ask the knowledge base":** agent-facing only, **Could**, ranked below US-10. It answers
    from the FAQ only, cites the entry, and says "not in the knowledge base" instead of guessing.
  - Customer chatbot and customer-side suggested answers go to the roadmap.
- **Out (roadmap):** email intake · SLA engine · multiple tenants · payments · mobile apps · in-app FAQ
  editing · passing product feedback to a product team · customer chatbot · suggested answers on the
  submit form.
- The charter's scope list and story board are updated when scope is frozen at Gate 1.

## Q9 · What the AI should do
- Suggest category, priority and sentiment, with a confidence level and a one-line reason.
- Flag likely-urgent tickets.
- **Summarise long tickets (added by PO):**
  - Comes from the same triage call (no extra API call; part of US-03).
  - 25 words or fewer; shown only when the description is over about 150 words (assumed threshold).
  - Labelled AI-suggested. The full text is always visible.
  - The eval set includes long tickets with a critical detail buried in them.
- Draft replies grounded only in the FAQ, citing the entry used.
- Answer agents' questions from the FAQ (US-11, Could).
- Say "not sure" rather than guess; fall back to "Needs triage" when the AI can't run.

## Q10 · What the AI must never do
1. Send anything to a customer without an agent's approval.
2. Receive the customer's name or email: only the ticket subject and description go to the model.
3. Have its output used or saved without Zod validation; if validation fails, the ticket goes to
   "Needs triage".
4. Promise refunds, compensation, dates or exceptions the FAQ doesn't state.
5. **Change a priority after its initial suggestion (PO).**
   - **Challenge:** the PO first said the AI should neither raise nor lower priority. That conflicts with
     the priority-sorted queue and the urgent guardrail.
   - **Resolved (option a):** the AI's suggestion sets a new ticket's initial queue position, labelled
     "AI-suggested · unconfirmed". After that, the AI never changes a priority. Only agents confirm or
     change it, and every change is logged (who, when, old and new values).
6. Follow instructions written inside a ticket (treated as content).
7. Hide low confidence: below the threshold, the ticket is flagged for full human review.

## Q11 · Constraints
- **Budget:** **$5/month** Anthropic API cap (PO), plus free tiers. Workable for development and eval.
  Once the demo is public, the rate limit and the AI on/off switch are required to stay under the cap.
- **Timeline:** **2 weeks, as a target, not a hard date (PO, option c).** Playbook scope is kept and
  slippage is tracked openly in `PROGRESS.md`. Purpose: strengthen the PO's portfolio for upcoming job
  opportunities.
  - **Challenge:** the playbook is sized at about 4 weeks part-time. UAT participants' availability
    can't be compressed, and the API key is needed around day 5–6 (risk R7 raised).
  - Showable milestones: after Gate 1, and after the Sprint 1 demo.
- **Data:** fictional only; designed to GDPR principles (data minimisation, no PII to the AI, 90-day
  retention, assumed).
- **Language:** English only. Non-English tickets are accepted and triaged, but flagged for a human and
  given no AI draft.
- **Accessibility:** WCAG 2.2 AA.

## Q12 · Risks and failure conditions
- **PO's biggest worry:** "need to have a way to check UX and CX response."
  - **Challenge:** US-10 (customer rates the reply) is the only in-product CX measure, but it had been
    marked as the first thing to cut.
  - **Resolved:** US-10 promoted from Could to **Should**. UAT adds a Customer Effort Score question for
    customers: "How easy was it to get your issue handled?" (1–7).
- **PO's no-go condition:** agents say no to AI trustworthiness. Made decidable as **no-go at Gate 6 if
  more than half of UAT agents answer "no" to "Did you trust the AI draft?"**
- "Zero urgent tickets missed" stays a **Gate 5 exit criterion** (blocks before UAT). PO agreed.

---

## Open questions carried forward
- Confidence threshold for the low-confidence flag: set in Phase 3 (architecture), tuned in `/eval`.
- Long-ticket summary threshold (~150 words, assumed): confirm in the UX phase.
- Anthropic API key: needed around day 5–6 (RAID I1, D1, R7).
- Book UAT participants (4–6) and prototype reviewers (2) now (RAID D3).
