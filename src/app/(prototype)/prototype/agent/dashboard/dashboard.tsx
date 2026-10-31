"use client";

import { TriangleAlertIcon } from "lucide-react";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProtoState } from "../../_components/prototype-bar";
import { useRole } from "../../_components/role";

type Period = "24h" | "7d" | "30d";
const PERIOD_LABEL: Record<Period, string> = { "24h": "Last 24 hours", "7d": "Last 7 days", "30d": "Last 30 days" };
const SCALE: Record<Period, number> = { "24h": 0.15, "7d": 1, "30d": 4.2 };

type Row = { label: string; value: number };

// Sample figures (assumed), for layout only.
const BY_CATEGORY: readonly Row[] = [
  { label: "Delivery", value: 46 },
  { label: "Returns & refunds", value: 31 },
  { label: "Payment & billing", value: 22 },
  { label: "Product question", value: 18 },
  { label: "Account", value: 9 },
  { label: "Other", value: 4 },
];
const DRAFT_OUTCOME: readonly Row[] = [
  { label: "Approved unchanged", value: 41 },
  { label: "Minor edit", value: 33 },
  { label: "Major edit", value: 17 },
  { label: "Unused", value: 9 },
];
const OVERRIDES = [
  { category: "Product question", rate: 22, example: "HD-24805" },
  { category: "Returns & refunds", rate: 13, example: "HD-24790" },
  { category: "Delivery", rate: 8, example: "HD-24811" },
  { category: "Payment & billing", rate: 5, example: "HD-24817" },
] as const;
const PRIORITY_STATUS = [
  { priority: "Urgent", open: 3, replied: 11 },
  { priority: "High", open: 9, replied: 27 },
  { priority: "Normal", open: 14, replied: 66 },
] as const;

export function Dashboard() {
  const state = useProtoState();
  const role = useRole();
  const [period, setPeriod] = useState<Period>("7d");
  const [failed, setFailed] = useState(state === "widget-error");

  // Lead role only (US-08); agents get a 403 with a way back.
  if (state === "forbidden" || role === "agent") {
    return (
      <div className="flex flex-col gap-3">
        <h1 className="text-2xl font-semibold">You don&apos;t have access to the dashboard</h1>
        <p>The dashboard is for team leads.</p>
        <p>
          <Link href="/prototype/agent/queue" className="font-medium underline underline-offset-4">
            Back to the queue
          </Link>
        </p>
      </div>
    );
  }

  const empty = state === "empty";
  const k = SCALE[period];
  const scale = (rows: readonly Row[]) => rows.map((r) => ({ ...r, value: Math.max(0, Math.round(r.value * k)) }));
  const total = scale(BY_CATEGORY).reduce((n, r) => n + r.value, 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            {PERIOD_LABEL[period]} · {empty ? 0 : total} tickets · sample figures
          </p>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="period">Period</Label>
          <Select value={period} onValueChange={(v) => setPeriod(v as Period)}>
            <SelectTrigger id="period" className="h-9 w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(PERIOD_LABEL) as Period[]).map((p) => (
                <SelectItem key={p} value={p}>
                  {PERIOD_LABEL[p]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Median time to acknowledgement" value={empty ? null : "1.4 s"} />
        <Stat label="Median time to first reply" value={empty ? null : period === "24h" ? "38 min" : "52 min"} />
        <Stat label="Needs triage" value={empty ? null : String(Math.round(3 * k))} />
        <Stat label="Product feedback" value={empty ? null : String(Math.round(7 * k))} />
        <Stat label="CSAT average" value={empty ? null : "4.2 / 5"} note={empty ? undefined : "78% rated 4–5"} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Widget title="Tickets by category" empty={empty}>
          <BarChart
            rows={scale(BY_CATEGORY)}
            unit="tickets"
            summary={`Delivery is the largest category with ${scale(BY_CATEGORY)[0]?.value ?? 0} tickets.`}
          />
        </Widget>

        <Widget title="Tickets by priority and status" empty={empty}>
          <table className="w-full text-sm">
            <caption className="sr-only">Open and replied tickets for each priority</caption>
            <thead>
              <tr className="border-b text-left">
                <th scope="col" className="py-1">Priority</th>
                <th scope="col" className="py-1 text-right">Open</th>
                <th scope="col" className="py-1 text-right">Replied</th>
              </tr>
            </thead>
            <tbody>
              {PRIORITY_STATUS.map((r) => (
                <tr key={r.priority} className="border-b last:border-0">
                  <th scope="row" className="py-1 text-left font-normal">{r.priority}</th>
                  <td className="py-1 text-right">{Math.round(r.open * k)}</td>
                  <td className="py-1 text-right">{Math.round(r.replied * k)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Widget>

        <Widget
          title="Draft outcome"
          empty={empty}
          error={failed}
          onRetry={() => setFailed(false)}
        >
          <BarChart rows={DRAFT_OUTCOME} unit="%" summary="74% of AI drafts were sent unchanged or with a minor edit." />
        </Widget>

        <Widget title="Override rate by category" empty={empty}>
          <table className="w-full text-sm">
            <caption className="sr-only">Share of AI labels changed by agents, per category</caption>
            <thead>
              <tr className="border-b text-left">
                <th scope="col" className="py-1">Category</th>
                <th scope="col" className="py-1 text-right">Override rate</th>
                <th scope="col" className="py-1 text-right">Example</th>
              </tr>
            </thead>
            <tbody>
              {OVERRIDES.map((r) => (
                <tr key={r.category} className="border-b last:border-0">
                  <th scope="row" className="py-1 text-left font-normal">{r.category}</th>
                  <td className="py-1 text-right">{r.rate}%</td>
                  <td className="py-1 text-right">
                    <Link href={`/prototype/agent/tickets/${r.example}`} className="underline underline-offset-4">
                      {r.example}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Widget>
      </div>
    </div>
  );
}

function Stat({ label, value, note }: { label: string; value: string | null; note?: string }) {
  return (
    <div className="rounded-lg border p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      {value === null ? (
        <p className="mt-1 text-sm">No tickets in this period</p>
      ) : (
        <>
          <p className="mt-1 text-2xl font-semibold">{value}</p>
          {note && <p className="text-xs text-muted-foreground">{note}</p>}
        </>
      )}
    </div>
  );
}

function Widget({
  title,
  empty,
  error,
  onRetry,
  children,
}: {
  title: string;
  empty: boolean;
  error?: boolean;
  onRetry?: () => void;
  children: ReactNode;
}) {
  return (
    <section aria-label={title} className="flex flex-col gap-3 rounded-lg border p-4">
      <h2 className="font-semibold">{title}</h2>
      {error ? (
        <Alert variant="destructive">
          <TriangleAlertIcon aria-hidden="true" />
          <AlertTitle>Couldn&apos;t load this widget.</AlertTitle>
          <AlertDescription>
            <Button variant="link" className="h-6 p-0" onClick={onRetry}>
              Try again
            </Button>
          </AlertDescription>
        </Alert>
      ) : empty ? (
        <p className="text-sm text-muted-foreground">No tickets in this period</p>
      ) : (
        children
      )}
    </section>
  );
}

/** CSS bars with a text summary and a "View as table" alternative (§6 Charts). */
function BarChart({ rows, unit, summary }: { rows: readonly Row[]; unit: string; summary: string }) {
  const [asTable, setAsTable] = useState(false);
  const max = Math.max(1, ...rows.map((r) => r.value));
  const fmt = (v: number) => (unit === "%" ? `${v}%` : `${v}`);
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm">{summary}</p>
      {asTable ? (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th scope="col" className="py-1">Item</th>
              <th scope="col" className="py-1 text-right">{unit === "%" ? "Share" : "Tickets"}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.label} className="border-b last:border-0">
                <th scope="row" className="py-1 text-left font-normal">{r.label}</th>
                <td className="py-1 text-right">{fmt(r.value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <ul className="flex flex-col gap-1.5">
          {rows.map((r) => (
            <li key={r.label} className="grid grid-cols-[9rem_1fr_3rem] items-center gap-2 text-sm">
              <span className="truncate">{r.label}</span>
              <span aria-hidden="true" className="h-3 rounded-sm bg-slate-600" style={{ width: `${(r.value / max) * 100}%` }} />
              <span className="text-right tabular-nums">{fmt(r.value)}</span>
            </li>
          ))}
        </ul>
      )}
      <Button variant="outline" size="sm" className="self-start" aria-pressed={asTable} onClick={() => setAsTable((v) => !v)}>
        View as table
      </Button>
    </div>
  );
}
