(()=>{
const $=s=>document.querySelector(s);
const ld=(k,d)=>{try{return JSON.parse(localStorage.getItem('gh_'+k))??d}catch{return d}};
const sv=(k,v)=>{try{localStorage.setItem('gh_'+k,JSON.stringify(v))}catch{}};
const h=(t,p={},...k)=>{const e=document.createElement(t);for(const i in p){if(i==='on')for(const x in p.on)e.addEventListener(x,p.on[x]);else if(i in e&&i!=='style')e[i]=p[i];else e.setAttribute(i,p[i])}k.flat().forEach(c=>e.append(c));return e};
let S={},G=[],cat='All',q='',fav=ld('fav',[]),rec=ld('rec',[]),prefs=ld('prefs',{music:true}),busy=false,music=null,musicOk=true;
const FALL='data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="#222a52"/><text x="50" y="62" font-size="40" text-anchor="middle">🎮</text></svg>');
const safe=p=>typeof p==='string'&&p&&!/^([a-z]+:|\/|\\)/i.test(p)&&!p.includes('..')&&!p.includes('\\');
const toast=m=>{const t=$('#toast');t.textContent=m;t.classList.add('on');setTimeout(()=>t.classList.remove('on'),2500)};
const img=(s,a='')=>h('img',{src:safe(s)?s:FALL,alt:a,loading:'lazy',on:{error(e){e.target.onerror=null;e.target.src=FALL}}});
function validate(list){const ids=new Set(),ok=[];list.forEach((g,i)=>{const e=[];
 if(!g||typeof g.id!=='string'||!g.id)e.push('id');else if(ids.has(g.id))e.push('duplicate id');
 if(!g||!g.title)e.push('title');if(!g||!safe(g.folder)||!safe(g.entry))e.push('path');
 if(e.length)console.error('[Hub] Invalid game #'+i,e.join(', '),g);else{ids.add(g.id);if(g.enabled!==false)ok.push(g)}});
 if(ok.length!==list.length)console.warn('[Hub] Some games skipped/disabled');return ok}
const url=g=>g.folder.replace(/\/?$/,'/')+g.entry;
function badges(g){const m=g.modes||{single:true};const a=[h('span',{className:'bd',textContent:g.category||'Game'})];
 if(m.single!==false)a.push(h('span',{className:'bd',textContent:'👤 1 Player'}));
 if(m.multi)a.push(h('span',{className:'bd',textContent:'👥 2 Players'}));else a.push(h('span',{className:'bd soon',textContent:'👥 2P Coming Soon'}));
 if(g.featured)a.push(h('span',{className:'bd f',textContent:'★ Featured'}));return a}
function card(g){const f=fav.includes(g.id);
 return h('article',{className:'card'},img(g.logo,g.title),
 h('button',{className:'fav',textContent:f?'❤️':'🤍','aria-label':'Favorite',on:{click(e){e.stopPropagation();toggleFav(g.id)}}}),
 h('h3',{textContent:g.title}),h('div',{},badges(g)),h('p',{textContent:g.description||''}),
 h('button',{className:'btn',textContent:'▶ Play',on:{click(){play(g)}}}))}
function toggleFav(id){fav=fav.includes(id)?fav.filter(x=>x!==id):[...fav,id];sv('fav',fav);render()}
function render(){const app=$('#app');app.textContent='';
 if(!G.length){app.append(h('div',{className:'empty',textContent:'No games found. Check data/games.json'}));return}
 const feat=G.filter(g=>g.featured);const hg=feat.length?feat[Math.floor(Date.now()/36e5)%feat.length]:G[0];
 if(!q&&cat==='All'&&hg)app.append(h('section',{className:'hero'},img(hg.logo,hg.title),h('div',{},h('h1',{textContent:hg.title}),h('p',{textContent:hg.description||''}),h('button',{className:'btn',textContent:'▶ Play Now',on:{click(){play(hg)}}}))));
 const rg=rec.map(id=>G.find(g=>g.id===id)).filter(Boolean);
 if(rg.length&&!q&&cat==='All'){app.append(h('h2',{textContent:'🕹 Continue Playing'}),h('div',{className:'grid'},rg.slice(0,4).map(card)))}
 const cats=['All','Favorites',...new Set(G.map(g=>g.category).filter(Boolean))];
 app.append(h('h2',{textContent:'🎮 All Games'}),h('div',{className:'chips'},cats.map(c=>h('button',{className:'chip'+(c===cat?' on':''),textContent:c,on:{click(){cat=c;sv('cat',c);render()}}}))));
 const s=q.toLowerCase();const list=G.filter(g=>(cat==='All'||(cat==='Favorites'?fav.includes(g.id):g.category===cat))&&(!s||[g.title,g.description,g.category,...(g.tags||[])].join(' ').toLowerCase().includes(s)));
 app.append(list.length?h('div',{className:'grid'},list.map(card)):h('div',{className:'empty',textContent:'😕 No games match your search.'}))}
function initMusic(){if(!safe(S.hubMusic)){musicOk=false;return}
 music=new Audio(S.hubMusic);music.loop=true;music.volume=.5;music.addEventListener('error',()=>{musicOk=false;ui()});
 addEventListener('pointerdown',()=>{if(prefs.music&&$('#player').hidden)music.play().catch(()=>{})},{once:true})}
function ui(){$('#musicBtn').textContent=prefs.music&&musicOk?'🔊':'🔇'}
function resume(){if(music&&prefs.music)music.play().catch(()=>{})}
$('#musicBtn').onclick=()=>{prefs.music=!prefs.music;sv('prefs',prefs);ui();if(!musicOk)toast('hub.mp3 not found in assets/music/');else prefs.music?resume():music&&music.pause()};
const fr=$('#frame'),pl=$('#player'),st=$('#pstate');
async function play(g){if(busy)return;busy=true;
 try{if(music)music.pause();if(window.HubAds)await HubAds.beforeGame();$('#ptitle').textContent=g.title;st.textContent='Loading…';st.hidden=false;pl.hidden=false;document.body.style.overflow='hidden';document.body.classList.add('playing');
 const u=url(g); const t=setTimeout(()=>{st.textContent='⚠️ Game load nahi hua? games.js mein folder/entry path check karo: '+u},8000);
 fr.onload=()=>{clearTimeout(t);st.hidden=true;try{fr.contentWindow.focus()}catch{}};fr.src=u;
 rec=[g.id,...rec.filter(x=>x!==g.id)].slice(0,S.recentLimit||8);sv('rec',rec)}finally{setTimeout(()=>busy=false,400)}}
function back(){fr.onload=null;fr.src='about:blank';pl.hidden=true;document.body.style.overflow='';document.body.classList.remove('playing');
 if(document.fullscreenElement)document.exitFullscreen().catch(()=>{});resume();render();if(window.HubAds)HubAds.onBack()}
$('#back').onclick=back;
$('#fs').onclick=()=>{(document.fullscreenElement?document.exitFullscreen():pl.requestFullscreen()).catch(()=>toast('Fullscreen not supported'))};
addEventListener('message',e=>{if(e.source!==fr.contentWindow)return;if(e.data&&e.data.type==='GAME_EXIT_REQUEST')back()});
$('#q').oninput=e=>{q=e.target.value.trim();render()};
(async()=>{
 S=window.HUB_SETTINGS||{};
 $('#hubName').textContent=S.hubName||'Game Hub';$('#hubTag').textContent=S.tagline||'';document.title=S.hubName||'Game Hub';
 $('#ver').textContent='v'+(S.version||'1.0');const hl=$('#hubLogo');hl.src=safe(S.hubLogo)?S.hubLogo:FALL;hl.onerror=()=>{hl.onerror=null;hl.src=FALL};
 const ad=$('#ad');if(S.ads&&S.ads.enabled)ad.append(h('div',{id:'adslot',textContent:S.ads.bannerText||'Ad'}));else ad.hidden=true;
 cat=ld('cat','All');initMusic();ui();
 try{const d=window.HUB_GAMES;G=validate(d.games||[])}
 catch(e){$('#app').textContent='';$('#app').append(h('div',{className:'empty',textContent:'⚠️ data/games.js load nahi hua. File aur syntax check karo.'}));return}
 render()})();
})();
