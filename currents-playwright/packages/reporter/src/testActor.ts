import { FullProject } from "@playwright/test";
import {
  FullConfig,
  FullResult,
  Suite,
  TestCase,
  TestResult,
  TestStep,
} from "@playwright/test/reporter";
import { extend, last, uniq } from "lodash";
import pluralize from "pluralize";
import { getCurrentsConfig } from "./config/config";
import { debug as _debug } from "./debug";
import { epilogue } from "./epilogue/formatEpilogue";
import {
  ExecutionState,
  ProjectId,
  SpecExecutionState,
  SpecId,
} from "./executionState";
import { sendCreateInstanceRequest } from "./instances";
import { maybeCancelRun, setCancellationReason } from "./lib/cancellation";
import { relativeFileLocation } from "./lib/relativeFileLocation";
import {
  getTestCaseProject,
  getTestFullTitle,
  testToTestId,
} from "./lib/testCase";
import * as logger from "./logger";
import { WorkerInfo, reportResults } from "./results";
import { sendTestResult } from "./results/api";
import { getTestCaseWorker } from "./results/testCase";
import * as Runs from "./runs";
// import { getFullTestSuite } from "./scanner";

const debug = _debug.extend("actor");
export class TestActor {
  public readonly config: FullConfig;
  public readonly executionState: ExecutionState;
  readonly warnings: string[][] = [];
  readonly errors: string[][] = [];

  private instanceCreations: Record<
    ProjectId,
    Record<
      SpecId,
      Promise<
        { instanceId: string; claimedCount: number; spec: string } | undefined
      >
    >
  > = {};
  private resultCreations: Record<ProjectId, Record<SpecId, Promise<void>>> =
    {};

  private testResultUploads: Promise<any>[] = [];

  constructor({ suites }: Suite, config: FullConfig) {
    this.config = config;
    this.executionState = new ExecutionState(config);
    suites.forEach((s) => {
      debug("Creating project execution state for project: %s", s.title);
      const testCases = s.allTests();

      const projectExecution = this.executionState
        .upsertProjectExecution(s.title)
        .setRun(
          this.createRun({
            projectId: s.title,
            project: s.project(),
            createRunParams: {
              specs: uniq(testCases.map((t) => testToSpecName(t, config))),
              browser: {
                name: s.title,
                version: "",
              },
              tests: testCases.map((t) => ({
                spec: testToSpecName(t, config),
                title: getTestFullTitle(t),
              })),
              group: s.title,
            },
          })
        );

      testCases.forEach((tc) => {
        projectExecution
          .upsertSpecExecution(
            testToSpecName(tc, config),
            getTestCaseProject(tc)
          )
          .createTestExecution(testToTestId(tc), tc);
      });
    });
  }

  private async createRun(params: {
    projectId: string;
    project?: FullProject;
    createRunParams: Omit<Runs.CreateRunParams, "projectTags">;
  }) {
    // try getting the full unsharded suite
    // const fullTestSuite = await getFullTestSuite(this.config);
    // debug("fullTestSuite: %o", fullTestSuite);

    return Runs.createRun({
      ...params.createRunParams,
      projectTags: params.project?.metadata?.pwc?.tags ?? [],
    }).then((run) => {
      if (!run) {
        this.warn(
          "[currents] Could not start recording for project: %s",
          params.projectId
        );
      }

      if (run?.cancellation) {
        setCancellationReason(run.cancellation);
        maybeCancelRun();
      }
      return run;
    });
  }

  public onTestBegin(test: TestCase) {
    this.startCreatingInstance(test);
  }

  public onTestEnd(test: TestCase, result: TestResult) {
    const projectId = getTestCaseProject(test);
    const specName = testToSpecName(test, this.config);

    this.sendTestResult({
      test,
      result,
      specName,
      projectId,
    });

    const specExecution = this.executionState.getSpecExecution(test);
    const testExecution = this.executionState
      .getTestExecution(test)
      .setTestCase(test);

    debug("Test end: %o", {
      title: testExecution.titlePath,
      attempt: result.retry,
      retries: test.retries,
      expectedStatus: test.expectedStatus,
      actualStatus: result.status,
      currentsState: testExecution.currentsState,
      isTestFinished: testExecution.isFinished(),
      isSpecFinished: specExecution.isFinished(),
    });

    if (specExecution.isFinished()) {
      this.startProcessingResults(specExecution);
    } else {
      debug("Waiting for more tests to finish before reporting spec...");
    }
  }

  private sendTestResult(params: {
    test: TestCase;
    result: TestResult;
    specName: string;
    projectId: string;
  }) {
    const config = getCurrentsConfig();
    if (!config) {
      debug("Not sending test result - missing config");
      return;
    }
    // @ts-ignore
    if (!config.enableTestResults) {
      return;
    }
    this.testResultUploads.push(
      this.executionState
        .getProjectExecution(params.projectId)
        .run.then((run) => {
          if (!run) {
            debug(
              "Not sending test result - missing run for %s",
              params.projectId
            );
            return;
          }

          return sendTestResult({
            runId: run.runId,
            groupId: run.groupId,
            reportedAt: new Date().toISOString(),
            result: params.result,
            recordKey: config.recordKey,
            retry: params.result.retry,
            status: params.result.status,
            title: getTestFullTitle(params.test),
            spec: params.specName,
          });
        })
        .catch((e) => {
          debug("Error sending test result: %o", e);
        })
    );
  }
  public onStepBegin(
    test: TestCase,
    result: TestResult,
    step: TestStep
  ): void {}

  public onStepEnd(test: TestCase, result: TestResult, step: TestStep): void {}

  private warn(...args: any[]) {
    this.warnings.push([...args]);
    logger.warn(...args);
  }

  private async startProcessingResults(spec: SpecExecutionState) {
    const projectId = spec.projectId;
    const specName = spec.specName;

    if (!this.resultCreations[projectId]) {
      this.resultCreations[projectId] = {};
    }
    if (!!this.resultCreations[projectId][specName]) {
      debug("Result processing already started: %s %s", projectId, specName);
      return;
    }

    debug("Starting processing spec result: %o", {
      projectId,
      spec: specName,
    });

    this.resultCreations[projectId][specName] = this.createResultForSpec(spec);
  }

  async createResultForSpec(spec: SpecExecutionState) {
    const config = getCurrentsConfig();
    if (!config) {
      return;
    }

    const projectId = spec.projectId;
    const specName = spec.specName;
    const testCaseExecutions = spec.getAllTestExecutions();
    const failed = spec.isFailed();

    const createInstanceRequest =
      await this.instanceCreations[projectId][specName];

    if (!createInstanceRequest?.instanceId) {
      this.warn(
        "[currents] Missing reporting instructions for file, skipping: [%s] › %s",
        projectId,
        specName
      );
      return;
    }

    if (createInstanceRequest?.claimedCount > 1) {
      this.warn(
        '[currents] Results already reported for build "%s" [%s] › %s',
        config.ciBuildId,
        projectId,
        specName
      );
      return;
    }

    return sendResultsForSpec(
      {
        instanceId: createInstanceRequest.instanceId,
        testCases: testCaseExecutions.map((i) => i.testCase),
        config: this.config,
      },
      { status: failed ? "failed" : "passed" }
    );
  }

  private startCreatingInstance(test: TestCase) {
    const projectId = getTestCaseProject(test);
    const specName = testToSpecName(test, this.config);
    if (!this.instanceCreations[projectId]) {
      this.instanceCreations[projectId] = {};
    }
    if (!!this.instanceCreations[projectId][specName]) {
      debug("Instance creation already started: %s %s", projectId, specName);
      return;
    }

    debug("Starting instance creation: %o", {
      projectId,
      spec: specName,
    });
    this.instanceCreations[projectId][specName] = this.createInstanceForSpec({
      projectId,
      specName,
      worker: getTestCaseWorker(test),
    });
  }

  async createInstanceForSpec({
    projectId,
    specName,
    worker,
  }: {
    projectId: string;
    specName: string;
    worker: WorkerInfo;
  }) {
    debug("Getting run for projectId", {
      projectId,
    });

    const run = await this.executionState.getProjectExecution(projectId).run;

    if (!run) {
      return;
    }

    const { runId, groupId, machineId } = run;

    const { instanceId, claimedCount, ...rest } =
      await sendCreateInstanceRequest({
        runId,
        groupId,
        machineId,
        spec: specName,
        worker,
      });

    debug(
      "Create instance response: %s %s %o",
      worker,
      projectId,
      specName,
      instanceId,
      claimedCount
    );
    return { instanceId, claimedCount, spec: specName };
  }

  public async awaitAllResults() {
    const allPromises = Object.values(this.resultCreations).flatMap((spec) =>
      Object.values(spec)
    );

    debug("Awaiting for completion of reporting tasks...");
    return Promise.allSettled([...allPromises, ...this.testResultUploads]);
  }

  public async getRunURL() {
    const projects = this.executionState.getAllProjectExecutions();
    if (!projects.length) {
      return;
    }
    return (await projects[0].run)?.runUrl;
  }

  public async getRunId() {
    const projects = this.executionState.getAllProjectExecutions();
    if (!projects.length) {
      return;
    }
    return (await projects[0].run)?.runId;
  }

  public getSpecExecutionsWithNoResults() {
    const resultSpecs = Object.values(this.resultCreations).flatMap((spec) =>
      Object.keys(spec)
    );

    const resultSpecsSet = new Set(resultSpecs);
    const nonResultSpecs: SpecExecutionState[] = [];
    this.executionState.getAllSpecExecutions().forEach((s) => {
      if (!resultSpecsSet.has(s.specName)) {
        nonResultSpecs.push(s);
      }
    });
    return nonResultSpecs;
  }

  /**
   * PW can not run certain tests because of various reasons
   * For example - maxFailures is reached, or SIGINT is received
   * Here we try to find such tests and report them as skipped.
   * See https://github.com/search?q=repo%3Amicrosoft%2Fplaywright%20didNotRun&type=code
   */
  public reportSpecsWithNoResults() {
    function getFakeTestResult(retry: number): TestResult {
      return {
        status: "skipped",
        workerIndex: -1,
        parallelIndex: 0,
        duration: 0,
        startTime: new Date(),
        stdout: [
          "Playwright could not run this test because of maximum allowed failures, or SIGINT was received.",
        ],
        stderr: [
          "Playwright could not run this test because of maximum allowed failures, or SIGINT was received.",
        ],
        attachments: [],
        steps: [],
        error: {
          message: "Playwright did not run this test",
          stack: "",
        },
        errors: [],
        retry,
      };
    }

    this.getSpecExecutionsWithNoResults().forEach((s) => {
      const nonFinishedTests = s
        .getAllTestExecutions()
        .filter((te) => !te.isFinished());
      if (!nonFinishedTests.length) {
        return;
      }
      const it = nonFinishedTests.length === 1 ? "it" : "them";
      logger.warn(
        `Playwright did not run ${pluralize(
          "test",
          nonFinishedTests.length,
          true
        )}, reporting ${it} as ${logger.magenta("skipped")}:`
      );
      nonFinishedTests.forEach((te) => {
        logger.info(logger.dim(`- ${te.titlePath}`));
        // backfill results for non finished tests with skipped
        const fakeTestCase = extend(te.testCase);
        const resultsToCreate =
          te.testCase.retries + 1 - fakeTestCase.results.length;
        Array.from({ length: resultsToCreate }).forEach((i) => {
          fakeTestCase.results.push(
            getFakeTestResult(fakeTestCase.results.length + 1)
          );
        });

        this.onTestBegin(fakeTestCase);
        this.onTestEnd(
          fakeTestCase,
          last(fakeTestCase.results) ?? getFakeTestResult(0)
        );
      });
      logger.divider();
    });
  }
}

function testToSpecName(testCase: TestCase, config: FullConfig) {
  return relativeFileLocation(testCase.location, config.rootDir);
}

export async function sendResultsForSpec(
  {
    instanceId,
    testCases,
    config,
  }: {
    instanceId: string;
    testCases: Array<TestCase>;
    config: FullConfig<{}, {}>;
  },
  result: Pick<FullResult, "status">
) {
  const testCasesWithClientId = testCases.map((testCase, index) =>
    extend(testCase, {
      clientId: indexToClientId(index),
    })
  );

  const stdOutChunks = testCases
    .flatMap((t) => t.results)
    .flatMap((r) => [...r.stdout, r.stderr])
    .filter((chunk): chunk is string => typeof chunk === "string");

  const { failures, summaryMessage } = epilogue(testCases, config, result);
  const stdOut = stdOutChunks.join("\n") + failures.join("\n") + summaryMessage;

  await Promise.allSettled([
    reportResults({
      instanceId,
      testCases: testCasesWithClientId,
      stdout: [stdOut, ...logger.getLogDrain()].join("\n"),
    }),
  ]);

  maybeCancelRun();
}

function indexToClientId(index: number) {
  return `r${index}`;
}
