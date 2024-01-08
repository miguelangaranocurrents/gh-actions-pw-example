export type TestSuite = {
  [x: string]: Record<string, string[]>;
};

export const parse = (inputString: string): TestSuite => {
  const lines = inputString.split("\n");
  const result: TestSuite = {};

  for (const line of lines) {
    const match = line.match(/\[([^\]]+)\] › ([^:]+):(\d+:\d+) › (.+)/);
    if (match) {
      const [_, project, spec, lineNum, testName] = match;
      if (!result[project]) {
        result[project] = {};
      }
      if (!result[project][spec]) {
        result[project][spec] = [];
      }

      result[project][spec].push(testName);
    }
  }

  return result;
};
