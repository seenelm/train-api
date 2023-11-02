/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  verbose: true,
  setupFilesAfterEnv: ["./src/database.ts"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
};
