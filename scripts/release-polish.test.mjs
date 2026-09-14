import assert from "node:assert/strict";
import test from "node:test";
import { existsSync } from "node:fs";
import { appModuleLoader } from "./test-support/load-app-module.mjs";

const load = appModuleLoader();
const { dinnerIconPath, dinnerIconKey } = load("src/lib/restaurants/dinner-icons.ts");
const { nightlifeArtwork } = load("src/lib/nightlife/types.ts");

// Asset identities are from visual inspection of both existing image packs.
// The dark filenames are displaced; light filenames already describe the art.
const inspectedDark = {
  burger: "bbq", pizza: "burger", mexican: "fallback", chinese: "pizza",
  japanese: "breakfast", italian: "mexican", steakhouse: "chinese", bbq: "chicken",
  chicken: "japanese", "cafe-bakery": "italian", dessert: "cafe-bakery",
  seafood: "dessert", buffet: "seafood", breakfast: "buffet", fallback: "seafood",
};

test("light Dinner artwork retains the visually correct cuisine in its own asset pack", () => {
  for (const key of Object.keys(inspectedDark)) {
    assert.equal(dinnerIconPath(key, "light"), `/dinner-icons/light/${key}.jpg`, key);
    assert.ok(existsSync(`public${dinnerIconPath(key, "light")}`));
  }
});

test("dark Dinner artwork preserves the accepted visually verified mapping", () => {
  for (const [key, asset] of Object.entries(inspectedDark)) {
    assert.equal(dinnerIconPath(key, "dark"), `/dinner-icons/dark/${asset}.jpg`, key);
    assert.ok(existsSync(`public${dinnerIconPath(key, "dark")}`));
  }
});

test("specific Dinner cuisines outrank broad provider categories without guessing food for generic venues", () => {
  for (const [cuisine, expected] of [["pizza", "pizza"], ["chinese", "chinese"], ["sushi", "japanese"], ["coffee", "cafe-bakery"], ["breakfast", "breakfast"], ["burgers", "burger"]]) {
    assert.equal(dinnerIconKey({ name: "Fixture", photoKey: "burger", cuisineLabel: "", cuisines: ["american", "fast_food", cuisine] }), expected);
  }
  assert.equal(dinnerIconKey({ name: "Fixture", photoKey: "burger", cuisineLabel: "", cuisines: ["fast_food"] }), "fallback");
});

test("Nightlife result artwork covers all approved categories and preserves Casino precedence", () => {
  const artwork = {
    bar: "/grok_1789341445435.jpg", pub: "/grok_1789340964876.jpg",
    club: "/grok_1789340968434.jpg", lounge: "/grok_1789340971434.jpg",
    brewery: "/grok_1789340974874.jpg", casino: "/grok_1788913461447.jpg",
  };
  for (const [type, asset] of Object.entries(artwork)) {
    assert.equal(nightlifeArtwork([type]), asset);
    assert.ok(existsSync(`public${asset}`));
  }
  assert.equal(nightlifeArtwork(["bar", "casino"]), artwork.casino);
  assert.equal(nightlifeArtwork([]), null);
});
