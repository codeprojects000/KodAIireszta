'use strict';
(function(){
  const key='portal-site-settings-v1',english=document.documentElement.lang==='en';
  const defaults={accent:'turquoise',theme:'dark',font:'standard',density:'comfortable',effects:'full',contrast:'standard',previews:'large',mobileOrder:'films',startView:'films',showFilms:true,showProjects:true,showAbout:true,focus:false};
  const choices={accent:['turquoise','purple','blue','amber','green'],theme:['dark','graphite','light'],font:['standard','large'],density:['comfortable','compact'],effects:['full','subtle','off'],contrast:['standard','high'],previews:['small','large'],mobileOrder:['films','projects'],startView:['films','projects','favourites']};
  const colors={turquoise:'#39decf',purple:'#b99af5',blue:'#72c4f5',amber:'#e7be72',green:'#92d5a0'};
  function validate(input){const result={...defaults};if(!input||typeof input!=='object')return result;for(const name of Object.keys(defaults)){if(choices[name]?.includes(input[name]))result[name]=input[name];else if(typeof defaults[name]==='boolean'&&typeof input[name]==='boolean')result[name]=input[name];}return result;}
  let settings={...defaults},canStore=true;
  try{const raw=localStorage.getItem(key);settings=validate(raw?JSON.parse(raw):null);if(!raw&&localStorage.getItem('portal-reading-comfort')==='true')settings.font='large';}catch{canStore=false;}
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const form=document.getElementById('settings-form'),panel=document.getElementById('site-settings'),status=document.getElementById('settings-status');
  function allowMotion(){return !reduced.matches&&settings.effects!=='off'&&!settings.focus;}
  function persist(){try{localStorage.setItem(key,JSON.stringify(settings));canStore=true;}catch{canStore=false;}}
  function apply(){
    const body=document.body;
    body.style.setProperty('--accent',colors[settings.accent]);
    for(const [name,value]of Object.entries(settings))body.dataset[name]=String(value);
    body.dataset.effectiveEffects=allowMotion()?settings.effects:'off';
    body.classList.toggle('reading-comfort',settings.font==='large');
    const sections={showFilms:'materialy',showProjects:'projekty',showAbout:'o-mnie'};
    for(const [name,id]of Object.entries(sections)){const section=document.getElementById(id);if(section)section.hidden=!settings[name];document.querySelectorAll('a[href="#'+id+'"]').forEach(a=>a.hidden=!settings[name]);}
    for(const control of form.elements){const name=control.name;if(!(name in defaults))continue;if(control.type==='checkbox')control.checked=settings[name];else control.value=settings[name];}
    if(!allowMotion())document.querySelectorAll('.reveal,.glow-active,.logo-shine,.intro-once').forEach(node=>{node.classList.remove('glow-active','logo-shine','intro-once');node.classList.add('is-visible');});
    status.textContent=canStore?(english?'Saved on this device.':'Zapisano na tym urządzeniu.'):(english?'Settings work for this visit; this browser blocks saving them.':'Ustawienia działają teraz, ale przeglądarka blokuje ich zapis.');
    dispatchEvent(new Event('portalsettingschange'));
  }
  window.portalSettings={allowMotion,get:()=>({...settings}),defaults:{...defaults},validate};
  form.addEventListener('submit',event=>event.preventDefault());
  form.addEventListener('change',event=>{const control=event.target;if(!(control.name in defaults))return;settings=validate({...settings,[control.name]:control.type==='checkbox'?control.checked:control.value});persist();if(control.name==='theme'&&window.portalThemeChange)window.portalThemeChange(apply);else apply();});
  document.getElementById('settings-open').onclick=()=>panel.showModal();
  document.getElementById('settings-close').onclick=()=>panel.close();
  document.getElementById('settings-reset').onclick=()=>{settings={...defaults};persist();apply();status.textContent=english?'Default settings restored.':'Przywrócono ustawienia domyślne.';};
  panel.addEventListener('click',event=>{if(event.target!==panel)return;const r=panel.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)panel.close();});
  reduced.addEventListener('change',apply);
  apply();
  // Each graphic heading animates once per device, not once on every page load.
  function firstAppearance(heading){const storageKey='portal-heading-seen-'+heading.dataset.intro;let seen=false;try{seen=localStorage.getItem(storageKey)==='true';localStorage.setItem(storageKey,'true');}catch{}if(!seen&&allowMotion())heading.classList.add('intro-once');}
  const headings=document.querySelectorAll('.section-wordmark[data-intro]');
  if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){firstAppearance(entry.target);observer.unobserve(entry.target);}}),{threshold:.5});headings.forEach(heading=>observer.observe(heading));}
  else headings.forEach(firstAppearance);
})();
