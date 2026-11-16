'use strict';
(function(){
 const allowed=()=>window.portalSettings?.allowMotion()??false;
 // Native theme transition with an immediate fallback on browsers without the API.
 window.portalThemeChange=apply=>{
   if(!allowed()||!document.startViewTransition){apply();return;}
   const x=innerWidth*.8,y=innerHeight*.2,radius=Math.hypot(innerWidth,innerHeight);
   const change=document.startViewTransition(apply);
   change.ready.then(()=>{document.documentElement.animate({clipPath:[`circle(0px at ${x}px ${y}px)`,`circle(${radius}px at ${x}px ${y}px)`]},{duration:650,easing:'ease-in-out',pseudoElement:'::view-transition-new(root)'});}).catch(()=>{});
 };
 const palette=document.createElement('div');palette.className='accent-palette';palette.setAttribute('role','group');palette.setAttribute('aria-label',document.documentElement.lang==='en'?'Accent colour':'Kolor akcentu');
 const select=document.querySelector('select[name="accent"]');const colors=['#39decf','#b99af5','#72c4f5','#e7be72','#92d5a0'];
 [...select.options].forEach((option,i)=>{const b=document.createElement('button');b.type='button';b.style.setProperty('--swatch',colors[i]);b.setAttribute('aria-label',option.textContent);b.dataset.value=option.value;b.onclick=()=>{select.value=option.value;select.dispatchEvent(new Event('change',{bubbles:true}));};palette.append(b);});select.closest('label').after(palette);
 function paletteState(){palette.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.value===select.value)));}
 addEventListener('portalsettingschange',paletteState);paletteState();
 // The portal starts on touch, without delaying or intercepting external navigation.
 document.addEventListener('pointerdown',e=>{const launch=e.target.closest('a.project-open');if(!launch||!allowed())return;const portal=document.createElement('span');portal.className='launch-portal';portal.setAttribute('aria-hidden','true');portal.style.left=e.clientX+'px';portal.style.top=e.clientY+'px';portal.style.setProperty('--project-accent',getComputedStyle(launch).color);(launch.closest('dialog')||document.body).append(portal);const animation=portal.animate([{transform:'translate(-50%,-50%) scale(.02)',opacity:.9},{transform:'translate(-50%,-50%) scale(1)',opacity:0}],{duration:600,easing:'ease-out'});animation.finished.catch(()=>{}).finally(()=>portal.remove());},{passive:true});
 const hero=document.querySelector('.hero');let point=null,raf=0;
 function stars(){raf=0;const svg=hero.querySelector('.hero-constellation');if(!svg)return;const box=svg.getBoundingClientRect();if(!box.width)return;svg.querySelectorAll('circle').forEach(dot=>{if(!point||!allowed()){dot.style.removeProperty('transform');return;}const x=Number(dot.getAttribute('cx')),y=Number(dot.getAttribute('cy')),px=(point.x-box.left)/box.width*1000,py=(point.y-box.top)/box.height*250,dx=x-px,dy=y-py,d=Math.max(1,Math.hypot(dx,dy)),force=Math.max(0,1-d/170)*18;dot.style.transform=`translate(${dx/d*force}px,${dy/d*force}px)`;});}
 hero.addEventListener('pointermove',e=>{if(!allowed())return;point={x:e.clientX,y:e.clientY};if(!raf)raf=requestAnimationFrame(stars);},{passive:true});hero.addEventListener('pointerleave',()=>{point=null;if(!raf)raf=requestAnimationFrame(stars);});addEventListener('portalsettingschange',()=>{if(!allowed()){point=null;stars();}});
 // Particle logo is built from text samples; the actual brand remains accessible.
 let canvas=null,particleFrame=0;
 function stopParticles(){cancelAnimationFrame(particleFrame);canvas?.remove();canvas=null;}
 function particles(){
   if(!allowed()||document.hidden)return;
   try{if(sessionStorage.getItem('portal-particles-seen'))return;sessionStorage.setItem('portal-particles-seen','1');}catch{}
   canvas=document.createElement('canvas');canvas.className='particle-logo';canvas.width=640;canvas.height=140;canvas.setAttribute('aria-hidden','true');hero.append(canvas);const ctx=canvas.getContext('2d');if(!ctx){stopParticles();return;}
   const sample=document.createElement('canvas');sample.width=640;sample.height=140;const brush=sample.getContext('2d');brush.font='700 52px Segoe UI, sans-serif';brush.textAlign='center';brush.fillText('〈/〉 Kod, AI i reszta',320,85);const pixels=brush.getImageData(0,0,640,140).data,points=[];
   for(let y=30;y<100;y+=5)for(let x=10;x<630;x+=5)if(pixels[(y*640+x)*4+3]>100)points.push({x,y,dx:(Math.random()-.5)*600,dy:(Math.random()-.5)*240});
   const start=performance.now();function paint(now){if(!allowed()||document.hidden||!canvas){stopParticles();return;}const p=Math.min(1,(now-start)/1300),ease=1-Math.pow(1-p,3);ctx.clearRect(0,0,640,140);ctx.fillStyle=getComputedStyle(document.body).getPropertyValue('--accent').trim()||'#39decf';points.forEach(dot=>{ctx.globalAlpha=Math.min(1,p*4)*(p>.8?(1-p)/.2:1);ctx.fillRect(dot.x+dot.dx*(1-ease),dot.y+dot.dy*(1-ease),2.5,2.5);});if(p<1)particleFrame=requestAnimationFrame(paint);else stopParticles();}particleFrame=requestAnimationFrame(paint);
 }
 setTimeout(particles,800);document.addEventListener('visibilitychange',()=>{if(document.hidden)stopParticles();});addEventListener('portalsettingschange',()=>{if(!allowed())stopParticles();});
})();
