import { test } from "@playwright/test";

test.describe("Screenshots", function () {
  test("Test A", async function ({ page }) {
    await page.goto("/");
    await page
      .locator("#simpleSearch")
      .locator(".vector-search-box-input")
      .fill("Africa");
    page.screenshot({ path: "./screenshots/africa.png" });
    await page.locator("[role=option]").first().click();
  });
});
