# Reviewer brief — HelpDesk AI prototype

This is the text to send each prototype reviewer. Copy everything under "Message to send" and
replace `{NAME}`, `{DATE}` and `{YOUR NAME}`. The moderator's version of the same tasks (with what
to watch for) is in [prototype-feedback.md](prototype-feedback.md) §2.

**Live prototype:** <https://helpdesk-ai-prototype-eta.vercel.app/prototype>. It's a separate Vercel
project (`helpdesk-ai-prototype`), deployed from the `phase-2/prototype` branch on 2026-10-31. Anyone
with the link can open it; it holds only sample data and is `noindex`. Delete the Vercel project
after Gate 2 (RAID R14).

Two ways to run it:
- **On a call (preferred):** send the message, then join a 15-minute video call. The reviewer
  shares their screen and thinks aloud while doing the tasks. You take notes and ask the follow-up
  questions in §2.
- **On their own:** the reviewer does the tasks alone and replies with their answers. Quicker to
  arrange, but you lose what they say while they work.

---

## Message to send

> **Subject:** 15 minutes to try a prototype?
>
> Hi {NAME},
>
> Thanks for agreeing to help. I'm building a support tool for a made-up online shop called
> Larkfield Goods, and I'd like to see how a real person gets on with an early version.
>
> **Before you start**
> - It takes about 15 minutes. Use a laptop for Part 2. Part 1 works best on your phone, if you have it handy.
> - It's a rough prototype with fake data. Nothing you type is saved or sent anywhere, but please
>   use made-up details anyway.
> - Ignore the amber "Prototype" bar at the top of each page.
> - Whatever you type, the pages after it show a sample customer called Sofia. That's expected.
> - I'm testing the design, not you. If something is confusing, that's exactly what I need to know.
>   There are no wrong answers.
>
> **Part 1: You're a customer (about 5 minutes)**
>
> 1. You were charged twice for an order. Contact the shop's support about it.
>    Start here: https://helpdesk-ai-prototype-eta.vercel.app/prototype/support
> 2. A day later you want to check on your request. Find out what's happening with it.
> 3. Some time later, the shop has answered your double-charge request. Read the reply and tell
>    the shop what you thought of it: https://helpdesk-ai-prototype-eta.vercel.app/prototype/t/Rf7mWc3kTy9J
>
> **Part 2: You're a support agent at the shop (about 7 minutes)**
>
> Sign in here with the email `daniel@larkfield.example` and any password:
> https://helpdesk-ai-prototype-eta.vercel.app/prototype/agent/sign-in
>
> 4. Look at the list of tickets. Which one would you deal with first, and why?
> 5. Open ticket **HD-24817**. Check what the system has suggested, change anything you disagree
>    with, and send the reply.
> 6. Open ticket **HD-24805**, then ticket **HD-24802**.
>
> **Afterwards (about 3 minutes)**
>
> Please reply to this message with a few lines on each:
>
> - **Task 1–3:** Did anything confuse you or slow you down? What did you expect the "private link"
>   on the confirmation page to be for?
> - **Task 4:** Which ticket did you pick, and why? What did you take "AI · unconfirmed" to mean?
> - **Task 5:** Did you open "Why?" or the sources? After sending, you landed back on the list. Was
>   that what you expected?
> - **Task 6:** HD-24805 has a short summary at the top and HD-24802 doesn't. Was the summary useful?
>   Did you miss it on the second one?
> - Is there anything you'd trust less, or more, because the AI suggested it?
> - What confused you most?
> - Anything else you noticed, good or bad.
>
> Screenshots are welcome. Could you send this back by {DATE}?
>
> Thanks a lot,
> {YOUR NAME}
