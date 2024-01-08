import { pwcScanner } from "@currents/pwc-scanner";
import { FullConfig } from "@playwright/test";
import { getCurrentsConfig } from "../config";
import { error, warn } from "../logger";
import { getFSTestSuite } from "./test-suite";

export async function getFullTestSuite(config: FullConfig) {
  try {
    const currentsConfig = getCurrentsConfig();
    const testSuiteFromFS = currentsConfig
      ? getFSTestSuite(currentsConfig)
      : null;

    if (testSuiteFromFS) return testSuiteFromFS;

    const internalConfig = getInternalConfig(config);
    if (!internalConfig) return null;

    const scannerConfig = {
      config: config.configFile,
      grep: regexpToString(internalConfig.cliGrep),
      grepInvert: regexpToString(internalConfig.grepInvert),
    };

    return pwcScanner(scannerConfig)
      .then((v) => v.result)
      .catch((e) => {
        error(e);
        return null;
      });
  } catch (e) {
    error(e);
  }
}

function regexpToString(regexp: RegExp | RegExp[] | null): string | null {
  debugger;
  if (!regexp) return null;
  return (
    (Array.isArray(regexp) ? regexp : [regexp])
      // .map((v) => v.source)
      .join(",")
  );
}

type InternalPWConfig = {
  cliGrep: RegExp | RegExp[] | null;
  grepInvert: RegExp | RegExp[] | null;
};
function getInternalConfig(config: FullConfig): InternalPWConfig | null {
  const symbols = Object.getOwnPropertySymbols(config);
  const fullConfig = symbols.find((s) =>
    s.toString().match(/configInternalSymbol/)
  );
  if (!fullConfig) {
    warn("Could not extract internal playwright configuration");
    return null;
  }
  // @ts-ignore
  return config[fullConfig];
}
