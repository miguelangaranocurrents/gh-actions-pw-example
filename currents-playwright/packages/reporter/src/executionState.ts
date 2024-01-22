import { FullConfig, TestCase } from "@playwright/test/reporter";
import { debug as _debug } from "./debug";
import {
  getTestCaseProject,
  testToSpecName,
  testToTestId,
} from "./lib/testCase";
import { getTestCaseCurrentsState } from "./results/testCaseStatus";
import { Run } from "./runs";

const debug = _debug.extend("state");

export type TestId = string;
export type ProjectId = string;
export type SpecId = string;

export class TestExecutionState {
  private _testCase: TestCase;

  constructor(testCase: TestCase, readonly projectId: string) {
    this._testCase = testCase;
  }

  get testCase() {
    return this._testCase;
  }

  get titlePath() {
    return `${this.testCase.titlePath().filter(Boolean).join(" > ")}`;
  }

  get currentsState() {
    return getTestCaseCurrentsState(this.testCase);
  }

  isFinished() {
    const allStatuses = this.testCase.results.map((i) => i.status);
    debug("isFinished?: %o", {
      title: this.titlePath,
      allStatuses,
      retries: this.testCase.retries,
    });
    if (allStatuses.includes(this.testCase.expectedStatus)) {
      return true;
    }
    if (allStatuses.length === this.testCase.retries + 1) {
      return true;
    }
    return false;
  }

  setTestCase(testCase: TestCase) {
    this._testCase = testCase;
    return this;
  }

  backfillMissingTestResults() {}
}

export class SpecExecutionState {
  private readonly testExecutions: Record<TestId, TestExecutionState> = {};

  constructor(readonly specName: SpecId, readonly projectId: ProjectId) {}

  createTestExecution(testId: TestId, testCase: TestCase) {
    this.testExecutions[testId] = new TestExecutionState(
      testCase,
      this.projectId
    );
  }

  getTestExecution(testId: TestId) {
    return this.testExecutions[testId];
  }

  getAllTestExecutions() {
    return Object.values(this.testExecutions);
  }

  isFinished() {
    return this.getAllTestExecutions().every((testExecutionState) =>
      testExecutionState.isFinished()
    );
  }

  isFailed() {
    return this.getAllTestExecutions()
      .map((i) => i.currentsState)
      .some((i) => i === "failed");
  }
}

export class ProjectExecutionState {
  readonly specExecutions: Record<SpecId, SpecExecutionState> = {};
  run: Promise<Run | null> = Promise.resolve(null);

  constructor(readonly projectId: ProjectId) {}

  setRun(run: Promise<Run | null>) {
    this.run = run;
    return this;
  }

  upsertSpecExecution(specName: SpecId, projectId: ProjectId) {
    if (!this.specExecutions[specName]) {
      this.specExecutions[specName] = new SpecExecutionState(
        specName,
        projectId
      );
    }
    return this.specExecutions[specName];
  }

  getSpecExecution(specName: SpecId) {
    return this.specExecutions[specName];
  }

  getAllSpecExecutions() {
    return Object.values(this.specExecutions);
  }
}

export class ExecutionState {
  readonly projectExecutions: Record<ProjectId, ProjectExecutionState> = {};
  constructor(readonly config: FullConfig) {}

  upsertProjectExecution(projectId: ProjectId) {
    if (!this.projectExecutions[projectId]) {
      this.projectExecutions[projectId] = new ProjectExecutionState(projectId);
    }
    return this.projectExecutions[projectId];
  }

  getProjectExecution(projectId: ProjectId) {
    return this.projectExecutions[projectId];
  }

  getAllProjectExecutions() {
    return Object.values(this.projectExecutions);
  }

  getAllSpecExecutions() {
    return Object.values(this.projectExecutions).flatMap((p) =>
      p.getAllSpecExecutions()
    );
  }

  getAllTestExecutions() {
    return this.getAllSpecExecutions().flatMap((s) => s.getAllTestExecutions());
  }

  getProjectExecutionForTestCase(t: TestCase) {
    return this.getProjectExecution(getTestCaseProject(t));
  }
  getSpecExecution(t: TestCase) {
    return this.getProjectExecutionForTestCase(t).getSpecExecution(
      testToSpecName(t, this.config)
    );
  }
  getTestExecution(t: TestCase) {
    return this.getSpecExecution(t).getTestExecution(testToTestId(t));
  }
}
