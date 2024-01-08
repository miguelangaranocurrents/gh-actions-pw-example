import { TestCase } from "@playwright/test/reporter";
import { isNil } from "lodash";
import { getTestFullTitle } from "../lib/testCase";
import {
  getErrorDetails,
  getTestAttemptError,
  getTestCaseDisplayError,
} from "./testCaseError";
import {
  getTestCaseCurrentsState,
  statusToCurrentsState,
} from "./testCaseStatus";
import { isTestCaseFlaky } from "./tests";
import { Test, TestCaseWithClientId } from "./types";

export function playwrightTestSuiteToTest(
  testCases: TestCaseWithClientId[]
): Test[] {
  return testCases.map((tc) => {
    const tcProject = getTestCaseProject(tc);
    const attempts = tc.results.map((r) => ({
      rawStatus: r.status,
      // convert playwright status to currents status
      state: statusToCurrentsState(r.status),
      // attempt can have multiple errors, but we pick the one chosed by playwright
      error: getTestAttemptError(r, tcProject),
      // ...and we store all other errors for the test attempt
      errors: r.errors.map((e) => getErrorDetails(e, tcProject)),
      wallClockStartedAt: r.startTime.toISOString(),
      wallClockDuration: r.duration,
      videoTimestamp: 0,
      workerIndex: r.workerIndex,
    }));

    return {
      title: getTestFullTitle(tc),
      expectedStatus: tc.expectedStatus,
      outcome: tc.outcome(),
      worker: getTestCaseWorker(tc),
      clientId: tc.clientId,
      displayError: getTestCaseDisplayError(tc),
      state: getTestCaseCurrentsState(tc),
      annotations: tc.annotations,

      isFlaky: isTestCaseFlaky(tc),
      attempts,
    };
  });
}

export function getTestCaseWorker(testCase: TestCase) {
  // https://github.com/microsoft/playwright/blob/2bc8cf2fc77ebc1e9897f33c34982c6ee2fd163b/docs/src/test-api/class-workerinfo.md
  return {
    // The unique index of the worker process that is running the test. When a worker is restarted, for example after a failure, the new worker process gets a new unique `workerIndex`.
    workerIndex: isNil(testCase.results[0]?.workerIndex)
      ? -1
      : testCase.results[0].workerIndex,
    // The index of the worker between `0` and `workers - 1`. It is guaranteed that workers running at the same time have a different `parallelIndex`. When a worker is restarted, for example after a failure, the new worker process has the same `parallelIndex`.
    parallelIndex: isNil(testCase.results[0]?.parallelIndex)
      ? -1
      : testCase.results[0].parallelIndex,
  };
}

function getTestCaseProject(item: TestCase) {
  return item.parent.project();
}
