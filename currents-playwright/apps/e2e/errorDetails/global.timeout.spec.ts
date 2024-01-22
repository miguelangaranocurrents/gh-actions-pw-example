import { test } from "@playwright/test";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

// https://playwright.dev/docs/test-timeouts#global-timeout
test.describe("global timeout", function () {
  test("global timeout A", async function () {
    await wait(2000);
  });

  test("global timeout B", async function () {
    await wait(2000);
  });

  test.skip("global timeout explicitly skipped test", async function () {
    await wait(2000);
  });
});
