# Research reconciliation and selective source refresh — 2026-10-15

Status: no new catalog promotion. Usefulness and independent factual confidence control scope, not October 25 or a target count. Actual source operating dates are unchanged by the owner's schedule flexibility.

## Original queue

Restored `FUTURE-DATA-QUEUE-2026-10-14-R1.zip` (Library `libfile_021138bd3d68819196422d2beb75e52d`). The 31-record frozen JSON SHA-256 is `c24ebb1bec0293f564afb407bb9fa08acc5dc1a8bd03ce2592917819d9b9f84a`. It contained 15 ranked and 16 reserve records. Compare `QUEUE-DISPOSITION-R1.json` against production's `audit/halloween-wave2-2026-10-14/ADAPTED-TEN-FROZEN-INPUTS.json`.

- 10 already released in PR #72; do not reimport.
- 21 remain held for fresh review; none have a full new independent implementation clearance in this takeover.
- 0 frozen cutoffs had elapsed at the Oct 15 check. This does not mean all 31 are open today or that reserve calendar evidence is complete.
- All 31 frozen identities are unique. The remaining names/IDs had no exact match in source catalog files. This is a preliminary duplicate screen, not a substitute for venue/address/operator overlap review.
- Dark Hollows is the most time-sensitive ranked hold: four frozen remaining dates (Oct 16, 17, 23, 24), retirement after Oct 24. Catacombs follows with an Oct 30 cutoff. Avoid spending a large validation cycle on a record after its useful window closes.
- Five ranked holds: Dark Hollows (IL), Catacombs (IL), Sinister House (IL), Acres of Madness (KS), Guthrie Haunts (OK). The 16 reserves remain separately identified in JSON. Iowa's 23 provisional / 0 cleared and Missouri's nine owner-field holds remain held; no automatic promotion.

## Dark Hollows: current-year date gap materially reduced

Retrieved https://www.darkhollowshayride.org/ on Oct 15. Current official copy describes an approximately 45-minute haunted hike, closed-toe shoes and online ticket sales. Its linked official ticket page https://httpbigtimberpumpkinfest.ticketspice.com/dark-hollows-2026 is explicitly titled Dark Hollows 2026 and describes one-hike admission; extracted text did not expose dated inventory or availability.

The homepage links an image named `Hollows Calendar 2026.png`. Downloaded and visually inspected the exact observed image URL:

https://static.wixstatic.com/media/e9267b_2ec20eae40364d42a9696dd7ac004477~mv2.png/v1/fill/w_440%2Ch_367%2Cal_c%2Cq_85%2Cusm_0.66_1.00_0.01%2Cenc_avif%2Cquality_auto/Hollows%20Calendar%202026.png

It explicitly labels October 2026 and highlights Oct 16, 17, 23 and 24. SHA-256 `c79ace36a32ed98cc7475706fd64afbffd51036908a67346ffae79b08bd3a047`, 86,234 bytes. No hours are shown in that image. A search extractor image error was followed by a normal fetch of the exact observed public resource; no access restriction was bypassed.

Disposition: current-year dates corroborated by an official visual source, but full visitor-address, access, notice and independent reviewer clearance remain outstanding. Do not infer hours, sellable tickets or extra dates. Use the current “hike” description when a future candidate is prepared; the historical domain/name says hayride. A directory result with a 2026 heading but an Oct 6, 2025 last-updated date and a different date pattern was rejected as stale evidence.

## Other ranked holds

- https://scarypopcorn.com/ corroborates Catacombs/St. Pascal identity, 6143 W Irving Park Road, Chicago, limited wheelchair access, under-12 recommendation and no-contact policy. The retrieved text did not establish a visible current 2026 calendar. Date clearance remains held.
- https://sinisteracres.com/ corroborates Sinister House operator/site and 5491 N Reed Station Road, De Soto. The inspected linked image was a banner, not a dated calendar. Date clearance remains held.
- Acres of Madness and Guthrie Haunts retain useful later frozen dates, but no new source audit was completed here. They are sensible next regional candidates if their official 2026 evidence and access fields can be independently cleared.

## Revised completion strategy

First finish the bounded Directions candidate's evidence and independent review. In parallel with a later separately authorized provider candidate, refresh only a few geographically useful records with remaining operating dates. Address Kansas City's local-catalog/provider coupling before masking discovery loss with more imports. Prefer 1–3 records per data-only candidate; require exact-head validation and address/operator deduplication. Stop expansion when verification cost exceeds remaining visitor value. Preserve source-bound expiration, partial/null hours, address-preferred Directions, approximate-coordinate notices and Open Now fail-closed rules. October 25 is planning context only.

## Later focused refresh, approximately 19:04 UTC

The camp's operator-maintained reservation page, https://campreservation.com/127/Camps/180, freshly corroborated Camp Big Timber at 37W955 Big Timber Road, Elgin IL 60124, identified the October Dark Hollows attraction, and instructed visitors to follow designated entrance/exit traffic signs. The page's daytime/overnight rental check-in and checkout hours are **not attraction hours** and must not populate machine availability. Camp rental cancellation and supervision terms likewise must not be silently repurposed as haunted-event ticket rules.

The attraction homepage still corroborated the walking experience, duration and footwear guidance. It simultaneously said online sales only and referred to door-ticket discounts; avoid claiming guaranteed gate sales or availability from this inconsistent wording. A fresh open of the linked ticket page failed through the search extractor, although the earlier current-year title was retrieved. The tourism event page returned 403; no alternate route was used to bypass it. Its prior age recommendation remains historical evidence, not a freshly reconfirmed assertion. The frozen approximate point and full access/duplicate review still need fresh independent acceptance. Status remains held; no implementation count changed.
