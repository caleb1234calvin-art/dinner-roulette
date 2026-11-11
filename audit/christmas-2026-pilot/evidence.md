# Christmas 2026 four-attraction pilot: evidence provenance

Development-only candidate for [coordination #86](https://github.com/caleb1234calvin-art/dinner-roulette/issues/86), using the independently reviewed shortlist in [research #93](https://github.com/caleb1234calvin-art/dinner-roulette/issues/93). This file records reviewed evidence; it is not a fresh operator-source recheck, navigation clearance, production import or release approval.

## Review lineage and interpretation

- [Astra independent review, first six, November 11, 2026](https://github.com/caleb1234calvin-art/dinner-roulette/issues/93#issuecomment-6808848226): C26-001, C26-005 and C26-010.
- [Astra independent review, ranks 7–12 and four-attraction handoff, November 11, 2026](https://github.com/caleb1234calvin-art/dinner-roulette/issues/93#issuecomment-6809219778): C26-007 and Sparkle venue-address clarification.
- Astra reports source reads or attempts on November 11, 2026. `checkedOn` preserves that review/access date, not a source publication date or a new access claim by this implementation.
- VERIFIED applies to supported fields only. No production/canonical venue IDs, visitor gate coordinates, live ticket inventory, last-entry times or accessibility clearance were established for these four records. Research IDs identify attractions; they must not replace permanent venue IDs.
- All other VERIFIED records and every HOLD record are excluded from this first pilot.

Actual event dates remain in the catalog. The application separately intersects them with November 27–December 31, 2026 inclusive in America/Chicago and Date Night scope. The church calendar explicitly states America/Chicago; the school event explicitly states CST. Sparkle and Carthage program times are printed local organizer times; using America/Chicago is the pilot's location-based interpretation for Carthage, Missouri, not a claim that these sources printed a timezone.

## C26-001 — Sparkle in the Park

**Supported:** CWEP presents and installs a walk-through display at permanent Central Park in Carthage. Free public admission. November 23 opening ceremony starts at 6 p.m.; November 24 at 6 p.m. is the inclement-weather backup. After opening, display hours are nightly 5 p.m.–midnight through January 1, 2027. Product eligibility is restricted to the November 27–December 31 evenings. The city supplies **305 W Chestnut St** as a venue address, not a confirmed visitor gate.

| Source | Supported fields |
| --- | --- |
| [CWEP display](https://www.cwep.com/about-cwep/community/sparkle-in-the-park/) | Operator/display relationship, walk-through format, nightly schedule and closing date |
| [CWEP ceremony](https://www.cwep.com/calendar-events/sparkle-in-the-park-lighting-ceremony/) | Opening/backup starts and free admission |
| [City Central Park page](https://www.carthagemo.gov/o/parksandrec/page/central-park) | Permanent park relationship |
| [City event listing](https://www.carthagemo.gov/events?id=67898747) | Venue-level street address |

Astra reports CWEP page metadata dates February 21 and November 4, 2026 respectively. The older `/about-us/sparkle-in-the-park/` path redirects to the current display page. An embedded 2024 video and old fifth-season extract do not establish 2026 hours.

The opening ceremony is retained as a start-only session because its finish is unverified. Recurring nights are recorded after opening, with the backup fact stated rather than invented calendar exceptions. Opening/backup uncertainty lies outside the fixed app window. Midnight is the closing boundary, not continuous access into the next day.

**Unknown / unavailable:** canonical permanent venue ID, exact visitor gate/approach, last admission, reservations, accessibility and additional holiday exceptions. Do not navigate to CWEP's office. Permanent park hours do not establish display availability.

## C26-005 — Olde World Christmas Market

**Supported:** Grace Episcopal Church, **820 Howard St, Carthage**, hosts one event with two admission sessions in America/Chicago:

- December 4, 5:30–7 p.m.: gala, $10 admission, wine and hors d’oeuvres; tickets at the door or in advance through the church office.
- December 5, 9 a.m.–2 p.m.: free public market.

Sources: [Diocesan event and ticket terms](https://diowestmo.org/event/olde-world-christmas-market/) and [church address](https://gracecarthage.com/contact/).

**Model limit:** retain one church host and event with two sessions; neither a second permanent venue nor an overnight operating interval is justified. The event must not rewrite ordinary church availability.

**Unknown / unavailable:** canonical permanent church ID, specific visitor door, parking, separate last entry, accessibility, live gala ticket inventory and Saturday reservation instructions. Reviewed ticket-sale terms may be displayed as terms; they do not establish purchasable inventory or a supported checkout action.

## C26-010 — NEWcaps Holiday Craft Fair

**Supported:** December 5, **9 a.m.–3 p.m. CST**, free public visitor admission at **Neosho High School, 511 S Neosho Blvd**, in the cafeteria, hallways and auxiliary gym. Vendor registration/booth charges do not apply to visitor admission.

Sources: [district member event listing](https://neoshocc.com/events/details/newcaps-holiday-craft-fair-20752?memberSlug=neosho-school-district), [district member attribution](https://neoshocc.com/list/member/neosho-school-district-2321), [NEWcaps branded 2026 flyer](https://chambermaster.blob.core.windows.net/userfiles/UserFiles/chambers/2144/Image/2026/NEWCAPSHOLIDAYCRAFTFAIR2026.png).

**Model limit:** link a temporary public fair to the school. Public-access claims apply only to the documented spaces and session hours. The fair does not make the school a generally public venue or change its permanent type.

**Unknown / unavailable:** canonical permanent school ID, specific exterior entrance, parking, last admission, accessibility and any access outside the event.

## C26-007 — Carthage Downtown Lighting / Christmas Parade

**Supported:** Monday, December 7, 2026. Vision Carthage's fixed lighting site is **302 S Main St, Carthage Square**: caroling starts at 5:30 p.m., dance at 6:15 p.m., lighting at 6:30 p.m. Carthage SkillsUSA with Vision Carthage organizes the parade, starting at 7 p.m. Both municipal records describe free public activities; the commercial parade-entry fee does not apply to spectators.

Sources: [Vision Carthage program](https://www.visioncarthage.org/hometown-holidays), [current organizer flyer](https://assets.cdn.filesafe.space/ftXHXN2qrw95U6FMIFMO/media/6aea32e4015a18a89dc522b5.png), [city lighting entry](https://www.carthagemo.gov/events?id=67826198), [city parade entry](https://www.carthagemo.gov/events?id=64839108). The current flyer and separately identified city entries establish the schedule without relying on older mixed-season landing-page material.

**Route:** starts at Chestnut and Main, heads north on Main, circles the square, then returns south to Chestnut and Grant. This route remains distinct from the fixed square site. The square is a documented spectator location, not an invented gate or parking destination.

**Model limit:** one linked outing with a fixed-site program and a route-based parade. Both sessions have supported starts but unknown finishes. The city's 7–8 p.m. calendar envelope does not prove the final float's finish, and neither session establishes recurring downtown light hours. Do not manufacture an Open Now interval from these starts.

**Unknown / unavailable:** canonical square identity, exact finish times, last entry, gate, spectator reservations, reserved viewing, accessibility, parking and continuing nightly availability. `route.finishTime` remains null; the documented geographic terminus is preserved in the route description without inventing a finishing time.

## Publication blockers retained

Before public integration, independently match canonical permanent identities without speculative coordinates or duplicate records; retain preferences, favorites, history and exclusions by those identities. Keep event/route navigation unavailable until precise access is supported. Do not represent unknown live ticket status or start-only program schedules as usable checkout/Open Now data. Exact-candidate integration acceptance and explicit merge/release authority remain separate from this research verdict.
