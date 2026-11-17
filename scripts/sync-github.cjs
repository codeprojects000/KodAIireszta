'use strict';
const fs=require('node:fs'),path=require('node:path');
const metadata=require('./project-metadata.cjs');
const readJson=file=>JSON.parse(fs.readFileSync(file,'utf8').replace(/^\uFEFF/,''));
const userPattern=/^[a-z\d](?:[a-z\d-]{0,37}[a-z\d])?$/i;
const repoPattern=/^[\w.-]{1,100}$/;
function escapeXml(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));}
function cleanText(value,max=800){return typeof value==='string'?value.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g,'').trim().slice(0,max):'';}
function projectId(name){return 'github-'+Buffer.from(name.toLowerCase()).toString('hex');}
function publicRepos(repos,config,current=''){
 const excluded=new Set((config.exclude||[]).map(x=>x.toLowerCase()));
 return repos.filter(repo=>repo.owner?.login?.toLowerCase()===config.owner.toLowerCase()&&!repo.private&&repo.visibility!=='private'&&repoPattern.test(repo.name)&&!repo.disabled&&(!repo.fork||config.includeForks)&&(!repo.archived||config.includeArchived)&&!excluded.has(repo.name.toLowerCase())&&repo.full_name?.toLowerCase()!==current.toLowerCase());
}
function safeWebsite(value,owner){try{const url=new URL(value);if(url.protocol!=='https:'||url.username||url.password)return null;if(url.hostname!==owner.toLowerCase()+'.github.io')return null;return url.href;}catch{return null;}}
function validateManifest(raw,repo){
 if(!raw||typeof raw!=='object'||Array.isArray(raw))return {};
 if(raw.hidden===true)return {hidden:true};
 const out={};
 for(const key of ['title','description','details','descriptionEn','detailsEn'])if(raw[key])out[key]=cleanText(raw[key],key.startsWith('details')?4000:800);
 if(typeof raw.manual==='boolean')out.manual=raw.manual;
 if(raw.screenshots)out.screenshots=metadata.screenshotOptions(raw.screenshots);
 if(raw.image){const file=String(raw.image);if(/^[\w./-]+\.(?:png|jpe?g|webp)$/i.test(file)&&!file.split('/').includes('..')&&!file.startsWith('/'))out.image=file;}
 return out;
}
async function request(url,options={}){
 const target=new URL(url);const headers={'User-Agent':'Kod-AI-i-reszta-portal/1.0'};
 // The optional Actions token is sent only to the GitHub API, never to app pages or raw assets.
 if(target.hostname==='api.github.com'){headers.Accept='application/vnd.github+json';headers['X-GitHub-Api-Version']='2026-03-10';if(options.token)headers.Authorization='Bearer '+options.token;}
 const r=await options.fetcher(url,{headers,signal:AbortSignal.timeout(20000),redirect:'follow'});
 return r;
}
async function apiJson(url,options,optional=false){const r=await request(url,options);if(optional&&r.status===404)return null;if(!r.ok)throw Error('GitHub API HTTP '+r.status);const text=await r.text();if(text.length>5_000_000)throw Error('Oversized API response');return JSON.parse(text);}
async function listRepos(config,options){const result=[];for(let page=1;page<=20;page++){const batch=await apiJson('https://api.github.com/users/'+encodeURIComponent(config.owner)+'/repos?type=owner&sort=full_name&per_page=100&page='+page,options);if(!Array.isArray(batch))throw Error('Invalid repository list');result.push(...batch);if(batch.length<100)return result;}throw Error('Repository pagination limit reached; content preserved');}
async function readManifest(repo,config,options){const file=config.manifestFile||'portal.json';if(!/^[\w.-]+\.json$/.test(file))throw Error('Invalid manifest filename');const raw=await apiJson('https://api.github.com/repos/'+encodeURIComponent(config.owner)+'/'+encodeURIComponent(repo.name)+'/contents/'+encodeURIComponent(file),options,true);if(!raw)return {};if(raw.encoding!=='base64'||!raw.content||raw.size>50000)throw Error('Invalid project manifest in '+repo.name);return validateManifest(JSON.parse(Buffer.from(raw.content.replace(/\s/g,''),'base64').toString('utf8')),repo);}
async function readReadme(repo,config,options){const raw=await apiJson('https://api.github.com/repos/'+encodeURIComponent(config.owner)+'/'+encodeURIComponent(repo.name)+'/readme?ref='+encodeURIComponent(repo.default_branch||'main'),options,true);if(!raw)return '';if(raw.encoding!=='base64'||typeof raw.content!=='string'||raw.size>250000)return '';return Buffer.from(raw.content.replace(/\s/g,''),'base64').toString('utf8').slice(0,100000);}
async function verifyApp(repo,config,options){
 const candidate=safeWebsite(repo.homepage,config.owner)||(repo.has_pages?'https://'+config.owner.toLowerCase()+'.github.io/'+encodeURIComponent(repo.name)+'/':null);
 if(!candidate)return null;
 const r=await request(candidate,options);
 if(!r.ok)return null;
 return safeWebsite(r.url||candidate,config.owner);
}
function fallbackImage(repo,title){const letters=title.replace(/[^\p{L}\p{N} ]/gu,'').split(/\s+/).slice(0,2).map(x=>x[0]||'').join('').toUpperCase();return `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720"><defs><radialGradient id="g"><stop stop-color="#1c665a"/><stop offset="1" stop-color="#0b1416"/></radialGradient></defs><rect width="1280" height="720" fill="url(#g)"/><rect x="260" y="100" width="760" height="520" rx="30" fill="#ffffff06" stroke="#39decf44"/><text x="640" y="350" text-anchor="middle" font-family="system-ui,sans-serif" font-size="130" font-weight="600" fill="#81e6cf">${escapeXml(letters||'&lt;/&gt;')}</text><text x="640" y="445" text-anchor="middle" font-family="system-ui,sans-serif" font-size="38" fill="#d2e9dd">${escapeXml(title.slice(0,38))}</text><text x="640" y="520" text-anchor="middle" font-family="monospace" font-size="20" fill="#7aa998">${escapeXml(repo.owner.login+'/'+repo.name)}</text></svg>`;}
function mergeProjects(original,entries,config){
 const data=structuredClone(original);data.projects||=[];data.en||={};data.en.projects||=[];
 const all=data.projects;const inOwner=project=>{try{return new URL(project.repositoryUrl).pathname.toLowerCase().startsWith('/'+config.owner.toLowerCase()+'/');}catch{return false;}};
 let added=0;const assets=[];
 for(const {repo,manifest={},appUrl,readme=''}of entries){
  const repositoryUrl='https://github.com/'+config.owner+'/'+repo.name;
  let existing=all.find(x=>x.repositoryUrl?.toLowerCase()===repositoryUrl.toLowerCase());
  if(manifest.hidden){data.projects=data.projects.filter(x=>x.repositoryUrl?.toLowerCase()!==repositoryUrl.toLowerCase());data.en.projects=data.en.projects.filter(x=>x.repositoryUrl?.toLowerCase()!==repositoryUrl.toLowerCase());continue;}
  const inferred=metadata.infer({repo,readme,page:existing?.automation?.page||{}});const title=manifest.title||existing?.title||inferred.title||repo.name;const freshTitle=manifest.title||inferred.title||title;
  let item=existing;
  if(!item){const image='assets/github-projects/'+projectId(repo.name)+'.svg';item={id:projectId(repo.name),title,category:appUrl?'Opublikowane':'Kod źródłowy',accent:'#39decf',image,gallery:[{image,caption:'Projekt na GitHubie',captionEn:'Project on GitHub'}],description:cleanText(repo.description)||'Nowy projekt z mojego publicznego profilu GitHub.',details:cleanText(repo.description)||'Projekt jest dostępny w publicznym repozytorium GitHub.',repositoryUrl,autoImported:true};data.projects.push(item);assets.push({file:image,content:fallbackImage(repo,title)});added++;}
  // Preserve authored descriptions and galleries; auto-imported metadata follows the repository.
  if(item.autoImported && item.image==='assets/github-projects/'+projectId(repo.name)+'.svg' && !assets.some(x=>x.file===item.image))assets.push({file:item.image,content:fallbackImage(repo,title)});
  item.automation||={};item.automation.locks||={};
  for(const field of ['title','description','details']){const previous=item.automation.generated?.[field];if(previous!==undefined&&item[field]!==previous)item.automation.locks[field]=true;}
  if(typeof manifest.manual==='boolean')item.automation.manual=manifest.manual;
  if(item.autoImported&&!item.automation.manual){
   const candidates={title:freshTitle,description:manifest.description||inferred.description||item.description,details:manifest.details||manifest.description||inferred.details||item.details};
   for(const field of ['title','description','details'])if(!item.automation.locks[field])item[field]=candidates[field];
   item.automation.generated={title:item.title,description:item.description,details:item.details};
  }
  if(manifest.screenshots)item.automation.screenshotOptions=manifest.screenshots;
  if(manifest.image)item.automation.imageLocked=true;else if(manifest.screenshots?.enabled===true&&manifest.screenshots.locked===false)item.automation.imageLocked=false;
  item.automation.sources=inferred.sources;
  if(readme)item.automation.readme={title:inferred.title,description:inferred.description,details:inferred.details};
  if(manifest.title){item.title=manifest.title;item.automation.locks.title=true;}if(manifest.description){item.description=manifest.description;item.automation.locks.description=true;}if(manifest.details){item.details=manifest.details;item.automation.locks.details=true;}
  if(item.autoImported&&item.image==='assets/github-projects/'+projectId(repo.name)+'.svg'){const cover=assets.find(asset=>asset.file===item.image);if(cover)cover.content=fallbackImage(repo,item.title);}
  Object.assign(item,{repositoryUrl,url:appUrl||repositoryUrl,category:appUrl?'Opublikowane':'Kod źródłowy',linkLabel:appUrl?(!item.autoImported && item.category==='Opublikowane' && item.linkLabel ? item.linkLabel : 'Uruchom '+item.title):'Zobacz kod na GitHub',githubUpdatedAt:repo.pushed_at||repo.updated_at,githubDefaultBranch:repo.default_branch});
  let en=data.en.projects.find(x=>x.id===item.id);
  if(!en){en={...item,description:'Explore “'+item.title+'”, a project from my public GitHub profile.',details:'Open the app or browse its public source repository to find out more.',gallery:item.gallery.map(x=>({...x,caption:x.captionEn||'Project preview'})),autoImported:true};data.en.projects.push(en);}
  Object.assign(en,{title:item.title,repositoryUrl,url:item.url,category:appUrl?'Published':'Source code',linkLabel:appUrl?(!en.autoImported && en.category==='Published' && en.linkLabel ? en.linkLabel : 'Open '+item.title):'View source on GitHub',githubUpdatedAt:item.githubUpdatedAt,githubDefaultBranch:item.githubDefaultBranch});
  if(manifest.descriptionEn)en.description=manifest.descriptionEn;if(manifest.detailsEn)en.details=manifest.detailsEn;
 }
 // Removed/private repositories must not retain working portal links after a successful complete listing.
 const publicNames=new Set(entries.filter(e=>!e.manifest?.hidden).map(e=>('https://github.com/'+config.owner+'/'+e.repo.name).toLowerCase()));
 data.projects=data.projects.filter(x=>!inOwner(x)||publicNames.has(x.repositoryUrl?.toLowerCase()));
 data.en.projects=data.en.projects.filter(x=>!inOwner(x)||publicNames.has(x.repositoryUrl?.toLowerCase()));
 return {data,assets,added};
}
async function sync(root,opts={}){
 const config=readJson(path.join(root,'github.config.json'));if(!userPattern.test(config.owner))throw Error('Invalid public GitHub owner');
 const options={fetcher:opts.fetcher||fetch,token:opts.token??process.env.GITHUB_TOKEN};
 const repos=publicRepos(opts.repos||await listRepos(config,options),config,process.env.GITHUB_REPOSITORY||'');
 const local=metadata.overrides(root);const entries=[];for(const repo of repos){const remote=await readManifest(repo,config,options);const manifest=validateManifest({...remote,...(local[repo.name]||local[repo.name.toLowerCase()]||{})},repo);const appUrl=manifest.hidden?null:await verifyApp(repo,config,options);const readme=manifest.hidden?'':await readReadme(repo,config,options);entries.push({repo,manifest,appUrl,readme});}
 const original=readJson(path.join(root,'content.json'));const {data,assets,added}=mergeProjects(original,entries,config);
 if(opts.dryRun)return {added,total:data.projects.length,dryRun:true};
 // Optional portal.json image is copied from this repository only; remote arbitrary URLs are not accepted.
 for(const entry of entries){if(!entry.manifest.image||entry.manifest.hidden)continue;const repo=entry.repo;const branch=repo.default_branch||'main';const url='https://raw.githubusercontent.com/'+encodeURIComponent(config.owner)+'/'+encodeURIComponent(repo.name)+'/'+encodeURIComponent(branch)+'/'+entry.manifest.image.split('/').map(encodeURIComponent).join('/');const r=await request(url,options);if(!r.ok)throw Error('Cannot download project preview from '+repo.name);const bytes=Buffer.from(await r.arrayBuffer());if(bytes.length>3_000_000||bytes.length<32)throw Error('Invalid project preview size');const extension=path.extname(entry.manifest.image).toLowerCase();const valid=extension==='.png'?bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])):extension==='.webp'?bytes.toString('ascii',0,4)==='RIFF'&&bytes.toString('ascii',8,12)==='WEBP':bytes[0]===255&&bytes[1]===216;if(!valid)throw Error('Invalid preview image');const file='assets/github-projects/'+projectId(repo.name)+extension;const item=data.projects.find(x=>x.repositoryUrl==='https://github.com/'+config.owner+'/'+repo.name);const en=data.en.projects.find(x=>x.id===item.id);item.image=file;item.gallery=[{image:file,caption:'Podgląd projektu',captionEn:'Project preview'}];en.image=file;en.gallery=[{image:file,caption:'Project preview',captionEn:'Project preview'}];assets.push({file,content:bytes});}
 for(const asset of assets){const target=path.resolve(root,asset.file);if(!target.startsWith(path.resolve(root)+path.sep))throw Error('Invalid asset path');fs.mkdirSync(path.dirname(target),{recursive:true});if(!fs.existsSync(target)||!fs.readFileSync(target).equals(Buffer.from(asset.content)))fs.writeFileSync(target,asset.content);}
 const json=JSON.stringify(data,null,2);const changed=JSON.stringify(original)!==JSON.stringify(data);
 if(changed)fs.writeFileSync(path.join(root,'content.json'),json);
 const js='window.PORTAL_CONTENT = '+JSON.stringify(data)+';\n';if(!fs.existsSync(path.join(root,'content.js'))||fs.readFileSync(path.join(root,'content.js'),'utf8')!==js)fs.writeFileSync(path.join(root,'content.js'),js);
 return {added,total:data.projects.length,changed};
}
module.exports={publicRepos,validateManifest,mergeProjects,sync};
if(require.main===module)sync(path.resolve(__dirname,'..'),{dryRun:process.argv.includes('--dry-run')}).then(x=>console.log(JSON.stringify(x))).catch(e=>{console.error('GitHub sync failed: '+e.message);process.exitCode=1});
