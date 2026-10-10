import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync, readdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { appModuleLoader } from "./test-support/load-app-module.mjs";
const load = appModuleLoader();
const { MISSOURI_2026_PHASE4_RECOVERY_CATALOG: rows } = load("src/lib/date-night/missouri-2026-phase4-recovery-catalog.ts");
const { JASPER_COUNTY_SEASONAL_DATE_NIGHT_CATALOG: anchors } = load("src/lib/date-night/seasonal-catalog.ts");
const { decorateDateNight, eligibleDateNight } = load("src/lib/date-night/eligibility.ts");
const { DEFAULT_DATE_NIGHT_FILTERS } = load("src/lib/date-night/types.ts");
const { dedupeDateNight } = load("src/lib/date-night/identity.ts");
const { combineDateNightDiscovery } = load("src/lib/date-night/cache.ts");
const { getCuratedSeasonalPlace } = load("src/lib/date-night/curated-policy.ts");
const { getDateNightAvailability, isDateNightOpenNowEligible, getSeasonalDateStatus } = load("src/lib/date-night/availability.ts");
const { seasonalPresentation } = load("src/lib/date-night/seasonal-presentation.ts");
const { resolveSavedSeasonalPlace, recordSeasonalIdentityReceipts, seasonalReceiptAliasIds } = load("src/lib/date-night/identity-receipts.ts");
const { directionsUrl } = load("src/lib/location/maps.ts");
const { uberRideTarget } = load("src/lib/location/ride-target.ts");
const { searchDateNight } = load("src/lib/date-night/search.ts");
const at = new Date("2026-10-10T20:00:00-05:00");
const pool = (row, places = [row], now = at, filters = {}, preferences = {}, exclusions = [], halloween = true) => eligibleDateNight(
  decorateDateNight(places, row, now), { ...DEFAULT_DATE_NIGHT_FILTERS, radiusMiles: 1, activityTypes: ["anything"], openNowOnly: false, ...filters }, halloween, preferences, exclusions, now.getTime());
const acceptedBytes = readFileSync("audit/phase4-recovery-implementation-2026-10-10/Accepted-Seven-Record-Subset-R1.json");
const accepted = JSON.parse(acceptedBytes);
const ids = ["MO26-006", "MO26-004", "DELTA3-FEARSTONE", "DELTA3-FUN-TIME", "MO26-055", "DELTA2-TERROR66", "DELTA6-BRANSON-FIELD"];
const cutoffs = ["2026-11-01T05:00:00Z", "2026-11-01T05:00:00Z", "2026-10-31T05:00:00Z", "2026-11-01T05:00:00Z", "2026-11-01T05:00:00Z", "2026-11-02T06:00:00Z", "2026-11-15T06:00:00Z"];
const current = id => rows.find(row => row.seasonalListing.recordId === id);
const providerFor = row => ({ ...row, id: `date-night-osm-node-${rows.indexOf(row) + 991100}`, source: "osm", openingHours: "24/7", seasonalAvailability: undefined, seasonalListing: undefined, seasonalVisitNotes: undefined });
const allPrior = readdirSync("src/lib/date-night").filter(name => /^missouri-.*catalog\.ts$/.test(name) && !name.includes("phase4-recovery"))
  .flatMap(file => Object.entries(load(`src/lib/date-night/${file}`)).filter(([key]) => key.endsWith("_CATALOG")).flatMap(([, value]) => value));

test("recovery input is exactly independently cleared seven; 52 V1 plus one legacy becomes 59 unique V1, six new", () => {
  assert.equal(createHash("sha256").update(acceptedBytes).digest("hex"), "827eb67919c99dec61991cbc01cba63097ccd5dd1868de355b5f79b07d348882");
  assert.deepEqual(rows.map(row => row.seasonalListing.recordId), ids);
  assert.equal(allPrior.length, 52);
  assert.equal(new Set(allPrior.map(row => row.id)).size, 52);
  assert.equal(anchors.length, 0, "Superseded Werehouse anchor is not a second entry");
  assert.equal(new Set([...allPrior, ...rows].map(row => row.id)).size, 59);
  assert.equal(rows.filter(row => row.id === "date-night-werehouse-joplin").length, 1);
  assert.equal(rows.filter(row => row.id !== "date-night-werehouse-joplin").length, 6);
  assert.ok(!rows.some(row => /ROLLA|CADAVER|WACO|TERRIFIEDEXIST/.test(row.seasonalListing.recordId)));
  for (const row of rows) {
    assert.equal(getCuratedSeasonalPlace(row.id), row);
    assert.equal(row.openingHours, null);
    assert.equal(row.seasonalAvailability.openNowPolicy, "never");
    assert.equal(row.seasonalAvailability.endsAt, undefined, "Date-only/editorial expiry never asserts final exit");
    assert.equal(row.seasonalListing.expiryBasis, row.seasonalListing.recordId === "DELTA3-FUN-TIME" ? "editorial" : "date-only");
    assert.equal(row.seasonalListing.visibility, row.seasonalListing.recordId === "DELTA6-BRANSON-FIELD" ? "listing-lifecycle" : undefined);
    assert.equal(seasonalPresentation(row).confidence, "limited");
  }
});

test("normalized runtime facts match immutable approved fields without reconstructed dates or geometry", () => {
  for (const [i, row] of rows.entries()) {
    const r = accepted.records[i], p = r.acceptedProjection, f = p.fields;
    assert.equal(row.name, p.name);
    assert.equal(row.address, p.address ?? f.visitor_address.value);
    assert.deepEqual([row.lat, row.lon], p.lat != null ? [p.lat, p.lon] : [r.acceptedPlacement.latitude, r.acceptedPlacement.longitude]);
    assert.equal(Date.parse(row.seasonalListing.listingExpiresAt), Date.parse(cutoffs[i]));
    assert.equal(row.seasonalAvailability.listingExpiresAt, row.seasonalListing.listingExpiresAt);
    assert.equal(row.seasonalListing.directionsTarget.address, row.address);
    assert.equal(row.seasonalListing.placement.basis === "verified-arrival", false);
    assert.equal(row.seasonalListing.timeZone, "America/Chicago");
    assert.equal(row.seasonalListing.seasonYear, 2026);
    if (p.valid_dates ?? p.exactActiveDates) assert.deepEqual(row.seasonalAvailability.activeDates, p.valid_dates ?? p.exactActiveDates);
    else if (r.recordId !== "MO26-055") assert.equal(row.seasonalAvailability.activeDates, undefined);
    assert.doesNotMatch(seasonalPresentation(row).details.join(" "), /\$\s*\d|refund|audit|retention|reviewRevision|machine intervals|Census/i);
  }
});

for (const [i, row] of rows.entries()) {
  test(`${row.name}: exact cutoff -1ms/exact/+1ms, never Open Now and no 2027 revival`, () => {
    const cutoff = Date.parse(cutoffs[i]);
    for (const now of [at, new Date(cutoff - 1)]) {
      assert.equal(pool(row, [row], now).length, 1);
      assert.equal(pool(row, [row], now, { openNowOnly: true }).length, 0);
    }
    for (const now of [new Date(cutoff), new Date(cutoff + 1), new Date("2027-10-10T20:00:00-05:00")]) assert.equal(pool(row, [row], now).length, 0);
  });
  test(`${row.name}: address Directions, approximate radius and preference/category rules`, () => {
    assert.equal(new URL(directionsUrl(row)).searchParams.get("destination"), row.address);
    assert.equal(uberRideTarget(row).url, "https://m.uber.com/");
    assert.equal(pool({ ...row, lat: row.lat + 0.04 }, [row]).length, 0);
    assert.equal(pool(row, [row], at, { favoritesOnly: true }).length, 0);
    assert.equal(pool(row, [row], at, { favoritesOnly: true }, { [row.id]: { favorite: true } }).length, 1);
    assert.equal(pool(row, [row], at, {}, { [row.id]: { neverRecommend: true } }).length, 0);
    assert.equal(pool(row, [row], at, {}, {}, [{ restaurantId: row.id, expiresAt: at.getTime() + 1 }]).length, 0);
    assert.equal(pool(row, [row], at, {}, {}, [], false).length, row.seasonalListing.visibility === "listing-lifecycle" ? 1 : 0);
    for (const activityTypes of [["park"], ["museum"], ["movies"]]) assert.equal(pool(row, [row], at, { activityTypes }).length, 0);
  });
  test(`${row.name}: conflicting provider/cache duplicates cannot overwrite current policy or negative closure`, () => {
    const provider = providerFor(row);
    for (const order of [[row, provider], [provider, row]]) {
      const merged = dedupeDateNight(order);
      assert.equal(merged.length, 1); assert.equal(merged[0].id, row.id);
      const cached = combineDateNightDiscovery({ response: { venues: [order[0]], source: "merged" }, missingActivityTypes: [] }, { venues: [order[1]], source: "live" });
      for (const places of [merged, cached.venues]) {
        assert.equal(places.length, 1); assert.deepEqual(places[0].seasonalListing, row.seasonalListing);
        assert.equal(places[0].openingHours, null);
        assert.equal(pool(row, places, at, { openNowOnly: true }).length, 0);
        for (const delta of [-1, 0, 1]) assert.equal(pool(row, places, new Date(Date.parse(cutoffs[i]) + delta)).length, delta < 0 ? 1 : 0);
      }
    }
    assert.equal(pool(row, dedupeDateNight([row, { ...provider, lifecycle: "permanently-closed" }])).length, 0);
  });
  test(`${row.name}: saved alias receipts and stale current IDs rehydrate current destination and cutoff`, t => {
    const store = new Map(), previous = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
    Object.defineProperty(globalThis, "localStorage", { configurable: true, value: { getItem: key => store.get(key) ?? null, setItem: (key, value) => store.set(key, value) } });
    t.after(() => previous ? Object.defineProperty(globalThis, "localStorage", previous) : delete globalThis.localStorage);
    const stale = { ...row, lat: 0, lon: 0, openingHours: "24/7", seasonalListing: undefined, seasonalAvailability: undefined };
    const restored = decorateDateNight([stale], row, at)[0];
    assert.deepEqual([restored.lat, restored.lon], [row.lat, row.lon]);
    assert.deepEqual(restored.seasonalListing, row.seasonalListing); assert.equal(restored.isOpen, false);
    const provider = providerFor(row); recordSeasonalIdentityReceipts(dedupeDateNight([provider, row]));
    assert.ok(seasonalReceiptAliasIds(row.id).includes(provider.id));
    const saved = resolveSavedSeasonalPlace({ restaurantId: provider.id, name: row.name });
    assert.equal(saved.id, row.id); assert.equal(new URL(directionsUrl(saved)).searchParams.get("destination"), row.address);
    for (const delta of [-1, 0, 1]) assert.equal(pool(row, [saved], new Date(Date.parse(cutoffs[i]) + delta)).length, delta < 0 ? 1 : 0);
    assert.equal(pool(row, [saved], new Date("2027-10-10T20:00:00-05:00")).length, 0);
  });
  test(`${row.name}: server provider success/fallback discovery obeys season-off and hard expiry`, async t => {
    t.mock.timers.enable({ apis: ["Date"], now: at.getTime() }); let outage = false;
    t.mock.method(globalThis, "fetch", async () => { if (outage) throw new Error("Controlled provider outage"); return Response.json({ elements: [] }); });
    const query = { lat: row.lat, lon: row.lon, radiusMiles: 1, activityTypes: ["anything"], spookySeasonEnabled: true };
    for (const failure of [false, true]) { outage = failure; const response = await searchDateNight({ data: query }); assert.ok(response.venues.some(place => place.id === row.id)); assert.ok(pool(row, response.venues).some(place => place.id === row.id)); }
    outage = false;
    const off = await searchDateNight({ data: { ...query, spookySeasonEnabled: false } });
    assert.equal(off.venues.some(place => place.id === row.id), row.seasonalListing.visibility === "listing-lifecycle");
    for (const delta of [-1, 0, 1]) {
      t.mock.timers.setTime(Date.parse(cutoffs[i]) + delta);
      const response = await searchDateNight({ data: query });
      assert.equal(pool(row, response.venues, new Date(Date.parse(cutoffs[i]) + delta)).some(place => place.id === row.id), delta < 0);
    }
  });
}

test("Werehouse legacy ID-only paths cannot recover old coordinates, machine hours or a duplicate", () => {
  const row = current("MO26-004");
  const legacy = { ...row, lat: 37.0694258, lon: -94.4688601, address: "3819 E 20th St, Joplin, MO 64801", openingHours: "Fr-Sa 19:00-24:00", seasonalListing: undefined, seasonalAvailability: undefined };
  for (const now of [at, new Date("2026-09-25T20:00:00-05:00")]) {
    assert.equal(isDateNightOpenNowEligible({ id: row.id, hoursKnown: true, isOpen: true }, true, now), false);
    assert.equal(pool(row, [legacy], now, { openNowOnly: true }).length, 0);
  }
  const merged = dedupeDateNight([legacy, providerFor(row), row]);
  assert.equal(merged.length, 1); assert.equal(merged[0].id, "date-night-werehouse-joplin");
  assert.deepEqual([merged[0].lat, merged[0].lon], [37.069463315708, -94.464636904963]);
  assert.equal(getSeasonalDateStatus(row.id, new Date("2026-10-11T20:00:00-05:00")), "unavailable");
});

test("Fun Time never borrows directory subtype dates and its cutoff remains editorial", () => {
  const row = current("DELTA3-FUN-TIME");
  assert.deepEqual(row.activityTypes, ["corn-maze", "haunted-house"]);
  for (const key of ["activeFrom", "activeUntil", "activeDates", "endsAt"]) assert.equal(row.seasonalAvailability[key], undefined);
  assert.equal(row.seasonalAvailability.status, "unconfirmed");
  assert.equal(row.seasonalListing.hours.state, "unknown");
  assert.equal(row.seasonalListing.expiryBasis, "editorial");
  assert.equal(decorateDateNight([row], row, at)[0].availability.status, "schedule-unconfirmed");
  assert.match(seasonalPresentation(row).details.join(" "), /attraction dates and hours unconfirmed/);
});

test("Fearstone keeps the adult night and ordinary access/weather restrictions while excluding Kids Night", () => {
  const row = current("DELTA3-FEARSTONE"), details = seasonalPresentation(row).details.join(" ");
  assert.equal(row.seasonalAvailability.activeDates.length, 9);
  assert.ok(!row.seasonalAvailability.activeDates.includes("2026-10-31"));
  for (const pattern of [/October 17.*18\+/, /photo ID/, /waiver/, /12\+ recommended/, /under 12.*parent or guardian.*walk independently/, /not handicap accessible/, /Lightning.*delay or cancel/, /Separate no-scare Kids Night: October 31, 4–6 p.m./]) assert.match(details, pattern);
});

test("Carolyn preserves weekly dates, separate pumpkin-only identity and visitor entry/access restrictions", () => {
  const row = current("MO26-055"), details = seasonalPresentation(row).details.join(" ");
  assert.deepEqual(row.activityTypes, ["pumpkin-patch"]);
  assert.equal(row.seasonalAvailability.activeDates.length, 31);
  for (const date of row.seasonalAvailability.activeDates) assert.ok([0, 1, 4, 5, 6].includes(new Date(`${date}T12:00:00Z`).getUTCDay()));
  for (const pattern of [/September 19–October 31, 2026/, /Thursday–Monday/, /one-hour check-in/, /one hour before closing/, /No outside food or alcohol/, /medical or dietary/, /No pets.*service animals/, /Liberty Corn Maze.*separate.*not included/]) assert.match(details, pattern);
});

test("Terror keeps unknown dates/hours and every material touch, age, ID, waiver and group restriction", () => {
  const row = current("DELTA2-TERROR66"), details = seasonalPresentation(row).details.join(" ");
  assert.equal(row.address, "1143 North Service Road West, Sullivan, MO 63080");
  assert.equal(row.seasonalAvailability.activeDates, undefined); assert.equal(row.seasonalAvailability.activeFrom, undefined);
  assert.equal(row.seasonalAvailability.activeUntil, "2026-11-01");
  assert.equal(row.seasonalListing.hours.state, "unknown");
  for (const pattern of [/through November 1/, /exact nights and hours unconfirmed/, /Everyone needs a waiver/, /General admission is no-touch/, /Interactive Touch Pass: ages 10\+/, /under-18s.*adult with valid ID/, /All Interactive Touch and Rated R.*valid ID at check-in/, /Rated R: 18\+.*full contact.*adult language and dark humor/, /Rated R groups cannot include other pass types/, /general and Interactive Touch guests may enter together/]) assert.match(details, pattern);
  for (const clock of ["2026-11-01T01:30:00-05:00", "2026-11-01T01:30:00-06:00", "2026-11-01T23:59:59.999-06:00"]) assert.equal(pool(row, [row], new Date(clock)).length, 1);
  assert.equal(pool(row, [row], new Date("2026-11-02T00:00:00-06:00")).length, 0);
});

test("Branson's exact 17 dates survive November/DST as lifecycle Anything browse without claiming continuous operation", async t => {
  const row = current("DELTA6-BRANSON-FIELD"), details = seasonalPresentation(row).details.join(" ");
  assert.equal(row.seasonalAvailability.activeDates.length, 17);
  assert.deepEqual(row.seasonalAvailability.activeDates.filter(date => date.startsWith("2026-11")), ["2026-11-06", "2026-11-07", "2026-11-13", "2026-11-14"]);
  assert.equal(row.seasonalAvailability.activeFrom, "2026-10-10", "Accepted subset boundary is not a claimed original season opening");
  t.mock.timers.enable({ apis: ["Date"], now: at.getTime() });
  t.mock.method(globalThis, "fetch", async () => Response.json({ elements: [] }));
  for (const day of [1, 2, 5, 6, 7, 8, 12, 13, 14]) {
    const clock = new Date(`2026-11-${String(day).padStart(2, "0")}T20:00:00-06:00`);
    t.mock.timers.setTime(clock.getTime());
    const status = getDateNightAvailability({ ...row, hoursKnown: false, isOpen: false }, clock);
    assert.equal(status.status, [6, 7, 13, 14].includes(day) ? "hours-unknown" : "closed-now");
    assert.equal(pool(row, [row], clock, {}, {}, [], false).length, 1, "Existing V1 lets users browse upcoming/closed-today curated ideas until cutoff");
    assert.equal(pool(row, [row], clock, { openNowOnly: true }, {}, [], false).length, 0);
    const result = await searchDateNight({ data: { lat: row.lat, lon: row.lon, radiusMiles: 1, activityTypes: ["anything"], spookySeasonEnabled: false } });
    assert.ok(result.venues.some(place => place.id === row.id));
  }
  for (const clock of ["2026-11-01T01:30:00-05:00", "2026-11-01T01:30:00-06:00"]) assert.equal(getDateNightAvailability({ ...row, hoursKnown: false, isOpen: false }, new Date(clock)).status, "closed-now");
  for (const pattern of [/November 6–7 and 13–14/, /Crossover hours unconfirmed/, /Posted October hours/, /Intense audio, live actors, fog and strobes/, /separate from Field of Screams Nixa/]) assert.match(details, pattern);
});

test("all 52 previous V1 records, presentation copy, radial implementation and unchanged UI remain byte-bound to main", () => {
  const baseline = JSON.parse(readFileSync("audit/phase4-recovery-implementation-2026-10-10/Production-Baseline-Receipts-R1.json", "utf8"));
  assert.equal(baseline.ref, "fe22c15cc6442fc4a48fec23c9a1331c69d70bd2");
  for (const [path, hash] of Object.entries(baseline.files)) assert.equal(createHash("sha256").update(readFileSync(path)).digest("hex"), hash, path);
  const { SEASONAL_PRESENTATIONS } = load("src/lib/date-night/seasonal-presentation-catalog.ts");
  assert.equal(Object.keys(baseline.presentations).length, 52);
  for (const [id, expected] of Object.entries(baseline.presentations)) assert.deepEqual(SEASONAL_PRESENTATIONS[id], expected, id);
});
