import { test, expect } from "@playwright/test";

test.describe("Test", function () {
  test("run #1", async function ({ page }) {
    await page.waitForTimeout(180000);
  });
});
