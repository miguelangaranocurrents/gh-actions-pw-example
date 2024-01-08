import { TestCase } from "@playwright/test/reporter";
import { getTestFullTitle } from "../lib/testCase";
import { TestCaseWithClientId } from "./types";

const defaultTestsValues = {
  config: { video: true, videoUploadOnPasses: true },
  hooks: [],
};

const defaultTest = {
  body: "",
  config: {},
  hookIds: [],
};

export function getTests(testCases: TestCaseWithClientId[]) {
  return {
    ...defaultTestsValues,
    tests: testCases.map((test) => ({
      ...defaultTest,
      clientId: test.clientId,
      title: getTestFullTitle(test),
    })),
  };
}

export function getAttachmentsFromTestCases(testCases: TestCaseWithClientId[]) {
  return testCases
    .map((t) => ({ clientId: t.clientId, results: t.results }))
    .flatMap(({ results, clientId }) =>
      results.flatMap((r) =>
        r.attachments.map((a) => ({
          ...a,
          testId: clientId,
          testAttemptIndex: r.retry,
        }))
      )
    );
}

// test is flaky if there are multiple attempts,
// some attempts match the expected outcome and some don't
export function isTestCaseFlaky(tc: TestCase) {
  return tc.outcome() === "flaky";
}
