import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

export function validateLegalRelease(history, documents, { publication = false } = {}) {
  assert.equal(history.schemaVersion, 1);
  const releases = [...history.previous, { ...history.current, documents }];
  assert.equal(new Set(releases.map(r => r.version)).size, releases.length, 'Versions must be unique');
  for (const [index, release] of releases.entries()) {
    assert.match(release.version, /^\d+\.\d+(?:\.\d+)?$/);
    assert.ok(['published', 'unreleased'].includes(release.status));
    assert.ok(['initial', 'material', 'clarification'].includes(release.changeType));
    assert.ok(release.summary.length && release.summary.every(s => typeof s === 'string' && s.trim()));
    assert.equal(typeof release.requiresPrivacyConsent, 'boolean');
    assert.equal(typeof release.requiresTermsAgreement, 'boolean');
    if (release.status === 'published') {
      assert.match(release.effectiveDate, /^\d{4}-\d{2}-\d{2}$/);
      assert.equal(new Date(release.effectiveDate + 'T00:00:00Z').toISOString().slice(0, 10), release.effectiveDate);
    } else {
      assert.equal(release.effectiveDate, null, 'Unreleased versions cannot have an effective date');
      assert.equal(index, releases.length - 1, 'History contains only published versions');
    }
    if (index === 0) assert.equal(release.changeType, 'initial');
    else {
      assert.notEqual(release.changeType, 'initial');
      if (release.effectiveDate) assert.ok(release.effectiveDate >= releases[index - 1].effectiveDate);
    }
    for (const id of ['privacy', 'terms']) {
      const document = release.documents[id];
      assert.equal(document.version, release.version);
      assert.equal(document.status, release.status);
      assert.equal(document.effectiveDate, release.effectiveDate);
      assert.ok(document.title && document.sections.length);
    }
  }
  if (publication) {
    assert.equal(history.current.status, 'published', 'Publication HOLD: finalize actual authorized date and revalidate exact source first');
    // A notice is not an agreement or consent collection mechanism. Until a
    // separately reviewed mechanism exists, block changes requiring either.
    assert.equal(history.current.requiresPrivacyConsent, false, 'Publication HOLD: separate consent mechanism and review required');
    assert.equal(history.current.requiresTermsAgreement, false, 'Publication HOLD: separate agreement mechanism and review required');
  }
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const read = path => JSON.parse(readFileSync(new URL('../' + path, import.meta.url), 'utf8'));
  validateLegalRelease(read('src/lib/legal/history.json'), read('src/lib/legal/documents.json'), { publication: process.argv.includes('--publication') });
  console.log(process.argv.includes('--publication') ? 'Legal publication metadata valid; authorization and exact-source release checks remain required.' : 'Legal prepared-source metadata valid; not a publication approval.');
}
