// MDRupdates offline shell: the app page is network first, cached copy when offline.
const SHELL="mdrupd-shell";
self.addEventListener("install",e=>{
  e.waitUntil(caches.open(SHELL).then(c=>c.addAll(["./"])).catch(()=>{}).then(()=>self.skipWaiting()));});
self.addEventListener("activate",e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith("mdrupd-")&&k!==SHELL).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener("fetch",e=>{
  const r=e.request;if(r.method!=="GET")return;
  const u=new URL(r.url);
  if(u.origin===location.origin&&(r.mode==="navigate"||u.pathname.endsWith("/")||u.pathname.endsWith(".html"))){
    e.respondWith(fetch(r,{cache:"no-cache"}).then(res=>{if(res.ok){const cp=res.clone();caches.open(SHELL).then(c=>c.put(r.mode==="navigate"?"./":r,cp));}return res;})
      .catch(()=>caches.match(r).then(m=>m||caches.match("./"))));
  }
});
