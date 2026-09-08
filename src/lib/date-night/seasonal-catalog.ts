import type { DateNightPlace } from "./types";

// Seasonal Jasper County Date Night anchors.
// Deep re-audit: 2026-09-07.
//
// This fallback is deliberately stricter than live discovery: a venue is only
// hard-coded here when identity, Jasper County location, and a precise coordinate
// pair are strong enough to trust for distance filtering and directions.
// Season-specific dates/hours stay "unknown" unless the current season can be
// represented safely; the live map remains the broad discovery source.
//
// Verified 2026 Jasper County Halloween candidates that should still be eligible
// through live discovery, but are NOT promoted to this coordinate-based fallback
// until their exact coordinates are independently re-audited:
// - Wolfmans House Of Screams — 26267 King Ln, Carl Junction, MO 64834.
//   Current 2026 haunt calendars list an Oct. 3 opening and additional dates.
// - Cadaver Zone Spookhouse — 25088 Kafir Rd, Webb City, MO 64870.
//   Current local-business data still identifies it as a seasonal haunted house.
// - Thistleknot Creek Farm — 24270 Julep Ln, Oronogo, MO 64855.
//   Current local-business data identifies October corn-maze / lantern-tour programming.
// - Waco School House Haunt — 148 Rose St, Waco, MO 64832.
//   Recent local haunt roundups identify the location, but 2026 operating dates
//   were not strong enough in this audit to hard-code it.
//
// Myers Forest of Fears — 3935 S Garrison Ave, Carthage, MO 64836 — remains
// intentionally uncurated because current sources conflict: structured local
// business data marks it permanently closed, while current 2026 haunt directories
// continue to feature it. Do not suppress or promote it until that conflict clears.
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
    openingHours: "Fr-Sa 19:00-24:00",
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
