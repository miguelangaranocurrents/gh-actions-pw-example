import { expect, test } from "@playwright/test";

test.describe("Skipped Suite", function () {
  test.skip("Test A", async function ({ page }) {
    await page.goto("/");
    await page
      .locator("#simpleSearch")
      .locator(".vector-search-box-input")
      .fill("Africa");
    await page.locator(".suggestions-result").first().click();

    await expect(page.getByText(/adssaf/).first()).toBeVisible();
  });
  test.skip("Test B", async function ({ page }) {
    await page.goto("/");
    await page
      .locator("#simpleSearch")
      .locator(".vector-search-box-input")
      .fill("Africa");
    await page.locator(".suggestions-result").first().click();

    await expect(page.getByText(/giraffes/).first()).toBeVisible();
  });
});
