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
 arrow:'<path d="M5 12h14M13 6l6 6-6 6"/>',phone:'<path d="M6.5 4h3l1.5 4-2 1.3a10 10 0 0 0 5.7 5.7L16 13l4 1.5v3A2 2 0 0 1 18 19.5 14 14 0 0 1 4.5 6 2 2 0 0 1 6.5 4z"/>',speaker:'<path d="M5 9.5h3l4-3.5v12l-4-3.5H5z"/><path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11"/>',chat:'<path d="M5 6.5A2.5 2.5 0 0 1 7.5 4h9A2.5 2.5 0 0 1 19 6.5v6a2.5 2.5 0 0 1-2.5 2.5H11l-4 3.5V15h-.5A2.5 2.5 0 0 1 5 12.5z"/>',bulb:'<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V16h5v-.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z"/>',
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
 trophy:'<path d="M8 4h8v5a4 4 0 0 1-8 0zM8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4M8.5 20h7M10 17h4"/>',
 skip:'<path d="M5 5l9 7-9 7zM17 5v14"/>',
 cloud:'<path d="M7 18h10a4 4 0 0 0 .6-7.96A6 6 0 0 0 6.2 9.6 4.2 4.2 0 0 0 7 18z"/>',
 download:'<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',upload:'<path d="M12 16V5M7 10l5-5 5 5M5 20h14"/>',
 mic:'<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M8.5 21h7"/>',
 ear:'<path d="M7 9a5 5 0 0 1 10 0c0 3-3 4-3 7a3 3 0 0 1-5.5 1.7"/><path d="M10 9.5a2 2 0 0 1 4 0c0 1.2-1 1.7-1.5 2.3"/>',
 calendar:'<rect x="3.5" y="5" width="17" height="15" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',close:'<path d="M6 6l12 12M18 6L6 18"/>'};
const ic=(n,c="")=>`<svg class="i ${c}" viewBox="0 0 24 24" aria-hidden="true">${IC[n]}</svg>`;
// ---------- languages ----------
const LANGS=[["fa","🇮🇷","فارسی","Persian"],["fr","🇫🇷","Français","French"],["es","🇪🇸","Español","Spanish"],["de","🇩🇪","Deutsch","German"],
 ["it","🇮🇹","Italiano","Italian"],["nl","🇳🇱","Nederlands","Dutch"],["pt","🇵🇹","Português","Portuguese"],["ar","🇸🇦","العربية","Arabic"],
 ["tr","🇹🇷","Türkçe","Turkish"],["ru","🇷🇺","Русский","Russian"],["zh","🇨🇳","中文","Mandarin"],["ja","🇯🇵","日本語","Japanese"]];
const PACKS={};
// ---------- state ----------
const today=()=>Math.floor((Date.now()-new Date().getTimezoneOffset()*60000)/864e5);
const LDEF=()=>({p:{},g:{},sp:{streak:0,last:0,best:0,hist:{}},d:{day:0,newDone:0,reviewed:0},decks:["A1"],npd:10,gmax:"auto",la:{}});
let S={v:2,s:{theme:"auto",lang:null,zoom:1,sprintMin:2,m2:1},L:{},t:0};
const LSK="kashi-v2";
function mergeL(x){const d=LDEF();return Object.assign(d,x||{},{sp:Object.assign(d.sp,(x||{}).sp||{}),d:Object.assign(d.d,(x||{}).d||{})});}
function fromV1(x){ // the original Persian-only save
  return{v:2,s:{theme:(x.s||{}).theme||"auto",lang:"fa",zoom:(x.s||{}).zoom??1,sprintMin:2,m2:1},
    L:{fa:mergeL({p:x.p||{},g:x.g||{},sp:x.sp,d:x.d,decks:((x.s||{}).decks||["A1"]).filter(d=>/^[ABC][12]$/.test(d)),npd:(x.s||{}).newPerDay||10,gmax:(x.s||{}).gmax||"auto"})},t:x.t||0};}
function mergeS(x){if(!x)return null;if(!x.v)return fromV1(x);const L={};for(const k in x.L||{})L[k]=mergeL(x.L[k]);const s=Object.assign({theme:"auto",lang:null,zoom:1,sprintMin:2},x.s||{});if(!s.m2){s.sprintMin=2;s.m2=1;} // challenges are 2 minutes
  for(const k in L){const sp=L[k].sp;if(!sp.recs){sp.recs={};if(sp.rec)sp.recs[5]=sp.rec;}}
  return{v:2,s,L,t:x.t||0};}
try{const x=JSON.parse(localStorage.getItem(LSK)||"null")||JSON.parse(localStorage.getItem("kashi-v1")||"null");const m=mergeS(x);if(m)S=m;}catch(e){}
let P=null; // progress of the active language
let dbRef=null,saveT=null;
function save(){S.t=Date.now();try{localStorage.setItem(LSK,JSON.stringify(S));}catch(e){}
  clearTimeout(saveT);saveT=setTimeout(()=>{if(dbRef)dbRef.set(S).catch(()=>{});},1200);if(typeof ghSchedule==="function")ghSchedule();}
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
// registry of answers the AI judge accepted (synced with the rest of the progress)
const GQ={hit:false};
function learned(key,input){const m=P.la&&P.la[key];return m?(m[norm(input)]||0):0;}
function learn(key,input,score){const la=P.la||(P.la={});const m=la[key]||(la[key]={}),k=norm(input);if(!k)return;
  m[k]=Math.max(m[k]||0,score);const ks=Object.keys(m);if(ks.length>8)delete m[ks[0]];
  const all=Object.keys(la);if(all.length>4000)delete la[all[0]];save();}
function gradeQ(key,acc,input){GQ.hit=false;const r=gradeSet(acc,input);if(r==="empty"||r==="ok")return r;
  const l=learned(key,input);if(l>=1){GQ.hit=true;return"ok";}if(l>0){GQ.hit=true;return"near";}return r;}
const gradeSent=(it,input)=>gradeQ("s:"+it.en,it.acc,input);
const tx=t=>`<small class="cp">${t}</small>`;
const grade=(card,input)=>gradeQ("c:"+card.id,new Set(card.fa.map(f=>norm(f))),input);
// ---------- optional AI grader (Claude Haiku, key kept only in this browser) ----------
const AI={key:null,model:"claude-haiku-5-5",fails:0};
try{AI.key=localStorage.getItem("kashi-ai");}catch(e){}
const LNAME=()=>((LANGS.find(l=>l[0]===PK.code)||[])[3])||PK.code;
// rough spend tracker (Haiku 5.5: $0.10 / $0.50 per million tokens), per calendar month, kept only in this browser
function aiUse(u){if(!u)return;try{const m=new Date().toISOString().slice(0,7);let x=JSON.parse(localStorage.getItem("kashi-aiuse")||"null");if(!x||x.m!==m)x={m,i:0,o:0,n:0};
  x.i+=u.input_tokens||0;x.o+=u.output_tokens||0;x.n++;localStorage.setItem("kashi-aiuse",JSON.stringify(x));}catch(e){}}
function aiSpend(){try{const x=JSON.parse(localStorage.getItem("kashi-aiuse")||"null");if(!x||x.m!==new Date().toISOString().slice(0,7))return{usd:0,n:0};return{usd:x.i*.1e-6+x.o*.5e-6,n:x.n};}catch(e){return{usd:0,n:0};}}
const usd=x=>"$"+(x<.01?x.toFixed(4):x.toFixed(3));
async function aiJudge(en,canonTxt,accSet,typed){
  if(!AI.key)return null;
  const ex=[...(accSet||[])].slice(0,8).join(" | ");
  const prompt=`You grade a ${LNAME()} translation exercise for an English speaker.
English prompt: ${en}
Reference answer: ${canonTxt}
Other accepted forms: ${ex}
Learner typed: ${typed}
Judge the learner's ${LNAME()} sentence against the English prompt. "right" = correct, natural ${LNAME()} that fully conveys the prompt (alternative valid wording, dropped pronouns or alternative spellings are fine). "partial" = meaning is conveyed but there is a small error (spelling, agreement, ending, article, word order). "wrong" = wrong meaning, wrong or missing word, or a real grammar error. Reply with ONLY compact JSON: {"v":"right"|"partial"|"wrong","tip":"<max 14 words in English: the key reason or fix>"}`;
  const ctl=new AbortController(),to=setTimeout(()=>ctl.abort(),7000);
  try{
    const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",signal:ctl.signal,
      headers:{"content-type":"application/json","x-api-key":AI.key,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},
      body:JSON.stringify({model:AI.model,max_tokens:120,messages:[{role:"user",content:prompt}]})});
    if(!r.ok){AI.fails++;return null;}
    const j=await r.json(),t=(j.content&&j.content[0]&&j.content[0].text)||"";aiUse(j.usage);
    const m=t.match(/\{[\s\S]*\}/);if(!m)return null;
    const o=JSON.parse(m[0]);AI.fails=0;let v=["right","partial","wrong"].includes(o.v)?o.v:(o.ok?"right":"wrong");return{v,ok:v==="right",tip:String(o.tip||"").slice(0,140)};
  }catch(e){AI.fails++;return null;}
  finally{clearTimeout(to);}}
const tipHTML=v=>v&&(v.tip||v.saved)?`<div class="aitip">${ic("spark","s")}<span>${esc(v.tip||"")}${v.saved?` <b class="svd">${ic("plus","s")}saved</b>`:""}</span></div>`:"";
// turn a Haiku verdict into a result, register accepted answers
function aiResult(r,v,key,typed){if(!v)return r;let out=v.v==="right"?"ok":v.v==="partial"?"near":(r==="near"?"near":"bad");
  if(v.v!=="wrong"){learn(key,typed,v.v==="right"?1:.5);v.saved=true;}return out;}
const aiWait=()=>`<div class="aitip wait">${ic("spark","s")}<i></i><i></i><i></i></div>`;
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
  if(result==="bad"){if(!isNew)miss(card.id,p);else{p.l=0;p.due=today();}lapsed.add(card.id);Q.splice(Math.min(3,Q.length),0,card);}
  else if(lapsed.has(card.id)||hinted){p.l=Math.max(p.l,1);p.due=today()+1;lapsed.delete(card.id);}
  else{p.l=Math.min(MAXL,p.l+1);p.due=today()+INTERVALS[p.l];}
  P.p[card.id]=p;save();}
// a miss drops 3 levels; the second miss resets the word to level 0
function miss(id,p){p=p||P.p[id];if(!p)return;p.w=(p.w||0)+1;p.st=(p.st||0)+1;if(p.st>=2){p.l=0;p.st=0;}else p.l=Math.max(0,p.l-3);p.due=today();}
function counts(deck){
  const cs=CARDS.filter(c=>deck?c.deck===deck:inDecks(c));let n=0,learn=0,mast=0,d=0;
  cs.forEach(c=>{const p=st(c.id);if(!p)n++;else if(p.l>=MASTER)mast++;else learn++;if(due(c.id))d++;});
  return{total:cs.length,n,learn,mast,due:d};}
// ---------- grammar skills ----------
const SK_LV=k=>SKILLS[k]?LEVELS.indexOf(SKILLS[k][0]):-1;
function gs(k){return P.g[k]||(P.g[k]={n:0,ok:0,r:[]});}
// recency-weighted accuracy over the last 40 sentences (half-credit answers count 0.5)
function sAcc(k){const r=gs(k).r;if(!r.length)return null;let n=0,d=0;for(let i=0;i<r.length;i++){const w=Math.pow(.96,r.length-1-i);n+=w*r[i];d+=w;}return n/d;}
// mastery rank 0-5: needs enough sentences, high recent accuracy AND practice spread over several days
const RANKS=[[15,.65,2,0],[40,.78,4,5],[80,.86,7,10],[150,.92,12,17],[300,.96,20,26]]; // [min sentences, min recent accuracy, min distinct days, min perfect (non-typo) answers among the last 40]
function skRank(k,raw){const s=gs(k),a=sAcc(k);if(a==null)return 0;let r=0;
  RANKS.forEach(([n,ac,d,ru],i)=>{if(s.n>=n&&a>=ac&&(s.dc||1)>=d&&s.r.filter(x=>x>=1).length>=ru)r=i+1;});
  if(raw)return r;
  const idle=s.ld?today()-s.ld:0,rust=Math.floor(Math.max(0,idle-7)/7); // -1 rank per 7 idle days after the first 7
  return Math.max(0,r-rust);}
// what it takes to pass level L and unlock L+1
function gate(L){
  const ks=Object.keys(SKILLS).filter(k=>SK_LV(k)===L);if(!ks.length)return{ok:true,ks};
  const rk=ks.map(k=>skRank(k)),acs=ks.map(sAcc).filter(x=>x!=null);
  const c2=rk.filter(x=>x>=3).length,c3=rk.filter(x=>x>=4).length,need3=Math.ceil(ks.length*.7);
  const acc=acs.length===ks.length?acs.reduce((a,b)=>a+b,0)/acs.length:0;
  const days=Math.min(...ks.map(k=>gs(k).dc||0));
  const ok=c2===ks.length&&c3>=need3&&acc>=.88&&days>=6;
  return{ok,ks,c2,c3,need3,acc,days,tot:ks.length};}
function unlockedLv(){
  if(P.gmax!=="auto"){const i=LEVELS.indexOf(P.gmax);return i<0?LEVELS.length-1:i;}
  let lv=0;
  for(let L=0;L<LEVELS.length-1;L++){if(gate(L).ok)lv=L+1;else break;}
  return lv;}
let SCORE=1; // 1 = exact, .5 = typo / loose match (counts half toward grammar mastery)
function recordSkills(skills,score){if(score===true)score=1;if(score===false||score==null)score=0;
  skills.forEach(k=>{if(!SKILLS[k])return;const s=gs(k);s.n++;s.ok=(s.ok||0)+score;s.r.push(score);if(s.r.length>40)s.r.shift();s.run=score>=1?(s.run||0)+1:0;
    const d=today();if(s.ld!==d){s.dc=(s.dc||0)+1;s.ld=d;}s.pk=Math.max(s.pk||0,skRank(k,true));});}
function reinforce(words,except){words.forEach(id=>{if(id===except)return;const p=P.p[id];if(p&&p.due<=today()&&p.l>0){p.l=Math.min(MAXL,p.l+1);p.due=today()+INTERVALS[p.l];}});}
// ---------- rendering ----------
const V=document.getElementById("view"),NAV=document.getElementById("nav"),SHEET=document.getElementById("sheet");
let view="sprint";
NAV.addEventListener("click",e=>{const b=e.target.closest("button");if(b)go(b.dataset.v);});
document.getElementById("langbtn").onclick=()=>go("langs");
function go(v){
  if(view==="tutor"&&v!=="tutor"&&typeof tvStop==="function")tvStop();
  if(view==="sprint"&&v!=="sprint"){stopSprint();stopVoice();}
  if(phase==="shown"&&cur)next(true);
  cur=null;curQ=null;phase="ask";pending=null;view=v;
  NAV.querySelectorAll("button").forEach(x=>{if(x.dataset.v===v)x.setAttribute("aria-current","page");else x.removeAttribute("aria-current");});
  if(v==="study")buildQueue();
  closeSheet();render();window.scrollTo(0,0);}
const esc=s=>String(s).replace(/[&<>"]/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[m]));
const T=s=>`<span class="tg">${esc(s)}</span>`;
function meter(l){let h="";for(let i=1;i<=MAXL;i++)h+=`<i class="${i<=l?"on":""}"></i>`;return`<span class="dots" aria-label="Level ${l} of ${MAXL}">${h}</span>`;}
// keep the answer screen pinned above the on-screen keyboard (no page scroll)
function lockState(){const on=view==="tutor"||(view==="study"&&!!cur)||(view==="sprint"&&!!SP&&SP.state!=="done");
  document.body.classList.toggle("lock",on);document.documentElement.classList.toggle("lock",on);if(on)window.scrollTo(0,0);}
function fitVV(){const vv=window.visualViewport,h=vv?vv.height:window.innerHeight;
  document.documentElement.style.setProperty("--vvh",h+"px");
  document.body.classList.toggle("kb",!!vv&&vv.height<window.innerHeight*0.78||!!vv&&screen.height&&vv.height<screen.height*0.62);
  if(document.body.classList.contains("lock"))window.scrollTo(0,0);}
if(window.visualViewport){visualViewport.addEventListener("resize",fitVV);visualViewport.addEventListener("scroll",fitVV);}
window.addEventListener("resize",fitVV);document.addEventListener("focusin",()=>setTimeout(fitVV,60));document.addEventListener("focusout",()=>setTimeout(fitVV,60));
function render(){
  if(!PK||view==="langs"){rLangs();topline();return;}
  ({sprint:rSprint,study:rStudy,tutor:rTutor,map:rMap,deck:rDeck,grammar:rGrammar,settings:rSettings})[view]();topline();lockState();fitVV();}
// overall mastery of everything in the app: 60% vocabulary (every word at its top interval = 100%), 40% grammar skills (5 dots = 100%)
function mastery(){
  const per={};LEVELS.forEach(l=>per[l]={n:0,v:0,g:0,gn:0});
  CARDS.forEach(c=>{const d=per[c.deck];if(!d)return;d.n++;const p=P.p[c.id];if(p)d.v+=Math.min(p.l,MASTER)/MASTER;});
  Object.keys(SKILLS).forEach(k=>{const d=per[SKILLS[k][0]];if(d){d.gn++;d.g+=skRank(k)/5;}});
  let vn=0,vs=0,gn=0,gs_=0;LEVELS.forEach(l=>{const d=per[l];vn+=d.n;vs+=d.v;gn+=d.gn;gs_+=d.g;});
  const V=vn?vs/vn:0,G=gn?gs_/gn:0;
  // estimated CEFR level: every level up to it needs 70% of its words mastered and skills averaging 3 dots
  let lvl=null;for(const l of LEVELS){const d=per[l];if(d.n&&d.v/d.n<.7)break;if(d.gn&&d.g/d.gn<.72)break;if(!d.n&&!d.gn)break;lvl=l;}
  return{all:.6*V+.4*G,V,G,lvl,per};}
function pct3(x){const v=x*100;return(v>=99.995?"100":v>=10?v.toFixed(1):v.toFixed(2))+"%";}
function topline(){
  const lb=document.getElementById("langbtn");
  if(!PK){lb.innerHTML=ic("globe");document.getElementById("topline").innerHTML="";return;}
  lb.innerHTML=`<span class="flag">${PK.flag}</span>${T(PK.native)}`;
  rollDay();
  const c=counts(),newLeft=Math.min(c.n,Math.max(0,P.npd-P.d.newDone)),done=P.d.reviewed+P.d.newDone,left=c.due+newLeft;
  const m=mastery();
  document.getElementById("topline").innerHTML=`<span class="mst" title="Overall mastery of all words and grammar: ${Math.round(m.V*1000)/10}% vocabulary, ${Math.round(m.G*1000)/10}% grammar"><b>${pct3(m.all)}</b><span class="lvb${m.lvl?"":" none"}" title="Estimated level">${m.lvl||"–"}</span></span><span class="tl2">`+(left?`${ic("stack","s")}${left} left`:`${ic("check","s")}${done} done`)+"</span>";
  NAV.querySelector('[data-v="sprint"]').classList.toggle("todo",P.sp.last!==today());
  document.getElementById("prog").style.width=(done+left?100*done/(done+left):0)+"%";}
// ---------- language picker ----------
function rLangs(){
  V.innerHTML=`<div class="pickhead">${ic("globe","l")}</div><div class="langs">${LANGS.map(([c,f,n])=>{
    const ok=!!PACKS[c],L=S.L[c];let pct="";
    if(ok&&L){const pk=PACKS[c];if(!pk._cards)pk._cards=parseCards(pk);const obj=pk._cards.filter(x=>/^[ABC][12]$/.test(x.deck)).length;const k=Object.keys(L.p).length;pct=`${Math.round(100*k/obj)}%`;}
    return`<button class="lt" data-c="${c}" ${ok?"":"disabled"} ${PK&&PK.code===c?'aria-current="true"':""} aria-label="${LANGS.find(x=>x[0]===c)[3]}">
      ${ok?"":`<span class="soon">${ic("hour","s")}</span>`}<span class="flag">${f}</span><span class="tg">${n}</span><span class="pct">${pct}</span></button>`;}).join("")}</div>`;
  V.querySelectorAll(".lt").forEach(b=>b.onclick=()=>{if(b.disabled)return;stopSprint();stopVoice();activate(b.dataset.c);SP=null;go("sprint");});}
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
    <h1 class="prompt">${esc(q?q.en:cur.en)}</h1>
    <input class="answer" id="ans" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" lang="${PK.code}" placeholder="${PK.flag} …" aria-label="Answer">
    <div class="hint" id="hint"></div>
    <div class="fb" id="fb" aria-live="polite"></div>
    <div class="actrow" id="acts"><button class="ibtn" id="skip" aria-label="Don't know">${ic("skip")}</button><button class="btn primary" id="go" aria-label="Check">${ic("check")}</button><button class="ibtn" id="hintb" aria-label="Hint">${ic("bulb")}</button></div>
  </section>`;
  const ans=document.getElementById("ans");ans.focus({preventScroll:true});
  ans.addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();act();}});
  document.getElementById("go").onclick=act;
  document.getElementById("hintb").onclick=e=>{hinted=true;e.currentTarget.classList.add("on");
    const others=q?q.words.filter(x=>x!==cur.id&&BYID[x]).map(x=>T(BYID[x].fa[0])).join(" "):"";
    document.getElementById("hint").innerHTML=`${ic("key","s")}${cur.tr?`<i>${esc(cur.tr.split(" / ")[0])}</i>`:T(cur.fa[0].slice(0,2)+"…")}${others?` ${ic("plus","s")} ${others}`:""}`;ans.focus({preventScroll:true});};
  document.getElementById("skip").onclick=()=>{if(phase==="ask")check(true);};}
function act(){if(phase==="ask")check(false);else if(phase==="shown")next();}
function fbHTML(r,canonTxt,typed,words,extra){
  const gl=words&&r==="bad"?words.map(id=>BYID[id]).filter(Boolean).map(c=>`<span class="gl">${T(c.fa[0])}${esc(enBase(c))}</span>`).join(""):"";
  return`<div class="verdict">${ic(r==="ok"?"check":r==="near"?"approx":"x")}</div>
    <div class="big">${esc(canonTxt)}</div>${extra||""}
    ${r!=="ok"&&typed.trim()?`<div class="yours">${ic("pencil","s")}${T(typed)}</div>`:""}
    ${gl?`<div class="gls">${gl}</div>`:""}`;}
function check(giveUp){
  const ans=document.getElementById("ans"),q=curQ;
  const r=giveUp?"bad":q?gradeSent(q,ans.value):grade(cur,ans.value);
  if(r==="empty"){ans.focus({preventScroll:true});return;}
  const hit=GQ.hit,key=q?"s:"+q.en:"c:"+(cur&&cur.id);
  if(r!=="ok"&&!hit&&!giveUp&&AI.key){
    phase="ai";ans.readOnly=true;const fb=document.getElementById("fb");fb.className="fb show";fb.innerHTML=aiWait();
    document.getElementById("acts").innerHTML=`<span class="ibtn ghost"></span><span class="btn primary dis">${ic("arrow")}</span><span class="ibtn ghost"></span>`;
    const acc=q?q.acc:new Set(cur.fa.map(f=>norm(f)));
    aiJudge(q?q.en:cur.en,q?q.canon:cur.fa[0],acc,ans.value).then(v=>{if(phase!=="ai")return;checkShow(aiResult(r,v,key,ans.value),false,v);});
    return;}
  checkShow(r,giveUp,null);}
function checkShow(r,giveUp,ai){
  const ans=document.getElementById("ans"),q=curQ;
  SCORE=(r==="near"&&!(ai&&ai.ok))?.5:1;phase="shown";ans.readOnly=true;ans.classList.add(r==="bad"?"bad":"ok");
  const fb=document.getElementById("fb");fb.className="fb show "+r;
  const tl=q?(q.tr||(PK.translit?PK.translit(q.canon):"")):cur.tr;
  fb.innerHTML=fbHTML(r,q?q.canon:cur.fa[0],ans.value,q?q.words:null,
    (tl?`<div class="tr ph">${esc(tl)}</div>`:"")+tipHTML(ai)+
    (!q&&cur.fa.length>1?`<div class="alt">${ic("plus","s")}${cur.fa.slice(1).map(T).join(" · ")}</div>`:""));
  pending=r==="near"?"ok":r;
  document.getElementById("acts").innerHTML=`<span class="ibtn ghost"></span><button class="btn primary" id="nx" aria-label="Next">${ic("arrow")}</button>${r==="bad"&&!giveUp?`<button class="ibtn" id="ovr" aria-label="I was right">${ic("thumb")}</button>`:`<span class="ibtn ghost"></span>`}`;
  document.getElementById("nx").onclick=()=>next();
  const o=document.getElementById("ovr");if(o)o.onclick=()=>{pending="ok";next();};
  document.getElementById("nx").focus({preventScroll:true});}
function next(silent){
  if(curQ){recordSkills(curQ.skills,pending!=="bad"?SCORE:0);if(pending!=="bad")reinforce(curQ.words,cur.id);}
  schedule(cur,pending);cur=null;curQ=null;phase="ask";pending=null;if(!silent)render();}
document.addEventListener("keydown",e=>{if(view==="study"&&phase==="shown"&&e.key==="Enter"&&document.activeElement?.id!=="ans"&&document.activeElement?.id!=="nx"){e.preventDefault();next();}});
// ---------- sprint ----------
let SP=null;
const SPRINT_SEC=()=>(S.s.sprintMin||2)*60;
// record per challenge length
const recOf=()=>((P.sp.recs||(P.sp.recs={}))[S.s.sprintMin||2])||0;
// weekly calendar of completed challenges
function calHTML(weeks){
  const td=today(),mon=td-((td+3)%7),H=P.sp.hist||{};let rows="";
  for(let w=weeks-1;w>=0;w--){const start=mon-7*w;let tot=0,cells="";
    for(let i=0;i<7;i++){const d=start+i,c=(H[d]&&H[d].c)||0;tot+=c;
      cells+=`<i class="cd${d>td?" fut":""}${d===td?" now":""}" style="--a:${c?Math.min(1,.25+.25*c):0}">${c||""}</i>`;}
    const dt=new Date((start)*864e5);const lab=dt.toLocaleDateString(undefined,{day:"numeric",month:"short",timeZone:"UTC"});
    rows+=`<div class="cw"><span class="cl">${lab}</span>${cells}<b class="ct${tot?"":" z"}">${tot}</b></div>`;}
  const dn=[...Array(7)].map((_,i)=>new Date((4+i)*864e5).toLocaleDateString(undefined,{weekday:"narrow",timeZone:"UTC"}));
  return`<div class="cal"><div class="cw ch"><span class="cl"></span>${dn.map(x=>`<i>${x}</i>`).join("")}<b class="ct">${ic("bolt","s")}</b></div>${rows}</div>`;}
function chooseSkill(lv,lastK){
  const ks=Object.keys(SKILLS).filter(k=>SK_LV(k)<=lv&&!(lastK.length>=2&&lastK.slice(-2).every(x=>x===k)));
  const w=ks.map(k=>{const s=gs(k),a=sAcc(k);let x=s.n<8?3:.6+2.5*(1-a);if(SK_LV(k)===lv&&lv>0)x*=1.5;const rk=skRank(k);x*=1+.6*(skRank(k,true)-rk);if(SK_LV(k)===lv&&rk<2)x*=1.4;if(rk>=4)x*=.6;return x;});
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
function pips(k){const r=skRank(k),raw=skRank(k,true);return`<span class="pips" title="${r}/5">${[1,2,3,4,5].map(i=>`<i class="${i<=r?"on":i<=raw?"rust":""}"></i>`).join("")}</span>`;}
function skillBody(k){const s=gs(k),r=skRank(k),a=sAcc(k),tp=(PK.skillTopic||{})[k],t=tp&&(PK.topics||[]).find(g=>g.t===tp);
  let h=`<p>${esc(SKILLS[k][2]||"")}</p>`;
  if(t)h+=`<p>${esc(t.n)}</p>`+t.d.map(([e,f])=>`<div class="ex"><span>${esc(e)}</span>${T(f.split("/")[0])}</div>`).join("");
  if(r<5){const [n,ac,d,ru]=RANKS[r];h+=`<div class="note nx">${ic("cap","s")}<span>Next dot: ${n} sentences (now ${s.n}) · ${Math.round(ac*100)}% recent accuracy (now ${a==null?"–":Math.round(a*100)+"%"}) · ${d} practice days (now ${s.dc||0})${ru?` · ${ru} perfect answers in the last 40 (now ${s.r.filter(x=>x>=1).length})`:""}</span></div>`;}
  else h+=`<div class="note nx">${ic("trophy","s")}<span>Fully mastered. Keep it fresh: unused skills lose a dot after 7 days.</span></div>`;
  return h;}
function skillRow(k,extra){const s=gs(k),a=sAcc(k),rust=skRank(k,true)>skRank(k);
  return`<details class="sk"><summary><div><div>${esc(SKILLS[k][1])}</div><div class="s">${extra||""}${SKILLS[k][0]} · ${s.n}${rust?" · needs practice":""}</div></div>
   <div class="skbar">${pips(k)}<span class="num">${a==null?"–":Math.round(a*100)+"%"}</span></div></summary><div class="gbody">${skillBody(k)}</div></details>`;}
function rSprint(){
  if(vLoadSub)return vLoadSub();
  if(VS)return VS.state==="done"?vSummary():undefined;
  if(SP&&SP.state!=="done")return;
  if(SP&&SP.state==="done")return drawSummary();
  rollDay();
  const lv=unlockedLv(),doneToday=P.sp.last===today();
  const ks=Object.keys(SKILLS).filter(k=>SK_LV(k)<=lv).sort((a,b)=>(sAcc(a)??-1)-(sAcc(b)??-1));
  V.innerHTML=`<div class="hero"><div class="clock">${ic(doneToday?"check":"timer")}</div><div class="min">${S.s.sprintMin||2}:00</div></div>
    <div class="kpis">
      <div class="kpi" style="--c:var(--mid)">${ic("flame")}<b>${P.sp.streak||0}</b>${tx("Day streak")}</div>
      <div class="kpi" style="--c:var(--ink)">${ic("cap")}<b>${LEVELS[lv]}</b>${tx("Grammar level")}</div>
      <div class="kpi" style="--c:var(--ok)">${ic("trophy")}<b>${recOf()}</b>${tx("Record")}</div></div>
    <div class="spgo2"><button class="btn primary" id="spgo" aria-label="Start">${ic(doneToday?"repeat":"play")}</button>${PK.speech?`<button class="btn vgo" id="vsgo" aria-label="Speech sprint">${ic("mic")}</button>`:""}</div>
    ${PK.speech?`<div class="vnote">${ic("mic","s")}${tx(`Speech sprint · record: ${vRecOf()}`)}</div>`:""}
    <div class="eyebrow">${ic("calendar","s")}Challenges per week</div>${calHTML(10)}
    <div class="eyebrow">${ic("cap","s")}Grammar skills (dots = mastery)</div>
    <div class="group">${ks.map(k=>skillRow(k)).join("")}</div>`;
  document.getElementById("spgo").onclick=startSprint;
  const vb=document.getElementById("vsgo");if(vb)vb.onclick=startVoice;}
function startSprint(){
  SP={state:"ask",left:SPRINT_SEC()*1000,t0:performance.now(),paused:false,seen:new Set(),lastK:[],newIds:[],boosted:new Set(),tw:new Set(),
      queue:[],n:0,ok:0,combo:0,best:0,skillRes:{},cur:null};
  V.innerHTML=`<div class="sptop"><div class="race">
    <div class="clockring" id="cring"><svg viewBox="0 0 44 44"><circle cx="22" cy="22" r="19" class="rbg"/><circle cx="22" cy="22" r="19" class="rfg" id="rfg"/></svg><b id="tclock"></b></div>
    <div class="combo" id="tcombo"></div>
    <div class="score"><b id="tscore">0</b><span>${ic("trophy","s")}<i id="trec">${recOf()}</i></span></div></div>
    <div class="tbar"><i id="tbar"></i></div></div>
  <section class="study sprint">
    <h1 class="prompt" id="sprompt"></h1>
    <input class="answer" id="sans" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" lang="${PK.code}" placeholder="${PK.flag} …" aria-label="Answer">
    <div class="fb" id="sfb" aria-live="polite"></div>
    <div class="actrow" id="sacts"></div>
  </section>`;
  document.getElementById("sans").addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();spAct();}});
  SP.timer=setInterval(tick,200);lockState();fitVV();nextItem();}
function tick(){
  if(!SP||SP.state==="done")return;
  const now=performance.now();if(!SP.paused&&!document.hidden)SP.left-=now-SP.t0;SP.t0=now;
  if(SP.left<=0){SP.left=0;SP.last=true;}
  const t=Math.ceil(SP.left/1000),el=document.getElementById("tclock");
  if(el)el.textContent=SP.last?"0:00":`${Math.floor(t/60)}:${String(t%60).padStart(2,"0")}`;
  const frac=SP.left/(SPRINT_SEC()*1000),b=document.getElementById("tbar");if(b)b.style.width=(100*frac)+"%";
  const r=document.getElementById("rfg");if(r)r.style.strokeDashoffset=String(119.4*(1-frac));
  const cr=document.getElementById("cring");if(cr)cr.classList.toggle("hurry",SP.left<=10000);}
function nextItem(){
  if(SP.last)return finishSprint();
  let it=null;const qi=SP.queue.findIndex(q=>q.wait<=0);SP.queue.forEach(q=>q.wait--);
  it=qi>=0?SP.queue.splice(qi,1)[0].it:makeItem();
  if(!it)return finishSprint();
  SP.cur=it;SP.state="ask";SP.paused=false;
  document.getElementById("sprompt").textContent=it.en;
  const a=document.getElementById("sans");a.value="";a.readOnly=false;a.className="answer";a.focus({preventScroll:true});
  const fb=document.getElementById("sfb");fb.className="fb";fb.innerHTML="";
  document.getElementById("sacts").innerHTML=`<button class="ibtn" id="sskip" aria-label="Don't know">${ic("skip")}</button><button class="btn primary" id="scheck" aria-label="Check">${ic("check")}</button><button class="ibtn" id="sstop" aria-label="End round">${ic("stop")}</button>`;
  document.getElementById("scheck").onclick=spAct;
  document.getElementById("sskip").onclick=()=>spCheck(true);
  document.getElementById("sstop").onclick=()=>{SP.last=true;finishSprint();};
  drawScore();}
function drawScore(){const sc=document.getElementById("tscore");sc.textContent=SP.ok;sc.classList.toggle("beat",SP.ok>recOf()&&recOf()>0);
  sc.classList.remove("pop");void sc.offsetWidth;if(SP.n&&SP.lastGood)sc.classList.add("pop");
  document.getElementById("tcombo").innerHTML=SP.combo>=3?`${ic("flame","s")}${SP.combo}`:"";}
function spAct(){if(!SP)return;if(SP.state==="ask")spCheck(false);else if(SP.state==="shown")advance();}
function spCheck(giveUp){
  const it=SP.cur,a=document.getElementById("sans");
  const r=giveUp?"bad":gradeSent(it,a.value);if(r==="empty"){a.focus({preventScroll:true});return;}
  const hit=GQ.hit;
  if(r!=="ok"&&!hit&&!giveUp&&AI.key){
    SP.state="ai";SP.paused=true;a.readOnly=true;
    const fb=document.getElementById("sfb");fb.className="fb show";fb.innerHTML=aiWait();
    document.getElementById("sacts").innerHTML="";
    const my=SP.cur;
    aiJudge(it.en,it.canon,it.acc,a.value).then(v=>{if(!SP||SP.cur!==my||SP.state!=="ai")return;SP.paused=false;SP.t0=performance.now();spFinish(giveUp,aiResult(r,v,"s:"+it.en,a.value),v);});
    return;}
  spFinish(giveUp,r,null);}
function spFinish(giveUp,r,ai){
  const it=SP.cur,a=document.getElementById("sans");
  const good=r!=="bad";SP.lastGood=good;
  const free=!good&&!!it.newId&&!P.p[it.newId]; // the one new word: no penalty
  if(!free){SP.n++;if(good){SP.ok++;SP.combo++;SP.best=Math.max(SP.best,SP.combo);}else SP.combo=0;
    recordSkills(it.skills,good?((r==="near"&&!(ai&&ai.ok))?.5:1):0);
    it.skills.forEach(k=>{if(!SKILLS[k])return;const sr=SP.skillRes[k]||(SP.skillRes[k]={n:0,ok:0});sr.n++;if(good)sr.ok++;});}
  if(!good&&!free&&BYID[it.target]&&P.p[it.target]&&!it.retry)miss(it.target);
  it.words.forEach(id=>{
    if(id===it.newId&&!P.p[id]){P.p[id]={l:good?1:0,due:today()+(good?1:0),n:1,w:good?0:1};SP.newIds.push(id);P.d.newDone++;return;}
    const p=P.p[id];if(!p)return;
    if(good&&!it.retry&&p.due<=today()&&!SP.boosted.has(id)){p.l=Math.min(MAXL,p.l+1);p.due=today()+INTERVALS[p.l];p.n++;SP.boosted.add(id);P.d.reviewed++;}});
  if(!good)SP.queue.push({it:{...it,retry:true,newId:null},wait:3});
  save();
  a.readOnly=true;a.classList.add(good?"ok":"bad");
  const fb=document.getElementById("sfb");fb.className="fb show "+r;const tl=it.tr||(PK.translit?PK.translit(it.canon):"");fb.innerHTML=fbHTML(r,it.canon,a.value,it.words,(tl?`<div class="tr ph">${esc(tl)}</div>`:"")+tipHTML(ai));
  drawScore();
  if(r==="ok"){SP.state="auto";document.getElementById("sacts").innerHTML="";SP.autoT=setTimeout(advance,650);}
  else{SP.state="shown";SP.paused=r==="bad";
    document.getElementById("sacts").innerHTML=`<span class="ibtn ghost"></span><button class="btn primary" id="snext" aria-label="Next">${ic("arrow")}</button>${r==="bad"&&!giveUp?`<button class="ibtn" id="sovr" aria-label="I was right">${ic("thumb")}</button>`:`<span class="ibtn ghost"></span>`}`;
    document.getElementById("snext").onclick=advance;
    const o=document.getElementById("sovr");
    if(o)o.onclick=()=>{SP.ok++;SP.combo=1;it.skills.forEach(k=>{if(!SKILLS[k])return;const s=gs(k);s.ok++;s.r[s.r.length-1]=1;SP.skillRes[k].ok++;});SP.queue.pop();save();advance();};
    a.focus({preventScroll:true});}}
function advance(){if(!SP)return;clearTimeout(SP.autoT);nextItem();}
function finishSprint(){
  if(!SP||SP.state==="done")return;
  clearInterval(SP.timer);clearTimeout(SP.autoT);
  const full=SP.left<=0;SP.state="done";rollDay();const d=today();
  SP.prevRec=recOf();if(full&&SP.ok>SP.prevRec)P.sp.recs[S.s.sprintMin||2]=SP.ok;
  if(full&&SP.n>0){if(P.sp.last!==d){P.sp.streak=P.sp.last===d-1?(P.sp.streak||0)+1:1;P.sp.last=d;}P.sp.best=Math.max(P.sp.best||0,P.sp.streak);}
  const h=P.sp.hist[d]||(P.sp.hist[d]={n:0,ok:0});h.n+=SP.n;h.ok+=SP.ok;if(full)h.c=(h.c||0)+1;
  save();topline();lockState();if(view==="sprint")drawSummary();}
function drawSummary(){
  const pct=SP.n?Math.round(100*SP.ok/SP.n):0,ks=Object.keys(SP.skillRes).sort((a,b)=>(sAcc(a)??0)-(sAcc(b)??0));
  const rec=SP.ok>SP.prevRec&&SP.left<=0;
  V.innerHTML=`<div class="hero"><div class="clock" style="color:${rec?"var(--mid)":"var(--ok)"}">${ic(rec?"trophy":"check")}</div><div class="min">${SP.ok}</div>
      <div class="muted" style="display:flex;justify-content:center;gap:6px;align-items:center">${ic("trophy","s")}${Math.max(SP.prevRec,recOf())}${rec?` <span class="badge new">${ic("spark","s")}</span>`:""}</div></div>
    <div class="kpis">
      <div class="kpi" style="--c:var(--ok)">${ic("check")}<b>${pct}%</b>${tx("Accuracy")}</div>
      <div class="kpi" style="--c:var(--mid)">${ic("flame")}<b>${SP.best}</b>${tx("Best combo")}</div>
      <div class="kpi" style="--c:var(--ink)">${ic("calendar")}<b>${P.sp.streak||0}</b>${tx("Day streak")}</div></div>
    ${SP.newIds.length?`<div class="eyebrow">${ic("spark","s")}New words this round</div><div class="group">${SP.newIds.map(id=>{const c=BYID[id];return`<div class="row"><span>${esc(enOf(c))}</span><span class="tg" style="font-size:19px">${esc(c.fa[0])}</span></div>`;}).join("")}</div>`:""}
    <div class="eyebrow">${ic("calendar","s")}Challenges per week</div>${calHTML(4)}
    <div class="eyebrow">${ic("cap","s")}Grammar skills (dots = mastery)</div>
    <div class="group">${ks.map(k=>{const r=SP.skillRes[k];return skillRow(k,`${r.ok}/${r.n} · `);}).join("")}</div>
    <div class="acts"><button class="btn primary" id="spagain" aria-label="Again">${ic("repeat")}</button><div class="icons"><button class="ibtn" id="spclose" aria-label="Close">${ic("close")}</button></div></div>`;
  document.getElementById("spagain").onclick=startSprint;
  document.getElementById("spclose").onclick=()=>{SP=null;render();};lockState();}
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
    <div class="kpi"><span class="sq" style="--c:var(--ok)"></span><b>${tot[3]}</b>${tx("Learned")}</div>
    <div class="kpi"><span class="sq" style="--c:var(--mid)"></span><b>${tot[2]}</b>${tx("Basic")}</div>
    <div class="kpi"><span class="sq" style="--c:var(--bad)"></span><b>${tot[1]+tot[0]}</b>${tx("Missed / new")}</div></div>
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
  let h=`<div class="eyebrow">${ic("stack","s")}Progress per level</div><div class="group">`;
  LEVELS.forEach(d=>{const c=counts(d);if(!c.total)return;const w=x=>(100*x/c.total).toFixed(1)+"%";
    h+=`<div class="row deckrow"><b>${d}</b><div class="bar"><i style="width:${w(c.mast)};background:var(--ok)"></i><i style="width:${w(c.learn)};background:var(--mid)"></i></div><span class="num">${c.mast+c.learn}/${c.total}</span></div>`;});
  h+=`</div><div class="eyebrow">${ic("list","s")}All words</div><label class="search">${ic("search","s")}<input id="q" placeholder="…" aria-label="Search"></label><div class="group wl" id="list" style="margin-top:10px"></div>`;
  V.innerHTML=h;
  const q=document.getElementById("q"),L=document.getElementById("list");
  const draw=()=>{const s=q.value.trim().toLowerCase(),sn=q.value.trim()?norm(q.value):"";
    const rows=MCARDS().filter(c=>!s||c.en.toLowerCase().includes(s)||(sn&&c.fa.some(f=>norm(f).includes(sn)))).slice(0,120);
    L.innerHTML=rows.map(c=>{const p=st(c.id);return`<div class="row"><div><div class="e">${esc(c.en)}</div><div class="s"><span class="badge">${c.deck}</span>${p?meter(p.l):ic("spark","s")}</div></div><span class="f">${esc(c.fa[0])}</span></div>`;}).join("")||`<div class="row muted">–</div>`;};
  q.oninput=draw;draw();}
// ---------- grammar ----------
function rGrammar(){
  const lv=unlockedLv();
  let h="";
  if(P.gmax==="auto"&&lv<LEVELS.length-1){const g=gate(lv),row=(ok,t,v)=>`<div class="row"><span class="gt ${ok?"y":"n"}">${ic(ok?"check":"x","s")}${t}</span><span class="num">${v}</span></div>`;
    h+=`<div class="eyebrow">${ic("cap","s")}To unlock ${LEVELS[lv+1]}</div><div class="group">`+
      row(g.c2===g.tot,"Every "+LEVELS[lv]+" skill at ●●●○○ or better",g.c2+"/"+g.tot)+
      row(g.c3>=g.need3,"70% of skills at ●●●●○ or better",g.c3+"/"+g.need3)+
      row(g.acc>=.88,"Average recent accuracy 88%+",Math.round(g.acc*100)+"%")+
      row(g.days>=6,"Every skill practised on 6+ days",Math.min(g.days,6)+"/6")+`</div><div class="note">${ic("timer","s")}Dots need more sentences, higher accuracy and more practice days. Typos count half and do not count as perfect. Skills unused for 7+ days lose a dot.</div>`;}
  h+=`<div class="eyebrow">${ic("cap","s")} ${LEVELS[lv]}</div><div class="group">${Object.keys(SKILLS).filter(k=>SK_LV(k)<=lv).map(k=>skillRow(k)).join("")}</div>`;
  LEVELS.forEach(l=>{const ts=(PK.topics||[]).filter(g=>g.lvl===l);if(!ts.length)return;
    h+=`<div class="eyebrow">${l}</div>`;
    ts.forEach(g=>{h+=`<details><summary>${esc(g.t)}</summary><div class="gbody"><p>${esc(g.n)}</p>${g.d.map(([e,f])=>`<div class="ex"><span>${esc(e)}</span>${T(f.split("/")[0])}</div>`).join("")}</div></details>`;});});
  V.innerHTML=h;}
// ---------- tutor: chat with a Haiku teacher, with a phonetic layer on every target-language phrase ----------
const TUT={msgs:[],busy:false,code:null,stream:""};
function tutLoad(){if(TUT.code===PK.code)return;TUT.code=PK.code;try{TUT.msgs=JSON.parse(localStorage.getItem("kashi-tutor-"+PK.code)||"[]");}catch(e){TUT.msgs=[];}}
function tutSave(){try{localStorage.setItem("kashi-tutor-"+PK.code,JSON.stringify(TUT.msgs.slice(-40)));}catch(e){}}
// «target-language text» -> script + phonetics (the phonetics come from the app's own transliterator, free and consistent)
function chatHTML(t,user){
  if(user&&PK.dir==="rtl")t=t.replace(/[؀-ۿ‌]+(?:[ ‌][؀-ۿ‌]+)*/g,m=>"«"+m+"»");
  let h=esc(t);
  h=h.replace(/«([^»]+)»/g,(m,x)=>{const ph=PK.translit?PK.translit(x.replace(/&amp;/g,"&")):"";return`<span class="seg"><span class="sf tg">${x}</span>${ph?`<span class="sp">${esc(ph)}</span>`:""}</span>`;});
  h=h.replace(/\*\*([^*]+)\*\*/g,"<b>$1</b>").replace(/^[-•] (.*)$/gm,"<span class=\"li\">• $1</span>").replace(/\n/g,"<br>");
  return h;}
function tutSystem(){
  const m=mastery(),lv=m.lvl||"A1",nx=LEVELS[Math.min(LEVELS.length-1,LEVELS.indexOf(lv)+(m.lvl?1:0))];
  const ul=unlockedLv();
  const weak=Object.keys(SKILLS).filter(k=>SK_LV(k)<=ul).sort((a,b)=>skRank(a)-skRank(b)||(sAcc(a)??0)-(sAcc(b)??0)).slice(0,3).map(k=>SKILLS[k][1]);
  const miss=Object.keys(P.p).map(id=>BYID[id]).filter(c=>c&&LEVELS.includes(c.deck)&&P.p[c.id].w>0).sort((a,b)=>P.p[b.id].w-P.p[a.id].w).slice(0,8).map(c=>enOf(c)+" = "+c.fa[0]);
  return`You are a warm, expert ${LNAME()} teacher chatting with an English-speaking learner who is roughly ${lv} (aiming for ${nx}). They are using a typing-flashcard app.
Rules:
- Write in English, except ${LNAME()} words and sentences, which you write in ${PK.dir==="rtl"?"native script":"the native writing system"} wrapped in «guillemets», e.g. «سلام». One phrase per pair of «», no punctuation inside. Never write ${LNAME()} outside «». Do NOT add transliteration or pronunciation: the app adds a phonetic line under every «» phrase itself.
- Keep replies short (under 110 words) unless asked for more. Be concrete, friendly, never lecture.
- When asked for an exercise (quiz, translation, fill-the-gap, role-play, dialogue, sentence building, listening-style drills, anything), create it right away, ask ONE question at a time, wait for the learner's answer, then correct briefly (what was right, the fix, one tip) and move on.
- The learner may answer in ${LNAME()} script, in Latin phonetics, or in English; accept all and gently model the correct form.
- Use vocabulary and grammar at their level; at most one new word per exercise item, and say what it means.
${TV.call?`- CONVERSATION MODE (${TUT.scene||"free chat"}): this is a real spoken conversation, you are the partner, not a lecturer. Speak mostly ${LNAME()}: 1-2 very short sentences (max 25 words) at ${lv} level, each wrapped in «», then a tiny English gloss in parentheses only for a new word. Ask exactly one follow-up question each turn. If the learner makes a mistake, naturally repeat the corrected form inside your reply (a recast) and carry on; only stop to explain if they ask. If they speak English, answer with simple ${LNAME()} plus a hint. No lists, markdown or emoji.\n`:""}- Weak grammar right now: ${weak.join("; ")||"none yet"}.
- Messages starting with 🎤 were spoken by the learner and transcribed automatically, so they may contain recognition errors or (when marked phonetic) be a romanised phone sequence without word breaks; interpret generously, and if it is unclear ask them to repeat instead of correcting spelling.${TV.speak?"\n- Your reply will be read aloud. Keep it under 45 words, one short question at a time, no lists, no markdown, no emoji.":""}
- Words they often miss: ${miss.join("; ")||"none yet"}.`;}
async function tutAsk(onDelta){
  const msgs=[];TUT.msgs.filter(m=>!m.e).slice(-(TV.speak?10:14)).forEach(m=>{const l=msgs[msgs.length-1];if(l&&l.role===m.r)l.content+="\n"+m.t;else msgs.push({role:m.r,content:m.t});});
  while(msgs.length&&msgs[0].role!=="user")msgs.shift(); // the API wants the first message from the user
  const ctl=new AbortController(),to=setTimeout(()=>ctl.abort(),30000);
  try{const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",signal:ctl.signal,
    headers:{"content-type":"application/json","x-api-key":AI.key,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},
    body:JSON.stringify({model:AI.model,max_tokens:TV.speak?300:600,stream:true,system:tutSystem(),messages:msgs})});
    if(!r.ok)return{err:r.status===401?"Key rejected. Check it in Settings.":r.status===429?"Rate or spend limit reached.":"Error "+r.status};
    const rd=r.body.getReader(),dec=new TextDecoder(),use={input_tokens:0,output_tokens:0};let buf="",full="";
    for(;;){const{done,value}=await rd.read();if(done)break;buf+=dec.decode(value,{stream:true});
      let i;while((i=buf.indexOf("\n\n"))>=0){const ev=buf.slice(0,i);buf=buf.slice(i+2);const m=ev.match(/^data: (.*)$/m);if(!m)continue;let o;try{o=JSON.parse(m[1]);}catch(e){continue;}
        if(o.type==="content_block_delta"&&o.delta&&o.delta.type==="text_delta"){full+=o.delta.text;onDelta&&onDelta(full);}
        else if(o.type==="message_start"&&o.message&&o.message.usage)use.input_tokens=o.message.usage.input_tokens||0;
        else if(o.type==="message_delta"&&o.usage&&o.usage.output_tokens)use.output_tokens=o.usage.output_tokens;
        else if(o.type==="error")return{err:(o.error&&o.error.message)||"Error"};}}
    aiUse(use);return{t:full.trim()||"…"};}
  catch(e){return{err:e.name==="AbortError"?"Timed out. Try again.":"Network error."};}
  finally{clearTimeout(to);}}
function tutScroll(){const m=document.getElementById("msgs");if(m)m.scrollTop=m.scrollHeight;}
function tutDraw(){const m=document.getElementById("msgs");if(!m)return;const ch=document.querySelector(".chat");if(ch)ch.classList.toggle("call",!!TV.call);if(typeof tvOrb==="function")tvOrb();
  m.innerHTML=TUT.msgs.filter(x=>!x.hid).map(x=>`<div class="msg ${x.r==="user"?"u":"a"}">${chatHTML(x.t,x.r==="user")}</div>`).join("")+(TUT.busy?`<div class="msg a">${TUT.stream?chatHTML(TUT.stream.lastIndexOf("«")>TUT.stream.lastIndexOf("»")?TUT.stream.slice(0,TUT.stream.lastIndexOf("«")):TUT.stream,false):aiWait()}</div>`:"");const q=document.getElementById("tq");if(q)q.style.display=(TUT.msgs.length>3&&!TUT.menu)||TV.call?"none":"";tutScroll();}
async function tutSend(text,hid){
  text=(text||"").trim();if(!text||TUT.busy||!AI.key)return;
  TUT.msgs.push(hid?{r:"user",t:text,hid:1}:{r:"user",t:text});TUT.busy=true;TUT.stream="";tutDraw();tutSave();
  if(TV.speak)tvStreamStart();
  let last=0;
  const r=await tutAsk(full=>{TUT.stream=full;const n=performance.now();if(view==="tutor"&&n-last>60){last=n;tutDraw();}if(TV.speak)tvStreamFeed(full,false);});
  TUT.busy=false;TUT.stream="";
  if(r.err)TUT.msgs.push({r:"assistant",t:"⚠ "+r.err,e:1});else TUT.msgs.push({r:"assistant",t:r.t});
  tutSave();
  if(!r.err&&TV.speak&&view==="tutor")tvStreamFeed(r.t,true,()=>{if(TV.hands&&view==="tutor"&&!TV.err&&TV.state==="idle")setTimeout(()=>{if(TV.hands&&view==="tutor"&&TV.state==="idle")tvListen();},200);});
  if(view==="tutor"){tutDraw();const sp=document.getElementById("tspend");if(sp)sp.textContent=usd(aiSpend().usd);}}
const TUT_QUICK=[["bolt","Quiz me","Quiz me with 5 short questions, one at a time, focusing on my weak spots."],["cap","Explain","Explain my weakest grammar point simply, with 3 examples, then test me on it."],["chat","Role-play","Let's role-play a short everyday dialogue (ordering in a café). You start, keep each line short."],["pencil","Translate","Give me English sentences of 2-3 words to translate, one at a time."]];
function tqHTML(){return TUT_QUICK.map((q,i)=>`<button data-i="${i}">${ic(q[0],"s")}${q[1]}</button>`).join("");}
function rTutor(){
  tutLoad();
  if(!AI.key){V.innerHTML=`<div class="hero" style="margin-top:40px"><div class="clock">${ic("chat")}</div></div><div class="note" style="justify-content:center;text-align:center;margin:18px 8px">${ic("spark","s")}<span>The tutor needs your Anthropic API key. Add it in Settings. It costs a few cents a month.</span></div><div class="acts"><button class="btn primary" id="tkey" aria-label="Open settings">${ic("arrow")}</button></div>`;
    document.getElementById("tkey").onclick=()=>go("settings");return;}
  V.innerHTML=`<div class="chat"><div class="chathead"><span>${ic("chat","s")}Tutor</span><span class="muted" style="font-size:12px;margin-left:auto;white-space:nowrap" title="Estimated AI spend this month"><span id="tspend">${usd(aiSpend().usd)}</span></span><span class="tbtns"><button class="ibtn sm tg1" id="tspk" aria-label="Read replies aloud" aria-pressed="false">${ic("speaker","s")}</button><button class="ibtn sm tg1" id="thands" aria-label="Voice conversation" aria-pressed="false">${ic("phone","s")}</button><button class="ibtn sm" id="tclr" aria-label="New chat">${ic("trash","s")}</button></span></div>
    <div class="msgs" id="msgs"></div>
    <div class="tstat" id="tstat"></div>
    <div class="tq" id="tq">${tqHTML()}</div>
    <div class="orbrow"><button class="orb" id="torb" aria-label="Talk">${ic("mic")}</button><button class="ibtn sm" id="tend" aria-label="End conversation">${ic("x","s")}</button></div>
    <div class="composer"><button class="ibtn sm pill" id="tlang" aria-label="Speaking language">FA</button><button class="ibtn micb" id="tmic" aria-label="Speak">${ic("mic")}</button><textarea id="tin" rows="1" placeholder="Message…" aria-label="Message" autocomplete="off" autocapitalize="off" spellcheck="false"></textarea><button class="btn primary sendb" id="tsend" aria-label="Send">${ic("arrow")}</button></div></div>`;
  if(!TUT.msgs.length)TUT.msgs.push({r:"assistant",t:`Hi! I'm your ${LNAME()} tutor. Ask me for any exercise, a grammar explanation, a role-play, or just chat. Try saying hello.`,hello:1});
  tutDraw();tvBind();
  const t=document.getElementById("tin"),send=()=>{const v=t.value;t.value="";t.style.height="";tutSend(v);};
  document.getElementById("tsend").onclick=()=>{tvUnlock();send();};
  t.addEventListener("keydown",e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}});
  t.addEventListener("input",()=>{t.style.height="auto";t.style.height=Math.min(120,t.scrollHeight)+"px";});
  document.getElementById("tq").onclick=e=>{const b=e.target.closest("button");if(!b)return;if(b.dataset.sc!=null){tvCallStart(+b.dataset.sc);return;}if(b.dataset.cancel){tvCallMenu(false);return;}tutSend(TUT_QUICK[+b.dataset.i][2]);};
  document.getElementById("tclr").onclick=()=>{TUT.msgs=[];tutSave();rTutor();};}
// ---------- settings: pictograms only ----------
function rSettings(){
  const lvChips=LEVELS.map(l=>`<button data-d="${l}" aria-pressed="${P.decks.includes(l)}">${l}</button>`).join("");
  const gChips=[["auto",ic("spark","s")]].concat(LEVELS.map(l=>[l,l])).map(([v,t])=>`<button data-g="${v}" aria-pressed="${P.gmax===v}" aria-label="${v}">${t}</button>`).join("");
  const th=[["auto","auto"],["light","sun"],["dark","moon"]].map(([v,i])=>`<button data-t="${v}" aria-pressed="${S.s.theme===v}" aria-label="${v}">${ic(i,"s")}</button>`).join("");
  V.innerHTML=`<div class="group" style="margin-top:12px">
    <div class="row"><span class="lab">${ic("stack")}${tx("Levels to study")}</span><div class="chips" id="lvc">${lvChips}</div></div>
    <div class="row"><span class="lab">${ic("spark")}${tx("New words per day")}</span><div class="stepper"><button id="n-" aria-label="Fewer">${ic("minus","s")}</button><b id="npd">${P.npd}</b><button id="n+" aria-label="More">${ic("plus","s")}</button></div></div>
    <div class="row"><span class="lab">${ic("timer")}${tx("Challenge length")}</span><div class="stepper"><button id="m-" aria-label="Shorter">${ic("minus","s")}</button><b id="spm">${S.s.sprintMin}′</b><button id="m+" aria-label="Longer">${ic("plus","s")}</button></div></div>
    <div class="row"><span class="lab">${ic("cap")}${tx("Grammar level (✦ = auto)")}</span><div class="chips" id="gc">${gChips}</div></div>
    <div class="row"><span class="lab">${ic("sun")}${tx("Theme")}</span><div class="chips" id="thc">${th}</div></div>
  </div>
  <div class="group" style="margin-top:12px">
    <div class="row"><span class="lab">${ic("cloud")}${tx("Save progress online (GitHub token)")}<span id="ghs">${GH.tok?ghIcon():""}</span></span>
      <div class="ghbox">${GH.tok?`<button class="ibtn sm" id="ghsync" aria-label="Sync now">${ic("repeat","s")}</button><button class="ibtn sm" id="ghoff" aria-label="Disconnect">${ic("x","s")}</button>`
        :`<input id="ght" type="password" autocomplete="off" spellcheck="false" placeholder="ghp_…" aria-label="GitHub token">`}</div></div>
    <div class="row"><span class="lab">${ic("spark")}${tx("AI answer check (Anthropic key)")}</span>
      <div class="ghbox">${AI.key?`<span class="muted" style="font-size:12px">Haiku</span><button class="ibtn sm" id="aioff" aria-label="Remove key">${ic("x","s")}</button>`
        :`<input id="aik" type="password" autocomplete="off" spellcheck="false" placeholder="sk-ant-…" aria-label="Anthropic API key">`}</div></div>
    ${speechRowHTML()}
    ${AI.key?`<div class="row"><span class="lab">${ic("timer")}${tx("AI spend this month (estimate)")}</span><span class="num">${usd(aiSpend().usd)} · ${aiSpend().n}×</span></div>`:""}
    <div class="row"><span class="lab">${ic("download")}${tx("Backup: export / import")}</span><div class="chips">
      <button id="exp" aria-label="Export">${ic("download","s")}</button><button id="imp" aria-label="Import">${ic("upload","s")}</button><input type="file" id="impf" accept=".json,application/json" hidden></div></div>
  </div>
  <div class="group" style="margin-top:12px"><button class="danger" id="reset" aria-label="Erase progress">${ic("trash")}${tx("Erase progress for this language")}<span id="rst"></span></button></div>`;
  const set=()=>{save();topline();};
  document.getElementById("lvc").onclick=e=>{const b=e.target.closest("button");if(!b)return;const d=b.dataset.d;
    P.decks=P.decks.includes(d)?P.decks.filter(x=>x!==d):[...P.decks,d];if(!P.decks.length)P.decks=[d];set();rSettings();};
  const NP=[5,10,15,20,30,50];
  document.getElementById("n-").onclick=()=>{P.npd=NP[Math.max(0,NP.indexOf(P.npd)-1)]??5;set();rSettings();};
  document.getElementById("n+").onclick=()=>{P.npd=NP[Math.min(NP.length-1,NP.indexOf(P.npd)+1)]??10;set();rSettings();};
  const SM=[1,2,3,5,10];
  document.getElementById("m-").onclick=()=>{S.s.sprintMin=SM[Math.max(0,SM.indexOf(S.s.sprintMin)-1)]??2;set();rSettings();};
  document.getElementById("m+").onclick=()=>{S.s.sprintMin=SM[Math.min(SM.length-1,SM.indexOf(S.s.sprintMin)+1)]??2;set();rSettings();};
  document.getElementById("gc").onclick=e=>{const b=e.target.closest("button");if(!b)return;P.gmax=b.dataset.g;set();rSettings();};
  document.getElementById("thc").onclick=e=>{const b=e.target.closest("button");if(!b)return;S.s.theme=b.dataset.t;applyTheme();set();rSettings();};
  const t=document.getElementById("ght");
  if(t){const go=()=>{const v=t.value.trim();if(v.length<20)return;GH.tok=v;GH.id=null;try{localStorage.setItem("kashi-gh",v);localStorage.removeItem("kashi-gist");}catch(e){}rSettings();ghSync();};
    t.addEventListener("change",go);t.addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();go();}});}
  const ak=document.getElementById("aik");
  if(ak){const go=()=>{const v=ak.value.trim();if(v.length<20)return;AI.key=v;try{localStorage.setItem("kashi-ai",v);}catch(e){}rSettings();};
    ak.addEventListener("change",go);ak.addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();go();}});}
  const ao=document.getElementById("aioff");if(ao)ao.onclick=()=>{AI.key=null;try{localStorage.removeItem("kashi-ai");}catch(e){}rSettings();};
  const gs_=document.getElementById("ghsync");if(gs_)gs_.onclick=()=>ghSync();
  const go_=document.getElementById("ghoff");if(go_)go_.onclick=()=>{GH.tok=null;GH.id=null;GH.state="off";try{localStorage.removeItem("kashi-gh");localStorage.removeItem("kashi-gist");}catch(e){}rSettings();};
  speechRowBind();
  document.getElementById("exp").onclick=exportProgress;
  const f=document.getElementById("impf");document.getElementById("imp").onclick=()=>f.click();
  f.onchange=()=>{if(!f.files[0])return;importProgress(f.files[0],ok=>{const b=document.getElementById("imp");if(b)b.innerHTML=ok?ic("check","s"):ic("x","s");topline();if(ok)ghSchedule();});};
  const r=document.getElementById("reset");
  r.onclick=()=>{if(!r.classList.contains("arm")){r.classList.add("arm");document.getElementById("rst").innerHTML=`${ic("question","s")}`;setTimeout(()=>{r.classList.remove("arm");const x=document.getElementById("rst");if(x)x.innerHTML="";},4000);return;}
    S.L[PK.code]=LDEF();activate(PK.code);set();rSettings();};}
// ---------- cloud sync via a secret GitHub gist ----------
const GHF="kashi-progress.json";
const GH={tok:null,id:null,state:"off",busy:false,again:false};
try{GH.tok=localStorage.getItem("kashi-gh");GH.id=localStorage.getItem("kashi-gist");}catch(e){}
// combine two saves without losing progress on either side
function mergeStates(a,b){
  if(!a)return b;if(!b)return a;
  const n=(a.t||0)>=(b.t||0)?a:b,o=n===a?b:a,cl=x=>JSON.parse(JSON.stringify(x));
  const out={v:2,s:Object.assign({},o.s||{},n.s||{}),L:{},t:Math.max(a.t||0,b.t||0)};
  for(const k of new Set([...Object.keys(a.L||{}),...Object.keys(b.L||{})])){
    const x=n.L&&n.L[k],y=o.L&&o.L[k];if(!x||!y){out.L[k]=mergeL(cl(x||y));continue;}
    const L=mergeL(cl(x));
    for(const id in y.p||{}){const p=y.p[id],q=L.p[id];if(!q||(p.n||0)>(q.n||0))L.p[id]=p;}
    L.la=L.la||{};for(const k in y.la||{}){const m=L.la[k]=L.la[k]||{};for(const a in y.la[k])m[a]=Math.max(m[a]||0,y.la[k][a]);}
    for(const s in y.g||{}){const p=y.g[s],q=L.g[s];if(!q||(p.n||0)>(q.n||0))L.g[s]=p;}
    const sp=L.sp,so=y.sp||{};sp.best=Math.max(sp.best||0,so.best||0);
    if((so.last||0)>(sp.last||0)){sp.last=so.last;sp.streak=so.streak;}
    sp.recs=sp.recs||{};for(const m in so.recs||{})sp.recs[m]=Math.max(sp.recs[m]||0,so.recs[m]);
    sp.vrecs=sp.vrecs||{};for(const m in so.vrecs||{})sp.vrecs[m]=Math.max(sp.vrecs[m]||0,so.vrecs[m]);
    sp.hist=sp.hist||{};for(const d in so.hist||{}){const h=sp.hist[d],g=so.hist[d];
      sp.hist[d]=!h?g:{n:Math.max(h.n||0,g.n||0),ok:Math.max(h.ok||0,g.ok||0),c:Math.max(h.c||0,g.c||0)};}
    if(y.d&&L.d&&y.d.day===L.d.day){L.d.newDone=Math.max(L.d.newDone,y.d.newDone);L.d.reviewed=Math.max(L.d.reviewed,y.d.reviewed);}
    out.L[k]=L;}
  return out;}
async function gh(path,opt={}){
  const r=await fetch("https://api.github.com"+path,Object.assign({cache:"no-store"},opt,{headers:Object.assign({"Authorization":"Bearer "+GH.tok,"Accept":"application/vnd.github+json"},opt.body?{"Content-Type":"application/json"}:{})}));
  if(!r.ok){const e=new Error(r.status);e.status=r.status;throw e;}return r.status===204?null:r.json();}
function ghIcon(){return{ok:`<span style="color:var(--ok)">${ic("check","s")}</span>`,busy:`<span class="spin">${ic("repeat","s")}</span>`,err:`<span style="color:var(--bad)">${ic("x","s")}</span>`}[GH.state]||"";}
function ghSet(st){GH.state=st;const el=document.getElementById("ghs");if(el)el.innerHTML=ghIcon();const t=document.getElementById("ghtop");if(t)t.innerHTML=GH.tok&&st==="err"?`<span style="color:var(--bad)">${ic("cloud","s")}</span>`:"";}
async function ghFind(){
  if(GH.id)return GH.id;
  for(let page=1;page<=10;page++){const l=await gh(`/gists?per_page=100&page=${page}`);const g=l.find(x=>x.files&&x.files[GHF]);
    if(g){GH.id=g.id;try{localStorage.setItem("kashi-gist",g.id);}catch(e){}break;}if(l.length<100)break;}
  return GH.id;}
async function ghRead(){const id=await ghFind();if(!id)return null;const g=await gh("/gists/"+id);const f=g.files[GHF];if(!f)return null;
  let txt=f.content;if(f.truncated)txt=await(await fetch(f.raw_url,{cache:"no-store"})).text();return mergeS(JSON.parse(txt));}
async function ghWrite(){const body={description:"Kāshi progress",files:{[GHF]:{content:JSON.stringify(S)}}};
  if(GH.id)await gh("/gists/"+GH.id,{method:"PATCH",body:JSON.stringify(body)});
  else{const g=await gh("/gists",{method:"POST",body:JSON.stringify(Object.assign(body,{public:false}))});GH.id=g.id;try{localStorage.setItem("kashi-gist",g.id);}catch(e){}}}
async function ghSync(){ // pull, merge, push
  if(!GH.tok)return;if(GH.busy){GH.again=true;return;}GH.busy=true;ghSet("busy");
  try{
    const remote=await ghRead();
    const running=view==="sprint"&&SP&&SP.state!=="done";
    if(remote&&!running){const before=JSON.stringify(S),m=mergeStates(S,remote);
      if(JSON.stringify(m)!==before){S=m;try{localStorage.setItem(LSK,JSON.stringify(S));}catch(e){}applyTheme();
        if(S.s.lang&&PACKS[S.s.lang]){activate(S.s.lang,true);if(!(view==="study"&&phase==="shown")){if(view==="study"){cur=null;buildQueue();}render();}}}}
    if(!remote||JSON.stringify(remote)!==JSON.stringify(S))await ghWrite();
    ghSet("ok");}
  catch(e){if(e.status===404){GH.id=null;try{localStorage.removeItem("kashi-gist");}catch(x){}}ghSet("err");}
  GH.busy=false;if(GH.again){GH.again=false;setTimeout(ghSync,500);}}
let ghT=null;
function ghSchedule(){if(!GH.tok)return;clearTimeout(ghT);ghT=setTimeout(ghSync,5000);}
document.addEventListener("visibilitychange",()=>{if(!GH.tok)return;if(document.visibilityState==="visible")ghSync();else{clearTimeout(ghT);ghSync();}});
// ---------- export / import ----------
function exportProgress(){const b=new Blob([JSON.stringify(S)],{type:"application/json"});const a=document.createElement("a");
  a.href=URL.createObjectURL(b);a.download="kashi-progress-"+new Date().toISOString().slice(0,10)+".json";document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},500);}
function importProgress(file,done){const r=new FileReader();r.onload=()=>{let ok=false;try{const x=mergeS(JSON.parse(r.result));if(x){S=mergeStates(S,x);save();if(S.s.lang&&PACKS[S.s.lang])activate(S.s.lang,true);ok=true;}}catch(e){}done(ok);};r.readAsText(file);}
// ---------- start ----------
function boot(){
  if(S.s.lang&&PACKS[S.s.lang]){activate(S.s.lang,true);buildQueue();}
  else view="langs";
  NAV.querySelectorAll("button").forEach(x=>{if(x.dataset.v===view)x.setAttribute("aria-current","page");else x.removeAttribute("aria-current");});
  render();if(GH.tok)ghSync();registerSW();if(PK&&PK.speech)asrPrefetch();}
// ---------- shared core lexicon (English semantics; packs map keys to their own cards) ----------
const CORE_N=[["house; home","house","houses","place thing",1,"home"],["book","book","books","text thing",1],["car","car","cars","thing wash",1],["door","door","doors","open thing",0],["window","window","windows","open thing",0],["bread","bread","bread","food",0],["water","water","water","drink",0],["tea","tea","tea","drink",0],["milk","milk","milk","drink",0],["apple","apple","apples","food",0],["rice","rice","rice","food",0],["meat","meat","meat","food",0],["cheese","cheese","cheese","food",0],["fish","fish","fish","food animal",0],["coffee","coffee","coffee","drink",0],["food","food","food","food",1],["pen","pen","pens","thing",1],["bag","bag","bags","thing open",1],["phone","phone","phones","thing",1],["key","key","keys","thing",1],["clothes","clothes","clothes","thing wash",1],["letter","letter","letters","text thing",1],["newspaper","newspaper","newspapers","text thing",0],["city","city","cities","place",1,"to the city"],["school","school","schools","place",1,"to school"],["shop","shop","shops","place",1,"to the shop"],["park","park","parks","place",0,"to the park"],["university","university","universities","place",1,"to university"],["room","room","rooms","place",1,"to the room"],["restaurant","restaurant","restaurants","place",0,"to the restaurant"],["hospital","hospital","hospitals","place",0,"to the hospital"],["garden","garden","gardens","place",1,"to the garden"],["friend","friend","friends","person",1],["teacher","teacher","teachers","person",1],["child","child","children","person",1],["doctor","doctor","doctors","person",1],["mother","mother","mothers","person",1],["father","father","fathers","person",1],["brother","brother","brothers","person",1],["sister","sister","sisters","person",1],["cat","cat","cats","animal",1],["dog","dog","dogs","animal",1],["table","table","tables","thing",1],["chair","chair","chairs","thing",0],["plate","plate","plates","thing wash",0],["glass (for drinking)","glass","glasses","thing wash",0],["shoe","shoe","shoes","thing",1],["fruit","fruit","fruits","food",0],["gift","gift","gifts","thing",1],["song","song","songs","media",0],["film","film","films","media",0],["word","word","words","word",0],["question","question","questions","word",0]];
const CORE_A=[["big","big","bigger","thing place animal"],["small","small","smaller","thing place animal"],["new","new","newer","thing text place"],["old (thing)","old","older","thing text place"],["beautiful","beautiful","more beautiful","thing place animal text"],["good","good","better","thing text place food drink person animal"],["bad","bad","worse","thing text place food drink"],["clean","clean","cleaner","thing place"],["dirty","dirty","dirtier","thing place"],["cheap","cheap","cheaper","thing food text"],["expensive","expensive","more expensive","thing food place"],["warm","warm","warmer","food drink place"],["cold","cold","colder","food drink place"],["delicious","delicious","more delicious","food drink"],["sweet","sweet","sweeter","food drink"],["tired","tired","more tired","person animal pp"],["happy","happy","happier","person pp"],["kind","kind","kinder","person animal pp"],["young","young","younger","person pp"],["old (person)","old","older","person animal pp"],["long; tall","tall","taller","person pp"],["interesting","interesting","more interesting","text place"],["fresh","fresh","fresher","food drink"],["hungry","hungry","hungrier","pp animal"],["thirsty","thirsty","thirstier","pp"],["sick","sick","sicker","pp animal"],["ready","ready","readier","pp food"],["sad","sad","sadder","pp person"]];
const CORE_V=[{"k":"to go","en":["go","goes","went","gone","going"],"intr":1,"place":1},{"k":"to come","en":["come","comes","came","come","coming"],"intr":1,"place":1},{"k":"to eat","en":["eat","eats","ate","eaten","eating"],"intr":1,"obj":"food","pass":1},{"k":"to drink","en":["drink","drinks","drank","drunk","drinking"],"intr":1,"obj":"drink","pass":1},{"k":"to see","en":["see","sees","saw","seen","seeing"],"obj":"thing person animal place media","noProg":1,"pass":1},{"k":"to read","en":["read","reads","read","read","reading"],"intr":1,"obj":"text word","pass":1},{"k":"to write","en":["write","writes","wrote","written","writing"],"intr":1,"obj":"text word","pass":1},{"k":"to buy","en":["buy","buys","bought","bought","buying"],"obj":"food drink text thing","pass":1},{"k":"to sleep","en":["sleep","sleeps","slept","slept","sleeping"],"intr":1},{"k":"to sit","en":["sit","sits","sat","sat","sitting"],"intr":1},{"k":"to bring","en":["bring","brings","brought","brought","bringing"],"obj":"food drink text thing","pass":1},{"k":"to wash","en":["wash","washes","washed","washed","washing"],"obj":"wash","pass":1},{"k":"to cook","en":["cook","cooks","cooked","cooked","cooking"],"obj":"food","pass":1},{"k":"to close","en":["close","closes","closed","closed","closing"],"obj":"open","pass":1},{"k":"to understand","en":["understand","understands","understood","understood","understanding"],"intr":1,"noProg":1},{"k":"to know (a fact)","en":["know","knows","knew","known","knowing"],"intr":1,"noProg":1,"noModal":1},{"k":"to work","en":["work","works","worked","worked","working"],"intr":1},{"k":"to speak","en":["speak","speaks","spoke","spoken","speaking"],"intr":1},{"k":"to play","en":["play","plays","played","played","playing"],"intr":1},{"k":"to learn","en":["learn","learns","learned","learned","learning"],"intr":1},{"k":"to open","en":["open","opens","opened","opened","opening"],"obj":"open","pass":1},{"k":"to find","en":["find","finds","found","found","finding"],"obj":"thing text","noProg":1,"pass":1},{"k":"to like; to love","en":["like","likes","liked","liked","liking"],"obj":"food drink text thing person animal place media","noProg":1,"stative":1},{"k":"to help","en":["help","helps","helped","helped","helping"],"intr":1}];

document.addEventListener("pointerover",e=>{const b=e.target.closest&&e.target.closest("[aria-label]:not([title])");if(b)b.title=b.getAttribute("aria-label");});
