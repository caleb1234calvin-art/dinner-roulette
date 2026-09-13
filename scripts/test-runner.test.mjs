import assert from "node:assert/strict";
import test from "node:test";
import { TEST_SUITES, runTestSuites } from "./test-runner.mjs";

test("both suites execute with the current Node and success exits zero", () => {
  const calls = [];
  const result = runTestSuites({
    executable: "test-node",
    run: (...args) => { calls.push(args); return { status: 0 }; },
  });
  assert.equal(result.exitCode, 0);
  assert.equal(calls.length, 2);
  assert.deepEqual(calls[0], ["test-node", TEST_SUITES[0].args, { stdio: "inherit" }]);
  assert.deepEqual(calls[1], ["test-node", TEST_SUITES[1].args, { stdio: "inherit" }]);
});

test("script failure cannot suppress application tests or become success", () => {
  let calls = 0;
  const result = runTestSuites({ run: () => ({ status: ++calls === 1 ? 1 : 0 }) });
  assert.equal(calls, 2);
  assert.equal(result.exitCode, 1);
  assert.deepEqual(result.results.map((suite) => suite.passed), [false, true]);
});

test("application failures make the overall command fail", () => {
  let calls = 0;
  const result = runTestSuites({ run: () => ({ status: ++calls === 1 ? 0 : 1 }) });
  assert.equal(result.exitCode, 1);
  assert.deepEqual(result.results.map((suite) => suite.passed), [true, false]);
});

test("spawn errors and terminated children are failures, not false greens", () => {
  let calls = 0;
  const result = runTestSuites({ run: () => {
    if (++calls === 1) throw new Error("spawn failed");
    return { status: null, signal: "SIGTERM" };
  } });
  assert.equal(calls, 2);
  assert.equal(result.exitCode, 1);
  assert.equal(result.results[0].error, "spawn failed");
  assert.equal(result.results[1].signal, "SIGTERM");
});
