import { Reporter, FullConfig, Suite, TestError, TestCase, TestResult, TestStep } from '@playwright/test/reporter';

type CurrentsConfig = {
    /**
     * The id of the build to record the test run. Read more: https://currents.dev/readme/guides/ci-build-id
     */
    ciBuildId?: string;
    /**
     * The id of the project to record the test run.
     */
    projectId: string;
    /**
     * The record key to be used to record the results on the remote dashboard. Read more: https://currents.dev/readme/guides/record-key
     */
    recordKey: string;
    /**
     * A list of tags to be added to the test run.
     */
    tag?: string[];
    /**
     * experimental - enable reporting test-level results
     */
    enableTestResults?: boolean;
    /**
     * remove tags from test names, for example `Test name @smoke` becomes `Test name`
     */
    removeTitleTags?: boolean;
    /**
     * disable extracting tags from test title, e.g. `Test name @smoke` would not be tagged with `smoke`
     */
    disableTitleTags?: boolean;
    /**
     * Abort the run after the specified number of failed tests. Overrides the default Currents Project settings.
     * If set, must be a positive integer or "false" to disable
     */
    cancelAfterFailures?: number | false;
    /**
     * Path to the test suite file to upload to Currents.
     */
    testSuiteFile?: string;
    /**
     * Enable debug logs for the reporter. Optionally, specify "silent" to disable console output
     */
    debug?: boolean | "full" | "remote";
};

declare class DefaultReporter implements Reporter {
    private errors;
    private _testActor;
    private get testActor();
    constructor(reporterOptions?: Partial<CurrentsConfig>);
    printsToStdio(): boolean;
    onBegin(config: FullConfig, suite: Suite): void;
    onError(error: TestError): void;
    onStepBegin(test: TestCase, result: TestResult, step: TestStep): void;
    onStepEnd(test: TestCase, result: TestResult, step: TestStep): void;
    onTestBegin(test: TestCase): void;
    onTestEnd(test: TestCase, result: TestResult): void;
    onEnd(): Promise<{
        status: "passed" | "failed";
    }>;
}

/**
 * Create {@link https://currents.dev/playwright | Currents Reporter} to be used with playwright test runner
 *
 * @augments CurrentsConfig
 * @param {CurrentsConfig} config - Currents Reporter {@link https://currents.dev/readme/integration-with-playwright/currents-playwright | configuration}
 * @returns {["@currents/playwright", CurrentsConfig]} a tuple of reporter name and config
 */
declare const currentsReporter: (config: CurrentsConfig) => [string, CurrentsConfig];

export { CurrentsConfig, currentsReporter, DefaultReporter as default };
