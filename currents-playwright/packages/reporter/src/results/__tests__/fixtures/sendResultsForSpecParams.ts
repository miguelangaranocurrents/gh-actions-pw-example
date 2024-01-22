import { FullConfig } from "@playwright/test";
import { Suite, TestCase, TestResult } from "@playwright/test/reporter";

export const results: TestResult[] = [
  {
    retry: 0,
    parallelIndex: 3,
    workerIndex: 3,
    duration: 407,
    startTime: new Date("2023-08-01T08:45:18.039Z"),
    stdout: [],
    stderr: [],
    attachments: [
      {
        name: "video",
        path: "/home/user/Projects/currents-playwright/apps/e2e/test-results/basic-4-failures-Expect-the-test-to-fail-chromium/video.webm",
        contentType: "video/webm",
        body: undefined,
      },
      {
        name: "trace",
        path: "/home/user/Projects/currents-playwright/apps/e2e/test-results/basic-4-failures-Expect-the-test-to-fail-chromium/trace.zip",
        contentType: "application/zip",
        body: undefined,
      },
      {
        name: "screenshot",
        path: "/home/user/Projects/currents-playwright/apps/e2e/test-results/basic-4-failures-Expect-the-test-to-fail-chromium/test-finished-1.png",
        contentType: "image/png",
        body: undefined,
      },
    ],
    status: "failed",
    steps: [
      {
        title: "Before Hooks",
        titlePath: () => [],
        parent: undefined,
        category: "hook",
        startTime: new Date("2023-08-01T08:45:18.040Z"),
        duration: 528,
        steps: [
          {
            title: "browserContext.newPage",
            titlePath: () => [],
            category: "pw:api",
            startTime: new Date("2023-08-01T08:45:18.407Z"),
            duration: 161,
            steps: [],
            location: undefined,
          },
        ],
        location: undefined,
      },
      {
        title: "should fail",
        titlePath: () => [],
        parent: undefined,
        category: "test.step",
        startTime: new Date("2023-08-01T08:45:18.569Z"),
        duration: 8,
        steps: [
          {
            title: "expect.toBe",
            titlePath: () => [],
            category: "expect",
            startTime: new Date("2023-08-01T08:45:18.572Z"),
            duration: 4,
            steps: [],
            location: {
              file: "/home/user/Projects/currents-playwright/apps/e2e/basic/4-failures.spec.ts",
              line: 6,
              column: 24,
            },
            error: {
              message:
                "\x1B[2mexpect(\x1B[22m\x1B[31mreceived\x1B[39m\x1B[2m).\x1B[22mtoBe\x1B[2m(\x1B[22m\x1B[32mexpected\x1B[39m\x1B[2m) // Object.is equality\x1B[22m\n" +
                "\n" +
                "Expected: \x1B[32mfalse\x1B[39m\n" +
                "Received: \x1B[31mtrue\x1B[39m",
              stack:
                "Error: \x1B[2mexpect(\x1B[22m\x1B[31mreceived\x1B[39m\x1B[2m).\x1B[22mtoBe\x1B[2m(\x1B[22m\x1B[32mexpected\x1B[39m\x1B[2m) // Object.is equality\x1B[22m\n" +
                "\n" +
                "Expected: \x1B[32mfalse\x1B[39m\n" +
                "Received: \x1B[31mtrue\x1B[39m\n" +
                "    at /home/user/Projects/currents-playwright/apps/e2e/basic/4-failures.spec.ts:6:24\n" +
                "    at /home/user/Projects/currents-playwright/apps/e2e/basic/4-failures.spec.ts:5:14",
            },
          },
        ],
        location: {
          file: "/home/user/Projects/currents-playwright/apps/e2e/basic/4-failures.spec.ts",
          line: 5,
          column: 14,
        },
        error: {
          message:
            "\x1B[2mexpect(\x1B[22m\x1B[31mreceived\x1B[39m\x1B[2m).\x1B[22mtoBe\x1B[2m(\x1B[22m\x1B[32mexpected\x1B[39m\x1B[2m) // Object.is equality\x1B[22m\n" +
            "\n" +
            "Expected: \x1B[32mfalse\x1B[39m\n" +
            "Received: \x1B[31mtrue\x1B[39m",
          stack:
            "Error: \x1B[2mexpect(\x1B[22m\x1B[31mreceived\x1B[39m\x1B[2m).\x1B[22mtoBe\x1B[2m(\x1B[22m\x1B[32mexpected\x1B[39m\x1B[2m) // Object.is equality\x1B[22m\n" +
            "\n" +
            "Expected: \x1B[32mfalse\x1B[39m\n" +
            "Received: \x1B[31mtrue\x1B[39m\n" +
            "    at /home/user/Projects/currents-playwright/apps/e2e/basic/4-failures.spec.ts:6:24\n" +
            "    at /home/user/Projects/currents-playwright/apps/e2e/basic/4-failures.spec.ts:5:14",
        },
      },
      {
        title: "After Hooks",
        titlePath: () => [],
        parent: undefined,
        category: "hook",
        startTime: new Date("2023-08-01T08:45:18.577Z"),
        duration: 193,
        steps: [
          {
            title: "browserContext.close",
            titlePath: () => [],
            category: "pw:api",
            startTime: new Date("2023-08-01T08:45:18.702Z"),
            duration: 47,
            steps: [],
            location: undefined,
          },
        ],
        location: undefined,
      },
    ],
    errors: [
      {
        message:
          "\x1B[2mexpect(\x1B[22m\x1B[31mreceived\x1B[39m\x1B[2m).\x1B[22mtoBe\x1B[2m(\x1B[22m\x1B[32mexpected\x1B[39m\x1B[2m) // Object.is equality\x1B[22m\n" +
          "\n" +
          "Expected: \x1B[32mfalse\x1B[39m\n" +
          "Received: \x1B[31mtrue\x1B[39m",
        stack:
          "Error: \x1B[2mexpect(\x1B[22m\x1B[31mreceived\x1B[39m\x1B[2m).\x1B[22mtoBe\x1B[2m(\x1B[22m\x1B[32mexpected\x1B[39m\x1B[2m) // Object.is equality\x1B[22m\n" +
          "\n" +
          "Expected: \x1B[32mfalse\x1B[39m\n" +
          "Received: \x1B[31mtrue\x1B[39m\n" +
          "    at /home/user/Projects/currents-playwright/apps/e2e/basic/4-failures.spec.ts:6:24\n" +
          "    at /home/user/Projects/currents-playwright/apps/e2e/basic/4-failures.spec.ts:5:14",
      },
    ],
    error: {
      message:
        "\x1B[2mexpect(\x1B[22m\x1B[31mreceived\x1B[39m\x1B[2m).\x1B[22mtoBe\x1B[2m(\x1B[22m\x1B[32mexpected\x1B[39m\x1B[2m) // Object.is equality\x1B[22m\n" +
        "\n" +
        "Expected: \x1B[32mfalse\x1B[39m\n" +
        "Received: \x1B[31mtrue\x1B[39m",
      stack:
        "Error: \x1B[2mexpect(\x1B[22m\x1B[31mreceived\x1B[39m\x1B[2m).\x1B[22mtoBe\x1B[2m(\x1B[22m\x1B[32mexpected\x1B[39m\x1B[2m) // Object.is equality\x1B[22m\n" +
        "\n" +
        "Expected: \x1B[32mfalse\x1B[39m\n" +
        "Received: \x1B[31mtrue\x1B[39m\n" +
        "    at /home/user/Projects/currents-playwright/apps/e2e/basic/4-failures.spec.ts:6:24\n" +
        "    at /home/user/Projects/currents-playwright/apps/e2e/basic/4-failures.spec.ts:5:14",
    },
  },
];

export const testCases: TestCase[] = [
  {
    title: "basic test",
    results: results,
    titlePath: () => [],
    location: {
      file: "/home/user/Projects/currents-playwright/apps/e2e/basic/4-failures.spec.ts",
      line: 3,
      column: 5,
    },
    parent: {
      project: () => config.projects[0],
    } as Suite,
    expectedStatus: "passed",
    timeout: 10000,
    annotations: [],
    retries: 2,
    repeatEachIndex: 0,
    id: "daecfbb82da503123518-bbfdbe83441ec1aaeb62",
    ok: () => true,
    outcome: () => "expected",
  },
];

export const config: FullConfig<{}, {}> = {
  forbidOnly: false,
  fullyParallel: false,
  globalSetup: null,
  globalTeardown: null,
  globalTimeout: 0,
  grep: /.*/,
  grepInvert: null,
  maxFailures: 0,
  metadata: {},
  preserveOutput: "always",
  projects: [
    {
      grep: /.*/,
      grepInvert: null,
      outputDir:
        "/home/user/Projects/currents-playwright/apps/e2e/test-results",
      repeatEach: 1,
      retries: 2,
      name: "chromium",
      testDir: "/home/user/Projects/currents-playwright/apps/e2e",
      snapshotDir: "/home/user/Projects/currents-playwright/apps/e2e",
      testIgnore: [],
      metadata: {},
      testMatch: "**/?(*.)@(spec|test).*",
      timeout: 10000,
      use: {
        baseURL: "http://localhost:3000",
        actionTimeout: 0,
        trace: "on",
        video: "on",
        screenshot: "on",
        userAgent:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.5615.29 Safari/537.36",
        viewport: { width: 1280, height: 720 },
        deviceScaleFactor: 1,
        isMobile: false,
        hasTouch: false,
        defaultBrowserType: "chromium",
      },
      dependencies: [],
    },
  ],
  reporter: [
    [
      "/home/user/Projects/currents-playwright/packages/reporter/dist/index.js",
      undefined,
    ],
  ],
  reportSlowTests: { max: 5, threshold: 15000 },
  configFile:
    "/home/user/Projects/currents-playwright/apps/e2e/playwright.config.ts",
  rootDir: "/home/user/Projects/currents-playwright/apps/e2e",
  quiet: false,
  shard: null,
  updateSnapshots: "missing",
  version: "1.32.3",
  workers: 4,
  webServer: null,
};
