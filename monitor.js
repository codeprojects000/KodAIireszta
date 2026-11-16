'use strict';
(function(){
  const banner=document.querySelector('.brand-banner');
  const lines=Array.from({length:7},(_,i)=>document.getElementById('monitor-line-'+i));
  const cursor=document.getElementById('monitor-cursor');
  if(!banner||lines.some(line=>!line)||!cursor)return;
  const snippets=[
    ['from ideas import create','project = create("Horizon")','def build_with_ai():','    ui = design(theme="dark")','    test(ui)','    return publish(ui)','build_with_ai()'],
    ['const idea = "next project";','const app = await build(idea);','app.add("a little curiosity");','await app.test();','if (app.ready) {','  app.launch();','}'],
    ['def make_something_new():','    learn_one_thing()','    try_a_new_idea()','    fix_and_repeat()','    return "it works!"','','make_something_new()']
  ];
  const reduced=matchMedia('(prefers-reduced-motion: reduce)'),mobile=matchMedia('(max-width: 530px)');
  let timer=null,visible=true,snippet=0,line=0,column=0,wasAllowed=false;
  function allowed(){return !reduced.matches&&(window.portalSettings?.allowMotion()??true);}
  function active(){return allowed()&&!document.hidden&&!mobile.matches&&visible;}
  function clearTimer(){if(timer!==null)clearTimeout(timer);timer=null;}
  function putCursor(){cursor.setAttribute('x',String(column*5.1));cursor.setAttribute('y',String(line*16-7));}
  function staticView(){lines.forEach((element,i)=>element.textContent=snippets[0][i]);cursor.style.display='none';}
  function reset(){line=0;column=0;lines.forEach(element=>element.textContent='');cursor.style.display='';putCursor();}
  function schedule(delay){clearTimer();if(active())timer=setTimeout(tick,delay);}
  function tick(){timer=null;if(!active())return;const code=snippets[snippet];
    if(line>=code.length){snippet=(snippet+1)%snippets.length;reset();schedule(300);return;}
    if(column<code[line].length){column++;lines[line].textContent=code[line].slice(0,column);putCursor();schedule(65);}
    else if(line===code.length-1){line++;schedule(1500);}
    else{line++;column=0;putCursor();schedule(200);}
  }
  function reconcile(){clearTimer();const now=allowed();if(!now){staticView();wasAllowed=false;return;}if(!wasAllowed){snippet=0;reset();}wasAllowed=true;if(active())schedule(200);}
  if('IntersectionObserver'in window){const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;reconcile();},{threshold:.05});observer.observe(banner);}
  document.addEventListener('visibilitychange',reconcile);
  addEventListener('portalsettingschange',reconcile);
  reduced.addEventListener('change',reconcile);mobile.addEventListener('change',reconcile);
  reconcile();
})();
