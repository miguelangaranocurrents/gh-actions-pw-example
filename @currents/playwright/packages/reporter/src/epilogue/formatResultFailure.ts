/**
 * Copyright (c) Microsoft Corporation.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import url from "url";
import fs from "fs";
import path from "path";
import {
  FullConfig,
  Location,
  TestCase,
  TestResult,
  TestError,
} from "@playwright/test/reporter";
import * as colors from "colors/safe";
import { codeFrameColumns } from "@babel/code-frame";
import StackUtils from "stack-utils";

type ErrorDetails = {
  message: string;
  location?: Location;
};

function indent(lines: string, tab: string) {
  return lines.replace(/^(?=.+$)/gm, tab);
}

function prepareErrorStack(stack: string): {
  message: string;
  stackLines: string[];
  location?: Location;
} {
  const lines = stack.split("\n");
  let firstStackLine = lines.findIndex((line) => line.startsWith("    at "));
  if (firstStackLine === -1) firstStackLine = lines.length;
  const message = lines.slice(0, firstStackLine).join("\n");
  const stackLines = lines.slice(firstStackLine);
  let location: Location | undefined;
  for (const line of stackLines) {
    const { frame: parsed, fileName: resolvedFile } = parseStackTraceLine(line);
    if (!parsed || !resolvedFile) continue;
    if (belongsToNodeModules(resolvedFile)) continue;
    location = {
      file: resolvedFile,
      column: parsed.column || 0,
      line: parsed.line || 0,
    };
    break;
  }
  return { message, stackLines, location };
}

function belongsToNodeModules(file: string) {
  return file.includes(`${path.sep}node_modules${path.sep}`);
}

function relativeFilePath(config: FullConfig, file: string): string {
  return path.relative(config.rootDir, file) || path.basename(file);
}

function formatError(
  config: FullConfig,
  error: TestError,
  highlightCode: boolean,
  file?: string
): ErrorDetails {
  const stack = error.stack;
  const tokens: string[] = [];
  let location: Location | undefined;
  if (stack) {
    // Now that we filter out internals from our stack traces, we can safely render
    // the helper / original exception locations.
    const parsed = prepareErrorStack(stack);
    tokens.push(parsed.message);
    location = parsed.location;
    if (location) {
      try {
        const source = fs.readFileSync(location.file, "utf8");
        const codeFrame = codeFrameColumns(
          source,
          { start: location },
          { highlightCode }
        );
        // Convert /var/folders to /private/var/folders on Mac.
        if (!file || fs.realpathSync(file) !== location.file) {
          tokens.push("");
          tokens.push(
            colors.gray(`   at `) +
              `${relativeFilePath(config, location.file)}:${location.line}`
          );
        }
        tokens.push("");
        tokens.push(codeFrame);
      } catch (e) {
        // Failed to read the source file - that's ok.
      }
    }
    tokens.push("");
    tokens.push(parsed.stackLines.join("\n"));
  } else if (error.message) {
    tokens.push(error.message);
  } else if (error.value) {
    tokens.push(error.value);
  }
  return {
    location,
    message: tokens.join("\n"),
  };
}

const stackUtils = new StackUtils();
function parseStackTraceLine(line: string): {
  frame: StackUtils.StackLineData | null;
  fileName: string | null;
} {
  const frame = stackUtils.parseLine(line);
  if (!frame) return { frame: null, fileName: null };
  let fileName: string | null = null;
  if (frame.file) {
    // ESM files return file:// URLs, see here: https://github.com/tapjs/stack-utils/issues/60
    fileName = frame.file.startsWith("file://")
      ? url.fileURLToPath(frame.file)
      : path.resolve(process.cwd(), frame.file);
  }
  return {
    frame,
    fileName,
  };
}

export function formatResultFailure(
  config: FullConfig,
  test: TestCase,
  result: TestResult,
  initialIndent: string,
  highlightCode: boolean
): ErrorDetails[] {
  const errorDetails: ErrorDetails[] = [];

  if (result.status === "passed" && test.expectedStatus === "failed") {
    errorDetails.push({
      message: indent(
        colors.red(`Expected to fail, but passed.`),
        initialIndent
      ),
    });
  }
  if (result.status === "interrupted") {
    errorDetails.push({
      message: indent(colors.red(`Test was interrupted.`), initialIndent),
    });
  }

  for (const error of result.errors) {
    const formattedError = formatError(
      config,
      error,
      highlightCode,
      test.location.file
    );
    errorDetails.push({
      message: indent(formattedError.message, initialIndent),
      location: formattedError.location,
    });
  }
  return errorDetails;
}
