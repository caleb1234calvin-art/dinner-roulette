import type { DateNightPlace } from "./types";
import { seasonalListingToPlace, type SeasonalListing } from "./listing";

/** Four independent commercial re-clearances bound at continuity 4f17f523.
 * Field provenance and exact approved visitor copy: audit/astra-commercial-2026-10-09/.
 * Null machine hours and address Directions preserve conservative navigation/status.
 * Aurora expires at last admission; Hollows includes only four supported ticket dates.
 */
export const MISSOURI_2026_ASTRA_COMMERCIAL_LISTINGS:
  (Omit<DateNightPlace, "lat" | "lon"> & { seasonalListing: SeasonalListing })[] = [
  {
    "id": "date-night-mo26-astra-aurora-maize",
    "name": "Aurora Maize at Adventure Farm",
    "address": "20591 County Road 2200, Aurora, MO 65605",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Corn Maze / Haunted Attraction",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://auroramaize.com/hourstickets/",
    "isChain": false,
    "photoKey": "cafe",
    "source": "catalog",
    "activityTypes": [
      "corn-maze",
      "haunted-house"
    ],
    "moodLevel": 3,
    "seasonalAvailability": {
      "status": "confirmed",
      "activeFrom": "2026-09-19",
      "activeUntil": "2026-10-31",
      "activeDates": [
        "2026-09-19",
        "2026-09-25",
        "2026-09-26",
        "2026-10-02",
        "2026-10-03",
        "2026-10-07",
        "2026-10-09",
        "2026-10-10",
        "2026-10-14",
        "2026-10-16",
        "2026-10-17",
        "2026-10-21",
        "2026-10-23",
        "2026-10-24",
        "2026-10-28",
        "2026-10-30",
        "2026-10-31"
      ],
      "checkedAt": "2026-10-09",
      "revalidateAfter": "2026-10-15",
      "timeZone": "America/Chicago",
      "openNowPolicy": "never",
      "listingExpiresAt": "2026-10-31T22:00:00-05:00",
      "seasonYear": 2026,
      "sourceUrls": [
        "https://auroramaize.com/contacts/",
        "https://www.google.com/maps/d/embed?mid=1r3gzFPM4zv8RVTvb5uD9ouIY6uALIFRs",
        "https://auroramaize.com/hourstickets/",
        "https://auroramaize.com/haunted/"
      ]
    },
    "seasonalListing": {
      "contract": "ListingCompletenessV1",
      "recordId": "MO26-002",
      "seasonYear": 2026,
      "timeZone": "America/Chicago",
      "visitorAddress": "20591 County Road 2200, Aurora, MO 65605",
      "placement": {
        "lat": 36.9808456,
        "lon": -93.6877871,
        "basis": "operator-site",
        "sourceUrl": "https://www.google.com/maps/d/embed?mid=1r3gzFPM4zv8RVTvb5uD9ouIY6uALIFRs",
        "checkedAt": "2026-10-09",
        "precisionLabel": "Approximate site/address placement only; not a verified entrance, parking or rideshare dropoff"
      },
      "directionsTarget": {
        "kind": "visitor-address",
        "address": "20591 County Road 2200, Aurora, MO 65605"
      },
      "hours": {
        "state": "partial",
        "displayText": "Listed Wed/Fri/Sat hours are last-admission times; final exit is not specified."
      },
      "listingExpiresAt": "2026-10-31T22:00:00-05:00",
      "expiryBasis": "exact",
      "sourceUrls": [
        "https://auroramaize.com/contacts/",
        "https://www.google.com/maps/d/embed?mid=1r3gzFPM4zv8RVTvb5uD9ouIY6uALIFRs",
        "https://auroramaize.com/hourstickets/",
        "https://auroramaize.com/haunted/"
      ],
      "reviewRevision": "MO2026-astra-commercial-independent-2026-10-09"
    },
    "seasonalVisitNotes": [
      "September 19–October 31, 2026.",
      "Wednesdays from October 7: 5–8:30 p.m.; Fridays 5–10 p.m.; Saturdays 4–10 p.m. These are last-admission times; final exit is not specified.",
      "Maze scares start at dark Friday/Saturday from September 25 and Wednesdays October 7–28. Zombie Harvest runs Friday/Saturday at dusk.",
      "Confirm the visitor entrance before traveling.",
      "Location is approximate."
    ]
  },
  {
    "id": "date-night-mo26-astra-shepherds-lantern",
    "name": "The Broken Hour at Shepherd’s Lantern",
    "address": "5803 Jakes Prairie Road, Cuba, MO 65453",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Haunted Experience",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://www.eventbrite.com/e/the-broken-hour-tickets-2000536103338",
    "isChain": false,
    "photoKey": "cafe",
    "source": "catalog",
    "activityTypes": [
      "haunted-house"
    ],
    "moodLevel": 3,
    "seasonalAvailability": {
      "status": "confirmed",
      "activeFrom": "2026-10-16",
      "activeUntil": "2026-10-17",
      "activeDates": [
        "2026-10-16",
        "2026-10-17"
      ],
      "checkedAt": "2026-10-09",
      "revalidateAfter": "2026-10-15",
      "timeZone": "America/Chicago",
      "openNowPolicy": "never",
      "listingExpiresAt": "2026-10-17T22:00:00-05:00",
      "seasonYear": 2026,
      "sourceUrls": [
        "https://www.eventbrite.com/e/the-broken-hour-tickets-2000536103338",
        "https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?address=5803+Jakes+Prairie+Road%2C+Cuba%2C+MO+65453&benchmark=Public_AR_Current&format=json",
        "https://www.shepherdslanternllc.com/"
      ],
      "endsAt": "2026-10-17T22:00:00-05:00"
    },
    "seasonalListing": {
      "contract": "ListingCompletenessV1",
      "recordId": "DELTA2-SHEPHERD-LANTERN",
      "seasonYear": 2026,
      "timeZone": "America/Chicago",
      "visitorAddress": "5803 Jakes Prairie Road, Cuba, MO 65453",
      "placement": {
        "lat": 38.130489811549,
        "lon": -91.467898376669,
        "basis": "address-geocode",
        "sourceUrl": "https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?address=5803+Jakes+Prairie+Road%2C+Cuba%2C+MO+65453&benchmark=Public_AR_Current&format=json",
        "checkedAt": "2026-10-09",
        "precisionLabel": "Approximate site/address placement only; not a verified entrance, parking or rideshare dropoff"
      },
      "directionsTarget": {
        "kind": "visitor-address",
        "address": "5803 Jakes Prairie Road, Cuba, MO 65453"
      },
      "hours": {
        "state": "partial",
        "displayText": "Check your ticket for arrival time; final October 17 event ends at 10 p.m."
      },
      "listingExpiresAt": "2026-10-17T22:00:00-05:00",
      "expiryBasis": "exact",
      "sourceUrls": [
        "https://www.eventbrite.com/e/the-broken-hour-tickets-2000536103338",
        "https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?address=5803+Jakes+Prairie+Road%2C+Cuba%2C+MO+65453&benchmark=Public_AR_Current&format=json",
        "https://www.shepherdslanternllc.com/"
      ],
      "reviewRevision": "MO2026-astra-commercial-independent-2026-10-09"
    },
    "seasonalVisitNotes": [
      "October 16–17, 2026; check your ticket for arrival time.",
      "Parental guidance suggested for darkness, suspense and frightening situations.",
      "Tickets are offered online and at the door. Online refunds are available up to seven days before the event.",
      "Confirm arrival instructions with your booking.",
      "Location is approximate."
    ]
  },
  {
    "id": "date-night-mo26-astra-haunted-hollows",
    "name": "Haunted Hollows Haunted Trail",
    "address": "5947 County Road 261, Palmyra, MO 63461",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Haunted Trail",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": "573-406-3515",
    "website": "https://app.gopassage.com/events/haunted-hollows-haunted-trail-2026-season",
    "isChain": false,
    "photoKey": "cafe",
    "source": "catalog",
    "activityTypes": [
      "haunted-house"
    ],
    "moodLevel": 3,
    "seasonalAvailability": {
      "status": "confirmed",
      "activeFrom": "2026-10-09",
      "activeUntil": "2026-10-30",
      "activeDates": [
        "2026-10-09",
        "2026-10-10",
        "2026-10-24",
        "2026-10-30"
      ],
      "checkedAt": "2026-10-09",
      "revalidateAfter": "2026-10-15",
      "timeZone": "America/Chicago",
      "openNowPolicy": "never",
      "listingExpiresAt": "2026-10-30T23:00:00-05:00",
      "seasonYear": 2026,
      "sourceUrls": [
        "https://app.gopassage.com/events/haunted-hollows-haunted-trail-2026-season",
        "https://app.gopassage.com/events/haunted-hollows-haunted-trail-2026-season/event_times/1852662",
        "https://app.hauntpay.com/events/haunted-hollows-haunted-trail-2026-season/event_times/1852666",
        "https://app.gopassage.com/events/haunted-hollows-haunted-trail-2026-season/event_times/1852667"
      ],
      "endsAt": "2026-10-30T23:00:00-05:00"
    },
    "seasonalListing": {
      "contract": "ListingCompletenessV1",
      "recordId": "DELTA2-HOLLOWS",
      "seasonYear": 2026,
      "timeZone": "America/Chicago",
      "visitorAddress": "5947 County Road 261, Palmyra, MO 63461",
      "placement": {
        "lat": 39.733676,
        "lon": -91.562875,
        "basis": "operator-site",
        "sourceUrl": "https://app.gopassage.com/events/haunted-hollows-haunted-trail-2026-season",
        "checkedAt": "2026-10-09",
        "precisionLabel": "Approximate site/address placement only; not a verified entrance, parking or rideshare dropoff"
      },
      "directionsTarget": {
        "kind": "visitor-address",
        "address": "5947 County Road 261, Palmyra, MO 63461"
      },
      "hours": {
        "state": "partial",
        "displayText": "October 10, 24 and 30 sessions: 7:30–11 p.m.; October 9 starts at 7:30 p.m."
      },
      "listingExpiresAt": "2026-10-30T23:00:00-05:00",
      "expiryBasis": "exact",
      "sourceUrls": [
        "https://app.gopassage.com/events/haunted-hollows-haunted-trail-2026-season",
        "https://app.gopassage.com/events/haunted-hollows-haunted-trail-2026-season/event_times/1852662",
        "https://app.hauntpay.com/events/haunted-hollows-haunted-trail-2026-season/event_times/1852666",
        "https://app.gopassage.com/events/haunted-hollows-haunted-trail-2026-season/event_times/1852667"
      ],
      "reviewRevision": "MO2026-astra-commercial-independent-2026-10-09"
    },
    "seasonalVisitNotes": [
      "Confirmed ticket dates: October 9, 10, 24 and 30, 2026.",
      "October 10, 24 and 30 sessions run 7:30–11 p.m.; October 9 starts at 7:30 p.m.",
      "Check the booking calendar for other dates and current availability.",
      "Tickets are nonrefundable unless the organizer cancels.",
      "Location is approximate."
    ]
  },
  {
    "id": "date-night-mo26-astra-feemster-corn-maze",
    "name": "Feemster Twisted Corn Maze",
    "address": "2501 E Farm Road 94, Springfield, MO 65803",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Corn Maze",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": "417-894-7458",
    "website": "https://www.feemsterscornmaze.com/",
    "isChain": false,
    "photoKey": "cafe",
    "source": "catalog",
    "activityTypes": [
      "corn-maze"
    ],
    "moodLevel": 2,
    "seasonalAvailability": {
      "status": "confirmed",
      "activeFrom": "2026-09-26",
      "activeUntil": "2026-11-01",
      "activeDates": [
        "2026-09-26",
        "2026-09-27",
        "2026-10-02",
        "2026-10-03",
        "2026-10-04",
        "2026-10-09",
        "2026-10-10",
        "2026-10-11",
        "2026-10-16",
        "2026-10-17",
        "2026-10-18",
        "2026-10-23",
        "2026-10-24",
        "2026-10-25",
        "2026-10-30",
        "2026-10-31",
        "2026-11-01"
      ],
      "checkedAt": "2026-10-09",
      "revalidateAfter": "2026-10-15",
      "timeZone": "America/Chicago",
      "openNowPolicy": "never",
      "listingExpiresAt": "2026-11-01T21:00:00-06:00",
      "seasonYear": 2026,
      "sourceUrls": [
        "https://www.feemsterscornmaze.com/contact",
        "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?SingleLine=2501+E+Farm+Road+94%2C+Springfield%2C+MO+65803&f=pjson&outFields=Match_addr%2CAddr_type&maxLocations=3",
        "https://www.feemsterscornmaze.com/"
      ],
      "endsAt": "2026-11-01T21:00:00-06:00"
    },
    "seasonalListing": {
      "contract": "ListingCompletenessV1",
      "recordId": "MO26-039",
      "seasonYear": 2026,
      "timeZone": "America/Chicago",
      "visitorAddress": "2501 E Farm Road 94, Springfield, MO 65803",
      "placement": {
        "lat": 37.273100307742,
        "lon": -93.24361332435,
        "basis": "address-geocode",
        "sourceUrl": "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?SingleLine=2501+E+Farm+Road+94%2C+Springfield%2C+MO+65803&f=pjson&outFields=Match_addr%2CAddr_type&maxLocations=3",
        "checkedAt": "2026-10-09",
        "precisionLabel": "Approximate site/address placement only; not a verified entrance, parking or rideshare dropoff"
      },
      "directionsTarget": {
        "kind": "visitor-address",
        "address": "2501 E Farm Road 94, Springfield, MO 65803"
      },
      "hours": {
        "state": "partial",
        "displayText": "October: Fri 5–9 p.m., Sat 10 a.m.–9 p.m., Sun 1–9 p.m.; November 1, 1–9 p.m. Last tickets one hour before close."
      },
      "listingExpiresAt": "2026-11-01T21:00:00-06:00",
      "expiryBasis": "exact",
      "sourceUrls": [
        "https://www.feemsterscornmaze.com/contact",
        "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?SingleLine=2501+E+Farm+Road+94%2C+Springfield%2C+MO+65803&f=pjson&outFields=Match_addr%2CAddr_type&maxLocations=3",
        "https://www.feemsterscornmaze.com/"
      ],
      "reviewRevision": "MO2026-astra-commercial-independent-2026-10-09"
    },
    "seasonalVisitNotes": [
      "September 26–27, October Fridays–Sundays, and November 1, 2026.",
      "October: Fridays 5–9 p.m., Saturdays 10 a.m.–9 p.m., Sundays 1–9 p.m.; November 1 is 1–9 p.m. Last tickets are sold one hour before closing.",
      "Hayrides and the apple cannon stop at sunset. Height and supervision rules apply to play equipment.",
      "The farm’s posted no-animal rule includes service animals; contact it about access arrangements before travel.",
      "Check the farm’s Facebook page for weather updates.",
      "Location is approximate."
    ]
  }
];

export const MISSOURI_2026_ASTRA_COMMERCIAL_CATALOG =
  MISSOURI_2026_ASTRA_COMMERCIAL_LISTINGS
    .map(seasonalListingToPlace)
    .filter((place): place is DateNightPlace => place !== null);
