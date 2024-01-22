import { expect } from "@jest/globals";

export const screenshot = {
  screenshotId: expect.any(String),
  name: expect.any(String),
  testId: expect.any(String),
  testAttemptIndex: 0,
  path: expect.any(String),
  height: expect.any(Number),
  width: expect.any(Number),
  takenAt: expect.any(String),
  screenshotURL: expect.any(String),
};

export const expectedSpecResults = {
  videoUrl: null,
  stats: expect.objectContaining({
    suites: expect.any(Number),
    tests: expect.any(Number),
    passes: expect.any(Number),
    pending: expect.any(Number),
    skipped: expect.any(Number),
    failures: expect.any(Number),
    wallClockStartedAt: expect.any(String),
    wallClockEndedAt: expect.any(String),
    wallClockDuration: expect.any(Number),
  }),
  playwrightTraces: expect.any(Array),
  screenshots: expect.any(Array),
  tests: expect.any(Array),
  videos: expect.any(Array),
};

export const expectedSpec = expect.objectContaining({
  groupId: expect.any(String),
  spec: expect.any(String),
  instanceId: expect.any(String),
  claimedAt: expect.any(String),
  completedAt: expect.any(String),
  machineId: expect.any(String),
});

export const expectedRunResult = {
  runId: expect.any(String),
  projectId: expect.any(String),
  createdAt: expect.any(String),
  tags: ["runTagA", "runTagB", "tagA", "tagB", "tagC", "newTag"].sort(),
  timeout: { isTimeout: false },
  groups: [
    {
      groupId: "chromium",
      platform: {
        browserName: "chromium",
        browserVersion: "",
        osName: expect.any(String),
        osVersion: expect.any(String),
      },
      createdAt: expect.any(String),
      instances: {
        overall: 7,
        claimed: 7,
        complete: 7,
        passes: 7,
        failures: 0,
      },
      tests: expect.objectContaining({
        overall: 22,
        passes: 22,
        failures: 0,
        pending: 0,
        skipped: 0,
      }),
    },
  ],
  meta: {
    ciBuildId: expect.any(String),
    commit: {
      branch: expect.any(String),
      remoteOrigin: expect.any(String),
      authorEmail: expect.any(String),
      authorName: expect.any(String),
      message: expect.any(String),
      sha: expect.any(String),
      ghaEventData: expect.any(Object),
    },
    platform: {
      browserName: "chromium",
      browserVersion: "",
      osName: expect.any(String),
      osVersion: expect.any(String),
    },
  },
  // specs,
  completionState: "COMPLETE",
  status: "PASSED",
};
