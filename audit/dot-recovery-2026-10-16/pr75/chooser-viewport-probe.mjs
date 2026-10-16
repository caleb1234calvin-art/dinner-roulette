// NOT RUN. Import into the exact-head owned local browser harness after choices
// appear, before the first Tab, and after each choice focus transition.
// This helper performs no navigation, setup, source change or network request.
export async function captureChooserViewport(page, outputStem) {
  const selectors = [
    { id: 'heading', role: 'heading', name: 'Choose a location' },
    { id: 'county', role: 'button', name: 'Use Benton County, Arkansas, United States Place type: county' },
    { id: 'town', role: 'button', name: 'Use Benton, Saline County, Arkansas, 72015, United States Place type: town' },
  ];
  const metrics = [];
  for (const item of selectors) {
    const locator = page.getByRole(item.role, { name: item.name, exact: true });
    metrics.push({ id: item.id, ...await locator.evaluate(el => {
      const r=el.getBoundingClientRect();
      const points=[.1,.5,.9].flatMap(y=>[.1,.5,.9].map(x=>{
        const px=r.x+r.width*x, py=r.y+r.height*y;
        const hit=document.elementFromPoint(px,py);
        return { x:px,y:py,unobscured:Boolean(hit&&(el===hit||el.contains(hit))),hit:hit?.tagName,hitText:hit?.textContent?.slice(0,160) };
      }));
      return { text:el.textContent,rect:r.toJSON(),scrollY,viewport:{width:innerWidth,height:innerHeight},focused:document.activeElement===el,points };
    }) });
  }
  const help=page.getByText('Check the place type and full address before choosing.', { exact:true });
  metrics.push({ id:'help', ...await help.evaluate(el=>{
    const r=el.getBoundingClientRect();const hit=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);
    return {text:el.textContent,rect:r.toJSON(),unobscured:Boolean(hit&&(hit===el||el.contains(hit))),hit:hit?.tagName,hitText:hit?.textContent?.slice(0,160)};
  }) });
  await page.screenshot({path:outputStem+'.viewport.png',fullPage:false});
  return {status:'OBSERVED_ONLY; review hit tests and actual viewport pixels',metrics};
}
