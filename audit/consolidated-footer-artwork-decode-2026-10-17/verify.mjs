import { pathToFileURL } from "node:url";
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
const repo=path.resolve(process.env.FOOTER_REPO || '.');
const require=createRequire(path.join(repo,'package.json'));
const {chromium}=require('playwright');
const out=path.resolve(process.env.FOOTER_OUT || 'unified-footer-independent-2026-10-17/evidence');
fs.mkdirSync(out,{recursive:true});
const base=process.env.FOOTER_URL || 'http://127.0.0.1:8085';
assert.ok(['127.0.0.1','localhost'].includes(new URL(base).hostname));
const {assertBrowserBuild}=await import(pathToFileURL(path.join(repo,"scripts/browser-build-proof.mjs")));
const buildProof=assertBrowserBuild(repo);
assert.equal(buildProof.source.sha256,'5eaf48127e44d83b6c5a97ef76bec131874dcc99908f272196f584a90997af84');assert.equal(buildProof.source.files,542);
fs.writeFileSync(path.join(out,"build-proof.json"), JSON.stringify(buildProof,null,2));
const checks=[]; const errors=[];
const copy=["Pick For Us","by Caustic Relay","Independent application. Not affiliated with or endorsed by listed venues, delivery services, rideshare providers, mapping services or other third parties unless expressly stated.","External services maintain their own availability, transactions, terms and privacy practices.","Privacy Policy","Terms & Conditions","Support"];
const artworkManifest=JSON.parse(fs.readFileSync(path.join(repo,'src/lib/artwork/owner-attested-assets.json'),'utf8'));
const attestedImages=new Set(artworkManifest.assets.map(a=>a.src));
const git=(...a)=>execFileSync('git',a,{cwd:repo,encoding:'utf8'}).trim();
const binding={head:git('rev-parse','HEAD'),tree:git('rev-parse','HEAD^{tree}'),status:git('status','--porcelain'),base,repo,layoutTransport:'Browser external requests and same-origin /_serverFn/ RPC blocked before dispatch; home discovery is an explicit failure-state fixture, not live provider acceptance.',at:new Date().toISOString()};
assert.equal(binding.head,'29bec315b919535c9aeb3f7e8b1c9e3fa638e80d');assert.equal(binding.tree,'de43c3ee90ad31e5de678737be1eed61b6eb6d01');assert.equal(binding.status,'');
fs.writeFileSync(path.join(out,'binding-before.json'),JSON.stringify(binding,null,2));
const browser=await chromium.launch({headless:true,executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined,args:['--no-sandbox','--disable-dev-shm-usage']});
const sizes=[{width:320,height:844},{width:390,height:844}];
const cases=[['favorites-empty','/favorites','dinner',0],['favorites-long','/favorites','dinner',20],['history-empty','/history','dinner',0],['history-long','/history','dinner',20],['settings','/settings','dinner',0],['dinner','/','dinner',0],['date-night','/','date-night',0],['nightlife','/','nightlife',0],['privacy','/privacy','dinner',0],['terms','/terms','dinner',0],['history-raster','/history','dinner',1],['favorites-svg','/favorites','dinner',1],['favorites-duplicate-suppressed-raster','/favorites','dinner',2],['history-svg','/history','dinner',1],['favorites-unknown-label','/favorites','dinner',1],['history-unknown-label','/history','dinner',1]];
async function isolateLayoutTransport(route, blockedDiscovery){
 const url=new URL(route.request().url());
 if(url.origin!==new URL(base).origin)return route.abort('blockedbyclient');
 if(/^\/_serverFn(?:\/|$)/.test(url.pathname)){blockedDiscovery.push({path:url.pathname,method:route.request().method()});return route.abort('blockedbyclient');}
 return route.continue();
}
async function geometry(page){return page.evaluate(()=>{
 const f=document.querySelector('footer'),n=document.querySelector('nav[aria-label="Main"]');
 const rect=e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height,bottom:r.bottom,right:r.right}};
 const links=[...f.querySelectorAll('a')].map(el=>{const r=rect(el),hit=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);return {...r,text:el.textContent.trim(),href:el.getAttribute('href'),hit:hit===el||el.contains(hit)}});
 const ancestors=[];for(let e=f;e;e=e.parentElement){const s=getComputedStyle(e);ancestors.push({tag:e.tagName,position:s.position,paddingBottom:s.paddingBottom})}
 return {footer:rect(f),nav:rect(n),links,ancestors,scrollY,scrollHeight:document.documentElement.scrollHeight,scrollWidth:document.documentElement.scrollWidth,innerWidth,innerHeight,footerText:f.innerText,theme:document.documentElement.dataset.theme};
});}
async function contrast(page){return page.locator('footer p,footer a').evaluateAll(els=>{
 const c=document.createElement('canvas');c.width=c.height=1;const x=c.getContext('2d',{willReadFrequently:true});
 const rgba=s=>{x.clearRect(0,0,1,1);x.fillStyle=s;x.fillRect(0,0,1,1);return [...x.getImageData(0,0,1,1).data]};
 const over=(a,b)=>{let q=a[3]/255,r=b[3]/255,t=q+r*(1-q);return t?[...a.slice(0,3).map((v,i)=>(v*q+b[i]*r*(1-q))/t),t*255]:[0,0,0,0]};
 const lum=a=>a.slice(0,3).map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0);
 return els.filter(el=>el.textContent.trim()).map(el=>{let bg=[0,0,0,0];for(let p=el;p;p=p.parentElement){const s=getComputedStyle(p);if(Number(s.opacity)!==1||s.backgroundImage!=='none')throw Error('Unsupported opacity/background image: '+p.tagName);bg=over(bg,rgba(s.backgroundColor));if(bg[3]>=254.99)break}if(bg[3]<254.99)throw Error('No opaque background');let fg=over(rgba(getComputedStyle(el).color),bg),a=lum(fg),b=lum(bg);return {text:el.textContent.trim(),ratio:(Math.max(a,b)+.05)/(Math.min(a,b)+.05),foreground:fg,background:bg}});
});}
// Test-only bundle of the actual overlay components. React lifecycle, markup,
// controls and footer are real; venue rows and store callbacks are synthetic.
async function preparePortalFixture(){
 const {rolldown}=await import(require.resolve('rolldown'));
 const ts=require('typescript');
 const entry=`import React from 'react';import{createRoot}from'react-dom/client';import{ResultOverlay}from${JSON.stringify(path.join(repo,'src/components/result-overlay.tsx'))};import{OptionsOverlay}from${JSON.stringify(path.join(repo,'src/components/options-overlay.tsx'))};import{DateNightPlanOverlay}from${JSON.stringify(path.join(repo,'src/components/date-night-plan-overlay.tsx'))};let root;window.renderFooterPortalFixture=(kind,mode,theme,rows,opts={})=>{window.footerFixtureState={theme,spookySeasonEnabled:!!opts.halloween,preferences:{},toggleFavorite(){},recordVisit(){}};window.footerFixtureActions=[];root??=createRoot(document.getElementById('fixture'));const action=name=>()=>window.footerFixtureActions.push(name);const close=()=>{window.footerFixtureActions.push('close');root.render(null)};const props=kind==='plan'?{plan:rows,onClose:close,onReplan:action('replan')}:kind==='options'?{restaurants:rows,mode,onClose:close,onSelect:action('select'),onShuffle:action('shuffle'),onNotTonight:action('not-tonight')}:{restaurant:rows[0],reelNames:[],skipSpin:!opts.spin,mode,onClose:close,onReroll:action('reroll'),onNotTonight:action('not-tonight')};root.render(React.createElement(kind==='plan'?DateNightPlanOverlay:kind==='options'?OptionsOverlay:ResultOverlay,props))};`;
 const build=await rolldown({input:'footer-portal-fixture',plugins:[{name:'actual-footer-portals',resolveId(id){if(id==='react'||id==='react-dom/client')return require.resolve(id);if(id==='footer-portal-fixture')return '\0footer-portal-fixture';if(id==='@/lib/store')return '\0footer-store-fixture';if(id.startsWith('@/')){const base=path.join(repo,'src',id.slice(2));const file=[base,base+'.ts',base+'.tsx',base+'.json'].find(p=>fs.existsSync(p)&&fs.statSync(p).isFile());if(!file)throw Error('Fixture cannot resolve '+id);return file}},load(id){if(id==='\0footer-portal-fixture')return entry;if(id==='\0footer-store-fixture')return 'export const useAppStore=selector=>selector(window.footerFixtureState);'},transform(code,id){if(/\.tsx?$/.test(id))return{code:ts.transpileModule(code,{compilerOptions:{jsx:ts.JsxEmit.ReactJSX,target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}}).outputText}}}],transform:{define:{'process.env.NODE_ENV':JSON.stringify('production')}}});
 const generated=await build.generate({format:'iife'});await build.close();const chunk=generated.output.find(o=>o.type==='chunk');assert.equal(chunk.imports.length,0,'Portal bundle must not rely on missing external globals');const js=chunk.code;
 fs.writeFileSync(path.join(out,'actual-portal-fixture.js'),js);
 const assets=path.join(repo,'.vercel/output/static/assets');const css=fs.readdirSync(assets).filter(f=>f.endsWith('.css')).map(f=>fs.readFileSync(path.join(assets,f),'utf8')).join('\n');
 return {js,css};
}
const fixtureRow=(i,type='haunted-house')=>({id:'date-night-footer-fixture-'+i,name:'Footer test venue '+i,lat:37.2,lon:-93.2,address:'Synthetic test address',cuisines:['american'],cuisineLabel:type,priceLevel:2,rating:null,reviewCount:null,openingHours:null,phone:null,website:null,isChain:false,photoKey:'american',source:'catalog',distanceMiles:2,isOpen:false,hoursKnown:false,closesLabel:null,closingSoon:false,activityTypes:[type],moodLevel:2,venueTypes:['bar'],energyLevel:2,availability:{status:'hours-unknown',season:'ordinary',label:'Hours unconfirmed',browseEligible:true,openNowEligible:false,revalidationDue:false},seasonalVisitNotes:['Fixture-specific venue warning must remain visible.']});
async function checkPortalFixtures(browser){
 const fixture=await preparePortalFixture();
 for(const viewport of sizes)for(const theme of ['light','dark'])for(const [kind,mode,variant='mixed'] of [['options','date-night','raster'],['plan','date-night','mixed']]){
  const id=`portal-${viewport.width}x${viewport.height}-${theme}-${kind}-${mode}-${variant}`,result={id,viewport,theme,kind,mode,variant,fixture:true,status:'FAIL'};
  const context=await browser.newContext({viewport,reducedMotion:variant==='spin'?'no-preference':'reduce'});const page=await context.newPage();page.setDefaultTimeout(12000);const pageErrors=[];page.on('pageerror',e=>pageErrors.push(String(e)));
  const assetResponses=[],assetFailures=[];page.on('response',r=>{if(r.request().resourceType()==='image')assetResponses.push({url:r.url(),status:r.status(),contentType:r.headers()['content-type']});});page.on('requestfailed',r=>{if(r.resourceType()==='image')assetFailures.push({url:r.url(),failure:r.failure()});});
  const fixtureURL=base+'/__footer-browser-fixture';
  const blockedDiscovery=[],escapedDiscovery=[];context.on('requestfinished',request=>{if(/^\/_serverFn(?:\/|$)/.test(new URL(request.url()).pathname))escapedDiscovery.push({url:request.url(),method:request.method()})});await context.route('**/*',route=>isolateLayoutTransport(route,blockedDiscovery));
  await context.route(fixtureURL,route=>route.fulfill({contentType:'text/html',body:`<!doctype html><html data-theme="${theme}" class="${mode==='nightlife'?'nightlife-active':mode==='date-night'?'date-night-active':''} ${variant==='halloween'?'halloween-date-night-active':''}"><head><style>${fixture.css}</style></head><body class="bg-bg text-fg"><div id="fixture"></div></body></html>`}));
  try{
   await page.goto(fixtureURL);await page.addScriptTag({content:fixture.js});const rows=variant==='empty'?[]:variant==='svg'?[fixtureRow(1),fixtureRow(2,'pumpkin-patch')]:variant==='raster'?[fixtureRow(1,'escape-room'),fixtureRow(2,'park')]:[fixtureRow(1),fixtureRow(2,'park')];
   if(variant==='no-category')for(const row of rows)row.venueTypes=[];
   await page.evaluate(({kind,mode,theme,rows,variant})=>window.renderFooterPortalFixture(kind,mode,theme,rows,{halloween:variant==='halloween',spin:variant==='spin'}),{kind,mode,theme,rows,variant});
   if(variant==='spin'){await page.getByText('Choosing',{exact:true}).waitFor();assert.equal(await page.locator('footer').count(),0,'No credit/footer while no content artwork is shown during spin');await page.screenshot({path:path.join(out,id+'-spin.png')});result.spinFooterExcluded=true;}
   await page.locator('footer').waitFor();assert.equal(await page.locator('footer').count(),1);
   const scrollRoot=page.locator('body > div.fixed');assert.equal(await scrollRoot.count(),1);
   if(mode==='date-night'&&rows.length){
    assert.ok((await scrollRoot.innerText()).includes('Check current hours, admission, and weather before you go.'));
    for(const summary of await scrollRoot.locator('[data-seasonal-visit-notes] summary').all())await summary.click();
    assert.ok((await scrollRoot.innerText()).includes('Hours unconfirmed'));
    assert.ok(!(await scrollRoot.innerText()).includes('Fixture-specific venue warning must remain visible.'),'Raw audit notes must stay private');
   }
   result.imageReadiness=await scrollRoot.locator('img').evaluateAll(async imgs=>Promise.all(imgs.map(async img=>{let decoded=false,error=null;try{await Promise.race([img.decode(),new Promise((_,reject)=>setTimeout(()=>reject(new Error('decode timeout 15000ms')),15000))]);decoded=true;}catch(e){error=String(e)}return{src:img.src,complete:img.complete,naturalWidth:img.naturalWidth,naturalHeight:img.naturalHeight,decoded,error};})));
   for(const img of result.imageReadiness){assert.ok(img.decoded&&img.complete&&img.naturalWidth>0&&img.naturalHeight>0,JSON.stringify(img));}
   await scrollRoot.evaluate(el=>{el.scrollTop=0});await page.screenshot({path:path.join(out,id+'-decoded-top.png')});
   await scrollRoot.evaluate(el=>{el.scrollTop=el.scrollHeight});
   result.geometry=await page.locator('footer').evaluate(el=>{const r=el.getBoundingClientRect(),root=el.closest('.fixed'),rr=root.getBoundingClientRect();return {footer:{x:r.x,y:r.y,bottom:r.bottom,width:r.width,height:r.height},root:{height:rr.height,scrollHeight:root.scrollHeight,scrollTop:root.scrollTop},overflow:document.documentElement.scrollWidth>innerWidth,position:getComputedStyle(el).position}});
   assert.ok(!result.geometry.overflow);assert.ok(result.geometry.footer.y>=0&&result.geometry.footer.bottom<=viewport.height);assert.equal(result.geometry.position,'static');
   const text=await page.locator('footer').innerText();for(const line of copy)assert.ok(text.includes(line));
   const images=await scrollRoot.locator('img').evaluateAll(imgs=>imgs.map(i=>new URL(i.src).pathname));const credit=images.some(src=>attestedImages.has(src));result.images=images;result.expectedCredit=credit;
   assert.equal(text.includes('Visual artwork created with Grok'),credit);assert.equal(text.includes('Creative direction and final refinements by Caustic Relay.'),credit);
   if(kind==='result'&&mode==='nightlife')assert.ok((await scrollRoot.innerText()).includes('Pick For Us does not sell alcohol, accept wagers, or provide gambling services.'));
   result.contrast=await contrast(page);for(const v of result.contrast)assert.ok(v.ratio>=4.5);
   const links=page.locator('footer a');for(const link of await links.all()){const hit=await link.evaluate(el=>{const r=el.getBoundingClientRect(),hit=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);return{height:r.height,hit:hit===el||el.contains(hit)}});assert.ok(hit.height>=44&&hit.hit)}
   await page.screenshot({path:path.join(out,id+'-bottom.png')});await page.keyboard.press('Tab');await links.first().focus();assert.ok(await links.first().evaluate(el=>el===document.activeElement));result.focus=await links.first().evaluate(el=>({style:getComputedStyle(el).outlineStyle,width:getComputedStyle(el).outlineWidth,color:getComputedStyle(el).outlineColor}));assert.equal(result.focus.style,'solid');assert.ok(parseFloat(result.focus.width)>=2);await page.screenshot({path:path.join(out,id+'-focus.png')});
   await links.first().press('Tab');assert.ok(await links.nth(1).evaluate(el=>el===document.activeElement));await links.nth(1).press('Tab');assert.ok(await links.nth(2).evaluate(el=>el===document.activeElement));
   const control=kind==='options'?page.getByRole('button',{name:'Shuffle options',exact:true}):kind==='plan'?page.getByRole('button',{name:'Plan a different night',exact:true}):page.getByRole('button',{name:'Not tonight',exact:false});
   await control.click();assert.ok((await page.evaluate(()=>window.footerFixtureActions)).includes(kind==='options'?'shuffle':kind==='plan'?'replan':'not-tonight'));
   const legalTarget=theme==='light'?'/privacy':'/terms';await page.locator(`footer a[href="${legalTarget}"]`).click();await page.waitForURL('**'+legalTarget);await page.getByRole('heading',{level:1,name:theme==='light'?'Privacy Policy':'Terms & Conditions',exact:true}).waitFor();result.legalExit=legalTarget;
   assert.deepEqual(pageErrors,[]);assert.deepEqual(escapedDiscovery,[],'No discovery RPC may complete against the server in a controlled layout fixture');result.status='PASS';
  }catch(e){result.error=String(e);result.pageErrors=pageErrors;errors.push({id,error:String(e)});await page.screenshot({path:path.join(out,id+'-failure.png')}).catch(()=>{});}
  result.assetResponses=assetResponses;result.assetFailures=assetFailures;result.blockedDiscovery=blockedDiscovery;result.escapedDiscovery=escapedDiscovery;checks.push(result);fs.writeFileSync(path.join(out,'results.json'),JSON.stringify({binding,buildProof,checks,errors},null,2));console.log(result.status,id,result.error||'');await context.close();
 }
}

try{await checkPortalFixtures(browser);}finally{await browser.close();fs.writeFileSync(path.join(out,'binding-after.json'),JSON.stringify({head:git('rev-parse','HEAD'),tree:git('rev-parse','HEAD^{tree}'),status:git('status','--porcelain'),at:new Date().toISOString()},null,2));}
console.log(JSON.stringify({passed:checks.filter(c=>c.status==='PASS').length,total:checks.length,errors},null,2));process.exitCode=errors.length?1:0;
