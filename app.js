'use strict';
(async function () {
  let data = window.PORTAL_CONTENT;
  if (location.protocol !== 'file:') {
    try { const response = await fetch('content.json'); if (!response.ok) throw Error(response.status); data = await response.json(); }
    catch (error) { console.warn('Użyto dołączonej kopii treści.', error); }
  }
  const english = document.documentElement.lang === 'en';
  if (english) data = {...data, ...data.en};
  // Small card images; original screenshots are requested only when a gallery opens.
  function responsiveImage(image, source, sizes) {
    const variants = data.imageVariants?.[source];
    if (!variants?.length) return;
    image.srcset = variants.map(item => item.src + ' ' + item.width + 'w').join(', ');
    image.sizes = sizes;
  }
  document.querySelectorAll('img[src="assets/branding/kod-ai-i-reszta.png"]').forEach(image => {
    responsiveImage(image, 'assets/branding/kod-ai-i-reszta.png', '(max-width: 760px) 100vw, 1200px');
  });
  const words = english ? {open:'Open app',zoom:'Enlarge preview',shot:'App screenshot: ',large:'Enlarged app screenshot: ',details:'Project details',preview:'Enlarge screen: ',watch:'Watch on YouTube',video:'VIDEO',apps:'independent apps',comfortOn:'Disable reading comfort',comfortOff:'Enable reading comfort',screen:'Screen'} : {open:'Uruchom aplikację',zoom:'Powiększ podgląd',shot:'Zrzut ekranu aplikacji ',large:'Powiększony zrzut ekranu: ',details:'Szczegóły projektu',preview:'Powiększ ekran: ',watch:'Oglądaj w YouTube',video:'WIDEO',apps:'autorskie aplikacje',comfortOn:'Wyłącz komfort czytania',comfortOff:'Włącz komfort czytania',screen:'Ekran'};
  const get = id => document.getElementById(id);
  const el = (tag, text, className) => { const node = document.createElement(tag); node.textContent = text; if (className) node.className = className; return node; };
  const safeUrl = value => { try { const url = new URL(value); return ['https:', 'http:'].includes(url.protocol) ? url.href : null; } catch { return null; } };
  const link = (label, url, className) => { const node = el('a', label + ' ↗', className); node.href = url; node.target = '_blank'; node.rel = 'noopener noreferrer'; return node; };
  const preferences = window.portalSettings;
  get('brand').textContent = data.name; get('footer-name').textContent = data.name; document.title = data.name;
  (data.about || []).forEach(text => get('about-text').append(el('p', text)));
  const detail = get('detail'), gallery = get('gallery');
  get('close').onclick = () => detail.close(); get('gallery-close').onclick = () => gallery.close();
  [detail, gallery].forEach(dialog => dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  }));
  function showProject(project) {
    if(window.mobilePortal){window.mobilePortal.openDetail(project);return;}
    get('detail-category').textContent = project.category;
    get('detail-title').textContent = project.title;
    get('detail-body').textContent = project.details;
    get('detail-link').replaceChildren();
    const url = safeUrl(project.url); if (url) get('detail-link').append(link(project.linkLabel || words.open, url, 'project-open'));
    detail.showModal();
  }
  let galleryProject = null, galleryIndex = 0;
  function paintGallery() {
    if (!galleryProject) return;
    const pictures = galleryProject.gallery || [{image:galleryProject.image,caption:galleryProject.title}];
    const picture = pictures[galleryIndex];
    get('gallery-image').src = picture.image;
    get('gallery-image').alt = words.large + galleryProject.title + ' — ' + picture.caption;
    get('gallery-caption').textContent = (galleryIndex + 1) + ' / ' + pictures.length + ' · ' + picture.caption;
    get('gallery-prev').disabled = pictures.length < 2; get('gallery-next').disabled = pictures.length < 2;
    get('gallery-dots').replaceChildren();
    pictures.forEach((item, index) => { const dot = el('button', '', 'gallery-dot'); dot.type = 'button'; dot.setAttribute('aria-label', words.screen + ' ' + (index+1) + ': ' + item.caption); dot.setAttribute('aria-pressed', String(index===galleryIndex)); dot.onclick = () => { galleryIndex = index; paintGallery(); }; get('gallery-dots').append(dot); });
  }
  function moveGallery(step) {
    if (!galleryProject) return;
    const size = (galleryProject.gallery || [galleryProject.image]).length;
    galleryIndex = (galleryIndex + step + size) % size; paintGallery();
  }
  function showGallery(project, source) {
    galleryProject = project; galleryIndex = 0;
    gallery.style.setProperty('--project-accent', project.accent);
    get('gallery-title').textContent = project.title;
    const url = safeUrl(project.url); get('gallery-launch').hidden = !url;
    if (url) get('gallery-launch').href = url;
    paintGallery(); gallery.showModal(); window.portalEffects?.zoom(source, get('gallery-image'), gallery);
  }
  get('gallery-prev').onclick = () => moveGallery(-1); get('gallery-next').onclick = () => moveGallery(1);
  gallery.addEventListener('keydown', event => { if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); moveGallery(event.key === 'ArrowRight' ? 1 : -1); } });
  let swipe = null;
  get('gallery-image').addEventListener('pointerdown', event => { if (event.pointerType==='touch') swipe={x:event.clientX,y:event.clientY}; });
  get('gallery-image').addEventListener('pointerup', event => { if (!swipe) return; const dx=event.clientX-swipe.x,dy=event.clientY-swipe.y; swipe=null; if(Math.abs(dx)>45 && Math.abs(dx)>Math.abs(dy)*1.5) moveGallery(dx<0?1:-1); });
  get('gallery-image').addEventListener('pointercancel', () => {swipe=null;});
  get('filters').hidden = true;
  get('count').textContent = ''; get('count').hidden = true;
  if (!data.projects.length) { const empty = el('div', '', 'projects-empty'); empty.append(el('span', '⟨ / ⟩', 'empty-symbol'), el('h3', english ? 'Something new is coming' : 'Tu powstaje coś nowego'), el('p', english ? 'I am preparing the next projects to share. In the meantime, take a look at the videos.' : 'Przygotowuję kolejne projekty do pokazania. Tymczasem zajrzyj do filmów.')); get('cards').append(empty); }
  data.projects.forEach(project => {
    const card = el('article', '', 'card'); card.id = 'project-' + project.id; card.style.setProperty('--project-accent', project.accent);
    const preview = el('button', '', 'project-preview'); preview.type = 'button'; preview.setAttribute('aria-label', words.preview + project.title);
    const chrome = el('span', '', 'preview-chrome'); chrome.append(el('span', '● ● ●', 'preview-dots'), el('span', project.title, 'preview-label'), el('span', '⤢', 'preview-arrow'));
    const image = el('img', ''); image.src = project.image; responsiveImage(image, project.image, '(max-width: 760px) 90vw, 420px'); image.alt = words.shot + project.title; image.loading = 'lazy'; image.decoding = 'async'; image.width = 1265; image.height = 712;
    preview.append(chrome, image, el('span', words.zoom + ' ⤢', 'preview-hint')); preview.onclick = () => showGallery(project, image);
    card.append(preview, el('span', project.category, 'badge'), el('h3', project.title), el('p', project.description));
    const actions = el('div', '', 'project-actions'); const more = el('button', words.details, 'project-details'); more.type = 'button'; more.onclick = () => showProject(project); actions.append(more);
    const url = safeUrl(project.url); if (url) actions.append(link(project.linkLabel || words.open, url, 'project-open'));
    card.append(actions); get('cards').append(card);
  });
  (data.posts || []).forEach((post, index) => {
    const card = el('article', '', 'post-card'), media = el('div', '', 'post-media'), url = safeUrl(post.url);
    card.id = 'video-' + post.videoId;
    const thumbnail = el('a', '', 'post-thumbnail'); if (url) thumbnail.href = url; thumbnail.target = '_blank'; thumbnail.rel = 'noopener noreferrer'; thumbnail.setAttribute('aria-label', words.watch + ': ' + post.title);
    const image = el('img', ''); image.src = post.thumbnail || ('assets/thumbnails/' + post.videoId + '.jpg'); responsiveImage(image, post.thumbnail || ('assets/thumbnails/' + post.videoId + '.jpg'), '(max-width: 530px) 40vw, 240px'); image.alt = (english ? 'Video thumbnail: ' : 'Miniatura filmu: ') + post.title; image.loading = 'lazy'; image.decoding = 'async'; image.width = 480; image.height = 360; thumbnail.append(image); media.append(thumbnail);
    if (url) { const watch = link(words.watch, url, 'youtube-button'); const icon = el('span', '▶', 'youtube-icon'); icon.setAttribute('aria-hidden', 'true'); watch.prepend(icon); media.append(watch); }
    const text = el('div', '', 'post-copy'); text.append(el('span', String(index + 1).padStart(2, '0') + ' / ' + post.category, 'post-meta'), el('h3', post.title));
    (post.description || post.excerpt).split(String.fromCharCode(10,10)).forEach(paragraph => text.append(el('p', paragraph)));
    const date = post.publishedAt ? new Intl.DateTimeFormat(english ? 'en-GB' : 'pl-PL', {day:'numeric',month:'short',year:'numeric',timeZone:'Europe/Warsaw'}).format(new Date(post.publishedAt)) : '';
    text.append(el('span', [post.duration, date, words.video].filter(Boolean).join(' / '), 'post-duration')); card.append(media, text); get('materials').append(card);
  });
  // Pointer effects are enabled only for a mouse-like pointer and unrestricted motion.
  const pointerEffects = matchMedia('(hover: hover) and (pointer: fine)');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  Array.from(get('cards').children).forEach(card => {
    let frame = 0, point = null;
    function resetGlow() {
      if (frame) cancelAnimationFrame(frame);
      frame = 0; point = null;
      card.classList.remove('glow-active');
      card.style.removeProperty('--glow-x'); card.style.removeProperty('--glow-y');
    }
    card.addEventListener('pointermove', event => {
      if (!pointerEffects.matches || reducedMotion.matches || !preferences.allowMotion() || event.pointerType === 'touch') return;
      point = {x: event.clientX, y: event.clientY};
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0; if (!point) return;
        const bounds = card.getBoundingClientRect();
        card.style.setProperty('--glow-x', (point.x - bounds.left) + 'px');
        card.style.setProperty('--glow-y', (point.y - bounds.top) + 'px');
        card.classList.add('glow-active');
      });
    });
    card.addEventListener('pointerleave', resetGlow);
    card.addEventListener('pointercancel', resetGlow);
    pointerEffects.addEventListener('change', resetGlow);
    reducedMotion.addEventListener('change', resetGlow);
  });
  const banner = document.querySelector('.brand-banner');
  if (banner && !reducedMotion.matches && preferences.allowMotion()) {
    const image = banner.querySelector('img');
    function shine() { if (!reducedMotion.matches && preferences.allowMotion()) banner.classList.add('logo-shine'); }
    if (image && image.complete && image.naturalWidth) shine();
    else if (image) image.addEventListener('load', shine, {once:true});
    reducedMotion.addEventListener('change', () => { if (reducedMotion.matches) banner.classList.remove('logo-shine'); });
  }

  const footerYear = get('footer-year'); if (footerYear) footerYear.textContent = String(new Date().getFullYear());
  // Keep the same content in view across the two static language pages.
  const transitionKey = 'portal-language-position';
  let savedPosition = null;
  try {
    const value = sessionStorage.getItem(transitionKey);
    if (value) {
      sessionStorage.removeItem(transitionKey);
      const candidate = JSON.parse(value);
      if (candidate.target === location.pathname && Date.now() - candidate.savedAt < 30000) savedPosition = candidate;
    }
  } catch {}
  if (savedPosition) {
    requestAnimationFrame(() => requestAnimationFrame(() => {
      const target = savedPosition.anchor ? get(savedPosition.anchor) : null;
      const header = document.querySelector('header');
      const inset = (header ? header.getBoundingClientRect().height : 80) + 16;
      let top = savedPosition.y;
      if (target) { const bounds = target.getBoundingClientRect(); top = scrollY + bounds.top + savedPosition.ratio * bounds.height - inset; }
      document.documentElement.style.scrollBehavior = 'auto';
      scrollTo({top:Math.max(0,top),behavior:'instant'});
      document.documentElement.style.removeProperty('scroll-behavior');
      if (!reducedMotion.matches && preferences.allowMotion()) document.documentElement.classList.add('language-entering');
    }));
  }
  document.querySelectorAll('.language-switch a').forEach(anchor => anchor.addEventListener('click', event => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || anchor.hasAttribute('aria-current')) return;
    const next = new URL(anchor.href, location.href);
    if (next.origin !== location.origin) return;
    const header = document.querySelector('header');
    const inset = (header ? header.getBoundingClientRect().height : 80) + 16;
    const items = Array.from(document.querySelectorAll('.post-card, .card, .about-section'));
    const visible = items.map(item => ({item,bounds:item.getBoundingClientRect()})).filter(({bounds}) => bounds.height > 0 && bounds.top <= inset && bounds.bottom > inset).sort((a,b) => b.bounds.top - a.bounds.top)[0];
    const position = {target:next.pathname,savedAt:Date.now(),y:scrollY,anchor:visible ? visible.item.id : null,ratio:visible ? Math.min(1,Math.max(0,(inset-visible.bounds.top)/visible.bounds.height)) : 0};
    try { sessionStorage.setItem(transitionKey, JSON.stringify(position)); } catch { return; }
    event.preventDefault();
    if (reducedMotion.matches || !preferences.allowMotion()) { location.assign(next.href); return; }
    window.portalEffects?.scatter();
    document.documentElement.classList.add('language-leaving');
    setTimeout(() => location.assign(next.href), 420);
  }));
  addEventListener('pageshow', () => document.documentElement.classList.remove('language-leaving'));

  const toggle = get('menu-toggle'), nav = get('main-nav');
  function closeMenu() { toggle.setAttribute('aria-expanded', 'false'); nav.classList.remove('is-open'); }
  toggle.onclick = () => { const open = toggle.getAttribute('aria-expanded') !== 'true'; toggle.setAttribute('aria-expanded', String(open)); nav.classList.toggle('is-open', open); };
  nav.querySelectorAll('a').forEach(anchor => anchor.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { closeMenu(); toggle.focus(); } });
  document.addEventListener('click', event => { if (!nav.contains(event.target) && !toggle.contains(event.target)) closeMenu(); });
  const wideScreen = matchMedia('(min-width: 761px)'); wideScreen.addEventListener('change', closeMenu);
  if ('IntersectionObserver' in window) {
    const sections = [...document.querySelectorAll('main section[id]')];
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) {
        nav.querySelectorAll('a').forEach(anchor => { if (anchor.getAttribute('href') === '#' + entry.target.id) anchor.setAttribute('aria-current', 'location'); else anchor.removeAttribute('aria-current'); });
      } });
    }, {rootMargin: '-90px 0px -55% 0px', threshold: 0}); sections.forEach(section => observer.observe(section));
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches && preferences.allowMotion()) {
      const reveal = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); reveal.unobserve(entry.target); } }), {threshold: 0.04});
      document.querySelectorAll('.card, .post-card, .about-section').forEach(node => { node.classList.add('reveal'); reveal.observe(node); });
    }
  }
  dispatchEvent(new CustomEvent('portalready',{detail:{data,openProject:showProject,openGallery:showGallery}}));
})();
(function () {
  const progress = document.querySelector('.reading-progress'); if (!progress) return;
  let scheduled = false;
  function update() { const max = document.documentElement.scrollHeight - innerHeight; progress.style.width = (max > 0 ? Math.min(100, Math.max(0, scrollY / max * 100)) : 0) + '%'; scheduled = false; }
  function schedule() { if (!scheduled) { scheduled = true; requestAnimationFrame(update); } }
  addEventListener('scroll', schedule, {passive:true}); addEventListener('resize', schedule); addEventListener('load', schedule); schedule();
})();
