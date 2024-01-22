import { TestCase, TestResult } from "@playwright/test/reporter";
import { ArrayItemType } from "../lib/lang";

export type TestCaseWithClientId = TestCase & { clientId: string };
export type CurrentsTestState = "failed" | "passed" | "pending" | "skipped";
export type Attachment = ArrayItemType<TestResult["attachments"]>;
export type VideoAttachment = Attachment & {
  testId: string;
  testAttemptIndex: number;
  id: string;
};

export type InstanceResults = {
  reporterStats: ReporterStats;
  stats: Stats;
  video: boolean;
  videos: Array<VideoAttachment>;
  screenshots: Array<ScreenshotWithPath | ScreenshotWithBody>;
  playwrightTraces: PlaywrightTraceWithPath[];
  exception: string | null;
  tests: Test[];
  raw: string;
};

export interface Test {
  state: CurrentsTestState;
  // testId: string;
  displayError: string | null;
  // title: string[];
  config?: null | TestConfig;
  // hookIds: string[];
  // body: string;
  attempts: TestAttempt[];
  // hooks: TestHook[] | null;

  annotations: TestCase["annotations"];
  clientId: string;
}

interface TestAttempt {
  state: CurrentsTestState;
  error: TestError | null;
  wallClockStartedAt: string | null;
  wallClockDuration: number | null;
  videoTimestamp: number | null;
}

interface TestConfig {
  retries:
    | {
        openMode: number;
        runMode: number;
      }
    | number;
}

export type TestError = {
  name: string;
  message: string;
  stack: string;
  codeFrame:
    | {
        line: number;
        column: number;
        originalFile: string;
        relativeFile: string | null;
        absoluteFile: string;
        frame: string;
        language: string;
      }
    | undefined;
};
export type Screenshot = {
  screenshotId: string;
  name: string | null;
  testId: string;
  testAttemptIndex: number;
  takenAt: Date;
  height: number | undefined;
  width: number | undefined;
};

export type ScreenshotWithPath = Screenshot & { path: string };
export type ScreenshotWithBody = Screenshot & { body: Buffer };

export type PlaywrightTrace = {
  traceId: string;
  name: string | null;
  testId: string;
  testAttemptIndex: number;
  takenAt: Date;
};

export type PlaywrightTraceWithPath = PlaywrightTrace & { path: string };

export type Stats = {
  suites: 1;
  tests: number;
  passes: number;
  pending: number;
  skipped: number;
  failures: number;
  wallClockStartedAt: Date;
  wallClockEndedAt: Date;
  wallClockDuration: number;
};

export type ReporterStats = {
  suites: 1;
  tests: number;
  passes: number;
  pending: number;
  failures: number;
  start: Date;
  end: Date;
  duration: number;
};

export type WorkerInfo = {
  workerIndex: number;
  parallelIndex: number;
};
