/* Capacitor AdMob ko hub ke store.js (AndroidAds bridge) se jodta hai. provider "admob" hone par chalta hai. */
(function(){
  var S=(window.HUB_SETTINGS||{}).ads||{}, U=S.adUnits||{}, test=S.testing!==false;
  var hc=window.HubCap||{}, cap=hc.Capacitor||window.Capacitor, A=hc.AdMob||null, isNative=false;
  try{isNative=!!(cap&&cap.isNativePlatform&&cap.isNativePlatform())}catch(e){}
  /* test mode me screen ke upar chhota status box (diagnosis ke liye) */
  var logEl=null,lines=[];
  function show(m){
    if(!test)return;
    try{
      console.log('[ads]',m);
      if(!logEl){logEl=document.createElement('div');logEl.id='adlog';
        logEl.style.cssText='position:fixed;left:4px;top:4px;z-index:99999;max-width:92%;font:11px/1.3 monospace;color:#7CFFB2;background:rgba(0,0,0,.65);padding:4px 6px;border-radius:6px;pointer-events:none;white-space:pre-wrap';
        (document.body||document.documentElement).appendChild(logEl)}
      lines.push(m);if(lines.length>7)lines.shift();logEl.textContent=lines.join('\n');
    }catch(e){}
  }
  show('bridge: HubCap='+!!window.HubCap+' plugin='+!!A+' native='+isNative);
  if(!A||!isNative)return; /* browser me ya plugin na mile to bridge nahi banta */
  var adEl=document.getElementById('ad');if(adEl)adEl.style.display='none';
  function err(e){return e&&e.message?e.message:JSON.stringify(e)}
  function dbg(m){show(m)}
  function closed(){if(window.onHubAdClosed)window.onHubAdClosed()}
  function rewardDone(ok){if(window.onHubReward)window.onHubReward(!!ok)}
  function waitFor(p,ms){return Promise.race([p,new Promise(function(r){setTimeout(function(){r(false)},ms)})])}
  var intS={ready:false,p:null}, rwS={ready:false,p:null}, bannerOn=false, earned=false;
  var initP=A.initialize({initializeForTesting:test}).then(function(){dbg('AdMob init ok')}).catch(function(e){dbg('init '+err(e));throw e});
  function loader(st,fn,name){return function(){
    if(st.ready)return Promise.resolve(true);
    if(st.p)return st.p;
    st.p=initP.then(fn).then(function(){st.ready=true;dbg(name+' ready');return true})
      .catch(function(e){dbg(name+' load: '+err(e));return false}).then(function(r){st.p=null;return r});
    return st.p;
  }}
  var loadInt=loader(intS,function(){return A.prepareInterstitial({adId:U.interstitial,isTesting:test})},'interstitial');
  var loadRw=loader(rwS,function(){return A.prepareRewardVideoAd({adId:U.rewarded,isTesting:test})},'rewarded');
  function showBanner(){
    if(bannerOn)return;
    initP.then(function(){return A.showBanner({adId:U.banner,adSize:'ADAPTIVE_BANNER',position:'BOTTOM_CENTER',margin:0,isTesting:test})})
      .then(function(){bannerOn=true;dbg('banner ok')}).catch(function(e){bannerOn=false;dbg('banner: '+err(e))});
  }
  initP.then(function(){
    function intEnd(){intS.ready=false;loadInt();closed()}
    A.addListener('interstitialAdDismissed',intEnd);
    A.addListener('interstitialAdFailedToShow',intEnd);
    A.addListener('onRewardedVideoAdReward',function(){earned=true});
    A.addListener('onRewardedVideoAdDismissed',function(){var ok=earned;earned=false;rwS.ready=false;loadRw();rewardDone(ok)});
    A.addListener('onRewardedVideoAdFailedToShow',function(){rwS.ready=false;loadRw();rewardDone(false)});
    A.addListener('bannerAdFailedToLoad',function(){bannerOn=false});
    loadInt();loadRw();
  }).catch(function(){});
  window.addEventListener('online',function(){loadInt();loadRw();showBanner()});
  /* game chalte waqt banner chhupao, hub me wapas dikhao */
  var pl=document.getElementById('player');
  if(pl&&window.MutationObserver)new MutationObserver(function(){
    if(!bannerOn)return;
    if(pl.hidden)A.resumeBanner().catch(function(){bannerOn=false;showBanner()});else A.hideBanner().catch(function(){});
  }).observe(pl,{attributes:true,attributeFilter:['hidden']});
  window.AndroidAds={
    showBanner:showBanner,
    showInterstitial:function(){
      waitFor(loadInt(),4000).then(function(ok){
        if(!ok||!intS.ready)return closed(); /* offline ya ad nahi aaya: game seedha khule */
        return A.showInterstitial().catch(function(e){dbg('show: '+err(e));intS.ready=false;closed()});
      });
    },
    showRewarded:function(){
      waitFor(loadRw(),6000).then(function(ok){
        if(!ok||!rwS.ready){dbg('Reward ad abhi ready nahi');return rewardDone(false)}
        earned=false;
        return A.showRewardVideoAd().catch(function(e){dbg('reward: '+err(e));if(!earned)rewardDone(false)});
      });
    }
  };
})();
