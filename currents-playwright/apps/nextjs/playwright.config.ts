import { currentsReporter } from "@currents/playwright";
import { PlaywrightTestConfig, devices } from "@playwright/test";
import path from "path";
import { homeUrl } from "./homeUrl";
import { loadEnvVariables } from "./loadEnvVariables";

loadEnvVariables();

const baseURL = homeUrl;

// Reference: https://playwright.dev/docs/test-configuration
const config: PlaywrightTestConfig = {
  timeout: 5 * 1000,
  testDir: path.join(
    __dirname,
    // eslint-disable-next-line turbo/no-undeclared-env-vars
    process.env.GITHUB_ACTIONS ? "e2e_shard" : "e2e"
  ),
  outputDir: "test-results/",
  workers: 5,
  use: {
    baseURL,
    trace: "on",
    video: "on",
    screenshot: "on",
  },
  reporter: [
    currentsReporter({
      ciBuildId: Date.now().toString(),
      projectId: "bnsqNa",
      recordKey: "KPEvZL0LDYzcZH3U",
      tag: ["playwright", "test"],
    }),
  ],
  projects: [
    {
      name: "Desktop Chrome",
      // metadata: {
      //   pwc: {
      //     tags: ["desktop", "chrome"],
      //   },
      // },
      use: {
        ...devices["Desktop Chrome"],
      },
    },
    // {
    //   name: "Desktop Edge",
    //   use: {
    //     ...devices["Desktop Edge"],
    //   },
    // },
    // {
    //   name: "Desktop Firefox",
    //   use: {
    //     ...devices["Firefox"],
    //   },
    // },
  ],
};
export default config;
