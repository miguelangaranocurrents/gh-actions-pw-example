import { expect, test } from "@playwright/test";

test.describe.configure({ mode: "serial" });

test("failed, passed", async ({ page }, { retry }) => {
  if (retry === 0) {
    throw new Error("retry");
  }
  expect(true).toBe(true);
});

// non-flaky
test("skipped, passed", () => {
  expect(true).toBe(true);
});
