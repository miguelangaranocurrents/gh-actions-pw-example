import { expect, test } from "@playwright/test";
import { wait } from "../shared";

test.describe.configure({ retries: 0 });

test("timedout", async () => {
  await wait(1000);
});
test.skip("skipped", async () => {
  await wait(1000);
});
test("passed", () => {
  expect(true).toBe(true);
});
test("failed", () => {
  expect(true).toBe(false);
});
