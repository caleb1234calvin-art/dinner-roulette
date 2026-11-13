import type { DateNightPlace, DateNightSearchResponse } from "@/lib/date-night/types";

/** Only the transport is replaced. This module is aliased by the standalone
 * browser harness and is never imported by the application build. */
export const ordinaryFixtureVenues: DateNightPlace[] = [
  {
    id: "date-night-osm-way-987588580", name: "Central Park", lat: 37.1734644,
    lon: -94.3130247, address: "305 West Chestnut Street, Carthage, MO, 64836",
    cuisines: [], cuisineLabel: "Park", priceLevel: null, rating: null, reviewCount: null,
    // Deliberately conflicts with Christmas display hours: live event surfaces
    // must use the independent event schedule, never the parent's ordinary hours.
    openingHours: "Mo-Su 08:00-12:00", phone: null, website: null, isChain: false,
    photoKey: "american", source: "osm", activityTypes: ["park"], moodLevel: 1,
    discoveryEvidence: [{
      id: "date-night-osm-way-987588580", source: "osm", activityTypes: ["park"],
      openingHours: "Mo-Su 08:00-12:00", website: null,
      sourceIdentity: {
        objectType: "way", objectId: 987588580, version: 2, changeset: 189037687,
        name: "Central Park", address: "305 West Chestnut Street, Carthage, MO, 64836",
        classification: { leisure: "park" },
      },
    }],
  },
  {
    id: "fixture-ordinary-cinema", name: "Fixture ordinary cinema", lat: 37.1734644,
    lon: -94.3130247, address: "Synthetic test address", cuisines: [], cuisineLabel: "Movies",
    priceLevel: null, rating: null, reviewCount: null, openingHours: "24/7", phone: null,
    website: null, isChain: false, photoKey: "american", source: "osm",
    activityTypes: ["movies"], moodLevel: 2,
  },
];

export const discoveryRequests: unknown[] = [];
export const discoveryCompletions: { mode: DiscoveryFixtureMode; retainedPark: boolean }[] = [];
type ProviderReplayMode = "complete" | "oversized-first" | "oversized-last" | "exhausted";
type DiscoveryFixtureMode = "reviewed" | "missing-revision" | "absent" | "closed" | `provider-${ProviderReplayMode}`;
let discoveryFixtureMode: DiscoveryFixtureMode = "reviewed";
export function setDiscoveryFixtureMode(mode: DiscoveryFixtureMode) { discoveryFixtureMode = mode; }
let nextResponseGate: Promise<void> | undefined;
let releaseResponse: (() => void) | undefined;
/** Hold transport delivery while the same-query radial retry is pending. This
 * lets browser assertions prove retirement happens after evidence loss arrives,
 * rather than because an incompatible location update first emptied the pool. */
export function holdNextDiscoveryResponse() {
  if (releaseResponse) throw new Error("A discovery response is already held");
  nextResponseGate = new Promise(resolve => { releaseResponse = resolve; });
}
export function releaseDiscoveryResponse() {
  if (!releaseResponse) throw new Error("No discovery response is held");
  releaseResponse(); releaseResponse = undefined;
}
function responseVenues(mode: DiscoveryFixtureMode) {
  const venues = structuredClone(ordinaryFixtureVenues);
  const park = venues[0];
  if (mode === "absent") return venues.slice(1);
  if (mode === "missing-revision") for (const evidence of park.discoveryEvidence ?? []) {
    if (evidence.sourceIdentity) { delete evidence.sourceIdentity.version; delete evidence.sourceIdentity.changeset; }
  }
  if (mode === "closed") {
    park.lifecycle = "permanently-closed";
    for (const evidence of park.discoveryEvidence ?? []) evidence.lifecycle = "permanently-closed";
  }
  return venues;
}
export function clearDiscoveryRequests() { discoveryRequests.length = 0; discoveryCompletions.length = 0; }
export async function searchDateNight({ data }: { data: unknown }): Promise<DateNightSearchResponse> {
  const mode = discoveryFixtureMode, gate = nextResponseGate;
  nextResponseGate = undefined;
  discoveryRequests.push(structuredClone(data));
  if (gate) await gate;
  let response: DateNightSearchResponse;
  if (mode.startsWith("provider-")) {
    const replays = (window as unknown as {
      __christmasProviderLossReplay?: Record<ProviderReplayMode | "complete-culture", DateNightSearchResponse>;
    }).__christmasProviderLossReplay;
    const requested = (data as { activityTypes: string[] }).activityTypes;
    const cultureOnly = requested.length === 2 && requested.includes("movies") && requested.includes("museum");
    const replayKey = mode === "provider-complete" && cultureOnly ? "complete-culture" : mode.slice("provider-".length) as ProviderReplayMode;
    const recorded = replays?.[replayKey];
    if (!recorded) throw new Error(`Missing actual-search browser replay: ${mode}`);
    const acquired = [...new Set(recorded.discovery?.groups.flatMap(group => group.activityTypes) ?? [])].sort();
    if (JSON.stringify([...requested].sort()) !== JSON.stringify(acquired)) {
      throw new Error(`Browser replay does not match requested acquisition categories: ${requested.join(",")}`);
    }
    const query = data as { lat: number; lon: number; radiusMiles: number; patchId: string };
    if (query.lat !== ordinaryFixtureVenues[0].lat || query.lon !== ordinaryFixtureVenues[0].lon || query.radiusMiles !== 15 || query.patchId !== "radial-v1:core") {
      throw new Error("Browser provider replay requires its exact recorded core acquisition");
    }
    // The harness executes the selected checkout's real search with controlled
    // network packets before startup. Preserve its full patch, discovery and
    // source-evidence envelopes, including absence of fields on the old parent.
    // The cinema remains a separate synthetic ordinary-control fixture.
    response = { ...structuredClone(recorded), venues: [...structuredClone(recorded.venues), structuredClone(ordinaryFixtureVenues[1])] };
  } else response = { venues: responseVenues(mode), source: "live" };
  discoveryCompletions.push({ mode, retainedPark: response.venues.some(venue => venue.id === ordinaryFixtureVenues[0].id) });
  return response;
}
export async function lookupLocation() { throw new Error("Location lookup is outside this isolated fixture"); }
export async function lookupReverseLocation() { throw new Error("Reverse lookup is outside this isolated fixture"); }
