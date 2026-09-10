# Dinner Roulette — AI Continuity

Updated: 2026-09-10

## Repository / authority

- Repository: `caleb1234calvin-art/dinner-roulette`
- Active working branch: `audit/national-casino-pass-1`
- `main` is to remain untouched unless Caleb explicitly requests otherwise.
- ChatGPT is the only AI authorized to directly modify the GitHub repository.
- Grok / SuperGrok may build, generate, animate, or move artifacts into the workflow, but it should not directly modify the repository unless Caleb explicitly changes that rule.
- Dinner Roulette and the Jasper County audit remain connected projects; shared data, tooling, infrastructure, and discoveries may feed between them.

## Brand identity system

Caleb is developing a recurring personal maker's mark / brand emblem to identify apps, tools, documents, and other projects he creates.

### Primary emblem

The emblem is a black, highly detailed hybrid creature combining:

- a black mamba / snake as the central head and serpentine body,
- symmetrical scorpion-like arms and pincers near the upper body,
- an armored segmented tail ending in a large claw / stinger-like pincer,
- glossy black, scale-like, almost biomechanical armor detailing,
- a vertically oriented heraldic silhouette.

The associated motto is **“Patiens sed mordax”** — “patient, but biting.”

### Brand asset hierarchy

Use three coordinated variants of the same creature identity:

1. **Full detailed crest** — the high-detail emblem used for launch / splash moments, profile art, covers, prominent branding, and ceremonial presentation.
2. **Simplified maker's mark** — a reduced-detail version for subtle placement in a bottom corner of app screens as a watermark / signature.
3. **Tiny icon / favicon / app icon** — an even more reduced silhouette or glyph optimized for recognition at very small sizes.

The goal is that unrelated apps can have different themes while still being visibly part of the same family through this recurring mark.

## Startup animation concept

The full detailed creature is intended to have a very short animated startup signature before the app becomes usable.

### Desired motion

The creature should **actually slither across the screen as a locomoting animal**, not remain upright while simply translating sideways or upward.

Target sequence:

1. Creature enters rapidly from one side of the frame.
2. The head establishes a mostly horizontal direction of travel.
3. The body follows in a natural serpentine S-curve.
4. Each trailing section should follow approximately the path occupied by the section ahead of it, creating believable snake-like locomotion.
5. The scorpion arms / pincers remain attached and anatomically stable while traveling with the body; they must not become detached, stretch independently, or turn into extra limbs.
6. Near the middle or latter part of the crossing, one visible claw / pincer gives a single quick, deliberate snap.
7. The creature immediately continues its motion and exits the opposite side of the frame.
8. Transition directly into the app UI.

### Timing

- Target total duration: roughly **0.8–1.5 seconds**.
- Fast, clean, and repeatable; it should feel like a boot signature rather than a cinematic intro.
- Do not make the user wait several seconds on every launch.

### Critical locomotion rule

**Body deformation is not sufficient. Directional locomotion must be visible.**

Previous generated attempts failed because the model animated S-curves in the body while moving the whole emblem as a rigid vertical object. One attempt looked like the upright logo was sliding sideways; another moved upward and stretched/tapered out of frame. These are specifically NOT the desired result.

Think of the motion as a real snake moving head-first across the scene: the head leads, the neck follows, then successive body sections propagate along the same curved path. The overall creature should reorient into its travel direction rather than preserving the original vertical heraldic pose during transit.

### Anatomy preservation

Maintain the recognizable identity of the original emblem throughout the animation:

- Do not redesign the creature.
- Do not grow or remove limbs.
- Do not morph the scorpion claws into wings, legs, or tentacles.
- Do not lengthen the neck/body unnaturally to simulate motion.
- Do not stretch the tail into a disappearing taper.
- Do not separate the creature into pieces.
- Do not rotate the entire emblem like a flat card.
- Preserve glossy black armored/scaled visual language.
- Preserve the distinctive hybrid silhouette as much as the motion allows.

### Composition / camera

- Prefer a static camera.
- The creature itself crosses the frame.
- Avoid camera pans that merely create the illusion of movement.
- Keep the entire locomotion easy to read at app-launch size.
- Avoid excessive zooms, spins, dramatic perspective changes, smoke, particles, explosions, or environmental effects unless Caleb later requests them.

### Claw snap

Add this only after the basic locomotion is working correctly.

- One quick snap only.
- It should read clearly without stopping the creature for long.
- The snap is punctuation, not the main action.
- A tiny dry click could eventually be used as an optional audio signature, but sound is not required unless requested.

## Iteration protocol for Grok

When Caleb provides a generated animation attempt:

1. Preserve any motion or anatomy that he says is working.
2. Change only the identified failure when possible.
3. Do not add several new behaviors at once.
4. Prioritize locomotion first, then claw snap, then polish.
5. Treat explicit negative constraints above as hard requirements.
6. If an output technically satisfies words in the prompt but visually fails the intent, favor the visual intent described in this continuity.

Current priority: **produce a convincing fast head-first horizontal slither across the screen while preserving the emblem's hybrid anatomy. Do not add the claw snap until that movement works.**
