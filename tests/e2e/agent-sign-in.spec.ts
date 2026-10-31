import { expect, test, type Page } from "@playwright/test";

import { expectNoSeriousViolations } from "./helpers/axe";

// Seeded by global-setup.ts (US-12 AC5). Public demo values, not secrets (RAID R19).
const AGENT = { email: "daniel@larkfield.example", password: "demo-agent-2026", name: "Daniel Kim" };
const LEAD = { email: "priya@larkfield.example", password: "demo-lead-2026", name: "Priya Shah" };

async function signIn(page: Page, email: string, password: string) {
  await page.goto("/agent/sign-in");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();
}

test.describe("US-12 agent sign-in", () => {
  test("AC1: signed out, agent pages redirect to sign-in and agent APIs return 401", async ({
    page,
    request,
  }) => {
    await page.goto("/agent/queue");
    await expect(page).toHaveURL(/\/agent\/sign-in$/);
    await expect(page.getByRole("heading", { level: 1, name: "Agent sign-in" })).toBeVisible();
    await expectNoSeriousViolations(page);

    const response = await request.get("/api/agent/me");
    expect(response.status()).toBe(401);
  });

  test("AC2: an agent signs in, lands on the queue, sees their name, and can sign out", async ({
    page,
  }) => {
    await signIn(page, AGENT.email, AGENT.password);
    await expect(page).toHaveURL(/\/agent\/queue$/);
    await expect(page.getByRole("heading", { level: 1, name: "Queue" })).toBeVisible();
    await expect(page.getByRole("banner").getByText(AGENT.name)).toBeVisible();
    await expect(page.getByRole("link", { name: "Dashboard" })).toHaveCount(0);
    await expectNoSeriousViolations(page);

    const me = await page.request.get("/api/agent/me");
    expect(await me.json()).toEqual({ name: AGENT.name, role: "agent" });

    await page.getByRole("button", { name: "Sign out" }).click();
    await expect(page).toHaveURL(/\/agent\/sign-in$/);
    await page.goto("/agent/queue");
    await expect(page).toHaveURL(/\/agent\/sign-in$/);
  });

  test("AC2: the email is case-insensitive", async ({ page }) => {
    await signIn(page, "  Daniel@Larkfield.Example ", AGENT.password);
    await expect(page).toHaveURL(/\/agent\/queue$/);
  });

  test("AC3: a wrong password shows a generic error", async ({ page }) => {
    await signIn(page, AGENT.email, "not-the-password");
    await expect(page.getByText("Email or password is incorrect.")).toBeVisible();
    await expect(page).toHaveURL(/\/agent\/sign-in$/);
    await expectNoSeriousViolations(page);
  });

  test("AC3: an unknown email shows the same generic error", async ({ page }) => {
    await signIn(page, "nobody@larkfield.example", "whatever-password");
    await expect(page.getByText("Email or password is incorrect.")).toBeVisible();
  });

  test("AC4: a lead lands on the dashboard; an agent gets 403 there", async ({ page, browser }) => {
    await signIn(page, LEAD.email, LEAD.password);
    await expect(page).toHaveURL(/\/agent\/dashboard$/);
    await expect(page.getByRole("heading", { level: 1, name: "Dashboard" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Dashboard" })).toBeVisible();

    const agentContext = await browser.newContext();
    const agentPage = await agentContext.newPage();
    await signIn(agentPage, AGENT.email, AGENT.password);
    await expect(agentPage).toHaveURL(/\/agent\/queue$/);
    const response = await agentPage.goto("/agent/dashboard");
    expect(response?.status()).toBe(403);
    await expect(
      agentPage.getByRole("heading", { level: 1, name: "You don't have access to this page" }),
    ).toBeVisible();
    await expectNoSeriousViolations(agentPage);
    await agentContext.close();
  });
});
