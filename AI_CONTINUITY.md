# Dinner Roulette — AI Continuity

_Last updated: September 9, 2026_

## Project state

- Active app: Dinner Roulette V.3.
- Repository: `caleb1234calvin-art/dinner-roulette`.
- Current compliance work: `legal/third-party-compliance-pass-1`.
- Compliance PR: #28, based on `audit/national-casino-pass-1`.
- `main` remains untouched unless Caleb explicitly requests a merge or direct change.
- ChatGPT is the only AI authorized to directly modify this repository. Grok/SuperGrok may build or move artifacts into the workflow, but does not directly edit the repository.
- Dinner Roulette and the Jasper County audit are interconnected projects. Audit data, methods, infrastructure, and discoveries may feed Dinner Roulette.

## National casino audit continuity

At the start of this legal/compliance pass, the curated casino/nightlife backbone contained 22 completed jurisdictions and 232 explicit curated casino records. Preserve the audit branch/history while compliance work is reviewed separately.

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

## Restaurant icon replacement plan

Replace third-party restaurant logos/brand artwork with a Dinner Roulette-owned generic restaurant icon system while keeping factual restaurant names intact.

Planned categories can include burger, pizza, Mexican, Chinese, Japanese/sushi, Italian, steakhouse, BBQ, chicken, cafe/bakery, dessert, seafood, buffet, diner/American, and additional categories as the catalog requires.

Implementation direction:

1. Generate a coherent Dinner Roulette icon family specifically for the app rather than imitating restaurant trademarks, mascots, logos, packaging, or trade dress.
2. Store the generated assets in the repository with clear provenance/documentation.
3. Reuse the existing restaurant visual/photo-key mapping architecture where practical so the product structure does not need to be rebuilt.
4. Map restaurants to generic cuisine/type artwork while continuing to display their factual business names in text.
5. Remove legacy third-party logo assets from active app presentation once replacement coverage is sufficient.
6. Audit fallback behavior so every restaurant receives either a suitable Dinner Roulette category icon or a neutral generic restaurant fallback.
7. Preserve the existing Date Night and Nightlife artwork systems where those assets are original/cleared; audit their provenance separately if uncertain.

## Future integration rule

For any new third-party integration: check the provider's current official terms/documentation first; prefer factual text attribution and provider-supported links; avoid copied logos/content, undocumented APIs/deep links, scraped data, and implied partnerships. Record important decisions in this continuity file and the legal audit before merging.

## Merge discipline

PR #28 remains the review surface for this pass. Do not merge the compliance branch into the casino-audit branch or `main` unless Caleb explicitly requests it.
