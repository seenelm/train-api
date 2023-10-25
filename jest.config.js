/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: "ts-jest",
  testEnvironment: "node",
  verbose: true,
  setupFilesAfterEnv: ["./src/database.js"],
  // transform: {
  //   "^.+\\.[t|j]sx?$": "babel-jest",
  // },
};
