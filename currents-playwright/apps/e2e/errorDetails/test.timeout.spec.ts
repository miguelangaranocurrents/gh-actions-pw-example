import { expect, test } from "@playwright/test";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

test.describe("test timeout", function () {
  // https://playwright.dev/docs/test-timeouts#test-timeout
  test("test timeout", async function ({ page }) {
    test.setTimeout(100);
    await wait(150);
  });
  // https://playwright.dev/docs/test-timeouts#set-expect-timeout-in-the-config
  test("expect timeout", async function ({ page }) {
    test.setTimeout(5 * 60 * 1000);
    await page.goto("/");
    await expect(page).toHaveTitle(/42/);
  });
});
