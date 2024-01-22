import { TestCase, TestResult } from "@playwright/test/reporter";
import { omit, pick } from "lodash";

export function getRawTestCase(testCase: TestCase): unknown {
  return {
    ...pick(
      testCase,
      "title",
      "location",
      "results",
      "_only",
      "expectedStatus",
      "timeout",
      "retries"
    ),
    results: testCase.results.map(getTestResults),
  };
}

function getTestResults(r: TestResult) {
  return {
    ...omit(r, "steps", "attachments"),
    attachments: r.attachments.map((a) => omit(a, "body")),
  };
}
