import { expect, test } from "@playwright/test";

fs.readFile("non-existing");

test.describe("Screenshots", function () {
  test.skip("Test A", async function ({ page }, testInfo) {
    await page.goto("/");
    expect(true);
  });
});
