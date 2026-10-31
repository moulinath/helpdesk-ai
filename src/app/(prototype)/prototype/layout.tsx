import type { Metadata } from "next";

// Throwaway clickable prototypes (Phase 2). Not indexed; removed before release.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function PrototypeLayout({ children }: LayoutProps<"/prototype">) {
  return children;
}
