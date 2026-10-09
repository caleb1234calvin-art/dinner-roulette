import type { DateNightPlace } from "./types";
import { seasonalListingToPlace, type SeasonalListing } from "./listing";

/** Eleven exact data-cleared projections from continuity d7348ea, freshly checked
 * 2026-10-09 and independently confirmed before import at continuity 6c3515d2.
 * Field-level provenance and reviewed copy: audit/astra-eleven-2026-10-09/.
 * Display schedules never become machine hours. Address points remain approximate.
 * Cobb alone uses reviewed lifecycle visibility; the Halloween/provider season is unchanged.
 */
export const MISSOURI_2026_ASTRA_ELEVEN_LISTINGS:
  (Omit<DateNightPlace, "lat" | "lon"> & { seasonalListing: SeasonalListing })[] = [
  {
    "id": "date-night-mo26-astra-branson-ghoster",
    "name": "The Curse at The Branson Ghoster Coaster",
    "address": "2115 W. 76 Country Blvd, Branson, MO 65616",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Other Halloween / Fall",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": "417-544-8068",
    "website": "https://www.thebransoncoaster.com/halloween",
    "isChain": false,
    "photoKey": "cafe",
    "source": "catalog",
    "activityTypes": [
      "other-halloween-fall"
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
        "https://www.thebransoncoaster.com/halloween",
        "https://www.thebransoncoaster.com/ride-requirements",
        "https://www.thebransoncoaster.com/"
      ],
      "endsAt": "2026-10-31T22:00:00-05:00"
    },
    "seasonalListing": {
      "contract": "ListingCompletenessV1",
      "recordId": "DELTA2-BRANSON-GHOSTER",
      "seasonYear": 2026,
      "timeZone": "America/Chicago",
      "visitorAddress": "2115 W. 76 Country Blvd, Branson, MO 65616",
      "placement": {
        "lat": 36.64095609765,
        "lon": -93.260005613352,
        "basis": "address-geocode",
        "sourceUrl": "https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?address=2115+W+76+Country+Blvd%2C+Branson%2C+MO+65616&benchmark=Public_AR_Current&format=json",
        "checkedAt": "2026-10-09",
        "precisionLabel": "Approximate Census address-range interpolation; not an entrance, parking stall, gate, doorway or rideshare drop-off."
      },
      "directionsTarget": {
        "kind": "visitor-address",
        "address": "2115 W. 76 Country Blvd, Branson, MO 65616"
      },
      "hours": {
        "state": "verified",
        "displayText": "7–10 p.m. on listed nights."
      },
      "listingExpiresAt": "2026-10-31T22:00:00-05:00",
      "expiryBasis": "exact",
      "sourceUrls": [
        "https://www.thebransoncoaster.com/halloween",
        "https://www.thebransoncoaster.com/ride-requirements",
        "https://www.thebransoncoaster.com/"
      ],
      "reviewRevision": "MO2026-astra-eleven-d7348ea-freshness-2026-10-09"
    },
    "seasonalVisitNotes": [
      "Friday and Saturday nights in October: 7–10 p.m.",
      "Special-event ticket required; regular and third-party tickets or discounts do not apply. Recommended ages 13+.",
      "Two-rider sled: passenger age 3+ and 38–56 inches; driver age 16+ and at least 56 inches. Front rider must be at least a head shorter; two riders both over 56 inches cannot share.",
      "Sled weight limit: 375 lb dry / 330 lb wet. The age-16 companion rule is not a solo-driver minimum.",
      "Location is approximate."
    ]
  },
  {
    "id": "date-night-mo26-astra-liberty-corn-maze",
    "name": "Liberty Corn Maze",
    "address": "17607 Liberty Bend Road S,Liberty,MO64068",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Corn Maze",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://www.libertycornmaze.com/",
    "isChain": false,
    "photoKey": "cafe",
    "source": "catalog",
    "activityTypes": [
      "corn-maze"
    ],
    "moodLevel": 2,
    "seasonalAvailability": {
      "status": "confirmed",
      "activeFrom": "2026-09-11",
      "activeUntil": "2026-10-30",
      "activeDates": [
        "2026-09-11",
        "2026-09-12",
        "2026-09-13",
        "2026-09-18",
        "2026-09-19",
        "2026-09-20",
        "2026-09-25",
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
        "2026-10-30"
      ],
      "checkedAt": "2026-10-09",
      "revalidateAfter": "2026-10-15",
      "timeZone": "America/Chicago",
      "openNowPolicy": "never",
      "listingExpiresAt": "2026-10-30T23:00:00-05:00",
      "seasonYear": 2026,
      "sourceUrls": [
        "https://www.libertycornmaze.com/maze-info/",
        "https://www.libertycornmaze.com/event/2026-corn-maze-pass/"
      ],
      "endsAt": "2026-10-30T23:00:00-05:00"
    },
    "seasonalListing": {
      "contract": "ListingCompletenessV1",
      "recordId": "MO26-056",
      "seasonYear": 2026,
      "timeZone": "America/Chicago",
      "visitorAddress": "17607 Liberty Bend Road S,Liberty,MO64068",
      "placement": {
        "lat": 39.1857233,
        "lon": -94.3698827,
        "basis": "operator-site",
        "sourceUrl": "https://www.libertycornmaze.com/maze-info/",
        "checkedAt": "2026-10-09",
        "precisionLabel": "Approximate site placement only; not independently verified entrance or parking."
      },
      "directionsTarget": {
        "kind": "visitor-address",
        "address": "17607 Liberty Bend Road S,Liberty,MO64068"
      },
      "hours": {
        "state": "partial",
        "displayText": "Weekend admission hours vary. Check last-entry and closing times before going."
      },
      "listingExpiresAt": "2026-10-30T23:00:00-05:00",
      "expiryBasis": "exact",
      "sourceUrls": [
        "https://www.libertycornmaze.com/maze-info/",
        "https://www.libertycornmaze.com/event/2026-corn-maze-pass/"
      ],
      "reviewRevision": "MO2026-astra-eleven-d7348ea-freshness-2026-10-09"
    },
    "seasonalVisitNotes": [
      "Friday–Sunday, September 11–October 30. Final October 30 close: 11 p.m. Last admission varies; check the venue.",
      "Large groups require one week’s advance notice. Trails may be muddy; wear suitable footwear.",
      "Maze rules: no pets, alcohol, smoking, concealed weapons or outside food/drink; bags may be searched.",
      "Carolyn’s Pumpkin Patch is separate; combined access needs the appropriate ticket.",
      "Location is approximate."
    ]
  },
  {
    "id": "date-night-mo26-astra-terror-at-the-ranch",
    "name": "Terror at the Ranch",
    "address": "23111 S. Jefferson Pkwy, Harrisonville, MO64701",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Haunted House",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://app.hauntpay.com/events/terrorattheranch",
    "isChain": false,
    "photoKey": "cafe",
    "source": "catalog",
    "activityTypes": [
      "haunted-house",
      "corn-maze"
    ],
    "moodLevel": 3,
    "seasonalAvailability": {
      "status": "confirmed",
      "activeFrom": "2026-10-09",
      "activeUntil": "2026-10-31",
      "checkedAt": "2026-10-09",
      "revalidateAfter": "2026-10-15",
      "timeZone": "America/Chicago",
      "openNowPolicy": "never",
      "listingExpiresAt": "2026-10-31T23:00:00-05:00",
      "seasonYear": 2026,
      "sourceUrls": [
        "https://app.hauntpay.com/events/terrorattheranch",
        "https://app.hauntpay.com/venues/11373"
      ],
      "endsAt": "2026-10-31T23:00:00-05:00"
    },
    "seasonalListing": {
      "contract": "ListingCompletenessV1",
      "recordId": "DELTA3-RANCH",
      "seasonYear": 2026,
      "timeZone": "America/Chicago",
      "visitorAddress": "23111 S. Jefferson Pkwy, Harrisonville, MO64701",
      "placement": {
        "lat": 38.699068931183,
        "lon": -94.350116918769,
        "basis": "address-geocode",
        "sourceUrl": "https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?address=23111+S+Jefferson+Pkwy%2C+Harrisonville%2C+MO+64701&benchmark=Public_AR_Current&format=json",
        "checkedAt": "2026-10-09",
        "precisionLabel": "approximate-address-derived; not gate/parking/doorway/rideshare dropoff"
      },
      "directionsTarget": {
        "kind": "visitor-address",
        "address": "23111 S. Jefferson Pkwy, Harrisonville, MO64701"
      },
      "hours": {
        "state": "partial",
        "displayText": "Selected October evenings; check individual times. Final October 31 event ends at 11 p.m."
      },
      "listingExpiresAt": "2026-10-31T23:00:00-05:00",
      "expiryBasis": "exact",
      "sourceUrls": [
        "https://app.hauntpay.com/events/terrorattheranch",
        "https://app.hauntpay.com/venues/11373"
      ],
      "reviewRevision": "MO2026-astra-eleven-d7348ea-freshness-2026-10-09"
    },
    "seasonalVisitNotes": [
      "Three haunted experiences at Red Barn Ranch, including a haunted corn maze.",
      "Selected October evenings through October 31; check individual times. Final October 31 event ends at 11 p.m.",
      "Location is approximate."
    ]
  },
  {
    "id": "date-night-mo26-astra-cobb-factory",
    "name": "PanicFest — The Cobb Factory",
    "address": "141 E. Main Street, Old Monroe, MO63369",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Haunted House",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://panicfest.com/plan-your-visit/",
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
      "activeUntil": "2026-11-07",
      "activeDates": [
        "2026-09-25",
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
        "2026-11-01",
        "2026-11-06",
        "2026-11-07"
      ],
      "checkedAt": "2026-10-09",
      "revalidateAfter": "2026-10-15",
      "timeZone": "America/Chicago",
      "openNowPolicy": "never",
      "listingExpiresAt": "2026-11-07T23:00:00-06:00",
      "seasonYear": 2026,
      "sourceUrls": [
        "https://panicfest.com/plan-your-visit/",
        "https://panicfest.com/buy-tickets/"
      ],
      "endsAt": "2026-11-07T23:00:00-06:00"
    },
    "seasonalListing": {
      "contract": "ListingCompletenessV1",
      "recordId": "DELTA3-COBB",
      "seasonYear": 2026,
      "timeZone": "America/Chicago",
      "visitorAddress": "141 E. Main Street, Old Monroe, MO63369",
      "placement": {
        "lat": 38.931375171592,
        "lon": -90.746591944663,
        "basis": "address-geocode",
        "sourceUrl": "https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?address=141+E+Main+Street%2C+Old+Monroe%2C+MO+63369&benchmark=Public_AR_Current&format=json",
        "checkedAt": "2026-10-09",
        "precisionLabel": "approximate-address-derived; not gate/parking/doorway/rideshare dropoff"
      },
      "directionsTarget": {
        "kind": "visitor-address",
        "address": "141 E. Main Street, Old Monroe, MO63369"
      },
      "hours": {
        "state": "verified",
        "displayText": "Listed September/October Friday and Saturday nights 7 p.m.–midnight; listed Sundays through November 1, 7–10 p.m. November 6–7: 7–11 p.m."
      },
      "listingExpiresAt": "2026-11-07T23:00:00-06:00",
      "expiryBasis": "exact",
      "sourceUrls": [
        "https://panicfest.com/plan-your-visit/",
        "https://panicfest.com/buy-tickets/"
      ],
      "reviewRevision": "MO2026-astra-eleven-d7348ea-freshness-2026-10-09",
      "visibility": "listing-lifecycle"
    },
    "seasonalVisitNotes": [
      "Listed Friday–Sunday nights September 25–November 1; also November 6–7.",
      "Friday/Saturday nights through October: 7 p.m.–midnight. Listed Sundays, including November 1: 7–10 p.m. November 6–7: 7–11 p.m.",
      "Tickets are purchased on site.",
      "Haunt directories report ages 10+, strobes, fog, physically demanding conditions and health-related entry restrictions. Confirm restrictions with the venue.",
      "Location is approximate."
    ]
  },
  {
    "id": "date-night-mo26-astra-field-of-screams-nixa",
    "name": "Field of Screams Nixa",
    "address": "Summers at the River, 2142 N. Sports Complex Ln., Nixa, MO 65714",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Haunted House",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://fieldofscreamsnixa.com/",
    "isChain": false,
    "photoKey": "cafe",
    "source": "catalog",
    "activityTypes": [
      "haunted-house"
    ],
    "moodLevel": 3,
    "seasonalAvailability": {
      "status": "confirmed",
      "activeFrom": "2026-09-18",
      "activeUntil": "2026-11-01",
      "activeDates": [
        "2026-09-18",
        "2026-09-19",
        "2026-09-25",
        "2026-09-26",
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
        "2026-10-29",
        "2026-10-30",
        "2026-10-31",
        "2026-11-01"
      ],
      "checkedAt": "2026-10-09",
      "revalidateAfter": "2026-10-15",
      "timeZone": "America/Chicago",
      "openNowPolicy": "never",
      "listingExpiresAt": "2026-11-02T00:00:00-06:00",
      "seasonYear": 2026,
      "sourceUrls": [
        "https://fieldofscreamsnixa.com/dates",
        "https://fieldofscreamsnixa.com/directions",
        "https://fieldofscreamsnixa.com/",
        "https://fieldofscreamsnixa.com/safety-rules",
        "https://fieldofscreamsnixa.com/faq",
        "https://app.hauntpay.com/events/field-of-scream-2026",
        "https://morty.app/attraction/53023/the-haunted-forest"
      ],
      "endsAt": "2026-11-02T00:00:00-06:00"
    },
    "seasonalListing": {
      "contract": "ListingCompletenessV1",
      "recordId": "MO26-037",
      "seasonYear": 2026,
      "timeZone": "America/Chicago",
      "visitorAddress": "Summers at the River, 2142 N. Sports Complex Ln., Nixa, MO 65714",
      "placement": {
        "lat": 37.0931968,
        "lon": -93.3012305,
        "basis": "operator-site",
        "sourceUrl": "https://maps.app.goo.gl/uockRQnBPToZLvkk8",
        "checkedAt": "2026-10-09",
        "precisionLabel": "Approximate site placement only; not entrance, parking, gate, doorway or rideshare dropoff."
      },
      "directionsTarget": {
        "kind": "visitor-address",
        "address": "Summers at the River, 2142 N. Sports Complex Ln., Nixa, MO 65714"
      },
      "hours": {
        "state": "verified",
        "displayText": "7 p.m.–midnight on listed dates."
      },
      "listingExpiresAt": "2026-11-02T00:00:00-06:00",
      "expiryBasis": "exact",
      "sourceUrls": [
        "https://fieldofscreamsnixa.com/dates",
        "https://fieldofscreamsnixa.com/directions",
        "https://fieldofscreamsnixa.com/",
        "https://fieldofscreamsnixa.com/safety-rules",
        "https://fieldofscreamsnixa.com/faq",
        "https://app.hauntpay.com/events/field-of-scream-2026",
        "https://morty.app/attraction/53023/the-haunted-forest"
      ],
      "reviewRevision": "MO2026-astra-eleven-d7348ea-freshness-2026-10-09"
    },
    "seasonalVisitNotes": [
      "Selected nights September 18–November 1, 7 p.m.–midnight. Check the listed dates before visiting.",
      "Children must have an adult; recommended ages 10–12+ at parental discretion.",
      "Uneven outdoor terrain: wear closed-toe shoes. Strobes, fog, loud effects and darkness; check the operator’s medical-sensitivity warning.",
      "No pets, smoking, drugs, alcohol or weapons. Do not touch actors or props; no flash photography.",
      "A haunt directory reports no wheelchair access or carried babies/infants; confirm access restrictions with the venue.",
      "Online tickets recommended; peak-night gate availability is not guaranteed. October waits may exceed three hours.",
      "Haunted Forest and Coulrophobia share one location. Location is approximate."
    ]
  },
  {
    "id": "date-night-mo26-astra-missouri-nightmare",
    "name": "Missouri Nightmare Haunted Attraction",
    "address": "1420 County Rd276, Columbia, MO65202",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Haunted House",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://app2.hauntpay.com/events/missouri-nightmare-haunted-attraction-2026",
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
      "activeUntil": "2026-11-01",
      "checkedAt": "2026-10-09",
      "revalidateAfter": "2026-10-15",
      "timeZone": "America/Chicago",
      "openNowPolicy": "never",
      "listingExpiresAt": "2026-11-01T20:30:00-06:00",
      "seasonYear": 2026,
      "sourceUrls": [
        "https://app2.hauntpay.com/venues/9298",
        "https://app2.hauntpay.com/events/missouri-nightmare-haunted-attraction-2026"
      ],
      "endsAt": "2026-11-01T20:30:00-06:00"
    },
    "seasonalListing": {
      "contract": "ListingCompletenessV1",
      "recordId": "DELTA2-MISSOURI-NIGHTMARE",
      "seasonYear": 2026,
      "timeZone": "America/Chicago",
      "visitorAddress": "1420 County Rd276, Columbia, MO65202",
      "placement": {
        "lat": 38.977510601859,
        "lon": -92.139911854447,
        "basis": "address-geocode",
        "sourceUrl": "https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?address=1420+County+Rd+276%2C+Columbia%2C+MO+65202&benchmark=Public_AR_Current&format=json",
        "checkedAt": "2026-10-09",
        "precisionLabel": "Approximate Census address-range interpolation only; Directions must use supported visitor address."
      },
      "directionsTarget": {
        "kind": "visitor-address",
        "address": "1420 County Rd276, Columbia, MO65202"
      },
      "hours": {
        "state": "partial",
        "displayText": "Season listing October 9–November 1. First occurrence starts 7 p.m.; final November 1 occurrence ends 8:30 p.m. CST. Check individual visit times."
      },
      "listingExpiresAt": "2026-11-01T20:30:00-06:00",
      "expiryBasis": "exact",
      "sourceUrls": [
        "https://app2.hauntpay.com/venues/9298",
        "https://app2.hauntpay.com/events/missouri-nightmare-haunted-attraction-2026"
      ],
      "reviewRevision": "MO2026-astra-eleven-d7348ea-freshness-2026-10-09"
    },
    "seasonalVisitNotes": [
      "Selected events October 9–November 1; check individual times. First occurrence starts at 7 p.m.; final November 1 event ends at 8:30 p.m.",
      "Location is approximate."
    ]
  },
  {
    "id": "date-night-mo26-astra-trepidations",
    "name": "Trepidations Haunted Attraction",
    "address": "101 East Commercial Street, Exeter, MO65647",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Haunted House",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://trepidationshaunt.fearticket.com/",
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
      "activeUntil": "2026-11-01",
      "activeDates": [
        "2026-10-02",
        "2026-10-03",
        "2026-10-09",
        "2026-10-10",
        "2026-10-16",
        "2026-10-17",
        "2026-10-22",
        "2026-10-23",
        "2026-10-24",
        "2026-10-29",
        "2026-10-30",
        "2026-10-31",
        "2026-11-01"
      ],
      "checkedAt": "2026-10-09",
      "revalidateAfter": "2026-10-15",
      "timeZone": "America/Chicago",
      "openNowPolicy": "never",
      "listingExpiresAt": "2026-11-01T23:00:00-06:00",
      "seasonYear": 2026,
      "sourceUrls": [
        "https://trepidationshaunt.fearticket.com/"
      ],
      "endsAt": "2026-11-01T23:00:00-06:00"
    },
    "seasonalListing": {
      "contract": "ListingCompletenessV1",
      "recordId": "DELTA2-TREPIDATIONS",
      "seasonYear": 2026,
      "timeZone": "America/Chicago",
      "visitorAddress": "101 East Commercial Street, Exeter, MO65647",
      "placement": {
        "lat": 36.6725635,
        "lon": -93.9396267,
        "basis": "operator-site",
        "sourceUrl": "https://trepidationshaunt.fearticket.com/",
        "checkedAt": "2026-10-09",
        "precisionLabel": "Approximate site placement only; not entrance, parking, gate, doorway or rideshare dropoff."
      },
      "directionsTarget": {
        "kind": "visitor-address",
        "address": "101 East Commercial Street, Exeter, MO65647"
      },
      "hours": {
        "state": "verified",
        "displayText": "Regular nights 7–11 p.m.; no-scare October 22 and 29, 7–10 p.m.; November 1 Blackout, 7–11 p.m."
      },
      "listingExpiresAt": "2026-11-01T23:00:00-06:00",
      "expiryBasis": "exact",
      "sourceUrls": [
        "https://trepidationshaunt.fearticket.com/"
      ],
      "reviewRevision": "MO2026-astra-eleven-d7348ea-freshness-2026-10-09"
    },
    "seasonalVisitNotes": [
      "Regular scare nights October 2–3, 9–10, 16–17, 23–24 and 30–31: 7–11 p.m.",
      "No-scare nights October 22 and 29: 7–10 p.m. November 1 Blackout: 7–11 p.m.",
      "Strobes, fog, low visibility and demanding walking. Read the operator’s medical, pregnancy and claustrophobia warning before booking.",
      "Operator bars entry with casts, braces, crutches, physical limitations, intoxication or medication/drug use; check eligibility with the venue.",
      "Shoes required; no high heels. Remove jewelry/earrings. No smoking, touching actors or props, or video/photography inside.",
      "Location is approximate."
    ]
  },
  {
    "id": "date-night-mo26-astra-freaks-fair",
    "name": "Freaks Fair Haunted Attraction",
    "address": "126 SW 400 Rd. (Twin Oaks Event Center), Warrensburg, MO 64093",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Haunted House",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://freaksfair2026.fearticket.com/",
    "isChain": false,
    "photoKey": "cafe",
    "source": "catalog",
    "activityTypes": [
      "haunted-house"
    ],
    "moodLevel": 3,
    "seasonalAvailability": {
      "status": "confirmed",
      "activeFrom": "2026-10-23",
      "activeUntil": "2026-10-31",
      "activeDates": [
        "2026-10-23",
        "2026-10-24",
        "2026-10-30",
        "2026-10-31"
      ],
      "checkedAt": "2026-10-09",
      "revalidateAfter": "2026-10-15",
      "timeZone": "America/Chicago",
      "openNowPolicy": "never",
      "listingExpiresAt": "2026-10-31T22:30:00-05:00",
      "seasonYear": 2026,
      "sourceUrls": [
        "https://freaksfair2026.fearticket.com/"
      ],
      "endsAt": "2026-10-31T22:30:00-05:00"
    },
    "seasonalListing": {
      "contract": "ListingCompletenessV1",
      "recordId": "DELTA3-FREAKS",
      "seasonYear": 2026,
      "timeZone": "America/Chicago",
      "visitorAddress": "126 SW 400 Rd. (Twin Oaks Event Center), Warrensburg, MO 64093",
      "placement": {
        "lat": 38.7627893,
        "lon": -93.7360498,
        "basis": "operator-site",
        "sourceUrl": "https://freaksfair2026.fearticket.com/",
        "checkedAt": "2026-10-09",
        "precisionLabel": "Approximate site placement only, not an entrance, parking, gate or rideshare dropoff."
      },
      "directionsTarget": {
        "kind": "visitor-address",
        "address": "126 SW 400 Rd. (Twin Oaks Event Center), Warrensburg, MO 64093"
      },
      "hours": {
        "state": "verified",
        "displayText": "October 23–24 and 30–31, 7–10:30 p.m."
      },
      "listingExpiresAt": "2026-10-31T22:30:00-05:00",
      "expiryBasis": "exact",
      "sourceUrls": [
        "https://freaksfair2026.fearticket.com/"
      ],
      "reviewRevision": "MO2026-astra-eleven-d7348ea-freshness-2026-10-09"
    },
    "seasonalVisitNotes": [
      "October 23–24 and 30–31, 7–10:30 p.m.",
      "Ticket is valid for one entry on the selected night.",
      "Location is approximate."
    ]
  },
  {
    "id": "date-night-mo26-astra-hell-harvest",
    "name": "Hell Harvest",
    "address": "19126 Missouri 8, Potosi, MO 63664",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Haunted House",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://hellharvest2026.fearticket.com/",
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
        "2026-10-09",
        "2026-10-10",
        "2026-10-11",
        "2026-10-16",
        "2026-10-17",
        "2026-10-22",
        "2026-10-23",
        "2026-10-24",
        "2026-10-29",
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
        "https://hellharvest2026.fearticket.com/",
        "https://hellharvest.com/faq/",
        "https://hellharvest.com/warning/",
        "https://hellharvest.com/venue/hell-harvest-haunted-attraction/"
      ]
    },
    "seasonalListing": {
      "contract": "ListingCompletenessV1",
      "recordId": "DELTA4-HELL-HARVEST",
      "seasonYear": 2026,
      "timeZone": "America/Chicago",
      "visitorAddress": "19126 Missouri 8, Potosi, MO 63664",
      "placement": {
        "lat": 37.9133909,
        "lon": -90.942628,
        "basis": "operator-site",
        "sourceUrl": "https://hellharvest2026.fearticket.com/",
        "checkedAt": "2026-10-09",
        "precisionLabel": "Approximate operator ticket-map site placement only; not entrance, parking stall, gate, doorway or rideshare dropoff."
      },
      "directionsTarget": {
        "kind": "visitor-address",
        "address": "19126 Missouri 8, Potosi, MO 63664"
      },
      "hours": {
        "state": "partial",
        "displayText": "Select nights September 25–October 31. Listed October nights start at 8 p.m.; closing time unconfirmed. October 11 is listed as chicken night."
      },
      "listingExpiresAt": "2026-11-01T00:00:00-05:00",
      "expiryBasis": "date-only",
      "sourceUrls": [
        "https://hellharvest2026.fearticket.com/",
        "https://hellharvest.com/faq/",
        "https://hellharvest.com/warning/",
        "https://hellharvest.com/venue/hell-harvest-haunted-attraction/"
      ],
      "reviewRevision": "MO2026-astra-eleven-d7348ea-freshness-2026-10-09"
    },
    "seasonalVisitNotes": [
      "Select nights through October 31; listed October nights start at 8 p.m. Closing time unconfirmed. October 11 is chicken night.",
      "Intense effects, uneven terrain and confined spaces; operator says the terrain is not accessible.",
      "Operator advises against entry for young children, pregnancy or relevant medical conditions, and bars injuries, casts, braces, crutches, physical limitations, intoxication or medication/drug use. Read the venue warning before booking.",
      "No pets, weapons, alcohol, drugs, cigarettes or costumes. Do not touch actors or props; no video or flash photography.",
      "Location is approximate."
    ]
  },
  {
    "id": "date-night-mo26-astra-myers-forest-of-fears",
    "name": "Myers Forest of Fears",
    "address": "3935 S Garrison Avenue, Carthage, MO 64836",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Haunted Attraction",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://www.myersforestoffears.com/",
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
      "listingExpiresAt": "2026-11-01T00:00:00-05:00",
      "seasonYear": 2026,
      "sourceUrls": [
        "https://www.myersforestoffears.com/location",
        "https://www.myersforestoffears.com/"
      ]
    },
    "seasonalListing": {
      "contract": "ListingCompletenessV1",
      "recordId": "MO26-005",
      "seasonYear": 2026,
      "timeZone": "America/Chicago",
      "visitorAddress": "3935 S Garrison Avenue, Carthage, MO 64836",
      "placement": {
        "lat": 37.119659,
        "lon": -94.312243,
        "basis": "operator-site",
        "sourceUrl": "https://www.myersforestoffears.com/location",
        "checkedAt": "2026-10-09",
        "precisionLabel": "Approximate operator-linked site placement; not an entrance, parking point or rideshare dropoff"
      },
      "directionsTarget": {
        "kind": "visitor-address",
        "address": "3935 S Garrison Avenue, Carthage, MO 64836"
      },
      "hours": {
        "state": "unknown",
        "displayText": "Hours unconfirmed."
      },
      "listingExpiresAt": "2026-11-01T00:00:00-05:00",
      "expiryBasis": "date-only",
      "sourceUrls": [
        "https://www.myersforestoffears.com/location",
        "https://www.myersforestoffears.com/"
      ],
      "reviewRevision": "MO2026-astra-eleven-d7348ea-freshness-2026-10-09"
    },
    "seasonalVisitNotes": [
      "Open October 9–10, 16–17, 23–24 and 30–31, 2026. Hours are not listed; check the operator before visiting.",
      "Location is approximate."
    ]
  },
  {
    "id": "date-night-mo26-astra-labyrinth-of-fear",
    "name": "Labyrinth of Fear",
    "address": "17866 East Overland Road, Nevada, MO 64772",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Haunted House",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://www.labyrinthoffear.com/",
    "isChain": false,
    "photoKey": "cafe",
    "source": "catalog",
    "activityTypes": [
      "haunted-house"
    ],
    "moodLevel": 3,
    "seasonalAvailability": {
      "status": "confirmed",
      "activeFrom": "2026-10-17",
      "activeUntil": "2026-10-31",
      "activeDates": [
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
        "https://www.labyrinthoffear.com/",
        "https://www.labyrinthoffear.com/faq",
        "https://www.labyrinthoffear.com/location"
      ]
    },
    "seasonalListing": {
      "contract": "ListingCompletenessV1",
      "recordId": "MO26-027",
      "seasonYear": 2026,
      "timeZone": "America/Chicago",
      "visitorAddress": "17866 East Overland Road, Nevada, MO 64772",
      "placement": {
        "lat": 37.828856,
        "lon": -94.315562,
        "basis": "operator-site",
        "sourceUrl": "https://www.labyrinthoffear.com/location",
        "checkedAt": "2026-10-09",
        "precisionLabel": "Approximate operator-linked site placement; not an entrance, parking point or rideshare dropoff"
      },
      "directionsTarget": {
        "kind": "visitor-address",
        "address": "17866 East Overland Road, Nevada, MO 64772"
      },
      "hours": {
        "state": "partial",
        "displayText": "Ticket sales start at 6:30 p.m.; entry starts at 7:30 p.m.; closing time unconfirmed."
      },
      "listingExpiresAt": "2026-11-01T00:00:00-05:00",
      "expiryBasis": "date-only",
      "sourceUrls": [
        "https://www.labyrinthoffear.com/",
        "https://www.labyrinthoffear.com/faq",
        "https://www.labyrinthoffear.com/location"
      ],
      "reviewRevision": "MO2026-astra-eleven-d7348ea-freshness-2026-10-09"
    },
    "seasonalVisitNotes": [
      "Open October 17, 23–24 and 30–31, 2026.",
      "Ticket sales start at 6:30 p.m.; entry starts at 7:30 p.m. Closing time is not listed.",
      "Groups enter in parties of up to four. Expect strobes, fog, loud sound and water effects; incidental contact can occur.",
      "Tickets are valid only on the purchase night and are nonrefundable.",
      "Location is approximate."
    ]
  }
];

export const MISSOURI_2026_ASTRA_ELEVEN_CATALOG =
  MISSOURI_2026_ASTRA_ELEVEN_LISTINGS
    .map(seasonalListingToPlace)
    .filter((place): place is DateNightPlace => place !== null);
