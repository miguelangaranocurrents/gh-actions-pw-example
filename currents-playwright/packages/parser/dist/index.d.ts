type TestSuite = {
    [x: string]: Record<string, string[]>;
};

declare function parseTestSuite(input: string, playwrightVersion?: string): TestSuite;

export { TestSuite, parseTestSuite };
