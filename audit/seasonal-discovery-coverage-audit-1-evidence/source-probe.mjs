import fs from 'node:fs';
const dir='audit/seasonal-discovery-coverage-audit-1-evidence';
const queries=[
 {name:'broad-seasonal-name-and-theme-park-110km',query:'[out:json][timeout:30];(nwr["name"~"haunt|maze|maize|pumpkin|pickin|cadaver|wolfman|myer|werehouse|thistleknot|fun.farm",i](around:110000,37.176447,-94.310223);nwr["tourism"="theme_park"](around:110000,37.176447,-94.310223););out center tags;'},
];
const results=fs.existsSync(dir+'/diagnostic-provider-query.json')?JSON.parse(fs.readFileSync(dir+'/diagnostic-provider-query.json','utf8')):[];
for(const q of queries){const row={...q,url:'https://overpass.private.coffee/api/interpreter',startedAt:new Date().toISOString()};try{const r=await fetch(row.url,{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8','Accept':'application/json','User-Agent':'DinnerRoulette/3 (date night discovery)'},body:'data='+encodeURIComponent(q.query),signal:AbortSignal.timeout(35000)});row.status=r.status;row.body=await r.text();try{row.candidateCount=JSON.parse(row.body).elements?.length??null}catch{/* Retain the raw response when candidate counting fails. */}}catch(e){row.error=e.message}row.finishedAt=new Date().toISOString();results.push(row);console.log(JSON.stringify({name:q.name,status:row.status,count:row.candidateCount,error:row.error}));}
fs.writeFileSync(dir+'/diagnostic-provider-query.json',JSON.stringify(results,null,2)+'\n');
