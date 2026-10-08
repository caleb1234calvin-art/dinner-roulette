import type { DateNightPlace } from "./types";
import { seasonalListingToPlace, type SeasonalListing } from "./listing";

/** Five runtime-ready Tier A records from the three-source Missouri delta sweep.
 * Factual verification: audit/missouri-autonomous-active15-independent-verification-2026-10-08.md
 * Hell Harvest remains factual PASS / runtime placement HOLD and is intentionally absent. */
export const MISSOURI_2026_THREE_SOURCE_TIER_A_LISTINGS:
  (Omit<DateNightPlace, "lat" | "lon"> & { seasonalListing: SeasonalListing })[] = [
  {
    id: "date-night-mo26-delta-edge-of-hell",
    name: "Edge of Hell Haunted Attraction",
    address: "1300 W 12th St, Kansas City, MO 64101",
    cuisines: ["other"], cuisineLabel: "Haunted House",
    priceLevel: null, rating: null, reviewCount: null, openingHours: null,
    phone: null, website: "https://www.edgeofhell.com/",
    isChain: false, photoKey: "cafe", source: "catalog",
    activityTypes: ["haunted-house"], moodLevel: 3,
    seasonalAvailability: {
      status: "confirmed", activeFrom: "2026-10-02", activeUntil: "2026-10-31",
      activeDates: ["2026-10-02","2026-10-03","2026-10-09","2026-10-10","2026-10-15","2026-10-16","2026-10-17","2026-10-22","2026-10-23","2026-10-24","2026-10-29","2026-10-30","2026-10-31"],
      checkedAt: "2026-10-08", revalidateAfter: "2026-10-14", timeZone: "America/Chicago",
      openNowPolicy: "never", listingExpiresAt: "2026-11-01T00:30:00-05:00", seasonYear: 2026,
      sourceUrls: ["https://www.edgeofhell.com/","https://www.visitkc.com/events/edge-of-hell-haunted-attraction-2026-season/"],
      note: "Mandatory Central Waiver Station first stop; no machine opening intervals."
    },
    seasonalListing: {
      contract: "ListingCompletenessV1", recordId: "DELTA-EDGE-2026", seasonYear: 2026, timeZone: "America/Chicago",
      visitorAddress: "1300 W 12th St, Kansas City, MO 64101",
      placement: { lat: 39.100665528955, lon: -94.599950797359, basis: "address-geocode",
        sourceUrl: "https://geocoding.geo.census.gov/geocoder/geographies/onelineaddress?address=1300+W+12th+St%2C+Kansas+City%2C+MO+64101&benchmark=Public_AR_Current&vintage=Current_Current&format=json",
        checkedAt: "2026-10-08", precisionLabel: "Approximate attraction address; not the required first check-in stop" },
      directionsTarget: { kind: "visitor-address", address: "1300 W 13th St, Kansas City, MO 64102" },
      hours: { state: "verified", displayText: "Thu 7:30–11:30 p.m.; Fri 7:30 p.m.–midnight; Sat 6:30 p.m.–12:30 a.m. on listed 2026 nights." },
      listingExpiresAt: "2026-11-01T00:30:00-05:00", expiryBasis: "exact",
      sourceUrls: ["https://www.edgeofhell.com/","https://www.visitkc.com/events/edge-of-hell-haunted-attraction-2026-season/"],
      reviewRevision: "MO2026-three-source-tier-a-verified-2026-10-08"
    },
    seasonalVisitNotes: [
      "Listed nights October 2–31, 2026. Thu 7:30–11:30 p.m.; Fri 7:30 p.m.–midnight; Sat 6:30 p.m.–12:30 a.m.",
      "Required first stop: Central Waiver Station, 1300 W 13th St. Arrive one hour before your scheduled entry.",
      "Visit KC lists tickets from $40+. Check current ticket terms before committing.",
      "Map placement is approximate and refers to the attraction; Directions intentionally lead to the required waiver station first."
    ]
  },
  {
    id: "date-night-mo26-delta-creepyworld",
    name: "Creepyworld",
    address: "1400 S Old Highway 141, Fenton, MO 63026",
    cuisines: ["other"], cuisineLabel: "Haunted House",
    priceLevel: null, rating: null, reviewCount: null, openingHours: null,
    phone: null, website: "https://www.creepyworld.com/",
    isChain: false, photoKey: "cafe", source: "catalog",
    activityTypes: ["haunted-house"], moodLevel: 3,
    seasonalAvailability: {
      status: "confirmed", activeFrom: "2026-10-02", activeUntil: "2026-11-13",
      activeDates: ["2026-10-02","2026-10-03","2026-10-04","2026-10-09","2026-10-10","2026-10-11","2026-10-16","2026-10-17","2026-10-18","2026-10-23","2026-10-24","2026-10-25","2026-10-26","2026-10-27","2026-10-28","2026-10-29","2026-10-30","2026-10-31","2026-11-01","2026-11-07","2026-11-13"],
      checkedAt: "2026-10-08", revalidateAfter: "2026-10-14", timeZone: "America/Chicago",
      openNowPolicy: "never", endsAt: "2026-11-13T22:00:00-06:00", listingExpiresAt: "2026-11-13T22:00:00-06:00", seasonYear: 2026,
      sourceUrls: ["https://www.creepyworld.com/","https://www.creepyworld.com/haunted-house-in-stlouis-missouri-creepyworld/?id=cms%2Foperations-dates","https://scarefest.fearticket.com/"],
      note: "Operator schedule contains overlapping time text; dates are source-supported but machine opening intervals remain disabled."
    },
    seasonalListing: {
      contract: "ListingCompletenessV1", recordId: "DELTA-CREEPYWORLD-2026", seasonYear: 2026, timeZone: "America/Chicago",
      visibility: "listing-lifecycle",
      visitorAddress: "1400 S Old Highway 141, Fenton, MO 63026",
      placement: { lat: 38.484571437462, lon: -90.442969239594, basis: "address-geocode",
        sourceUrl: "https://geocoding.geo.census.gov/geocoder/geographies/onelineaddress?address=1400+S+Old+Highway+141%2C+Fenton%2C+MO+63026&benchmark=Public_AR_Current&vintage=Current_Current&format=json",
        checkedAt: "2026-10-08", precisionLabel: "Approximate address-range placement; not an entrance or parking coordinate" },
      directionsTarget: { kind: "visitor-address", address: "1400 S Old Highway 141, Fenton, MO 63026" },
      hours: { state: "partial", displayText: "2026 operator calendar lists date-specific hours through Nov. 13; overlapping October time text is retained as schedule uncertainty." },
      listingExpiresAt: "2026-11-13T22:00:00-06:00", expiryBasis: "exact",
      sourceUrls: ["https://www.creepyworld.com/","https://www.creepyworld.com/haunted-house-in-stlouis-missouri-creepyworld/?id=cms%2Foperations-dates","https://scarefest.fearticket.com/"],
      reviewRevision: "MO2026-three-source-tier-a-verified-2026-10-08"
    },
    seasonalVisitNotes: [
      "Current 2026 operator calendar lists dates from October 2 through November 13; check the date-specific hours before going.",
      "Creepyworld advertises 13 attractions in one location, including haunted mazes and a haunted hayride.",
      "No refunds; tickets are transferable. Present your ticket within 15 minutes of closing to guarantee entry.",
      "Metal detectors and a no-weapons policy apply. Location is approximate.",
      "This curated listing can remain visible after the Halloween layer ends because its verified 2026 dates continue into November."
    ]
  },
  {
    id: "date-night-mo26-delta-darkness",
    name: "The Darkness",
    address: "1525 South 8th Street, St. Louis, MO 63104",
    cuisines: ["other"], cuisineLabel: "Haunted House",
    priceLevel: null, rating: null, reviewCount: null, openingHours: null,
    phone: null, website: "https://www.thedarkness.com/",
    isChain: false, photoKey: "cafe", source: "catalog",
    activityTypes: ["haunted-house"], moodLevel: 3,
    seasonalAvailability: {
      status: "confirmed", activeFrom: "2026-09-19", activeUntil: "2026-11-13",
      activeDates: ["2026-09-19","2026-10-02","2026-10-03","2026-10-04","2026-10-09","2026-10-10","2026-10-11","2026-10-16","2026-10-17","2026-10-18","2026-10-23","2026-10-24","2026-10-25","2026-10-26","2026-10-27","2026-10-28","2026-10-29","2026-10-30","2026-10-31","2026-11-01","2026-11-07","2026-11-13"],
      checkedAt: "2026-10-08", revalidateAfter: "2026-10-14", timeZone: "America/Chicago",
      openNowPolicy: "never", endsAt: "2026-11-13T22:00:00-06:00", listingExpiresAt: "2026-11-13T22:00:00-06:00", seasonYear: 2026,
      sourceUrls: ["https://www.thedarkness.com/","https://www.thedarkness.com/dates-and-times-page","https://scarefest.fearticket.com/"],
      note: "Operator calendar contains overlapping Oct. 16–17 time text; no machine opening intervals."
    },
    seasonalListing: {
      contract: "ListingCompletenessV1", recordId: "DELTA-DARKNESS-2026", seasonYear: 2026, timeZone: "America/Chicago",
      visibility: "listing-lifecycle",
      visitorAddress: "1525 South 8th Street, St. Louis, MO 63104",
      placement: { lat: 38.61118574065, lon: -90.200631908052, basis: "address-geocode",
        sourceUrl: "https://geocoding.geo.census.gov/geocoder/geographies/onelineaddress?address=1525+South+8th+Street%2C+St+Louis%2C+MO+63104&benchmark=Public_AR_Current&vintage=Current_Current&format=json",
        checkedAt: "2026-10-08", precisionLabel: "Approximate address-range placement; not an entrance or parking coordinate" },
      directionsTarget: { kind: "visitor-address", address: "1525 South 8th Street, St. Louis, MO 63104" },
      hours: { state: "partial", displayText: "2026 operator calendar lists date-specific hours through Nov. 13; Oct. 16–17 contain conflicting start-time text, so check current hours." },
      listingExpiresAt: "2026-11-13T22:00:00-06:00", expiryBasis: "exact",
      sourceUrls: ["https://www.thedarkness.com/","https://www.thedarkness.com/dates-and-times-page","https://scarefest.fearticket.com/"],
      reviewRevision: "MO2026-three-source-tier-a-verified-2026-10-08"
    },
    seasonalVisitNotes: [
      "The 2026 operator calendar runs from September into November, with November 13 listed as the final night to use unused tickets.",
      "October 16–17 have conflicting start-time text on the operator schedule; check current hours before going.",
      "No refunds; tickets are transferable. Present your ticket within 15 minutes of closing to guarantee entry.",
      "No weapons; metal detection is used. Teen drop-offs require a parent available for pickup.",
      "This curated listing can remain visible after the Halloween layer ends because its verified 2026 dates continue into November."
    ]
  },
  {
    id: "date-night-mo26-delta-haunted-river-float",
    name: "The Haunted River Float at Ruby’s Landing River Resort",
    address: "22474 Restful Lane, Waynesville, MO 65583",
    cuisines: ["other"], cuisineLabel: "Other Halloween / Fall",
    priceLevel: null, rating: null, reviewCount: null, openingHours: null,
    phone: "573-855-9567", website: "https://rubyslanding.com/",
    isChain: false, photoKey: "cafe", source: "catalog",
    activityTypes: ["other-halloween-fall"], moodLevel: 3,
    seasonalAvailability: {
      status: "confirmed", activeFrom: "2026-10-03", activeUntil: "2026-10-31",
      activeDates: ["2026-10-03","2026-10-10","2026-10-16","2026-10-17","2026-10-23","2026-10-24","2026-10-30","2026-10-31"],
      checkedAt: "2026-10-08", revalidateAfter: "2026-10-14", timeZone: "America/Chicago",
      openNowPolicy: "never", endsAt: "2026-11-01T00:00:00-05:00", listingExpiresAt: "2026-11-01T00:00:00-05:00", seasonYear: 2026,
      sourceUrls: ["https://visitpulaskicounty.org/calendar-of-events/","https://visitpulaskicounty.org/stories?rec_id=463","https://rubyslanding.com/"],
      note: "Only explicitly enumerated 2026 DMO dates are active; no recurrence inferred."
    },
    seasonalListing: {
      contract: "ListingCompletenessV1", recordId: "DELTA-HAUNTED-RIVER-2026", seasonYear: 2026, timeZone: "America/Chicago",
      visitorAddress: "22474 Restful Lane, Waynesville, MO 65583",
      placement: { lat: 37.871525332879, lon: -92.250392066473, basis: "address-geocode",
        sourceUrl: "https://geocoding.geo.census.gov/geocoder/geographies/onelineaddress?address=22474+Restful+Lane%2C+Waynesville%2C+MO+65583&benchmark=Public_AR_Current&vintage=Current_Current&format=json",
        checkedAt: "2026-10-08", precisionLabel: "Approximate address-range placement; not an entrance or parking coordinate" },
      directionsTarget: { kind: "visitor-address", address: "22474 Restful Lane, Waynesville, MO 65583" },
      hours: { state: "verified", displayText: "3 p.m.–midnight on the explicitly listed 2026 dates." },
      listingExpiresAt: "2026-11-01T00:00:00-05:00", expiryBasis: "exact",
      sourceUrls: ["https://visitpulaskicounty.org/calendar-of-events/","https://visitpulaskicounty.org/stories?rec_id=463","https://rubyslanding.com/"],
      reviewRevision: "MO2026-three-source-tier-a-verified-2026-10-08"
    },
    seasonalVisitNotes: [
      "Verified 2026 dates include October 3, 10, 16–17, 23–24 and 30–31; 3 p.m.–midnight.",
      "Pulaski County tourism describes a hayride to a dark river float, followed by a haunted trail/forest/cemetery and a 26-room haunted house.",
      "Only explicitly listed dates are treated as active; no Friday/Saturday recurrence is inferred.",
      "Location is approximate; Directions use the supported resort address."
    ]
  },
  {
    id: "date-night-mo26-delta-fear-bloody-timber",
    name: "Fear the Bloody Timber Haunted Attraction & Corn Maze",
    address: "8518 County Road 7190, West Plains, MO 65775",
    cuisines: ["other"], cuisineLabel: "Haunted House / Corn Maze",
    priceLevel: null, rating: null, reviewCount: null, openingHours: null,
    phone: "417-247-8281", website: null,
    isChain: false, photoKey: "cafe", source: "catalog",
    activityTypes: ["haunted-house","corn-maze"], moodLevel: 3,
    seasonalAvailability: {
      status: "confirmed", activeFrom: "2026-10-09", activeUntil: "2026-10-31",
      activeDates: ["2026-10-09","2026-10-10","2026-10-16","2026-10-17","2026-10-23","2026-10-24","2026-10-30","2026-10-31"],
      checkedAt: "2026-10-08", revalidateAfter: "2026-10-14", timeZone: "America/Chicago",
      openNowPolicy: "never", endsAt: "2026-10-31T23:00:00-05:00", listingExpiresAt: "2026-10-31T23:00:00-05:00", seasonYear: 2026,
      sourceUrls: ["https://www.explorewestplains.com/calendar/", "https://www.explorewestplains.com/calendar/action~agenda/exact_date~10-23-2026/"],
      note: "Only explicitly observed 2026 DMO dates are active; prior price text is not promoted without fresh current binding."
    },
    seasonalListing: {
      contract: "ListingCompletenessV1", recordId: "DELTA-FEAR-BLOODY-TIMBER-2026", seasonYear: 2026, timeZone: "America/Chicago",
      visitorAddress: "8518 County Road 7190, West Plains, MO 65775",
      placement: { lat: 36.742952329743, lon: -92.037362377697, basis: "address-geocode",
        sourceUrl: "https://geocoding.geo.census.gov/geocoder/geographies/onelineaddress?address=8518+County+Road+7190%2C+West+Plains%2C+MO+65775&benchmark=Public_AR_Current&vintage=Current_Current&format=json",
        checkedAt: "2026-10-08", precisionLabel: "Approximate address-range placement; not an entrance or parking coordinate" },
      directionsTarget: { kind: "visitor-address", address: "8518 County Road 7190, West Plains, MO 65775" },
      hours: { state: "verified", displayText: "7–11 p.m. on the explicitly observed 2026 dates." },
      listingExpiresAt: "2026-10-31T23:00:00-05:00", expiryBasis: "exact",
      sourceUrls: ["https://www.explorewestplains.com/calendar/", "https://www.explorewestplains.com/calendar/action~agenda/exact_date~10-23-2026/"],
      reviewRevision: "MO2026-three-source-tier-a-verified-2026-10-08"
    },
    seasonalVisitNotes: [
      "Verified 2026 dates: October 9–10, 16–17, 23–24 and 30–31, 7–11 p.m.",
      "Current DMO classification: Haunted Attraction & Corn Maze.",
      "Call 417-247-8281 or check the attraction’s current Facebook updates before going.",
      "Only explicitly observed 2026 dates are treated as active. Location is approximate."
    ]
  }
];

export const MISSOURI_2026_THREE_SOURCE_TIER_A_CATALOG =
  MISSOURI_2026_THREE_SOURCE_TIER_A_LISTINGS
    .map(seasonalListingToPlace)
    .filter((place): place is DateNightPlace => Boolean(place));
