/* Mobile performance helper: har game ke <head> me sabse pehle load hota hai. */
(function(){
  try{
    /* 1) Pixel ratio cap: 3x phones par canvas/WebGL ka load kaafi kam */
    var real=window.devicePixelRatio||1, cap=1.5;
    Object.defineProperty(window,'devicePixelRatio',{get:function(){return Math.min(real,cap)},configurable:true});
  }catch(e){}
  try{
    /* 2) Canvas shadowBlur bahut mehnga hai: cap */
    var P=window.CanvasRenderingContext2D&&CanvasRenderingContext2D.prototype;
    var d=P&&Object.getOwnPropertyDescriptor(P,'shadowBlur');
    if(d&&d.set)Object.defineProperty(P,'shadowBlur',{get:d.get,set:function(v){d.set.call(this,Math.min(+v||0,6))},configurable:true});
  }catch(e){}
  try{
    /* 3) rAF ~60fps par cap (90/120Hz phones par double speed + double load nahi) */
    var raf=window.requestAnimationFrame.bind(window),caf=window.cancelAnimationFrame.bind(window);
    var seq=0,live={},cur=-1,lastRun=-100;
    window.requestAnimationFrame=function(cb){
      var id=++seq;
      live[id]=raf(function wrap(ts){
        if(ts!==cur){
          if(ts-lastRun<10){live[id]=raf(wrap);return}
          cur=ts;lastRun=ts;
        }
        delete live[id];cb(ts);
      });
      return id;
    };
    window.cancelAnimationFrame=function(id){if(live[id]!==undefined){caf(live[id]);delete live[id]}else caf(id)};
  }catch(e){}
  /* 4) Touch polish: tap highlight / long-press menu / pull-to-refresh band */
  try{
    var st=document.createElement('style');
    st.textContent='html,body{overscroll-behavior:none;-webkit-tap-highlight-color:transparent;-webkit-touch-callout:none}canvas{-webkit-user-select:none;user-select:none;outline:none}*{backdrop-filter:none!important;-webkit-backdrop-filter:none!important}';
    (document.head||document.documentElement).appendChild(st);
    addEventListener('contextmenu',function(e){e.preventDefault()});
  }catch(e){}
})();
