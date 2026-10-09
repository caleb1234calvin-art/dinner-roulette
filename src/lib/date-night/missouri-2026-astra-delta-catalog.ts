import type { DateNightPlace } from "./types";
import { seasonalListingToPlace, type SeasonalListing } from "./listing";

/** Five independently cleared statewide-delta records bound at continuity 81fe87a7.
 * Field provenance, indexed-source limitations and reviewed visitor copy:
 * audit/astra-delta-2026-10-09/. No park/wash hours become haunt intervals.
 * Two drive-through experiences use Other Halloween / Fall and address navigation.
 */
export const MISSOURI_2026_ASTRA_DELTA_LISTINGS:
  (Omit<DateNightPlace, "lat" | "lon"> & { seasonalListing: SeasonalListing })[] = [
  {
    "id": "date-night-mo26-astra-worlds-of-fun-haunt",
    "name": "Worlds of Fun — Halloween Haunt",
    "address": "4545 Worlds of Fun Avenue, Kansas City, MO 64161",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Haunted House",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": "816-454-4545",
    "website": "https://worldsoffun.enchantedparks.com/halloween-haunt/",
    "isChain": false,
    "photoKey": "cafe",
    "source": "catalog",
    "activityTypes": [
      "haunted-house"
    ],
    "moodLevel": 3,
    "seasonalAvailability": {
      "status": "confirmed",
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
        "2026-10-25",
        "2026-10-30",
        "2026-10-31"
      ],
      "checkedAt": "2026-10-09",
      "revalidateAfter": "2026-10-15",
      "timeZone": "America/Chicago",
      "openNowPolicy": "never",
      "listingExpiresAt": "2026-11-01T00:00:00-05:00",
      "seasonYear": 2026,
      "sourceUrls": [
        "https://worldsoffun.enchantedparks.com/halloween-haunt/",
        "https://worldsoffun.enchantedparks.com/park-info/calendar-hours/",
        "https://worldsoffun.enchantedparks.com/park-info/code-of-conduct/"
      ]
    },
    "seasonalListing": {
      "contract": "ListingCompletenessV1",
      "recordId": "DELTA6-WORLDS-OF-FUN",
      "seasonYear": 2026,
      "timeZone": "America/Chicago",
      "visitorAddress": "4545 Worlds of Fun Avenue, Kansas City, MO 64161",
      "placement": {
        "lat": 39.177249320447,
        "lon": -94.489341242397,
        "basis": "address-geocode",
        "sourceUrl": "https://geocoding.geo.census.gov/geocoder/geographies/onelineaddress?address=4545+Worlds+of+Fun+Avenue%2C+Kansas+City%2C+MO+64161&benchmark=Public_AR_Current&vintage=Current_Current&format=json",
        "checkedAt": "2026-10-09T05:01:32.879431+00:00",
        "precisionLabel": "Approximate address-range placement; not an entrance or parking coordinate"
      },
      "directionsTarget": {
        "kind": "visitor-address",
        "address": "4545 Worlds of Fun Avenue, Kansas City, MO 64161"
      },
      "hours": {
        "state": "partial",
        "displayText": "Select October nights through October 31, 2026. Check the Halloween Haunt schedule before visiting."
      },
      "listingExpiresAt": "2026-11-01T00:00:00-05:00",
      "expiryBasis": "date-only",
      "sourceUrls": [
        "https://worldsoffun.enchantedparks.com/halloween-haunt/",
        "https://worldsoffun.enchantedparks.com/park-info/calendar-hours/",
        "https://worldsoffun.enchantedparks.com/park-info/code-of-conduct/"
      ],
      "reviewRevision": "MO2026-astra-delta6-independent-2026-10-09"
    },
    "seasonalVisitNotes": [
      "Halloween Haunt runs on selected October nights through October 31, 2026. Check the haunt schedule before visiting.",
      "Haunted mazes are included with valid park admission or an eligible season pass.",
      "Guests 17 and younger need a chaperone age 21 or older, with no more than five minors per chaperone. No re-entry after 6 p.m.; review ID, bag and costume rules.",
      "Location is approximate."
    ]
  },
  {
    "id": "date-night-mo26-astra-ozark-nightmares",
    "name": "Ozark Nightmares Haunted House — The Viscount’s Manor",
    "address": "22599 Highway 32, Lebanon, MO 65536",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Haunted House",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://www.facebook.com/OzarkNightmares/posts/ozark-nightmares-2026-seasonthe-viscounts-manor-will-be-open-september-25th26th-/1721554156641099/",
    "isChain": false,
    "photoKey": "cafe",
    "source": "catalog",
    "activityTypes": [
      "haunted-house"
    ],
    "moodLevel": 3,
    "seasonalAvailability": {
      "status": "confirmed",
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
        "2026-10-30",
        "2026-10-31"
      ],
      "checkedAt": "2026-10-09",
      "revalidateAfter": "2026-10-15",
      "timeZone": "America/Chicago",
      "openNowPolicy": "never",
      "listingExpiresAt": "2026-11-01T00:00:00-05:00",
      "seasonYear": 2026,
      "sourceUrls": [
        "https://www.facebook.com/OzarkNightmares/posts/ozark-nightmares-2026-seasonthe-viscounts-manor-will-be-open-september-25th26th-/1721554156641099/",
        "https://www.thescarefactor.com/haunted-houses/missouri/ozark-nightmares-haunted-house/",
        "https://www.facebook.com/events/22599-highway-32-lebanon-mo/halloween-weekend-20-years-of-ozark-nightmares-haunted-house-and-corn-maze-the-v/1445243187544330/"
      ]
    },
    "seasonalListing": {
      "contract": "ListingCompletenessV1",
      "recordId": "DELTA2-OZARK",
      "seasonYear": 2026,
      "timeZone": "America/Chicago",
      "visitorAddress": "22599 Highway 32, Lebanon, MO 65536",
      "placement": {
        "lat": 37.668169182421,
        "lon": -92.619844432713,
        "basis": "address-geocode",
        "sourceUrl": "https://geocoding.geo.census.gov/geocoder/geographies/onelineaddress?address=22599+Highway+32%2C+Lebanon%2C+MO+65536&benchmark=Public_AR_Current&vintage=Current_Current&format=json",
        "checkedAt": "2026-10-09T05:01:32.879431+00:00",
        "precisionLabel": "Approximate address-range placement; not an entrance or parking coordinate"
      },
      "directionsTarget": {
        "kind": "visitor-address",
        "address": "22599 Highway 32, Lebanon, MO 65536"
      },
      "hours": {
        "state": "unknown",
        "displayText": "Check the operator for nightly hours."
      },
      "listingExpiresAt": "2026-11-01T00:00:00-05:00",
      "expiryBasis": "date-only",
      "sourceUrls": [
        "https://www.facebook.com/OzarkNightmares/posts/ozark-nightmares-2026-seasonthe-viscounts-manor-will-be-open-september-25th26th-/1721554156641099/",
        "https://www.thescarefactor.com/haunted-houses/missouri/ozark-nightmares-haunted-house/",
        "https://www.facebook.com/events/22599-highway-32-lebanon-mo/halloween-weekend-20-years-of-ozark-nightmares-haunted-house-and-corn-maze-the-v/1445243187544330/"
      ],
      "reviewRevision": "MO2026-astra-delta6-independent-2026-10-09"
    },
    "seasonalVisitNotes": [
      "The Viscount’s Manor opens September 25–26 and October 2–3, 9–10, 16–17, 23–24 and 30–31, 2026.",
      "Check the operator for nightly hours and admission.",
      "Location is approximate."
    ]
  },
  {
    "id": "date-night-mo26-astra-tunnel-of-terror-ballwin",
    "name": "Tunnel of Terror — Tommy’s Express Ballwin",
    "address": "14918 Manchester Road, Ballwin, MO 63011",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Other Halloween / Fall",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": "636-224-8278",
    "website": "https://tommys-express.com/locations/mo156/",
    "isChain": false,
    "photoKey": "cafe",
    "source": "catalog",
    "activityTypes": [
      "other-halloween-fall"
    ],
    "moodLevel": 3,
    "seasonalAvailability": {
      "status": "confirmed",
      "activeFrom": "2026-10-23",
      "activeUntil": "2026-10-24",
      "activeDates": [
        "2026-10-23",
        "2026-10-24"
      ],
      "checkedAt": "2026-10-09",
      "revalidateAfter": "2026-10-15",
      "timeZone": "America/Chicago",
      "openNowPolicy": "never",
      "listingExpiresAt": "2026-10-24T21:30:00-05:00",
      "seasonYear": 2026,
      "sourceUrls": [
        "https://tommys-express.com/locations/mo156/",
        "https://www.facebook.com/events/14918-manchester-rd-ballwin-mo-63011/tunnel-of-terror-tommys-express-ballwin/1482904123658769/",
        "https://www.facebook.com/events/14918-manchester-rd-ballwin-mo-63011/tunnel-of-terror-tommys-express-ballwin/1482904133658768/"
      ],
      "endsAt": "2026-10-24T21:30:00-05:00"
    },
    "seasonalListing": {
      "contract": "ListingCompletenessV1",
      "recordId": "DELTA3-BALLWIN",
      "seasonYear": 2026,
      "timeZone": "America/Chicago",
      "visitorAddress": "14918 Manchester Road, Ballwin, MO 63011",
      "placement": {
        "lat": 38.592934080507,
        "lon": -90.543467455396,
        "basis": "address-geocode",
        "sourceUrl": "https://geocoding.geo.census.gov/geocoder/geographies/onelineaddress?address=14918+Manchester+Road%2C+Ballwin%2C+MO+63011&benchmark=Public_AR_Current&vintage=Current_Current&format=json",
        "checkedAt": "2026-10-09T05:01:32.879431+00:00",
        "precisionLabel": "Approximate address-range placement; not an entrance or parking coordinate"
      },
      "directionsTarget": {
        "kind": "visitor-address",
        "address": "14918 Manchester Road, Ballwin, MO 63011"
      },
      "hours": {
        "state": "partial",
        "displayText": "October 23–24, 2026, 6:30–9:30 p.m."
      },
      "listingExpiresAt": "2026-10-24T21:30:00-05:00",
      "expiryBasis": "exact",
      "sourceUrls": [
        "https://tommys-express.com/locations/mo156/",
        "https://www.facebook.com/events/14918-manchester-rd-ballwin-mo-63011/tunnel-of-terror-tommys-express-ballwin/1482904123658769/",
        "https://www.facebook.com/events/14918-manchester-rd-ballwin-mo-63011/tunnel-of-terror-tommys-express-ballwin/1482904133658768/"
      ],
      "reviewRevision": "MO2026-astra-delta6-independent-2026-10-09"
    },
    "seasonalVisitNotes": [
      "Haunted car wash on October 23–24, 2026, 6:30–9:30 p.m.",
      "Check this location’s event information for vehicle rules and admission.",
      "Location is approximate."
    ]
  },
  {
    "id": "date-night-mo26-astra-tunnel-of-terror-ofallon",
    "name": "Tunnel of Terror — Tommy’s Express O’Fallon",
    "address": "101 Fallon Loop Road, O’Fallon, MO 63368",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Other Halloween / Fall",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": "636-271-5970",
    "website": "https://tommys-express.com/locations/mo77/",
    "isChain": false,
    "photoKey": "cafe",
    "source": "catalog",
    "activityTypes": [
      "other-halloween-fall"
    ],
    "moodLevel": 3,
    "seasonalAvailability": {
      "status": "confirmed",
      "activeFrom": "2026-10-23",
      "activeUntil": "2026-10-24",
      "activeDates": [
        "2026-10-23",
        "2026-10-24"
      ],
      "checkedAt": "2026-10-09",
      "revalidateAfter": "2026-10-15",
      "timeZone": "America/Chicago",
      "openNowPolicy": "never",
      "listingExpiresAt": "2026-10-24T21:30:00-05:00",
      "seasonYear": 2026,
      "sourceUrls": [
        "https://tommys-express.com/locations/mo77/"
      ],
      "endsAt": "2026-10-24T21:30:00-05:00"
    },
    "seasonalListing": {
      "contract": "ListingCompletenessV1",
      "recordId": "DELTA6-OFALLON",
      "seasonYear": 2026,
      "timeZone": "America/Chicago",
      "visitorAddress": "101 Fallon Loop Road, O’Fallon, MO 63368",
      "placement": {
        "lat": 38.764203107345,
        "lon": -90.700048687725,
        "basis": "address-geocode",
        "sourceUrl": "https://geocoding.geo.census.gov/geocoder/geographies/onelineaddress?address=101+Fallon+Loop+Road%2C+O+Fallon%2C+MO+63368&benchmark=Public_AR_Current&vintage=Current_Current&format=json",
        "checkedAt": "2026-10-09T05:01:32.879431+00:00",
        "precisionLabel": "Approximate address-range placement; not an entrance or parking coordinate"
      },
      "directionsTarget": {
        "kind": "visitor-address",
        "address": "101 Fallon Loop Road, O’Fallon, MO 63368"
      },
      "hours": {
        "state": "partial",
        "displayText": "October 23–24, 2026, 6:30–9:30 p.m."
      },
      "listingExpiresAt": "2026-10-24T21:30:00-05:00",
      "expiryBasis": "exact",
      "sourceUrls": [
        "https://tommys-express.com/locations/mo77/"
      ],
      "reviewRevision": "MO2026-astra-delta6-independent-2026-10-09"
    },
    "seasonalVisitNotes": [
      "Haunted car wash on October 23–24, 2026, 6:30–9:30 p.m.",
      "Check this location’s event information for vehicle rules and admission.",
      "Location is approximate."
    ]
  },
  {
    "id": "date-night-mo26-astra-haunted-grotto",
    "name": "The Haunted Grotto",
    "address": "3102 Aad Grotto Road, Poplar Bluff, MO 63901",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Haunted House",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://www.facebook.com/events/3102-aad-grotto-road-poplar-bluff-mo/the-haunted-grotto-2026/27777216921952770/",
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
      "activeUntil": "2026-10-31",
      "activeDates": [
        "2026-10-09",
        "2026-10-10",
        "2026-10-16",
        "2026-10-17",
        "2026-10-23",
        "2026-10-24",
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
        "https://www.facebook.com/events/3102-aad-grotto-road-poplar-bluff-mo/the-haunted-grotto-2026/27777216921952770/",
        "https://www.thescarefactor.com/haunted-houses/missouri/the-haunted-grotto/",
        "https://semodollarsaver.com/product/1-admission-ticket-to-the-haunted-grotto-10-9-10-31/"
      ],
      "endsAt": "2026-10-31T22:00:00-05:00"
    },
    "seasonalListing": {
      "contract": "ListingCompletenessV1",
      "recordId": "DELTA3-GROTTO",
      "seasonYear": 2026,
      "timeZone": "America/Chicago",
      "visitorAddress": "3102 Aad Grotto Road, Poplar Bluff, MO 63901",
      "placement": {
        "lat": 36.7950117,
        "lon": -90.4314449,
        "basis": "address-geocode",
        "sourceUrl": "https://www.waze.com/live-map/directions/us/mo/poplar-bluff/3102-aad-grotto-rd?to=place.ChIJyQVQh72614cRiUJfLHYyszA",
        "checkedAt": "2026-10-09T05:03:13.790045+00:00",
        "precisionLabel": "Approximate address-derived placement; not an entrance or parking coordinate"
      },
      "directionsTarget": {
        "kind": "visitor-address",
        "address": "3102 Aad Grotto Road, Poplar Bluff, MO 63901"
      },
      "hours": {
        "state": "partial",
        "displayText": "7–10 p.m. on listed 2026 dates."
      },
      "listingExpiresAt": "2026-10-31T22:00:00-05:00",
      "expiryBasis": "exact",
      "sourceUrls": [
        "https://www.facebook.com/events/3102-aad-grotto-road-poplar-bluff-mo/the-haunted-grotto-2026/27777216921952770/",
        "https://www.thescarefactor.com/haunted-houses/missouri/the-haunted-grotto/",
        "https://semodollarsaver.com/product/1-admission-ticket-to-the-haunted-grotto-10-9-10-31/"
      ],
      "reviewRevision": "MO2026-astra-delta6-independent-2026-10-09"
    },
    "seasonalVisitNotes": [
      "Open October 9–10, 16–17, 23–24 and 30–31, 2026, 7–10 p.m.",
      "Check the operator before visiting for admission and current conditions.",
      "Location is approximate."
    ]
  }
];

export const MISSOURI_2026_ASTRA_DELTA_CATALOG =
  MISSOURI_2026_ASTRA_DELTA_LISTINGS
    .map(seasonalListingToPlace)
    .filter((place): place is DateNightPlace => place !== null);
