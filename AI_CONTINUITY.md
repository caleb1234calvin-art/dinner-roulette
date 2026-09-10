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

## Caleb maker's mark / startup animation checkpoint

This is a separate personal brand identity that Caleb intends to reuse across apps and other things he creates. It is not a restaurant-category icon.

### Canonical creature

The reference artwork is a glossy black, detailed hybrid emblem: a black-mamba/snake head and long serpentine scaled body combined with symmetrical scorpion-like armored arms/pincers and a segmented tail ending in a large claw/pincer. The original still is vertically composed and heraldic. Associated motto: **Patiens sed mordax** (“patient, but biting”). Do not reinterpret the pincers as lobster branding; they are part of the snake/scorpion hybrid identity.

### Brand hierarchy

1. **Full detailed crest** — prominent brand presentation and app startup animation.
2. **Simplified maker's mark** — small persistent watermark/signature, typically in a screen corner.
3. **Tiny app/favicon icon** — heavily reduced silhouette/glyph that remains legible at very small sizes.

The recurring mark should connect otherwise visually different apps as Caleb's work.

### Current animation task for Grok

Create a very short app-startup signature using the **full detailed creature**. The immediate task is locomotion only. **Do not add the claw snap yet.** First make the slither correct; the snap will be layered in after locomotion is approved.

Desired action:

1. Creature enters rapidly from one side of the screen.
2. It reorients into the direction of travel and moves **head-first horizontally across the frame**.
3. The head leads the path. The neck follows it, then each successive body section follows approximately the curved path previously occupied by the segment ahead, producing believable serpentine locomotion.
4. Natural S-waves propagate down the body as a consequence of locomotion; do not merely wiggle an otherwise rigid emblem.
5. The scorpion arms/pincers travel with the torso and remain anatomically attached and stable.
6. The creature exits the opposite side quickly.
7. Transition immediately into the app UI.

Target total duration: roughly **0.8–1.5 seconds**. This is a boot signature, not a cinematic intro.

### What previous attempts got wrong

Two generated prototypes establish useful negative examples:

- One kept the original upright/vertical heraldic orientation and translated the whole creature sideways while the body wiggled. It technically crossed the screen and technically made S-curves, but visually looked like an upright logo gliding sideways. **Do not repeat this.**
- Another kept the creature facing upward, translated it vertically, then deformed/stretched the tail/body into a long tapered whip as it left frame. **Do not repeat this.**

Core rule: **body deformation is not directional locomotion.** The animal must visibly travel head-first along a path, with the body following the head's trajectory. Do not preserve the vertical crest pose while translating the entire image as a rigid object.

### Hard anatomy / motion constraints

- Preserve the recognizable snake/scorpion hybrid; do not redesign it during animation.
- Do not grow, delete, detach, duplicate, or transform limbs/pincers.
- Do not turn pincers into wings, legs, tentacles, or unrelated anatomy.
- Do not lengthen the neck/body merely to fake travel.
- Do not taper the tail/body into a disappearing whip.
- Do not separate the creature into pieces.
- Do not rotate the emblem as if it were a flat card; reorient the animal anatomically into its travel direction.
- Preserve the glossy black armored/scaled visual language.
- Prefer a static camera. The creature moves through the frame; avoid using a camera pan to fake locomotion.
- Avoid zooms, spins, smoke, particles, explosions, or other spectacle unless Caleb explicitly requests them.

### Later claw-snap phase

Only after Caleb approves the basic slither: add one quick, deliberate pincer/claw snap during the crossing, without substantially stopping the creature. The snap is punctuation, not the main event. Optional future audio could be a tiny dry click, but sound is not currently required.

### Iteration protocol

When Caleb supplies another generated attempt, preserve what he says worked and change the identified failure rather than reinventing the whole sequence. Add behaviors incrementally: **locomotion first → claw snap second → polish last**. Explicit negative constraints above are hard requirements.

**Current next action for Grok: generate/refine only the fast, believable, head-first horizontal slither while preserving the creature's anatomy.**

## Future integration rule

For any new third-party integration: check the provider's current official terms/documentation first; prefer factual text attribution and provider-supported links; avoid copied logos/content, undocumented APIs/deep links, scraped data, and implied partnerships. Record important decisions in this continuity file and the legal audit before merging.

## Merge discipline

PR #28 remains the review surface for the legal/compliance pass. Issue #29 artwork is not a reason to merge that PR. Do not merge the compliance branch into the casino-audit branch or `main` unless Caleb explicitly requests it.
