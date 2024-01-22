module.exports = {
  verbose: true,
  clearMocks: true,
  testEnvironment: "node",
  testMatch: ["<rootDir>/**/__tests__/**/?(*.)(jest).ts"],
  transform: {
    "^.+\\.(t|j)sx?$": "@swc/jest",
  },
  transformIgnorePatterns: ["node_modules"],
  moduleFileExtensions: ["ts", "js", "d.ts"],
};
