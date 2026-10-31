import type { Metadata } from "next";
import { Suspense } from "react";
import { PrototypeBar } from "../../_components/prototype-bar";
import { SkipLink } from "../../_components/shells";
import { SignInForm } from "./sign-in-form";

export const metadata: Metadata = { title: "Agent sign-in (prototype S4)" };

const STATES = [
  { value: "loading", label: "Signing in" },
  { value: "error", label: "Wrong details" },
  { value: "rate-limited", label: "Rate limited" },
];

export default function SignInPage() {
  return (
    <>
      <SkipLink />
      <PrototypeBar states={STATES} />
      <header className="border-b bg-muted/40">
        <p className="mx-auto max-w-6xl px-4 py-3 font-semibold">HelpDesk</p>
      </header>
      <main id="main" tabIndex={-1} className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center px-4 py-10 outline-none">
        <h1 className="mt-1 mb-6 text-2xl font-semibold">Agent sign-in</h1>
        <Suspense fallback={null}>
          <SignInForm />
        </Suspense>
      </main>
    </>
  );
}
