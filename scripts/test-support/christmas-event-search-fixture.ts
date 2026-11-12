import type { DateNightPlace, DateNightSearchResponse } from "../../src/lib/date-night/types";

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
export function clearDiscoveryRequests() { discoveryRequests.length = 0; }
export async function searchDateNight({ data }: { data: unknown }): Promise<DateNightSearchResponse> {
  discoveryRequests.push(structuredClone(data));
  return { venues: ordinaryFixtureVenues, source: "live" };
}
export async function lookupLocation() { throw new Error("Location lookup is outside this isolated fixture"); }
export async function lookupReverseLocation() { throw new Error("Reverse lookup is outside this isolated fixture"); }
