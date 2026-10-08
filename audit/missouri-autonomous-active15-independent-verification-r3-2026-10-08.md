# Active fifteen-record data review — R3 routing delta

**PASS — factual navigation and placement semantics only.**

On 2026-10-08 at 21:09 UTC, independently compared the five R2-bound data/copy files against the author’s frozen checkout. Exactly one line was added: MO26-071 Pomme de Terror now specifies `seasonalListing.ridesharePolicy: "external-picker"`. Removing that single line reproduces the original R2 file SHA-256 exactly. The other four files remain byte-identical. No venue facts, dates, categories, consumer copy or Directions point changed.

The [official state-park event page](https://mostateparks.com/event/pomme-de-terror-2026) identifies 37.883074, -93.303521 as the Hermitage Area Campground GPS location and distinguishes the Pittsburg-side office. This supports event navigation. It does not designate a rideshare dropoff, entrance, gate or parking stall. Generic external rideshare selection therefore preserves the cleared evidence scope while official point-based Directions remain supported.

R2 remains the complete record-level evidence review, with fifteen factual/placement PASS results. R3 changes only the explicit rideshare policy and current file binding. No runtime execution, browser acceptance or release PASS is granted by this data review. The runtime verifier must prove that the policy is honored in fresh, cached and saved flows.

## Exact current data/copy binding

- `src/lib/date-night/missouri-2026-deferred-batch-3-catalog.ts` — `42ba5f69f4d8ecd0fcfd8fc647dc21b5938bd105c93ac5489fc2559952b5757b`
- `src/lib/date-night/missouri-2026-final-four-catalog.ts` — `7ab28748dbd26df3993882fe82903f35c61db1a8830399e110af51c1fae92111`
- `src/lib/date-night/missouri-2026-late-fall-catalog.ts` — `c64b98a0d6ac8b5b2ba12974597ee93fa78123e29e1b71c21aafa43bd20297e3`
- `src/lib/date-night/missouri-2026-three-source-tier-a-catalog.ts` — `22860de6252f243e9504b0582ed028e19e96035fdc2a6b0ea61326883503e920`
- `src/lib/date-night/seasonal-presentation-catalog.ts` — `69aa6cd3c41a6bc23a464f40c17b72e3eebe3a1c8232793815c2140b41cf7a5b`

Corrected R3 projections SHA-256: `45f2bf1269b741e3ca2613f6c8547a6107b8297062ad5fee1d0bb147b178be9a`. R2 reports and failed-attempt evidence remain unchanged.
