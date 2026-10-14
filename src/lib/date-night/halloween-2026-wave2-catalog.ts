import type { DateNightPlace } from "./types";
import { seasonalListingToPlace, type SeasonalListing } from "./listing";

/** Halloween 2026 Wave 2 provisional, bounded 10-record catalog.
 * Research/date/placement parity checked; integrated acceptance PENDING.
 * Does not assert live operator opening hours or admission availability. */
export const WAVE2_2026_LISTINGS:
  (Omit<DateNightPlace, "lat" | "lon"> & { seasonalListing: SeasonalListing })[] = [
  {
    "id": "date-night-ks26-walters",
    "name": "The Haunt at Walters",
    "address": "10001 NW U.S. Highway 77, Burns, KS 66840, USA",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Haunted House",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://thewaltersfarm.com/haunt/",
    "isChain": false,
    "photoKey": "cafe",
    "source": "catalog",
    "activityTypes": [
      "haunted-house"
    ],
    "moodLevel": 2,
    "seasonalAvailability": {
      "status": "confirmed",
      "activeFrom": "2026-09-18",
      "activeUntil": "2026-10-30",
      "activeDates": [
        "2026-09-18",
        "2026-09-19",
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
        "2026-10-30"
      ],
      "checkedAt": "2026-10-14",
      "revalidateAfter": "2026-10-15",
      "timeZone": "America/Chicago",
      "openNowPolicy": "never",
      "listingExpiresAt": "2026-10-31T04:00:00Z",
      "seasonYear": 2026,
      "sourceUrls": [
        "https://thewaltersfarm.com/haunt/",
        "https://walterspumpkinpatch.ticketspice.com/the-haunt-at-walters-2026-season"
      ],
      "note": "Finite 2026 occurrences only. No machine opening intervals; no 2027 recurrence."
    },
    "seasonalListing": {
      "contract": "ListingCompletenessV1",
      "recordId": "KS26-W1-WALTERS",
      "seasonYear": 2026,
      "timeZone": "America/Chicago",
      "visitorAddress": "10001 NW U.S. Highway 77, Burns, KS 66840, USA",
      "placement": {
        "lat": 37.953096849462,
        "lon": -96.85429777569,
        "basis": "address-geocode",
        "sourceUrl": "https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?address=10001+NW+US+Highway+77%2C+Burns%2C+KS+66840&benchmark=Public_AR_Current&format=json",
        "checkedAt": "2026-10-13T18:19:31.803572+00:00",
        "precisionLabel": "Approximate address-derived location; not a verified entrance, parking area or rideshare dropoff."
      },
      "directionsTarget": {
        "kind": "visitor-address",
        "address": "10001 NW U.S. Highway 77, Burns, KS 66840, USA"
      },
      "ridesharePolicy": "external-picker",
      "hours": {
        "state": "partial",
        "displayText": "September 18–19,25–26; October 2–3,9–10,16–17,23–24 and 30, 2026. Gates 7:30 p.m.; first wagon 8 p.m.; gates close 11 p.m. Final exit and last-ticket time unknown."
      },
      "listingExpiresAt": "2026-10-31T04:00:00Z",
      "expiryBasis": "exact",
      "sourceUrls": [
        "https://thewaltersfarm.com/haunt/",
        "https://walterspumpkinpatch.ticketspice.com/the-haunt-at-walters-2026-season",
        "https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?address=10001+NW+US+Highway+77%2C+Burns%2C+KS+66840&benchmark=Public_AR_Current&format=json"
      ],
      "reviewRevision": "KS-RELEASE-WINDOW-2026-10-14-R1-PENDING-INDEPENDENT-REVIEW",
      "visibility": "listing-lifecycle"
    },
    "seasonalVisitNotes": [
      "Haunted wagon ride and two barns on select nights, September 18–October 30, 2026.",
      "Gates open 7:30 p.m.; first wagon 8 p.m.; gates close 11 p.m. Final exit time is unconfirmed.",
      "Separate haunt ticket required. Recommended for ages 12+.",
      "Location is approximate."
    ]
  },
  {
    "id": "date-night-il26-w1-spook",
    "name": "Spook Hollow",
    "address": "613 Lasalle Blvd, Marquette Heights, IL 61554",
    "website": "https://www.spook-hollow.com/",
    "activityTypes": [
      "haunted-house"
    ],
    "openingHours": null,
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "seasonalAvailability": {
      "status": "confirmed",
      "activeFrom": "2026-10-09",
      "activeUntil": "2026-10-30",
      "activeDates": [
        "2026-10-09",
        "2026-10-10",
        "2026-10-16",
        "2026-10-17",
        "2026-10-23",
        "2026-10-24",
        "2026-10-30"
      ],
      "seasonYear": 2026,
      "timeZone": "America/Chicago",
      "openNowPolicy": "never",
      "checkedAt": "2026-10-14",
      "revalidateAfter": "2026-10-16",
      "endsAt": null,
      "listingExpiresAt": "2026-10-31T00:00:00-05:00",
      "note": "Researcher-only 2026 seasonal listing eligibility. Select supported nights; range alone is not daily operation. No machine hours or 2027 recurrence.",
      "sourceUrls": [
        "https://app.hauntpay.com/events/spook-hollow2026",
        "https://www.spook-hollow.com/"
      ]
    },
    "seasonalListing": {
      "contract": "ListingCompletenessV1",
      "recordId": "IL26-W1-spook",
      "seasonYear": 2026,
      "timeZone": "America/Chicago",
      "visitorAddress": "613 Lasalle Blvd, Marquette Heights, IL 61554",
      "placement": {
        "lat": 40.62094,
        "lon": -89.600666,
        "basis": "operator-linked-map",
        "sourceUrl": "https://www.spook-hollow.com/",
        "checkedAt": "2026-10-14T07:28:18.237451+00:00",
        "precisionLabel": "Approximate operator map location"
      },
      "directionsTarget": {
        "kind": "visitor-address",
        "address": "613 Lasalle Blvd, Marquette Heights, IL 61554"
      },
      "ridesharePolicy": "external-picker",
      "hours": {
        "state": "partial",
        "displayText": "Current ticket occurrence shows18:00 start; complete admission/closing hours unknown."
      },
      "listingExpiresAt": "2026-10-31T00:00:00-05:00",
      "expiryBasis": "date-only",
      "sourceUrls": [
        "https://app.hauntpay.com/events/spook-hollow2026",
        "https://www.spook-hollow.com/"
      ],
      "reviewRevision": "IL26-W1-R2-RESEARCHER-FROZEN"
    },
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Haunted House",
    "isChain": false,
    "photoKey": "cafe",
    "source": "catalog",
    "moodLevel": 2,
    "phone": null,
    "seasonalVisitNotes": [
      "Current ticket occurrence shows18:00 start; complete admission/closing hours unknown.",
      "Intense indoor/outdoor attraction; under13 not recommended, but all ages allowed.",
      "One ticket covers Spook Hollow, M.C. Manor and M.C. Nightmare; these are components of one venue. No refunds except stated organizer-cancellation policy.",
      "Speed pass shortens wait but does not promise immediate access.",
      "Location is approximate. Directions use the visitor address."
    ]
  },
  {
    "id": "date-night-il26-w1-boo",
    "name": "Boo Crew Haunted House and Trail of Lost Souls",
    "address": "11083 Buckhart Road, Mechanicsburg, IL 62545",
    "website": "https://boocrew.com/",
    "activityTypes": [
      "haunted-house"
    ],
    "openingHours": null,
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "seasonalAvailability": {
      "status": "confirmed",
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
      ],
      "seasonYear": 2026,
      "timeZone": "America/Chicago",
      "openNowPolicy": "never",
      "checkedAt": "2026-10-14",
      "revalidateAfter": "2026-10-16",
      "endsAt": null,
      "listingExpiresAt": "2026-10-31T00:00:00-05:00",
      "note": "Researcher-only 2026 seasonal listing eligibility. Select supported nights; range alone is not daily operation. No machine hours or 2027 recurrence.",
      "sourceUrls": [
        "https://app.gopassage.com/events/boo-crew-haunted-house-and-trail-of-lost-souls-2026",
        "https://boocrew.com/",
        "https://boocrew.com/faqs",
        "https://boocrew.com/find-us",
        "https://geocoding.geo.census.gov/geocoder/geographies/onelineaddress?address=11083+Buckhart+Road%2C+Mechanicsburg%2C+IL+62545&benchmark=Public_AR_Current&vintage=Current_Current&format=json"
      ]
    },
    "seasonalListing": {
      "contract": "ListingCompletenessV1",
      "recordId": "IL26-W1-boo",
      "seasonYear": 2026,
      "timeZone": "America/Chicago",
      "visitorAddress": "11083 Buckhart Road, Mechanicsburg, IL 62545",
      "placement": {
        "lat": 39.749619979127,
        "lon": -89.442696542048,
        "basis": "address-geocode",
        "sourceUrl": "https://geocoding.geo.census.gov/geocoder/geographies/onelineaddress?address=11083+Buckhart+Road%2C+Mechanicsburg%2C+IL+62545&benchmark=Public_AR_Current&vintage=Current_Current&format=json",
        "checkedAt": "2026-10-14T07:34:11.162684+00:00",
        "precisionLabel": "Approximate address location"
      },
      "directionsTarget": {
        "kind": "visitor-address",
        "address": "11083 Buckhart Road, Mechanicsburg, IL 62545"
      },
      "ridesharePolicy": "external-picker",
      "hours": {
        "state": "partial",
        "displayText": "Current2026 ticket event: Fridays/Saturdays in October except Halloween. Box office18:30; scares19:00; full closing not established."
      },
      "listingExpiresAt": "2026-10-31T00:00:00-05:00",
      "expiryBasis": "date-only",
      "sourceUrls": [
        "https://app.gopassage.com/events/boo-crew-haunted-house-and-trail-of-lost-souls-2026",
        "https://boocrew.com/",
        "https://boocrew.com/faqs",
        "https://boocrew.com/find-us",
        "https://geocoding.geo.census.gov/geocoder/geographies/onelineaddress?address=11083+Buckhart+Road%2C+Mechanicsburg%2C+IL+62545&benchmark=Public_AR_Current&vintage=Current_Current&format=json"
      ],
      "reviewRevision": "IL26-W1-R2-RESEARCHER-FROZEN"
    },
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Haunted House",
    "isChain": false,
    "photoKey": "cafe",
    "source": "catalog",
    "moodLevel": 2,
    "phone": null,
    "seasonalVisitNotes": [
      "Current2026 ticket event: Fridays/Saturdays in October except Halloween. Box office18:30; scares19:00; full closing not established.",
      "Under12 requires adult; no minimum age otherwise. Most, not all, areas accessible; wood-chip trail may be difficult.",
      "No single regular GA tickets; regular GA groups2–6, VIP minimum4; max6 enter together. Timed queue entry; capacity may sell out before travel.",
      "Appropriate footwear; no costumes/props or recording inside. Rain operation may stop for severe weather. No refund except organizer cancellation policy.",
      "Actor proximity/incidental collision possible; do not promise no-contact.",
      "Location is approximate. Directions use the visitor address."
    ]
  },
  {
    "id": "date-night-il26-w1-sonny-acres-haunted-experiences",
    "name": "Sonny Acres Farm Haunted Hayride & Haunted Barn",
    "address": "29W310 North Avenue, West Chicago, IL 60185",
    "website": "https://sonnyacres.com/fall-festival/",
    "activityTypes": [
      "haunted-house"
    ],
    "openingHours": null,
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "seasonalAvailability": {
      "status": "confirmed",
      "activeFrom": "2026-10-02",
      "activeUntil": "2026-10-30",
      "activeDates": [
        "2026-10-02",
        "2026-10-03",
        "2026-10-04",
        "2026-10-09",
        "2026-10-10",
        "2026-10-11",
        "2026-10-16",
        "2026-10-17",
        "2026-10-18",
        "2026-10-22",
        "2026-10-23",
        "2026-10-24",
        "2026-10-25",
        "2026-10-29",
        "2026-10-30"
      ],
      "seasonYear": 2026,
      "timeZone": "America/Chicago",
      "openNowPolicy": "never",
      "checkedAt": "2026-10-14",
      "revalidateAfter": "2026-10-16",
      "endsAt": "2026-10-30T22:00:00-05:00",
      "listingExpiresAt": "2026-10-30T22:00:00-05:00",
      "note": "Researcher-only 2026 seasonal listing eligibility. Select supported nights; range alone is not daily operation. No machine hours or 2027 recurrence. Haunted experiences run through October 30; Friday/Saturday haunted hours end 22:00 CDT. Farm, bar and festival hours do not extend this endpoint.",
      "sourceUrls": [
        "https://sonnyacres.com/event/fall-festival-at-sonny-acres-farm-2026-oct-30/",
        "https://sonnyacres.com/fall-festival/"
      ]
    },
    "seasonalListing": {
      "contract": "ListingCompletenessV1",
      "recordId": "IL26-W1-sonny-acres-haunted-experiences",
      "seasonYear": 2026,
      "timeZone": "America/Chicago",
      "visitorAddress": "29W310 North Avenue, West Chicago, IL 60185",
      "placement": {
        "lat": 41.9135339,
        "lon": -88.19247779999999,
        "basis": "operator-linked-map",
        "sourceUrl": "https://sonnyacres.com/fall-festival/",
        "checkedAt": "2026-10-14T07:33:10.817642+00:00",
        "precisionLabel": "Approximate public venue/address point"
      },
      "directionsTarget": {
        "kind": "visitor-address",
        "address": "29W310 North Avenue, West Chicago, IL 60185"
      },
      "ridesharePolicy": "external-picker",
      "hours": {
        "state": "partial",
        "displayText": "Select published nights only; date bounds are not daily operation. Haunted experiences run through October 30; Friday/Saturday haunted hours end 22:00 CDT. Farm, bar and festival hours do not extend this endpoint."
      },
      "listingExpiresAt": "2026-10-30T22:00:00-05:00",
      "expiryBasis": "exact",
      "sourceUrls": [
        "https://sonnyacres.com/event/fall-festival-at-sonny-acres-farm-2026-oct-30/",
        "https://sonnyacres.com/fall-festival/"
      ],
      "reviewRevision": "IL26-W1-R2-RESEARCHER-FROZEN"
    },
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Haunted House",
    "isChain": false,
    "photoKey": "cafe",
    "source": "catalog",
    "moodLevel": 2,
    "phone": null,
    "seasonalVisitNotes": [
      "Select published nights only; date bounds are not daily operation. Haunted experiences run through October 30; Friday/Saturday haunted hours end 22:00 CDT. Farm, bar and festival hours do not extend this endpoint.",
      "Paid haunted-experience tickets. Advance purchase recommended because dates may sell out. Dogs are not permitted during Fall Fest. Free on-site parking and overflow shuttle arrangements are provided.",
      "Location is approximate. Directions use the visitor address."
    ]
  },
  {
    "id": "date-night-il26-w1-hayride-horror-bayou",
    "name": "Hayride of Horror & Curse of the Bayou",
    "address": "Dellwood Park, 199 E Woods Drive, Lockport, IL 60441",
    "website": "https://www.lockportpark.org/HayrideOfHorror/",
    "activityTypes": [
      "haunted-house"
    ],
    "openingHours": null,
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "seasonalAvailability": {
      "status": "confirmed",
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
        "2026-10-25",
        "2026-10-29",
        "2026-10-30"
      ],
      "seasonYear": 2026,
      "timeZone": "America/Chicago",
      "openNowPolicy": "never",
      "checkedAt": "2026-10-14",
      "revalidateAfter": "2026-10-16",
      "endsAt": "2026-10-30T22:00:00-05:00",
      "listingExpiresAt": "2026-10-30T22:00:00-05:00",
      "note": "Researcher-only 2026 seasonal listing eligibility. Select supported nights; range alone is not daily operation. No machine hours or 2027 recurrence. Final October 30 session and last-ticket endpoint is 22:00 CDT. This is listing/admission-based retirement, not guaranteed final exit; queued guests may continue.",
      "sourceUrls": [
        "https://maps.app.goo.gl/ajiUjspKKqxCBKvk6",
        "https://www.lockportpark.org/HayrideOfHorror/"
      ]
    },
    "seasonalListing": {
      "contract": "ListingCompletenessV1",
      "recordId": "IL26-W1-hayride-horror-bayou",
      "seasonYear": 2026,
      "timeZone": "America/Chicago",
      "visitorAddress": "Dellwood Park, 199 E Woods Drive, Lockport, IL 60441",
      "placement": {
        "lat": 41.5748765,
        "lon": -88.0632969,
        "basis": "operator-linked-map",
        "sourceUrl": "https://maps.app.goo.gl/ajiUjspKKqxCBKvk6",
        "checkedAt": null,
        "precisionLabel": "Approximate public venue/address point"
      },
      "directionsTarget": {
        "kind": "visitor-address",
        "address": "Dellwood Park, 199 E Woods Drive, Lockport, IL 60441"
      },
      "ridesharePolicy": "external-picker",
      "hours": {
        "state": "partial",
        "displayText": "Select published nights only; date bounds are not daily operation. Final October 30 session and last-ticket endpoint is 22:00 CDT. This is listing/admission-based retirement, not guaranteed final exit; queued guests may continue."
      },
      "listingExpiresAt": "2026-10-30T22:00:00-05:00",
      "expiryBasis": "exact",
      "sourceUrls": [
        "https://maps.app.goo.gl/ajiUjspKKqxCBKvk6",
        "https://www.lockportpark.org/HayrideOfHorror/"
      ],
      "reviewRevision": "IL26-W1-R2-RESEARCHER-FROZEN"
    },
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Haunted House",
    "isChain": false,
    "photoKey": "cafe",
    "source": "catalog",
    "moodLevel": 2,
    "phone": null,
    "seasonalVisitNotes": [
      "Select published nights only; date bounds are not daily operation. Final October 30 session and last-ticket endpoint is 22:00 CDT. This is listing/admission-based retirement, not guaranteed final exit; queued guests may continue.",
      "October 29 offers Curse of the Bayou only, with no hayride. Tickets are date-specific. Outdoor event is weather-dependent. Proper footwear is required; no flip-flops, sandals or high heels. No costumes, weapons or alcohol. Parents should use discretion for children.",
      "Ordinary ticket sales are final and nonrefundable. If the venue or organizer cancels an event, ticket purchases are refunded within four business days of the event date.",
      "Location is approximate. Directions use the visitor address."
    ]
  },
  {
    "id": "date-night-il26-w1-217",
    "name": "217 Terror Haunted House",
    "address": "221 Rawlings Street, Roodhouse, IL 62082",
    "website": "https://217terror.com/",
    "activityTypes": [
      "haunted-house"
    ],
    "openingHours": null,
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "seasonalAvailability": {
      "status": "confirmed",
      "activeFrom": "2026-10-16",
      "activeUntil": "2026-10-31",
      "activeDates": [
        "2026-10-16",
        "2026-10-17",
        "2026-10-18",
        "2026-10-23",
        "2026-10-24",
        "2026-10-25",
        "2026-10-29",
        "2026-10-30",
        "2026-10-31"
      ],
      "seasonYear": 2026,
      "timeZone": "America/Chicago",
      "openNowPolicy": "never",
      "checkedAt": "2026-10-14",
      "revalidateAfter": "2026-10-16",
      "endsAt": "2026-10-31T23:00:00-05:00",
      "listingExpiresAt": "2026-10-31T23:00:00-05:00",
      "note": "Researcher-only 2026 seasonal listing eligibility. Select supported nights; range alone is not daily operation. No machine hours or 2027 recurrence. Official 217 Terror 2026 ticket event duration ends October 31 at 23:00 CDT; future-only supported date subset is unchanged.",
      "sourceUrls": [
        "https://217terror.com/",
        "https://217terror.com/faqs/",
        "https://217terror.com/location-contact-us/",
        "https://217terror.com/warning/",
        "https://217terror.com/wp-content/uploads/2023/08/Warning-1.jpg",
        "https://217terror2026.fearticket.com/",
        "https://geocoding.geo.census.gov/geocoder/geographies/onelineaddress?address=221+Rawlings+Street%2C+Roodhouse%2C+Illinois+62082&benchmark=Public_AR_Current&vintage=Current_Current&format=json"
      ]
    },
    "seasonalListing": {
      "contract": "ListingCompletenessV1",
      "recordId": "IL26-W1-217",
      "seasonYear": 2026,
      "timeZone": "America/Chicago",
      "visitorAddress": "221 Rawlings Street, Roodhouse, IL 62082",
      "placement": {
        "lat": 39.485399087629,
        "lon": -90.373065595635,
        "basis": "address-geocode",
        "sourceUrl": "https://geocoding.geo.census.gov/geocoder/geographies/onelineaddress?address=221+Rawlings+Street%2C+Roodhouse%2C+Illinois+62082&benchmark=Public_AR_Current&vintage=Current_Current&format=json",
        "checkedAt": "2026-10-14T07:34:14.748591+00:00",
        "precisionLabel": "Approximate address location"
      },
      "directionsTarget": {
        "kind": "visitor-address",
        "address": "221 Rawlings Street, Roodhouse, IL 62082"
      },
      "ridesharePolicy": "external-picker",
      "hours": {
        "state": "partial",
        "displayText": "Supported future subset only: Fri/Sat19:00–23:00; Sun/Thu18:00–21:00. Last scheduled dateOct31. Official 217 Terror 2026 ticket event duration ends October 31 at 23:00 CDT; future-only supported date subset is unchanged."
      },
      "listingExpiresAt": "2026-10-31T23:00:00-05:00",
      "expiryBasis": "exact",
      "sourceUrls": [
        "https://217terror.com/",
        "https://217terror.com/faqs/",
        "https://217terror.com/location-contact-us/",
        "https://217terror.com/warning/",
        "https://217terror.com/wp-content/uploads/2023/08/Warning-1.jpg",
        "https://217terror2026.fearticket.com/",
        "https://geocoding.geo.census.gov/geocoder/geographies/onelineaddress?address=221+Rawlings+Street%2C+Roodhouse%2C+Illinois+62082&benchmark=Public_AR_Current&vintage=Current_Current&format=json"
      ],
      "reviewRevision": "IL26-W1-R2-RESEARCHER-FROZEN"
    },
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Haunted House",
    "isChain": false,
    "photoKey": "cafe",
    "source": "catalog",
    "moodLevel": 2,
    "phone": null,
    "seasonalVisitNotes": [
      "Supported future subset only: Fri/Sat19:00–23:00; Sun/Thu18:00–21:00. Last scheduled dateOct31. Official 217 Terror 2026 ticket event duration ends October 31 at 23:00 CDT; future-only supported date subset is unchanged.",
      "Operator warning excludes pregnancy, intoxication, casts, medical braces, crutches, physical limitations, and listed medical/respiratory/heart/seizure concerns. The warning also prohibits entry while taking medications or drugs; preserve the exact warning for operator clarification rather than give medical advice.",
      "Four attractions at one venue and one ticket; no intentional touching. No age minimum; operator says11-and-under should have adult.",
      "Indoor haunt and waiting; free parking; no photos/video, phones/lighters/flashlights inside. Ticket waiver and no-refund terms apply.",
      "Location is approximate. Directions use the visitor address."
    ]
  },
  {
    "id": "date-night-il26-w1-paintball",
    "name": "Haunted Paintball Park",
    "address": "3545 Douglas Road, Millstadt, IL 62260",
    "website": "https://xtremepaintballpark.com/haunted-paintball-park/",
    "activityTypes": [
      "haunted-house"
    ],
    "openingHours": null,
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
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
      "seasonYear": 2026,
      "timeZone": "America/Chicago",
      "openNowPolicy": "never",
      "checkedAt": "2026-10-14",
      "revalidateAfter": "2026-10-16",
      "endsAt": "2026-10-31T22:00:00-05:00",
      "listingExpiresAt": "2026-10-31T22:00:00-05:00",
      "note": "Researcher-only 2026 seasonal listing eligibility. Select supported nights; range alone is not daily operation. No machine hours or 2027 recurrence.",
      "sourceUrls": [
        "https://geocoding.geo.census.gov/geocoder/geographies/onelineaddress?address=3545+Douglas+Road%2C+Millstadt%2C+IL+62260&benchmark=Public_AR_Current&vintage=Current_Current&format=json",
        "https://xtremepaintballpark.com/haunted-paintball-park/"
      ]
    },
    "seasonalListing": {
      "contract": "ListingCompletenessV1",
      "recordId": "IL26-W1-paintball",
      "seasonYear": 2026,
      "timeZone": "America/Chicago",
      "visitorAddress": "3545 Douglas Road, Millstadt, IL 62260",
      "placement": {
        "lat": 38.436335451757,
        "lon": -90.092883197277,
        "basis": "address-geocode",
        "sourceUrl": "https://geocoding.geo.census.gov/geocoder/geographies/onelineaddress?address=3545+Douglas+Road%2C+Millstadt%2C+IL+62260&benchmark=Public_AR_Current&vintage=Current_Current&format=json",
        "checkedAt": "2026-10-14T07:34:14.724322+00:00",
        "precisionLabel": "Approximate address location"
      },
      "directionsTarget": {
        "kind": "visitor-address",
        "address": "3545 Douglas Road, Millstadt, IL 62260"
      },
      "ridesharePolicy": "external-picker",
      "hours": {
        "state": "partial",
        "displayText": "2026Oct9/10/16/17/23/24/30/31 19:00–22:00; gates18:00."
      },
      "listingExpiresAt": "2026-10-31T22:00:00-05:00",
      "expiryBasis": "exact",
      "sourceUrls": [
        "https://geocoding.geo.census.gov/geocoder/geographies/onelineaddress?address=3545+Douglas+Road%2C+Millstadt%2C+IL+62260&benchmark=Public_AR_Current&vintage=Current_Current&format=json",
        "https://xtremepaintballpark.com/haunted-paintball-park/"
      ],
      "reviewRevision": "IL26-W1-R2-RESEARCHER-FROZEN"
    },
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Haunted House",
    "isChain": false,
    "photoKey": "cafe",
    "source": "catalog",
    "moodLevel": 2,
    "phone": null,
    "seasonalVisitNotes": [
      "2026Oct9/10/16/17/23/24/30/31 19:00–22:00; gates18:00.",
      "Zombie paintball bus followed by a haunted trail; targets do not fire back. The operator generally recommends ages five and up for the bus, not a hard minimum. Guests skipping the scary trail may ride the bus back.",
      "No reservations; prepurchase or gate, first come/served; keep operator capacity claims qualified rather than promise availability.",
      "Stops for thunderstorms/lightning or heavy rain; check current operator updates.",
      "Separate ordinary paintball/airsoft hours excluded from seasonal hours.",
      "Every participant must complete and sign the required waiver. For participants under 18, a parent or guardian must sign the waiver. The operator provides online submission; do not imply an assistant has signed or accepted it.",
      "Location is approximate. Directions use the visitor address."
    ]
  },
  {
    "id": "date-night-il26-w1-chitty",
    "name": "Chittyville School Haunted House",
    "address": "401 Chittyville Road, Herrin, IL 62948",
    "website": "https://www.chittyville.com/",
    "activityTypes": [
      "haunted-house"
    ],
    "openingHours": null,
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
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
      "seasonYear": 2026,
      "timeZone": "America/Chicago",
      "openNowPolicy": "never",
      "checkedAt": "2026-10-14",
      "revalidateAfter": "2026-10-16",
      "endsAt": "2026-11-01T00:00:00-05:00",
      "listingExpiresAt": "2026-11-01T00:00:00-05:00",
      "note": "Researcher-only 2026 seasonal listing eligibility. Select supported nights; range alone is not daily operation. No machine hours or 2027 recurrence.",
      "sourceUrls": [
        "https://geocoding.geo.census.gov/geocoder/geographies/onelineaddress?address=401+Chittyville+Road%2C+Herrin+IL+62948&benchmark=Public_AR_Current&vintage=Current_Current&format=json",
        "https://www.chittyville.com/",
        "https://www.chittyville.com/copy-of-faq",
        "https://www.chittyville.com/dates-times",
        "https://www.chittyville.com/rules"
      ]
    },
    "seasonalListing": {
      "contract": "ListingCompletenessV1",
      "recordId": "IL26-W1-chitty",
      "seasonYear": 2026,
      "timeZone": "America/Chicago",
      "visitorAddress": "401 Chittyville Road, Herrin, IL 62948",
      "placement": {
        "lat": 37.833623,
        "lon": -89.0211071,
        "basis": "operator-site-business-location",
        "sourceUrl": "https://www.chittyville.com/",
        "checkedAt": "2026-10-14T07:30:11.086963+00:00",
        "precisionLabel": "Approximate venue location"
      },
      "directionsTarget": {
        "kind": "visitor-address",
        "address": "401 Chittyville Road, Herrin, IL 62948"
      },
      "ridesharePolicy": "external-picker",
      "hours": {
        "state": "partial",
        "displayText": "2026 Fridays/Saturdays October 2–31: haunt 19:00–midnight; ticket office 18:30–23:30. Final closing is midnight after October 31."
      },
      "listingExpiresAt": "2026-11-01T00:00:00-05:00",
      "expiryBasis": "exact",
      "sourceUrls": [
        "https://geocoding.geo.census.gov/geocoder/geographies/onelineaddress?address=401+Chittyville+Road%2C+Herrin+IL+62948&benchmark=Public_AR_Current&vintage=Current_Current&format=json",
        "https://www.chittyville.com/",
        "https://www.chittyville.com/copy-of-faq",
        "https://www.chittyville.com/dates-times",
        "https://www.chittyville.com/rules"
      ],
      "reviewRevision": "IL26-W1-R2-RESEARCHER-FROZEN"
    },
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Haunted House",
    "isChain": false,
    "photoKey": "cafe",
    "source": "catalog",
    "moodLevel": 2,
    "phone": null,
    "seasonalVisitNotes": [
      "2026 Fridays/Saturdays October 2–31: haunt 19:00–midnight; ticket office 18:30–23:30. Final closing is midnight after October 31.",
      "Operator says the haunt is not wheelchair accessible: uneven and moving floors and stairs. Guests with prior injuries or medical conditions should not enter. No strict age minimum; parental discretion and not intended for younger children.",
      "No-touch haunt; virtual queue sends text when group is called; max6/group, larger groups split.",
      "Strobes, fog, moving floors, darkness and sudden effects; operator excludes pregnancy and conditions/medication impairing safe reaction; no intoxication.",
      "No weapons/fire/recording/flashlights; no refunds. Groups15+ require reservation24hours ahead for group pricing.",
      "Location is approximate. Directions use the visitor address."
    ]
  },
  {
    "id": "date-night-ks26-nightmare",
    "name": "Nightmare Festival",
    "address": "One Expocentre Drive, Topeka, KS 66612-1442, USA",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Haunted House",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://www.stormontvaileventscenter.com/events/2026/nightmare26",
    "isChain": false,
    "photoKey": "cafe",
    "source": "catalog",
    "activityTypes": [
      "haunted-house",
      "other-halloween-fall"
    ],
    "moodLevel": 2,
    "seasonalAvailability": {
      "status": "confirmed",
      "activeFrom": "2026-10-16",
      "activeUntil": "2026-10-31",
      "activeDates": [
        "2026-10-16",
        "2026-10-17",
        "2026-10-18",
        "2026-10-23",
        "2026-10-24",
        "2026-10-25",
        "2026-10-30",
        "2026-10-31"
      ],
      "checkedAt": "2026-10-14",
      "revalidateAfter": "2026-10-15",
      "timeZone": "America/Chicago",
      "openNowPolicy": "never",
      "listingExpiresAt": "2026-11-01T03:30:00Z",
      "seasonYear": 2026,
      "sourceUrls": [
        "https://www.stormontvaileventscenter.com/events/2026/nightmare26"
      ],
      "note": "Finite 2026 occurrences only. No machine opening intervals; no 2027 recurrence.",
      "endsAt": "2026-11-01T03:30:00Z"
    },
    "seasonalListing": {
      "contract": "ListingCompletenessV1",
      "recordId": "KS26-W1-NIGHTMARE",
      "seasonYear": 2026,
      "timeZone": "America/Chicago",
      "visitorAddress": "One Expocentre Drive, Topeka, KS 66612-1442, USA",
      "placement": {
        "lat": 39.034496091335,
        "lon": -95.683529000007,
        "basis": "address-geocode",
        "sourceUrl": "https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?address=1+Expocentre+Dr%2C+Topeka%2C+KS+66612&benchmark=Public_AR_Current&format=json",
        "checkedAt": "2026-10-13T18:21:30.378731+00:00",
        "precisionLabel": "Approximate address-derived location; not a verified entrance, parking area or rideshare dropoff."
      },
      "directionsTarget": {
        "kind": "visitor-address",
        "address": "One Expocentre Drive, Topeka, KS 66612-1442, USA"
      },
      "ridesharePolicy": "external-picker",
      "hours": {
        "state": "partial",
        "displayText": "October 16–18,23–25,30–31, 2026. Doors 6:45 p.m.; attractions 7–10:30 p.m. Last ticket/token sale unspecified. October 31 Blackout Night."
      },
      "listingExpiresAt": "2026-11-01T03:30:00Z",
      "expiryBasis": "exact",
      "sourceUrls": [
        "https://www.stormontvaileventscenter.com/events/2026/nightmare26",
        "https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?address=1+Expocentre+Dr%2C+Topeka%2C+KS+66612&benchmark=Public_AR_Current&format=json"
      ],
      "reviewRevision": "KS-RELEASE-WINDOW-2026-10-14-R1-PENDING-INDEPENDENT-REVIEW",
      "visibility": "listing-lifecycle"
    },
    "seasonalVisitNotes": [
      "Indoor haunted festival at Exhibition Hall, October 16–18,23–25 and 30–31, 2026. October 31 is Blackout Night.",
      "Doors 6:45 p.m.; event 7–10:30 p.m.",
      "Festival entry is free; haunted attractions and activities require paid tokens sold at the door. Advance sales only for group experiences. Clear bags only.",
      "Location is approximate; use the venue’s visitor address."
    ]
  },
  {
    "id": "date-night-ar26-royal",
    "name": "Royal Haunted House",
    "address": "111 South Market Street, Benton, AR 72015",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Haunted House",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://www.theroyaltheatre.org/",
    "isChain": false,
    "photoKey": "cafe",
    "source": "catalog",
    "activityTypes": [
      "haunted-house"
    ],
    "moodLevel": 3,
    "seasonalAvailability": {
      "status": "confirmed",
      "checkedAt": "2026-10-14",
      "revalidateAfter": "2026-10-15",
      "timeZone": "America/Chicago",
      "seasonYear": 2026,
      "openNowPolicy": "never",
      "listingExpiresAt": "2026-10-31T22:00:00-05:00",
      "sourceUrls": [
        "https://www.theroyaltheatre.org/",
        "https://onthestage.tickets/the-royal-theatre/season"
      ],
      "note": "Explicit 2026 finite dates",
      "activeDates": [
        "2026-10-15",
        "2026-10-16",
        "2026-10-17",
        "2026-10-22",
        "2026-10-23",
        "2026-10-24",
        "2026-10-29",
        "2026-10-30",
        "2026-10-31"
      ],
      "activeFrom": "2026-10-15",
      "activeUntil": "2026-10-31",
      "endsAt": "2026-10-31T22:00:00-05:00"
    },
    "seasonalListing": {
      "contract": "ListingCompletenessV1",
      "recordId": "AR26-W1-012",
      "seasonYear": 2026,
      "timeZone": "America/Chicago",
      "visitorAddress": "111 South Market Street, Benton, AR 72015",
      "placement": {
        "lat": 34.563224662909,
        "lon": -92.588223916041,
        "basis": "address-geocode",
        "sourceUrl": "https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?address=111+S+Market+St%2C+Benton%2C+AR+72015&benchmark=Public_AR_Current&format=json",
        "checkedAt": "2026-10-13T18:31:04.913570+00:00",
        "precisionLabel": "Approximate public visitor-address range; not an entrance, parking area or ride dropoff"
      },
      "directionsTarget": {
        "kind": "visitor-address",
        "address": "111 South Market Street, Benton, AR 72015"
      },
      "ridesharePolicy": "external-picker",
      "hours": {
        "state": "verified",
        "displayText": "October 15–17, 22–24 and 29–31, 2026. Thursdays 7–9 PM; Fridays and Saturdays 7–10 PM. Tickets are sold until sold out; online sales may end earlier than box-office sales."
      },
      "listingExpiresAt": "2026-10-31T22:00:00-05:00",
      "expiryBasis": "exact",
      "sourceUrls": [
        "https://www.theroyaltheatre.org/",
        "https://onthestage.tickets/the-royal-theatre/season",
        "https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?address=111+S+Market+St%2C+Benton%2C+AR+72015&benchmark=Public_AR_Current&format=json"
      ],
      "reviewRevision": "AR2026-RELEASE-WINDOW-20261014-R1-PROPOSED-NOT-APPROVED",
      "visibility": "halloween-layer"
    },
    "seasonalVisitNotes": [
      "October 15–17, 22–24 and 29–31, 2026. Thursdays 7–9 PM; Fridays and Saturdays 7–10 PM.",
      "Requires walking and stairs; no wheelchair-accessible route. No admission with casts, braces or crutches, or while intoxicated.",
      "Strobes, fog and narrow areas; operator warns against admission during pregnancy or with heart, breathing, seizure or other medical conditions.",
      "Entry is first-come, first-served, except skip-the-line tickets. Tickets may sell out; no refunds or touching actors/props.",
      "Location is approximate. Directions use the visitor address."
    ]
  }
];

export const WAVE2_2026_CATALOG = WAVE2_2026_LISTINGS
  .map(seasonalListingToPlace)
  .filter((place): place is DateNightPlace => place !== null);
