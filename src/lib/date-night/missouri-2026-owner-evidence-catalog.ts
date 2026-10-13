import type { DateNightPlace } from "./types";
import { seasonalListingToPlace, type SeasonalListing } from "./listing";

/** Four independently cleared 2026 projections (review 342b5b51).
 * Owner-attested source facts and independent corroboration are separated in
 * the safe evidence index. Coordinates support approximate placement only;
 * display schedules never create machine hours. Prior catalogs stay unchanged. */
export const MISSOURI_2026_OWNER_EVIDENCE_LISTINGS:
  (Omit<DateNightPlace, "lat" | "lon"> & { seasonalListing: SeasonalListing })[] = [
  {
    "id": "date-night-mo26-waco-schoolhouse-haunt",
    "name": "Waco Schoolhouse Haunt",
    "address": "148 Rose St, Waco, MO 64832",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Haunted House",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://www.facebook.com/wacoshoolhousehaunt/",
    "isChain": false,
    "photoKey": "cafe",
    "source": "catalog",
    "activityTypes": [
      "haunted-house"
    ],
    "moodLevel": 3,
    "seasonalAvailability": {
      "status": "confirmed",
      "checkedAt": "2026-10-13",
      "timeZone": "America/Chicago",
      "openNowPolicy": "never",
      "listingExpiresAt": "2026-11-01T04:30:00Z",
      "seasonYear": 2026,
      "sourceUrls": [
        "https://www.facebook.com/wacoshoolhousehaunt/",
        "https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?address=148+Rose+Street%2C+Waco%2C+MO+64832&benchmark=Public_AR_Current&format=json"
      ],
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
      ]
    },
    "seasonalListing": {
      "contract": "ListingCompletenessV1",
      "recordId": "DELTA2-WACO",
      "seasonYear": 2026,
      "timeZone": "America/Chicago",
      "visitorAddress": "148 Rose St, Waco, MO 64832",
      "placement": {
        "lat": 37.243647988915,
        "lon": -94.596464661177,
        "basis": "address-geocode",
        "sourceUrl": "https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?address=148+Rose+Street%2C+Waco%2C+MO+64832&benchmark=Public_AR_Current&format=json",
        "checkedAt": "2026-10-13",
        "precisionLabel": "Approximate address-derived location; entrance, parking and ride dropoff unverified"
      },
      "directionsTarget": {
        "kind": "visitor-address",
        "address": "148 Rose St, Waco, MO 64832"
      },
      "ridesharePolicy": "external-picker",
      "hours": {
        "state": "partial",
        "displayText": "Haunt 7:30–11:30 PM; tickets from 7 PM. Guests in line by 11:30 PM are admitted; final exit time is unconfirmed."
      },
      "listingExpiresAt": "2026-11-01T04:30:00Z",
      "expiryBasis": "exact",
      "sourceUrls": [
        "https://www.facebook.com/wacoshoolhousehaunt/",
        "https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?address=148+Rose+Street%2C+Waco%2C+MO+64832&benchmark=Public_AR_Current&format=json"
      ],
      "reviewRevision": "MO2026-owner-four-342b5b51-2026-10-13"
    },
    "seasonalVisitNotes": [
      "October 9–10, 16–17, 23–24 and 30–31, 2026.",
      "Haunt 7:30–11:30 PM; tickets from 7 PM. Guests in line by 11:30 PM are admitted; final exit time is unconfirmed.",
      "Cash or card accepted. Location is approximate."
    ]
  },
  {
    "id": "date-night-mo26-dark-nightmares-haunted-forest",
    "name": "Dark Nightmares Haunted Forest",
    "address": "33100 US-24, Buckner, MO 64016",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Haunted House",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://darknightmares.net/",
    "isChain": false,
    "photoKey": "cafe",
    "source": "catalog",
    "activityTypes": [
      "haunted-house"
    ],
    "moodLevel": 3,
    "seasonalAvailability": {
      "status": "confirmed",
      "checkedAt": "2026-10-13",
      "timeZone": "America/Chicago",
      "openNowPolicy": "never",
      "listingExpiresAt": "2026-11-01T05:00:00Z",
      "seasonYear": 2026,
      "sourceUrls": [
        "https://darknightmares.net/",
        "https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?address=33100+US-24%2C+Buckner%2C+MO+64016&benchmark=Public_AR_Current&format=json",
        "https://www.eventvesta.com/events/166345-dark-nightmares-haunted-forest",
        "https://app.gopassage.com/events/dark-nightmares-haunted-forest"
      ],
      "activeFrom": "2026-10-16",
      "activeUntil": "2026-10-31",
      "activeDates": [
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
      "recordId": "DELTA3-DARK-NIGHTMARES",
      "seasonYear": 2026,
      "timeZone": "America/Chicago",
      "visitorAddress": "33100 US-24, Buckner, MO 64016",
      "placement": {
        "lat": 39.134817476407,
        "lon": -94.179631682932,
        "basis": "address-geocode",
        "sourceUrl": "https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?address=33100+US-24%2C+Buckner%2C+MO+64016&benchmark=Public_AR_Current&format=json",
        "checkedAt": "2026-10-13",
        "precisionLabel": "Approximate address-derived location; entrance, parking and ride dropoff unverified"
      },
      "directionsTarget": {
        "kind": "visitor-address",
        "address": "33100 US-24, Buckner, MO 64016"
      },
      "ridesharePolicy": "external-picker",
      "hours": {
        "state": "partial",
        "displayText": "October 16–17, 23–24 and 30–31, 2026. Gates open 7:30 PM; last tickets at midnight. Check your ticket time; closing time is unconfirmed."
      },
      "listingExpiresAt": "2026-11-01T05:00:00Z",
      "expiryBasis": "exact",
      "sourceUrls": [
        "https://darknightmares.net/",
        "https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?address=33100+US-24%2C+Buckner%2C+MO+64016&benchmark=Public_AR_Current&format=json",
        "https://www.eventvesta.com/events/166345-dark-nightmares-haunted-forest",
        "https://app.gopassage.com/events/dark-nightmares-haunted-forest"
      ],
      "reviewRevision": "MO2026-owner-four-342b5b51-2026-10-13"
    },
    "seasonalVisitNotes": [
      "October 16–17, 23–24 and 30–31, 2026. Gates open 7:30 PM; last tickets at midnight. Check your ticket time; closing time is unconfirmed.",
      "1.2-mile wooded trail; closed-toe shoes required. No strollers or scooters, and no separate waiting area for young children.",
      "Recommended for ages 14+. Under 18 requires a guardian-signed waiver.",
      "Optional Blood Pass requires a separate waiver and allows touching, pulling, pushing, shoving or dragging. Remove the necklace to withdraw.",
      "Arrive 15 minutes before your ticket slot; late entry depends on capacity. Use only the operator-provided flashlight. Location is approximate."
    ]
  },
  {
    "id": "date-night-mo26-farrington-haunted-hayride",
    "name": "Annual Farrington Park Haunted Hayride",
    "address": "116 S County Line Rd, Windsor, MO 65360",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Other Halloween / Fall",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://www.windsorhauntedhayride.com/",
    "isChain": false,
    "photoKey": "cafe",
    "source": "catalog",
    "activityTypes": [
      "other-halloween-fall"
    ],
    "moodLevel": 2,
    "seasonalAvailability": {
      "status": "confirmed",
      "checkedAt": "2026-10-13",
      "timeZone": "America/Chicago",
      "openNowPolicy": "never",
      "listingExpiresAt": "2026-10-19T05:00:00Z",
      "seasonYear": 2026,
      "sourceUrls": [
        "https://www.windsorhauntedhayride.com/",
        "https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?address=116+S+County+Line+Rd%2C+Windsor%2C+MO+65360&benchmark=Public_AR_Current&format=json"
      ],
      "activeFrom": "2026-10-17",
      "activeUntil": "2026-10-18",
      "activeDates": [
        "2026-10-17",
        "2026-10-18"
      ]
    },
    "seasonalListing": {
      "contract": "ListingCompletenessV1",
      "recordId": "DELTA3-FARRINGTON",
      "seasonYear": 2026,
      "timeZone": "America/Chicago",
      "visitorAddress": "116 S County Line Rd, Windsor, MO 65360",
      "placement": {
        "lat": 38.528575087767,
        "lon": -93.512014586118,
        "basis": "address-geocode",
        "sourceUrl": "https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?address=116+S+County+Line+Rd%2C+Windsor%2C+MO+65360&benchmark=Public_AR_Current&format=json",
        "checkedAt": "2026-10-13",
        "precisionLabel": "Approximate address-derived location; entrance, parking and ride dropoff unverified"
      },
      "directionsTarget": {
        "kind": "visitor-address",
        "address": "116 S County Line Rd, Windsor, MO 65360"
      },
      "ridesharePolicy": "external-picker",
      "hours": {
        "state": "partial",
        "displayText": "October 17–18, 2026; starts 7 PM nightly. Closing time is unconfirmed."
      },
      "listingExpiresAt": "2026-10-19T05:00:00Z",
      "expiryBasis": "date-only",
      "sourceUrls": [
        "https://www.windsorhauntedhayride.com/",
        "https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?address=116+S+County+Line+Rd%2C+Windsor%2C+MO+65360&benchmark=Public_AR_Current&format=json"
      ],
      "reviewRevision": "MO2026-owner-four-342b5b51-2026-10-13"
    },
    "seasonalVisitNotes": [
      "October 17–18, 2026; starts 7 PM nightly. Closing time is unconfirmed.",
      "Farrington City Park; sponsored by Windsor Holiday Collective.",
      "Location is approximate."
    ]
  },
  {
    "id": "date-night-mo26-mid-america-fright-fest",
    "name": "Mid America Adventure — Fright Fest",
    "address": "4900 Six Flags Rd., Eureka, MO 63025",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Other Halloween / Fall",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://midamericaadventure.enchantedparks.com/fright-fest/",
    "isChain": false,
    "photoKey": "cafe",
    "source": "catalog",
    "activityTypes": [
      "other-halloween-fall"
    ],
    "moodLevel": 2,
    "seasonalAvailability": {
      "status": "confirmed",
      "checkedAt": "2026-10-13",
      "timeZone": "America/Chicago",
      "openNowPolicy": "never",
      "listingExpiresAt": "2026-11-02T03:00:00+00:00",
      "seasonYear": 2026,
      "sourceUrls": [
        "https://midamericaadventure.enchantedparks.com/fright-fest/",
        "https://midamericaadventure.enchantedparks.com/park-info/park-map/",
        "https://midamericaadventure.enchantedparks.com/series/fright-fest/",
        "https://midamericaadventure.enchantedparks.com/park-policies/"
      ],
      "activeFrom": "2026-10-16",
      "activeUntil": "2026-11-01",
      "activeDates": [
        "2026-10-16",
        "2026-10-17",
        "2026-10-18",
        "2026-10-23",
        "2026-10-24",
        "2026-10-25",
        "2026-10-30",
        "2026-10-31",
        "2026-11-01"
      ]
    },
    "seasonalListing": {
      "contract": "ListingCompletenessV1",
      "recordId": "NEW-MID-AMERICA-FRIGHT-FEST",
      "seasonYear": 2026,
      "timeZone": "America/Chicago",
      "visitorAddress": "4900 Six Flags Rd., Eureka, MO 63025",
      "placement": {
        "lat": 38.5160279,
        "lon": -90.6755464,
        "basis": "address-geocode",
        "sourceUrl": "https://midamericaadventure.enchantedparks.com/park-info/park-map/",
        "checkedAt": "2026-10-13",
        "precisionLabel": "Approximate address-derived location; entrance, parking and ride dropoff unverified"
      },
      "directionsTarget": {
        "kind": "visitor-address",
        "address": "4900 Six Flags Rd., Eureka, MO 63025"
      },
      "ridesharePolicy": "external-picker",
      "hours": {
        "state": "verified",
        "displayText": "Fright Fest: October 16–18, 23–25, 30–31 and November 1, 2026. Fridays/Saturdays 6–11 PM; Sundays 6–9 PM."
      },
      "listingExpiresAt": "2026-11-02T03:00:00+00:00",
      "expiryBasis": "exact",
      "sourceUrls": [
        "https://midamericaadventure.enchantedparks.com/fright-fest/",
        "https://midamericaadventure.enchantedparks.com/park-info/park-map/",
        "https://midamericaadventure.enchantedparks.com/series/fright-fest/",
        "https://midamericaadventure.enchantedparks.com/park-policies/"
      ],
      "reviewRevision": "MO2026-owner-four-342b5b51-2026-10-13"
    },
    "seasonalVisitNotes": [
      "Fright Fest: October 16–18, 23–25, 30–31 and November 1, 2026. Fridays/Saturdays 6–11 PM; Sundays 6–9 PM.",
      "Valid park admission required; haunted attractions require a separate wristband or maze pass.",
      "Ages 16 and under need a chaperone age 21+ with government photo ID (up to 6 minors). The chaperone must enter with them, stay in the park and remain reachable throughout the visit.",
      "Ages 17+ should bring government photo ID to verify age. Costumes only for ages 12 and under; no costume masks. Costume makeup may cover no more than half the face. Masks for reducing the spread of germs are permitted.",
      "All bags are screened; weapons prohibited. Location is approximate."
    ]
  }
];

export const MISSOURI_2026_OWNER_EVIDENCE_CATALOG = MISSOURI_2026_OWNER_EVIDENCE_LISTINGS
  .map(seasonalListingToPlace)
  .filter((place): place is DateNightPlace => Boolean(place));
