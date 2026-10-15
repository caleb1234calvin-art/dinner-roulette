# Seasonal queue — independent reconciliation and selective source refresh

October 15, 2026. **31 tracked identities = 10 released + 21 held; zero newly promoted.** The held inventory and historical cutoffs are not claims that all those attractions are operating or open now.

## Fresh identity reconciliation

Read `audit/quality-closeout-2026-10-15/QUEUE-DISPOSITION-R1.json` on continuity snapshot `76a7915fc5453099af1f692e9fdca45822eabfd0` and independently compared all 31 IDs against catalog source files at production main `991978fe24ec165eeacd5500a26d66f35d86c560`, tree `95f66498048590cbd30c623b17d15bf2d5b7cc73`.

`QUEUE-INDEPENDENT-R2.json` records 31 unique IDs, 10 production matches, 21 absent/held IDs, no discrepancy with recorded release status, and zero elapsed frozen cutoffs at the check. This is an exact-ID reconciliation, not a completed venue/operator/address duplicate review. Original 31-record archive hash `c24ebb1bec0293f564afb407bb9fa08acc5dc1a8bd03ce2592917819d9b9f84a` remains a historical receipt; that original ZIP was not reopened by this worker. No source identity was added, removed or modified.

Five ranked holds remain: Dark Hollows, Catacombs, Sinister Acres, Acres of Madness, Guthrie Haunts. Sixteen reserves remain: Wicked Island; 13 Sinister Souls; Colby Haunted House; Fear Factory 501; Chill Factor Haunted Attraction; Aura; Necrosis; Clinton's Terror on Washington Street; Northern Illinois Fear Fest; Twisted Crypt; Basement of the Dead; HellsGate; Massacre; 13th Floor Chicago; Scream Scene; Dungeon of Doom. Separate Iowa 23 provisional/0 cleared and Missouri nine owner-field HOLDs were not re-audited or promoted.

## Dark Hollows — primary date and session evidence materially strengthened; HOLD

Freshly retrieved the official attraction page and its linked TicketSpice page. Downloaded and visually inspected the official 2026 calendar: only October **16, 17, 23, 24** are highlighted. The image is 86,234 bytes, SHA-256 `c79ace36a32ed98cc7475706fd64afbffd51036908a67346ffae79b08bd3a047`, matching the prior recorded image hash.

The public TicketSpice HTML contains ticket configuration and dated inventory for those same four dates. Its configured active slots run from 19:00 through 22:20 in 20-minute steps. These are configured entry slots, not proof of checkout availability, overall closing time or a 20-minute hike. No purchase was attempted. The official homepage describes a walking hike of approximately 45 minutes and closed-toe footwear; retain “hike,” not the historical hayride identity.

The camp's operator reservation page corroborates Camp Big Timber at **37W955 Big Timber Road, Elgin IL 60124** and designated traffic directions. Camp rental check-in/out hours and rental policies are not attraction hours/policies. Homepage gate-sales wording remains inconsistent. Full visitor access/age/effects notices, approximate placement acceptance and operator/address deduplication still require clearance. Do not publish inferred accessibility, age limits or machine Open Now. Preserve the frozen October 24 final-date boundary.

Sources: <https://www.darkhollowshayride.org/>, <https://httpbigtimberpumpkinfest.ticketspice.com/dark-hollows-2026>, <https://campreservation.com/127/Camps/180>. Raw downloaded sources and schedule extraction are retained with hashes.

## Sinister Acres — official 2026 calendar recovered and inspected; HOLD

Followed the operator's Tickets link to its 2026 HauntPay listing, then downloaded and visually inspected the **2026 October** calendar poster. It explicitly confirms remaining October **16,17,18,23,24,25,29,30,31** and **November 1**. Friday/Saturday cells show 7–11 PM; October 18/25/29 and November 1 show 7–9 PM. November 1 is identified as Blackout Night. These dates match the frozen queue.

The linked ticket page confirms **5491 N Reed Station Road, De Soto IL 62924** and says tickets are valid on nights the attraction is open; the broad Oct2–Nov1 ticket validity period is not interpreted as daily operation. Full access/safety, identity, placement and exact candidate acceptance remain unfinished. No promotion or policy change. `source-pages/sinister-source-receipt.json` records the exact page/image URLs and hashes; the image was actually viewed.

Sources: <https://sinisteracres.com/>, <https://sinisteracres.com/tickets>, <https://app.hauntpay.com/events/2026-sinister-acres>.

## Guthrie Haunts — operator-linked finite dates corroborated; HOLD

The operator's Tickets page links directly to the 2026 StubWire calendar. It lists October **16,17,23,24,30,31** and November **6,7**, with November 6/7 labeled Blackout and ticket windows beginning at 7 PM. The operator gives **4524 Riverside Circle, Guthrie OK 73044** and describes a ticket window through midnight, with later service for people already queued. Do not turn that statement into a fixed attraction closing time or invent additional dates.

Opening three date links redirected to errors, including explicit order-access errors for November dates. No bypass was attempted; successful transaction or sellable inventory is not claimed. Full visitor/access, point, deduplication and late-fall lifecycle acceptance remain incomplete. The official-linked calendar is stronger than an undifferentiated third-party season heading, but it is not full implementation clearance.

Sources: <https://www.guthriescaregrounds.com/tickets>, <https://www.guthriescaregrounds.com/calendar>, <https://www.stubwire.com/events/guthriehauntsscaregrounds/>.

## Acres of Madness — public ticket configuration recovered; HOLD

The official 2026 site confirms Lakeside Speedway at **5615 Wolcott Drive, Kansas City KS 66109** and delegates dates/times to its linked TicketSpice page. The public page configuration exposes a September18–November7 date range, weekday flags and explicit exclusion dates, plus individual attraction/waiver records. Extracted configuration is preserved. It still needs rendered date/session corroboration and a scoped policy review before translating it into listing fields.

Do not use the site's general “open now” marketing as live opening evidence. Its October3 Lights Out special is already past and must not be promoted. The public metadata ends at `2026-11-08T05:00:00Z` (November7 23:00 Central), while the frozen queue cutoff is `2026-11-08T06:00:00Z`; reconcile the exact expiry basis before proposing a record. No date extension or machine-hours inference was made.

Sources: <https://zombiepurge.com/>, <https://acresofmadness.ticketspice.com/acres-of-madness-2026>.

## Catacombs and evidence limits

The fresh homepage open timed out. The previous identity/address evidence remains historical; no new 2026 date clearance was obtained. The other sixteen reserves were reconciled by identity only, not freshly source-audited. No complete original acceptance archive or screenshot bundle is claimed reviewed by this research worker.

A missing local HTML parsing dependency was avoided using Python's standard parser; an initial relative-image-URL error was corrected by resolving the observed link against its page. These were local retrieval-script errors, not venue/source defects. Some web extractors failed while normal public-resource downloads succeeded; no authentication or access-denied source was bypassed.

## Next safe work

Prioritize a full Dark Hollows or Sinister source/placement/access/duplicate review while their confirmed dates remain useful, and a scoped Guthrie/Acres late-fall review. Each must receive complete independent clearance and its own small data-only candidate with exact-head tests. Research remains separate from PR #73, D2 and D3. October25 does not override actual operating dates. No owner release decision is requested for any held research record.
