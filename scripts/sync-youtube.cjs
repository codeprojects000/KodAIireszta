'use strict';
const fs = require('node:fs');
const path = require('node:path');
const CHANNEL = /^UC[\w-]{22}$/;
const VIDEO = /^[\w-]{11}$/;
function readJson(file) { return JSON.parse(fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '')); }
function decodeXml(value) {
  return value.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').replace(/&(#x[0-9a-f]+|#\d+|amp|lt|gt|quot|apos);/gi, (_, key) => {
    const named = {amp:'&',lt:'<',gt:'>',quot:'"',apos:"'"};
    if (key[0] !== '#') return named[key.toLowerCase()];
    const code = key[1].toLowerCase() === 'x' ? parseInt(key.slice(2),16) : parseInt(key.slice(1),10);
    return code > 0 && code <= 0x10ffff && !(code>=0xd800&&code<=0xdfff) ? String.fromCodePoint(code) : '';
  }).trim();
}
function tag(xml, name) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = xml.match(new RegExp('<'+escaped+'(?:\\s[^>]*)?>([\\s\\S]*?)<\\/'+escaped+'>'));
  return match ? decodeXml(match[1]) : '';
}
function feedFormat(entry, videoId) {
  for (const [link] of entry.matchAll(/<link\b[^>]*>/g)) {
    const attributes = Object.fromEntries(Array.from(link.matchAll(/([\w:-]+)\s*=\s*(["'])(.*?)\2/g), ([,key,,value]) => [key, decodeXml(value)]));
    if (attributes.rel !== 'alternate') continue;
    try {
      const url = new URL(attributes.href);
      if (!['www.youtube.com','youtube.com'].includes(url.hostname)) continue;
      if (url.pathname.replace(/\/$/,'') === '/shorts/'+videoId) return true;
      if (url.pathname === '/watch' && url.searchParams.get('v') === videoId) return false;
    } catch {}
  }
  return undefined;
}
function parseFeed(xml, channelId) {
  if (!CHANNEL.test(channelId)) throw Error('Invalid channel ID');
  if (xml.length > 2_000_000 || /<!DOCTYPE|<!ENTITY/i.test(xml) || !/<feed(?:\s|>)/.test(xml) || !/<\/feed>/.test(xml)) throw Error('Invalid or oversized Atom feed');
  const entries = Array.from(xml.matchAll(/<entry(?:\s[^>]*)?>([\s\S]*?)<\/entry>/g));
  if (!entries.length) throw Error('The feed is empty: existing content has been preserved');
  const seen = new Set();
  return entries.map(([,entry]) => {
    const videoId = tag(entry,'yt:videoId'), owner = tag(entry,'yt:channelId');
    const title = tag(entry,'title'), publishedAt = tag(entry,'published');
    if (!VIDEO.test(videoId) || owner !== channelId || !title || !Number.isFinite(Date.parse(publishedAt))) throw Error('Invalid video or unexpected channel in feed');
    if (seen.has(videoId)) throw Error('Duplicate video in feed'); seen.add(videoId);
    const rawUpdated = tag(entry,'updated');
    return {videoId,isShort:feedFormat(entry,videoId),title: title.slice(0,300),sourceDescription:tag(entry,'media:description').slice(0,5000),publishedAt:new Date(publishedAt).toISOString(),youtubeUpdatedAt:Number.isFinite(Date.parse(rawUpdated))?new Date(rawUpdated).toISOString():new Date(publishedAt).toISOString()};
  });
}
function shortDescription(value) { const text=(value||'').replace(/\r/g,'').split(/\n\s*\n/).map(x=>x.trim()).find(x=>x&&!/^https?:\/\//i.test(x))||''; return text.length>600?text.slice(0,597).replace(/\s+\S*$/,'')+'…':text; }
function mergeFeed(original, videos, config) {
  const data = structuredClone(original);
  data.posts ||= []; data.en ||= {}; data.en.posts ||= [];
  const ignored = new Set(config.ignoredVideoIds || []);
  let added = 0;
  videos.filter(video=>!ignored.has(video.videoId)).forEach(video => {
    const existing = data.posts.find(post=>post.videoId===video.videoId);
    const thumbnail = 'assets/thumbnails/'+video.videoId+'.jpg';
    const importedDescription = shortDescription(video.sourceDescription);
    const format = (config.regularVideoIds||[]).includes(video.videoId) ? false : (config.shortVideoIds||[]).includes(video.videoId) ? true : typeof video.isShort==='boolean' ? video.isShort : existing?.isShort;
    const url = 'https://www.youtube.com/'+(format===true ? 'shorts/'+video.videoId : 'watch?v='+video.videoId);
    let post = existing;
    if (!post) {
      post = {id:'youtube-'+video.videoId,videoId:video.videoId,title:video.title,category:'Z kanału / YouTube',description:importedDescription||'Nowy materiał na kanale „Kod, AI i reszta”. Obejrzyj film na YouTube.',excerpt:'Nowy materiał na kanale „Kod, AI i reszta”.',duration:'',url,thumbnail,autoImported:true,syncTitle:true,syncDescription:true};
      data.posts.push(post); added++;
    }
    if (post.syncTitle) post.title = video.title;
    if (post.syncDescription && importedDescription) {post.description=importedDescription;post.excerpt=importedDescription;}
    Object.assign(post,{youtubeTitle:video.title,publishedAt:video.publishedAt,youtubeUpdatedAt:video.youtubeUpdatedAt,thumbnail,url});
    if (typeof format==='boolean') post.isShort=format;
    let en = data.en.posts.find(item=>item.videoId===video.videoId);
    if (!en) {
      en = {...post,title:video.title,category:'From the channel / YouTube',description:'A new video from “Kod, AI i reszta”. Watch it on YouTube. The video is in Polish.',excerpt:'A new video from “Kod, AI i reszta”.',autoImported:true,syncTitle:true};
      data.en.posts.push(en);
    }
    if (en.syncTitle) en.title = video.title;
    Object.assign(en,{youtubeTitle:video.title,publishedAt:video.publishedAt,youtubeUpdatedAt:video.youtubeUpdatedAt,thumbnail,url});
    if (typeof format==='boolean') en.isShort=format;
  });
  // Keep older manually curated videos even after they disappear from the limited feed.
  const compare = (a,b)=>(Date.parse(b.publishedAt)||0)-(Date.parse(a.publishedAt)||0);
  data.posts.sort(compare); data.en.posts.sort(compare);
  // Apply explicit corrections to archived entries as well as the latest feed.
  for (const list of [data.posts,data.en.posts]) for (const post of list) {
    if ((config.shortVideoIds||[]).includes(post.videoId)) post.isShort=true;
    if ((config.regularVideoIds||[]).includes(post.videoId)) post.isShort=false;
    if (post.isShort===true) post.url='https://www.youtube.com/shorts/'+post.videoId;
    else if (post.isShort===false) post.url='https://www.youtube.com/watch?v='+post.videoId;
  }
  return {data,added};
}
async function download(url, limit, fetcher) {
  const response = await fetcher(url,{signal:AbortSignal.timeout(25000),headers:{'User-Agent':'Kod-AI-i-reszta-website/1.0'}});
  if (!response.ok) throw Error('HTTP '+response.status+' when fetching '+new URL(url).hostname);
  if (Number(response.headers.get('content-length')||0)>limit) throw Error('Remote file exceeds size limit');
  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.length>limit) throw Error('Remote file exceeds size limit');
  return bytes;
}
function writeChanged(file, content) {
  if (fs.existsSync(file) && fs.readFileSync(file,'utf8')===content) return false;
  const temporary = file+'.sync-tmp'; fs.writeFileSync(temporary,content); fs.renameSync(temporary,file); return true;
}
async function sync(root, options={}) {
  const config = readJson(path.join(root,'youtube.config.json'));
  if (!CHANNEL.test(config.channelId)) throw Error('Set a valid channelId in youtube.config.json');
  const fetcher = options.fetcher || fetch;
  const xml = options.xml ?? (await download('https://www.youtube.com/feeds/videos.xml?channel_id='+config.channelId,2_000_000,fetcher)).toString('utf8');
  const videos = parseFeed(xml, config.channelId);
  const original = readJson(path.join(root,'content.json'));
  const {data,added} = mergeFeed(original,videos,config);
  const json = JSON.stringify(data,null,2);
  if(options.dryRun) return {added,total:data.posts.length,changed:JSON.stringify(original)!==JSON.stringify(data),dryRun:true};
  let downloaded = 0;
  const ignored = new Set(config.ignoredVideoIds||[]);
  // Download all required images before replacing either content file.
  for (const video of videos.filter(video=>!ignored.has(video.videoId))) {
    const target = path.join(root,'assets','thumbnails',video.videoId+'.jpg');
    if (fs.existsSync(target) && !config.refreshThumbnails) continue;
    const bytes = await download('https://i.ytimg.com/vi/'+video.videoId+'/hqdefault.jpg',3_000_000,fetcher);
    if(bytes.length<100 || bytes[0]!==0xff || bytes[1]!==0xd8) throw Error('Invalid JPEG thumbnail; content was not replaced');
    fs.mkdirSync(path.dirname(target),{recursive:true});
    fs.writeFileSync(target+'.sync-tmp',bytes);fs.renameSync(target+'.sync-tmp',target);downloaded++;
  }
  const changed = writeChanged(path.join(root,'content.json'),json);
  writeChanged(path.join(root,'content.js'),'window.PORTAL_CONTENT = '+JSON.stringify(data)+';\n');
  return {added,total:data.posts.length,downloaded,changed};
}
module.exports={parseFeed,mergeFeed,sync};
if(require.main===module){
  const args=process.argv.slice(2),root=path.resolve(__dirname,'..');
  const feedIndex=args.indexOf('--feed');
  const xml=feedIndex<0?undefined:fs.readFileSync(path.resolve(args[feedIndex+1]),'utf8');
  sync(root,{xml,dryRun:args.includes('--dry-run')}).then(result=>console.log(JSON.stringify(result))).catch(error=>{console.error('YouTube sync failed: '+error.message);process.exitCode=1;});
}
