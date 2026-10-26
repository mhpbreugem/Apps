// ===================== speech sprint (pronunciation, runs on the phone) =====================
// Audio -> IPA with an open phoneme model (Transformers.js, downloaded once from Hugging Face
// and cached by the browser), compared with the expected sounds from the language pack.
// Swap the model here; any wav2vec2 CTC phoneme model with a Transformers.js ONNX export works.
const ASR={
  MODEL:"onnx-community/wav2vec2-lv-60-espeak-cv-ft-ONNX",
  BASE:"facebook/wav2vec2-lv-60-espeak-cv-ft", // original repo, used for the phoneme list if the ONNX copy lacks it
  HOST:"https://huggingface.co/",
  LIB:"https://cdn.jsdelivr.net/npm/@huggingface/transformers@4.3.1/dist/transformers.min.js",
  // model file -> Transformers.js dtype, in order of preference (smallest that works well first)
  FILES:[["model_quantized.onnx","q8"],["model_int8.onnx","int8"],["model_uint8.onnx","uint8"],["model_fp16.onnx","fp16"],["model.onnx","fp32"],["model_q4.onnx","q4"]],
  T:null,model:null,vocab:null,loading:null,state:"none",pct:0,err:"",subs:new Set()};
const ASRK="kashi-asr";
const lsGet=k=>{try{return localStorage.getItem(k);}catch(e){return null;}};
const lsSet=(k,v)=>{try{localStorage.setItem(k,v);}catch(e){}};
const asrCached=()=>lsGet(ASRK)===ASR.MODEL;
function asrEmit(){ASR.subs.forEach(f=>{try{f();}catch(e){}});}
// which model files exist (asks the Hugging Face API; null when offline)
async function asrListOnnx(){
  try{const r=await fetch(`${ASR.HOST}api/models/${ASR.MODEL}/tree/main/onnx`,{cache:"no-store"});if(!r.ok)return null;
    const l=await r.json();return new Set(l.map(x=>String(x.path||"").split("/").pop()));}catch(e){return null;}}
// phoneme list: id -> IPA symbol (tiny, kept in localStorage for offline use)
async function asrVocab(){
  const saved=lsGet(ASRK+"-vocab");if(saved){try{return JSON.parse(saved);}catch(e){}}
  for(const repo of [ASR.MODEL,ASR.BASE]){
    try{const r=await fetch(`${ASR.HOST}${repo}/resolve/main/vocab.json`);if(!r.ok)continue;
      const v=await r.json(),map=v[Object.keys(v)[0]]&&typeof v[Object.keys(v)[0]]==="object"?v[Object.keys(v)[0]]:v; // some vocab files are nested by language
      const ids=[];for(const k in map)ids[map[k]]=k;lsSet(ASRK+"-vocab",JSON.stringify(ids));return ids;}catch(e){}}
  throw new Error("Could not load the phoneme list (vocab.json)");}
function asrLoad(){
  if(ASR.model)return Promise.resolve(ASR.model);
  if(ASR.loading)return ASR.loading;
  ASR.state="loading";ASR.pct=0;ASR.err="";asrEmit();
  try{if(navigator.storage&&navigator.storage.persist)navigator.storage.persist();}catch(e){}
  const files={};
  const prog=p=>{if(!p||!p.file)return;
    if(p.status==="progress"&&p.total){files[p.file]=[p.loaded,p.total];}
    else if(p.status==="done"&&files[p.file]){files[p.file][0]=files[p.file][1];}
    let a=0,b=0;for(const k in files){a+=files[k][0];b+=files[k][1];}
    const v=b?Math.min(99,Math.floor(100*a/b)):0;if(v!==ASR.pct){ASR.pct=v;asrEmit();}};
  ASR.loading=(async()=>{
    const T=ASR.T||(ASR.T=await import(ASR.LIB));
    T.env.allowLocalModels=false;T.env.useBrowserCache=true;
    ASR.vocab=await asrVocab();
    const have=await asrListOnnx(),prev=lsGet(ASRK+"-dtype");
    let order=ASR.FILES.filter(([f])=>!have||have.has(f)).map(x=>x[1]);
    if(have&&!order.length)throw new Error(`No ONNX model file found in ${ASR.MODEL}/onnx (found: ${[...have].join(", ")||"nothing"})`);
    if(prev&&order.includes(prev))order=[prev,...order.filter(x=>x!==prev)];
    let last=null;
    for(const dtype of order){
      try{ASR.model=await T.AutoModelForCTC.from_pretrained(ASR.MODEL,{dtype,device:"wasm",progress_callback:prog});lsSet(ASRK+"-dtype",dtype);break;}
      catch(e){last=e;if(!/40[34]|not found|Could not locate|Unsupported/i.test(String(e&&e.message||e)))break;}}
    if(!ASR.model)throw last||new Error("model failed to load");
    lsSet(ASRK,ASR.MODEL);
    ASR.state="ready";ASR.pct=100;asrEmit();return ASR.model;
  })().catch(e=>{ASR.state="error";ASR.err=String(e&&e.message||e).slice(0,240);ASR.loading=null;asrEmit();throw e;});
  return ASR.loading;}
// 16 kHz mono samples -> IPA string (greedy CTC decoding, done here so no tokenizer file is needed)
async function asrRun(pcm){
  const model=await asrLoad(),T=ASR.T,n=pcm.length;
  let m=0;for(let i=0;i<n;i++)m+=pcm[i];m/=n;let v=0;for(let i=0;i<n;i++)v+=(pcm[i]-m)**2;const sd=Math.sqrt(v/n+1e-7);
  const x=new Float32Array(n);for(let i=0;i<n;i++)x[i]=(pcm[i]-m)/sd;
  const out=await model({input_values:new T.Tensor("float32",x,[1,n]),attention_mask:new T.Tensor("int64",new BigInt64Array(n).fill(1n),[1,n])});
  const lg=out.logits,[,F,K]=lg.dims,d=lg.data,V=ASR.vocab,skip=new Set(["<pad>","<s>","</s>","<unk>","|"]);
  const toks=[];let prev=-1;
  for(let f=0;f<F;f++){let best=0,bv=-Infinity,o=f*K;for(let k=0;k<K;k++)if(d[o+k]>bv){bv=d[o+k];best=k;}
    if(best!==prev){const t=V[best];if(t&&!skip.has(t))toks.push(t);}prev=best;}
  return toks.join(" ");}
// fetch the model quietly on the first visit over wifi, so it's ready when the speech sprint opens
function asrPrefetch(){
  if(asrCached()||ASR.loading)return;
  const c=navigator.connection;if(!c||c.saveData||!/wifi|ethernet/.test(c.type||""))return;
  setTimeout(()=>{if(!ASR.loading&&!(SP&&SP.state!=="done"))asrLoad().catch(()=>{});},4000);}
// ---------- recording ----------
const MIC={stream:null,rec:null,chunks:[],t0:0,cap:null};
async function micOpen(){if(MIC.stream&&MIC.stream.active)return MIC.stream;
  MIC.stream=await navigator.mediaDevices.getUserMedia({audio:{channelCount:1,echoCancellation:true,noiseSuppression:true}});return MIC.stream;}
function micClose(){try{if(MIC.rec&&MIC.rec.state!=="inactive")MIC.rec.stop();}catch(e){}
  if(MIC.stream)MIC.stream.getTracks().forEach(t=>t.stop());MIC.stream=null;MIC.rec=null;clearTimeout(MIC.cap);}
function micStart(maxMs,onAuto){
  MIC.chunks=[];const r=new MediaRecorder(MIC.stream);MIC.rec=r;
  r.ondataavailable=e=>{if(e.data&&e.data.size)MIC.chunks.push(e.data);};
  r.start();MIC.t0=performance.now();clearTimeout(MIC.cap);MIC.cap=setTimeout(onAuto,maxMs);}
function micStop(){return new Promise(res=>{const r=MIC.rec;clearTimeout(MIC.cap);
  if(!r||r.state==="inactive")return res(null);
  r.onstop=()=>res(new Blob(MIC.chunks,{type:r.mimeType||"audio/webm"}));r.stop();});}
// any recorded blob -> mono Float32Array at 16 kHz
async function to16k(blob){
  const buf=await blob.arrayBuffer(),AC=window.AudioContext||window.webkitAudioContext,ac=new AC();
  let au;try{au=await ac.decodeAudioData(buf);}finally{try{ac.close();}catch(e){}}
  const len=Math.max(1,Math.ceil(au.duration*16000)),off=new OfflineAudioContext(1,len,16000);
  const src=off.createBufferSource();src.buffer=au;src.connect(off.destination);src.start();
  const out=await off.startRendering();return out.getChannelData(0);}
// ---------- comparing sounds ----------
function alignPh(e,h){
  const m=e.length,n=h.length,D=[];
  for(let i=0;i<=m;i++){D[i]=[i];for(let j=1;j<=n;j++)D[i][j]=i?0:j;}
  for(let i=1;i<=m;i++)for(let j=1;j<=n;j++)D[i][j]=Math.min(D[i-1][j]+1,D[i][j-1]+1,D[i-1][j-1]+(e[i-1]===h[j-1]?0:1));
  const ops=[];let i=m,j=n;
  while(i||j){
    if(i&&j&&D[i][j]===D[i-1][j-1]+(e[i-1]===h[j-1]?0:1)){ops.push({op:e[i-1]===h[j-1]?"ok":"sub",e:e[i-1],h:h[j-1]});i--;j--;}
    else if(i&&D[i][j]===D[i-1][j]+1){ops.push({op:"del",e:e[i-1]});i--;}
    else{ops.push({op:"ins",h:h[j-1]});j--;}}
  ops.reverse();
  return{ops,dist:D[m][n],score:m?Math.max(0,1-D[m][n]/m):0};}
function speechTips(ops,max){const SPc=PK.speech,seen=new Set(),out=[];
  for(const o of ops){if(o.op==="ok")continue;const t=SPc.tipFor(o);if(!t||seen.has(t[0]))continue;seen.add(t[0]);out.push(t);if(out.length>=(max||3))break;}
  return out;}
const vGrade=s=>s>=.8?"ok":s>=.55?"near":"bad";
// ---------- online feedback (only the sound comparison is sent, never audio) ----------
async function aiSpeech(it,res){
  if(!AI.key||!navigator.onLine)return null;
  const SPc=PK.speech,sh=a=>a.map(SPc.show).join(" ");
  const miss=res.ops.filter(o=>o.op!=="ok").map(o=>o.op==="sub"?`said ${SPc.show(o.h)} instead of ${SPc.show(o.e)}`:o.op==="del"?`dropped ${SPc.show(o.e)}`:`added ${SPc.show(o.h)}`).join("; ");
  const prompt=`You coach ${LNAME()} pronunciation for an English/Dutch speaker. A phoneme recognizer compared their speech with the target.
Target: ${it.fa} (${it.tr})
Expected sounds: ${sh(res.exp)}
Recognized sounds: ${sh(res.got)}
Differences: ${miss||"none"}
The recognizer is imperfect, so focus on the clearest problem. Reply with ONLY compact JSON: {"tip":"<max 22 words in English: what to fix and how to place the mouth>"}`;
  const ctl=new AbortController(),to=setTimeout(()=>ctl.abort(),8000);
  try{const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",signal:ctl.signal,
      headers:{"content-type":"application/json","x-api-key":AI.key,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},
      body:JSON.stringify({model:AI.model,max_tokens:120,messages:[{role:"user",content:prompt}]})});
    if(!r.ok)return null;const j=await r.json(),t=(j.content&&j.content[0]&&j.content[0].text)||"";
    const m=t.match(/\{[\s\S]*\}/);if(!m)return null;const o=JSON.parse(m[0]);return o.tip?{tip:String(o.tip).slice(0,180)}:null;}
  catch(e){return null;}finally{clearTimeout(to);}}
// ---------- the round ----------
let VS=null;
const VREC_MS=12000;
const vRecOf=()=>((P.sp.vrecs||(P.sp.vrecs={}))[S.s.sprintMin||2])||0;
function vPool(){
  const SPc=PK.speech;if(!SPc)return[];
  const ok=c=>c.tr&&SPc.phones(c.tr).length>=3;
  const phr=CARDS.filter(c=>c.deck==="Phrases"&&ok(c));
  const known=CARDS.filter(c=>c.deck!=="Phrases"&&c.deck!=="Grammar"&&ok(c)&&(P.p[c.id]||P.decks.includes(c.deck)));
  known.sort((a,b)=>((P.p[b.id]||{}).l||0)-((P.p[a.id]||{}).l||0));
  const k=shuffle(known.slice(0,400)).slice(0,60),p=shuffle(phr.slice()).slice(0,60),out=[];
  while(k.length||p.length){if(p.length)out.push(p.shift());if(k.length)out.push(k.shift());}
  return out;}
function startVoice(){
  if(!PK.speech||!navigator.mediaDevices||!window.MediaRecorder){vMsg(ic("x")+tx("This browser can't record audio here"));return;}
  if(!ASR.model){vLoadScreen();return;}
  VS={state:"idle",left:SPRINT_SEC()*1000,t0:performance.now(),pool:vPool(),i:-1,n:0,ok:0,sum:0,best:0,tips:{},cur:null,res:null,last:false};
  V.innerHTML=`<div class="sptop"><div class="race">
    <div class="clockring" id="cring"><svg viewBox="0 0 44 44"><circle cx="22" cy="22" r="19" class="rbg"/><circle cx="22" cy="22" r="19" class="rfg" id="rfg"/></svg><b id="tclock"></b></div>
    <div class="combo" id="tcombo"></div>
    <div class="score"><b id="tscore">0</b><span>${ic("trophy","s")}<i>${vRecOf()}</i></span></div></div>
    <div class="tbar"><i id="tbar"></i></div></div>
  <section class="study sprint voice">
    <div class="prompt vs-en" id="ven"></div>
    <div class="vs-target" id="vfa"></div>
    <div class="tr ph" id="vtr"></div>
    <div class="fb" id="vfb" aria-live="polite"></div>
    <div class="actrow" id="vacts"></div>
  </section>`;
  VS.timer=setInterval(vTick,200);vNext();}
function vTick(){
  if(!VS||VS.state==="done")return;const now=performance.now();
  if(VS.state!=="proc"&&!document.hidden)VS.left-=now-VS.t0;VS.t0=now;
  if(VS.left<=0){VS.left=0;VS.last=true;}
  const t=Math.ceil(VS.left/1000),el=document.getElementById("tclock");if(el)el.textContent=VS.last?"0:00":`${Math.floor(t/60)}:${String(t%60).padStart(2,"0")}`;
  const f=VS.left/(SPRINT_SEC()*1000),b=document.getElementById("tbar");if(b)b.style.width=(100*f)+"%";
  const r=document.getElementById("rfg");if(r)r.style.strokeDashoffset=String(119.4*(1-f));
  const cr=document.getElementById("cring");if(cr)cr.classList.toggle("hurry",VS.left<=10000);
  if(VS.state==="rec"){const e=document.getElementById("vlen");if(e)e.textContent=((performance.now()-MIC.t0)/1000).toFixed(1)+"s";}
  if(VS.last&&VS.state==="idle")vFinish();}
function vTally(){if(!VS||!VS.res)return;const s=VS.res.score;VS.n++;VS.sum+=s;if(vGrade(s)!=="bad")VS.ok++;
  for(const[k,t]of VS.res.tips){const x=VS.tips[k]||(VS.tips[k]={n:0,t});x.n++;}VS.res=null;}
function vNext(){
  vTally();if(VS.last)return vFinish();
  VS.i++;if(VS.i>=VS.pool.length){VS.pool=VS.pool.concat(vPool());}
  const c=VS.pool[VS.i];if(!c)return vFinish();
  VS.cur={id:c.id,en:enOf(c),fa:c.fa[0],tr:c.tr.split(" / ")[0]};VS.state="idle";
  document.getElementById("ven").textContent=VS.cur.en;
  document.getElementById("vfa").textContent=VS.cur.fa;
  document.getElementById("vtr").textContent=VS.cur.tr;
  const fb=document.getElementById("vfb");fb.className="fb";fb.innerHTML="";
  vActs("idle");document.getElementById("tscore").textContent=VS.ok;}
function vActs(st){const a=document.getElementById("vacts");if(!a)return;
  if(st==="idle")a.innerHTML=`<button class="ibtn" id="vskip" aria-label="Skip">${ic("skip")}</button><button class="btn primary vmic" id="vrec" aria-label="Speak">${ic("mic")}</button><button class="ibtn" id="vstop" aria-label="End round">${ic("stop")}</button>`;
  else if(st==="rec")a.innerHTML=`<span class="ibtn ghost"></span><button class="btn primary vmic on" id="vrec" aria-label="Done">${ic("stop")}<span class="vlen" id="vlen">0.0s</span></button><span class="ibtn ghost"></span>`;
  else if(st==="proc")a.innerHTML=`<span class="ibtn ghost"></span><span class="btn primary dis">${ic("hour")}</span><span class="ibtn ghost"></span>`;
  else a.innerHTML=`<button class="ibtn" id="vagain" aria-label="Try again">${ic("repeat")}</button><button class="btn primary" id="vnext" aria-label="Next">${ic("arrow")}</button><button class="ibtn" id="vstop" aria-label="End round">${ic("stop")}</button>`;
  const on=(id,f)=>{const b=document.getElementById(id);if(b)b.onclick=f;};
  on("vrec",()=>VS.state==="rec"?vStopRec():vStartRec());
  on("vskip",()=>{VS.res=null;vNext();});
  on("vstop",()=>{VS.last=true;vTally();vFinish();});
  on("vnext",vNext);
  on("vagain",()=>{VS.res=null;VS.state="idle";const fb=document.getElementById("vfb");fb.className="fb";fb.innerHTML="";vActs("idle");vStartRec();});}
async function vStartRec(){
  try{await micOpen();}catch(e){vErr(tx("Microphone blocked. Allow it in the browser's site settings."));return;}
  if(!VS||VS.state!=="idle")return;
  VS.state="rec";micStart(VREC_MS,()=>{if(VS&&VS.state==="rec")vStopRec();});vActs("rec");}
async function vStopRec(){
  if(!VS||VS.state!=="rec")return;VS.state="proc";vActs("proc");
  const fb=document.getElementById("vfb");fb.className="fb show";fb.innerHTML=aiWait();
  const my=VS.cur;
  try{
    const blob=await micStop();if(!blob||blob.size<200)throw new Error("empty");
    const pcm=await to16k(blob);if(pcm.length<16000*0.3)throw new Error("short");
    const ipa=await asrRun(pcm);
    if(!VS||VS.cur!==my)return;
    const SPc=PK.speech,exp=SPc.phones(my.tr),got=SPc.heard(ipa),al=alignPh(exp,got);
    VS.res={...al,exp,got,ipa,tips:speechTips(al.ops,3)};VS.state="shown";vShow();}
  catch(e){if(!VS||VS.cur!==my)return;VS.state="idle";vErr(tx(/short|empty/.test(String(e&&e.message))?"Too short. Hold the button, speak, then tap again.":"Couldn't analyse that. Try again."));vActs("idle");}}
function vErr(h){const fb=document.getElementById("vfb");if(fb){fb.className="fb show bad";fb.innerHTML=`<div class="aitip">${ic("x","s")}<span>${h}</span></div>`;}}
function phChips(ops){const SPc=PK.speech;
  return`<div class="phs" dir="ltr">${ops.map(o=>o.op==="ok"?`<span class="ph ok">${esc(SPc.show(o.e))}</span>`
    :o.op==="sub"?`<span class="ph sub">${esc(SPc.show(o.e))}<i>${esc(SPc.show(o.h))}</i></span>`
    :o.op==="del"?`<span class="ph del">${esc(SPc.show(o.e))}<i>–</i></span>`
    :`<span class="ph ins">+${esc(SPc.show(o.h))}</span>`).join("")}</div>`;}
function vShow(){
  const r=VS.res,g=vGrade(r.score),pct=Math.round(100*r.score);
  const fb=document.getElementById("vfb");fb.className="fb show "+g;
  fb.innerHTML=`<div class="verdict">${ic(g==="ok"?"check":g==="near"?"approx":"x")}</div>
    <div class="vpct">${pct}%</div>${phChips(r.ops)}
    <div class="ipa" dir="ltr">${ic("ear","s")}<span>${esc(r.ipa||"–")}</span></div>
    ${r.tips.map(([,t])=>`<div class="aitip vtip">${ic("bulb","s")}<span>${esc(t)}</span></div>`).join("")}
    <div id="vai"></div>`;
  vActs("shown");
  document.getElementById("tscore").textContent=VS.ok+(g!=="bad"?1:0);
  if(r.dist&&AI.key&&navigator.onLine){const my=VS.cur,box=document.getElementById("vai");box.innerHTML=aiWait();
    aiSpeech(my,r).then(v=>{const b=document.getElementById("vai");if(!b||!VS||VS.cur!==my)return;b.innerHTML=tipHTML(v);});}}
function vFinish(){
  if(!VS||VS.state==="done")return;
  clearInterval(VS.timer);micClose();
  const full=VS.left<=0;VS.state="done";VS.prevRec=vRecOf();
  if(full&&VS.ok>VS.prevRec)P.sp.vrecs[S.s.sprintMin||2]=VS.ok;save();
  if(view==="sprint")vSummary();}
function vSummary(){
  const avg=VS.n?Math.round(100*VS.sum/VS.n):0,rec=VS.ok>VS.prevRec&&VS.left<=0;
  const top=Object.values(VS.tips).sort((a,b)=>b.n-a.n).slice(0,3);
  V.innerHTML=`<div class="hero"><div class="clock" style="color:${rec?"var(--mid)":"var(--ok)"}">${ic(rec?"trophy":"mic")}</div><div class="min">${VS.ok}</div>
      <div class="muted" style="display:flex;justify-content:center;gap:6px;align-items:center">${ic("trophy","s")}${Math.max(VS.prevRec,vRecOf())}${rec?` <span class="badge new">${ic("spark","s")}</span>`:""}</div></div>
    <div class="kpis">
      <div class="kpi" style="--c:var(--ok)">${ic("ear")}<b>${avg}%</b>${tx("Sound match")}</div>
      <div class="kpi" style="--c:var(--mid)">${ic("mic")}<b>${VS.n}</b>${tx("Phrases spoken")}</div>
      <div class="kpi" style="--c:var(--ink)">${ic("check")}<b>${VS.ok}</b>${tx("Good (80%+)")}</div></div>
    ${top.length?`<div class="eyebrow">${ic("bulb","s")}Sounds to practise</div><div class="group">${top.map(x=>`<div class="row"><span>${esc(x.t)}</span><span class="num">${x.n}×</span></div>`).join("")}</div>`:""}
    <div class="acts"><button class="btn primary" id="vagain2" aria-label="Again">${ic("repeat")}</button><div class="icons"><button class="ibtn" id="vclose" aria-label="Close">${ic("close")}</button></div></div>`;
  document.getElementById("vagain2").onclick=startVoice;
  document.getElementById("vclose").onclick=()=>{VS=null;render();};lockState();}
function stopVoice(){if(VS&&VS.state!=="done"){clearInterval(VS.timer);micClose();}VS=null;if(vLoadSub){ASR.subs.delete(vLoadSub);vLoadSub=null;}}
// ---------- first download ----------
function vMsg(h){V.innerHTML=`<div class="hero"><div class="clock">${ic("mic")}</div></div><div class="aitip">${h}</div>
  <div class="acts"><button class="btn" id="vback" aria-label="Back">${ic("close")}</button></div>`;document.getElementById("vback").onclick=()=>{VS=null;render();};}
let vLoadSub=null;
function vLoadScreen(){
  const draw=()=>{if(view!=="sprint"||VS)return;
    if(ASR.state==="ready"){stopVoice();startVoice();return;}
    V.innerHTML=`<div class="hero"><div class="clock">${ic(ASR.state==="error"?"x":"download")}</div><div class="min">${ASR.state==="error"?"–":ASR.pct+"%"}</div></div>
      <div class="vload"><div class="bar"><i style="width:${ASR.pct}%;background:var(--ok)"></i></div>
      ${tx(ASR.state==="error"?"Download failed. Check the connection and try again.":asrCached()?"Loading the speech model from this phone…":"Downloading the speech model once (about 350 MB). Wifi recommended. Everything else in the app keeps working.")}
      ${ASR.state==="error"?`<div class="muted" style="font-size:12px;margin-top:6px">${esc(ASR.err)}</div>`:""}</div>
      <div class="acts">${ASR.state==="error"?`<button class="btn primary" id="vretry" aria-label="Retry">${ic("repeat")}</button>`:""}<div class="icons"><button class="ibtn" id="vback" aria-label="Back">${ic("close")}</button></div></div>`;
    const b=document.getElementById("vback");if(b)b.onclick=()=>{stopVoice();render();};
    const rt=document.getElementById("vretry");if(rt)rt.onclick=()=>{asrLoad().catch(()=>{});draw();};};
  if(vLoadSub)ASR.subs.delete(vLoadSub);vLoadSub=draw;ASR.subs.add(draw);
  asrLoad().catch(()=>{});draw();}
// ---------- settings row ----------
function speechRowHTML(){if(!PK||!PK.speech)return"";
  return`<div class="row"><span class="lab">${ic("mic")}${tx("Speech model (offline pronunciation check)")}</span><div class="ghbox" id="asrbox">${asrBoxHTML()}</div></div>`;}
function asrBoxHTML(){
  if(ASR.state==="ready"||(asrCached()&&ASR.state==="none"))return`<span style="color:var(--ok)">${ic("check","s")}</span>`;
  if(ASR.state==="loading")return`<span class="muted num">${ASR.pct}%</span>`;
  return`${ASR.state==="error"?`<span style="color:var(--bad)">${ic("x","s")}</span>`:""}<button class="ibtn sm" id="asrdl" aria-label="Download speech model">${ic("download","s")}</button>`;}
function speechRowBind(){
  const upd=()=>{const b=document.getElementById("asrbox");if(!b){ASR.subs.delete(upd);return;}b.innerHTML=asrBoxHTML();const d=document.getElementById("asrdl");if(d)d.onclick=()=>asrLoad().catch(()=>{});};
  ASR.subs.add(upd);upd();}
// ---------- offline shell ----------
function registerSW(){try{if("serviceWorker"in navigator&&location.protocol==="https:"&&!window.claude)navigator.serviceWorker.register("sw.js").catch(()=>{});}catch(e){}}
