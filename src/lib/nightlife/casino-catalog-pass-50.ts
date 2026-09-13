import type { CasinoAuditRecord } from "./casino-catalog";

/** Pass 50: four current-property coordinate holds cleared; provenance is in
 * audit/casino-frontier-coordinate-qa-2026-09-13.json. No predecessor pins. */
export const CASINO_CATALOG_PASS_50: CasinoAuditRecord[] = [
  {
    "id": "casino-catalog-nv-red-dragon-elko",
    "name": "Red Dragon Casino",
    "lat": 40.82809,
    "lon": -115.75709,
    "address": "404 S 5th St, Elko, NV 89801",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Casino",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": null,
    "isChain": false,
    "photoKey": "cafe",
    "source": "catalog",
    "venueTypes": [
      "casino"
    ],
    "energyLevel": 2,
    "audit": {
      "verifiedOn": "2026-09-13",
      "jurisdiction": "Nevada",
      "identitySource": "https://elko-search.gsacorp.io/account/BU250232",
      "coordinateSource": "https://www.mapquest.com/us/nevada/red-dragon-casino-790465354",
      "notes": "One physical property: Red Dragon is the canonical consumer-facing identity at parcel 001-422-002. Co-located Dotty's #214 is not a separate routable destination. The numerical point is from raw named MapQuest LocalBusiness.geo, not the formerly unsupported point."
    }
  },
  {
    "id": "casino-catalog-ok-lakecrest",
    "name": "Lakecrest Casino and Hotel",
    "lat": 34.1348459,
    "lon": -97.1167007,
    "address": "1000 US HW 70 E, Ardmore, OK 73401",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Casino",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://lakecrestcasino.com/",
    "isChain": false,
    "photoKey": "cafe",
    "source": "catalog",
    "venueTypes": [
      "casino"
    ],
    "energyLevel": 2,
    "audit": {
      "verifiedOn": "2026-09-13",
      "jurisdiction": "Oklahoma",
      "identitySource": "https://lakecrestcasino.com/",
      "coordinateSource": "https://maps.app.goo.gl/TVoPubraC3WPcrpr6",
      "notes": "Point extracted from the destination !3d/!4d fields of the operator-published Google Maps link. Named map entity resolves to the current Lakecrest casino/hotel with matching address, official website and phone. Alternate MapQuest point is documented but not substituted."
    }
  },
  {
    "id": "casino-catalog-ok-lake-eufaula",
    "name": "Lake Eufaula Casino Hotel",
    "lat": 35.3000591,
    "lon": -95.5921671,
    "address": "1045 Birkes Rd, Eufaula, OK 74432",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Casino",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://lakeeufaulacasinohotel.com/",
    "isChain": false,
    "photoKey": "cafe",
    "source": "catalog",
    "venueTypes": [
      "casino"
    ],
    "energyLevel": 2,
    "audit": {
      "verifiedOn": "2026-09-13",
      "jurisdiction": "Oklahoma",
      "identitySource": "https://lakeeufaulacasinohotel.com/",
      "coordinateSource": "https://maps.app.goo.gl/gAwG8Q5zwU9EqNPG6",
      "notes": "Operator-published Google Maps destination at 1045 Birkes Rd explicitly lists Lake Eufaula Casino Hotel at this place. Use destination !3d/!4d values, not the map viewport longitude. The predecessor at 806 W Forrest Ave stays excluded."
    }
  },
  {
    "id": "casino-catalog-ok-creek-nation-holdenville",
    "name": "Creek Nation Casino Holdenville",
    "lat": 35.0912327,
    "lon": -96.4034396,
    "address": "211 E Willow St, Holdenville, OK 74848",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Casino",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://creeknationcasinoholdenville.com/",
    "isChain": false,
    "photoKey": "cafe",
    "source": "catalog",
    "venueTypes": [
      "casino"
    ],
    "energyLevel": 2,
    "audit": {
      "verifiedOn": "2026-09-13",
      "jurisdiction": "Oklahoma",
      "identitySource": "https://creeknationcasinoholdenville.com/",
      "coordinateSource": "https://maps.app.goo.gl/iPDfyNyLtW9t5XzG9",
      "notes": "Operator-published Google Maps building destination at 211 E Willow St explicitly lists the casino on floor 1. Destination !3d/!4d values independently agree with raw named MapQuest geo within approximately 4 metres. The city centroid remains excluded."
    }
  }
];
