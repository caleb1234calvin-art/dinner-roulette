import type { DateNightPlace } from "./types";
import { SEASONAL_PRESENTATIONS } from "./seasonal-presentation-catalog";

export type SeasonalConfidence = "high" | "good" | "limited";
export interface SeasonalPresentation {
  canonicalId: string;
  confidence: SeasonalConfidence;
  /** Reviewed visitor copy, never generated from audit narratives or machine hours. */
  details: readonly string[];
}
export const SEASONAL_VISITOR_NOTICE = "Check current hours, admission, and weather before you go.";
export const SEASONAL_CONFIDENCE_LABELS: Record<SeasonalConfidence, string> = {
  high: "High confidence", good: "Good confidence", limited: "Limited details",
};

/** Confidence describes listing completeness, not live operator confirmation,
 * current opening status, precise geometry or a guarantee. Each known tier is
 * reviewed explicitly: hours.state alone never upgrades a listing's tier.
 * Unreviewed/new identities receive a conservative, non-audit fallback.
 */
export function seasonalPresentation(place: Pick<DateNightPlace, "id" | "seasonalListing">): Omit<SeasonalPresentation, "canonicalId"> {
  const reviewed = place.seasonalListing && SEASONAL_PRESENTATIONS[place.seasonalListing.recordId];
  if (reviewed?.canonicalId === place.id) return reviewed;
  return { confidence: "limited", details: ["Hours unconfirmed"] };
}
