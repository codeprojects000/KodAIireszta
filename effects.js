'use strict';
(function () {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const allowed = () => !reduced.matches && (window.portalSettings?.allowMotion() ?? true);
  const active = new Set();
  function animate(node, frames, options) {
    if (!node.animate) { node.remove(); return; }
    const animation = node.animate(frames, options); active.add(animation);
    animation.finished.catch(() => {}).finally(() => { active.delete(animation); node.remove(); });
  }
  document.addEventListener('pointerdown', event => {
    if (!allowed() || event.button !== 0 || !event.target.closest('a,button')) return;
    const ring = document.createElement('span'); ring.className = 'touch-wave'; ring.setAttribute('aria-hidden','true');
    ring.style.left = event.clientX + 'px'; ring.style.top = event.clientY + 'px';
    (event.target.closest('dialog[open]') || document.body).append(ring);
    animate(ring,[{transform:'translate(-50%,-50%) scale(.1)',opacity:.8},{transform:'translate(-50%,-50%) scale(1)',opacity:0}],{duration:520,easing:'ease-out'});
    const card = event.target.closest('.card');
    if (card) { card.classList.remove('edge-flash'); void card.offsetWidth; card.classList.add('edge-flash'); }
  }, {passive:true});
  document.addEventListener('animationend', event => { if(event.animationName==='edge-travel') event.target.closest('.card')?.classList.remove('edge-flash'); });
  const hero = document.querySelector('.hero');
  let observer;
  if (hero) {
    const ns='http://www.w3.org/2000/svg', sky=document.createElementNS(ns,'svg');
    sky.classList.add('hero-constellation'); sky.setAttribute('viewBox','0 0 1000 250'); sky.setAttribute('preserveAspectRatio','xMidYMid slice'); sky.setAttribute('aria-hidden','true');
    const points=[[35,45],[135,80],[240,32],[330,110],[470,55],[580,115],[700,35],[810,85],[965,40],[90,205],[240,180],[430,215],[610,190],[800,215],[940,170]];
    const edges=[[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8],[1,9],[9,10],[3,10],[10,11],[11,12],[5,12],[12,13],[7,13],[13,14],[8,14]];
    edges.forEach(([a,b])=>{const line=document.createElementNS(ns,'line');['x1','y1','x2','y2'].forEach((key,i)=>line.setAttribute(key,[...points[a],...points[b]][i]));sky.append(line);});
    points.forEach(([x,y],i)=>{const dot=document.createElementNS(ns,'circle');dot.setAttribute('cx',x);dot.setAttribute('cy',y);dot.setAttribute('r',i%3===0?'2.3':'1.5');dot.style.animationDelay=(-i*.7)+'s';sky.append(dot);});
    hero.prepend(sky);
    if('IntersectionObserver' in window){observer=new IntersectionObserver(entries=>{hero.classList.toggle('sky-visible',entries[0].isIntersecting);});observer.observe(hero);} else hero.classList.add('sky-visible');
  }
  function sync() {
    document.body.classList.toggle('extra-motion-off',!allowed() || document.hidden);
    if(!allowed() || document.hidden){active.forEach(animation=>animation.cancel());document.querySelectorAll('.edge-flash').forEach(card=>card.classList.remove('edge-flash'));}
  }
  reduced.addEventListener('change',sync);addEventListener('portalsettingschange',sync);document.addEventListener('visibilitychange',sync);sync();
  window.portalEffects = {
    scatter() {
      if(!allowed())return;
      const title=document.querySelector('.section-wordmark .wordmark-copy>span') || document.querySelector('h2');
      if(!title)return;
      const box=title.getBoundingClientRect(), text=title.textContent.trim().slice(0,28);
      const overlay=document.createElement('div');overlay.className='language-fragments';overlay.setAttribute('aria-hidden','true');document.body.append(overlay);
      [...text].forEach((letter,i)=>{const fragment=document.createElement('span');fragment.textContent=letter;fragment.style.left=(Math.max(12,box.left)+i*Math.min(18,box.width/text.length))+'px';fragment.style.top=Math.max(90,Math.min(innerHeight-80,box.top))+'px';overlay.append(fragment);const direction=i%2?1:-1;animate(fragment,[{transform:'translate(0,0)',opacity:.7},{transform:`translate(${direction*(20+i*2)}px,${-35-(i%5)*12}px) rotate(${direction*20}deg)`,opacity:0}],{duration:380,easing:'ease-out'});});
      setTimeout(()=>overlay.remove(),450);
    },
    zoom(source,target,dialog) {
      if(!allowed() || !source || !target || !source.naturalWidth)return;
      const from=source.getBoundingClientRect();
      const run=()=>{
        if(!dialog.open || !allowed())return;
        const to=target.getBoundingClientRect();if(!to.width || !to.height || !from.width)return;
        const copy=source.cloneNode();copy.removeAttribute('id');copy.removeAttribute('srcset');copy.src=source.currentSrc || source.src;copy.className='gallery-flight';copy.setAttribute('aria-hidden','true');copy.style.cssText=`left:${to.left}px;top:${to.top}px;width:${to.width}px;height:${to.height}px`;
        dialog.append(copy);
        animate(copy,[{transform:`translate(${from.left-to.left}px,${from.top-to.top}px) scale(${from.width/to.width},${from.height/to.height})`,opacity:1},{transform:'translate(0,0) scale(1)',opacity:1},{transform:'translate(0,0) scale(1)',opacity:0}],{duration:400,easing:'cubic-bezier(.2,.7,.2,1)'});
      };
      if(target.complete && target.naturalWidth)requestAnimationFrame(run);
      else { const expected=target.src;target.addEventListener('load',()=>{if(target.src===expected)requestAnimationFrame(run);},{once:true}); }
    }
  };
})();
