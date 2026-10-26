// ===================== Persian pronunciation (speech sprint) =====================
// Expected sounds come from the romanization in vocab.txt; the phoneme model's IPA
// output is folded into the same small alphabet so the two can be compared.
// Alphabet: A=ā a e i o u | x=kh S=sh C=ch Z=zh J=j q=gh/q '=glottal | other consonants as written
PACKS.fa.speech=(()=>{
  const VOW=new Set(["A","a","e","i","o","u"]);
  // romanization -> phone list
  function phones(tr){
    let s=String(tr||"").split(" / ")[0].toLowerCase().normalize("NFC")
      .replace(/[’`ʼ]/g,"'").replace(/[?!.,;:()"«»…]/g," ").replace(/-/g,"");
    const out=[];
    for(let i=0;i<s.length;i++){
      const c=s[i],d=s.slice(i,i+2);
      if(c===" "){continue;}
      if(d==="kh"){out.push("x");i++;continue;}
      if(d==="sh"){out.push("S");i++;continue;}
      if(d==="ch"){out.push("C");i++;continue;}
      if(d==="zh"){out.push("Z");i++;continue;}
      if(d==="gh"){out.push("q");i++;continue;}
      if(c==="ā"||c==="â")out.push("A");
      else if(c==="'")out.push("'");
      else if(c==="j")out.push("J");
      else if(c==="w")out.push("v");
      else if(c==="c")out.push("k");
      else if(/[a-z]/.test(c))out.push(c);
    }
    return collapse(out);}
  // merge doubled consonants (the model rarely hears gemination)
  function collapse(a){return a.filter((x,i)=>!(i&&x===a[i-1]&&!VOW.has(x)));}
  // one IPA token from the model -> 0..2 phones in our alphabet
  const MULTI=[["tʃ","C"],["ʧ","C"],["dʒ","J"],["ʤ","J"],["eɪ","e y"],["ej","e y"],["aɪ","a y"],["ɔɪ","o y"],["oʊ","o"],["əʊ","o"],["aʊ","a v"]];
  const ONE={"ɒ":"A","ɑ":"A","ɔ":"A","a":"a","æ":"a","ɐ":"a","ʌ":"a","e":"e","ɛ":"e","ə":"e","ɜ":"e","i":"i","ɪ":"i","ɨ":"i","u":"u","ʊ":"u","ɯ":"u","y":"u","ʉ":"u","o":"o","ɵ":"o","ø":"o",
    "q":"q","ɢ":"q","ɣ":"q","ʁ":"q","x":"x","χ":"x","h":"h","ɦ":"h","ħ":"h","ʔ":"'","ʕ":"'","ʃ":"S","ʒ":"Z","ɾ":"r","r":"r","ɹ":"r","ɻ":"r","ʀ":"r","w":"v","v":"v","ʋ":"v","β":"v",
    "j":"y","ɡ":"g","g":"g","ɟ":"g","k":"k","c":"k","t":"t","d":"d","s":"s","z":"z","f":"f","p":"p","b":"b","m":"m","n":"n","ŋ":"n","ɲ":"n","l":"l","ɫ":"l","ʎ":"l","θ":"s","ð":"z"};
  function fold(tok){
    let t=String(tok).normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[ˈˌ.ˑ‿ʰʲʷ̃]/g,"").replace(/ː/g,"");
    if(!t)return[];
    for(const[k,v]of MULTI)if(t===k)return v.split(" ");
    if(ONE[t])return[ONE[t]];
    // affricate written without tie, or vowel+length leftovers: fold char by char
    const r=[];for(const ch of t){if(ONE[ch])r.push(ONE[ch]);}
    return r.length?r:[t];}
  // IPA string from the model -> phone list
  function heard(ipa){return collapse(String(ipa||"").trim().split(/\s+/).filter(x=>x&&x!=="|").flatMap(fold));}
  // what to print for a phone
  const SHOW={A:"ā",S:"sh",C:"ch",Z:"zh",J:"j",x:"kh",q:"gh","'":"ʼ"};
  const show=p=>SHOW[p]||p;
  const IPA={A:"ɒː",a:"æ",e:"e",i:"iː",o:"o",u:"uː",S:"ʃ",C:"tʃ",Z:"ʒ",J:"dʒ",x:"x",q:"ɢ","'":"ʔ",y:"j",r:"ɾ"};
  const ipa=p=>IPA[p]||p;
  // offline tips: "expected>heard" first, then "expected", "-x" = dropped, "+vowel" = extra vowel
  const TIPS={
    "A>a":"ā is a long, rounded “aw” as in British “law”, not the short a of “cat”.",
    "a>A":"Short a is open and front, like “cat”. Don't round your lips as for ā.",
    "A":"ā: open the jaw, round the lips slightly and hold it longer than the other vowels.",
    "a":"Short a sits at the front of the mouth, like the a in “cat”, and stays short.",
    "e":"Short e as in “bed”. Keep it short and don't glide into “ay”.",
    "i":"i is a clean, long “ee” as in “see”, with no glide at the end.",
    "u":"u is a long “oo” as in “food”, lips well rounded.",
    "o":"o is a pure, short “o” as in Dutch “bot”. Don't slide into “ow”.",
    "q":"gh/q is made far back in the throat, at the uvula. Start from a k and move it further back; a French r is close.",
    "q>g":"You made a g. Move the closure further back, to the uvula, for gh/q.",
    "q>k":"You made a k. Pull it further back to the uvula and add voice for gh/q.",
    "x":"kh is a rough, scraping sound at the back of the mouth, like Dutch g or German “ach”.",
    "x>h":"That came out as a soft h. kh needs friction: scrape the back of the tongue against the soft palate.",
    "x>k":"That came out as a k. Don't close completely; keep the air flowing with friction for kh.",
    "'":"The ʼ is a glottal stop: a tiny catch in the throat, as in “uh-oh”. Don't skip it.",
    "-'":"You skipped the glottal stop. Make a short catch in the throat at the ʼ.",
    "r":"Persian r is a quick tap of the tongue tip, like Spanish “pero”, not an English r.",
    "h":"h is pronounced everywhere, also at the end of a syllable. Breathe it out audibly.",
    "-h":"You dropped the h. In Persian it stays audible, even after a vowel.",
    "S":"sh as in “shoe”.",
    "C":"ch as in “church”.",
    "J":"j as in “jam”.",
    "Z":"zh is the sound in “measure”.",
    "v":"v is a real v, teeth on the lower lip, not an English w.",
    "v>u":"That came out as a w or oo. Touch your upper teeth to your lower lip for v.",
    "y":"y as in “yes”.",
    "+vowel":"You added a vowel between consonants. Persian allows clusters like “st” and “sht”; keep them tight.",
    "-vowel":"A vowel went missing. Give every vowel its full value, especially at the end of a word.",
    "-cons":"A consonant went missing. Pronounce every consonant, including the last one in the word."};
  function tipFor(op){
    const e=op.e,h=op.h;
    if(op.op==="sub")return TIPS[`${e}>${h}`]?[`${e}>${h}`,TIPS[`${e}>${h}`]]:TIPS[e]?[e,TIPS[e]]:null;
    if(op.op==="del"){const k="-"+e;if(TIPS[k])return[k,TIPS[k]];return VOW.has(e)?["-vowel",TIPS["-vowel"]]:["-cons",TIPS["-cons"]];}
    if(op.op==="ins"&&VOW.has(h))return["+vowel",TIPS["+vowel"]];
    return null;}
  return{phones,heard,show,ipa,tipFor,vowels:VOW,lang:"fa"};
})();
