"use client";

import { CheckIcon, CopyIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function CopyLink({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // Clipboard blocked (e.g. insecure context): the link is still visible to copy by hand.
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 3000);
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <code id="private-link" className="min-w-0 flex-1 rounded-md border bg-muted px-3 py-2 text-sm break-all">
        {url}
      </code>
      <Button type="button" variant="outline" size="lg" className="h-10 sm:w-auto" onClick={copy} aria-describedby="private-link">
        {copied ? <CheckIcon aria-hidden="true" /> : <CopyIcon aria-hidden="true" />}
        {copied ? "Copied" : "Copy link"}
      </Button>
      <span className="sr-only" aria-live="polite">
        {copied ? "Link copied" : ""}
      </span>
    </div>
  );
}
