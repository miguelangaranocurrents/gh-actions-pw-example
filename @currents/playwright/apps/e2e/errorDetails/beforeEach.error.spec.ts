import { test } from "@playwright/test";
const t = "beforeEach error";
test.describe(t, function () {
  test.beforeEach(async () => {
    throw new Error("beforeEach error");
  });
  test(t, async function ({ page }) {
    await page.goto("/");
  });
});
