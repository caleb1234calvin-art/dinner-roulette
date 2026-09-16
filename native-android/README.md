# Pick For Us Android artwork

The sole approved launcher master is `public/brand/grok_1789541884918.jpg`.
Do not redesign, retouch, crop, or replace it. Historical `icon.jpg` and the
11-byte `icon-fixed.jpg` are obsolete prototype inputs, preserved only as history;
neither participates in any build.

Run `python3 -m pip install -r native-android/requirements.txt`, then
`python3 scripts/android-icons.py`. `--check` verifies all committed derivatives
byte-for-byte. `--preview audit/android-phase-b-icon-masks.png` renders review masks.

The complete master is scaled into a centered 46dp square on the 108dp adaptive
foreground. Its diagonal is below Android's guaranteed central 66dp safe circle,
so both hands, the entire button, and all lettering survive the masks. Neutral
padding is the only addition. Five densities contain standard, round, and adaptive
foreground PNGs. An opaque background supplies full bleed. No fabricated monochrome
logo is supplied: a photographic master cannot yield a useful one-color silhouette
without artwork decisions. Device/themed-launcher inspection remains a human gate.

The original master remains byte-identical. PWA/favicon artwork is outside this
Android-only derivative change.
