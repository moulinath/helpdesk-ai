import type { Metadata } from "next";
import { Suspense } from "react";
import { CustomerShell } from "../_components/shells";
import { SubmitForm } from "./submit-form";

// Customer tab titles never mention the product or AI (P5).
export const metadata: Metadata = { title: { absolute: "Contact support · Larkfield Goods" } };

const STATES = [
  { value: "loading", label: "Sending" },
  { value: "error-validation", label: "Validation errors" },
  { value: "error-server", label: "Server error" },
  { value: "error-rate-limit", label: "Rate limited" },
];

export default function SubmitPage() {
  return (
    <CustomerShell states={STATES}>
      <h1 className="text-2xl font-semibold">Contact support</h1>
      <p className="mt-1 mb-6 text-muted-foreground">Tell us what&apos;s wrong and we&apos;ll get back to you.</p>
      <Suspense fallback={null}>
        <SubmitForm />
      </Suspense>
    </CustomerShell>
  );
}
