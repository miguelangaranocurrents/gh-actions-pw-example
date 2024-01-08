import { debug } from "../debug";
import { ValidationError } from "../lib/error";
import { dim, error } from "../logger";

import {
  getCLIOptionName,
  getConfigName,
  getEnvVariables,
  getEnvironmentVariableName,
} from "./env";
import { getCLIOptions } from "./options";

export type CurrentsConfig = {
  /**
   * The id of the build to record the test run. Read more: https://currents.dev/readme/guides/ci-build-id
   */
  ciBuildId?: string;

  /**
   * The id of the project to record the test run.
   */
  projectId: string;

  /**
   * The record key to be used to record the results on the remote dashboard. Read more: https://currents.dev/readme/guides/record-key
   */
  recordKey: string;

  /**
   * A list of tags to be added to the test run.
   */
  tag?: string[];

  /**
   * experimental - enable reporting test-level results
   */
  enableTestResults?: boolean;

  /**
   * remove tags from test names, for example `Test name @smoke` becomes `Test name`
   */
  removeTitleTags?: boolean;

  /**
   * disable extracting tags from test title, e.g. `Test name @smoke` would not be tagged with `smoke`
   */
  disableTitleTags?: boolean;

  /**
   * Abort the run after the specified number of failed tests. Overrides the default Currents Project settings.
   * If set, must be a positive integer or "false" to disable
   */
  cancelAfterFailures?: number | false;

  /**
   * Path to the test suite file to upload to Currents.
   */
  testSuiteFile?: string;

  /**
   * Enable debug logs for the reporter. Optionally, specify "silent" to disable console output
   */
  debug?: boolean | "full" | "remote";
};

type MandatoryCurrentsConfigKeys = "ciBuildId" | "projectId" | "recordKey";

const mandatoryConfigKeys: MandatoryCurrentsConfigKeys[] = [
  "projectId",
  "recordKey",
];

let _config: CurrentsConfig | null = null;

/**
 * Precendence: env > cli > reporter config
 * @param reporterOptions reporter config
 */
export function setCurrentsConfig(reporterOptions?: Partial<CurrentsConfig>) {
  const result = {
    ...removeUndefined(reporterOptions),
    ...removeUndefined(getCLIOptions()),
    ...removeUndefined(getEnvVariables()),
  };

  mandatoryConfigKeys.forEach((i) => {
    if (!result[i]) {
      error(
        `${getConfigName(
          i
        )} is required for Currents Reporter. Use the following methods to set Currents Project ID:
- as environment variable: ${dim(getEnvironmentVariableName(i))}
- as CLI flag of pwc command: ${dim(getCLIOptionName(i))}
- as reporter configuration option ${dim(i)} in ${dim("playwright.config.ts")}

📖 https://currents.dev/readme/integration-with-playwright/currents-playwright`
      );
      throw new ValidationError("Missing required config variable");
    }
  });

  _config = result as CurrentsConfig;
  debug("Resolved Currents config: %o", _config);
}

function removeUndefined<T extends {}>(obj?: T): T {
  return Object.entries(obj ?? {}).reduce((acc, [key, value]) => {
    if (value === undefined) {
      return acc;
    }
    return {
      ...acc,
      [key]: value,
    };
  }, {} as T);
}

export function getCurrentsConfig() {
  return _config;
}
