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
- California progressed from 32 fully reconciled properties in the primary file, to 41 after two supplements, to 60 after the requested 30-record cleanup sweep.
- The final-exception work now property-reconciles **66 of 74 license records (89.2%)**. The latest resolved properties include Desert Rose, Red Fox, current The Heights/former Cher-Ae Heights, Cahuilla Casino Hotel, Harrah's Northern California, and Winnedumah Winn's Casino.
- Cahuilla now has government-document coordinates tied directly to the casino property. Harrah's Northern California has address-specific current map/property evidence at 4640 Coal Mine Road. Winnedumah Winn's has a current Independence/Highway 395 physical-property match while CGCC continues to list the license active.
- Red Fox remains a property-reconciled **status-caution** record because the regulator still lists it active while secondary evidence questions current operation. Do not silently activate it without final operating-status treatment.
- Cher-Ae Heights/current The Heights is physically reconciled to 27 Scenic Drive, Trinidad; CGCC's displayed locality conflicts with the physical/tribal property and is retained as a regulator-locality caution.
- Several records are no longer research failures but explicit runtime decisions: `Casino Morongo` must not create a second destination while the verified Morongo Resort property represents the current campus; North Fork Mono is excluded until its announced October 2026 opening; Hidden Oaks is held from the Class III-oriented curated runtime because the operator describes it as Class II.
- Mechoopda is now treated as a **closed-property exclusion** rather than a missing-property case: the licensed temporary property at 149 Openshaw Road was closed after January 31, 2025 even though CGCC continues to expose the license record.
- Chicken Ranch is now a **multi-venue/single-staged-license special case** rather than an unresolved identity problem. The operator confirms both Chicken Ranch Casino Resort at 9100 People of the Mountain Road and the OG Casino at 16929 Chicken Ranch Road are operating. The curated license-backed destination should use the current resort as primary; the OG venue remains documented and may surface through live discovery rather than being fabricated as a second license record.
- **Only one research exception remains: Acorn Ridge Casino.** Current operator material identifies 17500 State Highway 49, Plymouth, but strict coordinate evidence and a final current-status check are still needed before promotion.
- After Acorn Ridge, California moves entirely into final accounting/consolidation: reconcile all 74 CGCC IDs against the staged files, ensure no license disappears, ensure no physical property is double-counted, and derive the justified physical-destination set. License count and runtime destination count are intentionally not assumed to be identical.
- Then consolidate the staged California reconciliation files, generate `src/lib/nightlife/casino-catalog-pass-19.ts`, wire it into `src/lib/nightlife/search.ts`, run duplicate/audit/typecheck/tests/build checks, update `CASINO_AUDIT.md`, and only then mark California complete.
- Continue using regulator/government rosters for identity and operator/property sources for current address/name details. Explicit exclusions, dedupes, and status cautions are preferable to invented precision.
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
