import type { DateNightPlace } from "./types";
import { seasonalListingToPlace, type SeasonalListing } from "./listing";

/** Only the five explicitly authorized, independently data-cleared R2 projections.
 * The registry can retain factual address-only records; the adapter excludes those
 * from radius-based runtime discovery. Reviewed source identities live in the audit.
 */
export const MISSOURI_2026_V1_LISTINGS: (Omit<DateNightPlace, "lat" | "lon"> & { seasonalListing: SeasonalListing })[] = [
  {
    "id": "date-night-myers-inn-carthage",
    "name": "RIP at Myer’s Inn",
    "address": "529 West Airport Drive, Carthage, MO 64836",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Haunted House",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://www.myersinnhaunt.com/",
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
      "checkedAt": "2026-10-08",
      "revalidateAfter": "2026-10-14",
      "timeZone": "America/Chicago",
      "openNowPolicy": "never",
      "listingExpiresAt": "2026-11-01T00:00:00-05:00",
      "seasonYear": 2026,
      "sourceUrls": [
        "https://www.myersinnhaunt.com/",
        "https://www.myersinnhaunt.com/location"
      ],
      "note": "ListingCompletenessV1; source-supported display-only schedule. No machine opening intervals.",
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
      "timeZone": "America/Chicago",
      "recordId": "MO26-003",
      "seasonYear": 2026,
      "visitorAddress": "529 West Airport Drive, Carthage, MO 64836",
      "placement": {
        "lat": 37.147546859607,
        "lon": -94.317780429306,
        "basis": "address-geocode",
        "sourceUrl": "https://geocoding.geo.census.gov/geocoder/geographies/onelineaddress?address=529+West+Airport+Drive%2C+Carthage%2C+MO+64836&benchmark=Public_AR_Current&vintage=Current_Current&format=json",
        "checkedAt": "2026-10-08T02:33:27.364574+00:00",
        "precisionLabel": "Approximate address location"
      },
      "directionsTarget": {
        "kind": "visitor-address",
        "address": "529 West Airport Drive, Carthage, MO 64836"
      },
      "hours": {
        "state": "partial",
        "displayText": "Fridays and Saturdays in October 2026: doors open 19:00; last ticket sold at 00:00 next day. Final exit/closing time unspecified."
      },
      "listingExpiresAt": "2026-11-01T00:00:00-05:00",
      "expiryBasis": "date-only",
      "sourceUrls": [
        "https://www.myersinnhaunt.com/",
        "https://www.myersinnhaunt.com/location"
      ],
      "reviewRevision": "MO2026-Phase2-R2-76896ea4"
    },
    "seasonalVisitNotes": [
      "2026 season: 2026-10-02 through 2026-10-31. America/Chicago.",
      "Listed operating dates: 2026-10-02, 2026-10-03, 2026-10-09, 2026-10-10, 2026-10-16, 2026-10-17, 2026-10-23, 2026-10-24, 2026-10-30, 2026-10-31.",
      "Fridays and Saturdays in October 2026: doors open 19:00; last ticket sold at 00:00 next day. Final exit/closing time unspecified.",
      "$20; three-location combo $60 does not make the three locations one venue.",
      "Start/end expanded from explicit October 2026 Friday/Saturday recurrence; closing after final ticket is unspecified.",
      "Listing removed at the next local midnight after October 31 as a date-only retention boundary, not a closing-time or final-exit claim. Later overnight walks may continue after the listing is hidden.",
      "Approximate address-derived placement for map and distance only. Directions use the supported visitor address, not an entrance or parking coordinate."
    ]
  },
  {
    "id": "date-night-mo26-010-aftermath",
    "name": "The Aftermath Haunted Attraction",
    "address": "2520 Jaguar Road, Joplin, MO 64804",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Haunted House",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://spooktacularstudios.com/",
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
      "checkedAt": "2026-10-08",
      "revalidateAfter": "2026-10-14",
      "timeZone": "America/Chicago",
      "openNowPolicy": "never",
      "listingExpiresAt": "2026-11-01T00:00:00-05:00",
      "seasonYear": 2026,
      "sourceUrls": [
        "https://spooktacularstudios.com/",
        "https://spooktacularstudios.com/faq/"
      ],
      "note": "ListingCompletenessV1; source-supported display-only schedule. No machine opening intervals.",
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
      "timeZone": "America/Chicago",
      "recordId": "MO26-010",
      "seasonYear": 2026,
      "visitorAddress": "2520 Jaguar Road, Joplin, MO 64804",
      "placement": {
        "lat": 37.032013052845,
        "lon": -94.424739897714,
        "basis": "address-geocode",
        "sourceUrl": "https://geocoding.geo.census.gov/geocoder/geographies/onelineaddress?address=2520+Jaguar+Road%2C+Joplin%2C+MO+64804&benchmark=Public_AR_Current&vintage=Current_Current&format=json",
        "checkedAt": "2026-10-08T02:33:27.365147+00:00",
        "precisionLabel": "Approximate address location"
      },
      "directionsTarget": {
        "kind": "visitor-address",
        "address": "2520 Jaguar Road, Joplin, MO 64804"
      },
      "hours": {
        "state": "partial",
        "displayText": "On the 12 listed 2026 nights: gates and ticket booth 18:00; first walk-through 19:30; last ticket sale 23:30; last walk-through 00:30 the following day. Final exit/closing is not established. FAQ also gives generic 18:00–00:00 hours and allows later operation; do not convert this into a hard close."
      },
      "listingExpiresAt": "2026-11-01T00:00:00-05:00",
      "expiryBasis": "date-only",
      "sourceUrls": [
        "https://spooktacularstudios.com/",
        "https://spooktacularstudios.com/faq/"
      ],
      "reviewRevision": "MO2026-Phase2-R2-76896ea4"
    },
    "seasonalVisitNotes": [
      "2026 season: 2026-09-25 through 2026-10-31. America/Chicago.",
      "Listed operating dates: 2026-09-25, 2026-09-26, 2026-10-02, 2026-10-03, 2026-10-09, 2026-10-10, 2026-10-16, 2026-10-17, 2026-10-23, 2026-10-24, 2026-10-30, 2026-10-31.",
      "On the 12 listed 2026 nights: gates and ticket booth 18:00; first walk-through 19:30; last ticket sale 23:30; last walk-through 00:30 the following day. Final exit/closing is not established. FAQ also gives generic 18:00–00:00 hours and allows later operation; do not convert this into a hard close.",
      "$20 per attraction; both-haunts offer $30. Price statement is operator advertised base price, not verified final checkout total.",
      "Recommended for adults, older teens and mature audiences; not recommended for young children. No strict minimum age is stated, and younger children may attend at parental discretion. Carrying babies or infants is prohibited; no special child pricing.",
      "Operator FAQ says the attractions are not wheelchair accessible.",
      "Operator FAQ: all sales final/no refunds. If operator closes a purchased night, tickets honored on another open night.",
      "Same Spooktacular Studios operator, two different attractions at separate addresses. Keep separate; combo is not a third venue.",
      "Operator says light rain operation is possible; heavy rain or lightning can close the attractions. Check operator updates close to visit. No current cancellation was established in reviewed sources; absence of notice is not live availability.",
      "FAQ generic midnight operating-hours text must not override the explicit 00:30 last walk.",
      "The event-page 18:00–23:30 wrapper describes the gate/sale window; it does not establish final exit.",
      "No costumes. The operator warns of intense strobes and does not recommend attendance for people with epilepsy, pregnancy, heart issues, or conditions affecting breathing, vision or walking; flashing-light accommodations are not guaranteed. Operator suitability recommendations; not a medical prohibition. Source: https://spooktacularstudios.com/faq/",
      "Listing removed at the next local midnight after October 31 as a date-only retention boundary, not a closing-time or final-exit claim. Later overnight walks may continue after the listing is hidden.",
      "Approximate address-derived placement for map and distance only. Directions use the supported visitor address, not an entrance or parking coordinate."
    ]
  },
  {
    "id": "date-night-mo26-011-beyond-outer-limits",
    "name": "Beyond The Outer Limits",
    "address": "2163 Jaguar Road, Joplin, MO 64804",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Haunted House",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://spooktacularstudios.com/",
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
      "checkedAt": "2026-10-08",
      "revalidateAfter": "2026-10-14",
      "timeZone": "America/Chicago",
      "openNowPolicy": "never",
      "listingExpiresAt": "2026-11-01T00:00:00-05:00",
      "seasonYear": 2026,
      "sourceUrls": [
        "https://spooktacularstudios.com/",
        "https://spooktacularstudios.com/faq/"
      ],
      "note": "ListingCompletenessV1; source-supported display-only schedule. No machine opening intervals.",
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
      "timeZone": "America/Chicago",
      "recordId": "MO26-011",
      "seasonYear": 2026,
      "visitorAddress": "2163 Jaguar Road, Joplin, MO 64804",
      "placement": {
        "lat": 37.03315620173,
        "lon": -94.424538484412,
        "basis": "address-geocode",
        "sourceUrl": "https://geocoding.geo.census.gov/geocoder/geographies/onelineaddress?address=2163+Jaguar+Road%2C+Joplin%2C+MO+64804&benchmark=Public_AR_Current&vintage=Current_Current&format=json",
        "checkedAt": "2026-10-08T02:33:27.365543+00:00",
        "precisionLabel": "Approximate address location"
      },
      "directionsTarget": {
        "kind": "visitor-address",
        "address": "2163 Jaguar Road, Joplin, MO 64804"
      },
      "hours": {
        "state": "partial",
        "displayText": "On the 12 listed 2026 nights: gates and ticket booth 18:00; first walk-through 19:30; last ticket sale 23:30; last walk-through 00:30 the following day. Final exit/closing is not established. FAQ also gives generic 18:00–00:00 hours and allows later operation; do not convert this into a hard close."
      },
      "listingExpiresAt": "2026-11-01T00:00:00-05:00",
      "expiryBasis": "date-only",
      "sourceUrls": [
        "https://spooktacularstudios.com/",
        "https://spooktacularstudios.com/faq/"
      ],
      "reviewRevision": "MO2026-Phase2-R2-76896ea4"
    },
    "seasonalVisitNotes": [
      "2026 season: 2026-09-25 through 2026-10-31. America/Chicago.",
      "Listed operating dates: 2026-09-25, 2026-09-26, 2026-10-02, 2026-10-03, 2026-10-09, 2026-10-10, 2026-10-16, 2026-10-17, 2026-10-23, 2026-10-24, 2026-10-30, 2026-10-31.",
      "On the 12 listed 2026 nights: gates and ticket booth 18:00; first walk-through 19:30; last ticket sale 23:30; last walk-through 00:30 the following day. Final exit/closing is not established. FAQ also gives generic 18:00–00:00 hours and allows later operation; do not convert this into a hard close.",
      "$20 per attraction; both-haunts offer $30. Price statement is operator advertised base price, not verified final checkout total.",
      "Recommended for adults, older teens and mature audiences; not recommended for young children. No strict minimum age is stated, and younger children may attend at parental discretion. Carrying babies or infants is prohibited; no special child pricing.",
      "Operator FAQ says the attractions are not wheelchair accessible.",
      "Operator FAQ: all sales final/no refunds. If operator closes a purchased night, tickets honored on another open night.",
      "Same Spooktacular Studios operator, two different attractions at separate addresses. Keep separate; combo is not a third venue.",
      "Operator says light rain operation is possible; heavy rain or lightning can close the attractions. Check operator updates close to visit. No current cancellation was established in reviewed sources; absence of notice is not live availability.",
      "FAQ generic midnight operating-hours text must not override the explicit 00:30 last walk.",
      "The event-page 18:00–23:30 wrapper describes the gate/sale window; it does not establish final exit.",
      "Beyond event-page organizer block uses 417-312-7988, while the same page venue block, live site header and delegated ticket pages use 417-317-7988. Retain the corroborated venue phone; do not silently use organizer typo.",
      "No costumes. The operator warns of intense strobes and does not recommend attendance for people with epilepsy, pregnancy, heart issues, or conditions affecting breathing, vision or walking; flashing-light accommodations are not guaranteed. Operator suitability recommendations; not a medical prohibition. Source: https://spooktacularstudios.com/faq/",
      "Listing removed at the next local midnight after October 31 as a date-only retention boundary, not a closing-time or final-exit claim. Later overnight walks may continue after the listing is hidden.",
      "Approximate address-derived placement for map and distance only. Directions use the supported visitor address, not an entrance or parking coordinate."
    ]
  },
  {
    "id": "date-night-mo26-029-campbells",
    "name": "Campbell’s Maze Daze & Pumpkin Patch",
    "address": "177 Carob Road, Clever, MO 65631",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Haunted House / Haunted Attraction / Corn Maze / Pumpkin Patch",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://www.campbellsmazedaze.com/",
    "isChain": false,
    "photoKey": "cafe",
    "source": "catalog",
    "activityTypes": [
      "haunted-house",
      "corn-maze",
      "pumpkin-patch"
    ],
    "moodLevel": 3,
    "seasonalAvailability": {
      "status": "confirmed",
      "activeFrom": "2026-09-26",
      "activeUntil": "2026-10-31",
      "checkedAt": "2026-10-08",
      "revalidateAfter": "2026-10-14",
      "timeZone": "America/Chicago",
      "openNowPolicy": "never",
      "listingExpiresAt": "2026-10-31T23:00:00-05:00",
      "seasonYear": 2026,
      "sourceUrls": [
        "https://www.campbellsmazedaze.com/",
        "https://www.campbellsmazedaze.com/general-admission"
      ],
      "note": "ListingCompletenessV1; source-supported display-only schedule. No machine opening intervals.",
      "endsAt": "2026-10-31T23:00:00-05:00"
    },
    "seasonalListing": {
      "contract": "ListingCompletenessV1",
      "timeZone": "America/Chicago",
      "recordId": "MO26-029",
      "seasonYear": 2026,
      "visitorAddress": "177 Carob Road, Clever, MO 65631",
      "placement": {
        "lat": 36.9937383,
        "lon": -93.418114,
        "basis": "operator-site",
        "sourceUrl": "https://www.google.com/maps/dir//177%2BCarob%2BRoad%2C%2BClever%2C%2BMO%2B65631/%4036.9937331%2C-93.4532193%2C13z/data%3D%213m1%214b1%214m8%214m7%211m0%211m5%211m1%211s0x87cf69fe4b218a17%3A0x29aaddfb530f6d13%212m2%211d-93.418114%212d36.9937383",
        "checkedAt": "2026-10-08T02:37:30.513176+00:00",
        "precisionLabel": "Approximate venue location"
      },
      "directionsTarget": {
        "kind": "visitor-address",
        "address": "177 Carob Road, Clever, MO 65631"
      },
      "hours": {
        "state": "partial",
        "displayText": "Sep 26–27 12:00–19:00; October Fri 18:00–23:00, Sat 14:00–23:00, Sun through Oct 25 12:00–19:00. Haunted maze starts Oct 2, after dark Fridays/Saturdays. Weekday public entry unavailable; groups require reservations. Last-admission conflict: homepage says one hour before closing and separately 21:00 on October Fridays/Saturdays. No normalized last-admission value accepted."
      },
      "listingExpiresAt": "2026-10-31T23:00:00-05:00",
      "expiryBasis": "exact",
      "sourceUrls": [
        "https://www.campbellsmazedaze.com/",
        "https://www.campbellsmazedaze.com/general-admission"
      ],
      "reviewRevision": "MO2026-Phase2-R2-76896ea4"
    },
    "seasonalVisitNotes": [
      "2026 season: 2026-09-26 through 2026-10-31. America/Chicago.",
      "Sep 26–27 12:00–19:00; October Fri 18:00–23:00, Sat 14:00–23:00, Sun through Oct 25 12:00–19:00. Haunted maze starts Oct 2, after dark Fridays/Saturdays. Weekday public entry unavailable; groups require reservations. Last-admission conflict: homepage says one hour before closing and separately 21:00 on October Fridays/Saturdays. No normalized last-admission value accepted.",
      "Everyone entering must sign a liability waiver. Ages 4 and younger enter free but do not receive a free mini pumpkin. September 26 and 27: $10 per paying visitor. October Fridays 2–30: $12 per paying visitor. October Saturdays 3–31: adults $14 by card or $13 cash; children ages 5–12 $12. October Sundays 4–25: $12 per paying visitor. Paid children ages 5–12 receive a mini pumpkin and decorating until 18:00, while supplies last; mini pumpkins for other children may be purchased for $4. Published admission amounts are not a guaranteed final checkout quote.",
      "Every visitor must sign the operator liability waiver before entering.",
      "Public walk-ins are Friday–Sunday on the listed seasonal dates; weekday and weeknight groups require reservations and are not public walk-in hours.",
      "The operator states both last admission one hour before closing and 21:00 on October Fridays/Saturdays despite a 23:00 closing. Last-admission time remains unknown; confirm with the venue before a late visit.",
      "The haunted maze starts October 2 and operates after dark on October Fridays/Saturdays.",
      "Free entry for ages 4 and younger excludes the free mini pumpkin. Paid ages 5–12 receive the mini-pumpkin/decorating benefit until 18:00 while supplies last.",
      "Approximate operator-site placement for map and distance only. Directions use the supported visitor address, not an entrance or parking coordinate."
    ]
  },
  {
    "id": "date-night-mo26-030-rutledge-wilson",
    "name": "Rutledge-Wilson Farm Park",
    "address": "3825 W Farm Road 146, Springfield, MO 65802",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Corn Maze / Pumpkin Patch",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://parkboard.org/harvestfest",
    "isChain": false,
    "photoKey": "cafe",
    "source": "catalog",
    "activityTypes": [
      "corn-maze",
      "pumpkin-patch"
    ],
    "moodLevel": 2,
    "seasonalAvailability": {
      "status": "confirmed",
      "activeFrom": "2026-09-29",
      "activeUntil": "2026-10-25",
      "checkedAt": "2026-10-08",
      "revalidateAfter": "2026-10-14",
      "timeZone": "America/Chicago",
      "openNowPolicy": "never",
      "listingExpiresAt": "2026-10-25T18:00:00-05:00",
      "seasonYear": 2026,
      "sourceUrls": [
        "https://parkboard.org/265/Rutledge-Wilson-Farm-Park",
        "https://parkboard.org/harvestfest",
        "https://parkboard.org/Calendar.aspx?EID=9795"
      ],
      "note": "ListingCompletenessV1; source-supported display-only schedule. No machine opening intervals.",
      "endsAt": "2026-10-25T18:00:00-05:00"
    },
    "seasonalListing": {
      "contract": "ListingCompletenessV1",
      "timeZone": "America/Chicago",
      "recordId": "MO26-030",
      "seasonYear": 2026,
      "visitorAddress": "3825 W Farm Road 146, Springfield, MO 65802",
      "placement": {
        "lat": 37.191319,
        "lon": -93.360734,
        "basis": "operator-site",
        "sourceUrl": "https://www.google.com/maps/d/kml?mid=1GWi3uqBrcGQqN_iYWg4igElBk16fJnCe&forcekml=1",
        "checkedAt": "2026-10-08T02:37:30.513176+00:00",
        "precisionLabel": "Approximate venue location"
      },
      "directionsTarget": {
        "kind": "visitor-address",
        "address": "3825 W Farm Road 146, Springfield, MO 65802"
      },
      "hours": {
        "state": "verified",
        "displayText": "Harvest Fest Oct 3–25: Sat 11:00–18:00, Sun 12:00–18:00. Pumpkin patch Sep 29–Oct 25: Tue–Fri 09:00–17:00, Sat 11:00–18:00, Sun 12:00–18:00; Mon closed."
      },
      "listingExpiresAt": "2026-10-25T18:00:00-05:00",
      "expiryBasis": "exact",
      "sourceUrls": [
        "https://parkboard.org/265/Rutledge-Wilson-Farm-Park",
        "https://parkboard.org/harvestfest",
        "https://parkboard.org/Calendar.aspx?EID=9795"
      ],
      "reviewRevision": "MO2026-Phase2-R2-76896ea4"
    },
    "seasonalVisitNotes": [
      "2026 season: 2026-09-29 through 2026-10-25. America/Chicago.",
      "Harvest Fest Oct 3–25: Sat 11:00–18:00, Sun 12:00–18:00. Pumpkin patch Sep 29–Oct 25: Tue–Fri 09:00–17:00, Sat 11:00–18:00, Sun 12:00–18:00; Mon closed.",
      "Festival entry is free; individual activities carry separate charges. Corn maze: adults $4; ages 5–11 $3; ages 4 and younger enter free only when accompanied by an adult.",
      "Festival entry is free; activities carry separate fees and pumpkins are priced by weight.",
      "Corn-maze free admission for ages 4 and younger requires an accompanying adult.",
      "Corn maze: October 3–25 weekends only. Pumpkin patch: September 29–October 25, closed Mondays; do not apply ordinary farm-park hours to either activity.",
      "Use the farm address, never Park Board headquarters. Drive west along Farm Road 146 through the roundabout; park entrance is north of the road opposite Stonehinge subdivision.",
      "Operator ZIP 65802 and Census match ZIP 65807 remain different. Official visitor address and named-park map are retained; Census ZIP is not substituted.",
      "Approximate operator-site placement for map and distance only. Directions use the supported visitor address, not an entrance or parking coordinate."
    ]
  }
];

export const MISSOURI_2026_V1_SEASONAL_CATALOG: DateNightPlace[] =
  MISSOURI_2026_V1_LISTINGS.flatMap(record => {
    const place = seasonalListingToPlace(record);
    return place ? [place] : [];
  });
