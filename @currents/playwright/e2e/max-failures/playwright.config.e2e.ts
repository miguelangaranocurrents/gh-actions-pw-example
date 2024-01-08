import { currentsReporter } from "@currents/playwright";
import { devices, PlaywrightTestConfig } from "@playwright/test";

const config: PlaywrightTestConfig = {
  globalSetup: "@currents/msw/global-setup",
  retries: 1,
  maxFailures: 1,
  timeout: 500,
  expect: {
    timeout: 500,
  },
  testMatch: "*.e2e.ts",
  reporter: [
    currentsReporter({
      recordKey: "xxx",
      projectId: "xxx",
      ciBuildId: "xxx",
    }),
  ],
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
  ],
  outputDir: "test-results/",
};

export default config;
