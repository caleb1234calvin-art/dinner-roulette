import type { DateNightPlace } from "./types";
import { seasonalListingToPlace, type SeasonalListing } from "./listing";

/** Independently reviewed Fear Factory projection, acceptance 5b5ffb7c.
 * The current directory binds ten 2026 dates and the final closing time;
 * the operator contact page supports the address, not the current schedule.
 * Waze provides qualified approximate venue/address placement only.
 * Display hours never supply machine Open Now; Directions use the address.
 */
export const MISSOURI_2026_RANKED_HOLDS_LISTINGS:
  (Omit<DateNightPlace, "lat" | "lon"> & { seasonalListing: SeasonalListing })[] = [
  {
    "id": "date-night-mo26-fear-factory",
    "name": "Fear Factory LLC",
    "address": "102 South Main Street, Mountain Grove, MO 65711",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Haunted House",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": "+14172173065",
    "website": "https://www.fearfactoryllc.com/",
    "isChain": false,
    "photoKey": "cafe",
    "source": "catalog",
    "activityTypes": [
      "haunted-house"
    ],
    "moodLevel": 3,
    "seasonalAvailability": {
      "status": "confirmed",
      "checkedAt": "2026-10-12",
      "timeZone": "America/Chicago",
      "openNowPolicy": "never",
      "listingExpiresAt": "2026-10-31T23:00:00-05:00",
      "seasonYear": 2026,
      "sourceUrls": [
        "https://www.missourihauntedhouses.com/halloween/fear-factory-llc-mountain-grove.html",
        "https://www.fearfactoryllc.com/contact",
        "https://www.waze.com/live-map/directions/us/mo/mountain-grove/fear-factory-llc?to=place.ChIJeV4WV3YP0IcRx9UJc2YdouA"
      ],
      "activeFrom": "2026-10-02",
      "activeUntil": "2026-10-31",
      "activeDates": [
        "2026-10-02",
        "2026-10-03",
        "2026-10-09",
        "2026-10-10",
        "2026-10-16",
        "2026-10-17",
        "2026-10-23",
        "2026-10-24",
        "2026-10-30",
        "2026-10-31"
      ]
    },
    "seasonalListing": {
      "contract": "ListingCompletenessV1",
      "recordId": "DELTA2-FEARFACTORY",
      "seasonYear": 2026,
      "timeZone": "America/Chicago",
      "visitorAddress": "102 South Main Street, Mountain Grove, MO 65711",
      "placement": {
        "lat": 37.127139,
        "lon": -92.264897,
        "basis": "address-geocode",
        "sourceUrl": "https://www.waze.com/live-map/directions/us/mo/mountain-grove/fear-factory-llc?to=place.ChIJeV4WV3YP0IcRx9UJc2YdouA",
        "checkedAt": "2026-10-12",
        "precisionLabel": "Approximate named venue/address map location; entrance, parking and ride dropoff unverified"
      },
      "directionsTarget": {
        "kind": "visitor-address",
        "address": "102 South Main Street, Mountain Grove, MO 65711"
      },
      "ridesharePolicy": "external-picker",
      "hours": {
        "state": "partial",
        "displayText": "Directory lists 8–11 p.m.; confirm with venue before travel."
      },
      "listingExpiresAt": "2026-10-31T23:00:00-05:00",
      "expiryBasis": "exact",
      "sourceUrls": [
        "https://www.missourihauntedhouses.com/halloween/fear-factory-llc-mountain-grove.html",
        "https://www.fearfactoryllc.com/contact",
        "https://www.waze.com/live-map/directions/us/mo/mountain-grove/fear-factory-llc?to=place.ChIJeV4WV3YP0IcRx9UJc2YdouA"
      ],
      "reviewRevision": "MO2026-ranked-holds-5b5ffb7c-2026-10-12"
    },
    "seasonalVisitNotes": [
      "Listed 2026 dates: October 2–3, 9–10, 16–17, 23–24 and 30–31.",
      "Directory lists 8–11 p.m.; confirm with venue before travel.",
      "Approximate venue location. Use the visitor address for Directions.",
      "The directory advises against visits for people with seizures because of frequent strobe lights, and recommends parental discretion for children under 13. Confirm visitor restrictions with the venue."
    ]
  }
];

export const MISSOURI_2026_RANKED_HOLDS_CATALOG = MISSOURI_2026_RANKED_HOLDS_LISTINGS
  .map(seasonalListingToPlace)
  .filter((place): place is DateNightPlace => Boolean(place));
