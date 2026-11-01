import { expect, test, type Page } from "@playwright/test";

import { expectNoSeriousViolations } from "./helpers/axe";
import { clearRateLimits, countTickets } from "./helpers/db";

const VALID = {
  name: "Sofia Marin",
  email: "sofia.marin@example.com",
  subject: "Charged twice for my order",
  description: "I ordered a rain jacket on Monday (order 5521) and my bank shows two payments of £89.00.",
};

async function fill(page: Page, values: typeof VALID) {
  await page.getByLabel("Name (required)").fill(values.name);
  await page.getByLabel("Email (required)").fill(values.email);
  await page.getByLabel("Subject (required)").fill(values.subject);
  await page.getByLabel("Description (required)").fill(values.description);
}

test.describe("US-01 submit ticket", () => {
  test("AC1: a valid ticket is saved and the customer lands on their confirmation", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1, name: "Contact support" })).toBeVisible();
    await expectNoSeriousViolations(page);

    await fill(page, VALID);
    await page.getByRole("button", { name: "Submit request" }).click();

    await expect(page).toHaveURL(/\/t\/[A-Za-z0-9_-]{22}\?new=1$/);
    await expect(page.getByRole("heading", { level: 1, name: "Thanks, we've got your request" })).toBeVisible();
    await expect(page.getByText(/^HD-\d+$/)).toBeVisible();
    await expectNoSeriousViolations(page);
  });

  test("AC2: errors show next to each field, focus moves to the first, and input is kept", async ({ page }) => {
    await page.goto("/");
    await page.getByLabel("Email (required)").fill("sofia@");
    await page.getByLabel("Subject (required)").fill("Help");
    await page.getByRole("button", { name: "Submit request" }).click();

    // The summary is inside the assertive live region, so screen readers announce it.
    await expect(
      page.getByTestId("form-messages").getByText("Please fix 4 problems before sending"),
    ).toBeVisible();
    await expect(page.getByTestId("form-messages")).toHaveAttribute("aria-live", "assertive");
    await expect(page.getByLabel("Name (required)")).toBeFocused();
    await expect(page.getByLabel("Email (required)")).toHaveAttribute("aria-invalid", "true");
    await expect(page.getByLabel("Email (required)")).toHaveAccessibleDescription(
      /Please enter an email address like name@example.com\./,
    );
    await expect(page.getByLabel("Email (required)")).toHaveValue("sofia@");
    await expect(page.getByLabel("Subject (required)")).toHaveValue("Help");
    await expect(page).toHaveURL(/\/$/);
    await expectNoSeriousViolations(page);
  });

  test("AC5: the whole form can be completed and sent with the keyboard only", async ({ page }) => {
    await page.goto("/");
    // Skip link, then the wordmark link, then the first field.
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await expect(page.getByLabel("Name (required)")).toBeFocused();
    await page.keyboard.type(VALID.name);
    await page.keyboard.press("Tab");
    await page.keyboard.type(VALID.email);
    await page.keyboard.press("Tab");
    await page.keyboard.type(VALID.subject);
    await page.keyboard.press("Tab");
    await page.keyboard.type(VALID.description);
    await page.keyboard.press("Tab");
    await expect(page.getByRole("button", { name: "Submit request" })).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/t\/[A-Za-z0-9_-]{22}\?new=1$/);
  });

  test("AC4: the 6th ticket in 10 minutes is refused with a friendly message, input kept", async ({
    page,
  }) => {
    clearRateLimits();
    const subject = `Rate limit check ${Date.now()}`;
    for (let attempt = 1; attempt <= 5; attempt++) {
      await page.goto("/");
      await fill(page, { ...VALID, subject });
      await page.getByRole("button", { name: "Submit request" }).click();
      await expect(page.getByRole("heading", { level: 1, name: "Thanks, we've got your request" })).toBeVisible();
    }
    await page.goto("/");
    await fill(page, { ...VALID, subject });
    await page.getByRole("button", { name: "Submit request" }).click();
    await expect(
      page.getByText("You've sent several requests in a short time. Please try again in a few minutes."),
    ).toBeVisible();
    await expect(page.getByLabel("Subject (required)")).toHaveValue(subject);
    expect(countTickets(subject)).toBe(5);
    await expectNoSeriousViolations(page);
    clearRateLimits();
  });

  test("S1: a network failure shows the server error and keeps the input (review M1)", async ({ page }) => {
    await page.goto("/");
    await fill(page, VALID);
    // Fail the Server Action's POST as if the connection dropped.
    await page.route("**/*", (route) =>
      route.request().method() === "POST" ? route.abort("internetdisconnected") : route.continue(),
    );
    await page.getByRole("button", { name: "Submit request" }).click();
    await expect(page.getByText("We couldn't send your request. Please try again.")).toBeVisible();
    await expect(page.getByLabel("Description (required)")).toHaveValue(VALID.description);
    await expect(page.getByRole("button", { name: "Try again" })).toBeVisible();
    await expectNoSeriousViolations(page);

    await page.unroute("**/*");
    await page.getByRole("button", { name: "Try again" }).click();
    await expect(page).toHaveURL(/\/t\/[A-Za-z0-9_-]{22}\?new=1$/);
  });

  test("a double click sends one ticket, not two (review S3)", async ({ page }) => {
    const subject = `Double click check ${Date.now()}`;
    await page.goto("/");
    await fill(page, { ...VALID, subject });
    await page.getByRole("button", { name: "Submit request" }).dblclick();
    await expect(page).toHaveURL(/\/t\/[A-Za-z0-9_-]{22}\?new=1$/);
    expect(countTickets(subject)).toBe(1);
  });
});
