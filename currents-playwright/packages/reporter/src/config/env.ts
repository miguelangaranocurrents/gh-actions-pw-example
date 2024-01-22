import { CurrentsConfig } from "./config";
import { parseAutoCancelFailures } from "./parser";

export const configKey = {
  debug: {
    name: "Debug",
    env: "CURRENTS_DEBUG",
    cli: "--pwc-debug",
  },
  ciBuildId: {
    name: "CI Build ID",
    env: "CURRENTS_CI_BUILD_ID",
    cli: "--ci-build-id",
  },
  recordKey: {
    name: "Record Key",
    env: "CURRENTS_RECORD_KEY",
    cli: "--key",
  },
  projectId: {
    name: "Project ID",
    env: "CURRENTS_PROJECT_ID",
    cli: "--project-id",
  },
  tag: {
    name: "Currents Tag",
    env: "CURRENTS_TAG",
    cli: "--tag",
  },
  cancelAfterFailures: {
    name: "Currents Cancel After Failures",
    env: "CURRENTS_CANCEL_AFTER_FAILURES",
    cli: "--pwc-cancel-after-failures",
  },
  disableTitleTags: {
    name: "Disable Title Tags",
    env: "CURRENTS_DISABLE_TITLE_TAGS",
    cli: "--pwc-disable-title-tags",
  },
  testSuiteFile: {
    name: "Test Suite File",
    env: "CURRENTS_TEST_SUITE_FILE",
    cli: "--pwc-test-suite-file",
  },
} as const;

export function getEnvironmentVariableName(variable: keyof typeof configKey) {
  return configKey[variable].env;
}

export function getCLIOptionName(variable: keyof typeof configKey) {
  return configKey[variable].cli;
}
export function getConfigName(variable: keyof typeof configKey) {
  return configKey[variable].name;
}

/**
 * Converts Environment variables to Currents config.
 * Not all keys are supposed to exist - it is only used for allowing overriding pw.config JS object, the actual config should be parsed and validated after merging.
 * @returns
 */
export function getEnvVariables(): Partial<
  Record<keyof CurrentsConfig, string | string[] | boolean | number | undefined>
> {
  return {
    projectId: process.env[configKey.projectId.env],
    recordKey: process.env[configKey.recordKey.env],
    ciBuildId: process.env[configKey.ciBuildId.env],
    tag: process.env[configKey.tag.env]
      ? process.env[configKey.tag.env]?.split(",").map((i) => i.trim())
      : undefined,
    cancelAfterFailures: parseAutoCancelFailures(
      process.env[configKey.cancelAfterFailures.env]
    ),
    disableTitleTags: process.env[configKey.disableTitleTags.env],
    debug: process.env[configKey.debug.env],
    testSuiteFile: process.env[configKey.testSuiteFile.env],
  };
}
