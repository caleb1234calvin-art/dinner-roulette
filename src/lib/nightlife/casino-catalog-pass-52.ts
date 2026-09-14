import type { CasinoAuditRecord } from "./casino-catalog";

/** Pass 52: current operator casinos, with mapping conflicts preserved in
 * audit/casino-rc-pass-52-evidence-2026-09-13.json. Unknown hours stay null. */
export const CASINO_CATALOG_PASS_52: CasinoAuditRecord[] = [
  {
    "id": "casino-catalog-nv-gold-dust-west-reno",
    "name": "Gold Dust West Reno",
    "lat": 39.528908,
    "lon": -119.824815,
    "address": "444 Vine St, Reno, NV 89503",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Casino",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://www.gdwcasino.com/home/contact",
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
      "identitySource": "https://www.gdwcasino.com/home/contact",
      "coordinateSource": "https://www.mapquest.com/us/nevada/gold-dust-west-casino-reno-10716693",
      "notes": "Current operator address and phone match named casino JSON-LD. Operator embedded map names the same entity; its viewport is not used."
    }
  },
  {
    "id": "casino-catalog-nv-gold-dust-west-carson",
    "name": "Gold Dust West Carson City",
    "lat": 39.1728498,
    "lon": -119.7436939,
    "address": "2171 E William St, Carson City, NV 89701",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Casino",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://www.gdwcasino.com/home/contact",
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
      "identitySource": "https://www.gdwcasino.com/home/contact",
      "coordinateSource": "https://www.google.com/maps?cid=16210772318200512352",
      "notes": "Operator-embedded current casino/hotel entity. Nearby MapQuest casino point agrees within 20 m. Bowling center and hotel are not additional casino destinations."
    }
  },
  {
    "id": "casino-catalog-nv-gold-dust-west-elko",
    "name": "Gold Dust West Elko",
    "lat": 40.8328496,
    "lon": -115.7846074,
    "address": "1660 Mountain City Hwy, Elko, NV 89801",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Casino",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://www.gdwcasino.com/home/contact",
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
      "identitySource": "https://www.gdwcasino.com/home/contact",
      "coordinateSource": "https://www.google.com/maps?cid=6768344075698573950",
      "notes": "Operator-embedded named current casino entity. The Grille and a generic duplicate listing at 674 Cimarron Way are not additional destinations."
    }
  },
  {
    "id": "casino-catalog-nv-bodines-carson",
    "name": "Bodines Casino",
    "lat": 39.116203,
    "lon": -119.773709,
    "address": "5650 S Carson St, Carson City, NV 89701",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Casino",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://www.bodinescarson.com",
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
      "identitySource": "https://www.bodinescarson.com",
      "coordinateSource": "https://www.mapquest.com/us/nevada/bodines-casino-42890449",
      "notes": "Current operator describes 30,000 square feet of casino gaming with restaurant and sportsbook. Named mapping record phone matches operator; current tourism also lists this destination."
    }
  },
  {
    "id": "casino-catalog-nv-caesars-republic-tahoe",
    "name": "Caesars Republic Lake Tahoe",
    "lat": 38.9593885,
    "lon": -119.942143,
    "address": "18 Highway 50, Stateline, NV 89449",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Casino",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://www.caesars.com/caesars-republic-lake-tahoe",
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
      "identitySource": "https://www.caesars.com/caesars-republic-lake-tahoe",
      "coordinateSource": "https://www.google.com/maps/search/?api=1&query=Caesars%20Republic%20Lake%20Tahoe%20-%20A%20Caesars%20Rewards%20Destination",
      "notes": "Current operator and dated opening announcement confirm Harveys successor at the same property. Actual current named Google destination supersedes conflicting MapQuest point. Harrah's is a distinct casino across the road, despite a connector."
    }
  },
  {
    "id": "casino-catalog-nv-harrahs-tahoe",
    "name": "Harrah's Lake Tahoe",
    "lat": 38.9595009,
    "lon": -119.9413874,
    "address": "15 Highway 50, Stateline, NV 89449",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Casino",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://www.caesars.com/lake-tahoe",
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
      "identitySource": "https://www.caesars.com/lake-tahoe",
      "coordinateSource": "https://www.google.com/maps/search/?api=1&query=Harrah's%20Lake%20Tahoe%20Hotel%20Casino",
      "notes": "Current separately branded casino. Named Google destination agrees with current named MapQuest resort within a metre. Generic historical hotel labels are not property coordinates."
    }
  },
  {
    "id": "casino-catalog-nv-ballys-tahoe",
    "name": "Bally's Lake Tahoe Casino Resort",
    "lat": 38.961544,
    "lon": -119.939331,
    "address": "55 Highway 50, Stateline, NV 89449",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Casino",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://casinos.ballys.com/lake-tahoe/",
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
      "identitySource": "https://casinos.ballys.com/lake-tahoe/",
      "coordinateSource": "https://www.google.com/maps/search/?api=1&query=Bally's%20Lake%20Tahoe%20Casino%20Resort",
      "notes": "Current operator casino and address; old MontBleu identity is a same-property alias, not another destination."
    }
  },
  {
    "id": "casino-catalog-nv-golden-nugget-tahoe",
    "name": "Golden Nugget Lake Tahoe Hotel & Casino",
    "lat": 38.962928,
    "lon": -119.9417864,
    "address": "50 Highway 50, Stateline, NV 89449",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Casino",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://www.goldennugget.com/lake-tahoe/",
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
      "identitySource": "https://www.goldennugget.com/lake-tahoe/",
      "coordinateSource": "https://www.google.com/maps/dir//50+Hwy+50,+Stateline,+NV+89449/@38.9629362,-119.9469363,16z/data=!4m8!4m7!1m0!1m5!1m1!1s0x80999a9c8b6c8577:0x3d27f6ce4bfab999!2m2!1d-119.9417864!2d38.962928?entry=ttu38.96295968136281,-119.94147905959996",
      "notes": "Operator directions explicitly target the 50 Highway 50 building; resolving its entity lists the current Golden Nugget on floor 1. Select destination !1d/!2d, not viewport. Hard Rock Lake Tahoe is the predecessor alias."
    }
  },
  {
    "id": "casino-catalog-nv-maverick-elko",
    "name": "Maverick Hotel & Casino",
    "lat": 40.8496295,
    "lon": -115.7469895,
    "address": "2065 Idaho St, Elko, NV 89801",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Casino",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://maverickelko.com/",
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
      "identitySource": "https://maverickelko.com/",
      "coordinateSource": "https://www.google.com/maps/search/?api=1&query=Maverick%20Hotel%20Casino%20Elko",
      "notes": "Operator confirms current 17,000-square-foot casino at 2065 Idaho Street. Separate from neighboring Gold Country; restaurant and hotel components stay one destination."
    }
  },
  {
    "id": "casino-catalog-nv-carson-valley-inn",
    "name": "Carson Valley Inn Casino",
    "lat": 38.9561283,
    "lon": -119.7677706,
    "address": "1627 US Highway 395 N, Minden, NV 89423",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Casino",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://www.carsonvalleyinn.com/",
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
      "identitySource": "https://www.carsonvalleyinn.com/",
      "coordinateSource": "https://www.google.com/maps/search/?api=1&query=Carson%20Valley%20Inn%20Casino%20Minden",
      "notes": "Current casino/resort corroborated by Carson Valley chamber address roster. Motor lodge, suites and RV park do not become separate casinos."
    }
  },
  {
    "id": "casino-catalog-nv-sharkeys-gardnerville",
    "name": "Sharkey's Casino",
    "lat": 38.9412303,
    "lon": -119.7494294,
    "address": "1440 US Highway 395 N, Gardnerville, NV 89410",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Casino",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://www.sharkeyscasino.com/",
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
      "identitySource": "https://www.sharkeyscasino.com/",
      "coordinateSource": "https://www.google.com/maps/search/?api=1&query=Sharkey's%20Casino%20Gardnerville",
      "notes": "Current 300-game casino with restaurant and sportsbook. Operator identity corroborated by Carson Valley chamber physical address."
    }
  },
  {
    "id": "casino-catalog-nv-baldinis-sparks",
    "name": "Baldini's Sports Casino",
    "lat": 39.526658,
    "lon": -119.767225,
    "address": "865 S Rock Blvd, Sparks, NV 89431",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Casino",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://baldinis.com/contact-us/",
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
      "identitySource": "https://baldinis.com/contact-us/",
      "coordinateSource": "https://www.google.com/maps/search/?api=1&query=Baldini's%20Casino%20Sparks",
      "notes": "Named current casino point agrees exactly with operator map location and same entity CID 117132192192761710. Empire Diner and sportsbook are internal components."
    }
  },
  {
    "id": "casino-catalog-nv-rail-city-sparks",
    "name": "Rail City Casino",
    "lat": 39.5349353,
    "lon": -119.7725679,
    "address": "2121 Victorian Ave, Sparks, NV 89431",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Casino",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://railcity.com/contact-us/",
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
      "identitySource": "https://railcity.com/contact-us/",
      "coordinateSource": "https://maps.app.goo.gl/wr8SrtqFbqGPZ2ZT8",
      "notes": "Operator-published building destination explicitly lists Rail City Casino on floor 1. Ale House and William Hill sportsbook are not extra destinations."
    }
  },
  {
    "id": "casino-catalog-nv-peppermill-wendover",
    "name": "Peppermill Hotel Casino Wendover",
    "lat": 40.7380149,
    "lon": -114.0564792,
    "address": "680 Wendover Blvd, West Wendover, NV 89883",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Casino",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://wendoverfun.com/resort",
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
      "identitySource": "https://wendoverfun.com/resort",
      "coordinateSource": "https://www.google.com/maps/search/?api=1&query=Peppermill%20Hotel%20Casino%20680%20Wendover%20Boulevard",
      "notes": "One of three separately located current operator resorts. Street address agrees with operator site footer and named mapping destination. Do not reuse umbrella directions to Wendover Boulevard itself."
    }
  },
  {
    "id": "casino-catalog-nv-rainbow-wendover",
    "name": "Rainbow Hotel Casino",
    "lat": 40.7376747,
    "lon": -114.0627288,
    "address": "1045 W Wendover Blvd, West Wendover, NV 89883",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Casino",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://wendoverfun.com/resort",
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
      "identitySource": "https://travelnevada.com/hotels/rainbow-hotel-casino/",
      "coordinateSource": "https://www.google.com/maps/search/?api=1&query=Rainbow%20Hotel%20Casino%201045%20Wendover%20Boulevard",
      "notes": "Current operator roster and official tourism confirm distinct casino at 1045 W Wendover Boulevard; no umbrella fourth destination."
    }
  },
  {
    "id": "casino-catalog-nv-cactus-petes-jackpot",
    "name": "Cactus Petes Resort Casino",
    "lat": 41.9853802,
    "lon": -114.6706905,
    "address": "1385 Highway 93, Jackpot, NV 89825",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Casino",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://www.cactuspetes.com/visit",
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
      "identitySource": "https://www.cactuspetes.com/visit",
      "coordinateSource": "https://goo.gl/maps/kF5sHU6cDpmU5mYW6",
      "notes": "Operator-published casino point. Independent current named point differs by about 9 m. Horseshu hotel is not automatically promoted as a second casino; separate current gaming-floor evidence remains required."
    }
  },
  {
    "id": "casino-catalog-nv-bartons-jackpot",
    "name": "Barton's Club 93",
    "lat": 41.9875221,
    "lon": -114.6722335,
    "address": "1002 US Highway 93, Jackpot, NV 89825",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Casino",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://bartonsclub93.com/",
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
      "identitySource": "https://bartonsclub93.com/",
      "coordinateSource": "https://www.google.com/maps/search/?api=1&query=Barton's%20Club%2093%20Jackpot",
      "notes": "Current operator advertises substantial casino, table games and hotel. Physical address is corroborated by the preserved town/NGC rural audit; use current named destination point."
    }
  },
  {
    "id": "casino-catalog-nv-gold-country-elko",
    "name": "Gold Country Inn & Casino",
    "lat": 40.848391,
    "lon": -115.7462775,
    "address": "2050 Idaho St, Elko, NV 89801",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Casino",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://www.sonesta.com/red-lion-hotels/nv/elko/gold-country-inn-and-casino-red-lion-hotels",
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
      "identitySource": "https://www.sonesta.com/red-lion-hotels/nv/elko/gold-country-inn-and-casino-red-lion-hotels",
      "coordinateSource": "https://www.google.com/maps/search/?api=1&query=Gold%20Country%20Inn%20and%20Casino%202050%20Idaho%20Street%20Elko",
      "notes": "Operator explicitly confirms casino play and current address. Independently listed by Elko tourism; distinct from Maverick across the road. Dead legacy Maverick Gold Country subpage is not operating evidence."
    }
  },
  {
    "id": "casino-catalog-nv-stockmens-elko",
    "name": "Stockmen's Casino and Ramada Hotel",
    "lat": 40.8306167,
    "lon": -115.7628276,
    "address": "340 Commercial St, Elko, NV 89801",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Casino",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://stockmenscasinoelko.com/",
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
      "identitySource": "https://stockmenscasinoelko.com/",
      "coordinateSource": "https://www.google.com/maps/search/?api=1&query=Stockmen's%20Hotel%20Casino%20Elko",
      "notes": "Current operator advertises more than 150 slot machines; Elko tourism links this property. Stockman's Fallon is a different city/property, retained separately."
    }
  },
  {
    "id": "casino-catalog-ok-thunderbird-norman",
    "name": "Thunderbird Casino Norman",
    "lat": 35.230944,
    "lon": -97.2075553,
    "address": "15700 OK-9, Norman, OK 73026",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Casino",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://playthunderbird.com/",
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
      "identitySource": "https://www.astribe.com/casinos",
      "coordinateSource": "https://playthunderbird.com/",
      "notes": "Operator LocalBusiness JSON-LD matches Norman casino location, tribal roster and named MapQuest geo. Distinct from Shawnee; provider business entity text is not the consumer-facing name."
    }
  },
  {
    "id": "casino-catalog-ok-thunderbird-shawnee",
    "name": "Thunderbird Casino Shawnee",
    "lat": 35.2945158,
    "lon": -96.9255181,
    "address": "2051 S Gordon Cooper Dr, Shawnee, OK 74801",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Casino",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://playthunderbird.com/",
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
      "identitySource": "https://www.astribe.com/casinos",
      "coordinateSource": "https://www.google.com/maps/search/?api=1&query=Thunderbird%20Casino%20Shawnee",
      "notes": "Tribal and operator FAQ agree on 2051 S Gordon Cooper Drive. Current named mapping destination links operator; reject the unrelated Norman/100 Breakwater Dr MapQuest listing."
    }
  },
  {
    "id": "casino-catalog-ok-kickapoo-harrah",
    "name": "Kickapoo Casino Harrah",
    "lat": 35.4932845,
    "lon": -97.0833812,
    "address": "25230 E Highway 62, Harrah, OK 73045",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Casino",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://www.kickapoo-casino.com/contact-harrah",
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
      "identitySource": "https://www.kickapoo-casino.com/contact-harrah",
      "coordinateSource": "https://goo.gl/maps/R5LHRzDe84BQQ43D6",
      "notes": "Operator confirms 500-game casino with dining/table games. Named operator map controls; separate Travel Plaza at 25200 US-62 is excluded."
    }
  },
  {
    "id": "casino-catalog-ok-kickapoo-shawnee",
    "name": "Kickapoo Casino Shawnee",
    "lat": 35.3634421,
    "lon": -96.9680795,
    "address": "38900 W MacArthur Dr, Shawnee, OK 74804",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Casino",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://www.kickapoo-casino.com/contact-shawnee",
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
      "identitySource": "https://www.kickapoo-casino.com/contact-shawnee",
      "coordinateSource": "https://goo.gl/maps/5b6wLDPmnfvr6fx39",
      "notes": "Current operator 300-game casino. Current named operator map supersedes nearby differently placed MapQuest points."
    }
  },
  {
    "id": "casino-catalog-ok-apache-lawton",
    "name": "Apache Casino Hotel",
    "lat": 34.6069743,
    "lon": -98.3602121,
    "address": "2315 E Gore Blvd, Lawton, OK 73501",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Casino",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://www.apachecasinohotel.com/",
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
      "identitySource": "https://www.apachecasinohotel.com/",
      "coordinateSource": "https://www.google.com/maps?cid=9117535126341404556",
      "notes": "Operator directions entity resolves to current named casino/hotel. Do not add the Fort Sill Apache former-name listing or Comancheria hotel as extra casinos."
    }
  },
  {
    "id": "casino-catalog-ok-kiowa-devol",
    "name": "Kiowa Casino & Hotel",
    "lat": 34.143151,
    "lon": -98.525413,
    "address": "198131 Highway 36, Devol, OK 73531",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Casino",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://kiowacasino.com/contact",
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
      "identitySource": "https://kiowacasino.com/contact",
      "coordinateSource": "https://www.google.com/maps?cid=5610799249415385304",
      "notes": "Operator directions and current named casino entity agree exactly. Distinct from Comanche Red River north of it."
    }
  },
  {
    "id": "casino-catalog-ok-kiowa-carnegie",
    "name": "Kiowa Casino Carnegie",
    "lat": 35.102526,
    "lon": -98.5949474,
    "address": "514 OK-9, Carnegie, OK 73015",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Casino",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://kiowacasino.com/contact",
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
      "identitySource": "https://kiowacasino.com/contact",
      "coordinateSource": "https://www.google.com/maps/dir//Kiowa+Casino%2FCarnegie,+514+OK-9,+Carnegie,+OK+73015/@35.1030889,-98.5937448,15z/data=!4m8!4m7!1m0!1m5!1m1!1s0x87ac4e15f4070971:0x4a6f83816baf56e0!2m2!1d-98.5937448!2d35.1030889",
      "notes": "Operator-published named casino route now resolves to destination 35.102526,-98.5949474, superseding its embedded older endpoint and a vague MapQuest Highway 9 point. Use final destination !1d/!2d; current name/site also verified via CID."
    }
  },
  {
    "id": "casino-catalog-ok-kiowa-elk-creek",
    "name": "Elk Creek Kiowa Casino",
    "lat": 35.0199635,
    "lon": -99.0613392,
    "address": "13765 US-183, Hobart, OK 73651",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Casino",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://elkcreekcasino.com/",
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
      "identitySource": "https://elkcreekcasino.com/",
      "coordinateSource": "https://www.google.com/maps/place/Elk+Creek+Kiowa+Casino/@35.0199634,-99.0662101,17z/data=!3m1!4b1!4m6!3m5!1s0x87ac7befea54f6a7:0xcd6974edb5084782!8m2!3d35.0199635!4d-99.0613392!16s%2Fg%2F11s90x474_?entry=ttu&g_ep=EgoyMDI1MDcxMy4wIKXMDSoASAFQAw%3D%3D",
      "notes": "Current dedicated 250-game casino is explicitly NOW OPEN, with current hours and table games. Parent contact page incorrectly repeats Carnegie address/old Summer 2025 teaser; current property site and its named map supersede that stale copy."
    }
  },
  {
    "id": "casino-catalog-ok-sac-fox-stroud",
    "name": "Sac and Fox Nation Casino Stroud",
    "lat": 35.672381,
    "lon": -96.660182,
    "address": "356120 E 926 Rd, Stroud, OK 74079",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Casino",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://snfcasino.com/contact",
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
      "identitySource": "https://snfcasino.com/contact",
      "coordinateSource": "https://www.google.com/maps?cid=6360807874433570763",
      "notes": "Operator confirms 150-game casino and restaurant. Its published casino map entity resolves current point. Black Hawk is a separately located destination."
    }
  },
  {
    "id": "casino-catalog-ok-black-hawk-shawnee",
    "name": "The Black Hawk Casino",
    "lat": 35.3920224,
    "lon": -96.9097231,
    "address": "42008 Westech Rd, Shawnee, OK 74804",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Casino",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://theblackhawkcasino.com/contact/",
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
      "identitySource": "https://theblackhawkcasino.com/contact/",
      "coordinateSource": "https://www.google.com/maps?cid=2503782112715376828",
      "notes": "Current point resolves the operator-published entity, about 17 m from older published endpoint. Conflicting MapQuest location is rejected; old Sac & Fox name is not a second Shawnee casino."
    }
  },
  {
    "id": "casino-catalog-ok-seminole-i40",
    "name": "Seminole Nation Casino I-40",
    "lat": 35.3819761,
    "lon": -96.672584,
    "address": "11267 Interstate 40, Seminole, OK 74868",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Casino",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://www.seminolenationcasinos.com/casinos/i-40/",
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
      "identitySource": "https://www.seminolenationcasinos.com/casinos/i-40/",
      "coordinateSource": "https://www.google.com/maps?cid=1572805053226501656",
      "notes": "Operator confirms 425-game standalone casino next to the gas station at I-40 Exit 200. Its embedded entity resolves correct point; two named MapQuest records near Seminole city are over 10 miles wrong and rejected."
    }
  },
  {
    "id": "casino-catalog-ok-seminole-wewoka",
    "name": "Seminole Nation Casino Wewoka",
    "lat": 35.1296099,
    "lon": -96.491768,
    "address": "36625 US-270 BUS, Wewoka, OK 74884",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Casino",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://www.seminolenationcasinos.com/casinos/wewoka/",
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
      "identitySource": "https://www.seminolenationcasinos.com/casinos/wewoka/",
      "coordinateSource": "https://www.google.com/maps/search/?api=1&query=Seminole%20Nation%20Casino%20Wewoka",
      "notes": "Operator explicitly distinguishes the 122-slot casino next to the trading post and advertises it as one of three casinos. One physical casino destination with Trading Post Casino alias; store is not an extra record. Current Google destination corroborates property."
    }
  }
];
