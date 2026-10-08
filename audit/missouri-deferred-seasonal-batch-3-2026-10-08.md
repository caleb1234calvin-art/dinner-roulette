# Pick For Us — Missouri Deferred Seasonal Batch 3 Research Candidate

Date: 2026-10-08

## Status

**AUTHOR RESEARCH VERDICT: 3 CLEARANCE CANDIDATES — FRESH INDEPENDENT VERIFICATION REQUIRED.**

This is a bounded research/copy task only. It does not authorize runtime import, merge, deployment, catalog activation, Open Now, Android changes, or production release.

Current release baseline at task start:
- main: `213502ef8cf3f67d75e6d9c9c8ff43f9f656890c`
- production: `dpl_BCdD3eWRXk6UEN2FNJQE88r18VXv`
- production state: READY
- production Git source: exact current main

Seventeen curated seasonal records are already live. This batch considers only three of the eleven records deliberately deferred from the previous release.

## Records

### MO26-036 — Monster Corn Maze — Cabool

**Author assessment: CLEARANCE CANDIDATE.**

Fresh first-party review:
- Operator home: https://www.monstercornmaze.com/
- Operator FAQ: https://www.monstercornmaze.com/faq.htm
- Visitor address: **711 State Route AM, Cabool, MO 65689**.
- Operator gives direct road approach instructions from Cabool and Willow Springs and identifies the attraction on State Route AM.
- 2026 season: Fridays and Saturdays, September 18 through October 30.
- Gates open 18:30; maze starts after dark; ticket sales end 23:00; final close is after the last ticket-holder exits.
- General admission $20; VIP reservation $30.
- VIP timed slots run 20:00–23:00 in 15-minute blocks; operator requests prompt arrival.
- VIP refunds are limited to operator closure such as weather; pre-purchased general admission is usable during the current season and nonrefundable.
- Ages **13 and under require an adult at all times**.
- No pets, smoking, alcohol/illicit drugs, weapons, backpacks/purses or flashlights.
- Maze is not handicap accessible.
- Operator warns about rough terrain, stairs, long paths, flashing lights and intense scares for guests with health conditions.
- Weather can force closure; operator directs visitors to the website for closure updates.

Disposition of former HOLD:
- The prior exact-entrance requirement should be reviewed against the currently shipped `ListingCompletenessV1` contract. The operator now supplies an explicit visitor street address plus road approach directions.
- Candidate should use the supported visitor address for Directions.
- Any retained Census/address geocode may be used only for approximate map/radius placement, never as entrance/parking precision.
- Open Now must remain disabled unless separately machine-verified; source times are display facts only.

Remaining independent checks:
- Confirm prior approximate placement still binds to the supported visitor address/entity.
- Confirm no current cancellation/closure notice.
- Confirm full candidate preserves the age, accessibility, VIP/refund and weather restrictions above.

### MO26-069 — Dead Factory Haunted House — Mexico

**Author assessment: CLEARANCE CANDIDATE.**

Fresh first-party review:
- Operator home: https://deadfactory.com/
- Operator tickets: https://deadfactory.com/buy-tickets/
- Visitor address: **2100 E. Liberty, Mexico, Missouri 65265**.
- Operator explicitly states **plenty of free parking on site**.
- 2026 season: September 25 through October 31, Fridays and Saturdays only.
- Doors 19:00–23:00.
- Admission $25 per person / all ages, purchased at the ticket booth.
- Operator states no hidden ticket tax or fees; cash, credit and debit accepted.
- Children under 13 must be accompanied by an adult.
- Indoor waiting area; operator states rain or shine.
- Attraction is an approximately 25–30 minute self-guided walkthrough.
- No touching; monsters will not touch guests.

Disposition of former HOLD:
- Prior direct-source freshness concern is resolved by current first-party pages.
- Prior arrival concern is materially improved by the operator's explicit onsite-parking statement and supported visitor address.
- Candidate should use the visitor address for Directions.
- Any retained address-range coordinate remains approximate map/radius placement only, not a claimed parking stall, door or entrance.
- Open Now remains conservative/disabled unless separately machine-verified.

Remaining independent checks:
- Confirm existing placement/address identity.
- Confirm no current closure/cancellation notice.
- Confirm the consumer projection carries the $25 all-ages scope and adult-accompaniment rule exactly.

### MO26-118 — Haunted Hall of Horror — A. C. Brase Arena, Cape Girardeau

**Author assessment: CLEARANCE CANDIDATE.**

Fresh first-party municipal review:
- Event page: https://www.cityofcapegirardeau.org/departments/parks-and-recreation/special-events/haunted-hall-of-horror/
- Parks special-events calendar: https://www.cityofcapegirardeau.org/departments/parks-and-recreation/special-events/
- A. C. Brase Arena: https://www.cityofcapegirardeau.org/departments/parks-and-recreation/facilities/a-c-brase-arena/
- Current city event dates: **October 9–10, 16–17, 23–24, 30–31, 2026**.
- Event time: **19:00–22:00**.
- Location: **A. C. Brase Arena**.
- Official arena visitor address: **410 Kiwanis Drive, Cape Girardeau, MO 63701**.
- Admission: $12 per person; ages 5 and under free.
- October 31 student night: $8 with valid student ID.
- All ages invited; children 12 and under must be accompanied by an adult.
- Glow sticks offered for $1 each.
- The city event page describes the attraction as a haunted house through the arena.

Disposition of former HOLD:
- Prior year-binding concern is resolved by the current city page and current 2026 city special-events listing.
- Venue identity/address is directly supported by the municipal arena page.
- Candidate should use the arena visitor address for Directions.
- Approximate address-based placement may be used for radius/map placement only; do not claim a precise entrance or dropoff unless separately established.
- Open Now remains disabled unless separately machine-verified.

Remaining independent checks:
- Confirm the prior canonical record is the same event/venue identity and not the separate S.T.A.R. Haunted Hall event in the 4H Building.
- Confirm no cancellation notice.
- Preserve the October 31 student-price qualification and child-accompaniment requirement.

## Shared contract for all three

If independently accepted, the implementation candidate must preserve:
- 2026-only lifecycle; no 2027 rollover.
- supported visitor-address Directions rather than approximate-coordinate Directions.
- approximate distance/map placement labels where coordinates are address-derived.
- no precise rideshare/dropoff claim from approximate placement.
- machine opening intervals null unless independently implemented and verified.
- Open Now fail-closed / never where current contract requires it.
- current seasonal visitor notice and Details presentation.
- no inference from ordinary business/facility hours to seasonal event hours.
- no automatic recurrence.
- revalidation before import and before visitor recommendation when weather/cancellation-sensitive.

## Explicit exclusions

This batch does not reopen:
- MO26-012 Witches Day Out
- MO26-013 Vino Noir workshop
- MO26-028 Nevada/Vernon County Oktoberfest
- MO26-058 Beast Haunted House
- MO26-071 Pomme de Terror
- MO26-074 Osage Beach Fall Festival
- MO26-084 McWilliams Pumpkin Patch
- MO26-085 Brookdale Farms

It also does not restart statewide discovery or Overpass measurement.

## Exact next gate

A fresh independent verifier should compare these three research candidates against:
1. the immutable prior record/verification evidence,
2. the current shipped ListingCompletenessV1 contract,
3. the current first-party sources listed above,
4. the existing 17-record runtime safety behavior.

Return record-level **PASS / HOLD / REJECT** for factual import clearance.

Only independently cleared projections may advance to an implementation candidate.
