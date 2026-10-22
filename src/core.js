// ===================== Kāshi core (language independent) =====================
const INTERVALS=[0,1,3,7,14,30,60,120,240],MAXL=8,MASTER=6;
const ZW="‌";
// ---------- icons ----------
const IC={
 bolt:'<path d="M13 3L5 13.5h6L10 21l8-10.5h-6z"/>',
 cards:'<rect x="4" y="6" width="13" height="14" rx="2.5"/><path d="M8 3.5h9.5A2.5 2.5 0 0 1 20 6v10.5"/>',
 grid:'<rect x="4" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5"/>',
 list:'<path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r="1"/><circle cx="4.5" cy="12" r="1"/><circle cx="4.5" cy="18" r="1"/>',
 book:'<path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H11v16H5.5A1.5 1.5 0 0 1 4 18.5z"/><path d="M20 5.5A1.5 1.5 0 0 0 18.5 4H13v16h5.5a1.5 1.5 0 0 0 1.5-1.5z"/>',
 sliders:'<path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2.2"/><circle cx="8" cy="17" r="2.2"/>',
 check:'<path d="M5 12.5l4.5 4.5L19 7.5"/>',x:'<path d="M6 6l12 12M18 6L6 18"/>',approx:'<path d="M5 10c2-2 4-2 7 0s5 2 7 0M5 15c2-2 4-2 7 0s5 2 7 0"/>',
 arrow:'<path d="M5 12h14M13 6l6 6-6 6"/>',bulb:'<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V16h5v-.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z"/>',
 eye:'<path d="M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7z"/><circle cx="12" cy="12" r="3"/>',
 thumb:'<path d="M7 11v9H4v-9zM7 11l4-7c1.5 0 2.5 1 2.2 2.6L12.6 10H19a2 2 0 0 1 2 2.3l-1.2 6A2 2 0 0 1 17.8 20H7"/>',
 play:'<path d="M7 4.5v15l12-7.5z"/>',stop:'<rect x="6" y="6" width="12" height="12" rx="2"/>',
 timer:'<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2.5M9.5 2.5h5"/>',flame:'<path d="M12 21c-4 0-7-2.7-7-6.5 0-3 2-5 3.5-6.5.3 2 1.5 3 2.5 3 0-3 1-6 4-8 0 3 1.5 4.5 3 6.5 1.2 1.6 1 3.2 1 5 0 3.8-3 6.5-7 6.5z"/>',
 cap:'<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c2 2 10 2 12 0v-5M22 9v6"/>',stack:'<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>',
 spark:'<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M6 18l2.5-2.5M15.5 8.5L18 6"/>',
 key:'<circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M16 7l3 3"/>',pencil:'<path d="M4 20h4L19 9l-4-4L4 16z"/>',
 search:'<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',plus:'<path d="M12 5v14M5 12h14"/>',minus:'<path d="M5 12h14"/>',
 sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5"/>',
 moon:'<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',auto:'<circle cx="12" cy="12" r="8"/><path d="M12 4v16" /><path d="M12 4a8 8 0 0 1 0 16z" fill="currentColor"/>',
 trash:'<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18"/>',
 hour:'<path d="M6 3h12M6 21h12M7 3c0 5 10 5 10 9s-10 4-10 9M17 3c0 5-10 5-10 9"/>',repeat:'<path d="M17 2l3 3-3 3M4 11V9a4 4 0 0 1 4-4h12M7 22l-3-3 3-3M20 13v2a4 4 0 0 1-4 4H4"/>',
 question:'<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6V14M12 17.5v.01"/>',
 calendar:'<rect x="3.5" y="5" width="17" height="15" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',close:'<path d="M6 6l12 12M18 6L6 18"/>'};
const ic=(n,c="")=>`<svg class="i ${c}" viewBox="0 0 24 24" aria-hidden="true">${IC[n]}</svg>`;
// ---------- languages ----------
const LANGS=[["fa","🇮🇷","فارسی","Persian"],["fr","🇫🇷","Français","French"],["es","🇪🇸","Español","Spanish"],["de","🇩🇪","Deutsch","German"],
 ["it","🇮🇹","Italiano","Italian"],["nl","🇳🇱","Nederlands","Dutch"],["pt","🇵🇹","Português","Portuguese"],["ar","🇸🇦","العربية","Arabic"],
 ["tr","🇹🇷","Türkçe","Turkish"],["ru","🇷🇺","Русский","Russian"],["zh","🇨🇳","中文","Mandarin"],["ja","🇯🇵","日本語","Japanese"]];
const PACKS={};
// ---------- state ----------
const today=()=>Math.floor((Date.now()-new Date().getTimezoneOffset()*60000)/864e5);
const LDEF=()=>({p:{},g:{},sp:{streak:0,last:0,best:0,hist:{}},d:{day:0,newDone:0,reviewed:0},decks:["A1"],npd:10,gmax:"auto"});
let S={v:2,s:{theme:"auto",lang:null,zoom:1,sprintMin:5},L:{},t:0};
const LSK="kashi-v2";
function mergeL(x){const d=LDEF();return Object.assign(d,x||{},{sp:Object.assign(d.sp,(x||{}).sp||{}),d:Object.assign(d.d,(x||{}).d||{})});}
function fromV1(x){ // the original Persian-only save
  return{v:2,s:{theme:(x.s||{}).theme||"auto",lang:"fa",zoom:(x.s||{}).zoom??1,sprintMin:(x.s||{}).sprintMin||5},
    L:{fa:mergeL({p:x.p||{},g:x.g||{},sp:x.sp,d:x.d,decks:((x.s||{}).decks||["A1"]).filter(d=>/^[ABC][12]$/.test(d)),npd:(x.s||{}).newPerDay||10,gmax:(x.s||{}).gmax||"auto"})},t:x.t||0};}
function mergeS(x){if(!x)return null;if(!x.v)return fromV1(x);const L={};for(const k in x.L||{})L[k]=mergeL(x.L[k]);return{v:2,s:Object.assign({theme:"auto",lang:null,zoom:1,sprintMin:5},x.s||{}),L,t:x.t||0};}
try{const x=JSON.parse(localStorage.getItem(LSK)||"null")||JSON.parse(localStorage.getItem("kashi-v1")||"null");const m=mergeS(x);if(m)S=m;}catch(e){}
let P=null; // progress of the active language
let dbRef=null,saveT=null;
function save(){S.t=Date.now();try{localStorage.setItem(LSK,JSON.stringify(S));}catch(e){}
  clearTimeout(saveT);saveT=setTimeout(()=>{if(dbRef)dbRef.set(S).catch(()=>{});},1200);}
(async()=>{try{
  if(!window.claude||!claude.use)return;
  const[db,user]=await Promise.all([claude.use("db"),claude.use("user")]);if(!db||!user)return;
  const uid=await user.id();if(!uid)return;
  dbRef=db.doc("data/users/"+uid+"/srs");const snap=await dbRef.get();
  if(snap.exists){const r=mergeS(snap.data());if(r&&r.t>S.t){S=r;try{localStorage.setItem(LSK,JSON.stringify(S));}catch(e){}applyTheme();if(S.s.lang)activate(S.s.lang,true);render();}}
  else if(S.t)dbRef.set(S).catch(()=>{});
}catch(e){dbRef=null;}})();
function applyTheme(){if(S.s.theme==="auto")document.documentElement.removeAttribute("data-theme");else document.documentElement.dataset.theme=S.s.theme;}
applyTheme();
// ---------- active language ----------
let PK=null,CARDS=[],BYID={},LEVELS=["A1"],SKILLS={};
function parseCards(pack){
  const out=[];let lvl="A1";
  pack.raw.trim().split("\n").forEach(l=>{if(!l.trim())return;if(l.startsWith("#")){lvl=l.slice(1).trim();return;}
    const[en,t,tr,tag]=l.split("|");out.push({id:lvl+":"+en,deck:lvl,en,fa:t.split("/"),tr:tr||"",tag:tag||""});});
  (pack.topics||[]).forEach(g=>g.d.forEach(([en,t])=>out.push({id:"G:"+en,deck:"Grammar",sub:g.lvl+" · "+g.t,en,fa:t.split("/"),tr:""})));
  return out;}
function activate(code,quiet){
  const pk=PACKS[code];if(!pk)return;
  if(!pk._cards)pk._cards=parseCards(pk);
  CARDS=pk._cards;BYID=Object.fromEntries(CARDS.map(c=>[c.id,c]));
  if(!S.L[code])S.L[code]=LDEF();
  P=S.L[code];S.s.lang=code;
  PK=pk;LEVELS=pk.levels;
  if(!pk._built)pk._built=pk.build();
  PK=Object.assign({},pk,pk._built);SKILLS=PK.skills;
  const R=document.documentElement.style;R.setProperty("--tf",PK.font||"var(--sans)");R.setProperty("--tdir",PK.dir||"ltr");
  P.decks=P.decks.filter(d=>LEVELS.includes(d));if(!P.decks.length)P.decks=[LEVELS[0]];
  if(!quiet)save();
}
const DECKS=()=>LEVELS;
// ---------- matching ----------
function lev(a,b){const m=a.length,n=b.length;let p=Array.from({length:n+1},(_,i)=>i);
  for(let i=1;i<=m;i++){const c=[i];for(let j=1;j<=n;j++)c[j]=Math.min(p[j]+1,c[j-1]+1,p[j-1]+(a[i-1]===b[j-1]?0:1));p=c;}return p[n];}
const norm=s=>PK.norm(s);
const loose=s=>(PK.loose||PK.norm)(s);
function accepts(seqs){const out=new Set();
  for(const seq of seqs){let acc=[""];for(const slot of seq){const nx=[];for(const a of acc)for(const s of slot)nx.push(a+" "+s);acc=nx.length>6000?nx.slice(0,6000):nx;}
    acc.forEach(x=>out.add(norm(x)));}
  return out;}
function canon(seqs){return seqs[0].map(s=>s[0]).filter(Boolean).join(" ").replace(/\s+/g," ").replace(/' /g,"'").replace(/ ([?!])/g,"$1").trim();}
function gradeSet(acc,input){
  const x=norm(input);if(!x)return"empty";
  if(acc.has(x))return"ok";
  const lx=loose(input);
  for(const a of acc){if(loose(a)===lx)return"near";}
  if(x.length>=5){for(const a of acc){if(Math.abs(a.length-x.length)<=1&&lev(a,x)<=1)return"near";}}
  return"bad";}
const gradeSent=(it,input)=>gradeSet(it.acc,input);
const grade=(card,input)=>gradeSet(new Set(card.fa.map(f=>norm(f))),input);
// ---------- english helpers (shared by every pack) ----------
const cap=s=>s?s[0].toUpperCase()+s.slice(1):s;
const rnd=a=>a[Math.floor(Math.random()*a.length)];
const EN_SUBJ=()=>["I","you",Math.random()<.5?"he":"she","we","you (pl.)","they"];
const enOf=c=>c.en.split(";")[0].replace(/^a /,"").trim();
const enBase=c=>enOf(c).replace(/^to /,"");
function compEn(E,LA){const IR={far:"farther",little:"less",much:"more",good:"better",bad:"worse"};if(IR[E])return IR[E];
  const L=(LA||[]).find(a=>a[1]===E);if(L)return L[2];
  if(/\s/.test(E)||E.length>6||/ed$|ing$|ful$|ous$|ive$|al$|ic$/.test(E))return"more "+E;
  if(/^(big|hot|thin|fat|wet|sad|red)$/.test(E))return E+E.slice(-1)+"er";if(/y$/.test(E))return E.slice(0,-1)+"ier";if(/e$/.test(E))return E+"r";return E+"er";}
function enV(v,p,tense,neg){const e=v.en,s3=p===2,be=["am","are","is","are","are","are"][p],was=(p===0||p===2)?"was":"were";
  switch(tense){
  case"pres":return neg?(s3?"doesn't ":"don't ")+e[0]:(s3?e[1]:e[0]);
  case"past":return neg?"didn't "+e[0]:e[2];
  case"prog":return be+" "+e[4];
  case"fut":return"will "+e[0];
  case"pastprog":return v.noProg?"used to "+e[0]:was+" "+e[4];
  case"perf":return(s3?"has ":"have ")+e[3];
  case"pluperf":return"had "+e[3];
  case"pastsubj":return"may have "+e[3];
  case"cond":return"would "+e[0];
  case"condperf":return"would have "+e[3];
  case"want":return(s3?"wants":"want")+" to "+e[0];
  case"can":return"can "+e[0];
  case"must":return"must "+e[0];}}
// ---------- scheduling ----------
function st(id){return P.p[id];}
function due(id){const p=st(id);return !!p&&p.due<=today();}
function inDecks(c){return P.decks.includes(c.deck)&&LEVELS.includes(c.deck);}
let Q=[],cur=null,phase="ask",hinted=false,lapsed=new Set();
function rollDay(){if(P.d.day!==today())P.d={day:today(),newDone:0,reviewed:0};}
function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function buildQueue(){
  rollDay();
  const rev=shuffle(CARDS.filter(c=>inDecks(c)&&due(c.id)));
  const room=Math.max(0,P.npd-P.d.newDone);
  const rank=PK.sentRank||(()=>0);
  const fresh=CARDS.filter(c=>inDecks(c)&&!st(c.id)).map((c,i)=>[c,i])
    .sort((x,y)=>LEVELS.indexOf(x[0].deck)-LEVELS.indexOf(y[0].deck)||rank(x[0])-rank(y[0])||x[1]-y[1]).map(x=>x[0]).slice(0,room);
  Q=rev.slice(0,300);
  fresh.forEach((c,i)=>Q.splice(Math.min(Q.length,Math.floor((i+1)*Q.length/(fresh.length+1))+i),0,c));
  lapsed=new Set();}
function schedule(card,result){
  const isNew=!st(card.id);let p=st(card.id)||{l:0,due:today(),n:0,w:0};p.n++;
  if(isNew)P.d.newDone++;else if(!lapsed.has(card.id)&&p.l>0)P.d.reviewed++;
  if(result==="bad"){p.w++;p.l=0;p.due=today();lapsed.add(card.id);Q.splice(Math.min(3,Q.length),0,card);}
  else if(lapsed.has(card.id)||hinted){p.l=Math.max(p.l,1);p.due=today()+1;lapsed.delete(card.id);}
  else{p.l=Math.min(MAXL,p.l+1);p.due=today()+INTERVALS[p.l];}
  P.p[card.id]=p;save();}
function counts(deck){
  const cs=CARDS.filter(c=>deck?c.deck===deck:inDecks(c));let n=0,learn=0,mast=0,d=0;
  cs.forEach(c=>{const p=st(c.id);if(!p)n++;else if(p.l>=MASTER)mast++;else learn++;if(due(c.id))d++;});
  return{total:cs.length,n,learn,mast,due:d};}
// ---------- grammar skills ----------
const SK_LV=k=>SKILLS[k]?LEVELS.indexOf(SKILLS[k][0]):-1;
function gs(k){return P.g[k]||(P.g[k]={n:0,ok:0,r:[]});}
function sAcc(k){const r=gs(k).r;return r.length?r.reduce((a,b)=>a+b,0)/r.length:null;}
function unlockedLv(){
  if(P.gmax!=="auto"){const i=LEVELS.indexOf(P.gmax);return i<0?LEVELS.length-1:i;}
  let lv=0;
  for(let L=0;L<LEVELS.length-1;L++){
    const ks=Object.keys(SKILLS).filter(k=>SK_LV(k)===L);if(!ks.length){lv=L+1;continue;}
    const n=ks.reduce((a,k)=>a+gs(k).n,0),r=ks.flatMap(k=>gs(k).r);const acc=r.length?r.reduce((a,b)=>a+b,0)/r.length:0;
    if(n>=40&&acc>=.75)lv=L+1;else break;}
  return lv;}
function recordSkills(skills,good){skills.forEach(k=>{if(!SKILLS[k])return;const s=gs(k);s.n++;if(good)s.ok++;s.r.push(good?1:0);if(s.r.length>30)s.r.shift();});}
function reinforce(words,except){words.forEach(id=>{if(id===except)return;const p=P.p[id];if(p&&p.due<=today()&&p.l>0){p.l=Math.min(MAXL,p.l+1);p.due=today()+INTERVALS[p.l];}});}
// ---------- rendering ----------
const V=document.getElementById("view"),NAV=document.getElementById("nav"),SHEET=document.getElementById("sheet");
let view="sprint";
NAV.addEventListener("click",e=>{const b=e.target.closest("button");if(b)go(b.dataset.v);});
document.getElementById("langbtn").onclick=()=>go("langs");
function go(v){
  if(view==="sprint"&&v!=="sprint")stopSprint();
  if(phase==="shown"&&cur)next(true);
  cur=null;curQ=null;phase="ask";pending=null;view=v;
  NAV.querySelectorAll("button").forEach(x=>{if(x.dataset.v===v)x.setAttribute("aria-current","page");else x.removeAttribute("aria-current");});
  if(v==="study")buildQueue();
  closeSheet();render();window.scrollTo(0,0);}
const esc=s=>String(s).replace(/[&<>"]/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[m]));
const T=s=>`<span class="tg">${esc(s)}</span>`;
function meter(l){let h="";for(let i=1;i<=MAXL;i++)h+=`<i class="${i<=l?"on":""}"></i>`;return`<span class="dots" aria-label="Level ${l} of ${MAXL}">${h}</span>`;}
function render(){
  if(!PK||view==="langs"){rLangs();topline();return;}
  ({sprint:rSprint,study:rStudy,map:rMap,deck:rDeck,grammar:rGrammar,settings:rSettings})[view]();topline();}
function topline(){
  const lb=document.getElementById("langbtn");
  if(!PK){lb.innerHTML=ic("globe");document.getElementById("topline").innerHTML="";return;}
  lb.innerHTML=`<span class="flag">${PK.flag}</span>${T(PK.native)}`;
  rollDay();
  const c=counts(),newLeft=Math.min(c.n,Math.max(0,P.npd-P.d.newDone)),done=P.d.reviewed+P.d.newDone,left=c.due+newLeft;
  document.getElementById("topline").innerHTML=left?`${ic("stack","s")}${left}`:`${ic("check","s")}${done}`;
  NAV.querySelector('[data-v="sprint"]').classList.toggle("todo",P.sp.last!==today());
  document.getElementById("prog").style.width=(done+left?100*done/(done+left):0)+"%";}
// ---------- language picker ----------
function rLangs(){
  V.innerHTML=`<div class="pickhead">${ic("globe","l")}</div><div class="langs">${LANGS.map(([c,f,n])=>{
    const ok=!!PACKS[c],L=S.L[c];let pct="";
    if(ok&&L){const pk=PACKS[c];if(!pk._cards)pk._cards=parseCards(pk);const obj=pk._cards.filter(x=>/^[ABC][12]$/.test(x.deck)).length;const k=Object.keys(L.p).length;pct=`${Math.round(100*k/obj)}%`;}
    return`<button class="lt" data-c="${c}" ${ok?"":"disabled"} ${PK&&PK.code===c?'aria-current="true"':""} aria-label="${LANGS.find(x=>x[0]===c)[3]}">
      ${ok?"":`<span class="soon">${ic("hour","s")}</span>`}<span class="flag">${f}</span><span class="tg">${n}</span><span class="pct">${pct}</span></button>`;}).join("")}</div>`;
  V.querySelectorAll(".lt").forEach(b=>b.onclick=()=>{if(b.disabled)return;stopSprint();activate(b.dataset.c);SP=null;go("sprint");});}
// ---------- study: every word asked through a sentence ----------
let curQ=null,pending=null;
function introHTML(c){return`<div class="intro">${ic("spark","s")}<span>${esc(enOf(c))}</span>${T(c.fa[0])}${c.tr?`<span class="muted">${esc(c.tr.split(" / ")[0])}</span>`:""}</div>`;}
function rStudy(){
  if(phase!=="shown"||!cur){cur=Q.shift()||null;phase="ask";hinted=false;curQ=cur?PK.askFor(cur.id,unlockedLv()):null;}
  if(!cur){
    const c=counts();
    V.innerHTML=`<div class="done"><div class="ring">${ic("check")}</div>
      ${c.n?`<button class="btn" id="more">${ic("plus","s")} 10 ${ic("spark","s")}</button>`:""}</div>`;
    const m=document.getElementById("more");if(m)m.onclick=()=>{P.npd=P.d.newDone+10;save();buildQueue();render();};
    return;}
  const p=st(cur.id),l=p?p.l:0,q=curQ;
  V.innerHTML=`<section class="study">
    <div class="chiprow"><span class="badge">${esc(cur.deck)}</span>${p?meter(l):`<span class="badge new">${ic("spark","s")}</span>`}</div>
    ${!p?introHTML(cur):""}
    <h1 class="prompt">${esc(q?q.en:cur.en)}</h1>
    ${q?`<div class="target">${ic("key","s")}<b>${esc(enOf(cur))}</b></div>`:""}
    <input class="answer" id="ans" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" lang="${PK.code}" placeholder="${PK.flag} …" aria-label="Answer">
    <div class="hint" id="hint"></div>
    <div class="fb" id="fb" aria-live="polite"></div>
    <div class="acts" id="acts"><button class="btn primary" id="go" aria-label="Check">${ic("check")}</button>
      <div class="icons"><button class="ibtn" id="hintb" aria-label="Hint">${ic("bulb")}</button><button class="ibtn" id="skip" aria-label="Show answer">${ic("eye")}</button></div></div>
  </section>`;
  const ans=document.getElementById("ans");ans.focus({preventScroll:true});
  ans.addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();act();}});
  document.getElementById("go").onclick=act;
  document.getElementById("hintb").onclick=e=>{hinted=true;e.currentTarget.classList.add("on");
    const others=q?q.words.filter(x=>x!==cur.id&&BYID[x]).map(x=>T(BYID[x].fa[0])).join(" "):"";
    document.getElementById("hint").innerHTML=`${ic("key","s")}${cur.tr?`<i>${esc(cur.tr.split(" / ")[0])}</i>`:T(cur.fa[0].slice(0,2)+"…")}${others?` ${ic("plus","s")} ${others}`:""}`;ans.focus();};
  document.getElementById("skip").onclick=()=>{if(phase==="ask")check(true);};}
function act(){if(phase==="ask")check(false);else next();}
function fbHTML(r,canonTxt,typed,words,extra){
  const gl=words&&r==="bad"?words.map(id=>BYID[id]).filter(Boolean).map(c=>`<span class="gl">${T(c.fa[0])}${esc(enBase(c))}</span>`).join(""):"";
  return`<div class="verdict">${ic(r==="ok"?"check":r==="near"?"approx":"x")}</div>
    <div class="big">${esc(canonTxt)}</div>${extra||""}
    ${r!=="ok"&&typed.trim()?`<div class="yours">${ic("pencil","s")}${T(typed)}</div>`:""}
    ${gl?`<div class="gls">${gl}</div>`:""}`;}
function check(giveUp){
  const ans=document.getElementById("ans"),q=curQ;
  const r=giveUp?"bad":q?gradeSent(q,ans.value):grade(cur,ans.value);
  if(r==="empty"){ans.focus();return;}
  phase="shown";ans.readOnly=true;ans.classList.add(r==="bad"?"bad":"ok");
  const fb=document.getElementById("fb");fb.className="fb show "+r;
  fb.innerHTML=fbHTML(r,q?q.canon:cur.fa[0],ans.value,q?q.words:null,
    (cur.tr?`<div class="tr">${T(cur.fa[0])} · ${esc(cur.tr)}</div>`:(q?`<div class="tr">${T(cur.fa[0])}</div>`:""))+
    (!q&&cur.fa.length>1?`<div class="alt">${ic("plus","s")}${cur.fa.slice(1).map(T).join(" · ")}</div>`:""));
  pending=r==="near"?"ok":r;
  document.getElementById("acts").innerHTML=`<button class="btn primary" id="nx" aria-label="Next">${ic("arrow")}</button>${r==="bad"&&!giveUp?`<div class="icons"><button class="ibtn" id="ovr" aria-label="I was right">${ic("thumb")}</button></div>`:""}`;
  document.getElementById("nx").onclick=()=>next();
  const o=document.getElementById("ovr");if(o)o.onclick=()=>{pending="ok";next();};
  document.getElementById("nx").focus({preventScroll:true});}
function next(silent){
  if(curQ){recordSkills(curQ.skills,pending!=="bad");if(pending!=="bad")reinforce(curQ.words,cur.id);}
  schedule(cur,pending);cur=null;curQ=null;phase="ask";pending=null;if(!silent)render();}
document.addEventListener("keydown",e=>{if(view==="study"&&phase==="shown"&&e.key==="Enter"&&document.activeElement?.id!=="ans"&&document.activeElement?.id!=="nx"){e.preventDefault();next();}});
// ---------- sprint ----------
let SP=null;
const SPRINT_SEC=()=>(S.s.sprintMin||5)*60;
function chooseSkill(lv,lastK){
  const ks=Object.keys(SKILLS).filter(k=>SK_LV(k)<=lv&&!(lastK.length>=2&&lastK.slice(-2).every(x=>x===k)));
  const w=ks.map(k=>{const s=gs(k),a=sAcc(k);let x=s.n<8?3:.6+2.5*(1-a);if(SK_LV(k)===lv&&lv>0)x*=1.5;return x;});
  let t=w.reduce((a,b)=>a+b,0)*Math.random();for(let i=0;i<ks.length;i++){t-=w[i];if(t<=0)return ks[i];}return ks[0];}
function makeItem(){
  const lv=unlockedLv();
  if(Math.random()<.5){
    const pool=Object.keys(P.p).filter(id=>BYID[id]&&LEVELS.includes(BYID[id].deck)&&!SP.tw.has(id));
    pool.sort((a,b)=>(P.p[a].due-P.p[b].due)||(P.p[a].l-P.p[b].l));
    for(const id of shuffle(pool.slice(0,30)).slice(0,6)){
      const q=PK.askFor(id,lv);if(q&&!SP.seen.has(q.en)&&q.skills.length){SP.tw.add(id);SP.seen.add(q.en);return{...q,newId:null,retry:false};}}}
  for(let i=0;i<40;i++){
    const k=chooseSkill(lv,SP.lastK);
    const ctx={nw:null,newRate:SP.newIds.length<8?.2:0,lv,has:x=>SK_LV(x)<=lv};
    const r=PK.genFor(k,ctx);
    if(!r||SP.seen.has(r.en))continue;
    SP.lastK.push(k);SP.seen.add(r.en);
    return{...r,target:k,acc:accepts(r.seqs),canon:canon(r.seqs),newId:ctx.nw,retry:false};}
  return null;}
function skillRow(k,extra){const s=gs(k),a=sAcc(k);
  return`<div class="row skrow"><div><div>${esc(SKILLS[k][1])}</div><div class="s">${extra||""}${SKILLS[k][0]} · ${s.n}</div></div>
   <div class="skbar"><div class="bar"><i style="width:${a==null?0:a*100}%;background:${a==null?"var(--line)":a>=.8?"var(--ok)":a>=.55?"var(--mid)":"var(--bad)"}"></i></div><span class="num">${a==null?"–":Math.round(a*100)+"%"}</span></div></div>`;}
function rSprint(){
  if(SP&&SP.state!=="done")return;
  if(SP&&SP.state==="done")return drawSummary();
  rollDay();
  const lv=unlockedLv(),doneToday=P.sp.last===today();
  const ks=Object.keys(SKILLS).filter(k=>SK_LV(k)<=lv).sort((a,b)=>(sAcc(a)??-1)-(sAcc(b)??-1));
  V.innerHTML=`<div class="hero"><div class="clock">${ic(doneToday?"check":"timer")}</div><div class="min">${S.s.sprintMin||5}:00</div></div>
    <div class="kpis">
      <div class="kpi" style="--c:var(--mid)">${ic("flame")}<b>${P.sp.streak||0}</b></div>
      <div class="kpi" style="--c:var(--ink)">${ic("cap")}<b>${LEVELS[lv]}</b></div>
      <div class="kpi" style="--c:var(--ok)">${ic("stack")}<b>${Object.keys(P.p).length}</b></div></div>
    <button class="btn primary" id="spgo" aria-label="Start">${ic(doneToday?"repeat":"play")}</button>
    <div class="eyebrow">${ic("cap","s")}</div>
    <div class="group">${ks.map(k=>skillRow(k)).join("")}</div>`;
  document.getElementById("spgo").onclick=startSprint;}
function startSprint(){
  SP={state:"ask",left:SPRINT_SEC()*1000,t0:performance.now(),paused:false,seen:new Set(),lastK:[],newIds:[],boosted:new Set(),tw:new Set(),
      queue:[],n:0,ok:0,combo:0,best:0,skillRes:{},cur:null};
  V.innerHTML=`<div class="sptop"><div class="tbar"><i id="tbar"></i></div><div class="spmeta"><span>${ic("timer","s")}<b id="tclock"></b></span><span class="combo" id="tcombo"></span><span>${ic("check","s")}<b id="tscore"></b></span></div></div>
  <section class="study sprint">
    <div id="stip"></div>
    <div class="chiprow" id="schips"></div>
    <div id="snew"></div>
    <h1 class="prompt" id="sprompt"></h1>
    <input class="answer" id="sans" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" lang="${PK.code}" placeholder="${PK.flag} …" aria-label="Answer">
    <div class="fb" id="sfb" aria-live="polite"></div>
    <div class="acts" id="sacts"></div>
  </section>`;
  document.getElementById("sans").addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();spAct();}});
  SP.timer=setInterval(tick,200);nextItem();}
function tick(){
  if(!SP||SP.state==="done")return;
  const now=performance.now();if(!SP.paused&&!document.hidden)SP.left-=now-SP.t0;SP.t0=now;
  if(SP.left<=0){SP.left=0;SP.last=true;}
  const t=Math.ceil(SP.left/1000),el=document.getElementById("tclock");
  if(el)el.textContent=SP.last?"0:00":`${Math.floor(t/60)}:${String(t%60).padStart(2,"0")}`;
  const b=document.getElementById("tbar");if(b)b.style.width=(100*SP.left/(SPRINT_SEC()*1000))+"%";}
function nextItem(){
  if(SP.last)return finishSprint();
  let it=null;const qi=SP.queue.findIndex(q=>q.wait<=0);SP.queue.forEach(q=>q.wait--);
  it=qi>=0?SP.queue.splice(qi,1)[0].it:makeItem();
  if(!it)return finishSprint();
  SP.cur=it;SP.state="ask";SP.paused=false;
  const k=SKILLS[it.target]?it.target:it.skills[0],s=k?gs(k):{n:1};
  document.getElementById("stip").innerHTML=k&&s.n===0&&!it.retry?`<div class="tip">${ic("bulb","s")}<div><b>${esc(SKILLS[k][1])}</b>${esc(SKILLS[k][2])}</div></div>`:"";
  document.getElementById("schips").innerHTML=it.retry?`<span class="badge">${ic("repeat","s")}</span>`:it.skills.filter(x=>SKILLS[x]).map(x=>`<span class="badge">${esc(SKILLS[x][1].split(" (")[0])}</span>`).join("");
  const nw=it.newId&&BYID[it.newId];
  document.getElementById("snew").innerHTML=nw?introHTML(nw):"";
  document.getElementById("sprompt").textContent=it.en;
  const a=document.getElementById("sans");a.value="";a.readOnly=false;a.className="answer";a.focus({preventScroll:true});
  const fb=document.getElementById("sfb");fb.className="fb";fb.innerHTML="";
  document.getElementById("sacts").innerHTML=`<button class="btn primary" id="scheck" aria-label="Check">${ic("check")}</button><div class="icons"><button class="ibtn" id="sskip" aria-label="Show answer">${ic("eye")}</button><button class="ibtn" id="sstop" aria-label="End">${ic("stop")}</button></div>`;
  document.getElementById("scheck").onclick=spAct;
  document.getElementById("sskip").onclick=()=>spCheck(true);
  document.getElementById("sstop").onclick=()=>{SP.last=true;finishSprint();};
  drawScore();}
function drawScore(){document.getElementById("tscore").textContent=`${SP.ok}/${SP.n}`;
  document.getElementById("tcombo").innerHTML=SP.combo>=3?`${ic("flame","s")}${SP.combo}`:"";}
function spAct(){if(!SP)return;if(SP.state==="ask")spCheck(false);else if(SP.state==="shown")advance();}
function spCheck(giveUp){
  const it=SP.cur,a=document.getElementById("sans");
  const r=giveUp?"bad":gradeSent(it,a.value);if(r==="empty"){a.focus();return;}
  const good=r!=="bad";
  SP.n++;if(good){SP.ok++;SP.combo++;SP.best=Math.max(SP.best,SP.combo);}else SP.combo=0;
  recordSkills(it.skills,good);
  it.skills.forEach(k=>{if(!SKILLS[k])return;const sr=SP.skillRes[k]||(SP.skillRes[k]={n:0,ok:0});sr.n++;if(good)sr.ok++;});
  it.words.forEach(id=>{
    if(id===it.newId&&!P.p[id]){P.p[id]={l:good?1:0,due:today()+(good?1:0),n:1,w:good?0:1};SP.newIds.push(id);P.d.newDone++;return;}
    const p=P.p[id];if(!p)return;
    if(good&&!it.retry&&p.due<=today()&&!SP.boosted.has(id)){p.l=Math.min(MAXL,p.l+1);p.due=today()+INTERVALS[p.l];p.n++;SP.boosted.add(id);P.d.reviewed++;}});
  if(!good)SP.queue.push({it:{...it,retry:true,newId:null},wait:3});
  save();
  a.readOnly=true;a.classList.add(good?"ok":"bad");
  const fb=document.getElementById("sfb");fb.className="fb show "+r;fb.innerHTML=fbHTML(r,it.canon,a.value,it.words);
  drawScore();
  if(r==="ok"){SP.state="auto";document.getElementById("sacts").innerHTML="";SP.autoT=setTimeout(advance,900);}
  else{SP.state="shown";SP.paused=r==="bad";
    document.getElementById("sacts").innerHTML=`<button class="btn primary" id="snext" aria-label="Next">${ic("arrow")}</button>${r==="bad"&&!giveUp?`<div class="icons"><button class="ibtn" id="sovr" aria-label="I was right">${ic("thumb")}</button></div>`:""}`;
    document.getElementById("snext").onclick=advance;
    const o=document.getElementById("sovr");
    if(o)o.onclick=()=>{SP.ok++;SP.combo=1;it.skills.forEach(k=>{if(!SKILLS[k])return;const s=gs(k);s.ok++;s.r[s.r.length-1]=1;SP.skillRes[k].ok++;});SP.queue.pop();save();advance();};
    a.focus({preventScroll:true});}}
function advance(){if(!SP)return;clearTimeout(SP.autoT);nextItem();}
function finishSprint(){
  if(!SP||SP.state==="done")return;
  clearInterval(SP.timer);clearTimeout(SP.autoT);
  const full=SP.left<=0;SP.state="done";rollDay();const d=today();
  if(full&&SP.n>0){if(P.sp.last!==d){P.sp.streak=P.sp.last===d-1?(P.sp.streak||0)+1:1;P.sp.last=d;}P.sp.best=Math.max(P.sp.best||0,P.sp.streak);}
  const h=P.sp.hist[d]||(P.sp.hist[d]={n:0,ok:0});h.n+=SP.n;h.ok+=SP.ok;
  save();topline();if(view==="sprint")drawSummary();}
function drawSummary(){
  const pct=SP.n?Math.round(100*SP.ok/SP.n):0,ks=Object.keys(SP.skillRes).sort((a,b)=>(sAcc(a)??0)-(sAcc(b)??0));
  V.innerHTML=`<div class="hero"><div class="clock" style="color:var(--ok)">${ic("check")}</div><div class="min">${pct}%</div></div>
    <div class="kpis">
      <div class="kpi" style="--c:var(--ok)">${ic("check")}<b>${SP.ok}/${SP.n}</b></div>
      <div class="kpi" style="--c:var(--mid)">${ic("flame")}<b>${SP.best}</b></div>
      <div class="kpi" style="--c:var(--ink)">${ic("calendar")}<b>${P.sp.streak||0}</b></div></div>
    ${SP.newIds.length?`<div class="eyebrow">${ic("spark","s")}</div><div class="group">${SP.newIds.map(id=>{const c=BYID[id];return`<div class="row"><span>${esc(enOf(c))}</span><span class="tg" style="font-size:19px">${esc(c.fa[0])}</span></div>`;}).join("")}</div>`:""}
    <div class="eyebrow">${ic("cap","s")}</div>
    <div class="group">${ks.map(k=>{const r=SP.skillRes[k];return skillRow(k,`${r.ok}/${r.n} · `);}).join("")}</div>
    <div class="acts"><button class="btn primary" id="spagain" aria-label="Again">${ic("repeat")}</button><div class="icons"><button class="ibtn" id="spclose" aria-label="Close">${ic("close")}</button></div></div>`;
  document.getElementById("spagain").onclick=startSprint;
  document.getElementById("spclose").onclick=()=>{SP=null;render();};}
function stopSprint(){if(SP&&SP.state!=="done"){if(SP.n){SP.left=Math.max(SP.left,1);finishSprint();}else{clearInterval(SP.timer);clearTimeout(SP.autoT);}}SP=null;}
// ---------- map ----------
const PER=500,ZOOMS=[25,20,15,10,6,3];
let mapPage=0,mapSel=-1;
function band(c){const p=st(c.id);if(!p)return 0;if(p.l>=MASTER)return 3;if(p.l>=1)return 2;return 1;}
const MCARDS=()=>CARDS.filter(c=>LEVELS.includes(c.deck));
function zoomIdx(){return Math.min(ZOOMS.length-1,Math.max(0,S.s.zoom|0));}
function rMap(){
  const MC=MCARDS(),pages=Math.ceil(MC.length/PER);mapPage=Math.min(Math.max(0,mapPage),pages-1);
  const tot=[0,0,0,0];MC.forEach(c=>tot[band(c)]++);
  let tabs="";for(let i=0;i<pages;i++){const a=i*PER+1,b=Math.min(MC.length,(i+1)*PER);tabs+=`<button role="tab" aria-selected="${i===mapPage}" data-p="${i}">${a}–${b}</button>`;}
  V.innerHTML=`<div class="kpis">
    <div class="kpi"><span class="sq" style="--c:var(--ok)"></span><b>${tot[3]}</b></div>
    <div class="kpi"><span class="sq" style="--c:var(--mid)"></span><b>${tot[2]}</b></div>
    <div class="kpi"><span class="sq" style="--c:var(--bad)"></span><b>${tot[1]+tot[0]}</b></div></div>
    <div class="pages" role="tablist" id="pages">${tabs}</div>
    <div class="maphead"><div class="pinfo" id="pinfo"></div>
      <div class="zoom"><button id="zo" aria-label="Zoom out">${ic("minus","s")}</button><input type="range" id="zr" min="0" max="${ZOOMS.length-1}" step="1" aria-label="Zoom"><button id="zi" aria-label="Zoom in">${ic("plus","s")}</button></div></div>
    <div class="grid" id="grid"></div>`;
  document.getElementById("pages").onclick=e=>{const b=e.target.closest("button");if(!b)return;mapPage=+b.dataset.p;
    document.querySelectorAll("#pages button").forEach(x=>x.setAttribute("aria-selected",x===b));drawGrid();};
  document.getElementById("zo").onclick=()=>setZoom(zoomIdx()-1);
  document.getElementById("zi").onclick=()=>setZoom(zoomIdx()+1);
  document.getElementById("zr").oninput=e=>setZoom(+e.target.value);
  const g=document.getElementById("grid");
  g.onclick=e=>{const b=e.target.closest(".t");if(!b)return;g.querySelectorAll(".sel").forEach(x=>x.classList.remove("sel"));b.classList.add("sel");mapSel=+b.dataset.i;openSheet(CARDS[mapSel]);};
  let d0=0;const dist=t=>Math.hypot(t[0].clientX-t[1].clientX,t[0].clientY-t[1].clientY);
  g.addEventListener("touchstart",e=>{if(e.touches.length===2)d0=dist(e.touches);},{passive:true});
  g.addEventListener("touchmove",e=>{if(e.touches.length!==2||!d0)return;e.preventDefault();const d=dist(e.touches),r=d/d0;
    if(r>1.25){setZoom(zoomIdx()+1);d0=d;}else if(r<0.8){setZoom(zoomIdx()-1);d0=d;}},{passive:false});
  g.addEventListener("touchend",()=>{d0=0;});
  let acc=0;g.addEventListener("wheel",e=>{if(!e.ctrlKey)return;e.preventDefault();acc+=e.deltaY;if(acc<-40){setZoom(zoomIdx()+1);acc=0;}else if(acc>40){setZoom(zoomIdx()-1);acc=0;}},{passive:false});
  drawGrid();}
function setZoom(z){z=Math.min(ZOOMS.length-1,Math.max(0,z));S.s.zoom=z;save();drawGrid();
  if(mapSel>=0){const el=document.querySelector(`#grid [data-i="${mapSel}"]`);if(el)el.scrollIntoView({block:"center",behavior:"smooth"});}}
function drawGrid(){
  const g=document.getElementById("grid");if(!g)return;
  const z=zoomIdx(),cols=ZOOMS[z],lbl=cols<=6?2:cols<=10?1:0;
  const MC=MCARDS(),a=mapPage*PER,slice=MC.slice(a,a+PER),pg=[0,0,0,0];slice.forEach(c=>pg[band(c)]++);
  g.className="grid lbl"+lbl;g.style.setProperty("--cols",cols);g.style.setProperty("--gap",lbl?"6px":cols>20?"2px":"3px");
  g.innerHTML=slice.map(c=>{const i=CARDS.indexOf(c);return`<button class="t b${band(c)}${i===mapSel?" sel":""}" data-i="${i}" aria-label="${esc(c.en)}">${lbl?`<span class="te">${esc(enOf(c))}</span><span class="tf">${esc(c.fa[0])}</span>`:""}</button>`;}).join("");
  document.getElementById("zr").value=z;document.getElementById("zo").disabled=z===0;document.getElementById("zi").disabled=z===ZOOMS.length-1;
  document.getElementById("pinfo").innerHTML=`<span><span class="sq" style="--c:var(--ok)"></span>${pg[3]}</span><span><span class="sq" style="--c:var(--mid)"></span>${pg[2]}</span><span><span class="sq" style="--c:var(--bad)"></span>${pg[1]+pg[0]}</span>`;}
function openSheet(c){
  const p=st(c.id),b=band(c),col=["var(--muted)","var(--bad)","var(--mid)","var(--ok)"][b];
  SHEET.innerHTML=`<div class="sheet-in"><div class="sheet-top"><div class="en">${esc(c.en)}</div><button class="x" id="sx" aria-label="Close">${ic("close","s")}</button></div>
    <div class="fa1">${esc(c.fa[0])}</div>
    <div class="meta"><span class="sq" style="--c:${col}"></span>${p?meter(p.l):ic("spark","s")}${c.tr?`<span>${esc(c.tr)}</span>`:""}<span class="badge">${c.deck}</span>${p&&p.n?`<span>${ic("check","s")} ${p.n-p.w}/${p.n}</span>`:""}</div></div>`;
  SHEET.hidden=false;document.getElementById("sx").onclick=closeSheet;}
function closeSheet(){SHEET.hidden=true;SHEET.innerHTML="";}
// ---------- words ----------
function rDeck(){
  let h=`<div class="eyebrow">${ic("stack","s")}</div><div class="group">`;
  LEVELS.forEach(d=>{const c=counts(d);if(!c.total)return;const w=x=>(100*x/c.total).toFixed(1)+"%";
    h+=`<div class="row deckrow"><b>${d}</b><div class="bar"><i style="width:${w(c.mast)};background:var(--ok)"></i><i style="width:${w(c.learn)};background:var(--mid)"></i></div><span class="num">${c.mast+c.learn}/${c.total}</span></div>`;});
  h+=`</div><div class="eyebrow">${ic("list","s")}</div><label class="search">${ic("search","s")}<input id="q" placeholder="…" aria-label="Search"></label><div class="group wl" id="list" style="margin-top:10px"></div>`;
  V.innerHTML=h;
  const q=document.getElementById("q"),L=document.getElementById("list");
  const draw=()=>{const s=q.value.trim().toLowerCase(),sn=q.value.trim()?norm(q.value):"";
    const rows=MCARDS().filter(c=>!s||c.en.toLowerCase().includes(s)||(sn&&c.fa.some(f=>norm(f).includes(sn)))).slice(0,120);
    L.innerHTML=rows.map(c=>{const p=st(c.id);return`<div class="row"><div><div class="e">${esc(c.en)}</div><div class="s"><span class="badge">${c.deck}</span>${p?meter(p.l):ic("spark","s")}</div></div><span class="f">${esc(c.fa[0])}</span></div>`;}).join("")||`<div class="row muted">–</div>`;};
  q.oninput=draw;draw();}
// ---------- grammar ----------
function rGrammar(){
  const lv=unlockedLv();
  let h=`<div class="eyebrow">${ic("cap","s")} ${LEVELS[lv]}</div><div class="group">${Object.keys(SKILLS).filter(k=>SK_LV(k)<=lv).map(k=>skillRow(k)).join("")}</div>`;
  LEVELS.forEach(l=>{const ts=(PK.topics||[]).filter(g=>g.lvl===l);if(!ts.length)return;
    h+=`<div class="eyebrow">${l}</div>`;
    ts.forEach(g=>{h+=`<details><summary>${esc(g.t)}</summary><div class="gbody"><p>${esc(g.n)}</p>${g.d.map(([e,f])=>`<div class="ex"><span>${esc(e)}</span>${T(f.split("/")[0])}</div>`).join("")}</div></details>`;});});
  V.innerHTML=h;}
// ---------- settings: pictograms only ----------
function rSettings(){
  const lvChips=LEVELS.map(l=>`<button data-d="${l}" aria-pressed="${P.decks.includes(l)}">${l}</button>`).join("");
  const gChips=[["auto",ic("spark","s")]].concat(LEVELS.map(l=>[l,l])).map(([v,t])=>`<button data-g="${v}" aria-pressed="${P.gmax===v}" aria-label="${v}">${t}</button>`).join("");
  const th=[["auto","auto"],["light","sun"],["dark","moon"]].map(([v,i])=>`<button data-t="${v}" aria-pressed="${S.s.theme===v}" aria-label="${v}">${ic(i,"s")}</button>`).join("");
  V.innerHTML=`<div class="group" style="margin-top:12px">
    <div class="row"><span class="lab">${ic("stack")}</span><div class="chips" id="lvc">${lvChips}</div></div>
    <div class="row"><span class="lab">${ic("spark")}${ic("calendar","s")}</span><div class="stepper"><button id="n-" aria-label="Fewer">${ic("minus","s")}</button><b id="npd">${P.npd}</b><button id="n+" aria-label="More">${ic("plus","s")}</button></div></div>
    <div class="row"><span class="lab">${ic("timer")}</span><div class="stepper"><button id="m-" aria-label="Shorter">${ic("minus","s")}</button><b id="spm">${S.s.sprintMin}′</b><button id="m+" aria-label="Longer">${ic("plus","s")}</button></div></div>
    <div class="row"><span class="lab">${ic("cap")}</span><div class="chips" id="gc">${gChips}</div></div>
    <div class="row"><span class="lab">${ic("sun")}</span><div class="chips" id="thc">${th}</div></div>
  </div>
  <div class="group" style="margin-top:12px"><button class="danger" id="reset" aria-label="Erase progress">${ic("trash")}<span id="rst"></span></button></div>`;
  const set=()=>{save();topline();};
  document.getElementById("lvc").onclick=e=>{const b=e.target.closest("button");if(!b)return;const d=b.dataset.d;
    P.decks=P.decks.includes(d)?P.decks.filter(x=>x!==d):[...P.decks,d];if(!P.decks.length)P.decks=[d];set();rSettings();};
  const NP=[5,10,15,20,30,50];
  document.getElementById("n-").onclick=()=>{P.npd=NP[Math.max(0,NP.indexOf(P.npd)-1)]??5;set();rSettings();};
  document.getElementById("n+").onclick=()=>{P.npd=NP[Math.min(NP.length-1,NP.indexOf(P.npd)+1)]??10;set();rSettings();};
  const SM=[3,5,10,15];
  document.getElementById("m-").onclick=()=>{S.s.sprintMin=SM[Math.max(0,SM.indexOf(S.s.sprintMin)-1)]??5;set();rSettings();};
  document.getElementById("m+").onclick=()=>{S.s.sprintMin=SM[Math.min(SM.length-1,SM.indexOf(S.s.sprintMin)+1)]??5;set();rSettings();};
  document.getElementById("gc").onclick=e=>{const b=e.target.closest("button");if(!b)return;P.gmax=b.dataset.g;set();rSettings();};
  document.getElementById("thc").onclick=e=>{const b=e.target.closest("button");if(!b)return;S.s.theme=b.dataset.t;applyTheme();set();rSettings();};
  const r=document.getElementById("reset");
  r.onclick=()=>{if(!r.classList.contains("arm")){r.classList.add("arm");document.getElementById("rst").innerHTML=`${ic("question","s")}`;setTimeout(()=>{r.classList.remove("arm");const x=document.getElementById("rst");if(x)x.innerHTML="";},4000);return;}
    S.L[PK.code]=LDEF();activate(PK.code);set();rSettings();};}
// ---------- start ----------
function boot(){
  if(S.s.lang&&PACKS[S.s.lang]){activate(S.s.lang,true);buildQueue();}
  else view="langs";
  NAV.querySelectorAll("button").forEach(x=>{if(x.dataset.v===view)x.setAttribute("aria-current","page");else x.removeAttribute("aria-current");});
  render();}
// ---------- shared core lexicon (English semantics; packs map keys to their own cards) ----------
const CORE_N=[["house; home","house","houses","place thing",1,"home"],["book","book","books","text thing",1],["car","car","cars","thing wash",1],["door","door","doors","open thing",0],["window","window","windows","open thing",0],["bread","bread","bread","food",0],["water","water","water","drink",0],["tea","tea","tea","drink",0],["milk","milk","milk","drink",0],["apple","apple","apples","food",0],["rice","rice","rice","food",0],["meat","meat","meat","food",0],["cheese","cheese","cheese","food",0],["fish","fish","fish","food animal",0],["coffee","coffee","coffee","drink",0],["food","food","food","food",1],["pen","pen","pens","thing",1],["bag","bag","bags","thing open",1],["phone","phone","phones","thing",1],["key","key","keys","thing",1],["clothes","clothes","clothes","thing wash",1],["letter","letter","letters","text thing",1],["newspaper","newspaper","newspapers","text thing",0],["city","city","cities","place",1,"to the city"],["school","school","schools","place",1,"to school"],["shop","shop","shops","place",1,"to the shop"],["park","park","parks","place",0,"to the park"],["university","university","universities","place",1,"to university"],["room","room","rooms","place",1,"to the room"],["restaurant","restaurant","restaurants","place",0,"to the restaurant"],["hospital","hospital","hospitals","place",0,"to the hospital"],["garden","garden","gardens","place",1,"to the garden"],["friend","friend","friends","person",1],["teacher","teacher","teachers","person",1],["child","child","children","person",1],["doctor","doctor","doctors","person",1],["mother","mother","mothers","person",1],["father","father","fathers","person",1],["brother","brother","brothers","person",1],["sister","sister","sisters","person",1],["cat","cat","cats","animal",1],["dog","dog","dogs","animal",1],["table","table","tables","thing",1],["chair","chair","chairs","thing",0],["plate","plate","plates","thing wash",0],["glass (for drinking)","glass","glasses","thing wash",0],["shoe","shoe","shoes","thing",1],["fruit","fruit","fruits","food",0],["gift","gift","gifts","thing",1],["song","song","songs","media",0],["film","film","films","media",0],["word","word","words","word",0],["question","question","questions","word",0]];
const CORE_A=[["big","big","bigger","thing place animal"],["small","small","smaller","thing place animal"],["new","new","newer","thing text place"],["old (thing)","old","older","thing text place"],["beautiful","beautiful","more beautiful","thing place animal text"],["good","good","better","thing text place food drink person animal"],["bad","bad","worse","thing text place food drink"],["clean","clean","cleaner","thing place"],["dirty","dirty","dirtier","thing place"],["cheap","cheap","cheaper","thing food text"],["expensive","expensive","more expensive","thing food place"],["warm","warm","warmer","food drink place"],["cold","cold","colder","food drink place"],["delicious","delicious","more delicious","food drink"],["sweet","sweet","sweeter","food drink"],["tired","tired","more tired","person animal pp"],["happy","happy","happier","person pp"],["kind","kind","kinder","person animal pp"],["young","young","younger","person pp"],["old (person)","old","older","person animal pp"],["long; tall","tall","taller","person pp"],["interesting","interesting","more interesting","text place"],["fresh","fresh","fresher","food drink"],["hungry","hungry","hungrier","pp animal"],["thirsty","thirsty","thirstier","pp"],["sick","sick","sicker","pp animal"],["ready","ready","readier","pp food"],["sad","sad","sadder","pp person"]];
const CORE_V=[{"k":"to go","en":["go","goes","went","gone","going"],"intr":1,"place":1},{"k":"to come","en":["come","comes","came","come","coming"],"intr":1,"place":1},{"k":"to eat","en":["eat","eats","ate","eaten","eating"],"intr":1,"obj":"food","pass":1},{"k":"to drink","en":["drink","drinks","drank","drunk","drinking"],"intr":1,"obj":"drink","pass":1},{"k":"to see","en":["see","sees","saw","seen","seeing"],"obj":"thing person animal place media","noProg":1,"pass":1},{"k":"to read","en":["read","reads","read","read","reading"],"intr":1,"obj":"text word","pass":1},{"k":"to write","en":["write","writes","wrote","written","writing"],"intr":1,"obj":"text word","pass":1},{"k":"to buy","en":["buy","buys","bought","bought","buying"],"obj":"food drink text thing","pass":1},{"k":"to sleep","en":["sleep","sleeps","slept","slept","sleeping"],"intr":1},{"k":"to sit","en":["sit","sits","sat","sat","sitting"],"intr":1},{"k":"to bring","en":["bring","brings","brought","brought","bringing"],"obj":"food drink text thing","pass":1},{"k":"to wash","en":["wash","washes","washed","washed","washing"],"obj":"wash","pass":1},{"k":"to cook","en":["cook","cooks","cooked","cooked","cooking"],"obj":"food","pass":1},{"k":"to close","en":["close","closes","closed","closed","closing"],"obj":"open","pass":1},{"k":"to understand","en":["understand","understands","understood","understood","understanding"],"intr":1,"noProg":1},{"k":"to know (a fact)","en":["know","knows","knew","known","knowing"],"intr":1,"noProg":1,"noModal":1},{"k":"to work","en":["work","works","worked","worked","working"],"intr":1},{"k":"to speak","en":["speak","speaks","spoke","spoken","speaking"],"intr":1},{"k":"to play","en":["play","plays","played","played","playing"],"intr":1},{"k":"to learn","en":["learn","learns","learned","learned","learning"],"intr":1},{"k":"to open","en":["open","opens","opened","opened","opening"],"obj":"open","pass":1},{"k":"to find","en":["find","finds","found","found","finding"],"obj":"thing text","noProg":1,"pass":1},{"k":"to like; to love","en":["like","likes","liked","liked","liking"],"obj":"food drink text thing person animal place media","noProg":1,"stative":1},{"k":"to help","en":["help","helps","helped","helped","helping"],"intr":1}];
