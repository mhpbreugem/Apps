// ===================== tutor voice: speak to the teacher and hear it answer =====================
// Input: the browser's speech recognition when it has the language (best transcript); otherwise the
// on-device phoneme model from the speech sprint (the teacher then reads a phonetic transcript).
// Output: the browser's text-to-speech. Both are free; only the chat messages use the API.
const TV={speak:false,hands:false,lang:"t",rec:null,state:"idle",forcePh:false,mode:null,idle:0,err:false};
try{const s=JSON.parse(localStorage.getItem("kashi-tv")||"{}");TV.speak=!!s.speak;TV.hands=!!s.hands;}catch(e){}
const tvSaveS=()=>{try{localStorage.setItem("kashi-tv",JSON.stringify({speak:TV.speak,hands:TV.hands}));}catch(e){}};
const tvSR=()=>window.SpeechRecognition||window.webkitSpeechRecognition;
const tvTTS=()=>"speechSynthesis"in window&&typeof SpeechSynthesisUtterance!=="undefined";
function tvStat(h,bad){const el=document.getElementById("tstat");if(el){el.innerHTML=h||"";el.classList.toggle("bad",!!bad);}}
function tvSet(st,txt){TV.state=st;if(st!=="idle"||txt)TV.err=false;tvStat(txt?esc(txt):"");
  const m=document.getElementById("tmic");if(m){m.classList.toggle("rec",st==="listen");m.innerHTML=ic(st==="listen"?"stop":"mic");m.setAttribute("aria-label",st==="listen"?"Stop":"Speak");}}
function tvErr(msg){TV.err=true;TV.hands=false;tvSaveS();tvBtns();TV.state="idle";tvStat(esc(msg),true);const m=document.getElementById("tmic");if(m){m.classList.remove("rec");m.innerHTML=ic("mic");}}
function tvBtns(){const s=document.getElementById("tspk"),h=document.getElementById("thands"),l=document.getElementById("tlang");
  if(s)s.setAttribute("aria-pressed",TV.speak);if(h)h.setAttribute("aria-pressed",TV.hands);if(l)l.textContent=TV.lang==="e"?"EN":PK.code.toUpperCase();}
function tvVoice(lang){if(!tvTTS())return null;const vs=speechSynthesis.getVoices(),L=lang.toLowerCase().replace("_","-"),p=L.slice(0,2);
  return vs.find(v=>v.lang.toLowerCase().replace("_","-")===L)||vs.find(v=>v.lang.toLowerCase().startsWith(p))||null;}
if(tvTTS())try{speechSynthesis.getVoices();speechSynthesis.onvoiceschanged=()=>{};}catch(e){}
// iOS only lets speech start from a tap: prime it on the tap that sends or records
function tvUnlock(){if(!tvTTS())return;try{const u=new SpeechSynthesisUtterance(" ");u.volume=0;speechSynthesis.speak(u);}catch(e){}}
// speech is queued sentence by sentence while the reply is still streaming in
TV.pend=0;TV.off=0;TV.fin=false;TV.done=null;
function tvStreamStart(){try{if(tvTTS())speechSynthesis.cancel();}catch(e){}TV.pend=0;TV.off=0;TV.fin=false;TV.done=null;}
function tvCheck(){if(TV.fin&&TV.pend<=0){TV.fin=false;if(TV.state==="speak")TV.state="idle";const d=TV.done;TV.done=null;if(!TV.err&&!TV.noVoiceShown)tvStat("");d&&d();}}
function tvEnqueue(text){
  if(!tvTTS())return;
  const parts=[];String(text).replace(/\*\*/g,"").split(/(«[^»]+»)/).forEach(p=>{if(!p.trim())return;
    if(p[0]==="«")parts.push({t:p.slice(1,-1),f:true});else{const q=p.replace(/^[-•] /gm,"").replace(/[«»]/g,"").replace(/⚠/g,"").trim();if(q)parts.push({t:q,f:false});}});
  const tl=PK.speechLang||PK.code,fv=tvVoice(tl),ev=tvVoice("en-GB")||tvVoice("en-US")||tvVoice("en");
  if(parts.some(p=>p.f)&&!fv){TV.noVoiceShown=true;tvStat(`${ic("x","s")}No ${esc(LNAME())} voice on this device: English only`,true);}
  parts.filter(p=>!p.f||fv).forEach(p=>{const u=new SpeechSynthesisUtterance(p.t),v=p.f?fv:ev;
    if(v){u.voice=v;u.lang=v.lang;}else u.lang=p.f?tl:"en-US";u.rate=p.f?.85:1.05;
    TV.pend++;TV.state="speak";if(!TV.noVoiceShown)tvStat(`${ic("speaker","s")}Speaking…`);
    let d=false;const end=()=>{if(d)return;d=true;TV.pend--;tvCheck();};u.onend=end;u.onerror=end;
    try{speechSynthesis.speak(u);}catch(e){end();}});}
// feed the reply as it grows: speak each finished sentence at once (not inside «»)
function tvStreamFeed(full,final,done){
  for(;;){let end=-1,depth=0;
    for(let i=TV.off;i<full.length;i++){const c=full[i];if(c==="«")depth++;else if(c==="»")depth=Math.max(0,depth-1);
      else if(!depth&&(c==="\n"||(/[.!?؟]/.test(c)&&(i+1>=full.length?final:/\s/.test(full[i+1]))))){end=i+1;break;}}
    if(end<0)break;const chunk=full.slice(TV.off,end);TV.off=end;if(chunk.trim())tvEnqueue(chunk);}
  if(final){const rest=full.slice(TV.off);TV.off=full.length;if(rest.trim())tvEnqueue(rest);TV.fin=true;TV.done=done||null;tvCheck();}}
function tvSpeak(text,done){tvStreamStart();tvStreamFeed(text,true,done);}
function tvStopSpeak(){try{if(tvTTS())speechSynthesis.cancel();}catch(e){}TV.pend=0;TV.fin=false;TV.done=null;TV.noVoiceShown=false;if(TV.state==="speak")TV.state="idle";}
function tvListen(){
  if(TV.state==="listen"){tvStopListen();return;}
  if(TV.state==="proc"||TUT.busy||!AI.key)return;
  tvStopSpeak();tvUnlock();TV.err=false;
  const SR=tvSR();
  if(SR&&!TV.forcePh)webListen(SR,TV.lang==="e"?"en-US":(PK.speechLang||PK.code));else phListen();}
function tvStopListen(){if(TV.mode==="web"&&TV.rec){try{TV.rec.stop();}catch(e){}}else if(TV.mode==="ph")phStop();}
function webListen(SR,lang){
  TV.mode="web";const r=new SR();TV.rec=r;r.lang=lang;r.interimResults=true;r.continuous=false;r.maxAlternatives=1;
  let fin="";
  r.onstart=()=>tvSet("listen",TV.hands?"Listening… just speak":"Listening…");
  r.onresult=e=>{let it="";for(let i=e.resultIndex;i<e.results.length;i++){const x=e.results[i];if(x.isFinal)fin+=x[0].transcript+" ";else it+=x[0].transcript;}
    const t=document.getElementById("tin");if(t)t.value=(fin+it).trim();};
  r.onerror=e=>{const er=e.error;
    if(er==="not-allowed"||er==="service-not-allowed")tvErr("Microphone blocked. Allow it in the browser's site settings.");
    else if(er==="language-not-supported"){TV.forcePh=true;tvErr(`This browser can't recognise ${LNAME()}. Tap the mic to use the on-device model instead.`);}
    else if(er==="network")tvErr("The speech service is unreachable.");};
  r.onend=()=>{TV.rec=null;if(TV.err)return;
    const t=document.getElementById("tin"),txt=((fin||"").trim()||(t&&t.value||"").trim());
    tvSet("idle","");
    if(txt){if(t){t.value="";t.style.height="";}TV.idle=0;tutSend("🎤 "+txt);}
    else if(TV.hands&&view==="tutor"){if(++TV.idle<3)setTimeout(()=>{if(TV.hands&&view==="tutor"&&TV.state==="idle")tvListen();},250);else{TV.hands=false;tvSaveS();tvBtns();tvStat("Conversation paused. Tap the mic to continue.");}}};
  try{r.start();}catch(e){tvErr("Couldn't start the microphone.");}}
async function phListen(){
  TV.mode="ph";
  if(!PK.speech){tvErr(`Speech input isn't available for ${LNAME()} in this browser.`);return;}
  if(!(ASR.state==="ready"||asrCached())){
    tvSet("proc","Downloading the speech model once… 0%");
    const sub=()=>{if(TV.state==="proc")tvStat(esc(`Downloading the speech model once… ${ASR.pct}%`));};ASR.subs.add(sub);
    try{await asrLoad();}catch(e){ASR.subs.delete(sub);tvErr("Couldn't download the speech model.");return;}
    ASR.subs.delete(sub);}
  try{await micOpen();}catch(e){tvErr("Microphone blocked. Allow it in the browser's site settings.");return;}
  micStart(15000,()=>{if(TV.state==="listen")phStop();});tvSet("listen","Listening… tap to stop");}
async function phStop(){
  if(TV.state!=="listen")return;tvSet("proc","Analysing…");
  try{const blob=await micStop();if(!blob||blob.size<200)throw new Error("empty");
    const pcm=await to16k(blob);if(pcm.length<16000*.3)throw new Error("short");
    const ipa=await asrRun(pcm),got=PK.speech.heard(ipa),txt=got.map(PK.speech.show).join("");
    micClose();tvSet("idle","");
    if(!txt){tvStat("Nothing heard. Try again.",true);return;}
    tutSend("🎤 (phonetic transcript, may contain errors) "+txt);}
  catch(e){micClose();tvSet("idle","");tvStat(esc(/short|empty/.test(String(e&&e.message))?"Too short. Tap, speak, tap again.":"Couldn't analyse that."),true);}}
function tvStop(){TV.hands=false;tvStopSpeak();try{if(TV.rec)TV.rec.stop();}catch(e){}TV.rec=null;if(typeof micClose==="function")try{micClose();}catch(e){}TV.state="idle";}
function tvBind(){
  tvBtns();
  const g=id=>document.getElementById(id);
  g("tmic").onclick=tvListen;
  g("tspk").onclick=()=>{TV.speak=!TV.speak;if(!TV.speak){TV.hands=false;tvStopSpeak();tvStat("");}else tvUnlock();tvSaveS();tvBtns();};
  g("thands").onclick=()=>{TV.hands=!TV.hands;if(TV.hands){TV.speak=true;TV.idle=0;tvUnlock();if(!tvSR()&&!PK.speech){TV.hands=false;tvErr(`Speech input isn't available for ${LNAME()} here.`);}else if(TV.state==="idle"&&!TUT.busy)tvListen();}else{tvStopSpeak();if(TV.state==="listen")tvStopListen();tvStat("");}tvSaveS();tvBtns();};
  g("tlang").onclick=()=>{TV.lang=TV.lang==="e"?"t":"e";tvBtns();};}
