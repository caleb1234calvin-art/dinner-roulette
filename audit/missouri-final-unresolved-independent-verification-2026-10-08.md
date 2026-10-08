# Pick For Us — Final Unresolved Missouri Seasonal Batch Independent Verification

Date: 2026-10-08

## Verdict

**5 factual PASS / 1 EXPIRE for the final unresolved six-record queue.**

Factual PASS:
- MO26-012 — Christine’s Vineyard — Witches Day Out
- MO26-028 — Nevada/Vernon County Oktoberfest Fall Festival
- MO26-074 — Osage Beach City Park Fall Festival
- MO26-084 — McWilliams Pumpkin Patch, **Other Halloween / Fall only**
- MO26-085 — Brookdale Farms Fall Festival

EXPIRE / NO 2026 IMPORT:
- MO26-013 — Vino Noir — Witch Broom Making Workshop

Runtime eligibility differs from factual clearance:
- MO26-012, 028, 074 and 084 may advance to a bounded implementation candidate.
- MO26-085 is factual PASS but **runtime HOLD** until the post-November-2 seasonal-window behavior is separately resolved.
- MO26-013 must not advance.

No merge, deployment, Android mutation or production release is authorized by this verification.

## Review basis

This review used:
- immutable prior Missouri audit/correction evidence,
- the currently shipped ListingCompletenessV1 contract,
- current public pages retrieved on 2026-10-08,
- the current product rule that admission uncertainty may remain unasserted while the consumer-facing seasonal notice says to check current hours, admission and weather before going.

That product rule does **not** permit inventing a price, calling an event free without evidence, or silently choosing between conflicting ticket products. When admission is unresolved, the consumer projection must omit a positive admission claim and retain the check-admission notice.

Likewise, the shipped completeness contract separates approximate map/radius placement from Directions. A supported visitor address may be used as the Directions target while an address-derived coordinate remains explicitly approximate.

## Record decisions

### MO26-012 — Christine’s Vineyard — Witches Day Out — FACTUAL PASS

Current operator page supports:
- event: Witches Day Out
- date: October 10, 2026
- time: 12:00–22:00 America/Chicago
- visitor address: 25695 Mulberry Road, Webb City, MO 64870
- local vendors
- wine, wine slushies, beer/cocktails, food
- seasonal/fall social event framing
- current ticket interface displays $10

Source:
- https://www.christinesvineyard.com/event-details/witches-day-out

Prior retained evidence identified ambiguity between the displayed $10 product and VIP/reserved-seating semantics. That conflict is real and is **not resolved by this review**.

Disposition:
- PASS as `Other Halloween / Fall`.
- Do **not** state a general-admission price or assert that the $10 product is mandatory admission.
- Consumer Details may say admission/ticket terms are not fully confirmed and should be checked before committing.
- Use 25695 Mulberry Road as visitor-address Directions.
- Retained coordinate may be used only for approximate placement.
- Open Now remains disabled.
- Exact lifecycle ends October 10; no 2027 recurrence.

### MO26-013 — Vino Noir — Witch Broom Making Workshop — EXPIRE / NO 2026 IMPORT

Prior independently reviewed facts remain:
- October 8, 2026, 18:00–19:00
- 530 S Main Street, Joplin, MO 64801
- 21+ only
- observed checkout total $33.44 at the retained observation
- materials included, drinks separate
- prior inventory snapshot was dated and explicitly not a guarantee

The prior review required immediate-before-use inventory/event/cancellation revalidation. Because the event is occurring today and current reliable revalidation was not completed before the release pipeline, there is no safe useful release window.

Disposition:
- EXPIRE.
- No 2026 runtime import.
- No 2027 rollover.
- Preserve evidence/history only.

### MO26-028 — Nevada/Vernon County Oktoberfest Fall Festival — FACTUAL PASS

Current Nevada/Vernon County Chamber page still lists **Oktoberfest Fall Festival 2026**. The organizer-linked poster was already independently pixel-reviewed and establishes:
- Saturday October 10, 2026
- 09:00–14:00
- Vernon County Fairgrounds
- 1641 E Ashland Street, Nevada, MO

Source:
- https://www.nevada-mo.com/events
- retained organizer-linked 2026 poster evidence

Admission remains unknown.

Disposition:
- PASS as `Other Halloween / Fall`.
- Do not state a price or call the event free.
- Consumer Details must say admission is not confirmed / check admission before committing.
- Use 1641 E Ashland Street as visitor-address Directions.
- Retained Census coordinate remains approximate placement only.
- Open Now remains disabled.
- Exact lifecycle ends October 10; no recurrence.

### MO26-074 — Osage Beach City Park Fall Festival — FACTUAL PASS

Current official City of Osage Beach page supports:
- Saturday October 10, 2026
- 11:00–17:00
- Osage Beach City Park
- 950 Hatchery Road, Osage Beach, MO
- family event
- food trucks/concessions
- vendor market
- bounce houses
- local animal shelters/rescues
- pie-eating contests

Sources:
- https://osagebeach-mo.gov/2325/Fall-Festival
- https://osagebeach-mo.gov/2327/Fall-Festival-Vendor-Registration

The public event page does not state a visitor admission price.

Disposition:
- PASS as `Other Halloween / Fall`.
- Do not infer free admission.
- Use 950 Hatchery Road as visitor-address Directions.
- Address geocode remains approximate placement only.
- Open Now remains disabled.
- Exact lifecycle ends October 10 at 17:00; no recurrence.

### MO26-084 — McWilliams Pumpkin Patch — FACTUAL PASS AS OTHER ONLY

Current public-authority sources support:
- current 2026 event identity: McWilliams Pumpkin Patch
- visitor address: 4007 County Road 6920, West Plains, MO 65775
- October 4–31, 2026
- Tue–Fri 14:00–17:00
- Sat 10:00–17:00
- Sun 12:00–17:00
- Mon closed
- admission: $7 weekdays / $15 weekends
- school-field-trip and private-group scheduling
- parties during normal hours with table/pavilion reservation
- bonfires by reservation
- weather-sensitive seasonal operation
- partial wheelchair accessibility
- no smoking

Sources:
- https://www.visitmo.com/events/mcwilliams-pumpkin-patch-3
- https://www.explorewestplains.com/calendar/

Visit Missouri describes corn mazes and some attractions as what a **typical season** will have. That language is not strong enough to assert current 2026 Corn Maze or product-defined Pumpkin Patch activity semantics.

Disposition:
- PASS only as `Other Halloween / Fall`.
- Do not classify as `corn-maze` or `pumpkin-patch` in this 2026 import.
- Consumer copy may use the proper venue name but must not turn typical-season activities into current guaranteed features.
- Use 4007 County Road 6920 as visitor-address Directions.
- Retained coordinate remains approximate placement only.
- Open Now remains disabled.
- No 2027 rollover.

### MO26-085 — Brookdale Farms Fall Festival — FACTUAL PASS / RUNTIME HOLD

Current first-party operator pages strongly establish:
- Fall Festival opens September 11 and runs through November 8, 2026
- address: 8004 Twin Rivers Road, Eureka, MO 63025
- current 2026 corn maze
- current 2026 pumpkin patch access
- activities may vary by day, weather and staffing
- calendar entries continue into November
- Wednesday/Thursday general admission: $12, ages 3+
- Friday–Sunday general admission: $17, ages 3+
- ages 3 and under free
- taxes/fees included in stated Fall Festival pricing
- VIP: $70
- pumpkins sold separately
- Halloween Weekend October 31–November 1
- Grandparents Weekend November 6–8
- free parking

Sources:
- https://www.brookdalefarms.com/fall-festival
- https://www.brookdalefarms.com/events-calendar
- https://www.brookdalefarms.com/events-1/fall-festival-2026-brookdale-farms-2026-11-08-10-00

Disposition:
- Factual PASS as `corn-maze` + `pumpkin-patch`.
- Use visitor-address Directions.
- Address-derived coordinate remains approximate placement.
- Hours remain partial/display-only unless a complete per-date schedule is separately encoded and tested.
- Open Now remains disabled.
- Preserve November 8, 2026 as the verified season end.

Runtime HOLD:
- current global Halloween Date Night layer ends November 2
- Brookdale's verified 2026 season continues through November 8
- do not truncate Brookdale to fit the architecture
- do not silently extend the global seasonal layer in this data-only verdict

A bounded architecture candidate may now be prepared to support curated late-fall records after November 2 while preventing expired Halloween records from reappearing.

## Final queue result

From the final six unresolved records:
- factual PASS: 5
- expire/no import: 1
- factual HOLD remaining: 0

Immediate implementation-eligible subset:
- MO26-012
- MO26-028
- MO26-074
- MO26-084

Architecture-dependent factual PASS:
- MO26-085

Expired:
- MO26-013

## Next implementation boundary

A bounded candidate may:
1. add the four immediately eligible PASS records,
2. separately implement and test a curated late-fall availability/window mechanism for MO26-085,
3. add Brookdale only if that architecture passes independently,
4. leave Vino Noir out permanently for 2026.

No release authority is implied.
