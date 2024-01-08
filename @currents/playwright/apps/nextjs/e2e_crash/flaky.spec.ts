import { expect, test } from "@playwright/test";

test.describe("Flaky", function () {
  test.describe.configure({ retries: 4, timeout: 5000 });

  test("Runs a flaky test with retries", async function ({ page }, testInfo) {
    await page.goto("/");
    await page
      .locator("#simpleSearch")
      .locator(".vector-search-box-input")
      .fill("Banana");
    await page.locator("[role=option]").first().click();

    if (testInfo.retry < 2) {
      await expect(page.getByText(/asdsadsadsada/).first()).toBeVisible();
    } else {
      await expect(page.getByText(/yellow/).first()).toBeVisible();
    }
    return;
  });

  test("Runs a flaky test with retries #2", async function ({
    page,
  }, testInfo) {
    await page.goto("/");
    await page
      .locator("#simpleSearch")
      .locator(".vector-search-box-input")
      .fill("Banana");
    await page.locator("[role=option]").first().click();

    if (testInfo.retry < 2) {
      await expect(page.getByText(/asdsadsadsada/).first()).toBeVisible();
    } else {
      await expect(page.getByText(/yellow/).first()).toBeVisible();
    }
    return;
  });
});
