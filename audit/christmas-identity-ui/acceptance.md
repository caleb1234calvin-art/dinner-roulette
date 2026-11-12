# Christmas 2026 identity and event UI acceptance candidate

Status: isolated development candidate; all four public publication gates remain `hold`.
This document supersedes the implementation limitations in the earlier `audit/christmas-2026-pilot` snapshot. It does not change the accepted event evidence or authorize release.

## Review basis and dependency isolation

- Master coordination: [#86](https://github.com/caleb1234calvin-art/dinner-roulette/issues/86).
- Required changes: [Astra's field-level acceptance review, #93 comment 6810772595](https://github.com/caleb1234calvin-art/dinner-roulette/issues/93#issuecomment-6810772595).
- Parent: draft [#95](https://github.com/caleb1234calvin-art/dinner-roulette/pull/95), exact reviewed commit `2fb7fba7393be98909dace3ac9135ab6cbf9b5f1`, tree `ecb55a539dec177aa567e3d41a419ea68a85092b`.
- New branch: `integration/work-93-christmas-identity-ui`. The draft PR records its exact tested SHA, tree, changed files and CI runs; a document cannot embed its own eventual commit hash.
- Original #95, fixture repair #94 (`a85c151282759addc744aaa071c1e065ab41cfce`) and V4 visual #90 (`5f6c2175306af8da76df49cc9a11ce492f555595`) were checked before editing and remain independent. The candidate inherits #94 through #95; it does not copy #90's atmosphere, village, snow or artwork. #90 changes ModeHome/atmosphere; this candidate integrates DateNightHome and event surfaces. Combined V4 visual acceptance remains separate.

## Architecture and identities

The public resolver reads only the four catalog records and respects their HOLD gates. A separate explicit isolated-review function and a test-only JSX entry exercise the real components, store and resolver. No URL, environment variable, production route or stored preference unlocks the four records. Synthetic temporary placements exist only in tests.

| Attraction | Preference/selection identity | Host and binding status |
| --- | --- | --- |
| C26-001 Sparkle | `date-night-osm-way-987588580` | Reviewed Central Park OSM way 987588580 v2, changeset 189037687; binding requires matching surviving ID, name, full address, park classification and preserved provider revision. |
| C26-005 market | `date-night-event-christmas-2026-olde-world-market` | Grace Episcopal Church, OSM way 437235888, is documentary host evidence only. One event identity, distinct paid Friday and free Saturday sessions. Real distance placement remains uncleared. |
| C26-010 fair | `date-night-event-christmas-2026-newcaps-craft-fair` | Neosho High School is documentary host evidence only; no ordinary school discovery row is created. Real distance placement remains uncleared. |
| C26-007 outing | `date-night-event-christmas-2026-carthage-lighting-parade` | Fixed outdoor square and separate parade-route session locations. No courthouse-building binding. Real spectator/distance placement remains uncleared. |

Edition-scoped event keys identify content, dated session keys identify admissions, and optional permanent associations identify relationships. A host is not the preference identity of a temporary event. Different verified events may share a host. Category-first Pick and Four Options deduplicate by preference identity, so sessions do not become extra recommendations.

Park binding distinguishes missing review, conflicting review, missing provider source evidence, stale revision, conflicting merged fields and a valid reviewed object absent from the current query. An arbitrary HTTPS review URL cannot bind any event to a park. The unchanged September source-object edit timestamp is not confused with the November review/retrieval date. Provider payloads without version/changeset evidence remain unbound; the code does not fabricate those fields.

Ordinary filters and Christmas categories persist separately. Opt-out, January 1 and public HOLD restore ordinary eligibility without rewriting the user's ordinary categories. Christmas categories never enter ordinary discovery requests; church/school classifications are not broadened. Favorites, ratings, never-recommend, temporary exclusions and history use the appropriate preference key. Saved snapshots are sanitized historical display data, never publication, navigation or attendance authority.

Result, Four Options, Plan, Favorites and History branch to event-specific presentation before reading host fields. Event names, admission, Chicago schedule and fixed-site/route information come from the snapshot. Unknown or malformed event records fail closed. Christmas Plan context is explicit even when only ordinary suggestions remain. Plans show separate schedules and do not certify travel feasibility or a combined admission itinerary.

## Facts, timing and unavailable actions

The accepted schedules remain unchanged: Sparkle nightly 17:00–24:00 with a separate app window of November 27–December 31; market Friday December 4 17:30–19:00 ($10), Saturday December 5 09:00–14:00 (free); fair December 5 09:00–15:00 CST (free); December 7 square starts 17:30/18:15/18:30 and parade starts 19:00 (free). Conditional opening-night Sparkle timing remains withheld. The fixed product window is evaluated in America/Chicago independently of advertised event dates.

Operating intervals are opening-inclusive and closing-exclusive, without overnight bridging. Start-only square/parade sessions never qualify for Open Now. Immediately after the last announced start they leave Pick, Four Options and Plan; a separate published-schedule reference remains readable. No finishing time or recurring downtown lights hours is inferred.

Venue addresses and geometry establish neither visitor entrances nor parking. Directions, ticket checkout, parking, accessibility, live inventory and last-admission actions remain unavailable on every event surface. Navigation helpers also reject malformed event markers and event namespace IDs. No event-specific category artwork was invented.

## Evidence provenance

The original field-level source ledger remains in [the pilot evidence snapshot](../christmas-2026-pilot/evidence.md). Current catalog references retain the reviewed city/CWEP, church/diocese, chamber/district/flyer and city parade sources; host/provenance fields add Astra's acceptance review. No other VERIFIED record or research HOLD attraction is included.

The attributed [park source fixture](../../scripts/test-support/christmas-park-source.json) records a November 12 direct OSM API retrieval, source URLs, version/changeset, relevant tags, raw response SHA-256 and ODbL attribution. Contributor usernames/IDs are omitted. Its bounding-box midpoint (`37.1734644`, `-94.3130247`) is solely provider replay/distance evidence, not a visitor gate. Real provider normalization, classification and merge are replayed against this packet, including conflicting and metadata-missing variants.

## Validation and handoff

Focused tests cover binding attacks, provider absence/conflicts, independent events without ordinary hosts, shared hosts, missing placement, invalid location/radius, category selection/uniqueness, session prices/gaps, sub-minute start cutoffs, actual Zustand localStorage save/reload, history expiry, exclusions, legacy preferences, all five event surfaces and action guards. The isolated browser suite uses real components/store/CSS at 320/390/512 pixels with reduced motion and records source SHA/tree, input fingerprint, bundle fingerprint, screenshots and any external requests/errors.

The general CI Date Night lane runs both the existing radial/Halloween regression and the new isolated browser suite. Browser artifacts are retained under `audit/browser-results/christmas-events`. Production-mode compilation invokes Vite directly with auth enabled; it never invokes the package `build` script's migration tail. The existing unsigned Android readiness workflow remains unchanged. The draft PR's final receipt lists passing/failing counts and exact-head run URLs; older runs are historical only.

Independent Astra handoff: review the new draft at its recorded exact SHA/tree against comment 6810772595, inspect provider and persistence adversarial tests plus mobile screenshots, then decide whether identity/UI corrections are accepted. Publication is still HOLD pending per-record publication acceptance, temporary event distance/spectator placements, and any separately authorized real attendance/navigation evidence. A valid park binding alone does not release Sparkle. Physical Android/WebView acceptance and combined PR #90 V4 integration are not established by desktop Chromium or unsigned readiness. No merge, deployment, signing, Play change, production import or public release is authorized.
