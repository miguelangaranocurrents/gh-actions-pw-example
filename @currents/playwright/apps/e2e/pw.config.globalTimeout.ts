import { defineConfig, devices } from "@playwright/test";

const r = defineConfig({
  timeout: 1 * 1000,
  testMatch: "errorDetails/*.ts",
  globalTimeout: 1 * 1000,
  workers: 1,
  retries: 0,
  use: {
    baseURL: "http://localhost:3000",
    actionTimeout: 0,
    trace: "off",
    video: "off",
    screenshot: "off",
  },

  reporter: [
    [
      "@currents/playwright",
      {
        ciBuildId: Date.now().toString(),
        recordKey: "KPEvZL0LDYzcZH3U",
        projectId: "bnsqNa",
      },
    ],
  ],

  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
  ],
});

export default r;
