import { assertBrowserBuild } from "./browser-build-proof.mjs";
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
const buildProof=assertBrowserBuild();
fs.writeFileSync(path.join(out,"build-proof.json"), JSON.stringify(buildProof,null,2));
const checks=[]; const errors=[];
const copy=["Pick For Us","by Caustic Relay","Independent application. Not affiliated with or endorsed by listed venues, delivery services, rideshare providers, mapping services or other third parties unless expressly stated.","External services maintain their own availability, transactions, terms and privacy practices.","Privacy Policy","Terms & Conditions","Support"];
const artworkManifest=JSON.parse(fs.readFileSync(path.join(repo,'src/lib/artwork/owner-attested-assets.json'),'utf8'));
const attestedImages=new Set(artworkManifest.assets.map(a=>a.src));
const git=(...a)=>execFileSync('git',a,{cwd:repo,encoding:'utf8'}).trim();
const binding={head:git('rev-parse','HEAD'),tree:git('rev-parse','HEAD^{tree}'),status:git('status','--porcelain'),base,repo,at:new Date().toISOString()};
fs.writeFileSync(path.join(out,'binding-before.json'),JSON.stringify(binding,null,2));
const browser=await chromium.launch({headless:true,executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined,args:['--no-sandbox','--disable-dev-shm-usage']});
const sizes=[{width:320,height:844},{width:390,height:844},{width:512,height:844},{width:768,height:1024},{width:1024,height:768}];
const cases=[['favorites-empty','/favorites','dinner',0],['favorites-long','/favorites','dinner',20],['history-empty','/history','dinner',0],['history-long','/history','dinner',20],['settings','/settings','dinner',0],['dinner','/','dinner',0],['date-night','/','date-night',0],['nightlife','/','nightlife',0],['privacy','/privacy','dinner',0],['terms','/terms','dinner',0],['history-raster','/history','dinner',1],['favorites-svg','/favorites','dinner',1],['favorites-duplicate-suppressed-raster','/favorites','dinner',2],['history-svg','/history','dinner',1],['favorites-unknown-label','/favorites','dinner',1],['history-unknown-label','/history','dinner',1]];
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
 for(const viewport of sizes)for(const theme of ['light','dark'])for(const [kind,mode,variant='mixed'] of [['result','dinner'],['result','nightlife'],['result','date-night','svg'],['result','date-night','raster'],['options','dinner'],['options','nightlife'],['options','date-night'],['options','date-night','svg'],['options','date-night','raster'],['options','date-night','empty'],['plan','date-night'],['plan','date-night','svg'],['result','date-night','halloween'],['options','date-night','halloween'],['result','nightlife','no-category'],['options','nightlife','no-category'],['result','dinner','spin']]){
  const id=`portal-${viewport.width}x${viewport.height}-${theme}-${kind}-${mode}-${variant}`,result={id,viewport,theme,kind,mode,variant,fixture:true,status:'FAIL'};
  const context=await browser.newContext({viewport,reducedMotion:variant==='spin'?'no-preference':'reduce'});const page=await context.newPage();page.setDefaultTimeout(12000);const pageErrors=[];page.on('pageerror',e=>pageErrors.push(String(e)));
  const fixtureURL=base+'/__footer-browser-fixture';
  await context.route('**/*',route=>new URL(route.request().url()).origin===new URL(base).origin?route.continue():route.abort());
  await context.route(fixtureURL,route=>route.fulfill({contentType:'text/html',body:`<!doctype html><html data-theme="${theme}"><head><style>${fixture.css}</style></head><body class="bg-bg text-fg"><div id="fixture"></div></body></html>`}));
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
   await scrollRoot.evaluate(el=>{el.scrollTop=el.scrollHeight});
   result.geometry=await page.locator('footer').evaluate(el=>{const r=el.getBoundingClientRect(),root=el.closest('.fixed'),rr=root.getBoundingClientRect();return {footer:{x:r.x,y:r.y,bottom:r.bottom,width:r.width,height:r.height},root:{height:rr.height,scrollHeight:root.scrollHeight,scrollTop:root.scrollTop},overflow:document.documentElement.scrollWidth>innerWidth,position:getComputedStyle(el).position}});
   assert.ok(!result.geometry.overflow);assert.ok(result.geometry.footer.y>=0&&result.geometry.footer.bottom<=viewport.height);assert.equal(result.geometry.position,'static');
   const text=await page.locator('footer').innerText();for(const line of copy)assert.ok(text.includes(line));
   const images=await scrollRoot.locator('img').evaluateAll(imgs=>imgs.map(i=>new URL(i.src).pathname));const credit=images.some(src=>attestedImages.has(src));result.images=images;result.expectedCredit=credit;
   assert.equal(text.includes('Visual artwork created with Grok'),credit);assert.equal(text.includes('Creative direction and final refinements by Caustic Relay.'),credit);
   if(kind==='result'&&mode==='nightlife')assert.ok((await scrollRoot.innerText()).includes('Pick For Us does not sell alcohol, accept wagers, or provide gambling services.'));
   result.contrast=await contrast(page);for(const v of result.contrast)assert.ok(v.ratio>=4.5);
   const links=page.locator('footer a');for(const link of await links.all()){const hit=await link.evaluate(el=>{const r=el.getBoundingClientRect(),hit=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);return{height:r.height,hit:hit===el||el.contains(hit)}});assert.ok(hit.height>=44&&hit.hit)}
   await page.screenshot({path:path.join(out,id+'-bottom.png')});await links.first().focus();assert.ok(await links.first().evaluate(el=>el===document.activeElement));await page.screenshot({path:path.join(out,id+'-focus.png')});
   await links.first().press('Tab');assert.ok(await links.nth(1).evaluate(el=>el===document.activeElement));await links.nth(1).press('Tab');assert.ok(await links.nth(2).evaluate(el=>el===document.activeElement));
   const control=kind==='options'?page.getByRole('button',{name:'Shuffle options',exact:true}):kind==='plan'?page.getByRole('button',{name:'Plan a different night',exact:true}):page.getByRole('button',{name:'Not tonight',exact:false});
   await control.click();assert.ok((await page.evaluate(()=>window.footerFixtureActions)).includes(kind==='options'?'shuffle':kind==='plan'?'replan':'not-tonight'));
   const legalTarget=theme==='light'?'/privacy':'/terms';await page.locator(`footer a[href="${legalTarget}"]`).click();await page.waitForURL('**'+legalTarget);await page.getByRole('heading',{level:1,name:theme==='light'?'Privacy Policy':'Terms & Conditions',exact:true}).waitFor();result.legalExit=legalTarget;
   assert.deepEqual(pageErrors,[]);result.status='PASS';
  }catch(e){result.error=String(e);result.pageErrors=pageErrors;errors.push({id,error:String(e)});await page.screenshot({path:path.join(out,id+'-failure.png')}).catch(()=>{});}
  checks.push(result);fs.writeFileSync(path.join(out,'results.json'),JSON.stringify({binding,buildProof,checks,errors},null,2));console.log(result.status,id,result.error||'');await context.close();
 }
}
async function checkSafeArea(browser){
 for(const viewport of sizes)for(const theme of ['light','dark'])for(const route of ['/favorites','/']){
  const id=`safe-area-${viewport.width}x${viewport.height}-${theme}-${route==='/'?'dinner':'favorites'}`,result={id,viewport,theme,route,simulatedSafeAreaBottom:34,status:'FAIL'};
  const context=await browser.newContext({viewport,reducedMotion:'reduce'}),page=await context.newPage();page.setDefaultTimeout(12000);
  await context.addInitScript(theme=>{sessionStorage.setItem('dinner-roulette-hint-seen','1');localStorage.setItem('pick-for-us-v1',JSON.stringify({state:{theme,homeMode:'dinner',preferences:{},visits:[]},version:0}))},theme);
  await context.route('**/*',r=>new URL(r.request().url()).origin===new URL(base).origin?r.continue():r.abort());
  try{
   const cdp=await context.newCDPSession(page);await cdp.send('Emulation.setSafeAreaInsetsOverride',{insets:{top:0,left:0,right:0,bottom:34}});
   await page.goto(base+route,{waitUntil:'networkidle'});await page.locator('footer').waitFor();await page.evaluate(()=>scrollTo(0,document.documentElement.scrollHeight));
   result.geometry=await geometry(page);result.navPadding=await page.locator('nav[aria-label="Main"]').evaluate(el=>getComputedStyle(el).paddingBottom);
   assert.equal(result.navPadding,'34px','CDP safe-area override must actually affect CSS');assert.ok(result.geometry.footer.bottom<=result.geometry.nav.y);
   for(const link of result.geometry.links)assert.ok(link.hit,'Safe-area overlay obstruction');assert.ok(result.geometry.scrollWidth<=viewport.width);
   await page.screenshot({path:path.join(out,id+'.png')});result.status='PASS';
  }catch(e){result.error=String(e);errors.push({id,error:String(e)});await page.screenshot({path:path.join(out,id+'-failure.png')}).catch(()=>{});}
  checks.push(result);fs.writeFileSync(path.join(out,'results.json'),JSON.stringify({binding,buildProof,checks,errors},null,2));console.log(result.status,id,result.error||'');await context.close();
 }
}

try{
for(const viewport of sizes)for(const theme of ['light','dark'])for(const [name,route,mode,count] of cases){
 const id=`${viewport.width}x${viewport.height}-${theme}-${name}`;
 const context=await browser.newContext({viewport,reducedMotion:'reduce'});
 await context.route('**/*',r=>{const u=new URL(r.request().url());if(u.origin!==new URL(base).origin)return r.abort();return r.continue()});
 await context.addInitScript(({theme,mode,count,name})=>{
 sessionStorage.setItem('dinner-roulette-hint-seen','1');
 const prefs={},visits=[];for(let i=0;i<count;i++){const id='footer-fixture-'+i;prefs[id]={restaurantId:id,name:'Fixture restaurant '+String(i).padStart(2,'0'),favorite:true,cuisineLabel:'American'};visits.push({id:'v'+i,restaurantId:id,restaurantName:'Fixture restaurant '+i,date:'2026-10-16T12:00:00Z',cuisineLabel:'American'})}
 if(name==='history-svg'||name==='history-unknown-label')visits[0]={...visits[0],restaurantId:'date-night-footer-test',cuisineLabel:name==='history-svg'?'Haunted house':'Unknown category'};
 if(name==='favorites-unknown-label'){for(const key of Object.keys(prefs))delete prefs[key];prefs.a={restaurantId:'date-night-footer-unknown',name:'Unknown category fixture',cuisineLabel:'Unknown category',favorite:true};}
 if(name==='history-raster')visits[0]={...visits[0],restaurantId:'date-night-footer-test',cuisineLabel:'Park'};
 if(name==='favorites-svg'||name==='favorites-duplicate-suppressed-raster'){
  for(const key of Object.keys(prefs))delete prefs[key];
  prefs.a={restaurantId:'date-night-footer-test',name:'A retained SVG fixture',cuisineLabel:'Haunted house',favorite:true};
  if(name==='favorites-duplicate-suppressed-raster')prefs.z={restaurantId:'date-night-footer-test',name:'Z suppressed raster fixture',cuisineLabel:'Park',favorite:true};
 }
 localStorage.setItem('pick-for-us-v1',JSON.stringify({state:{theme,homeMode:mode,location:{label:'Springfield fixture, Missouri',lat:37.2089,lon:-93.2923,source:'manual'},preferences:prefs,visits,exclusions:[],sessionShown:[]},version:0}));
 },{theme,mode,count,name});
 const page=await context.newPage();page.setDefaultTimeout(12000);const pageErrors=[];page.on('pageerror',e=>pageErrors.push(String(e)));
 const result={id,viewport,theme,name,route,mode,count,status:'FAIL'};
 try{
 const response=await page.goto(base+route,{waitUntil:'networkidle'});assert.equal(response.status(),200);
 await page.locator('footer').waitFor();await page.waitForTimeout(180);
 if(route==='/favorites'||route==='/history')assert.equal(await page.locator('main li').count(),name==='favorites-duplicate-suppressed-raster'?1:count,'Rendered fixture row count');
 if(route==='/')assert.equal(await page.getByRole('button',{name:mode==='date-night'?'Date Night':mode==='nightlife'?'Nightlife':'Dinner',exact:true}).getAttribute('aria-pressed'),'true','Expected home mode rendered');
 assert.equal(await page.locator('footer').count(),1);
 const top=await geometry(page);await page.evaluate(()=>window.scrollTo(0,document.documentElement.scrollHeight));await page.waitForTimeout(80);const bottom=await geometry(page);result.top=top;result.bottom=bottom;
 assert.equal(bottom.theme,theme);
 assert.ok(bottom.scrollWidth<=viewport.width+1,'Horizontal overflow');
 assert.ok(bottom.ancestors.every(a=>!['fixed','sticky','absolute'].includes(a.position)),'Footer or ancestor removed from normal flow');
 assert.ok(bottom.footer.y>=-1,'Footer top outside viewport at end');
 assert.ok(bottom.footer.bottom<=bottom.nav.y+1,`Footer obscured by navigation: ${bottom.footer.bottom} > ${bottom.nav.y}`);
 assert.ok(Math.abs((top.footer.y-bottom.footer.y)-bottom.scrollY)<2,'Footer does not flow with document scroll');
 for(const text of copy)assert.ok(bottom.footerText.includes(text),'Missing required copy '+text);
 const renderedImages=await page.locator('body img').evaluateAll(images=>images.filter(i=>i.getBoundingClientRect().width>0&&i.getBoundingClientRect().height>0).map(i=>new URL(i.src).pathname));
 const expectedCredit=renderedImages.some(src=>attestedImages.has(src));result.renderedImages=renderedImages;result.expectedCredit=expectedCredit;
 assert.equal(bottom.footerText.includes('Visual artwork created with Grok'),expectedCredit,'Artwork credit must match rendered attested images');
 assert.equal(bottom.footerText.includes('Creative direction and final refinements by Caustic Relay.'),expectedCredit,'Refinement credit must match rendered attested images');
 const hrefs=bottom.links.map(a=>a.href);assert.ok(hrefs.includes('/privacy'));assert.ok(hrefs.includes('/terms'));assert.ok(hrefs.some(x=>x?.startsWith('mailto:causticrelay@gmail.com')));
 for(const link of bottom.links){assert.ok(link.hit,'Link obstructed '+link.text);assert.ok(link.x>=-1&&link.right<=viewport.width+1,'Link clipped '+link.text);assert.ok(link.height>=24,'Link under 24px '+link.text)}
 assert.equal(await page.locator('a[href*="play.google.com/store/apps"]').count(),0);
 result.contrast=await contrast(page);assert.ok(result.contrast.length);for(const v of result.contrast)assert.ok(v.ratio>=4.5,'Footer contrast '+JSON.stringify(v));
 await page.screenshot({path:path.join(out,id+'-bottom.png')});
 if(['favorites-empty','history-long','privacy'].includes(name))await page.screenshot({path:path.join(out,id+'-full.png'),fullPage:true});
 const links=page.locator('footer a');await links.first().focus();for(let i=0;i<await links.count();i++){assert.ok(await links.nth(i).evaluate(el=>el===document.activeElement),'Keyboard order');if(i===0){result.focus=await links.nth(i).evaluate(el=>{const s=getComputedStyle(el);return {outline:s.outline,boxShadow:s.boxShadow}});await page.screenshot({path:path.join(out,id+'-focus.png')})}await page.keyboard.press('Tab')}
 if(route==='/privacy'||route==='/terms'){const text=await page.locator('main').innerText();assert.ok(text.includes('Not yet published or effective'));assert.ok(text.includes('No previous published versions'));}
 if(name==='settings'){
  for(const [href,title] of [['/privacy','Privacy Policy'],['/terms','Terms & Conditions']]){
   await page.locator(`footer a[href="${href}"]`).click();await page.waitForURL('**'+href);await page.getByRole('heading',{level:1,name:title,exact:true}).waitFor();await page.goto(base+'/settings',{waitUntil:'networkidle'});
  }
  result.footerLinkNavigation='Privacy and Terms activated successfully';
 }
 assert.deepEqual(pageErrors,[]);result.status='PASS';
 }catch(e){result.error=String(e);result.pageErrors=pageErrors;errors.push({id,error:String(e)});await page.screenshot({path:path.join(out,id+'-failure.png'),fullPage:true}).catch(()=>{});}
 checks.push(result);fs.writeFileSync(path.join(out,'results.json'),JSON.stringify({binding,buildProof,checks,errors},null,2));console.log(result.status,id,result.error||'');await context.close();
}
await checkPortalFixtures(browser);
await checkSafeArea(browser);
}finally{await browser.close();fs.writeFileSync(path.join(out,'binding-after.json'),JSON.stringify({head:git('rev-parse','HEAD'),tree:git('rev-parse','HEAD^{tree}'),status:git('status','--porcelain'),at:new Date().toISOString()},null,2));}
console.log(JSON.stringify({passed:checks.filter(c=>c.status==='PASS').length,total:checks.length,errors},null,2));process.exitCode=errors.length?1:0;
