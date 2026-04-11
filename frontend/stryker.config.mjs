/** @type {import('@stryker-mutator/api/core').PartialStrykerOptions} */
const config = {
    testRunner: "jest",
    jest: {
        configFile: "jest.config.js",
        config: {
            testMatch: ["**/src/helper/**/*.test.js"],
            testPathIgnorePatterns: ["setLink"],
            coverageThreshold: undefined
        }
    },
    mutator: {
        plugins: [],
        excludedMutations: []
    },
    mutate: ["src/helper/*.js", "!src/helper/*.test.js", "!src/helper/setLInk.js"],
    reporters: ["html", "clear-text", "progress"],
    htmlReporter: {
        fileName: "reports/mutation/mutation.html"
    },
    coverageAnalysis: "perTest"
};
export default config;
