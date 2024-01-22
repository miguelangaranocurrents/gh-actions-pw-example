import { expect, test } from "@playwright/test";
import { wait } from "../shared";

test.describe.configure({ mode: "serial", retries: 2 });

test("serial: failed, passed, passed", async ({ page }, { retry }) => {
  if (retry === 0) {
    throw new Error("oh!");
  }
  if (retry === 1) {
    expect(true).toBe(true);
  }
});

test("serial: skipped, passed, passed", async ({ page }, { retry }) => {
  expect(true).toBe(true);
});

test.skip("serial: skipped, skipped, skipped", async ({ page }, { retry }) => {
  expect(true).toBe(true);
});

test.fixme("serial: fixme, fixme, fixme", async ({ page }, { retry }) => {
  expect(true).toBe(true);
});

test("serial: skipped, timedOut, passed", async ({ page }, { retry }) => {
  if (retry === 1) {
    await wait(1000);
  }
  expect(true).toBe(true);
});

// what is the outcome for different scenarios
test("serial; expectedStatus=failed; skipped, skipped, failed", async ({
  page,
}, { retry }) => {
  test.fail();
  expect(true).toBe(false);
});
