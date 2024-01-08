import {
  FullConfig,
  Reporter,
  Suite,
  TestCase,
  TestError,
  TestResult,
  TestStep,
} from "@playwright/test/reporter";
import fs from "fs";
import { P, match } from "ts-pattern";
import {
  CurrentsConfig,
  getCurrentsConfig,
  setCurrentsConfig,
} from "../config/config";
import { debug as _debug } from "../debug";
import { setPWVersion } from "../http";
import { ValidationError } from "../lib/error";
import { addEventListeners, removeEventListeners } from "../lib/pubsub";
import * as logger from "../logger";
import { finalizeDebug, initDebug } from "../remote-debug";
import { uploadWarnings } from "../results";
import { TestActor } from "../testActor";

const debug = _debug.extend("default");
const debugStep = _debug.extend("step");

export class DefaultReporter implements Reporter {
  private errors: TestError[] = [];
  private _testActor: TestActor | null = null;

  private get testActor() {
    if (!this._testActor) {
      throw new Error("@currents/playwright panic: Test actor not initialized");
    }

    return this._testActor;
  }
  constructor(reporterOptions?: Partial<CurrentsConfig>) {
    try {
      setCurrentsConfig(reporterOptions);
      initDebug({
        source: "core",
        mode: getCurrentsConfig()?.debug ?? false,
      });
    } catch (error) {
      match(error)
        .with(P.instanceOf(ValidationError), () => {
          process.exit(1);
        })
        .otherwise((e) => {
          logger.error("Unexpected error", e);
          throw new Error("Unexpected error");
        });
    }
  }

  printsToStdio() {
    return false;
  }

  onBegin(config: FullConfig, suite: Suite) {
    debug(
      "Beginning tests execution: %o",
      suite.allTests().map((t) => t.titlePath())
    );
    setPWVersion(config.version);
    addEventListeners();
    this._testActor = new TestActor(suite, config);
  }

  onError(error: TestError): void {
    logger.error("Global error reported by test runner: %o", error);
    this.errors.push(error);
  }

  onStepBegin(test: TestCase, result: TestResult, step: TestStep): void {
    debugStep(
      "[step  in] %s :: %s",
      test.titlePath().filter(Boolean).join(" > "),
      step.title
    );
    this.testActor.onStepEnd(test, result, step);
  }

  onStepEnd(test: TestCase, result: TestResult, step: TestStep): void {
    debugStep(
      "[step out] %s :: %s [%dms] [%s]",
      test.titlePath().filter(Boolean).join(" > "),
      step.title,
      step.duration,
      step.error?.message ?? "ok"
    );
    this.testActor.onStepEnd(test, result, step);
  }

  onTestBegin(test: TestCase) {
    debug("Test begin: %s", test.titlePath().filter(Boolean).join(" > "));
    this.testActor.onTestBegin(test);
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    debug("Test end: %s", test.titlePath().filter(Boolean).join(" > "));
    this.testActor.onTestEnd(test, result);
  }

  // this is the only async callback
  async onEnd() {
    try {
      logger.divider();

      const allSpecs = this.testActor.executionState.getAllSpecExecutions();

      if (!allSpecs.length) {
        logger.warn("No tests detected, skipping upload");
        logger.divider();
        return {
          status: "passed" as const,
        };
      }

      if (processErrors(this.errors).length > 0) {
        logger.warn("Processing errors:");
        this.errors.forEach((e) => console.log(e.message));
      }
      if (this.testActor.warnings.length) {
        logger.warn("Processing errors:");
        this.testActor.warnings.forEach((w) => console.log(...w));
      }
      if (uploadWarnings.size > 0) {
        logger.warn("Upload warnings:");
        uploadWarnings.forEach((w) => console.log(w));
      }

      const runStatus = allSpecs.some((s) => s.isFailed())
        ? ("failed" as const)
        : ("passed" as const);

      // report non-completed retries
      this.testActor.reportSpecsWithNoResults();

      logger.title("Uploading results to Currents.dev...");

      await this.testActor.awaitAllResults();

      const runUrl = await this.testActor.getRunURL();
      if (!runUrl) {
        logger.title("Cloud Run Finished");
      } else {
        logger.title("Cloud Run Finished: %s", runUrl);
        if (process.env.CURRENTS_RUN_URL_FILE) {
          console.log(
            "Writing run url to file",
            process.env.CURRENTS_RUN_URL_FILE
          );
          fs.writeFileSync(process.env.CURRENTS_RUN_URL_FILE, runUrl);
        }
      }

      logger.divider();

      await finalizeDebug({ runId: await this.testActor.getRunId() });

      if (process.env._CURRENTS_E2E_TESTS) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      return {
        status: runStatus,
      };
    } catch (error) {
      console.error(error);
      return {
        status: "failed" as const,
      };
    } finally {
      removeEventListeners();
    }
  }
}

function processErrors(errors: TestError[]) {
  return errors.map((e) => ({
    spec: tryToFindSpecFile(e),
    error: `${e.message}\n ${e.stack}` || "",
  }));
}

function tryToFindSpecFile(error: TestError): string {
  if (!error.stack) {
    return "";
  }
  const splitBySpace = error.stack.split(" ");
  const possibleFileNames = splitBySpace.filter(
    (s) => s.includes(".ts:") || s.endsWith(".js:")
  );
  const fileName = possibleFileNames[0];
  if (!fileName) {
    return "";
  }
  return fileName.split("/")?.pop()?.split(":")[0] ?? "";
}
