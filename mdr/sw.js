// MDR offline shell. Built by mdr/build.py (version 280981193a).
// - the app page: network first, cached copy when offline
// - fonts from Google: cache first
const SHELL="mdr-shell",LIBS="mdr-libs";
const LIB_HOSTS=["fonts.googleapis.com","fonts.gstatic.com"];
self.addEventListener("install",e=>{
  e.waitUntil(caches.open(SHELL).then(c=>c.addAll(["./"])).catch(()=>{}).then(()=>self.skipWaiting()));});
self.addEventListener("activate",e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith("mdr-")&&![SHELL,LIBS].includes(k)).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener("fetch",e=>{
  const r=e.request;if(r.method!=="GET")return;
  const u=new URL(r.url);
  if(u.origin===location.origin&&(r.mode==="navigate"||u.pathname.endsWith("/")||u.pathname.endsWith(".html"))){
    e.respondWith(fetch(r,{cache:"no-cache"}).then(res=>{if(res.ok){const cp=res.clone();caches.open(SHELL).then(c=>c.put(r.mode==="navigate"?"./":r,cp));}return res;})
      .catch(()=>caches.match(r).then(m=>m||caches.match("./"))));
    return;}
  if(LIB_HOSTS.includes(u.hostname)){
    e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>{if(res.ok||res.type==="opaque"){const cp=res.clone();caches.open(LIBS).then(c=>c.put(r,cp));}return res;})));}
});
