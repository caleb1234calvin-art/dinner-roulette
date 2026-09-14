import test from "node:test";
import assert from "node:assert/strict";
import { createTsTestLoader } from "./ts-test-loader.mjs";
const load = createTsTestLoader();
const { eligibleNightlife, weightedPick, pickOptions } = load("src/lib/nightlife/selection.ts");
const { DEFAULT_NIGHTLIFE_FILTERS: defaults } = load("src/lib/nightlife/types.ts");
const place = (id = "casino-a", extra = {}) => ({
  id, name: "Casino d’Étoile & Friends", distanceMiles: 2, energyLevel: 2,
  venueTypes: ["casino"], priceLevel: null, hoursKnown: false, isOpen: false, ...extra,
});
test("strict open-now requires known open hours; default exposes saved destinations honestly", () => {
  const venues = [place("unknown"), place("closed", { hoursKnown: true }), place("open", { hoursKnown: true, isOpen: true })];
  assert.deepEqual(eligibleNightlife(venues, { ...defaults, openNowOnly: true }, {}, []).map((p) => p.id), ["open"]);
  assert.equal(eligibleNightlife(venues, defaults, {}, []).length, 3);
});
test("casino type, radius and known/unknown price filters compose", () => {
  const venues = [place(), place("bar", { venueTypes: ["bar"] }), place("far", { distanceMiles: 11 }), place("costly", { priceLevel: 4 })];
  const filters = { ...defaults, venueTypes: ["casino"], maxPrice: 2 };
  assert.deepEqual(eligibleNightlife(venues, filters, {}, []).map((p) => p.id), ["casino-a"]);
  assert.deepEqual(eligibleNightlife(venues, { ...filters, includeUnknownPrice: false }, {}, []), []);
});
test("favorites, permanent exclusions and expiring exclusions protect selection", () => {
  const venues = [place("favorite"), place("never"), place("tonight"), place("expired")];
  const preferences = { favorite: { favorite: true }, never: { neverRecommend: true } };
  const exclusions = [{ restaurantId: "tonight", expiresAt: 101 }, { restaurantId: "expired", expiresAt: 99 }];
  assert.deepEqual(eligibleNightlife(venues, defaults, preferences, exclusions, 100).map((p) => p.id), ["favorite", "expired"]);
  assert.deepEqual(eligibleNightlife(venues, { ...defaults, favoritesOnly: true }, preferences, exclusions, 100).map((p) => p.id), ["favorite"]);
});
test("empty and singleton pools terminate with correct option counts", () => {
  assert.equal(weightedPick([], 50, []), null);
  assert.deepEqual(pickOptions([], 50, []), []);
  assert.equal(pickOptions([place()], 50, [], 4).length, 1);
});
test("options never return duplicate identifiers or mutate the input", () => {
  const venues = [place(), place(), place("second")];
  const result = pickOptions(venues, 50, [], 4, () => 0);
  assert.deepEqual(result.map((p) => p.id), ["casino-a", "second"]);
  assert.equal(venues.length, 3);
});
test("energy and repeat penalties influence weighted picks without excluding all shown places", () => {
  const venues = [place("chill", { energyLevel: 1 }), place("lively", { energyLevel: 3 })];
  assert.equal(weightedPick(venues, 0, [], () => 0.5).id, "chill");
  assert.equal(weightedPick(venues, 100, [], () => 0.5).id, "lively");
  assert.equal(weightedPick(venues, 0, ["chill"], () => 0.5).id, "lively");
  assert.ok(weightedPick(venues, 50, ["chill", "lively"]));
});
test("large catalog sampling retains Unicode names and distinct options", () => {
  const venues = Array.from({ length: 10000 }, (_, i) => place("casino-" + i));
  const result = pickOptions(venues, 50, [], 4, () => 0.99999);
  assert.equal(result.length, 4);
  assert.equal(new Set(result.map((p) => p.id)).size, 4);
  assert.ok(result.every((p) => p.name === "Casino d’Étoile & Friends"));
});
