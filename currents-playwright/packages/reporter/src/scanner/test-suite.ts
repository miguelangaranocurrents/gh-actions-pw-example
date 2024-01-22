import fs from "fs";
import { isMatching, match, P } from "ts-pattern";
import { CurrentsConfig } from "../config";


export const getFSTestSuite = (config: CurrentsConfig) => match(config)
    .with({ testSuiteFile: P.not(P.nullish) }, (c) => c.testSuiteFile)
    .with(
      { testSuiteFile: P.string },
      (c) => isMatching({ testSuite: P.nullish, testSuiteFile: P.string }, c),
      ({ testSuiteFile }) => {
        try {
          return JSON.parse(fs.readFileSync(testSuiteFile, "utf-8"));
        } catch (e) {
          return null;
        }
      }
    )
    .otherwise(() => null);
