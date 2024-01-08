import { currentsReporter } from "@currents/playwright";
import { devices, PlaywrightTestConfig } from "@playwright/test";

const config: PlaywrightTestConfig = {
  retries: 1,
  timeout: 500,

  expect: {
    timeout: 500,
  },

  reporter: [
    currentsReporter({
      recordKey: "Fgt2j7QCjNedC2zG",
      projectId: "0FrY62",
      ciBuildId: Date.now().toString(),
      cancelAfterFailures: false,
    }),
  ],
  use: {
    baseURL: "http://localhost:3000",
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
    // {
    //   name: "firefox",
    //   use: {
    //     ...devices["Firefox"],
    //   },
    // },
  ],

  /* Folder for test artifacts such as screenshots, videos, traces, etc. */
  outputDir: "test-results/",
};

export default config;
