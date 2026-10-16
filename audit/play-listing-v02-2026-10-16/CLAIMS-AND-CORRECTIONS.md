# Play listing v0.2: independent claim verification

2026-10-16. **Source-backed draft with the bounded corrections below. No publication or Console edit.** Inspected exact PR78 `4010edf31e71a7350d891a98dd43f20535602abd`, tree `f521ed3dbdabceeb924ad4da1ce88e42db41092c`, base main `c3208d9fdc9a21d698efa9254be1286f5d3d2836`. PR78 changes Android identity/validators/docs, not application web functionality. The APK loads the remote legacy HTTPS runtime; this review does not certify future hosted content or a Play release.

## Existing work reused

Read `play-phase2-2026-10-16/PLAY-CONSOLE-READINESS-MATRIX.md`, particularly C13 listing metadata and C14 media, and the existing independent Android source/artifact receipts. The readiness matrix predates package implementation/Console inspection and contains historical unresolved identity statements; it is reused for listing boundaries, not treated as current package status. No existing local standalone listing draft was found in the bounded filename scan. PR77 remains separate/unreleased with null dates: its new legal/support features are not advertised here.

## Claim matrix

All paths below are relative to the exact candidate repository. Public source link base: https://github.com/caleb1234calvin-art/dinner-roulette/blob/4010edf31e71a7350d891a98dd43f20535602abd/ . Line references apply to this immutable head.

| Proposed claim | Verdict and minimal wording | Exact source |
|---|---|---|
| Nearby food, date ideas and nightlife | SUPPORTED as discovery modes, without universal availability promise. | `src/components/mode-home.tsx:65-81`; `src/components/pick-home.tsx:225-240`; `src/components/nightlife-home.tsx:126-132`; `src/components/date-night-home.tsx:287-294` |
| “Pick one or see four options” | QUALIFY as **“Pick one or see up to four options.”** Eligible pool can contain fewer than four or none. Preferred original is 74 characters; corrected short is exactly 80. | `src/components/pick-home.tsx:120-145`; `src/components/date-night-home.tsx:232-247`; `src/components/nightlife-home.tsx:97-111`; `src/lib/nightlife/selection.ts:22-30` |
| Dinner cuisine/price/distance/preferences | SUPPORTED. Say “Choose cuisines, a price range and how far you want to go.” Price categories are estimates/unknown-price handling exists, not exact meal prices or a spending guarantee. Preferences influence filtering/weighting. | `src/components/pick-home.tsx:225-319`; `src/lib/restaurants/weighting.ts:27-108`; `src/components/settings-page.tsx:36` |
| Date Night activities/destinations | SUPPORTED as places/activities, not booking or itinerary availability guarantees. | `src/components/date-night-home.tsx:177-212,287-338`; `src/lib/date-night/types.ts`; `src/components/mode-home.tsx:65-81` |
| Seasonal Date Night when available | SUPPORTED WITH QUALIFIER. Current implemented seasonal content is Halloween/fall, gated by season/feature and local availability. Avoid implication of all-year or all-holiday coverage. “Find seasonal ideas where available.” | `src/lib/date-night/season.ts:4-12,27-34`; `src/components/mode-home.tsx:38-55,80`; `src/lib/date-night/coverage.ts:10-45` |
| Nightlife venue/distance/budget/atmosphere | SUPPORTED with **“Choose venue types, distance and budget, and set a chill-to-lively preference.”** Vibe is an energy-weighting preference, not real-time measured atmosphere or guaranteed match. Budget is $–$$$$, unknown prices may remain eligible. | `src/components/nightlife-home.tsx:126-173`; `src/lib/nightlife/selection.ts:4-11,33-55`; `src/lib/nightlife/types.ts:50-58` |
| “Search for places manually or use your device’s location with permission” | CORRECT. Manual input sets a geographic location (city/region/country/postal code), not direct restaurant/venue-name search. Use **“Enter a location manually, or use your device’s location with permission.”** | `src/components/location-control.tsx:113-136`; `src/lib/location/controller.ts:18-43`; `src/lib/restaurants/search.ts:55-63` |
| Favorites | SUPPORTED: users explicitly save/remove places. No cloud favorites claim. | `src/components/result-overlay.tsx:62-80,127`; `src/lib/store.ts:178-185`; `src/components/favorites-page.tsx` |
| History / previous picks | QUALIFY. History contains explicitly logged choices, not every shown/picked result, automatic attendance, or a complete unlimited archive. Maximum 200 entries. Use **“Save favorites and keep a history of choices you log.”** | `src/components/history-page.tsx:13-38`; `src/components/result-overlay.tsx:107-109,127`; `src/lib/store.ts:198-220` |
| Set aside places not interested tonight | SUPPORTED. “Use Not tonight to set a place aside.” Exclusion expires at next local day and can be restored. Avoid permanent-block claim. | `src/lib/store.ts:163-176`; `src/components/settings-page.tsx:37`; `src/components/result-overlay.tsx:127` |
| Adjust preferences | SUPPORTED. Do not imply every mode’s filters persist. Dinner and Date Night filters persist; Nightlife filters use component-local state and reset on remount. | `src/lib/store.ts:251-262`; `src/components/nightlife-home.tsx:36,83-85`; Dinner/Date Night controls above |
| Directions and venue websites | QUALIFY websites: **“Open external directions, and venue websites where available in Date Night.”** Shared result directions link is general; website button is explicitly Date Night-only and requires a URL. Do not promise websites for every Dinner/Nightlife entry or working destination-specific delivery/rideshare links. | `src/components/result-overlay.tsx:96-104,123-126`; `src/lib/location/maps.ts` |
| Light/dark | SUPPORTED. | `src/components/settings-page.tsx:33`; `src/lib/theme.ts:1-18`; `src/lib/store.ts:261` |
| Local favorites/history/preferences, no sync | SUPPORTED scoped to saved app data. “Favorites, logged choices and saved preferences stay on this device and do not sync across devices.” Do not imply every Nightlife filter is saved, all app data stays local, no network transmission, or persistence after data clearing/uninstall. | `src/lib/store.ts:178-220,249-262`; `src/lib/theme.ts:17-18`; `src/components/settings-page.tsx:32,38` |
| Internet needed for live results | SUPPORTED; stronger useful wording: **“An internet connection is needed to load the live experience and refresh results.”** APK is remote-hosted. Cached warm behavior does not support an offline-app promise. | `capacitor.config.json:4-8`; `native-web/index.html`; `src/lib/restaurants/search.ts:17-47`; `src/components/nightlife-home.tsx:50-70` |
| Coverage varies / venue info changes | SUPPORTED as limitation. No comprehensive geographic, verified-live-hours, guaranteed availability, safety or admission claims. “Coverage varies by area. Hours, prices and venue details can change; check with the venue before you go.” | `src/lib/date-night/coverage.ts:24-45`; `src/lib/restaurants/search.ts:27-47`; `src/components/settings-page.tsx:38`; `src/components/result-overlay.tsx:124-126` |

## Important distinctions

- “No sync” applies to the persisted favorites/history/preferences feature, not an assertion that location and other data never leave the phone. Location is used by network discovery; third-party links have their own behavior.
- “History” is owner-entered choice logging. `sessionShown` is a separate internal anti-repeat list and must not be advertised as browsable full pick history.
- The public product remains Pick For Us. Caustic Relay is the developer brand, not a new product mode or asserted registered corporation.
- Exact source support is not complete physical acceptance. Previously recorded device failure/retest qualifications remain unaffected.
- No newly available PR77 privacy/support routes, active account sync, purchase/booking, universal availability or Play publication is claimed.

## Exact owner-text reconciliation and freeze

After the initial bounded filename scan, continuity supplied the exact owner draft at `play-listing-v02-2026-10-16/OWNER-DRAFT-v0.2.md`. It was read in full and retained untouched. Final `RECOMMENDED-FULL-DESCRIPTION.txt` preserves that wording except the documented necessary claim qualifications (1,804 characters); `RECOMMENDED-SHORT-DESCRIPTION.txt` is exactly 80 characters. The earlier reconstructed provisional copy is superseded. `COPY-CHANGELOG.md` identifies each change. External compliance cross-review was requested before the continuity publication step.

---

# Listing v0.2 minimal-edit freeze

Exact owner full text was read from `play-listing-v02-2026-10-16/OWNER-DRAFT-v0.2.md` after the initial source matrix. It remains untouched. Final recommended copy is in `RECOMMENDED-FULL-DESCRIPTION.txt` and `RECOMMENDED-SHORT-DESCRIPTION.txt`. These are proposed source-backed corrections for owner review, not published text.

Only six bounded changes:
1. Short adds “up to” before four (exactly 80 characters).
2. Nightlife atmosphere wording narrows to the implemented chill-to-lively preference.
3. Manual place search becomes manual location entry.
4. Previous picks becomes choices the user logs.
5. Website availability narrows to Date Night where available.
6. Local storage narrows to some preferences, and internet dependency includes loading the live experience and refreshing results.

All other owner wording, headings, warmth, caveats and closing lines remain unchanged. No new feature was added. See CLAIM-VERIFICATION.md for the source matrix.

---

# Listing v0.2 independent policy/claims cross-review

Received 2026-10-16 23:55 UTC from the independent compliance reviewer. Exact proposed copy accepted for drafting/documentation only.

Recounted title 11, short 80, full 1,804 characters, excluding terminal newline. The short description is not repeated in full. Material limits preserved: geographic manual entry, explicitly logged history, some local preferences, Date Night website availability, internet-dependent runtime and variable/changing coverage. No unsupported ranking, pricing promotion, implied provider/Google endorsement, broad safety guarantee or unpublished PR77 feature claim identified.

Copy acceptance does not approve publication. Asset rights, native captures and existing physical/registration/signing/legal/release gates remain open.

Reviewed files: RECOMMENDED-FULL-DESCRIPTION.txt SHA256 ca950d668755f8b47b377fd241f0041fbafcd856d2ffdce9651e1e0787cbeb6a; RECOMMENDED-SHORT-DESCRIPTION.txt SHA256 66f7e5de123fcf57327fad5448d510878abacbc8dfe2d8179c4eb2abf910ab2c. Hashes include the stored terminal newline.
