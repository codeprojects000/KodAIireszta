'use strict';
addEventListener('portalready',({detail:{data}})=>{
 const en=document.documentElement.lang==='en';
 data.projects.forEach(project=>{
  const card=document.getElementById('project-'+project.id);if(!card)return;
  const media=document.createElement('div');media.className='project-media';
  const preview=card.querySelector('.project-preview'),controls=card.querySelector('.card-slide-controls');media.append(preview);if(controls)media.append(controls);else {const count=document.createElement('span');count.className='single-slide-label';count.textContent='1 / 1';media.append(count);}
  const copy=document.createElement('div');copy.className='project-copy';[...card.children].forEach(child=>copy.append(child));card.replaceChildren(media,copy);
  const description=copy.querySelector(':scope > p');if(!description)return;
  const full=project.description||'',first=full.split(/\n\s*\n/)[0].trim();
  const sentences=first.match(/[^.!?]+[.!?]+(?:\s|$)|[^.!?]+$/g)||[first];
  let short=sentences.slice(0,2).join(' ').replace(/\s+/g,' ').trim();
  if(short.length>300){const cut=short.lastIndexOf(' ',295);short=short.slice(0,cut>150?cut:295).replace(/[,;:]$/,'')+'…';}
  description.classList.add('project-description');
  if(full.trim()===short)return;
  const summary=document.createElement('p');summary.className='project-summary';summary.textContent=short;
  description.id='project-description-'+project.id;description.hidden=true;const frame=document.createElement('div');frame.className='description-frame';description.before(frame);frame.append(summary,description);let animation=null;
  const toggle=document.createElement('button');toggle.type='button';toggle.className='project-description-toggle';toggle.textContent=en?'More about the app ↓':'Więcej o aplikacji ↓';toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-controls',description.id);
  toggle.onclick=()=>{const before=frame.getBoundingClientRect().height;animation?.cancel();const expanded=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(expanded));description.hidden=!expanded;summary.hidden=expanded;toggle.textContent=expanded?(en?'Less ↑':'Zwiń opis ↑'):(en?'More about the app ↓':'Więcej o aplikacji ↓');if(window.portalSettings.allowMotion()&&window.portalAdvanced?.get().transitions!==false&&frame.animate){animation=frame.animate([{height:before+'px'},{height:frame.getBoundingClientRect().height+'px'}],{duration:280,easing:'cubic-bezier(.2,.8,.2,1)'});animation.finished.catch(()=>{});}};
  frame.after(toggle);
 });
 document.querySelectorAll('.post-card').forEach(card=>{const toggle=card.querySelector('.description-toggle'),frame=card.querySelector('.film-description');if(!toggle||!frame)return;const previous=toggle.onclick;let animation=null;toggle.onclick=event=>{if(!matchMedia('(max-width:760px)').matches){previous.call(toggle,event);return;}const from=frame.getBoundingClientRect().height;animation?.cancel();previous.call(toggle,event);frame.style.transition='none';frame.style.maxHeight=toggle.getAttribute('aria-expanded')==='true'?'none':'5.2em';const to=frame.getBoundingClientRect().height;if(window.portalSettings.allowMotion()&&window.portalAdvanced?.get().transitions!==false&&frame.animate){animation=frame.animate([{height:from+'px',maxHeight:from+'px'},{height:to+'px',maxHeight:to+'px'}],{duration:280,easing:'cubic-bezier(.2,.8,.2,1)'});animation.finished.catch(()=>{});}};});
});
