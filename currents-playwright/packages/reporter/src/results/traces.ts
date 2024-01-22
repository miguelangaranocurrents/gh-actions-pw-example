import { randomId } from "../lib/uid";
import { getAttachmentsFromTestCases } from "./tests";
import { PlaywrightTraceWithPath, TestCaseWithClientId } from "./types";

export function getTraceFiles(
  testCases: TestCaseWithClientId[]
): Array<PlaywrightTraceWithPath> {
  return getAttachmentsFromTestCases(testCases)
    .filter((a) => a.name === "trace")
    .filter((a) => "path" in a)
    .map((s) => {
      return {
        traceId: randomId(),
        name: s.name,
        testId: s.testId,
        testAttemptIndex: s.testAttemptIndex,
        path: s.path as string,
        takenAt: new Date(),
      };
    });
}
