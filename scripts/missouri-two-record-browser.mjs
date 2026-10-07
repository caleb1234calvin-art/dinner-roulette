import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdir,writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import { chromium } from "playwright";
import { assertBrowserBuild } from "./browser-build-proof.mjs";
import { appModuleLoader } from "./test-support/load-app-module.mjs";
assert.equal(process.env.CI,"true");
const proof=assertBrowserBuild();
const output=resolve("audit/browser-results/missouri-two-records");await mkdir(output,{recursive:true});
const control=resolve(output,"control.json"),origin="http://127.0.0.1:8097";
await writeFile(control,JSON.stringify({at:"2026-10-07T18:00:00Z"}));
const server=spawn(process.execPath,["scripts/with-app-env.mjs",process.execPath,"--import",resolve("scripts/test-support/missouri-two-record-preload.mjs"),"node_modules/vite/bin/vite.js","preview","--host","127.0.0.1","--port","8097","--strictPort"],{env:{...process.env,DATABASE_URL:"",MISSOURI_TWO_CONTROL:control},detached:true,stdio:["ignore","pipe","pipe"]});
let logs="",browser;server.stdout.on("data",d=>logs+=d);server.stderr.on("data",d=>logs+=d);
const verdict={passed:false,proof,publicProviderCalls:0,scenarios:[],errors:[]};
const {MISSOURI_2026_CLEARED_SEASONAL_CATALOG:rows}=appModuleLoader()("src/lib/date-night/missouri-2026-cleared-catalog.ts");
try{
 for(let i=0;i<100;i++){try{if((await fetch(origin)).ok)break;}catch { /* Server may not be ready or may already have exited. */ } await delay(100);}
 browser=await chromium.launch({headless:true,executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,args:["--no-sandbox","--disable-dev-shm-usage"]});
 for(const [index,row] of rows.entries()) for(const scenario of ["anything","category","open-now","ended","next-year","season-off"]){
  const at=scenario==="ended"?row.seasonalAvailability.endsAt:scenario==="next-year"?"2027-10-07T18:00:00Z":"2026-10-07T18:00:00Z";
  await writeFile(control,JSON.stringify({at}));
  const context=await browser.newContext({viewport:{width:index?320:390,height:844},reducedMotion:"reduce",serviceWorkers:"block"});
  await context.route("**/*",route=>new URL(route.request().url()).origin===origin?route.continue():route.abort());
  await context.addInitScript(({row,scenario,at})=>{
   const OriginalDate=Date;globalThis.Date=class extends OriginalDate{constructor(...args){super(...(args.length?args:[at]));}static now(){return new OriginalDate(at).getTime();}};
   sessionStorage.setItem("dinner-roulette-hint-seen","1");
   localStorage.setItem("pick-for-us-v1",JSON.stringify({version:0,state:{location:{lat:row.lat,lon:row.lon,label:row.name,source:"manual"},homeMode:"date-night",spookySeasonEnabled:scenario!=="season-off",dateNightFilters:{radiusMiles:15,activityTypes:scenario==="category"?row.activityTypes:["anything"],mood:50,openNowOnly:scenario==="open-now",favoritesOnly:false,reduceParks:false}}}));
  },{row,scenario,at});
  const page=await context.newPage();page.on("pageerror",error=>verdict.errors.push(error.message));
  await page.goto(origin,{waitUntil:"domcontentloaded"});
  await page.getByText("Finding date ideas near you…",{exact:true}).waitFor({state:"hidden",timeout:30000});
  const pick=page.getByRole("button",{name:"Pick our date",exact:true});await pick.waitFor();
  const visible=["anything","category"].includes(scenario);
  assert.equal(await pick.isDisabled(),!visible,`${row.id}:${scenario}`);
  if(visible){
   await page.getByRole("button",{name:"Give us options",exact:true}).click();
   await page.getByRole("heading",{name:row.name,exact:true}).waitFor();
   const text=await page.locator("[data-seasonal-visit-notes]").innerText();
   assert.ok(text.includes(index?"Shelter 1":"Approximate operator navigation"));
   await page.getByRole("button",{name:"Close options",exact:true}).click();
   await pick.click();await page.getByRole("heading",{name:row.name,exact:true}).waitFor({timeout:20000});
   const resultText=await page.locator("[data-seasonal-visit-notes]").innerText();
   assert.ok(resultText.includes(index?"14:00–16:00":"younger than 18"));
   const href=await page.getByRole("link",{name:/Directions · Google Maps/}).getAttribute("href");
   assert.equal(new URL(href).searchParams.get("destination"),`${row.lat},${row.lon}`);
   await page.screenshot({path:resolve(output,`${index}-${scenario}.png`),fullPage:true});
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   await page.getByRole("button",{name:"Close result",exact:true}).click();
   await pick.click();await page.getByRole("heading",{name:row.name,exact:true}).waitFor({timeout:20000});
   await page.getByRole("button",{name:"Close result",exact:true}).click();
  }
  verdict.scenarios.push({id:row.id,scenario,passed:true});await context.close();
 }
 assert.equal(verdict.errors.length,0);verdict.passed=true;
}catch(error){verdict.errors.push(error.stack);process.exitCode=1;}
finally{await browser?.close();try{process.kill(-server.pid,"SIGTERM");}catch { /* Server may not be ready or may already have exited. */ }await writeFile(resolve(output,"server.log"),logs);await writeFile(resolve(output,"verdict.json"),JSON.stringify(verdict,null,2));console.log(JSON.stringify(verdict,null,2));}
