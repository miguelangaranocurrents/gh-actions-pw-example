import { currentsReporter } from "@currents/playwright";
import { defineConfig } from "@playwright/test";

export default defineConfig({
  reporter: [
    currentsReporter({
      // eslint-disable-next-line turbo/no-undeclared-env-vars
      ciBuildId: process.env.CURRENTS_CI_BUILD_ID ?? "",
      // eslint-disable-next-line turbo/no-undeclared-env-vars
      recordKey: process.env.CURRENTS_RECORD_KEY ?? "",
      // eslint-disable-next-line turbo/no-undeclared-env-vars
      projectId: process.env.CURRENTS_PROJECT_ID ?? "",
      tag: ["runTagA", "runTagB"],
      cancelAfterFailures: 1,
    }),
  ],
});
