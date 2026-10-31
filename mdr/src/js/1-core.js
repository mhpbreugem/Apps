// ===================== MDR flashcards: core =====================
const INTERVALS=[0,1,3,7,14,30,60,120,240],MAXL=8,MASTER=6;
const IC={
 cards:'<rect x="4" y="6" width="13" height="14" rx="2.5"/><path d="M8 3.5h9.5A2.5 2.5 0 0 1 20 6v10.5"/>',
 book:'<path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H11v16H5.5A1.5 1.5 0 0 1 4 18.5z"/><path d="M20 5.5A1.5 1.5 0 0 0 18.5 4H13v16h5.5a1.5 1.5 0 0 0 1.5-1.5z"/>',
 list:'<path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r="1"/><circle cx="4.5" cy="12" r="1"/><circle cx="4.5" cy="18" r="1"/>',
 sliders:'<path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2.2"/><circle cx="8" cy="17" r="2.2"/>',
 check:'<path d="M5 12.5l4.5 4.5L19 7.5"/>',x:'<path d="M6 6l12 12M18 6L6 18"/>',approx:'<path d="M5 10c2-2 4-2 7 0s5 2 7 0M5 15c2-2 4-2 7 0s5 2 7 0"/>',
 arrow:'<path d="M5 12h14M13 6l6 6-6 6"/>',bulb:'<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V16h5v-.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z"/>',
 eye:'<path d="M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7z"/><circle cx="12" cy="12" r="3"/>',
 timer:'<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2.5M9.5 2.5h5"/>',flame:'<path d="M12 21c-4 0-7-2.7-7-6.5 0-3 2-5 3.5-6.5.3 2 1.5 3 2.5 3 0-3 1-6 4-8 0 3 1.5 4.5 3 6.5 1.2 1.6 1 3.2 1 5 0 3.8-3 6.5-7 6.5z"/>',
 cap:'<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c2 2 10 2 12 0v-5M22 9v6"/>',stack:'<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>',
 spark:'<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M6 18l2.5-2.5M15.5 8.5L18 6"/>',
 key:'<circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M16 7l3 3"/>',pencil:'<path d="M4 20h4L19 9l-4-4L4 16z"/>',
 search:'<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',plus:'<path d="M12 5v14M5 12h14"/>',minus:'<path d="M5 12h14"/>',
 sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5"/>',
 moon:'<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',auto:'<circle cx="12" cy="12" r="8"/><path d="M12 4v16" /><path d="M12 4a8 8 0 0 1 0 16z" fill="currentColor"/>',
 trash:'<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',repeat:'<path d="M17 2l3 3-3 3M4 11V9a4 4 0 0 1 4-4h12M7 22l-3-3 3-3M20 13v2a4 4 0 0 1-4 4H4"/>',
 question:'<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6V14M12 17.5v.01"/>',
 trophy:'<path d="M8 4h8v5a4 4 0 0 1-8 0zM8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4M8.5 20h7M10 17h4"/>',
 play:'<path d="M7 4.5v15l12-7.5z"/>',skip:'<path d="M5 5l9 7-9 7zM17 5v14"/>',cloud:'<path d="M7 18h10a4 4 0 0 0 .6-7.96A6 6 0 0 0 6.2 9.6 4.2 4.2 0 0 0 7 18z"/>',
 download:'<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',upload:'<path d="M12 16V5M7 10l5-5 5 5M5 20h14"/>',
 calendar:'<rect x="3.5" y="5" width="17" height="15" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',close:'<path d="M6 6l12 12M18 6L6 18"/>',
 shield:'<path d="M12 3l7.5 3v5.5c0 4.6-3.2 8.3-7.5 9.5-4.3-1.2-7.5-4.9-7.5-9.5V6z"/><path d="M9 12l2.2 2.2L15.5 10"/>'};
const ic=(n,c="")=>`<svg class="i ${c}" viewBox="0 0 24 24" aria-hidden="true">${IC[n]}</svg>`;
const esc=s=>String(s).replace(/[&<>"]/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[m]));
const tx=t=>`<small class="cp">${t}</small>`;
const today=()=>Math.floor((Date.now()-new Date().getTimezoneOffset()*60000)/864e5);
function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
// ---------- cards ----------
const RAW=__CARDS__;
const DECKS=[],CARDS=[];
function hsh(s){let h=5381;for(let i=0;i<s.length;i++)h=((h<<5)+h+s.charCodeAt(i))>>>0;return h.toString(36);}
(function parse(){let d=null;
  RAW.split("\n").forEach(l=>{if(!l.trim())return;const f=l.split("|");
    if(l[0]==="#"){const id=f[0].slice(1);d={id,lab:f[1],title:f[2],range:f[3],annex:id[0]==="A"};DECKS.push(d);return;}
    CARDS.push({id:d.id+":"+hsh(f[0]),deck:d.id,q:f[0],a:f[1],ref:f[2]||""});});})();
const BYID=Object.fromEntries(CARDS.map(c=>[c.id,c])),DK=Object.fromEntries(DECKS.map(d=>[d.id,d]));
const DORD=Object.fromEntries(DECKS.map((d,i)=>[d.id,i]));
// ---------- state ----------
const LSK="mdr-v1";
const SDEF=()=>({v:1,s:{theme:"auto",npd:15},inc:null,p:{},d:{day:0,newDone:0,reviewed:0},st:{streak:0,last:0,best:0,hist:{}},t:0});
function mergeS(x){if(!x||x.v!==1)return null;const d=SDEF();return Object.assign(d,x,{s:Object.assign(d.s,x.s||{}),d:Object.assign(d.d,x.d||{}),st:Object.assign(d.st,x.st||{})});}
let S=SDEF();
try{const m=mergeS(JSON.parse(localStorage.getItem(LSK)||"null"));if(m)S=m;}catch(e){}
let saveT=null;
function save(){S.t=Date.now();try{localStorage.setItem(LSK,JSON.stringify(S));}catch(e){}if(typeof ghSchedule==="function")ghSchedule();}
function applyTheme(){if(S.s.theme==="auto")document.documentElement.removeAttribute("data-theme");else document.documentElement.dataset.theme=S.s.theme;}
applyTheme();
// which chapters / annexes are included (null = all)
const included=id=>!S.inc||S.inc.includes(id);
function setInc(ids){S.inc=DECKS.map(d=>d.id).filter(id=>ids.includes(id));if(S.inc.length===DECKS.length)S.inc=null;save();}
const inDecks=c=>included(c.deck);
// ---------- scheduling ----------
const st=id=>S.p[id];
const due=id=>{const p=st(id);return !!p&&p.due<=today();};
let Q=[],cur=null,phase="ask",hinted=false,lapsed=new Set(),pending=null,typed="",aiV=null;
function rollDay(){if(S.d.day!==today())S.d={day:today(),newDone:0,reviewed:0};}
function buildQueue(){
  rollDay();
  const rev=shuffle(CARDS.filter(c=>inDecks(c)&&due(c.id)));
  const room=Math.max(0,S.s.npd-S.d.newDone);
  const fresh=CARDS.filter(c=>inDecks(c)&&!st(c.id)).slice(0,room); // new cards in the order of the regulation
  Q=rev.slice(0,400);
  fresh.forEach((c,i)=>Q.splice(Math.min(Q.length,Math.floor((i+1)*Q.length/(fresh.length+1))+i),0,c));
  lapsed=new Set();}
function logDay(ok){const d=today(),h=S.st.hist[d]||(S.st.hist[d]={n:0,ok:0});h.n++;if(ok)h.ok++;
  if(S.st.last!==d){S.st.streak=S.st.last===d-1?(S.st.streak||0)+1:1;S.st.last=d;S.st.best=Math.max(S.st.best||0,S.st.streak);}
  const ks=Object.keys(S.st.hist);if(ks.length>400)delete S.st.hist[ks.sort((a,b)=>a-b)[0]];}
// result: "ok" | "near" | "bad"
function schedule(card,result){
  const isNew=!st(card.id);let p=st(card.id)||{l:0,due:today(),n:0,w:0};p.n++;
  if(isNew)S.d.newDone++;else if(!lapsed.has(card.id))S.d.reviewed++;
  if(result==="bad"){p.w=(p.w||0)+1;if(!isNew){p.s=(p.s||0)+1;if(p.s>=2){p.l=0;p.s=0;}else p.l=Math.max(0,p.l-3);}else p.l=0;
    p.due=today();lapsed.add(card.id);Q.splice(Math.min(3,Q.length),0,card);}
  else if(result==="near"){p.l=Math.max(1,Math.min(p.l,MAXL));p.due=today()+1;p.s=0;lapsed.delete(card.id);}
  else if(lapsed.has(card.id)||hinted){p.l=Math.max(p.l,1);p.due=today()+1;p.s=0;lapsed.delete(card.id);}
  else{p.l=Math.min(MAXL,p.l+1);p.due=today()+INTERVALS[p.l];p.s=0;}
  S.p[card.id]=p;logDay(result!=="bad");save();}
function counts(deck){
  const cs=CARDS.filter(c=>deck?c.deck===deck:inDecks(c));let n=0,learn=0,mast=0,d=0;
  cs.forEach(c=>{const p=st(c.id);if(!p)n++;else if(p.l>=MASTER)mast++;else learn++;if(due(c.id))d++;});
  return{total:cs.length,n,learn,mast,due:d};}
// mastery of the included cards: every card at its top interval = 100%
function mastery(deck){const cs=CARDS.filter(c=>deck?c.deck===deck:inDecks(c));if(!cs.length)return 0;
  let v=0;cs.forEach(c=>{const p=st(c.id);if(p)v+=Math.min(p.l,MASTER)/MASTER;});return v/cs.length;}
function pct(x){const v=x*100;return(v>=99.95?"100":v>=10?v.toFixed(1):v.toFixed(2))+"%";}
function meter(l){let h="";for(let i=1;i<=MAXL;i++)h+=`<i class="${i<=l?"on":""}"></i>`;return`<span class="dots" aria-label="Level ${l} of ${MAXL}">${h}</span>`;}
