import type { DateNightPlace } from "./types";
import { seasonalListingToPlace, type SeasonalListing } from "./listing";

/** Ten independently reviewed 2026 projections; approximate placement is not entrance geometry.
 * Full immutable facts and source receipts: audit/seasonal-completeness-v1-next-import.json.
 * Display schedules never become machine opening intervals. */
export const MISSOURI_2026_V1_NEXT_LISTINGS: (Omit<DateNightPlace, "lat" | "lon"> & { seasonalListing: SeasonalListing })[] = [
  {
    "id": "date-night-mo26-019-james-river-joplin-party",
    "name": "James River Church Joplin — October 31st Party",
    "address": "1850 S Maiden Lane, Joplin, MO",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Other Halloween / Fall",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://jamesriver.church/october31/",
    "isChain": false,
    "photoKey": "cafe",
    "source": "catalog",
    "activityTypes": [
      "other-halloween-fall"
    ],
    "moodLevel": 2,
    "seasonalAvailability": {
      "status": "confirmed",
      "activeFrom": "2026-10-31",
      "activeUntil": "2026-10-31",
      "checkedAt": "2026-10-08",
      "revalidateAfter": "2026-10-14",
      "timeZone": "America/Chicago",
      "openNowPolicy": "never",
      "listingExpiresAt": "2026-10-31T17:00:00-05:00",
      "seasonYear": 2026,
      "sourceUrls": [
        "https://jamesriver.church/october31/",
        "https://jamesriver.church/locations/joplin/",
        "https://www.visitjoplinmo.com/events/james-river-church-october-31st-party/"
      ],
      "note": "Reviewed ListingCompletenessV1 display schedule; no machine opening intervals.",
      "activeDates": [
        "2026-10-31"
      ],
      "endsAt": "2026-10-31T17:00:00-05:00"
    },
    "seasonalListing": {
      "contract": "ListingCompletenessV1",
      "recordId": "MO26-019",
      "seasonYear": 2026,
      "timeZone": "America/Chicago",
      "visitorAddress": "1850 S Maiden Lane, Joplin, MO",
      "placement": {
        "lat": 37.0715533,
        "lon": -94.5331944,
        "basis": "operator-site",
        "sourceUrl": "https://jamesriver.church/locations/joplin/",
        "checkedAt": "2026-10-08T02:33:46.702845+00:00",
        "precisionLabel": "Approximate venue location"
      },
      "directionsTarget": {
        "kind": "visitor-address",
        "address": "1850 S Maiden Lane, Joplin, MO"
      },
      "hours": {
        "state": "verified",
        "displayText": "13:00–17:00."
      },
      "listingExpiresAt": "2026-10-31T17:00:00-05:00",
      "expiryBasis": "exact",
      "sourceUrls": [
        "https://jamesriver.church/october31/",
        "https://jamesriver.church/locations/joplin/",
        "https://www.visitjoplinmo.com/events/james-river-church-october-31st-party/"
      ],
      "reviewRevision": "MO2026-next-R2-e0736dc8"
    },
    "seasonalVisitNotes": [
      "13:00–17:00.",
      "Free public family party intended for children from infants through fifth grade; kid-friendly costumes welcome.",
      "Volunteer check-in, GrowTrack, background-screening and volunteer waiver requirements are not public visitor entry restrictions.",
      "Operator sources disagree on ZIP 64801 versus 64804. Street, city, campus identity and named campus point agree. Visitor Directions intentionally omit an unverified ZIP; this does not resolve the postal conflict.",
      "Temporary mini-pumpkin activity is classified as Other Halloween / Fall, not a farm Pumpkin Patch."
    ]
  },
  {
    "id": "date-night-mo26-031-silver-dollar-city-harvest",
    "name": "Silver Dollar City — Harvest Festival",
    "address": "399 Silver Dollar City Parkway, Branson, MO 65616",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Other Halloween / Fall",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://www.silverdollarcity.com/theme-park/festivals/harvest-festival/",
    "isChain": false,
    "photoKey": "cafe",
    "source": "catalog",
    "activityTypes": [
      "other-halloween-fall"
    ],
    "moodLevel": 2,
    "seasonalAvailability": {
      "status": "confirmed",
      "activeFrom": "2026-09-11",
      "activeUntil": "2026-10-31",
      "checkedAt": "2026-10-08",
      "revalidateAfter": "2026-10-14",
      "timeZone": "America/Chicago",
      "openNowPolicy": "never",
      "listingExpiresAt": "2026-11-01T00:00:00-05:00",
      "seasonYear": 2026,
      "sourceUrls": [
        "https://www.silverdollarcity.com/theme-park/festivals/harvest-festival/",
        "https://www.silverdollarcity.com/theme-park/directions"
      ],
      "note": "Reviewed ListingCompletenessV1 display schedule; no machine opening intervals."
    },
    "seasonalListing": {
      "contract": "ListingCompletenessV1",
      "recordId": "MO26-031",
      "seasonYear": 2026,
      "timeZone": "America/Chicago",
      "visitorAddress": "399 Silver Dollar City Parkway, Branson, MO 65616",
      "placement": {
        "lat": 36.661658,
        "lon": -93.338519,
        "basis": "address-geocode",
        "sourceUrl": "https://geocoding.geo.census.gov/geocoder/geographies/onelineaddress?address=399+Silver+Dollar+City+Parkway%2C+Branson%2C+MO+65616&benchmark=Public_AR_Current&vintage=Current_Current&format=json",
        "checkedAt": "2026-10-08T02:33:26.014163+00:00",
        "precisionLabel": "Approximate address-range interpolation; not an entrance or parking coordinate"
      },
      "directionsTarget": {
        "kind": "visitor-address",
        "address": "399 Silver Dollar City Parkway, Branson, MO 65616"
      },
      "hours": {
        "state": "partial",
        "displayText": "Nighttime plaza programming starts at 5:30 p.m. on festival operating evenings. Complete selected-date park hours remain unknown."
      },
      "listingExpiresAt": "2026-11-01T00:00:00-05:00",
      "expiryBasis": "date-only",
      "sourceUrls": [
        "https://www.silverdollarcity.com/theme-park/festivals/harvest-festival/",
        "https://www.silverdollarcity.com/theme-park/directions"
      ],
      "reviewRevision": "MO2026-next-R2-e0736dc8"
    },
    "seasonalVisitNotes": [
      "Nighttime plaza programming starts at 5:30 p.m. on festival operating evenings. Complete selected-date park hours remain unknown.",
      "Selected operating days only; the season range does not imply daily opening.",
      "Guest costumes are prohibited.",
      "Use Indian Point Road into the park; parking connects to the front gate by tram or bus."
    ]
  },
  {
    "id": "date-night-mo26-034-boone-historical-haunts",
    "name": "Nathan and Olive Boone Homestead — Historical Haunts",
    "address": "7850 N State Highway V, Ash Grove, MO 65604",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Other Halloween / Fall",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://mostateparks.com/event/historical-haunts-homestead-2026",
    "isChain": false,
    "photoKey": "cafe",
    "source": "catalog",
    "activityTypes": [
      "other-halloween-fall"
    ],
    "moodLevel": 2,
    "seasonalAvailability": {
      "status": "confirmed",
      "activeFrom": "2026-10-17",
      "activeUntil": "2026-10-17",
      "checkedAt": "2026-10-08",
      "revalidateAfter": "2026-10-14",
      "timeZone": "America/Chicago",
      "openNowPolicy": "never",
      "listingExpiresAt": "2026-10-17T20:00:00-05:00",
      "seasonYear": 2026,
      "sourceUrls": [
        "https://mostateparks.com/event/historical-haunts-homestead-2026"
      ],
      "note": "Reviewed ListingCompletenessV1 display schedule; no machine opening intervals.",
      "activeDates": [
        "2026-10-17"
      ],
      "endsAt": "2026-10-17T20:00:00-05:00"
    },
    "seasonalListing": {
      "contract": "ListingCompletenessV1",
      "recordId": "MO26-034",
      "seasonYear": 2026,
      "timeZone": "America/Chicago",
      "visitorAddress": "7850 N State Highway V, Ash Grove, MO 65604",
      "placement": {
        "lat": 37.347285,
        "lon": -93.582655,
        "basis": "address-geocode",
        "sourceUrl": "https://geocoding.geo.census.gov/geocoder/geographies/onelineaddress?address=7850+N+State+Highway+V%2C+Ash+Grove%2C+MO+65604&benchmark=Public_AR_Current&vintage=Current_Current&format=json",
        "checkedAt": "2026-10-08T02:33:26.015875+00:00",
        "precisionLabel": "Approximate address-range interpolation; not an entrance or parking coordinate"
      },
      "directionsTarget": {
        "kind": "visitor-address",
        "address": "7850 N State Highway V, Ash Grove, MO 65604"
      },
      "hours": {
        "state": "verified",
        "displayText": "October 17: interpretation 6–8 p.m.; music 6–7 p.m.; lantern hikes 7–8 p.m."
      },
      "listingExpiresAt": "2026-10-17T20:00:00-05:00",
      "expiryBasis": "exact",
      "sourceUrls": [
        "https://mostateparks.com/event/historical-haunts-homestead-2026"
      ],
      "reviewRevision": "MO2026-next-R2-e0736dc8"
    },
    "seasonalVisitNotes": [
      "October 17: interpretation 6–8 p.m.; music 6–7 p.m.; lantern hikes 7–8 p.m.",
      "Lantern hikes begin near the picnic shelter.",
      "Outdoor activities may be canceled or postponed for inclement weather; consult official updates."
    ]
  },
  {
    "id": "date-night-mo26-054-fun-farm",
    "name": "Fun Farm",
    "address": "650 N Jefferson Street, Kearney, MO 64060",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Corn Maze / Pumpkin Patch",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://www.funfarmpumpkinpatch.com/fall-festival",
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
      "activeFrom": "2026-09-18",
      "activeUntil": "2026-11-01",
      "checkedAt": "2026-10-08",
      "revalidateAfter": "2026-10-14",
      "timeZone": "America/Chicago",
      "openNowPolicy": "never",
      "listingExpiresAt": "2026-11-01T21:00:00-06:00",
      "seasonYear": 2026,
      "sourceUrls": [
        "https://www.funfarmpumpkinpatch.com/fall-festival",
        "https://funfarmpumpkinpatch.ticketspice.com/2026-fall-festival"
      ],
      "note": "Reviewed ListingCompletenessV1 display schedule; no machine opening intervals.",
      "activeDates": [
        "2026-09-18",
        "2026-09-19",
        "2026-09-20",
        "2026-09-21",
        "2026-09-23",
        "2026-09-24",
        "2026-09-25",
        "2026-09-26",
        "2026-09-27",
        "2026-09-28",
        "2026-09-30",
        "2026-10-01",
        "2026-10-02",
        "2026-10-03",
        "2026-10-04",
        "2026-10-05",
        "2026-10-07",
        "2026-10-08",
        "2026-10-09",
        "2026-10-10",
        "2026-10-11",
        "2026-10-12",
        "2026-10-14",
        "2026-10-15",
        "2026-10-16",
        "2026-10-17",
        "2026-10-18",
        "2026-10-19",
        "2026-10-21",
        "2026-10-22",
        "2026-10-23",
        "2026-10-24",
        "2026-10-25",
        "2026-10-26",
        "2026-10-28",
        "2026-10-29",
        "2026-10-30",
        "2026-10-31",
        "2026-11-01"
      ],
      "endsAt": "2026-11-01T21:00:00-06:00"
    },
    "seasonalListing": {
      "contract": "ListingCompletenessV1",
      "recordId": "MO26-054",
      "seasonYear": 2026,
      "timeZone": "America/Chicago",
      "visitorAddress": "650 N Jefferson Street, Kearney, MO 64060",
      "placement": {
        "lat": 39.379769,
        "lon": -94.3646,
        "basis": "address-geocode",
        "sourceUrl": "https://geocoding.geo.census.gov/geocoder/geographies/onelineaddress?address=650+N+Jefferson+Street%2C+Kearney%2C+MO+64060&benchmark=Public_AR_Current&vintage=Current_Current&format=json",
        "checkedAt": "2026-10-08T02:33:29.900271+00:00",
        "precisionLabel": "Approximate address-range interpolation; not an entrance or parking coordinate"
      },
      "directionsTarget": {
        "kind": "visitor-address",
        "address": "650 N Jefferson Street, Kearney, MO 64060"
      },
      "hours": {
        "state": "verified",
        "displayText": "September 18–30: Mon/Wed/Thu 9 a.m.–7 p.m., Fri/Sat 9 a.m.–10 p.m., Sun 9 a.m.–9 p.m. October 1–November 1: Mon/Thu 9 a.m.–7 p.m., Wed/Sun 9 a.m.–9 p.m., Fri/Sat 9 a.m.–10 p.m. Closed Tuesdays."
      },
      "listingExpiresAt": "2026-11-01T21:00:00-06:00",
      "expiryBasis": "exact",
      "sourceUrls": [
        "https://www.funfarmpumpkinpatch.com/fall-festival",
        "https://funfarmpumpkinpatch.ticketspice.com/2026-fall-festival"
      ],
      "reviewRevision": "MO2026-next-R2-e0736dc8"
    },
    "seasonalVisitNotes": [
      "September 18–30: Mon/Wed/Thu 9 a.m.–7 p.m., Fri/Sat 9 a.m.–10 p.m., Sun 9 a.m.–9 p.m. October 1–November 1: Mon/Thu 9 a.m.–7 p.m., Wed/Sun 9 a.m.–9 p.m., Fri/Sat 9 a.m.–10 p.m. Closed Tuesdays.",
      "Final admission purchases and the last tractor to the maze and patch stop one hour before closing.",
      "Take-home crops cost extra and are supply-dependent.",
      "Jacks in the Night is separately ticketed and does not inherit this Fall Festival schedule. Eligible Jacks/passholders arriving after 9 p.m. use the big barn.",
      "Tickets are final sale/nonrefundable; weather and crop conditions can change season dates.",
      "No smoking, including vaping; no dogs other than service animals. Source: delegated official TicketSpice PLEASE BE AWARE."
    ]
  },
  {
    "id": "date-night-mo26-067-shryocks-callaway-farms",
    "name": "Shryocks Callaway Farms",
    "address": "2927 County Road 253, Columbia, MO 65202",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Corn Maze",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://callawayfarms.com/",
    "isChain": false,
    "photoKey": "cafe",
    "source": "catalog",
    "activityTypes": [
      "corn-maze"
    ],
    "moodLevel": 2,
    "seasonalAvailability": {
      "status": "confirmed",
      "activeFrom": "2026-09-18",
      "activeUntil": "2026-11-01",
      "checkedAt": "2026-10-08",
      "revalidateAfter": "2026-10-14",
      "timeZone": "America/Chicago",
      "openNowPolicy": "never",
      "listingExpiresAt": "2026-11-02T00:00:00-06:00",
      "seasonYear": 2026,
      "sourceUrls": [
        "https://callawayfarms.com/",
        "https://callawayfarms.com/the-corn-maze/",
        "https://callawayfarms.com/contact/"
      ],
      "note": "Reviewed ListingCompletenessV1 display schedule; no machine opening intervals.",
      "activeDates": [
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
        "2026-10-30",
        "2026-10-31",
        "2026-11-01"
      ]
    },
    "seasonalListing": {
      "contract": "ListingCompletenessV1",
      "recordId": "MO26-067",
      "seasonYear": 2026,
      "timeZone": "America/Chicago",
      "visitorAddress": "2927 County Road 253, Columbia, MO 65202",
      "placement": {
        "lat": 38.955913,
        "lon": -92.079145,
        "basis": "address-geocode",
        "sourceUrl": "https://geocoding.geo.census.gov/geocoder/geographies/onelineaddress?address=2927+County+Road+253%2C+Columbia%2C+MO+65202&benchmark=Public_AR_Current&vintage=Current_Current&format=json",
        "checkedAt": "2026-10-08T02:33:33.817477+00:00",
        "precisionLabel": "Approximate address-range interpolation; not an entrance or parking coordinate"
      },
      "directionsTarget": {
        "kind": "visitor-address",
        "address": "2927 County Road 253, Columbia, MO 65202"
      },
      "hours": {
        "state": "partial",
        "displayText": "Fridays/Saturdays noon–9 p.m.; Sundays noon–6 p.m., September 18–November 1, 2026. Source footnote says ticket sales end and the maze is cleared after one hour; the exact relationship to listed closing time is unresolved."
      },
      "listingExpiresAt": "2026-11-02T00:00:00-06:00",
      "expiryBasis": "date-only",
      "sourceUrls": [
        "https://callawayfarms.com/",
        "https://callawayfarms.com/the-corn-maze/",
        "https://callawayfarms.com/contact/"
      ],
      "reviewRevision": "MO2026-next-R2-e0736dc8"
    },
    "seasonalVisitNotes": [
      "Fridays/Saturdays noon–9 p.m.; Sundays noon–6 p.m., September 18–November 1, 2026. Source footnote says ticket sales end and the maze is cleared after one hour; the exact relationship to listed closing time is unresolved.",
      "Children 12 and under must be accompanied by an adult.",
      "Weather can change hours. Confirm last-ticket and maze-clearing times before visiting.",
      "Pumpkins, concessions and reserved campfires cost extra; pumpkin sales do not establish a pickable-patch category.",
      "No alcoholic beverages; smoking/vaping prohibited in barns and maze; pets prohibited in maze/facilities; unauthorized drones prohibited. Source: unchanged official corn-maze page."
    ]
  },
  {
    "id": "date-night-mo26-100-urban-gardens",
    "name": "Urban Gardens Pumpkin Patch & Corn Maze",
    "address": "701 W LaHarpe Street, Kirksville, MO 63501",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Corn Maze / Pumpkin Patch",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://urbangardenskv.com/",
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
      "activeFrom": "2026-09-05",
      "activeUntil": "2026-11-01",
      "checkedAt": "2026-10-08",
      "revalidateAfter": "2026-10-14",
      "timeZone": "America/Chicago",
      "openNowPolicy": "never",
      "listingExpiresAt": "2026-11-01T18:00:00-06:00",
      "seasonYear": 2026,
      "sourceUrls": [
        "https://urbangardenskv.com/"
      ],
      "note": "Reviewed ListingCompletenessV1 display schedule; no machine opening intervals.",
      "activeDates": [
        "2026-09-05",
        "2026-09-06",
        "2026-09-07",
        "2026-09-08",
        "2026-09-09",
        "2026-09-10",
        "2026-09-11",
        "2026-09-12",
        "2026-09-13",
        "2026-09-14",
        "2026-09-15",
        "2026-09-16",
        "2026-09-17",
        "2026-09-18",
        "2026-09-19",
        "2026-09-20",
        "2026-09-21",
        "2026-09-22",
        "2026-09-23",
        "2026-09-24",
        "2026-09-25",
        "2026-09-26",
        "2026-09-27",
        "2026-09-28",
        "2026-09-29",
        "2026-09-30",
        "2026-10-01",
        "2026-10-02",
        "2026-10-03",
        "2026-10-04",
        "2026-10-05",
        "2026-10-06",
        "2026-10-07",
        "2026-10-08",
        "2026-10-09",
        "2026-10-10",
        "2026-10-11",
        "2026-10-12",
        "2026-10-13",
        "2026-10-14",
        "2026-10-15",
        "2026-10-16",
        "2026-10-17",
        "2026-10-18",
        "2026-10-19",
        "2026-10-20",
        "2026-10-21",
        "2026-10-22",
        "2026-10-23",
        "2026-10-24",
        "2026-10-25",
        "2026-10-26",
        "2026-10-27",
        "2026-10-28",
        "2026-10-29",
        "2026-10-30",
        "2026-10-31",
        "2026-11-01"
      ],
      "endsAt": "2026-11-01T18:00:00-06:00"
    },
    "seasonalListing": {
      "contract": "ListingCompletenessV1",
      "recordId": "MO26-100",
      "seasonYear": 2026,
      "timeZone": "America/Chicago",
      "visitorAddress": "701 W LaHarpe Street, Kirksville, MO 63501",
      "placement": {
        "lat": 40.179161,
        "lon": -92.587774,
        "basis": "address-geocode",
        "sourceUrl": "https://geocoding.geo.census.gov/geocoder/geographies/onelineaddress?address=701+W+LaHarpe+Street%2C+Kirksville%2C+MO+63501&benchmark=Public_AR_Current&vintage=Current_Current&format=json",
        "checkedAt": "2026-10-07T06:44:14.521149+00:00",
        "precisionLabel": "Approximate venue location"
      },
      "directionsTarget": {
        "kind": "visitor-address",
        "address": "701 W LaHarpe Street, Kirksville, MO 63501"
      },
      "hours": {
        "state": "verified",
        "displayText": "Daily 10:00–18:00 September 5–November 1, 2026, weather permitting. Operator directs visitors to Facebook for timely changes; current posts were not accessible in this check."
      },
      "listingExpiresAt": "2026-11-01T18:00:00-06:00",
      "expiryBasis": "exact",
      "sourceUrls": [
        "https://urbangardenskv.com/"
      ],
      "reviewRevision": "MO2026-next-R2-e0736dc8"
    },
    "seasonalVisitNotes": [
      "Daily 10:00–18:00 September 5–November 1, 2026, weather permitting. Operator directs visitors to Facebook for timely changes; current posts were not accessible in this check.",
      "Hours are weather dependent; check the linked operator Facebook page for timely changes. Its current posts have not been independently verified in this bounded review.",
      "Children ages 2 and younger have free entry.",
      "Operator prohibits pets, smoking, vaping and tobacco products. School field trips require appointments.",
      "Saloon is Friday–Sunday only, although the seasonal grounds schedule is daily.",
      "Apples are expected for the 2027 season, not an accepted 2026 apple-picking activity. Ghost-town scenery is not sufficient to classify this as a haunted attraction."
    ]
  },
  {
    "id": "date-night-mo26-114-perryville-pumpkin-farm",
    "name": "Perryville Pumpkin Farm",
    "address": "1410 Allens Landing Road, Perryville, MO 63775",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Corn Maze / Pumpkin Patch",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://perryvillepumpkinfarm.com/",
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
      "activeFrom": "2026-09-07",
      "activeUntil": "2026-10-31",
      "checkedAt": "2026-10-08",
      "revalidateAfter": "2026-10-14",
      "timeZone": "America/Chicago",
      "openNowPolicy": "never",
      "listingExpiresAt": "2026-10-31T20:30:00-05:00",
      "seasonYear": 2026,
      "sourceUrls": [
        "https://perryvillepumpkinfarm.com/"
      ],
      "note": "Reviewed ListingCompletenessV1 display schedule; no machine opening intervals.",
      "endsAt": "2026-10-31T20:30:00-05:00"
    },
    "seasonalListing": {
      "contract": "ListingCompletenessV1",
      "recordId": "MO26-114",
      "seasonYear": 2026,
      "timeZone": "America/Chicago",
      "visitorAddress": "1410 Allens Landing Road, Perryville, MO 63775",
      "placement": {
        "lat": 37.730183,
        "lon": -89.84486,
        "basis": "address-geocode",
        "sourceUrl": "https://geocoding.geo.census.gov/geocoder/geographies/onelineaddress?address=1410+Allens+Landing+Road%2C+Perryville%2C+MO+63775&benchmark=Public_AR_Current&vintage=Current_Current&format=json",
        "checkedAt": "2026-10-08T02:33:57.537465+00:00",
        "precisionLabel": "Approximate address-range location"
      },
      "directionsTarget": {
        "kind": "visitor-address",
        "address": "1410 Allens Landing Road, Perryville, MO 63775"
      },
      "hours": {
        "state": "partial",
        "displayText": "September 7–30: daily 9:30 a.m.–6 p.m. October 1–31: Sunday–Friday 9 a.m.–6 p.m.; Saturdays 9 a.m.–8:30 p.m. Named flashlight nights: October 3, 10, 17 and 24."
      },
      "listingExpiresAt": "2026-10-31T20:30:00-05:00",
      "expiryBasis": "exact",
      "sourceUrls": [
        "https://perryvillepumpkinfarm.com/"
      ],
      "reviewRevision": "MO2026-next-R2-e0736dc8"
    },
    "seasonalVisitNotes": [
      "September 7–30: daily 9:30 a.m.–6 p.m. October 1–31: Sunday–Friday 9 a.m.–6 p.m.; Saturdays 9 a.m.–8:30 p.m. Named flashlight nights: October 3, 10, 17 and 24.",
      "Weekday group wagon rides require an appointment.",
      "Bring your own flashlight for the named flashlight nights.",
      "October 31 flashlight programming is not separately confirmed."
    ]
  },
  {
    "id": "date-night-mo26-115-bollinger-trick-or-treat",
    "name": "Bollinger Mill State Historic Site — Trick-or-Treat Night",
    "address": "113 Bollinger Mill Road, Burfordville, MO 63739-9051",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Other Halloween / Fall",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://mostateparks.com/event/trick-or-treat-night-2026",
    "isChain": false,
    "photoKey": "cafe",
    "source": "catalog",
    "activityTypes": [
      "other-halloween-fall"
    ],
    "moodLevel": 2,
    "seasonalAvailability": {
      "status": "confirmed",
      "activeFrom": "2026-10-23",
      "activeUntil": "2026-10-23",
      "checkedAt": "2026-10-08",
      "revalidateAfter": "2026-10-14",
      "timeZone": "America/Chicago",
      "openNowPolicy": "never",
      "listingExpiresAt": "2026-10-23T19:00:00-05:00",
      "seasonYear": 2026,
      "sourceUrls": [
        "https://mostateparks.com/event/trick-or-treat-night-2026",
        "https://mostateparks.com/historic-site/bollinger-mill-state-historic-site"
      ],
      "note": "Reviewed ListingCompletenessV1 display schedule; no machine opening intervals.",
      "activeDates": [
        "2026-10-23"
      ],
      "endsAt": "2026-10-23T19:00:00-05:00"
    },
    "seasonalListing": {
      "contract": "ListingCompletenessV1",
      "recordId": "MO26-115",
      "seasonYear": 2026,
      "timeZone": "America/Chicago",
      "visitorAddress": "113 Bollinger Mill Road, Burfordville, MO 63739-9051",
      "placement": {
        "lat": 37.3679,
        "lon": -89.802902,
        "basis": "address-geocode",
        "sourceUrl": "https://geocoding.geo.census.gov/geocoder/geographies/onelineaddress?address=113+Bollinger+Mill+Road%2C+Burfordville%2C+MO&benchmark=Public_AR_Current&vintage=Current_Current&format=json",
        "checkedAt": "2026-10-07T06:44:26.400223+00:00",
        "precisionLabel": "Approximate venue location"
      },
      "directionsTarget": {
        "kind": "visitor-address",
        "address": "113 Bollinger Mill Road, Burfordville, MO 63739-9051"
      },
      "hours": {
        "state": "verified",
        "displayText": "16:00–19:00."
      },
      "listingExpiresAt": "2026-10-23T19:00:00-05:00",
      "expiryBasis": "exact",
      "sourceUrls": [
        "https://mostateparks.com/event/trick-or-treat-night-2026",
        "https://mostateparks.com/historic-site/bollinger-mill-state-historic-site"
      ],
      "reviewRevision": "MO2026-next-R2-e0736dc8"
    },
    "seasonalVisitNotes": [
      "16:00–19:00.",
      "Free and open to the public; no registration required.",
      "Event is inside the mill across all four floors. General accessibility guidance supports a ramp to the porch/first floor only; do not claim all event floors are accessible.",
      "The operator suggests a costume, flashlight and candy container.",
      "Venue-wide street address is the Directions target; the approximate address point is not a designated parking or entry point."
    ]
  },
  {
    "id": "date-night-mo26-124-hotel-of-terror",
    "name": "Hotel of Terror",
    "address": "334 N Main Avenue, Springfield, MO 65806",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Haunted House",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://www.hotelofterror.com/",
    "isChain": false,
    "photoKey": "cafe",
    "source": "catalog",
    "activityTypes": [
      "haunted-house"
    ],
    "moodLevel": 3,
    "seasonalAvailability": {
      "status": "confirmed",
      "activeFrom": "2026-09-11",
      "activeUntil": "2026-10-31",
      "checkedAt": "2026-10-08",
      "revalidateAfter": "2026-10-14",
      "timeZone": "America/Chicago",
      "openNowPolicy": "never",
      "listingExpiresAt": "2026-11-01T00:00:00-05:00",
      "seasonYear": 2026,
      "sourceUrls": [
        "https://www.hotelofterror.com/"
      ],
      "note": "Reviewed ListingCompletenessV1 display schedule; no machine opening intervals.",
      "activeDates": [
        "2026-09-11",
        "2026-09-12",
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
        "2026-10-19",
        "2026-10-20",
        "2026-10-21",
        "2026-10-22",
        "2026-10-23",
        "2026-10-24",
        "2026-10-25",
        "2026-10-26",
        "2026-10-27",
        "2026-10-28",
        "2026-10-29",
        "2026-10-30",
        "2026-10-31"
      ]
    },
    "seasonalListing": {
      "contract": "ListingCompletenessV1",
      "recordId": "MO26-124",
      "seasonYear": 2026,
      "timeZone": "America/Chicago",
      "visitorAddress": "334 N Main Avenue, Springfield, MO 65806",
      "placement": {
        "lat": 37.210875,
        "lon": -93.296377,
        "basis": "address-geocode",
        "sourceUrl": "https://geocoding.geo.census.gov/geocoder/geographies/onelineaddress?address=334+N+Main+Avenue%2C+Springfield%2C+MO+65806&benchmark=Public_AR_Current&vintage=Current_Current&format=json",
        "checkedAt": "2026-10-08T02:33:57.538483+00:00",
        "precisionLabel": "Approximate address-range location"
      },
      "directionsTarget": {
        "kind": "visitor-address",
        "address": "334 N Main Avenue, Springfield, MO 65806"
      },
      "hours": {
        "state": "partial",
        "displayText": "Doors open at 7 p.m. on listed dates. Closing depends on attendance; exact Friday/Saturday closing is unconfirmed."
      },
      "listingExpiresAt": "2026-11-01T00:00:00-05:00",
      "expiryBasis": "date-only",
      "sourceUrls": [
        "https://www.hotelofterror.com/"
      ],
      "reviewRevision": "MO2026-next-R2-e0736dc8"
    },
    "seasonalVisitNotes": [
      "Doors open at 7 p.m. on listed dates. Closing depends on attendance; exact Friday/Saturday closing is unconfirmed.",
      "Liability waiver required; operator states fingerprint signature.",
      "Loud sound, strobe lighting, darkness, fog and wet conditions are disclosed.",
      "Reported final 2026 season at this Hotel of Terror site; do not carry this location into 2027."
    ]
  },
  {
    "id": "date-night-mo26-125-dungeons-of-doom",
    "name": "Dungeons of Doom",
    "address": "701 W Wall Street, Springfield, MO 65802",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Haunted House",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://www.hotelofterror.com/",
    "isChain": false,
    "photoKey": "cafe",
    "source": "catalog",
    "activityTypes": [
      "haunted-house"
    ],
    "moodLevel": 3,
    "seasonalAvailability": {
      "status": "confirmed",
      "activeFrom": "2026-09-11",
      "activeUntil": "2026-10-31",
      "checkedAt": "2026-10-08",
      "revalidateAfter": "2026-10-14",
      "timeZone": "America/Chicago",
      "openNowPolicy": "never",
      "listingExpiresAt": "2026-11-01T00:00:00-05:00",
      "seasonYear": 2026,
      "sourceUrls": [
        "https://www.hotelofterror.com/"
      ],
      "note": "Reviewed ListingCompletenessV1 display schedule; no machine opening intervals.",
      "activeDates": [
        "2026-09-11",
        "2026-09-12",
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
        "2026-10-19",
        "2026-10-20",
        "2026-10-21",
        "2026-10-22",
        "2026-10-23",
        "2026-10-24",
        "2026-10-25",
        "2026-10-26",
        "2026-10-27",
        "2026-10-28",
        "2026-10-29",
        "2026-10-30",
        "2026-10-31"
      ]
    },
    "seasonalListing": {
      "contract": "ListingCompletenessV1",
      "recordId": "MO26-125",
      "seasonYear": 2026,
      "timeZone": "America/Chicago",
      "visitorAddress": "701 W Wall Street, Springfield, MO 65802",
      "placement": {
        "lat": 37.211958,
        "lon": -93.298751,
        "basis": "address-geocode",
        "sourceUrl": "https://geocoding.geo.census.gov/geocoder/geographies/onelineaddress?address=701+W+Wall+Street%2C+Springfield%2C+MO+65802&benchmark=Public_AR_Current&vintage=Current_Current&format=json",
        "checkedAt": "2026-10-08T02:33:57.539597+00:00",
        "precisionLabel": "Approximate address-range location"
      },
      "directionsTarget": {
        "kind": "visitor-address",
        "address": "701 W Wall Street, Springfield, MO 65802"
      },
      "hours": {
        "state": "partial",
        "displayText": "Doors open at 7 p.m. on listed dates. Closing depends on attendance; exact Friday/Saturday closing is unconfirmed."
      },
      "listingExpiresAt": "2026-11-01T00:00:00-05:00",
      "expiryBasis": "date-only",
      "sourceUrls": [
        "https://www.hotelofterror.com/"
      ],
      "reviewRevision": "MO2026-next-R2-e0736dc8"
    },
    "seasonalVisitNotes": [
      "Doors open at 7 p.m. on listed dates. Closing depends on attendance; exact Friday/Saturday closing is unconfirmed.",
      "Liability waiver required; operator states fingerprint signature.",
      "Loud sound, strobe lighting, darkness, fog and wet conditions are disclosed."
    ]
  }
];

export const MISSOURI_2026_V1_NEXT_SEASONAL_CATALOG: DateNightPlace[] =
  MISSOURI_2026_V1_NEXT_LISTINGS.map(seasonalListingToPlace).filter((place): place is DateNightPlace => place !== null);
