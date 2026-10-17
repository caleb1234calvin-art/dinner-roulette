# Pick For Me — Brand & Personality Continuity Master

Updated: September 14, 2026

Purpose: durable continuity for naming, visual identity, artwork, Mordax, app personality and audience-facing marketing voice.

## Naming state
The broader product direction/name is **Pick For Me**, reflecting expansion beyond dinner into Nightlife, Date Night, casinos and seasonal/discovery features.

Public-facing material should continue using **Dinner Roulette** until the app itself is deliberately rebranded. The user explicitly wants to avoid audience confusion caused by marketing changing names before the product does.

## Mordax — current mythology
Mordax is no longer only a mascot/logo concept. He is becoming the connective narrative figure for the entire app/brand ecosystem.

Core philosophy:
- Mordax appears where meaningful choice exists.
- He represents chaos, choice, restraint, and consequence in full combination.
- The hidden-story framing should reinforce that the user reaches Mordax through deliberate choices.
- A key narrative idea is: the user did not merely discover Mordax; by making the required sequence of choices, they **created the conditions for Mordax to appear**.
- Conceptually: “You are here because you chose to be.” / “You did not discover me. You assembled the conditions in which I could appear.”

The startup ident still uses Mordax as a brief brand animation, but the mythology can extend far beyond ordinary feature UI.

## Mordax manifestation model
Mordax's degree of existence scales with chosen attention and commitment.

Progression:
- **Passive user:** Mordax appears briefly in the startup ident, roughly 1.5 seconds.
- **Curious user:** Mordax persists longer because the user deliberately looks for him.
- **Committed participant:** Mordax occupies a dedicated hidden chamber/page with creed, philosophy, lore, and acknowledgement.
- **Physical commitment:** the user can acquire a physical manifestation through merchandise.

Core rule:
**The more you choose Mordax, the more he exists.**

Narratively, this behaves like a technological ritual or summoning structure without requiring literal supernatural claims:
**attention → repeated choice → prescribed sequence → threshold → manifestation**

The ritual itself is built from UX and agency rather than occult props. Choice is the summoning mechanism.

## Physical manifestation / merch canon
Physical merchandise changes Mordax's canonical containment state.

Before physical merch exists, `contained` can serve as the normal status because Mordax exists only inside software/fiction.

The first merch release can be announced as:
`Mordax has breached containment.`

Once physical Mordax objects exist in the real world, the default state should shift toward:
`Mordax has been accounted for this update.`

Reason: Mordax is no longer fully containable if physical instances are circulating outside the software.

Possible real-event status mappings:
- `Mordax has breached containment.` — first physical merch release
- `Mordax has been sighted elsewhere.` — hidden page moved or new app/site manifestation
- `Mordax is not currently accounted for.` — secret route changed / temporary unknown state
- `Additional instances have been identified.` — new merch batch or new physical manifestations
- `Mordax activity has increased.` — lore expansion / increased manifestations
- `Containment is no longer considered viable.` — major public expansion
- `Mordax has appeared in an unauthorized location.` — surprise Easter egg or unexpected brand placement
- `Mordax has been accounted for. No further action required.` — stable post-merch default

Long-term rule:
**If Mordax's status changes, something changed somewhere in the ecosystem.**

## Hidden-game / secret-layer concept
The brand may contain a completely optional hidden game/ARG-like layer inside otherwise normal, useful apps.

Design principles:
- Every app remains fully usable for its intended utility without engaging with the hidden game.
- The hidden layer is entirely contained within normal app interactions; no invasive permissions, real-world stalking, unsafe behavior or forced external participation.
- Users intentionally reach the hidden content through specific sequences of buttons/pages/choices.
- Different apps may contain **different sequences / different locks leading to the same Mordax destination**.
- This allows every app to stand alone while still participating in the same hidden narrative.
- The intended experience should be more satisfying than simply reading source code, even though technically source inspection could reveal implementation details.

Possible destination content:
- Mordax image or video
- full Mordax creed / philosophy
- congratulations / acknowledgement page
- about-the-developer section
- optional finder registry / guestbook
- moderation-first publishing for any public signatures or names
- optional subtle app-specific identifier or artifact so dedicated players can compare discoveries across apps

## Deferred Mordax minigame concept
A later hidden-game stage may contain a very small 2D minigame. This is explicitly **deferred**, not current implementation work.

Intended aesthetic:
- rough, primitive 2D presentation inspired by the emotional language of early retro-horror minigames rather than copying any specific game's assets/layout
- liminal/backrooms atmosphere
- visually disturbing but alluring
- sparse, empty, slightly wrong spaces
- should feel like the player reached a part of the app they were not supposed to see, but the system is not ejecting them
- tone is **tolerated trespass**, not overt hostility
- minimal explanation, no conventional celebratory game framing

Possible mechanics:
- one very small maze or Galaga-like interaction
- roughly 20–45 seconds when played successfully
- one mechanic only; forgiving difficulty and immediate restart
- completion advances the hidden progression rather than awarding score/loot
- a maze is philosophically attractive because each fork literalizes choice
- a simple arcade interaction is attractive because its abrupt presence inside a polished utility app creates an intentional “what is this?” rupture

### Mordax sprite
Possible sprite treatment:
- approximately 4–6 frames
- one normal Mordax pose, one inverted/mirrored pose, with transitional stages between them
- deliberately simple frame animation creates a slithering motion
- movement can be slightly stiff/unnatural rather than perfectly smooth
- sprite frames could later be reused for hidden transitions, error pages, background sightings or other manifestations

### Proposed technical architecture
The minigame does not require treating Dinner Roulette as a conventional game project.

Current conceptual model:
- add a hidden app navigation/render state analogous to another tab, but expose **no normal tab button**
- the secret input/page sequence unlocks or routes into this hidden state
- once inside, progression state determines what that hidden surface renders
- example progression: hidden entry → liminal page → minigame → next page → Mordax chamber/creed → finder page
- the minigame is therefore one stage rendered inside a contained hidden surface rather than a separate application
- normal Dinner/Nightlife/Date Night functionality remains independent and unaffected

Possible persistence policy can be chosen later: session-only reset, remembered discovery, remembered stage progression, or an easier return path after the user has already found Mordax once.

The user initially found the idea of adding a game intimidating, then quickly reframed it as an existing navigation/state problem plus a few new game-specific mechanisms. This is a future challenge the user expects to be technically feasible with current resources, but it should not displace nearer-term work.

## Puzzle structure and failure states
The hidden layer can support multiple outcomes instead of simple success/failure:
- full correct sequence → Mordax chamber / creed
- near miss → alternate page
- comedic failure → Rickroll-style fakeout or “YOU LOST THE GAME” reference
- cryptic failure → short message such as “Not yet.” or “Wrong door.”
- some failure pages may deliberately redirect users to another owned app or website as part of the puzzle ecosystem

Cross-app redirects should feel like puzzle consequences rather than deceptive advertising. Normal app navigation must remain predictable for users who are not intentionally engaging with the hidden layer.

## Distributed brand-story architecture
The long-term concept is a **fictional universe delivered through real utility software**.

Layers:
1. Surface layer — useful standalone apps
2. Brand layer — shared visual identity/personality
3. Hidden layer — Mordax puzzles, lore, secret pages, alternate states
4. Meta layer — users realize the apps themselves are part of the storytelling medium

Each app can expose the same Mordax story through a different sequence rather than forcing users to install every app to understand the narrative. Dedicated players can still compare paths, app-specific clues, failure states and subtle differences.

This gives the brand a second audience beyond normal utility users: puzzle/ARG/lore communities, while also creating cross-promotion among the apps without making the utility layer dependent on the game.

## Recurring Mordax patch-note/status device
A recurring patch-note line can imply Mordax is a tangible contained subject somewhere behind the public-facing software.

Canonical progression concept:
1. `Mordax has been contained in this update.`
2. `Mordax has been contained in this update.`
3. `Mordax has been contained in this update.`
4. `Mordax is under maintenance, no further action required.`
5. `Mordax has been accounted for this update.`
6. `Mordax has been accounted for this update.`
7. `Unable to locate Mordax at this time.`
8. `Mordax has been contained this update, containment procedures have been revised.`

Narrative implication:
- “contained” establishes routine control
- “under maintenance” implies Mordax is tangible/experimental and can be worked on
- “accounted for” is intentionally weaker than “contained”
- “unable to locate” implies an escape or loss of control without explicitly saying so
- “containment procedures have been revised” implies recapture and a prior containment failure

Important tone rule: keep these lines bureaucratically calm and visually ordinary. Do not use obvious horror styling, warning colors or explicit exposition. The audience should infer the incident themselves.

After a major anomalous line, return to mundane normal wording for several updates so future deviations regain significance.

## Marketing personality
Current audience-facing direction: competent/polished product paired with an intentionally questionable, dark, deadpan social voice.

Desired audience reaction: it should be slightly ambiguous whether the person running the account has a horrible personality or simply a very funny dark sense of humor. The broader target is a persona that can read as either absolutely mad or immensely clever, with an eerie/uncomfortable undertone.

Voice principles:
- deadpan
- dark/absurd humor
- mildly confrontational in an obviously comedic way
- occasionally unsettling precision
- self-aware indie-builder energy
- product remains trustworthy even when marketing sounds unhinged
- avoid genuine cruelty toward users or statements that make privacy/safety feel questionable
- contrast polished app presentation with irreverent copy
- do not explain every joke or lore implication

Recent accepted example direction:
`Nobody asked for it and I dont care!`
followed by legitimate patch notes and:
`Try it you'll like it.`

Additional tone example:
`I built this to keep myself busy and out of jail, come check it out!!`

This is preferable to generic corporate language such as “We’re excited to announce...”

## Current audience-facing update themes
Recent major-update marketing focuses simply on:
- casinos
- live nearby discovery
- international location support
- up-to-50-mile search
- new Dinner & Nightlife icons
- smarter fallback behavior

## Rebrand transition principle
When the in-app rename is ready, coordinate product and marketing together. A suitable transition concept is:
`We changed the name. You'll survive.`
`Dinner Roulette is now Pick For Me.`
`Turns out we do more than dinner now.`

## Historical provenance and cleanup
- `brand/startup-ident-pass-1` @ `21eaaac0f6cd58eda965422e1f626a8f33f96501`
- `feature/dinner-icon-pack-1` @ `6fe0fe344b05014025333182ff922f2a4fa77206`
- accepted artwork/polish sequence is preserved in the release candidate and main history

The old brand/icon task branches were intentionally pruned after this master was established. Draft preview PR #30 was obsolete preview infrastructure and closed as part of branch cleanup.

## Future rule
Update this master whenever Mordax mythology, hidden-game structure, branding, voice, personality, icon semantics or naming policy changes. Temporary implementation branches are fine during active work, but durable lore and design decisions belong here rather than in one-off task branches.

## October 16, 2026 — Owner-approved definitive canon clarification

Status: owner-approved fictional canon and deferred design concepts only. This entry preserves the historical material above and supersedes conflicting earlier interpretations as identified below. It does not describe implemented features or authorize publication.

Current public identity for this clarification: **Pick For Us**, a **Caustic Relay** product. The earlier Pick For Me / Dinner Roulette naming and rebrand examples remain historical records, not current naming instructions.

### Mordax — definitive nature

Mordax is Caustic Relay's permanent mascot and the silent embodiment of choice and consequence.

He is closer to an invariant force of nature than a conventional character. His rules remain consistent across every fictional reality.

- Mordax does not act until acted upon.
- He never narrates, commands, persuades or judges.
- He exists at the threshold of choice and consequence.
- Deliberate interaction creates the conditions for his response.
- Once the choice is resolved and its consequence occurs, he fades.
- His disappearance is itself part of that consequence.
- He leaves a mark, but his manifestation does not persist after its threshold ends.
- Another choice may create a new threshold.

**What's done is done.**

### The three knocks

Every future Caustic Relay application may conceal Mordax within its About Developer page.

The ordinary page contains the invitation:

> If you want into my world, all you have to do is knock.

Three taps trigger a brief snap, contrasting color inversion and deliberate reveal.

Mordax then silently presents:

> Enter my world?

Choices: **Yes**, **No**, or **dismiss without answering**.

There is no pressure, automatic navigation or permanent penalty for refusing. He remains while the choice is present and disappears when resolved. The invitation and choice are interface text, not speech, narration, persuasion or judgment from Mordax.

### Welcome to My World

Choosing Yes reveals:

- Heading: **Welcome to My World**
- Subtitle: **New theme unlocked in Settings**
- A truthful, detailed developer account explaining the development journey, AI-assisted workflow, tools, problems solved and verified milestones.
- A visually separated short fictional story fragment representing one perspective of an evolving cross-application universe.
- Permanent access to the optional **Eldritch Psychedelia** theme.

The theme unlock does not force theme activation. Factual developer history and fictional story material remain clearly distinguishable. The persistent unlock is a consequence or mark; it does not mean Mordax's manifestation persists after the threshold ends.

### Eldritch Psychedelia

A highly personal visual interpretation of the existing application, designed for the creator and anyone who enjoys that aesthetic.

Retain familiar functionality and layouts while adding:

- Vibrant crimson, deep purple and neon green.
- Translucent neon-glass navigation and panels.
- Animated cosmic-horror background artwork.
- Eye of Providence motifs that track the last pointer or touch location and occasionally blink.
- Ambient background tentacles and runes.
- Organic, inverted-color goo splotches on glass interactions.
- Optional future unusual sounds and clicking animations.

The interface should feel like the living boundary between fictional realities.

**Mordax is exempt from ambient animation.** He never follows the pointer or reacts independently. He responds only when directly acted upon.

Preserve functional accessibility, readable content, reduced-motion alternatives and optional sound.

### Earlier interpretations superseded or constrained

The earlier text is retained as history, not silently rewritten. Apply the following clarification wherever it conflicts:

- **“Mordax — current mythology”:** the earlier combined definition of chaos, choice, restraint and consequence is superseded as his definitive nature by the silent embodiment of choice and consequence. The earlier quoted first-person lines (“You are here because you chose to be.” / “You did not discover me. You assembled the conditions in which I could appear.”) remain conceptual history, not dialogue or narration for Mordax. Deliberate choice creating the conditions for a response remains compatible.
- **“Mordax manifestation model”:** the attention-scaled existence rule (“The more you choose Mordax, the more he exists.”) and progression into a persistently occupied chamber no longer define his nature or duration. His manifestation lasts only for its threshold, then fades after resolution and consequence. A lasting mark or theme unlock is distinct from a lasting manifestation.
- **Startup ident and “Mordax sprite”:** earlier startup-animation and autonomous-looking slithering/background-sighting ideas cannot establish an exception to the new rule. Do not implement unsolicited Mordax reactions, pointer-following or ambient animation. This documentation change does not alter any existing application behavior.
- **“Physical manifestation / merch canon” and “Recurring Mordax patch-note/status device”:** earlier containment, maintenance, escape, recapture and activity framing cannot override his invariant rules or imply that he acts independently. These passages remain historical fictional concepts, not evidence of real events or an implementation mandate. Any future use must be reconciled with this definitive canon.
- **“Hidden-game / secret-layer concept”, “Distributed brand-story architecture” and “Puzzle structure and failure states”:** earlier app-specific locks, creed/chamber destinations, failure pages and cross-app redirects do not replace the newly specified optional About Developer three-knock entry and Yes/No/dismiss choice. In this experience, declining or dismissing must not force navigation, pressure participation or impose a permanent penalty. Other earlier puzzle and minigame ideas remain deferred and must satisfy the new rules before any separate implementation decision.
- **Historical naming:** the original master title, naming state and rebrand examples are retained for provenance. Current public naming is Pick For Us under Caustic Relay, as stated above.

### Continuity boundaries and next action

These are **owner-approved fictional canon and deferred design concepts, not implemented features**.

- Preserve the existing continuity history.
- Do not merge or deploy this experience.
- Do not interrupt Google Play readiness.
- Do not change effective legal dates.
- Do not publish the hidden experience.
- No runtime implementation, asset production, release or Play submission is authorized by this continuity entry.
- Future implementation requires a separately bounded decision and validation, including accessibility and truthful separation of factual developer history from fiction.

Current: this dated clarification is the controlling canon where it supersedes the historical interpretations above.

Next: preserve it for later design work while Google Play readiness remains the active product priority.

Hold: the hidden experience, optional theme, fictional fragments and related effects remain deferred.
