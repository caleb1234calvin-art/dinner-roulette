import {readFileSync,writeFileSync,readdirSync} from 'node:fs';import {createHash} from 'node:crypto';import {fileURLToPath} from 'node:url';import {dirname,join} from 'node:path';
const root=dirname(fileURLToPath(import.meta.url));
const files=readdirSync(root).filter(f=>f.endsWith('.mjs')||['workflow.yml','SOURCE-IDENTITIES.json','TARGETED-PROTOCOL-FROZEN.md','PREFLIGHT-TRIGGER.json','HARNESS-DELTA-REVIEW.md','R2-MINIMAL-DELTA.md','REPLAY-QUALIFICATION.json','RECOVERY-INTERPRETATION-ADDENDUM.md'].includes(f)).sort();
const entries=Object.fromEntries(files.map(file=>{const bytes=readFileSync(join(root,file));return [file,{bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')}];}));
writeFileSync(join(root,'HARNESS-MANIFEST.json'),JSON.stringify({status:'FIXTURE_ONLY_NOT_LIVE_APPROVAL',protocolSha256:entries['TARGETED-PROTOCOL-FROZEN.md'].sha256,files:entries},null,2)+'\n');
