# Personas

All four personas are **fictional**, built from the [BA interview](interview-notes.md). Details not
stated in the interview (ages, tenures, habits) are illustrative.

---

## Sofia Martínez — customer

> "I just want to know someone's seen it, and get an answer I can rely on."

| | |
| --- | --- |
| Context | Regular online shopper; usually contacts support from her phone |
| Goals | Know her issue was received; get a correct answer without chasing; check progress without calling |
| Frustrations | Silence after submitting; getting different answers from different agents; repeating herself |
| What she needs from the AI | Nothing visible, except faster and more consistent answers |
| What would make her distrust it | A reply that's obviously generic or wrong, or one that promises something the retailer then won't honour |

| Step | Today | With HelpDesk AI |
| --- | --- | --- |
| Submits a problem | Web form, no confirmation beyond "thanks" | Reference number and status link in < 3 s (US-02) |
| Waits | Hours with no sign anyone has seen it | Status page shows "Received" → "In progress" (US-07) |
| Gets a reply | Quality depends on the agent | Agent-approved reply grounded in the FAQ (US-04, US-06) |
| Gives feedback | No way to | Rates the reply (US-10) |

---

## Daniel Kim — new support agent (primary agent persona)

> "I spend half my day figuring out what a ticket is about and the other half asking Amara."

| | |
| --- | --- |
| Context | 3 weeks into the job; still learning the retailer's policies |
| Goals | Handle tickets confidently on his own; get the policy right; stop interrupting colleagues |
| Frustrations | Unsure what's urgent; can't find the right policy answer; slow compared with the seniors |
| What he needs from the AI | A suggested category and priority with a reason; a draft that cites the FAQ entry so he can check it; "Ask the KB" for quick policy questions (US-11) |
| What would make him distrust it | A confident draft that turns out wrong; labels with no explanation; not being able to tell AI content from his own |
| Risk he represents | Automation bias: under time pressure, he may approve drafts without reading them (RAID R10) |

| Step | Today | With HelpDesk AI |
| --- | --- | --- |
| Picks a ticket | Next in the FIFO queue | Highest priority first, with AI badge and confidence (US-05) |
| Understands it | Reads the full text, ~4 min (assumed) | Reads the summary for long tickets, with the full text below (US-03) |
| Finds the answer | Searches old replies or asks a senior | Draft cites the FAQ entry; asks the KB if unsure (US-04, US-11) |
| Replies | Writes from scratch | Edits or approves the draft; confirms or fixes labels (US-06) |
| Target time per ticket | ~10 min (assumed) | ~2 min (product owner target) |

---

## Amara Okafor — experienced support agent (secondary)

> "I know the answers. I just don't have time to answer everyone else's questions as well as mine."

| | |
| --- | --- |
| Context | 4+ years on the team; the person new starters go to |
| Goals | Work through the queue efficiently; correct the AI quickly when it's wrong; fewer interruptions |
| Frustrations | Constant questions from new starters; urgent issues buried in the queue |
| What she needs from the AI | Correct labels most of the time; a one-click override; drafts that save typing on routine tickets |
| What would make her distrust it | Being slowed down by fixing poor drafts; the AI re-labelling a ticket she already corrected |

| Step | Today | With HelpDesk AI |
| --- | --- | --- |
| Triage | Does it in her head, quickly | Glances at AI labels; overrides in one click when wrong (US-06) |
| Answering | Types replies from memory | Approves or edits routine drafts; writes complex ones herself |
| Helping colleagues | Interrupted many times a day | Fewer questions: Daniel uses the FAQ citations and the KB (US-04, US-11) |
| Corrections | n/a | Her overrides are logged and visible to Priya (US-08) |

---

## Priya Shah — team lead

> "I need to know urgent issues aren't slipping through, and whether the AI is actually helping."

| | |
| --- | --- |
| Context | Leads 8 agents; reports to the head of support |
| Goals | No urgent tickets missed; new starters ramp up faster; evidence of whether the AI helps |
| Frustrations | No visibility of the queue mix; finds out about missed urgent tickets from complaints |
| What she needs from the AI | Honest numbers: approval vs edit rate, overrides, volumes by category and priority, product-feedback count |
| What would make her distrust it | High approval rates with poor reply quality (rubber-stamping); missed urgent tickets |

| Step | Today | With HelpDesk AI |
| --- | --- | --- |
| Monitors the queue | Asks agents, checks manually | Dashboard of volumes by category and priority (US-08) |
| Checks quality | Spot-reads replies when she can | Reviews a sample of approved replies against the ≥ 90% target |
| Judges the AI | n/a | Sees approval/edit rate, override rate and customer ratings (US-08, US-10) |
| Product insight | Anecdotes | Count of "Product feedback" tickets |
