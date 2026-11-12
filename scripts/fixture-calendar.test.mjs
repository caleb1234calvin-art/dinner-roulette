import assert from "node:assert/strict";
import { test } from "node:test";
import { installFixtureCalendar } from "./test-support/fixture-calendar.mjs";

test("fixture calendar synchronizes Date.now and new Date without freezing timers", async () => {
  const originalDate = globalThis.Date;
  const restore = installFixtureCalendar("2026-09-30T20:00:00Z");
  try {
    const wall = Date.now();
    assert.ok(Math.abs(wall - Date.parse("2026-09-30T20:00:00Z")) < 500);
    assert.ok(Math.abs(new Date().getTime() - wall) < 500);
    assert.equal(new Date("2027-01-01T06:00:00Z").toISOString(), "2027-01-01T06:00:00.000Z");
    assert.equal(new Date(2026, 8, 30).getFullYear(), 2026);
    const before = Date.now();
    await new Promise(resolve => setTimeout(resolve, 15));
    assert.ok(Date.now() >= before + 5, "wall clock must continue moving");
  } finally { restore(); }
  assert.equal(globalThis.Date, originalDate);
});

test("invalid fixture timestamps are rejected without modifying the clock", () => {
  const original = globalThis.Date;
  assert.throws(() => installFixtureCalendar("invalid"), /Invalid fixture/);
  assert.equal(globalThis.Date, original);
});
