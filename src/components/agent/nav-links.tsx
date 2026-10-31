"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

function NavLink({ href, children }: { href: string; children: ReactNode }) {
  const active = usePathname().startsWith(href);
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

export function AgentNavLinks({ isLead }: { isLead: boolean }) {
  return (
    <nav aria-label="Agent" className="flex items-center gap-4 text-sm">
      <NavLink href="/agent/queue">Queue</NavLink>
      {isLead && <NavLink href="/agent/dashboard">Dashboard</NavLink>}
    </nav>
  );
}
