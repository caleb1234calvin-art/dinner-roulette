import { CHRISTMAS_EVENT_KEYS, CHRISTMAS_REVIEW_URL, SPARKLE_VENUE_ID } from "./christmas-pilot-model";
import type { ChristmasVenueBinding } from "./christmas-pilot-model";
import type { DecoratedDateNightPlace } from "./types";

export const REVIEWED_CHRISTMAS_BINDINGS: readonly ChristmasVenueBinding[] = [{
  researchId: "C26-001", eventKey: CHRISTMAS_EVENT_KEYS["C26-001"], canonicalVenueId: SPARKLE_VENUE_ID,
  scope: "permanent-venue-display", reviewUrl: CHRISTMAS_REVIEW_URL,
  reviewRevision: "astra-2026-11-11-6810772595", checkedOn: "2026-11-11",
  sourceObject: { type: "way", id: 987588580, version: 2, changeset: 189037687, url: "https://www.openstreetmap.org/way/987588580" },
  expected: { name: "Central Park", address: "305 West Chestnut Street, Carthage, MO, 64836", classification: "park", leisure: "park" },
  supportingSources: ["https://www.carthagemo.gov/events?id=67898747", "https://www.cwep.com/calendar-events/sparkle-in-the-park-lighting-ceremony/", "https://www.openstreetmap.org/way/987588580"],
}];

export type ChristmasBindingState = "bound" | "missing-review" | "conflicting-review" | "absent-from-query" | "missing-source-evidence" | "stale-source" | "conflicting-source";
export interface ChristmasBindingResult { state: ChristmasBindingState; reason: string; venue?: DecoratedDateNightPlace }

const normalize = (value: string) => (typeof value === "string" ? value : "").toLowerCase().replace(/\bwest\b/g, "w").replace(/\bstreet\b/g, "st")
  .replace(/\bmissouri\b/g, "mo").replace(/[^a-z0-9]+/g, " ").trim();
function packetAgrees(binding: ChristmasVenueBinding, reviewed: ChristmasVenueBinding) {
  return binding.researchId === reviewed.researchId && binding.eventKey === reviewed.eventKey &&
    binding.canonicalVenueId === reviewed.canonicalVenueId && binding.scope === reviewed.scope &&
    binding.reviewUrl === reviewed.reviewUrl && binding.reviewRevision === reviewed.reviewRevision && binding.checkedOn === reviewed.checkedOn &&
    binding.sourceObject?.type === reviewed.sourceObject.type && binding.sourceObject?.id === reviewed.sourceObject.id &&
    binding.sourceObject?.version === reviewed.sourceObject.version && binding.sourceObject?.changeset === reviewed.sourceObject.changeset &&
    binding.sourceObject?.url === reviewed.sourceObject.url &&
    binding.expected?.name === reviewed.expected.name && binding.expected?.address === reviewed.expected.address &&
    binding.expected?.classification === "park" && binding.expected?.leisure === "park" &&
    reviewed.supportingSources.every(url => binding.supportingSources?.includes(url));
}

/** Only the independently reviewed park association can bind. URL syntax alone
 * is never provenance, and a host object's polygon never establishes a gate. */
export function resolveChristmasParkBinding(
  venues: readonly DecoratedDateNightPlace[], bindings: readonly ChristmasVenueBinding[],
): ChristmasBindingResult {
  const reviewed = REVIEWED_CHRISTMAS_BINDINGS[0];
  const candidates = bindings.filter(item => item.researchId === "C26-001");
  if (!candidates.length) return { state: "missing-review", reason: "No reviewed permanent-park association was supplied." };
  if (candidates.length !== 1 || !packetAgrees(candidates[0], reviewed))
    return { state: "conflicting-review", reason: "The supplied park association does not match Astra's reviewed object, fields and provenance revision." };
  const matching = venues.filter(venue => venue.id === reviewed.canonicalVenueId);
  if (!matching.length) return { state: "absent-from-query", reason: "The reviewed Central Park identity is valid but absent from this discovery response." };
  for (const venue of matching) {
    if (normalize(venue.name) !== normalize(reviewed.expected.name) || normalize(venue.address) !== normalize(reviewed.expected.address) ||
        !venue.activityTypes.includes("park") || venue.activityTypes.some(type => type !== "park") || venue.lifecycle ||
        venue.seasonalListing || !["osm", "merged"].includes(venue.source))
      return { state: "conflicting-source", reason: "The merged park name, full address, classification or lifecycle conflicts with the reviewed permanent identity." };
    const evidence = venue.discoveryEvidence?.filter(item => item.source === "osm" && item.id === reviewed.canonicalVenueId) ?? [];
    if (!evidence.length || evidence.some(item => !item.sourceIdentity || item.sourceIdentity.version === undefined || item.sourceIdentity.changeset === undefined))
      return { state: "missing-source-evidence", reason: "The response lacks the reviewed OSM object/version evidence; do not infer it from an ID or coordinates." };
    for (const item of evidence) {
      const source = item.sourceIdentity!;
      if (source.objectType !== "way" || source.objectId !== reviewed.sourceObject.id ||
          normalize(source.name) !== normalize(reviewed.expected.name) || normalize(source.address) !== normalize(reviewed.expected.address) ||
          source.classification?.leisure !== "park" || source.classification?.amenity || item.lifecycle)
        return { state: "conflicting-source", reason: "Preserved provider fields conflict with the reviewed Central Park source object." };
      if (source.version !== reviewed.sourceObject.version || source.changeset !== reviewed.sourceObject.changeset)
        return { state: "stale-source", reason: "The provider object version or changeset differs from the independently reviewed revision; re-review is required." };
    }
    if (venue.discoveryEvidence?.some(item => item.sourceIdentity && item.id !== reviewed.canonicalVenueId))
      return { state: "conflicting-source", reason: "The merged result contains a different source identity; the park association needs conflict resolution." };
  }
  return { state: "bound", reason: "Reviewed OSM object, surviving canonical ID, name, full address and park classification agree.", venue: matching[0] };
}
