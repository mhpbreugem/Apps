// ---------- answer check by Claude Haiku (the key is kept only in this browser) ----------
// The key is shared with Kāshi when both apps run on the same site.
const AI={key:null,model:"claude-haiku-5-5",shared:false,noFmt:false};
try{AI.key=localStorage.getItem("mdr-ai");if(!AI.key&&!localStorage.getItem("mdr-ai-off")){AI.key=localStorage.getItem("kashi-ai");AI.shared=!!AI.key;}}catch(e){}
// rough monthly spend (Haiku 5.5: $0.10 / $0.50 per million input / output tokens)
function aiUse(u){if(!u)return;try{const m=new Date().toISOString().slice(0,7);let x=JSON.parse(localStorage.getItem("mdr-aiuse")||"null");if(!x||x.m!==m)x={m,i:0,o:0,n:0};
  x.i+=u.input_tokens||0;x.o+=u.output_tokens||0;x.n++;localStorage.setItem("mdr-aiuse",JSON.stringify(x));}catch(e){}}
function aiSpend(){try{const x=JSON.parse(localStorage.getItem("mdr-aiuse")||"null");if(!x||x.m!==new Date().toISOString().slice(0,7))return{usd:0,n:0};return{usd:x.i*.1e-6+x.o*.5e-6,n:x.n};}catch(e){return{usd:0,n:0};}}
const usd=x=>"$"+(x<.01?x.toFixed(4):x.toFixed(3));
const AI_SCHEMA={type:"object",properties:{v:{type:"string",enum:["right","partial","wrong"]},tip:{type:"string"}},required:["v","tip"],additionalProperties:false};
function aiPrompt(card,answer){
  return`You grade a flashcard answer from a student of the EU Medical Device Regulation (MDR, Regulation (EU) 2017/745, as amended by Regulations 2020/561, 2023/607 and 2024/1860).
Question: ${card.q}
Reference answer: ${card.a}
Source: ${card.ref}
Student's answer: ${answer}
Grade on meaning, not wording: paraphrases, abbreviations, other order and short notes are fine. If the question asks for a number of items ("name five"), that many correct items is enough. Do not penalise missing detail that the question did not ask for.
"right" = the essential points (or the requested number of items) are present and nothing material is wrong.
"partial" = some essential points are right, but an important one is missing or slightly inaccurate.
"wrong" = mostly missing, or contradicts the regulation (for example a wrong class, deadline, number or actor).
Reply with JSON only: {"v":"right"|"partial"|"wrong","tip":"<at most 30 words in English: what was missing or wrong, or a short confirmation>"}`;}
async function aiJudge(card,answer){
  if(!AI.key)return null;
  const ctl=new AbortController(),to=setTimeout(()=>ctl.abort(),25000);
  const body={model:AI.model,max_tokens:1024,output_config:{effort:"low"},messages:[{role:"user",content:aiPrompt(card,answer)}]};
  if(!AI.noFmt)body.output_config.format={type:"json_schema",schema:AI_SCHEMA};
  try{
    let r=await post(body,ctl);
    if(r.status===400&&!AI.noFmt){AI.noFmt=true;delete body.output_config.format;r=await post(body,ctl);} // older setups: plain JSON in the text
    if(!r.ok)return{err:r.status===401?"Key rejected. Check it in Settings.":r.status===429?"Rate or spend limit reached.":"Haiku error "+r.status};
    const j=await r.json();aiUse(j.usage);
    if(j.stop_reason==="refusal")return{err:"Haiku declined to grade this answer."};
    const b=(j.content||[]).find(x=>x.type==="text"),t=b?b.text:"";
    const m=t.match(/\{[\s\S]*\}/);if(!m)return{err:"No verdict returned."};
    const o=JSON.parse(m[0]);const v=["right","partial","wrong"].includes(o.v)?o.v:"wrong";
    return{v,tip:String(o.tip||"").slice(0,240)};
  }catch(e){return{err:e.name==="AbortError"?"Haiku timed out.":"Network error."};}
  finally{clearTimeout(to);}}
function post(body,ctl){return fetch("https://api.anthropic.com/v1/messages",{method:"POST",signal:ctl.signal,
  headers:{"content-type":"application/json","x-api-key":AI.key,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},body:JSON.stringify(body)});}
const RES={right:"ok",partial:"near",wrong:"bad"};
