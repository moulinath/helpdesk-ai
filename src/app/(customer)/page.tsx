import type { Metadata } from "next";

import { SubmitForm } from "./submit-form";

export const metadata: Metadata = { title: "Contact support" };

// Room for after() to make two 10 s triage attempts once the response is sent (architecture §4.1).
export const maxDuration = 60;

export default function SubmitPage() {
  return (
    <>
      <h1 className="text-2xl font-semibold">Contact support</h1>
      <p className="mt-1 mb-6 text-muted-foreground">Tell us what&apos;s wrong and we&apos;ll get back to you.</p>
      <SubmitForm />
    </>
  );
}
