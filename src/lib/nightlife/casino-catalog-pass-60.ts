import type { CasinoAuditRecord } from "./casino-catalog";

/** Pass 60: final Oklahoma tribal-floor and hold-resolution completion. */
export const CASINO_CATALOG_PASS_60: CasinoAuditRecord[] = [
  {
    "id": "casino-catalog-ok-konawa-rivermist",
    "name": "Seminole Nation Casino Konawa",
    "lat": 34.939424,
    "lon": -96.683884,
    "address": "14313 Old Hwy 99, Konawa, OK 74849",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Casino",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://www.seminolenationcasinos.com/casinos/konawa/",
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
      "identitySource": "https://www.seminolenationcasinos.com/casinos/konawa/",
      "coordinateSource": "https://www.google.com/maps/search/?api=1&query=casino+Konawa+Rivermist+Phillips+66",
      "notes": "Hold resolved: Apple casino metadata and Google casino destination agree within metres with operator address/phone. Konawa and Rivermist are one property, not nearby retail. Reject tourism's 34.968872,-96.738022 metadata and operator's conflicting viewport/intersection wording."
    }
  },
  {
    "id": "casino-catalog-ok-pawnee-trading-post",
    "name": "Pawnee Nation Trading Post Casino",
    "lat": 36.3376159,
    "lon": -96.7938385,
    "address": "291 Agency Rd, Pawnee, OK 74058",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Casino",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://www.pawneetdc.com/subsidiaries",
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
      "identitySource": "https://www.pawneetdc.com/subsidiaries",
      "coordinateSource": "https://www.google.com/maps/search/?api=1&query=casinos+Pawnee+Yale+Oklahoma",
      "notes": "Tribal development roster lists separate gaming operation from StoneWolf at turnpike and TeePee in Yale. Named casino confirms address. StoneWolf Casino Pawnee is an alias, not main turnpike casino."
    }
  },
  {
    "id": "casino-catalog-ok-teepee-yale",
    "name": "TeePee Casino & Smoke Shop",
    "lat": 36.1170468,
    "lon": -96.6450674,
    "address": "28314 E 6th St, Yale, OK 74085",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Casino",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://www.pawneetdc.com/subsidiaries",
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
      "identitySource": "https://www.pawneetdc.com/subsidiaries",
      "coordinateSource": "https://www.google.com/maps/search/?api=1&query=casinos+Pawnee+Yale+Oklahoma",
      "notes": "Tribal roster confirms casino with pay-at-pump gas at distinct Yale property. Named map and industry directory agree. StoneWolf Casino Yale is an alias, not main Pawnee turnpike casino."
    }
  }
];
