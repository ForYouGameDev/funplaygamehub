# My Game Hub — Setup (Hinglish)

## Chalane ka tarika (zaroori)
**Ab fully offline hai.** Server ki zaroorat nahi: `indexhub.html` seedha browser mein khol sakte ho, ya Android WebView app mein `file:///android_asset/MyGameHub/indexhub.html` se. Optional server:
- VS Code "Live Server" extension, ya
- `npx http-server . -p 8080 -c-1` phir `http://localhost:8080/indexhub.html`
- Online: poora folder Netlify / GitHub Pages / hosting par upload karo.

## Hub ka naam, tagline, logo badalna
`data/settings.js` kholo:
- `"hubName"` = naya naam, `"tagline"` = chhoti line
- `"hubLogo"` = logo path, e.g. `assets/logos/hub-logo.png` (square PNG/SVG, 256x256). File `assets/logos/` mein rakho.

## Hub music
`assets/music/hub.mp3` naam se mp3 rakho (ya settings.json mein `"hubMusic"` badlo). Pehle tap ke baad bajta hai (browser rule). Game khulte hi hub music pause, Back dabate hi resume.

## Naya game add karna (hub code touch nahi karna)
1. `games/game3/` folder banao, andar `index3.html` (aapki game file) rakho.
2. Logo `assets/logos/image3.png` rakho (square).
3. `data/games.js` mein entry add karo (comma lagana na bhoolo; yeh `.js` file hai, `window.HUB_GAMES` ke andar):
```
{"id":"my-game","title":"Game Name","description":"Short line","category":"Racing","folder":"games/game3/","entry":"index3.html","logo":"assets/logos/image3.png","featured":false,"enabled":true,"tags":["car"],"modes":{"single":true,"multi":false}}
```
- Title/logo/description sab yahin se aata hai. `"enabled":false` = game chhupa do. `"featured":true` = hero + featured.
- 2 Players ready hone par `"multi":true` kar do; abhi sab par "2P Coming Soon" dikhta hai.

## Game ka apna music
Har game apna audio khud chalata hai (apne folder ke andar `audio/game.mp3`, relative path). Hub Back dabane par iframe unload karta hai, isliye game ki awaaz band ho jaati hai.
Game se hub par wapas bhejna ho: `parent.postMessage({type:'GAME_EXIT_REQUEST'},location.origin)`.

## Banner Ads
`data/settings.js` → `"ads":{"enabled":true}`. Abhi placeholder (320x50) dikhta hai. Asli ad ke liye `js/app.js` mein `adslot` wali line (`#adslot`) ki jagah apne ad network ka banner code lagao (web ke liye AdSense / AdMob web-compatible network). `"enabled":false` karke band karo. Ad sirf hub par hai, game ke andar nahi, taaki gameplay na dhake.

## Troubleshooting
- Cards nahi dikh rahe: JSON mein comma/quote check karo, server se kholo.
- "Game file not found": `folder` + `entry` asli path se match hona chahiye.
- Music nahi: `hub.mp3` sahi jagah? Ek baar screen tap karo.
- Logo nahi dikha: path galat hai, default 🎮 icon aata hai.

## Testing note
Is build mein code likha gaya hai; real device/browser par test karna baaki hai (audio, fullscreen, mobile).

## Offline notes
- Sab kuch local hai (koi CDN/font/internet nahi). Games ke assets bhi apne folder ke andar rakho, relative path se.
- Offline mein missing game file ka exact error pakadna mushkil hai; 8 sec baad path-check message aata hai.
- Banner ads ko internet chahiye. Offline hone par placeholder/blank rahega.
- Browser mein file:// par kuch browsers fullscreen/audio alag behave karte hain; Android WebView mein `setJavaScriptEnabled(true)` aur `setMediaPlaybackRequiresUserGesture(false)` rakho.

## Background animation
`data/settings.js` → `background`: `enabled` (true/false), `count` (max 30, kam = phone par smooth), `emojis` (apne pasand ke emojis). Game khulte hi animation band ho jaata hai. Phone ki 'reduce motion' setting on ho to bhi band rehta hai.

## Themes, Coins, Ads (naya)
- **Themes:** `data/themes.js` mein 8 themes (Boys 3, Girls 3, Formal 2). Naya theme = ek line copy karke rang/price badlo (`price:0` = free). Header ke 🎨 ya coin button se Store khulta hai: Equip / Buy.
- **Coins:** Rewarded ad poora dekhne par `rewardCoins` (settings.js) milte hain. Coins se themes kharido. Coins/themes phone ke localStorage mein save hote hain.
- **Ads flow:** Hub khulte hi interstitial, aur har game click par pehle interstitial phir game (`interstitialOnHubOpen`, `interstitialOnGameOpen`, `gameOpenEvery` = har N-wale game par, `cooldownSec` = do ads ke beech gap).
- **provider:** `"mock"` = test ad screen (browser mein testing), `"admob"` = asli AdMob (sirf Android app WebView mein), `"none"` = ads band.
- **AdMob sach:** AdMob sirf native Android SDK se chalta hai, pure HTML page mein nahi. Isliye Android WebView app mein bridge lagana padega. `adUnits` mein abhi Google ke TEST IDs hain; release se pehle apne asli IDs daalo, warna account ban ho sakta hai.

### Android bridge (Kotlin, WebView)
```kotlin
webView.settings.javaScriptEnabled = true
webView.addJavascriptInterface(object {
  @JavascriptInterface fun showInterstitial() = runOnUiThread {
    // InterstitialAd.show(); onAdDismissed -> webView.evaluateJavascript("onHubAdClosed()",null) }
  @JavascriptInterface fun showRewarded() = runOnUiThread {
    // RewardedAd.show(); onUserEarnedReward -> "onHubReward(true)"; dismissed w/o reward -> "onHubReward(false)" }
  @JavascriptInterface fun showBanner() = runOnUiThread { /* AdView ko WebView ke neeche add karo */ }
}, "AndroidAds")
```
