import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { validateLegalRelease } from './check-legal-release.mjs';
const read = file => JSON.parse(readFileSync(new URL('../src/lib/legal/' + file, import.meta.url), 'utf8'));
const documents = read('documents.json');
const history = read('history.json');
const publicationOptions = { publication:true, authorizedDate:'2026-11-01', publicationTimeZone:'America/Chicago', now:new Date('2026-11-01T12:00:00Z') };
function published(version='1.0') {
  const h = structuredClone(history), d = structuredClone(documents);
  Object.assign(h.current,{version,status:'published',effectiveDate:'2026-11-01',proposedPublicationDate:null});
  for (const doc of Object.values(d)) Object.assign(doc,{version,status:'published',effectiveDate:'2026-11-01',proposedPublicationDate:null});
  return {h,d};
}
test('prepared 1.0 passes metadata checks but fails publication; draft is not published history', () => {
  validateLegalRelease(history, documents);
  const h=structuredClone(history),d=structuredClone(documents);
  h.current.status='unreleased';h.current.effectiveDate=null;
  for(const doc of Object.values(d)) { doc.status='unreleased';doc.effectiveDate=null; }
  assert.throws(() => validateLegalRelease(h,d,publicationOptions), /Publication HOLD/);
});
test('explicit publication requires exact synchronized real calendar dates', () => {
  const {h,d}=published(); validateLegalRelease(h,d,publicationOptions);
  h.current.effectiveDate='2026-02-30'; assert.throws(()=>validateLegalRelease(h,d));
  h.current.effectiveDate='2026-11-01'; d.privacy.effectiveDate=null; assert.throws(()=>validateLegalRelease(h,d));
});
test('history keeps full prior snapshots and unique versions', () => {
  const prior=published(); const {h,d}=published('1.1');
  h.current.changeType='material'; h.previous.push({...prior.h.current,documents:prior.d});
  validateLegalRelease(h,d,publicationOptions);
  d.privacy.sections[0].paragraphs[0]='New version text';
  assert.notEqual(h.previous[0].documents.privacy.sections[0].paragraphs[0],d.privacy.sections[0].paragraphs[0]);
  h.previous[0].version='1.1'; assert.throws(()=>validateLegalRelease(h,d),/Versions must be unique/);
});
test('notice is not sufficient for changes needing consent or agreement', () => {
  for(const flag of ['requiresPrivacyConsent','requiresTermsAgreement']) {
    const {h,d}=published(); h.current[flag]=true;
    assert.throws(()=>validateLegalRelease(h,d,publicationOptions),/separate .* mechanism/);
  }
});

test('tentative dates stay synchronized, real and separate from effective publication', () => {
  assert.equal(history.current.status,'unreleased');
  assert.equal(history.current.effectiveDate,null);
  assert.equal(history.current.proposedPublicationDate,'2026-10-19');
  assert.equal(history.current.version,'1.0');
  validateLegalRelease(history,documents);
  for(const value of ['2026-02-30','2026-1-19',42]) {
    const h=structuredClone(history),d=structuredClone(documents);
    h.current.proposedPublicationDate=value;
    for(const doc of Object.values(d)) doc.proposedPublicationDate=value;
    assert.throws(()=>validateLegalRelease(h,d));
  }
  const d=structuredClone(documents);d.privacy.proposedPublicationDate='2026-10-20';
  assert.throws(()=>validateLegalRelease(history,d));
  const current=published();current.h.current.proposedPublicationDate='2026-10-19';
  for(const doc of Object.values(current.d)) doc.proposedPublicationDate='2026-10-19';
  assert.throws(()=>validateLegalRelease(current.h,current.d),/cannot retain a proposed/);
});

test('publication requires exact authorized date and explicit valid IANA time zone', () => {
  const {h,d}=published();
  for(const override of [
    {authorizedDate:undefined}, {authorizedDate:'2026-02-30'},
    {publicationTimeZone:undefined}, {publicationTimeZone:''},
    {publicationTimeZone:'Invalid/Zone'}, {publicationTimeZone:'-05:00'},
    {publicationTimeZone:'CST'}, {publicationTimeZone:'PST'},
    {publicationTimeZone:'EST'}, {publicationTimeZone:'IST'},
    {authorizedDate:'2026-11-02'},
  ]) assert.throws(()=>validateLegalRelease(h,d,{...publicationOptions,...override}));
});

test('publication day guard rejects before or after the authorized date at local midnight boundaries', () => {
  const {h,d}=published();
  h.current.effectiveDate='2026-10-19';
  for(const doc of Object.values(d)) doc.effectiveDate='2026-10-19';
  const options={...publicationOptions,authorizedDate:'2026-10-19'};
  for(const now of ['2026-10-19T05:00:00Z','2026-10-20T04:59:59.999Z'])
    validateLegalRelease(h,d,{...options,now:new Date(now)});
  for(const now of ['2026-10-19T04:59:59.999Z','2026-10-20T05:00:00Z'])
    assert.throws(()=>validateLegalRelease(h,d,{...options,now:new Date(now)}),/not the authorized calendar day/);
  validateLegalRelease(h,d,{...options,publicationTimeZone:'UTC',now:new Date('2026-10-19T00:00:00Z')});
  assert.throws(()=>validateLegalRelease(h,d,{...options,publicationTimeZone:'UTC',now:new Date('2026-10-20T00:00:00Z')}),/not the authorized calendar day/);
});

test('production CLI rejects clock overrides, duplicate or unscoped arguments and never writes metadata', () => {
  const script=new URL('./check-legal-release.mjs',import.meta.url);
  const before=[read('history.json'),read('documents.json')];
  for(const args of [
    ['--now=2026-10-19T12:00:00Z'], ['--publication','--publication'],
    ['--authorized-date='], ['--publication-time-zone='], ['--publication-time-zone=America/Chicago'],
    ['--publication','--authorized-date=2026-10-19','--authorized-date=2026-10-20'],
  ]) {
    const result=spawnSync(process.execPath,[script.pathname,...args],{encoding:'utf8'});
    assert.notEqual(result.status,0);
  }
  assert.deepEqual([read('history.json'),read('documents.json')],before);
});
