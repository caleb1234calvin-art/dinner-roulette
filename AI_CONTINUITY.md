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

The national casino audit is active on the current stacked working branch.

- Completed jurisdiction passes documented in `CASINO_AUDIT.md`: **24**.
- Arizona is complete at 26 Class III tribal casino facilities and is wired into runtime via `casino-catalog-pass-18.ts` and `src/lib/nightlife/search.ts`.
- California uses a CGCC snapshot of **74 active tribal-casino license records**. First-pass research covers the full roster.
- California progressed from 32 fully reconciled properties in the primary file, to 41 after two supplements, to 60 after the requested 30-record cleanup sweep, then through focused final-exception work.
- `audit/california-final-exception-pass-2026-09-10.json` now closes the individual-property research phase. **67 of 74 license records are property-reconciled**, while the other records are handled through explicit dedupe/exclusion/scope/status/multi-venue decisions rather than being forced into fake one-license/one-destination equivalence.
- The final research exception, **Acorn Ridge Casino (TRCS-000082)**, is resolved at 17500 State Highway 49, Plymouth. Current operator material confirms the address and September 2026 activity. California CEQAnet/BIA project records give the underlying 228.04-acre casino project site coordinate at approximately **38.4658333, -120.8525278**. This is recorded explicitly as a project-site coordinate, not falsely described as a building-door centroid.
- Cahuilla Casino Hotel, Harrah's Northern California, Winnedumah Winn's, Desert Rose, Red Fox, and current The Heights/former Cher-Ae Heights were also resolved during final-exception work. Red Fox retains an operating-status caution; The Heights retains a CGCC locality caution.
- Explicit runtime/special-case decisions remain: `Casino Morongo` must not create a second destination while the verified Morongo Resort property represents the current campus; North Fork Mono is excluded until its announced October 2026 opening; Hidden Oaks is held from the Class III-oriented curated runtime because the operator describes it as Class II; Mechoopda is excluded as a closed temporary property despite the license remaining visible; Chicken Ranch uses the current resort as the primary license-backed destination while the still-operating OG Casino remains documented and may surface through live discovery.
- **Remaining individual-property research exceptions: 0.** Do not start another broad California casino research batch unless the final accounting exposes a genuine missing record.
- California now moves to **final accounting and assembly**: reconcile all 74 CGCC license IDs across the primary reconciliation, supplements, cleanup sweep, and final-exception file; prove no license silently disappeared; identify duplicate/special-case relationships; and derive the justified current physical runtime destination set.
- License count and runtime destination count are intentionally not assumed to be identical. The runtime catalog must represent current physical destinations, not mechanically emit one destination per regulator row.
- After all-ID accounting, consolidate the staged California reconciliation into one authoritative record set; generate `src/lib/nightlife/casino-catalog-pass-19.ts`; wire it into `src/lib/nightlife/search.ts`; run duplicate/audit/typecheck/tests/build checks; update `CASINO_AUDIT.md`; and only then mark California complete.
- Continue using regulator/government rosters for identity and operator/property sources for current address/name details. Explicit exclusions, dedupes, status cautions, and provenance notes are preferable to invented precision.
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

Third-party restaurant logos/brand artwork are replaced in active Dinner presentation with a Dinner Roulette-owned generic cuisine/category icon system while factual restaurant names remain intact.

Tracked as Issue #29. The implementation is isolated on `feature/dinner-icon-pack-1`; it is not in `main`.

### Locked visual language

- Dinner icons use realistic claymation / tactile miniature food objects rather than photoreal food photos.
- Rounded-square tile construction with no text, restaurant logos, mascots, packaging, or brand marks.
- Dinner identity uses the same cyan/teal-left and burnt-orange/terracotta-right luminous edge treatment in both themes.
- Dark theme uses a charcoal/dark glossy tile; light theme uses a pearl/soft-gray tile.
- Underlying object/style language stays constant across themes.

### Implemented Dinner category pack

The branch contains 15 semantic categories in each theme, 30 canonical assets total: `burger`, `pizza`, `mexican`, `chinese`, `japanese`, `italian`, `steakhouse`, `bbq`, `chicken`, `cafe-bakery`, `dessert`, `seafood`, `buffet`, `breakfast`, and `fallback`.

Canonical asset layout is `public/dinner-icons/dark/<category>.jpg` and `public/dinner-icons/light/<category>.jpg`.

### Dinner icon resolver and UI wiring

- `src/lib/restaurants/dinner-icons.ts` classifies restaurants from structured cuisines first, then name/cuisine-label/photo-key hints, with a neutral fallback.
- Theme-aware icon paths use the app's existing theme state.
- Dinner shortlist/options cards and final Dinner results use the local Dinner icon resolver.
- Date Night and Nightlife artwork remain separate systems.

## Validation and maintenance status

A dedicated GitHub Actions workflow exists at `.github/workflows/validate-icon-pack.yml` for `feature/dinner-icon-pack-1`.

Verified passing gates include dependency installation, blocking TypeScript `tsc --noEmit`, development client/SSR/Nitro build, all 30 canonical Dinner icon assets, and successful branch workflow completion.

Maintenance work restored Nightlife chip artwork typing, repaired curated Nightlife records missing `website`, restored `.grok/app-env.json` with `VITE_AUTH_ENABLED: \"false\"`, and isolated PWA metadata tests from the real `Pick For Us` workspace identity using temporary fixtures.

### Remaining legacy/template test debt

The inherited `scripts/**/*.test.mjs` suite contains Grok/template-specific documentation-contract checks expecting `.grok/skills/og/SKILL.md` and `.grok/skills/og/references/`, which are absent. Do not fabricate placeholder documentation solely to make those tests green. Restore authoritative upstream documents or make the checks conditional/self-contained.

The workflow currently reports inherited template-suite debt without allowing it to block strict TypeScript, build, and icon-validation gates. Before final integration, prefer a strict active-app test gate separated from retained upstream-template compatibility checks.

### Dependency/tooling warnings observed

GitHub Actions reports ecosystem/tooling deprecation warnings including Recharts 2.x, ESLint 9.x, and Node-20-based internals in current action versions. Do not perform major upgrades solely to silence warnings on this feature branch; handle them as an intentional maintenance pass with regression testing.

## Future integration rule

For any new third-party integration: check current official terms/documentation first; prefer factual text attribution and provider-supported links; avoid copied logos/content, undocumented APIs/deep links, scraped data, and implied partnerships. Record important decisions in this continuity file and the legal audit before merging.

## Merge discipline

Current dependency/load order:

`audit/national-casino-pass-1` → `legal/third-party-compliance-pass-1` → `feature/dinner-icon-pack-1`

PR #28 remains the review surface for the legal/compliance pass. Issue #29 tracks the icon system. Do not merge these branches directly into `main` one-by-one without checking the current branch topology and other active updates.

Preferred ship path is a dedicated integration/compatibility branch: assemble intended updates in dependency-aware order, resolve overlaps, run TypeScript/tests/build/visual checks on the combined app, and only then merge the stable assembled state into `main` after Caleb explicitly requests it.

`main` remains untouched at this stage.
