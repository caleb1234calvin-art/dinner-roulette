// Evidence-only React render/action harness for the unchanged components.
// Browser launch unavailable: this is explicitly not browser/RPC acceptance.
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import ts from 'typescript';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {createTsTestLoader} from '../../scripts/ts-test-loader.mjs';
const nativeRequire=createRequire(import.meta.url), root=process.cwd();
const dir='audit/seasonal-discovery-coverage-audit-1-evidence';
const live=JSON.parse(fs.readFileSync(dir+'/live-provider-observations.json','utf8')).runs[0];
const loadPure=createTsTestLoader();
let venues=live.result.venues,warning=null,states=[],cursor=0;
const {DEFAULT_DATE_NIGHT_FILTERS}=loadPure('src/lib/date-night/types.ts');
const frozen='2026-09-30T01:41:35.000Z',RealDate=Date;
globalThis.Date=class extends RealDate {constructor(...args){super(...(args.length?args:[frozen]));}static now(){return new RealDate(frozen).getTime();}};
let store={location:{...live.origin,source:'manual'},preferences:{},exclusions:[],sessionShown:[],dateNightFilters:{...DEFAULT_DATE_NIGHT_FILTERS,radiusMiles:50,activityTypes:['haunted-house','corn-maze','pumpkin-patch'],mood:50,openNowOnly:false},spookySeasonEnabled:true,theme:'dark',markShown:()=>{},excludeTonight:()=>{},setDateNightFilters:()=>{}};
const stub=(name)=>{const Component=(props)=>React.createElement('div',{'data-audit-component':name},props.children);Component.displayName=name;return Component;};
function loadComponent(relative){
 const file=path.resolve(relative),source=fs.readFileSync(file,'utf8');
 const out=ts.transpileModule(source,{fileName:file,compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true}}).outputText;
 const module={exports:{}};
 function require(spec){
  if(spec==='react')return {...React,useEffect:()=>{},useMemo:f=>f(),useState:init=>{if(!relative.endsWith('date-night-home.tsx'))return[true,()=>{}];const idx=cursor++;if(!(idx in states))states[idx]=typeof init==='function'?init():init;return [states[idx],value=>{states[idx]=typeof value==='function'?value(states[idx]):value;}];}};
  if(spec==='react-dom')return{createPortal:x=>x};
  if(spec==='@/lib/store')return{useAppStore:selector=>selector(store)};
  if(spec==='@/lib/date-night/search')return{searchDateNight:()=>{throw new Error('useEffect should be stubbed in render harness')}};
  if(spec.startsWith('@/components/'))return new Proxy({},{get:(_t,key)=>stub(key)});
  if(spec.startsWith('@/'))return loadPure(path.resolve(root,'src',spec.slice(2)));
  return nativeRequire(spec);
 }
 new Function('require','module','exports',out)(require,module,module.exports);return module.exports;
}
globalThis.document={body:{}};
const {DateNightHome}=loadComponent('src/components/date-night-home.tsx');
const {OptionsOverlay}=loadComponent('src/components/options-overlay.tsx');
const {DateNightPlanOverlay}=loadComponent('src/components/date-night-plan-overlay.tsx');
const textNode=n=>Array.isArray(n)?n.map(textNode).join(''):n&&typeof n==='object'?textNode(n.props?.children):typeof n==='string'||typeof n==='number'?String(n):'';
function find(n,predicate){if(Array.isArray(n)){for(const x of n){const got=find(x,predicate);if(got)return got;}return null;}if(!n||typeof n!=='object')return null;if(predicate(n))return n;return find(n.props?.children,predicate);}
function render(){cursor=0;return DateNightHome();}
function initialize(){states=[venues,false,null,warning,null,[],false,null,null,null];return render();}
const records=[];
for(const openNowOnly of [false,true,false]){
 store.dateNightFilters={...store.dateNightFilters,openNowOnly};let tree=initialize();
 const count=textNode(tree).match(/\d+ activities match/)?.[0];
 const optionsButton=find(tree,n=>n.props?.onClick&&textNode(n)==='Give us options');
 const pickButton=find(tree,n=>n.props?.onClick&&textNode(n)==='Pick our date');
 const planButton=find(tree,n=>n.props?.onClick&&textNode(n)==='Plan the night');
 const row={openNowOnly,count,optionsDisabled:optionsButton.props.disabled,pickDisabled:pickButton.props.disabled};
 if(!optionsButton.props.disabled){optionsButton.props.onClick();row.options=states[7].map(v=>({id:v.id,name:v.name,distanceMiles:v.distanceMiles,isOpen:v.isOpen,hoursKnown:v.hoursKnown,closesLabel:v.closesLabel}));const html=renderToStaticMarkup(React.createElement(OptionsOverlay,{restaurants:states[7],mode:'date-night',onClose:()=>{},onSelect:()=>{},onShuffle:()=>{},onNotTonight:()=>{}}));fs.writeFileSync(dir+'/options-render-'+records.length+'.html',html);row.optionsText=html.replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();pickButton.props.onClick();row.pick=states[4]?.name;planButton.props.onClick();row.planNames=states[8]?.map(v=>v.name);const planHtml=renderToStaticMarkup(React.createElement(DateNightPlanOverlay,{plan:states[8],onClose:()=>{},onReplan:()=>{}}));row.planText=planHtml.replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();fs.writeFileSync(dir+'/plan-render-'+records.length+'.html',planHtml);}
 fs.writeFileSync(dir+'/home-render-'+records.length+'.html',renderToStaticMarkup(tree));records.push(row);
}
fs.writeFileSync(dir+'/react-render-evidence.json',JSON.stringify({method:'Actual unchanged TSX, React SSR; hooks/state/effects, external UI components, and portal mount stubbed. Real eligible useMemo, action callbacks, options labels and plan validation executed. No browser/RPC claim.',frozen,timezone:process.env.TZ,records},null,2)+'\n');
globalThis.Date=RealDate;
console.log(JSON.stringify(records,null,2));
