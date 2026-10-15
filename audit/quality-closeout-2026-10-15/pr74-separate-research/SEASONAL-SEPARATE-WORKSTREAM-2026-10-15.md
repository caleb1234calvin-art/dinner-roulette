# Seasonal research continuation — separate from PR #74

**Disposition: HOLD for both reviewed attractions; zero promotions or catalog changes.** Research access: October 15, 2026, 23:22–23:25 UTC. No organizer was contacted, no form submitted, and no ticket purchase or checkout attempted. No D3 implementation or release operation occurred.

## Exact inventory reconciliation

Read the queue and prior research reports at authoritative continuity `9faa3561a215f846cf9f1026ce64e2a9f06f3b9a`. Independently compared all 31 queue IDs against catalog source at released main `ead2319c4869478f4cd121e2370db4d9734d83ed`, tree `7c12c5327af906348992e9b7d3282a11f830a202`: **31 unique tracked, 10 released, 21 held, no recorded-status discrepancy**. No frozen cutoff had elapsed at the receipt time. Frozen dates do not establish current operating or ticket availability.

The five ranked holds remain Dark Hollows, Catacombs, Sinister Acres, Acres of Madness, and Guthrie Haunts. The sixteen reserve holds are unchanged. Only Dark Hollows and Sinister received this source refresh. Iowa provisional records and Missouri owner-field holds were not re-audited. See `QUEUE-EXACT-MAIN-RECONCILIATION.json` and `DEDUPLICATION-SCAN.json`.

## Dark Hollows — fresh evidence, same bounded HOLD

The freshly downloaded organizer page still gives conflicting online-only and door-purchase wording. It describes an approximately 45-minute walking experience and recommends closed-toe footwear. This establishes neither gate availability nor age/access/effects rules. The current public ticket form contains no event-specific waiver element; its two waiver-text matches are generic localization strings.

The official calendar was downloaded and actually viewed: October 16/17/23/24 only. Its SHA-256 remains `c79ace36a32ed98cc7475706fd64afbffd51036908a67346ffae79b08bd3a047`. Independently decoded public ticket configuration agrees: Friday/Saturday within October 16–24, configured 19:00–22:20 entry slots. These are not guaranteed inventory, closing hours, or a 20-minute hike. No expiration extension is proposed.

The camp operator/reservation sources corroborate the address and designated entry/exit traffic, not a 2026 event entrance or accessible route. Literal name/address/operator/domain comparison found no released-catalog match. Approximate camp placement remains distinct from entrance placement.

**Next action:** retain HOLD pending explicit organizer clarification or a documented independent partial-information acceptance under ListingCompletenessV1. Unknown age/access/effects fields must stay unknown; unknown fields alone are not a new policy prohibition. Any bounded proposal must avoid gate-sales promises, prefer address Directions, retain approximate-placement disclosure and fail-closed Open Now. This worker supplies no final clearance.

Sources accessed:

- <https://www.darkhollowshayride.org/>
- <https://httpbigtimberpumpkinfest.ticketspice.com/dark-hollows-2026>
- <https://threefirescouncil.org/camp-big-timber/>
- <https://campreservation.com/127/Camps/180>

## Sinister Acres — direct source resolves stale indexed schedule

The search extractor returned a seven-month-old Hours page labeled 2025. A fresh ordinary GET of that same public URL returned a **2026** heading and a directly linked 2026 calendar. The downloaded calendar was actually viewed; remaining dates are October 16/17/18/23/24/25/29/30/31 and November 1. Friday/Saturday cells show 19:00–23:00; October 18/25/29 and November 1 show 19:00–21:00. November 1 is Blackout Night. This agrees with the frozen queue; it does not justify expansion.

The operator-linked 2026 HauntPay page corroborates the address and seasonal ticket validity, not daily operation. Its refund/cancellation policy does not establish visitor accessibility or age/effects rules. The official directions page corroborates 5491 North Reed Station Road, De Soto IL 62924. A literal released-catalog scan found no identity/address/domain match.

**HOLD:** no complete independent visitor-information/placement/duplicate clearance or candidate acceptance. Next reviewer can use the current primary calendar, not the stale indexed 2025 version, when preparing a separate small candidate. Seasonal hour/date interpretation still needs its own exact implementation tests.

Sources accessed:

- <https://sinisteracres.com/>
- <https://sinisteracres.com/tickets>
- <https://sinisteracres.com/hours>
- <https://sinisteracres.com/directions>
- <https://app.hauntpay.com/events/2026-sinister-acres>

## Evidence integrity and access limits

All 11 ordinary public GETs succeeded with HTTP 200; exact timestamps, URL, size, content type where captured, and SHA-256 are in the three `source-pages/FETCH-RECEIPTS*.json` files. Original downloaded HTML and both calendar images are included. The Sinister image filename ends in `.png` because its source URL does; the actual response is JPEG, recorded in the receipt. No image alteration occurred.

The web extractor could not access the Dark Hollows ticket page and guessed Sinister `/faq` path. Ordinary GET of the already known, public ticket URL succeeded; this was an extractor limitation, not an authorization denial. The guessed FAQ path supplied no evidence. Targeted primary-domain searches returned no additional policies; that absence is not proof that none exist elsewhere. A previously denied ticket privacy-policy URL was not retried. No access control or sign-in wall was bypassed.

The earlier research archives were not reopened by this worker. This packet preserves newly accessed source bytes and two actually inspected images; prior reports remain historical evidence. A file manifest is not a promise of perpetual screenshot retention. Research remains separate from PR #74 acceptance and from D3 Benton.
