import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const read = (file) => readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');

test('public legal routes render full versioned documents without an authentication gate', () => {
  const documents = JSON.parse(read('src/lib/legal/documents.json'));
  for (const id of ['privacy', 'terms']) {
    const route = read(`src/routes/${id}.tsx`);
    assert.ok(route.includes(`createFileRoute("/${id}")`));
    assert.ok(!/beforeLoad|requireAuth|signIn/.test(route));
    const current = JSON.parse(read("src/lib/legal/history.json")).current;
    assert.equal(documents[id].version, current.version);
    assert.equal(documents[id].status, current.status);
    assert.equal(documents[id].effectiveDate, current.effectiveDate);
    assert.ok(documents[id].sections.length >= 4);
    assert.equal(new Set(documents[id].sections.map(s => s.id)).size, documents[id].sections.length);
    for (const section of documents[id].sections) {
      assert.match(section.id, /^[a-z][a-z0-9-]+$/);
      assert.ok(section.title && section.paragraphs.length);
      for (const link of section.links ?? []) assert.match(link.url, /^(https:\/\/|mailto:|\/(privacy|terms)$)/);
    }
  }
  assert.ok(!read('src/components/legal-document-page.tsx').includes('dangerouslySetInnerHTML'));
  assert.match(read('src/components/startup-ident.tsx'), /if \(!visible \|\| isLegalPage\) return null/);
});

test('support mailto has an encoded subject and visible fallback without a success claim', () => {
  const support = read('src/lib/legal/support.ts');
  const settings = read('src/components/settings-page.tsx');
  assert.ok(support.includes('causticrelay@gmail.com'));
  assert.ok(support.includes('encodeURIComponent("Pick For Us support")'));
  assert.ok(settings.includes('href={SUPPORT_MAILTO}'));
  assert.ok(settings.includes('select-text break-all'));
  assert.ok(settings.includes('If nothing opens, copy the address below'));
  assert.ok(!/email sent|message sent|successfully sent/i.test(settings));
});

test('settings reset disclosure matches retained state without claiming all-data deletion', () => {
  const settings = read('src/components/settings-page.tsx');
  assert.ok(settings.includes('saved search location, appearance and tour preference stay'));
  assert.ok(settings.includes('do not delete support emails'));
  assert.ok(settings.includes('ratings, visits, exclusions and shown-pick history'));
  assert.ok(settings.includes('onClick={resetFilters}'));
  assert.ok(settings.includes('onClick={resetAllData}'));
  assert.ok(!/erase all data|delete all data|all your data is deleted/i.test(settings));
});

test('legal support changes introduce no forced or prechecked acceptance and no fabricated Play link', () => {
  const settings = read('src/components/settings-page.tsx');
  const page = read('src/components/legal-document-page.tsx');
  assert.ok(settings.includes('The Google Play release is being prepared.'));
  assert.ok(!settings.includes('play.google.com/store/apps/details'));
  assert.ok(!/checkbox|defaultChecked|acceptTerms|acceptPrivacy/.test(page));
  assert.ok(!read('src/lib/legal/support.ts').includes('fetch('));
});
