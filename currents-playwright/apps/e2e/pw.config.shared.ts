import { devices, PlaywrightTestConfig } from "@playwright/test";

const config: PlaywrightTestConfig = {
  timeout: 10 * 1000,

  expect: {
    timeout: 5000,
  },

  testDir: "basic",
  // eslint-disable-next-line turbo/no-undeclared-env-vars
  forbidOnly: !!process.env.GITHUB_ACTIONS,
  // eslint-disable-next-line turbo/no-undeclared-env-vars
  retries: process.env.GITHUB_ACTIONS ? 2 : 0,
  // eslint-disable-next-line turbo/no-undeclared-env-vars
  workers: process.env.GITHUB_ACTIONS ? 1 : undefined,

  use: {
    baseURL: "http://localhost:3000",
    actionTimeout: 0,
    trace: "on",
    video: "on",
    screenshot: "on",
  },

  projects: [
    {
      name: "chromium",
      retries: 2,
      use: {
        ...devices["Desktop Chrome"],
      },
    },
  ],

  /* Folder for test artifacts such as screenshots, videos, traces, etc. */
  outputDir: "test-results/",
};

export default config;
