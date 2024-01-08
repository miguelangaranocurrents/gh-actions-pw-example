import { describe, expect, it } from "@jest/globals";
import { parse, TestSuite } from "../parser";

const inputString =
  "'Listing tests:\n' + '  [firefox] › 1-getting-started.spec.ts:3:5 › basic test\n' + '  [firefox] › 2-actions.spec.ts:15:5 › basic interaction\n' + '  [firefox] › 2-actions.spec.ts:39:5 › element selectors\n' + '  [firefox] › 3-assertions.spec.ts:11:5 › should be able to use assertions\n' + '  [firefox] › 4-failures.spec.ts:3:5 › Expect the test to fail\n' + '  [firefox] › pom/pom-with-fixtures.spec.ts:13:5 › should display zero initial items\n' + '  [firefox] › pom/pom-with-fixtures.spec.ts:17:5 › should be able to add new items\n' + '  [firefox] › pom/pom-with-fixtures.spec.ts:23:5 › should be able to mark items as completed\n' + '  [firefox] › pom/pom-with-fixtures.spec.ts:31:5 › should still show the items after a page reload\n' + '  [firefox] › pom/pom-with-fixtures.spec.ts:38:5 › should be able to filter by uncompleted items\n' + '  [firefox] › pom/pom-with-fixtures.spec.ts:48:5 › should be able to filter by completed items\n' + '  [firefox] › pom/pom-with-fixtures.spec.ts:57:5 › should be able to delete completed items\n' + '  [firefox] › pom/pom.spec.ts:5:7 › ToDo App › should display zero initial items\n' + '  [firefox] › pom/pom.spec.ts:11:7 › ToDo App › should be able to add new items\n' + '  [firefox] › pom/pom.spec.ts:19:7 › ToDo App › should be able to mark items as completed\n' + '  [firefox] › pom/pom.spec.ts:29:7 › ToDo App › should still show the items after a page reload\n' + '  [firefox] › pom/pom.spec.ts:38:7 › ToDo App › should be able to filter by uncompleted items\n' + '  [firefox] › pom/pom.spec.ts:49:7 › ToDo App › should be able to filter by completed items\n' + '  [firefox] › pom/pom.spec.ts:60:7 › ToDo App › should be able to delete completed items\n' + 'Total: 19 tests in 6 files'";

const parsed: TestSuite = {
  firefox: {
    "1-getting-started.spec.ts": ["basic test"],
    "2-actions.spec.ts": ["basic interaction", "element selectors"],
    "3-assertions.spec.ts": ["should be able to use assertions"],
    "4-failures.spec.ts": ["Expect the test to fail"],
    "pom/pom-with-fixtures.spec.ts": [
      "should display zero initial items",
      "should be able to add new items",
      "should be able to mark items as completed",
      "should still show the items after a page reload",
      "should be able to filter by uncompleted items",
      "should be able to filter by completed items",
      "should be able to delete completed items",
    ],
    "pom/pom.spec.ts": [
      "ToDo App › should display zero initial items",
      "ToDo App › should be able to add new items",
      "ToDo App › should be able to mark items as completed",
      "ToDo App › should still show the items after a page reload",
      "ToDo App › should be able to filter by uncompleted items",
      "ToDo App › should be able to filter by completed items",
      "ToDo App › should be able to delete completed items",
    ],
  },
};

describe("parseTestList", () => {
  it("parses the input string correctly", () => {
    const result = parse(inputString);
    expect(result).toEqual(parsed);
  });
});
