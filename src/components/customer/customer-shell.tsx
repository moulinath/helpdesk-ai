import Link from "next/link";
import type { ReactNode } from "react";

import { SkipLink } from "@/components/skip-link";

/** S1–S3, S8: mobile-first, single column, Larkfield Goods brand (UX-6). */
export function CustomerShell({ children }: { children: ReactNode }) {
  return (
    <>
      <SkipLink />
      <header className="border-b">
        <div className="mx-auto flex max-w-xl items-center px-4 py-3">
          <Link href="/" className="text-lg font-semibold tracking-tight text-brand">
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
