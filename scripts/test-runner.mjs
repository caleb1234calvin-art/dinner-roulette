import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";

export const TEST_SUITES = [
  { name: "repository scripts", args: ["--test", "scripts/**/*.test.mjs"] },
  {
    name: "application",
    args: [
      "--experimental-strip-types", "--test",
      "src/lib/app-data/app-data.test.ts",
      "src/lib/auth/gate-identity.test.ts",
      "src/lib/auth/sign-in-gate.test.ts",
      "src/lib/date-night/availability.test.ts",
      "src/lib/location/location.test.ts",
    ],
  },
];

// Collect both suites and fail if either fails. A script failure must not
// silently prevent authentication and application regressions from running.
export function runTestSuites({ run = spawnSync, executable = process.execPath } = {}) {
  const results = [];
  for (const suite of TEST_SUITES) {
    let child;
    try {
      child = run(executable, suite.args, { stdio: "inherit" });
    } catch (error) {
      child = { status: null, error };
    }
    results.push({
      name: suite.name,
      status: child.status,
      signal: child.signal ?? null,
      error: child.error?.message ?? null,
      passed: child.status === 0 && !child.error && !child.signal,
    });
  }
  return { exitCode: results.every((result) => result.passed) ? 0 : 1, results };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const result = runTestSuites();
  for (const suite of result.results) {
    console.log("[test-runner] " + suite.name + ": " + (suite.passed ? "passed" : "FAILED"));
    if (suite.error) console.error(suite.error);
    if (suite.signal) console.error("Terminated by signal: " + suite.signal);
  }
  process.exitCode = result.exitCode;
}
