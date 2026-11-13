import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { appModuleLoader } from "./test-support/load-app-module.mjs";
import { discoveryClock } from "./test-support/discovery-clock.mjs";

// The same executable can run with cwd=/workspace/christmas-final-acceptance
// to replay the reviewed d933 parent without editing that checkout.
const reviewed = JSON.parse(readFileSync(new URL("./test-support/christmas-park-source.json", import.meta.url), "utf8")).element;
const parkId = "date-night-osm-way-987588580";
const baseQuery = { ...reviewed.center, radiusMiles: 15, spookySeasonEnabled: false, activityTypes: ["movies", "park"], patchId: "radial-v1:core" };
const cacheQuery = { ...baseQuery, halloweenActive: false };
const school = { ...reviewed, version: 3, changeset: 189037688,
  tags: { ...reviewed.tags, amenity: "school" } };
delete school.tags.leisure;

function culturePacket(size, position) {
  const fillers = Array.from({ length: 19_998 }, (_, index) => ({ type: "node", id: 10_000_000 + index,
    tags: { amenity: "school" } }));
  const packet = [...fillers, fillers[0]];
  if (size === 20_001) packet.push(fillers[0]); // The only extra information is a duplicate filler.
  if (position === "first") packet.unshift(school); else packet.push(school);
  assert.equal(packet.length, size);
  return packet;
}

function setup(t, culture, outdoor = [reviewed]) {
  discoveryClock(t);
  t.mock.method(console, "warn", () => {});
  const calls = { culture: 0, outdoor: 0 };
  t.mock.method(globalThis, "fetch", async (_url, init) => {
    const query = new URLSearchParams(init.body).get("data").split(")->.lifecycle_context;\n").at(-1);
    const group = query.includes('nwr["amenity"="cinema"](around:') ? "culture" : "outdoor";
    calls[group]++;
    const input = group === "culture" ? culture : outdoor;
    if (input instanceof Error) throw input;
    const elements = typeof input === "function" ? input(calls[group]) : input;
    return { ok: true, json: async () => ({ elements }) };
  });
  const load = appModuleLoader();
  const { searchDateNight } = load("src/lib/date-night/search.ts");
  const { decorateDateNight } = load("src/lib/date-night/eligibility.ts");
  const { resolveChristmasParkBinding, REVIEWED_CHRISTMAS_BINDINGS } = load("src/lib/date-night/christmas-binding.ts");
  const { buildIsolatedChristmasPilotCandidate, buildChristmasPilotCandidate } = load("src/lib/date-night/christmas-pilot.ts");
  const { DEFAULT_DATE_NIGHT_FILTERS } = load("src/lib/date-night/types.ts");
  const now = new Date("2026-12-01T18:00:00-06:00");
  const decorate = response => decorateDateNight(response?.venues ?? [], reviewed.center, now);
  return { load, calls, search: (query = baseQuery) => searchDateNight({ data: query }),
    bind: response => resolveChristmasParkBinding(decorate(response), REVIEWED_CHRISTMAS_BINDINGS),
    candidate: (response, publicPath = false) => (publicPath ? buildChristmasPilotCandidate : buildIsolatedChristmasPilotCandidate)({
      venues: decorate(response), bindings: REVIEWED_CHRISTMAS_BINDINGS,
      filters: { ...DEFAULT_DATE_NIGHT_FILTERS, radiusMiles: 15, activityTypes: ["anything"], openNowOnly: false },
      selectedCategories: ["christmas-lights"], homeMode: "date-night", christmasEnabled: true, location: reviewed.center, now,
    }),
  };
}

for (const size of [20_000, 20_001]) for (const position of ["first", "last"]) {
  test(`exact ${size} culture packet, contradiction ${position}: fresh and retained park binding stays withheld`, async t => {
    const h = setup(t, culturePacket(size, position));
    const response = await h.search();
    const expected = size === 20_000 ? "conflicting-source" : "incomplete-source-evidence";
    assert.equal(h.bind(response).state, expected);
    assert.equal(h.calls.outdoor, 1);
    assert.equal(h.calls.culture, size === 20_000 ? 1 : 4, "oversized group must exhaust all four mirrors");
    assert.equal(response.venues.filter(place => place.id === parkId).length, 1);
    assert.deepEqual(response.venues.find(place => place.id === parkId).activityTypes, ["park"]);
    assert.equal(response.venues.some(place => place.activityTypes.includes("school")), false);
    for (const path of ["cache", "radial-cache"]) {
      const module = h.load(`src/lib/date-night/${path}.ts`);
      const cache = path === "cache" ? module.createDateNightDiscoveryCache() : module.createDateNightRadialCache();
      assert.equal(cache.store(cacheQuery, response), true);
      const retained = cache.read(cacheQuery).response;
      assert.equal(h.bind(retained).state, expected, `${path} must preserve incomplete or contradictory evidence`);
      assert.equal(h.candidate(retained).choices.some(choice => ["temporary-event", "permanent-venue-display"].includes(choice.kind)), false);
      assert.equal(h.candidate(retained, true).choices.some(choice => ["temporary-event", "permanent-venue-display"].includes(choice.kind)), false, "public HOLD never changes");
    }
    if (size === 20_001) {
      assert.deepEqual(response.identityUncertainty.scopes[0].activityTypes, ["movies"]);
      assert.equal(response.identityObservations.some(item => item.sourceIdentity?.version === 3), false,
        "uncertainty must not invent a definitive v3 observation from a rejected packet");
    }
  });
}

test("exhausted network group preserves uncertainty alongside a successful reviewed park", async t => {
  const h = setup(t, new Error("controlled exhausted provider group"));
  const response = await h.search();
  assert.equal(h.calls.culture, 4);
  assert.equal(h.calls.outdoor, 1);
  assert.equal(h.bind(response).state, "incomplete-source-evidence");
  assert.deepEqual(response.identityUncertainty.scopes[0].activityTypes, ["movies"]);
  assert.equal(response.venues.some(place => place.id === parkId), true, "ordinary park discovery remains usable");
});

test("all exhausted provider groups keep a bounded uncertainty envelope without claiming coverage", async t => {
  const h = setup(t, new Error("culture unavailable"), new Error("outdoor unavailable"));
  const response = await h.search();
  assert.deepEqual(h.calls, { culture: 4, outdoor: 4 });
  assert.equal(response.source, "fallback");
  assert.equal(response.discovery.groups.every(group => group.outcome === "failed"), true);
  assert.deepEqual(response.identityUncertainty.scopes[0].activityTypes, ["movies", "park"]);
  assert.equal(response.identityEvidenceCoverage, undefined);
  assert.equal(response.venues.some(place => place.id === parkId), false);
});

test("a successful complete winning mirror isolates earlier oversized attempts", async t => {
  const oversized = culturePacket(20_001, "first");
  const h = setup(t, attempt => attempt === 1 ? oversized : []);
  const response = await h.search();
  assert.equal(h.calls.culture, 2);
  assert.equal(h.bind(response).state, "bound");
  assert.equal(response.identityUncertainty, undefined);
  assert.deepEqual(response.identityEvidenceCoverage.activityTypes, ["movies", "park"]);
  assert.equal(response.identityObservations.some(item => item.sourceIdentity?.version === 3), false);
});

test("fresh complete reviewed v2 search binds with ordinary categories and public HOLD preserved", async t => {
  const cinema = { type: "node", id: 99008811, lat: reviewed.center.lat, lon: reviewed.center.lon,
    tags: { name: "Controlled cinema", amenity: "cinema" } };
  const h = setup(t, [cinema]);
  const response = await h.search();
  assert.equal(h.bind(response).state, "bound");
  assert.equal(response.venues.some(place => place.name === "Controlled cinema" && place.activityTypes.includes("movies")), true);
  assert.equal(response.identityUncertainty, undefined);
  assert.equal(h.candidate(response).choices.filter(choice => choice.kind === "permanent-venue-display").length, 1, "adequate fresh packet supports isolated Sparkle only");
  assert.equal(h.candidate(response, true).choices.some(choice => ["temporary-event", "permanent-venue-display"].includes(choice.kind)), false);
});

test("identity merging preserves source incompleteness in either input order without changing ordinary classification", async t => {
  const h = setup(t, []);
  const fresh = await h.search();
  const { identityUncertaintyFor } = h.load("src/lib/date-night/source-observations.ts");
  const { mergeDateNight } = h.load("src/lib/date-night/identity.ts");
  const venue = fresh.venues.find(place => place.id === parkId);
  const uncertain = { ...venue, identityUncertainty: identityUncertaintyFor(cacheQuery, ["movies"]) };
  for (const rows of [[venue, uncertain], [uncertain, venue]]) {
    const venues = mergeDateNight(rows, []);
    assert.equal(venues.length, 1);
    assert.equal(h.bind({ ...fresh, venues }).state, "incomplete-source-evidence");
    assert.deepEqual(venues[0].activityTypes, ["park"]);
  }
});

test("fresh identity authority rejects contradictory patch descriptors and cache-hit metadata", async t => {
  const h = setup(t, []);
  const fresh = await h.search();
  const { identityUncertaintyFor, resolveDateNightIdentityUncertainty, refreshDateNightIdentityUncertainty } = h.load("src/lib/date-night/source-observations.ts");
  const gap = identityUncertaintyFor(cacheQuery, ["movies"]);
  const retained = fresh.venues.map(venue => ({ ...venue, identityUncertainty: gap }));
  for (const packet of [
    { ...fresh, patch: undefined },
    { ...fresh, patch: { id: "radial-v1:20:0", version: "radial-v1" } },
    { ...fresh, discovery: { ...fresh.discovery, groups: fresh.discovery.groups.map(group => ({ ...group, outcome: "cache-hit", originOutcome: group.outcome })) } },
  ]) {
    assert.deepEqual(resolveDateNightIdentityUncertainty(gap, packet), gap);
    assert.equal(h.bind({ ...packet, venues: refreshDateNightIdentityUncertainty(retained, packet) }).state, "incomplete-source-evidence");
  }
  assert.equal(resolveDateNightIdentityUncertainty(gap, fresh), undefined);
  assert.equal(h.bind({ ...fresh, venues: refreshDateNightIdentityUncertainty(retained, fresh) }).state, "bound");
});

test("own fresh source identity is required before a retained row can lose its uncertainty", async t => {
  const h = setup(t, []);
  const fresh = await h.search();
  const { identityUncertaintyFor, refreshDateNightIdentityUncertainty } = h.load("src/lib/date-night/source-observations.ts");
  const gap = identityUncertaintyFor(cacheQuery, ["movies"]);
  const retained = fresh.venues.map(venue => ({ ...venue, identityUncertainty: gap }));
  for (const mutate of [
    source => ({ ...source, version: undefined }),
    source => ({ ...source, changeset: undefined }),
    source => ({ ...source, objectId: source.objectId + 1 }),
  ]) {
    const packet = { ...fresh, venues: fresh.venues.map(venue => ({ ...venue,
      discoveryEvidence: venue.discoveryEvidence?.map(item => ({ ...item, sourceIdentity: item.sourceIdentity ? mutate(item.sourceIdentity) : undefined })),
    })) };
    assert.equal(h.bind({ ...packet, venues: refreshDateNightIdentityUncertainty(retained, packet) }).state, "incomplete-source-evidence");
  }
});
