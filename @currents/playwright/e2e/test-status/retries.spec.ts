import { expect, test } from "@playwright/test";
import { wait } from "../shared";

test("all passed ", async ({ page }, { retry }) => {
  expect(true).toBe(true);
});

test("all failed ", async ({ page }, { retry }) => {
  expect(true).toBe(false);
});

test("failed, passed ", async ({ page }, { retry }) => {
  if (retry === 0) {
    expect(true).toBe(false);
  }
  expect(true).toBe(true);
});

// expectedStatus becomes "skipped"  wtf?
test("failed, skipped ", async ({ page }, { retry }) => {
  if (retry === 0) {
    expect(true).toBe(false);
  }
  test.skip();
});

// expectedStatus becomes "skipped"  wtf?
test("timedOut, skipped ", async ({ page }, { retry }) => {
  if (retry === 0) {
    await wait(1000);
  }
  test.skip();
});
// expectedStatus becomes "skipped"  wtf?
test("expectedStatus=failed: passed, skipped ", async ({ page }, { retry }) => {
  test.fail();
  if (retry === 0) {
    expect(true).toBe(true);
  }
  if (retry === 1) {
    test.skip();
  }
});
