import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { createTsTestLoader } from "./ts-test-loader.mjs";
const load = createTsTestLoader();
const { dedupeRestaurants, sourceRank } = load("src/lib/restaurants/normalize.ts", "\nexport { dedupeRestaurants, sourceRank };\n");
const { namesMatch } = load("src/lib/utils.ts");
const { haversineMiles } = load("src/lib/restaurants/geo.ts");
function legacy(rows) {
  const kept = [];
  for (const row of [...rows].sort((a, b) => sourceRank(b.source) - sourceRank(a.source))) {
    if (!kept.some(item => namesMatch(item.name, row.name) && haversineMiles(item.lat, item.lon, row.lat, row.lon) < 0.2)) kept.push(row);
  }
  return kept;
}
function row(id, name, lat, lon, source = "osm") { return { id, name, lat, lon, source }; }

test("spatial restaurant dedupe exactly preserves name rules, source priority, ordering and radius boundaries", () => {
  const points = [[43.65348, -79.38393], [51.5074, -0.1278], [37.084184, -94.513339], [-33.86, 151.2]];
  const delta = 0.2 / 3958.8 * 180 / Math.PI;
  const rows = points.flatMap(([lat, lon], i) => [
    row(`${i}-live`, "Cafe & Kitchen", lat, lon),
    row(`${i}-catalog`, "Cafe and Kitchen", lat + delta * 0.5, lon, "catalog"),
    row(`${i}-merged`, "Cafe and Kitchen Downtown", lat, lon, "merged"),
    row(`${i}-inside`, "Cafe and Kitchen", lat + delta * 0.99999, lon),
    row(`${i}-outside`, "Cafe and Kitchen", lat + delta * 1.00001, lon),
    row(`${i}-other-floor`, "Distinct Restaurant", lat, lon),
  ]);
  for (const input of [rows, [...rows].reverse()]) assert.deepEqual(dedupeRestaurants(input), legacy(input));
  assert.ok(dedupeRestaurants(rows).some(item => item.id === "0-outside"));
  assert.ok(dedupeRestaurants(rows).some(item => item.id === "0-other-floor"));
  assert.equal(rows.length, 24, "No input mutation");
});

test("spatial restaurant candidates preserve duplicates across the antimeridian and near both poles", () => {
  const rows = [
    row("east", "Dateline Cafe", 0, 179.999), row("west", "Dateline Cafe", 0, -179.999),
    row("north-a", "Polar Kitchen", 89.999, 0), row("north-b", "Polar Kitchen", 89.999, 170),
    row("south-a", "Polar Kitchen", -89.999, -20), row("south-b", "Polar Kitchen", -89.999, 150),
    row("equator-a", "Origin Cafe", 0, 0), row("equator-b", "Origin Cafe", 0, -0.001),
  ];
  assert.deepEqual(dedupeRestaurants(rows), legacy(rows));
  assert.equal(dedupeRestaurants(rows).length, 4);
});

test("dense international pools preserve thousands of distinct restaurants and duplicate identities", () => {
  const rows = Array.from({ length: 8000 }, (_, i) => row(
    `city-${i}`, createHash("sha256").update(String(i)).digest("hex").slice(0, 14) + " Kitchen",
    43.5 + (i % 100) * 0.003, -79.5 + Math.floor(i / 100) * 0.003,
  ));
  const duplicates = rows.filter((_, i) => i % 13 === 0).map(item => ({ ...item, id: "duplicate-" + item.id, lat: item.lat + 0.0001 }));
  assert.deepEqual(dedupeRestaurants([...rows, ...duplicates]), rows);
});
