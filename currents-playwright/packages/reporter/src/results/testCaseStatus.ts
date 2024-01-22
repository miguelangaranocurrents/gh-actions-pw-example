import { TestCase, TestStatus } from "@playwright/test/reporter";
import { flowRight } from "lodash";
import { match } from "ts-pattern";
import { CurrentsTestState } from "./types";

/**
 * Coherce the status of a test case attempt to a single status
 * @param t Test Case
 * @returns
 */
export function getTestCaseStatus(
  t: TestCase
): "passed" | "skipped" | "failed" {
  // if there are no results, it means that the test was interrupted
  if (!t.results?.length) {
    return "skipped";
  }

  const allStatuses = t.results.map((r) => r.status);

  // if all the attempts have similar status
  if (allStatuses.every((status) => status === allStatuses[0])) {
    return match(allStatuses[0])
      .with("skipped", () => "skipped" as const)
      .with("passed", () =>
        t.expectedStatus === "passed" ? "passed" : "failed"
      )
      .with("failed", () =>
        t.expectedStatus === "failed" ? "passed" : "failed"
      )
      .otherwise(() => "failed");
  }

  // if there is at least one passed attempt, and the test is expected to pass, then "passed"
  if (
    t.results.some((r) => r.status === "passed") &&
    t.expectedStatus === "passed"
  ) {
    return "passed";
  }

  // if there is at least one failed attempt, and the test is expected to fail, then "passed"
  if (
    t.results.some((r) => r.status === "failed") &&
    t.expectedStatus === "failed"
  ) {
    return "passed";
  }

  // otherwise, it is a mix of passed and failed attempts, so it is flaky
  // and it doesn't pass the expected status
  return "failed";
}

/**
 * Conver Playwright test status to Currents state
 * @param testStatus
 * @returns
 */
export function statusToCurrentsState(
  testStatus: TestStatus
): CurrentsTestState {
  switch (testStatus) {
    case "timedOut":
      return "failed";
    case "interrupted":
      return "failed";
    case "skipped":
      return "pending";
    default:
      return testStatus;
  }
}

export const getTestCaseCurrentsState = flowRight(
  statusToCurrentsState,
  getTestCaseStatus
);
