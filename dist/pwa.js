'use strict';
(function(){
 if(new URLSearchParams(location.search||'').has('appearance-preview'))return;
 const en=document.documentElement.lang==='en',panel=document.getElementById('settings-form');
 const install=document.createElement('button');install.type='button';install.className='install-app';install.textContent=en?'＋ Install app':'＋ Zainstaluj aplikację';
 const help=document.createElement('p');help.className='setting-help';panel.append(install,help);let pending=null;
 const standalone=()=>matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
 function status(){install.hidden=standalone();if(standalone())help.textContent=en?'App installed.':'Aplikacja jest zainstalowana.';}
 addEventListener('beforeinstallprompt',event=>{event.preventDefault();pending=event;install.hidden=false;});
 addEventListener('appinstalled',()=>{pending=null;install.hidden=true;help.textContent=en?'App installed.':'Aplikacja zainstalowana.';});
 install.onclick=async()=>{if(!isSecureContext){help.textContent=en?'Installation requires HTTPS. Enable it in GitHub Pages first.':'Instalacja wymaga HTTPS. Najpierw włącz je w GitHub Pages.';return;}if(pending){const prompt=pending;pending=null;await prompt.prompt();const result=await prompt.userChoice;if(result.outcome==='accepted')install.hidden=true;return;}help.textContent=/iPad|iPhone|iPod/.test(navigator.userAgent)?(en?'In Safari: Share → Add to Home Screen → Add.':'W Safari: Udostępnij → Do ekranu początkowego → Dodaj.'):(en?'Open your browser menu and choose Install app or Add to Home screen. Availability depends on your browser.':'Otwórz menu przeglądarki i wybierz Zainstaluj aplikację lub Dodaj do ekranu głównego. Dostępność zależy od przeglądarki.');};
 status();
 if('serviceWorker'in navigator&&isSecureContext&&location.protocol!=='file:')addEventListener('load',()=>{navigator.serviceWorker.register('sw.js').then(registration=>{
   const update=document.createElement('button');update.type='button';update.className='soft-button';update.hidden=true;update.textContent=en?'New version — refresh':'Nowa wersja — odśwież';panel.append(update);
   const check=()=>{update.hidden=!registration.waiting;};check();
   registration.addEventListener('updatefound',()=>{registration.installing?.addEventListener('statechange',check);});
   let requested=false;update.onclick=()=>{requested=true;registration.waiting?.postMessage('SKIP_WAITING');};
   navigator.serviceWorker.addEventListener('controllerchange',()=>{if(requested)location.reload();});
   registration.update().catch(()=>{});
 }).catch(()=>{help.textContent=en?'Offline support is unavailable. You can still use the website.':'Tryb offline jest niedostępny. Strona nadal działa online.';});});
})();
