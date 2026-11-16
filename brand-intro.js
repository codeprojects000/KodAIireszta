'use strict';
(function(){
  const brand=document.querySelector('header .brand'),text=document.getElementById('brand-load-text'),percent=document.getElementById('brand-load-percent');
  if(!brand||!text||!percent)return;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let frame=null,started=false,done=false;
  function allowed(){return !reduced.matches&&(window.portalSettings?.allowMotion()??true);}
  function finish(){if(frame!==null)cancelAnimationFrame(frame);frame=null;done=true;brand.classList.remove('is-coding-intro');}
  function start(){
    if(started||done||!allowed())return;
    started=true;brand.classList.add('is-coding-intro');
    const began=performance.now(),label='loading_page';
    function tick(now){
      if(!allowed()){finish();return;}
      const elapsed=now-began;
      text.textContent=label.slice(0,Math.min(label.length,Math.max(0,Math.floor((elapsed-800)/85))));
      const progress=Math.round(Math.min(1,Math.max(0,(elapsed-1700)/3150))*100);
      percent.textContent=progress+'%';
      if(elapsed>=6000){finish();return;}
      frame=requestAnimationFrame(tick);
    }
    frame=requestAnimationFrame(tick);
  }
  reduced.addEventListener('change',()=>{if(!allowed()&&started)finish();});
  addEventListener('portalsettingschange',()=>{if(!allowed()&&started)finish();});
  document.addEventListener('visibilitychange',()=>{if(document.hidden&&started)finish();});
  // A decorative startup sequence, not a real loading indicator or a blocking screen.
  start();
})();
