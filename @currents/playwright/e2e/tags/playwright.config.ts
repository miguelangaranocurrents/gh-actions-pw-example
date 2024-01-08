import { devices, PlaywrightTestConfig } from "@playwright/test";

const config: PlaywrightTestConfig = {
  retries: 1,
  timeout: 500,

  expect: {
    timeout: 500,
  },

  use: {
    baseURL: "https://todomvc.com",
    actionTimeout: 0,
    screenshot: "only-on-failure",
    video: "retry-with-video",
    trace: "on",
  },

  projects: [
    {
      name: "chromium",
      metadata: {
        pwc: {
          tags: ["project:chrome"],
        },
      },
      use: {
        ...devices["Desktop Chrome"],
      },
    },
  ],

  /* Folder for test artifacts such as screenshots, videos, traces, etc. */
  outputDir: "test-results/",
};

export default config;
