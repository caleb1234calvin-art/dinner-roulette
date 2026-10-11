import type { DateNightPlace } from "./types";
import { seasonalListingToPlace, type SeasonalListing } from "./listing";

/** Frozen R2 projection 0b406b91: one independently cleared 2026 haunted trail.
 * Exact operating dates do not supply machine hours. The date-only cutoff is
 * retention policy, and the operator-linked fairground point is approximate.
 */
export const MISSOURI_2026_NEXT_LISTINGS:
  (Omit<DateNightPlace, "lat" | "lon"> & { seasonalListing: SeasonalListing })[] = [
  {
    "id": "date-night-mo26-goblin-kings-haunted-trail",
    "name": "The Goblin King's Haunted Trail — Shadow's Play",
    "address": "5651 State Hwy F, Hartville, MO 65667",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Haunted House",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": "417-241-8088",
    "website": "https://www.whitehartfaire.com/hauntedtrailabout",
    "isChain": false,
    "photoKey": "cafe",
    "source": "catalog",
    "activityTypes": [
      "haunted-house"
    ],
    "moodLevel": 3,
    "seasonalAvailability": {
      "status": "confirmed",
      "checkedAt": "2026-10-11",
      "timeZone": "America/Chicago",
      "openNowPolicy": "never",
      "listingExpiresAt": "2026-10-25T00:00:00-05:00",
      "seasonYear": 2026,
      "sourceUrls": [
        "https://www.whitehartfaire.com/",
        "https://www.whitehartfaire.com/event-details/goblin-king-haunted-trail-shadows-play-2026-10-10-19-00",
        "https://www.whitehartfaire.com/event-details/goblin-king-haunted-trail-shadows-play-2026-10-16-19-00",
        "https://goo.gl/maps/hLccWtsgQV1v4SgKA"
      ],
      "activeFrom": "2026-10-02",
      "activeUntil": "2026-10-24",
      "activeDates": [
        "2026-10-02",
        "2026-10-03",
        "2026-10-09",
        "2026-10-10",
        "2026-10-16",
        "2026-10-17",
        "2026-10-23",
        "2026-10-24"
      ]
    },
    "seasonalListing": {
      "contract": "ListingCompletenessV1",
      "recordId": "DELTA3-GOBLIN",
      "seasonYear": 2026,
      "timeZone": "America/Chicago",
      "visitorAddress": "5651 State Hwy F, Hartville, MO 65667",
      "placement": {
        "lat": 37.2632207,
        "lon": -92.6693091,
        "basis": "operator-site",
        "sourceUrl": "https://goo.gl/maps/hLccWtsgQV1v4SgKA",
        "checkedAt": "2026-10-11",
        "precisionLabel": "Approximate operator-linked fairground placement; not an entrance, parking or ride-dropoff point"
      },
      "directionsTarget": {
        "kind": "visitor-address",
        "address": "5651 State Hwy F, Hartville, MO 65667"
      },
      "ridesharePolicy": "external-picker",
      "hours": {
        "state": "partial",
        "displayText": "October 2–3, 9–10, 16–17 and 23–24, 2026; check your selected event for hours."
      },
      "listingExpiresAt": "2026-10-25T00:00:00-05:00",
      "expiryBasis": "date-only",
      "sourceUrls": [
        "https://www.whitehartfaire.com/",
        "https://www.whitehartfaire.com/event-details/goblin-king-haunted-trail-shadows-play-2026-10-10-19-00",
        "https://www.whitehartfaire.com/event-details/goblin-king-haunted-trail-shadows-play-2026-10-16-19-00",
        "https://goo.gl/maps/hLccWtsgQV1v4SgKA"
      ],
      "reviewRevision": "MO2026-next-0b406b91-2026-10-11"
    },
    "seasonalVisitNotes": [
      "Haunted trail on October 2–3, 9–10, 16–17 and 23–24, 2026. Check your selected event for hours.",
      "Outdoor woods with uneven ground, darkness, fog, loud sounds and sudden scares. Wear closed-toe shoes and dress for the weather.",
      "Weather or site conditions may close the trail.",
      "Location is approximate."
    ]
  }
];

export const MISSOURI_2026_NEXT_CATALOG = MISSOURI_2026_NEXT_LISTINGS
  .map(seasonalListingToPlace)
  .filter((place): place is DateNightPlace => Boolean(place));
