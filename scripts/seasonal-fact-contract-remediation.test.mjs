import assert from "node:assert/strict";
import test from "node:test";
import "../tools/seasonal-facts/network-guard.mjs";
import { fixtureSource } from "../tools/seasonal-facts/fixtures.ts";
import { validateResponseEnvelope, validateRedirectChain } from "../tools/seasonal-facts/policy.ts";

// Plain JavaScript deliberately exercises malformed runtime values, without TS casts.
const policy = () => { const s = fixtureSource(); s.budget.requests = 1; return s; };
const envelope = () => ({ contentType: "text/plain", headerBytes: 32, wireBytes: 64,
  decompressedBytes: 64, elapsedMs: 50, domNodes: 0, depth: 0, jsonLdBytes: 0, requests: 1 });
const bounds = { headerBytes: 16384, wireBytes: 2097152, decompressedBytes: 2097152,
  elapsedMs: 10000, domNodes: 20000, depth: 64, jsonLdBytes: 262144, requests: 1 };
const allowed = "https://seasonal.invalid/events/remediation?year=2026";
const hostile = "https://127.0.0.1/events/hidden";
const sparseChain = (length, missing) => {
  const chain = Array(length).fill(allowed); delete chain[missing]; return chain;
};

for (const key of Object.keys(envelope())) {
  test(`envelope omission rejected: ${key}`, () => {
    const metrics = envelope(); delete metrics[key];
    assert.throws(() => validateResponseEnvelope(policy(), metrics));
  });
  test(`envelope explicit undefined rejected: ${key}`, () => {
    assert.throws(() => validateResponseEnvelope(policy(), { ...envelope(), [key]: undefined }));
  });
  test(`envelope inherited-only field rejected: ${key}`, () => {
    const metrics = envelope(), value = metrics[key]; delete metrics[key];
    Object.setPrototypeOf(metrics, { [key]: value });
    assert.equal(Object.hasOwn(metrics, key), false);
    assert.throws(() => validateResponseEnvelope(policy(), metrics));
  });
}
for (const [name, metrics] of [
  ["null", null], ["undefined", undefined], ["array", []], ["array with metrics", Object.assign([], envelope())],
  ["string", "text/plain"], ["number", 1], ["boolean", true], ["function", Object.assign(() => {}, envelope())],
  ["date with metrics", Object.assign(new Date(0), envelope())], ["inherited envelope", Object.create(envelope())],
]) test(`envelope non-plain input rejected: ${name}`, () => {
  assert.throws(() => validateResponseEnvelope(policy(), metrics));
});
for (const [name, value] of [["NaN", NaN], ["Infinity", Infinity], ["negative Infinity", -Infinity],
  ["fraction", 0.5], ["negative", -1], ["unsafe integer", Number.MAX_SAFE_INTEGER + 1],
  ["string", "1"], ["null", null], ["boolean", true], ["bigint", 1n]]) {
  for (const key of Object.keys(bounds)) test(`envelope invalid numeric ${name}: ${key}`, () => {
    assert.throws(() => validateResponseEnvelope(policy(), { ...envelope(), [key]: value }));
  });
}
for (const [name, value] of [["number", 1], ["null", null], ["boxed string", new String("text/plain")],
  ["disallowed string", "application/javascript"]]) test(`contentType rejected: ${name}`, () => {
  assert.throws(() => validateResponseEnvelope(policy(), { ...envelope(), contentType: value }));
});
for (const [name, key, enumerable] of [["enumerable", "extra", true], ["hidden", "extra", false],
  ["symbol", Symbol("extra"), true]]) test(`envelope unexpected ${name} key rejected`, () => {
  const metrics = envelope(); Object.defineProperty(metrics, key, { value: 0, enumerable });
  assert.throws(() => validateResponseEnvelope(policy(), metrics));
});
for (const [key, bound] of Object.entries(bounds)) {
  test(`envelope exact ceiling passes: ${key}`, () => {
    assert.doesNotThrow(() => validateResponseEnvelope(policy(), { ...envelope(), [key]: bound }));
  });
  test(`envelope ceiling plus one fails: ${key}`, () => {
    assert.throws(() => validateResponseEnvelope(policy(), { ...envelope(), [key]: bound + 1 }));
  });
  test(`envelope lowered source ceiling enforced: ${key}`, () => {
    const s = policy();
    const budgetKey = { headerBytes: "maxHeaderBytes", wireBytes: "maxBodyBytes", decompressedBytes: "maxBodyBytes",
      elapsedMs: "deadlineMs", domNodes: "maxDomNodes", depth: "maxDepth", jsonLdBytes: "maxJsonLdBytes", requests: "requests" }[key];
    s.budget[budgetKey] = key === "requests" ? 0 : bound - 1;
    assert.throws(() => validateResponseEnvelope(s, { ...envelope(), [key]: bound }));
  });
  test(`envelope non-enumerable invalid metric rejected: ${key}`, () => {
    const metrics = envelope(); Object.defineProperty(metrics, key, { value: NaN, enumerable: false });
    assert.throws(() => validateResponseEnvelope(policy(), metrics));
  });
}
test("all exact bounds pass together", () => {
  assert.doesNotThrow(() => validateResponseEnvelope(policy(), { contentType: "text/plain", ...bounds }));
});
test("zero numeric values pass", () => {
  const metrics = envelope(); for (const key of Object.keys(bounds)) metrics[key] = 0;
  assert.doesNotThrow(() => validateResponseEnvelope(policy(), metrics));
});
test("complete null-prototype plain envelope passes", () => {
  assert.doesNotThrow(() => validateResponseEnvelope(policy(), Object.assign(Object.create(null), envelope())));
});
test("complete non-enumerable own metric passes", () => {
  const metrics = envelope(); Object.defineProperty(metrics, "headerBytes", { enumerable: false });
  assert.doesNotThrow(() => validateResponseEnvelope(policy(), metrics));
});
for (const contentType of policy().contentTypes) test(`allowed contentType passes: ${contentType}`, () => {
  assert.doesNotThrow(() => validateResponseEnvelope(policy(), { ...envelope(), contentType }));
});
for (const [name, chain] of [
  ["one hole", new Array(1)], ["two slots missing first", sparseChain(2, 0)], ["two slots missing last", sparseChain(2, 1)],
  ["three slots missing middle", sparseChain(3, 1)], ["explicit undefined", [allowed, undefined]],
  ["null hop", [allowed, null]], ["numeric hop", [allowed, 7]], ["boxed string hop", [new String(allowed)]],
  ["empty", []], ["over limit", [allowed, allowed, allowed, allowed]], ["null chain", null],
  ["string chain", allowed], ["array-like", { 0: allowed, length: 1 }],
  ["array-like with forEach", { 0: allowed, length: 1, forEach: Array.prototype.forEach }],
]) test(`redirect malformed chain rejected: ${name}`, () => {
  assert.throws(() => validateRedirectChain(chain, policy()));
});
for (let length = 1; length <= 3; length++) {
  test(`dense ${length}-URL chain passes at redirect budget`, () => {
    const s = policy(); s.budget.redirects = length - 1;
    assert.doesNotThrow(() => validateRedirectChain(Array(length).fill(allowed), s));
  });
  if (length > 1) test(`dense ${length}-URL chain exceeds lower source budget`, () => {
    const s = policy(); s.budget.redirects = length - 2;
    assert.throws(() => validateRedirectChain(Array(length).fill(allowed), s));
  });
  for (let index = 0; index < length; index++) {
    test(`dense ${length}-URL chain revalidates hostile hop ${index}`, () => {
      const chain = Array(length).fill(allowed); chain[index] = hostile;
      assert.throws(() => validateRedirectChain(chain, policy()));
    });
    test(`redirect inherited-only index ${index} of ${length} rejected`, () => {
      const chain = Array(length).fill(allowed); delete chain[index];
      const prototype = Object.create(Array.prototype); prototype[index] = allowed;
      Object.setPrototypeOf(chain, prototype);
      assert.equal(Object.hasOwn(chain, index), false);
      assert.throws(() => validateRedirectChain(chain, policy()));
    });
  }
}
test("deleting a hostile middle hop cannot turn a denied chain into an accepted chain", () => {
  const chain = [allowed, hostile, allowed];
  assert.throws(() => validateRedirectChain(chain, policy()));
  delete chain[1];
  assert.throws(() => validateRedirectChain(chain, policy()));
});
test("remediation suite made zero unmocked collector network attempts", () => {
  assert.equal(globalThis.__seasonalNetworkAttempts(), 0);
});
