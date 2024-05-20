/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    detectOpenHandles: true,
    verbose: true,
    setupFiles: ["./setup-jest.ts"],
    setupFilesAfterEnv: ["./src/database.ts"],
    transform: {
        "^.+\\.tsx?$": "ts-jest",
    },
};
