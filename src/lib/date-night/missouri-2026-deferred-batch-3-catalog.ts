import type { DateNightPlace } from "./types";
import { seasonalListingToPlace, type SeasonalListing } from "./listing";

/** Five independently cleared 2026 deferred projections.
 * Verification: audit/missouri-autonomous-active15-independent-verification-2026-10-08.md
 * Display schedules never become machine opening intervals; Open Now stays fail-closed. */
export const MISSOURI_2026_DEFERRED_BATCH_3_LISTINGS:
  (Omit<DateNightPlace, "lat" | "lon"> & { seasonalListing: SeasonalListing })[] = [
  {
    id: "date-night-mo26-036-monster-corn-maze",
    name: "Monster Corn Maze",
    address: "711 State Route AM, Cabool, MO 65689",
    cuisines: ["other"], cuisineLabel: "Haunted House / Corn Maze",
    priceLevel: null, rating: null, reviewCount: null, openingHours: null,
    phone: "417-926-8688", website: "https://www.monstercornmaze.com/",
    isChain: false, photoKey: "cafe", source: "catalog",
    activityTypes: ["haunted-house", "corn-maze"], moodLevel: 3,
    seasonalAvailability: {
      status: "confirmed", activeFrom: "2026-09-18", activeUntil: "2026-10-30",
      activeDates: ["2026-09-18","2026-09-19","2026-09-25","2026-09-26","2026-10-02","2026-10-03","2026-10-09","2026-10-10","2026-10-16","2026-10-17","2026-10-23","2026-10-24","2026-10-30"],
      checkedAt: "2026-10-08", revalidateAfter: "2026-10-14", timeZone: "America/Chicago",
      openNowPolicy: "never", listingExpiresAt: "2026-10-31T00:00:00-05:00", seasonYear: 2026,
      sourceUrls: ["https://www.monstercornmaze.com/","https://www.monstercornmaze.com/faq.htm"],
      note: "Reviewed display-only schedule; no machine opening intervals."
    },
    seasonalListing: {
      contract: "ListingCompletenessV1", recordId: "MO26-036", seasonYear: 2026, timeZone: "America/Chicago",
      visitorAddress: "711 State Route AM, Cabool, MO 65689",
      placement: { lat: 37.026841, lon: -92.074599, basis: "address-geocode",
        sourceUrl: "https://geocoding.geo.census.gov/geocoder/geographies/onelineaddress?address=711+State+Route+AM%2C+Cabool%2C+MO+65689&benchmark=Public_AR_Current&vintage=Current_Current&format=json",
        checkedAt: "2026-10-07", precisionLabel: "Approximate address-range interpolation; not an entrance or parking coordinate" },
      directionsTarget: { kind: "visitor-address", address: "711 State Route AM, Cabool, MO 65689" },
      hours: { state: "partial", displayText: "Fri/Sat: gates 6:30 p.m.; maze after dark; last tickets 11 p.m.; final close after the last guest exits." },
      listingExpiresAt: "2026-10-31T00:00:00-05:00", expiryBasis: "date-only",
      sourceUrls: ["https://www.monstercornmaze.com/","https://www.monstercornmaze.com/faq.htm"],
      reviewRevision: "MO2026-deferred-batch3-verified-2026-10-08"
    },
    seasonalVisitNotes: [
      "Fridays and Saturdays, September 18–October 30, 2026. Gates open 6:30 p.m.; maze starts after dark; last tickets 11 p.m.; final exit time varies.",
      "$20 general admission; $30 VIP timed reservation. VIP slots run 8–11 p.m.; arrive promptly.",
      "Ages 13 and under require an adult at all times. Maze is not handicap accessible.",
      "No pets, smoking, alcohol/illicit drugs, weapons, backpacks/purses or flashlights. Rough terrain, stairs and flashing lights are part of the attraction.",
      "Weather may close the maze. Location is approximate; Directions use the operator's visitor address."
    ]
  },
  {
    id: "date-night-mo26-058-beast",
    name: "Beast Haunted House",
    address: "1401 W 13th St, Suite B, Kansas City, MO 64102",
    cuisines: ["other"], cuisineLabel: "Haunted House",
    priceLevel: null, rating: null, reviewCount: null, openingHours: null,
    phone: null, website: "https://www.kcbeast.com/",
    isChain: false, photoKey: "cafe", source: "catalog",
    activityTypes: ["haunted-house"], moodLevel: 3,
    seasonalAvailability: {
      status: "confirmed", activeFrom: "2026-10-02", activeUntil: "2026-10-31",
      activeDates: ["2026-10-02","2026-10-03","2026-10-09","2026-10-10","2026-10-15","2026-10-16","2026-10-17","2026-10-22","2026-10-23","2026-10-24","2026-10-29","2026-10-30","2026-10-31"],
      checkedAt: "2026-10-08", revalidateAfter: "2026-10-14", timeZone: "America/Chicago",
      openNowPolicy: "never", listingExpiresAt: "2026-11-01T00:30:00-05:00", seasonYear: 2026,
      sourceUrls: ["https://www.kcbeast.com/","https://www.kcbeast.com/faq","https://www.kcbeast.com/safety-security","https://www.visitkc.com/events/beast-haunted-attraction-2026/", "https://www.visitkc.com/events/beast-haunted-house/"],
      note: "Mandatory Central Waiver Station check-in precedes attraction entry."
    },
    seasonalListing: {
      contract: "ListingCompletenessV1", recordId: "MO26-058", seasonYear: 2026, timeZone: "America/Chicago",
      visitorAddress: "1401 W 13th St, Suite B, Kansas City, MO 64102",
      placement: { lat: 39.09963, lon: -94.60158, basis: "address-geocode",
        sourceUrl: "https://geocoding.geo.census.gov/geocoder/geographies/onelineaddress?address=1401+W+13th+Street%2C+Suite+B%2C+Kansas+City%2C+MO+64102&benchmark=Public_AR_Current&vintage=Current_Current&format=json",
        checkedAt: "2026-10-07", precisionLabel: "Approximate attraction address; not the required first check-in stop" },
      directionsTarget: { kind: "visitor-address", address: "1300 W 13th St, Kansas City, MO 64102" },
      hours: { state: "verified", displayText: "Thu 7:30–11:30 p.m.; Fri 7:30 p.m.–midnight; Sat 6:30 p.m.–12:30 a.m. on listed 2026 nights." },
      listingExpiresAt: "2026-11-01T00:30:00-05:00", expiryBasis: "exact",
      sourceUrls: ["https://www.kcbeast.com/","https://www.kcbeast.com/faq","https://www.kcbeast.com/safety-security","https://www.visitkc.com/events/beast-haunted-attraction-2026/", "https://www.visitkc.com/events/beast-haunted-house/"],
      reviewRevision: "MO2026-deferred-batch3-verified-2026-10-08"
    },
    seasonalVisitNotes: [
      "Listed nights October 2–31, 2026. Thu 7:30–11:30 p.m.; Fri 7:30 p.m.–midnight; Sat 6:30 p.m.–12:30 a.m.",
      "Required first stop: Central Waiver Station, 1300 W 13th St. Arrive at least one hour before your timed entry.",
      "Waiver/video verification and a security bracelet are required before attraction entry. Metal detector screening follows.",
      "Minors need a parent/guardian age 18+ with valid ID to sign the waiver in person; that adult does not have to enter the attraction.",
      "No weapons or costumes. Map placement is approximate and refers to the attraction; Directions intentionally lead to the required waiver station first."
    ]
  },
  {
    id: "date-night-mo26-069-dead-factory",
    name: "Dead Factory Haunted House",
    address: "2100 E Liberty St, Mexico, MO 65265",
    cuisines: ["other"], cuisineLabel: "Haunted House",
    priceLevel: null, rating: null, reviewCount: null, openingHours: null,
    phone: null, website: "https://deadfactory.com/",
    isChain: false, photoKey: "cafe", source: "catalog",
    activityTypes: ["haunted-house"], moodLevel: 3,
    seasonalAvailability: {
      status: "confirmed", activeFrom: "2026-09-25", activeUntil: "2026-10-31",
      activeDates: ["2026-09-25","2026-09-26","2026-10-02","2026-10-03","2026-10-09","2026-10-10","2026-10-16","2026-10-17","2026-10-23","2026-10-24","2026-10-30","2026-10-31"],
      checkedAt: "2026-10-08", revalidateAfter: "2026-10-14", timeZone: "America/Chicago",
      openNowPolicy: "never", endsAt: "2026-10-31T23:00:00-05:00", listingExpiresAt: "2026-10-31T23:00:00-05:00", seasonYear: 2026,
      sourceUrls: ["https://deadfactory.com/"], note: "Current first-party 2026 schedule; explicit free onsite parking."
    },
    seasonalListing: {
      contract: "ListingCompletenessV1", recordId: "MO26-069", seasonYear: 2026, timeZone: "America/Chicago",
      visitorAddress: "2100 E Liberty St, Mexico, MO 65265",
      placement: { lat: 39.163136, lon: -91.85066, basis: "address-geocode",
        sourceUrl: "https://geocoding.geo.census.gov/geocoder/geographies/onelineaddress?address=2100+E+Liberty+Street%2C+Mexico%2C+MO+65265&benchmark=Public_AR_Current&vintage=Current_Current&format=json",
        checkedAt: "2026-10-07", precisionLabel: "Approximate address-range placement; operator advertises free onsite parking" },
      directionsTarget: { kind: "visitor-address", address: "2100 E Liberty St, Mexico, MO 65265" },
      hours: { state: "verified", displayText: "Fridays and Saturdays, 7–11 p.m." },
      listingExpiresAt: "2026-10-31T23:00:00-05:00", expiryBasis: "exact",
      sourceUrls: ["https://deadfactory.com/"], reviewRevision: "MO2026-deferred-batch3-verified-2026-10-08"
    },
    seasonalVisitNotes: [
      "Fridays and Saturdays, September 25–October 31, 2026, 7–11 p.m.",
      "$25 per person for all ages at the ticket booth; cash, credit and debit accepted. Operator states no added ticket taxes or fees.",
      "Children under 13 must be accompanied by an adult. Indoor waiting area; attraction runs rain or shine.",
      "About a 25–30 minute self-guided walkthrough. No touching; actors do not touch guests.",
      "Operator advertises free onsite parking. Map placement remains approximate."
    ]
  },
  {
    id: "date-night-mo26-071-pomme-de-terror",
    name: "Pomme de Terre State Park — Pomme de Terror",
    address: "Hermitage Area Campground, Pomme de Terre State Park, Hermitage, MO",
    cuisines: ["other"], cuisineLabel: "Other Halloween / Fall",
    priceLevel: null, rating: null, reviewCount: null, openingHours: null,
    phone: null, website: "https://mostateparks.com/event/pomme-de-terror-2026",
    isChain: false, photoKey: "cafe", source: "catalog",
    activityTypes: ["other-halloween-fall"], moodLevel: 2,
    seasonalAvailability: {
      status: "confirmed", activeFrom: "2026-10-16", activeUntil: "2026-10-17",
      activeDates: ["2026-10-16","2026-10-17"], checkedAt: "2026-10-08", revalidateAfter: "2026-10-14",
      timeZone: "America/Chicago", openNowPolicy: "never",
      listingExpiresAt: "2026-10-18T00:00:00-05:00", seasonYear: 2026,
      sourceUrls: ["https://mostateparks.com/event/pomme-de-terror-2026","https://mostateparks.com/park/pomme-de-terre-state-park"],
      note: "Activity-specific times only; do not infer continuous event opening."
    },
    seasonalListing: {
      contract: "ListingCompletenessV1", recordId: "MO26-071", seasonYear: 2026, timeZone: "America/Chicago",
      visitorAddress: "Hermitage Area Campground, Pomme de Terre State Park, Hermitage, MO",
      placement: { lat: 37.883074, lon: -93.303521, basis: "verified-arrival",
        sourceUrl: "https://mostateparks.com/event/pomme-de-terror-2026", checkedAt: "2026-10-08",
        precisionLabel: "Official Hermitage Area Campground event location" },
      directionsTarget: { kind: "verified-point", lat: 37.883074, lon: -93.303521, description: "Hermitage Area Campground event location" },
      ridesharePolicy: "external-picker",
      hours: { state: "partial", displayText: "Oct. 16 naturalist program 7:30 p.m.; Oct. 17 activities run at separate times through trick-or-treating 5–7 p.m." },
      listingExpiresAt: "2026-10-18T00:00:00-05:00", expiryBasis: "date-only",
      sourceUrls: ["https://mostateparks.com/event/pomme-de-terror-2026","https://mostateparks.com/park/pomme-de-terre-state-park"],
      reviewRevision: "MO2026-deferred-batch3-verified-2026-10-08"
    },
    seasonalVisitNotes: [
      "October 16–17, 2026 at the Hermitage Area Campground. Friday naturalist program starts 7:30 p.m.",
      "Saturday: wildlife show 11 a.m.; ranger lunch noon; scientist contest 1–3 p.m.; pumpkin contest 2–3 p.m.; costume contest 3:30 p.m.; trick-or-treating 5–7 p.m.",
      "Free and open to the public. Camping guests still pay normal camping fees.",
      "Day-use visitors may join all activities except the campground decorating contest.",
      "Directions use the official Hermitage campground event point. Do not use the Pittsburg-side park office."
    ]
  },
  {
    id: "date-night-mo26-118-haunted-hall-horror",
    name: "Haunted Hall of Horror at A. C. Brase Arena",
    address: "410 Kiwanis Drive, Cape Girardeau, MO 63701",
    cuisines: ["other"], cuisineLabel: "Haunted House",
    priceLevel: null, rating: null, reviewCount: null, openingHours: null,
    phone: null, website: "https://www.cityofcapegirardeau.org/departments/parks-and-recreation/special-events/haunted-hall-of-horror/",
    isChain: false, photoKey: "cafe", source: "catalog",
    activityTypes: ["haunted-house"], moodLevel: 3,
    seasonalAvailability: {
      status: "confirmed", activeFrom: "2026-10-09", activeUntil: "2026-10-31",
      activeDates: ["2026-10-09","2026-10-10","2026-10-16","2026-10-17","2026-10-23","2026-10-24","2026-10-30","2026-10-31"],
      checkedAt: "2026-10-08", revalidateAfter: "2026-10-14", timeZone: "America/Chicago",
      openNowPolicy: "never", endsAt: "2026-10-31T22:00:00-05:00", listingExpiresAt: "2026-10-31T22:00:00-05:00", seasonYear: 2026,
      sourceUrls: ["https://www.cityofcapegirardeau.org/departments/parks-and-recreation/special-events/haunted-hall-of-horror/","https://www.kfvs12.com/2026/09/10/haunted-hall-horror-returns-cape-girardeau-35th-year/"],
      note: "Official city admission copy controls; secondary 2026 report differs on free-child cutoff."
    },
    seasonalListing: {
      contract: "ListingCompletenessV1", recordId: "MO26-118", seasonYear: 2026, timeZone: "America/Chicago",
      visitorAddress: "410 Kiwanis Drive, Cape Girardeau, MO 63701",
      placement: { lat: 37.313042334782, lon: -89.558803512232, basis: "address-geocode",
        sourceUrl: "https://geocoding.geo.census.gov/geocoder/geographies/onelineaddress?address=410+Kiwanis+Drive%2C+Cape+Girardeau%2C+MO+63701&benchmark=Public_AR_Current&vintage=Current_Current&format=json",
        checkedAt: "2026-10-07", precisionLabel: "Approximate address-range placement; not an entrance or parking coordinate" },
      directionsTarget: { kind: "visitor-address", address: "410 Kiwanis Drive, Cape Girardeau, MO 63701" },
      hours: { state: "verified", displayText: "7–10 p.m. on October 9–10, 16–17, 23–24 and 30–31, 2026." },
      listingExpiresAt: "2026-10-31T22:00:00-05:00", expiryBasis: "exact",
      sourceUrls: ["https://www.cityofcapegirardeau.org/departments/parks-and-recreation/special-events/haunted-hall-of-horror/","https://www.kfvs12.com/2026/09/10/haunted-hall-horror-returns-cape-girardeau-35th-year/"],
      reviewRevision: "MO2026-deferred-batch3-verified-2026-10-08"
    },
    seasonalVisitNotes: [
      "October 9–10, 16–17, 23–24 and 30–31, 2026, 7–10 p.m.",
      "$12 per person; current city page says ages 5 and under free. October 31 student night is $8 with valid student ID.",
      "A 2026 secondary report says ages 4 and under free, so verify the child cutoff before purchase.",
      "All ages invited; children 12 and under must be accompanied by an adult. Glow sticks are $1.",
      "This is the Parks & Recreation haunted house at A. C. Brase Arena, not the separate S.T.A.R. Haunted Hall event at the 4H Building. Location is approximate."
    ]
  }
];

export const MISSOURI_2026_DEFERRED_BATCH_3_CATALOG =
  MISSOURI_2026_DEFERRED_BATCH_3_LISTINGS
    .map(seasonalListingToPlace)
    .filter((place): place is DateNightPlace => Boolean(place));
