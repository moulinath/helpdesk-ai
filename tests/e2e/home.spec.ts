import { expect, test } from "@playwright/test";

import { expectNoSeriousViolations } from "./helpers/axe";

test("home page loads with no serious accessibility violations", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: "HelpDesk AI" })).toBeVisible();
  await expectNoSeriousViolations(page);
});
