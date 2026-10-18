(()=>{
const cv=document.getElementById('bg'),x=cv.getContext('2d'),pl=document.getElementById('player');
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
let COLS=[[34,211,238],[124,58,237],[236,72,153],[96,165,250],[52,211,153]];
let W,H,D,B=[],P=[],t=0,AC,last=0;
function buildAC(){AC=document.createElement('canvas');const w=AC.width=Math.ceil(W/4),h=AC.height=Math.ceil(H/4),g=AC.getContext('2d');
 [[.2,.2],[.85,.5],[.4,.95]].forEach((p,i)=>{const c=COLS[i%COLS.length].join(','),r=Math.max(w,h)*.7,x=p[0]*w,y=p[1]*h,q=g.createRadialGradient(x,y,0,x,y,r);q.addColorStop(0,`rgba(${c},.2)`);q.addColorStop(1,`rgba(${c},0)`);g.fillStyle=q;g.fillRect(0,0,w,h)})}
const rnd=(a,b)=>a+Math.random()*(b-a);
const mk=init=>({x:rnd(0,W),y:init?rnd(0,H):H+rnd(20,200),r:rnd(8,34),s:rnd(.15,.55),w:rnd(0,6.28),ws:rnd(.005,.015),wa:rnd(8,26),c:COLS[Math.random()*COLS.length|0],a:rnd(.3,.6)});
function size(){D=Math.min(devicePixelRatio||1,1.25);W=innerWidth;H=innerHeight;cv.width=W*D;cv.height=H*D;x.setTransform(D,0,0,D,0,0);
 const n=Math.round(Math.min(26,Math.max(12,W/40)));while(B.length<n)B.push(mk(true));B.length=n;
 buildAC()}
function pop(b){B[B.indexOf(b)]=mk(false);P.push({ring:1,x:b.x,y:b.y,r:b.r,l:1,c:b.c});
 for(let i=0;i<7;i++){const a=i/7*6.28+rnd(0,.5),v=rnd(1,2.6);P.push({x:b.x,y:b.y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,l:1,c:b.c})}}
function draw(){x.clearRect(0,0,W,H);
 if(AC)x.drawImage(AC,Math.sin(t*.0003)*20-20,Math.cos(t*.0002)*20-20,W+40,H+40);
 B.forEach(b=>{const bx=b.x+Math.sin(b.w)*b.wa,by=b.y,r=b.r,c=b.c.join(',');
  const g=x.createRadialGradient(bx-r*.35,by-r*.35,r*.1,bx,by,r);g.addColorStop(0,`rgba(255,255,255,${b.a*.8})`);g.addColorStop(.4,`rgba(${c},${b.a*.3})`);g.addColorStop(1,`rgba(${c},${b.a*.1})`);
  x.beginPath();x.arc(bx,by,r,0,6.283);x.fillStyle=g;x.fill();x.lineWidth=1.2;x.strokeStyle=`rgba(${c},${b.a*.8})`;x.stroke();
  x.beginPath();x.ellipse(bx-r*.38,by-r*.4,r*.22,r*.12,-.7,0,6.283);x.fillStyle=`rgba(255,255,255,${b.a*1.1})`;x.fill()});
 P.forEach(p=>{if(p.ring){x.beginPath();x.arc(p.x,p.y,p.r*(1+(1-p.l)*.8),0,6.283);x.strokeStyle=`rgba(${p.c},${p.l*.7})`;x.lineWidth=2;x.stroke()}else{x.beginPath();x.arc(p.x,p.y,2.2*p.l+.5,0,6.283);x.fillStyle=`rgba(${p.c},${p.l})`;x.fill()}})}
function step(){B.forEach(b=>{b.y-=b.s;b.w+=b.ws;if(b.y<-b.r*2)Object.assign(b,mk(false))});
 P.forEach(p=>{p.l-=.04;if(!p.ring){p.x+=p.vx;p.y+=p.vy}});P=P.filter(p=>p.l>0)}
function loop(n){requestAnimationFrame(loop);if(n-last<32)return;last=n;t=n;if(!document.hidden&&pl.hidden){step();draw()}}
addEventListener('resize',size);size();
addEventListener('pointerdown',e=>{if(e.target.closest('button,a,input,article,iframe,#player'))return;
 const hit=B.find(b=>Math.hypot(b.x+Math.sin(b.w)*b.wa-e.clientX,b.y-e.clientY)<b.r+10);if(hit)pop(hit)});
window.HubBG={set(c){COLS=c;B.forEach(o=>o.c=c[Math.random()*c.length|0]);buildAC();if(RM)draw()}};
if(RM){draw()}else requestAnimationFrame(loop);
})();
