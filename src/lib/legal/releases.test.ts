import test from "node:test";
import assert from "node:assert/strict";
import { materialNotice, publicationLabel, type LegalRelease } from "./releases.ts";
const initial: LegalRelease = {
  version: "1.0",
  status: "unreleased",
  effectiveDate: null,
  changeType: "initial",
  summary: ["Initial publication"],
  requiresPrivacyConsent: false,
  requiresTermsAgreement: false,
};
test("prepared and initial versions never interrupt; publication dates are never guessed", () => {
  assert.equal(materialNotice(initial, null), false);
  assert.match(publicationLabel(initial), /Not yet published or effective/);
  assert.equal(
    materialNotice({ ...initial, status: "published", effectiveDate: "2026-11-01" }, null),
    false,
  );
  assert.match(
    publicationLabel({ ...initial, status: "published", effectiveDate: "2026-11-01" }),
    /2026-11-01/,
  );
});
test("material notices repeat until dismissed and new versions show again; clarification does not interrupt", () => {
  const material = {
    ...initial,
    version: "1.1",
    status: "published",
    effectiveDate: "2026-11-02",
    changeType: "material",
  };
  assert.equal(materialNotice(material, null), true);
  assert.equal(materialNotice(material, "1.0"), true);
  assert.equal(materialNotice(material, "1.1"), false);
  assert.equal(materialNotice({ ...material, version: "1.2" }, "1.1"), true);
  assert.equal(materialNotice({ ...material, status: "unreleased" }, null), false);
  assert.equal(materialNotice({ ...material, effectiveDate: null }, null), false);
  assert.equal(materialNotice({ ...material, changeType: "clarification" }, null), false);
});

test("proposed publication is conditional planning metadata, never an effective date or notice trigger", () => {
  const proposed = { ...initial, proposedPublicationDate: "2026-10-19" };
  assert.equal(materialNotice(proposed, null), false);
  assert.equal(materialNotice({ ...proposed, changeType: "material" }, null), false);
  assert.equal(proposed.status, "unreleased");
  assert.equal(proposed.effectiveDate, null);
  assert.equal(publicationLabel(proposed),
    "Not yet published or effective. The effective date will be set for the authorized publication." +
    " Proposed publication date: 2026-10-19, subject to readiness and separate release approval.");
  assert.ok(!publicationLabel(proposed).includes("Effective date:"));
});
