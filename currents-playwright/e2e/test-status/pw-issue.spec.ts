import { expect, test } from "@playwright/test";

test.describe.configure({ mode: "serial", retries: 2 });

test("A", async ({ page }, { retry }) => {
  if (retry === 0 || retry === 2) {
    throw new Error("oh!");
  }
  if (retry === 1 || retry === 3) {
    expect(true).toBe(true);
  }
});

test("B", async ({ page }, { retry }) => {
  throw new Error("oh!");
});
