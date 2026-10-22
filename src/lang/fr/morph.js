// ---------- French morphology ----------
const HASP=new Set("haricot héros hibou hache honte haut hâte hasard hockey homard haine hall halle hamac hamster handicap hangar harpe hausse hérisson hiérarchie hors huit hurler hutte hollandais hongrois hameau hanche harceler hardi hargne hernie hêtre houx hublot huer huppe hutte hisser honteux".split(" "));
const isVow=w=>{w=(w||"").toLowerCase();if(/^[aeiouyàâäéèêëîïôöùûüœæ]/.test(w))return true;if(w[0]==="h"){const b=w.split(/[\s']/)[0];return !HASP.has(b)&&![...HASP].some(h=>b.startsWith(h)&&b.length<=h.length+3);}return false;};
// join word tokens applying elision and contractions
function EL(toks){
  const t=toks.filter(x=>x!==""&&x!=null);const out=[];
  for(let i=0;i<t.length;i++){
    let w=t[i];const nx=t[i+1];
    if(nx!==undefined&&isVow(nx)&&/^(je|me|te|se|le|la|ne|de|que|jusque|lorsque|puisque)$/.test(w.toLowerCase())){out.push(w.slice(0,-1)+"'"+"\u0001");continue;}
    if(nx!==undefined&&/^si$/i.test(w)&&/^ils?$/i.test(nx)){out.push(w[0]+"'\u0001");continue;}
    out.push(w);}
  let s=out.join(" ").replace(/\u0001 /g,"");
  s=s.replace(/\bde le\b/g,"du").replace(/\bde les\b/g,"des").replace(/\bà le\b/g,"au").replace(/\bà les\b/g,"aux")
     .replace(/\bDe le\b/g,"Du").replace(/\bÀ le\b/g,"Au");
  return s;}
// ---- nouns ----
const PL_X=new Set("bijou caillou chou genou hibou joujou pou".split(" ")),PL_AIL=new Set("travail vitrail corail émail bail soupirail".split(" ")),PL_ALS=new Set("bal carnaval festival récital chacal régal cal".split(" ")),PL_EUS=new Set("pneu bleu émeu".split(" "));
function nPl(w){
  if(w.includes(" ")){const p=w.split(" ");p[0]=nPl(p[0]);return p.join(" ");} // chemin de fer -> chemins de fer
  const IR={"œil":"yeux","ciel":"cieux","monsieur":"messieurs","madame":"mesdames","mademoiselle":"mesdemoiselles"};if(IR[w])return IR[w];
  if(/[sxz]$/.test(w))return w;
  if(/al$/.test(w)&&!PL_ALS.has(w))return w.slice(0,-2)+"aux";
  if(PL_AIL.has(w))return w.slice(0,-3)+"aux";
  if(/(eau|au|eu)$/.test(w)&&!PL_EUS.has(w))return w+"x";
  if(PL_X.has(w))return w+"x";
  return w+"s";}
// ---- adjectives ----
const BAGS=new Set("beau bon grand gros haut jeune joli long mauvais meilleur nouveau petit premier vieux dernier autre vrai faux court".split(" "));
const ADJ_IRR={beau:["beau","belle","bel"],nouveau:["nouveau","nouvelle","nouvel"],vieux:["vieux","vieille","vieil"],fou:["fou","folle","fol"],mou:["mou","molle","mol"],
 blanc:["blanc","blanche"],franc:["franc","franche"],sec:["sec","sèche"],frais:["frais","fraîche"],long:["long","longue"],doux:["doux","douce"],faux:["faux","fausse"],roux:["roux","rousse"],
 gentil:["gentil","gentille"],gros:["gros","grosse"],bas:["bas","basse"],gras:["gras","grasse"],las:["las","lasse"],épais:["épais","épaisse"],public:["public","publique"],grec:["grec","grecque"],turc:["turc","turque"],
 complet:["complet","complète"],secret:["secret","secrète"],inquiet:["inquiet","inquiète"],discret:["discret","discrète"],concret:["concret","concrète"],muet:["muet","muette"],
 favori:["favori","favorite"],malin:["malin","maligne"],bénin:["bénin","bénigne"],jaloux:["jaloux","jalouse"],heureux:["heureux","heureuse"],
 aigu:["aigu","aiguë"],ambigu:["ambigu","ambiguë"],cher:["cher","chère"],fier:["fier","fière"],premier:["premier","première"],dernier:["dernier","dernière"],
 bon:["bon","bonne"],net:["net","nette"],nul:["nul","nulle"],pareil:["pareil","pareille"],cruel:["cruel","cruelle"]};
function aF(m,tag){ // feminine singular
  const t=(tag||"").split(":");if(t[1]==="inv")return m;if(t[1])return t[1];
  if(m.includes(" "))return m.split(" ").map((w,i)=>i===0?aF(w):w).join(" ");
  if(ADJ_IRR[m])return ADJ_IRR[m][1];
  if(/e$/.test(m))return m;
  if(/eux$/.test(m))return m.slice(0,-1)+"se";
  if(/eur$/.test(m)&&/(teur)$/.test(m)&&!/(supérieur|inférieur|extérieur|intérieur|meilleur|majeur|mineur|antérieur|postérieur|ultérieur)$/.test(m))return m.slice(0,-3)+"rice";
  if(/f$/.test(m))return m.slice(0,-1)+"ve";
  if(/er$/.test(m))return m.slice(0,-2)+"ère";
  if(/(el|eil|en|on|et)$/.test(m))return m+m.slice(-1)+"e";
  if(/c$/.test(m))return m.slice(0,-1)+"que";
  return m+"e";}
function aPl(w,fem){if(w.includes(" "))return w.split(" ").map((x,i)=>i===0?aPl(x,fem):x).join(" ");
  if(/[sx]$/.test(w))return w;if(!fem&&/al$/.test(w)&&!/^(final|banal|fatal|natal|naval|glacial)$/.test(w))return w.slice(0,-2)+"aux";if(/eau$/.test(w))return w+"x";return w+"s";}
function aForm(m,tag,g,pl,nextWord){ // agree an adjective
  if((tag||"").includes(":inv"))return m;
  if(!pl&&g!=="f"&&ADJ_IRR[m]&&ADJ_IRR[m][2]&&nextWord&&isVow(nextWord))return ADJ_IRR[m][2];
  const f=g==="f"?aF(m,tag):m;return pl?aPl(f,g==="f"):f;}
// ---- determiners ----
function det(kind,g,pl,w){ // kind: def, ind, dem, part, p0..p5 (possessives)
  if(kind==="def")return pl?"les":(isVow(w)?"l'":g==="f"?"la":"le");
  if(kind==="ind")return pl?"des":g==="f"?"une":"un";
  if(kind==="dem")return pl?"ces":g==="f"?"cette":isVow(w)?"cet":"ce";
  if(kind==="part")return pl?"des":isVow(w)?"de l'":g==="f"?"de la":"du";
  const p=+kind.slice(1);
  if(pl)return["mes","tes","ses","nos","vos","leurs"][p];
  if(g==="f"&&!isVow(w))return["ma","ta","sa","notre","votre","leur"][p];
  return["mon","ton","son","notre","votre","leur"][p];}
const NP=(d,w)=>d.endsWith("'")?d+w:d+" "+w; // determiner + rest
// ---- verbs ----
const SUBJ_PR=["je","tu","il","nous","vous","ils"],SUBJ_F=["je","tu","elle","nous","vous","elles"];
const ETRE=new Set("aller venir arriver partir sortir entrer rentrer monter descendre tomber naître mourir rester retourner devenir revenir parvenir intervenir survenir redevenir repartir ressortir remonter redescendre décéder".split(" "));
const E_GRAVE=/^(.*)e([lmnprstvd]|vr)er$/,EE_DBL=new Set("appeler rappeler jeter rejeter épeler renouveler projeter feuilleter interpeller".split(" "));
// irregular paradigms by suffix: pres(6), pp, fut stem, subj (array or stem), imp (3) optional, aux être
const IRR=[
 ["être",{p:["suis","es","est","sommes","êtes","sont"],pp:"été",f:"ser",s:["sois","sois","soit","soyons","soyez","soient"],imp:["sois","soyons","soyez"],i:"ét",ppr:"étant"}],
 ["avoir",{p:["ai","as","a","avons","avez","ont"],pp:"eu",f:"aur",s:["aie","aies","ait","ayons","ayez","aient"],imp:["aie","ayons","ayez"],ppr:"ayant"}],
 ["aller",{p:["vais","vas","va","allons","allez","vont"],pp:"allé",f:"ir",s:["aille","ailles","aille","allions","alliez","aillent"],imp:["va","allons","allez"]}],
 ["faire",{p:["fais","fais","fait","faisons","faites","font"],pp:"fait",f:"fer",s:"fass"}],
 ["dire",{p:["dis","dis","dit","disons","dites","disent"],pp:"dit",f:"dir",s:"dis"}],
 ["pouvoir",{p:["peux","peux","peut","pouvons","pouvez","peuvent"],pp:"pu",f:"pourr",s:"puiss"}],
 ["vouloir",{p:["veux","veux","veut","voulons","voulez","veulent"],pp:"voulu",f:"voudr",s:["veuille","veuilles","veuille","voulions","vouliez","veuillent"],imp:["veuille","veuillons","veuillez"]}],
 ["savoir",{p:["sais","sais","sait","savons","savez","savent"],pp:"su",f:"saur",s:"sach",imp:["sache","sachons","sachez"],ppr:"sachant"}],
 ["devoir",{p:["dois","dois","doit","devons","devez","doivent"],pp:"dû",f:"devr",s:["doive","doives","doive","devions","deviez","doivent"]}],
 ["falloir",{p:["","","faut","","",""],pp:"fallu",f:"faudr",s:["","","faille","","",""]}],
 ["pleuvoir",{p:["","","pleut","","",""],pp:"plu",f:"pleuvr",s:["","","pleuve","","",""]}],
 ["valoir",{p:["vaux","vaux","vaut","valons","valez","valent"],pp:"valu",f:"vaudr",s:["vaille","vailles","vaille","valions","valiez","vaillent"]}],
 ["venir",{p:["viens","viens","vient","venons","venez","viennent"],pp:"venu",f:"viendr",s:["vienne","viennes","vienne","venions","veniez","viennent"]}],
 ["tenir",{p:["tiens","tiens","tient","tenons","tenez","tiennent"],pp:"tenu",f:"tiendr",s:["tienne","tiennes","tienne","tenions","teniez","tiennent"]}],
 ["prévoir",{p:["prévois","prévois","prévoit","prévoyons","prévoyez","prévoient"],pp:"prévu",f:"prévoir",s:["prévoie","prévoies","prévoie","prévoyions","prévoyiez","prévoient"]}],
 ["voir",{p:["vois","vois","voit","voyons","voyez","voient"],pp:"vu",f:"verr",s:["voie","voies","voie","voyions","voyiez","voient"]}],
 ["prendre",{p:["prends","prends","prend","prenons","prenez","prennent"],pp:"pris",f:"prendr",s:["prenne","prennes","prenne","prenions","preniez","prennent"]}],
 ["mettre",{p:["mets","mets","met","mettons","mettez","mettent"],pp:"mis",f:"mettr",s:"mett"}],
 ["battre",{p:["bats","bats","bat","battons","battez","battent"],pp:"battu",f:"battr",s:"batt"}],
 ["ouvrir",{p:["ouvre","ouvres","ouvre","ouvrons","ouvrez","ouvrent"],pp:"ouvert",f:"ouvrir",s:"ouvr",imp:["ouvre","ouvrons","ouvrez"]}],
 ["couvrir",{p:["couvre","couvres","couvre","couvrons","couvrez","couvrent"],pp:"couvert",f:"couvrir",s:"couvr",imp:["couvre","couvrons","couvrez"]}],
 ["offrir",{p:["offre","offres","offre","offrons","offrez","offrent"],pp:"offert",f:"offrir",s:"offr",imp:["offre","offrons","offrez"]}],
 ["souffrir",{p:["souffre","souffres","souffre","souffrons","souffrez","souffrent"],pp:"souffert",f:"souffrir",s:"souffr",imp:["souffre","souffrons","souffrez"]}],
 ["cueillir",{p:["cueille","cueilles","cueille","cueillons","cueillez","cueillent"],pp:"cueilli",f:"cueiller",s:"cueill",imp:["cueille","cueillons","cueillez"]}],
 ["élire",{p:["élis","élis","élit","élisons","élisez","élisent"],pp:"élu",f:"élir",s:"élis"}],
 ["lire",{p:["lis","lis","lit","lisons","lisez","lisent"],pp:"lu",f:"lir",s:"lis"}],
 ["crire",{p:["cris","cris","crit","crivons","crivez","crivent"],pp:"crit",f:"crir",s:"criv"}],
 ["boire",{p:["bois","bois","boit","buvons","buvez","boivent"],pp:"bu",f:"boir",s:["boive","boives","boive","buvions","buviez","boivent"]}],
 ["naître",{p:["nais","nais","naît","naissons","naissez","naissent"],pp:"né",f:"naîtr",s:"naiss"}],
 ["aître",{p:["ais","ais","aît","aissons","aissez","aissent"],pp:"u",f:"aîtr",s:"aiss",stemPP:1}],
 ["croire",{p:["crois","crois","croit","croyons","croyez","croient"],pp:"cru",f:"croir",s:["croie","croies","croie","croyions","croyiez","croient"]}],
 ["cevoir",{p:["çois","çois","çoit","cevons","cevez","çoivent"],pp:"çu",f:"cevr",s:["çoive","çoives","çoive","cevions","ceviez","çoivent"]}],
 ["courir",{p:["cours","cours","court","courons","courez","courent"],pp:"couru",f:"courr",s:"cour"}],
 ["mourir",{p:["meurs","meurs","meurt","mourons","mourez","meurent"],pp:"mort",f:"mourr",s:["meure","meures","meure","mourions","mouriez","meurent"]}],
 ["vivre",{p:["vis","vis","vit","vivons","vivez","vivent"],pp:"vécu",f:"vivr",s:"viv"}],
 ["suivre",{p:["suis","suis","suit","suivons","suivez","suivent"],pp:"suivi",f:"suivr",s:"suiv"}],
 ["rire",{p:["ris","ris","rit","rions","riez","rient"],pp:"ri",f:"rir",s:["rie","ries","rie","riions","riiez","rient"]}],
 ["nuire",{p:["nuis","nuis","nuit","nuisons","nuisez","nuisent"],pp:"nui",f:"nuir",s:"nuis"}],
 ["uire",{p:["uis","uis","uit","uisons","uisez","uisent"],pp:"uit",f:"uir",s:"uis"}],
 ["plaire",{p:["plais","plais","plaît","plaisons","plaisez","plaisent"],pp:"plu",f:"plair",s:"plais"}],
 ["taire",{p:["tais","tais","tait","taisons","taisez","taisent"],pp:"tu",f:"tair",s:"tais"}],
 ["asseoir",{p:["assieds","assieds","assied","asseyons","asseyez","asseyent"],pp:"assis",f:"assiér",s:"assey",imp:["assieds","asseyons","asseyez"]}],
 ["envoyer",{p:["envoie","envoies","envoie","envoyons","envoyez","envoient"],pp:"envoyé",f:"enverr",s:["envoie","envoies","envoie","envoyions","envoyiez","envoient"],imp:["envoie","envoyons","envoyez"]}],
 ["quérir",{p:["quiers","quiers","quiert","quérons","quérez","quièrent"],pp:"quis",f:"querr",s:["quière","quières","quière","quérions","quériez","quièrent"]}],
 ["soudre",{p:["sous","sous","sout","solvons","solvez","solvent"],pp:"solu",f:"soudr",s:"solv"}],
 ["vaincre",{p:["vaincs","vaincs","vainc","vainquons","vainquez","vainquent"],pp:"vaincu",f:"vaincr",s:"vainqu"}],
 ["fuir",{p:["fuis","fuis","fuit","fuyons","fuyez","fuient"],pp:"fui",f:"fuir",s:["fuie","fuies","fuie","fuyions","fuyiez","fuient"]}],
 ["haïr",{p:["hais","hais","hait","haïssons","haïssez","haïssent"],pp:"haï",f:"haïr",s:"haïss"}],
 ["clure",{p:["clus","clus","clut","cluons","cluez","cluent"],pp:"clu",f:"clur",s:"clu"}],
 ["suffire",{p:["suffis","suffis","suffit","suffisons","suffisez","suffisent"],pp:"suffi",f:"suffir",s:"suffis"}],
 ["rompre",{p:["romps","romps","rompt","rompons","rompez","rompent"],pp:"rompu",f:"rompr",s:"romp"}],
 ["mouvoir",{p:["meus","meus","meut","mouvons","mouvez","meuvent"],pp:"mu",f:"mouvr",s:["meuve","meuves","meuve","mouvions","mouviez","meuvent"]}],
 ["croître",{p:["croîs","croîs","croît","croissons","croissez","croissent"],pp:"crû",f:"croîtr",s:"croiss"}],
 ["traire",{p:["trais","trais","trait","trayons","trayez","traient"],pp:"trait",f:"trair",s:["traie","traies","traie","trayions","trayiez","traient"]}],
 ["coudre",{p:["couds","couds","coud","cousons","cousez","cousent"],pp:"cousu",f:"coudr",s:"cous"}],
 ["conquérir",null]];
const PP_FIX={"inclure":"inclus","dissoudre":"dissous","absoudre":"absous","promouvoir":"promu","émouvoir":"ému","accroître":"accru","décroître":"décru","apprendre":"appris","comprendre":"compris","permettre":"permis","promettre":"promis","admettre":"admis","découvrir":"découvert","recouvrir":"recouvert","disparaître":"disparu","apparaître":"apparu","paraître":"paru","connaître":"connu","reconnaître":"reconnu"};
const SDP=new Set("partir sortir dormir sentir mentir servir ressentir consentir repartir endormir ressortir desservir pressentir démentir".split(" "));
const IR2_NOT=new Set("partir sortir dormir sentir mentir servir ressentir consentir repartir endormir ressortir desservir courir mourir venir tenir ouvrir offrir couvrir souffrir cueillir fuir acquérir conquérir requérir accueillir recueillir découvrir recouvrir devenir revenir obtenir maintenir retenir appartenir contenir soutenir prévenir intervenir parvenir convenir détenir entretenir survenir parcourir secourir concourir accourir bouillir vêtir haïr pressentir démentir".split(" "));
const VCACHE=new Map();
function conj(inf){
  if(VCACHE.has(inf))return VCACHE.get(inf);
  let r;
  // irregular by suffix (longest first)
  let hit=null;for(const[suf,d]of IRR){if(d&&inf.endsWith(suf)&&(!hit||suf.length>hit[0].length))hit=[suf,d];}
  if(inf.endsWith("venir")||inf.endsWith("tenir"))hit=[inf.endsWith("venir")?"venir":"tenir",IRR.find(x=>x[0]===(inf.endsWith("venir")?"venir":"tenir"))[1]];
  if(/(a|e|o)indre$/.test(inf)){const st=inf.slice(0,-4);r={p:[st+"ns",st+"ns",st+"nt",st+"gnons",st+"gnez",st+"gnent"],pp:st+"nt",f:inf.slice(0,-1),s:st+"gn"};}
  else if(SDP.has(inf)){const sg=inf.slice(0,-3),pl=inf.slice(0,-2);r={p:[sg+"s",sg+"s",sg+"t",pl+"ons",pl+"ez",pl+"ent"],pp:pl+"i",f:inf,s:pl};}
  else if(/(cueillir|ccueillir)$/.test(inf)){const st=inf.slice(0,-2);r={p:[st+"e",st+"es",st+"e",st+"ons",st+"ez",st+"ent"],pp:st+"i",f:st+"er",s:st,imp:[st+"e",st+"ons",st+"ez"]};}
  else if(hit&&!(hit[0]==="dire"&&inf!=="dire"&&inf!=="redire"&&!/^(contre|inter|pré|mé)dire$/.test(inf))){
    const pre=inf.slice(0,inf.length-hit[0].length),d=hit[1],A=x=>pre+x;
    r={p:d.p.map(x=>x?A(x):""),pp:A(d.pp),f:A(d.f),s:Array.isArray(d.s)?d.s.map(x=>x?A(x):""):A(d.s),imp:d.imp?d.imp.map(A):null,i:d.i?A(d.i):null,ppr:d.ppr?A(d.ppr):null};
    if(hit[0]==="dire"&&inf!=="redire"&&inf!=="dire")r.p[4]=pre+"disez";
  }
  else if(/^(contre|inter|pré|mé)dire$/.test(inf)){const pre=inf.slice(0,-4);r={p:[pre+"dis",pre+"dis",pre+"dit",pre+"disons",pre+"disez",pre+"disent"],pp:pre+"dit",f:pre+"dir",s:pre+"dis"};}
  else if(/er$/.test(inf)){
    let b=inf.slice(0,-2),bs=b,bf=inf; // bs = stem before mute e, bf = future stem
    if(EE_DBL.has(inf)){bs=b+b.slice(-1);bf=bs+"er";}
    else if(/e[^aeiouyéè]{1,2}$/.test(b)&&!/é[^aeiouy]{1,2}$/.test(b)&&!/(ll|tt|nn|ss|mm)$/.test(b)&&/e([lmnprstvd]|vr|br|cr)$/.test(b)){bs=b.replace(/e([^aeiouyéè]{1,2})$/,"è$1");bf=bs+"er";}
    else if(/é[^aeiouyéè]{1,2}$/.test(b)){bs=b.replace(/é([^aeiouyéè]{1,2})$/,"è$1");bf=inf;}
    else if(/[ou]y$/.test(b)){bs=b.slice(0,-1)+"i";bf=bs+"er";}
    else if(/ay$/.test(b)){bs=b;bf=inf;}
    const bn=/g$/.test(b)?b+"e":/c$/.test(b)?b.slice(0,-1)+"ç":b;
    r={p:[bs+"e",bs+"es",bs+"e",bn+"ons",b+"ez",bs+"ent"],pp:b+"é",f:bf,s:[bs+"e",bs+"es",bs+"e",b+"ions",b+"iez",bs+"ent"],imp:[bs+"e",bn+"ons",b+"ez"],ie:bn,ib:b,ppr:bn+"ant",fAlt:/é[^aeiouy]{1,2}$/.test(b)?bs+"er":null};}
  else if(/ir$/.test(inf)&&!IR2_NOT.has(inf)){
    const b=inf.slice(0,-2);r={p:[b+"is",b+"is",b+"it",b+"issons",b+"issez",b+"issent"],pp:b+"i",f:inf,s:b+"iss"};}
  else if(/re$/.test(inf)){const b=inf.slice(0,-2);r={p:[b+"s",b+"s",b,b+"ons",b+"ez",b+"ent"],pp:b+"u",f:inf.slice(0,-1),s:b};}
  else{const b=inf.slice(0,-2);r={p:[b+"s",b+"s",b+"t",b+"ons",b+"ez",b+"ent"],pp:b+"i",f:inf,s:b};}
  if(PP_FIX[inf])r.pp=PP_FIX[inf];
  if(hit&&hit[1].stemPP)r.pp=PP_FIX[inf]||r.pp;
  // derived tenses
  const nst=r.i||r.p[3].replace(/ons$/,"");
  r.impf=r.i?["ais","ais","ait","ions","iez","aient"].map(e=>r.i+e):r.ie?[r.ie+"ais",r.ie+"ais",r.ie+"ait",r.ib+"ions",r.ib+"iez",r.ie+"aient"]:["ais","ais","ait","ions","iez","aient"].map(e=>nst+e);
  r.fut=["ai","as","a","ons","ez","ont"].map(e=>r.f+e);
  r.cond=["ais","ais","ait","ions","iez","aient"].map(e=>r.f+e);
  if(r.fAlt){r.futAlt=["ai","as","a","ons","ez","ont"].map(e=>r.fAlt+e);r.condAlt=["ais","ais","ait","ions","iez","aient"].map(e=>r.fAlt+e);}
  if(!Array.isArray(r.s)){const st=r.s;r.s=[st+"e",st+"es",st+"e",st+"ions",st+"iez",st+"ent"];}
  if(!r.imp)r.imp=[r.p[1]?r.p[1].replace(/([^s])s$/,/er$/.test(inf)?"$1":"$1s"):"",r.p[3],r.p[4]];
  r.ppr=r.ppr||(nst+"ant");
  r.etre=ETRE.has(inf)||[...ETRE].some(e=>inf.endsWith(e)&&/^(re|de|sur|inter|par)/.test(inf.slice(0,-e.length)));
  VCACHE.set(inf,r);return r;}
// subject pronouns (gender g used for il/elle, ils/elles)
const subj=(p,g)=>g==="f"?SUBJ_F[p]:SUBJ_PR[p];
const REFL=["me","te","se","nous","vous","se"],TONIC=["moi","toi","lui","nous","vous","eux"];
// participle agreement for être / reflexive
function ppAgree(pp,p,g){const pl=p>=3,fem=g==="f";let x=pp;if(fem&&!/e$/.test(x))x+="e";if(pl&&!/[sx]$/.test(x))x+="s";return x;}
// build a finite clause. v={inf,refl}. tense: pres impf fut cond pc pqp futp condp subj subjp fproche imp. Returns array of alternative strings.
function clause(v,p,tense,{neg=false,g="m",obj=null,objPre=null,pron=null,noSubj=false}={}){
  const c=conj(v.inf),R=v.refl,s=subj(p,g);
  const pre=[];if(R)pre.push(REFL[p]);if(pron)pre.push(pron); // clitics before the verb
  const out=[];
  const gens=g==="x"?["m","f"]:[g];
  const auxE=R||c.etre;
  const simple=(form)=>{ // ne + clitics + form + pas
    const base=neg?["ne",...pre,form,"pas"]:[...pre,form];
    return[EL([noSubj?"":s,...base,obj||""]),...(neg?[EL([noSubj?"":s,...pre,form,"pas",obj||""])]:[])];};
  const compound=(auxForms)=>{
    const res=[];
    for(const gg of gens){const pp=auxE?ppAgree(c.pp,p,gg):c.pp;const pps=[pp];if(auxE&&p<3&&gg==="m"&&g==="x"){}
      for(const ax of auxForms){
        res.push(EL([noSubj?"":s,...(neg?["ne",...pre,ax,"pas",pp]:[...pre,ax,pp]),obj||""]));
        if(neg)res.push(EL([noSubj?"":s,...pre,ax,"pas",pp,obj||""]));}}
    return res;};
  const AV=conj("avoir"),ET=conj("être");
  const aux=t=>auxE?ET[t]:AV[t];
  switch(tense){
    case"pres":return simple(c.p[p]);
    case"impf":return simple(c.impf[p]);
    case"fut":return[...simple(c.fut[p]),...(c.futAlt?simple(c.futAlt[p]):[])];
    case"cond":return[...simple(c.cond[p]),...(c.condAlt?simple(c.condAlt[p]):[])];
    case"subj":return simple(c.s[p]);
    case"pc":return compound([aux("p")[p]]);
    case"pqp":return compound([aux("impf")[p]]);
    case"futp":return compound([aux("fut")[p]]);
    case"condp":return compound([aux("cond")[p]]);
    case"subjp":return compound([aux("s")[p]]);
    case"fproche":{const al=conj("aller").p[p];const inf=EL([...pre,v.inf]);
      return neg?[EL([noSubj?"":s,"ne",al,"pas",inf,obj||""]),EL([noSubj?"":s,al,"pas",inf,obj||""])]:[EL([noSubj?"":s,al,inf,obj||""])];}
  }}
// imperative (p: 1=tu, 3=nous, 4=vous)
function imper(v,p,neg,obj){const c=conj(v.inf),k={1:0,3:1,4:2}[p],f=c.imp[k];
  if(v.refl){return neg?[EL(["ne",REFL[p],f,"pas",obj||""])]:[EL([f+"-"+(p===1?"toi":REFL[p]),obj||""])];}
  return neg?[EL(["ne",f,"pas",obj||""]),EL([f,"pas",obj||""])]:[EL([f,obj||""])];}
function infinitive(v,neg){const x=v.refl?EL(["se",v.inf]):v.inf;return neg?"ne pas "+x:x;}
