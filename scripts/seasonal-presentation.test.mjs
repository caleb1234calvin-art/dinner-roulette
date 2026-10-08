import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { appModuleLoader } from "./test-support/load-app-module.mjs";
const load = appModuleLoader();
const { seasonalPresentation, SEASONAL_VISITOR_NOTICE, SEASONAL_CONFIDENCE_LABELS } = load("src/lib/date-night/seasonal-presentation.ts");
const { SEASONAL_PRESENTATIONS } = load("src/lib/date-night/seasonal-presentation-catalog.ts");
const { SeasonalVisitNotes } = load("src/components/seasonal-visit-notes.tsx");
const render = place => renderToStaticMarkup(React.createElement(SeasonalVisitNotes, { place }));
const old = [...load("src/lib/date-night/missouri-2026-cleared-catalog.ts").MISSOURI_2026_CLEARED_SEASONAL_CATALOG,
  ...load("src/lib/date-night/missouri-2026-v1-catalog.ts").MISSOURI_2026_V1_SEASONAL_CATALOG,
  ...load("src/lib/date-night/missouri-2026-v1-next-catalog.ts").MISSOURI_2026_V1_NEXT_SEASONAL_CATALOG];

test("Seasonal consumer contract has one exact notice and three explicit completeness labels", () => {
  assert.equal(SEASONAL_VISITOR_NOTICE, "Check current hours, admission, and weather before you go.");
  assert.deepEqual(SEASONAL_CONFIDENCE_LABELS, { high: "High confidence", good: "Good confidence", limited: "Limited details" });
  for (const row of old) {
    const html = render(row);
    assert.equal(html.split(SEASONAL_VISITOR_NOTICE).length - 1, 1);
    assert.match(html, /<details>/);
    assert.match(html, /data-seasonal-confidence/);
    assert.doesNotMatch(html, /audit|provenance|retention|Census|reviewRevision|survey-grade|checkout total|periodic review|\$\d/i);
    const consumer = seasonalPresentation(row);
    assert.ok(consumer.details.length > 0);
    assert.ok(SEASONAL_CONFIDENCE_LABELS[consumer.confidence]);
    assert.deepEqual(consumer.details, SEASONAL_PRESENTATIONS[row.seasonalListing.recordId].details);
  }
});
test("Unknown identities never leak audit text or automatically gain confidence from verified hours", () => {
  for (const state of ["verified", "partial", "unknown"]) {
    const row = { ...old[0], id: "unknown-seasonal-identity", seasonalListing: { ...old[0].seasonalListing, recordId: "unknown", hours: { state, displayText: "AUDIT PRIVATE RAW DETAILS $42" } }, seasonalVisitNotes: ["AUDIT PRIVATE RAW DETAILS $42"] };
    assert.deepEqual(seasonalPresentation(row), { confidence: "limited", details: ["Hours unconfirmed"] });
    const html = render(row);
    assert.match(html, /Limited details/); assert.match(html, /Hours unconfirmed/);
    assert.doesNotMatch(html, /AUDIT|PRIVATE|RAW|\$42/);
  }
  assert.equal(render({ id: "ordinary" }), "");
});
test("A matching record ID alone cannot borrow another venue's consumer confidence or restrictions", () => {
  const wrong = { ...old[0], id: "unrelated-provider" };
  assert.equal(seasonalPresentation(wrong).confidence, "limited");
  assert.deepEqual(seasonalPresentation(wrong).details, ["Hours unconfirmed"]);
});
test("Consumer projections never mutate full factual catalog notes or machine opening state", () => {
  for (const row of old) {
    const snapshot = JSON.stringify(row);
    seasonalPresentation(row); render(row);
    assert.equal(JSON.stringify(row), snapshot);
    assert.equal(row.openingHours, null);
    assert.equal(row.seasonalAvailability.openNowPolicy, "never");
  }
});
