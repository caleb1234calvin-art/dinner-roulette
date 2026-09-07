import type { DateNightPlace } from "./types";

// Seasonal Jasper County Date Night anchors.
// This list is intentionally conservative: venue identity/location must be current enough
// to trust, while season-specific hours remain unknown unless they can be represented safely.
// Re-audit before each season; live discovery remains the broad source of seasonal places.
// Wolfman's House Of Screams is a strong live candidate, but stays out of this fallback
// until its coordinate pair is re-audited from an authoritative geocode source.
export const JASPER_COUNTY_SEASONAL_DATE_NIGHT_CATALOG: DateNightPlace[] = [
  {
    id: "date-night-werehouse-joplin",
    name: "The Werehouse",
    lat: 37.0694258,
    lon: -94.4688601,
    address: "3819 E 20th St, Joplin, MO 64801",
    cuisines: ["other"],
    cuisineLabel: "Haunted House",
    priceLevel: null,
    rating: null,
    reviewCount: null,
    openingHours: "unknown",
    phone: "+1 417-396-6094",
    website: "https://thewerehouse.net/",
    isChain: false,
    photoKey: "cafe",
    source: "catalog",
    activityTypes: ["haunted-house"],
    moodLevel: 3,
  },
  {
    id: "date-night-myers-inn-carthage",
    name: "Myer's Inn Haunt",
    lat: 37.1475746,
    lon: -94.3173348,
    address: "529 W Airport Dr, Carthage, MO 64836",
    cuisines: ["other"],
    cuisineLabel: "Haunted House",
    priceLevel: null,
    rating: null,
    reviewCount: null,
    openingHours: "unknown",
    phone: "+1 417-313-2223",
    website: "https://www.myersinnhaunt.com/",
    isChain: false,
    photoKey: "cafe",
    source: "catalog",
    activityTypes: ["haunted-house"],
    moodLevel: 3,
  },
];
