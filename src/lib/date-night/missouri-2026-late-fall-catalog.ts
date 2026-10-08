import type { DateNightPlace } from "./types";
import { seasonalListingToPlace, type SeasonalListing } from "./listing";

/** Curated late-fall record whose independently verified lifecycle extends past
 * the Halloween UI window. It may remain discoverable through Anything only;
 * it never extends live seasonal provider discovery or the Halloween chips. */
export const MISSOURI_2026_LATE_FALL_LISTINGS:
  (Omit<DateNightPlace, "lat" | "lon"> & { seasonalListing: SeasonalListing })[] = [
  {
    id: "date-night-mo26-085-brookdale-farms",
    name: "Brookdale Farms Fall Festival",
    address: "8004 Twin Rivers Road, Eureka, MO 63025",
    cuisines: ["other"], cuisineLabel: "Corn Maze / Pumpkin Patch",
    priceLevel: null, rating: null, reviewCount: null, openingHours: null,
    phone: null, website: "https://www.brookdalefarms.com/fall-festival",
    isChain: false, photoKey: "cafe", source: "catalog",
    activityTypes: ["corn-maze", "pumpkin-patch"], moodLevel: 2,
    seasonalAvailability: {
      status: "confirmed", activeFrom: "2026-09-11", activeUntil: "2026-11-08",
      checkedAt: "2026-10-08", revalidateAfter: "2026-10-14", timeZone: "America/Chicago",
      openNowPolicy: "never", endsAt: "2026-11-08T18:00:00-06:00", listingExpiresAt: "2026-11-08T18:00:00-06:00", seasonYear: 2026,
      sourceUrls: ["https://www.brookdalefarms.com/events-1/fall-festival-2026-brookdale-farms-2026-11-08-10-00",
        "https://www.brookdalefarms.com/fall-festival",
        "https://www.brookdalefarms.com/events-calendar"
      ],
      note: "Verified 2026 season extends through Nov. 8. Partial display schedule only; no machine opening intervals."
    },
    seasonalListing: {
      contract: "ListingCompletenessV1", recordId: "MO26-085", seasonYear: 2026,
      timeZone: "America/Chicago", visibility: "listing-lifecycle",
      visitorAddress: "8004 Twin Rivers Road, Eureka, MO 63025",
      placement: { lat: 38.465355, lon: -90.616517, basis: "address-geocode",
        sourceUrl: "https://geocoding.geo.census.gov/geocoder/geographies/onelineaddress?address=8004+Twin+Rivers+Road%2C+Eureka%2C+MO+63025&benchmark=Public_AR_Current&vintage=Current_Current&format=json",
        checkedAt: "2026-10-07", precisionLabel: "Approximate address-range placement; not an entrance or parking coordinate" },
      directionsTarget: { kind: "visitor-address", address: "8004 Twin Rivers Road, Eureka, MO 63025" },
      hours: { state: "partial", displayText: "2026 Fall Festival runs through Nov. 8. September/October calendar starts Wed–Sun at 10 a.m.; complete date-specific closing times are not established for every day." },
      listingExpiresAt: "2026-11-08T18:00:00-06:00", expiryBasis: "exact",
      sourceUrls: ["https://www.brookdalefarms.com/events-1/fall-festival-2026-brookdale-farms-2026-11-08-10-00",
        "https://www.brookdalefarms.com/fall-festival",
        "https://www.brookdalefarms.com/events-calendar"
      ],
      reviewRevision: "MO2026-brookdale-late-fall-verified-2026-10-08"
    },
    seasonalVisitNotes: [
      "Fall Festival runs September 11–November 8, 2026. Check the date-specific calendar because activities and closing times vary.",
      "Current 2026 sources support both the corn maze and pumpkin patch; pumpkins are sold separately.",
      "General admission pricing varies by day and ages; check the current ticket page before committing.",
      "Activities may vary with date, weather and staffing. Location is approximate; Directions use the supported visitor address.",
      "This curated listing can remain visible after the Halloween layer ends because its own verified 2026 season continues through November 8."
    ]
  }
];

export const MISSOURI_2026_LATE_FALL_CATALOG =
  MISSOURI_2026_LATE_FALL_LISTINGS
    .map(seasonalListingToPlace)
    .filter((place): place is DateNightPlace => Boolean(place));
