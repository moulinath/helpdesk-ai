"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";

export type StateOption = { value: string; label: string };

/** Reads the prototype's ?state= switch. "default" when absent. */
export function useProtoState(): string {
  return useSearchParams().get("state") ?? "default";
}

function StateLinks({ states }: { states: readonly StateOption[] }) {
  const pathname = usePathname();
  const current = useProtoState();
  return (
    <ul className="flex flex-wrap gap-x-3 gap-y-1">
      {[{ value: "default", label: "Default" }, ...states].map((s) => (
        <li key={s.value}>
          <Link
            href={s.value === "default" ? pathname : `${pathname}?state=${s.value}`}
            aria-current={current === s.value ? "page" : undefined}
            className="inline-flex min-h-6 items-center underline underline-offset-2 aria-[current=page]:font-semibold aria-[current=page]:no-underline"
          >
            {s.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

/** Slim bar on every prototype screen: says it's sample data and lets reviewers switch states. */
export function PrototypeBar({ states = [] }: { states?: readonly StateOption[] }) {
  return (
    <aside
      aria-label="Prototype controls"
      className="border-b border-dashed border-amber-400 bg-amber-50 px-4 py-2 text-xs text-amber-950"
    >
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-1">
        <p>
          <strong>Prototype</strong> · sample data, nothing is saved ·{" "}
          <Link href="/prototype" className="underline underline-offset-2">
            All screens
          </Link>
        </p>
        {states.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span>Show state:</span>
            <Suspense fallback={null}>
              <StateLinks states={states} />
            </Suspense>
          </div>
        )}
      </div>
    </aside>
  );
}
