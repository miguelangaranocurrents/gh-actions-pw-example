import { FullConfig, Suite, TestCase } from "@playwright/test/reporter";
import { relativeFileLocation } from "./relativeFileLocation";

export function getTestCaseProject(test: TestCase) {
  return test.parent.project()?.name ?? "__currents_no_project__";
}

export function getTestFullTitle(test: TestCase): string[] {
  const titles = test.titlePath();
  const fileSuite = getTestFileSuite(test).title;
  return titles.slice(titles.indexOf(fileSuite) + 1, titles.length);
}

export function getTestFileSuite(test: TestCase): Suite {
  let suite = test.parent;
  // get first parent with undefined location, which means it's a project
  while (!!suite.parent?.location) {
    suite = suite.parent;
  }
  return suite;
}

export function testToSpecName(testCase: TestCase, config: FullConfig) {
  return relativeFileLocation(testCase.location, config.rootDir);
}

export function testToTestId(testCase: TestCase) {
  // @ts-ignore
  return testCase.id ?? testCase._id;
}
