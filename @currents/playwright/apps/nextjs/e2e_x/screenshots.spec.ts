import { test } from "@playwright/test";

test.describe("Screenshots", function () {
  test("Test A", async function ({ page }, testInfo) {
    await page.goto("/");
    const screenshot1 = await page.screenshot({
      path: "./screenshots/root.png",
    });
    await testInfo.attach("screenshot", {
      body: screenshot1,
      contentType: "image/png",
    });
    await page
      .locator("#simpleSearch")
      .locator(".vector-search-box-input")
      .fill("Africa");
    const screenshot2 = await page.screenshot({
      path: "./screenshots/africa.png",
    });
    await testInfo.attach("screenshot2", {
      body: screenshot2,
      contentType: "image/png",
    });
    await page.locator("[role=option]").first().click();
  });
});
