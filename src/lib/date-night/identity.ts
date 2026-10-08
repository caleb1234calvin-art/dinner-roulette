import { applyCuratedSeasonalPolicy } from "./curated-policy";
import { isApproximateSeasonalPlace } from "./listing";
import { haversineMiles } from "../restaurants/geo";
import { namesMatch, normalizeName } from "../utils";
import { dateNightTypeLabel, type ConcreteDateNightType, type DateNightPlace } from "./types";

const DATE_NIGHT_ALIAS_GROUPS = [
  [
    "precious moments chapel",
    "precious moments chapel and gardens",
    "precious moments chapel & gardens",
    "samuel j butcher museum",
    "samuel j. butcher museum",
  ],
] as const;

function dateNightNamesMatch(a: string, b: string): boolean {
  if (namesMatch(a, b)) return true;
  return DATE_NIGHT_ALIAS_GROUPS.some(
    (group) =>
      group.some((candidate) => namesMatch(candidate, a)) &&
      group.some((candidate) => namesMatch(candidate, b)),
  );
}

export function moodFor(types: readonly ConcreteDateNightType[]): 1 | 2 | 3 {
  if (types.includes("haunted-house")) return 3;
  if (types.includes("corn-maze") || types.includes("pumpkin-patch")) return 2;
  if (types.includes("movies") || types.includes("museum") || types.includes("park")) return 1;
  if (types.includes("bowling") || types.includes("arcade") || types.includes("mini-golf")) return 2;
  return 3;
}

function affirmedNameMatch(a: DateNightPlace, b: DateNightPlace): boolean {
  if (a.seasonalListing && b.seasonalListing && a.seasonalListing.recordId !== b.seasonalListing.recordId) return false;
  if (isApproximateSeasonalPlace(a) || isApproximateSeasonalPlace(b)) {
    // Exact normalized names are affirmative evidence; substring/shared-type
    // similarities at a generic site point are not sufficient for V1 records.
    return Boolean(normalizeName(a.name)) && normalizeName(a.name) === normalizeName(b.name);
  }
  return dateNightNamesMatch(a.name, b.name);
}

function combineTypes(a: readonly ConcreteDateNightType[], b: readonly ConcreteDateNightType[]) {
  return [...new Set([...a, ...b])].sort();
}

function evidenceFor(place: DateNightPlace) {
  return place.discoveryEvidence ?? [{
    id: place.id, source: place.source === "osm" ? "osm" as const : "catalog" as const,
    activityTypes: place.activityTypes, openingHours: place.openingHours,
    website: place.website, lifecycle: place.lifecycle,
  }];
}

export function mergeIdentity(a: DateNightPlace, b: DateNightPlace): DateNightPlace {
  a = applyCuratedSeasonalPolicy(a);
  b = applyCuratedSeasonalPolicy(b);
  // Catalog coordinates/identity take priority; otherwise stable provider ID wins.
  const rank = (place: DateNightPlace) => `${place.seasonalListing ? "0" : place.id.startsWith("date-night-osm-") ? "2" : "1"}:${place.id}`;
  // The same OSM identity can arrive through separate group snapshots. Keep the
  // representative stable across completion/cache order; evidence still unions.
  const snapshot = (place: DateNightPlace) => JSON.stringify([place.name, place.lat, place.lon,
    place.address, place.openingHours, place.phone, place.website, place.source]);
  const [first, second] = [a, b].sort((x, y) => rank(x).localeCompare(rank(y)) || snapshot(x).localeCompare(snapshot(y)));
  const activityTypes = combineTypes(a.activityTypes, b.activityTypes);
  const evidence = [...evidenceFor(a), ...evidenceFor(b)];
  const discoveryEvidence = [...new Map(evidence.map((item) => [JSON.stringify(item), item])).values()]
    .sort((x, y) => JSON.stringify(x).localeCompare(JSON.stringify(y)));
  const hours = [...new Set(discoveryEvidence.map((item) => item.openingHours).filter((value) => value && value !== "unknown"))];
  const curated = discoveryEvidence.find((item) => item.source === "catalog" && item.openingHours && item.openingHours !== "unknown");
  return {
    ...second!, ...first!, activityTypes, discoveryEvidence,
    lifecycle: a.lifecycle === "permanently-closed" || b.lifecycle === "permanently-closed"
      ? "permanently-closed" : a.lifecycle ?? b.lifecycle,
    openingHours: (first!.seasonalAvailability ?? second!.seasonalAvailability)?.openNowPolicy === "never"
      ? null : curated?.openingHours ?? (hours.length === 1 ? hours[0]! : null),
    phone: first!.phone ?? second!.phone,
    website: first!.website ?? second!.website,
    address: first!.address !== "Address unavailable" ? first!.address : second!.address,
    cuisineLabel: dateNightTypeLabel(activityTypes), moodLevel: moodFor(activityTypes),
    source: discoveryEvidence.some((item) => item.source === "catalog") && discoveryEvidence.some((item) => item.source === "osm")
      ? "merged" : first!.source,
  };
}

export function dedupeDateNight(places: DateNightPlace[]): DateNightPlace[] {
  const result: DateNightPlace[] = [];
  for (const raw of places) {
    const place = applyCuratedSeasonalPolicy(raw);
    const matchIndex = result.findIndex((candidate) => {
      const distance = haversineMiles(candidate.lat, candidate.lon, place.lat, place.lon);
      const sameName = affirmedNameMatch(candidate, place);
      const sharedType = candidate.activityTypes.some((type) => place.activityTypes.includes(type));
      const approximate = isApproximateSeasonalPlace(candidate) || isApproximateSeasonalPlace(place);
      // Approximate geometry/address/type is not affirmative identity evidence.
      return candidate.id === place.id || (sameName && distance < 0.6) || (!approximate && distance < 0.03 && sharedType);
    });

    if (matchIndex < 0) {
      result.push(place);
      continue;
    }

    result[matchIndex] = mergeIdentity(result[matchIndex]!, place);
  }
  return result;
}

export function mergeDateNight(live: DateNightPlace[], local: DateNightPlace[]): DateNightPlace[] {
  const merged = [...local];
  for (const place of live) {
    const matchIndex = merged.findIndex(
      (candidate) =>
        candidate.id === place.id || (affirmedNameMatch(candidate, place) &&
        haversineMiles(candidate.lat, candidate.lon, place.lat, place.lon) < 0.35),
    );
    if (matchIndex >= 0) {
      merged[matchIndex] = mergeIdentity(merged[matchIndex]!, place);
      continue;
    }
    merged.push(place);
  }
  return dedupeDateNight(merged);
}
