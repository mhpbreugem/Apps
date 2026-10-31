// ---------- rendering ----------
const V=document.getElementById("view"),NAV=document.getElementById("nav"),SHEET=document.getElementById("sheet");
let view="study";
NAV.addEventListener("click",e=>{const b=e.target.closest("button");if(b)go(b.dataset.v);});
document.getElementById("brand").onclick=()=>go("chapters");
function go(v){
  if(phase==="shown"&&cur&&pending)next(true);
  cur=null;phase="ask";pending=null;aiV=null;view=v;
  NAV.querySelectorAll("button").forEach(x=>{if(x.dataset.v===v)x.setAttribute("aria-current","page");else x.removeAttribute("aria-current");});
  if(v==="study")buildQueue();
  closeSheet();render();window.scrollTo(0,0);}
function render(){({study:rStudy,chapters:rChapters,cards:rCards,settings:rSettings})[view]();topline();}
function topline(){
  rollDay();
  const c=counts(),newLeft=Math.min(c.n,Math.max(0,S.s.npd-S.d.newDone)),done=S.d.reviewed+S.d.newDone,left=c.due+newLeft;
  document.getElementById("topline").innerHTML=`<span class="mst" title="Mastery of the included chapters"><b>${pct(mastery())}</b></span><span class="tl2">`+(left?`${ic("stack","s")}${left} left`:`${ic("check","s")}${done} done`)+"</span>";
  document.getElementById("prog").style.width=(done+left?100*done/(done+left):0)+"%";}
const deckTag=d=>`${d.lab} · ${d.range}`;
// ---------- study ----------
function rStudy(){
  if(phase!=="shown"||!cur){cur=Q.shift()||null;phase="ask";hinted=false;pending=null;aiV=null;typed="";}
  if(!cur){
    const c=counts(),none=!CARDS.some(inDecks);
    V.innerHTML=`<div class="done"><div class="ring">${ic("check")}</div>
      ${none?`<p class="muted">No chapters included.</p><button class="btn" id="tochs">${ic("book","s")} Chapters</button>`
        :c.n?`<p class="muted">Done for today: ${S.d.reviewed} reviews, ${S.d.newDone} new.</p><button class="btn" id="more">${ic("plus","s")} 10 new cards</button>`
        :`<p class="muted">Every included card has been studied. Reviews come back when they are due.</p>`}</div>`;
    const m=document.getElementById("more");if(m)m.onclick=()=>{S.s.npd=S.d.newDone+10;save();buildQueue();render();};
    const t=document.getElementById("tochs");if(t)t.onclick=()=>go("chapters");
    return;}
  const p=st(cur.id),d=DK[cur.deck];
  V.innerHTML=`<section class="study mdr">
    <div class="chiprow"><span class="badge">${esc(deckTag(d))}</span>${p?meter(p.l):`<span class="badge new">${ic("spark","s")}new</span>`}</div>
    <h1 class="prompt">${esc(cur.q)}</h1>
    <textarea class="ta" id="ans" rows="3" autocomplete="off" spellcheck="true" placeholder="${AI.key?"Type your answer. Haiku checks it.":"Type your answer, or just think it."}" aria-label="Your answer"></textarea>
    <div class="hint" id="hint"></div>
    <div class="fb" id="fb" aria-live="polite"></div>
    <div class="actrow" id="acts"><button class="ibtn" id="skip" aria-label="Show answer">${ic("eye")}</button><button class="btn primary" id="go" aria-label="Check">${ic("check")}</button><button class="ibtn" id="hintb" aria-label="Hint">${ic("bulb")}</button></div>
    <div class="kbd muted">Enter checks · Shift+Enter new line</div>
  </section>`;
  const ans=document.getElementById("ans");
  if(matchMedia("(pointer:fine)").matches)ans.focus({preventScroll:true});
  ans.addEventListener("keydown",e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();check(false);}});
  ans.addEventListener("input",()=>{ans.style.height="auto";ans.style.height=Math.min(320,ans.scrollHeight+2)+"px";});
  document.getElementById("go").onclick=()=>check(false);
  document.getElementById("skip").onclick=()=>check(true);
  document.getElementById("hintb").onclick=e=>{hinted=true;e.currentTarget.classList.add("on");
    const w=cur.a.split(/\s+/),h=w.slice(0,Math.min(6,Math.ceil(w.length/6))).join(" ");
    document.getElementById("hint").innerHTML=`${ic("key","s")}<span><b>${esc(cur.ref)}</b> · ${esc(h)} …</span>`;};}
function check(reveal){
  if(phase!=="ask")return;
  const ans=document.getElementById("ans");typed=ans.value.trim();ans.readOnly=true;
  if(!reveal&&typed&&AI.key){
    phase="ai";const fb=document.getElementById("fb");fb.className="fb show";fb.innerHTML=`<div class="aitip wait">${ic("spark","s")}<i></i><i></i><i></i></div>`;
    document.getElementById("acts").innerHTML=`<span class="ibtn ghost"></span><span class="btn primary dis">${ic("arrow")}</span><span class="ibtn ghost"></span>`;
    const c=cur;aiJudge(c,typed).then(v=>{if(phase!=="ai"||cur!==c)return;aiV=v;show();});return;}
  show();}
function show(){
  phase="shown";const v=aiV&&!aiV.err?aiV:null,r=v?RES[v.v]:null;pending=r;
  const ans=document.getElementById("ans");if(r)ans.classList.add(r==="bad"?"bad":"ok");
  const fb=document.getElementById("fb");fb.className="fb show"+(r?" "+r:"");
  fb.innerHTML=(r?`<div class="vrow"><div class="verdict">${ic(r==="ok"?"check":r==="near"?"approx":"x")}</div><span>${{ok:"Right",near:"Partly right",bad:"Not right"}[r]}</span></div>`:"")+
    (v&&v.tip?`<div class="aitip left">${ic("spark","s")}<span>${esc(v.tip)}</span></div>`:"")+
    (aiV&&aiV.err?`<div class="aitip left err">${ic("x","s")}<span>${esc(aiV.err)} Grade yourself.</span></div>`:"")+
    `<div class="ansfull">${esc(cur.a)}</div><div class="ref">${ic("book","s")}${esc(cur.ref)}</div>`;
  const g=[["bad","x","Didn't know"],["near","approx","Partly"],["ok","check","Knew it"]];
  document.getElementById("acts").outerHTML=`<div class="grades" id="grd">${g.map(([k,i,t])=>`<button data-r="${k}" class="g-${k}${r===k?" sug":""}" aria-label="${t}">${ic(i)}<span>${t}</span></button>`).join("")}</div>`;
  const kb=document.querySelector(".kbd");if(kb)kb.textContent=r?"Enter accepts Haiku's verdict · 1 2 3 to override":"Grade yourself · 1 2 3";
  document.getElementById("grd").onclick=e=>{const b=e.target.closest("button");if(!b)return;pending=b.dataset.r;next();};
  const sg=document.querySelector(".grades .sug");if(sg)sg.focus({preventScroll:true});else if(document.activeElement)document.activeElement.blur();
  fb.scrollIntoView({block:"nearest",behavior:"smooth"});}
function next(silent){if(!cur||!pending)return;schedule(cur,pending);cur=null;phase="ask";pending=null;aiV=null;if(!silent)render();}
document.addEventListener("keydown",e=>{
  if(view!=="study"||phase!=="shown"||e.target.tagName==="INPUT")return;
  const k={"1":"bad","2":"near","3":"ok"}[e.key];
  if(k){e.preventDefault();pending=k;next();}
  else if(e.key==="Enter"&&pending&&document.activeElement?.closest?.(".grades")==null){e.preventDefault();next();}});
