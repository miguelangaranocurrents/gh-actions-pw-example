import { currentsReporter } from "@currents/playwright";
import config from "./pw.config.shared";

const c = {
  ...config,
  reporter: [
    currentsReporter({
      // eslint-disable-next-line turbo/no-undeclared-env-vars
      ciBuildId: process.env.CURRENTS_CI_BUILD_ID ?? "",
      // eslint-disable-next-line turbo/no-undeclared-env-vars
      recordKey: process.env.CURRENTS_RECORD_KEY ?? "",
      // eslint-disable-next-line turbo/no-undeclared-env-vars
      projectId: process.env.CURRENTS_PROJECT_ID ?? "",
      tag: ["runTagA", "runTagB"],
    }),
  ],
};
export default c;
