import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

function calendarDate(value) {
  assert.equal(typeof value, 'string', 'A calendar date must be an ISO YYYY-MM-DD string');
  assert.match(value, /^\d{4}-\d{2}-\d{2}$/);
  assert.equal(new Date(value + 'T00:00:00Z').toISOString().slice(0, 10), value, 'Invalid calendar date');
}

// The clock verifies an explicitly authorized publication day. It never assigns
// source dates or activates a prepared policy. Only tests inject a clock value.
export function validateLegalRelease(history, documents, {
  publication = false, authorizedDate, publicationTimeZone, now = new Date(),
} = {}) {
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
      calendarDate(release.effectiveDate);
      assert.ok(release.proposedPublicationDate == null, 'Published versions cannot retain a proposed publication date');
    } else {
      assert.equal(release.effectiveDate, null, 'Unreleased versions cannot have an effective date');
      assert.equal(index, releases.length - 1, 'History contains only published versions');
      if (release.proposedPublicationDate != null) calendarDate(release.proposedPublicationDate);
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
      assert.equal(document.proposedPublicationDate ?? null, release.proposedPublicationDate ?? null);
      assert.ok(document.title && document.sections.length);
    }
  }
  if (publication) {
    assert.equal(history.current.status, 'published', 'Publication HOLD: finalize actual authorized date and revalidate exact source first');
    calendarDate(authorizedDate);
    assert.equal(typeof publicationTimeZone, 'string', 'Publication HOLD: explicit authorized publication time zone is required');
    assert.ok(publicationTimeZone.trim(), 'Publication HOLD: explicit authorized publication time zone is required');
    assert.match(publicationTimeZone, /^(?:UTC|[A-Za-z_]+\/[A-Za-z0-9_+-]+(?:\/[A-Za-z0-9_+-]+)*)$/, 'Publication HOLD: use an explicit Area/Location IANA time zone or UTC, not an abbreviation or numeric offset');
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: publicationTimeZone, year: 'numeric', month: '2-digit', day: '2-digit',
    });
    const parts = Object.fromEntries(formatter.formatToParts(now).map(part => [part.type, part.value]));
    const actualDate = `${parts.year}-${parts.month}-${parts.day}`;
    assert.equal(history.current.effectiveDate, authorizedDate, 'Publication HOLD: source effective date differs from the authorized date');
    assert.equal(actualDate, authorizedDate, 'Publication HOLD: not the authorized calendar day in the supplied time zone; stop and reconfirm');
    // A notice is not an agreement or consent collection mechanism. Until a
    // separately reviewed mechanism exists, block changes requiring either.
    assert.equal(history.current.requiresPrivacyConsent, false, 'Publication HOLD: separate consent mechanism and review required');
    assert.equal(history.current.requiresTermsAgreement, false, 'Publication HOLD: separate agreement mechanism and review required');
  }
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const read = path => JSON.parse(readFileSync(new URL('../' + path, import.meta.url), 'utf8'));
  const options = {};
  for (const arg of process.argv.slice(2)) {
    if (arg === '--publication') { assert.equal(options.publication, undefined); options.publication = true; }
    else if (arg.startsWith('--authorized-date=')) { assert.equal(options.authorizedDate, undefined); options.authorizedDate = arg.slice('--authorized-date='.length); }
    else if (arg.startsWith('--publication-time-zone=')) { assert.equal(options.publicationTimeZone, undefined); options.publicationTimeZone = arg.slice('--publication-time-zone='.length); }
    else throw new Error(`Unknown legal release option: ${arg}`);
  }
  assert.ok(options.publication || (options.authorizedDate === undefined && options.publicationTimeZone === undefined), 'Publication date/time zone options require --publication');
  validateLegalRelease(read('src/lib/legal/history.json'), read('src/lib/legal/documents.json'), options);
  console.log(options.publication ? `Legal publication metadata matches ${options.authorizedDate} in ${options.publicationTimeZone}; authorization and exact-source release checks remain required.` : 'Legal prepared-source metadata valid; not a publication approval.');
}
