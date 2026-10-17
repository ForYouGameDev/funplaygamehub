// AdMob App ID ko AndroidManifest.xml me daalta hai (cap sync ke baad apne aap chalta hai).
const fs=require('fs'),path=require('path');
const cfg=fs.readFileSync(path.join('www','js','ads-config.js'),'utf8');
const m=cfg.match(/appId\s*:\s*"([^"]+)"/);
if(!m){console.error('ads-config.js me appId nahi mila');process.exit(1)}
const f=path.join('android','app','src','main','AndroidManifest.xml');
if(!fs.existsSync(f)){console.log('android project abhi nahi bana, skip');process.exit(0)}
let x=fs.readFileSync(f,'utf8');
x=x.replace(/\s*<meta-data android:name="com\.google\.android\.gms\.ads\.APPLICATION_ID"[^>]*\/>/,'');
x=x.replace('</application>','    <meta-data android:name="com.google.android.gms.ads.APPLICATION_ID" android:value="'+m[1]+'"/>\n    </application>');
if(!x.includes('ACCESS_NETWORK_STATE'))x=x.replace('</manifest>','    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE"/>\n</manifest>');
fs.writeFileSync(f,x);
console.log('AdMob App ID manifest me set:',m[1]);
