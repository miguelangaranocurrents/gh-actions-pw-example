import { expect, test } from "@playwright/test";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

/*
This is a test to show that the mechanism for flushing un-run tests works.

This test artificially causes the tests to stop halfway through. Test 01 - Test 05 will run like normal.
However, when it then gets to 'Long running test', this contains a wait which is longer than the 'globalTimeout' (set in the playwright.config.timeout.ts file).
This causes the Playwright run to timeout, and tests Test 06 - Test 10 to never be run. You should observe in the Currents dashboard that these are shown as 'Skipped'

Note: for this test to run, it should be run with the playwright.config.timeout.ts config, as this sets the global timeout
*/

test.describe("Timeout test", function () {
  test("Test 01", async function ({ page }) {
    await page.goto("/");
    await page
      .locator("#simpleSearch")
      .locator(".vector-search-box-input")
      .fill("Africa");
    await page.locator("[role=option]").first().click();

    await expect(page.getByText(/Africa/).first()).toBeHidden();
    await page.evaluate(() => window.scrollTo(0, 800));
    await wait(2000);
    await page.evaluate(() => window.scrollTo(0, 300));
  });

  test("Test 02", async function ({ page }) {
    await page.goto("/");
    await page
      .locator("#simpleSearch")
      .locator(".vector-search-box-input")
      .fill("Africa");
    await page.locator("[role=option]").first().click();

    await expect(page.getByText(/Africa/).first()).toBeHidden();
    await page.evaluate(() => window.scrollTo(0, 800));
    await wait(2000);
    await page.evaluate(() => window.scrollTo(0, 300));
  });

  test("Test 03", async function ({ page }) {
    await page.goto("/");
    await page
      .locator("#simpleSearch")
      .locator(".vector-search-box-input")
      .fill("Africa");
    await page.locator("[role=option]").first().click();

    await expect(page.getByText(/Africa/).first()).toBeHidden();
    await page.evaluate(() => window.scrollTo(0, 800));
    await wait(2000);
    await page.evaluate(() => window.scrollTo(0, 300));
  });

  test("Test 04", async function ({ page }) {
    await page.goto("/");
    await page
      .locator("#simpleSearch")
      .locator(".vector-search-box-input")
      .fill("Africa");
    await page.locator("[role=option]").first().click();

    await expect(page.getByText(/Africa/).first()).toBeHidden();
    await page.evaluate(() => window.scrollTo(0, 800));
    await wait(2000);
    await page.evaluate(() => window.scrollTo(0, 300));
  });

  test("Test 05", async function ({ page }) {
    await page.goto("/");
    await page
      .locator("#simpleSearch")
      .locator(".vector-search-box-input")
      .fill("Africa");
    await page.locator("[role=option]").first().click();
    await page.evaluate(() => window.scrollTo(0, 800));
    await wait(1000);
    await page.evaluate(() => window.scrollTo(0, 300));
    await expect(page.getByText(/asdsadsadsada/).first()).toBeVisible();
  });

  test("Long running test", async function ({ page }) {
    // set test timeout to be longer than the globabl timeout
    test.setTimeout(60 * 1000 + 1000);
    await wait(60 * 1000 + 10);
    expect(true).toBe(true);
  });

  test("Test 06", async function ({ page }) {
    await page.goto("/");
    await page
      .locator("#simpleSearch")
      .locator(".vector-search-box-input")
      .fill("Africa");
    await page.locator("[role=option]").first().click();

    await expect(page.getByText(/Africa/).first()).toBeHidden();
    await page.evaluate(() => window.scrollTo(0, 800));
    await wait(2000);
    await page.evaluate(() => window.scrollTo(0, 300));
  });

  test("Test 07", async function ({ page }) {
    await page.goto("/");
    await page
      .locator("#simpleSearch")
      .locator(".vector-search-box-input")
      .fill("Africa");
    await page.locator("[role=option]").first().click();

    await expect(page.getByText(/Africa/).first()).toBeHidden();
    await page.evaluate(() => window.scrollTo(0, 800));
    await wait(2000);
    await page.evaluate(() => window.scrollTo(0, 300));
  });

  test("Test 08", async function ({ page }) {
    await page.goto("/");
    await page
      .locator("#simpleSearch")
      .locator(".vector-search-box-input")
      .fill("Africa");
    await page.locator("[role=option]").first().click();

    await expect(page.getByText(/Africa/).first()).toBeHidden();
    await page.evaluate(() => window.scrollTo(0, 800));
    await wait(2000);
    await page.evaluate(() => window.scrollTo(0, 300));
  });

  test("Test 09", async function ({ page }) {
    await page.goto("/");
    await page
      .locator("#simpleSearch")
      .locator(".vector-search-box-input")
      .fill("Africa");
    await page.locator("[role=option]").first().click();

    await expect(page.getByText(/Africa/).first()).toBeHidden();
    await page.evaluate(() => window.scrollTo(0, 800));
    await wait(2000);
    await page.evaluate(() => window.scrollTo(0, 300));
  });

  test("Test 10", async function ({ page }) {
    await page.goto("/");
    await page
      .locator("#simpleSearch")
      .locator(".vector-search-box-input")
      .fill("Africa");
    await page.locator("[role=option]").first().click();
    await page.evaluate(() => window.scrollTo(0, 800));
    await wait(1000);
    await page.evaluate(() => window.scrollTo(0, 300));
    await expect(page.getByText(/asdsadsadsada/).first()).toBeVisible();
  });
});
