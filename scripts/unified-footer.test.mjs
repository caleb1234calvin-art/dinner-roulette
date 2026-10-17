import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import ts from 'typescript';
const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const source = read('src/components/unified-footer.tsx');
const manifest = JSON.parse(read('src/lib/artwork/owner-attested-assets.json'));
const executable = ts.transpileModule(read('src/lib/artwork/attribution.ts').replace('import manifest from "./owner-attested-assets.json";', `const manifest = ${JSON.stringify(manifest)};`), {compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
const {hasAttestedArtwork}=await import(`data:text/javascript;base64,${Buffer.from(executable).toString('base64')}`);
test('attribution is exact reviewed asset membership; unrelated media and URLs do not qualify',()=>{
 for(const asset of manifest.assets){
  assert.equal(hasAttestedArtwork([asset.src]),true);
  assert.ok(existsSync(`public${asset.src}`));
  assert.equal(createHash('sha256').update(readFileSync(`public${asset.src}`)).digest('hex'),asset.sha256);
 }
 for(const value of [null,undefined,'','data:image/svg+xml,abc','https://example.com/grok.jpg','/__grok/icon-180.png','/favicon.png','/brand/CAUSTIC_RELAY_ident-2.mp4','/dinner-icons/new-unreviewed.jpg']) assert.equal(hasAttestedArtwork([value]),false);
 assert.equal(hasAttestedArtwork([]),false);
});
test('all current runtime artwork paths are reviewed; future unmapped assets fail review gate',()=>{
 for(const path of ['src/lib/date-night/icons.ts','src/lib/nightlife/types.ts']){
  const assets=read(path).match(/\/[^"\s]+\.(?:jpg|png)/g)??[];
  for(const asset of assets) assert.equal(hasAttestedArtwork([asset]),true,asset);
 }
 for(const theme of ['light','dark'])for(const key of ['burger','pizza','mexican','chinese','japanese','italian','steakhouse','bbq','chicken','cafe-bakery','dessert','seafood','buffet','breakfast','fallback']) assert.equal(hasAttestedArtwork([`/dinner-icons/${theme}/${key}.jpg`]),true);
});
test('footer uses approved scoped copy and real legal/support destinations',()=>{
 for(const text of ['Pick For Us','by Caustic Relay','Independent application. Not affiliated with or endorsed by listed venues, delivery services, rideshare providers, mapping services or other third parties unless expressly stated.','External services maintain their own availability, transactions, terms and privacy practices.','Visual artwork created with Grok','Creative direction and final refinements by Caustic Relay.']) assert.ok(source.includes(text));
 assert.match(source,/href="\/privacy"/);assert.match(source,/href="\/terms"/);assert.match(source,/href=\{SUPPORT_MAILTO\}/);
 assert.match(source,/hasAttestedArtwork\(artworkSources\)/);
 assert.ok(!/position:\s*fixed|className="fixed|play\.google\.com|Effective date/.test(source));
});
test('route and overlay coverage explicit, with safe area clearance and no change to legal publication state',()=>{
 const shell=read('src/components/app-shell.tsx');assert.match(shell,/PageFooter pathname=\{pathname\}/);assert.match(shell,/env\(safe-area-inset-bottom, 0px\)/);
 for(const path of ['result-overlay','options-overlay','date-night-plan-overlay'])assert.match(read(`src/components/${path}.tsx`),/UnifiedFooter artworkSources=/);
 const mapping=read('src/components/page-footer.tsx');assert.match(mapping,/pathname === "\/favorites"/);assert.match(mapping,/pathname === "\/history"/);
 const docs=JSON.parse(read('src/lib/legal/documents.json'));for(const id of ['privacy','terms']){assert.equal(docs[id].version,'1.0');assert.equal(docs[id].status,'unreleased');assert.equal(docs[id].effectiveDate,null);}
});
