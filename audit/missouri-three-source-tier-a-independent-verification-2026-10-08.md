# Pick For Us — Three-Source Tier A Independent Verification

Date: 2026-10-08

## Verdict

**6 PASS / 2 HOLD** for the first eight net-new/commercial Tier A candidates.

PASS:
- Hell Harvest Haunted Attraction
- Edge of Hell Haunted Attraction
- Creepyworld
- The Darkness
- Haunted River Float at Ruby's Landing
- Fear the Bloody Timber Haunted Attraction & Corn Maze

HOLD:
- Labyrinth of Fear — identity/address/pricing/current-year PASS, exact 2026 open-date extraction unresolved
- Rising Haunted Attraction — identity/address/current secondary schedule PASS, but operator/current-year exact schedule binding remains unresolved

No runtime import, merge or production release is authorized by this verification.

## Verification principles

- Secondary directories are used field by field, not as all-or-nothing records.
- First-party/operator/DMO sources control the fields they directly support.
- Missing schedule fields are not inferred from recurrence.
- Known dates may be imported as an explicit subset if each date is source-supported; omitted unknown dates are not negative evidence.
- No machine opening intervals are created.
- Open Now remains disabled for all curated seasonal records.
- Any record extending past Nov. 2 requires lifecycle-scoped curated visibility rather than extending the global Halloween UI/provider window.

## PASS — Hell Harvest Haunted Attraction

First-party sources:
- https://hellharvest.com/venue/hell-harvest-haunted-attraction/
- https://hellharvest.com/faq/

Verified current 2026 facts:
- visitor address: 19126 MO-8, Potosi, MO 63664
- explicit event instances at 8:00 p.m.
- future/current verified dates from the operator listing:
  - Oct. 9, 10, 11, 16, 17, 22, 23, 24, 29, 30, 31
- listed admission:
  - $20 for Oct. 9–23 observed instances
  - $25 for Oct. 24 and Oct. 29–31 observed instances
- operator FAQ says:
  - light drizzle may operate; check Facebook for weather status
  - no fixed age limit stated; parents decide suitability
  - actors do not touch guests and guests may not touch actors
  - onsite ticket booth accepts cash/cards
  - online tickets also available
  - no weapons

Runtime constraints:
- import only the explicitly verified date subset above; do not invent earlier nights
- display 8:00 p.m. as start time, not a closing time
- use visitor-address Directions
- address placement remains approximate unless separately verified
- Open Now never
- expire after Oct. 31 under the one-season lifecycle

## PASS — Edge of Hell Haunted Attraction

First-party / DMO sources:
- https://www.edgeofhell.com/
- https://www.visitkc.com/events/edge-of-hell-haunted-attraction-2026-season/
- https://www.visitkc.com/events/edge-of-hell-thursdays-2026-season/

Verified:
- attraction address: 1300 W 12th St, Kansas City, MO 64101
- 2026 dates:
  - Oct. 2–3
  - Oct. 9–10
  - Oct. 15–17
  - Oct. 22–24
  - Oct. 29–31
- Thursday 7:30–11:30 p.m.
- Friday 7:30 p.m.–midnight
- Saturday 6:30 p.m.–12:30 a.m.
- Visit KC displays $40+
- operator requires arrival one hour before scheduled entry at Central Waiver Station, 1300 W 13th, Kansas City, MO 64102

Runtime/navigation:
- attraction identity/address remains 1300 W 12th
- Directions first target MUST be Central Waiver Station, 1300 W 13th
- do not collapse the two addresses
- Open Now never
- exact 2026-only lifecycle

## PASS — Creepyworld

First-party:
- https://www.creepyworld.com/
- https://www.creepyworld.com/haunted-house-in-stlouis-missouri-creepyworld/?id=cms%2Foperations-dates
- https://www.creepyworld.com/haunted-house-in-stlouis-missouri-creepyworld/?id=cms%2Fdirections
- https://scarefest.fearticket.com/

Verified:
- address: 1400 S Old Highway 141, Fenton, MO 63026
- 2026 screampark with 13 attractions, including haunted mazes and haunted hayride
- operator directions explicitly tell visitors to use the published address
- 2026 operating page includes October dates and November dates
- November 1, November 7, and November 13 are explicit; Nov. 13 is labeled final night to use unused tickets
- no refunds; tickets transferable
- ticket must be presented within 15 minutes of closing time to guarantee entry
- Scarefest requires metal detectors and no weapons

Schedule caveat:
- operator page contains overlapping/conflicting time text for Oct. 16–17 in the rendered schedule
- preserve schedule as partial/display-only rather than machine-evaluable
- exact dates may be carried while conflicting time text is exposed conservatively

Runtime:
- lifecycle extends beyond Nov. 2
- requires lifecycle-scoped curated visibility
- MUST NOT extend global Halloween provider/UI window
- Open Now never

## PASS — The Darkness

First-party:
- https://www.thedarkness.com/
- https://www.thedarkness.com/dates-and-times-page
- https://scarefest.fearticket.com/

Verified:
- address: 1525 South 8th Street, St. Louis, MO 63104
- explicit 2026 Halloween season
- Sep. 19 Slasher Weekend; Sep. 25–26
- current October operating dates
- November 1, 7, and 13 are explicitly listed; Nov. 13 is final unused-ticket night
- no refunds; tickets transferable
- ticket within 15 minutes of closing to guarantee entry
- no weapons; metal detection
- teen drop-off policy requires parent pickup/availability

Schedule caveat:
- operator page duplicates Oct. 16–17 with a 15-minute start-time conflict
- do not silently choose one of the conflicting start times
- carry those dates with partial/unconfirmed display timing and standard check-hours notice

Runtime:
- lifecycle beyond Nov. 2 requires lifecycle-scoped curated visibility
- global Halloween UI/provider discovery still ends Nov. 2
- Open Now never

## PASS — Haunted River Float at Ruby's Landing River Resort

Public-authority/DMO:
- https://visitpulaskicounty.org/calendar-of-events/
- https://visitpulaskicounty.org/stories?rec_id=463
- operator identity: Ruby's Landing River Resort

Verified:
- address: 22474 Restful Lane, Waynesville, MO 65583
- current 2026 event
- DMO description: hayride to river entrance, half-mile dark river float, haunted trail/forest/cemetery, then 26-room haunted house
- 3:00 p.m.–midnight on explicitly listed dates
- verified 2026 dates in current DMO calendar:
  - Oct. 3
  - Oct. 10
  - Oct. 16
  - Oct. 17
  - Oct. 23
  - Oct. 24
  - Oct. 30
  - Oct. 31
- Sep. 19 also appears in current DMO calendar

Runtime:
- use only enumerated verified dates
- no inference that every Friday/Saturday is open
- visitor-address Directions
- Open Now never
- final imported lifecycle Oct. 31 unless another exact operator date is later verified

## PASS — Fear the Bloody Timber Haunted Attraction & Corn Maze

Current DMO:
- https://www.explorewestplains.com/calendar/

Verified:
- identity: Fear the Bloody Timber Haunted Attraction & Corn Maze
- address: 8518 County Road 7190, West Plains-area Missouri
- current 2026 calendar entries
- 7:00–11:00 p.m.
- directly observed 2026 dates:
  - Oct. 9
  - Oct. 10
  - Oct. 16
  - Oct. 17
  - Oct. 23
  - Oct. 24
- DMO directs visitors to attraction Facebook for current changes
- retained DMO historical/current calendar also provides phone 417-247-8281
- prior DMO text shows $15 cash-only admission, but this price is not treated as a fresh 2026 fact unless independently current-bound

Runtime:
- import only explicitly observed 2026 dates above
- classify Haunted House + Corn Maze
- visitor-address Directions if locality/address formatting is independently accepted
- Open Now never
- no recurrence inference

## HOLD — Labyrinth of Fear

First-party:
- https://www.labyrinthoffear.com/

Verified:
- explicit 2026 current content
- address: 17866 East Overland Road, Nevada, MO 64772
- tickets start 6:30 p.m.
- gate opens 7:30 p.m.
- window $30
- reserved $35
- reserved tickets released Monday before the weekend

Blocker:
- the operator calendar uses visual highlighted open dates that were not exposed in the accessible text extraction
- do not infer Fridays/Saturdays or all October dates

Disposition:
- factual identity/address/admission PASS
- runtime schedule HOLD pending exact open-date extraction or another current source that enumerates the same dates

## HOLD — Rising Haunted Attraction

Current sources:
- Pulaski County DMO identity/address page
- MissouriHauntedHouses current 2026 schedule page
- HauntedMissouri current calendar
- The Scare Factor identity/address listing

Verified:
- identity/address: 25238 Raleigh Road, Waynesville, MO 65583
- phone: 573-433-5460
- current secondary schedule indicates 8–11 p.m.
- current secondary admission shows General $20 / Fast Pass $30
- directory page updated recently

Conflict/blocker:
- Pulaski County description contains an older calendar-style statement "Friday, September 27th" that is not valid evidence of a 2026 opening date
- The Scare Factor says coming-season dates have not been loaded
- directory calendar open-date marks were not text-enumerated in the extraction

Disposition:
- identity/address PASS
- runtime exact-date schedule HOLD pending operator/current-year exact dates
- do not use the stale DMO weekday/date sentence as 2026 schedule evidence

## Enrichment-only

Wolfman's House of Screams and Aurora Maze / Adventure Farm remain historical-overlap records and are not duplicated. Current directory facts may enrich their existing held/research records after field-level verification.

## Batch result

Immediate runtime implementation candidates: 6
Schedule HOLD: 2
Reject: 0

Implementation may proceed only for the six PASS records, with late-season visibility required for Creepyworld and The Darkness.
