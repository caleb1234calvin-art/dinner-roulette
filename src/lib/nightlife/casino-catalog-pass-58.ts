import type { CasinoAuditRecord } from "./casino-catalog";

/** Pass 58: reconciled operator casino floors and Davis West gaming. */
export const CASINO_CATALOG_PASS_58: CasinoAuditRecord[] = [
  {
    "id": "casino-catalog-nv-luckys-usa-parkway",
    "name": "USA Parkway Lucky's Casino",
    "lat": 39.5590145,
    "lon": -119.4898624,
    "address": "400 USA Pkwy #439, Sparks, NV 89437",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Casino",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://pilotcasinos.com/locations/usa-parkway-luckys/",
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
      "identitySource": "https://pilotcasinos.com/locations/usa-parkway-luckys/",
      "coordinateSource": "https://pilotcasinos.com/locations/usa-parkway-luckys/",
      "notes": "Operator explicitly locates the casino inside ONE9 at USA Parkway/McCarran. Use its named building destination and postal address, not the broad search returning unrelated Las Vegas/Carson casinos. The page inconsistently says Fernley in a heading; the mapped property is Sparks/McCarran."
    }
  },
  {
    "id": "casino-catalog-nv-pilot-fernley",
    "name": "Pilot Casino Fernley",
    "lat": 39.6138045,
    "lon": -119.2662816,
    "address": "465 Pilot Rd, Fernley, NV 89408",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Casino",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://pilotcasinos.com/locations/fernley-pilot/",
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
      "identitySource": "https://pilotcasinos.com/locations/fernley-pilot/",
      "coordinateSource": "https://www.google.com/maps/search/?api=1&query=Pilot%20Casino%20Fernley%20Nevada",
      "notes": "Operator confirms a dedicated casino with over 60 machines; named casino point agrees with its mapped travel-center building."
    }
  },
  {
    "id": "casino-catalog-nv-luckys-fernley",
    "name": "Fernley Lucky's Casino",
    "lat": 39.6179521,
    "lon": -119.2666145,
    "address": "825 Commerce Center Dr, Fernley, NV 89408",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Casino",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://pilotcasinos.com/locations/fernley-luckys/",
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
      "identitySource": "https://pilotcasinos.com/locations/fernley-luckys/",
      "coordinateSource": "https://pilotcasinos.com/locations/fernley-luckys/",
      "notes": "Operator confirms the renovated 60-machine casino inside Love's. A current map still names 4 Way Casino at the same address. The casino is one destination; no separate travel-stop record."
    }
  },
  {
    "id": "casino-catalog-nv-pilot-winnemucca",
    "name": "Pilot Casino Winnemucca",
    "lat": 40.9311507,
    "lon": -117.8043148,
    "address": "5625 W Winnemucca Blvd, Winnemucca, NV 89445",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Casino",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://pilotcasinos.com/locations/winnemucca-pilot/",
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
      "identitySource": "https://pilotcasinos.com/locations/winnemucca-pilot/",
      "coordinateSource": "https://www.google.com/maps/search/?api=1&query=Pilot+Casino+Winnemucca+property",
      "notes": "Current operator confirms 70+ gaming machines at I-80 Exit 176. Distinct from Roadhouse at Exit 180; some Roadhouse searches incorrectly resolve here."
    }
  },
  {
    "id": "casino-catalog-nv-roadhouse-winnemucca",
    "name": "Winnemucca Roadhouse Casino",
    "lat": 40.982876,
    "lon": -117.699209,
    "address": "4400 Rim Rock Rd, Winnemucca, NV 89445",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Casino",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://pilotcasinos.com/locations/winnemucca-roadhouse/",
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
      "identitySource": "https://pilotcasinos.com/locations/winnemucca-roadhouse/",
      "coordinateSource": "https://www.mapquest.com/us/nevada/roadhouse-casino-363074340",
      "notes": "Operator confirms 55-machine casino at Exit 180. Its map names the WINGERS building; a separate named Casino MapQuest point agrees with that building. Reject search results that resolve to Pilot at Exit 176."
    }
  },
  {
    "id": "casino-catalog-nv-pilot-carlin",
    "name": "Pilot Casino Carlin",
    "lat": 40.719615,
    "lon": -116.105794,
    "address": "791 10th St, Carlin, NV 89822",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Casino",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://pilotcasinos.com/locations/carlin-pilot/",
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
      "identitySource": "https://pilotcasinos.com/locations/carlin-pilot/",
      "coordinateSource": "https://www.google.com/maps/search/?api=1&query=Pilot+Casino+791+10th+St+Carlin+Nevada",
      "notes": "Operator confirms 60+ slot machines and the address. Named casino map supports the distinct Carlin property; a failed raw scrape was not treated as evidence."
    }
  },
  {
    "id": "casino-catalog-nv-roadhouse-elko",
    "name": "Elko Roadhouse Casino",
    "lat": 40.8530921,
    "lon": -115.7489166,
    "address": "1165 E Jennings Way #102, Elko, NV 89801",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Casino",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://pilotcasinos.com/locations/elko-roadhouse/",
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
      "identitySource": "https://pilotcasinos.com/locations/elko-roadhouse/",
      "coordinateSource": "https://pilotcasinos.com/locations/elko-roadhouse/",
      "notes": "Operator confirms a 45-machine casino; its embedded named building point uses 1165 E Jennings Way, independently corroborated by Casino City suite 102 and Explore Elko's gaming roster. Reject the operator directory's copied 4400 Rim Rock Road address, which belongs to Winnemucca."
    }
  },
  {
    "id": "casino-catalog-nv-luckys-wells",
    "name": "Wells Lucky's Casino",
    "lat": 41.0989963,
    "lon": -114.9601064,
    "address": "157 US-93, Wells, NV 89835",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Casino",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://pilotcasinos.com/locations/wells-luckys/",
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
      "identitySource": "https://pilotcasinos.com/locations/wells-luckys/",
      "coordinateSource": "https://pilotcasinos.com/locations/wells-luckys/",
      "notes": "Operator confirms a renovated 50-machine casino inside the mapped Love's Travel Stop. Distinct from Alamo Wells at 1440 6th Street; a timed-out broad map query is not positive verification."
    }
  },
  {
    "id": "casino-catalog-nv-luckys-ely",
    "name": "Ely Lucky's Casino",
    "lat": 39.2421535,
    "lon": -114.8692334,
    "address": "1701 Great Basin Blvd, Ely, NV 89301",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Casino",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://pilotcasinos.com/locations/ely-luckys/",
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
      "identitySource": "https://pilotcasinos.com/locations/ely-luckys/",
      "coordinateSource": "https://pilotcasinos.com/locations/ely-luckys/",
      "notes": "Operator confirms a renovated 50-machine casino inside this mapped Love's Travel Stop. Broad Lucky's queries returned unrelated Las Vegas businesses and were rejected."
    }
  },
  {
    "id": "casino-catalog-nv-pilot-wendover",
    "name": "Pilot Casino Wendover",
    "lat": 40.7394238,
    "lon": -114.0667009,
    "address": "1200 Wendover Blvd, West Wendover, NV 89883",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Casino",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://pilotcasinos.com/locations/wendover-pilot/",
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
      "identitySource": "https://pilotcasinos.com/locations/wendover-pilot/",
      "coordinateSource": "https://www.google.com/maps/search/?api=1&query=Pilot%20Casino%20Wendover%20Nevada",
      "notes": "Operator confirms a 90+ machine casino; current named map and gaming reviews include a bubble-craps machine. West Wendover, Nevada property is distinct from resort casinos and Utah."
    }
  },
  {
    "id": "casino-catalog-nv-alamo-north-las-vegas",
    "name": "Alamo Casino North Las Vegas Petro",
    "lat": 36.2798376,
    "lon": -115.0260116,
    "address": "6595 N Hollywood Blvd, North Las Vegas, NV 89115",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Casino",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://www.thealamo.com/alamo-casino-las-vegas-petro/",
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
      "identitySource": "https://www.thealamo.com/alamo-casino-las-vegas-petro/",
      "coordinateSource": "https://www.google.com/maps/search/?api=1&query=Alamo+Casino+Las+Vegas+Petro",
      "notes": "Operator explicitly confirms video poker/reel gaming at North LV Petro, separate from Las Vegas TA and all other Alamo casinos."
    }
  },
  {
    "id": "casino-catalog-nv-alamo-las-vegas-ta",
    "name": "Alamo Casino Las Vegas TA",
    "lat": 36.043592,
    "lon": -115.1868317,
    "address": "8050 Dean Martin Dr, Las Vegas, NV 89139",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Casino",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://www.thealamo.com/alamo-casino-las-vegas-ta/casino",
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
      "identitySource": "https://www.thealamo.com/alamo-casino-las-vegas-ta/casino",
      "coordinateSource": "https://www.google.com/maps/search/?api=1&query=Alamo+Casino+8050+Dean+Martin+Drive",
      "notes": "Operator casino page confirms slots, video poker and table games at TA. Named casino point is not the nearby Silverton resort."
    }
  },
  {
    "id": "casino-catalog-ok-davis-west-gaming",
    "name": "Davis Gaming - Chickasaw Travel Stop",
    "lat": 34.507499,
    "lon": -97.1771913,
    "address": "33967 N County Rd, Davis, OK 73030",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Casino",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://chickasawtravelstop.com/locations/davis-west/",
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
      "identitySource": "https://chickasawtravelstop.com/locations/davis-west/",
      "coordinateSource": "https://goo.gl/maps/KGaxMbWDirN6U1o46",
      "notes": "Current operator explicitly lists Casino at Davis West; Chickasaw Country names the small Davis Gaming casino housed there. Operator directions resolve to the west-side travel-stop property. Distinct from Treasure Valley east of I-35. Old Davis East/12218 Highway 7 directory address is not used."
    }
  },
  {
    "id": "casino-catalog-ok-ada-west-gaming",
    "name": "Chickasaw Travel Stop Ada West",
    "lat": 34.7734017,
    "lon": -96.6980885,
    "address": "201 Latta Rd, Ada, OK 74820",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Casino",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://chickasawtravelstop.com/locations/ada-west/",
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
      "identitySource": "https://chickasawtravelstop.com/locations/ada-west/",
      "coordinateSource": "https://goo.gl/maps/bcaDyDp9m1tyZMjCA",
      "notes": "Current operator lists casino gaming at Ada West, and current Chickasaw Country identifies it as a gaming destination. This is separate from Ada Gaming Center/CTS Ada East. Current 201 Latta Road address supersedes legacy 14565 County Road 3544; operator directions resolve to 201 Latta."
    }
  }
];
