import Link from "next/link";
import { CustomerShell } from "./_components/shells";

// S8: same page for invalid, expired or tampered links; never reveals whether a ticket exists.
export default function NotFound() {
  return (
    <CustomerShell>
      <h1 className="text-2xl font-semibold">We can&apos;t find that page</h1>
      <p className="mt-3">
        If you&apos;re looking for a support request, use the link from your confirmation.
      </p>
      <p className="mt-6">
        <Link href="/prototype/support" className="font-medium underline underline-offset-4">
          Contact support
        </Link>
      </p>
    </CustomerShell>
  );
}
