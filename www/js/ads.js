/* AdMob: hub me banner, game kholne se pehle interstitial. Offline/fail ho to game seedha khulta hai. */
(function(){
  var C=window.ADS_CONFIG||{}, cap=window.Capacitor, A=null;
  try{if(cap&&cap.registerPlugin)A=cap.registerPlugin('AdMob')}catch(e){}
  var native=!!(A&&cap.isNativePlatform&&cap.isNativePlatform());
  var bannerOn=false,intReady=false,intLoading=false,playing=false,count=0,finish=null;
  function log(){try{console.log.apply(console,['[ads]'].concat([].slice.call(arguments)))}catch(e){}
    if(C.testing){try{var t=document.getElementById('toast'),m='Ads: '+[].slice.call(arguments).map(function(x){return x&&x.message?x.message:(typeof x==='object'?JSON.stringify(x):x)}).join(' ');t.textContent=m.slice(0,140);t.classList.add('on');setTimeout(function(){t.classList.remove('on')},3500)}catch(e){}}}
  function showBanner(){
    if(!native||bannerOn)return;
    A.showBanner({adId:C.banner,adSize:'ADAPTIVE_BANNER',position:'BOTTOM_CENTER',margin:0,isTesting:!!C.testing})
      .then(function(){bannerOn=true;log('banner ok')}).catch(function(e){bannerOn=false;log('banner',e)});
  }
  function loadInt(){
    if(!native||intReady||intLoading)return;
    intLoading=true;
    A.prepareInterstitial({adId:C.interstitial,isTesting:!!C.testing})
      .then(function(){intReady=true;intLoading=false;log('interstitial ready')})
      .catch(function(e){intReady=false;intLoading=false;log('int load',e)});
  }
  function done(){intReady=false;if(finish){var f=finish;finish=null;f()}loadInt()}
  function init(){
    if(!native){console.log('[ads] browser mode: ads off');return}
    log('plugin ok, init...');
    var ad=document.getElementById('ad');if(ad)ad.style.display='none';
    A.initialize({initializeForTesting:!!C.testing}).then(function(){
      A.addListener('interstitialAdDismissed',done);
      A.addListener('interstitialAdFailedToShow',done);
      A.addListener('bannerAdFailedToLoad',function(){bannerOn=false});
      showBanner();loadInt();
    }).catch(function(e){log('init',e)});
    window.addEventListener('online',function(){if(!playing)showBanner();loadInt()});
  }
  window.HubAds={
    beforeGame:function(){
      return new Promise(function(res){
        try{
          playing=true;count++;
          if(native&&bannerOn)A.hideBanner().catch(function(){});
          var every=C.showEvery||1;
          if(!native||!intReady||count%every!==0)return res();
          var t=setTimeout(function(){done()},60000);
          finish=function(){clearTimeout(t);res()};
          A.showInterstitial().catch(function(){done()});
        }catch(e){log(e);res()}
      });
    },
    onBack:function(){
      playing=false;
      if(!native)return;
      if(bannerOn)A.resumeBanner().catch(function(){bannerOn=false;showBanner()});else showBanner();
      loadInt();
    }
  };
  init();
})();
