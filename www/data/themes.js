// THEMES: naya theme add/edit karna ho to yahan karo. price:0 = free. Upar wale pehle dikhte hain.
// bg=background c=card a=accent1 v=accent2 t=text m=muted h1,h2=hero gradient bt=button text bub=bubble colors [r,g,b]
// (sab colors 6-digit hex hone chahiye, jaise #0b1020)
window.HUB_THEMES = [
 /* ---- LIGHT / WHITE ---- */
 {id:"clean-light",name:"Pure White",price:0,bg:"#f8fafc",c:"#ffffff",a:"#2563eb",v:"#7c3aed",t:"#0f172a",m:"#64748b",h1:"#dbeafe",h2:"#ede9fe",bt:"#ffffff",bub:[[37,99,235],[124,58,237],[14,165,233]]},
 {id:"sky-light",name:"Sky Breeze",price:0,bg:"#eff8ff",c:"#ffffff",a:"#0284c7",v:"#6366f1",t:"#0c2540",m:"#5b7691",h1:"#bae6fd",h2:"#c7d2fe",bt:"#ffffff",bub:[[2,132,199],[99,102,241],[56,189,248]]},
 {id:"mint-light",name:"Mint Fresh",price:0,bg:"#f0fdf4",c:"#ffffff",a:"#059669",v:"#0ea5e9",t:"#052e1b",m:"#4b7a62",h1:"#bbf7d0",h2:"#bae6fd",bt:"#ffffff",bub:[[5,150,105],[14,165,233],[52,211,153]]},
 {id:"rose-light",name:"Rose Petal",price:0,bg:"#fff1f5",c:"#ffffff",a:"#e11d78",v:"#a855f7",t:"#3b0a24",m:"#8a5a73",h1:"#fecdd3",h2:"#f5d0fe",bt:"#ffffff",bub:[[225,29,120],[168,85,247],[244,114,182]]},
 {id:"cream-light",name:"Warm Cream",price:0,bg:"#fffaf0",c:"#ffffff",a:"#d97706",v:"#e11d48",t:"#3b2a10",m:"#8a7355",h1:"#fde68a",h2:"#fecdd3",bt:"#ffffff",bub:[[217,119,6],[225,29,72],[251,191,36]]},
 /* ---- DARK ---- */
 {id:"neon-blue",name:"Neon Blue",price:0,bg:"#0b1020",c:"#151c38",a:"#22d3ee",v:"#7c3aed",t:"#e8ecff",m:"#8b94b8",h1:"#1d2a66",h2:"#4c1d95",bt:"#04121a",bub:[[34,211,238],[124,58,237],[96,165,250]]},
 {id:"classic-navy",name:"Classic Navy",price:0,bg:"#0f172a",c:"#1e293b",a:"#60a5fa",v:"#94a3b8",t:"#f1f5f9",m:"#94a3b8",h1:"#1e3a8a",h2:"#334155",bt:"#0b1220",bub:[[96,165,250],[148,163,184],[56,189,248]]},
 {id:"midnight",name:"Midnight Black",price:80,bg:"#000000",c:"#121212",a:"#38bdf8",v:"#a78bfa",t:"#f5f5f5",m:"#8a8a8a",h1:"#0c2a3d",h2:"#2a1a55",bt:"#00131c",bub:[[56,189,248],[167,139,250],[148,163,184]]},
 {id:"cyber-green",name:"Cyber Green",price:120,bg:"#050f0a",c:"#0e2218",a:"#34d399",v:"#84cc16",t:"#e6fff3",m:"#7fae98",h1:"#064e3b",h2:"#14532d",bt:"#03140c",bub:[[52,211,153],[132,204,22],[16,185,129]]},
 {id:"fire-red",name:"Fire Blaze",price:150,bg:"#120808",c:"#261010",a:"#f97316",v:"#ef4444",t:"#fff0e8",m:"#b58a80",h1:"#7f1d1d",h2:"#9a3412",bt:"#1a0800",bub:[[249,115,22],[239,68,68],[251,191,36]]},
 {id:"ocean-deep",name:"Ocean Deep",price:150,bg:"#04141c",c:"#0a2a38",a:"#2dd4bf",v:"#38bdf8",t:"#e6fbff",m:"#7fb0bd",h1:"#0e4a5c",h2:"#0c3a6b",bt:"#021218",bub:[[45,212,191],[56,189,248],[34,211,238]]},
 {id:"royal-gold",name:"Royal Gold",price:200,bg:"#0f0a1e",c:"#1c1236",a:"#fbbf24",v:"#a855f7",t:"#fff8e1",m:"#b3a5cf",h1:"#4c1d95",h2:"#78350f",bt:"#1a1000",bub:[[251,191,36],[168,85,247],[253,224,71]]},
 {id:"candy-pink",name:"Candy Pink",price:100,bg:"#1f0b1f",c:"#3a1736",a:"#ff7ac8",v:"#c084fc",t:"#fff0fa",m:"#c79ab9",h1:"#9d174d",h2:"#7e22ce",bt:"#2a0620",bub:[[255,122,200],[192,132,252],[251,207,232]]},
 {id:"lavender",name:"Lavender Dream",price:150,bg:"#1a1530",c:"#2a2350",a:"#c4b5fd",v:"#f0abfc",t:"#f5f0ff",m:"#a99fd0",h1:"#5b21b6",h2:"#86198f",bt:"#17103a",bub:[[196,181,253],[240,171,252],[167,139,250]]},
 {id:"peach",name:"Peach Sunset",price:200,bg:"#2a1410",c:"#43211a",a:"#fdba74",v:"#fb7185",t:"#fff3ea",m:"#c9a090",h1:"#9a3412",h2:"#be123c",bt:"#2a1208",bub:[[253,186,116],[251,113,133],[254,215,170]]},
 {id:"sakura",name:"Sakura Night",price:150,bg:"#240d18",c:"#3d1a2b",a:"#fda4af",v:"#f9a8d4",t:"#fff1f3",m:"#c99aa8",h1:"#9f1239",h2:"#86198f",bt:"#2a0a14",bub:[[253,164,175],[249,168,212],[251,207,232]]},
 {id:"berry-wine",name:"Berry Wine",price:200,bg:"#1a0613",c:"#34102a",a:"#f472b6",v:"#fb7185",t:"#ffeef8",m:"#c08aa8",h1:"#831843",h2:"#9f1239",bt:"#2a0620",bub:[[244,114,182],[251,113,133],[217,70,239]]}
];
