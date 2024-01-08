# @currents/playwright

Playwright integration and reporting tool for [Currents](https://currents.dev/playwright) - a cloud dashboard for debugging, troubleshooting and analysing parallel CI tests supporting Cypress and Playwright.

<p align="center">
  <img width="830" src="https://static.currents.dev/currents-playwright-banner-gh.png" />
</p>

<p align="center">
<a href="https://currents.dev/readme">Documentation</a> | <a href="https://currents.dev?utm_source=currents-playwright-readme">Currents</a>

</p>

- Saves traces, videos, screenshots and console output to a cloud
- Fetches git information and associated with CI builds
- Integrates with your workflow - Slack, GitHub or GitLabPR comments and status checks
- Flakiness, failure rate, duration and much more aggregative metrics
- Powerful history and trends browser on test or spec level
- Common errors tracker
- Automated reports with test suite health metrics
- REST API and HTTP Webhooks

---

## Install

Make sure you already have Playwright installed, then run:

```sh
npm install @currents/playwright
```

## Enable traces, screenshots and videos

```js
use: {
  // ...
  trace: "on",
  video: "on",
  screenshot: "on",
}
```

## Usage

Choose the preferred launch method:

- executing a `pwc` CLI command - it runs playwright with a predefined configuration
- add `@currents/playwright` reporter to Playwright configuration file

### `pwc` CLI

We need to pass three parameters to run `pwc`:

- our [record key](https://currents.dev/readme/guides/record-key)
- the project ID, which is created when you create a project in the Current dashboard
- the [CI build ID](https://currents.dev/readme/guides/ci-build-id)

The command passes down all the other CLI flags to the Playwright test runner as-is. We can pass these as command line arguments, as environment variables, or a mixture of both.

```sh
pwc --project-id PROJECT_ID --key RECORD_KEY --ci-build-id hello-currents --tag tagA,tagB
```

### `@currents/playwright` reporter

Alternatively, you can manually add the reporter to playwright configuration and keep using `playwright test` CLI command.

```ts
import type { PlaywrightTestConfig } from "@playwright/test";
import { currentsReporter } from '@currents/playwright';

const currentsConfig = {
  ciBuildId: process.env.CURRENTS_CI_BUILD_ID,
  recordKey: process.env.CURRENTS_RECORD_KEY,
  projectId: process.env.CURRENTS_PROJECT_ID,
  tag: ["runTagA", "runTagB"],
};

const config: PlaywrightTestConfig = {
  // explicitly provide reporter name and configuration
  [
    "@currents/playwright",
    currentsConfig
  ],
  // ...or use the helper function that ensures type safety
  currentsReporter(currentsConfig),
  /* other reporters, if exist, e.g.:
  ["html"]
  */
};

export default config;
```

You can also provide configuration by setting environment variables before running `playwright` command

```sh
CURRENTS_RECORD_KEY=RECORD_KEY CURRENTS_PROJECT_ID=PROJECT_ID CURRENTS_CI_BUILD_ID=hello-currents CURRENTS_TAG=tagA,tagB npx playwright test
```

## Examples

Check out the example repository for integrating with GitHub Actions: https://github.com/currents-dev/playwright-gh-actions-demo, including parallel runs on multiple machines using [Playwright shards](https://playwright.dev/docs/test-parallel#shard-tests-between-multiple-machines).

Here’s a quick reference to configuration files:

- [test-basic-pwc.yml](https://github.com/currents-dev/playwright-gh-actions-demo/blob/main/.github/workflows/test-basic-pwc.yml) - using `pwc` executable script
- [test-basic-reporter.yml](https://github.com/currents-dev/playwright-gh-actions-demo/blob/main/.github/workflows/test-basic-reporter.yml) - using reporter configuration

## Screenshots

By default Playwright only captures screenshots at the end of a test, according to the provided [screenshot](https://playwright.dev/docs/screenshots) option. Manually created screenshots are hidden by default and not attached to any test.

To send additional screenshots to Currents, they have to be attached to the test. For example, you can attach a screenshot to a test like this

```js
const { test, expect } = require("@playwright/test");

test("basic test", async ({ page }, testInfo) => {
  await page.goto("https://playwright.dev");
  const screenshot = await page.screenshot();
  await testInfo.attach("screenshot", {
    body: screenshot,
    contentType: "image/png",
  });
});
```

For more information see the Playwright [test info attachment](https://playwright.dev/docs/api/class-testinfo#test-info-attach) documentation.

## Requirements

- NodeJS 14.0.0+
- Playwright 1.22.2+
