import assert from 'node:assert/strict';
import { resolve } from 'node:path';
import { rolldown } from 'rolldown';
import ts from 'typescript';

// Bundle the actual component with test-owned data. No fixture routes, globals
// or flags are added to the application or its production bundle.
export async function checkLegalNotice(browser, base) {
  const bundle = await rolldown({
    input: 'legal-notice-fixture',
    plugins: [{
      name: 'legal-notice-fixture',
      resolveId(id) {
        if (id === 'legal-notice-fixture') return '\0legal-notice-fixture';
        if (id.startsWith('@/')) return resolve('src', id.slice(2) + (id.endsWith('.json') ? '' : '.ts'));
      },
      load(id) {
        if(id === '\0legal-notice-fixture') return `import React from 'react'; import {createRoot} from 'react-dom/client'; import {LegalChangeNotice} from ${JSON.stringify(resolve('src/components/legal-change-notice.tsx'))}; const root=createRoot(document.getElementById('fixture')); window.renderLegalFixture=release=>root.render(React.createElement(LegalChangeNotice,{release}));`;
      },
      async transform(code,id) {
        if(/\.tsx?$/.test(id)) return {code:ts.transpileModule(code,{compilerOptions:{jsx:ts.JsxEmit.ReactJSX,target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}}).outputText};
      },
    }],
    transform: { define: { 'process.env.NODE_ENV': JSON.stringify('production') } },
  });
  const generated = await bundle.generate({format:'iife'});
  await bundle.close();
  const code=generated.output.find(o=>o.type==='chunk').code;
  const release={version:'1.1',status:'published',effectiveDate:'2026-11-02',changeType:'material',summary:['Changed the test-only example of data handling.'],requiresPrivacyConsent:false,requiresTermsAgreement:false};
  for(const blocked of [false,true]) {
    const context=await browser.newContext({viewport:{width:320,height:844}});
    await context.route(base+'/legal-notice-fixture',route=>route.fulfill({contentType:'text/html',body:'<!doctype html><html><body><div id="fixture"></div></body></html>'}));
    if(blocked) await context.addInitScript(()=>{ Object.defineProperty(window,'localStorage',{get(){throw new DOMException('Storage blocked','SecurityError');}}); });
    await context.route('**/_vercel/insights/**',route=>route.fulfill({status:200,body:''}));
    await context.route(/^https:\/\/(fonts\.(googleapis|gstatic)\.com|grok\.com)\//,route=>route.abort());
    const page=await context.newPage();
    await page.goto(base+'/privacy');
    const styles=await page.locator('link[rel=stylesheet]').evaluateAll(links=>links.map(link=>link.href).filter(href=>href.startsWith(location.origin)));
    const mount=async()=>{await page.goto(base+'/legal-notice-fixture');for(const url of styles) await page.addStyleTag({url});await page.addScriptTag({content:code});await page.evaluate(r=>window.renderLegalFixture(r),release);};
    await mount();
    const notice=page.getByRole('complementary',{name:'Legal updates'});
    await notice.waitFor({state:'visible'});
    assert.ok((await notice.innerText()).includes('Effective date: 2026-11-02'));
    assert.ok((await notice.innerText()).includes('does not give agreement or consent'));
    assert.equal(await notice.locator('input').count(),0);
    assert.equal(await notice.locator('a').first().getAttribute('href'),'/privacy#version-history');
    await page.keyboard.press('Tab'); assert.equal(await page.evaluate(()=>document.activeElement.textContent.trim()),'Privacy policy and history');
    await page.keyboard.press('Tab'); await page.keyboard.press('Tab');
    assert.equal(await page.evaluate(()=>document.activeElement.textContent.trim()),'Dismiss notice');
    await page.keyboard.press('Enter'); await notice.waitFor({state:'detached'});
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    await mount();
    if(blocked) await notice.waitFor({state:'visible'});
    else { await page.waitForTimeout(100);assert.equal(await notice.count(),0);assert.equal(await page.evaluate(()=>localStorage.getItem('pick-for-us-legal-notice-dismissed')),'1.1'); }
    await page.evaluate(r=>window.renderLegalFixture({...r,version:'1.2'}),release);await notice.waitFor({state:'visible'});
    await notice.getByRole('link',{name:'Privacy policy and history'}).click();
    await page.waitForURL('**/privacy#version-history');
    assert.equal(await page.getByRole('heading',{name:'Version history',exact:true}).count(),1);
    await page.goBack();
    await context.close();
  }
  return 'Actual material-notice component: 320px keyboard dismissal, reload, blocked storage, new-version reappearance and public history link';
}
