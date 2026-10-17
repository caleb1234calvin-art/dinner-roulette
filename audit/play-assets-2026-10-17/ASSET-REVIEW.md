# Pick For Us existing-asset review, 2026-10-17 UTC

Read-only repository inspection; no image, source, branch, or remote changes. Local evidence files only.

## Binding and recovered work

Candidate checkout HEAD 4010edf31e71a7350d891a98dd43f20535602abd, tree f521ed3dbdabceeb924ad4da1ce88e42db41092c; clean before and after inspection. All 130 public media-file hashes match HEAD Git blobs. `git diff c3208d9fdc9a21d698efa9254be1286f5d3d2836 HEAD -- public` is empty, binding these public assets to production source as well.

Current AI_CONTINUITY.md at continuity commit 656528ff9e0b6ba7ed7a5df3cd64629b7f4db26b, blob185f4767f839368ef1cc1d3e6cde2bd1af128402, was read through GitHub's blob API after fetch_file returned empty text. Latest section is listing v0.2 / scoped owner QA dated October16 23:57 UTC. It retains final-assets/rights HOLD and says no completed feature graphic or listing screenshots. This review adds evidence; it does not change those release gates.

Recovered prior work: play-compliance-2026-10-16/content/CONTENT-REPORT.md and assets/ASSET-INDEX.json; play-listing-v02-2026-10-16/PLAY-LISTING-V0.2-ASSET-PLAN.md. Ten earlier inspected images remain exact SHA256 matches: icon master, six Nightlife category images and three Halloween samples. Prior visual findings are attributed to that review, not claimed as fresh inspection here. No complete earlier per-asset rights ledger was found in the inspected folders; the ten-image index expressly marks rights_verified false.

## Inventory

ASSET-INVENTORY.json records path, byte length, SHA256, Git blob SHA, candidate equality and actual review coverage for 130 public files:105 JPEG,15 PNG,8 SVG,2 MP4. Raster dimensions/modes/profile presence recorded; SVG viewBox/dimensions and video stream metadata added. This is the public media inventory, not an exhaustive inventory of dependency icons, external fonts, dynamic provider media or generated native-resource derivatives.

Key current files:
- public/pwa-icon-512.png:512×512 RGBA,407901bytes; SHA2564d71389437dc6339ed31ae413e189f5d8a6abe966296333f58c9f1facd202be9; alpha all255; no sRGB/iCCP chunk. Lack of declaration does not prove wrong colors.
- public/brand/pick-for-us-icon-master.jpg:1536×1536 RGB JPEG,494490bytes; SHA25612afcedace4aacb19109e561fc70af76076ece7d4997348021422a9396e865d5; embedded ICC description is sRGB. Master is therefore useful for color-managed export without changing identity.
- public/brand/grok_1789541884918.jpg:1408×1408 RGB JPEG,711385bytes; SHA2565d823a5c4ef6cc0a76ffc8926f83f0eaae85cb8b59cdcd280d9b8d148f99500a; no embedded ICC; EXIF is present but is not chain-of-title proof.
- public/pwa-icon-maskable-512.png:512×512 RGBA,143231bytes; SHA256dbdc4ba01136f56b204f97a69c6797a95009072992818e9d7e5cc5f6a31531bc; no sRGB/iCCP. Separate PWA purpose; do not silently substitute it as the listing icon.
- public/og.jpg:1200×630 RGB JPEG,108152bytes; SHA256ab64b705321a7f01e094663c63df3f06c7284ff3a104d0ef028ba23e81984813; no ICC. Existing website share card, not a finished1024×500 feature graphic.

## Fresh visual observations and limitations

Nine exact files were visually inspected at their existing dimensions: PWA icon, icon master, brand/grok_1789541884918.jpg, og.jpg, dinner-icons/dark/burger.jpg, dinner-icons/light/buffet.jpg, date-night-icons/grok_1788909442728.jpg, date-night-icons/grok_1788905549562.jpg and grok_1789340968434.jpg.

The icon/master show coral inset button, teal PICK FOR US lettering, dark clay-like surround and two clay-like hands. No obvious third-party logo, recognizable character, watermark, Play endorsement, ranking or promotional badge was observed. The OG card adds Pick For Us and pickforus.app text. Sampled category art depicts generic food, covered dishes, arcade cabinet, lock/door and disco ball; no obvious third-party brand identifier was observed in these samples. This is visual screening, not a trademark search, originality comparison, exclusivity determination, ownership verification or legal clearance.

Preserve existing spelling, composition and visual identity. No redraw, recolor, masking change or alternative asset was made. Filename semantics are not a safe guide: dark/burger.jpg depicts pizza, and existing dinner-icons.ts intentionally maps semantic keys to historically mislabeled files. Use that mapping when selecting food art; do not rename or 'repair' files on this evidence alone.

The remaining files are hash/metadata inventoried only, except the ten expressly attributed earlier visual reviews. Videos were not watched or listened to; recording their codecs/dimensions is not audiovisual rights review. Embedded image SVGs and Grok installer SVGs were not visually rendered in this lane.

## Provenance treatment

Latest owner attestation supplied for this task: all artwork was generated in Grok from text prompts developed through ChatGPT creative direction; owner reviewed and modified finals; no existing internet-image references; prompts are lost and some edited finals may remain. Record this as owner-attested provenance, not independently proven creation history. It materially fills the previously absent creator/process statement without establishing exclusivity, copyrightability, trademark clearance or that every third-party component belongs to the owner.

Retain existing finals/hashes now. For any retained edited finals, link the exact file/version to its original and record changes/date if known. Mark lost prompt history unavailable rather than recreating it as historic evidence. Generation dates, applicable tool/terms version and edit-history details remain unverified here; another lane handles current terms.

## Separate third-party and remote scope

public/__grok/install/assets/homescreen/{logo-grok,glass-puzzle,glass-share,plus}.svg are separately named installer/platform resources in the public inventory. Do not apply the owner's general artwork attestation to them automatically. Source references Google Fonts Fraunces and Outfit. Dependency-provided icons and font licenses need their own source/license entries if included in listing assets.

REMOTE-REFERENCE-INVENTORY.json records targeted URL extraction from current src/public text files. It finds Google Fonts URLs and Grok auth/preview URLs; no literal webresources or assets.grok artwork URL was found in that bounded scan. This does not disprove historical hotlinks, injected resources or live remote assets. Such remote media were NOT downloaded or visually inspected in this lane, and no rights conclusion is made about them. Existing audit references to remote resources must remain separate from inspected local artwork.

## Outcome

Identity preservation and byte-level inventory complete. Existing icon source is usable for final export preparation, subject to format checks and provenance/terms review. No observed specific infringement concern in the visual sample. Final listing-media, third-party-component and audiovisual rights coverage remains incomplete; no overall publication GO or legal guarantee follows.

## Later evidence reconciliation

After this inventory lane finished, owner messages identified the standalone Grok app and approximate September 5 through a conservative about October 10, 2026 window; October 10 is not a remembered generation date. See OWNER-ARTWORK-ATTESTATION.md and GROK-TERMS-REVIEW.md. This resolves the service/window questions at owner-attestation level without changing this reviewer’s original byte/visual findings or establishing exact dates. Historical published terms were reviewed; attribution placement/permission interpretation and final asset-specific clearance remain HOLD.
