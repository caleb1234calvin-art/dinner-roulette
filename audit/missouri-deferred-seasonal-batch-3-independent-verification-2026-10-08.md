# Pick For Us — Missouri Deferred Seasonal Batch 3 Independent Verification

Date: 2026-10-08

## Verdict

**5 PASS / 1 HOLD for factual import clearance.**

PASS:
- MO26-036 — Monster Corn Maze
- MO26-058 — Beast Haunted House
- MO26-069 — Dead Factory Haunted House
- MO26-071 — Pomme de Terre State Park — Pomme de Terror
- MO26-118 — Haunted Hall of Horror at A. C. Brase Arena

HOLD:
- MO26-084 — McWilliams Pumpkin Patch

This verification does not authorize merge, deployment, Android changes or production release. It authorizes only preparation of a bounded implementation candidate containing the five PASS records.

## Baseline and contract reviewed

Current shipped baseline at verification:
- main: `213502ef8cf3f67d75e6d9c9c8ff43f9f656890c`
- production: `dpl_BCdD3eWRXk6UEN2FNJQE88r18VXv` READY at exact main
- current runtime already supports `ListingCompletenessV1`
- visitor-address Directions and qualified approximate placement are established production patterns
- machine opening intervals remain null for curated seasonal records unless separately verified
- curated seasonal Open Now remains conservative/fail-closed
- no 2027 rollover

The earlier statewide verification frequently required an independently verified entrance/parking coordinate. That requirement is not silently discarded. The current shipped completeness contract now separates:
1. approximate placement for radius/map display,
2. a supported visitor-address or verified-point Directions target,
3. precision language shown to the visitor.

Accordingly, an address-range geocode may support approximate placement when the underlying visitor address is independently supported, but it must never be presented as a verified entrance, parking stall, doorway or precise rideshare dropoff.

## Record verdicts

### MO26-036 — Monster Corn Maze — PASS

Current first-party operator evidence directly supports:
- visitor address: 711 State Route AM, Cabool, MO 65689
- explicit approach directions from both Cabool and Willow Springs
- Fridays/Saturdays September 18–October 30, 2026
- gates 18:30, maze after dark, ticket sales end 23:00, final close after final ticket-holder exits
- general admission $20
- VIP reservation $30, timed 20:00–23:00 in 15-minute blocks, prompt arrival requested
- VIP refund only when operator closes, including weather-related closure
- prepaid general admission usable during current season and nonrefundable
- ages 13 and under require an adult at all times
- no pets, smoking, alcohol/illicit drugs, weapons, backpacks/purses or flashlights
- maze not handicap accessible
- rough terrain/stairs/long paths/flashing lights/intense scares warning
- weather may close the maze

Sources:
- https://www.monstercornmaze.com/
- https://www.monstercornmaze.com/faq.htm

Disposition:
- Prior material age/VIP/accessibility omissions are now explicitly carried.
- Use the supported visitor address for Directions.
- Retained Census point may be used only as approximate address placement.
- Do not assert exact final-exit time.
- Open Now remains disabled.
- Expire after the final 2026 operating date under the existing one-season policy.

### MO26-058 — Beast Haunted House — PASS

Current operator and current 2026 Visit KC evidence support:
- Beast identity and attraction address: 1401 W 13th St, Kansas City, MO 64102
- exact 2026 haunt-night pattern through October 31
- Thursday 19:30–23:30, Friday 19:30–midnight, Saturday 18:30–00:30 on the listed 2026 nights
- online-ticket framing in current Visit KC material
- **mandatory first check-in at Central Waiver Station, 1300 W 13th St, Kansas City, MO 64102**
- arrival at least 60 minutes before timed entry
- waiver/video verification/security bracelet workflow
- minors require parent/guardian 18+ with valid ID to sign the waiver in person; signing adult does not have to accompany the minor inside
- metal detector before attraction entry
- no weapons
- no costumes

Sources:
- https://www.kcbeast.com/
- https://www.kcbeast.com/faq
- https://www.kcbeast.com/safety-security
- https://www.visitkc.com/events/beast-haunted-house/
- https://www.visitkc.com/events/beast-haunted-attraction-2026/

Disposition:
- Prior arrival blocker is resolved only by representing the operator-required first stop honestly.
- Directions must target **Central Waiver Station, 1300 W 13th St** as the required first arrival/check-in destination.
- The attraction identity/address remains 1401 W 13th St and may be used for approximate map placement.
- Do not collapse the two addresses into one location.
- Open Now remains disabled.
- No automatic recurrence or post-2026 rollover.

### MO26-069 — Dead Factory Haunted House — PASS

Current first-party operator evidence directly supports:
- 2100 E Liberty, Mexico, MO 65265
- explicit free onsite parking
- September 25–October 31, 2026, Fridays/Saturdays only
- doors 19:00–23:00
- $25 per person, all ages, ticket booth
- cash/credit/debit
- no extra ticket taxes or fees
- children under 13 must be accompanied by an adult
- indoor waiting area, rain or shine
- approximately 25–30 minute self-guided walkthrough
- no touching; monsters do not touch guests

Source:
- https://deadfactory.com/

Disposition:
- Prior direct-source freshness blocker is resolved by current live first-party content.
- Visitor address plus explicit onsite-parking statement is sufficient for visitor-address Directions under the shipped contract.
- Retained address-range geocode remains approximate placement only.
- Open Now remains disabled.
- No 2027 rollover.

### MO26-071 — Pomme de Terre State Park — Pomme de Terror — PASS

Current Missouri State Parks evidence directly supports:
- event dates October 16–17, 2026
- event explicitly located in the **Hermitage Area Campground**
- official GPS for Hermitage Area Campground: **37.883074, -93.303521**
- explicit warning that the park office at 23451 Park Entrance Road, Pittsburg is on the opposite side of the lake
- Friday naturalist program at 19:30
- Saturday wildlife show 11:00, ranger lunch noon, scientist contest 13:00–15:00, pumpkin contest 14:00–15:00, costume contest 15:30, trick-or-treating 17:00–19:00
- event free and open to the public
- regular camping fees apply to camping guests
- day-use visitors may participate in all activities except the campground decorating contest

Sources:
- https://mostateparks.com/event/pomme-de-terror-2026
- https://mostateparks.com/event/pomme-de-terror
- https://mostateparks.com/park/pomme-de-terre-state-park

Disposition:
- The operator supplies the event campground and its GPS directly; this is now a defensible verified event-location point.
- Directions must use the Hermitage Area Campground point, never the Pittsburg-side office.
- Do not infer continuous opening intervals from activity-specific times.
- Open Now remains disabled.
- No 2027 rollover.

### MO26-118 — Haunted Hall of Horror at A. C. Brase Arena — PASS WITH CONFLICT DISCLOSURE

Current city evidence supports:
- Cape Girardeau Parks & Recreation event at A. C. Brase Arena
- dates October 9–10, 16–17, 23–24, 30–31
- 19:00–22:00
- official arena/department address: 410 Kiwanis Drive, Cape Girardeau, MO 63701
- $12 per person
- official city page says ages 5 and under free
- October 31 student night $8 with valid student ID
- all ages invited; children 12 and under require an adult
- $1 glow sticks
- haunted-house classification

Current 2026 KFVS reporting independently binds the same municipal event to 2026 and the same dates/time. It reports ages **4 and under** free, which conflicts with the current official city page's **5 and under** wording.

Sources:
- https://www.cityofcapegirardeau.org/departments/parks-and-recreation/special-events/haunted-hall-of-horror/
- https://www.cityofcapegirardeau.org/departments/parks-and-recreation/special-events/
- https://www.cityofcapegirardeau.org/departments/parks-and-recreation/programs-and-classes/star-therapeutic-programs/
- https://www.kfvs12.com/2026/09/10/haunted-hall-horror-returns-cape-girardeau-35th-year/

Disposition:
- Year-binding blocker is resolved by current 2026 reporting plus current city event schedule.
- Separate S.T.A.R. Haunted Hall event is a different October 16 program at the 4H Building and must not be merged.
- Use city authority as the controlling public admission statement: **$12; ages 5 and under free**.
- Preserve a concise conflict note in Details that a 2026 secondary report says ages 4 and under free; visitors should verify the child cutoff before purchase.
- Use 410 Kiwanis Drive for Directions.
- Retained Census coordinate is approximate placement only.
- Open Now remains disabled.

### MO26-084 — McWilliams Pumpkin Patch — HOLD

Current public-authority evidence is strong for:
- identity
- 4007 County Road 6920, West Plains, MO 65775
- October 4–31, 2026 event listing
- Tue–Fri 14:00–17:00, Sat 10:00–17:00, Sun 12:00–17:00, Mon closed
- weekday $7 / weekend $15
- party/table/pavilion and bonfire reservation rules
- weather-sensitive closure warning
- partial wheelchair accessibility and no-smoking statement

Sources:
- https://www.visitmo.com/events/mcwilliams-pumpkin-patch-3
- https://www.explorewestplains.com/calendar/

However, the current Visit Missouri copy says a **typical season** will have corn mazes and describes pumpkins/gourds for sale. That is weaker than explicit current-2026 evidence that a corn maze is active or that the venue satisfies the product's Pumpkin Patch activity definition beyond its business/event name.

Disposition:
- HOLD category/activity clearance.
- Do not import as Corn Maze or Pumpkin Patch merely from "typical season" language.
- A later candidate may use Other Halloween / Fall if independently justified by the current 2026 event itself, but that reclassification was not part of this six-record candidate and is not silently performed here.
- No runtime import authorized for MO26-084 in this batch.

## Batch result

- Factual import PASS: 5
- HOLD: 1
- REJECT: 0

The five PASS records may advance together into one implementation candidate.

Required implementation constraints:
- no changes to the 17 existing curated records
- visitor-address Directions for 036, 069 and 118
- mandatory first-stop Directions to 1300 W 13th for 058
- verified Hermitage campground point for 071
- approximate placement qualifiers wherever address-derived
- no machine opening intervals
- never/fail-closed Open Now
- exact 2026-only expiry/no recurrence
- existing compact notice/Details presentation
- material restrictions carried in concise reviewed consumer copy
- no MO26-084 runtime record in this candidate

Fresh implementation validation and separate release approval remain required.
