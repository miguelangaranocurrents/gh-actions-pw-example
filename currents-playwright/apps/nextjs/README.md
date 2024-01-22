# Getting Started

Compile the reported (at the project root):

```sh
npm install
npm run dev
```

Set the environment variables:

- `CURRENTS_RECORD_KEY`
- `CURRENTS_PROJECT_ID`

Run the tests:

```
npm run cli
```

Or manually:

```sh
CURRENTS_RECORD_KEY=XXX npx pwc --ci-build-id `date +%s` --project-id $CURRENTS_PROJECT_ID
```
