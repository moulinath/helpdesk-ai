import type { Metadata } from "next";
import Link from "next/link";
import { PrototypeBar } from "./_components/prototype-bar";
import { HD_24817_REPLIED, TICKETS } from "./_data/sample";

export const metadata: Metadata = { title: "Prototypes" };

const statusLinks = [
  ...TICKETS.filter((t) => ["HD-24817", "HD-24809", "HD-24790", "HD-24788"].includes(t.ref)),
  HD_24817_REPLIED,
];
// Keyed by token: HD-24817 has two status pages (in progress, then replied).
const describe: Record<string, string> = {
  "9fK2xQ7pLmV4": "In progress, no reply yet",
  "Nd3kLs9vQe2B": "Received, no reply yet",
  "Ps4nGv7cXr2D": "Replied, not yet rated",
  "Zk9qBt5mLw3H": "Replied and rated",
  [HD_24817_REPLIED.token]: "Replied, not yet rated (review task 3: the double charge, a day later)",
};

const ticketScenarios = [
  ["HD-24817", "Urgent, high confidence, FAQ-grounded draft"],
  ["HD-24811", "Already checked by Amara"],
  ["HD-24809", "AI unavailable: needs triage, no draft"],
  ["HD-24805", "Low confidence; 135 words, so the AI summary shows"],
  ["HD-24802", "111 words, so the AI summary shows (UX-2 threshold is 100)"],
  ["HD-24799", "Non-English: no draft"],
  ["HD-24795", "No FAQ match: empty editor"],
  ["HD-24790", "Already replied: read-only view"],
] as const;

function Item({ href, children, note }: { href: string; children: React.ReactNode; note?: string }) {
  return (
    <li>
      <Link href={href} className="font-medium underline underline-offset-4">
        {children}
      </Link>
      {note && <span className="text-muted-foreground"> · {note}</span>}
    </li>
  );
}

export default function PrototypeIndex() {
  return (
    <>
      <PrototypeBar />
      <main id="main" className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
        <h1 className="text-2xl font-semibold">HelpDesk AI · clickable prototypes</h1>
        <p className="mt-2 text-muted-foreground">
          Low-fidelity screens S1–S8 from the UX spec, with hardcoded sample data. Nothing is saved and no AI is
          called. Use the amber bar on each screen to see its loading, empty and error states.
        </p>

        <section aria-labelledby="cust" className="mt-8">
          <h2 id="cust" className="text-lg font-semibold">
            Customer (Sofia), mobile-first
          </h2>
          <ul className="mt-3 flex flex-col gap-2">
            <Item href="/prototype/support" note="start here">
              S1 Submit a request
            </Item>
            <Item href="/prototype/support/confirmation">S2 Confirmation</Item>
            {statusLinks.map((t) => (
              <Item key={t.token} href={`/prototype/t/${t.token}`} note={describe[t.token]}>
                S3 Status page · {t.ref}
              </Item>
            ))}
            <Item href="/prototype/t/not-a-real-link">S8 Not found (bad or expired link)</Item>
          </ul>
        </section>

        <section aria-labelledby="agent" className="mt-8">
          <h2 id="agent" className="text-lg font-semibold">
            Agent (Daniel) and team lead (Priya), desktop
          </h2>
          <ul className="mt-3 flex flex-col gap-2">
            <Item href="/prototype/agent/sign-in" note="start here">
              S4 Agent sign-in
            </Item>
            <Item href="/prototype/agent/queue">S5 Queue</Item>
            {ticketScenarios.map(([ref, note]) => (
              <Item key={ref} href={`/prototype/agent/tickets/${ref}`} note={note}>
                S6 Ticket {ref}
              </Item>
            ))}
            <Item href="/prototype/agent/dashboard" note="sign in as priya@larkfield.example first; agents see a 403">
              S7 Team-lead dashboard
            </Item>
          </ul>
        </section>
      </main>
    </>
  );
}
