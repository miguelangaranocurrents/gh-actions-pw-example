import { test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("https://todomvc.com/examples/vanilla-es6/");
});

test("test A @fast", async ({ page }, testInfo) => {
  // ...
});

test("test B @slow", async ({ page }, testInfo) => {
  // ...
});

// test.skip("test C", async ({ page }, testInfo) => {
//   // ...
// });
