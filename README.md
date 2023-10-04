# Currents.dev - GitHub Actions Playwright Example

This is an example repository that showcases using [Currents.dev](https://currents.dev) for running Playwright tests on GitHub Actions.

The example [workflow config file](https://github.com/currents-dev/gh-actions-example/blob/main/.github/workflows/currents.yml):

- uses [Test CLI commands](https://playwright.dev/docs/test-cli) to run `@currents/playwright` for recording test results and parallelization with [Currents.dev](https://currents.dev)

- Note: get your record key from [Currents.dev](https://app.currents.dev) and set [GH secret](https://docs.github.com/en/actions/reference/encrypted-secrets) variable `CURRENTS_RECORD_KEY`

- Note: set the `CURRENTS_PROJECT_ID` [GH secret](https://docs.github.com/en/actions/reference/encrypted-secrets) variable - obtain the project id from [Currents.dev](https://app.currents.dev)

- Note: use CLI arguments to customize your @currents/playwright runs, e.g.: `npx pwc --key RECORD_KEY --project-id PROJECT_ID --ci-build-id hello-currents`
