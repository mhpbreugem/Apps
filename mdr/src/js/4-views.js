// ---------- chapters: choose what to study, see progress ----------
function calHTML(weeks){
  const td=today(),mon=td-((td+3)%7),H=S.st.hist||{};let rows="";
  for(let w=weeks-1;w>=0;w--){const start=mon-7*w;let tot=0,cells="";
    for(let i=0;i<7;i++){const d=start+i,c=(H[d]&&H[d].n)||0;tot+=c;
      cells+=`<i class="cd${d>td?" fut":""}${d===td?" now":""}" style="--a:${c?Math.min(1,.2+c/60):0}" title="${c}">${c?(c>99?"99+":c):""}</i>`;}
    const lab=new Date(start*864e5).toLocaleDateString(undefined,{day:"numeric",month:"short",timeZone:"UTC"});
    rows+=`<div class="cw"><span class="cl">${lab}</span>${cells}<b class="ct${tot?"":" z"}">${tot}</b></div>`;}
  const dn=[...Array(7)].map((_,i)=>new Date((4+i)*864e5).toLocaleDateString(undefined,{weekday:"narrow",timeZone:"UTC"}));
  return`<div class="cal"><div class="cw ch"><span class="cl"></span>${dn.map(x=>`<i>${x}</i>`).join("")}<b class="ct">${ic("cards","s")}</b></div>${rows}</div>`;}
function deckRow(d){const c=counts(d.id),on=included(d.id),w=x=>(100*x/c.total).toFixed(1)+"%";
  return`<div class="row chrow${on?"":" off"}" data-d="${d.id}"><button class="sw" aria-pressed="${on}" aria-label="Include ${esc(d.lab)}"></button>
    <div class="cht"><div class="t1">${esc(d.title)}</div>
      <div class="s"><b>${esc(d.lab)}</b>${d.annex?"":` · ${esc(d.range)}`} · ${c.total} cards${c.due?` · ${c.due} due`:""}</div>
      <div class="bar"><i style="width:${w(c.mast)};background:var(--ok)"></i><i style="width:${w(c.learn)};background:var(--mid)"></i></div></div>
    <span class="num">${pct(mastery(d.id)).replace(/\.\d+%/,"%")}</span></div>`;}
function rChapters(){
  const c=counts(),grp=(t,ann)=>{const ds=DECKS.filter(d=>d.annex===ann);
    return`<div class="eyebrow ehead">${ic(ann?"list":"book","s")}${t}<span class="chips sm"><button data-all="${ann?1:0}" aria-label="Include all">All</button><button data-none="${ann?1:0}" aria-label="Exclude all">None</button></span></div><div class="group">${ds.map(deckRow).join("")}</div>`;};
  V.innerHTML=`<div class="kpis">
      <div class="kpi" style="--c:var(--mid)">${ic("flame")}<b>${S.st.streak&&S.st.last>=today()-1?S.st.streak:0}</b>${tx("Day streak")}</div>
      <div class="kpi" style="--c:var(--ok)">${ic("trophy")}<b>${c.mast}</b>${tx("Mastered")}</div>
      <div class="kpi" style="--c:var(--ink)">${ic("stack")}<b>${c.due}</b>${tx("Due now")}</div></div>
    <div class="note">${ic("check","s")}<span>Switch chapters and annexes on or off. Only included ones are studied and counted.</span></div>
    ${grp("Chapters",false)}${grp("Annexes",true)}
    <div class="eyebrow">${ic("calendar","s")}Cards studied per week</div>${calHTML(10)}`;
  V.querySelectorAll(".chrow").forEach(r=>r.onclick=()=>{const id=r.dataset.d,cur_=DECKS.map(d=>d.id).filter(included);
    setInc(included(id)?cur_.filter(x=>x!==id):[...cur_,id]);rChapters();topline();});
  V.querySelectorAll("[data-all],[data-none]").forEach(b=>b.onclick=e=>{e.stopPropagation();const ann=(b.dataset.all||b.dataset.none)==="1",grpIds=DECKS.filter(d=>d.annex===ann).map(d=>d.id);
    const cur_=DECKS.map(d=>d.id).filter(included);setInc(b.dataset.all!=null?[...new Set([...cur_,...grpIds])]:cur_.filter(x=>!grpIds.includes(x)));rChapters();topline();});}
// ---------- all cards ----------
function rCards(){
  V.innerHTML=`<label class="search" style="margin-top:12px">${ic("search","s")}<input id="q" placeholder="Search questions and answers" aria-label="Search"></label>
    <div class="chips fl" id="flt"><button data-f="inc" aria-pressed="true">Included</button><button data-f="all" aria-pressed="false">All</button><button data-f="weak" aria-pressed="false">Often missed</button></div>
    <div class="group wl" id="list" style="margin-top:10px"></div>`;
  let f="inc";const q=document.getElementById("q"),L=document.getElementById("list");
  const draw=()=>{const s=q.value.trim().toLowerCase();
    let rows=CARDS.filter(c=>f==="all"||inDecks(c));if(f==="weak")rows=rows.filter(c=>st(c.id)&&st(c.id).w>0).sort((a,b)=>st(b.id).w-st(a.id).w);
    if(s)rows=rows.filter(c=>(c.q+" "+c.a+" "+c.ref).toLowerCase().includes(s));
    const n=rows.length;rows=rows.slice(0,150);
    L.innerHTML=rows.map(c=>{const p=st(c.id);return`<button class="row crow" data-id="${c.id}"><div><div class="e">${esc(c.q)}</div><div class="s"><span class="badge">${esc(DK[c.deck].lab)}</span><span>${esc(c.ref)}</span>${p?meter(p.l):""}</div></div></button>`;}).join("")
      +(n>150?`<div class="row muted">${n-150} more, refine the search</div>`:"")||`<div class="row muted">–</div>`;};
  q.oninput=draw;
  document.getElementById("flt").onclick=e=>{const b=e.target.closest("button");if(!b)return;f=b.dataset.f;document.querySelectorAll("#flt button").forEach(x=>x.setAttribute("aria-pressed",x===b));draw();};
  L.onclick=e=>{const b=e.target.closest(".crow");if(b)openSheet(BYID[b.dataset.id]);};
  draw();}
function openSheet(c){
  const p=st(c.id);
  SHEET.innerHTML=`<div class="sheet-in"><div class="sheet-top"><div class="en">${esc(c.q)}</div><button class="x" id="sx" aria-label="Close">${ic("close","s")}</button></div>
    <div class="sa">${esc(c.a)}</div>
    <div class="meta"><span class="badge">${esc(DK[c.deck].lab)}</span><span>${esc(c.ref)}</span>${p?meter(p.l):`${ic("spark","s")} new`}${p&&p.n?`<span>${ic("check","s")} ${p.n-(p.w||0)}/${p.n}</span>`:""}${p&&p.due>today()?`<span>${ic("calendar","s")} in ${p.due-today()} d</span>`:""}</div></div>`;
  SHEET.hidden=false;document.getElementById("sx").onclick=closeSheet;}
function closeSheet(){SHEET.hidden=true;SHEET.innerHTML="";}
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!SHEET.hidden)closeSheet();});
