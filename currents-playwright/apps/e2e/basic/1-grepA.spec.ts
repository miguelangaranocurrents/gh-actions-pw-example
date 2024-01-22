import { expect, test } from "@playwright/test";

test.describe("Tests Group", () => {
  test("basic test @tagA @newTag", async ({ page }) => {
    await page.goto("https://todomvc.com/examples/vanilla-es6/");

    // Use locators to represent a selector and re-use them
    const inputBox = page.locator("input.new-todo");
    const todoList = page.locator(".todo-list");

    await inputBox.fill("Learn Playwright");
    await inputBox.press("Enter");
    await expect(todoList).toHaveText("Learn Playwright");
  });

  test("basic test with annotation @tagA", async ({ page }) => {
    test
      .info()
      .annotations.push({ type: "customAnnotation", description: "tagA" });

    await page.goto("https://todomvc.com/examples/vanilla-es6/");

    // Use locators to represent a selector and re-use them
    const inputBox = page.locator("input.new-todo");
    const todoList = page.locator(".todo-list");

    await inputBox.fill("Learn Playwright");
    await inputBox.press("Enter");
    await expect(todoList).toHaveText("Learn Playwright");
  });
});
