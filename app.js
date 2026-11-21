/* ---------- Diagram renderer (portrait table: foot rail at the top, head rail at the bottom) ---------- */
const U=100, R=44, TW=4*U+2*R, TH=8*U+2*R;
const BALL={1:'#f4c531',2:'#1d3fa6',3:'#d6312b',4:'#6a3fa0',5:'#f07f1f',6:'#1f8a4c',7:'#8c2a2a',8:'#151515'};
let clipN=0;
function drawDiagram(id, mirror){
  const spec=DIAGRAMS[id]();
  { const objs=(spec.balls||[]).filter(b=>!b.t); if(!objs.some(b=>b.n)) objs.forEach((b,i)=>{ b.n=i+1; }); }
  const T=p=>[R+(mirror?p[1]:4-p[1])*U, R+p[0]*U];
  const pt=p=>{ const q=T(p); return q[0].toFixed(1)+','+q[1].toFixed(1); };
  let o='';
  o+=`<rect x="0" y="0" width="${TW}" height="${TH}" rx="30" fill="#1a2632"/>`;
  o+=`<rect x="5" y="5" width="${TW-10}" height="${TH-10}" rx="26" fill="none" stroke="#32475a" stroke-width="1.5"/>`;
  o+=`<rect x="${R-13}" y="${R-13}" width="${4*U+26}" height="${8*U+26}" rx="7" fill="#1f6792"/>`;
  o+=`<rect x="${R}" y="${R}" width="${4*U}" height="${8*U}" fill="#2f86bd"/>`;
  for(let i=1;i<8;i++) o+=`<line x1="${R}" y1="${R+i*U}" x2="${R+4*U}" y2="${R+i*U}" stroke="#fff" stroke-opacity="${i===6?.34:.07}" stroke-width="${i===6?1.4:1}"/>`;
  for(let j=1;j<4;j++) o+=`<line x1="${R+j*U}" y1="${R}" x2="${R+j*U}" y2="${R+8*U}" stroke="#fff" stroke-opacity=".07"/>`;
  [[R-6,R-6,20],[TW-R+6,R-6,20],[R-6,TH-R+6,20],[TW-R+6,TH-R+6,20],[R-13,R+4*U,18],[TW-R+13,R+4*U,18]].forEach(c=>{ o+=`<circle cx="${c[0]}" cy="${c[1]}" r="${c[2]}" fill="#05090c"/>`; });
  for(let i=1;i<8;i++){ if(i===4) continue; o+=`<circle cx="15" cy="${R+i*U}" r="3" fill="#e8eef3"/><circle cx="${TW-15}" cy="${R+i*U}" r="3" fill="#e8eef3"/>`; }
  for(let j=1;j<4;j++) o+=`<circle cx="${R+j*U}" cy="15" r="3" fill="#e8eef3"/><circle cx="${R+j*U}" cy="${TH-15}" r="3" fill="#e8eef3"/>`;
  o+=`<polygon points="${pt([2,2])} ${pt([1.25,1.57])} ${pt([1.25,2.43])}" fill="none" stroke="#fff" stroke-opacity=".22" stroke-width="1.5" stroke-linejoin="round"/>`;
  [[2,2],[4,2],[6,2]].forEach(p=>{ const q=T(p); o+=`<circle cx="${q[0]}" cy="${q[1]}" r="2.6" fill="#fff" fill-opacity=".55"/>`; });
  (spec.zones||[]).forEach(z=>{
    o+=`<polygon points="${z.poly.map(pt).join(' ')}" fill="#fff" fill-opacity=".17" stroke="#fff" stroke-opacity=".8" stroke-width="1.4" stroke-dasharray="5 4"/>`;
    if(z.label){ const q=T(z.lp); o+=`<text x="${q[0].toFixed(1)}" y="${(q[1]+4).toFixed(1)}" class="dg-zone">${z.label}</text>`; }
  });
  const ST={ ob:['#ffd66b',2.6,1,''], aim:['#ffffff',1.6,.85,''], cue:['#ffffff',2,.95,'6 5'], thin:['#ffffff',1.1,.5,''], range:['#ffffff',7,.3,''] };
  (spec.lines||[]).forEach(l=>{
    const s=ST[l.k], P=l.pts.map(T);
    o+=`<polyline points="${P.map(q=>q[0].toFixed(1)+','+q[1].toFixed(1)).join(' ')}" fill="none" stroke="${s[0]}" stroke-width="${s[1]}" stroke-opacity="${s[2]}" stroke-linecap="round" stroke-linejoin="round"${s[3]?` stroke-dasharray="${s[3]}"`:''}/>`;
    if(l.arrow){ const a=P[P.length-2], b=P[P.length-1], ang=Math.atan2(b[1]-a[1],b[0]-a[0]), L=11, w=.42;
      const p1=[b[0]-L*Math.cos(ang-w), b[1]-L*Math.sin(ang-w)], p2=[b[0]-L*Math.cos(ang+w), b[1]-L*Math.sin(ang+w)];
      o+=`<polygon points="${b[0].toFixed(1)},${b[1].toFixed(1)} ${p1[0].toFixed(1)},${p1[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}" fill="${s[0]}"/>`; }
  });
  (spec.balls||[]).forEach(b=>{
    const q=T(b.p), x=q[0].toFixed(1), y=q[1].toFixed(1);
    if(b.t==='ghost'){ const r=b.small?7:11; o+=`<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" fill-opacity=".3" stroke="#fff" stroke-width="1.4" stroke-dasharray="3 2.5"/>`; return; }
    o+=`<ellipse cx="${(q[0]+2).toFixed(1)}" cy="${(q[1]+3).toFixed(1)}" rx="11" ry="10" fill="#000" fill-opacity=".22"/>`;
    if(b.t==='cue'){ o+=`<circle cx="${x}" cy="${y}" r="11" fill="#fdfdf8" stroke="#0a1620" stroke-opacity=".5" stroke-width="1"/>`; return; }
    if(!b.n){ o+=`<circle cx="${x}" cy="${y}" r="11" fill="#e4483b" stroke="#fff" stroke-opacity=".75" stroke-width="1"/><circle cx="${(q[0]-3.5).toFixed(1)}" cy="${(q[1]-3.5).toFixed(1)}" r="2.6" fill="#fff" fill-opacity=".55"/>`; return; }
    const c=BALL[b.n>8?b.n-8:b.n], stripe=b.n>8;
    if(stripe){ const cid='cp'+(++clipN);
      o+=`<clipPath id="${cid}"><circle cx="${x}" cy="${y}" r="11"/></clipPath><circle cx="${x}" cy="${y}" r="11" fill="#fdfdf8"/><rect x="${(q[0]-11).toFixed(1)}" y="${(q[1]-6.5).toFixed(1)}" width="22" height="13" fill="${c}" clip-path="url(#${cid})"/><circle cx="${x}" cy="${y}" r="11" fill="none" stroke="#fff" stroke-opacity=".8" stroke-width="1"/>`;
    } else o+=`<circle cx="${x}" cy="${y}" r="11" fill="${c}" stroke="#fff" stroke-opacity=".8" stroke-width="1"/>`;
    const dark=(b.n===1||b.n===5||b.n===9||b.n===13);
    o+=`<text x="${x}" y="${(q[1]+4.3).toFixed(1)}" class="dg-num" fill="${dark?'#111':'#fff'}"${b.n>9?' font-size="11"':''}>${b.n}</text>`;
  });
  (spec.notes||[]).forEach(n=>{ const q=T(n.p); o+=`<text x="${q[0].toFixed(1)}" y="${(q[1]+4).toFixed(1)}" class="dg-note${n.small?' sm':''}">${n.text}</text>`; });
  return `<svg class="table" viewBox="0 0 ${TW} ${TH}" role="img" aria-label="Table layout">${o}</svg>`;
}
function tipSvg(tip, mirror){
  const dx=tip[0]*(mirror?-1:1)*15, dy=-tip[1]*15;
  return `<svg class="tip" viewBox="-22 -22 44 44" aria-hidden="true"><circle r="20" fill="#fdfdf8" stroke="var(--line)" stroke-width="1.5"/><line x1="-20" x2="20" stroke="#9aa7b2" stroke-width=".8"/><line y1="-20" y2="20" stroke="#9aa7b2" stroke-width=".8"/><circle cx="${dx}" cy="${dy}" r="5" fill="#0b6aa8"/></svg>`;
}

/* ---------- State and storage ---------- */
const LS='pat-tracker.v1';
const S={ sessions:[], tomb:[], prefs:{ mirror:false }, view:{ name:'home' }, sync:'device', sheet:null, toast:'' };
const testById=id=>TESTS.find(t=>t.id===id);
const sess=id=>S.sessions.find(s=>s.id===id);
function load(){ try{ const d=JSON.parse(localStorage.getItem(LS)||'null'); if(d){ S.sessions=d.sessions||[]; S.tomb=d.tomb||[]; Object.assign(S.prefs,d.prefs||{}); } }catch(e){} }
function persist(){ try{ localStorage.setItem(LS, JSON.stringify({ sessions:S.sessions, tomb:S.tomb, prefs:S.prefs })); }catch(e){} }
const today=()=>{ const d=new Date(); return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); };
const fmtDate=iso=>{ const p=iso.split('-'); return new Date(+p[0],+p[1]-1,+p[2]).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'}); };
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function touch(s){ s.updatedAt=Date.now(); persist(); queueSync(s.id); }
function newSession(testId){ const s={ id:'s'+Date.now().toString(36)+Math.random().toString(36).slice(2,7), test:testId, date:today(), created:Date.now(), updatedAt:Date.now(), scores:{}, notes:{}, finished:false }; S.sessions.push(s); persist(); return s; }
function removeSession(id){ S.sessions=S.sessions.filter(s=>s.id!==id); S.tomb.push(id); persist(); queueSync(id); }
const hasData=s=>Object.keys(s.scores).length>0||Object.keys(s.times||{}).length>0||!!s.timer;
function sorted(testId){ return S.sessions.filter(s=>(!testId||s.test===testId)&&hasData(s)).sort((a,b)=>a.date<b.date?-1:a.date>b.date?1:a.created-b.created); }
const calcOf=s=>sessionCalc(testById(s.test), s.scores);
const completeOf=testId=>sorted(testId).filter(s=>calcOf(s).complete);


/* ---------- Account sync (Firebase, optional) ---------- */
const C=()=>window.Cloud&&window.Cloud.available?window.Cloud:null;
const me=()=>{ const c=C(); return c&&c.user?c.user:null; };
const dirtyList=()=>S.prefs.dirty||(S.prefs.dirty=[]);
let syncT=null, syncing=false, lastPull=0;
function setNet(v){ S.net=v; const el=document.getElementById('netstate'); if(el) el.textContent=netText(); }
const netText=()=>!me()?'':S.net==='offline'?'Offline, will sync later':S.net==='syncing'?'Syncing':'Synced';
function queueSync(id){ if(!me()) return; const d=dirtyList(); if(!d.includes(id)) d.push(id); persist(); clearTimeout(syncT); syncT=setTimeout(flush,1200); }
async function flush(){
  const c=C(); if(!c||!c.user||syncing) return; syncing=true; setNet('syncing');
  try{
    for(const id of [...dirtyList()]){
      const s=sess(id);
      try{
        if(s&&hasData(s)) await c.put(Object.assign({},s,{ times:s.timer?Object.assign({},s.times,{ [s.timer.cat]:Math.round(tOf(s,s.timer.cat)) }):(s.times||{}) }));
        else if(!s) await c.del(id);
        S.prefs.dirty=dirtyList().filter(x=>x!==id); persist();
      }catch(e){
        if(!s&&e&&(e.code==='permission-denied'||e.code==='not-found')){ S.prefs.dirty=dirtyList().filter(x=>x!==id); persist(); continue; }
        throw e;
      }
    }
    setNet('ok');
  }catch(e){ setNet('offline'); }
  syncing=false;
}
async function pullAll(){
  const c=C(); if(!c||!c.user) return;
  try{
    setNet('syncing');
    const remote=await c.pullOwn(); lastPull=Date.now();
    const ids=new Set(remote.map(r=>r.id));
    remote.forEach(r0=>{ const r=cleanSession(r0); if(!r) return;
      if(S.tomb.includes(r.id)){ queueSync(r.id); return; }
      const l=sess(r.id);
      if(!l) S.sessions.push(r);
      else if(r.updatedAt>l.updatedAt){ const tm=l.timer; Object.assign(l,r); if(tm) l.timer=tm; }
      else if(l.updatedAt>r.updatedAt) queueSync(l.id); });
    S.sessions.forEach(s=>{ if(hasData(s)&&!ids.has(s.id)) queueSync(s.id); });
    persist(); setNet('ok'); await flush();
    if(['home','history','insights','result','session'].includes(S.view.name)) render(true);
  }catch(e){ setNet('offline'); }
}
function onUser(u){
  if(u){
    if(S.prefs.owner&&S.prefs.owner!==u.uid){ S.sessions=[]; S.tomb=[]; S.prefs.dirty=[]; }
    S.prefs.owner=u.uid; persist(); pullAll();
  }
  if(S.sheet&&S.sheet.kind==='account') S.sheet={ kind:'account', mode:u?'profile':'signin' };
  render(true);
}
function hookCloud(){ const c=C(); if(c&&!hookCloud.done){ hookCloud.done=true; c.onChange(onUser); if(c.user){ onUser(c.user); return; } } render(true); }
window.addEventListener('cloud-loaded',hookCloud);
window.addEventListener('online',()=>flush());
document.addEventListener('visibilitychange',()=>{ if(document.visibilityState==='visible'&&me()){ if(Date.now()-lastPull>300000) pullAll(); else flush(); } });
const authMsg=e=>{ const m={ 'auth/email-already-in-use':'There is already an account with that email. Sign in instead.', 'auth/invalid-email':'That email address does not look right.', 'auth/weak-password':'Use a password of at least 6 characters.', 'auth/invalid-credential':'Wrong email or password.', 'auth/wrong-password':'Wrong email or password.', 'auth/user-not-found':'Wrong email or password.', 'auth/too-many-requests':'Too many tries. Wait a few minutes and try again.', 'auth/network-request-failed':'No connection. Try again when you are online.', 'pat/bad-nick':'Nickname: 3 to 20 letters, digits, dot, dash or underscore.', 'pat/nick-taken':'That nickname is taken. Pick another one.' }; return m[e&&e.code]||'Something went wrong. Try again.'; };


/* ---------- Result as a picture ---------- */
const picName=()=>S.prefs.picName!=null?S.prefs.picName:(me()&&me().nick)||'';
async function resultPicture(s){
  const t=testById(s.test), c=calcOf(s), basis=isB(t);
  try{ await Promise.all(['700 64px "Barlow Condensed"','600 30px "Barlow Condensed"','500 28px Barlow','600 28px Barlow'].map(f=>document.fonts.load(f))); }catch(e){}
  const W=1080, P=64, rowH=basis?84:78;
  const errCats=basis?c.cats.filter(x=>x.kind==='errors'):c.cats;
  const g=basis?c.cats.find(x=>x.kind==='ghost'):null;
  const H=P+200+230+errCats.length*rowH+(basis?260:0)+(t.emblems&&c.complete?110:0)+110;
  const cv=document.createElement('canvas'); cv.width=W; cv.height=H; const x=cv.getContext('2d');
  const C={ bg:'#eef2f5', card:'#ffffff', ink:'#10212f', muted:'#5a6b79', line:'#d7dfe6', acc:'#0b6aa8', good:'#1a8552', warn:'#a8700a', bad:'#c23b32' };
  const col=b=>b==='good'?C.good:b==='warn'?C.warn:b==='bad'?C.bad:C.ink;
  const D='"Barlow Condensed","Arial Narrow",sans-serif', B='Barlow,system-ui,sans-serif';
  const rr=(X,Y,w,h,r)=>{ x.beginPath(); x.moveTo(X+r,Y); x.arcTo(X+w,Y,X+w,Y+h,r); x.arcTo(X+w,Y+h,X,Y+h,r); x.arcTo(X,Y+h,X,Y,r); x.arcTo(X,Y,X+w,Y,r); x.closePath(); };
  x.fillStyle=C.bg; x.fillRect(0,0,W,H);
  // header band in table-cloth blue
  x.fillStyle=C.acc; x.fillRect(0,0,W,P+150);
  x.fillStyle='#fff'; x.font=`700 72px ${D}`; x.textBaseline='alphabetic'; x.fillText(t.name,P,P+70);
  const who=picName().trim().slice(0,40);
  x.font=`500 30px ${B}`; x.fillStyle='rgba(255,255,255,.85)'; x.fillText((who?who+'  ·  ':'')+fmtDate(s.date)+(c.complete?'':`  ·  ${c.doneCount} of ${t.cats.length} drills`),P,P+118);
  x.textAlign='right'; x.font=`600 28px ${D}`; x.fillStyle='rgba(255,255,255,.75)'; x.fillText('PAT TRACKER',W-P,P+30); x.textAlign='left';
  // totals card
  let y=P+180; rr(P,y,W-2*P,200,24); x.fillStyle=C.card; x.fill();
  const big=(val,label,X,colr)=>{ x.fillStyle=colr||C.ink; x.font=`700 108px ${D}`; x.fillText(String(val),X,y+118); const w=x.measureText(String(val)).width; x.fillStyle=C.muted; x.font=`500 28px ${B}`; x.fillText(label,X,y+165); return w; };
  if(basis){ const tt=tTotal(s,t); big(c.errors,'errors',P+40); big(c.total,'ghost, of 150',P+330); if(tt) big(fmtT(tt),'time',P+660); }
  else { big(c.total, t.mode==='sum'?`of ${t.targetTotal} target · ceiling ${c.maxTotal}`:'average percent', P+40); }
  y+=230;
  // rows
  const mx=basis?Math.max(4,...errCats.map(r=>r.pts||0)):Math.max(100,...c.cats.map(r=>r.max||100));
  errCats.forEach((r,i)=>{
    const ry=y+i*rowH;
    x.fillStyle=C.ink; x.font=`500 30px ${B}`; x.fillText(`${i+1}. ${r.cat.name}`,P,ry+32);
    if(basis){ const tm=tOf(s,r.cat.id); if(tm){ x.fillStyle=C.muted; x.font=`500 26px ${B}`; const nw=x.measureText(`${i+1}. ${r.cat.name}`).width; x.font=`500 30px ${B}`; const nw2=x.measureText(`${i+1}. ${r.cat.name}`).width; x.font=`500 26px ${B}`; x.fillText(fmtT(tm),P+nw2+18,ry+32); } }
    const v=r.entered?r.pts:'·', b=r.complete?bandK(t,r.cat,r.pts):'';
    x.textAlign='right'; x.fillStyle=r.entered?col(b):C.muted; x.font=`700 44px ${D}`; x.fillText(String(v),W-P,ry+38); x.textAlign='left';
    const bw=W-2*P-90, by=ry+52;
    rr(P,by,bw,12,6); x.fillStyle=C.line; x.fill();
    if(r.entered&&r.pts){ rr(P,by,Math.max(12,Math.min(1,r.pts/mx)*bw),12,6); x.fillStyle=col(b)===C.ink?C.acc:col(b); x.fill(); }
    if(t.mode==='sum'){ const tx=P+100/mx*bw; x.fillStyle=C.ink; x.fillRect(tx-1.5,by-5,3,22); }
  });
  y+=errCats.length*rowH+10;
  if(basis&&g){
    x.fillStyle=C.ink; x.font=`700 40px ${D}`; x.fillText('Ghost 9-Ball',P,y+40);
    x.textAlign='right'; x.font=`700 44px ${D}`; x.fillText(g.entered?String(g.pts):'·',W-P,y+42); x.textAlign='left';
    const racks=g.cat.parts[0].fields.map((f,i)=>s.scores[g.cat.id+'.a.'+i]), cw=(W-2*P-9*12)/10;
    racks.forEach((v,i)=>{ const rx=P+i*(cw+12), ry=y+70; rr(rx,ry,cw,110,16);
      if(v===15){ x.fillStyle=C.good; x.fill(); } else { x.fillStyle=C.card; x.fill(); x.lineWidth=3; x.strokeStyle=v===10?C.good:C.line; x.stroke(); }
      x.textAlign='center'; x.fillStyle=v===15?'#fff':C.muted; x.font=`600 22px ${B}`; x.fillText(String(i+1),rx+cw/2,ry+32);
      x.fillStyle=v===15?'#fff':v===10?C.good:C.ink; x.font=`700 46px ${D}`; x.fillText(typeof v==='number'?String(v):'·',rx+cw/2,ry+88); x.textAlign='left'; });
    x.fillStyle=C.muted; x.font=`500 26px ${B}`; x.fillText(`${racks.filter(v=>v===15).length} break and runs · ${racks.filter(v=>v===10).length} runs after ball in hand`,P,y+225);
    y+=260;
  }
  if(t.emblems&&c.complete){ const hit=t.emblems.filter(e=>c.total>=e); x.fillStyle=C.muted; x.font=`500 28px ${B}`; x.fillText(hit.length?`Cleared the ${hit[hit.length-1]} line in the ${t.name} book.`:`${t.emblems[0]-c.total} short of the first ${t.name} emblem line (${t.emblems[0]}).`,P,y+50); y+=110; }
  return new Promise(res=>cv.toBlob(b=>res(b),'image/png'));
}
async function openPicture(s){
  S.sheet={ kind:'pic', busy:true }; render(true);
  const blob=await resultPicture(s); if(!S.sheet||S.sheet.kind!=='pic') return;
  const t=testById(s.test), name=`${t.name.replace(/\s+/g,'-')}-${s.date}.png`;
  const url=await new Promise(res=>{ const fr=new FileReader(); fr.onload=()=>res(fr.result); fr.readAsDataURL(blob); });
  if(!S.sheet||S.sheet.kind!=='pic') return;
  S.sheet={ kind:'pic', file:new File([blob],name,{ type:'image/png' }), url, name }; render(true);
}

/* ---------- Backup and restore (scores live on this phone) ---------- */
function backupJSON(){ return JSON.stringify({ app:'pat-tracker', v:1, exported:new Date().toISOString(), sessions:S.sessions.filter(hasData).map(s=>{ const c=Object.assign({},s); if(c.timer){ c.times=Object.assign({},c.times); c.times[c.timer.cat]=Math.round(tOf(s,c.timer.cat)); delete c.timer; } return c; }) }); }
function cleanSession(r){
  if(!r||typeof r.id!=='string'||typeof r.test!=='string'||!testById(r.test)) return null;
  const scores={}; Object.keys(r.scores||{}).forEach(k=>{ const v=r.scores[k]; if(typeof v==='number'&&isFinite(v)) scores[k]=v; });
  const notes={}; Object.keys(r.notes||{}).forEach(k=>{ if(typeof r.notes[k]==='string') notes[k]=r.notes[k].slice(0,2000); });
  const times={}; Object.keys(r.times||{}).forEach(k=>{ const v=r.times[k]; if(typeof v==='number'&&isFinite(v)&&v>=0) times[k]=Math.round(v); });
  const sharedWith=Array.isArray(r.sharedWith)?r.sharedWith.filter(x=>typeof x==='string').slice(0,50):[]; const sharedNames={}; sharedWith.forEach(u=>{ if(r.sharedNames&&typeof r.sharedNames[u]==='string') sharedNames[u]=r.sharedNames[u].slice(0,40); });
  return { id:r.id.slice(0,40), test:r.test, times, sharedWith, sharedNames, date:/^\d{4}-\d{2}-\d{2}$/.test(r.date)?r.date:today(), created:+r.created||Date.now(), updatedAt:+r.updatedAt||0, scores, notes, finished:!!r.finished };
}
function mergeBackup(text){
  let d; try{ d=JSON.parse(text); }catch(e){ return { error:'That file is not a PAT Tracker backup.' }; }
  if(!d||d.app!=='pat-tracker'||!Array.isArray(d.sessions)) return { error:'That file is not a PAT Tracker backup.' };
  let added=0, updated=0;
  d.sessions.forEach(r=>{ const c=cleanSession(r); if(!c) return; const l=sess(c.id);
    if(!l){ S.sessions.push(c); S.tomb=S.tomb.filter(t=>t!==c.id); added++; }
    else if(c.updatedAt>l.updatedAt){ Object.assign(l,c); updated++; } });
  persist(); return { added, updated };
}
async function saveBackup(){
  const name='pat-tracker-backup-'+today()+'.json', text=backupJSON();
  const file=new File([text], name, { type:'application/json' });
  try{ if(navigator.canShare&&navigator.canShare({ files:[file] })){ await navigator.share({ files:[file], title:'PAT Tracker backup' }); markBackup(); return; } }
  catch(e){ if(e&&e.name==='AbortError') return; }
  try{ const url=URL.createObjectURL(file), a=document.createElement('a'); a.href=url; a.download=name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(url),4000); markBackup(); toast('Backup file saved'); }
  catch(e){ toast('Could not save the file'); }
}
function markBackup(){ S.prefs.lastBackup=today(); persist(); }

/* ---------- Small charts ---------- */
function spark(vals,w,h){
  if(vals.length<2) return '';
  const mn=Math.min(...vals), mx=Math.max(...vals), sp=(mx-mn)||1;
  const P=vals.map((v,i)=>[3+i*(w-6)/(vals.length-1), h-4-(v-mn)/sp*(h-8)]);
  return `<svg class="spark" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" aria-hidden="true"><polyline points="${P.map(p=>p[0].toFixed(1)+','+p[1].toFixed(1)).join(' ')}" fill="none" stroke="var(--accent)" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/><circle cx="${P[P.length-1][0].toFixed(1)}" cy="${P[P.length-1][1].toFixed(1)}" r="2.8" fill="var(--accent)"/></svg>`;
}
function trendChart(points, target, unit){
  const W=340,H=170,L=38,Rr=12,Tp=14,B=26;
  const vals=points.map(p=>p.v), lo=Math.min(...vals,target==null?vals[0]:target), hi=Math.max(...vals,target==null?vals[0]:target);
  const step=hi<=20?2:10, pad=Math.max(step,(hi-lo)*.15), mn=Math.max(0,Math.floor((lo-pad)/step)*step), mx=Math.ceil((hi+pad)/step)*step;
  const X=i=>points.length===1?(L+(W-L-Rr)/2):L+i*(W-L-Rr)/(points.length-1), Y=v=>Tp+(1-(v-mn)/(mx-mn))*(H-Tp-B);
  let o='';
  [mn,(mn+mx)/2,mx].forEach(v=>{ o+=`<line x1="${L}" x2="${W-Rr}" y1="${Y(v)}" y2="${Y(v)}" stroke="var(--line)"/><text x="${L-6}" y="${Y(v)+4}" text-anchor="end" class="ax">${Math.round(v)}</text>`; });
  if(target!=null) o+=`<line x1="${L}" x2="${W-Rr}" y1="${Y(target)}" y2="${Y(target)}" stroke="var(--good)" stroke-dasharray="4 4" stroke-width="1.2"/><text x="${L+4}" y="${Y(target)-5}" class="ax" fill="var(--good)">target ${target}${unit}</text>`;
  const P=points.map((p,i)=>[X(i),Y(p.v)]);
  if(P.length>1){ o+=`<polygon points="${L},${H-B} ${P.map(p=>p[0].toFixed(1)+','+p[1].toFixed(1)).join(' ')} ${P[P.length-1][0].toFixed(1)},${H-B}" fill="var(--accent)" fill-opacity=".12"/><polyline points="${P.map(p=>p[0].toFixed(1)+','+p[1].toFixed(1)).join(' ')}" fill="none" stroke="var(--accent)" stroke-width="2.2" stroke-linejoin="round"/>`; }
  P.forEach((p,i)=>{ const last=i===P.length-1; o+=`<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="${last?4.5:3}" fill="${last?'var(--accent)':'var(--surface)'}" stroke="var(--accent)" stroke-width="2"/>`; });
  const lastP=P[P.length-1]; o+=`<text x="${Math.min(lastP[0],W-Rr-4).toFixed(1)}" y="${(lastP[1]-10).toFixed(1)}" text-anchor="end" class="ax strong">${points[points.length-1].v}</text>`;
  o+=`<text x="${L}" y="${H-7}" class="ax">${esc(points[0].label)}</text>`;
  if(points.length>1) o+=`<text x="${W-Rr}" y="${H-7}" text-anchor="end" class="ax">${esc(points[points.length-1].label)}</text>`;
  return `<svg class="trend" viewBox="0 0 ${W} ${H}" role="img" aria-label="Score trend">${o}</svg>`;
}

/* ---------- Views ---------- */
const app=document.getElementById('app');
function go(v){ const cur=S.view; if(cur&&cur.name==='drill'){ const s0=sess(cur.id); if(s0&&s0.timer){ stopTimer(s0); touch(s0); } } S.view=v; S.sheet=null; if(['home','history','insights'].includes(v.name)){ const h='#'+v.name; if(location.hash!==h){ try{ history.replaceState(null,'',h); }catch(e){ location.hash=h; } } } render(); window.scrollTo(0,0); }
function render(keep){
  const y=window.scrollY, v=S.view;
  const html={ home:vHome, session:vSession, drill:vDrill, result:vResult, history:vHistory, insights:vInsights, shared:vShared }[v.name]();
  app.innerHTML=html+(S.sheet?vSheet():'')+(S.toast?`<div class="toast" role="status">${esc(S.toast)}</div>`:'');
  if(keep){ window.scrollTo(0,y); requestAnimationFrame(()=>window.scrollTo(0,y)); }
}
function toast(t){ S.toast=t; render(true); clearTimeout(toast.t); toast.t=setTimeout(()=>{ S.toast=''; const el=document.querySelector('.toast'); if(el) el.remove(); },2200); }
const nav=cur=>`<nav class="tabs" aria-label="Sections">${[['home','Tests'],['history','History'],['insights','Insights']].map(t=>`<button data-act="tab" data-v="${t[0]}" class="${cur===t[0]?'on':''}"${cur===t[0]?' aria-current="page"':''}>${t[1]}</button>`).join('')}</nav>`;
const topBar=(title,back,right)=>`<header class="top">${back?`<button class="back" data-act="back" aria-label="Back">&#8249;</button>`:''}<h1>${esc(title)}</h1>${right||''}</header>`;
const band=(test,pts,max)=>{ if(pts==null) return ''; if(test.mode==='sum') return pts>=100?'good':pts>=80?'warn':'bad'; return pts>=80?'good':pts>=60?'warn':'bad'; };
const bandK=(test,cat,v)=>{ if(v==null) return ''; const k=cat.kind; if(k==='errors') return v===0?'good':v<=2?'warn':'bad'; if(k==='ghost') return v>=100?'good':v>=70?'warn':'bad'; return band(test,v); };
const isB=t=>t.mode==='basis';
const fmtT=sec=>{ sec=Math.max(0,Math.round(sec)); const m=Math.floor(sec/60), s=sec%60; return m+':'+String(s).padStart(2,'0'); };
const parseT=str=>{ const m=String(str).trim().match(/^(\d{1,3})(?:[:.,](\d{1,2}))?$/); if(!m) return null; return (+m[1])*60+(m[2]?+m[2]:0); };
const tOf=(s,cid)=>{ const base=(s.times&&s.times[cid])||0, on=s.timer&&s.timer.cat===cid; return base+(on?(Date.now()-s.timer.start)/1000:0); };
const tTotal=(s,t)=>t.cats.filter(c=>c.timed).reduce((x,c)=>x+tOf(s,c.id),0);
function stopTimer(s){ if(!s.timer) return; s.times=s.times||{}; s.times[s.timer.cat]=Math.round(tOf(s,s.timer.cat)); delete s.timer; }
setInterval(()=>{ const el=document.getElementById('tval'); if(!el) return; const s=sess(S.view.id); if(s&&s.timer) el.textContent=fmtT(tOf(s,el.dataset.cat)); },500);
const catSub=c=>{ const k=c.cat.kind||'pat'; if(k==='errors') return c.cat.parts[0].fields.length>1?`${c.cat.parts[0].fields.length} rounds · fewer errors is better`:'fewer errors is better'; if(k==='ghost') return '10 racks · max 150'; if(k==='pat') return `target avg ${c.cat.target} · max ${c.max} pts`; return k==='lower'?'fewer innings is better':'percent of maximum'; };

function vHome(){
  S.sessions=S.sessions.filter(s=>hasData(s)||Date.now()-s.created<5000||S.view.id===s.id);
  const open=S.sessions.filter(s=>hasData(s)&&!s.finished).sort((a,b)=>b.updatedAt-a.updatedAt).slice(0,3);
  let h=`<header class="top home"><div><h1>PAT Tracker</h1><p class="sub">Score a test, see where the points went.</p></div><div class="hbtns">${C()?`<button class="sync" data-act="account">${me()?esc(me().nick||'Account'):'Sign in'}</button>`:''}<button class="sync" data-act="backup">Backup</button></div></header><main>`;
  if(open.length){ h+=`<section><h2>Pick up where you stopped</h2>${open.map(s=>{ const t=testById(s.test), c=calcOf(s); return `<button class="row" data-act="open" data-id="${s.id}"><span class="row-main"><b>${t.name}</b><small>${fmtDate(s.date)} · ${c.doneCount} of ${t.cats.length} drills scored</small></span><span class="num">${isB(t)?`${c.errors}<small class="unit">err</small> ${c.total}`:c.total}</span><span class="chev">&#8250;</span></button>`; }).join('')}</section>`; }
  h+=`<section><h2>Start a test</h2>`;
  TESTS.forEach(t=>{
    if(isB(t)){ h+=homeBasis(t); return; }
    const done=completeOf(t.id), totals=done.map(s=>calcOf(s).total), max=sessionCalc(t,{}).maxTotal;
    const best=totals.length?Math.max(...totals):null, last=totals.length?totals[totals.length-1]:null;
    h+=`<article class="card test"><div class="test-head"><div><h3>${t.name}</h3><p>${t.sub}</p></div>${spark(totals.slice(-8),84,34)}</div>
      <dl class="stats"><div><dt>Drills</dt><dd>${t.cats.length}</dd></div><div><dt>${t.mode==='sum'?'Target':'Out of'}</dt><dd>${t.mode==='sum'?t.targetTotal:100}</dd></div><div><dt>Best</dt><dd>${best==null?'&middot;':best}</dd></div><div><dt>Last</dt><dd>${last==null?'&middot;':last}</dd></div></dl>
      <p class="fine">${t.mode==='sum'?`Every drill is worth 100 at its target average. The ceiling is ${max}.`:'Each drill is scored as a percentage of its maximum.'}</p>
      <button class="btn primary" data-act="start" data-test="${t.id}">Start ${t.name}</button></article>`;
  });
  return h+`</section></main>`+nav('home');
}

function homeBasis(t){
  const all=sorted(t.id).map(calcOf), ec=all.filter(c=>c.errorsComplete), gc=all.filter(c=>c.ghostComplete);
  const g=gc.map(c=>c.total), e=ec.map(c=>c.errors);
  const best=g.length?Math.max(...g):null, fewest=e.length?Math.min(...e):null;
  const last={ errors:ec.length?ec[ec.length-1].errors:'&middot;', total:gc.length?gc[gc.length-1].total:'&middot;' };
  return `<article class="card test"><div class="test-head"><div><h3>${t.name}</h3><p>${t.sub}</p></div>${spark(g.slice(-8),84,34)}</div>
    <dl class="stats"><div><dt>Fewest errors</dt><dd>${fewest==null?'&middot;':fewest}</dd></div><div><dt>Best ghost</dt><dd>${best==null?'&middot;':best}</dd></div><div><dt>Last errors</dt><dd>${last.errors}</dd></div><div><dt>Last ghost</dt><dd>${last.total}</dd></div></dl>
    <p class="fine">Count your errors in drills 1 to 6, fewer is better. Then play 10 racks against the ghost, out of 150.</p>
    <button class="btn primary" data-act="start" data-test="${t.id}">Start ${t.name}</button></article>`;
}
function heroBasis(s,t,c){
  const tt=tTotal(s,t);
  return `<div class="duo"><div><span class="big ${c.errorsComplete?bandK(t,{kind:'errors'},c.errors>5?3:c.errors>2?1:0):''}">${c.errors}</span><span class="of">errors</span></div><div><span class="big">${c.total}</span><span class="of">ghost, of 150</span></div>${tt?`<div><span class="big sm">${fmtT(tt)}</span><span class="of">time, drills 1 to 6</span></div>`:''}</div>`;
}
function catRow(test,s,c,i){
  const state=c.complete?'done':c.entered?'part':'todo';
  const right=c.entered?`<span class="num ${c.complete?bandK(test,c.cat,c.pts):''}">${c.pts}</span>`:`<span class="num dim">&middot;</span>`;
  const tm=c.cat.timed?tOf(s,c.cat.id):0, sub=catSub(c)+(tm?` · ${fmtT(tm)}`:'');
  return `<button class="row" data-act="drill" data-ci="${i}"><span class="idx ${state}">${i+1}</span><span class="row-main"><b>${c.cat.name}</b><small>${c.entered&&!c.complete?`${c.entered} of ${c.n} entered`:sub}</small></span>${right}<span class="chev">&#8250;</span></button>`;
}
function vSession(){
  const s=sess(S.view.id), t=testById(s.test), c=calcOf(s);
  let h=topBar(t.name,true)+`<main><section class="card hero">${isB(t)?heroBasis(s,t,c):`<div class="hero-num"><span class="big">${c.total}</span><span class="of">${t.mode==='sum'?`of ${t.targetTotal} target`:'out of 100'}</span></div>`}
    <div class="prog"><div style="width:${c.doneCount/t.cats.length*100}%"></div></div>
    <div class="hero-foot"><span>${c.doneCount} of ${t.cats.length} drills scored</span><label class="date">Date <input type="date" id="sess-date" data-chg="date" value="${s.date}"></label></div></section>
    <section><h2>Drills</h2>${c.cats.map((x,i)=>catRow(t,s,x,i)).join('')}</section>
    <div class="actions"><button class="btn primary" data-act="finish"${c.startedCount?'':' disabled'}>${c.complete?'Finish and see result':'See result so far'}</button><button class="btn ghost danger" data-act="askdel">Delete this test</button></div></main>`;
  return h;
}

function counter(key,val){
  const has=typeof val==='number';
  return `<div class="counter"><button class="cbtn" data-act="step" data-key="${key}" data-d="-1" aria-label="One fewer"${has&&val>0?'':' disabled'}>&minus;</button><span class="cval num${has?'':' dim'}">${has?val:'&middot;'}</span><button class="cbtn" data-act="step" data-key="${key}" data-d="1" aria-label="One more">+</button>${has?'':`<button class="btn ghost zero" data-act="set" data-key="${key}" data-val="0">No errors</button>`}${has?`<button class="link clear" data-act="clr" data-key="${key}">Clear</button>`:''}</div>`;
}
function chips(key,f,val){
  if(f.counter) return counter(key,val);
  const vals=f.values||Array.from({length:f.max-f.min+1},(_,i)=>f.min+i);
  let o=''; for(const v of vals) o+=`<button class="chip${val===v?' on':''}" data-act="set" data-key="${key}" data-val="${v}" aria-pressed="${val===v}">${v}</button>`;
  return `<div class="chips">${o}</div>`;
}
function vDrill(){
  const s=sess(S.view.id), t=testById(s.test), ci=S.view.ci, cat=t.cats[ci], pi=Math.min(S.view.pi||0,cat.parts.length-1), part=cat.parts[pi];
  const c=catCalc(cat,s.scores), kind=cat.kind||'pat', mir=S.prefs.mirror;
  let h=topBar(`${ci+1}. ${cat.name}`,true,`<span class="step">${ci+1}/${t.cats.length}</span>`)+'<main>';
  if(cat.parts.length>1) h+=`<div class="seg" role="tablist">${cat.parts.map((p,i)=>{ const filled=p.fields.every((f,k)=>typeof s.scores[cat.id+'.'+p.id+'.'+k]==='number'); return `<button role="tab" aria-selected="${i===pi}" class="${i===pi?'on':''}${filled?' filled':''}" data-act="part" data-pi="${i}">${p.label}</button>`; }).join('')}</div>`;
  h+=`<h2 class="part-title">${part.title}</h2>`;
  if(part.photo) h+=`<figure class="fig"><img class="photo" src="${part.photo}" width="720" height="960" alt="Set-up photo for ${esc(part.title)}" decoding="sync"></figure>`;
  else if(part.diagram) h+=`<figure class="fig">${drawDiagram(part.diagram,mir)}<figcaption><button class="link" data-act="mirror">${mir?'Show original side':'Mirror layout'}</button></figcaption></figure>`;
  else if(part.missing) h+=`<p class="missing">${part.missing}</p>`;
  h+=`<section class="card how">${part.tip?`<div class="tiprow">${tipSvg(part.tip,mir)}<span>Suggested tip position from the book</span></div>`:''}<ul>${part.how.map(x=>`<li>${x}</li>`).join('')}</ul></section>`;
  if(cat.timed){ const on=s.timer&&s.timer.cat===cat.id, tm=tOf(s,cat.id);
    const mm=tm&&!on?Math.floor(Math.round(tm)/60):'', ss=tm&&!on?Math.round(tm)%60:'';
    h+=`<section class="card timer"><div class="t-row"><div><span class="flabel">Time</span><span class="big sm num" id="tval" data-cat="${cat.id}">${fmtT(tm)}</span></div><div class="t-btns">${on?`<button class="btn danger-solid" data-act="t-stop">Stop</button>`:`<button class="btn primary" data-act="t-start">${tm?'Resume':'Start'}</button>`}</div></div><div class="t-row"><span class="fine">Or type it</span><div class="tpair"><input id="tmin" class="tman" data-chg="tmm" inputmode="numeric" pattern="[0-9]*" maxlength="3" placeholder="8" value="${mm}" aria-label="Minutes"${on?' disabled':''}><span class="fine">min</span><input id="tsec" class="tman" data-chg="tmm" inputmode="numeric" pattern="[0-9]*" maxlength="2" placeholder="43" value="${ss}" aria-label="Seconds"${on?' disabled':''}><span class="fine">sec</span></div>${tm&&!on?'<button class="link" data-act="t-reset">Reset</button>':''}</div><p class="fine">The clock stops by itself when you leave this drill.</p></section>`; }
  // live summary
  const prev=sorted(t.id).filter(x=>x.id!==s.id).map(x=>catCalc(cat,x.scores)).filter(x=>x.complete).map(x=>x.pts);
  const lower=kind==='errors', best=prev.length?(lower?Math.min(...prev):Math.max(...prev)):null, last=prev.length?prev[prev.length-1]:null;
  let avgTxt='', scale='';
  if(c.entered){
    if(kind==='pat'){ avgTxt=`average ${c.avg.toFixed(2)} against a target of ${cat.target}`; const sm=Math.max(c.max,100); scale=`<div class="meter"><div class="fill ${band(t,c.pts)}" style="width:${Math.min(100,c.pts/sm*100)}%"></div><i class="tick" style="left:${100/sm*100}%"></i></div><div class="meter-lab"><span>0</span><span style="left:${100/sm*100}%" class="abs">target 100</span><span>max ${c.max}</span></div>`; }
    else if(kind==='pct') avgTxt=`average ${c.avg.toFixed(2)} of ${cat.cap}`;
    else if(kind==='lower') avgTxt=`average ${c.avg.toFixed(1)} innings`;
    else if(kind==='errors') avgTxt=c.n>1?`${c.sum} errors in total`:'';
    else if(kind==='ghost'){ const v=part.fields.map((f,i)=>s.scores[cat.id+'.a.'+i]).filter(x=>typeof x==='number'); avgTxt=`average ${c.avg.toFixed(1)} per rack, ${v.filter(x=>x===15).length} break and runs`; scale=`<div class="meter"><div class="fill ${c.complete?bandK(t,cat,c.pts):''}" style="width:${Math.min(100,c.pts/150*100)}%"></div></div><div class="meter-lab"><span>0</span><span>150</span></div>`; }
    else avgTxt=`${c.sum} of ${c.complete?cat.cap:c.entered*7} so far`;
  }
  const hist=best!=null?`<span>${lower?'Fewest':'Best'} <b>${best}</b></span><span>Last <b>${last}</b></span>`:'<span>First time on this drill</span>';
  const isNew=c.complete&&best!=null&&(lower?c.pts<best:c.pts>best)?'<span class="pill good">New best</span>':'';
  const fieldsHtml=part.fields.map((f,i)=>{ const key=cat.id+'.'+part.id+'.'+i; return `<div class="field"><span class="flabel">${f.label}</span>${chips(key,f,s.scores[key])}</div>`; }).join('');
  const showTotal=!(kind==='errors'&&c.n===1);
  const hint=`<p class="fine">${kind==='errors'?'Use + and − to count your errors as you play.':'Tap a number for each line. Tap it again to clear it.'}</p>`;
  h+=`<section class="card entry"><div class="entry-head"><h3>${kind==='errors'?'Your errors':'Your score'}</h3><div class="sum-side">${hist}${isNew}</div></div>${hint}${fieldsHtml}${showTotal?`<div class="sum-row"><div><span class="big ${c.complete?bandK(t,cat,c.pts):''}">${c.entered?c.pts:'&middot;'}</span><span class="of">${kind==='pat'||kind==='ghost'?'points':kind==='errors'?(c.pts===1?'error in total':'errors in total'):'percent'}${c.entered&&!c.complete?' so far':''}</span></div>${avgTxt&&kind!=='errors'?`<p class="fine">${c.entered} of ${c.n} entered, ${avgTxt}.</p>`:''}${scale}</div>`:''}</section>`;
  h+=`<section class="card"><label class="flabel" for="note">Notes for this drill</label><textarea id="note" data-inp="note" rows="2" placeholder="${kind==='errors'?'What caused the errors?':'What cost you points?'}">${esc(s.notes[cat.id]||'')}</textarea></section>`;
  const lastPart=pi===cat.parts.length-1, lastCat=ci===t.cats.length-1;
  h+=`</main><footer class="pager"><button class="btn ghost" data-act="prev"${ci===0&&pi===0?' disabled':''}>Back</button><button class="btn ghost" data-act="list">All drills</button><button class="btn primary" data-act="next">${lastPart&&lastCat?'Result':'Next'}</button></footer>`;
  return h;
}

function vResult(){
  const s=sess(S.view.id), t=testById(s.test), c=calcOf(s);
  if(isB(t)) return vResultBasis(s,t,c);
  const others=completeOf(t.id).filter(x=>x.id!==s.id), before=others.filter(x=>x.date<s.date||(x.date===s.date&&x.created<s.created));
  const prev=before.length?calcOf(before[before.length-1]):null, bestOther=others.length?Math.max(...others.map(x=>calcOf(x).total)):null;
  const done=c.cats.filter(x=>x.complete), sm=Math.max(100,...c.cats.map(x=>x.max));
  let h=topBar(`${t.name} result`,true)+'<main>';
  h+=`<section class="card hero"><p class="eyebrow">${fmtDate(s.date)}${c.complete?'':` · ${c.doneCount} of ${t.cats.length} drills`}</p><div class="hero-num"><span class="big">${c.total}</span><span class="of">${t.mode==='sum'?`of ${t.targetTotal} target · ceiling ${c.maxTotal}`:'average percent'}</span></div><div class="pills">`;
  if(c.complete&&prev) { const d=c.total-prev.total; h+=`<span class="pill ${d>=0?'good':'bad'}">${d>=0?'+':''}${d} vs previous</span>`; }
  if(c.complete&&bestOther!=null&&c.total>bestOther) h+=`<span class="pill good">Personal best</span>`;
  if(t.mode==='sum'&&done.length) h+=`<span class="pill">${done.filter(x=>x.pts>=80).length} of ${done.length} drills at 80 or more</span>`;
  if(!c.complete) h+=`<span class="pill warn">Partial test</span>`;
  h+=`</div>`;
  if(t.emblems&&c.complete){ const mx=t.emblems[t.emblems.length-1]*1.1; h+=`<div class="emb"><div class="emb-track"><div class="emb-fill" style="width:${Math.min(100,c.total/mx*100)}%"></div>${t.emblems.map(e=>`<i style="left:${e/mx*100}%" class="${c.total>=e?'hit':''}"><b>${e}</b></i>`).join('')}</div><p class="fine">Emblem lines in the ${t.name} book. ${c.total>=t.emblems[0]?`You cleared ${t.emblems.filter(e=>c.total>=e).pop()}.`:`${t.emblems[0]-c.total} short of the first line.`}</p></div>`; }
  h+=`</section>`;
  h+=`<section class="card"><h3>Points by drill</h3><div class="bars">${c.cats.map((x,i)=>{ const pv=prev?prev.cats[i]:null, d=x.complete&&pv&&pv.complete?x.pts-pv.pts:null;
    return `<button class="bar" data-act="drill" data-ci="${i}"><span class="bar-name">${i+1}. ${x.cat.name}</span><span class="bar-val num ${x.complete?band(t,x.pts):'dim'}">${x.entered?x.pts:'&middot;'}${d!=null&&d!==0?`<small class="${d>0?'up':'down'}">${d>0?'+':''}${d}</small>`:''}</span><span class="track"><span class="cap" style="width:${x.max/sm*100}%"></span>${x.entered?`<span class="fill ${band(t,x.pts)}" style="width:${Math.min(100,x.pts/sm*100)}%"></span>`:''}${t.mode==='sum'?`<i class="tick" style="left:${100/sm*100}%"></i>`:''}</span></button>`; }).join('')}</div>${t.mode==='sum'?'<p class="fine">The mark on each bar is the 100 point target. The pale track ends at that drill\'s maximum.</p>':''}</section>`;
  if(done.length>=4){
    const rank=[...done].sort((a,b)=>b.pts-a.pts);
    h+=`<section class="two"><div class="card"><h3>Strongest</h3><ol class="rank">${rank.slice(0,3).map(x=>`<li><span>${x.cat.name}</span><b class="num">${x.pts}</b></li>`).join('')}</ol></div><div class="card"><h3>Costing you most</h3><ol class="rank">${rank.slice(-3).reverse().map(x=>`<li><span>${x.cat.name}</span><b class="num">${x.pts}</b></li>`).join('')}</ol></div></section>`;
  }
  const notes=t.cats.filter(k=>s.notes[k.id]);
  if(notes.length) h+=`<section class="card"><h3>Your notes</h3>${notes.map(k=>`<p class="noteline"><b>${k.name}</b> ${esc(s.notes[k.id])}</p>`).join('')}</section>`;
  h+=`<div class="actions"><button class="btn primary" data-act="edit">Edit scores</button>${C()&&s?`<button class="btn" data-act="share">${(s.sharedWith||[]).length?`Shared with ${(s.sharedWith||[]).map(u=>esc((s.sharedNames||{})[u]||'someone')).join(', ')}`:'Share this test'}</button>`:''}<button class="btn" data-act="pic">Share as picture</button><button class="btn" data-act="copy">Copy summary</button><button class="btn ghost danger" data-act="askdel">Delete this test</button></div></main>`;
  return h;
}

function vResultBasis(s,t,c){
  const others=completeOf(t.id).filter(x=>x.id!==s.id), before=others.filter(x=>x.date<s.date||(x.date===s.date&&x.created<s.created));
  const prev=before.length?calcOf(before[before.length-1]):null, oc=others.map(calcOf);
  let h=topBar(`${t.name} result`,true)+'<main>';
  h+=`<section class="card hero"><p class="eyebrow">${fmtDate(s.date)}${c.complete?'':` · ${c.doneCount} of ${t.cats.length} drills`}</p>${heroBasis(s,t,c)}<div class="pills">`;
  if(c.complete&&prev){ const de=c.errors-prev.errors, dg=c.total-prev.total; h+=`<span class="pill ${de<=0?'good':'bad'}">${de>0?'+':''}${de} errors vs previous</span><span class="pill ${dg>=0?'good':'bad'}">${dg>0?'+':''}${dg} ghost vs previous</span>`; }
  if(c.complete&&oc.length&&c.errors<Math.min(...oc.map(x=>x.errors))) h+=`<span class="pill good">Fewest errors yet</span>`;
  if(c.complete&&oc.length&&c.total>Math.max(...oc.map(x=>x.total))) h+=`<span class="pill good">Best ghost score</span>`;
  if(!c.complete) h+=`<span class="pill warn">Partial test</span>`;
  h+=`</div></section>`;
  const ec=c.cats.filter(x=>x.kind==='errors'), mx=Math.max(4,...ec.map(x=>x.pts||0));
  h+=`<section class="card"><h3>Errors by drill</h3><div class="bars">${ec.map((x,i)=>{ const pv=prev?prev.cats[i]:null, d=x.complete&&pv&&pv.complete?x.pts-pv.pts:null, tm=tOf(s,x.cat.id);
    return `<button class="bar" data-act="drill" data-ci="${i}"><span class="bar-name">${i+1}. ${x.cat.name}${tm?` <small class="dim">${fmtT(tm)}</small>`:''}</span><span class="bar-val num ${x.complete?bandK(t,x.cat,x.pts):'dim'}">${x.entered?x.pts:'&middot;'}${d!=null&&d!==0?`<small class="${d<0?'up':'down'}">${d>0?'+':''}${d}</small>`:''}</span><span class="track"><span class="cap" style="width:100%"></span>${x.entered&&x.pts?`<span class="fill ${bandK(t,x.cat,x.pts)}" style="width:${Math.min(100,x.pts/mx*100)}%"></span>`:''}</span></button>`; }).join('')}</div></section>`;
  const g=c.cats.find(x=>x.kind==='ghost'), gi=c.cats.indexOf(g), racks=g.cat.parts[0].fields.map((f,i)=>s.scores[g.cat.id+'.a.'+i]);
  h+=`<section class="card"><button class="row plain" data-act="drill" data-ci="${gi}"><span class="row-main"><b>Ghost 9-Ball</b><small>${racks.filter(v=>v===15).length} break and runs · ${racks.filter(v=>v===10).length} runs after ball in hand</small></span><span class="num">${g.entered?g.pts:'&middot;'}</span><span class="chev">&#8250;</span></button><div class="racks">${racks.map((v,i)=>`<span class="rk ${v===15?'r15':v===10?'r10':typeof v==='number'?'rx':'re'}"><small>${i+1}</small>${typeof v==='number'?v:'&middot;'}</span>`).join('')}</div></section>`;
  const notes=t.cats.filter(k=>s.notes[k.id]);
  if(notes.length) h+=`<section class="card"><h3>Your notes</h3>${notes.map(k=>`<p class="noteline"><b>${k.name}</b> ${esc(s.notes[k.id])}</p>`).join('')}</section>`;
  h+=`<div class="actions"><button class="btn primary" data-act="edit">Edit scores</button>${C()&&s?`<button class="btn" data-act="share">${(s.sharedWith||[]).length?`Shared with ${(s.sharedWith||[]).map(u=>esc((s.sharedNames||{})[u]||'someone')).join(', ')}`:'Share this test'}</button>`:''}<button class="btn" data-act="pic">Share as picture</button><button class="btn" data-act="copy">Copy summary</button><button class="btn ghost danger" data-act="askdel">Delete this test</button></div></main>`;
  return h;
}

function loadShared(){ const c=C(); if(!c||!c.user) return; S.sharedState='loading'; c.listShared().then(list=>{ S.shared=list; S.sharedState='ok'; if(S.view.name==='history'||S.view.name==='shared') render(true); }).catch(()=>{ S.sharedState='error'; if(S.view.name==='history') render(true); }); }
function vSharedList(){
  if(!S.shared&&S.sharedState!=='error'){ if(S.sharedState!=='loading') loadShared(); return `<p class="empty">Loading tests shared with you...</p>`; }
  if(S.sharedState==='error'&&!S.shared) return `<p class="empty">Could not load shared tests. Check your connection and open this tab again.</p>`;
  const list=(S.shared||[]).filter(x=>testById(x.test)).sort((a,b)=>a.date<b.date?1:-1);
  if(!list.length) return `<p class="empty">Nobody has shared a test with you yet. Others can share with you using your email or your nickname, ${esc(me().nick||'')}.</p>`;
  return `<section>${list.map(x=>{ const t=testById(x.test), c=sessionCalc(t,x.scores); return `<button class="row" data-act="openshared" data-key="${esc(x.key)}"><span class="tag">${t.name}</span><span class="row-main"><b>${esc(x.ownerNick)}</b><small>${fmtDate(x.date)}${c.complete?'':` · ${c.doneCount} of ${t.cats.length} drills`}</small></span><span class="num">${isB(t)?`${c.errors}<small class="unit">err</small> ${c.total}`:c.total}</span><span class="chev">&#8250;</span></button>`; }).join('')}</section><button class="btn ghost" data-act="reshared">Refresh</button>`;
}
function vShared(){
  const x=(S.shared||[]).find(y=>y.key===S.view.key); if(!x) return topBar('Shared test',true)+`<main><p class="empty">This test is no longer shared with you.</p></main>`;
  const t=testById(x.test), c=sessionCalc(t,x.scores), tt=t.cats.filter(k=>k.timed).reduce((a,k)=>a+((x.times||{})[k.id]||0),0);
  let h=topBar(`${t.name} · ${x.ownerNick}`,true)+'<main>';
  h+=`<section class="card hero"><p class="eyebrow">${esc(x.ownerNick)} · ${fmtDate(x.date)}${c.complete?'':` · ${c.doneCount} of ${t.cats.length} drills`}</p>`;
  h+= isB(t) ? `<div class="duo"><div><span class="big">${c.errors}</span><span class="of">errors</span></div><div><span class="big">${c.total}</span><span class="of">ghost, of 150</span></div>${tt?`<div><span class="big sm">${fmtT(tt)}</span><span class="of">time, drills 1 to 6</span></div>`:''}</div>`
     : `<div class="hero-num"><span class="big">${c.total}</span><span class="of">${t.mode==='sum'?`of ${t.targetTotal} target`:'average percent'}</span></div>`;
  h+=`</section>`;
  c.cats.forEach((k,i)=>{
    const tm=(x.times||{})[k.cat.id];
    h+=`<section class="card shared-cat"><div class="entry-head"><h3>${i+1}. ${k.cat.name}</h3><span class="num big sm ${k.complete?bandK(t,k.cat,k.pts):'dim'}">${k.entered?k.pts:'&middot;'}</span></div><p class="fine">${catSub(k)}${tm?` · time ${fmtT(tm)}`:''}</p>`;
    k.cat.parts.forEach(p=>{
      h+=`${k.cat.parts.length>1?`<p class="flabel">${p.label||''} ${p.title}</p>`:''}<div class="vals">${p.fields.map((f,fi)=>{ const v=x.scores[k.cat.id+'.'+p.id+'.'+fi]; return `<span class="vv"><small>${esc(f.label.replace('Errors, ',''))}</small><b class="num">${typeof v==='number'?v:'&middot;'}</b></span>`; }).join('')}</div>`;
    });
    if(x.notes&&x.notes[k.cat.id]) h+=`<p class="noteline"><b>Notes</b> ${esc(x.notes[k.cat.id])}</p>`;
    h+=`</section>`;
  });
  return h+'</main>';
}
function vHistory(){
  const all=sorted().reverse(), tab=me()?(S.view.tab||'mine'):'mine';
  let h=topBar('History')+'<main>';
  if(me()) h+=`<div class="seg"><button class="${tab==='mine'?'on':''}" data-act="htab" data-tab="mine">My tests</button><button class="${tab==='shared'?'on':''}" data-act="htab" data-tab="shared">Shared with me</button></div>`;
  if(tab==='shared') return h+vSharedList()+'</main>'+nav('history');
  if(!all.length) h+=`<p class="empty">No tests yet. Score your first one from the Tests tab and it shows up here.</p>`;
  else h+=`<section>${all.map(s=>{ const t=testById(s.test), c=calcOf(s); return `<button class="row" data-act="result" data-id="${s.id}"><span class="tag">${t.name}</span><span class="row-main"><b>${fmtDate(s.date)}</b><small>${c.complete?'Full test':`${c.doneCount} of ${t.cats.length} drills`}${s.finished?'':' · in progress'}</small></span><span class="num">${isB(t)?`${c.errors}<small class="unit">err</small> ${c.total}`:c.total}</span><span class="chev">&#8250;</span></button>`; }).join('')}</section>`;
  return h+'</main>'+nav('history');
}

function vInsights(){
  const tid=S.view.test||(sorted().length?sorted()[sorted().length-1].test:'pat2'), t=testById(tid);
  const done=completeOf(tid), any=sorted(tid);
  let h=topBar('Insights')+`<main><div class="seg">${TESTS.map(x=>`<button class="${x.id===tid?'on':''}" data-act="instest" data-test="${x.id}">${x.short||x.name}</button>`).join('')}</div>`;
  if(!any.length){ return h+`<p class="empty">Nothing recorded for ${t.name} yet. After your first test this page shows your trend, your best per drill and what to practise next.</p></main>`+nav('insights'); }
  if(isB(t)) return h+insightsBasis(t,done,any)+'</main>'+nav('insights');
  if(done.length){ const pts=done.map(s=>({ v:calcOf(s).total, label:fmtDate(s.date) })), vals=pts.map(p=>p.v);
    h+=`<section class="card"><h3>Total score, full tests</h3>${trendChart(pts,t.mode==='sum'?t.targetTotal:80,'')}<dl class="stats"><div><dt>Tests</dt><dd>${vals.length}</dd></div><div><dt>Best</dt><dd>${Math.max(...vals)}</dd></div><div><dt>Average</dt><dd>${Math.round(vals.reduce((a,b)=>a+b,0)/vals.length)}</dd></div><div><dt>Last</dt><dd>${vals[vals.length-1]}</dd></div></dl></section>`;
  } else h+=`<p class="empty">Finish all ${t.cats.length} drills in one sitting to start the total score trend. Drill figures below already count.</p>`;
  const rows=t.cats.map((cat,i)=>{ const v=any.map(s=>catCalc(cat,s.scores)).filter(x=>x.complete).map(x=>x.pts); const l3=v.slice(-3);
    return { cat, i, v, best:v.length?Math.max(...v):null, last:v.length?v[v.length-1]:null, recent:l3.length?Math.round(l3.reduce((a,b)=>a+b,0)/l3.length):null, max:catMaxPts(cat) }; });
  const ranked=rows.filter(r=>r.recent!=null).sort((a,b)=>a.recent-b.recent);
  if(ranked.length>=3) h+=`<section class="card"><h3>Practise next</h3><p class="fine">Lowest recent scores, averaged over your last three attempts at each drill.</p><ol class="rank">${ranked.slice(0,3).map(r=>`<li><span>${r.cat.name}<small>${t.mode==='sum'?`${Math.max(0,100-r.recent)} points under target`:`${r.recent} percent`}</small></span><b class="num ${band(t,r.recent)}">${r.recent}</b></li>`).join('')}</ol></section>`;
  h+=`<section class="card"><h3>Every drill</h3><div class="tbl"><div class="tr th"><span>Drill</span><span>Last</span><span>Best</span><span>Trend</span></div>${rows.map(r=>`<div class="tr"><span>${r.i+1}. ${r.cat.name}</span><span class="num ${r.last!=null?band(t,r.last):'dim'}">${r.last==null?'&middot;':r.last}</span><span class="num">${r.best==null?'&middot;':r.best}</span><span>${spark(r.v.slice(-8),64,22)}</span></div>`).join('')}</div></section>`;
  return h+'</main>'+nav('insights');
}

function insightsBasis(t,done,any){
  let h='';
  if(done.length){ const cs=done.map(s=>({ c:calcOf(s), label:fmtDate(s.date) }));
    const g=cs.map(x=>({ v:x.c.total, label:x.label })), e=cs.map(x=>({ v:x.c.errors, label:x.label }));
    const gv=g.map(p=>p.v), ev=e.map(p=>p.v), avg=a=>Math.round(a.reduce((x,y)=>x+y,0)/a.length*10)/10;
    h+=`<section class="card"><h3>Errors, drills 1 to 6</h3><p class="fine">Lower is better.</p>${trendChart(e,null,'')}<dl class="stats"><div><dt>Tests</dt><dd>${ev.length}</dd></div><div><dt>Fewest</dt><dd>${Math.min(...ev)}</dd></div><div><dt>Average</dt><dd>${avg(ev)}</dd></div><div><dt>Last</dt><dd>${ev[ev.length-1]}</dd></div></dl></section>`;
    h+=`<section class="card"><h3>Ghost 9-Ball</h3>${trendChart(g,null,'')}<dl class="stats"><div><dt>Tests</dt><dd>${gv.length}</dd></div><div><dt>Best</dt><dd>${Math.max(...gv)}</dd></div><div><dt>Average</dt><dd>${avg(gv)}</dd></div><div><dt>Last</dt><dd>${gv[gv.length-1]}</dd></div></dl></section>`;
  } else h+=`<p class="empty">Finish all ${t.cats.length} parts in one sitting to start the trend charts. Drill figures below already count.</p>`;
  const rows=t.cats.map((cat,i)=>{ const v=any.map(s=>catCalc(cat,s.scores)).filter(x=>x.complete).map(x=>x.pts), l3=v.slice(-3), low=cat.kind==='errors';
    return { cat, i, v, best:v.length?(low?Math.min(...v):Math.max(...v)):null, last:v.length?v[v.length-1]:null, recent:l3.length?Math.round(l3.reduce((a,b)=>a+b,0)/l3.length*10)/10:null }; });
  const worst=rows.filter(r=>r.cat.kind==='errors'&&r.recent>0).sort((a,b)=>b.recent-a.recent);
  if(worst.length) h+=`<section class="card"><h3>Practise next</h3><p class="fine">Most errors on average over your last three attempts at each drill.</p><ol class="rank">${worst.slice(0,3).map(r=>`<li><span>${r.cat.name}</span><b class="num ${bandK(t,r.cat,Math.round(r.recent))}">${r.recent}</b></li>`).join('')}</ol></section>`;
  h+=`<section class="card"><h3>Every drill</h3><div class="tbl"><div class="tr th"><span>Drill</span><span>Last</span><span>Best</span><span>Trend</span></div>${rows.map(r=>`<div class="tr"><span>${r.i+1}. ${r.cat.name}</span><span class="num ${r.last!=null?bandK(t,r.cat,r.last):'dim'}">${r.last==null?'&middot;':r.last}</span><span class="num">${r.best==null?'&middot;':r.best}</span><span>${spark(r.v.slice(-8),64,22)}</span></div>`).join('')}</div><p class="fine">Best means fewest errors for drills 1 to 6.</p></section>`;
  return h;
}
function vSheet(){ const sh=S.sheet;
  if(sh.kind==='account'){
    const u=me(), mode=u?'profile':(sh.mode||'signin'), busy=sh.busy?' disabled':'', err=sh.err?`<p class="err" role="alert">${esc(sh.err)}</p>`:'', ok=sh.ok?`<p class="okmsg">${esc(sh.ok)}</p>`:'';
    let b='';
    if(mode==='profile'){ const n=S.sessions.filter(hasData).length;
      b=`<h3>${esc(u.nick||'Your account')}</h3><p class="fine">${esc(u.email)}</p><p>Your ${n} test${n===1?' is':'s are'} saved to your account. Others can share tests with you using your email or your nickname.</p><p class="fine" id="netstate">${netText()}</p><div class="actions"><button class="btn" data-act="signout"${busy}>Sign out</button><button class="btn ghost" data-act="cancel">Close</button></div>`; }
    else if(mode==='signup') b=`<h3>Create account</h3><form class="form" data-form="signup"><label for="f-nick">Nickname</label><input id="f-nick" value="${esc((sh.vals||{})["f-nick"]||"")}" autocomplete="username" autocapitalize="off" required minlength="3" maxlength="20" pattern="[A-Za-z0-9_.\\-]{3,20}"><label for="f-email">Email</label><input id="f-email" value="${esc((sh.vals||{})["f-email"]||"")}" type="email" autocomplete="email" required><label for="f-pass">Password</label><input id="f-pass" value="${esc((sh.vals||{})["f-pass"]||"")}" type="password" autocomplete="new-password" required minlength="6">${err}<button class="btn primary"${busy}>Create account</button></form><p class="fine">Already have an account? <button class="link" data-act="amode" data-mode="signin">Sign in</button></p>`;
    else if(mode==='reset') b=`<h3>Reset password</h3><form class="form" data-form="reset"><label for="f-email">Email</label><input id="f-email" value="${esc((sh.vals||{})["f-email"]||"")}" type="email" autocomplete="email" required>${err}${ok}<button class="btn primary"${busy}>Send reset email</button></form><p class="fine"><button class="link" data-act="amode" data-mode="signin">Back to sign in</button></p>`;
    else b=`<h3>Sign in</h3><form class="form" data-form="signin"><label for="f-email">Email</label><input id="f-email" value="${esc((sh.vals||{})["f-email"]||"")}" type="email" autocomplete="email" required><label for="f-pass">Password</label><input id="f-pass" value="${esc((sh.vals||{})["f-pass"]||"")}" type="password" autocomplete="current-password" required>${err}<button class="btn primary"${busy}>Sign in</button></form><p class="fine">New here? <button class="link" data-act="amode" data-mode="signup">Create an account</button> · <button class="link" data-act="amode" data-mode="reset">Forgot password</button></p><p class="fine">Tests already on this phone move into your account when you sign in.</p>`;
    return `<div class="scrim" data-act="cancel"></div><div class="sheet" role="dialog" aria-modal="true" aria-label="Account">${b}</div>`;
  }
  if(sh.kind==='pic'){
    const canShare=sh.file&&navigator.canShare&&navigator.canShare({ files:[sh.file] });
    return `<div class="scrim" data-act="closepic"></div><div class="sheet" role="dialog" aria-modal="true" aria-label="Result picture"><h3>Result picture</h3><div class="form"><label for="pic-name">Name on the picture</label><input id="pic-name" data-chg="picname" value="${esc(picName())}" placeholder="Your name" maxlength="40" autocomplete="name"></div>${sh.busy?'<p class="fine">Making the picture...</p>':`<img class="pic" src="${sh.url}" alt="Picture of this result"><div class="actions">${canShare?'<button class="btn primary" data-act="sharepic">Share or save...</button><p class="fine">Pick WhatsApp, Messages and so on, or Save Image to put it in your Photos.</p>':`<a class="btn primary file-btn" href="${sh.url}" download="${esc(sh.name)}">Save picture</a><p class="fine">Or press and hold the picture to save it.</p>`}<button class="btn ghost" data-act="closepic">Close</button></div>`}</div>`;
  }
  if(sh.kind==='share'){
    const s=sess(S.view.id), names=s.sharedWith||[], err=sh.err?`<p class="err" role="alert">${esc(sh.err)}</p>`:'';
    return `<div class="scrim" data-act="cancel"></div><div class="sheet" role="dialog" aria-modal="true" aria-label="Share"><h3>Share this test</h3><p class="fine">They see this test in full, with every drill, time and note. They do not see your other tests, your best or your history.</p><form class="form" data-form="share"><label for="f-share">Email or nickname</label><div class="inrow"><input id="f-share" value="${esc((sh.vals||{})["f-share"]||"")}" autocapitalize="off" autocomplete="off" required><button class="btn primary"${sh.busy?' disabled':''}>Share</button></div>${err}</form>${names.length?`<ul class="shared-list">${names.map(u=>`<li><span>${esc((s.sharedNames||{})[u]||'someone')}</span><button class="link danger" data-act="unshare" data-uid="${esc(u)}">Stop sharing</button></li>`).join('')}</ul>`:''}<div class="actions"><button class="btn ghost" data-act="cancel">Done</button></div></div>`;
  }
  if(sh.kind==='backup'){ const n=S.sessions.filter(hasData).length;
    return `<div class="scrim" data-act="cancel"></div><div class="sheet" role="dialog" aria-modal="true" aria-label="Backup"><h3>Backup and restore</h3><p>Your scores are stored on this phone. Save a backup file now and then (to Files, iCloud Drive or mail it to yourself), and restore it here on a new phone.</p><p class="fine">${n} test${n===1?'':'s'} on this phone. Last backup: ${S.prefs.lastBackup?fmtDate(S.prefs.lastBackup):'never'}.</p><div class="actions"><button class="btn primary" data-act="bk-save"${n?'':' disabled'}>Save backup file</button><label class="btn file-btn" for="bk-file">Restore from a backup file</label><input type="file" id="bk-file" accept=".json,application/json" hidden><button class="btn ghost" data-act="cancel">Close</button></div></div>`; }
  return `<div class="scrim" data-act="cancel"></div><div class="sheet" role="dialog" aria-modal="true" aria-label="${esc(sh.title)}"><h3>${esc(sh.title)}</h3><p>${esc(sh.text)}</p><div class="actions"><button class="btn danger-solid" data-act="${sh.act}">${esc(sh.ok)}</button><button class="btn" data-act="cancel">Keep it</button></div></div>`; }

function summaryText(s){ const t=testById(s.test), c=calcOf(s);
  if(isB(t)){ const tt=tTotal(s,t); return [`${t.name}, ${fmtDate(s.date)}`, `Errors ${c.errors}, ghost ${c.total} of 150${tt?`, time ${fmtT(tt)}`:''}`, ...c.cats.map((x,i)=>`${i+1}. ${x.cat.name}: ${x.entered?x.pts:'not scored'}${x.cat.timed&&tOf(s,x.cat.id)?` (${fmtT(tOf(s,x.cat.id))})`:''}`)].join('\n'); }
  return [`${t.name}, ${fmtDate(s.date)}`, t.mode==='sum'?`Total ${c.total} (target ${t.targetTotal}, ceiling ${c.maxTotal})`:`Average ${c.total} percent`, ...c.cats.map((x,i)=>`${i+1}. ${x.cat.name}: ${x.entered?x.pts:'not scored'}`)].join('\n'); }

/* ---------- Events ---------- */
document.addEventListener('click',e=>{
  const b=e.target.closest('[data-act]'); if(!b||b.disabled) return;
  const a=b.dataset.act, v=S.view, s=v.id?sess(v.id):null;
  if(a==='tab') go({ name:b.dataset.v });
  else if(a==='start'){ const n=newSession(b.dataset.test); go({ name:'session', id:n.id }); }
  else if(a==='open') go({ name:'session', id:b.dataset.id });
  else if(a==='result') go({ name:'result', id:b.dataset.id });
  else if(a==='drill') go({ name:'drill', id:v.id, ci:+b.dataset.ci, pi:0, from:v.name });
  else if(a==='part'){ v.pi=+b.dataset.pi; render(true); }
  else if(a==='set'){ const k=b.dataset.key, val=+b.dataset.val; if(s.scores[k]===val) delete s.scores[k]; else s.scores[k]=val; if(s.finished&&!hasData(s)) s.finished=false; touch(s); render(true); }
  else if(a==='step'){ const k=b.dataset.key, cur=typeof s.scores[k]==='number'?s.scores[k]:0; s.scores[k]=Math.max(0,cur+(+b.dataset.d)); touch(s); render(true); }
  else if(a==='clr'){ delete s.scores[b.dataset.key]; touch(s); render(true); }
  else if(a==='t-start'){ const cid=testById(s.test).cats[v.ci].id; stopTimer(s); s.timer={ cat:cid, start:Date.now() }; touch(s); render(true); }
  else if(a==='t-stop'){ stopTimer(s); touch(s); render(true); }
  else if(a==='t-reset'){ const cid=testById(s.test).cats[v.ci].id; if(s.times) delete s.times[cid]; touch(s); render(true); }
  else if(a==='mirror'){ S.prefs.mirror=!S.prefs.mirror; persist(); render(true); }
  else if(a==='list') go({ name:'session', id:v.id });
  else if(a==='prev'||a==='next'){ const t=testById(s.test), d=a==='next'?1:-1; let ci=v.ci, pi=(v.pi||0)+d;
    if(pi<0){ ci--; if(ci<0) return; pi=t.cats[ci].parts.length-1; } else if(pi>=t.cats[ci].parts.length){ ci++; pi=0; }
    if(ci>=t.cats.length){ s.finished=true; touch(s); go({ name:'result', id:s.id }); } else go({ name:'drill', id:v.id, ci, pi, from:v.from }); }
  else if(a==='finish'){ s.finished=true; touch(s); go({ name:'result', id:s.id }); }
  else if(a==='edit') go({ name:'session', id:v.id });
  else if(a==='back'&&v.name==='shared') go({ name:'history', tab:'shared' });
  else if(a==='back'){ if(v.name==='drill') go(v.from==='result'?{ name:'result', id:v.id }:{ name:'session', id:v.id }); else if(v.name==='result') go({ name:'history' }); else go({ name:'home' }); }
  else if(a==='instest'){ v.test=b.dataset.test; render(true); }
  else if(a==='askdel'){ S.sheet={ title:'Delete this test?', text:'Its scores and notes are removed from your history. This cannot be undone.', ok:'Delete', act:'del' }; render(true); }
  else if(a==='cancel'){ S.sheet=null; render(true); }
  else if(a==='backup'){ S.sheet={ kind:'backup' }; render(true); }
  else if(a==='account'){ S.sheet={ kind:'account', mode:me()?'profile':'signin' }; render(true); }
  else if(a==='amode'){ S.sheet={ kind:'account', mode:b.dataset.mode }; render(true); }
  else if(a==='signout'){ S.sheet.busy=true; render(true); flush().finally(()=>C().signOut().then(()=>{ S.sessions=[]; S.tomb=[]; S.prefs.dirty=[]; S.prefs.owner=null; S.shared=null; persist(); S.sheet=null; go({ name:'home' }); toast('Signed out'); })); }
  else if(a==='share'){ if(!me()){ S.sheet={ kind:'account', mode:'signin' }; } else S.sheet={ kind:'share' }; render(true); }
  else if(a==='unshare'){ const u=b.dataset.uid; s.sharedWith=(s.sharedWith||[]).filter(x=>x!==u); if(s.sharedNames) delete s.sharedNames[u]; touch(s); flush(); render(true); }
  else if(a==='htab'){ v.tab=b.dataset.tab; if(v.tab==='shared') S.shared=null; render(true); }
  else if(a==='reshared'){ S.shared=null; S.sharedState=null; render(true); }
  else if(a==='openshared') go({ name:'shared', key:b.dataset.key });
  else if(a==='bk-save') saveBackup();
  else if(a==='del'){ removeSession(v.id); go({ name:'history' }); toast('Test deleted'); }
  else if(a==='pic') openPicture(s);
  else if(a==='sharepic'){ const f=S.sheet&&S.sheet.file; if(f){ navigator.share({ files:[f] }).catch(err=>{ if(!err||err.name!=='AbortError') toast('Sharing did not work. Press and hold the picture instead.'); }); } }
  else if(a==='closepic'){ S.sheet=null; render(true); }
  else if(a==='copy'){ const txt=summaryText(s); try{ navigator.clipboard.writeText(txt).then(()=>toast('Summary copied'),()=>toast('Copy was blocked by the browser')); }catch(err){ toast('Copy was blocked by the browser'); } }
});
document.addEventListener('change',e=>{ if(e.target.dataset.chg==='picname'){ S.prefs.picName=e.target.value; persist(); const s=sess(S.view.id); if(s) openPicture(s); return; }
  if(e.target.id==='bk-file'&&e.target.files&&e.target.files[0]){ const f=e.target.files[0]; f.text().then(t=>{ const r=mergeBackup(t); S.sheet=null; if(r.error) toast(r.error); else { toast(r.added||r.updated?`Restored ${r.added} new, ${r.updated} updated`:'Nothing new in that backup'); } render(true); }); return; }
  if(e.target.dataset.chg==='date'&&e.target.value){ const s=sess(S.view.id); s.date=e.target.value; touch(s); }
  if(e.target.dataset.chg==='tmm'){ const s=sess(S.view.id), cid=testById(s.test).cats[S.view.ci].id, m=document.getElementById('tmin').value.trim(), sc=document.getElementById('tsec').value.trim(); s.times=s.times||{};
    if(!m&&!sc) delete s.times[cid]; else { const mi=parseInt(m||'0',10), se=parseInt(sc||'0',10); if(isNaN(mi)||isNaN(se)||se>59){ toast('Seconds go from 0 to 59'); return; } s.times[cid]=mi*60+se; } touch(s); const tv=document.getElementById('tval'); if(tv) tv.textContent=fmtT(tOf(s,cid)); return; }
  if(e.target.dataset.chg==='time'){ const s=sess(S.view.id), cid=testById(s.test).cats[S.view.ci].id, v=e.target.value.trim(); s.times=s.times||{}; if(!v) delete s.times[cid]; else { const sec=parseT(v); if(sec==null){ toast('Type the time as minutes:seconds, like 8:43'); return; } s.times[cid]=sec; } touch(s); render(true); } });

document.addEventListener('submit',async e=>{
  const f=e.target.closest('[data-form]'); if(!f) return; e.preventDefault();
  const kind=f.dataset.form, c=C(); if(!c) return;
  const sh=S.sheet, vals={}; f.querySelectorAll('input').forEach(i=>{ vals[i.id]=i.value; }); const val=id=>vals[id]||'';
  sh.vals=vals; sh.err=''; sh.ok=''; sh.busy=true; render(true);
  try{
    if(kind==='signin'){ await c.signIn(val('f-email'),val('f-pass')); S.sheet=null; toast('Signed in'); }
    else if(kind==='signup'){ await c.signUp(val('f-nick'),val('f-email'),val('f-pass')); S.sheet=null; toast('Account created'); }
    else if(kind==='reset'){ await c.reset(val('f-email')); sh.ok='If that email has an account, a reset link is on its way.'; }
    else if(kind==='share'){
      const q=val('f-share'), s=sess(S.view.id), who=await c.lookup(q);
      if(!who) sh.err='No account with that email or nickname.';
      else if(who.uid===me().uid) sh.err='That is you.';
      else if((s.sharedWith||[]).includes(who.uid)) sh.err=`Already shared with ${who.nick}.`;
      else { s.sharedWith=[...(s.sharedWith||[]),who.uid]; s.sharedNames=Object.assign({},s.sharedNames,{ [who.uid]:who.nick }); touch(s); await flush(); sh.vals={}; toast(`Shared with ${who.nick}`); }
    }
  }catch(err){ sh.err=kind==='share'?'Could not share. Check your connection and try again.':authMsg(err); }
  if(S.sheet===sh){ sh.busy=false; } render(true);
});
let noteT; document.addEventListener('input',e=>{ if(e.target.dataset.inp==='note'){ const s=sess(S.view.id), t=testById(s.test), cat=t.cats[S.view.ci], val=e.target.value; clearTimeout(noteT); noteT=setTimeout(()=>{ if(val.trim()) s.notes[cat.id]=val; else delete s.notes[cat.id]; touch(s); },500); } });
window.addEventListener('hashchange',()=>{ const n=location.hash.slice(1); if(['home','history','insights'].includes(n)&&S.view.name!==n&&['home','history','insights'].includes(S.view.name)) go({ name:n }); });

load();
if(!S.prefs.migWarmup){ S.sessions.forEach(s=>{ if(s.test==='basis'&&typeof s.scores['b1.a.0']==='number'&&typeof s.scores['b1.a.1']!=='number'){ s.scores['b1.a.1']=0; s.updatedAt=Date.now(); } }); S.prefs.migWarmup=true; persist(); }
{ const n=location.hash.slice(1); S.view={ name:['history','insights'].includes(n)?n:'home' }; }
render();
if(navigator.storage&&navigator.storage.persist) navigator.storage.persist().catch(()=>{});
if('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(()=>{});
