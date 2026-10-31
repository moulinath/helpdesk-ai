import { CircleCheckIcon, InfoIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomerShell } from "../../_components/shells";
import { findByRef } from "../../_data/sample";
import { CopyLink } from "./copy-link";

export const metadata: Metadata = { title: { absolute: "Request received · Larkfield Goods" } };

export default function ConfirmationPage() {
  const ticket = findByRef("HD-24817");
  if (!ticket) throw new Error("Sample ticket missing");
  const statusPath = `/prototype/t/${ticket.token}`;

  return (
    <CustomerShell>
      <div className="flex flex-col gap-6">
        <div className="flex items-start gap-3">
          <CircleCheckIcon aria-hidden="true" className="mt-1 size-6 shrink-0 text-brand" />
          <div>
            <h1 className="text-2xl font-semibold">Thanks, we&apos;ve got your request</h1>
            <p className="mt-3 text-sm text-muted-foreground">Reference</p>
            <p className="text-3xl font-semibold tracking-wide">{ticket.ref}</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              <h2>Your private link</h2>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <CopyLink url={`https://support.larkfieldgoods.example/t/${ticket.token}`} />
            <Alert role="note">
              <InfoIcon aria-hidden="true" />
              <AlertDescription>Anyone with this link can see your request. Don&apos;t share it.</AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        <section aria-labelledby="next-steps">
          <h2 id="next-steps" className="font-semibold">
            What happens next
          </h2>
          <p className="mt-1">
            An agent will review your request and reply here. You can check the status at any time using your link.
          </p>
        </section>

        <p className="text-sm">
          <Link href={statusPath} className="underline underline-offset-4">
            Open your status page
          </Link>{" "}
          <span className="text-muted-foreground">(prototype shortcut for the private link)</span>
        </p>
      </div>
    </CustomerShell>
  );
}
