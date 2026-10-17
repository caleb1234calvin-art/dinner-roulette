import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createTsTestLoader } from './ts-test-loader.mjs';

const shell = readFileSync(new URL('../src/components/app-shell.tsx',import.meta.url),'utf8');
const effect = shell.match(/useEffect\(\(\) => \{([\s\S]*?)\}, \[\]\);/)[1];
// Execute the actual shell hydration effect against the actual store and
// installed Zustand. Do not replace persistence with an idealized test double.
for(const blocked of [true,false]) test(`actual AppShell hydration with ${blocked?'blocked':'available'} local storage`, async()=>{
  const previous=globalThis.window;
  const values=new Map();
  globalThis.window={};
  Object.defineProperty(window,'localStorage',{get(){
    if(blocked) throw new DOMException('Storage blocked','SecurityError');
    return {getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,value),removeItem:key=>values.delete(key)};
  }});
  try {
    const {useAppStore}=createTsTestLoader()('src/lib/store.ts');
    if(blocked) assert.equal(useAppStore.persist,undefined);
    else assert.equal(typeof useAppStore.persist.rehydrate,'function');
    assert.doesNotThrow(()=>new Function('useAppStore',effect)(useAppStore));
    assert.equal(useAppStore.getState().theme,'dark');
    if(!blocked) { await useAppStore.persist.rehydrate();assert.equal(useAppStore.getState().hydrated,true); }
  } finally { if(previous===undefined) delete globalThis.window;else globalThis.window=previous; }
});
