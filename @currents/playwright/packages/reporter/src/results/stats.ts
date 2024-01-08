import { TestCase } from "@playwright/test/reporter";
import { differenceInMilliseconds } from "date-fns";
import { first, last, omit, sumBy } from "lodash";

import { debug } from "../debug";
import { getTestCaseCurrentsState } from "./testCaseStatus";
import { ReporterStats, Stats } from "./types";

export function getStatsFromTests(testCases: TestCase[]): Stats {
  const statList = testCases.map(getTestStats);
  const startTime =
    first(statList.map((r) => r.wallClockStartedAt).sort()) ?? new Date();
  const endTime =
    last(statList.map((r) => r.wallClockEndedAt).sort()) ?? new Date();

  const duration = differenceInMilliseconds(endTime, startTime);

  return {
    suites: 1,
    tests: testCases.length,
    passes: sumBy(statList, "passes"),
    pending: sumBy(statList, "pending"),
    skipped: sumBy(statList, "skipped"),
    failures: sumBy(statList, "failures"),
    wallClockStartedAt: startTime,
    wallClockEndedAt: endTime,
    wallClockDuration: duration,
  };
}

export function getTestStats(
  testCase: TestCase
): Omit<Stats, "suites" | "tests"> {
  debug(
    "getting test stats for test case: %o",
    omit(testCase, "_testType", "parent", "fn")
  );
  const startTimes = testCase.results.map((r) => r.startTime);
  const endTimes = testCase.results.map(
    (r) => new Date(new Date(r.startTime).getTime() + r.duration)
  );
  const sortedStartTimes = startTimes.sort((a, b) => a.getTime() - b.getTime());
  const sortedEndTimes = endTimes.sort((a, b) => a.getTime() - b.getTime());

  const earliestStartTime = sortedStartTimes[0] || new Date();
  const latestEndTime = sortedEndTimes[sortedEndTimes.length - 1] || new Date();
  const duration = latestEndTime.getTime() - earliestStartTime.getTime();
  const status = getTestCaseCurrentsState(testCase);

  const result = {
    passes: ["passed"].includes(status) ? 1 : 0,
    pending: ["pending"].includes(status) ? 1 : 0,
    skipped: ["skipped"].includes(status) ? 1 : 0,
    failures: ["failed"].includes(status) ? 1 : 0,
    wallClockStartedAt: earliestStartTime,
    wallClockEndedAt: latestEndTime,
    wallClockDuration: duration,
  };
  debug("test stats result: %o", result);
  return result;
}

export function getReporterStatsFromStats(stats: Stats): ReporterStats {
  return {
    suites: 1,
    tests: stats.tests,
    passes: stats.passes,
    pending: stats.pending,
    failures: stats.failures,
    start: stats.wallClockStartedAt,
    end: stats.wallClockEndedAt,
    duration: stats.wallClockDuration,
  };
}
