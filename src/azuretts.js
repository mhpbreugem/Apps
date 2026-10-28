// ===================== Azure neural voice (optional): speaks target-language text =====================
// Key + region are kept only in this browser. Every phrase is cached after its first use and a
// monthly character cap stops the app from calling Azure once it is reached.
const AZ={key:null,region:"westeurope",cap:400000,busy:0,audio:null};
const AZV={"fa-IR":"fa-IR-DilaraNeural","fr-FR":"fr-FR-DeniseNeural","es-ES":"es-ES-ElviraNeural","de-DE":"de-DE-KatjaNeural","it-IT":"it-IT-ElsaNeural","nl-NL":"nl-NL-ColetteNeural","pt-PT":"pt-PT-RaquelNeural","ar-SA":"ar-SA-ZariyahNeural","tr-TR":"tr-TR-EmelNeural","ru-RU":"ru-RU-SvetlanaNeural","zh-CN":"zh-CN-XiaoxiaoNeural","ja-JP":"ja-JP-NanamiNeural"};
try{AZ.key=localStorage.getItem("kashi-az");AZ.region=localStorage.getItem("kashi-azr")||"westeurope";AZ.cap=+localStorage.getItem("kashi-azcap")||400000;}catch(e){}
const azOn=()=>!!(AZ.key&&PK&&PK.speechLang&&AZV[PK.speechLang]);
function azUsed(){try{const x=JSON.parse(localStorage.getItem("kashi-azuse")||"null"),m=new Date().toISOString().slice(0,7);return x&&x.m===m?x.c:0;}catch(e){return 0;}}
function azAdd(n){try{const m=new Date().toISOString().slice(0,7);localStorage.setItem("kashi-azuse",JSON.stringify({m,c:azUsed()+n}));}catch(e){}}
const azKey=t=>"https://kashi.local/tts/"+(PK.speechLang||"x")+"/"+encodeURIComponent(t);
const azMem=new Map();
async function azCacheGet(t){const k=azKey(t);if(azMem.has(k))return azMem.get(k);
  try{if("caches"in window){const c=await caches.open("kashi-tts"),r=await c.match(k);if(r){const b=await r.blob();azMem.set(k,b);return b;}}}catch(e){}return null;}
async function azCachePut(t,b){const k=azKey(t);azMem.set(k,b);try{if("caches"in window){const c=await caches.open("kashi-tts");await c.put(k,new Response(b,{headers:{"content-type":"audio/mpeg"}}));}}catch(e){}}
const xmlEsc=s=>String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&apos;"}[m]));
// -> {blob} or {err:"cap"|"key"|"net"|"http"}
const azFly=new Map();
function azAudio(text){text=String(text||"").replace(/\s+/g," ").trim();if(!text)return Promise.resolve({err:"empty"});
  if(azFly.has(text))return azFly.get(text);const p=azAudio1(text).finally(()=>azFly.delete(text));azFly.set(text,p);return p;}
async function azAudio1(text){
  const hit=await azCacheGet(text);if(hit)return{blob:hit,cached:true};
  if(azUsed()+text.length>AZ.cap)return{err:"cap"};
  const lang=PK.speechLang,voice=AZV[lang];
  const ssml=`<speak version="1.0" xml:lang="${lang}"><voice xml:lang="${lang}" name="${voice}"><prosody rate="-8%">${xmlEsc(text)}</prosody></voice></speak>`;
  try{const r=await fetch(`https://${AZ.region.trim()}.tts.speech.microsoft.com/cognitiveservices/v1`,{method:"POST",
      headers:{"Ocp-Apim-Subscription-Key":AZ.key,"Content-Type":"application/ssml+xml","X-Microsoft-OutputFormat":"audio-24khz-48kbitrate-mono-mp3"},body:ssml});
    if(r.status===401||r.status===403)return{err:"key"};
    if(!r.ok)return{err:"http",status:r.status};
    const b=await r.blob();if(!b.size)return{err:"http",status:0};
    azAdd(text.length);azCachePut(text,b);return{blob:b};}
  catch(e){return{err:"net"};}}
function azStop(){try{if(AZ.audio){AZ.audio.pause();AZ.audio.src="";}}catch(e){}AZ.audio=null;if(AZ.res){const f=AZ.res;AZ.res=null;f();}}
// plays one phrase; resolves when finished (or on error)
function azPlay(text){return new Promise(async res=>{
  azStop();const r=await azAudio(text);
  if(r.err){azFail(r);return res();}
  const url=URL.createObjectURL(r.blob),a=new Audio(url);AZ.audio=a;
  const done=()=>{URL.revokeObjectURL(url);if(AZ.audio===a)AZ.audio=null;AZ.res=null;res();};AZ.res=done;
  a.onended=done;a.onerror=done;a.play().catch(done);});}
function azFail(r){const m={cap:`Monthly voice cap reached (${Math.round(AZ.cap/1000)}k characters). Raise it in Settings.`,key:"Azure rejected the key or region. Check Settings.",net:"Couldn't reach Azure. This browser may block it, or you're offline.",http:"Azure error "+(r.status||"")}[r.err];
  if(m)toast(m);}
function toast(msg){let t=document.getElementById("toast");if(!t){t=document.createElement("div");t.id="toast";document.body.appendChild(t);}
  t.textContent=msg;t.className="show";clearTimeout(toast.t);toast.t=setTimeout(()=>t.className="",4200);}
// tap-to-hear anywhere: any element with data-say
async function say(text){
  if(!text)return;
  if(typeof tvStopSpeak==="function")tvStopSpeak();
  if(azOn()){await azPlay(text);return;}
  const tl=PK&&(PK.speechLang||PK.code),v=tvTTS()&&tl?tvVoice(tl):null;
  if(v){try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.voice=v;u.lang=v.lang;u.rate=.85;speechSynthesis.speak(u);}catch(e){}return;}
  toast(`No ${PK?LNAME():""} voice on this device. Add an Azure key in Settings.`);}
document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest("[data-say]");if(!b)return;e.preventDefault();e.stopPropagation();say(b.getAttribute("data-say"));},true);
const canSay=()=>!!(PK&&PK.speechLang&&(azOn()||(tvTTS()&&tvVoice(PK.speechLang))));
