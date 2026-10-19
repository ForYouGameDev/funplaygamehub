// Build ke time offline ke liye bahar ki libraries local copy karta hai (npm install ke baad).
const fs=require('fs');
const src='node_modules/three/build/three.min.js', dst='www/games/game8/three.min.js';
if(!fs.existsSync(src)){console.error('three.min.js nahi mila:',src);process.exit(0)}
fs.copyFileSync(src,dst);
console.log('copied',dst,fs.statSync(dst).size,'bytes');
