import test from "node:test";
import assert from "node:assert/strict";
import { createTsTestLoader } from "./ts-test-loader.mjs";
const load = createTsTestLoader();
const runtime = load("src/lib/nightlife/search.ts", "\nexport {elementToPlace, mergeNightlife, queryMirror, curatedWithin};");
const { searchNightlife, elementToPlace, mergeNightlife, queryMirror, curatedWithin } = runtime;
const { heldCasino, inactivePlace } = load("src/lib/nightlife/discovery-policy.ts");
const element = (extra = {}) => ({ type: "node", id: 1, lat: 36.12, lon: -115.17, tags: { name: "Test Casino", amenity: "casino" }, ...extra });
test("invalid query coordinates and nonfinite radii cannot reach providers", () => {
  for (const data of [null, { lat: 91, lon: 0 }, { lat: 0, lon: -181 }, { lat: NaN, lon: 0 }, { lat: 1, lon: 2, radiusMiles: Infinity }, { lat: 1, lon: 2, radiusMiles: "20" }]) {
    assert.throws(() => searchNightlife.validate(data), /valid/);
  }
  assert.equal(searchNightlife.validate({ lat: 0, lon: 0, radiusMiles: 80 }).radiusMiles, 50);
});
test("malformed provider records are discarded individually", () => {
  for (const bad of [null, element({ lat: NaN }), element({ lon: 181 }), element({ id: null }), element({ tags: { name: 42 } }), element({ type: "url" })]) assert.equal(elementToPlace(bad), null);
  assert.ok(elementToPlace(element({ lat: undefined, lon: undefined, center: { lat: 36.12, lon: -115.17 } })));
});
test("casino words in an unrelated bar name do not satisfy the casino filter", () => {
  const bar = elementToPlace(element({ tags: { name: "Casino Pizza & Bar", amenity: "bar" } }));
  assert.ok(bar.venueTypes.includes("bar"));
  assert.ok(!bar.venueTypes.includes("casino"));
  assert.ok(elementToPlace(element()).venueTypes.includes("casino"));
});
test("closed property holds are geographically scoped and cannot suppress successors", () => {
  assert.ok(heldCasino("The Pass Casino", 36.032, -114.983));
  assert.equal(heldCasino("Railroad Pass Casino & Hotel", 36.032, -114.983), undefined);
  assert.equal(heldCasino("The Pass Casino", 40, -110), undefined);
  assert.equal(heldCasino("Cadence Crossing Casino", 36.052633, -114.994834), undefined);
  assert.equal(elementToPlace(element({ lat: 36.032, lon: -114.983, tags: { name: "The Pass Casino", amenity: "casino" } })), null);
  assert.ok(heldCasino("Comanche War Pony Casino", 34.16, -98.5));
});
test("lifecycle tags exclude inactive venues but preserve a current repurposed bar", () => {
  assert.equal(inactivePlace({ amenity: "casino", disused: "yes" }), true);
  assert.equal(inactivePlace({ "disused:amenity": "casino" }), true);
  assert.equal(inactivePlace({ amenity: "bar", "disused:amenity": "casino" }), false);
});
test("same-brand neighboring casino floors do not borrow each other's live metadata", () => {
  const wynn = { ...elementToPlace(element()), id: "wynn", name: "Wynn Las Vegas", openingHours: null };
  const encore = { ...wynn, id: "encore", name: "Encore at Wynn Las Vegas", lat: 36.121 };
  const live = { ...encore, id: "osm", openingHours: "24/7", source: "osm" };
  const merged = mergeNightlife([live], [wynn, encore]);
  assert.equal(merged.length, 2);
  assert.equal(merged[0].openingHours, null);
  assert.equal(merged[1].openingHours, "24/7");
  assert.equal(merged[1].id, "encore");
});
test("canonical casino location and identity survive live merging", () => {
  const curated = { ...elementToPlace(element()), id: "saved", name: "Test Casino", address: "Verified address" };
  const live = { ...curated, id: "osm", name: "Test Hotel & Casino", lat: 36.1201, address: "Bad live address", phone: "123" };
  const [merged] = mergeNightlife([live], [curated]);
  assert.equal(merged.id, "saved");
  assert.equal(merged.lat, curated.lat);
  assert.equal(merged.address, "Verified address");
  assert.equal(merged.phone, "123");
});
test("valid empty responses remain empty results; invalid JSON shape falls back", async () => {
  const original = globalThis.fetch;
  try {
    globalThis.fetch = async () => Response.json({ elements: [] });
    const result = await searchNightlife.execute({ data: { lat: 0, lon: 0, radiusMiles: 10 } });
    assert.deepEqual(result, { venues: [], source: "live" });
    globalThis.fetch = async () => Response.json({});
    await assert.rejects(queryMirror("https://example.com", ""), /Malformed/);
  } finally { globalThis.fetch = original; }
});
test("provider outages preserve the complete local canonical casino pool", async () => {
  const original = globalThis.fetch;
  try {
    globalThis.fetch = async () => { throw new Error("offline"); };
    const data = { lat: 36.1164, lon: -115.174, radiusMiles: 15 };
    const result = await searchNightlife.execute({ data });
    assert.equal(result.source, "fallback");
    assert.equal(result.venues.length, curatedWithin(data.lat, data.lon, 15).length);
    assert.ok(result.venues.length > 20);
    assert.match(result.warning, /saved nightlife/);
  } finally { globalThis.fetch = original; }
});

test("malformed optional fields cannot poison a provider response or create unsafe actions", async () => {
  const original = globalThis.fetch;
  try {
    globalThis.fetch = async () => Response.json({ elements: [
      element({ tags: { name: "Valid Casino", amenity: "casino", brand: 42, website: { href: "bad" }, phone: 123 } }),
      element({ id: 2, tags: { name: "Unsafe Casino", amenity: "casino", website: "javascript:alert(1)" } }),
      element({ id: 3, tags: { name: "Good Casino", amenity: "casino", website: "https://example.com/casino" } }),
    ] });
    const venues = await queryMirror("https://example.com", "");
    assert.equal(venues.length, 3);
    assert.equal(venues[0].website, null);
    assert.equal(venues[0].phone, null);
    assert.equal(venues[1].website, null);
    assert.equal(venues[2].website, "https://example.com/casino");
    for (const website of ["data:text/html,bad", "https://user:secret@example.com", "/relative"]) {
      assert.equal(elementToPlace(element({ tags: { name: "Casino", amenity: "casino", website } })).website, null);
    }
  } finally { globalThis.fetch = original; }
});

test("generic casino names cannot collapse distinct nearby properties into an empty identity", () => {
  const base = elementToPlace(element());
  const curated = { ...base, id: "one", name: "Casino" };
  const live = { ...base, id: "two", name: "Hotel & Casino", lat: base.lat + 0.001 };
  assert.equal(mergeNightlife([live], [curated]).length, 2);
});

test("reviewed predecessor names merge only into the same nearby current property", () => {
  const base = elementToPlace(element());
  for (const [name, former] of [
    ["J Resort", "Sands Regency Casino Hotel"],
    ["Caesars Republic Lake Tahoe", "Harveys Lake Tahoe"],
    ["Golden Nugget Lake Tahoe Hotel & Casino", "Hard Rock Hotel & Casino Lake Tahoe"],
    ["Bally’s Lake Tahoe Casino Resort", "MontBleu Resort Casino & Spa"],
  ]) {
    const saved = { ...base, id: "stable", name };
    const live = { ...base, id: "old", name: former, phone: "123", lat: base.lat + 0.001 };
    const merged = mergeNightlife([live], [saved]);
    assert.equal(merged.length, 1, name);
    assert.equal(merged[0].id, saved.id);
    assert.equal(merged[0].name, name);
    assert.equal(merged[0].phone, "123");
    assert.equal(mergeNightlife([{ ...live, lat: base.lat + 1 }], [saved]).length, 2);
  }
});

test("closed Oklahoma predecessors stay excluded without suppressing operating successors", () => {
  for (const [name, lat, lon] of [
    ["Ioway Casino", 35.70, -96.98],
    ["Kiowa Casino Verden", 35.09, -98.10],
    ["Creek Nation Casino Eufaula", 35.29, -95.59],
  ]) {
    assert.ok(heldCasino(name, lat, lon));
    assert.equal(elementToPlace(element({ lat, lon, tags: { name, amenity: "casino" } })), null);
  }
  for (const [name, lat, lon] of [
    ["Harrah's Oklahoma", 35.6933941, -96.9757739],
    ["Lake Eufaula Casino Hotel", 35.3000591, -95.5921671],
    ["Elk Creek Kiowa Casino", 35.0199635, -99.0613392],
  ]) assert.equal(heldCasino(name, lat, lon), undefined);
});
