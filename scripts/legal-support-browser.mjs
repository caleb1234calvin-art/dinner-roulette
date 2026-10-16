import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';
import { assertBrowserBuild } from './browser-build-proof.mjs';

// Run against the separately started, exact safe production preview. Never use a
// production host: fixtures and destructive local-store controls are test-only.
const base = process.env.LEGAL_BROWSER_URL || 'http://127.0.0.1:8081';
assert.ok(['127.0.0.1', 'localhost'].includes(new URL(base).hostname));
const output = process.env.LEGAL_BROWSER_OUTPUT || 'audit/browser-results/legal-support';
await mkdir(output, { recursive: true });
const proof = assertBrowserBuild();
const checks = [];
let browser;
const server=spawn(process.execPath,['scripts/with-app-env.mjs','node_modules/vite/bin/vite.js','preview','--host','127.0.0.1','--port',new URL(base).port || '8081','--strictPort'],{env:{...process.env,DATABASE_URL:''},stdio:['ignore','pipe','pipe']});
let serverLog='';server.stdout.on('data',d=>serverLog+=d);server.stderr.on('data',d=>serverLog+=d);
function pass(name, detail = {}) { checks.push({ name, status: 'PASS', ...detail }); }
async function visibleHit(locator) {
  await locator.scrollIntoViewIfNeeded();
  const geometry = await locator.evaluate(el => {
    const r = el.getBoundingClientRect();
    const points = [0.2, 0.5, 0.8].map(f => [r.left + r.width * f, r.top + r.height / 2]);
    return { x:r.x,y:r.y,width:r.width,height:r.height,visible:points.every(([x,y]) => {
      const top = document.elementFromPoint(x,y); return x >= 0 && x <= innerWidth && y >= 0 && y <= innerHeight && (top === el || el.contains(top));
    }) };
  });
  assert.ok(geometry.visible, JSON.stringify(geometry)); return geometry;
}
async function overflow(page) { assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)); }
try {
  const start=Date.now();
  while(true) {if(server.exitCode!==null) throw new Error('Owned preview exited: '+serverLog);try {if((await fetch(base+'/privacy')).ok)break;}catch{ /* Preview may not have bound its port yet. */ }if(Date.now()-start>30000)throw new Error('Preview readiness timeout: '+serverLog);await delay(200);}
  browser = await chromium.launch({headless:true, executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined, args:['--no-sandbox','--disable-dev-shm-usage']});
  for (const width of [320,390,512]) {
    for (const theme of ['dark','light']) {
      const context = await browser.newContext({viewport:{width,height:844},reducedMotion:'reduce'});
      await context.route('**/_vercel/insights/**', route => route.fulfill({status:200,body:''}));
      await context.route(/^https:\/\/(fonts\.(googleapis|gstatic)\.com|grok\.com)\//, route => route.abort());
      await context.addInitScript(({theme}) => {
        sessionStorage.setItem('dinner-roulette-hint-seen','1');
        if (!localStorage.getItem('pick-for-us-v1')) localStorage.setItem('pick-for-us-v1',JSON.stringify({state:{theme,location:{label:'Springfield fixture, Missouri',lat:37.2089,lon:-93.2923,source:'manual'},homeMode:'dinner',preferences:{'test-venue':{restaurantId:'test-venue',name:'Test venue',favorite:true}},visits:[{id:'test-visit',restaurantId:'test-venue',restaurantName:'Test venue',date:'2026-10-16'}],exclusions:[],sessionShown:['test-venue']},version:0}));
      },{theme});
      const page=await context.newPage();
      for(const [path,title] of [['/privacy','Privacy Policy'],['/terms','Terms & Conditions']]) {
        const response=await page.goto(base+path,{waitUntil:'networkidle'});assert.equal(response.status(),200);
        assert.equal(await page.getByRole('heading',{level:1,name:title,exact:true}).count(),1);
        assert.ok((await page.locator('main').innerText()).includes('causticrelay@gmail.com'));
        assert.ok((await page.locator('main').innerText()).includes('Version'));
        assert.equal(await page.locator('input[type=checkbox]').count(),0);
        await overflow(page);
        const links=page.locator('main nav a[href^="#"]');
        for(let i=0;i<await links.count();i++) {
          const link=links.nth(i);const href=await link.getAttribute('href');await link.click();
          const heading=page.locator(href+' h2');const box=await heading.boundingBox();
          assert.ok(box && box.y>=0 && box.y+box.height<=844,`Anchor heading outside viewport: ${href}`);
          await visibleHit(heading);
        }
        await page.goto(base+path,{waitUntil:'networkidle'});
        const back=page.getByRole('link',{name:'Back to Settings',exact:true});await back.focus();
        assert.ok(await back.evaluate(el=>el===document.activeElement));await visibleHit(back);await page.screenshot({path:resolve(output,`${width}-${theme}-${path.slice(1)}-focused-viewport.png`)});await back.press('Tab');assert.ok(await page.evaluate(()=>document.activeElement?.tagName==='A'));await page.keyboard.press('Shift+Tab');assert.ok(await back.evaluate(el=>el===document.activeElement));await back.press('Enter');
        await page.waitForURL('**/settings');
        pass(`${width}/${theme}${path} public route, anchors, keyboard return`);
        await page.goto(base+path,{waitUntil:'networkidle'});await page.screenshot({path:resolve(output,`${width}-${theme}-${path.slice(1)}.png`),fullPage:true});
      }
      await page.goto(base+'/settings',{waitUntil:'networkidle'});
      await page.getByRole('link',{name:'Privacy Policy',exact:true}).click();await page.waitForURL('**/privacy');
      await page.getByRole('link',{name:'Back to Settings',exact:true}).click();
      await page.getByRole('link',{name:'Terms & Conditions',exact:true}).click();await page.waitForURL('**/terms');
      await page.getByRole('link',{name:'Back to Settings',exact:true}).click();
      const support=page.getByRole('link',{name:'Contact Support',exact:true});const uri=await support.getAttribute('href');
      assert.equal(new URL(uri).pathname,'causticrelay@gmail.com');assert.equal(new URL(uri).protocol,'mailto:');assert.ok(new URL(uri).searchParams.get('subject'));
      await support.evaluate(el=>el.addEventListener('click',event=>event.preventDefault())); // Simulate no external protocol handler; no email is sent.
      await visibleHit(support);await page.screenshot({path:resolve(output,`${width}-${theme}-support-viewport.png`)});await support.click();
      assert.ok(await page.getByText('causticrelay@gmail.com',{exact:true}).isVisible());
      assert.ok((await page.locator('main').innerText()).includes('If nothing opens'));
      assert.equal(await page.locator('a[href*="play.google.com/store/apps"]').count(),0);
      await page.getByRole('button',{name:'Clear favorites and history',exact:true}).click();
      const state=await page.evaluate(()=>JSON.parse(localStorage.getItem('pick-for-us-v1')).state);
      assert.deepEqual(state.preferences,{});assert.deepEqual(state.visits,[]);assert.deepEqual(state.sessionShown,[]);assert.equal(state.theme,theme);assert.deepEqual(state.location,{label:'Springfield fixture, Missouri',lat:37.2089,lon:-93.2923,source:'manual'});
      await page.reload({waitUntil:'networkidle'});await overflow(page);const reloaded=await page.evaluate(()=>JSON.parse(localStorage.getItem('pick-for-us-v1')).state);assert.deepEqual(reloaded.preferences,{});assert.deepEqual(reloaded.visits,[]);assert.deepEqual(reloaded.location,state.location);assert.equal(reloaded.theme,theme);
      for(const name of ['Include unknown prices','Never recommend 1-star places','Stretch radius if needed']) assert.equal(await page.getByRole('switch',{name,exact:true}).count(),1);
      pass(`${width}/${theme} Settings links, mailto no-handler fallback, reset scope, switch names`);
      await page.screenshot({path:resolve(output,`${width}-${theme}-settings.png`),fullPage:true});
      await context.close();
    }
  }
  const noJs=await browser.newContext({javaScriptEnabled:false});const p=await noJs.newPage();
  for(const path of ['/privacy','/terms']) {const r=await p.goto(base+path);assert.equal(r.status(),200);assert.ok((await p.locator('main').innerText()).includes('causticrelay@gmail.com'));assert.equal(await p.locator('video[src*="CAUSTIC_RELAY"]').count(),0);pass(path+' without JavaScript');}
  await noJs.close();
} catch(error) { checks.push({name:'terminal failure',status:'FAIL',error:String(error),stack:error.stack});process.exitCode=1; }
finally { await browser?.close();server.kill('SIGTERM');await writeFile(resolve(output,'server.log'),serverLog);await writeFile(resolve(output,'verdict.json'),JSON.stringify({at:new Date().toISOString(),status:process.exitCode?'FAIL':'PASS',buildProof:proof,checks,limitations:['Mocked external analytics/fonts/Grok requests; no real email delivery or installed Android mail-client verification.','Local preview route accessibility is not public production publication.','Physical Android and operational privacy facts remain separate gates.']},null,2)+'\n'); }
