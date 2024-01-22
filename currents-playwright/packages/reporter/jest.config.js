module.exports = {
  verbose: true,
  clearMocks: true,
  testEnvironment: "node",
  testMatch: ["<rootDir>/**/__tests__/**/?(*.)(spec|test).ts"],
  transform: {
    "^.+\\.tsx?$": "@swc/jest",
  },
  moduleNameMapper: {
    "@currents/reporter/(.*)$": "<rootDir>/../reporter/$1",
  },
  transformIgnorePatterns: ["node_modules"],
  moduleFileExtensions: ["ts", "js", "d.ts"],
  coverageReporters: ["json", "lcov", "text"],
};
