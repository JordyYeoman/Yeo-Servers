/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/**/*.test.ts"],
  verbose: true,
  forceExit: true,
  // clearMocks: true,
  setupFiles: ["<rootDir>/src/test/setup-tests.ts"],
  setupFilesAfterEnv: ["<rootDir>/src/setupFilesAfterEnv.ts"],
  modulePathIgnorePatterns: ["<rootDir>/dist/"],
};
