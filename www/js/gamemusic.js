/* gamemusic.js - har game me apna music + in-game control (music on/off, music volume, sound-effects volume).
   Settings: data/music.js. User ki choice phone me save rehti hai aur sab games me same chalti hai. */
(function(){
  var C=window.GAME_MUSIC||{enabled:true,volume:.5,sfxVolume:1,button:'right',games:{}};
  if(C.enabled===false&&C.button==='off')return;
  var KEY='hubGameAudio',st={music:true,mv:C.volume==null?.5:C.volume,sv:C.sfxVolume==null?1:C.sfxVolume};
  try{var o=JSON.parse(localStorage.getItem(KEY)||'null');if(o){if(typeof o.music==='boolean')st.music=o.music;if(typeof o.mv==='number')st.mv=o.mv;if(typeof o.sv==='number')st.sv=o.sv}}catch(e){}
  function save(){try{localStorage.setItem(KEY,JSON.stringify(st))}catch(e){}}

  /* ---- sound effects ka master volume: sab AudioContext ki awaaz ek gain se guzarti hai ---- */
  var masters=[];
  try{
    var oc=AudioNode.prototype.connect,wm=new WeakMap();
    AudioNode.prototype.connect=function(t){
      try{
        if(window.AudioDestinationNode&&t instanceof AudioDestinationNode){
          var m=wm.get(t.context);
          if(!m){m=t.context.createGain();m.gain.value=st.sv;oc.call(m,t);wm.set(t.context,m);masters.push(m)}
          oc.call(this,m);return t;
        }
      }catch(e){}
      return oc.apply(this,arguments);
    };
  }catch(e){}
  function applySfx(){masters.forEach(function(m){try{m.gain.value=st.sv}catch(e){}})}

  /* ---- is game ka music ---- */
  var id=((location.pathname.match(/\/(game\d+)\//)||[])[1])||'';
  var g=(C.games||{})[id]||{};
  var base=(function(){var s=document.currentScript;return s&&s.src?s.src.replace(/js\/gamemusic\.js.*$/,''):'../../'})();
  var au=null,ok=false,wantPlay=false;
  if(C.enabled!==false&&g.src&&!g.off){
    au=new Audio(base+g.src);au.loop=true;au.preload='auto';
    au.addEventListener('canplay',function(){ok=true;ui()});
    au.addEventListener('error',function(){ok=false;au=null;ui()});
  }
  function vol(){return au?Math.max(0,Math.min(1,st.mv*(g.vol==null?1:g.vol))):0}
  function play(){if(!au||!st.music)return;au.volume=vol();var p=au.play();if(p&&p.catch)p.catch(function(){wantPlay=true})}
  function pause(){if(au)au.pause()}
  play();
  /* autoplay rule: pehle touch par shuru */
  function first(){removeEventListener('pointerdown',first,true);removeEventListener('keydown',first,true);if(st.music)play()}
  addEventListener('pointerdown',first,true);addEventListener('keydown',first,true);
  document.addEventListener('visibilitychange',function(){document.hidden?pause():play()});
  addEventListener('pagehide',pause);

  /* ---- chhota control button + panel ---- */
  var pos=C.button||'right';
  if(pos==='off')return;
  var host,btn,panel,open=false;
  function css(el,s){el.style.cssText=s}
  function build(){
    host=document.createElement('div');host.id='hubAudioUI';
    var p={right:'right:6px;top:50%;margin-top:-18px',left:'left:6px;top:50%;margin-top:-18px','top-right':'right:6px;top:calc(8px + env(safe-area-inset-top))','top-left':'left:6px;top:calc(8px + env(safe-area-inset-top))'}[pos]||'right:6px;top:50%';
    css(host,'position:fixed;z-index:2147483000;'+p+';font:13px system-ui,sans-serif;color:#fff;-webkit-tap-highlight-color:transparent;touch-action:manipulation');
    btn=document.createElement('button');btn.setAttribute('aria-label','Sound');
    css(btn,'width:36px;height:36px;border-radius:50%;border:1px solid rgba(255,255,255,.35);background:rgba(0,0,0,.45);color:#fff;font-size:17px;padding:0;opacity:.6;line-height:1');
    panel=document.createElement('div');
    css(panel,'display:none;position:absolute;'+(pos.indexOf('left')>-1?'left':'right')+':0;top:42px;width:210px;padding:12px;border-radius:14px;background:rgba(10,12,28,.92);border:1px solid rgba(255,255,255,.2);box-shadow:0 6px 24px #0008');
    host.append(btn,panel);(document.body||document.documentElement).appendChild(host);
    ['pointerdown','touchstart','mousedown','click','pointerup','touchend'].forEach(function(ev){host.addEventListener(ev,function(e){e.stopPropagation()},{passive:true})});
    btn.addEventListener('click',function(){open=!open;panel.style.display=open?'block':'none';btn.style.opacity=open?1:.6;if(open)fill()});
    ui();
  }
  function row(label,val,on){
    var d=document.createElement('div');css(d,'margin:6px 0');
    var l=document.createElement('div');l.textContent=label;css(l,'margin-bottom:4px;opacity:.85');
    var r=document.createElement('input');r.type='range';r.min=0;r.max=100;r.value=Math.round(val*100);css(r,'width:100%');
    r.addEventListener('input',function(){on(r.value/100)});
    d.append(l,r);return d;
  }
  function fill(){
    panel.textContent='';
    var t=document.createElement('button');css(t,'width:100%;padding:9px;border-radius:10px;border:0;font-weight:700;background:#22d3ee;color:#04121a');
    function lab(){t.textContent=(st.music?'🎵 Music: ON':'🔇 Music: OFF')+(au||!g.src?'':'')}
    lab();t.addEventListener('click',function(){st.music=!st.music;save();st.music?play():pause();lab();ui()});
    panel.append(t);
    if(g.src&&!g.off&&au){panel.append(row('Music volume',st.mv,function(v){st.mv=v;save();if(au)au.volume=vol()}))}
    else if(!g.src||g.off){var n=document.createElement('div');n.textContent='Is game ka music set nahi hai';css(n,'margin:6px 0;opacity:.7;font-size:12px');panel.append(n)}
    panel.append(row('Sound effects',st.sv,function(v){st.sv=v;save();applySfx()}));
  }
  function ui(){if(btn)btn.textContent=(st.music&&(au||st.sv>0))?'🔊':'🔇'}
  if(document.body)build();else document.addEventListener('DOMContentLoaded',build);
  /* games ke liye chhota API: GameMusic.play/pause/setVolume */
  window.GameMusic={play:play,pause:pause,setMusicVolume:function(v){st.mv=v;save();if(au)au.volume=vol()},setSfxVolume:function(v){st.sv=v;save();applySfx()},state:st};
})();
