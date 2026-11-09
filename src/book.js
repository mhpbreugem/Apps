// ===================== book page scanner =====================
// Photo of a page -> Haiku (vision) lists the words in dictionary form with English meanings ->
// the app shows how much of the page you already know and queues the rest (new words first in Study and Sprint).
const BK={open:false,busy:false,res:null,thumb:null,err:"",sel:{}};
function bkImg(file){return new Promise((res,rej)=>{const u=URL.createObjectURL(file),im=new Image();
  im.onload=()=>{const m=1568,k=Math.min(1,m/Math.max(im.width,im.height)),c=document.createElement("canvas");c.width=Math.max(1,Math.round(im.width*k));c.height=Math.max(1,Math.round(im.height*k));
    const x=c.getContext("2d");x.fillStyle="#fff";x.fillRect(0,0,c.width,c.height);x.drawImage(im,0,0,c.width,c.height);URL.revokeObjectURL(u);
    const d=c.toDataURL("image/jpeg",.85);res({b64:d.split(",")[1],url:d});};
  im.onerror=()=>{URL.revokeObjectURL(u);rej(new Error("decode"));};im.src=u;});}
async function bkAsk(b64){
  const prompt=`This is a photo of a page of text in ${LNAME()}. List every distinct word a learner would need in order to read it. Skip proper names, numbers, punctuation and words in other scripts. Give each word in its dictionary form (nouns singular; verbs as the infinitive), written in the native script, with a short English meaning (1-3 words) and "f" = how many times it appears on the page (estimate). Order by first appearance, at most 90 words. If the photo is unreadable or has no ${LNAME()} text, return an empty list and put the reason in "note" (max 12 words). Reply with ONLY compact JSON: {"words":[{"w":"...","en":"...","f":1}],"note":""}`;
  const ctl=new AbortController(),to=setTimeout(()=>ctl.abort(),60000);
  try{const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",signal:ctl.signal,
    headers:{"content-type":"application/json","x-api-key":AI.key,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},
    body:JSON.stringify({model:AI.model,max_tokens:3500,messages:[{role:"user",content:[{type:"image",source:{type:"base64",media_type:"image/jpeg",data:b64}},{type:"text",text:prompt}]}]})});
    if(!r.ok)return{err:r.status===401?"Key rejected. Check it in Settings.":r.status===429?"Rate or spend limit reached.":"Error "+r.status};
    const j=await r.json();aiUse(j.usage);const t=(j.content&&j.content[0]&&j.content[0].text)||"";
    const m=t.match(/\{[\s\S]*\}/);if(!m)return{err:"Couldn't read the answer. Try a sharper photo."};
    let o;try{o=JSON.parse(m[0]);}catch(e){return{err:"The page was too long. Try a smaller part of it."};}
    return{words:(o.words||[]).filter(x=>x&&x.w&&x.en),note:String(o.note||"")};}
  catch(e){return{err:e.name==="AbortError"?"Timed out. Try again.":"Network error."};}
  finally{clearTimeout(to);}}
// classify each word: known (learned in the app), app (in the app, not learned yet), new (not in the app)
function bkClassify(words){
  const idx=new Map(),ix=c=>c.fa.forEach(f=>{[norm(f),loose(f)].forEach(k=>{if(k&&!idx.has(k))idx.set(k,c);});});
  CARDS.filter(c=>LEVELS.includes(c.deck)||c.deck==="Book").forEach(ix);
  const seen=new Set(),out=[];
  words.forEach(x=>{const w=String(x.w).trim();if(!w||w.length>30)return;const k=norm(w);if(!k||seen.has(k))return;seen.add(k);
    const c=idx.get(k)||idx.get(loose(w)),p=c&&st(c.id),f=Math.max(1,Math.round(+x.f||1));
    out.push({w,en:String(x.en).slice(0,60),f,c,g:c?(p&&p.l>=3?"known":"app"):"new"});});
  return out;}
function bkStats(list){const t=a=>a.reduce((s,x)=>s+x.f,0),k=list.filter(x=>x.g==="known");
  return{n:list.length,known:k.length,app:list.filter(x=>x.g==="app").length,nw:list.filter(x=>x.g==="new").length,cov:t(list)?t(k)/t(list):0};}
async function bkScan(file){
  BK.open=true;BK.busy=true;BK.err="";BK.res=null;BK.thumb=null;render();
  let img;try{img=await bkImg(file);}catch(e){BK.busy=false;BK.err="Couldn't open that image.";render();return;}
  BK.thumb=img.url;render();
  const r=await bkAsk(img.b64);BK.busy=false;
  if(r.err){BK.err=r.err;render();return;}
  const list=bkClassify(r.words);BK.note=r.note;BK.res=list;BK.sel={};list.forEach((x,i)=>{if(x.g!=="known")BK.sel[i]=1;});
  if(!list.length&&!BK.err)BK.err=r.note||"No words found. Try a sharper, closer photo.";
  render();}
function bkAdd(){
  const list=BK.res||[];let a=0,b=0;
  list.forEach((x,i)=>{if(!BK.sel[i])return;
    if(x.g==="app"&&x.c){P.bb[x.c.id]=P.bb[x.c.id]||today();b++;}
    else if(x.g==="new"){const id="B:"+norm(x.w);if(!P.bk[id]&&!BYID[id]){P.bk[id]={en:x.en,fa:x.w,tr:PK.translit?PK.translit(x.w):"",at:today()};a++;}}});
  refreshCards();save();
  BK.open=false;BK.res=null;BK.thumb=null;toast(`${a+b} words queued: they come first in Study and Sprint.`);go("study");}
function bkRow(x,i){const on=BK.sel[i],cls=x.g==="known"?"ok":x.g==="app"?"mid":"bad";
  return`<div class="row bkrow"><button class="bkt${on?" on":""}" data-i="${i}" aria-label="${on?"Skip this word":"Learn this word"}" aria-pressed="${!!on}">${ic(on?"check":"plus","s")}</button>
    <div class="bkw"><div class="e">${esc(x.en)}</div><div class="s"><span class="dot ${cls}"></span>${x.g==="known"?"known":x.g==="app"?"in the app":"new"}${x.f>1?` · ×${x.f}`:""}</div></div>
    <span class="f" data-say="${esc(x.w)}">${esc(x.w)}</span></div>`;}
function bkRender(){
  const back=`<button class="ibtn sm" id="bkback" aria-label="Back">${ic("arrow","s")}</button>`;
  if(BK.busy||(!BK.res&&!BK.err)){
    V.innerHTML=`<div class="bkhead">${back}<span>${ic("camera","s")}Reading the page…</span></div>${BK.thumb?`<img class="bkimg" src="${BK.thumb}" alt="">`:""}<div class="aitip wait" style="margin-top:24px">${ic("spark","s")}<i></i><i></i><i></i></div>`;
  }else if(BK.err){
    V.innerHTML=`<div class="bkhead">${back}<span>${ic("camera","s")}Scan</span></div>${BK.thumb?`<img class="bkimg" src="${BK.thumb}" alt="">`:""}<div class="note" style="justify-content:center;margin:18px 8px">${ic("x","s")}<span>${esc(BK.err)}</span></div><div class="acts"><button class="btn primary" id="bkretry" aria-label="Try another photo">${ic("camera")}</button></div>`;
  }else{
    const L=BK.res,s=bkStats(L),nsel=Object.keys(BK.sel).filter(i=>BK.sel[i]).length;
    const sec=(g,ic_,t)=>{const rows=L.map((x,i)=>[x,i]).filter(([x])=>x.g===g);return rows.length?`<div class="eyebrow">${ic(ic_,"s")}${t} · ${rows.length}</div><div class="group">${rows.map(([x,i])=>bkRow(x,i)).join("")}</div>`:"";};
    V.innerHTML=`<div class="bkhead">${back}<span>${ic("camera","s")}Page</span></div>
      <div class="bkcov"><b>${Math.round(s.cov*100)}%</b><span>of the words on this page you already know</span></div>
      <div class="bkchips"><span><i class="dot ok"></i>${s.known} known</span><span><i class="dot mid"></i>${s.app} in the app</span><span><i class="dot bad"></i>${s.nw} new</span></div>
      ${sec("new","spark","Not in the app yet")}${sec("app","stack","In the app, not learned yet")}${sec("known","check","Already known")}
      <div class="note">${ic("spark","s")}<span>Words and meanings are read by AI from the photo: check them. Tap a word to skip it.</span></div>
      <div class="acts" style="position:sticky;bottom:8px"><button class="btn primary" id="bkadd" ${nsel?"":"disabled"} aria-label="Learn ${nsel} words">${ic("plus")}<b style="margin-left:6px">${nsel}</b></button></div>`;}
  const g=id=>document.getElementById(id);
  if(g("bkback"))g("bkback").onclick=()=>{BK.open=false;BK.res=null;BK.thumb=null;BK.busy=false;render();};
  if(g("bkretry"))g("bkretry").onclick=()=>{BK.open=false;render();setTimeout(()=>{const f=document.getElementById("bkf");if(f)f.click();},50);};
  if(g("bkadd"))g("bkadd").onclick=bkAdd;
  V.querySelectorAll(".bkt").forEach(b=>b.onclick=()=>{const i=+b.dataset.i;BK.sel[i]=BK.sel[i]?0:1;const y=V.scrollTop,w=window.scrollY;bkRender();window.scrollTo(0,w);});}
function bkBind(){
  const go_=document.getElementById("bkgo"),f=document.getElementById("bkf");if(!go_||!f)return;
  go_.onclick=()=>{if(!AI.key){toast("Add your Anthropic key in Settings first.");return;}f.click();};
  f.onchange=()=>{const x=f.files&&f.files[0];f.value="";if(x)bkScan(x);};}
