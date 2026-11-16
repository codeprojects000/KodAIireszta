'use strict';
const fs=require('fs'),path=require('path');
const root=__dirname;
const config=JSON.parse(fs.readFileSync(path.join(root,'site.config.json'),'utf8'));
if(!config.publicUrl)throw Error('Wpisz docelowy adres strony w publicUrl w site.config.json.');
const base=new URL(config.publicUrl.endsWith('/')?config.publicUrl:config.publicUrl+'/');
if(!['https:','http:'].includes(base.protocol)||base.username||base.password||base.search||base.hash)throw Error('Podaj poprawny publiczny adres HTTP(S), bez hasła, parametrów i kotwicy.');
for(const [file,lang] of [['index.html','pl'],['en.html','en']]){
 const target=path.join(root,file);let html=fs.readFileSync(target,'utf8');
 const image=new URL('assets/branding/kod-ai-i-reszta.png',base).href;
 html=html.replace(/(<meta (?:property="og:image"|name="twitter:image") content=")[^"]+("\s*\/>|">)/g,'$1'+image+'$2');
 html=html.replace(/(<link rel="alternate" hreflang="pl" href=")[^"]+("\s*\/>|">)/g,'$1'+new URL('index.html',base).href+'$2');
 html=html.replace(/(<link rel="alternate" hreflang="en" href=")[^"]+("\s*\/>|">)/g,'$1'+new URL('en.html',base).href+'$2');
 html=html.replace(/<link rel="canonical"[^>]*>/g,'');
 html=html.replace('</head>','<link rel="canonical" href="'+new URL(file,base).href+'"></head>');
 fs.writeFileSync(target,html);
}
console.log('Ustawiono publiczne adresy metadanych dla obu wersji.');
