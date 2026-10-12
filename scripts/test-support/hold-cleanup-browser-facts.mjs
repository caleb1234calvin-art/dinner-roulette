import assert from "node:assert/strict";

// Literal reviewed field requirements, independent of the mutable runtime copy.
export const HOLD_CLEANUP_PROJECTION_SHA256 = "fab3e9e0084fb58bb052846e02cf22217fc2989ec639c6d282870adbb08acc84";
export const HOLD_CLEANUP_MATERIAL_FACTS = {
  "MO26-007": [/September 25–26/, /October 2–3, 9–10, 16–17, 23–24 and 29–31, 2026/, /7 PM–midnight/, /October 29, 7–10 PM/, /Admission \$15\./, /Location is approximate/],
  "DELTA6-BOSS": [/October 24, 2026, during Harvest Fest \(3:30–9 PM\)/, /Haunted-house hours are not separately confirmed/, /Open to the public, subject to Fort Leonard Wood access approval/, /Visitors without qualifying credentials need screening and a pass/, /Adults need acceptable physical ID/, /REAL ID or accepted supplemental documents/, /Confirm event access requirements before traveling/, /Drivers must carry a current license, vehicle insurance and registration/, /Shuttles begin at 3 PM from the Pershing Community Center parking lot/, /Approximate venue location/, /Use the visitor address for Directions/],
};
export const HOLD_CLEANUP_CONFIDENCE = { "MO26-007": "limited", "DELTA6-BOSS": "limited" };

/** The owner explicitly requires Cadaver's supported $15 display. This exception
 * permits only that exact price on that reviewed record; all other copy guards
 * remain. Collapsed Details legitimately hides price, while expanded material
 * fact assertions independently require the visible admission sentence. */
export function assertCleanupConsumerCopy(text, recordId, forbiddenCopy) {
  let inspected = text;
  if (recordId === "MO26-007") {
    const prices = text.match(/\$\s*\d+(?:[.,]\d+)?/g) ?? [];
    if (prices.length) {
      assert.deepEqual(prices, ["$15"], "Only the exact owner-supported Cadaver admission is displayed");
      assert.match(text, /Admission \$15\./);
      inspected = text.replace("$15", "");
    }
  }
  assert.doesNotMatch(inspected, forbiddenCopy, "Only the specific approved Cadaver price is exempt from unchanged consumer-copy controls");
}
