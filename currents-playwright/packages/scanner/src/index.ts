import { parseTestSuite } from "@currents/pwc-parser";
import Debug from "debug";

const debug = Debug("pwc-scanner");

export const pwcScanner = async (params: {
  project?: string;
  grep: string | null;
  grepInvert: string | null;
  config?: string;
}) => {
  // https://github.com/microsoft/TypeScript/issues/43329
  // @ts-ignore
  const { execa } = (await eval('import("execa")')) as Promise<
    typeof import("execa")
  >;

  const cliParams = [
    "test",
    "--list",
    ...Object.entries(params)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => `${toCliParam(key)}=${value}`),
    "--reporter=list", // do not use any configuration reporters
    "--shard=1/1", // override the option that was potentially set in the configuration file
  ];

  debug("running playwright with the following params: %o", cliParams);

  const execaResult = await execa("playwright", cliParams, {
    env: {
      PWTEST_WATCH: undefined, // no don use if passed
    },
  });

  debug("execa result: %o", execaResult);

  if (execaResult.failed) {
    return { execaResult, result: null };
  }

  return { execaResult, result: parseTestSuite(execaResult.stdout) };
};

const toCliParam = (param: string) => {
  switch (param) {
    case "project":
      return "--project";
    case "grep":
      return "--grep";
    case "grepInvert":
      return "--grep-invert";
    case "config":
      return "--config";
    default:
      throw new Error("Invalid param");
  }
};
