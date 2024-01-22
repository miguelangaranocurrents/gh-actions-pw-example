import { expect, test } from "@playwright/test";
import { wait } from "../shared";

test.describe.configure({ retries: 0 });

test("timedout", async () => {
  test.fail();
  await wait(1000);
});
test.skip("skipped", () => {
  test.fail();
});
test("passed", () => {
  test.fail();
  expect(true).toBe(true);
});
test("failed", () => {
  test.fail();
  expect(true).toBe(false);
});
