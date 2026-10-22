// ===================== French pack =====================
PACKS.fr={code:"fr",flag:"🇫🇷",native:"Français",name:"French",dir:"ltr",font:null,
levels:["A1","A2","B1","B2","C1"],raw:__VOCAB__,topics:__TOPICS__,
norm(s){return String(s).normalize("NFC").toLowerCase().replace(/[’`´ʼ]/g,"'").replace(/œ/g,"oe").replace(/æ/g,"ae").replace(/[\s'.,;:!?¿¡«»"()\-–—…]/g,"");},
loose(s){return PACKS.fr.norm(s).normalize("NFD").replace(/[\u0300-\u036f]/g,"");},
build(){
__MORPH__
// ---- cards: 3rd field is the grammar tag (m, f, mf, mpl, fpl, a, a:fem, a:inv, v, x) ----
for(const c of CARDS){if(c._t===undefined){c._t=LEVELS.includes(c.deck)?c.tr:"";if(LEVELS.includes(c.deck))c.tr="";}}
const tagOf=c=>c._t||"";
const OBJ=LEVELS;
const byEn=new Map();for(const c of CARDS)if(OBJ.includes(c.deck)&&!byEn.has(c.en))byEn.set(c.en,c.id);
const known=id=>!!P.p[id];
const NOUNT=/^(m|f|mf|mpl|fpl)$/;
function nounOf(id){const c=BYID[id],t=tagOf(c);if(!NOUNT.test(t))return null;
  return{id,f:c.fa[0],alts:c.fa,g:t.startsWith("f")?"f":"m",both:t==="mf",ipl:/pl$/.test(t),en:enOf(c)};}
function adjOf(id){const c=BYID[id],t=tagOf(c);if(!t.startsWith("a"))return null;return{id,f:c.fa[0],alts:c.fa,tag:t,en:enOf(c)};}
function verbOf(id){const c=BYID[id];if(tagOf(c)!=="v")return null;return c.fa.map(parseV).filter(Boolean);}
function parseV(s){s=s.trim();let refl=false;if(/^se /.test(s)){refl=true;s=s.slice(3);}else if(/^s'/.test(s)){refl=true;s=s.slice(2);}
  const w=s.split(/\s+/),inf=w[0];if(!/(er|ir|re|oir|ïr)$/.test(inf))return null;return{inf,refl,rest:w.slice(1).join(" ")};}
// core lexicon mapped to French cards
const LEX_N=CORE_N.map(r=>[byEn.get(r[0]),...r.slice(1)]).filter(r=>r[0]&&nounOf(r[0]));
const LEX_A=CORE_A.map(r=>[byEn.get(r[0]),...r.slice(1)]).filter(r=>r[0]&&adjOf(r[0]));
const LEX_V=CORE_V.map(v=>Object.assign({},v,{id:byEn.get(v.k)})).filter(v=>v.id&&verbOf(v.id)&&verbOf(v.id).length);
// ---- noun phrases ----
function NPf(n,kind,{adj=null,pl=false}={}){ // French noun phrase strings (alternatives)
  const out=[];const gs=n.both?["m","f"]:[n.g];const plural=pl||n.ipl;
  for(const g of gs)for(const base of n.alts.slice(0,2)){
    const noun=plural&&!n.ipl?nPl(base):base;let words;
    if(adj){const before=BAGS.has(adj.f.split(" ")[0]);
      if(before){const af=aForm(adj.f,adj.tag,g,plural,noun);const d=kind?det(kind,g,plural,af):"";
        words=(d?NP(d,af):af)+" "+noun;if(kind==="ind"&&plural)out.push("de "+af+" "+noun);}
      else{const af=aForm(adj.f,adj.tag,g,plural);const d=kind?det(kind,g,plural,noun):"";words=(d?NP(d,noun):noun)+" "+af;}}
    else{const d=kind?det(kind,g,plural,noun):"";words=d?NP(d,noun):noun;}
    out.push(words);}
  return[...new Set(out)];}
const enC=s=>s.replace(/\s*\(.*?\)/g,"").trim();
const enNP=(n,kind,{adj=null,pl=false}={})=>{pl=pl||n.ipl;const w=(adj?enC(adj.en)+" ":"")+(pl&&!n.ipl?(n.pl||n.en+"s"):(adj?enC(n.en):n.en));
  return{def:"the ",ind:pl?"":(/^[aeiou]/.test(w)?"an ":"a "),dem:pl?"these ":"this ",p0:"my ",p1:"your ",p2:"his ",p3:"our ",p4:"your (pl.) ",p5:"their "}[kind]+w;};
// ---- clause helper (handles he/she and they) ----
function subjPick(ps){const p=rnd(ps);let g="m",en;
  if(p===2){g=Math.random()<.5?"m":"f";en=g==="f"?"she":"he";}
  else{en=["I","you","he","we","you (pl.)","they"][p];g=p===5?"x":"x";}
  return{p,g,en};}
function CL(v,s,tense,o={}){
  const vs=Array.isArray(v)?v:[v];const out=[];
  for(const vv of vs){const obj=[vv.rest,o.obj].filter(Boolean).join(" ");
    if(s.p===5){for(const g of ["m","f"])out.push(...clause(vv,5,tense,Object.assign({},o,{g,obj})));}
    else out.push(...clause(vv,s.p,tense,Object.assign({},o,{g:s.p===2?s.g:"x",obj})));}
  return[...new Set(out)];}
const cS=x=>x.map(s=>s[0].toUpperCase()+s.slice(1));
// ---- word picking (known first, at most one new word) ----
function wgt(id){const p=P.p[id];return(p.due<=today()?3:1)*(1+(MAXL-p.l)/2);}
function pick(ids,ctx){
  const kn=ids.filter(id=>P.p[id]&&BYID[id]),fr=ids.filter(id=>!P.p[id]&&BYID[id]);
  const wantNew=!ctx.nw&&fr.length&&(kn.length<3||Math.random()<ctx.newRate);
  if(kn.length&&!wantNew){let t=kn.reduce((a,id)=>a+wgt(id),0)*Math.random();for(const id of kn){t-=wgt(id);if(t<=0)return id;}return kn[0];}
  if(!ctx.nw&&fr.length){const id=rnd(fr);ctx.nw=id;return id;}
  return null;}
const catOK=(n,cats)=>cats.split(" ").some(c=>n[3].split(" ").includes(c));
function pN(ctx,f){const id=pick(LEX_N.filter(f||(()=>true)).map(n=>n[0]),ctx);if(!id)return null;const r=LEX_N.find(n=>n[0]===id),n=nounOf(id);n.pl=r[2];n.row=r;return n;}
function pA(ctx,f){const id=pick(LEX_A.filter(f||(()=>true)).map(a=>a[0]),ctx);if(!id)return null;const r=LEX_A.find(a=>a[0]===id),a=adjOf(id);a.comp=r[2];a.row=r;return a;}
function pV(ctx,f){const id=pick(LEX_V.filter(f||(()=>true)).map(v=>v.id),ctx);if(!id)return null;const v=LEX_V.find(x=>x.id===id);return Object.assign({},v,{fr:verbOf(id)});}
const adjFor=n=>a=>catOK(n.row,a[3].replace("pp",""));
// ---- skills ----
const SKILLS={
 art:["A1","Articles & gender","le / la / l' / les and un / une / des. Every noun is masculine or feminine; learn it with its article."],
 adj:["A1","Adjective agreement","Adjectives agree in gender and number and usually follow the noun: une voiture rouge. Short common ones (beau, bon, grand, petit, nouveau, vieux, jeune…) come before."],
 plural:["A1","Plural","Add -s (silent). -al → -aux, -eau → -eaux; words in -s, -x, -z don't change."],
 poss:["A1","Possessives","mon/ma/mes, ton/ta/tes, son/sa/ses, notre/nos, votre/vos, leur/leurs. Before a vowel, mon/ton/son even for feminine: mon amie."],
 demo:["A1","This / these","ce, cet (before a vowel), cette, ces."],
 etre:["A1","Être & avoir","je suis, tu es, il est, nous sommes, vous êtes, ils sont · j'ai, tu as, il a, nous avons, vous avez, ils ont."],
 pres:["A1","Present tense","-er: -e, -es, -e, -ons, -ez, -ent. Many common verbs are irregular: aller, faire, prendre, venir…"],
 neg:["A1","Negation","ne … pas around the verb: je ne mange pas. ne → n' before a vowel. Speech often drops ne."],
 ques:["A1","Questions","Où, qui, quoi/que, pourquoi, comment, combien, quel. Est-ce que… or rising intonation."],
 prep:["A1","Prepositions","à + le = au, à + les = aux, de + le = du, de + les = des. sous, sur, devant, derrière, à côté de."],
 num:["A1","Numbers + noun","The noun takes the plural after deux and up: trois livres."],
 pc:["A2","Passé composé","avoir + past participle: j'ai mangé. Negative: je n'ai pas mangé."],
 pce:["A2","Passé composé with être","Movement verbs and reflexives take être, and the participle agrees: elle est allée, nous sommes partis."],
 fproche:["A2","Near future","aller + infinitive: je vais manger."],
 imp:["A2","Imperative","tu, nous, vous forms without the pronoun; -er verbs drop the -s: mange ! Negative: ne mange pas !"],
 comp:["A2","Comparison","plus/moins/aussi … que; le/la/les plus … Irregular: bon → meilleur."],
 part:["A2","Partitive","du, de la, de l', des for some/any: je mange du pain. After a negative: pas de pain."],
 impf:["B1","Imparfait","Ongoing or habitual past: nous-stem + -ais, -ais, -ait, -ions, -iez, -aient: je mangeais."],
 fut:["B1","Future","infinitive (minus final -e) + -ai, -as, -a, -ons, -ez, -ont: je mangerai. Irregular stems: ir-, ser-, aur-, fer-…"],
 refl:["B1","Reflexive verbs","me, te, se, nous, vous, se before the verb: je me lave. Compound tenses take être."],
 pron:["B1","Object pronouns","le, la, les (direct) go before the verb: je le mange, je l'ai mangé."],
 rel:["B1","Relative pronouns","qui = subject (l'ami qui vient), que = object (le livre que je lis)."],
 cond:["B2","Conditional","future stem + imperfect endings: je mangerais. Politeness and hypotheses."],
 subj:["B2","Subjunctive","After il faut que, vouloir que, avant que…: que je mange, que tu viennes, que nous allions."],
 pqp:["B2","Plus-que-parfait","Imparfait of avoir/être + participle: j'avais mangé, elle était partie."],
 passive:["B2","Passive","être + participle, agreeing with the subject: la porte est ouverte, la lettre a été écrite."],
 condp:["C1","Past conditional","Conditional of avoir/être + participle: j'aurais mangé, elle serait venue."],
 subjp:["C1","Past subjunctive","que + subjunctive of avoir/être + participle: je suis content que tu sois venu."],
 ger:["C1","Gérondif","en + present participle (nous-stem + -ant) for 'while/by doing': en mangeant."],
 si:["C1","Si-clauses","si + plus-que-parfait, conditional past: si j'avais su, je serais venu."]};
const pickVerb=(ctx,f)=>pV(ctx,v=>(f?f(v):true));
function vbForms(v,s,tense,o){return cS(CL(v.fr,s,tense,o));}
// ---- grammar pattern generators (Sprint) ----
const GEN={
 art(ctx){const n=pN(ctx);if(!n)return null;const mass=n.row[1]===n.row[2]&&!n.ipl;const k=mass?"def":rnd(["def","ind"]);const pl=Math.random()<.3&&n.pl!==n.en;
   return{en:enNP(n,k,{pl}),seqs:[[NPf(n,k,{pl})]],skills:pl?["art","plural"]:["art"],words:[n.id]};},
 adj(ctx){const n=pN(ctx);if(!n)return null;const a=pA(ctx,adjFor(n));if(!a)return null;const k=n.row[1]===n.row[2]?"def":rnd(["def","ind"]);const pl=Math.random()<.3&&n.pl!==n.en;
   return{en:enNP(n,k,{adj:a,pl}),seqs:[[NPf(n,k,{adj:a,pl})]],skills:pl?["adj","plural"]:["adj","art"],words:[n.id,a.id]};},
 plural(ctx){const n=pN(ctx,r=>r[1]!==r[2]);if(!n)return null;const a=Math.random()<.4?pA(ctx,adjFor(n)):null;
   return{en:enNP(n,"def",{adj:a,pl:true}),seqs:[[NPf(n,"def",{adj:a,pl:true})]],skills:a?["plural","adj"]:["plural"],words:[n.id].concat(a?[a.id]:[])};},
 poss(ctx){const n=pN(ctx,r=>r[4]);if(!n)return null;const p=Math.floor(Math.random()*6);let k="p"+p;const e=enNP(n,k).replace(/^his /,Math.random()<.5?"his ":"her ");
   return{en:e,seqs:[[NPf(n,k)]],skills:["poss"],words:[n.id]};},
 demo(ctx){const n=pN(ctx);if(!n)return null;const pl=Math.random()<.3&&n.pl!==n.en;
   return{en:enNP(n,"dem",{pl}),seqs:[[NPf(n,"dem",{pl})]],skills:pl?["demo","plural"]:["demo"],words:[n.id]};},
 etre(ctx,fneg){
   if(fneg||Math.random()<.5){const a=pA(ctx,a=>a[3].includes("pp"));if(!a)return null;const s=subjPick([0,1,2,3,5]);const neg=fneg||ctx.has("neg")&&Math.random()<.3;
     const alts=[];for(const g of (s.p===2?[s.g]:["m","f"])){const af=aForm(a.f,a.tag,g,s.p>=3);
       const sp=s.p===5?(g==="f"?"elles":"ils"):subj(s.p,g);const be=conj("être").p[s.p];
       alts.push(EL([sp,...(neg?["ne",be,"pas"]:[be]),af]));if(neg)alts.push(EL([sp,be,"pas",af]));}
     return{en:`${cap(s.en)} ${["am","are","is","are","are","are"][s.p]}${neg?" not":""} ${a.en}`,seqs:[[cS(alts)]],skills:neg?["etre","neg"]:["etre"],words:[a.id]};}
   const n=pN(ctx,r=>/thing|animal/.test(r[3])&&r[1]!==r[2]);if(!n)return null;const s=subjPick([0,3]);
   return{en:`${cap(s.en)} ${s.p===2?"has":"have"} ${enNP(n,"ind")}`,seqs:[[cS(NPf(n,"ind").map(x=>EL([subj(s.p,"m"),conj("avoir").p[s.p],x])))]],skills:["etre","art"],words:[n.id]};},
 verb(ctx,tense,{neg=false,force=null}={}){
   const v=pickVerb(ctx,v=>{if(force==="obj"&&!v.obj)return false;if(force==="to"&&!v.place)return false;if(!force&&!v.intr&&!v.obj)return false;if(v.stative&&!["pres","impf","pc","cond","fut"].includes(tense))return false;return true;});
   if(!v)return null;
   let n=null,obj=null,enO="";
   const useObj=force==="obj"||(force!=="to"&&v.obj&&(!v.intr||Math.random()<.45));
   const useTo=force==="to"||(!useObj&&v.place&&Math.random()<.6);
   if(useObj){n=pN(ctx,r=>catOK(r,v.obj));if(!n)return null;obj=NPf(n,"def")[0];enO=" "+enNP(n,"def");}
   else if(useTo){n=pN(ctx,r=>r[5]);if(!n)return null;const home=n.row[5]==="home";obj=home?"à la maison":EL(["à",NPf(n,"def")[0]]).replace(/^à le /,"au ").replace(/ à le /," au ");obj=obj.replace(/^à le\b/,"au");enO=" "+n.row[5];}
   else if(!v.intr)return null;
   const s=subjPick([0,1,2,3,4,5]);
   const enMap={pres:"pres",pc:"past",pce:"past",impf:"pastprog",fut:"fut",cond:"cond",pqp:"pluperf",condp:"condperf",fproche:"fproche"};
   let en;
   if(tense==="fproche")en=`${cap(s.en)} ${["am","are","is","are","are","are"][s.p]}${neg?" not":""} going to ${v.en[0]}`;
   else en=`${cap(s.en)} ${enV(v,s.p,enMap[tense]||tense,neg)}`;
   const alts=vbForms(v,s,tense==="pce"?"pc":tense,{neg,obj:obj&&obj.startsWith("à")?obj.replace(/^à le /,"au "):obj});
   const sk={pres:"pres",pc:"pc",impf:"impf",fut:"fut",cond:"cond",pqp:"pqp",condp:"condp",fproche:"fproche"}[tense];
   const etreV=v.fr.some(x=>conj(x.inf).etre||x.refl);
   return{en:en+enO,seqs:[[alts]],skills:[etreV&&["pc","pqp","condp"].includes(tense)?"pce":sk].concat(neg?["neg"]:[],useObj?["art"]:[],useTo?["prep"]:[]),words:[v.id].concat(n?[n.id]:[])};},
 imp(ctx){const v=pickVerb(ctx,v=>!v.stative&&(v.intr||v.obj));if(!v)return null;const neg=Math.random()<.35,p=rnd([1,1,4,3]);
   let n=null,obj="";if(v.obj&&(!v.intr||Math.random()<.5)){n=pN(ctx,r=>catOK(r,v.obj));if(!n)return null;obj=NPf(n,"def")[0];}
   const alts=v.fr.flatMap(x=>imper(x,p,neg,[x.rest,obj].filter(Boolean).join(" ")));
   const en=(p===3?(neg?"Let's not ":"Let's ")+v.en[0]:(neg?"Don't "+v.en[0]:cap(v.en[0])))+(n?" "+enNP(n,"def"):"")+"!"+(p===4?" (pl.)":"");
   return{en,seqs:[[cS(alts)]],skills:["imp"].concat(neg?["neg"]:[]),words:[v.id].concat(n?[n.id]:[])};},
 comp(ctx){const n=pN(ctx,r=>r[1]!==r[2]);if(!n)return null;const a=pA(ctx,adjFor(n));if(!a)return null;
   const sup=Math.random()<.4;
   if(sup){const g=n.g,good=a.f==="bon";const af=good?aForm("meilleur","a",g,false):aForm(a.f,a.tag,g,false);
     let alts;if(good||BAGS.has(a.f)){const rest=(good?"":"plus ")+af;alts=[NP(det("def",g,false,rest),rest)+" "+n.f];}
     else alts=[NP(det("def",g,false,n.f),n.f)+" "+(g==="f"?"la":"le")+" plus "+af];
     return{en:`the ${good?"best":a.comp.startsWith("more ")?"most "+a.en:a.comp.replace(/er$/,"est").replace("better","best").replace("worse","worst")} ${n.en}`,seqs:[[alts]],skills:["comp","adj"],words:[n.id,a.id]};}
   const af=a.f==="bon"?aForm("meilleur","a",n.g,false):aForm(a.f,a.tag,n.g,false);
   const alts=a.f==="bon"?[EL([NPf(n,"def")[0],"est",af])]:[EL([NPf(n,"def")[0],"est","plus",af])];
   return{en:`The ${n.en} is ${a.comp}`,seqs:[[cS(alts)]],skills:["comp","adj"],words:[n.id,a.id]};},
 part(ctx){const n=pN(ctx,r=>/food|drink/.test(r[3]));if(!n)return null;const v=LEX_V.find(v=>v.k===(n.row[3].includes("drink")?"to drink":"to eat"));if(!v||!known(v.id)&&ctx.nw)return null;
   if(!known(v.id))ctx.nw=v.id;const s=subjPick([0,3]);const neg=ctx.has("neg")&&Math.random()<.35;const vv=Object.assign({},v,{fr:verbOf(v.id)});
   const pd=neg?(isVow(n.f)?"d'"+n.f:"de "+n.f):NP(det("part",n.g,false,n.f),n.f);
   return{en:`${cap(s.en)} ${neg?(s.p===2?"doesn't":"don't")+" "+v.en[0]+" any":v.en[0]+(s.p===2?"s":"")+" some"} ${n.en}`.replace(" eats some"," eats some"),seqs:[[vbForms(vv,s,"pres",{neg,obj:pd})]],skills:["part"].concat(neg?["neg"]:[]),words:[v.id,n.id]};},
 refl(ctx){const cands=CARDS.filter(c=>OBJ.includes(c.deck)&&tagOf(c)==="v"&&/^(se |s')/.test(c.fa[0])&&known(c.id));
   const fresh=CARDS.filter(c=>OBJ.includes(c.deck)&&tagOf(c)==="v"&&/^(se |s')/.test(c.fa[0])&&!known(c.id)&&c.deck==="A1"||c.deck==="A2"&&tagOf(c)==="v"&&/^(se |s')/.test(c.fa[0])&&!known(c.id));
   let c=cands.length?rnd(cands):null;if(!c&&!ctx.nw&&fresh.length){c=rnd(fresh);ctx.nw=c.id;}if(!c)return null;
   const vs=verbOf(c.id);if(!vs.length)return null;const s=subjPick([0,1,2,3,5]);const t=rnd(ctx.has("pc")?["pres","pres","pc"]:["pres"]);const base=enBase(c);
   const en=t==="pc"?`${cap(s.en)} ${base.replace(/^(\w+)/,m=>enPast(m))}`:`${cap(s.en)} ${s.p===2?base.replace(/^(\w+)/,m=>en3(m)):base}`;
   return{en,seqs:[[cS(CL(vs,s,t))]],skills:t==="pc"?["refl","pce"]:["refl"],words:[c.id]};},
 pron(ctx){const v=pickVerb(ctx,v=>v.obj&&!v.stative);if(!v)return null;const n=pN(ctx,r=>catOK(r,v.obj)&&r[1]!==r[2]);if(!n)return null;
   const s=subjPick([0,3,5]);const t=ctx.has("pc")&&Math.random()<.4?"pc":"pres";const pr=n.g==="f"?"la":"le";
   let alts=CL(v.fr,s,t,{pron:pr});if(t==="pc"&&n.g==="f")alts=alts.concat(alts.map(x=>x.replace(/é\b/,"ée").replace(/(is|it)\b/,"$1e")));
   return{en:`${cap(s.en)} ${enV(v,s.p,t==="pc"?"past":"pres")} it (the ${n.en})`,seqs:[[cS(alts)]],skills:["pron"].concat(t==="pc"?["pc"]:[]),words:[v.id,n.id]};},
 rel(ctx){const n=pN(ctx,r=>/person|thing|text|food/.test(r[3]));if(!n)return null;
   if(n.row[3].includes("person")){const v=pickVerb(ctx,v=>v.intr&&!v.stative);if(!v)return null;
     return{en:`the ${n.en} who ${v.en[1]}`,seqs:[[NPf(n,"def").flatMap(np=>CL(v.fr,{p:2,g:n.g,en:""},"pres").map(x=>np+" qui "+x.replace(/^(il|elle) /,"")))]],skills:["rel","art"],words:[n.id,v.id]};}
   const v=pickVerb(ctx,v=>v.obj&&catOK(n.row,v.obj));if(!v)return null;
   return{en:`the ${n.en} that I ${v.en[0]}`,seqs:[[NPf(n,"def").flatMap(np=>CL(v.fr,{p:0,g:"x",en:""},"pres").map(x=>EL([np,"que",x])))]],skills:["rel","art"],words:[n.id,v.id]};},
 subj(ctx){const v=pickVerb(ctx,v=>v.intr&&!v.stative);if(!v)return null;const p=rnd([1,3,4,2]);const s=p===2?subjPick([2]):{p,g:"x",en:["","you","","we","you (pl.)",""][p]};
   const lead=rnd(["want","must"]);
   const clauses=CL(v.fr,s,"subj");
   if(lead==="want")return{en:`I want ${s.p===2?(s.g==="f"?"her":"him"):s.p===3?"us":"you"+(s.p===4?" (pl.)":"")} to ${v.en[0]}`,seqs:[[cS(clauses.map(x=>EL(["je","veux","que",x])))]],skills:["subj"],words:[v.id]};
   return{en:`It is necessary that ${s.en||"he"} ${v.en[0]}`,seqs:[[clauses.map(x=>EL(["il","faut","que",x])).map(cap)]],skills:["subj"],words:[v.id]};},
 passive(ctx){const v=pickVerb(ctx,v=>v.pass);if(!v)return null;const n=pN(ctx,r=>catOK(r,v.obj));if(!n)return null;
   const pp=ppAgree(conj(v.fr[0].inf).pp,n.ipl?3:0,n.g);const np=NPf(n,"def");const past=Math.random()<.5;
   const alts=np.flatMap(x=>past?[EL([x,n.ipl?"ont":"a","été",pp]),EL([x,n.ipl?"étaient":"était",pp])]:[EL([x,n.ipl?"sont":"est",pp])]);
   return{en:`The ${n.en} ${past?(n.ipl?"were":"was"):(n.ipl?"are":"is")} ${v.en[3]}`,seqs:[[cS(alts)]],skills:["passive"],words:[v.id,n.id]};},
 ger(ctx){const G1=["to read","to write","to speak","to work","to play","to learn","to eat"],G2=["to eat","to drink","to work","to read","to cook","to play","to sit"];
   const v1=pickVerb(ctx,v=>G1.includes(v.k));const v2=pickVerb(ctx,v=>G2.includes(v.k));if(!v1||!v2||v1.id===v2.id)return null;const s=subjPick([0,2,3]);
   const ppr=conj(v2.fr[0].inf).ppr;const g2=v2.fr[0].refl?EL(["en",REFL[s.p],ppr]):"en "+ppr;
   return{en:`${cap(s.en)} ${enV(v1,s.p,"pres")} while ${v2.en[4]}`,seqs:[[cS(CL(v1.fr,s,"pres",{obj:g2}))]],skills:["ger"],words:[v1.id,v2.id]};},
 subjp(ctx){const v=pickVerb(ctx,v=>v.intr&&!v.stative);if(!v)return null;const s={p:1,g:"x",en:"you"};
   return{en:`I'm glad that you ${v.en[2]}`,seqs:[[CL(v.fr,s,"subjp").flatMap(x=>["content","contente"].map(c=>cap(EL(["je","suis",c,"que",x]))))]],skills:["subjp"],words:[v.id]};},
 si(ctx){const v1=pickVerb(ctx,v=>v.intr&&!v.stative);const v2=pickVerb(ctx,v=>v.intr&&!v.stative);if(!v1||!v2||v1.id===v2.id)return null;const s=subjPick([0,3]);
   const a=CL(v1.fr,s,"pqp"),b=CL(v2.fr,s,"condp");
   return{en:`If ${s.en} had ${v1.en[3]}, ${s.en} would have ${v2.en[3]}`,seqs:[[a.flatMap(x=>b.map(y=>cap(EL(["si",x+",",y]))))]],skills:["si"],words:[v1.id,v2.id]};}
};
const en3=w=>/(s|sh|ch|x|o)$/.test(w)?w+"es":/[^aeiou]y$/.test(w)?w.slice(0,-1)+"ies":w+"s";
const EN_IRR={wake:"woke",get:"got",sit:"sat",go:"went",feel:"felt",make:"made",take:"took",lie:"lay",hurry:"hurried",dress:"dressed"};
const enPast=w=>EN_IRR[w]||(/e$/.test(w)?w+"d":/[^aeiou]y$/.test(w)?w.slice(0,-1)+"ied":w+"ed");
function genFor(skill,ctx){
  const t={pres:"pres",pc:"pc",pce:"pc",impf:"impf",fut:"fut",cond:"cond",pqp:"pqp",condp:"condp",fproche:"fproche"};
  switch(skill){
    case"art":return Math.random()<.5?GEN.art(ctx):GEN.adj(ctx);
    case"adj":return GEN.adj(ctx);case"plural":return GEN.plural(ctx);case"poss":return GEN.poss(ctx);case"demo":return GEN.demo(ctx);
    case"etre":return GEN.etre(ctx);
    case"neg":return Math.random()<.3?GEN.etre(ctx,true):GEN.verb(ctx,ctx.has("pc")&&Math.random()<.4?"pc":"pres",{neg:true});
    case"pres":return GEN.verb(ctx,"pres",{neg:ctx.has("neg")&&Math.random()<.2});
    case"ques":return wordQ(ctx);
    case"prep":return Math.random()<.5?GEN.verb(ctx,"pres",{force:"to"}):prepQ(ctx);
    case"num":return numQ(ctx);
    case"pc":return GEN.verb(ctx,"pc",{neg:ctx.has("neg")&&Math.random()<.25,force:Math.random()<.5?"obj":null});
    case"pce":return GEN.verb(ctx,"pc",{force:"to"})||GEN.refl(ctx);
    case"fproche":return GEN.verb(ctx,"fproche",{neg:ctx.has("neg")&&Math.random()<.2});
    case"fut":case"impf":case"cond":case"pqp":case"condp":return GEN.verb(ctx,t[skill],{});
    case"imp":return GEN.imp(ctx);case"comp":return GEN.comp(ctx);case"part":return GEN.part(ctx);
    case"refl":return GEN.refl(ctx);case"pron":return GEN.pron(ctx);case"rel":return GEN.rel(ctx);
    case"subj":return GEN.subj(ctx);case"passive":return GEN.passive(ctx);case"ger":return GEN.ger(ctx);
    case"subjp":return GEN.subjp(ctx);case"si":return GEN.si(ctx);}}
// ---- question/prep/number helpers used by Sprint ----
function knownN(f){const k=LEX_N.filter(n=>known(n[0])&&f(n));if(!k.length)return null;const r=rnd(k),n=nounOf(r[0]);n.pl=r[2];n.row=r;return n;}
function knownV(f){const k=LEX_V.filter(v=>known(v.id)&&f(v));if(!k.length)return null;const v=rnd(k);return Object.assign({},v,{fr:verbOf(v.id)});}
function wordQ(ctx){const ids=["where","what","who","how","how much","which","why"].map(k=>byEn.get(k)).filter(Boolean);const id=pick(ids,ctx);return id?(qFrame(id)||null):null;}
function prepQ(ctx){const ids=["in","on","under","behind","next to","in front of"].map(k=>byEn.get(k)).filter(Boolean);const id=pick(ids,ctx);return id?prepFrame(id):null;}
function numQ(ctx){const ids=NUMS.map(k=>byEn.get(k)).filter(Boolean);const id=pick(ids,ctx);return id?numFrame(id):null;}
// ---- every word asked through a sentence ----
const ADV={"always":["always","pre","pres","post"],"sometimes":["sometimes","pre","pres","post"],"often":["often","pre","pres","post"],"usually":["usually","pre","pres","any"],
"never":["never","pre","never",""],"already; previously":["already","pre","pc","mid"],"recently":["recently","pre","pc","any"],"finally":["finally","pre","pc","any"],"suddenly":["suddenly","pre","pc","any"],
"definitely":["will definitely","modal","fut","post"],"probably":["will probably","modal","fut","post"],"maybe":["maybe","maybe","fut","any"],"perhaps":["perhaps","maybe","fut","any"],
"also; too":["too","also","pres","post"],"today":["today","end","pres","any"],"tomorrow":["tomorrow","end","fut","any"],"yesterday":["yesterday","end","pc","any"],"now":["now","end","pres","any"],
"tonight":["tonight","end","fut","any"],"this year":["this year","end","pres","any"],"last year":["last year","end","pc","any"],"day after tomorrow":["the day after tomorrow","end","fut","any"],
"day before yesterday":["the day before yesterday","end","pc","any"],"later":["later","end","fut","any"],"soon":["soon","end","fut","any"],"immediately":["immediately","end","fut","any"],
"early":["early","end","pres","post"],"late":["late","end","pc","post"],"together":["together","end","together","post"],"alone":["alone","end","pres","post"],"again":["again","end","pres","post"],
"every day":["every day","end","pres","any"],"Saturday":["on Saturday","end","fut","any"],"Sunday":["on Sunday","end","fut","any"],"Monday":["on Monday","end","fut","any"],"Tuesday":["on Tuesday","end","fut","any"],
"Wednesday":["on Wednesday","end","fut","any"],"Thursday":["on Thursday","end","fut","any"],"Friday":["on Friday","end","fut","any"],"morning":["in the morning","end","pres","any"],"afternoon":["in the afternoon","end","pres","any"],"night":["at night","end","pres","any"]};
const PREPS={"in":"in","on":"on","under":"under","behind":"behind","next to":"next to","in front of":"in front of","inside":"inside"};
const PREP_OBJ={"in":["house; home","room","car","bag","garden"],"on":["table","chair","bed"],"under":["table","chair","bed","car"],"behind":["door","house; home","car"],"next to":["window","door","table"],"in front of":["house; home","school","door"],"inside":["house; home","room","car"]};
const PREP_SUBJ=["cat","dog","book","key","phone","bag","pen","child","letter"];
const NUMS="one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|hundred|two hundred|thousand|million".split("|");
const PRONS={"I":0,"you (singular)":1,"he; she":2,"we":3,"you (plural, polite)":4,"they":5};
const QW=new Set(["far","near","very","a lot; much","what","who","where","why","how","how many","how much","which","here","there","this","that","and","or","without","with"]);
const WT={};
for(const c of CARDS){if(!OBJ.includes(c.deck))continue;const e=c.en,t=tagOf(c);
  if(t==="v"){const vs=verbOf(c.id);if(vs.length)WT[c.id]={t:"V",vs};continue;}
  if(e in PRONS){WT[c.id]={t:"PRON",p:PRONS[e]};continue;}
  if(ADV[e]){WT[c.id]={t:"ADV",a:ADV[e]};continue;}
  if(PREPS[e]){WT[c.id]={t:"PREP",k:e};continue;}
  if(NUMS.includes(e)){WT[c.id]={t:"NUM"};continue;}
  if(QW.has(e)){WT[c.id]={t:"Q",k:e};continue;}
  if(NOUNT.test(t)){WT[c.id]={t:"N"};continue;}
  if(t.startsWith("a")){WT[c.id]={t:"A",p:/\bpp\b/.test(t)};continue;}}
const ADJP=new Set(["old (person)","young","happy","sad","tired","hungry","thirsty","sick","ready","fat","thin","alive","dead","married","single (unmarried)","healthy","full (after eating)","strong","weak","rich","poor","angry","kind","lazy","clever","funny","famous","bored","excited","surprised","jealous","shy","brave","friendly; close","rude","hardworking","talkative","patient (adjective)","lucky","unlucky","unemployed","busy (person)","sure; certain","successful","honest","polite","careful","worried","calm","absent","present (here)","anxious","aware","blind","deaf","capable","cheerful","confident","confused","cruel","curious","disappointed","educated","embarrassed","generous","grateful","guilty","homesick","innocent","lonely","loyal","mature","proud","religious","responsible","selfish","strict","stupid","wise","pregnant","independent","sensitive","aggressive","bold","competent","conservative","desperate","eager","elderly","emotional","hostile","humble","ignorant","influential","optimistic","pessimistic","passionate","persistent","reckless","reluctant","resilient","willing","nervous","glad","proud"]);
const COLORS=new Set("white|black|red|blue|green|yellow|brown|grey|pink|orange (colour)|purple".split("|"));
function sentRank(c){const k=c.en;if(CORE_N.some(r=>r[0]===k)||CORE_A.some(r=>r[0]===k)||CORE_V.some(v=>v.k===k))return 0;const w=WT[c.id];if(!w)return 3;return["N","A","V"].includes(w.t)?1:2;}
function framesFor(id,has){
  const c=BYID[id],w=WT[id],out=[];if(!w)return out;const E=enOf(c);
  if(w.t==="N"){const n=nounOf(id);n.pl=E+"s";
    out.push(()=>{const k=rnd(["def","ind"]);return{en:enNP(n,k),seqs:[[NPf(n,k)]],skills:["art"],words:[id]};});
    out.push(()=>({en:`this ${E}`,seqs:[[NPf(n,"dem")]],skills:["demo"],words:[id]}));
    out.push(()=>{const p=rnd([0,1,3]);return{en:enNP(n,"p"+p),seqs:[[NPf(n,"p"+p)]],skills:["poss"],words:[id]};});
    out.push(()=>({en:`without ${E}`,seqs:[[n.alts.map(x=>"sans "+x)]],skills:["prep"],words:[id]}));
    out.push(()=>({en:`about the ${E}`,seqs:[[NPf(n,"def").flatMap(x=>["à propos "+EL(["de",x]),"sur "+x])]],skills:["prep"],words:[id]}));
    out.push(()=>{const imp=aForm("important","a",n.g,n.ipl);return{en:`The ${E} ${n.ipl?"are":"is"} important`,seqs:[[cS(NPf(n,"def").map(x=>EL([x,n.ipl?"sont":"est",imp])))]],skills:["etre","adj"],words:[id]};});
    if(has("neg"))out.push(()=>({en:`I don't like the ${E}`,seqs:[[cS(NPf(n,"def").flatMap(x=>[EL(["je","ne","aime","pas",x]),EL(["je","aime","pas",x])]))]],skills:["neg","art"],words:[id]}));
    if(has("adj"))out.push(()=>{const a=LEX_A.filter(r=>known(r[0])&&/thing|place|text/.test(r[3]));if(!a.length)return null;const A=adjOf(rnd(a)[0]);return{en:enNP(n,"ind",{adj:A}),seqs:[[NPf(n,"ind",{adj:A})]],skills:["adj","art"],words:[id,A.id]};});}
  if(w.t==="A"){const a=adjOf(id),person=ADJP.has(c.en),color=COLORS.has(c.en);
    out.push(()=>({en:`very ${E}`,seqs:[[["très "+a.f,"très "+aF(a.f,a.tag)]]],skills:[],words:[id]}));
    if(person){out.push(()=>{const s=subjPick([0,2,2,3,5]);const forms=[];for(const g of (s.p===2?[s.g]:["m","f"])){const sp=s.p===5?(g==="f"?"elles":"ils"):subj(s.p,g);forms.push(EL([sp,conj("être").p[s.p],aForm(a.f,a.tag,g,s.p>=3)]));}
        return{en:`${cap(s.en)} ${["am","are","is","are","are","are"][s.p]} ${E}`,seqs:[[cS(forms)]],skills:["etre","adj"],words:[id]};});}
    else{out.push(()=>({en:`It is ${E}`,seqs:[[["C'est "+a.f,"c'est "+a.f]]],skills:["etre"],words:[id]}));
      out.push(()=>{const n=knownN(r=>/thing|place|food|text/.test(r[3]));if(!n)return null;return{en:enNP(n,rnd(["def","ind"])==="def"?"def":"def",{adj:a}),seqs:[[NPf(n,"def",{adj:a})]],skills:["adj","art"],words:[id,n.id]};});
      if(has("neg"))out.push(()=>({en:`It isn't ${E}`,seqs:[[["Ce n'est pas "+a.f,"C'est pas "+a.f]]],skills:["etre","neg"],words:[id]}));}
    if(color)out.push(()=>{const n=knownN(r=>/thing/.test(r[3])&&r[1]!==r[2]);if(!n)return null;return{en:enNP(n,"ind",{adj:a}),seqs:[[NPf(n,"ind",{adj:a})]],skills:["adj"],words:[id,n.id]};});}
  if(w.t==="V"){const vs=w.vs,base=enBase(c),isBe=/^to be /.test(c.en);const V={fr:vs,en:[base,en3(base),"","",""]};
    if(!isBe){out.push(()=>{const s=subjPick([0,3,5]);return{en:`${cap(s.en)} ${base}`,seqs:[[vbForms(V,s,"pres",{})]],skills:["pres"],words:[id]};});
      if(has("neg"))out.push(()=>{const s=subjPick([0,3]);return{en:`${cap(s.en)} don't ${base}`,seqs:[[vbForms(V,s,"pres",{neg:true})]],skills:["pres","neg"],words:[id]};});
      if(has("pc"))out.push(()=>{const s=subjPick([0,3]);return{en:`${cap(s.en)} didn't ${base}`,seqs:[[vbForms(V,s,"pc",{neg:true})]],skills:[vs.some(x=>x.refl||conj(x.inf).etre)?"pce":"pc","neg"],words:[id]};});
      if(has("imp"))out.push(()=>{const ng=Math.random()<.4;return{en:ng?`Don't ${base}!`:`${cap(base)}!`,seqs:[[cS(vs.flatMap(x=>imper(x,1,ng,x.rest)))]],skills:["imp"].concat(ng?["neg"]:[]),words:[id]};});}
    if(has("fproche"))out.push(()=>{const s=subjPick([0,3]);return{en:`${cap(s.en)} ${s.p===0?"am":"are"} going to ${base}`,seqs:[[vbForms(V,s,"fproche",{})]],skills:["fproche"],words:[id]};});
    out.push(()=>{const s=subjPick([0,1,3]);const m=rnd(["vouloir","pouvoir","devoir"]);const mod=conj(m).p[s.p];
      const alts=vs.map(x=>EL([subj(s.p,"m"),mod,...(x.refl?[REFL[s.p]]:[]),x.inf,x.rest||""]));
      return{en:`${cap(s.en)} ${m==="vouloir"?"want to":m==="pouvoir"?"can":"must"} ${base}`,seqs:[[cS(alts)]],skills:["pres"],words:[id]};});
    if(has("fut"))out.push(()=>{const s=subjPick([0,3]);return{en:`${cap(s.en)} will ${base}`,seqs:[[vbForms(V,s,"fut",{})]],skills:["fut"],words:[id]};});
    if(has("cond"))out.push(()=>{const s=subjPick([0,3]);return{en:`${cap(s.en)} would ${base}`,seqs:[[vbForms(V,s,"cond",{})]],skills:["cond"],words:[id]};});}
  if(w.t==="ADV"){const[ae,pos,tense,fpos]=w.a;
    out.push(()=>{const v=knownV(v=>v.intr&&!v.stative&&!v.noProg);if(!v)return null;
      let ps=[0,1,3,5];if(tense==="together")ps=[3,5];const s=subjPick(ps);
      const t=tense==="pc"&&has("pc")?"pc":tense==="fut"&&has("fut")?"fut":tense==="never"?"pres":tense==="together"?"pres":tense==="pc"?null:"pres";if(!t)return null;
      const A=c.fa;let alts=[];
      const base=CL(v.fr,s,t,{neg:tense==="never"});
      if(tense==="never"){alts=CL(v.fr,s,t,{}).flatMap(x=>{const sp=x.split(" ");return[EL([sp[0],"ne",...sp.slice(1,2),"jamais",...sp.slice(2)]),EL([sp[0],...sp.slice(1,2),"jamais",...sp.slice(2)])];});}
      else if(pos==="also"){alts=base.map(x=>x+" aussi");}
      else for(const a of A){for(const x of base){
        const sp=x.split(" ");
        if(fpos==="post"||fpos==="mid"){ // after the conjugated verb (or auxiliary)
          const i=sp.findIndex((w,j)=>j>0&&!/^(me|te|se|nous|vous|m'|t'|s')$/.test(w));alts.push([...sp.slice(0,i+1),a,...sp.slice(i+1)].join(" "));}
        if(fpos!=="post"&&fpos!=="mid"){alts.push(x+" "+a);alts.push(a+" "+x);alts.push(a+", "+x);}
        if(pos==="maybe")alts.push(EL(["peut-être","que",x]));}}
      let en;const S=cap(s.en);
      if(tense==="never")en=`${S} never ${enV(v,s.p,"pres")}`;
      else if(pos==="also")en=`${S} ${enV(v,s.p,"pres")} too`;
      else if(pos==="maybe")en=`${cap(ae)} ${s.en} will ${v.en[0]}`;
      else if(pos==="modal")en=`${S} ${ae} ${v.en[0]}`;
      else if(pos==="pre")en=`${S} ${ae} ${enV(v,s.p,t==="pc"?"past":"pres")}`;
      else en=`${S} ${t==="fut"?"will "+v.en[0]:enV(v,s.p,t==="pc"?"past":"pres")} ${ae}`;
      return{en,seqs:[[cS(alts)]],skills:[{pres:"pres",pc:"pc",fut:"fut"}[t]],words:[id,v.id]};});}
  if(w.t==="PREP")out.push(()=>prepFrame(id));
  if(w.t==="NUM")out.push(()=>numFrame(id));
  if(w.t==="Q")out.push(()=>qFrame(id));
  if(w.t==="PRON")out.push(()=>{const v=knownV(v=>v.intr&&!v.stative);if(!v)return null;const s={p:w.p,g:"x",en:EN_SUBJ()[w.p]};
    const alts=CL(v.fr,s,"pres").flatMap(x=>[x+" aussi",TONIC[w.p]+" aussi, "+x]);return{en:`${cap(s.en)} ${enV(v,w.p,"pres")} too`,seqs:[[cS(alts)]],skills:["pres"],words:[id,v.id]};});
  return out;}
function prepFrame(id){const c=BYID[id],k=c.en;const subjK=PREP_SUBJ.filter(x=>byEn.get(x)&&known(byEn.get(x))),objK=(PREP_OBJ[k]||[]).filter(x=>byEn.get(x)&&known(byEn.get(x)));
  if(!subjK.length||!objK.length)return null;const sn=nounOf(byEn.get(rnd(subjK))),on=nounOf(byEn.get(rnd(objK)));if(!sn||!on||sn.id===on.id)return null;
  const alts=[];for(const s of NPf(sn,"def"))for(const o of NPf(on,"def"))for(const p of c.fa)alts.push(EL([s,"est",p.replace(/ de$/,""),...(/ de$|^à côté de$|^près de$/.test(p)?["de",o]:[o])]));
  return{en:`The ${sn.en} is ${k} the ${on.en}`,seqs:[[cS(alts)]],skills:["prep","art"],words:[id,sn.id,on.id]};}
function numFrame(id){const c=BYID[id],E=enOf(c);const n=knownN(r=>r[1]!==r[2]&&/thing|animal|person|text/.test(r[3]));if(!n)return null;
  const one=E==="one";const alts=c.fa.map(x=>one?(n.g==="f"?"une "+n.f:"un "+n.f):x+" "+nPl(n.f));
  return{en:`${/^(hundred|thousand|million)$/.test(E)?"a "+E:E} ${one?n.en:n.pl}`,seqs:[[alts]],skills:["num"],words:[id,n.id]};}
function qFrame(id){const k=BYID[id].en;const N=f=>knownN(f||(()=>true));let n;
  switch(k){
    case"where":n=N();return n&&{en:`Where is the ${n.en}?`,seqs:[[NPf(n,"def").flatMap(x=>[EL(["Où","est",x]),EL([x,"est","où"]),EL(["Où","est-ce","que",x,"est"])])]],skills:["ques"],words:[id,n.id]};
    case"what":return{en:"What is this?",seqs:[[["Qu'est-ce que c'est","C'est quoi","Qu'est-ce que c'est que ça","C'est quoi ça"]]],skills:["ques"],words:[id]};
    case"who":n=N(r=>r[3].includes("person"));return n?{en:`Who is the ${n.en}?`,seqs:[[NPf(n,"def").map(x=>EL(["Qui","est",x]))]],skills:["ques"],words:[id,n.id]}:{en:"Who is it?",seqs:[[["Qui est-ce","C'est qui"]]],skills:["ques"],words:[id]};
    case"why":{const v=knownV(v=>v.intr&&!v.stative);if(!v)return null;const s={p:1,g:"x",en:"you"};const cl=CL(v.fr,s,"pres");
      return{en:`Why do you ${v.en[0]}?`,seqs:[[cl.flatMap(x=>[EL(["Pourquoi",x]),EL(["Pourquoi","est-ce","que",x])])]],skills:["ques"],words:[id,v.id]};}
    case"how":n=N(r=>/person|place|food/.test(r[3]));return n&&{en:`How is the ${n.en}?`,seqs:[[NPf(n,"def").flatMap(x=>[EL(["Comment","est",x]),EL([x,"est","comment"])])]],skills:["ques"],words:[id,n.id]};
    case"how many":n=N(r=>r[1]!==r[2]&&/thing|person|animal/.test(r[3]));return n&&{en:`How many ${n.pl}?`,seqs:[[[EL(["Combien","de",nPl(n.f)])]]],skills:["ques"],words:[id,n.id]};
    case"how much":n=N(r=>/thing|food|drink/.test(r[3]));return n&&{en:`How much is the ${n.en}?`,seqs:[[NPf(n,"def").flatMap(x=>[EL(["Combien","coûte",x]),EL([x,"coûte","combien"]),EL(["C'est","combien",x]),EL(["Ça","coûte","combien",x])])]],skills:["ques"],words:[id,n.id]};
    case"which":n=N();return n&&{en:`Which ${n.en}?`,seqs:[[[(n.g==="f"?"Quelle ":"Quel ")+n.f]]],skills:["ques"],words:[id,n.id]};
    case"here":case"there":n=N();return n&&{en:`The ${n.en} is ${k}`,seqs:[[NPf(n,"def").flatMap(x=>(k==="here"?["ici","là"]:["là","là-bas"]).map(a=>EL([x,"est",a])))]],skills:["etre"],words:[id,n.id]};
    case"this":case"that":n=N();return n&&{en:`${k} ${n.en}`,seqs:[[NPf(n,"dem").flatMap(x=>k==="that"?[x,x+"-là"]:[x,x+"-ci"])]],skills:["demo"],words:[id,n.id]};
    case"and":case"or":{const a=N(r=>/food|drink/.test(r[3])),b=N(r=>/food|drink/.test(r[3])&&a&&r[0]!==a.id);if(!a||!b)return null;
      return{en:`${k==="and"?"":"the "}${a.en} ${k} ${k==="and"?"":"the "}${b.en}`.replace(/^ /,"").replace(/^(\w)/,m=>m)+(k==="or"?"?":""),seqs:[[NPf(a,k==="and"?"part":"def").flatMap(x=>NPf(b,k==="and"?"part":"def").flatMap(y=>[x+(k==="and"?" et ":" ou ")+y]))]],skills:["art"],words:[id,a.id,b.id]};}
    case"far":case"near":n=N(r=>/place/.test(r[3]));return n&&{en:`The ${n.en} is ${k}`,seqs:[[NPf(n,"def").flatMap(x=>(k==="far"?["loin"]:["près","tout près","proche"]).map(a=>EL([x,"est",a])))]],skills:["etre"],words:[id,n.id]};
    case"very":{const a=LEX_A.filter(r=>known(r[0]));if(!a.length)return null;const A=adjOf(rnd(a)[0]);return{en:`It is very ${enC(A.en)}`,seqs:[[["C'est très "+A.f]]],skills:["etre"],words:[id,A.id]};}
    case"a lot; much":{const v=knownV(v=>v.intr&&!v.stative);if(!v)return null;const s=subjPick([0,3]);return{en:`${cap(s.en)} ${enV(v,s.p,"pres")} a lot`,seqs:[[cS(CL(v.fr,s,"pres",{obj:"beaucoup"}))]],skills:["pres"],words:[id,v.id]};}
    case"with":case"without":n=N(r=>/person|food|drink|thing/.test(r[3]));return n&&{en:`${k} ${k==="with"?"the ":""}${n.en}`,seqs:[[k==="with"?NPf(n,"def").map(x=>"avec "+x):[ "sans "+n.f]]],skills:["prep"],words:[id,n.id]};}
  return null;}
const PHR=[];
{const idx=new Map();for(const c of CARDS){if(!OBJ.includes(c.deck))continue;for(const f of c.fa){if(!f.includes(" ")){const k=PACKS.fr.norm(f);if(k&&!idx.has(k))idx.set(k,c.id);}}}
 for(const c of CARDS){if(OBJ.includes(c.deck)||c.fa[0].split(/\s+/).length<2)continue;
   const ids=[...new Set(c.fa[0].replace(/[?!.,]/g," ").split(/[\s']+/).map(t=>idx.get(PACKS.fr.norm(t))).filter(Boolean))];if(ids.length)PHR.push({c,ids});}}
function phraseFor(id){const ok=PHR.filter(x=>x.ids.includes(id)&&x.ids.every(o=>o===id||known(o)));if(!ok.length)return null;const x=rnd(ok);return{en:x.c.en,seqs:[[x.c.fa]],skills:[],words:x.ids};}
function askFor(id,lv){
  const has=k=>!SKILLS[k]||SK_LV(k)<=lv;
  const fr=shuffle(framesFor(id,has));
  if(Math.random()<.25){const p=phraseFor(id);if(p)fr.unshift(()=>p);}
  for(const f of fr){let r=null;try{r=f();}catch(e){r=null;}if(r&&r.seqs&&r.seqs[0][0].length)return{...r,target:id,acc:accepts(r.seqs),canon:canon(r.seqs),newId:known(id)?null:id};}
  const p=phraseFor(id);if(p)return{...p,target:id,acc:accepts(p.seqs),canon:canon(p.seqs),newId:known(id)?null:id};
  return null;}
return{skills:SKILLS,genFor:(k,ctx)=>{try{return genFor(k,ctx);}catch(e){return null;}},askFor,sentRank};
}};
