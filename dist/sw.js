'use strict';
const PREFIX='kodai-portal-',VERSION='5a44c593ef12db77',CACHE=PREFIX+VERSION;
const SHELL=['./','index.html','en.html','style.css','mobile.css','app.js','settings.js','content.js','content.json','effects.js','mobile.js','pwa.js','cinema.js','cinema-gl.js','cinema.css','monitor.js','manifest.webmanifest','favicon.svg','assets/icons/icon-192.png','assets/icons/icon-512.png'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(SHELL)));});
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith(PREFIX)&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('message',event=>{if(event.data==='SKIP_WAITING')self.skipWaiting();});
self.addEventListener('fetch',event=>{
 const url=new URL(event.request.url);if(event.request.method!=='GET'||url.origin!==self.location.origin||!url.pathname.startsWith(new URL(self.registration.scope).pathname))return;
 event.respondWith((async()=>{const cache=await caches.open(CACHE);try{const response=await fetch(event.request);if(response.ok&&response.type!=='opaque'){const copy=response.clone();event.waitUntil(cache.put(event.request,copy).then(async()=>{const keys=await cache.keys();if(keys.length>130){const shellPaths=new Set(SHELL.map(p=>new URL(p,self.registration.scope).href));const stale=keys.filter(key=>!shellPaths.has(key.url));await Promise.all(stale.slice(0,Math.max(0,keys.length-130)).map(key=>cache.delete(key)));}}));}return response;}catch{const saved=await cache.match(event.request);if(saved)return saved;if(event.request.mode==='navigate')return (await cache.match(url.pathname.endsWith('en.html')?'en.html':'index.html'))||Response.error();return Response.error();}})());
});
