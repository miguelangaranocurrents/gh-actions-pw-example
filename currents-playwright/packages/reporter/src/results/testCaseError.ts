import { codeFrameColumns } from "@babel/code-frame";

import {
  TestError as PlaywrightTestError,
  TestCase,
  TestResult,
  TestStep,
} from "@playwright/test/reporter";
import { FullProject } from "@playwright/test/types/test";
import fs from "fs";
import { last, orderBy } from "lodash";
import path from "path";
import { stripAnsiEscapes } from "../lib/stripAnsiEscapes";
import { TestError } from "./types";

const interruptedError: TestError = {
  message: "Test interrupted",
  name: "Error",
  stack: "",
  codeFrame: undefined,
};

// get display error for a test case with miltiple attempts
export function getTestCaseDisplayError(testCase: TestCase) {
  if (!testCase.results?.length) {
    return interruptedError.message;
  }

  const orderedAttemptResults = orderBy(testCase.results, "retry", "asc");

  // if there is at least one failed attempt, use the last one
  const result = last(
    orderedAttemptResults.filter(
      (r) =>
        r.status === "failed" ||
        r.status === "timedOut" ||
        r.status === "interrupted"
    )
  )?.error?.message;

  return result ? stripAnsiEscapes(result) : null;
}

export function getTestAttemptError(result: TestResult, project?: FullProject) {
  if (result.status === "interrupted") {
    return interruptedError;
  }
  if (!result.error) {
    return null;
  }

  if (result.error) {
    return getErrorDetails(result.error, project);
  }

  const errorStep = tryGetStepWithErrorAndLocation(result.steps);
  if (!errorStep) return null;
  if (!errorStep?.error) {
    errorStep.error = result.error;
  }

  return {
    message: getErrorMessage(errorStep.error),
    name: errorStep.title,
    stack: getErrorStack(errorStep.error),
    codeFrame: testStepToCodeFrame(errorStep),
  };
}

export function getErrorDetails(
  error: PlaywrightTestError,
  project?: FullProject
) {
  try {
    return {
      message: getErrorMessage(error),
      name: getErrorName(error),
      stack: getErrorStack(error),
      codeFrame:
        error.location &&
        getErrorCodeFrame({
          location: error.location,
          snippet: error.snippet,
          project,
        }),
    };
  } catch (e) {
    return {
      message: "Error while getting error details",
      name: "Error",
      stack: "",
      codeFrame: undefined,
    };
  }
}
function getErrorName(error: PlaywrightTestError) {
  return "Error";
}

function getErrorCodeFrame({
  location,
  snippet,
  project,
}: {
  location: NonNullable<PlaywrightTestError["location"]>;
  snippet: PlaywrightTestError["snippet"];
  project?: FullProject;
}): TestError["codeFrame"] {
  return {
    line: location.line,
    column: location.column,
    originalFile: location.file,
    relativeFile: project?.testDir
      ? path.relative(project.testDir, location.file)
      : null,
    absoluteFile: location.file,
    frame: stripAnsiEscapes(snippet ?? "No error source code detected"),
    language: getLanguageFromExtension(location.file),
  };
}

function tryGetStepWithErrorAndLocation(
  steps: TestStep[],
  depth = 3
): TestStep | undefined {
  let result;

  for (const s of steps) {
    if (s.error && s.location) {
      result = s;
    }

    if (result) return result;

    if (s.steps.length > 0 && depth > 0) {
      result = tryGetStepWithErrorAndLocation(s.steps, depth - 1);
    }
  }

  for (const s of steps) {
    if (s.category === "hook" && s.location) {
      result = s;
    }

    if (result) return result;

    if (s.steps.length > 0 && depth > 0) {
      result = tryGetStepWithErrorAndLocation(s.steps, depth - 1);
    }
  }

  return result;
}

function getErrorMessage(error?: PlaywrightTestError) {
  return typeof error === "string"
    ? error
    : stripAnsiEscapes(error?.message ?? "");
}

function getErrorStack(error?: PlaywrightTestError) {
  return error !== undefined && "stack" in error && error.stack
    ? error.stack
    : "";
}

function testStepToCodeFrame(
  step: TestStep
): TestError["codeFrame"] | undefined {
  const { location } = step;
  if (!location) {
    return undefined;
  }

  const language = getLanguageFromExtension(location.file);
  const absoluteFile = location.file;
  const relativeFile = path.relative(process.cwd(), location.file);
  const originalFile = relativeFile;

  const column = location.column;
  const line = location.line;
  const source = getSourceFromLocation(location.file);
  const frame = source
    ? codeFrameColumns(source, { start: { line, column } })
    : "";

  return {
    line,
    column,
    originalFile,
    relativeFile,
    absoluteFile,
    frame,
    language,
  };
}

const getLanguageFromExtension = (filePath: string) => {
  return (path.extname(filePath) || "").toLowerCase().replace(".", "");
};

const getSourceFromLocation = (filePath: string) => {
  try {
    const source = fs.readFileSync(filePath, "utf-8") + "\n//";
    return source;
  } catch (e) {
    return undefined;
  }
};
