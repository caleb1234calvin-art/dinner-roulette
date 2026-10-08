import type { DateNightPlace } from "./types";
import { seasonalListingToPlace, type SeasonalListing } from "./listing";

/** Four final independently cleared 2026 projections.
 * Verification: audit/missouri-final-unresolved-independent-verification-2026-10-08.md
 * Vino Noir is expired and Brookdale remains a separate runtime-window decision. */
export const MISSOURI_2026_FINAL_FOUR_LISTINGS:
  (Omit<DateNightPlace, "lat" | "lon"> & { seasonalListing: SeasonalListing })[] = [
  {
    id: "date-night-mo26-012-witches-day-out",
    name: "Christine’s Vineyard — Witches Day Out",
    address: "25695 Mulberry Road, Webb City, MO 64870",
    cuisines: ["other"], cuisineLabel: "Other Halloween / Fall",
    priceLevel: null, rating: null, reviewCount: null, openingHours: null,
    phone: null, website: "https://www.christinesvineyard.com/event-details/witches-day-out",
    isChain: false, photoKey: "cafe", source: "catalog",
    activityTypes: ["other-halloween-fall"], moodLevel: 2,
    seasonalAvailability: {
      status: "confirmed", activeFrom: "2026-10-10", activeUntil: "2026-10-10",
      activeDates: ["2026-10-10"], checkedAt: "2026-10-08", revalidateAfter: "2026-10-10",
      timeZone: "America/Chicago", openNowPolicy: "never",
      endsAt: "2026-10-10T22:00:00-05:00", listingExpiresAt: "2026-10-10T22:00:00-05:00", seasonYear: 2026,
      sourceUrls: ["https://www.christinesvineyard.com/event-details/witches-day-out"],
      note: "Admission/ticket relationship remains unconfirmed; no machine opening intervals."
    },
    seasonalListing: {
      contract: "ListingCompletenessV1", recordId: "MO26-012", seasonYear: 2026, timeZone: "America/Chicago",
      visitorAddress: "25695 Mulberry Road, Webb City, MO 64870",
      placement: { lat: 37.23722, lon: -94.523237, basis: "address-geocode",
        sourceUrl: "https://geocoding.geo.census.gov/geocoder/geographies/onelineaddress?address=25695+Mulberry+Road%2C+Webb+City%2C+MO+64870&benchmark=Public_AR_Current&vintage=Current_Current&format=json",
        checkedAt: "2026-10-07", precisionLabel: "Approximate address-range placement; not an entrance or parking coordinate" },
      directionsTarget: { kind: "visitor-address", address: "25695 Mulberry Road, Webb City, MO 64870" },
      hours: { state: "verified", displayText: "October 10, 2026, noon–10 p.m." },
      listingExpiresAt: "2026-10-10T22:00:00-05:00", expiryBasis: "exact",
      sourceUrls: ["https://www.christinesvineyard.com/event-details/witches-day-out"],
      reviewRevision: "MO2026-final-four-verified-2026-10-08"
    },
    seasonalVisitNotes: [
      "October 10, 2026, noon–10 p.m.",
      "Seasonal social event with local vendors, drinks and food.",
      "Admission/ticket terms are not fully confirmed; check admission before committing.",
      "Location is approximate; Directions use the supported visitor address."
    ]
  },
  {
    id: "date-night-mo26-028-nevada-oktoberfest",
    name: "Nevada/Vernon County Oktoberfest Fall Festival",
    address: "1641 E Ashland Street, Nevada, MO 64772",
    cuisines: ["other"], cuisineLabel: "Other Halloween / Fall",
    priceLevel: null, rating: null, reviewCount: null, openingHours: null,
    phone: null, website: "https://www.nevada-mo.com/events",
    isChain: false, photoKey: "cafe", source: "catalog",
    activityTypes: ["other-halloween-fall"], moodLevel: 2,
    seasonalAvailability: {
      status: "confirmed", activeFrom: "2026-10-10", activeUntil: "2026-10-10",
      activeDates: ["2026-10-10"], checkedAt: "2026-10-08", revalidateAfter: "2026-10-10",
      timeZone: "America/Chicago", openNowPolicy: "never",
      endsAt: "2026-10-10T14:00:00-05:00", listingExpiresAt: "2026-10-10T14:00:00-05:00", seasonYear: 2026,
      sourceUrls: ["https://www.nevada-mo.com/events"],
      note: "Admission terms unconfirmed; no machine opening intervals."
    },
    seasonalListing: {
      contract: "ListingCompletenessV1", recordId: "MO26-028", seasonYear: 2026, timeZone: "America/Chicago",
      visitorAddress: "1641 E Ashland Street, Nevada, MO 64772",
      placement: { lat: 37.844012, lon: -94.335017, basis: "address-geocode",
        sourceUrl: "https://geocoding.geo.census.gov/geocoder/geographies/onelineaddress?address=1641+E+Ashland+Street%2C+Nevada%2C+MO&benchmark=Public_AR_Current&vintage=Current_Current&format=json",
        checkedAt: "2026-10-07", precisionLabel: "Approximate address-range placement; not an entrance or parking coordinate" },
      directionsTarget: { kind: "visitor-address", address: "1641 E Ashland Street, Nevada, MO 64772" },
      hours: { state: "verified", displayText: "October 10, 2026, 9 a.m.–2 p.m." },
      listingExpiresAt: "2026-10-10T14:00:00-05:00", expiryBasis: "exact",
      sourceUrls: ["https://www.nevada-mo.com/events"],
      reviewRevision: "MO2026-final-four-verified-2026-10-08"
    },
    seasonalVisitNotes: [
      "October 10, 2026, 9 a.m.–2 p.m. at the Vernon County Fairgrounds.",
      "Admission terms are not confirmed; check admission before committing.",
      "Location is approximate; Directions use the supported fairgrounds address.",
      "2026-only event; no recurrence is assumed."
    ]
  },
  {
    id: "date-night-mo26-074-osage-beach-fall-festival",
    name: "Osage Beach City Park Fall Festival",
    address: "950 Hatchery Road, Osage Beach, MO 65065",
    cuisines: ["other"], cuisineLabel: "Other Halloween / Fall",
    priceLevel: null, rating: null, reviewCount: null, openingHours: null,
    phone: null, website: "https://osagebeach-mo.gov/2325/Fall-Festival",
    isChain: false, photoKey: "cafe", source: "catalog",
    activityTypes: ["other-halloween-fall"], moodLevel: 2,
    seasonalAvailability: {
      status: "confirmed", activeFrom: "2026-10-10", activeUntil: "2026-10-10",
      activeDates: ["2026-10-10"], checkedAt: "2026-10-08", revalidateAfter: "2026-10-10",
      timeZone: "America/Chicago", openNowPolicy: "never",
      endsAt: "2026-10-10T17:00:00-05:00", listingExpiresAt: "2026-10-10T17:00:00-05:00", seasonYear: 2026,
      sourceUrls: ["https://osagebeach-mo.gov/2325/Fall-Festival"],
      note: "Official municipal event; visitor admission price not stated."
    },
    seasonalListing: {
      contract: "ListingCompletenessV1", recordId: "MO26-074", seasonYear: 2026, timeZone: "America/Chicago",
      visitorAddress: "950 Hatchery Road, Osage Beach, MO 65065",
      placement: { lat: 38.142296, lon: -92.616978, basis: "address-geocode",
        sourceUrl: "https://geocoding.geo.census.gov/geocoder/geographies/onelineaddress?address=950+Hatchery+Road%2C+Osage+Beach%2C+MO&benchmark=Public_AR_Current&vintage=Current_Current&format=json",
        checkedAt: "2026-10-07", precisionLabel: "Approximate address-range placement; not an entrance or parking coordinate" },
      directionsTarget: { kind: "visitor-address", address: "950 Hatchery Road, Osage Beach, MO 65065" },
      hours: { state: "verified", displayText: "October 10, 2026, 11 a.m.–5 p.m." },
      listingExpiresAt: "2026-10-10T17:00:00-05:00", expiryBasis: "exact",
      sourceUrls: ["https://osagebeach-mo.gov/2325/Fall-Festival"],
      reviewRevision: "MO2026-final-four-verified-2026-10-08"
    },
    seasonalVisitNotes: [
      "October 10, 2026, 11 a.m.–5 p.m.",
      "Family festival with food/concessions, vendors, bounce houses, animal shelters/rescues and pie-eating contests.",
      "The city event page does not state an admission price; check admission before committing.",
      "Location is approximate; Directions use the supported City Park address."
    ]
  },
  {
    id: "date-night-mo26-084-mcwilliams",
    name: "McWilliams Pumpkin Patch",
    address: "4007 County Road 6920, West Plains, MO 65775",
    cuisines: ["other"], cuisineLabel: "Other Halloween / Fall",
    priceLevel: null, rating: null, reviewCount: null, openingHours: null,
    phone: null, website: "https://www.visitmo.com/events/mcwilliams-pumpkin-patch-3",
    isChain: false, photoKey: "cafe", source: "catalog",
    activityTypes: ["other-halloween-fall"], moodLevel: 2,
    seasonalAvailability: {
      status: "confirmed", activeFrom: "2026-10-04", activeUntil: "2026-10-31",
      activeDates: ["2026-10-04","2026-10-06","2026-10-07","2026-10-08","2026-10-09","2026-10-10","2026-10-11","2026-10-13","2026-10-14","2026-10-15","2026-10-16","2026-10-17","2026-10-18","2026-10-20","2026-10-21","2026-10-22","2026-10-23","2026-10-24","2026-10-25","2026-10-27","2026-10-28","2026-10-29","2026-10-30","2026-10-31"],
      checkedAt: "2026-10-08", revalidateAfter: "2026-10-14", timeZone: "America/Chicago",
      openNowPolicy: "never", endsAt: "2026-10-31T17:00:00-05:00",
      listingExpiresAt: "2026-10-31T17:00:00-05:00", seasonYear: 2026,
      sourceUrls: ["https://www.visitmo.com/events/mcwilliams-pumpkin-patch-3","https://www.explorewestplains.com/calendar/"],
      note: "Imported as Other only; typical-season language does not establish 2026 corn-maze/pumpkin-patch category activity."
    },
    seasonalListing: {
      contract: "ListingCompletenessV1", recordId: "MO26-084", seasonYear: 2026, timeZone: "America/Chicago",
      visitorAddress: "4007 County Road 6920, West Plains, MO 65775",
      placement: { lat: 36.663875, lon: -91.937198, basis: "address-geocode",
        sourceUrl: "https://geocoding.geo.census.gov/geocoder/geographies/onelineaddress?address=4007+County+Road+6920%2C+West+Plains%2C+MO+65775&benchmark=Public_AR_Current&vintage=Current_Current&format=json",
        checkedAt: "2026-10-07", precisionLabel: "Approximate address-range placement; not an entrance or parking coordinate" },
      directionsTarget: { kind: "visitor-address", address: "4007 County Road 6920, West Plains, MO 65775" },
      hours: { state: "verified", displayText: "Oct. 4–31: Tue–Fri 2–5 p.m.; Sat 10 a.m.–5 p.m.; Sun noon–5 p.m.; closed Mondays." },
      listingExpiresAt: "2026-10-31T17:00:00-05:00", expiryBasis: "exact",
      sourceUrls: ["https://www.visitmo.com/events/mcwilliams-pumpkin-patch-3","https://www.explorewestplains.com/calendar/"],
      reviewRevision: "MO2026-final-four-verified-2026-10-08"
    },
    seasonalVisitNotes: [
      "October 4–31, 2026: Tue–Fri 2–5 p.m.; Sat 10 a.m.–5 p.m.; Sun noon–5 p.m.; closed Mondays.",
      "$7 weekdays / $15 weekends. Parties, tables/pavilions and bonfires have separate reservation requirements.",
      "Partially wheelchair accessible; no smoking. Weather can affect seasonal operation.",
      "Listed as Other Halloween / Fall for 2026; typical-season corn-maze/pumpkin activities are not presented as guaranteed current features.",
      "Location is approximate; Directions use the supported visitor address."
    ]
  }
];

export const MISSOURI_2026_FINAL_FOUR_CATALOG =
  MISSOURI_2026_FINAL_FOUR_LISTINGS
    .map(seasonalListingToPlace)
    .filter((place): place is DateNightPlace => Boolean(place));
