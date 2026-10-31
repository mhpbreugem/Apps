// ---------- settings ----------
function toast(m){let t=document.getElementById("toast");if(!t){t=document.createElement("div");t.id="toast";document.body.appendChild(t);}t.textContent=m;t.classList.add("show");clearTimeout(t._h);t._h=setTimeout(()=>t.classList.remove("show"),2600);}
function rSettings(){
  const th=[["auto","auto"],["light","sun"],["dark","moon"]].map(([v,i])=>`<button data-t="${v}" aria-pressed="${S.s.theme===v}" aria-label="${v}">${ic(i,"s")}</button>`).join("");
  const sp=aiSpend();
  V.innerHTML=`<div class="group" style="margin-top:12px">
    <div class="row"><span class="lab">${ic("spark")}${tx("New cards per day")}</span><div class="stepper"><button id="n-" aria-label="Fewer">${ic("minus","s")}</button><b id="npd">${S.s.npd}</b><button id="n+" aria-label="More">${ic("plus","s")}</button></div></div>
    <div class="row"><span class="lab">${ic("sun")}${tx("Theme")}</span><div class="chips" id="thc">${th}</div></div>
  </div>
  <div class="eyebrow">${ic("spark","s")}Answer check by Claude Haiku</div>
  <div class="group">
    <div class="row"><span class="lab">${ic("key")}${tx(AI.key?(AI.shared?"Anthropic key (shared with Kāshi)":"Anthropic key"):"Anthropic API key")}</span>
      <div class="ghbox">${AI.key?`<span class="muted" style="font-size:12px">Haiku 5.5</span><button class="ibtn sm" id="aitest" aria-label="Test key">${ic("play","s")}</button><button class="ibtn sm" id="aioff" aria-label="Remove key">${ic("x","s")}</button>`
        :`<input id="aik" type="password" autocomplete="off" spellcheck="false" placeholder="sk-ant-…" aria-label="Anthropic API key">`}</div></div>
    ${AI.key?`<div class="row"><span class="lab">${ic("timer")}${tx("AI spend this month (estimate)")}</span><span class="num">${usd(sp.usd)} · ${sp.n}×</span></div>`:""}
  </div>
  <div class="note">${ic("spark","s")}<span>With a key, type an answer and Haiku grades it against the regulation text: right, partly or not right, with a short tip. The key stays in this browser and is sent only to api.anthropic.com. Get one at console.anthropic.com. Without a key you grade yourself.</span></div>
  <div class="eyebrow">${ic("cloud","s")}Progress</div>
  <div class="group">
    <div class="row"><span class="lab">${ic("cloud")}${tx("Save progress online (GitHub token, gist scope)")}<span id="ghs">${GH.tok?ghIcon():""}</span></span>
      <div class="ghbox">${GH.tok?`<button class="ibtn sm" id="ghsync" aria-label="Sync now">${ic("repeat","s")}</button><button class="ibtn sm" id="ghoff" aria-label="Disconnect">${ic("x","s")}</button>`
        :`<input id="ght" type="password" autocomplete="off" spellcheck="false" placeholder="ghp_…" aria-label="GitHub token">`}</div></div>
    <div class="row"><span class="lab">${ic("download")}${tx("Backup: export / import")}</span><div class="chips">
      <button id="exp" aria-label="Export">${ic("download","s")}</button><button id="imp" aria-label="Import">${ic("upload","s")}</button><input type="file" id="impf" accept=".json,application/json" hidden></div></div>
  </div>
  <div class="group" style="margin-top:12px"><button class="danger" id="reset" aria-label="Erase progress">${ic("trash")}${tx("Erase all progress")}<span id="rst"></span></button></div>
  <div class="note">${ic("book","s")}<span>${CARDS.length} cards on Regulation (EU) 2017/745, as amended by 2020/561, 2023/607 and 2024/1860. A study aid, not legal advice: check the consolidated text on EUR-Lex.</span></div>`;
  const NP=[5,10,15,20,30,50];
  document.getElementById("n-").onclick=()=>{S.s.npd=NP[Math.max(0,NP.indexOf(S.s.npd)-1)]??5;save();topline();rSettings();};
  document.getElementById("n+").onclick=()=>{S.s.npd=NP[Math.min(NP.length-1,NP.indexOf(S.s.npd)+1)]??15;save();topline();rSettings();};
  document.getElementById("thc").onclick=e=>{const b=e.target.closest("button");if(!b)return;S.s.theme=b.dataset.t;applyTheme();save();rSettings();};
  const ak=document.getElementById("aik");
  if(ak){const set=()=>{const v=ak.value.trim();if(v.length<20){toast("That key looks too short.");return;}AI.key=v;AI.shared=false;try{localStorage.setItem("mdr-ai",v);localStorage.removeItem("mdr-ai-off");}catch(e){}rSettings();};
    ak.addEventListener("change",set);ak.addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();set();}});}
  const ao=document.getElementById("aioff");if(ao)ao.onclick=()=>{const sh=AI.shared;AI.key=null;AI.shared=false;try{localStorage.removeItem("mdr-ai");if(sh)localStorage.setItem("mdr-ai-off","1");}catch(e){}toast(sh?"Key removed here; Kāshi keeps its own.":"Key removed.");rSettings();};
  const at=document.getElementById("aitest");if(at)at.onclick=async()=>{at.innerHTML=ic("repeat","s");
    const r=await aiJudge({q:"Which class are all non-invasive devices by default?",a:"Class I (Rule 1), unless another rule applies.",ref:"Annex VIII Rule 1"},"class I");
    at.innerHTML=ic(r&&!r.err?"check":"x","s");toast(r&&!r.err?"Haiku works: "+r.v:(r?r.err:"No key"));};
  const t=document.getElementById("ght");
  if(t){const set=()=>{const v=t.value.trim();if(v.length<20)return;GH.tok=v;GH.id=null;try{localStorage.setItem("mdr-gh",v);localStorage.removeItem("mdr-gist");localStorage.removeItem("mdr-gh-off");}catch(e){}rSettings();ghSync();};
    t.addEventListener("change",set);t.addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();set();}});}
  const gs_=document.getElementById("ghsync");if(gs_)gs_.onclick=()=>ghSync();
  const go_=document.getElementById("ghoff");if(go_)go_.onclick=()=>{GH.tok=null;GH.id=null;GH.state="off";try{localStorage.removeItem("mdr-gh");localStorage.removeItem("mdr-gist");localStorage.setItem("mdr-gh-off","1");}catch(e){}rSettings();};
  document.getElementById("exp").onclick=exportProgress;
  const f=document.getElementById("impf");document.getElementById("imp").onclick=()=>f.click();
  f.onchange=()=>{if(!f.files[0])return;importProgress(f.files[0],ok=>{toast(ok?"Progress imported.":"Not an MDR progress file.");topline();if(ok)ghSchedule();});};
  const r=document.getElementById("reset");
  r.onclick=()=>{if(!r.classList.contains("arm")){r.classList.add("arm");document.getElementById("rst").innerHTML=ic("question","s");setTimeout(()=>{r.classList.remove("arm");const x=document.getElementById("rst");if(x)x.innerHTML="";},4000);return;}
    const th_=S.s.theme,inc=S.inc;S=SDEF();S.s.theme=th_;S.inc=inc;save();buildQueue();topline();rSettings();toast("Progress erased.");};}
// ---------- merge two saves without losing progress on either side ----------
function mergeStates(a,b){
  if(!a)return b;if(!b)return a;
  const n=(a.t||0)>=(b.t||0)?a:b,o=n===a?b:a,out=mergeS(JSON.parse(JSON.stringify(n)));
  out.t=Math.max(a.t||0,b.t||0);
  for(const id in o.p||{}){const p=o.p[id],q=out.p[id];if(!q||(p.n||0)>(q.n||0))out.p[id]=p;}
  const so=o.st||{},sn=out.st;sn.best=Math.max(sn.best||0,so.best||0);if((so.last||0)>(sn.last||0)){sn.last=so.last;sn.streak=so.streak;}
  for(const d in so.hist||{}){const h=sn.hist[d],g=so.hist[d];sn.hist[d]=!h?g:{n:Math.max(h.n||0,g.n||0),ok:Math.max(h.ok||0,g.ok||0)};}
  if(o.d&&o.d.day===out.d.day){out.d.newDone=Math.max(out.d.newDone,o.d.newDone);out.d.reviewed=Math.max(out.d.reviewed,o.d.reviewed);}
  return out;}
// ---------- cloud sync via a secret GitHub gist (a Kāshi token on the same site is reused) ----------
const GHF="mdr-progress.json";
const GH={tok:null,id:null,state:"off",busy:false,again:false};
try{GH.tok=localStorage.getItem("mdr-gh")||(localStorage.getItem("mdr-gh-off")?null:localStorage.getItem("kashi-gh"));GH.id=localStorage.getItem("mdr-gist");}catch(e){}
async function gh(path,opt={}){
  const r=await fetch("https://api.github.com"+path,Object.assign({cache:"no-store"},opt,{headers:Object.assign({"Authorization":"Bearer "+GH.tok,"Accept":"application/vnd.github+json"},opt.body?{"Content-Type":"application/json"}:{})}));
  if(!r.ok){const e=new Error(r.status);e.status=r.status;throw e;}return r.status===204?null:r.json();}
function ghIcon(){return{ok:`<span style="color:var(--ok)">${ic("check","s")}</span>`,busy:`<span class="spin">${ic("repeat","s")}</span>`,err:`<span style="color:var(--bad)">${ic("x","s")}</span>`}[GH.state]||"";}
function ghSet(s){GH.state=s;const el=document.getElementById("ghs");if(el)el.innerHTML=ghIcon();}
async function ghFind(){
  if(GH.id)return GH.id;
  for(let page=1;page<=10;page++){const l=await gh(`/gists?per_page=100&page=${page}`);const g=l.find(x=>x.files&&x.files[GHF]);
    if(g){GH.id=g.id;try{localStorage.setItem("mdr-gist",g.id);}catch(e){}break;}if(l.length<100)break;}
  return GH.id;}
async function ghRead(){const id=await ghFind();if(!id)return null;const g=await gh("/gists/"+id);const f=g.files[GHF];if(!f)return null;
  let t=f.content;if(f.truncated)t=await(await fetch(f.raw_url,{cache:"no-store"})).text();return mergeS(JSON.parse(t));}
async function ghWrite(){const body={description:"MDR flashcards progress",files:{[GHF]:{content:JSON.stringify(S)}}};
  if(GH.id)await gh("/gists/"+GH.id,{method:"PATCH",body:JSON.stringify(body)});
  else{const g=await gh("/gists",{method:"POST",body:JSON.stringify(Object.assign(body,{public:false}))});GH.id=g.id;try{localStorage.setItem("mdr-gist",g.id);}catch(e){}}}
async function ghSync(){
  if(!GH.tok)return;if(GH.busy){GH.again=true;return;}GH.busy=true;ghSet("busy");
  try{const remote=await ghRead();
    if(remote){const before=JSON.stringify(S),m=mergeStates(S,remote);
      if(JSON.stringify(m)!==before){S=m;try{localStorage.setItem(LSK,JSON.stringify(S));}catch(e){}applyTheme();if(!(view==="study"&&cur)){if(view==="study")buildQueue();render();}else topline();}}
    if(!remote||JSON.stringify(remote)!==JSON.stringify(S))await ghWrite();
    ghSet("ok");}
  catch(e){if(e.status===404){GH.id=null;try{localStorage.removeItem("mdr-gist");}catch(x){}}ghSet("err");}
  GH.busy=false;if(GH.again){GH.again=false;setTimeout(ghSync,500);}}
let ghT=null;
function ghSchedule(){if(!GH.tok)return;clearTimeout(ghT);ghT=setTimeout(ghSync,5000);}
document.addEventListener("visibilitychange",()=>{if(!GH.tok)return;if(document.visibilityState==="visible")ghSync();else{clearTimeout(ghT);ghSync();}});
// ---------- export / import ----------
function exportProgress(){const b=new Blob([JSON.stringify(S)],{type:"application/json"});const a=document.createElement("a");
  a.href=URL.createObjectURL(b);a.download="mdr-progress-"+new Date().toISOString().slice(0,10)+".json";document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},500);}
function importProgress(file,done){const r=new FileReader();r.onload=()=>{let ok=false;try{const x=mergeS(JSON.parse(r.result));if(x){S=mergeStates(S,x);save();applyTheme();buildQueue();ok=true;}}catch(e){}done(ok);};r.readAsText(file);}
// ---------- start ----------
function registerSW(){try{if("serviceWorker"in navigator&&location.protocol==="https:"&&!window.claude)navigator.serviceWorker.register("sw.js").catch(()=>{});}catch(e){}}
document.addEventListener("pointerover",e=>{const b=e.target.closest&&e.target.closest("[aria-label]:not([title])");if(b)b.title=b.getAttribute("aria-label");});
buildQueue();render();if(GH.tok)ghSync();registerSW();
