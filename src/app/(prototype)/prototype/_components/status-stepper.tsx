import { CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CustomerStatus } from "../_data/sample";

const STEPS: readonly CustomerStatus[] = ["Received", "In progress", "Replied"];

/** Ordered list with aria-current="step"; the current status is also stated in text (§6). */
export function StatusStepper({ status }: { status: CustomerStatus }) {
  const current = STEPS.indexOf(status);
  return (
    <div className="flex flex-col gap-2">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
        {STEPS.map((step, i) => (
          <li key={step} aria-current={i === current ? "step" : undefined} className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className={cn(
                "flex size-6 items-center justify-center rounded-full border text-xs",
                i < current && "border-brand bg-brand text-brand-foreground",
                i === current && "border-2 border-brand font-semibold text-brand",
                i > current && "border-muted-foreground/50 text-muted-foreground",
              )}
            >
              {i < current ? <CheckIcon className="size-3.5" /> : i + 1}
            </span>
            <span className={cn(i === current ? "font-semibold" : "text-muted-foreground")}>
              {step}
              {i < current && <span className="sr-only"> (done)</span>}
            </span>
            {i < STEPS.length - 1 && <span aria-hidden="true" className="h-px w-6 bg-border" />}
          </li>
        ))}
      </ol>
      <p className="font-medium">Status: {status}</p>
    </div>
  );
}
