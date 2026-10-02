# Pick For Us Android artwork

The sole approved web/launcher master is `public/brand/pick-for-us-icon-master.jpg`
(1536x1536 RGB JPEG, 494490 bytes; SHA-256
`12afcedace4aacb19109e561fc70af76076ece7d4997348021422a9396e865d5`).
Do not redesign, retouch, crop, or replace it. The previous
`public/brand/grok_1789541884918.jpg`, historical `icon.jpg` and the
11-byte `icon-fixed.jpg` are obsolete prototype inputs, preserved only as history;
neither participates in any build.

Run `python3 -m pip install -r native-android/requirements.txt`, then
`python3 scripts/android-icons.py`. `--check` verifies all committed derivatives
byte-for-byte. `--preview audit/pickforus-icon-refresh-review.png` renders the
mechanical size/mask review sheet.

The complete master is scaled into a centered 46dp square on the 108dp adaptive
foreground. Its diagonal is below Android's guaranteed central 66dp safe circle,
so both hands, the entire button, and all lettering survive the masks. Neutral
padding is the only addition. Five densities contain standard, round, and adaptive
foreground PNGs. An opaque background supplies full bleed. No fabricated monochrome
logo is supplied: a photographic master cannot yield a useful one-color silhouette
without artwork decisions. Device/themed-launcher inspection remains a human gate.

The original master remains byte-identical. The same pipeline generates the
64px favicon, 192px Apple touch icon (byte-identical to the xxxhdpi legacy icon),
512px PWA any icon and 512px maskable icon. Favicon/PWA any use the full square;
maskable uses a centered 56% square on neutral padding, entirely inside the
central 80% safe circle. `--check` verifies all 19 derivatives byte-for-byte.
