# Pick For Us — Missouri 2026 Three-Source Seasonal Delta Sweep

Date: 2026-10-08

## Mission

Use three actively updated/current-season secondary discovery sources as **field-level fact reservoirs** and recall expansion inputs:

1. FrightMaps Missouri
   - https://frightmaps.com/home-haunts/missouri
   - https://frightmaps.com/best-haunted-houses-missouri-2026
2. MissouriHauntedHouses.com
   - https://www.missourihauntedhouses.com/
   - https://www.missourihauntedhouses.com/haunted-attractions/
3. The Scare Factor Missouri
   - https://www.thescarefactor.com/haunted-houses/missouri/

This is a discovery/enrichment audit only.

Do not automatically import a directory listing.
Do not require a directory listing to be complete before using a supported field.
Do not treat a directory "updated" label as proof that every field is current.

## Field-level rule

For every candidate, preserve facts independently by field:

- identity/name
- city/address
- current-season signal
- activity/category
- dates
- hours
- admission
- parking/access
- official/operator URL
- family/age/accessibility notes
- lifecycle/cancellation indicators

A useful current field may be retained even when other fields are missing or stale.

Important consumer-facing facts should be strengthened with operator, municipal, park, ticketing, DMO, or other first-party/public-authority evidence before runtime use.

Conflicting fields stay explicit; do not average or silently choose.

## Current comparison target

The cumulative Missouri candidate/runtime set currently contains these 28 names:

- Beast Haunted House
- Beyond The Outer Limits
- Bollinger Mill State Historic Site — Trick-or-Treat Night
- Brookdale Farms Fall Festival
- Campbell’s Maze Daze & Pumpkin Patch
- Christine’s Vineyard — Witches Day Out
- Dead Factory Haunted House
- Dungeons of Doom
- Fun Farm
- Haunted Hall of Horror at A. C. Brase Arena
- Hotel of Terror
- James River Church Joplin — October 31st Party
- Lloyd’s Family Farm
- McWilliams Pumpkin Patch
- Monster Corn Maze
- Nathan and Olive Boone Homestead — Historical Haunts
- Nevada/Vernon County Oktoberfest Fall Festival
- Osage Beach City Park Fall Festival
- Perryville Pumpkin Farm
- Pomme de Terre State Park — Pomme de Terror
- RIP at Myer’s Inn
- Rutledge-Wilson Farm Park
- Sam A. Baker State Park — Halloween Bash
- Shryocks Callaway Farms
- Silver Dollar City — Harvest Festival
- The Aftermath Haunted Attraction
- The Werehouse
- Urban Gardens Pumpkin Patch & Corn Maze

This list is for runtime/candidate delta comparison only. A source-listed name absent here may still exist in older statewide audit history.

## Source freshness observations

### FrightMaps

The Missouri 2026 ranking says:
- published Sep. 16, 2026
- updated Oct. 6, 2026
- rankings are drawn from live Missouri FrightMaps listings
- the broader Missouri map includes additional ticketed attractions and home haunts

Examples with explicit current data:
- Wentzville’s Halls Of Horror — Oct. 30–31, 2026; home haunt; free
- Boulevard Frights — marked Updated for 2026 on Oct. 1; public listing includes street address, weekly hours, free admission, and weather caveat
- Spooky Hollow Dyerdown Holiday House — Halloween 2026 opening signal and weekly hours
- numerous other home/yard-haunt leads

### MissouriHauntedHouses.com

Current site labels itself for the 2026 season and exposes individual pages with:
- 2026 schedule calendars
- hours
- admission
- current "next open" status
- parking/amenity details on some pages
- last-updated age on some pages

Examples:
- Rising Haunted Attraction — 2026 schedule; 8–11 p.m.; General $20 / Fast Pass $30
- Fun Time Farms Corn MAiZE & Zombie Shootout — Sep. 25–Oct. 31; hours and admission details
- Johnson Farms Plants & Pumpkins — Sep. 11–Nov. 1; 9 a.m.–7 p.m.; current admission details
- The Werehouse — current 2026 schedule and 7 p.m.–midnight-or-until-last-ticket-holder wording
- Aurora Maze at Adventure Farm / Zombie Harvest — current 2026 schedule and activity/admission details

### The Scare Factor

Missouri page currently exposes 64 listings and their attraction type/city.

This is particularly valuable for recall because it surfaces:
- professional haunted houses
- trails
- haunted corn mazes
- hayrides
- amusement-park haunts
- home/yard displays
- unusual seasonal attraction types

## Commercial/public-attraction runtime-delta leads

High-priority names currently absent from the 28-name runtime/candidate comparison set include:

- Waco School House Haunt — Asbury
- The Aurora Maze at Adventure Farm and The Zombie Harvest — Aurora
- The Bakersfield Haunted House — Bakersfield
- Tunnel of Terror Ballwin
- Field of Screams Branson
- The Curse at the Branson Ghoster Coaster
- Dark Nightmares Haunted Attraction — Buckner
- Fearstone Forest Haunted Trail — Camdenton
- Wolfmans House of Screams — Carl Junction
- Myers Forest of Fears — Carthage
- Missouri Nightmare Haunted Attraction — Columbia
- Fright Fest at Six Flags MO — Eureka
- The Hollows at Brookdale Farms — Eureka
- Exeter Corn Maze — Exeter
- Trepidations Haunted Attraction — Exeter
- Creepyworld — Fenton
- TerrifiedExist Haunted Attractions — Florissant
- Hannibal Jaycees Haunted House
- Terror at the Ranch — Harrisonville
- The Goblin Kings Haunted Trail — Hartville
- Mount Washington Manor — Independence
- Macabre Cinema — Kansas City
- The Edge of Hell — Kansas City
- Worlds of Fun Halloween Haunt — Kansas City
- Zombie World Strange Things — Kingdom City
- Ozark Nightmares Haunted House — Lebanon
- Fun Time Farms Haunted Corn MAiZE — Lowry City
- Labyrinth of Fear — Nevada
- Field of Screams Haunted Forest — Nixa
- Dark Lords Manor Haunted House — Noel
- Tunnel of Terror O’Fallon
- PanicFest The Cobb Factory — Old Monroe
- Haunted Hollows Haunted Trail — Palmyra
- The Haunted Grotto — Poplar Bluff
- Hell Harvest — Potosi
- Twisted Minds Haunted House — Richwoods
- A Field of Screams — Rolla
- Lemp Brewery Haunted House — St. Louis
- The Darkness — St. Louis
- Terror on Route 66 — Sullivan
- Freaks Fair Haunted Attraction — Warrensburg
- Haunted River Float — Waynesville
- Rising Haunted Attraction — Waynesville
- The Cadaver Zone Spook House — Webb City
- Fear the Bloody Timber — West Plains
- Annual Farrington Park Haunted Hayride — Windsor

Additional MissouriHauntedHouses/FrightMaps leads include:
- Hell Harvest Haunted House
- The Branson Ghoster
- House Of Screams
- ScareZone31
- Tanner’s Trail of Terror
- Chapman Farms Lakeside Hauntings
- Horror In The Holler

These are **leads, not import clearance**.

## Residential/home-haunt track

Keep home/yard displays on a separate product-policy and verification track.

Examples surfaced:
- Wentzville’s Halls Of Horror
- Spooks on Spur
- Lurch’s Yard
- Boulevard Frights
- Spooky Hollow / Dyerdown Holiday House
- skeletons On Kerth Road
- Ravens Fright
- The Dorsett Hill Haunt
- The Candy Corn Trail of Terror
- The Haunting of Green Berry
- Wicked Wraith Haunted House
- The Crypt Haunted Attraction
- Apple Ridge Orchard spooky house
- Bentwater Butcher’s Block
- Johnson’s Haunted Walk Thru
- The Bedford Boneyard
- Valli Of Lights
- A Southern Hills Nightmare
- Arbuckle Halloween House
- Baker Halloween House

Rules before any residential runtime import:
- use only an address/location intentionally published by the haunt/operator for public visitation
- do not infer a private residence address from unrelated records
- confirm the listing is publicly inviting visitors in 2026
- preserve free/donation/ticket semantics exactly
- verify dates/hours close to visit because home-haunt schedules are especially volatile
- provide no precision stronger than the operator-published visitor destination
- allow owner/product decision on whether residential home haunts belong in Pick For Us at all

## Immediate enrichment candidates

Existing/known records can also benefit from these sources even when no new venue is created.

Examples:
- The Werehouse: current secondary source contributes 2026 hours wording
- Beast: secondary schedules can cross-check 2026 operating dates
- Monster Corn Maze: cross-source category/current-season signal
- Dead Factory: current directory signal can supplement but not replace first-party facts
- Brookdale: The Scare Factor distinguishes "The Hollows at Brookdale Farms" from daytime Fall Festival, useful for avoiding category conflation

Enrichment must not overwrite stronger first-party evidence.

## Verification priority

Tier A — source overlap/current 2026 detail:
- Rising Haunted Attraction
- Wolfmans House of Screams
- Hell Harvest
- Labyrinth of Fear
- Fun Time Farms
- Johnson Farms Plants & Pumpkins
- Aurora Maze / Zombie Harvest
- Edge of Hell
- Creepyworld
- The Darkness
- Missouri Nightmare
- Haunted River Float
- Fear the Bloody Timber
- Waco School House Haunt

Tier B — good directory lead, first-party verification needed:
- remaining commercial/public leads above

Tier C — residential/home haunts:
- keep separate until product-policy approval plus operator-public invitation verification

## Next gate

1. Dedupe Tier A/B against the full statewide historical audit, not only the current runtime set.
2. For true delta records, retrieve first-party/operator/public-authority sources.
3. Build field-level evidence ledgers.
4. Independently verify only the net-new delta.
5. Import cleared records in one larger batch.
6. Enrich existing records only where the new field is current and stronger or additive.
