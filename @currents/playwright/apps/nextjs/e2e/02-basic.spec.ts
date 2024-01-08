import { expect, test } from "@playwright/test";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

test.describe("Basic Test @feature-a", function () {
  test("Test 01 @veryveryveryveryveryveryveryveryveryveryveryveryveryveryveryveryveryveryveryveryveryveryveryveryveryveryverylong_text", async function ({
    page,
  }) {
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
});
