<a href="https://cursor.com/install-mcp?name=currents&config=eyJuYW1lIjoiQ3VycmVudHMiLCJkZXNjcmlwdGlvbiI6IkN1cnJlbnRzIE1DUCBzZXJ2ZXIiLCJjb21tYW5kIjoibnB4IC15IEBjdXJyZW50cy9tY3BAMS4wLjIiLCJlbnYiOnsiQ1VSUkVOVFNfQVBJX0tFWSI6InlvdXItY3VycmVudHMtYXBpLWtleSJ9fQ%3D%3D"><img src="https://cursor.com/deeplink/mcp-install-dark.svg" alt="Add currents MCP server to Cursor" height="32" /></a>

# Currents.dev - GitHub Actions Playwright Example

This is an example repository that showcases using [Currents.dev](https://currents.dev) for running Playwright tests on GitHub Actions.

The example [workflow config file](https://github.com/currents-dev/gh-actions-example/blob/main/.github/workflows/currents.yml):

- uses [Test CLI commands](https://playwright.dev/docs/test-cli) to run `@currents/playwright` for recording test results and parallelization with [Currents.dev](https://currents.dev)

- Note: get your record key from [Currents.dev](https://app.currents.dev) and set [GH secret](https://docs.github.com/en/actions/reference/encrypted-secrets) variable `CURRENTS_RECORD_KEY`

- Note: set the `CURRENTS_PROJECT_ID` [GH secret](https://docs.github.com/en/actions/reference/encrypted-secrets) variable - obtain the project id from [Currents.dev](https://app.currents.dev)

- Note: use CLI arguments to customize your @currents/playwright runs, e.g.: `npx pwc --key RECORD_KEY --project-id PROJECT_ID --ci-build-id hello-currents`
