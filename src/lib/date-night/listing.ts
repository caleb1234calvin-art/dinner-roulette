import type { DateNightPlace } from "./types";

/** Listing evidence is separate from spatial eligibility and machine opening hours. */
export interface SeasonalListing {
  contract: "ListingCompletenessV1";
  recordId: string;
  seasonYear: number;
  timeZone: string;
  visitorAddress: string;
  placement: null | {
    lat: number; lon: number;
    basis: "address-geocode" | "operator-site" | "verified-arrival";
    sourceUrl: string; checkedAt: string; precisionLabel: string;
  };
  directionsTarget: { kind: "visitor-address"; address: string } |
    { kind: "verified-point"; lat: number; lon: number; description: string };
  hours: { state: "verified" | "partial" | "unknown"; displayText?: string };
  listingExpiresAt: string;
  expiryBasis: "exact" | "date-only" | "editorial";
  sourceUrls: readonly string[];
  reviewRevision: string;
  /** Optional curated visibility beyond the Halloween UI/provider window. */
  visibility?: "halloween-layer" | "listing-lifecycle";
}

export function isApproximateSeasonalPlace(place: object): boolean {
  const listing = (place as { seasonalListing?: SeasonalListing }).seasonalListing;
  return Boolean(listing && listing.placement?.basis !== "verified-arrival");
}
export function seasonalDistancePrefix(place: object): string {
  return isApproximateSeasonalPlace(place) ? "Approx. " : "";
}

export function hasReviewedSeasonalPlacement(listing: SeasonalListing): boolean {
  const point = listing.placement;
  return Boolean(point && Number.isFinite(point.lat) && Math.abs(point.lat) <= 90 &&
    Number.isFinite(point.lon) && Math.abs(point.lon) <= 180 && point.sourceUrl && point.checkedAt);
}

/** Address-only clearances stay in their registry, never in radius math/counts/picks.
 * No nullable-coordinate change to the shared Restaurant model is needed. */
export function seasonalListingToPlace(record: Omit<DateNightPlace, "lat" | "lon"> &
  { seasonalListing: SeasonalListing }): DateNightPlace | null {
  if (!hasReviewedSeasonalPlacement(record.seasonalListing)) return null;
  const point = record.seasonalListing.placement!;
  return { ...record, lat: point.lat, lon: point.lon, openingHours: null };
}
