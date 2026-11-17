'use strict';
(function(){
 const en=document.documentElement.lang==='en',t=(pl,eng)=>en?eng:pl,motion=()=>window.portalSettings.allowMotion();
 const make=(tag,cls,txt)=>{const x=document.createElement(tag);if(cls)x.className=cls;if(txt)x.textContent=txt;return x;};
 const dialog=make('dialog','project-presentation');dialog.id='project-presentation';dialog.setAttribute('aria-labelledby','presentation-title');
 const toolbar=make('div','presentation-toolbar'),title=make('h2');title.id='presentation-title';const close=make('button','close','×');close.type='button';close.setAttribute('aria-label',t('Zamknij prezentację','Close presentation'));close.onclick=()=>dialog.close();toolbar.append(title,close);
 const modes=make('div','presentation-modes'),content=make('div','presentation-content'),launch=make('a','project-open presentation-launch',t('Uruchom aplikację ↗','Open app ↗'));launch.target='_blank';launch.rel='noopener noreferrer';dialog.append(toolbar,modes,content,launch);document.body.append(dialog);
 let current=null,mode='gallery',observer=null,frame=0,opener=null;
 const modeLabels=[['gallery',t('Galeria 3D','3D gallery')],['layers',t('Warstwy','Layers')],['story',t('Odkrywaj','Explore')]];
 modeLabels.forEach(([value,label])=>{const b=make('button','soft-button',label);b.type='button';b.dataset.mode=value;b.onclick=()=>{mode=value;render();};modes.append(b);});
 function image(src,alt){const img=make('img');img.src=src;img.alt=alt;img.loading='lazy';img.decoding='async';return img;}
 function render(){observer?.disconnect();cancelAnimationFrame(frame);content.replaceChildren();content.onscroll=null;content.scrollTop=0;dialog.dataset.mode=mode;modes.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mode===mode)));const pictures=current.gallery?.length?current.gallery:[{image:current.image,caption:current.title}];
  if(mode==='gallery'){
   const scene=make('div','carousel-scene'),track=make('div','carousel-track'),controls=make('div','carousel-controls'),label=make('span');scene.append(track);let index=0;const slides=pictures.map((p,i)=>{const slide=make('div','carousel-slide');slide.append(image(p.image,p.caption||current.title));track.append(slide);return slide;});
   function paint(){slides.forEach((slide,i)=>{let distance=i-index;slide.style.setProperty('--distance',distance);slide.style.setProperty('--depth',Math.abs(distance));slide.style.setProperty('--slide-opacity',Math.max(.1,1-Math.abs(distance)*.55));slide.style.zIndex=String(10-Math.abs(distance));slide.setAttribute('aria-hidden',String(i!==index));});label.textContent=`${index+1} / ${pictures.length} · ${pictures[index].caption||current.title}`;}
   const previous=make('button','soft-button','←'),next=make('button','soft-button','→');previous.setAttribute('aria-label',t('Poprzedni ekran','Previous screenshot'));next.setAttribute('aria-label',t('Następny ekran','Next screenshot'));previous.onclick=()=>{index=(index-1+pictures.length)%pictures.length;paint();};next.onclick=()=>{index=(index+1)%pictures.length;paint();};previous.disabled=next.disabled=pictures.length<2;controls.append(previous,label,next);content.append(scene,controls);paint();
   let start=null;scene.addEventListener('pointerdown',e=>start={x:e.clientX,y:e.clientY});scene.addEventListener('pointerup',e=>{if(!start)return;const dx=e.clientX-start.x,dy=e.clientY-start.y;start=null;if(Math.abs(dx)>40&&Math.abs(dx)>Math.abs(dy)*1.3)(dx<0?next:previous).click();});scene.addEventListener('pointercancel',()=>start=null);
   scene.tabIndex=0;scene.setAttribute('role','group');scene.setAttribute('aria-label',t('Galeria, użyj strzałek','Gallery, use arrow keys'));scene.onkeydown=e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();(e.key==='ArrowLeft'?previous:next).click();}};
  } else if(mode==='layers'){
   const stage=make('div','layers-scene'),stack=make('div','interface-stack');stage.append(stack);stack.style.setProperty('--spread','0');
   [t('Nawigacja','Navigation'),t('Obszar roboczy','Workspace'),t('Dolna część ekranu','Lower screen')].forEach((label,i)=>{const layer=make('div','interface-layer');layer.style.setProperty('--layer',i);layer.append(image(current.image,''),make('span','layer-label',label));stack.append(layer);});
   const label=make('label','spread-control',t('Rozsuń ekran na warstwy','Separate the screen into layers')),range=make('input');range.type='range';range.min='0';range.max='100';range.value='0';range.setAttribute('aria-label',label.textContent);range.oninput=()=>stack.style.setProperty('--spread',range.value/100);label.append(range);content.append(stage,label,make('p','presentation-note',t('Efekt prezentacyjny: trzy fragmenty rzeczywistego zrzutu ekranu.','Presentation effect: three portions of the actual screenshot.')));
  } else {
   const intro=make('div','story-intro');intro.append(make('p','eyebrow',t('ODKRYWAJ PRZEWIJANIEM','SCROLL TO EXPLORE')),make('h3','',current.title),make('p','',current.description));content.append(intro);
   pictures.forEach((p,i)=>{const section=make('section','story-step');section.append(make('span','story-number',String(i+1).padStart(2,'0')),image(p.image,p.caption||current.title),make('h3','',p.caption||current.title));content.append(section);});
   const update=()=>{frame=0;const viewport=content.getBoundingClientRect();content.querySelectorAll('.story-step').forEach(step=>{const b=step.getBoundingClientRect(),progress=Math.min(1,Math.max(0,(viewport.bottom-b.top)/Math.max(1,viewport.height*.85)));step.style.setProperty('--story-progress',motion()?progress:1);});};content.onscroll=()=>{if(!frame)frame=requestAnimationFrame(update);};requestAnimationFrame(update);
  }
 }
 dialog.addEventListener('close',()=>{observer?.disconnect();cancelAnimationFrame(frame);content.onscroll=null;opener?.focus({preventScroll:true});});
 dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
 window.portalPresentation={open(project){opener=document.activeElement;current=project;title.textContent=project.title;launch.href=project.url;dialog.style.setProperty('--project-accent',project.accent||'var(--accent)');mode='gallery';render();dialog.showModal();}};
})();
