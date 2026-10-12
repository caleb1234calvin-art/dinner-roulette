import type { DateNightPlace } from "./types";
import { seasonalListingToPlace, type SeasonalListing } from "./listing";

/** Frozen independently reviewed projection fab3e9e0: two Missouri HOLD resolutions.
 * Cadaver's exact 2026 poster is owner-supplied first-party evidence, not an
 * independently recaptured Facebook post. BOSS's cutoff is the overall event
 * end, not a separately confirmed haunt closing time. Display schedules do not
 * establish machine opening hours. All placements remain approximate, and
 * Directions use supported visitor addresses.
 */
export const MISSOURI_2026_HOLD_CLEANUP_LISTINGS:
  (Omit<DateNightPlace, "lat" | "lon"> & { seasonalListing: SeasonalListing })[] = [
  {
    "id": "date-night-mo26-007-cadaver-zone",
    "name": "Cadaver Zone Spookhouse",
    "address": "25088 Kafir Rd, Webb City, MO",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Haunted House",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": "417-825-2005",
    "website": "https://www.facebook.com/cadaverzone/",
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
      "listingExpiresAt": "2026-11-01T00:00:00-05:00",
      "seasonYear": 2026,
      "sourceUrls": [
        "https://www.facebook.com/cadaverzone/",
        "https://www.thescarefactor.com/haunted-houses/missouri/the-cadaver-zone-spook-house/",
        "https://morty.app/attraction/42641/the-cadaver-zone"
      ],
      "activeFrom": "2026-09-25",
      "activeUntil": "2026-10-31",
      "activeDates": [
        "2026-09-25",
        "2026-09-26",
        "2026-10-02",
        "2026-10-03",
        "2026-10-09",
        "2026-10-10",
        "2026-10-16",
        "2026-10-17",
        "2026-10-23",
        "2026-10-24",
        "2026-10-29",
        "2026-10-30",
        "2026-10-31"
      ]
    },
    "seasonalListing": {
      "contract": "ListingCompletenessV1",
      "recordId": "MO26-007",
      "seasonYear": 2026,
      "timeZone": "America/Chicago",
      "visitorAddress": "25088 Kafir Rd, Webb City, MO",
      "placement": {
        "lat": 37.214949,
        "lon": -94.510739,
        "basis": "address-geocode",
        "sourceUrl": "https://geocoding.geo.census.gov/geocoder/geographies/onelineaddress?address=25088+Kafir+Road%2C+Webb+City%2C+MO+64870&benchmark=Public_AR_Current&vintage=Current_Current&format=json",
        "checkedAt": "2026-10-12",
        "precisionLabel": "Approximate address-derived location; not an entrance, parking or ride-dropoff point"
      },
      "directionsTarget": {
        "kind": "visitor-address",
        "address": "25088 Kafir Rd, Webb City, MO"
      },
      "ridesharePolicy": "external-picker",
      "hours": {
        "state": "partial",
        "displayText": "September 25–26; October 2–3, 9–10, 16–17, 23–24 and 29–31, 2026. 7 PM–midnight; October 29, 7–10 PM."
      },
      "listingExpiresAt": "2026-11-01T00:00:00-05:00",
      "expiryBasis": "exact",
      "sourceUrls": [
        "https://www.facebook.com/cadaverzone/",
        "https://www.thescarefactor.com/haunted-houses/missouri/the-cadaver-zone-spook-house/",
        "https://morty.app/attraction/42641/the-cadaver-zone"
      ],
      "reviewRevision": "MO2026-hold-cleanup-fab3e9e0-2026-10-12"
    },
    "seasonalVisitNotes": [
      "September 25–26; October 2–3, 9–10, 16–17, 23–24 and 29–31, 2026.",
      "7 PM–midnight; October 29, 7–10 PM. Admission $15.",
      "Location is approximate."
    ]
  },
  {
    "id": "date-night-mo26-boss-harvest-fest",
    "name": "BOSS Haunted House at Harvest Fest",
    "address": "18694 FLW 20, BLDG 10221, Fort Leonard Wood, MO 65473",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Haunted House",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": "+1 573-329-4770",
    "website": "https://leonardwood.armymwr.com/calendar/event/harvest-fest/7461823/114564",
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
      "listingExpiresAt": "2026-10-24T21:00:00-05:00",
      "seasonYear": 2026,
      "sourceUrls": [
        "https://leonardwood.armymwr.com/calendar/event/harvest-fest/7461823/114564",
        "https://visitpulaskicounty.org/stories?rec_id=465",
        "https://home.army.mil/wood/Garrison/DES/physical-security/access-control",
        "https://leonardwood.armymwr.com/programs/piney-valley-golf-course-pvgc"
      ],
      "activeFrom": "2026-10-24",
      "activeUntil": "2026-10-24",
      "activeDates": [
        "2026-10-24"
      ]
    },
    "seasonalListing": {
      "contract": "ListingCompletenessV1",
      "recordId": "DELTA6-BOSS",
      "seasonYear": 2026,
      "timeZone": "America/Chicago",
      "visitorAddress": "18694 FLW 20, BLDG 10221, Fort Leonard Wood, MO 65473",
      "placement": {
        "lat": 37.73298,
        "lon": -92.06935,
        "basis": "operator-site",
        "sourceUrl": "https://leonardwood.armymwr.com/calendar/event/harvest-fest/7461823/114564",
        "checkedAt": "2026-10-12",
        "precisionLabel": "Approximate operator-linked venue location; not an entrance, parking, gate or ride-dropoff point"
      },
      "directionsTarget": {
        "kind": "visitor-address",
        "address": "18694 FLW 20, BLDG 10221, Fort Leonard Wood, MO 65473"
      },
      "ridesharePolicy": "external-picker",
      "hours": {
        "state": "partial",
        "displayText": "October 24, 2026, during Harvest Fest (3:30–9 PM). Haunted-house hours are not separately confirmed."
      },
      "listingExpiresAt": "2026-10-24T21:00:00-05:00",
      "expiryBasis": "exact",
      "sourceUrls": [
        "https://leonardwood.armymwr.com/calendar/event/harvest-fest/7461823/114564",
        "https://visitpulaskicounty.org/stories?rec_id=465",
        "https://home.army.mil/wood/Garrison/DES/physical-security/access-control",
        "https://leonardwood.armymwr.com/programs/piney-valley-golf-course-pvgc"
      ],
      "reviewRevision": "MO2026-hold-cleanup-fab3e9e0-2026-10-12"
    },
    "seasonalVisitNotes": [
      "October 24, 2026, during Harvest Fest (3:30–9 PM). Haunted-house hours are not separately confirmed.",
      "Open to the public, subject to Fort Leonard Wood access approval. Visitors without qualifying credentials need screening and a pass. Adults need acceptable physical ID (REAL ID or accepted supplemental documents). Confirm event access requirements before traveling.",
      "Drivers must carry a current license, vehicle insurance and registration.",
      "Shuttles begin at 3 PM from the Pershing Community Center parking lot.",
      "Approximate venue location. Use the visitor address for Directions."
    ]
  }
];

export const MISSOURI_2026_HOLD_CLEANUP_CATALOG = MISSOURI_2026_HOLD_CLEANUP_LISTINGS
  .map(seasonalListingToPlace)
  .filter((place): place is DateNightPlace => Boolean(place));
