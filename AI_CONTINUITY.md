# Dinner Roulette — AI Continuity

_Last updated: September 10, 2026_

## Project state

- Active app: Dinner Roulette V.3.
- Repository: `caleb1234calvin-art/dinner-roulette`.
- Current working branch: `feature/dinner-icon-pack-1`.
- This branch is layered on `legal/third-party-compliance-pass-1`, which is layered on `audit/national-casino-pass-1`; it therefore contains the casino audit, legal/compliance pass, Dinner icon implementation, and subsequent maintenance work.
- Compliance PR: #28, based on `audit/national-casino-pass-1`.
- Restaurant icon work: Issue #29.
- `main` remains untouched unless Caleb explicitly requests a merge or direct change.
- ChatGPT is the only AI authorized to directly modify this repository unless Caleb explicitly asks another assistant to update a named file. Grok/SuperGrok may generate artwork and, when Caleb requests it, update this continuity file. Grok does not merge branches or ship icon assets to `main` without an explicit request.
- Dinner Roulette and the Jasper County audit are interconnected projects. Audit data, methods, infrastructure, and discoveries may feed Dinner Roulette.

## National casino audit continuity

The national casino audit is active again on the current stacked working branch.

- Completed jurisdiction passes documented in `CASINO_AUDIT.md`: **24**.
- The original 22-jurisdiction checkpoint contained 232 explicit curated casino records.
- Mississippi was subsequently completed at 28 physical casino destinations.
- Arizona is explicitly documented complete at 26 Class III tribal casino facilities. The Arizona runtime records already existed in `casino-catalog-pass-18.ts` and are wired into `src/lib/nightlife/search.ts`; the audit documentation had lagged behind the implementation.
- California is the current staged large-inventory pass. The California Gambling Control Commission inventory snapshot contains **74 active tribal-casino license records** in `audit/california-tribal-casinos-2026-09-08.json`.
- Property-level California work is tracked in `audit/california-reconciliation-2026-09-10.json`; the accelerated 30-record research tranche is preserved separately in `audit/california-batch-30-2026-09-10.json` so research progress is not confused with fully reconciled/runtime-ready status.
- Strict reconciliation checkpoint remains **13 fully reconciled**, **2 address-verified/coordinate-pending**, and **4 explicitly flagged for identity/location review** in the reconciliation file.
- A new **30-record California acceleration batch** has now been researched. Of those 30, **25 have a property/operator or government-backed physical address**, **4 still need stronger direct address/property evidence**, and **1 is an active CGCC license for a property that is not yet open**. These are research states, not runtime promotions.
- The 30-record batch covers Diamond Mountain through Rain Rock in the staged CGCC roster, including Eagle Mountain, Fantasy Springs, Feather Falls, Garcia River, Gold Country, Golden Acorn, Graton, Hard Rock Tejon, Hard Rock Sacramento, both Harrah's properties, Havasu Landing, Hidden Oaks, Jackson Rancheria, Jamul, Konocti Vista, Lucky 7, Mono Wind, Morongo Resort, Pala, Pechanga, Pit River, Quechan, and others.
- Important new temporal flag: **North Fork Mono Casino & Resort (TRCS-000083)** has an active CGCC license and a verified Madera property address, but its operator site says **opening October 2026**. Do not expose it as an already-open destination until opening is confirmed.
- Morongo Casino Resort and Spa (TRCS-000030) now has a verified current property address but remains subject to the existing same-campus/license review against Casino Morongo (TRCS-000075).
- Hidden Oaks is retained in research because CGCC lists the license active, but its operator identifies it as a Class II facility; verify that it fits the intended runtime casino-destination scope before promotion.
- The earlier four California review flags remain deliberately unresolved rather than guessed: Casino Morongo (same-campus/license relationship), Cher-Ae Heights Casino (regulator/location conflict), Chicken Ranch Casino (new resort plus original casino relationship), and Desert Rose Casino (insufficient direct current property sourcing).
- California is **not** marked complete and none of the staged California research/reconciliation files are wired into runtime yet. Do not promote a partial California catalog merely to increase coverage.
- Caleb increased the working batch size to **30 casino records per research pass** to accelerate the remaining audit. Continue in batches of about 30, then perform a final reconciliation/coordinate/deduplication pass before runtime activation.
- Continue using regulator/government rosters for identity and operator/property sources for current address/name details. Accept coordinates only when evidence is sufficiently property-specific; conflicting or ambiguous geometry stays pending.
- Curated casino records remain a high-confidence backbone merged with live OSM discovery rather than a replacement for live discovery.

## Legal/compliance pass

The goal is risk reduction while preserving Dinner Roulette's fundamental product structure. Do not describe the app as guaranteed legally compliant; legal conclusions remain attorney territory.

Current approach:

- Dinner Roulette is presented as an independent discovery/decision tool.
- Third-party names are used only to identify destinations/services, not to imply affiliation, sponsorship, endorsement, or partnership.
- External links are labeled as third-party destinations and use safe external-link attributes.
- Restaurant/venue hours, prices, ratings, admission, availability, and similar changing information should be presented as information to verify rather than guaranteed facts.
- Nightlife/casino functionality is discovery and trip planning only. Dinner Roulette does not accept wagers, provide gambling, sell alcohol, or guarantee admission.
- Location, preferences, favorites, exclusions, and history disclosures must match actual app behavior.
- A central `LEGAL.md` notice exists and legal/privacy/third-party information is surfaced inside Settings.

## Rideshare integration decision

Rideshare shortcuts are safety/convenience links to independent services, not transportation supplied by Dinner Roulette.

- Keep the neutral Dinner Roulette visual treatment; do not copy Uber/Lyft logos or trade dress.
- Keep the visible `Drive sober` safety framing.
- Uber: destination-aware `m.uber.com` launch is retained because Uber provides developer support for destination-aware ride deep links. Dinner Roulette only passes the selected destination; it does not request, price, book, or guarantee the ride.
- Lyft: use the conservative public `ride.lyft.com` launch rather than relying on undocumented destination query parameters. The user can finish destination selection inside Lyft.
- Rideshare UI must say the services are independent third parties and that availability/pricing vary.
- If a future official Lyft/developer integration is adopted, verify its current terms/documentation before restoring destination-aware behavior.

## Delivery integration decision

Delivery shortcuts are intentionally shallow launch links.

- DoorDash, Grubhub, and Uber Eats buttons open the independent service home experience.
- The user is instructed to search for the selected restaurant after opening the service.
- Dinner Roulette must not claim that a selected restaurant is available on any delivery marketplace unless availability comes from an authorized/current integration.
- Do not deep-link to marketplace merchant/order pages unless the provider's current terms or documented developer program clearly support that implementation.
- Do not scrape/copy marketplace menus, prices, fees, availability, ratings, photos, or other service content.
- Dinner Roulette does not place/process delivery orders, set marketplace prices/fees, or guarantee delivery availability.
- Keep service references text-only/neutral unless future brand guidelines and permission clearly support branded assets.

## Restaurant icon system — implemented on feature branch

Third-party restaurant logos/brand artwork are being replaced in active Dinner presentation with a Dinner Roulette-owned generic cuisine/category icon system while factual restaurant names remain intact.

Tracked as Issue #29. The implementation is isolated on `feature/dinner-icon-pack-1`; it is not in `main` and has not been deployed.

### Locked visual language

- Dinner icons use realistic claymation / tactile miniature food objects rather than photoreal food photos.
- Rounded-square tile construction with no text, restaurant logos, mascots, packaging, or brand marks.
- Dinner identity uses the same cyan/teal-left and burnt-orange/terracotta-right luminous edge treatment in both themes.
- Dark theme uses a charcoal/dark glossy tile.
- Light theme uses a pearl/soft-gray tile.
- Underlying object/style language stays constant across themes so the palette swap reads as theme identity rather than a different icon family.

### Implemented Dinner category pack

The branch now contains 15 semantic categories in each theme, 30 canonical assets total:

- `burger`
- `pizza`
- `mexican`
- `chinese`
- `japanese`
- `italian`
- `steakhouse`
- `bbq`
- `chicken`
- `cafe-bakery`
- `dessert`
- `seafood`
- `buffet`
- `breakfast`
- `fallback`

Canonical asset layout:

- `public/dinner-icons/dark/<category>.jpg`
- `public/dinner-icons/light/<category>.jpg`

The original generated uploads remain preserved while canonical theme-specific copies are used by the resolver.

### Dinner icon resolver and UI wiring

- `src/lib/restaurants/dinner-icons.ts` classifies restaurants from structured cuisines first, then name/cuisine-label/photo-key hints, with a neutral fallback.
- Theme-aware icon paths resolve to `/dinner-icons/dark/...` or `/dinner-icons/light/...` using the app's existing theme state.
- Dinner shortlist/options cards use the local Dinner icon resolver.
- Final Dinner result presentation uses the local Dinner icon resolver.
- This removes third-party restaurant-logo presentation from the active Dinner result surfaces covered by the branch.
- Date Night and Nightlife artwork remain separate systems.

## Validation and maintenance status

A dedicated GitHub Actions workflow exists at `.github/workflows/validate-icon-pack.yml` for `feature/dinner-icon-pack-1`.

Verified passing gates:

- dependency installation completes;
- TypeScript `tsc --noEmit` passes as a blocking gate;
- development client/SSR/Nitro build completes;
- all 30 canonical Dinner icon assets are present and non-empty;
- branch workflow completes successfully.

### Maintenance fixes completed during validation

- Restored Nightlife chip artwork typing so optional chip artwork such as the casino icon is type-safe.
- Repaired curated Nightlife records that were missing the required `website` field by explicitly recording `website: null` where no known site is present.
- Restored `.grok/app-env.json` with `VITE_AUTH_ENABLED: "false"`, matching the repository's existing workspace/auth test contract.
- That app-env repair reduced the legacy script-suite failures from 16 to 12 while preserving a passing TypeScript/build/icon gate.
- PWA metadata tests were subsequently isolated from Dinner Roulette's real `Pick For Us` workspace identity by using explicit temporary fixtures rather than altering the production identity.

### Remaining legacy/template test debt

The inherited `scripts/**/*.test.mjs` suite still contains Grok/template-specific documentation-contract checks that expect `.grok/skills/og/SKILL.md` and `.grok/skills/og/references/`, which are absent from this repository. Do not fabricate placeholder skill documentation merely to turn those tests green. Either restore authoritative upstream template documents or revise those tests so documentation-contract checks are conditional/self-contained.

The workflow currently reports inherited template-suite debt without allowing it to block the strict TypeScript, build, and icon-validation gates. Before final integration, prefer making the active app-focused test gate strict and clearly separating any retained upstream-template compatibility checks.

### Dependency/tooling warnings observed

GitHub Actions currently reports ecosystem/tooling deprecation warnings, including Recharts 2.x, ESLint 9.x, and Node-20-based internals used by current action versions. Do not perform major dependency upgrades solely to silence warnings on this feature branch. Handle upgrades as an intentional maintenance pass with regression testing.

## Future integration rule

For any new third-party integration: check the provider's current official terms/documentation first; prefer factual text attribution and provider-supported links; avoid copied logos/content, undocumented APIs/deep links, scraped data, and implied partnerships. Record important decisions in this continuity file and the legal audit before merging.

## Merge discipline

Current dependency/load order:

`audit/national-casino-pass-1` → `legal/third-party-compliance-pass-1` → `feature/dinner-icon-pack-1`

PR #28 remains the review surface for the legal/compliance pass. Issue #29 tracks the icon system. Do not merge these branches directly into `main` one-by-one without checking the current branch topology and other active updates.

Preferred ship path is to create a dedicated integration/compatibility branch, assemble the intended updates there in dependency-aware order, resolve overlaps, run TypeScript/tests/build/visual checks on the combined app, and only then merge the stable assembled state into `main` after Caleb explicitly requests it.

`main` remains untouched at this stage.
