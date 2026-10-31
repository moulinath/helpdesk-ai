"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { AGENT, LEAD } from "../_data/sample";
import { PrototypeBar, type StateOption } from "./prototype-bar";
import { setRole, useRole } from "./role";

export function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-background focus:px-3 focus:py-2 focus:shadow"
    >
      Skip to main content
    </a>
  );
}

/** S1–S3, S8: mobile-first, single column, light Larkfield Goods brand (UX-6). */
export function CustomerShell({ children, states }: { children: ReactNode; states?: readonly StateOption[] }) {
  return (
    <>
      <SkipLink />
      <PrototypeBar states={states} />
      <header className="border-b">
        <div className="mx-auto flex max-w-xl items-center px-4 py-3">
          <Link href="/prototype/support" className="text-lg font-semibold tracking-tight text-brand">
            Larkfield Goods
          </Link>
        </div>
      </header>
      <main id="main" tabIndex={-1} className="mx-auto w-full max-w-xl flex-1 px-4 py-6 outline-none">
        {children}
      </main>
      <footer className="border-t px-4 py-4 text-center text-xs text-muted-foreground">
        Larkfield Goods is a fictional shop used for this demo.
      </footer>
    </>
  );
}

function NavLink({ href, children }: { href: string; children: ReactNode }) {
  const pathname = usePathname();
  const active = pathname.startsWith(href);
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className="inline-flex min-h-6 items-center rounded px-1 underline-offset-4 hover:underline aria-[current=page]:font-semibold aria-[current=page]:underline"
    >
      {children}
    </Link>
  );
}

/** S5–S7: desktop-first agent workspace with header, nav and sign-out. */
export function AgentShell({ children, states }: { children: ReactNode; states?: readonly StateOption[] }) {
  const role = useRole();
  const person = role === "lead" ? LEAD : AGENT;
  return (
    <>
      <SkipLink />
      <PrototypeBar states={states} />
      <header className="border-b bg-muted/40">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <span className="font-semibold">HelpDesk</span>
          <nav aria-label="Agent" className="flex items-center gap-4 text-sm">
            <NavLink href="/prototype/agent/queue">Queue</NavLink>
            {role === "lead" && <NavLink href="/prototype/agent/dashboard">Dashboard</NavLink>}
          </nav>
          <div className="flex items-center gap-3 text-sm">
            <span>
              {person.fullName}
              {role === "lead" && <span className="text-muted-foreground"> · Team lead</span>}
            </span>
            <Link
              href="/prototype/agent/sign-in"
              onClick={() => setRole("agent")}
              className="inline-flex min-h-6 items-center underline underline-offset-4"
            >
              Sign out
            </Link>
          </div>
        </div>
      </header>
      <main id="main" tabIndex={-1} className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 outline-none">
        {children}
      </main>
    </>
  );
}
