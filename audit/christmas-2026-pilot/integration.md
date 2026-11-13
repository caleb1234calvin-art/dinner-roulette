# Four-attraction isolated integration candidate

Scope: #86 / #93, based on PR #92's exact `4f866c31a6d8a9219944b250a8dd9536213a9e59`, with fixture-only repair PR #94 (`a85c151282759addc744aaa071c1e065ab41cfce`). Main remains `e078dcdaa9f0ca84951409cdb92805731af3d34b`. PR #90 remains independent at inspected head `5f6c2175306af8da76df49cc9a11ce492f555595`. No visual assets, React components, production discovery imports, storage migrations, dependencies or workflows change.

## Candidate contract

`buildChristmasPilotCandidate` composes the four real reviewed research records with explicitly bound, already merged/decorated canonical venues. Its choices feed the same generic `pickChristmasChoice` / `pickChristmasOptions` functions as the foundation. The picker still selects category first, de-emphasizes ordinary parks at 0.08, and returns at most four distinct canonical IDs. The function is intentionally not imported by production discovery, stores or UI. This is the data/picker integration candidate, not a publicly usable four-venue catalog or V4 visual integration.

The repository and research establish no canonical IDs for these four permanent hosts. Therefore there are **no production bindings**. Missing, duplicate, conflicting, unreviewed or absent-parent bindings produce explicit blockers, not name/address matching or fabricated places. Test bindings use synthetic fixtures, never inferred production coordinates. A separate identity review must establish actual IDs and preserve any existing preference history before a public adapter can supply bindings.

All four attractions retain their parent venue object and ID. Events are linked presentations, never mutations of permanent classification, hours or preference records. Sparkle records a permanent-park display relationship but does not assert a verified same-entrance venue-wide transformation. The church has one host and two session prices. The school has no newly inferred ordinary public access. The square and parade route stay separate. Research IDs are event references, not favorite/history IDs.

The fixed Chicago app window and explicitly evidenced event dates/hours are independent. Only their intersection is eligible. Complete intervals are half-open: opening included, closing excluded; midnight is `24:00` of the advertised night. Known completed sessions expire immediately. A future same-day session may be browsed with Open Now off. Start-only square/parade sessions may be browsed on December 7 with an **end-time-unknown** status; they never satisfy Open Now and expire at the local day boundary. This is a browse deadline, not a claim that the parade continues until midnight. Off-season and opt-out return ordinary choices, without persisting or changing filters.

## Field-specific public display boundary

The event `presentation` carries supported name, category text, venue-level address, session-specific admission, public spaces, fixed-site/route distinction, source references and unknowns. Known complete operating intervals can supply event Open Now; start-only announcements cannot. No admission inventory is inferred. `directionsTarget`, `ticketPurchaseUrl` and `iconKey` are all null. Venue addresses may be labelled as venue addresses only, never “entrance” or “parking.” No Christmas artwork is supplied or substituted.

The retained `choice.venue` is the canonical identity/preferences carrier. Its ordinary `openingHours`, `isOpen`, website or coordinates **must not** be used to render event availability, tickets or event Directions. Any future Result, Options, Plan, Favorites and History integration must use `presentation.eventAvailability` and its field gates. Current ordinary components are not claimed to meet that event contract. Existing preference alias behavior is reused without introducing a new alias migration.

## Validation and independent review

The draft PR body is the mutable exact-head evidence ledger: commit/tree, changed files, command results, hosted run IDs, and unresolved failures. Commit identity cannot be embedded in its own tree. Evidence provenance is in [evidence.md](evidence.md). Focused tests exercise the actual catalog plus synthetic canonical fixtures and the existing picker; existing browser tests exercise real mobile Date Night/Halloween behavior. A passing ordinary mobile regression does not establish new Christmas UI or physical Android/WebView acceptance.

Phase 1 copies only the browser/server calendar fixes and their helper tests from PR #90. The inherited discovery clock already matches. Assertions remain intact, timers continue running, and production season boundaries are unchanged. The original PR #92 radial failure is retained as historical evidence rather than credited as a passing candidate run.

## Publication blockers and next decision

1. Independently accept the exact candidate and hosted checks; any failures remain blocking.
2. Establish reviewed canonical venue bindings against actual merged discovery identities. No new permanent venue may be manufactured from a C26 research ID.
3. Review event-aware display wiring across all five surfaces, category controls and season/resume behavior together with the separately preserved V4 candidate. Review approved category artwork and compact seasonal control separately.
4. Keep navigation/ticket actions withheld unless field-specific evidence supports them. Recheck operator schedules before any separately authorized release. Missing parade finish is not a reason to fabricate Open Now.
5. Full Android/WebView/device acceptance and owner release authorization remain outstanding. No merge, deployment, signing, production import, publication or Play settings action is authorized.

The next decision is independent review of this bounded data/picker candidate and its canonical-binding contract; it is not a request to merge or release.
