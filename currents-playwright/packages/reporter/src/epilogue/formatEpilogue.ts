import {
  FullConfig,
  FullResult,
  TestCase,
  TestError,
  TestStep,
} from "@playwright/test/reporter";
import chalk from "chalk";
import path from "path";
import { stripAnsiEscapes } from "../lib/stripAnsiEscapes";
import { formatResultFailure } from "./formatResultFailure";

const kOutputSymbol = Symbol("output");

type TestSummary = {
  skipped: number;
  expected: number;
  interrupted: TestCase[];
  unexpected: TestCase[];
  flaky: TestCase[];
  failuresToPrint: TestCase[];
  fatalErrors: TestError[];
};

type Annotation = {
  title: string;
  message: string;
  location?: Location;
};

type TestResultOutput = { chunk: string | Buffer; type: "stdout" | "stderr" };

function generateSummaryMessage(
  {
    skipped,
    expected,
    interrupted,
    unexpected,
    flaky,
    fatalErrors,
  }: TestSummary,
  config: FullConfig,
  result: Pick<FullResult, "status">
) {
  const tokens: string[] = [];
  if (unexpected.length) {
    tokens.push(chalk.red(`  ${unexpected.length} failed`));
    for (const test of unexpected)
      tokens.push(chalk.red(formatTestHeader(config, test, "    ")));
  }
  if (interrupted.length) {
    tokens.push(chalk.yellow(`  ${interrupted.length} interrupted`));
    for (const test of interrupted)
      tokens.push(chalk.yellow(formatTestHeader(config, test, "    ")));
  }
  if (flaky.length) {
    tokens.push(chalk.yellow(`  ${flaky.length} flaky`));
    for (const test of flaky)
      tokens.push(chalk.yellow(formatTestHeader(config, test, "    ")));
  }
  if (skipped) tokens.push(chalk.yellow(`  ${skipped} skipped`));
  // if (expected) {
  //   tokens.push(
  //     chalk.green(`  ${expected} passed`) +
  //       chalk.dim(` (${milliseconds(duration)})`)
  //   );
  // }
  if (result.status === "timedout")
    tokens.push(
      chalk.red(
        `  Timed out waiting ${
          config.globalTimeout / 1000
        }s for the entire test run`
      )
    );
  if (fatalErrors.length)
    tokens.push(
      chalk.red(
        `  ${
          fatalErrors.length === 1
            ? "1 error was not a part of any test"
            : fatalErrors.length + " errors were not a part of any test"
        }, see above for details`
      )
    );

  return tokens.join("\n");
}

function generateSummary(tests: TestCase[]): TestSummary {
  let skipped = 0;
  let expected = 0;
  const interrupted: TestCase[] = [];
  const interruptedToPrint: TestCase[] = [];
  const unexpected: TestCase[] = [];
  const flaky: TestCase[] = [];

  tests.forEach((test) => {
    switch (test.outcome()) {
      case "skipped": {
        if (test.results.some((result) => result.status === "interrupted")) {
          if (test.results.some((result) => !!result.error))
            interruptedToPrint.push(test);
          interrupted.push(test);
        } else {
          ++skipped;
        }
        break;
      }
      case "expected":
        ++expected;
        break;
      case "unexpected":
        unexpected.push(test);
        break;
      case "flaky":
        flaky.push(test);
        break;
    }
  });

  const failuresToPrint = [...unexpected, ...flaky, ...interruptedToPrint];
  return {
    skipped,
    expected,
    interrupted,
    unexpected,
    flaky,
    failuresToPrint,
    fatalErrors: [],
  };
}

export function epilogue(
  tests: TestCase[],
  config: FullConfig,
  result: Pick<FullResult, "status">
) {
  const summary = generateSummary(tests);
  const summaryMessage = generateSummaryMessage(summary, config, result);
  return {
    summaryMessage,
    failures: summary.failuresToPrint.map(
      (test, index) =>
        formatFailure(config, test, {
          index: index + 1,
        }).message
    ),
  };
}

function formatFailure(
  config: FullConfig,
  test: TestCase,
  options: {
    index?: number;
    includeStdio?: boolean;
    includeAttachments?: boolean;
  } = {}
): {
  message: string;
  annotations: Annotation[];
} {
  const { index, includeStdio, includeAttachments = true } = options;
  const lines: string[] = [];
  const title = formatTestTitle(config, test);
  const annotations: Annotation[] = [];
  const header = formatTestHeader(config, test, "  ", index);
  lines.push(chalk.red(header));
  for (const result of test.results) {
    const resultLines: string[] = [];
    const errors = formatResultFailure(config, test, result, "    ", true);
    if (!errors.length) continue;
    const retryLines = [];
    if (result.retry) {
      retryLines.push("");
      retryLines.push(chalk.gray(pad(`    Retry #${result.retry}`, "-")));
    }
    resultLines.push(...retryLines);
    resultLines.push(...errors.map((error) => "\n" + error.message));
    if (includeAttachments) {
      for (let i = 0; i < result.attachments.length; ++i) {
        const attachment = result.attachments[i];
        const hasPrintableContent =
          attachment.contentType.startsWith("text/") && attachment.body;
        if (!attachment.path && !hasPrintableContent) continue;
        resultLines.push("");
        resultLines.push(
          chalk.cyan(
            pad(
              `    attachment #${i + 1}: ${attachment.name} (${
                attachment.contentType
              })`,
              "-"
            )
          )
        );
        if (attachment.path) {
          const relativePath = path.relative(process.cwd(), attachment.path);
          resultLines.push(chalk.cyan(`    ${relativePath}`));
          // Make this extensible
          if (attachment.name === "trace") {
            resultLines.push(chalk.cyan(`    Usage:`));
            resultLines.push("");
            resultLines.push(
              chalk.cyan(`        npx playwright show-trace ${relativePath}`)
            );
            resultLines.push("");
          }
        } else {
          if (attachment.contentType.startsWith("text/") && attachment.body) {
            let text = attachment.body.toString();
            if (text.length > 300) text = text.slice(0, 300) + "...";
            resultLines.push(chalk.cyan(`    ${text}`));
          }
        }
        resultLines.push(chalk.cyan(pad("   ", "-")));
      }
    }
    const output = ((result as any)[kOutputSymbol] || []) as TestResultOutput[];
    if (includeStdio && output.length) {
      const outputText = output
        .map(({ chunk, type }) => {
          const text = chunk.toString("utf8");
          if (type === "stderr") return chalk.red(stripAnsiEscapes(text));
          return text;
        })
        .join("");
      resultLines.push("");
      resultLines.push(
        chalk.gray(pad("--- Test output", "-")) +
          "\n\n" +
          outputText +
          "\n" +
          pad("", "-")
      );
    }
    for (const error of errors) {
      annotations.push({
        // @ts-ignore
        location: error.location,
        title,
        message: [header, ...retryLines, error.message].join("\n"),
      });
    }
    lines.push(...resultLines);
  }
  lines.push("");
  return {
    message: lines.join("\n"),
    annotations,
  };
}

function formatTestHeader(
  config: FullConfig,
  test: TestCase,
  indent: string,
  index?: number
): string {
  const title = formatTestTitle(config, test);
  const header = `${indent}${index ? index + ") " : ""}${title}`;
  return pad(header, "=");
}

function formatTestTitle(
  config: FullConfig,
  test: TestCase,
  step?: TestStep,
  omitLocation: boolean = false
): string {
  // root, project, file, ...describes, test
  const [, projectName, , ...titles] = test.titlePath();
  let location;
  if (omitLocation) location = `${relativeTestPath(config, test)}`;
  else
    location = `${relativeTestPath(config, test)}:${
      step?.location?.line ?? test.location.line
    }:${step?.location?.column ?? test.location.column}`;
  const projectTitle = projectName ? `[${projectName}] › ` : "";
  return `${projectTitle}${location} › ${titles.join(" › ")}${stepSuffix(
    step
  )}`;
}

function pad(line: string, char: string): string {
  if (line) line += " ";
  return line + chalk.gray(char.repeat(Math.max(0, 100 - line.length)));
}

function relativeFilePath(config: FullConfig, file: string): string {
  return path.relative(config.rootDir, file) || path.basename(file);
}

function relativeTestPath(config: FullConfig, test: TestCase): string {
  return relativeFilePath(config, test.location.file);
}

function stepSuffix(step: TestStep | undefined) {
  const stepTitles = step ? step.titlePath() : [];
  return stepTitles.map((t) => " › " + t).join("");
}
