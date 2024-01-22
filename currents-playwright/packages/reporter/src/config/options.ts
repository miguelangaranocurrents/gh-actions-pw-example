import { Command } from "@commander-js/extra-typings";
import fs from "fs";
import { getProgram } from "../bin/program";
import { debug } from "../debug";

import { CurrentsConfig } from "./config";

type ExtractSecondTags<T> = T extends Command<any, infer U> ? U : never;
type CLIOptions = ExtractSecondTags<ReturnType<typeof getProgram>>;

/**
 * Converts CLI options to Currents config.
 * Mosty used for converting the keys.
 * @param cliOptions
 * @returns
 */
export function cliOptionsToConfig(
  cliOptions: CLIOptions
): Partial<CurrentsConfig> {
  return {
    ciBuildId: cliOptions.ciBuildId,
    projectId: cliOptions.projectId,
    recordKey: cliOptions.key,
    tag: cliOptions.tag,
    enableTestResults: cliOptions.pwcEnableTestResults,
    removeTitleTags: cliOptions.pwcRemoveTitleTags,
    cancelAfterFailures: cliOptions.pwcCancelAfterFailures,
    disableTitleTags: cliOptions.pwcDisableTitleTags,
    debug: cliOptions.pwcDebug,
    testSuiteFile: cliOptions.pwcTestSuiteFile,
  };
}

export function getCLIOptions() {
  if (process.env.CURRENTS_PWC_CONFIG_PATH) {
    try {
      const result: Partial<CurrentsConfig> = JSON.parse(
        fs.readFileSync(process.env.CURRENTS_PWC_CONFIG_PATH).toString()
      );
      debug("CLI options from file: %o", result);
      return result;
    } catch (error) {
      return {};
    }
  }
  return {};
}
