import { test } from "@playwright/test";

test.describe("Retries", function () {
  test.describe.configure({ retries: 3 });

  test("Runs a test with retries", function () {
    throw new Error("oh!");
  });
});
