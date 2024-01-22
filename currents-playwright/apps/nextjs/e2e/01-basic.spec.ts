import { expect, test } from "@playwright/test";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

test.describe("Basic Test @descriptionTag", function () {
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

  test("Test 02 @smoke", async function ({ page }) {
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
  test("Test 03 @tagA", async function ({ page }) {
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
  test("Test 04 @tagC", async function ({ page }) {
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
