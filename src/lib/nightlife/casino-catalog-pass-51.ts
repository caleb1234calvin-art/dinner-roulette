import type { CasinoAuditRecord } from "./casino-catalog";

/** Pass 51: current NV/OK properties and two stable-ID Wisconsin pin corrections.
 * Numerical source fields and scope decisions: audit/casino-rc-pass-51-evidence-2026-09-13.json. */
export const CASINO_CATALOG_PASS_51: CasinoAuditRecord[] = [
  {
    "id": "casino-catalog-nv-eldorado-reno",
    "name": "Eldorado Resort Casino",
    "lat": 39.529219,
    "lon": -119.814891,
    "address": "345 N Virginia St, Reno, NV",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Casino",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://www.caesars.com/eldorado-reno",
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
      "identitySource": "https://www.caesars.com/eldorado-reno",
      "coordinateSource": "https://mapcarta.com/N14063988023",
      "notes": "Current separately branded casino at The ROW. Shared resort marketing is not a fourth destination. Operator page displays inconsistent ZIP 89051; omit ZIP pending reconciliation, retain verified street/city/state. Mapcarta point is the named current casino OSM node."
    }
  },
  {
    "id": "casino-catalog-nv-silver-legacy-reno",
    "name": "Silver Legacy Resort & Casino",
    "lat": 39.53041,
    "lon": -119.815758,
    "address": "407 N Virginia St, Reno, NV 89501",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Casino",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://www.caesars.com/silver-legacy-reno",
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
      "identitySource": "https://www.caesars.com/silver-legacy-reno",
      "coordinateSource": "https://mapcarta.com/W377056531",
      "notes": "Distinct casino building in The ROW. Official postal code 89501 supersedes Mapcarta's 89503. Coordinates are the casino OSM way, not nearby hotel listings."
    }
  },
  {
    "id": "casino-catalog-nv-circus-circus-reno",
    "name": "Circus Circus Reno",
    "lat": 39.5317,
    "lon": -119.815519,
    "address": "500 N Sierra St, Reno, NV 89501",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Casino",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://www.caesars.com/circus-circus-reno",
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
      "identitySource": "https://www.caesars.com/circus-circus-reno",
      "coordinateSource": "https://mapcarta.com/W377056523",
      "notes": "Distinct Reno casino building; not Circus Circus Las Vegas and not a second record for The ROW umbrella."
    }
  },
  {
    "id": "casino-catalog-nv-casino-fandango",
    "name": "Casino Fandango",
    "lat": 39.1316995,
    "lon": -119.771595,
    "address": "3800 S Carson St, Carson City, NV 89701",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Casino",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://casinofandango.com/",
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
      "identitySource": "https://casinofandango.com/",
      "coordinateSource": "https://g.page/CasinoFandango?share",
      "notes": "Operator contact page publishes this named Google Maps destination. !3d/!4d point agrees with Mapcarta casino building within about 22 metres. Adjacent Courtyard hotel is not an additional casino."
    }
  },
  {
    "id": "casino-catalog-ok-golden-mesa",
    "name": "Golden Mesa Casino & Hotel",
    "lat": 36.6501617,
    "lon": -101.5247268,
    "address": "2469 Mile 28 Rd, Guymon, OK 73942",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Casino",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://goldenmesa.com/",
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
      "identitySource": "https://goldenmesa.com/",
      "coordinateSource": "https://maps.app.goo.gl/jVDfD88JSg4tgDoH6",
      "notes": "Current operator-published named casino destination. Separate operator link Jm5cQDxrMwn896xe6 targets the hotel at 36.6509453,-101.5232822 and is not selected as the casino point."
    }
  },
  {
    "id": "casino-catalog-ok-native-lights",
    "name": "Native Lights Casino",
    "lat": 36.9739983,
    "lon": -97.0451874,
    "address": "12375 N Highway 77, Newkirk, OK 74647",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Casino",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://tonkawacasinos.com/native-lights-casino/",
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
      "identitySource": "https://tonkawacasinos.com/native-lights-casino/",
      "coordinateSource": "https://goo.gl/maps/yupiVq9eULxaMoaw5",
      "notes": "Operator-published named casino map destination !3d/!4d; address from operator contact page. Distinct from nearby First Council."
    }
  },
  {
    "id": "casino-catalog-ok-tonkawa",
    "name": "Tonkawa Hotel & Casino",
    "lat": 36.69393113683454,
    "lon": -97.34816511753773,
    "address": "16601 W South Ave, Tonkawa, OK 74653",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Casino",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://tonkawacasinos.com/tonkawa-hotel-casino/",
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
      "identitySource": "https://tonkawacasinos.com/tonkawa-hotel-casino/",
      "coordinateSource": "https://tonkawacasinos.com/tonkawa-hotel-casino/",
      "notes": "Operator Casino JSON-LD geo. Independently resolving operator @id cid=10101010513238252667 gives 36.693931,-97.3481577, agreeing within a metre. Generic map embed q=36.6947167,-97.3499256 is not selected. The HUB and travel plaza are not extra casino destinations."
    }
  },
  {
    "id": "casino-catalog-ok-harrahs-chandler",
    "name": "Harrah's Oklahoma",
    "lat": 35.6933941,
    "lon": -96.9757739,
    "address": "338438 US Rte 66, Chandler, OK 74834",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Casino",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://www.caesars.com/harrahs-oklahoma",
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
      "identitySource": "https://www.caesars.com/harrahs-oklahoma",
      "coordinateSource": "https://www.mapquest.com/us/oklahoma/harrahs-oklahoma-810366849",
      "notes": "April 9, 2026 actual opening confirmed by Caesars investor announcement. Named MapQuest LocalBusiness geo matches current property street, phone and operator identity. Never reuse old Ioway site."
    }
  },
  {
    "id": "casino-catalog-ok-quapaw-miami",
    "name": "Quapaw Casino",
    "lat": 36.9200698,
    "lon": -94.8413449,
    "address": "6530 S 580 Rd, Miami, OK 74354",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Casino",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://quapawcasino.com/",
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
      "identitySource": "https://quapawcasino.com/",
      "coordinateSource": "https://www.google.com/maps?cid=8161278133560591666",
      "notes": "New February 2026 facility. Operator contact page embeds entity 0x7142af38e00ac532; cid resolves to named current Quapaw Casino and operator website. Use destination !3d/!4d, not embed viewport 36.9209535,-94.841907. Legacy 58100 E 64th Rd is excluded."
    }
  },
  {
    "id": "casino-catalog-ok-downstream",
    "name": "Downstream Casino Resort",
    "lat": 36.997879,
    "lon": -94.6264801,
    "address": "69300 E Nee Rd, Quapaw, OK 74363",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Casino",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://downstreamcasino.com/",
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
      "identitySource": "https://downstreamcasino.com/",
      "coordinateSource": "https://www.google.com/maps?cid=4935583452179227353",
      "notes": "Operator directions iframe names casino entity 0x447eb6fffa7062d9 and its embedded place record gives matching 69300 E Nee Rd and point. This destination is in Oklahoma; hotel-adjacent Kansas Mapcarta label and distant viewport 36.9878105,-94.6486646 are not selected."
    }
  },
  {
    "id": "casino-catalog-ok-comanche-nation",
    "name": "Comanche Nation Casino",
    "lat": 34.6044481,
    "lon": -98.3755725,
    "address": "402 SE Interstate Dr, Lawton, OK 73501",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Casino",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://comanchenationcasino.com/",
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
      "identitySource": "https://comanchenationcasino.com/",
      "coordinateSource": "https://goo.gl/maps/qjNCbhPPswMG2RKG6",
      "notes": "Operator-published named casino destination !3d/!4d, matching current property website. Administrative building at the complex is not separate."
    }
  },
  {
    "id": "casino-catalog-ok-comanche-red-river",
    "name": "Comanche Red River Hotel Casino",
    "lat": 34.1633858,
    "lon": -98.5237001,
    "address": "196747 Highway 36, Devol, OK 73531",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Casino",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://www.comancheredrivercasino.com/",
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
      "identitySource": "https://www.comancheredrivercasino.com/",
      "coordinateSource": "https://goo.gl/maps/mmEPEk8xFEPdviuS9",
      "notes": "Operator-published address building explicitly lists Comanche Red River Hotel Casino on floor 1. Destination !3d/!4d; not viewport. Closed War Pony is separate and excluded."
    }
  },
  {
    "id": "casino-catalog-ok-comanche-star",
    "name": "Comanche Star Casino",
    "lat": 34.3627298,
    "lon": -98.2928553,
    "address": "263171 Highway 53, Walters, OK 73572",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Casino",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://comanchestarcasino.com/",
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
      "identitySource": "https://comanchestarcasino.com/",
      "coordinateSource": "https://goo.gl/maps/cqvpRuhthjHoSh119",
      "notes": "Operator-published named casino destination !3d/!4d."
    }
  },
  {
    "id": "casino-catalog-ok-comanche-cache",
    "name": "Comanche Cache Casino",
    "lat": 34.642673,
    "lon": -98.6333773,
    "address": "16193 OK-115, Cache, OK 73527",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Casino",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://comanchecachecasino.com/",
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
      "identitySource": "https://comanchecachecasino.com/",
      "coordinateSource": "https://goo.gl/maps/iew5FMG1s8Gq8ZuE7",
      "notes": "Current destination casino with 330+ games. Operator map building explicitly lists casino on floor 1. Wahlburgers and adjacent travel store/gas station are not separate casinos."
    }
  },
  {
    "id": "casino-catalog-ok-comanche-spur",
    "name": "Comanche Spur Casino",
    "lat": 34.7396313,
    "lon": -98.3946067,
    "address": "9047 US Highway 62, Elgin, OK 73538",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Casino",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://comanchespurcasino.com/",
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
      "identitySource": "https://comanchespurcasino.com/",
      "coordinateSource": "https://goo.gl/maps/S85vurENuWZxfo6o9",
      "notes": "Operator-published named casino point. Viewport 34.7426092,-98.3964147 is different and rejected."
    }
  },
  {
    "id": "casino-catalog-ok-lucky-star-concho",
    "name": "Lucky Star Casino Concho",
    "lat": 35.6018285,
    "lon": -97.9634645,
    "address": "7777 US-81, El Reno, OK 73036",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Casino",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://www.luckystarcasino.org/concho/",
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
      "identitySource": "https://www.luckystarcasino.org/concho/",
      "coordinateSource": "https://g.page/luckystarcasinoconcho?share",
      "notes": "Current operator casino page and locations roster; operator map resolves to named casino and matching address. Concho is the brand/locality label; operator postal city is El Reno. Concho Travel Center is separate and excluded."
    }
  },
  {
    "id": "casino-catalog-ok-lucky-star-clinton",
    "name": "Lucky Star Casino Clinton",
    "lat": 35.5163656,
    "lon": -98.9345196,
    "address": "10347 N 2274 Rd, Clinton, OK 73601",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Casino",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://www.luckystarcasino.org/clinton/",
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
      "identitySource": "https://www.luckystarcasino.org/clinton/",
      "coordinateSource": "https://www.google.com/maps?cid=10741348358771622135",
      "notes": "Operator g.page/luckystarcasinoclinton?share identifies entity 0x9510ef6c154ec0f7; resolving cid exposes named casino destination !3d/!4d. Current address from operator roster."
    }
  },
  {
    "id": "casino-catalog-ok-seven-clans-first-council",
    "name": "7 Clans First Council Casino Hotel",
    "lat": 36.9831099,
    "lon": -97.0443445,
    "address": "12875 N Highway 77, Newkirk, OK 74647",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Casino",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://sevenclans.com/first-council-casino-hotel/",
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
      "identitySource": "https://sevenclans.com/first-council-casino-hotel/",
      "coordinateSource": "https://www.google.com/maps/search/?api=1&query=12875%20North%20Highway%2077%2074647%20Newkirk%20OK",
      "notes": "Operator directions resolves to 12875 US-77 building explicitly listing current First Council and 7 Clans Casino on floor 1; one property, not two names. Native Lights and Chilocco Gasino are separate."
    }
  },
  {
    "id": "casino-catalog-nv-j-resort-reno",
    "name": "J Resort",
    "lat": 39.52819,
    "lon": -119.818941,
    "address": "345 N Arlington Ave, Reno, NV 89501",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Casino",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://www.jresortreno.com/",
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
      "identitySource": "https://www.jresortreno.com/",
      "coordinateSource": "https://www.mapquest.com/us/nevada/j-resort-10709147",
      "notes": "Current operator casino and contact address match named MapQuest Place geo. Glow Plaza, fitness center and casino restaurants are components, not additional casino destinations."
    }
  },
  {
    "id": "casino-catalog-nv-legends-bay-sparks",
    "name": "Legends Bay Casino",
    "lat": 39.53344117,
    "lon": -119.72392026,
    "address": "100 Legends Bay Dr, Sparks, NV 89434",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Casino",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://legendsbaycasino.com/",
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
      "identitySource": "https://legendsbaycasino.com/",
      "coordinateSource": "https://www.mapquest.com/us/nevada/legends-bay-casino-521700692",
      "notes": "Current operator identity and address match named MapQuest LocalBusiness geo. Circa Sportsbook, Craft 55 and Food Truck Hall are components, not additional casino destinations. Do not infer hours/amenities from inconsistent generic site JSON-LD."
    }
  },
  {
    "id": "casino-catalog-ok-lucky-star-watonga",
    "name": "Lucky Star Casino Hotel & Convention Center Watonga",
    "lat": 35.828799,
    "lon": -98.41849,
    "address": "1407 S Clarence Nash Blvd, Watonga, OK 73772",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Casino",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://www.luckystarcasino.org/watonga/",
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
      "identitySource": "https://www.luckystarcasino.org/watonga/",
      "coordinateSource": "https://www.mapquest.com/us/oklahoma/lucky-star-casino-354756557",
      "notes": "Operator confirms integrated casino/hotel/convention complex with 414 games. Named casino MapQuest geo matches operator roster street and phone. One destination; no separate hotel or deli record."
    }
  },
  {
    "id": "casino-catalog-ok-lucky-star-canton",
    "name": "Lucky Star Casino Canton",
    "lat": 36.06769495,
    "lon": -98.60185504,
    "address": "301 Lake Rd, Canton, OK 73724",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Casino",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://www.luckystarcasino.org/canton/",
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
      "identitySource": "https://www.luckystarcasino.org/canton/",
      "coordinateSource": "https://www.mapquest.com/us/oklahoma/lucky-star-casino-346571047",
      "notes": "Operator confirms 564 games and restaurant. Named casino MapQuest geo matches operator street/phone, using its NW Lake Rd street variant. A second generic Longdale/OK-58A listing is not another property and is not used."
    }
  },
  {
    "id": "casino-catalog-ok-lucky-star-hammon",
    "name": "Lucky Star Casino Hammon",
    "lat": 35.63927167,
    "lon": -99.35816522,
    "address": "20413 OK-33, Hammon, OK 73650",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Casino",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://www.luckystarcasino.org/hammon/",
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
      "identitySource": "https://www.luckystarcasino.org/hammon/",
      "coordinateSource": "https://www.mapquest.com/us/oklahoma/lucky-star-casino-hammon-421075191",
      "notes": "Operator explicitly distinguishes a 364-game casino/restaurant from the unattached travel center in front. Named casino MapQuest geo matches address/phone. Do not add the travel plaza or duplicate TripAdvisor-derived MapQuest listing."
    }
  },
  {
    "id": "casino-catalog-ok-seven-clans-paradise",
    "name": "7 Clans Paradise Casino",
    "lat": 36.499194,
    "lon": -97.071325,
    "address": "7500 Highway 177, Red Rock, OK 74651",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Casino",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://sevenclans.com/paradise-casino/",
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
      "identitySource": "https://sevenclans.com/paradise-casino/",
      "coordinateSource": "https://www.mapquest.com/us/oklahoma/7-clans-paradise-casino-303096380",
      "notes": "Operator confirms 450+ machines, full-service bar/dining and current hours. Named MapQuest casino point matches exact operator address/phone. Red Rock Gasino is a separate convenience gaming outlet and not added."
    }
  },
  {
    "id": "casino-catalog-wi-oneida-airport",
    "name": "Oneida Casino - Airport Drive",
    "lat": 44.497535,
    "lon": -88.122424,
    "address": "2040 Airport Dr, Green Bay, WI 54313",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Casino",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://oneidacasinohotel.com/locations/",
    "isChain": false,
    "photoKey": "cafe",
    "source": "catalog",
    "venueTypes": [
      "casino"
    ],
    "energyLevel": 2,
    "audit": {
      "verifiedOn": "2026-09-13",
      "jurisdiction": "Wisconsin",
      "identitySource": "https://oneidacasinohotel.com/locations/",
      "coordinateSource": "https://www.mapquest.com/us/wisconsin/oneida-casino-6997161",
      "notes": "Current operator publishes 2040 Airport Dr for the connected casino/hotel campus. Named casino MapQuest point uses the historical casino entrance address 2020 Airport Dr; retain that as an address alias, not a second destination."
    }
  },
  {
    "id": "casino-catalog-wi-oneida-imac",
    "name": "Oneida Casino - Irene Moore Activity Center",
    "lat": 44.497146,
    "lon": -88.126045,
    "address": "2100 Airport Dr, Green Bay, WI 54313",
    "cuisines": [
      "other"
    ],
    "cuisineLabel": "Casino",
    "priceLevel": null,
    "rating": null,
    "reviewCount": null,
    "openingHours": null,
    "phone": null,
    "website": "https://oneidacasinohotel.com/locations/",
    "isChain": false,
    "photoKey": "cafe",
    "source": "catalog",
    "venueTypes": [
      "casino"
    ],
    "energyLevel": 2,
    "audit": {
      "verifiedOn": "2026-09-13",
      "jurisdiction": "Wisconsin",
      "identitySource": "https://oneidacasinohotel.com/locations/",
      "coordinateSource": "https://www.mapquest.com/us/wisconsin/irene-moore-activity-center-352637958",
      "notes": "Separate slot/bingo and dining venue at 2100 Airport Dr, explicitly retained by the operator. Old point incorrectly nearly duplicated Airport Drive; correction uses named activity-center geo. Do not merge the distinct venues."
    }
  }
];
