// Disposable local acceptance only: no public provider/network requests.
import { readFileSync } from "node:fs";
if (process.env.CI !== "true" || !process.env.MISSOURI_TWO_CONTROL) throw new Error("Disposable fixture required");
const RealDate=Date;
const instant=()=>JSON.parse(readFileSync(process.env.MISSOURI_TWO_CONTROL,"utf8")).at;
globalThis.Date=class extends RealDate { constructor(...args){ super(...(args.length?args:[instant()])); } static now(){return new RealDate(instant()).getTime();} };
const originalFetch=globalThis.fetch;
globalThis.fetch=async(input,init)=>{
 const url=new URL(input instanceof Request?input.url:input);
 if (["127.0.0.1","localhost"].includes(url.hostname)) return originalFetch(input,init);
 if (["overpass.openstreetmap.fr","overpass.private.coffee","maps.mail.ru","overpass-api.de"].includes(url.hostname)) return Response.json({elements:[]});
 throw new Error("External network disabled in two-record acceptance");
};
