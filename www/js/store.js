(()=>{
const $=s=>document.querySelector(s);
const ld=(k,d)=>{try{return JSON.parse(localStorage.getItem('gh_'+k))??d}catch{return d}};
const sv=(k,v)=>{try{localStorage.setItem('gh_'+k,JSON.stringify(v))}catch{}};
const h=(t,p={},...k)=>{const e=document.createElement(t);for(const i in p){if(i==='on')for(const x in p.on)e.addEventListener(x,p.on[x]);else if(i in e)e[i]=p[i];else e.setAttribute(i,p[i])}k.flat().forEach(c=>e.append(c));return e};
const once=f=>{let d;return(...a)=>{if(!d){d=1;f(...a)}}};
const AD=(window.HUB_SETTINGS||{}).ads||{},T=window.HUB_THEMES||[],R=AD.rewardCoins||50;
let coins=ld('coins',0),owned=ld('owned',[]),cur=ld('theme','neon-blue'),launches=0,lastAd=0;
T.forEach(t=>{if(!t.price&&!owned.includes(t.id))owned.push(t.id)});
const toast=m=>{const t=$('#toast');t.textContent=m;t.classList.add('on');setTimeout(()=>t.classList.remove('on'),2200)};
/* THEMES */
function apply(id){const t=T.find(x=>x.id===id)||T[0];if(!t)return;const s=document.documentElement.style;
 Object.entries({bg:t.bg,c:t.c,a:t.a,v:t.v,t:t.t,m:t.m,h1:t.h1,h2:t.h2,bt:t.bt,hd:t.bg+'f2',cc:t.c+'cc',bd:t.a+'33'}).forEach(([k,v])=>s.setProperty('--'+k,v));
 const mt=document.querySelector('meta[name=theme-color]');if(mt)mt.content=t.bg;if(window.HubBG)HubBG.set(t.bub)}
/* ADS: provider "mock" (testing) | "admob" (Android WebView bridge AndroidAds) | "none" */
const native=()=>AD.provider==='admob'&&window.AndroidAds;
function mock(kind,secs,cb){const o=h('div',{className:'adov'}),s=h('div',{className:'adnum',textContent:secs+'s'}),b=h('button',{className:'btn',textContent:'Wait…',disabled:true});
 o.append(h('div',{className:'adbox'},h('small',{textContent:'TEST AD · '+kind}),h('h2',{textContent:'Your Ad Here'}),s,b));document.body.append(o);let n=secs;
 const tk=setInterval(()=>{n--;s.textContent=n>0?n+'s':'';if(n<=0){clearInterval(tk);b.disabled=false;b.textContent=kind==='Rewarded'?'Claim Reward':'Close ✕'}},1000);
 b.onclick=()=>{o.remove();cb(true)}}
function interstitial(cb){cb=once(cb);if(AD.enabled===false||AD.provider==='none')return cb();
 if(native()){window.onHubAdClosed=()=>cb();setTimeout(cb,12000);try{AndroidAds.showInterstitial()}catch{cb()}}
 else if(AD.provider==='mock')mock('Interstitial',5,()=>cb());else cb()}
function rewarded(cb){cb=once(cb);if(AD.enabled===false||AD.provider==='none')return cb(false);
 if(native()){window.onHubReward=ok=>cb(!!ok);setTimeout(()=>cb(false),60000);try{AndroidAds.showRewarded()}catch{cb(false)}}
 else if(AD.provider==='mock')mock('Rewarded',8,ok=>cb(ok));else cb(false)}
function gate(f){launches++;const ok=AD.interstitialOnGameOpen!==false&&launches%(AD.gameOpenEvery||1)===0&&Date.now()-lastAd>=(AD.cooldownSec||0)*1e3;
 ok?interstitial(()=>{lastAd=Date.now();f()}):f()}
window.HubAds={gate,interstitial,rewarded};
/* COINS + STORE UI */
const chipN=h('span',{textContent:coins});
const chip=h('button',{className:'cchip','aria-label':'Coins',on:{click:openStore}},h('i',{className:'coin'}),chipN);
const tb=h('button',{className:'ib','aria-label':'Themes',textContent:'🎨',on:{click:openStore}});
const mb=$('#musicBtn'),act=h('div',{className:'acts'},chip,tb);$('.top').append(act);act.append(mb);
function add(n){coins+=n;sv('coins',coins);chipN.textContent=coins}
function openStore(){const m=h('div',{className:'modal'}),box=h('div',{className:'mbox'});m.append(box);document.body.append(m);
 m.addEventListener('pointerdown',e=>{if(e.target===m)m.remove()});
 (function fill(){box.textContent='';
 box.append(h('div',{className:'mh'},h('b',{textContent:'Themes & Coins'}),h('button',{className:'ib',textContent:'✕',on:{click(){m.remove()}}})),
 h('div',{className:'wallet'},h('div',{className:'cchip'},h('i',{className:'coin'}),h('span',{textContent:coins})),
  h('button',{className:'btn',textContent:'▶ Watch Ad +'+R+' coins',on:{click(){rewarded(ok=>{if(ok){add(R);toast('+'+R+' coins mile!')}else toast('Ad poora nahi hua');fill()})}}})));
 ['Boys','Girls','Formal'].forEach(g=>{const l=T.filter(t=>t.group===g);if(!l.length)return;
  box.append(h('h3',{textContent:g==='Formal'?'Formal / Professional':g==='Boys'?'Boys Themes':'Girls Themes'}),
  h('div',{className:'tg'},l.map(t=>{const has=owned.includes(t.id),on=cur===t.id;
   return h('div',{className:'tc'+(on?' on':'')},h('div',{className:'sw',style:`background:linear-gradient(135deg,${t.h1},${t.h2})`},h('span',{style:'background:'+t.a}),h('span',{style:'background:'+t.v})),
    h('b',{textContent:t.name}),
    h('button',{className:'btn sm',disabled:on,textContent:on?'✓ Equipped':has?'Equip':'Buy · '+t.price,on:{click(){
     if(has){cur=t.id;sv('theme',cur);apply(cur)}
     else if(coins>=t.price){add(-t.price);owned.push(t.id);sv('owned',owned);cur=t.id;sv('theme',cur);apply(cur);toast(t.name+' unlock!')}
     else{toast('Coins kam hain, ad dekho 👆');return}fill()}}}))}))) })})()}
apply(cur);
if(native()&&AndroidAds.showBanner){try{AndroidAds.showBanner();const a=$('#ad');if(a)a.hidden=true}catch{}}
if(AD.interstitialOnHubOpen!==false)setTimeout(()=>interstitial(()=>{lastAd=Date.now()}),700);
})();
