import sizeOf from "image-size";

import { P, match } from "ts-pattern";
import { isNonNullable } from "../lib/lang";
import { randomId } from "../lib/uid";
import { getAttachmentsFromTestCases } from "./tests";
import {
  ScreenshotWithBody,
  ScreenshotWithPath,
  TestCaseWithClientId,
} from "./types";

export function getScreenshots(
  testCases: TestCaseWithClientId[]
): Array<ScreenshotWithPath | ScreenshotWithBody> {
  return getAttachmentsFromTestCases(testCases)
    .filter(
      (a) =>
        a.contentType.startsWith("image") ||
        a.contentType === "application/octet-stream"
    )
    .map((a) =>
      match(a)
        .with({ path: P.string, body: P.nullish }, (s) => {
          const { height, width } = safeSizeOf(a.path);
          return {
            screenshotId: randomId(),
            name: s.name,
            testId: s.testId,
            testAttemptIndex: s.testAttemptIndex,
            path: s.path,
            height,
            width,
            takenAt: new Date(),
          };
        })
        .with({ path: P.nullish, body: P.instanceOf(Uint8Array) }, (s) => {
          return {
            screenshotId: randomId(),
            name: s.name,
            testId: s.testId,
            testAttemptIndex: s.testAttemptIndex,
            path: s.path,
            height: 0,
            width: 0,
            body: s.body,
            takenAt: new Date(),
          };
        })
        .otherwise(() => null)
    )
    .filter(isNonNullable);
}

function safeSizeOf(path: string | undefined) {
  if (!path) {
    return { height: 0, width: 0 };
  }
  try {
    const { height, width } = sizeOf(path);
    return { height, width };
  } catch {
    return { height: 0, width: 0 };
  }
}
