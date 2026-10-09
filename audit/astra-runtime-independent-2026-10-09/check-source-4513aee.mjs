import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { appModuleLoader } from '../repo/scripts/test-support/load-app-module.mjs';
const repo='/workspace/scratch/45a2c39f129e/repo';
const out='/workspace/scratch/45a2c39f129e/runtime-independent-review';
process.chdir(repo);
const head='4513aee7de0afe55e0f0fa061c1ec5f6af4fa412', base='979d83aede9d66163e1ebaed9ad5b219cb637882';
const git=(...args)=>execFileSync('git',args,{cwd:repo,encoding:'utf8'}).trim();
assert.equal(git('rev-parse','HEAD'),head);
assert.equal(git('rev-parse',`${head}^{tree}`),'7323e271b5ecf23fdf60f8c4a98f8fffc564137c');
assert.equal(git('status','--porcelain'),'');
const digest=x=>createHash('sha256').update(x).digest('hex');
const json=path=>JSON.parse(readFileSync(resolve(repo,path),'utf8'));
const clone=x=>JSON.parse(JSON.stringify(x));
const load=appModuleLoader(), report={head,tree:git('rev-parse',`${head}^{tree}`),base,parent:git('rev-parse',`${head}^`),verifiedAt:new Date().toISOString(),inputs:[],recordChecks:[],prior32:[],findings:[]};
const inputs=[
 ['audit/astra-eleven-2026-10-09/Nine-Preimport-Eligible-Author-Subset-R2.json',null,'463e5809612f0e7c0ea5c5a32d08cbb0ef186034b6866cb37496b4e990ed393c'],
 ['audit/astra-eleven-2026-10-09/Independent-Delta5-R2-Final-Eligible-Subset.json',null,'bf3b0d90d045751e2539b094b3950842044a6e9703a4aca2d333540a713cfc7c'],
 ['audit/astra-commercial-2026-10-09/Commercial-Holds-Independent-Eligible-R1.json','../research/independent-review/Commercial-Holds-Independent-Eligible-R1.json'],
 ['audit/astra-commercial-2026-10-09/Commercial-Feemster-Independent-Eligible-R2.json','../research/independent-review/Commercial-Feemster-Independent-Eligible-R2.json'],
 ['audit/astra-delta-2026-10-09/Delta6-Independent-Eligible-R2.json','../research/independent-review/Delta6-Independent-Eligible-R2.json'],
 ['audit/astra-delta-2026-10-09/Delta6-Independent-Final-R2.json','../research/independent-review/Delta6-Independent-Final-R2.json'],
];
for(const [path,comparison,expected] of inputs){const sha=digest(readFileSync(path));assert.equal(sha,expected??digest(readFileSync(comparison)));report.inputs.push({path,sha256:sha,verdict:'EXACT MATCH'});}
const parts=['eleven','commercial','delta'];
const rows=parts.flatMap(part=>load(`src/lib/date-night/missouri-2026-astra-${part}-catalog.ts`)[`MISSOURI_2026_ASTRA_${part.toUpperCase()}_CATALOG`]);
const rawRows=parts.flatMap(part=>load(`src/lib/date-night/missouri-2026-astra-${part}-catalog.ts`)[`MISSOURI_2026_ASTRA_${part.toUpperCase()}_LISTINGS`]);
const manifests=parts.flatMap(part=>json(`audit/astra-${part}-2026-10-09/Implementation-Projection-Manifest.json`).records);
const {seasonalPresentation}=load('src/lib/date-night/seasonal-presentation.ts');
const {getCuratedSeasonalPlace,applyCuratedSeasonalPolicy}=load('src/lib/date-night/curated-policy.ts');
const {directionsUrl}=load('src/lib/location/maps.ts');
const {uberRideTarget}=load('src/lib/location/ride-target.ts');
assert.equal(rows.length,20);assert.equal(new Set(rows.map(x=>x.id)).size,20);
for(const row of rows){const id=row.seasonalListing.recordId,m=manifests.find(x=>x.recordId===id),raw=rawRows.find(x=>x.id===row.id),s=row.seasonalListing,a=row.seasonalAvailability;
 assert.ok(m);assert.deepEqual(clone(raw),m.projection??m.runtimeProjection);assert.deepEqual(clone(seasonalPresentation(row)),m.presentation);
 assert.equal(getCuratedSeasonalPlace(row.id),row);assert.equal(s.contract,'ListingCompletenessV1');assert.equal(s.seasonYear,2026);assert.equal(a.seasonYear,2026);assert.equal(s.timeZone,'America/Chicago');assert.equal(a.timeZone,s.timeZone);assert.equal(a.openNowPolicy,'never');assert.equal(row.openingHours,null);assert.equal(a.listingExpiresAt,s.listingExpiresAt);
 assert.equal(s.directionsTarget.kind,'visitor-address');assert.equal(new URL(directionsUrl(row)).searchParams.get('destination'),s.visitorAddress);assert.equal(s.visitorAddress,row.address);assert.equal(uberRideTarget(row).url,'https://m.uber.com/');assert.match(uberRideTarget(row).ariaLabel,/choose your destination/);assert.notEqual(s.placement.basis,'verified-arrival');assert.deepEqual([row.lat,row.lon],[s.placement.lat,s.placement.lon]);assert.ok(s.placement.sourceUrl&&s.placement.checkedAt&&s.placement.precisionLabel);
 assert.equal(s.visibility==='listing-lifecycle',id==='DELTA3-COBB');if(s.expiryBasis==='date-only')assert.equal(a.endsAt,undefined);
 const poisoned={...row,lat:0,lon:0,openingHours:'24/7',seasonalListing:undefined,seasonalAvailability:undefined};const restored=applyCuratedSeasonalPolicy(poisoned);assert.deepEqual(clone(restored),clone(row));
 const tz=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Chicago',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'}).format(new Date(s.listingExpiresAt));
 report.recordChecks.push({recordId:id,id:row.id,name:row.name,activeDates:a.activeDates??null,cutoff:s.listingExpiresAt,localCutoff:tz,expiryBasis:s.expiryBasis,visibility:s.visibility??'halloween-layer',rawProjectionEqualsManifest:true,registered:true,addressDirections:true,genericRideTarget:true,currentPolicyReapplies:true});
}
const nine=json(inputs[0][0]).records;
const weekdays=(start,end,days)=>{const result=[];for(let d=new Date(start+'T12:00:00Z');d<=new Date(end+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+1)){if(days.includes(d.getUTCDay()))result.push(d.toISOString().slice(0,10));}return result;};
for(const entry of nine){const p=entry.projection,row=rows.find(x=>x.seasonalListing.recordId===entry.record_id),s=row.seasonalListing,a=row.seasonalAvailability,c=p.consumer_presentation_proposal;
 assert.equal(row.name,c.title);assert.equal(row.address,c.directions.value);assert.deepEqual([row.lat,row.lon],[c.placement.latitude,c.placement.longitude]);assert.equal(s.listingExpiresAt,p.lifecycle_for_audit_not_consumer_copy.at);assert.equal(s.expiryBasis,p.lifecycle_for_audit_not_consumer_copy.basis);assert.deepEqual(clone(seasonalPresentation(row).details),c.details);
 let dates=p.fields.dates?.value??p.fields.dates??p.fields.remaining_display_dates?.value;
 if(entry.record_id==='DELTA2-BRANSON-GHOSTER')dates=weekdays('2026-10-01','2026-10-31',[5,6]);
 if(entry.record_id==='MO26-056')dates=weekdays(p.fields.dates.value.start,p.fields.dates.value.end,[0,5,6]);
 if(dates!==undefined)assert.deepEqual(clone(a.activeDates),dates);else assert.equal(a.activeDates,undefined);
}
const two=json(inputs[1][0]).records;
for(const entry of two){const p=entry.projection,row=rows.find(x=>x.seasonalListing.recordId===entry.record_id);assert.ok(row);assert.equal(row.address,p.address);assert.deepEqual([row.lat,row.lon],[p.lat,p.lon]);assert.deepEqual(clone(row.seasonalAvailability.activeDates),p.valid_dates);assert.equal(row.seasonalListing.listingExpiresAt,p.expires_at);}
const commercial=[...json(inputs[2][0]).records,...json(inputs[3][0]).records];
for(const entry of commercial){const p=entry.projection,row=rows.find(x=>x.seasonalListing.recordId===(entry.id??entry.record_id));assert.ok(row);assert.equal(row.address,p.address);assert.deepEqual([row.lat,row.lon],[p.lat,p.lon]);assert.deepEqual(clone(row.activityTypes),p.activityTypes);assert.deepEqual(clone(row.seasonalAvailability.activeDates),p.valid_dates);assert.equal(row.seasonalListing.listingExpiresAt,p.expires_at);}
const normalize=s=>s.replace(/\\u(2013|2014|2019)/g,(_,hex)=>String.fromCharCode(parseInt(hex,16)));
for(const p of json(inputs[5][0]).records){const row=rows.find(x=>x.seasonalListing.recordId===p.recordId);assert.equal(row.name,normalize(p.name));assert.equal(row.address,normalize(p.visitorAddress));assert.deepEqual([row.lat,row.lon],[p.placement.lat,p.placement.lon]);assert.deepEqual(clone(row.seasonalAvailability.activeDates),p.exactActiveDates);assert.equal(row.seasonalListing.listingExpiresAt,p.listingExpiresAt);assert.equal(row.seasonalListing.expiryBasis,p.expiryBasis);assert.deepEqual(clone(seasonalPresentation(row).details),p.consumerDetailsProposal.map(normalize));}
const req=createRequire(resolve(repo,'package.json'));const ts=req('typescript');
function loadGitModule(path){const source=execFileSync('git',['show',`${base}:${path}`],{cwd:repo,encoding:'utf8'});const module={exports:{}};const compiled=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;new Function('require','module','exports',compiled)(specifier=>load(resolve(dirname(path),specifier.endsWith('.ts')?specifier:specifier+'.ts')),module,module.exports);return module.exports;}
const oldFiles=['missouri-2026-cleared-catalog','missouri-2026-v1-catalog','missouri-2026-v1-next-catalog','missouri-2026-deferred-batch-3-catalog','missouri-2026-final-four-catalog','missouri-2026-late-fall-catalog','missouri-2026-three-source-tier-a-catalog'];
const oldPresentations=loadGitModule('src/lib/date-night/seasonal-presentation-catalog.ts').SEASONAL_PRESENTATIONS;
let oldCount=0;
for(const file of oldFiles){const path=`src/lib/date-night/${file}.ts`,old=loadGitModule(path),now=load(path);for(const key of Object.keys(old).filter(k=>k.endsWith('_CATALOG'))){assert.deepEqual(clone(now[key]),clone(old[key]));for(const row of old[key]){oldCount++;assert.deepEqual(clone(seasonalPresentation(row)),clone(oldPresentations[row.seasonalListing.recordId]));assert.equal(getCuratedSeasonalPlace(row.id).id,row.id);report.prior32.push({recordId:row.seasonalListing.recordId,catalogEqual:true,presentationEqual:true});}}}
assert.equal(oldCount,32);assert.equal(new Set([...report.prior32,...report.recordChecks].map(r=>r.recordId)).size,52);
assert.equal(git('rev-parse','HEAD'),head);assert.equal(git('status','--porcelain'),'');report.verdict='PASS: exact candidate source mapping and previous32 invariance; browser/hosted/build handled separately';
writeFileSync(resolve(out,'source-checks-4513aee.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({verdict:report.verdict,inputs:report.inputs.length,records:report.recordChecks.length,priorRecords:report.prior32.length}));
