# Dinner Roulette — AI Continuity

_Last updated: September 11, 2026_

## Project state

- Active app: Dinner Roulette V.3.
- Repository: `caleb1234calvin-art/dinner-roulette`.
- Current compliance work: `legal/third-party-compliance-pass-1`; PR #28 is the review surface and is based on `audit/national-casino-pass-1`.
- Restaurant icon replacement is tracked as Issue #29.
- Startup-ident implementation branch: `brand/startup-ident-pass-1`.
- Startup-ident preview PR #30 is DRAFT ONLY. Do not merge unless Caleb explicitly requests it.
- `main` remains untouched unless Caleb explicitly requests a merge or direct change.
- ChatGPT is the only AI authorized to directly modify this repository unless Caleb explicitly asks another assistant to update a named file. Grok/SuperGrok may generate artwork/video and perform creative work from handoff briefs, but it is not a repository operator.
- Dinner Roulette and the Jasper County audit are interconnected projects; audit data, methods, infrastructure, and discoveries may feed Dinner Roulette.

## National casino audit continuity

At the start of the legal/compliance pass, the curated casino/nightlife backbone contained 22 completed jurisdictions and 232 explicit curated casino records. Preserve the audit branch/history while compliance work is reviewed separately.

## Legal/compliance pass

Goal: reduce avoidable legal/brand risk while preserving Dinner Roulette's product structure. Do not describe the app as guaranteed legally compliant; legal conclusions remain attorney territory.

- Present Dinner Roulette as an independent discovery/decision tool.
- Third-party names identify destinations/services only; do not imply affiliation, sponsorship, endorsement, or partnership.
- Changing restaurant/venue information such as hours, prices, ratings, admission, and availability should be treated as information to verify rather than guaranteed facts.
- Nightlife/casino functionality is discovery/trip planning only; Dinner Roulette does not accept wagers, provide gambling, sell alcohol, or guarantee admission.
- Location, preferences, favorites, exclusions, and history disclosures must match actual behavior.
- Central `LEGAL.md` exists and legal/privacy/third-party information is surfaced in Settings.

### Rideshare

- Neutral Dinner Roulette visual treatment; do not copy Uber/Lyft logos or trade dress.
- Keep `Drive sober` framing.
- Uber destination-aware launch may pass the selected destination; Dinner Roulette does not request, price, book, or guarantee the ride.
- Lyft uses the conservative public launch rather than undocumented destination parameters.
- Make clear that services are independent third parties and availability/pricing vary.

### Delivery

- DoorDash, Grubhub, and Uber Eats shortcuts are shallow launch links.
- User searches for the selected restaurant after opening the independent service.
- Do not claim marketplace availability without an authorized/current integration.
- Do not scrape/copy marketplace menus, prices, fees, availability, ratings, photos, or other service content.
- Keep references text-only/neutral unless current brand rules/permission support branded assets.

## Restaurant icon replacement — Issue #29

Replace third-party restaurant logos/brand artwork with a Dinner Roulette-owned generic icon system while keeping factual restaurant names intact.

Locked visual language: dark glossy rounded-square tile; stylized toy/clay 3D object; no photoreal food photography, text, logos, mascots, packaging, or brand marks. Dinner-tab rim combines teal/cyan with burnt orange/terracotta so one pack works across light/dark Dinner themes. Date Night and Nightlife icon systems remain separate.

Generated/kept categories: burger, pizza, Mexican taco, Chinese dumpling steamer, sushi, Italian pasta, steakhouse, BBQ ribs, chicken drumstick, cafe coffee/croissant, dessert cake, seafood fish/shrimp, buffet cloche, diner pancakes, and neutral plate/fork/knife fallback. Assets are not in `main` and are not wired into the app yet.

Suggested eventual location: `public/dinner-icons/`. Reuse the existing restaurant visual/photo-key mapping architecture and map each restaurant to a generic cuisine icon or fallback. Do not imitate restaurant trademarks. Do not merge icon work merely because the artwork exists.

# CAUSTIC RELAY — ACTIVE MAKER/PUBLISHER BRAND CHECKPOINT

## Brand decision — September 11, 2026

The current working parent/maker/publisher identity is **Caustic Relay**.

Brand evolution during clearance/creative exploration:

`Venom Systems` → `Corrosive Systems` → **`Caustic Relay`**

Venom Systems was abandoned as the preferred working name after preliminary trademark screening found material software/SaaS overlap around existing VENOM marks, including software-related uses and a snake-shaped-V stylized mark. `V3NOM SYST3MS` was considered only as a visual dodge and rejected as strategically weak; leetspeak does not reliably eliminate likelihood-of-confusion concerns.

Corrosive Systems screened materially cleaner, but `Corrosive Studios LLC` and historical Corrosive Software uses created a remaining yellow flag. The name also felt more literal and less distinctive than the direction Caleb ultimately preferred.

Caleb then compared names including Mordant Systems and Caustic Relay and chose **Caustic Relay as the working brand for now**. Preliminary searching did not surface an obvious exact active U.S. software/company collision for `CAUSTIC RELAY`, but `RELAY` is crowded in technology/software/communications. Therefore this is a **working brand decision, not a formal legal clearance opinion**. Before meaningful commercial investment or a federal trademark filing, the remaining likelihood-of-confusion question should receive a proper clearance review, ideally by a U.S.-licensed trademark attorney.

Current intended use is primarily a reusable maker/publisher identity across Caleb-built apps and projects, not a representation that Caleb offers professional software-development services to clients. The project is currently noncommercial; lack of monetization reduces some practical exposure but does not by itself eliminate trademark/confusion risk.

## Brand meaning

The two words intentionally support the visual identity:

- **Caustic** = harsh, eating away, degradation/corrosion without needing literal acid imagery.
- **Relay** = transmission, signal, handoff, continuity.

The startup ident should therefore behave as a tiny causal story rather than a generic glitch animation:

**stable relay → pincer pinch → transmission rupture → signal loss → damaged relay returns → caustic degradation spreads → rendering fidelity collapses**.

The pinch is the causal trigger. The signal should not randomly fail before it.

## Canonical creature — HARD VISUAL LOCK

The canonical mark remains the existing glossy black detailed black-mamba/snake + scorpion hybrid: central snake head and serpentine scaled body, symmetrical armored scorpion-like upper arms/pincers, and segmented lower tail ending in a claw/pincer. Composition is vertical/heraldic. Pincers are scorpion-like, not lobster branding.

**Do not modify, redraw, regenerate, reinterpret, morph, replace, restyle, or otherwise alter the creature when making branding variants unless Caleb explicitly requests a redesign.** Treat approved creature footage/images as source assets. Background, signal treatment, and typography may be edited around it.

The earlier motto `Patiens sed mordax` is **not part of the visible logo/ident**. Do not add it unless Caleb explicitly reverses that decision.

### Brand hierarchy

1. Full detailed crest — prominent branding/startup ident.
2. Simplified maker's mark — subtle persistent watermark/signature.
3. Tiny app/favicon glyph — reduced silhouette for very small sizes.
4. **CAUSTIC RELAY** wordmark/subtitle — subordinate to the creature in the startup ident.

The same maker's mark and Caustic Relay identity may connect otherwise visually different Caleb-built apps.

## Approved motion master

The old slither concept is retired. The approved motion keeps the full crest recognizable while the upper pincers rapidly sweep/curl inward over the head in an aggressive closing/arming gesture.

The approved clean prototype is conversation source `8808.mp4`, manually sped up by Caleb after Grok produced the successful anatomy/motion. That manual timing is intentional.

Repository clean master on `brand/startup-ident-pass-1`:

`public/brand/grok_video_2026-09-10-20-20-31_1.mp4`

Recorded blob SHA: `75e75b8559fed6871872667eb8e6463f2704e2d9`; H.264/yuv420p, 768×1168, 1.5 seconds, 2,101,557 bytes.

Treat this as provenance/source material. Do not destructively overwrite it when a new branded ident is approved.

## Static/corrosion source progression

- `8817.mp4`: deliberate TV-static treatment; static is intentional, not an export error.
- `8840.mp4`: brighter static source, 1.5 sec, 24 fps, 36 frames, 768×1168. Caleb prefers using this brighter source first when solving the difficult generative corrosion/transmission behavior, then applying controlled darkening afterward.
- `8841.mp4`: later worked-on version; preserve as part of the iteration history, but the current strategy favors solving behavior first and accessibility/brightness second.

Do not resurrect the earlier 1-in-100 “shiny Pokémon” random startup idea unless Caleb explicitly asks; the concern was that a rare corruption startup could be mistaken for an app malfunction.

## Caustic Relay startup-ident narrative

Approximate 1.5-second structure:

- `0.00–0.45`: stable/healthy relay; polished creature; relatively clean/readable CAUSTIC RELAY.
- `~0.45–0.60`: existing pincer pinch; first major signal rupture must synchronize within only a few frames of the pinch.
- `~0.60–0.75`: very brief transmission loss/dropout.
- `~0.75–1.50`: signal returns permanently damaged; typography/static/rendering fidelity progressively worsen.

The corruption is directional: after the pinch, every major beat should generally be as damaged or more damaged than the previous beat. Do not repeatedly return to pristine health.

Typography may show controlled missing fragments, horizontal displacement, localized flicker/dropout, or one/two mirrored/reversed visual fragments while preserving the lexical spelling **CAUSTIC RELAY** and overall readability.

Near the end, the polished creature may lose **rendering fidelity** toward the underlying drawing/linework. This is not anatomical morphing. Conceptually, the relay can no longer maintain the high-fidelity rendering of the same creature.

Avoid literal acid, green slime, dripping goo, skulls, radioactive symbols, explosions, smoke, generic hacker imagery, extra limbs, tongues, slithering, spins, or anatomical mutation. The signal itself is being eaten away.

## Photosensitivity / brightness finishing rule

Do **not** force the hard generative corrosion pass to solve final brightness at the same time. Caleb's current preferred workflow is:

1. Use the brighter source to solve the difficult behavior/transformation.
2. Approve motion/effect structure.
3. Apply a separate controlled darkening/accessibility pass afterward.

Final treatment should favor a soft black overlay/dark aura/vignette, strongest where static becomes excessively bright (especially bottom/edges), while keeping the static visibly alive underneath.

Avoid new full-screen white flashes, repeated black/white inversion, rapid large-area strobing, or repeated high-intensity brightness jumps. Prefer localized horizontal tears, tracking errors, dark interruptions, partial dropouts, fragmentation, and signal displacement.

# Grok image-generation instruction protocol — LOCKED WORKFLOW

This section defines how ChatGPT should prepare future Grok image-generation/editing instructions.

## Core rule: approved outputs become assets

Treat approved images, emblems, frames, textures, and visual states as **assets, not prompts**. Once Caleb approves a visual result, future instructions should reference/use that source and edit around it rather than asking Grok to recreate it merely because another property needs changing.

For the creature specifically, preservation should be expressed positively and hierarchically:

> The creature is an immutable source asset. Preserve its silhouette, anatomy, proportions, position, and approved appearance from the supplied source.

Then one compact exclusion is enough:

> No regeneration, redesign, or anatomical alteration of the creature.

Do not rely on giant repeated `DO NOT` sections as the main preservation mechanism.

## Pass-specific instruction hierarchy

Each actual Grok generation/edit request should normally be concise and structured as:

1. **Immutable assets** — what must remain unchanged.
2. **Editable assets/regions** — what Grok is allowed to alter.
3. **Required change this pass** — preferably one primary visual task.
4. **Success condition** — what must be true in the output.
5. **Compact exclusions** — only the most important failure modes.

The long continuity document can function as a project bible for Grok Ask, but the actual generation step should receive a short, pass-specific task that survives planner compression.

## One mutation opportunity at a time

Do not routinely ask Grok to solve typography, anatomy preservation, composition, background, lighting, corrosion, signal effects, final grading, and timing in one generation.

Default production order:

1. Clean name/wordmark replacement only.
2. Typography damage/corruption only.
3. Background/signal treatment only.
4. Rendering-fidelity degradation/style transition only.
5. Video/motion work using approved visual states.
6. Deterministic finishing for timing, brightness, vignette, accessibility, or other non-generative edits.

If a pass is correct, preserve it. Do not regenerate successful anatomy/motion just to change speed or brightness.

## Multi-reference strategy

When Grok supports multiple image references, assign each an explicit authority role instead of expecting the model to infer which properties matter. Example:

- Reference 1 = anatomy/composition authority.
- Reference 2 = original drawing/linework authority.
- Reference 3 = background/static texture authority.
- Reference 4 = typography/damage reference.
- Reference 5 = tonal/brightness target.

State which properties may transfer from each reference and which must not.

For polished-to-drawing degradation, prefer supplying both the approved polished creature and the actual original drawing. Preserve anatomy/composition from the polished source while borrowing only rendering/linework qualities from the drawing. The effect is loss of rendering fidelity, not biological transformation.

## Typography protocol

When exact text matters, provide exact spelling and separate lexical identity from visual treatment:

> Text reads exactly `CAUSTIC RELAY`. Preserve the spelling. Distort the visual presentation, not the lexical identity.

Prefer concrete operations on a few characters/regions rather than “make some letters weird.” Examples: a specific horizontal slice, partial missing stroke, temporary mirrored fragment, localized displacement, or controlled dropout. Keep the wordmark recognizable.

## Still states before complex video

For difficult animated identities, design/approve important visual states as stills before asking the video workflow to invent both design and motion simultaneously where practical:

- State A = clean/stable frame.
- State B = trigger/failure frame.
- State C = damaged-return frame.
- State D = final degraded frame.

Then use Grok's video workflow to focus primarily on transition, timing, and temporal continuity between approved states rather than re-authoring the brand design from scratch.

## Grok role distinction

Do not conflate the Grok paths:

- **Grok Imagine** = image generation/editing path.
- **Grok Ask** = conversational/planning path used for the video workflow and handoff coordination.
- Grok remains outside repository authority unless Caleb explicitly directs otherwise.

## Final production principle

Default to:

**generative design → generative motion → deterministic finishing**

The purpose is to minimize model drift, preserve successful assets, and avoid giving Grok unnecessary opportunities to reinterpret anatomy/composition while solving unrelated visual problems.

# Dinner Roulette startup implementation

Startup implementation remains isolated on `brand/startup-ident-pass-1`.

- Component: `src/components/startup-ident.tsx`.
- Root integration: `src/routes/__root.tsx`.
- Current implementation plays the committed clean master once at full-page startup, muted/inline, with no controls and no loop, while the app initializes behind it.
- Draft PR #30 (`Preview startup ident`) is a preview/review surface only and must not be merged without explicit authorization.
- Vercel preview deployment previously succeeded.

Once Caleb approves a final **Caustic Relay** static/corroded wordmark video, add it as a new asset rather than destructively overwriting the clean source master, then update the startup component to point to the approved branded asset. Preserve the clean source as provenance/reference.

# PR / public brand infrastructure

Caleb intends the parent identity to have dedicated public-facing accounts (email/social/support) separate from his personal identity. A dedicated Grok PR assistant was originally created under the temporary Venom Systems name; once the brand infrastructure is updated, it should be renamed/re-briefed for **Caustic Relay**.

Intended support flow:

public message/feedback → PR assistant triage/summary/draft → Caleb approval/decision → actionable bug/feature may become GitHub issue → fix → response.

PR assistant should classify bugs, feature suggestions, general feedback, questions, and complaints; summarize accurately; draft responses; never fabricate facts; and never promise fixes/features without Caleb approval.

Desired voice: technically capable, independent, experimental, direct, slightly unconventional, approachable without sounding corporate, confident without pretending to be a giant company; humor is welcome when appropriate.

# Future integration rule

For any new third-party integration, check current official terms/documentation first; prefer factual text attribution and provider-supported links; avoid copied logos/content, undocumented APIs/deep links, scraped data, and implied partnerships. Record important decisions in continuity/legal audit before merging.

# Merge discipline

PR #28 remains the legal/compliance review surface. Issue #29 artwork is not a reason to merge. PR #30 remains a draft startup-ident preview. Do not merge the compliance branch, startup-ident branch, casino-audit branch, or `main` into one another unless Caleb explicitly requests it.
