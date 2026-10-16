import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { validateLegalRelease } from './check-legal-release.mjs';
const read = file => JSON.parse(readFileSync(new URL('../src/lib/legal/' + file, import.meta.url), 'utf8'));
const documents = read('documents.json');
const history = read('history.json');
function published(version='1.0') {
  const h = structuredClone(history), d = structuredClone(documents);
  Object.assign(h.current,{version,status:'published',effectiveDate:'2026-11-01'});
  for (const doc of Object.values(d)) Object.assign(doc,{version,status:'published',effectiveDate:'2026-11-01'});
  return {h,d};
}
test('prepared 1.0 passes metadata checks but fails publication; draft is not published history', () => {
  validateLegalRelease(history, documents);
  const h=structuredClone(history),d=structuredClone(documents);
  h.current.status='unreleased';h.current.effectiveDate=null;
  for(const doc of Object.values(d)) { doc.status='unreleased';doc.effectiveDate=null; }
  assert.throws(() => validateLegalRelease(h,d,{publication:true}), /Publication HOLD/);
});
test('explicit publication requires exact synchronized real calendar dates', () => {
  const {h,d}=published(); validateLegalRelease(h,d,{publication:true});
  h.current.effectiveDate='2026-02-30'; assert.throws(()=>validateLegalRelease(h,d));
  h.current.effectiveDate='2026-11-01'; d.privacy.effectiveDate=null; assert.throws(()=>validateLegalRelease(h,d));
});
test('history keeps full prior snapshots and unique versions', () => {
  const prior=published(); const {h,d}=published('1.1');
  h.current.changeType='material'; h.previous.push({...prior.h.current,documents:prior.d});
  validateLegalRelease(h,d,{publication:true});
  d.privacy.sections[0].paragraphs[0]='New version text';
  assert.notEqual(h.previous[0].documents.privacy.sections[0].paragraphs[0],d.privacy.sections[0].paragraphs[0]);
  h.previous[0].version='1.1'; assert.throws(()=>validateLegalRelease(h,d),/Versions must be unique/);
});
test('notice is not sufficient for changes needing consent or agreement', () => {
  for(const flag of ['requiresPrivacyConsent','requiresTermsAgreement']) {
    const {h,d}=published(); h.current[flag]=true;
    assert.throws(()=>validateLegalRelease(h,d,{publication:true}),/separate .* mechanism/);
  }
});
