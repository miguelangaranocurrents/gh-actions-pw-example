import { expect, test } from "@playwright/test";

test.skip("all skipped", async ({ page }, { retry }) => {
  expect(true).toBe(true);
});
