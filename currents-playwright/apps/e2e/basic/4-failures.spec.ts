import { test, expect } from "@playwright/test";

test("Expect the test to fail", async ({ page }) => {
  test.fail();
  await test.step("should fail", async () => {
    await expect(true).toBe(false);
  });
});
