"use client";

import { CheckIcon, CopyIcon } from "lucide-react";
import { useState, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";

const noSubscribe = () => () => {};

/** Copies a working link to this deployment (F4: the made-up support.larkfieldgoods.example address opened an empty page). */
export function CopyLink({ path }: { path: string }) {
  const origin = useSyncExternalStore(noSubscribe, () => window.location.origin, () => "");
  const url = `${origin}${path}`;
  const [result, setResult] = useState<"copied" | "failed" | null>(null);
  const copied = result === "copied";

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setResult("copied");
      window.setTimeout(() => setResult(null), 3000);
    } catch {
      // Clipboard blocked (e.g. insecure context): the link is still visible to copy by hand.
      setResult("failed");
    }
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
      {result === "failed" && (
        <p className="text-sm" role="status">
          Couldn&apos;t copy. Select the link and copy it.
        </p>
      )}
    </div>
  );
}
