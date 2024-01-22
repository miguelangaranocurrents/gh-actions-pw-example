import { args } from "./args";
import { keys } from "./keys";

export function getValidatedArgs() {
  const outFile =
    keys.outFile in args ? args[keys.outFile] : "./pwc-scanner-output.json";

  if (!outFile) {
    const errorString = "--out-file is not set";
    throw new Error(errorString);
  }

  const grep =
    keys.grep in args
      ? args[keys.grep]
      : keys.g in args
      ? args[keys.g]
      : undefined;

  const config =
    keys.config in args
      ? args[keys.config]
      : keys.c in args
      ? args[keys.c]
      : undefined;

  return {
    project: args["--project"],
    grepInvert: args["--grep-invert"],
    grep,
    config,
    outFile,
  };
}
