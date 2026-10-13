import type { DateNightPlace } from "./types";
import { seasonalListingToPlace, type SeasonalListing } from "./listing";

/** Exact independent post-PR68 R1 projections. Display-only 2026 schedules;
 * qualified approximate placement and address navigation, never machine hours. */
export const MISSOURI_2026_THREE_CLEARED_LISTINGS:
  (Omit<DateNightPlace, "lat" | "lon"> & { seasonalListing: SeasonalListing })[] = [
  {
    "id": "date-night-mo26-delta-rowe-crop-farm",
    "name": "Rowe Crop Farm Family Fall Fun",
    "address": "10766 Webster Rd, Caledonia, MO 63631, USA",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Corn Maze / Pumpkin Patch",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://www.rowecrop.farm/",
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
      "activeFrom": "2026-09-12",
      "activeUntil": "2026-10-25",
      "activeDates": [
        "2026-09-12",
        "2026-09-13",
        "2026-09-18",
        "2026-09-19",
        "2026-09-20",
        "2026-09-25",
        "2026-09-26",
        "2026-09-27",
        "2026-10-01",
        "2026-10-02",
        "2026-10-03",
        "2026-10-04",
        "2026-10-07",
        "2026-10-08",
        "2026-10-09",
        "2026-10-10",
        "2026-10-11",
        "2026-10-14",
        "2026-10-15",
        "2026-10-16",
        "2026-10-17",
        "2026-10-18",
        "2026-10-21",
        "2026-10-22",
        "2026-10-23",
        "2026-10-24",
        "2026-10-25"
      ],
      "checkedAt": "2026-10-13",
      "revalidateAfter": "2026-10-15",
      "timeZone": "America/Chicago",
      "openNowPolicy": "never",
      "endsAt": "2026-10-25T23:00:00Z",
      "listingExpiresAt": "2026-10-25T23:00:00Z",
      "seasonYear": 2026,
      "sourceUrls": [
        "https://www.rowecrop.farm/",
        "https://www.rowecrop.farm/hours"
      ],
      "note": "Finite 2026 date list derived from operator month-specific public activity days; September barn-store-only Wednesday/Thursday hours excluded. Display hours only; no machine opening intervals or later-year recurrence."
    },
    "seasonalListing": {
      "contract": "ListingCompletenessV1",
      "recordId": "DELTA-ROWE-CROP-FARM-2026",
      "seasonYear": 2026,
      "timeZone": "America/Chicago",
      "visitorAddress": "10766 Webster Rd, Caledonia, MO 63631, USA",
      "placement": {
        "lat": 37.764856912758,
        "lon": -90.787513301942,
        "basis": "address-geocode",
        "sourceUrl": "https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?address=10766+Webster+Rd%2C+Caledonia%2C+MO+63631&benchmark=Public_AR_Current&format=json",
        "checkedAt": "2026-10-13T06:52:32.025098+00:00",
        "precisionLabel": "Approximate address-derived location; not a verified entrance, parking area or rideshare dropoff."
      },
      "directionsTarget": {
        "kind": "visitor-address",
        "address": "10766 Webster Rd, Caledonia, MO 63631, USA"
      },
      "ridesharePolicy": "external-picker",
      "hours": {
        "state": "partial",
        "displayText": "September 12–October 25, 2026. September: Friday–Saturday 10 a.m.–6 p.m., Sunday 1–6 p.m. October: Wednesday–Thursday 10 a.m.–3 p.m., Friday–Saturday 10 a.m.–6 p.m., Sunday 1–6 p.m. Last admission is not stated."
      },
      "listingExpiresAt": "2026-10-25T23:00:00Z",
      "expiryBasis": "exact",
      "sourceUrls": [
        "https://www.rowecrop.farm/",
        "https://www.rowecrop.farm/hours",
        "https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?address=10766+Webster+Rd%2C+Caledonia%2C+MO+63631&benchmark=Public_AR_Current&format=json"
      ],
      "reviewRevision": "MO2026-rowe-primary-r3-2026-10-13"
    },
    "seasonalVisitNotes": [
      "Family fall corn maze, pumpkin patch and hayrides; September 12–October 25, 2026.",
      "September: Friday–Saturday 10 a.m.–6 p.m.; Sunday 1–6 p.m. Wednesday/Thursday opening is pumpkin barn store only.",
      "October: Wednesday–Thursday 10 a.m.–3 p.m.; Friday–Saturday 10 a.m.–6 p.m.; Sunday 1–6 p.m. Last admission is not stated; check the operator before going.",
      "Location is approximate. Directions use the visitor address."
    ]
  },
  {
    "id": "date-night-mo26-096-meramec-spooktacular",
    "name": "Meramec State Park Spooktacular",
    "address": "115 Meramec Park Drive, Sullivan, MO 63080-4271",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Other Halloween / Fall",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://mostateparks.com/event/meramec-spooktacular-2026",
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
      "activeDates": [
        "2026-10-17"
      ],
      "checkedAt": "2026-10-13",
      "timeZone": "America/Chicago",
      "openNowPolicy": "never",
      "listingExpiresAt": "2026-10-18T05:00:00Z",
      "seasonYear": 2026,
      "sourceUrls": [
        "https://mostateparks.com/basic-page/fall-fun-events",
        "https://mostateparks.com/event/meramec-spooktacular-2026",
        "https://mostateparks.com/park/meramec-state-park"
      ],
      "note": "Display schedule only; no machine opening intervals."
    },
    "seasonalListing": {
      "contract": "ListingCompletenessV1",
      "recordId": "MO26-096",
      "seasonYear": 2026,
      "timeZone": "America/Chicago",
      "visitorAddress": "115 Meramec Park Drive, Sullivan, MO 63080-4271",
      "placement": {
        "lat": 38.207388,
        "lon": -91.1022,
        "basis": "operator-site",
        "sourceUrl": "https://mostateparks.com/park/meramec-state-park",
        "checkedAt": "2026-10-13T06:54:47.580580+00:00",
        "precisionLabel": "Approximate official park placement; not campground parking, entrance or ride-dropoff precision"
      },
      "directionsTarget": {
        "kind": "visitor-address",
        "address": "115 Meramec Park Drive, Sullivan, MO 63080-4271"
      },
      "ridesharePolicy": "external-picker",
      "hours": {
        "state": "partial",
        "displayText": "October 17, 2026. Coloring sheets 9 a.m.–3 p.m.; scavenger hunt 1:30 p.m.; pumpkin contest entries due 4 p.m.; carnival games 2–5 p.m.; trick-or-treating starts 5 p.m. Final end time unconfirmed."
      },
      "listingExpiresAt": "2026-10-18T05:00:00Z",
      "expiryBasis": "date-only",
      "sourceUrls": [
        "https://mostateparks.com/basic-page/fall-fun-events",
        "https://mostateparks.com/event/meramec-spooktacular-2026",
        "https://mostateparks.com/park/meramec-state-park"
      ],
      "reviewRevision": "MO2026-public-events-R2-2026-10-13",
      "visibility": "halloween-layer"
    },
    "seasonalVisitNotes": [
      "October 17, 2026 in the campground. Carnival games run 2–5 p.m.; trick-or-treating starts at 5 p.m. Final end time is unconfirmed.",
      "Contests and a scavenger hunt run at separate times; coloring sheets are available from 9 a.m. Open to the public; no registration required.",
      "The campground road closes to vehicle traffic at 4:45 p.m. for trick-or-treater safety.",
      "Directions use the park’s visitor address. Map placement is approximate and does not identify campground parking or an entrance."
    ]
  },
  {
    "id": "date-night-mo26-046-pets-and-pumpkins",
    "name": "Pets and Pumpkins",
    "address": "Park Central Square, Springfield, MO 65806",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Other Halloween / Fall",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://www.petsandpumpkins.com/home.html",
    "isChain": false,
    "photoKey": "cafe",
    "source": "catalog",
    "activityTypes": [
      "other-halloween-fall"
    ],
    "moodLevel": 2,
    "seasonalAvailability": {
      "status": "confirmed",
      "activeFrom": "2026-10-24",
      "activeUntil": "2026-10-24",
      "activeDates": [
        "2026-10-24"
      ],
      "checkedAt": "2026-10-13",
      "timeZone": "America/Chicago",
      "openNowPolicy": "never",
      "listingExpiresAt": "2026-10-24T21:00:00Z",
      "seasonYear": 2026,
      "sourceUrls": [
        "https://www.petsandpumpkins.com/home.html",
        "https://www.petsandpumpkins.com/about-p-p.html"
      ],
      "note": "Display schedule only; no machine opening intervals.",
      "endsAt": "2026-10-24T21:00:00Z"
    },
    "seasonalListing": {
      "contract": "ListingCompletenessV1",
      "recordId": "MO26-046",
      "seasonYear": 2026,
      "timeZone": "America/Chicago",
      "visitorAddress": "Park Central Square, Springfield, MO 65806",
      "placement": {
        "lat": 37.2089878,
        "lon": -93.2926909,
        "basis": "operator-site",
        "sourceUrl": "https://www.petsandpumpkins.com/home.html",
        "checkedAt": "2026-10-13T06:54:55.188985+00:00",
        "precisionLabel": "Approximate operator-published Park Central Square placement; not admission entrance or ride-dropoff precision"
      },
      "directionsTarget": {
        "kind": "visitor-address",
        "address": "Park Central Square, Springfield, MO 65806"
      },
      "ridesharePolicy": "external-picker",
      "hours": {
        "state": "verified",
        "displayText": "October 24, 2026, 11 a.m.–4 p.m. Parade line-up begins about 2:15 p.m."
      },
      "listingExpiresAt": "2026-10-24T21:00:00Z",
      "expiryBasis": "exact",
      "sourceUrls": [
        "https://www.petsandpumpkins.com/home.html",
        "https://www.petsandpumpkins.com/about-p-p.html"
      ],
      "reviewRevision": "MO2026-public-events-R2-2026-10-13",
      "visibility": "halloween-layer"
    },
    "seasonalVisitNotes": [
      "October 24, 2026, 11 a.m.–4 p.m. at Park Central Square.",
      "Family festival with a costume walking parade and contest for people and pets. Rain or shine.",
      "Parade line-up begins about 2:15 p.m. on Park Central East next to Civil Kitchen.",
      "Directions use Park Central Square; map placement is approximate, not an admission entrance or ride-dropoff point."
    ]
  }
];

export const MISSOURI_2026_THREE_CLEARED_CATALOG = MISSOURI_2026_THREE_CLEARED_LISTINGS
  .map(seasonalListingToPlace)
  .filter((place): place is DateNightPlace => place !== null);
