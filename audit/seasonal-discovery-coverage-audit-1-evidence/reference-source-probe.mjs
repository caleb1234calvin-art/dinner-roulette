// Audit-only public-source retrieval metadata. No product imports or writes.
import fs from 'node:fs';
import crypto from 'node:crypto';
const dir='audit/seasonal-discovery-coverage-audit-1-evidence';
const urls=[
 'https://www.myersinnhaunt.com/',
 'https://www.missourihauntedhouses.com/halloween/rip-at-myers-inn.html',
 'https://thewerehouse.net/',
 'https://www.missourihauntedhouses.com/halloween/haunted-house-joplin.html',
 'https://www.myersforestoffears.com/',
 'https://www.thescarefactor.com/haunted-houses/missouri/the-cadaver-zone-spook-house/',
 'https://www.missourihauntedhouses.com/halloween/wolfmans-housescreams-mo.html',
 'https://auroramaize.com/',
 'https://auroramaize.com/hourstickets/',
 'https://auroramaize.com/find-the-farm/',
 'https://www.springfieldmo.org/blog/post/visit-these-pumpkin-patches-around-springfield/',
 'https://www.pumpkinpatches.com/pickapumpkin248',
 'https://www.exetercornmaze.com/',
 'https://www.exetercornmaze.com/about-3',
 'https://www.campbellsmazedaze.com/general-admission',
 'https://www.missourihauntedhouses.com/halloween/campbells-maze-daze-pumpkin-patch-mo.html',
 'https://www.parkboard.org/harvestfest',
 'https://www.prlog.org/11064027-retreat-at-sky-ridge-opens-new-community-labyrinth-on-nov-19-at-5-pm.html',
];
const results=[];
for(let i=0;i<urls.length;i+=3){
 const rows=await Promise.all(urls.slice(i,i+3).map(async url=>{
  const row={url,startedAt:new Date().toISOString()};
  try{
   const response=await fetch(url,{signal:AbortSignal.timeout(20000)});
   const body=await response.text();
   Object.assign(row,{status:response.status,finalUrl:response.url,bytes:Buffer.byteLength(body),sha256:crypto.createHash('sha256').update(body).digest('hex'),title:body.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.replace(/\s+/g,' ').trim()??null,has2026String:/2026/.test(body),geoMetadata:[...body.matchAll(/<meta\s+property="place:location:(latitude|longitude)"\s+content="([^"]+)"/g)].map(m=>({axis:m[1],value:m[2]})),note:'A 200 status or 2026 string alone does not verify current operation; see reference-set.json for reviewed facts and confidence.'});
   // Scratch HTML aids review, and is deliberately excluded from the deliverable.
   fs.writeFileSync('/workspace/scratch/665e49295af3/reference-pages/review-'+urls.indexOf(url)+'.html',body);
  }catch(e){row.error=e.message;}
  row.finishedAt=new Date().toISOString();return row;
 }));
 results.push(...rows);console.log(JSON.stringify(rows.map(({url,status,error,title})=>({url,status,error,title}))));
}
fs.writeFileSync(dir+'/reference-source-retrievals.json',JSON.stringify(results,null,2)+'\n');
