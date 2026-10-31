"use client";

import { CheckIcon, CircleIcon, CloudOffIcon, SparklesIcon, SquareIcon, TriangleAlertIcon, TriangleIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { confidenceWord, type Priority } from "../_data/sample";

const PRIORITY_STYLE: Record<Priority, { icon: typeof TriangleIcon; className: string }> = {
  Urgent: { icon: TriangleIcon, className: "border-red-300 bg-red-50 text-red-800" },
  High: { icon: SquareIcon, className: "border-amber-300 bg-amber-50 text-amber-900" },
  Normal: { icon: CircleIcon, className: "border-slate-300 bg-slate-50 text-slate-700" },
};

/** Priority is always text + icon + colour, never colour alone (§6). */
export function PriorityBadge({ priority, defaulted = false }: { priority: Priority; defaulted?: boolean }) {
  const { icon: Icon, className } = PRIORITY_STYLE[priority];
  return (
    <Badge variant="outline" className={cn("h-6", className)}>
      <Icon aria-hidden="true" className="fill-current" />
      {priority}
      {defaulted && " (default)"}
    </Badge>
  );
}

type AiState =
  | { kind: "unconfirmed" }
  | { kind: "confirmed"; by: string }
  | { kind: "low-confidence" }
  | { kind: "unavailable" };

/** AI state under the priority in the queue (S5) and in the triage panel (S6). */
export function AiStateBadge({ state }: { state: AiState }) {
  switch (state.kind) {
    case "unconfirmed":
      return (
        <Badge variant="outline" className="h-6 text-muted-foreground">
          <SparklesIcon aria-hidden="true" />
          AI · unconfirmed
        </Badge>
      );
    case "confirmed":
      return (
        <Badge variant="outline" className="h-6 border-emerald-300 bg-emerald-50 text-emerald-900">
          <CheckIcon aria-hidden="true" />
          Confirmed ({state.by})
        </Badge>
      );
    case "low-confidence":
      return (
        <Badge variant="outline" className="h-6 border-amber-300 bg-amber-50 text-amber-900">
          <TriangleAlertIcon aria-hidden="true" />
          Low confidence
        </Badge>
      );
    case "unavailable":
      return (
        <Badge variant="outline" className="h-6 border-slate-300 bg-slate-100 text-slate-800">
          <CloudOffIcon aria-hidden="true" />
          AI unavailable
        </Badge>
      );
  }
}

/** "AI-suggested · High confidence", with the exact % in a tooltip (§4). */
export function ConfidenceLabel({ value }: { value: number }) {
  const word = confidenceWord(value);
  const pct = `${Math.round(value * 100)}%`;
  return (
    <span className="inline-flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
      <SparklesIcon aria-hidden="true" className="size-3" />
      AI-suggested ·
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className={cn(
              "inline-flex min-h-6 items-center underline decoration-dotted underline-offset-2",
              word === "Low" && "font-medium text-amber-900",
            )}
          >
            {word} confidence
            <span className="sr-only"> ({pct})</span>
          </button>
        </TooltipTrigger>
        <TooltipContent>Model confidence {pct}</TooltipContent>
      </Tooltip>
    </span>
  );
}
