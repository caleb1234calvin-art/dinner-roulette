# Pick For Us — Final Unresolved Missouri Seasonal Batch Research

Date: 2026-10-08

## Scope

This closes research on the six records still unresolved after deferred batch 3 produced five factual PASS records and one HOLD.

No runtime import, merge, deployment, Android change or production release is authorized by this file.

Current stable baseline:
- main: `213502ef8cf3f67d75e6d9c9c8ff43f9f656890c`
- production: `dpl_BCdD3eWRXk6UEN2FNJQE88r18VXv` READY
- 17 curated records live
- PR #54 separately validates five more independently cleared records

Final unresolved set:
- MO26-012 Christine’s Vineyard — Witches Day Out
- MO26-013 Vino Noir — Witch Broom Making Workshop
- MO26-028 Nevada/Vernon County Oktoberfest Fall Festival
- MO26-074 Osage Beach City Park Fall Festival
- MO26-084 McWilliams Pumpkin Patch
- MO26-085 Brookdale Farms Fall Festival

## Author dispositions

### MO26-012 — Witches Day Out — HOLD

Fresh operator page confirms:
- October 10, 2026
- noon–10 p.m.
- 25695 Mulberry Road, Webb City, MO 64870
- local vendors, wine/drinks, food and fall activities
- current page presents a $10 ticket price

Sources:
- https://www.christinesvineyard.com/event-details/witches-day-out

Conflict remains:
- retained deeper ticket evidence from the prior correction pass identified the $10 product as VIP/reserved seating rather than established general admission.
- the current event page does not explicitly resolve whether $10 is mandatory admission, optional seating, or another ticket product.

Disposition:
- visitor-address Directions are now representable under ListingCompletenessV1 with approximate placement only.
- **admission semantics remain materially ambiguous.**
- Do not import before the October 10 event unless the operator source itself clearly resolves the ticket/admission relationship.
- If unresolved, allow the event to expire rather than infer terms.

### MO26-013 — Vino Noir Witch Broom Making Workshop — EXPIRE / NO 2026 IMPORT

Retained independently reviewed facts:
- October 8, 2026, 6–7 p.m.
- 530 S Main Street, Joplin, MO 64801
- 21+ only
- prior verified checkout observation: $30 base + $2.62 tax + $0.82 service fee = $33.44
- materials included; drinks separate
- prior inventory observation was dated and not a guarantee

Sources:
- https://www.christinesvineyard.com/event-details/witch-broom-making-workshop-at-vino-noir
- retained immutable correction evidence

Disposition:
- The event occurs today and prior verification explicitly required immediate-before-use inventory/event revalidation.
- Current live page retrieval was not reliably available in this pass.
- There is insufficient safe release runway to research, independently verify, implement, validate, release and still provide useful pre-event value without rushing.
- **No 2026 import. Expire on schedule.**
- No 2027 recurrence may be inferred.

### MO26-028 — Nevada/Vernon County Oktoberfest Fall Festival — HOLD

Current Chamber page still explicitly carries **Oktoberfest Fall Festival 2026** and the organizer-linked poster previously independently inspected establishes:
- Saturday October 10, 2026
- 9 a.m.–2 p.m.
- Vernon County Fairgrounds
- 1641 E Ashland Street, Nevada, MO

Sources:
- https://www.nevada-mo.com/events
- organizer-linked 2026 Oktoberfest poster retained in immutable evidence

Disposition:
- Visitor-address Directions can now be represented with address-derived placement qualified as approximate.
- **Admission terms remain unknown** in the reviewed organizer material.
- Because this event is two days away and the original clearance explicitly held on admission, do not lower that gate to force a release.
- HOLD unless fresh authoritative evidence explicitly states admission terms before a normal verification/release cycle can complete.

### MO26-074 — Osage Beach City Park Fall Festival — CLEARANCE CANDIDATE

Fresh official city page confirms:
- Saturday October 10, 2026
- 11 a.m.–5 p.m.
- Osage Beach City Park
- 950 Hatchery Road, Osage Beach, MO
- family event with food/concessions, vendor market, bounce houses, animal shelters/rescues and pie-eating contests

Source:
- https://osagebeach-mo.gov/2325/Fall-Festival

Disposition:
- Prior factual classification and schedule already passed.
- Prior arrival HOLD was based on requiring entrance/parking coordinates. Under the shipped ListingCompletenessV1 contract, the official visitor address can be the Directions target while the retained address geocode is explicitly approximate placement only.
- The official event page does not state an admission charge. Do not invent "free"; consumer copy should say admission is not stated and use the standard check-admission notice.
- Author recommends factual PASS subject to fresh independent review.
- Exact event end 2026-10-10 17:00 America/Chicago; no recurrence.

### MO26-084 — McWilliams Pumpkin Patch — HOLD / CLOSE FOR 2026

Fresh/current public-authority material remains sufficient for the 2026 event identity, address, dates, hours and published prices, but the decisive activity language remains qualified as a **typical season** for corn-maze/pumpkin activity rather than unambiguous current-2026 activity evidence.

Disposition:
- Do not import as Corn Maze or Pumpkin Patch on the strength of typical-season language.
- Reclassification to Other Halloween / Fall would avoid a false activity claim, but no independently reviewed Other projection exists and the venue's 2026 value proposition would become materially different.
- Close this record as HOLD for the 2026 release queue rather than inventing a weaker classification.
- It may be researched fresh in a future season.

### MO26-085 — Brookdale Farms Fall Festival — DATA CLEARANCE CANDIDATE; RUNTIME-WINDOW HOLD

Fresh first-party operator page now materially resolves the earlier factual defects:
- 2026 Fall Festival opens September 11 and runs through **November 8**
- current page explicitly lists a **17-acre corn maze** and **pumpkin patch**
- activities can vary by day, weather and staffing
- current calendar shows Fall Festival dates continuing into November
- 2026 pricing:
  - Wed–Thu: $12 online / $15 gate, ages 3+
  - Fri–Sun: $15 online / $17 gate, ages 3+
  - page states tax and fees included for those general-admission prices
- general admission includes daytime corn maze and pumpkin-patch access
- VIP fall pass is weekends only, $70
- pick-your-own pumpkin is an add-on priced by size
- Halloween Weekend is Oct. 31–Nov. 1
- Grandparents Weekend is Nov. 6–8, with grandparents free with purchase of a child ticket
- official address remains 8004 Twin Rivers Road, Eureka, MO 63025

Source:
- https://www.brookdalefarms.com/fall-festival

Disposition:
- The prior age/pricing/activity/season-end factual blockers are resolved by current first-party text.
- Address-derived placement remains approximate; Directions use the supported visitor address.
- Complete daily closing times are still not proven for every date; keep hours **partial** and Open Now disabled.
- **Data-level clearance candidate PASS subject to independent review.**
- Runtime release remains HOLD because the current global Halloween Date Night feature window ends November 2 while this verified 2026 season runs through November 8.
- Do not truncate Brookdale to November 2 and do not silently extend the global seasonal architecture.
- A separate bounded architecture decision must establish how curated late-fall records remain discoverable after November 2 without reviving expired Halloween records or inventing live-provider seasonality.

## Author summary

- Proposed factual PASS candidate: MO26-074
- Proposed data PASS / runtime architecture HOLD: MO26-085
- HOLD: MO26-012, MO26-028
- CLOSE HOLD for 2026: MO26-084
- EXPIRE / NO 2026 IMPORT: MO26-013

## Next gate

Fresh independent review should:
1. verify these dispositions against immutable prior evidence and the fresh official pages,
2. decide factual PASS/HOLD/REJECT,
3. separately decide whether Brookdale's November 8 lifecycle requires an architecture change,
4. preserve the non-rush expiry decisions for short-lived events.

No implementation is authorized by this research file.
