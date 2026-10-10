import test from 'node:test';
import assert from 'node:assert/strict';
import { exactRequestBrowserTiming } from './browser-runner.mjs';
import { readFileSync } from 'node:fs';
test('Two acquisitions sharing one serverFn URL keep distinct exact request times',()=>{
 const origin=1770000000000;
 const primary={url:'http://local/_serverFn/same',timing:{startTime:origin+200,responseEnd:350}};
 const audit={url:primary.url,timing:{startTime:origin+600,responseEnd:700}};
 const first=exactRequestBrowserTiming(primary.timing,origin);
 const second=exactRequestBrowserTiming(audit.timing,origin);
 assert.equal(first.startBrowserMs,200);assert.equal(first.responseEndBrowserMs,550);
 assert.equal(second.startBrowserMs,600);assert.equal(second.responseEndBrowserMs,1300);
 assert.deepEqual(first.requestTiming,primary.timing);
 assert.equal(first.responseEndBrowserMs,550,'Later same-URL acquisition must not change the primary receipt');
});
test('Missing/failed request timing cannot manufacture a response receipt',()=>{
 assert.equal(exactRequestBrowserTiming({startTime:1000,responseEnd:-1},900).responseEndBrowserMs,null);
 assert.equal(exactRequestBrowserTiming({startTime:1000,responseEnd:20},undefined).responseEndBrowserMs,null);
 assert.equal(exactRequestBrowserTiming({startTime:NaN,responseEnd:20},900).startBrowserMs,null);
 const source=readFileSync(new URL('./browser-runner.mjs',import.meta.url),'utf8');
 assert.ok(source.includes('const requestTiming = request.timing();'));
 assert.ok(!source.includes('performance.getEntriesByName'));
});
