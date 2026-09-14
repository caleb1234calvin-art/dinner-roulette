# Pick For Me — Brand & Personality Continuity Master

Updated: September 14, 2026

Purpose: durable continuity for naming, visual identity, artwork, Mordax, app personality and audience-facing marketing voice.

## Naming state
The broader product direction/name is **Pick For Me**, reflecting expansion beyond dinner into Nightlife, Date Night, casinos and seasonal/discovery features.

Public-facing material should continue using **Dinner Roulette** until the app itself is deliberately rebranded. The user explicitly wants to avoid audience confusion caused by marketing changing names before the product does.

## Mordax
Mordax is the project mascot/logo mythology: a biting/caustic protective creature associated with choice, restrained volatility and non-interference. The startup ident uses Mordax as a brief brand animation. Preserve the distinction between Mordax mythology and ordinary feature UI.

## Artwork state — released
- Dinner category artwork uses visually verified semantic mappings rather than trusting misleading historical filenames.
- Specific cuisine semantics outrank broad provider tags for artwork selection.
- Nightlife has approved custom artwork for Bar, Pub, Club, Lounge, Brewery / Beer Garden and Casino presentation.
- Nightlife category FILTER CHIPS are intentionally text-only.
- Nightlife RESULT CARDS may use approved artwork.
- Casino artwork remains approved.
- These accepted presentation changes were included in frozen candidate `1c4b2b73d1f23bb184f34e5b7360144378757bc4`, subsequently merged into `main` through PR #44.

## Marketing personality
Current audience-facing direction: competent/polished product paired with an intentionally questionable, dark, deadpan social voice.

Desired audience reaction: it should be slightly ambiguous whether the person running the account has a horrible personality or simply a very funny dark sense of humor.

Voice principles:
- deadpan
- mildly confrontational in an obviously comedic/absurd way
- self-aware indie-builder energy
- product remains trustworthy even when marketing sounds unhinged
- avoid genuine cruelty toward users or statements that make privacy/safety feel questionable
- contrast polished app presentation with irreverent copy

Recent accepted example direction:
`Nobody asked for it and I dont care!`
followed by legitimate patch notes and:
`Try it you'll like it.`

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
Update this master when branding, voice, personality, icon semantics or naming policy changes. Temporary artwork branches are fine during implementation, but do not keep a permanent branch for every individual artwork or marketing pass.
