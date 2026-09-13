import type { CasinoAuditRecord } from "./casino-catalog";

/** Pass 53: adversarial address reconciliation and current destination omissions. */
export const CASINO_CATALOG_PASS_53: CasinoAuditRecord[] = [
  {
    "id": "casino-catalog-nv-club-cal-neva",
    "name": "Club Cal Neva",
    "lat": 39.5267274,
    "lon": -119.8126797,
    "address": "38 E 2nd St, Reno, NV 89501",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Casino",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://clubcalneva.com/contact-us",
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
      "identitySource": "https://clubcalneva.com/contact-us",
      "coordinateSource": "https://www.google.com/maps/search/?api=1&query=Club+Cal+Neva+38+East+2nd+St+Reno+NV",
      "notes": "Operator contact and current gaming pages confirm the operating Reno casino. Its published Google map names the same current casino; the resolved named destination agrees. Former hotel towers and the internal sportsbook are components, not extra casino destinations."
    }
  },
  {
    "id": "casino-catalog-nv-montego-bay-wendover",
    "name": "Montego Bay Hotel Casino Resort",
    "lat": 40.7363114,
    "lon": -114.0445266,
    "address": "100 Wendover Blvd, West Wendover, NV 89883",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Casino",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://wendoverfun.com/rooms/montego-bay/",
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
      "identitySource": "https://wendoverfun.com/rooms/montego-bay/",
      "coordinateSource": "https://www.google.com/maps/search/?api=1&query=Montego+Bay+100+Wendover+Blvd",
      "notes": "Resolved the Pass 52 address hold: the property's official indexed profile and independent named lodging/MapQuest listings use 100 Wendover Blvd; an exact-address Google query resolves the same Montego Bay entity. The operator's umbrella contact address 1045 and tourism listing 6800 are shared/other-property addresses and must not control routing. Casino and hotel form one destination."
    }
  },
  {
    "id": "casino-catalog-ok-remington-park",
    "name": "Remington Park Racing & Casino",
    "lat": 35.52789,
    "lon": -97.471225,
    "address": "1 Remington Place, Oklahoma City, OK 73111",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Casino",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://www.remingtonpark.com/casino",
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
      "identitySource": "https://www.remingtonpark.com/casino",
      "coordinateSource": "https://www.google.com/maps/search/?api=1&query=Remington+Park",
      "notes": "Current operator casino page describes a 750-machine gaming floor; current contact page supplies One Remington Place. Named property destination marks the integrated casino/racing building rather than the racetrack infield or Oklahoma City centre. One physical destination."
    }
  },
  {
    "id": "casino-catalog-soaring-eagle-slot-palace",
    "name": "Soaring Eagle Slot Palace",
    "lat": 43.6061056,
    "lon": -84.7052673,
    "address": "7566 Ogemaw Dr #7076, Mount Pleasant, MI 48858",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Casino",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://soaringeaglecasino.com/slot-palace",
    "isChain": false,
    "photoKey": "cafe",
    "source": "catalog",
    "venueTypes": [
      "casino"
    ],
    "energyLevel": 2,
    "audit": {
      "verifiedOn": "2026-09-13",
      "jurisdiction": "Michigan",
      "identitySource": "https://soaringeaglecasino.com/slot-palace",
      "coordinateSource": "https://www.google.com/maps/search/?api=1&query=7566+Ogemaw+Dr+Mt+Pleasant",
      "notes": "The operator's body repeats the main resort address 6800 Soaring Eagle Blvd, but its actual directions link explicitly routes to 7566 Ogemaw Dr #7076. Google identifies that building as the Slot Palace on Floor 1. Use the routable building address and numerical building destination, approximately 17 metres from the existing OSM casino footprint point. Preserve the stable ID and separate casino across the street."
    }
  }
];
