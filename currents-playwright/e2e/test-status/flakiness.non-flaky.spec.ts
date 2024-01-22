import { expect, test } from "@playwright/test";
import { wait } from "../shared";

test("timedOut, failed", async ({ page }, { retry }) => {
  if (retry === 0) {
    await wait(1000);
  }

  expect(true).toBe(false);
});
