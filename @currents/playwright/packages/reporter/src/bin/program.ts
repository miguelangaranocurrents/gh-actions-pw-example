import { Command, Option } from "@commander-js/extra-typings";
import chalk from "chalk";

import { getEnvironmentVariableName } from "../config";
import { parseAutoCancelFailures, parseDebug } from "../config/parser";
import { pwcVersion } from "../env/versions";
import { dim } from "../logger";

export const getProgram = (command: Command = new Command()) =>
  command
    .name("pwc")
    .usage("[options] [playwright arguments and flags]")
    .allowUnknownOption()
    .showHelpAfterError("(add --help for additional information)")
    .description(
      `🎭 Run Playwright tests on CI using https://currents.dev

----------------------------------------------------
📖 Documentation: https://currents.dev/readme
🤙 Support:       support@currents.dev
----------------------------------------------------

${chalk.bold("Examples")}

Run all tests in the current directory:
    ${dim("pwc --key <record-key> --project-id <id> --ci-build-id <build-id>")}

Run only tests filtered by the tag "@smoke":
    ${dim(
      "pwc --key <record-key> --project-id <id> --ci-build-id <build-id> --grep smoke"
    )}

Run playwright tests and add tags "tagA", "tagB" to the recorded run:
    ${dim(
      "pwc --key <record-key> --project-id <id> --ci-build-id <build-id> --tag tagA --tag tagB"
    )}

Provide playwright arguments and flags:
    ${dim(
      "pwc --key <record-key> --project-id <id> --ci-build-id <build-id> -- --workers 2 --timeout 10000 --shard 1/2"
    )}
`
    )
    .addOption(
      new Option("--ci-build-id <id>", "the unique identifier for a run").env(
        getEnvironmentVariableName("ciBuildId")
      )
    )
    .addOption(
      new Option(
        "-k, --key <record-key>",
        "your secret Record Key obtained from Currents"
      ).env(getEnvironmentVariableName("recordKey"))
    )
    .addOption(
      new Option(
        "-p, --project-id <project>",
        "the project ID for results reporting obtained from Currents"
      ).env(getEnvironmentVariableName("projectId"))
    )
    .addOption(
      new Option(
        "-t, --tag <tag>",
        "comma-separated tag(s) for recorded runs in Currents"
      ).argParser(parseCommaSeparatedList)
    )
    .addOption(
      new Option(
        "--pwc-enable-test-results",
        "enable reporting test-level results"
      )
        .default(false)
        .hideHelp()
    )
    .addOption(
      new Option(
        "--pwc-remove-title-tags",
        "remove tags from test names in Currents, e.g. `Test name @smoke` becomes `Test name` in the dashboard"
      ).default(false)
    )
    .addOption(
      new Option(
        "--pwc-disable-title-tags",
        "disable parsing tags from test title, e.g. `Test name @smoke` would not be tagged with `smoke` in the dashboard"
      ).default(false)
    )
    .addOption(
      new Option(
        "--pwc-cancel-after-failures <number | false>",
        "abort the cloud run after the specified number of failed tests detected. Overrides the default Currents Project settings. If set, must be a positive integer or 'false' to disable automatic cancellations"
      )
        .env(getEnvironmentVariableName("cancelAfterFailures"))
        .argParser(parseAutoCancelFailures)
    )
    .addOption(
      new Option(
        "--pwc-test-suite-file <path>",
        "path to the test suite file to upload to Currents"
      )
        .env(getEnvironmentVariableName("testSuiteFile"))
        .hideHelp()
    )
    .addOption(
      new Option(
        "--pwc-debug [boolean | 'remote' | 'full']",
        "enable debug logs for the reporter. Specify 'remote' to upload logs to Currents. Specify 'full' to dump the debug logs to stdout and upload to Currents."
      )
        .argParser(parseDebug)
        .env(getEnvironmentVariableName("debug"))
        .default(false)
    )
    .addOption(
      new Option(
        "--pwc-inspect",
        "enable inspect mode, run playwright with --inspect-brk flag or developments and debugging"
      ).default(false)
    )
    .version(pwcVersion);

function parseCommaSeparatedList(value: string, previous: string[] = []) {
  if (value) {
    return previous.concat(value.split(",").map((t) => t.trim()));
  }
  return previous;
}
