import { mapValues } from "lodash";
import { getCurrentsConfig } from "../config/config";
import { debug } from "../debug";
import { getCI } from "../env/ciProvider";
import { getGitInfo } from "../env/gitInfo";
import { getPlatformInfo } from "../env/platform";

import { sendCreateRunRequest } from "./api";

const defaulValues = {
  parallel: true,
  tags: [],
  testingType: "e2e",
} as const;

type TestParams = {
  title: string[];
  spec: string;
};

export type CreateRunParams = {
  specs: string[];
  browser: { name: string; version: string };
  tests: TestParams[];
  group: string | null;
  projectTags: string[];
};

export type Run = {
  groupId: string;
  machineId: string;
  runId: string;
  runUrl: string;
  isNewRun: boolean;
  ciBuildId: string;
  cancellation: string | null;
  warnings: Array<
    Record<string, string> & {
      message: string;
    }
  >;
};

export async function createRun(runParams: CreateRunParams) {
  const currentsConfig = getCurrentsConfig();
  if (!currentsConfig) {
    return null;
  }

  const commit = await getGitInfo();
  const platformInfo = await getPlatformInfo();
  const { browser } = runParams;
  const browserInfo = {
    browserName: browser.name,
    browserVersion: browser.version,
  };
  const platform = { ...browserInfo, ...platformInfo };
  const ci = getCI(currentsConfig.ciBuildId);
  const payload = {
    ...defaulValues,
    platform,
    ci,
    commit,
    ...runParams,
    projectId: currentsConfig.projectId,
    recordKey: currentsConfig.recordKey,
    ciBuildId: currentsConfig.ciBuildId,
    tags: [...(currentsConfig.tag ?? []), ...runParams.projectTags],
    removeTitleTags: !!currentsConfig.removeTitleTags,
    disableTitleTags: !!currentsConfig.disableTitleTags,
    autoCancelAfterFailures: currentsConfig.cancelAfterFailures,
    specPattern: "*",
  };

  debug(
    "Creating run: %o",
    mapValues(payload, (v, k) => (k === "recordKey" ? "******" : v))
  );
  try {
    const runCreated = await sendCreateRunRequest(payload);
    debug("Run created: %o", runCreated);
    return runCreated;
  } catch (e) {
    return null;
  }
}
