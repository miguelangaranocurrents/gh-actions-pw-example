import { expect, test } from "@playwright/test";
import { wait } from "../shared";

test.describe.configure({ timeout: 500 });
test("failed, passed", async ({ page }, { retry }) => {
  if (retry === 0) {
    throw new Error("retry");
  }

  expect(true).toBe(true);
});

test("expectedStatus=failed: passed, failed", async ({ page }, { retry }) => {
  test.fail();
  if (retry === 0) {
    expect(true).toBe(true);
  }
  if (retry === 1) {
    expect(true).toBe(false);
  }
});

test("expectedStatus=failed: timedOut, failed", async ({ page }, { retry }) => {
  test.fail();
  if (retry === 0) {
    await wait(1000);
  }
  if (retry === 1) {
    expect(true).toBe(false);
  }
});

test("timedOut, passed", async ({ page }, { retry }) => {
  if (retry === 0) {
    await wait(1000);
  }
  expect(true).toBe(true);
});

test("failed, skipped", async ({ page }, { retry }) => {
  if (retry === 0) {
    expect(true).toBe(false);
  }
  if (retry === 1) {
    test.skip();
  }
});
