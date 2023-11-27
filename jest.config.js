/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  detectOpenHandles: true,
  verbose: true,
  // setupFilesAfterEnv: ["./src/database.ts"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
};
