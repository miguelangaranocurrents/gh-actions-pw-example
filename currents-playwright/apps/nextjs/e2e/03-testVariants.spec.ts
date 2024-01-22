import { expect, test } from "@playwright/test";

test.describe("Test Variants", function () {
  test("Expected to fail", function ({ page }) {
    test.fail(true, "This test is supposed to fail");
    expect(1).toBe(2);
  });
  test.fixme("Supposed to be fixed", function ({ page }) {});
  test.skip("To be skipped", async function ({ page }) {
    expect(1).toBe(1);
  });

  test("Fails", function ({ page }) {
    expect(1).toBe(2);
  });

  test("Passes", async function ({ page }) {
    expect(1).toBe(1);
  });
});
