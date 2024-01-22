# Currents Playwright

## Build

To build all apps and packages, run the following command:

```sh
npm run build
```

## Develop

To develop all apps and packages, run the following command:

```sh
npm run dev
```

## Test

Running E2E tests for the local environment:

```sh
cd ./apps/e2e

npx pwc --key key --project-id projectId --ci-build-id `date +%s` --tag runTagA,runTagB

# grab the Run URL from the output
CURRENTS_RUN_URL=runURL CURRENTS_API_TOKEN=apiToken npm run test:validation
```

## Release

### Beta channel

```sh
cd ~/currents-playwright
npm run release -- -- --preRelease=beta
# Use GitHub "Publish NPM" manual workflow
npm run publish -- -- -t beta
```

### Latest channel

```sh
cd ~/currents-playwright
npm run release
# Use GitHub "Publish NPM" manual workflow
npm run publish -- -- -t latest
```

### Link Localhost

```sh
cd ~/currents-playwright/packages/reporter/
npm link
```

```sh
# in destination package
npm link @currents/playwright
```

### Release Localhost

```sh
docker run -it --rm --name verdaccio -p 4873:4873 verdaccio/verdaccio
npm adduser --registry http://localhost:4873
npm login --registry http://localhost:4873

cd ~/currents-playwright
npm run rm && npm run build && npm publish --@currents:registry=http://localhost:4873
```

### Use localhost

```sh
npm install @currents/playwright --@currents:registry=http://localhost:4873
```
