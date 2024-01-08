## Error Details

Extracting the correct error details from test results. Handles timeouts and exceptions.

```sh
# run each tests case separately
npx playwright test -c ./pw.config.errorDetails.ts ./errorDetails/test.timeout.spec.ts
# run global timeout case
NODE_OPTIONS=--inspect-brk=9440 npx playwright test -c ./pw.config.globalTimeout.ts ./errorDetails/global.timeout.spec.ts
```
