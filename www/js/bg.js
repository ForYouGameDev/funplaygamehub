/* Tweak karna ho to js/bg.js mein

Rang badalne ke liye: COLS ke RGB values change karo.
Bubbles ka size: mk function mein r:rnd(8,34) badlo.
Speed: s:rnd(.15,.55) badlo.
Count: size function mein Math.min(26,...) badlo. */
(()=>{
const cv=document.getElementById('bg'),x=cv.getContext('2d'),pl=document.getElementById('player');
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const COLS=[[34,211,238],[124,58,237],[236,72,153],[96,165,250],[52,211,153]];
let W,H,D,B=[],P=[],A=[],t=0;
const rnd=(a,b)=>a+Math.random()*(b-a);
const mk=init=>({x:rnd(0,W),y:init?rnd(0,H):H+rnd(20,200),r:rnd(8,34),s:rnd(.15,.55),w:rnd(0,6.28),ws:rnd(.005,.015),wa:rnd(8,26),c:COLS[Math.random()*COLS.length|0],a:rnd(.3,.6)});
function size(){D=Math.min(devicePixelRatio||1,1.5);W=innerWidth;H=innerHeight;cv.width=W*D;cv.height=H*D;x.setTransform(D,0,0,D,0,0);
 const n=Math.round(Math.min(26,Math.max(12,W/40)));while(B.length<n)B.push(mk(true));B.length=n;
 A=[0,1,2].map(i=>({x:rnd(0,W),y:rnd(0,H),r:Math.max(W,H)*.5,c:COLS[i],p:rnd(0,6.28)}))}
function pop(b){B[B.indexOf(b)]=mk(false);P.push({ring:1,x:b.x,y:b.y,r:b.r,l:1,c:b.c});
 for(let i=0;i<7;i++){const a=i/7*6.28+rnd(0,.5),v=rnd(1,2.6);P.push({x:b.x,y:b.y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,l:1,c:b.c})}}
function draw(){x.clearRect(0,0,W,H);
 A.forEach(o=>{const px=o.x+Math.cos(t*.0004+o.p)*60,py=o.y+Math.sin(t*.0003+o.p)*60;const g=x.createRadialGradient(px,py,0,px,py,o.r);g.addColorStop(0,`rgba(${o.c},.16)`);g.addColorStop(1,`rgba(${o.c},0)`);x.fillStyle=g;x.fillRect(0,0,W,H)});
 B.forEach(b=>{const bx=b.x+Math.sin(b.w)*b.wa,by=b.y,r=b.r,c=b.c.join(',');
  const g=x.createRadialGradient(bx-r*.35,by-r*.35,r*.1,bx,by,r);g.addColorStop(0,`rgba(255,255,255,${b.a*.8})`);g.addColorStop(.4,`rgba(${c},${b.a*.3})`);g.addColorStop(1,`rgba(${c},${b.a*.1})`);
  x.beginPath();x.arc(bx,by,r,0,6.283);x.fillStyle=g;x.fill();x.lineWidth=1.2;x.strokeStyle=`rgba(${c},${b.a*.8})`;x.stroke();
  x.beginPath();x.ellipse(bx-r*.38,by-r*.4,r*.22,r*.12,-.7,0,6.283);x.fillStyle=`rgba(255,255,255,${b.a*1.1})`;x.fill()});
 P.forEach(p=>{if(p.ring){x.beginPath();x.arc(p.x,p.y,p.r*(1+(1-p.l)*.8),0,6.283);x.strokeStyle=`rgba(${p.c},${p.l*.7})`;x.lineWidth=2;x.stroke()}else{x.beginPath();x.arc(p.x,p.y,2.2*p.l+.5,0,6.283);x.fillStyle=`rgba(${p.c},${p.l})`;x.fill()}})}
function step(){B.forEach(b=>{b.y-=b.s;b.w+=b.ws;if(b.y<-b.r*2)Object.assign(b,mk(false))});
 P.forEach(p=>{p.l-=.04;if(!p.ring){p.x+=p.vx;p.y+=p.vy}});P=P.filter(p=>p.l>0)}
function loop(n){t=n;if(!document.hidden&&pl.hidden){step();draw()}requestAnimationFrame(loop)}
addEventListener('resize',size);size();
addEventListener('pointerdown',e=>{if(e.target.closest('button,a,input,article,iframe,#player'))return;
 const hit=B.find(b=>Math.hypot(b.x+Math.sin(b.w)*b.wa-e.clientX,b.y-e.clientY)<b.r+10);if(hit)pop(hit)});
if(RM){draw()}else requestAnimationFrame(loop);
})();
