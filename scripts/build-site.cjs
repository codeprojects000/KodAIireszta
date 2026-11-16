'use strict';
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const out = path.join(root, 'dist');
const config = JSON.parse(fs.readFileSync(path.join(root, 'site.config.json'), 'utf8'));
const base = new URL(config.publicUrl);
if (base.protocol !== 'https:' || base.username || base.password || base.search || base.hash || base.pathname !== '/') throw Error('publicUrl must be an HTTPS origin ending in /.');
if (path.dirname(out) !== root || path.basename(out) !== 'dist') throw Error('Invalid build directory');
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
const files = ['index.html','en.html','style.css','app.js','effects.js','settings.js','monitor.js','content.json','content.js','favicon.svg','mobile.css','mobile.js','pwa.js','manifest.webmanifest','sw.js','cinema.css','cinema-gl.js','cinema.js'];
for (const file of files) fs.copyFileSync(path.join(root, file), path.join(out, file));
for (const dir of ['branding','thumbnails','public-projects','github-projects','responsive','icons','demos']) {
 const src = path.join(root, 'assets', dir);
 if (fs.existsSync(src)) fs.cpSync(src, path.join(out, 'assets', dir), { recursive: true });
}
for (const [file, lang] of [['index.html','pl'],['en.html','en']]) {
 const target = path.join(out, file);
 let html = fs.readFileSync(target, 'utf8');
 const image = new URL('assets/branding/kod-ai-i-reszta.png', base).href;
 html = html.replace(/(<meta (?:property="og:image"|name="twitter:image") content=")[^"]+("\s*\/?>)/g, '$1'+image+'$2');
 html = html.replace(/(<link rel="alternate" hreflang="pl" href=")[^"]+("\s*\/?>)/g, '$1'+base.href+'$2');
 html = html.replace(/(<link rel="alternate" hreflang="en" href=")[^"]+("\s*\/?>)/g, '$1'+new URL('en.html',base).href+'$2');
 html = html.replace(/<link rel="canonical"[^>]*>/g, '');
 html = html.replace('</head>', '<link rel="canonical" href="'+new URL(lang==='pl'?'':'en.html',base).href+'"></head>');
 fs.writeFileSync(target, html);
}
fs.writeFileSync(path.join(out, 'robots.txt'), 'User-agent: *\nAllow: /\nSitemap: '+new URL('sitemap.xml',base).href+'\n');
fs.writeFileSync(path.join(out, 'sitemap.xml'), '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>'+base.href+'</loc></url><url><loc>'+new URL('en.html',base).href+'</loc></url></urlset>\n');
fs.writeFileSync(path.join(out, '_headers'), '/content.json\n  Cache-Control: public, max-age=0, must-revalidate\n/content.js\n  Cache-Control: public, max-age=0, must-revalidate\n');
console.log('Built static site: dist ('+base.href+')');

// Content-derived worker version also changes after automated content refreshes.
const crypto=require('node:crypto');const hash=crypto.createHash('sha256');
for(const file of files.filter(x=>x!=='sw.js'))hash.update(fs.readFileSync(path.join(out,file)));
const worker=fs.readFileSync(path.join(out,'sw.js'),'utf8').replace('__BUILD_ID__',hash.digest('hex').slice(0,16));
fs.writeFileSync(path.join(out,'sw.js'),worker);
