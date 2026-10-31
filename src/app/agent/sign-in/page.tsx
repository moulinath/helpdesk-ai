import type { Metadata } from "next";

import { SkipLink } from "@/components/skip-link";
import { demoAccounts } from "@/lib/demo-accounts";
import { demoMode } from "@/lib/env";

import { SignInForm, type DemoHint } from "./sign-in-form";

export const metadata: Metadata = { title: "Agent sign-in" };

function demoHint(): DemoHint | null {
  if (!demoMode()) {
    return null;
  }
  const [agent, lead] = demoAccounts();
  if (!agent || !lead) {
    return null;
  }
  return {
    agentEmail: agent.email,
    agentPassword: agent.password,
    leadEmail: lead.email,
    leadPassword: lead.password,
  };
}

export default function SignInPage() {
  return (
    <>
      <SkipLink />
      <header className="border-b bg-muted/40">
        <p className="mx-auto max-w-6xl px-4 py-3 font-semibold">HelpDesk</p>
      </header>
      <main
        id="main"
        tabIndex={-1}
        className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center px-4 py-10 outline-none"
      >
        <h1 className="mt-1 mb-6 text-2xl font-semibold">Agent sign-in</h1>
        <SignInForm demo={demoHint()} />
      </main>
    </>
  );
}
