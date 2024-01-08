import { parse } from "./parser";

export function parseTestSuite(input: string, playwrightVersion?: string) {
  return parse(input);
}

export { type TestSuite } from "./parser";
