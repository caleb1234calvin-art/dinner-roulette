# Dinner Roulette — AI Continuity

_Last updated: September 11, 2026_

## Project state

- Active app: Dinner Roulette V.3.
- Repository: `caleb1234calvin-art/dinner-roulette`.
- Current compliance work: `legal/third-party-compliance-pass-1`.
- Compliance PR: #28, based on `audit/national-casino-pass-1`.
- Restaurant icon generation: Issue #29.
- Startup-ident implementation branch: `brand/startup-ident-pass-1`.
- Startup-ident preview PR: #30, DRAFT ONLY. Do not merge unless Caleb explicitly requests it.
- `main` remains untouched unless Caleb explicitly requests a merge or direct change.
- ChatGPT is the only AI authorized to directly modify this repository unless Caleb explicitly asks another assistant to update a named file. Grok/SuperGrok may generate artwork/video from handoff briefs, but Grok Imagine does not have repository access and must not be treated as a repo operator.
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

## Venom Systems maker's mark / startup ident — ACTIVE BRAND CHECKPOINT

This is Caleb's reusable personal brand identity across apps and other things he creates. The umbrella brand name is now **Venom Systems**. It is separate from Dinner Roulette's own product identity and restaurant-category icon system.

### Canonical creature — HARD VISUAL LOCK

The mark is the existing glossy black detailed black-mamba/snake + scorpion hybrid: central snake head and serpentine scaled body, symmetrical armored scorpion-like arms/pincers, and segmented lower tail ending in a claw/pincer. The still composition is vertical and heraldic. The pincers are part of the snake/scorpion hybrid identity, not lobster branding.

**Do not modify, redraw, regenerate, reinterpret, morph, replace, restyle, or otherwise alter the snake/scorpion creature when making branding variants.** Any model receiving the existing animation as input must treat the creature and its existing motion as locked source material. Background and typography may be edited around it; the creature itself must remain untouched.

The earlier motto `Patiens sed mordax` is **not part of the visible Venom Systems logo/ident**. Do not add it to the startup video or wordmark unless Caleb later explicitly reverses that decision.

### Brand hierarchy

1. **Full detailed crest** — prominent branding and startup ident.
2. **Simplified maker's mark** — subtle persistent watermark/signature, typically in a screen corner.
3. **Tiny app/favicon icon** — reduced silhouette/glyph optimized for very small sizes.
4. **VENOM SYSTEMS wordmark/subtitle** — intended to accompany the startup ident while remaining visually subordinate to the creature.

The same maker's mark and Venom Systems identity can connect otherwise visually different Caleb-built apps.

### Approved motion master

The previously proposed slither animation is retired. The approved motion is the fast version in which the full crest remains recognizable and the upper pincers rapidly sweep/curl inward over the head in an aggressive closing/arming gesture.

The approved clean prototype is the user-supplied clip from Sept. 10, 2026, conversation filename/reference `8808.mp4`. Caleb manually created the final 1.5-second timing by repeatedly speeding up and saving the successful Grok-generated motion. That manual speed edit is intentional.

The approved clean master is committed on `brand/startup-ident-pass-1` at:
`public/brand/grok_video_2026-09-10-20-20-31_1.mp4`

Recorded blob SHA: `75e75b8559fed6871872667eb8e6463f2704e2d9`. It was verified against the conversation master by exact byte size (2,101,557 bytes). Format: H.264/yuv420p, 768×1168, 1.5 seconds.

Treat the creature/motion in that clip as source-locked. Do not ask a generative model to recreate it merely for cosmetic edits.

### Static variant / current creative direction

On Sept. 11, Caleb supplied `8817.mp4`, a deliberate TV-static treatment of the startup ident. The noisy broadcast/static background is intentional, not an export error. Caleb is currently leaning toward using the static aesthetic as the normal Venom Systems startup treatment rather than making it a rare 1-in-100 startup variant, because a rare corruption-style startup could be mistaken for an app problem.

This decision is not yet a repository asset replacement. Preserve the clean master while the branded static version is being developed.

### Venom Systems typography direction

Current concept: add **VENOM SYSTEMS** in all caps near the bottom of the startup ident as a subordinate subtitle/wordmark. Desired behavior is a restrained signal/glitch treatment: brief horizontal tearing, flicker, displacement, or lock-in behavior is acceptable. Avoid a constant unreadable glitch or a generic overdone cyberpunk effect. The title should resolve clearly enough to read.

Font is not yet locked. Current useful directions include industrial/geometric/condensed sans styles; Oxanium SemiBold and DIN Condensed Bold were discussed as starting references. Do not treat either as final until Caleb approves a rendered result.

### Animation content lock

- Keep the recognizable full hybrid anatomy exactly as supplied.
- Keep the existing fast inward pincer sweep/closing gesture.
- No tongue animation.
- No slithering requirement.
- No smoke, particles, explosions, spins, extra spectacle, extra limbs, or anatomy morphing.
- Do not slow the approved motion.
- Do not change the snake/scorpion to accommodate typography or static. Move/size the text around the existing creature instead.
- Background/static and wordmark effects may evolve independently around the locked creature.

### Dinner Roulette startup implementation

The startup implementation is isolated on `brand/startup-ident-pass-1`. Component: `src/components/startup-ident.tsx`. Root integration: `src/routes/__root.tsx`.

Current implementation plays the committed clean master once at full-page startup, muted/inline, with no controls and no loop, while the app can initialize behind it. Draft PR #30 (`Preview startup ident`) exists only as a preview/review surface and must not be merged without explicit authorization. Vercel preview deployment has succeeded for the branch.

Once Caleb approves the final Venom Systems static + wordmark video, add it as a new asset rather than destructively overwriting the clean source master, then update the startup component to point to the approved branded asset. Keep the clean source as provenance/reference.

## Future integration rule

For any new third-party integration: check the provider's current official terms/documentation first; prefer factual text attribution and provider-supported links; avoid copied logos/content, undocumented APIs/deep links, scraped data, and implied partnerships. Record important decisions in this continuity file and the legal audit before merging.

## Merge discipline

PR #28 remains the review surface for the legal/compliance pass. Issue #29 artwork is not a reason to merge that PR. PR #30 remains a draft startup-ident preview surface. Do not merge the compliance branch, startup-ident branch, or casino-audit branch into one another or into `main` unless Caleb explicitly requests it.
