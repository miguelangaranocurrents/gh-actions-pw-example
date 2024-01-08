import { describe, expect, it } from "@jest/globals";
import { TestCase, TestStatus } from "@playwright/test/reporter";
import { getTestCaseStatus } from "../testCaseStatus";

describe("getTestCaseStatus", () => {
  type TestScenario = {
    expected: TestStatus;
    expectedStatus: TestStatus;
    results: Array<{
      status: TestStatus;
      retry?: number;
    }>;
  };

  const singleAttemptTestCases: TestScenario[] = [
    { expected: "skipped", expectedStatus: "passed", results: [] },
    {
      expected: "skipped",
      expectedStatus: "skipped",
      results: [
        {
          status: "skipped",
        },
      ],
    },
    {
      expected: "passed",
      expectedStatus: "passed",
      results: [
        {
          status: "passed",
        },
      ],
    },
    {
      expected: "failed",
      expectedStatus: "passed",
      results: [
        {
          status: "failed",
        },
      ],
    },
    {
      expected: "failed",
      expectedStatus: "passed",
      results: [
        {
          status: "timedOut",
        },
      ],
    },
    {
      expected: "failed",
      expectedStatus: "passed",
      results: [
        {
          status: "interrupted",
        },
      ],
    },
  ];

  const shouldPass: TestScenario[] = [
    {
      expected: "passed",
      expectedStatus: "passed",
      results: [
        {
          status: "passed",
          retry: 0,
        },
        {
          status: "passed",
          retry: 1,
        },
      ],
    },
    {
      expected: "passed",
      expectedStatus: "passed",
      results: [
        {
          status: "passed",
          retry: 0,
        },
        {
          status: "timedOut",
          retry: 1,
        },
      ],
    },
    {
      expected: "passed",
      expectedStatus: "passed",
      results: [
        {
          status: "passed",
          retry: 0,
        },
        {
          status: "skipped",
          retry: 1,
        },
      ],
    },
    {
      expected: "passed",
      expectedStatus: "passed",
      results: [
        {
          status: "passed",
          retry: 0,
        },
        {
          status: "interrupted",
          retry: 1,
        },
      ],
    },
  ];

  const shouldFail: TestScenario[] = [
    {
      expected: "failed",
      expectedStatus: "passed",
      results: [
        {
          status: "failed",
          retry: 0,
        },
        {
          status: "failed",
          retry: 1,
        },
      ],
    },
    {
      expected: "failed",
      expectedStatus: "passed",
      results: [
        {
          status: "failed",
          retry: 0,
        },
        {
          status: "timedOut",
          retry: 1,
        },
      ],
    },
    {
      expected: "failed",
      expectedStatus: "passed",
      results: [
        {
          status: "failed",
          retry: 0,
        },
        {
          status: "skipped",
          retry: 1,
        },
      ],
    },
    {
      expected: "failed",
      expectedStatus: "passed",
      results: [
        {
          status: "failed",
          retry: 0,
        },
        {
          status: "interrupted",
          retry: 1,
        },
      ],
    },
    {
      expected: "failed",
      expectedStatus: "passed",
      results: [
        {
          status: "failed",
          retry: 0,
        },
        {
          status: "interrupted",
          retry: 1,
        },
        {
          status: "timedOut",
          retry: 2,
        },
        {
          status: "skipped",
          retry: 3,
        },
      ],
    },
  ];

  const revertOutcome: TestScenario[] = [
    {
      expected: "failed",
      expectedStatus: "passed",
      results: [
        {
          status: "failed",
          retry: 0,
        },
      ],
    },
    {
      expected: "passed",
      expectedStatus: "failed",
      results: [
        {
          status: "failed",
          retry: 0,
        },
      ],
    },
  ];
  const shouldSkip: TestScenario[] = [
    {
      expected: "skipped",
      results: [
        {
          status: "skipped",
          retry: 0,
        },
        {
          status: "skipped",
          retry: 1,
        },
      ],
    },
  ];
  const multipleAttemptTestCases: TestScenario[] = [
    ...shouldPass,
    ...shouldFail,
    ...shouldSkip,
  ];
  // it.each([singleAttemptTestCases[2]])(
  it.each([
    ...singleAttemptTestCases,
    ...multipleAttemptTestCases,
    ...revertOutcome,
  ])("should handle %j", ({ expected, results, expectedStatus }) =>
    expect(
      getTestCaseStatus({
        expectedStatus,
        results,
      } as TestCase)
    ).toBe(expected)
  );
});
