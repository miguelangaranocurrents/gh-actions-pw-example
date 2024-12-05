import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  retries: process.env.CI ? 2 : 0,
  reporter: "html",
  use: {
    trace: "on",
    video: "on",
    screenshot: "on",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
      metadata: {
        pwc: {
          tags: ["project:setup"],
        },
      },
    },
  ],
});
