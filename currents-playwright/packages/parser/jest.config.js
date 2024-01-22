module.exports = {
  verbose: true,
  clearMocks: true,
  testEnvironment: "node",
  testMatch: ["<rootDir>/**/__tests__/**/?(*.)(spec|test).ts"],
  transform: {
    "^.+\\.tsx?$": "@swc/jest",
  },
  transformIgnorePatterns: ["node_modules", "dist"],
  moduleFileExtensions: ["ts", "js", "d.ts"],
};
