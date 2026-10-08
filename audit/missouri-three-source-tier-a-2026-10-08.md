# Pick For Us — Three-Source Tier A Missouri Verification Candidates

Date: 2026-10-08

## Status

Eight commercial/public attractions have enough current 2026 signal to justify immediate bounded first-party/public-authority verification.

This is NOT runtime import authority. It is the first verification batch produced by the FrightMaps / MissouriHauntedHouses / The Scare Factor delta sweep.

## Historical dedupe result

Repository search against current tracked audit/history found:
- Wolfman’s House of Screams already exists in historical seasonal audit/fallback research. Treat as enrichment/re-clearance, not net-new.
- Aurora Maze / Adventure Farm already has historical audit evidence. Treat as enrichment/re-clearance, not net-new.
- The eight candidates below had no tracked-name match in the current repository search and are prioritized as likely net-new runtime delta.

## Tier A candidates

### A1 — Labyrinth of Fear — Nevada, MO

Current first-party operator source:
- https://www.labyrinthoffear.com/

Current 2026 source supports:
- explicit "2026" current-season content
- address: 17866 East Overland Road, Nevada, MO 64772
- ticket sales start 6:30 p.m.
- gate opens 7:30 p.m.
- window admission $30
- reserved times $35
- reserved tickets released the Monday before the weekend by phone
- haunted-house / immersive haunt identity

Strong candidate for first-party factual clearance.

Remaining work:
- enumerate exact highlighted 2026 open dates from the rendered calendar
- verify final-night lifecycle
- verify visitor-address Directions and approximate placement
- preserve any age/access/safety restrictions found on linked operator pages
- Open Now remains disabled unless separately machine-verified

### A2 — Hell Harvest Haunted Attraction — Potosi, MO

Current first-party operator source:
- https://hellharvest.com/venue/hell-harvest-haunted-attraction/

Current 2026 source supports:
- address: 19126 MO-8, Potosi, MO 63664
- current October 2026 event instances
- 8:00 p.m. starts
- current ticket prices shown per date
- October 9, 10, 11, 16, 17, 22, 23, 24, 29, 30 and 31 are directly present in the current operator event listing
- $20 on earlier listed nights and $25 on Oct. 24 and Oct. 29–31 in the observed current listing

Strong candidate for first-party factual clearance.

Remaining work:
- retrieve earlier September/October nights if part of the same 2026 season
- determine operator-stated end/last-entry behavior rather than inferring a closing time
- verify admission price semantics across all listed dates
- verify visitor-address Directions / placement
- collect material age/accessibility/weather/safety restrictions
- Open Now remains disabled

### A3 — Edge of Hell Haunted Attraction — Kansas City, MO

Current public-authority/DMO source:
- https://www.visitkc.com/events/edge-of-hell-haunted-attraction-2026-season/

Current operator source:
- https://www.edgeofhell.com/

Current 2026 evidence supports:
- attraction: Edge of Hell
- 2026 haunt nights explicitly listed by Visit KC
- October 2–3, 9–10, 15–17, 22–24, 29–31
- Thu 7:30–11:30 p.m.; Fri 7:30 p.m.–midnight; Sat 6:30 p.m.–12:30 a.m. on the applicable listed nights
- event address: 1300 W 12th St, Kansas City, MO 64101
- Visit KC lists $40+
- operator requires arrival one hour before scheduled entry at Central Waiver Station, 1300 W 13th, Kansas City, MO 64102

This has the same mandatory first-stop navigation pattern as Beast and should reuse the reviewed routing approach:
- attraction identity/address remains distinct
- Directions first target must be the Central Waiver Station
- approximate attraction placement must not be represented as the first-stop arrival point

Strong candidate for factual clearance.

### A4 — Creepyworld — Fenton, MO

Current first-party sources:
- https://www.creepyworld.com/
- https://www.creepyworld.com/haunted-house-in-stlouis-missouri-creepyworld/?id=cms%2Foperations-dates
- https://www.creepyworld.com/creepyworld-haunted-house-americas-biggest-haunted-house

Current 2026 evidence supports:
- explicit 2026 season
- 13 haunted attractions in one location
- haunted hayride and multiple haunted mazes
- current 2026 operating-date page
- current dates extending through Nov. 13 for unused-ticket final night
- address corroborated by official Scarefest ticketing: 1400 South Old Highway 141, Fenton, MO 63026
- no-refund / transferable-ticket language
- late-entry guarantee rule tied to closing time

Strong factual candidate.

Architecture note:
- current source extends beyond Nov. 2.
- Do not truncate verified dates.
- If runtime import advances, it likely needs the same per-listing lifecycle visibility mechanism being validated for Brookdale rather than extending Halloween globally.

### A5 — The Darkness — St. Louis, MO

Current first-party sources:
- https://www.thedarkness.com/
- https://www.thedarkness.com/haunted-house-in-stlouis-missouri-thedarkness/?id=cms%2Fdates-and-times-page
- https://scarefest.fearticket.com/

Current 2026 evidence supports:
- explicit 2026 haunt season
- Sep. 19 Slasher Weekend
- Sep. 25–26
- current October operating dates/hours
- address: 1525 South 8th Street, St. Louis, MO 63104
- metal-detector / no-weapons policy from current official Scarefest ticketing
- operator page identifies current 2026 attraction content

Strong factual candidate.

Remaining work:
- normalize duplicate/overlapping date text on the operator schedule page conservatively
- determine complete final 2026 lifecycle
- collect current admission/ticket details without treating temporary promotions as universal price
- Open Now disabled

### A6 — Haunted River Float at Ruby’s Landing — Waynesville, MO

Current operator:
- https://rubyslanding.com/

Current Pulaski County tourism/current-event evidence:
- current 2026 calendar entries at Ruby’s Landing River Resort
- address: 22474 Restful Lane, Waynesville, MO 65583
- current listed event window: 3:00 p.m.–midnight on multiple 2026 dates
- observed current dates include Oct. 10, 16, 17, 30 and 31; earlier Sep. 19 is also explicitly listed
- MissouriHauntedHouses also carries a current 2026 schedule

Field-level use:
- tourism calendar is authoritative enough for identity/address/date/time evidence
- directory description can supply discovery/category clues but must not override operator/tourism facts

Strong candidate, with exact-date enumeration still required before import.

### A7 — Fear the Bloody Timber Haunted Attraction & Corn Maze — West Plains, MO

Current Explore West Plains DMO calendar:
- https://www.explorewestplains.com/calendar/

Current 2026 evidence supports:
- explicit 2026 event entries
- address: 8518 County Road 7190
- West Plains-area event identity
- 7:00–11:00 p.m.
- observed dates include Oct. 9, 16, 17, 23 and 24 in current DMO calendar views
- DMO directs visitors to the attraction Facebook page for current information

Classification signal:
- Haunted Attraction
- Corn Maze

Good public-authority factual candidate.

Remaining work:
- enumerate complete 2026 date set
- verify visitor locality/postal address and operator-published visitor destination
- verify admission and material restrictions
- do not infer unobserved dates from recurrence
- Open Now disabled

### A8 — Rising Haunted Attraction — Waynesville, MO

Current MissouriHauntedHouses page supplies:
- 2026 schedule calendar
- 8:00–11:00 p.m.
- General $20 / Fast Pass $30
- cash/card/debit
- recently updated current-season listing

Pulaski County tourism page supports:
- venue identity
- address: 25238 Raleigh Road, Waynesville, MO 65583
- phone: 573-433-5460
- operator identity

Important conflict:
- the Pulaski County descriptive paragraph contains an older-style "Friday, September 27th" opening statement that must NOT be blindly treated as a 2026 date.
- use the current 2026 directory calendar only as a schedule lead until operator/current-year evidence independently binds exact dates.

Disposition:
- identity/address: strong
- exact 2026 schedule: HOLD pending operator/current-year binding
- admission: useful secondary current field, not yet first-party-confirmed

## Enrichment, not net-new

### Wolfman’s House of Screams

Already present in prior Pick For Us seasonal audit history.

New current useful fields:
- MissouriHauntedHouses has a 2026 schedule calendar
- Friday/Saturday opening at 7 p.m.
- cash
- listing updated within the last month
- HauntedMissouri current 2026 calendar also lists multiple October dates and free parking

Use these to refresh the existing held/research record; do not create a duplicate venue.

### Aurora Maze / Adventure Farm + Zombie Harvest

Historical repository evidence already exists.

New current useful fields:
- MissouriHauntedHouses has a current 2026 calendar
- current Zombie Harvest $15
- combo maze + Zombie Harvest $25
- children 3 and under free
- Wednesday hauntings Oct. 7–28
- Friday/Saturday through Oct. 31
- field-of-screams signal Sep. 25

Use as enrichment/re-clearance, not duplicate discovery.

## Verification ordering

Immediate factual verification order:
1. Labyrinth of Fear
2. Hell Harvest
3. Edge of Hell
4. The Darkness
5. Creepyworld
6. Haunted River Float
7. Fear the Bloody Timber
8. Rising Haunted Attraction

Rationale:
- first five have current first-party or first-party + DMO evidence sufficient for a fast, high-confidence pass
- Haunted River Float and Fear the Bloody Timber have strong DMO support
- Rising needs schedule conflict resolution before exact-date clearance

## Product rules

- directory facts are field-level evidence, not all-or-nothing records
- stronger first-party/public-authority facts win only for the field they support
- conflicts remain explicit
- no machine opening intervals
- Open Now fail-closed
- no automatic 2027 recurrence
- visitor-address Directions permitted under ListingCompletenessV1 when address is supported
- address-derived coordinates remain approximate
- late-season records must use per-listing lifecycle visibility rather than extending live Halloween discovery globally
