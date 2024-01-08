import { describe, expect, it } from "@jest/globals";
import fs from "fs";
import path from "path";

import { TestCase } from "@playwright/test/reporter";
import { getTestAttemptError } from "../testCaseError";

const fixtures = [
  "beforeAll error.json",
  "beforeAll timeout.json",
  "beforeEach error.json",
  "beforeEach timeout.json",
  "expect timeout.json",
  "global timeout A.json",
  "global timeout B.json",
  "global timeout explicitly skipped test.json",
];

describe("Getting error details", () => {
  it.each(fixtures)("should fetch error from '%s'", (key) => {
    const testCase = JSON.parse(
      fs.readFileSync(path.join(__dirname, "fixtures", key), "utf8")
    ) as unknown as TestCase;

    expect(getTestAttemptError(testCase.results[0])).toMatchSnapshot();
  });
});
