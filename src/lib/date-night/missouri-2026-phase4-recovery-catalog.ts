import type { DateNightPlace } from "./types";
import { seasonalListingToPlace, type SeasonalListing } from "./listing";

/** Exact seven-record recovery input 827eb679, independently cleared before gate 0fcb454c.
 * Six additions and the existing Werehouse identity amendment. Approximate placement
 * never supplies arrival precision or Open Now. Branson alone retains its reviewed
 * late-fall lifecycle; Fun Time uses an editorial cutoff without invented dates.
 */
export const MISSOURI_2026_PHASE4_RECOVERY_LISTINGS:
  (Omit<DateNightPlace, "lat" | "lon"> & { seasonalListing: SeasonalListing })[] = [
  {
    "id": "date-night-mo26-phase4-wolfmans-house-of-screams",
    "name": "Wolfmans House Of Screams",
    "address": "26267 King Lane, Carl Junction, MO 64834",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Haunted House",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://www.facebook.com/WolfmansHouseOfScreams/",
    "isChain": false,
    "photoKey": "cafe",
    "source": "catalog",
    "activityTypes": [
      "haunted-house"
    ],
    "moodLevel": 3,
    "seasonalAvailability": {
      "status": "confirmed",
      "checkedAt": "2026-10-10",
      "timeZone": "America/Chicago",
      "openNowPolicy": "never",
      "listingExpiresAt": "2026-11-01T00:00:00-05:00",
      "seasonYear": 2026,
      "sourceUrls": [
        "https://www.facebook.com/WolfmansHouseOfScreams/",
        "https://www.missourihauntedhouses.com/halloween/wolfmans-housescreams-mo.html",
        "https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?address=26267+King+Lane%2C+Carl+Junction%2C+MO+64834&benchmark=Public_AR_Current&format=json"
      ],
      "activeFrom": "2026-10-03",
      "activeUntil": "2026-10-31",
      "activeDates": [
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
      "recordId": "MO26-006",
      "seasonYear": 2026,
      "timeZone": "America/Chicago",
      "visitorAddress": "26267 King Lane, Carl Junction, MO 64834",
      "placement": {
        "lat": 37.203626664776,
        "lon": -94.531270552631,
        "basis": "address-geocode",
        "sourceUrl": "https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?address=26267+King+Lane%2C+Carl+Junction%2C+MO+64834&benchmark=Public_AR_Current&format=json",
        "checkedAt": "2026-10-10",
        "precisionLabel": "Approximate site/address placement only; not a verified entrance, parking or rideshare dropoff"
      },
      "directionsTarget": {
        "kind": "visitor-address",
        "address": "26267 King Lane, Carl Junction, MO 64834"
      },
      "hours": {
        "state": "partial",
        "displayText": "Listed opening time is 7 p.m.; closing time is unconfirmed."
      },
      "listingExpiresAt": "2026-11-01T00:00:00-05:00",
      "expiryBasis": "date-only",
      "sourceUrls": [
        "https://www.facebook.com/WolfmansHouseOfScreams/",
        "https://www.missourihauntedhouses.com/halloween/wolfmans-housescreams-mo.html",
        "https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?address=26267+King+Lane%2C+Carl+Junction%2C+MO+64834&benchmark=Public_AR_Current&format=json"
      ],
      "reviewRevision": "MO2026-phase4-recovery-827eb679-2026-10-10"
    },
    "seasonalVisitNotes": [
      "Listed 2026 dates: October 3, 9–10, 16–17, 23–24 and 30–31. Listed opening time is 7 p.m.; check the operator for current hours before traveling. Location is approximate."
    ]
  },
  {
    "id": "date-night-werehouse-joplin",
    "name": "The Werehouse",
    "address": "3819 E 20th Street, Joplin, MO 64801",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Haunted House",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": "+1 417-396-6094",
    "website": "https://thewerehouse.net/",
    "isChain": false,
    "photoKey": "cafe",
    "source": "catalog",
    "activityTypes": [
      "haunted-house"
    ],
    "moodLevel": 3,
    "seasonalAvailability": {
      "status": "confirmed",
      "checkedAt": "2026-10-10",
      "timeZone": "America/Chicago",
      "openNowPolicy": "never",
      "listingExpiresAt": "2026-11-01T00:00:00-05:00",
      "seasonYear": 2026,
      "sourceUrls": [
        "https://thewerehouse.net/",
        "https://www.missourihauntedhouses.com/halloween/haunted-house-joplin.html",
        "https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?address=3819+E+20th+Street%2C+Joplin%2C+MO+64801&benchmark=Public_AR_Current&format=json"
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
        "2026-10-30",
        "2026-10-31"
      ]
    },
    "seasonalListing": {
      "contract": "ListingCompletenessV1",
      "recordId": "MO26-004",
      "seasonYear": 2026,
      "timeZone": "America/Chicago",
      "visitorAddress": "3819 E 20th Street, Joplin, MO 64801",
      "placement": {
        "lat": 37.069463315708,
        "lon": -94.464636904963,
        "basis": "address-geocode",
        "sourceUrl": "https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?address=3819+E+20th+Street%2C+Joplin%2C+MO+64801&benchmark=Public_AR_Current&format=json",
        "checkedAt": "2026-10-10",
        "precisionLabel": "Approximate site/address placement only; not a verified entrance, parking or rideshare dropoff"
      },
      "directionsTarget": {
        "kind": "visitor-address",
        "address": "3819 E 20th Street, Joplin, MO 64801"
      },
      "hours": {
        "state": "partial",
        "displayText": "Listed Fridays and Saturdays, 7 p.m.–midnight."
      },
      "listingExpiresAt": "2026-11-01T00:00:00-05:00",
      "expiryBasis": "date-only",
      "sourceUrls": [
        "https://thewerehouse.net/",
        "https://www.missourihauntedhouses.com/halloween/haunted-house-joplin.html",
        "https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?address=3819+E+20th+Street%2C+Joplin%2C+MO+64801&benchmark=Public_AR_Current&format=json"
      ],
      "reviewRevision": "MO2026-phase4-recovery-827eb679-2026-10-10"
    },
    "seasonalVisitNotes": [
      "Listed Fridays and Saturdays, September 25–October 31, 2026, from 7 p.m. to midnight. Check the operator for updates before traveling. Location is approximate."
    ]
  },
  {
    "id": "date-night-mo26-phase4-fearstone-forest",
    "name": "Fearstone Forest Haunted Trail",
    "address": "85 Benne Blvd, Camdenton, MO 65020",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Haunted House",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://www.fearstoneforest.com/",
    "isChain": false,
    "photoKey": "cafe",
    "source": "catalog",
    "activityTypes": [
      "haunted-house"
    ],
    "moodLevel": 3,
    "seasonalAvailability": {
      "status": "confirmed",
      "checkedAt": "2026-10-10",
      "timeZone": "America/Chicago",
      "openNowPolicy": "never",
      "listingExpiresAt": "2026-10-31T00:00:00-05:00",
      "seasonYear": 2026,
      "sourceUrls": [
        "https://www.fearstoneforest.com/",
        "https://www.fearstoneforest.com/faq",
        "https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?address=85+Benne+Blvd%2C+Camdenton%2C+MO+65020&benchmark=Public_AR_Current&format=json"
      ],
      "activeFrom": "2026-10-02",
      "activeUntil": "2026-10-30",
      "activeDates": [
        "2026-10-02",
        "2026-10-03",
        "2026-10-09",
        "2026-10-10",
        "2026-10-16",
        "2026-10-17",
        "2026-10-23",
        "2026-10-24",
        "2026-10-30"
      ]
    },
    "seasonalListing": {
      "contract": "ListingCompletenessV1",
      "recordId": "DELTA3-FEARSTONE",
      "seasonYear": 2026,
      "timeZone": "America/Chicago",
      "visitorAddress": "85 Benne Blvd, Camdenton, MO 65020",
      "placement": {
        "lat": 38.016075473125,
        "lon": -92.758610359304,
        "basis": "address-geocode",
        "sourceUrl": "https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?address=85+Benne+Blvd%2C+Camdenton%2C+MO+65020&benchmark=Public_AR_Current&format=json",
        "checkedAt": "2026-10-10",
        "precisionLabel": "Approximate site/address placement only; not a verified entrance, parking or rideshare dropoff"
      },
      "directionsTarget": {
        "kind": "visitor-address",
        "address": "85 Benne Blvd, Camdenton, MO 65020"
      },
      "hours": {
        "state": "unknown"
      },
      "listingExpiresAt": "2026-10-31T00:00:00-05:00",
      "expiryBasis": "date-only",
      "sourceUrls": [
        "https://www.fearstoneforest.com/",
        "https://www.fearstoneforest.com/faq",
        "https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?address=85+Benne+Blvd%2C+Camdenton%2C+MO+65020&benchmark=Public_AR_Current&format=json"
      ],
      "reviewRevision": "MO2026-phase4-recovery-827eb679-2026-10-10"
    },
    "seasonalVisitNotes": [
      "October 17 is adults 18+ only with valid photo ID. A waiver is required.",
      "On ordinary haunt nights, the operator recommends ages 12+. Children under 12 must have a parent or guardian and be able to walk independently.",
      "The operator FAQ says the attraction is not “handicap accessible.” Check whether the trail is suitable for your access needs before visiting.",
      "Outdoor haunted trail; lightning may delay or cancel the night. Check current operator hours and weather updates before travel.",
      "Separate no-scare Kids Night October 31, 4–6 p.m., is not included in this haunted-trail schedule.",
      "Approximate location; Directions use 85 Benne Blvd, not the organizer’s Highway 5 address."
    ]
  },
  {
    "id": "date-night-mo26-phase4-fun-time-farms",
    "name": "Fun Time Farms Corn MAiZE",
    "address": "11050 NE 201 Road, Lowry City, MO 64763",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Corn Maze / Haunted Attraction",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://www.facebook.com/FunTimeFarms/posts/we-are-one-month-out-from-our-opening-day-heres-our-updated-price-list-for-the-2/1544670360793681/",
    "isChain": false,
    "photoKey": "cafe",
    "source": "catalog",
    "activityTypes": [
      "corn-maze",
      "haunted-house"
    ],
    "moodLevel": 3,
    "seasonalAvailability": {
      "status": "unconfirmed",
      "checkedAt": "2026-10-10",
      "timeZone": "America/Chicago",
      "openNowPolicy": "never",
      "listingExpiresAt": "2026-11-01T00:00:00-05:00",
      "seasonYear": 2026,
      "sourceUrls": [
        "https://www.facebook.com/FunTimeFarms/posts/we-are-one-month-out-from-our-opening-day-heres-our-updated-price-list-for-the-2/1544670360793681/",
        "https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?address=11050+NE+201+Road%2C+Lowry+City%2C+MO+64763&benchmark=Public_AR_Current&format=json"
      ]
    },
    "seasonalListing": {
      "contract": "ListingCompletenessV1",
      "recordId": "DELTA3-FUN-TIME",
      "seasonYear": 2026,
      "timeZone": "America/Chicago",
      "visitorAddress": "11050 NE 201 Road, Lowry City, MO 64763",
      "placement": {
        "lat": 38.183365966646,
        "lon": -93.739844249626,
        "basis": "address-geocode",
        "sourceUrl": "https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?address=11050+NE+201+Road%2C+Lowry+City%2C+MO+64763&benchmark=Public_AR_Current&format=json",
        "checkedAt": "2026-10-10",
        "precisionLabel": "Approximate site/address placement only; not a verified entrance, parking or rideshare dropoff"
      },
      "directionsTarget": {
        "kind": "visitor-address",
        "address": "11050 NE 201 Road, Lowry City, MO 64763"
      },
      "hours": {
        "state": "unknown"
      },
      "listingExpiresAt": "2026-11-01T00:00:00-05:00",
      "expiryBasis": "editorial",
      "sourceUrls": [
        "https://www.facebook.com/FunTimeFarms/posts/we-are-one-month-out-from-our-opening-day-heres-our-updated-price-list-for-the-2/1544670360793681/",
        "https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?address=11050+NE+201+Road%2C+Lowry+City%2C+MO+64763&benchmark=Public_AR_Current&format=json"
      ],
      "reviewRevision": "MO2026-phase4-recovery-827eb679-2026-10-10"
    },
    "seasonalVisitNotes": [
      "2026 season advertised by the operator; exact dates and hours are unverified. Check current updates before travel.",
      "Approximate location; Directions use the listed visitor address."
    ]
  },
  {
    "id": "date-night-mo26-phase4-carolyns-pumpkin-patch",
    "name": "Carolyn’s Pumpkin Patch",
    "address": "17607 NE 52nd Street, Liberty, MO 64068",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Pumpkin Patch",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://carolynspumpkinpatch.com/",
    "isChain": false,
    "photoKey": "cafe",
    "source": "catalog",
    "activityTypes": [
      "pumpkin-patch"
    ],
    "moodLevel": 2,
    "seasonalAvailability": {
      "status": "confirmed",
      "checkedAt": "2026-10-10",
      "timeZone": "America/Chicago",
      "openNowPolicy": "never",
      "listingExpiresAt": "2026-11-01T00:00:00-05:00",
      "seasonYear": 2026,
      "sourceUrls": [
        "https://carolynspumpkinpatch.com/",
        "https://carolynspumpkinpatch.com/hours-and-pricing/",
        "https://carolynspumpkinpatch.com/frequently-asked-questions/",
        "https://carolynspumpkinpatch.com/location-and-directions/",
        "https://goo.gl/maps/pKngpKRpDZhtK55M9"
      ],
      "activeFrom": "2026-09-19",
      "activeUntil": "2026-10-31",
      "activeDates": [
        "2026-09-19",
        "2026-09-20",
        "2026-09-21",
        "2026-09-24",
        "2026-09-25",
        "2026-09-26",
        "2026-09-27",
        "2026-09-28",
        "2026-10-01",
        "2026-10-02",
        "2026-10-03",
        "2026-10-04",
        "2026-10-05",
        "2026-10-08",
        "2026-10-09",
        "2026-10-10",
        "2026-10-11",
        "2026-10-12",
        "2026-10-15",
        "2026-10-16",
        "2026-10-17",
        "2026-10-18",
        "2026-10-19",
        "2026-10-22",
        "2026-10-23",
        "2026-10-24",
        "2026-10-25",
        "2026-10-26",
        "2026-10-29",
        "2026-10-30",
        "2026-10-31"
      ]
    },
    "seasonalListing": {
      "contract": "ListingCompletenessV1",
      "recordId": "MO26-055",
      "seasonYear": 2026,
      "timeZone": "America/Chicago",
      "visitorAddress": "17607 NE 52nd Street, Liberty, MO 64068",
      "placement": {
        "lat": 39.1857337,
        "lon": -94.3697357,
        "basis": "operator-site",
        "sourceUrl": "https://goo.gl/maps/pKngpKRpDZhtK55M9",
        "checkedAt": "2026-10-10",
        "precisionLabel": "Approximate site/address placement only; not a verified entrance, parking or rideshare dropoff"
      },
      "directionsTarget": {
        "kind": "visitor-address",
        "address": "17607 NE 52nd Street, Liberty, MO 64068"
      },
      "hours": {
        "state": "partial",
        "displayText": "Thursday–Monday. Check daily hours; entrance stops one hour before closing."
      },
      "listingExpiresAt": "2026-11-01T00:00:00-05:00",
      "expiryBasis": "date-only",
      "sourceUrls": [
        "https://carolynspumpkinpatch.com/",
        "https://carolynspumpkinpatch.com/hours-and-pricing/",
        "https://carolynspumpkinpatch.com/frequently-asked-questions/",
        "https://carolynspumpkinpatch.com/location-and-directions/",
        "https://goo.gl/maps/pKngpKRpDZhtK55M9"
      ],
      "reviewRevision": "MO2026-phase4-recovery-827eb679-2026-10-10"
    },
    "seasonalVisitNotes": [
      "17607 NE 52nd Street, Liberty, MO 64068",
      "Pumpkin Patch",
      "[\"Pumpkin patch\", \"wagon ride\"]",
      "Explicit 2026 season September 19 through October 31",
      "Thursday through Monday within September 19–October 31, 2026",
      "{\"state\": \"partial\", \"display\": \"Thursday–Monday. Check daily hours; entrance stops one hour before closing.\", \"machine_last_admission\": null}",
      "[\"Tickets use one-hour check-in windows.\", \"No outside food/alcohol; medical/dietary access questions should go to venue.\", \"No pets; operator permits outside service animals.\", \"Liberty Corn Maze next door is distinct; pumpkin listing does not imply corn-maze access.\"]",
      "816-781-9196 (text line)",
      "{\"at\": \"2026-11-01T00:00:00-05:00\", \"basis\": \"date-only\", \"derivation\": \"Conservative midnight after the final October 31 date, America/Chicago. This is retention expiry, not an asserted operator closing time. DST has not ended at this midnight.\", \"at_utc\": \"2026-11-01T05:00:00Z\"}"
    ]
  },
  {
    "id": "date-night-mo26-phase4-terror-on-route-66",
    "name": "Terror on Route 66",
    "address": "1143 North Service Road West, Sullivan, MO 63080",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Haunted House",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://scarestl.com/",
    "isChain": false,
    "photoKey": "cafe",
    "source": "catalog",
    "activityTypes": [
      "haunted-house"
    ],
    "moodLevel": 3,
    "seasonalAvailability": {
      "status": "unconfirmed",
      "checkedAt": "2026-10-10",
      "timeZone": "America/Chicago",
      "openNowPolicy": "never",
      "listingExpiresAt": "2026-11-02T00:00:00-06:00",
      "seasonYear": 2026,
      "sourceUrls": [
        "https://scarestl.com/",
        "https://www.simpletix.com/e/2026-daily-tickets-terror-on-route-66-tickets-288565",
        "https://www.google.com/maps/search/?api=1&query=Terror+On+Route+66+1143+North+Service+Road+West+Sullivan+MO"
      ],
      "activeUntil": "2026-11-01"
    },
    "seasonalListing": {
      "contract": "ListingCompletenessV1",
      "recordId": "DELTA2-TERROR66",
      "seasonYear": 2026,
      "timeZone": "America/Chicago",
      "visitorAddress": "1143 North Service Road West, Sullivan, MO 63080",
      "placement": {
        "lat": 38.2432122,
        "lon": -91.1408597,
        "basis": "operator-site",
        "sourceUrl": "https://www.google.com/maps/search/?api=1&query=Terror+On+Route+66+1143+North+Service+Road+West+Sullivan+MO",
        "checkedAt": "2026-10-10",
        "precisionLabel": "Approximate site/address placement only; not a verified entrance, parking or rideshare dropoff"
      },
      "directionsTarget": {
        "kind": "visitor-address",
        "address": "1143 North Service Road West, Sullivan, MO 63080"
      },
      "hours": {
        "state": "unknown"
      },
      "listingExpiresAt": "2026-11-02T00:00:00-06:00",
      "expiryBasis": "date-only",
      "sourceUrls": [
        "https://scarestl.com/",
        "https://www.simpletix.com/e/2026-daily-tickets-terror-on-route-66-tickets-288565",
        "https://www.google.com/maps/search/?api=1&query=Terror+On+Route+66+1143+North+Service+Road+West+Sullivan+MO"
      ],
      "reviewRevision": "MO2026-phase4-recovery-827eb679-2026-10-10"
    },
    "seasonalVisitNotes": [
      "Haunted House",
      "Explicit 2026 Halloween season ending November 1; individual opening dates and hours are not asserted.",
      "{\"state\": \"unknown\"}",
      "[\"All participants must complete a waiver. General admission is no-touch.\", \"Optional Interactive Touch Pass is ages 10+. Minors under 18 must be accompanied by an adult with valid ID.\", \"A valid ID is required at check-in for every Interactive Touch Pass and Rated R Pass participant.\", \"Rated R Pass is 18+ and includes full contact, adult language and dark humor. Rated R participants cannot enter with guests who do not hold Rated R passes. General admission and Interactive Touch guests may enter together.\"]",
      "1143 North Service Road West, Sullivan, MO 63080",
      "{\"at\": \"2026-11-02T00:00:00-06:00\", \"basis\": \"date-only\", \"at_utc\": \"2026-11-02T06:00:00Z\", \"derivation\": \"Conservative midnight after the stated final November 1, 2026 season date, America/Chicago. DST ended earlier November 1, so this midnight is CST UTC−06:00. Not an operator closing-time assertion.\"}"
    ]
  },
  {
    "id": "date-night-mo26-phase4-field-of-screams-branson",
    "name": "Field of Screams Branson",
    "address": "1000 Pat Nash Drive, Branson, MO 65616",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Haunted House",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://www.fieldofscreamsbranson.com/home-1",
    "isChain": false,
    "photoKey": "cafe",
    "source": "catalog",
    "activityTypes": [
      "haunted-house"
    ],
    "moodLevel": 3,
    "seasonalAvailability": {
      "status": "confirmed",
      "checkedAt": "2026-10-10",
      "timeZone": "America/Chicago",
      "openNowPolicy": "never",
      "listingExpiresAt": "2026-11-15T00:00:00-06:00",
      "seasonYear": 2026,
      "sourceUrls": [
        "https://www.fieldofscreamsbranson.com/home-1",
        "https://www.fieldofscreamsbranson.com/home-1-5-5",
        "https://www.explorebranson.com/events-branson/",
        "https://www.explorebranson.com/",
        "https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?address=1000+Pat+Nash+Dr%2C+Branson%2C+MO+65616&benchmark=Public_AR_Current&format=json"
      ],
      "activeFrom": "2026-10-10",
      "activeUntil": "2026-11-14",
      "activeDates": [
        "2026-10-10",
        "2026-10-11",
        "2026-10-15",
        "2026-10-16",
        "2026-10-17",
        "2026-10-18",
        "2026-10-22",
        "2026-10-23",
        "2026-10-24",
        "2026-10-25",
        "2026-10-29",
        "2026-10-30",
        "2026-10-31",
        "2026-11-06",
        "2026-11-07",
        "2026-11-13",
        "2026-11-14"
      ]
    },
    "seasonalListing": {
      "contract": "ListingCompletenessV1",
      "recordId": "DELTA6-BRANSON-FIELD",
      "seasonYear": 2026,
      "timeZone": "America/Chicago",
      "visitorAddress": "1000 Pat Nash Drive, Branson, MO 65616",
      "placement": {
        "lat": 36.645101695991,
        "lon": -93.284825773276,
        "basis": "address-geocode",
        "sourceUrl": "https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?address=1000+Pat+Nash+Dr%2C+Branson%2C+MO+65616&benchmark=Public_AR_Current&format=json",
        "checkedAt": "2026-10-10",
        "precisionLabel": "Approximate site/address placement only; not a verified entrance, parking or rideshare dropoff"
      },
      "directionsTarget": {
        "kind": "visitor-address",
        "address": "1000 Pat Nash Drive, Branson, MO 65616"
      },
      "hours": {
        "state": "partial",
        "displayText": "Posted October hours: Thursday/Sunday 7–11 p.m.; Friday/Saturday 7 p.m.–midnight; box office 6 p.m. November crossover hours are unverified."
      },
      "listingExpiresAt": "2026-11-15T00:00:00-06:00",
      "expiryBasis": "date-only",
      "sourceUrls": [
        "https://www.fieldofscreamsbranson.com/home-1",
        "https://www.fieldofscreamsbranson.com/home-1-5-5",
        "https://www.explorebranson.com/events-branson/",
        "https://www.explorebranson.com/",
        "https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?address=1000+Pat+Nash+Dr%2C+Branson%2C+MO+65616&benchmark=Public_AR_Current&format=json"
      ],
      "reviewRevision": "MO2026-phase4-recovery-827eb679-2026-10-10",
      "visibility": "listing-lifecycle"
    },
    "seasonalVisitNotes": [
      "Listed nights, October 10–November 14, 2026; check operator updates before travel.",
      "Indoor haunted attraction at Ballparks of America, distinct from Field of Screams Nixa.",
      "November 6–7 and 13–14 are a Halloween/Christmas crossover event; crossover hours are unverified.",
      "The operator describes intense audio, live actors, fog and strobes.",
      "Approximate location; Directions use 1000 Pat Nash Drive, Branson, MO 65616."
    ]
  }
];

export const MISSOURI_2026_PHASE4_RECOVERY_CATALOG =
  MISSOURI_2026_PHASE4_RECOVERY_LISTINGS
    .map(seasonalListingToPlace)
    .filter((place): place is DateNightPlace => Boolean(place));
