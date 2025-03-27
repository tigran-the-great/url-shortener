"use strict";
module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    transform: {
        "^.+\\.tsx?$": "ts-jest",
    },
    moduleFileExtensions: ["ts", "js"],
    testMatch: ["**/tests/**/*.test.ts"],
};
