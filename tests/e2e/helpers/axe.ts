import AxeBuilder from "@axe-core/playwright";
import { expect, type Page } from "@playwright/test";

// WCAG 2.2 AA rules (charter, NFR-13). Every story's Playwright test calls this on its pages.
const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

export async function expectNoSeriousViolations(page: Page): Promise<void> {
  const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
  const serious = results.violations.filter(
    (v) => v.impact === "serious" || v.impact === "critical",
  );
  expect(
    serious.map(
      (v) => `${v.id}: ${v.help} — ${v.nodes.map((node) => node.target.join(" ")).join(", ")}`,
    ),
    "serious or critical axe violations",
  ).toEqual([]);
}
