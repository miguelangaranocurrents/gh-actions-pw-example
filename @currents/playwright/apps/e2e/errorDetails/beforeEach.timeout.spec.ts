import { test } from "@playwright/test";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
const t = "beforeEach timeout";
test.describe(t, function () {
  test.beforeEach(async () => {
    await wait(11000);
  });
  test(t, async function ({ page }) {
    await page.goto("/");
  });
});
