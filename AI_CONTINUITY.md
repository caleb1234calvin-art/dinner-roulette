# Dinner Roulette — AI Continuity

_Last updated: September 10, 2026_

## Project state

- Active app: Dinner Roulette V.3.
- Repository: `caleb1234calvin-art/dinner-roulette`.
- Current compliance work: `legal/third-party-compliance-pass-1`.
- Compliance PR: #28, based on `audit/national-casino-pass-1`.
- Restaurant icon generation: Issue #29.
- `main` remains untouched unless Caleb explicitly requests a merge or direct change.
- ChatGPT is the only AI authorized to directly modify this repository unless Caleb explicitly asks another assistant to update a named file. Grok/SuperGrok may generate artwork and, when Caleb requests it, update this continuity file. Grok does not merge branches or ship icon assets to `main` without an explicit request.
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

Tracked as Issue #29. Artwork generation is separate from PR #28 so icons can be produced without mixing legal-code review and image work.

### Locked visual language (Issue #29, Sept 10 2026)

- Same family as Date Night / Nightlife icons: dark glossy rounded-square tile, stylized toy/clay 3D object, no photoreal food photography, no text in the artwork, no logos, no mascots, no packaging, no brand marks.
- Dinner-tab palette is not Date Night magenta/lavender and not Nightlife-only teal.
- Dinner-tab rim uses both Dinner themes at once: teal/cyan (light Dinner sliders and Pick button) plus burnt orange/terracotta (dark Dinner sliders and Pick button). Object colors may use natural cuisine colors.
- One dual-rim pack is intended to sit on both Dinner light and Dinner dark themes.
- Caleb approved keeping the current generated set for now. Assets are not in `main` and are not wired into the app yet.

### Generated Dinner category pack (kept, not shipped)

Minimum Issue #29 categories have generated originals:

- Burger — generic cheeseburger
- Pizza — generic pepperoni slice
- Mexican — generic hard-shell taco
- Chinese — dumpling steamer with three buns
- Japanese / sushi — nigiri plus a small roll
- Italian — pasta nest with tomato and basil
- Steakhouse — stylized grilled steak
- BBQ — stylized ribs
- Chicken — fried drumstick
- Cafe / bakery — coffee cup and croissant
- Dessert — layered cake slice with cherry
- Seafood — stylized fish and shrimp
- Buffet — cloche on stacked plates
- Diner / American — pancake stack with butter
- Neutral fallback — plate with crossed fork and knife

Notes for the next session:

- Chicken and diner pancakes are slightly more realistic than the rest of the clay family; keep unless Caleb asks for a restyle.
- Mexican taco fillings are more toy-colored than the others; keep unless a more food-literal taco is requested.
- Additional catalog categories can be added later using the same tile, clay treatment, and teal/orange rim.
- Do not imitate restaurant trademarks. Business names stay UI text.

### Still to do before Issue #29 is complete

1. Store approved assets in the repo with provenance/documentation. Suggested folder: `public/dinner-icons/` with filenames matching category keys (`burger.png`, `pizza.png`, `mexican.png`, `chinese.png`, `sushi.png`, `italian.png`, `steakhouse.png`, `bbq.png`, `chicken.png`, `cafe.png`, `dessert.png`, `seafood.png`, `buffet.png`, `diner.png`, `fallback.png`). Confirm filenames against the existing photo-key map before writing files.
2. Reuse the existing restaurant visual/photo-key mapping architecture.
3. Map each restaurant to a generic cuisine icon or the neutral fallback.
4. Remove legacy third-party logo assets from active presentation once coverage is sufficient.
5. Do not merge icon files into `main` until the compliance and casino-audit branches are reconciled and Caleb asks for the ship.
6. Date Night and Nightlife icon systems stay separate; they already have their own palettes (magenta/lavender year-round, red/cyan Halloween, teal Nightlife).

## Caleb maker's mark / startup ident — APPROVED CHECKPOINT

This is Caleb's reusable personal brand identity across apps and other things he creates. It is separate from Dinner Roulette's restaurant-category icon system.

### Canonical creature

The mark is a glossy black detailed black-mamba/snake + scorpion hybrid: central snake head and serpentine scaled body, symmetrical armored scorpion-like arms/pincers, and a segmented tail ending in a large claw/pincer. The still composition is vertical and heraldic. Associated motto: **Patiens sed mordax** (“patient, but biting”). The pincers are part of the snake/scorpion hybrid identity, not lobster branding.

### Brand hierarchy

1. **Full detailed crest** — prominent branding and startup ident.
2. **Simplified maker's mark** — subtle persistent watermark/signature, typically in a screen corner.
3. **Tiny app/favicon icon** — reduced silhouette/glyph optimized for very small sizes.

The same maker's mark can connect otherwise visually different Caleb-built apps.

### Approved startup ident

**The previously proposed slither animation is no longer the target. Do not regenerate or substitute it.** After many generation attempts, Caleb selected a stronger, simpler animation in which the full crest remains recognizable and the upper pincers rapidly sweep/curl inward over the head in an aggressive closing/arming gesture.

The approved final prototype is the user-supplied clip from Sept. 10, 2026, conversation filename/reference `8808.mp4`. Caleb manually created the final timing by repeatedly speeding up and saving the successful Grok-generated motion. That manual speed edit is intentional and is part of the approved result.

Treat that clip as the **master startup-ident reference**. Preserve it. Do not ask a generative model to recreate it merely to change timing or make cosmetic edits; deterministic editing should be used where possible so the approved motion/anatomy is not lost.

### Intended Dinner Roulette startup behavior

- On app launch, play the approved maker's-mark animation **once**.
- Do not loop it.
- Do not require a tap to dismiss it.
- Keep it brief; it is a brand sting/boot signature, not a cinematic intro.
- Load/initialize Dinner Roulette behind the ident when technically practical so the branding does not create unnecessary startup delay.
- When the ident completes, transition immediately into the normal Dinner Roulette UI.
- If the app is ready before the ident finishes, allow the short ident to complete. If startup genuinely takes longer, hand off cleanly to the app's normal loading state rather than looping or artificially extending the ident.
- Keep the ident itself project-neutral so the same master animation can later identify other Caleb-built apps; project-specific branding/UI follows after it.

### Animation content lock

For the approved startup ident:

- Keep the recognizable full hybrid anatomy.
- Keep the fast inward pincer sweep/closing gesture.
- No tongue animation; extensive attempts were discarded and the approved tongue-free version looks cleaner.
- No slithering requirement.
- No added smoke, particles, explosions, spins, or unrelated spectacle.
- Do not add extra limbs or morph the pincers/anatomy.
- Do not slow it back into the earlier ceremonial multi-second pacing.
- Future variants should branch from this approved checkpoint rather than overwrite it.

### Asset handling status

The approved video currently exists as a conversation-uploaded/user-edited asset and is **not yet recorded here as a committed repository media path**. Before wiring the startup ident into Dinner Roulette, place the approved master asset into an appropriate project asset location and record the exact repo path/provenance here. Do not substitute one of the earlier failed prototypes.

**Current next action when implementing branding:** use the approved `8808.mp4` startup-ident master, add it to the app's assets, wire it to play once at startup, then transition directly to Dinner Roulette. Preserve `main`/merge discipline unless Caleb explicitly authorizes shipping.

## Future integration rule

For any new third-party integration: check the provider's current official terms/documentation first; prefer factual text attribution and provider-supported links; avoid copied logos/content, undocumented APIs/deep links, scraped data, and implied partnerships. Record important decisions in this continuity file and the legal audit before merging.

## Merge discipline

PR #28 remains the review surface for the legal/compliance pass. Issue #29 artwork is not a reason to merge that PR. Do not merge the compliance branch into the casino-audit branch or `main` unless Caleb explicitly requests it.
