import { test } from "@playwright/test";

const title = "beforeAll error";
test.describe(title, function () {
  test.beforeAll(async () => {
    throw new Error("beforeAll error");
  });
  test(title, async function ({ page }) {
    await page.goto("/");
  });
});
