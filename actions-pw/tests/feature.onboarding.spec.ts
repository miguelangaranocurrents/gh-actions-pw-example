import { test, expect } from "@playwright/test";

test.describe(() => {
  test("has title", async ({ page }, testInfo) => {
    await page.goto("https://playwright.dev/");

    // Expect a title "to contain" a substring.
    const screenshot = await page.screenshot();
    await testInfo.attach("screenshot", {
      body: screenshot,
      contentType: "image/png",
    });
    const screenshot1 = await page.screenshot();
    await testInfo.attach("screenshot1", {
      body: screenshot,
      contentType: "image/png",
    });
    await expect(page).toHaveTitle(/Playwright/);
  });

  test("get started link", async ({ page }) => {
    await page.goto("https://playwright.dev/");

    // Click the get started link.
    await page.getByRole("link", { name: "Get started" }).click();

    // Expects page to have a heading with the name of Installation.
    await expect(
      page.getByRole("heading", { name: "Installation" })
    ).toBeVisible();
  });
});
