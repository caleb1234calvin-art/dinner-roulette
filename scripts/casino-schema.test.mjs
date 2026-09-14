import test from "node:test";
import assert from "node:assert/strict";
import { casinoSchemaFailures } from "./casino-schema.mjs";
import { loadCasinoCatalogs } from "./casino-catalog-loader.mjs";
const { records } = await loadCasinoCatalogs();
const valid = records.find((r) => r.audit?.jurisdiction === "Nevada");
test("every serialized runtime casino satisfies the application data schema", () => {
  assert.deepEqual(casinoSchemaFailures(records), []);
});
test("missing required fields, duplicate type tags, wrong categories and malformed nulls fail", () => {
  for (const patch of [{ id: "" }, { name: null }, { address: "" }, { cuisineLabel: "Bar" }, { venueTypes: ["casino", "casino"] }, { priceLevel: 9 }, { website: undefined }, { openingHours: "" }, { reviewCount: -1 }, { rating: NaN }, { source: "osm" }, { energyLevel: 99 }]) {
    assert.ok(casinoSchemaFailures([{ ...valid, ...patch }]).length > 0, JSON.stringify(patch));
  }
});
test("coordinate range, state leakage and jurisdiction disagreement are rejected", () => {
  for (const patch of [{ lat: Infinity }, { lon: -181 }, { lat: 40, lon: -97 }, { address: "1 Street, Tulsa, OK 74101" }]) {
    assert.ok(casinoSchemaFailures([{ ...valid, ...patch }]).length > 0);
  }
});
test("new passes cannot activate without identity and coordinate evidence", () => {
  const future = { ...valid, file: "src/lib/nightlife/casino-catalog-pass-51.ts", audit: { jurisdiction: "Nevada", verifiedOn: "2026-09-13" } };
  assert.match(casinoSchemaFailures([future]).join("\n"), /source evidence/);
});
test("unsafe website schemes cannot enter destination actions", () => {
  for (const website of ["javascript:alert(1)", "data:text/html,bad", "https://user:password@example.com", "not-a-url"]) {
    assert.match(casinoSchemaFailures([{ ...valid, website }]).join("\n"), /website/);
  }
});
