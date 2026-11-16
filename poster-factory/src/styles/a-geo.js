// Junction geometry: redraws a window of the 1972 map on one 80 px lattice.
// Ported from the Figma generator kitA2 (see 40-Marketing/Visual-Experiments/NYCTA-Posters/A-RULES.md). Pure: no DOM, no Figma.
export function makeGeo(GEO, opt = {}) {
const p=17,W=opt.W||80,k=W/p,PW=opt.PW||960,PH=opt.PH||1200,RIN=(opt.rin||1.5)*p;
const Q=0.7071067811865476,DIRS=[[1,0],[Q,Q],[0,1],[-Q,Q]];
const off=(c,x,y)=>-DIRS[c][1]*x+DIRS[c][0]*y, alo=(c,x,y)=>DIRS[c][0]*x+DIRS[c][1]*y;
const pt=(c,a,o)=>[a*DIRS[c][0]-o*DIRS[c][1],a*DIRS[c][1]+o*DIRS[c][0]];
const INK={'map72/redT':'map72/red','map72/magentaT':'map72/magenta','map72/orangeT':'map72/orange','map72/greenT':'map72/green','map72/grey':'map72/frame','map72/greyL':'map72/frame'};
// ---- prepare routes once
const RT=GEO.routes.map((r,ri)=>{const A=r.v.map(q=>[q[0]+r.x,q[1]+r.y]);const segs=[];
 r.s.forEach((s,j)=>{if(s[2])return;const a=A[s[0]],b=A[s[1]];const dx=b[0]-a[0],dy=b[1]-a[1],len=Math.hypot(dx,dy);if(len<2)return;
  let ang=Math.atan2(dy,dx)*180/Math.PI;ang=((ang%180)+180)%180;const c=Math.round(ang/45)%4;
  const o=(off(c,a[0],a[1])+off(c,b[0],b[1]))/2;const sg=Math.sign(alo(c,b[0],b[1])-alo(c,a[0],a[1]))||1;segs.push({ri,j,a,b,c,len,o,sg});});
 const des=r.n.replace(/^Route /,'').split(' ')[0];let scr=!!INK[r.col]||des==='EE';
 return {n:r.n,des,ink:INK[r.col]||r.col,scr,light:des==='LL'||r.col==='map72/grey'||r.col==='map72/greyL',segs};});
const isect=(c1,s1,c2,s2)=>{const n1=[-DIRS[c1][1],DIRS[c1][0]],n2=[-DIRS[c2][1],DIRS[c2][0]];const det=n1[0]*n2[1]-n1[1]*n2[0];return [(s1*n2[1]-s2*n1[1])/det,(n1[0]*s2-n2[0]*s1)/det];};
// ---- geometry for one window (pure)
function compute(cx,cy){const hx=PW/2/k,hy=PH/2/k,m=4*p;const x0=cx-hx-m,x1=cx+hx+m,y0=cy-hy-m,y1=cy+hy+m;const flags=[];
 const inw=s=>Math.max(s.a[0],s.b[0])>x0&&Math.min(s.a[0],s.b[0])<x1&&Math.max(s.a[1],s.b[1])>y0&&Math.min(s.a[1],s.b[1])<y1;
 const S=[];for(const r of RT)for(const s of r.segs){s.w=inw(s);s.item=null;if(s.w)S.push(s);}
 for(let c=0;c<4;c++){const L=S.filter(s=>s.c===c).sort((a,b)=>a.o-b.o);let prev=null;for(const s of L){if(!prev)s.s=s.o;else{const g=s.o-prev.o;s.s=prev.s+(g<0.45*p?0:Math.max(1,Math.round(g/p))*p);}prev=s;}}
 // anchor lanes on the 40 px grid
 const fv=S.find(s=>s.c===2),fh=S.find(s=>s.c===0);
 if(fv){const px=(-fv.s-cx)*k+PW/2;const d=px-(Math.round((px-40)/80)*80+40);cx+=d/k;}
 if(fh){const py=(fh.s-cy)*k+PH/2;const d=py-(Math.round((py-40)/80)*80+40);cy+=d/k;}
 const T=q=>[(q[0]-cx)*k+PW/2,(q[1]-cy)*k+PH/2];
 const lines=[];
 for(const r of RT){const R=r.segs;let i=0;while(i<R.length){if(!R[i].w){i++;continue;}let j=i;while(j+1<R.length&&R[j+1].w)j++;
   let items=R.slice(i,j+1).map(s=>({c:s.c,s:s.s,sg:s.sg,len:s.len,a0:alo(s.c,s.a[0],s.a[1]),a1:alo(s.c,s.b[0],s.b[1]),src:[s]}));
   const st=i===0,en=j===R.length-1;i=j+1;
   let V=null;
   for(let pass=0;pass<4;pass++){
    let ch=true;while(ch){ch=false;
     for(let q=1;q<items.length-1;q++){const a=items[q-1],b=items[q],c2=items[q+1];if(b.len<1.3*p&&(a.c!==c2.c||(a.c===c2.c&&a.s===c2.s))){items.splice(q,1);ch=true;break;}}
     for(let q=0;q<items.length-1;q++){const a=items[q],b=items[q+1];if(a.c===b.c&&a.s===b.s){a.a1=b.a1;a.len+=b.len;a.src=a.src.concat(b.src);items.splice(q+1,1);ch=true;break;}}}
    V=[];const f=items[0],l=items[items.length-1];
    V.push(pt(f.c,f.a0-(st?0:f.sg*90*p),f.s));
    let bad=-1;
    for(let q=0;q<items.length-1;q++){const a=items[q],b=items[q+1];if(a.c===b.c){flags.push('parallel-shift '+r.n);V.push(pt(a.c,a.a1,a.s));}else V.push(isect(a.c,a.s,b.c,b.s));}
    V.push(pt(l.c,l.a1+(en?0:l.sg*90*p),l.s));
    for(let q=0;q<items.length;q++){const d=DIRS[items[q].c],sg=items[q].sg;const dot=((V[q+1][0]-V[q][0])*d[0]+(V[q+1][1]-V[q][1])*d[1])*sg;if(dot<=0.5){bad=q;break;}}
    if(bad<0||items.length<2)break;flags.push('inverted '+r.n);items.splice(bad,1);}
   items.forEach(it=>it.src.forEach(s=>s.item=it));
   const ln={r,items,V,st,en,corners:[]};items.forEach(it=>it.ln=ln);
   for(let q=1;q<V.length-1;q++){const a=items[q-1],b=items[q];const u=[DIRS[a.c][0]*a.sg,DIRS[a.c][1]*a.sg],w=[DIRS[b.c][0]*b.sg,DIRS[b.c][1]*b.sg];const cs=u[0]*w[0]+u[1]*w[1];if(cs>0.999)continue;
    const phi=Math.acos(Math.max(-1,Math.min(1,cs)));let bx=w[0]-u[0],by=w[1]-u[1];const bl=Math.hypot(bx,by);bx/=bl;by/=bl;
    const lin=Math.hypot(V[q][0]-V[q-1][0],V[q][1]-V[q-1][1]),lout=Math.hypot(V[q+1][0]-V[q][0],V[q+1][1]-V[q][1]);
    ln.corners.push({q,u,w,phi,b:[bx,by],V:V[q],avail:Math.min(q===1?lin:lin/2,q===V.length-2?lout:lout/2),r:RIN});}
   lines.push(ln);}}
 {const its=[];lines.forEach(l=>l.items.forEach(it=>its.push([l,it])));for(let i=0;i<its.length;i++)for(let j=i+1;j<its.length;j++){const A=its[i],B=its[j];if(A[0].r.ink===B[0].r.ink||A[1].c!==B[1].c||Math.abs(A[1].s-B[1].s)>0.01)continue;const a0=Math.min(A[1].a0,A[1].a1),a1=Math.max(A[1].a0,A[1].a1),b0=Math.min(B[1].a0,B[1].a1),b1=Math.max(B[1].a0,B[1].a1);const lo=Math.max(a0,b0),hi=Math.min(a1,b1);if(hi-lo<0.6*p)continue;const m=T(pt(A[1].c,(lo+hi)/2,A[1].s));const e0=T(pt(A[1].c,lo,A[1].s)),e1=T(pt(A[1].c,hi,A[1].s));const vis=[m,e0,e1].some(q=>q[0]>0&&q[0]<PW&&q[1]>0&&q[1]<PH);if(vis)flags.push('overlap '+A[0].r.des+'/'+B[0].r.des);}}
 // concentric radii
 const all=[];lines.forEach(l=>l.corners.forEach(c=>all.push(c)));const groups={};
 for(const c of all){const key=Math.round(Math.atan2(c.b[1],c.b[0])/(Math.PI/8))+'|'+Math.round(c.phi*180/Math.PI);(groups[key]=groups[key]||[]).push(c);}
 for(const key in groups){const G=groups[key];for(const c of G){c.qq=-c.V[0]*c.b[1]+c.V[1]*c.b[0];c.aa=c.V[0]*c.b[0]+c.V[1]*c.b[1];}
  G.sort((a,b)=>a.qq-b.qq);let cl=[];const flush=()=>{if(!cl.length)return;cl.sort((a,b)=>b.aa-a.aa);const step=p/Math.cos(cl[0].phi/2);let sub=[cl[0]];cl[0].idx=0;const fin=()=>{const th=Math.tan(sub[0].phi/2);let base=RIN;for(const c of sub)base=Math.min(base,c.avail/th-c.idx*p);if(base<0.5*p){base=0.5*p;}for(const c of sub){c.r=base+c.idx*p;if(c.r*th>c.avail+0.01){c.r=Math.max(0.5*p,c.avail/th);flags.push('tight');}}};
   for(let i=1;i<cl.length;i++){const n=Math.round((cl[i-1].aa-cl[i].aa)/step);if(n>4){fin();sub=[cl[i]];cl[i].idx=0;}else{cl[i].idx=cl[i-1].idx+n;sub.push(cl[i]);}}fin();cl=[];};
  for(const c of G){if(cl.length&&c.qq-cl[cl.length-1].qq>0.35*p)flush();cl.push(c);}flush();}
 // paths (px)
 for(const l of lines){const V=l.V;let d='';const q0=T(V[0]);d='M '+q0[0].toFixed(2)+' '+q0[1].toFixed(2);const poly=[q0];
  for(const c of l.corners){const t=c.r*Math.tan(c.phi/2),h=4/3*Math.tan(c.phi/4)*c.r;const S1=[c.V[0]-c.u[0]*t,c.V[1]-c.u[1]*t],E=[c.V[0]+c.w[0]*t,c.V[1]+c.w[1]*t];
   const C1=T([S1[0]+c.u[0]*h,S1[1]+c.u[1]*h]),C2=T([E[0]-c.w[0]*h,E[1]-c.w[1]*h]),s=T(S1),e=T(E);
   d+=' L '+s[0].toFixed(2)+' '+s[1].toFixed(2)+' C '+C1[0].toFixed(2)+' '+C1[1].toFixed(2)+' '+C2[0].toFixed(2)+' '+C2[1].toFixed(2)+' '+e[0].toFixed(2)+' '+e[1].toFixed(2);
   poly.push(s);for(let z=1;z<6;z++){const tt=z/6,uu=1-tt;poly.push([uu*uu*uu*s[0]+3*uu*uu*tt*C1[0]+3*uu*tt*tt*C2[0]+tt*tt*tt*e[0],uu*uu*uu*s[1]+3*uu*uu*tt*C1[1]+3*uu*tt*tt*C2[1]+tt*tt*tt*e[1]]);}poly.push(e);}
  const qn=T(V[V.length-1]);d+=' L '+qn[0].toFixed(2)+' '+qn[1].toFixed(2);poly.push(qn);l.d=d;l.poly=poly;}
 // stations
 const dots=[];let orphans=0;
 for(const s of GEO.stn){if(s[0]<x0||s[0]>x1||s[1]<y0||s[1]>y1)continue;let best=null;
  for(const g of S){const a=alo(g.c,s[0],s[1]);const lo=Math.min(alo(g.c,g.a[0],g.a[1]),alo(g.c,g.b[0],g.b[1]))-0.5*p,hi=Math.max(alo(g.c,g.a[0],g.a[1]),alo(g.c,g.b[0],g.b[1]))+0.5*p;if(a<lo||a>hi)continue;const dd=Math.abs(off(g.c,s[0],s[1])-g.o);if(dd<0.75*p&&(!best||dd<best.dd))best={dd,g,a};}
  if(!best||!best.g.item){const px=T(s);if(px[0]>0&&px[0]<PW&&px[1]>0&&px[1]<PH)orphans++;continue;}
  dots.push({c:best.g.item.c,s:best.g.item.s,a:best.a,it:best.g.item});}
 for(let c=0;c<4;c++){const L=dots.filter(d=>d.c===c).sort((a,b)=>a.a-b.a);let g=[];const fl=()=>{if(!g.length)return;const m=g.reduce((t,d)=>t+d.a,0)/g.length;g.forEach(d=>d.a=m);g=[];};for(const d of L){if(g.length&&d.a-g[0].a>0.6*p)fl();g.push(d);}fl();}
 const out=[];const lanes={};for(const d of dots){const key=d.c+'|'+d.s.toFixed(2);(lanes[key]=lanes[key]||[]).push(d);}
 for(const key in lanes){const LN=lanes[key].sort((a,b)=>a.a-b.a);const used=[];let prev=null;for(const d of LN){if(prev&&d.a-prev.a<0.3*p)continue;prev=d;const q0=T(pt(d.c,d.a,d.s));const dir=DIRS[d.c];let best=null;
  for(let n=-3;n<=3;n++){let q;if(d.c===0)q=[40+80*Math.round((q0[0]-40)/80)+80*n,q0[1]];else if(d.c===2)q=[q0[0],40+80*Math.round((q0[1]-40)/80)+80*n];else q=[q0[0]+dir[0]*80*n,q0[1]+dir[1]*80*n];
   if(used.some(u=>Math.hypot(u[0]-q[0],u[1]-q[1])<79))continue;if(!onL(d.it.ln,q))continue;if(!best||Math.abs(n)<best.n)best={n:Math.abs(n),q};}
  if(best){used.push(best.q);out.push(best.q);}else flags.push('dot-dropped');}}
 return {cx,cy,lines,dots:out,orphans,flags};}
const onL=(l,q)=>{const P2=l.poly;for(let i=0;i<P2.length-1;i++){const a=P2[i],b=P2[i+1];const vx=b[0]-a[0],vy=b[1]-a[1];const L2=vx*vx+vy*vy;if(L2<1e-6)continue;let t=((q[0]-a[0])*vx+(q[1]-a[1])*vy)/L2;t=Math.max(0,Math.min(1,t));if(Math.hypot(a[0]+vx*t-q[0],a[1]+vy*t-q[1])<3)return true;}return false;};
const dL=(l,q)=>{let m=1e9;const P2=l.poly;for(let i=0;i<P2.length-1;i++){const a=P2[i],b=P2[i+1];const vx=b[0]-a[0],vy=b[1]-a[1];const L2=vx*vx+vy*vy;if(L2<1e-6)continue;let t=((q[0]-a[0])*vx+(q[1]-a[1])*vy)/L2;t=Math.max(0,Math.min(1,t));m=Math.min(m,Math.hypot(a[0]+vx*t-q[0],a[1]+vy*t-q[1]));}return m;};
const rich=g=>{let s=0;for(const l of g.lines){let len=0;const P2=l.poly;for(let i=0;i<P2.length-1;i++){const a=P2[i],b=P2[i+1];const LL=Math.hypot(b[0]-a[0],b[1]-a[1]),n=Math.max(1,Math.ceil(LL/20));for(let q=0;q<n;q++){const x=a[0]+(b[0]-a[0])*(q+0.5)/n,y=a[1]+(b[1]-a[1])*(q+0.5)/n;if(x>0&&x<PW&&y>0&&y<PH)len+=LL/n;}}s+=Math.min(len,800)/100;if(len>0&&len<240)s-=12;}s+=g.dots.filter(d=>d[0]>0&&d[0]<PW&&d[1]>0&&d[1]<PH).length*0.5;return s;};

return { compute, rich, onL, dL, RT, k, W };
}
