import type { HomeMode } from "../nightlife/types";
import type { RestaurantPreference, TemporaryExclusion } from "../restaurants/types";
import { isChristmasAppWindow } from "./christmas-overlay";
import { CHRISTMAS_2026_PILOT } from "./christmas-pilot-catalog";
import { christmasSessionAvailability } from "./christmas-pilot-model";
import type { ChristmasPilotAttraction, ChristmasVenueBinding } from "./christmas-pilot-model";
import { eligibleChristmasChoices } from "./christmas-picker";
import type { ChristmasChoice, ChristmasPickableChoice, ChristmasSelection } from "./christmas-picker";
import { seasonalIdentityPreference } from "./identity-preferences";
import type { DateNightFilters, DecoratedDateNightPlace } from "./types";

export interface ChristmasPilotChoice extends ChristmasPickableChoice {
  readonly presentation: {
    readonly kind: "christmas-event";
    readonly baseVenueId: string;
    readonly eventId: ChristmasPilotAttraction["researchId"];
    readonly displayName: string;
    readonly categoryLabel: string;
    readonly relationship: ChristmasPilotAttraction["relationship"];
    readonly eventAvailability: ReturnType<typeof christmasSessionAvailability>;
    readonly venue: ChristmasPilotAttraction["venue"];
    readonly route: ChristmasPilotAttraction["route"];
    readonly evidence: ChristmasPilotAttraction["evidence"];
    readonly unknowns: readonly string[];
    // Verified research is not an entrance, a ticket checkout, or approved art.
    readonly directionsTarget: null;
    readonly ticketPurchaseUrl: null;
    readonly iconKey: null;
  };
}

const CATEGORY_LABELS = {
  "christmas-lights": "Christmas Lights",
  "holiday-market": "Holiday Market",
  "holiday-craft-fair": "Holiday Craft Fair",
  "holiday-community-event": "Holiday Community Event",
} as const;

function httpsUrl(value: string) {
  try { return new URL(value).protocol === "https:"; } catch { return false; }
}

interface PilotInput {
  readonly venues: readonly DecoratedDateNightPlace[];
  readonly bindings: readonly ChristmasVenueBinding[];
  readonly filters: DateNightFilters;
  readonly selectedCategories: readonly ChristmasSelection[];
  readonly now: Date;
  readonly homeMode: HomeMode;
  readonly christmasEnabled?: boolean;
  readonly halloweenActive?: boolean;
  readonly preferences?: Record<string, RestaurantPreference>;
  readonly exclusions?: TemporaryExclusion[];
}

/** Development candidate only: no import from discovery, stores, or the UI.
 * Consume canonical merged venues, never create permanent places from research
 * IDs. Every event remains a linked presentation; unknown visitor access cannot
 * establish that the whole park/church/school has become a public attraction. */
export function buildChristmasPilotCandidate(input: PilotInput): {
  choices: (ChristmasChoice | ChristmasPilotChoice)[];
  bindingBlockers: { researchId: ChristmasPilotAttraction["researchId"]; reason: string }[];
} {
  const { venues, bindings, filters, selectedCategories, now } = input;
  const preferences = input.preferences ?? {};
  const exclusions = input.exclusions ?? [];
  const bindingBlockers: { researchId: ChristmasPilotAttraction["researchId"]; reason: string }[] = [];
  if (input.homeMode !== "date-night") return { choices: [], bindingBlockers };
  const ordinary = eligibleChristmasChoices(venues, filters, selectedCategories, [], now,
    preferences, exclusions, false, input.halloweenActive ?? false);
  if (!isChristmasAppWindow(now) || input.christmasEnabled === false) return { choices: ordinary, bindingBlockers };

  const selected = new Set(selectedCategories);
  const anything = selected.size === 0 || selected.has("anything");
  const events: ChristmasPilotChoice[] = [];
  const reserved = new Set<string>();
  for (const attraction of CHRISTMAS_2026_PILOT) {
    const links = bindings.filter(binding => binding.researchId === attraction.researchId);
    const link = links[0];
    const parent = link && venues.find(venue => venue.id === link.canonicalVenueId);
    if (links.length !== 1 || !link?.canonicalVenueId.trim() || !httpsUrl(link.reviewUrl) || !parent ||
        bindings.some(other => other.researchId !== link.researchId && other.canonicalVenueId === link.canonicalVenueId)) {
      bindingBlockers.push({ researchId: attraction.researchId, reason: "A unique reviewed canonical venue binding is required." });
      continue;
    }
    const availability = christmasSessionAvailability(attraction, now);
    if (!availability.browseEligible) continue;
    // Preferences are read through the ordinary identity alias resolver. A host
    // can have no ordinary Date Night category (e.g. school) yet host this event.
    const pref = seasonalIdentityPreference(parent, preferences);
    if (parent.lifecycle || parent.seasonalListing || parent.availability.season !== "ordinary" ||
        !parent.availability.browseEligible || !Number.isFinite(parent.distanceMiles) ||
        parent.distanceMiles > filters.radiusMiles + 0.05 || pref.neverRecommend ||
        (filters.favoritesOnly && !pref.favorite) || exclusions.some(item =>
          pref.ids.includes(item.restaurantId) && item.expiresAt > now.getTime())) continue;
    const categorySelected = anything || selected.has(attraction.category);
    if (categorySelected || attraction.relationship === "permanent-venue-display") reserved.add(parent.id);
    if (!categorySelected || (filters.openNowOnly && !availability.openNowEligible)) continue;
    events.push({
      venue: parent,
      categories: [attraction.category],
      presentation: {
        kind: "christmas-event", baseVenueId: parent.id, eventId: attraction.researchId,
        displayName: attraction.eventName, categoryLabel: CATEGORY_LABELS[attraction.category],
        relationship: attraction.relationship, eventAvailability: availability,
        venue: attraction.venue, route: attraction.route, evidence: attraction.evidence,
        unknowns: attraction.unknowns, directionsTarget: null, ticketPurchaseUrl: null, iconKey: null,
      },
    });
  }
  return { choices: [...events, ...ordinary.filter(choice => !reserved.has(choice.venue.id))], bindingBlockers };
}
