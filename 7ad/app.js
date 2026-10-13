/* Talk to Celly · 7Ad Cells · part 2 — Celly School
   Story: a big sneeze scatters Celly's parts; the learner wins them back. */
"use strict";
const $=s=>document.querySelector(s);
const card=$("#card");
const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
const S={mode:SR?"talk":"tap",mute:false,results:[],last:[],speaking:false,praise:0,token:0};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
function rec(act,item,first,said){S.results.push({act,item,first,said});}

/* ================= Celly and Very Wobbly Cabbage ================= */
const BODY="M200,64 C280,60 352,112 356,206 C360,296 290,362 200,362 C110,364 42,298 44,208 C46,114 120,68 200,64Z";
const CELLY_SVG=`<svg class="rig idle" id="cellyRig" viewBox="0 0 400 400" role="img" aria-label="Celly the cell">
<ellipse cx="200" cy="384" rx="120" ry="12" fill="#1F2A44" opacity=".08"/>
<g class="whole">
 <g class="armL"><ellipse cx="54" cy="268" rx="21" ry="44" transform="rotate(38 54 268)" class="limb" fill="#FBE7A1" stroke="#2E3F6E" stroke-width="10"/></g>
 <g class="armR"><ellipse cx="346" cy="268" rx="21" ry="44" transform="rotate(-38 346 268)" class="limb" fill="#FBE7A1" stroke="#2E3F6E" stroke-width="10"/></g>
 <path id="cBody" class="tgt" data-part="cytoplasm" d="${BODY}" fill="#FBE7A1"/>
 <path id="cMem" d="${BODY}" fill="none" stroke="#2E3F6E" stroke-width="12" stroke-linejoin="round" pointer-events="none"/>
 <path class="tgt" data-part="membrane" d="${BODY}" fill="none" stroke="transparent" stroke-width="36" pointer-events="stroke"/>
 <path d="M110,190 q8,-78 72,-98 q-48,32 -60,98z" fill="#fff" opacity=".45" pointer-events="none"/>
 <g class="part nuc tgt" id="cNuc" data-part="nucleus"><circle cx="122" cy="140" r="36" fill="#8E6CC9" stroke="#6B4FA6" stroke-width="8"/><circle cx="130" cy="133" r="12" fill="#6B4FA6"/></g>
 <g class="part mito tgt" data-part="mito" transform="translate(292,128) rotate(30)"><rect x="-30" y="-14" width="60" height="28" rx="14" fill="#F29E4C" stroke="#C8742A" stroke-width="6"/><path d="M-17,0 L-10,-6 L-3,6 L3,-6 L10,6 L17,-6" fill="none" stroke="#C8742A" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/></g>
 <g class="part mito tgt" data-part="mito" transform="translate(118,300) rotate(-20)"><rect x="-28" y="-13" width="56" height="26" rx="13" fill="#F29E4C" stroke="#C8742A" stroke-width="6"/><path d="M-16,0 L-9,-6 L-2,6 L4,-6 L11,6 L17,-5" fill="none" stroke="#C8742A" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/></g>
 <g pointer-events="none">
  <g class="eye" id="eyeL"><ellipse cx="166" cy="206" rx="23" ry="27" fill="#fff" stroke="#2E3F6E" stroke-width="6"/><g class="pupil"><circle cx="169" cy="210" r="14" fill="#1F2A44"/><circle cx="174" cy="203" r="5" fill="#fff"/></g></g>
  <g class="eye" id="eyeR"><ellipse cx="236" cy="206" rx="23" ry="27" fill="#fff" stroke="#2E3F6E" stroke-width="6"/><g class="pupil"><circle cx="239" cy="210" r="14" fill="#1F2A44"/><circle cx="244" cy="203" r="5" fill="#fff"/></g></g>
  <path id="browL" d="" fill="none" stroke="#2E3F6E" stroke-width="6" stroke-linecap="round"/>
  <path id="browR" d="" fill="none" stroke="#2E3F6E" stroke-width="6" stroke-linecap="round"/>
  <ellipse cx="136" cy="252" rx="19" ry="12" fill="#F6B8C6"/><ellipse cx="266" cy="252" rx="19" ry="12" fill="#F6B8C6"/>
  <path id="mouth" d="" fill="#7A3550" stroke="#2E3F6E" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/>
 </g>
</g></svg>`;
const CAB_SVG=`<svg class="rig cab" id="cabRig" viewBox="0 0 300 350" role="img" aria-label="Very Wobbly Cabbage, a plant cell">
<ellipse cx="150" cy="336" rx="110" ry="10" fill="#1F2A44" opacity=".08"/>
<g class="whole">
 <rect id="cabWall" x="20" y="40" width="260" height="280" rx="46" fill="#EAF3DA" stroke="#C9B9A3" stroke-width="5" stroke-dasharray="14 10"/>
 <rect x="38" y="58" width="224" height="244" rx="34" fill="none" stroke="#2E3F6E" stroke-width="4"/>
 <g class="part gone" id="cabVac"><rect x="96" y="84" width="108" height="78" rx="34" fill="#BFDDF5" stroke="#6FA8DC" stroke-width="5"/></g>
 <g class="part gone" id="cabChl" fill="#5DAA4E" stroke="#3E7E33" stroke-width="4">
  <ellipse cx="68" cy="100" rx="18" ry="11" transform="rotate(-20 68 100)"/><ellipse cx="234" cy="98" rx="18" ry="11" transform="rotate(20 234 98)"/>
  <ellipse cx="62" cy="236" rx="18" ry="11" transform="rotate(15 62 236)"/><ellipse cx="240" cy="246" rx="18" ry="11" transform="rotate(-15 240 246)"/>
  <ellipse cx="150" cy="284" rx="18" ry="11"/></g>
 <circle cx="70" cy="168" r="15" fill="#8E6CC9" stroke="#6B4FA6" stroke-width="5"/>
 <rect x="206" y="196" width="38" height="18" rx="9" fill="#F29E4C" stroke="#C8742A" stroke-width="4" transform="rotate(25 225 205)"/>
 <ellipse cx="124" cy="200" rx="15" ry="18" fill="#fff" stroke="#2E3F6E" stroke-width="5"/><circle cx="126" cy="203" r="9" fill="#1F2A44"/><circle cx="129" cy="198" r="3" fill="#fff"/>
 <ellipse cx="176" cy="200" rx="15" ry="18" fill="#fff" stroke="#2E3F6E" stroke-width="5"/><circle cx="178" cy="203" r="9" fill="#1F2A44"/><circle cx="181" cy="198" r="3" fill="#fff"/>
 <ellipse cx="104" cy="228" rx="12" ry="8" fill="#F6B8C6"/><ellipse cx="196" cy="228" rx="12" ry="8" fill="#F6B8C6"/>
 <path d="M134,232 Q150,250 166,232 Q150,238 134,232Z" fill="#7A3550" stroke="#2E3F6E" stroke-width="3"/>
</g></svg>`;
const ICON={
  nucleus:'<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="22" fill="#8E6CC9" stroke="#6B4FA6" stroke-width="5"/><circle cx="37" cy="27" r="7" fill="#6B4FA6"/></svg>',
  cytoplasm:'<svg viewBox="0 0 64 64"><path d="M32,6 C50,6 60,18 58,34 C56,52 44,60 30,58 C14,56 6,44 8,30 C10,16 18,6 32,6Z" fill="#FBE7A1" stroke="#E2C565" stroke-width="4"/></svg>',
  membrane:'<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="24" fill="none" stroke="#F27BA0" stroke-width="8"/></svg>',
  mito:'<svg viewBox="0 0 64 64"><g transform="rotate(25 32 32)"><rect x="6" y="20" width="52" height="24" rx="12" fill="#F29E4C" stroke="#C8742A" stroke-width="5"/></g></svg>',
  wall:'<svg viewBox="0 0 64 64"><rect x="8" y="8" width="48" height="48" rx="10" fill="none" stroke="#A9774A" stroke-width="8"/></svg>',
  chloro:'<svg viewBox="0 0 64 64"><ellipse cx="32" cy="32" rx="24" ry="14" fill="#5DAA4E" stroke="#3E7E33" stroke-width="5"/></svg>',
  vacuole:'<svg viewBox="0 0 64 64"><rect x="8" y="14" width="48" height="36" rx="16" fill="#BFDDF5" stroke="#6FA8DC" stroke-width="5"/></svg>'
};
$("#celly").innerHTML=CELLY_SVG;$("#cabbage").innerHTML=CAB_SVG;
const rig=$("#cellyRig");
const Celly={
  have:{nucleus:true,cytoplasm:true,membrane:true,mito:true},
  setPose(p){rig.classList.remove("idle","talk","happy","dance","shiver","spin","wiggle","breath","wave","pump");if(p)p.split(" ").forEach(c=>rig.classList.add(c));},
  pose(p,ms){this.setPose(p);if(ms)setTimeout(()=>{if(!S.speaking)this.setPose("idle")},ms);},
  mouthOpen:0,expr:"smile",
  mouth(open){this.mouthOpen=open;const m=$("#mouth");const e=this.expr;
    m.setAttribute("fill",e==="wavy"||e==="flat"?"none":"#7A3550");
    if(e==="wavy")m.setAttribute("d","M176,262 q8,-9 16,0 t16,0 t16,0");
    else if(e==="flat"&&open<.15)m.setAttribute("d","M184,262 Q200,266 216,259");
    else if(e==="o"){const r=9+open*9;m.setAttribute("d",`M${200-r},260 a${r},${r+2} 0 1,0 ${2*r},0 a${r},${r+2} 0 1,0 ${-2*r},0Z`);}
    else m.setAttribute("d",`M170,250 Q200,${270+open*26} 230,250 Q200,${256+open*6} 170,250Z`);},
  face(e){this.expr=e==="happy"||e==="normal"?"smile":e==="worried"||e==="surprised"?"o":e==="oops"?"wavy":e==="think"?"flat":"smile";
    const bl=$("#browL"),br=$("#browR");
    const B={worried:["M146,172 L182,164","M218,164 L254,172"],oops:["M148,168 L182,170","M218,170 L252,168"],think:["M148,172 L182,172","M220,160 L252,166"],surprised:["M146,162 Q164,152 184,160","M216,160 Q236,152 254,162"]}[e];
    bl.setAttribute("d",B?B[0]:"");br.setAttribute("d",B?B[1]:"");
    if(e==="think")this.look(5,-6);else if(e!=="keep")this.look(0,0);
    this.mouth(0);},
  look(dx,dy){document.querySelectorAll("#cellyRig .pupil").forEach(p=>p.setAttribute("transform",`translate(${dx},${dy})`));},
  part(name,on){const el=name==="nucleus"?[$("#cNuc")]:name==="mito"?[...document.querySelectorAll("#cellyRig .mito")]:[];
    el.forEach(x=>x.classList.toggle("gone",!on));
    if(name==="cytoplasm"){$("#cBody").setAttribute("fill",on?"#FBE7A1":"#F4F0E4");document.querySelectorAll("#cellyRig .limb").forEach(l=>l.setAttribute("fill",on?"#FBE7A1":"#F4F0E4"));}
    if(name==="membrane"){const m=$("#cMem");m.setAttribute("stroke",on?"#2E3F6E":"#BDB6A6");m.setAttribute("stroke-width",on?"12":"5");m.setAttribute("stroke-dasharray",on?"":"14 10");}
    this.have[name]=on;},
  target(name){return name==="nucleus"?$("#cNuc"):name==="mito"?document.querySelector("#cellyRig .mito"):$("#cBody");}
};
Celly.face("normal");
(function blink(){document.querySelectorAll("#cellyRig .eye").forEach(e=>{e.classList.remove("blink");void e.getBBox;requestAnimationFrame(()=>e.classList.add("blink"));});setTimeout(blink,2600+Math.random()*2600);})();
const Cab={part(name,on){if(name==="wall"){const w=$("#cabWall");w.setAttribute("stroke",on?"#A9774A":"#C9B9A3");w.setAttribute("stroke-width",on?"14":"5");w.setAttribute("stroke-dasharray",on?"":"14 10");}
  if(name==="chloro")$("#cabChl").classList.toggle("gone",!on);if(name==="vacuole")$("#cabVac").classList.toggle("gone",!on);},
  target(name){return name==="wall"?$("#cabWall"):name==="chloro"?$("#cabChl"):$("#cabVac");}};

/* ================= sounds: the same warm kalimba as the videos ================= */
let AC=null;
function ac(){try{if(!AC)AC=new(window.AudioContext||window.webkitAudioContext)();if(AC.state==="suspended")AC.resume();}catch(e){}return AC;}
function tone(f,t0,amp,dec,type="sine"){const c=ac();if(!c)return;const t=c.currentTime+t0,o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.value=f;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(amp,t+.018);g.gain.exponentialRampToValueAtTime(.0001,t+dec*4);o.connect(g).connect(c.destination);o.start(t);o.stop(t+dec*4+.05);}
const SFX={
  kal(f=440,t=0,a=.16){tone(f,t,a,.45);tone(2*f,t,a*.06,.12);tone(f/2,t,a*.15,.36);},
  chime(){[392,493.9,587.3].forEach((f,i)=>SFX.kal(f,i*.1,.14));},
  sparkle(){[1568,1976,2349,3136].forEach((f,i)=>{tone(f,i*.07,.04,.4);tone(f*2.01,i*.07,.015,.12);});},
  tap(){SFX.kal(440,0,.12);},
  drum(){SFX.kal(220,0,.22);tone(110,0,.12,.12,"triangle");},
  oops(){SFX.kal(330,0,.1);SFX.kal(294,.12,.1);},
  pop(){const c=ac();if(!c)return;const t=c.currentTime,o=c.createOscillator(),g=c.createGain();o.frequency.setValueAtTime(320,t);o.frequency.exponentialRampToValueAtTime(960,t+.09);g.gain.setValueAtTime(.12,t);g.gain.exponentialRampToValueAtTime(.001,t+.14);o.connect(g).connect(c.destination);o.start(t);o.stop(t+.16);},
  whoosh(){const c=ac();if(!c)return;const n=c.sampleRate*.6,b=c.createBuffer(1,n,c.sampleRate),d=b.getChannelData(0);for(let i=0;i<n;i++)d[i]=(Math.random()*2-1)*(1-i/n);
    const s=c.createBufferSource(),f=c.createBiquadFilter(),g=c.createGain();s.buffer=b;f.type="bandpass";f.frequency.setValueAtTime(400,c.currentTime);f.frequency.exponentialRampToValueAtTime(2400,c.currentTime+.5);g.gain.value=.25;s.connect(f).connect(g).connect(c.destination);s.start();}
};

/* ================= confetti and flying parts ================= */
const fx=$("#fx"),fxc=fx.getContext("2d");let bits=[],fxOn=false;
function confetti(x,y,n=60){const W=innerWidth,H=innerHeight;fx.width=W;fx.height=H;const cols=["#8E6CC9","#FBE7A1","#F27BA0","#F29E4C","#81A63C","#6FA8DC"];
  for(let i=0;i<n;i++)bits.push({x:x??W/2,y:y??H/3,vx:(Math.random()-.5)*12,vy:-Math.random()*12-3,r:4+Math.random()*6,c:cols[i%cols.length],a:Math.random()*6,life:90+Math.random()*40});
  if(!fxOn){fxOn=true;requestAnimationFrame(fxLoop);}}
function fxLoop(){fxc.clearRect(0,0,fx.width,fx.height);bits=bits.filter(b=>b.life-->0);
  for(const b of bits){b.vy+=.35;b.x+=b.vx;b.y+=b.vy;b.a+=.2;fxc.save();fxc.translate(b.x,b.y);fxc.rotate(b.a);fxc.fillStyle=b.c;fxc.fillRect(-b.r/2,-b.r/4,b.r,b.r/2);fxc.restore();}
  if(bits.length)requestAnimationFrame(fxLoop);else{fxOn=false;fxc.clearRect(0,0,fx.width,fx.height);}}
function centre(el){const r=el.getBoundingClientRect();return{x:r.left+r.width/2,y:r.top+r.height/2};}
function fly(icon,from,toEl,ms=850){return new Promise(res=>{const f=document.createElement("div");f.className="flyer";f.innerHTML=ICON[icon];document.body.appendChild(f);
  const a=from,b=centre(toEl);const mid={x:(a.x+b.x)/2,y:Math.min(a.y,b.y)-120};
  const an=f.animate([{transform:`translate(${a.x}px,${a.y}px) scale(.8)`},{transform:`translate(${mid.x}px,${mid.y}px) scale(1.3) rotate(180deg)`},{transform:`translate(${b.x}px,${b.y}px) scale(.6) rotate(360deg)`}],{duration:matchMedia("(prefers-reduced-motion:reduce)").matches?10:ms,easing:"ease-in-out"});
  f.style.left="0";f.style.top="0";an.onfinish=()=>{f.remove();res();};});}
async function partHome(name,fromEl){
  const icon=name==="mito"?"mito":name;const from=fromEl?centre(fromEl):{x:innerWidth/2,y:innerHeight*.75};
  SFX.whoosh();await fly(icon,from,Celly.target(name));Celly.part(name,true);SFX.pop();SFX.chime();
  const c=centre(Celly.target(name));confetti(c.x,c.y,40);Celly.face("happy");Celly.pose("happy",1100);}
async function scatter(){
  const names=["nucleus","mito","membrane","cytoplasm"];SFX.whoosh();
  for(const n of names){const c=centre(Celly.target(n));const f=document.createElement("div");f.className="flyer";f.innerHTML=ICON[n];document.body.appendChild(f);f.style.left="0";f.style.top="0";
    const ang=Math.random()*Math.PI*2,dx=Math.cos(ang)*innerWidth,dy=Math.sin(ang)*innerHeight-200;
    f.animate([{transform:`translate(${c.x}px,${c.y}px)`},{transform:`translate(${c.x+dx}px,${c.y+dy}px) rotate(720deg)`}],{duration:900,easing:"ease-in"}).onfinish=()=>f.remove();
    Celly.part(n,false);await sleep(90);}
}

/* ================= Celly's voice ================= */
let voice=null;
function pickVoice(){if(!("speechSynthesis" in window))return null;const vs=speechSynthesis.getVoices();
  return vs.find(v=>/natural/i.test(v.name)&&/en[-_]GB/i.test(v.lang)&&/sonia|libby|maisie|female/i.test(v.name))||vs.find(v=>/natural/i.test(v.name)&&/en[-_]GB/i.test(v.lang))
   ||vs.find(v=>v.name.indexOf("Google UK English Female")===0)||vs.find(v=>/Libby|Sonia|Hazel|Susan|Serena|Kate|Stephanie/i.test(v.name)&&/en[-_]GB/i.test(v.lang))
   ||vs.find(v=>/en[-_]GB/i.test(v.lang))||vs.find(v=>/^en/i.test(v.lang))||null;}
if("speechSynthesis" in window){speechSynthesis.onvoiceschanged=()=>{voice=pickVoice();};voice=pickVoice();}
let curAudio=null;
function stopVoice(){S.token++;try{speechSynthesis.cancel();}catch(e){}if(curSrc){try{curSrc.stop();}catch(e){}curSrc=null;}curAudio=null;}
function ttsLine(text,tok){return new Promise(res=>{
  if(!("speechSynthesis" in window)){setTimeout(res,600+text.length*45);return;}
  const parts=text.split(/(?<=[.!?])\s+/).filter(Boolean);let i=0;
  const next=()=>{if(tok!==S.token||i>=parts.length){res();return;}
    const t=parts[i++];const u=new SpeechSynthesisUtterance(t);if(voice){u.voice=voice;u.lang=voice.lang;}else u.lang="en-GB";
    const q=/\?$/.test(t),ex=/!$/.test(t);u.rate=voice&&/natural/i.test(voice.name)?.92:.88;u.pitch=q?1.28:ex?1.22:1.08+Math.random()*.08;
    let done=false;const fin=()=>{if(!done){done=true;next();}};u.onend=fin;u.onerror=fin;setTimeout(fin,1800+t.split(/\s+/).length*560);
    speechSynthesis.speak(u);};
  next();});}
/* recorded voice: one sprite file, decoded once, each line played by its start and length */
let spriteBuf=null,spriteLoading=null,curSrc=null;
function loadSprite(){if(spriteBuf||spriteLoading||!window.VOICE.ready)return spriteLoading;const c=ac();if(!c)return null;
  spriteLoading=fetch(window.VOICE.sprite).then(r=>{if(!r.ok)throw 0;return r.arrayBuffer();}).then(b=>new Promise((ok,no)=>c.decodeAudioData(b,ok,no))).then(buf=>{spriteBuf=buf;return buf;}).catch(()=>{window.VOICE.ready=false;return null;});
  return spriteLoading;}
async function clipLine(id,tok){
  const seg=window.VOICE.seg[id];if(!seg)return false;
  if(!spriteBuf){await loadSprite();if(!spriteBuf)return false;}
  if(tok!==S.token)return true;
  const c=ac();return new Promise(res=>{const src=c.createBufferSource();src.buffer=spriteBuf;src.connect(c.destination);curSrc=src;curAudio=src;
    const env=window.VOICE.env[id]||[],t0=c.currentTime+.02;let raf=0,done=false;
    const step=()=>{const k=Math.floor((c.currentTime-t0)/.04);Celly.mouth(k>=0&&k<env.length?env[k]/9:0);if(!done)raf=requestAnimationFrame(step);};
    src.onended=()=>{done=true;cancelAnimationFrame(raf);Celly.mouth(0);curSrc=null;res(true);};
    src.start(t0,seg[0],seg[1]);raf=requestAnimationFrame(step);});}
function textOf(ids){return ids.map(i=>window.LINES[i]||i).join(" ");}
async function say(ids,{face=null,pose=null}={}){
  ids=[].concat(ids);stopVoice();const tok=S.token;S.last=ids;
  $("#say").textContent=textOf(ids);if(face)Celly.face(face);
  S.speaking=true;Celly.setPose(pose||"talk");
  let flap=0;const flapper=()=>{if(!S.speaking)return;if(!curAudio){const t=performance.now()/1000;Celly.mouth(Math.max(0,.15+.55*Math.abs(Math.sin(t*13))*Math.abs(Math.sin(t*3.1))));}flap=requestAnimationFrame(flapper);};
  for(const id of ids){if(tok!==S.token)break;const text=window.LINES[id]||id;
    if(S.mute){await sleep(Math.min(2400,500+text.length*30));continue;}
    let ok=false;if(window.VOICE.ready&&window.LINES[id]){curAudio=null;ok=await clipLine(id,tok);curAudio=null;}
    if(!ok&&tok===S.token){cancelAnimationFrame(flap);flap=requestAnimationFrame(flapper);await ttsLine(text,tok);cancelAnimationFrame(flap);}
    await sleep(120);}
  if(tok===S.token){S.speaking=false;Mic.muteUntil=performance.now()+450;Celly.mouth(0);if(!pose||pose==="talk")Celly.setPose("idle");}
}
function praise(){S.praise=(S.praise%6)+1;return "p"+S.praise;}
$("#again").onclick=()=>{if(S.last.length)say(S.last);};

/* ================= Celly listens (one microphone session for the whole game) ================= */
const Mic={sr:null,want:false,blocked:false,cb:null,muteUntil:0};
Mic.start=function(){if(!SR||Mic.sr||Mic.blocked)return;const r=new SR();r.lang="en-GB";r.continuous=true;r.interimResults=true;r.maxAlternatives=3;
  r.onresult=e=>{for(let i=e.resultIndex;i<e.results.length;i++){const res=e.results[i];if(S.speaking||performance.now()<Mic.muteUntil)continue;
    const alts=[];for(let k=0;k<res.length;k++)alts.push(res[k].transcript.toLowerCase().trim());if(Mic.cb&&alts[0])Mic.cb(alts,res.isFinal);}};
  r.onerror=e=>{if(e.error==="not-allowed"||e.error==="service-not-allowed"){Mic.blocked=true;Mic.want=false;micBlocked();}};
  r.onend=()=>{Mic.sr=null;if(Mic.want&&!Mic.blocked&&S.mode==="talk")setTimeout(()=>Mic.start(),250);};
  Mic.want=true;Mic.sr=r;try{r.start();}catch(e){Mic.sr=null;}};
Mic.stop=function(){Mic.want=false;if(Mic.sr)try{Mic.sr.stop();}catch(e){}};
function micBlocked(){setMode("tap");$("#live").textContent="The microphone is off, so we'll tap. A grown-up can allow the microphone and switch talk mode back on.";}
function canHear(){return S.mode==="talk"&&!!SR&&!Mic.blocked;}
function hear(ms,test){return new Promise(res=>{
  if(!canHear()){res({ok:false,text:null,skipped:true});return;}
  if(!Mic.sr)Mic.start();document.body.classList.add("listening");$("#live").textContent="Your turn. Celly is listening…";
  let last=null,quiet=0,timer=0,done=false;
  const finish=v=>{if(done)return;done=true;clearTimeout(timer);clearTimeout(quiet);Mic.cb=null;document.body.classList.remove("listening");
    $("#live").textContent=v.text?`Celly heard: “${v.text}”`:"";res(v);};
  Mic.cb=(alts,fin)=>{last=alts[0];$("#live").textContent=`I hear: “${alts[0]}”`;const v=test(alts,fin);
    if(v!=null&&v!==false)finish({ok:true,val:v,text:alts[0]});else if(fin){clearTimeout(quiet);quiet=setTimeout(()=>finish({ok:false,text:last}),1300);}};
  timer=setTimeout(()=>finish({ok:false,text:last}),ms);
  S.cancelHear=()=>finish({ok:false,text:last,skipped:true});});}
const norm=s=>s.toLowerCase().replace(/[^a-z ]/g," ").replace(/\s+/g," ").trim();
function lev(a,b){const m=a.length,n=b.length;if(!m)return n;if(!n)return m;let p=Array.from({length:n+1},(_,i)=>i);
  for(let i=1;i<=m;i++){const c=[i];for(let j=1;j<=n;j++)c[j]=Math.min(p[j]+1,c[j-1]+1,p[j-1]+(a[i-1]===b[j-1]?0:1));p=c;}return p[n];}
function skel(w){return w.replace(/gh/g,"").replace(/ph/g,"f").replace(/ch/g,"k").replace(/c(?=[eiy])/g,"s").replace(/[cq]/g,"k").replace(/z/g,"s").replace(/[aeiouyhw]/g,"").replace(/(.)\1+/g,"$1");}
function heardWord(alts,word,extra=[]){
  if(!alts)return false;const target=norm(word).replace(/ /g,"");
  for(const a of alts){const t=norm(a);if(!t)continue;
    for(const v of [word,...extra])if(t.includes(norm(v)))return true;
    const ws=t.split(" ");
    for(let i=0;i<ws.length;i++)for(let k=1;k<=4&&i+k<=ws.length;k++){const chunk=ws.slice(i,i+k).join("");
      if(Math.abs(chunk.length-target.length)>4)continue;
      if(1-lev(chunk,target)/Math.max(chunk.length,target.length)>=.72)return true;
      const x=skel(chunk),y=skel(target);if(x.length>=3&&y.length>=3&&1-lev(x,y)/Math.max(x.length,y.length)>=.7)return true;}}
  return false;}
const heardAny=(alts,keys)=>!!alts&&alts.some(a=>{const t=" "+norm(a)+" ";return keys.some(k=>t.includes(" "+k));});

/* ================= shell ================= */
function setMode(m){S.mode=m;$("#modeTalk").setAttribute("aria-pressed",m==="talk");$("#modeTap").setAttribute("aria-pressed",m==="tap");if(m==="tap"){Mic.stop();if(S.cancelHear)S.cancelHear();}else if(S.started)Mic.start();}
$("#modeTalk").onclick=()=>{if(!SR){$("#live").textContent="This browser can't listen. Please use Chrome or Edge for talk mode.";return;}Mic.blocked=false;setMode("talk");};
$("#modeTap").onclick=()=>setMode("tap");
$("#muteBtn").onclick=()=>{S.mute=!S.mute;$("#muteBtn").setAttribute("aria-pressed",S.mute);$("#muteBtn").textContent=S.mute?"🔇 Celly's voice off":"🔈 Celly's voice on";if(S.mute)stopVoice();};
const TRAIL=["Achoo!","Build the words","Find the parts","Brain break","Plant or both?","Teach Celly","Certificate"];
function trail(n){$("#trail").innerHTML=TRAIL.map((t,i)=>`<span class="step ${i<n?"done":i===n?"now":""}">${i<n?"✓ ":""}${t}</span>`).join("");}
function show(html,n){card.innerHTML=html;if(n!=null)trail(n);if(innerWidth<=820)$("#stage").scrollIntoView({behavior:"smooth",block:"start"});}
function waitClick(sel){return new Promise(r=>{const b=$(sel);if(b)b.onclick=()=>{ac();r();};});}
function bigStage(on){$("#stage").classList.toggle("bigstage",on);}
async function watch(src,label){
  card.insertAdjacentHTML("beforeend",`<video class="clip" id="clip" src="${src}" playsinline controls preload="auto" aria-label="${label}"></video><div class="row"><button class="tbtn" id="skipClip">skip the clip</button></div>`);
  await say("watch",{face:"happy"});
  const v=$("#clip");v.volume=1;
  await new Promise(r=>{let done=false;const fin=()=>{if(!done){done=true;r();}};v.onended=fin;v.onerror=fin;$("#skipClip").onclick=()=>{v.pause();fin();};v.play().catch(()=>{});});
  v.remove();$("#skipClip").parentElement.remove();Celly.pose("happy",900);SFX.pop();}

/* ================= 0 · start and the sneeze ================= */
function start(){
  trail(0);
  show(`<h1>Talk to Celly</h1><p>Celly has a problem, and only you can help. Talk to her, or tap. It goes with Part 2 of the Cells video.</p>
  <div class="row"><button class="big go" id="go">Start</button></div>
  <details class="note"><summary>For the grown-up</summary><p>Use Chrome or Edge. When the browser asks for the microphone, choose “Allow while visiting the site”. It asks once.
  Your child's voice is turned into text by the browser (Google in Chrome, Microsoft in Edge). This page does not record or keep anything. It takes about 10–12 minutes, with a brain break in the middle.</p></details>`,0);
  $("#say").textContent="Hello, scientist! Press Start when you're ready.";
  Celly.pose("wave",1800);
  $("#go").onclick=async()=>{ac();loadSprite();S.started=true;if(canHear())Mic.start();
    show(`<h2>Oh no…</h2><p class="muted">Listen to Celly.</p>`,0);
    await say("hello",{face:"happy",pose:"talk wave"});
    Celly.face("surprised");Celly.setPose("shiver");await say("sneeze",{pose:"shiver"});
    SFX.whoosh();await scatter();Celly.face("oops");Celly.setPose("idle");confetti(innerWidth/2,innerHeight/3,30);
    await say("scattered",{face:"oops"});await say("help",{face:"worried"});Celly.face("normal");
    if(canHear()){
      show(`<h2>Mic check</h2><p>Say: <b>“Hello, Celly!”</b></p><div class="row"><button class="tbtn" id="noMic">Celly can't hear me</button></div>`,0);
      let noMic=false;const skip=new Promise(r=>$("#noMic").onclick=()=>{noMic=true;stopVoice();if(S.cancelHear)S.cancelHear();r();});
      await say("miccheck");
      const got=noMic?{ok:false}:await Promise.race([hear(7000,a=>a[0].length>0),skip.then(()=>({ok:false}))]);
      if(got&&got.ok){SFX.sparkle();await say("heardyou",{face:"happy"});}
      else{await say("nohear",{face:"normal"});}
    }else await say("tapmode",{face:"happy"});
    words();};
}

/* ================= 1 · build the words ================= */
const WORDS=[
  {w:"nucleus",part:"nucleus",syl:["nu","cle","us"],col:"var(--nucleus)",mean:"w_nucleus",ok:["nucleus","nucleas","nucleous","new clear us","nuclear","new cleus"]},
  {w:"cytoplasm",part:"cytoplasm",syl:["cy","to","plasm"],col:"var(--cyto)",mean:"w_cytoplasm",ok:["cytoplasm","cyto plasm","site o plasm","sito plasm","psycho plasm","site of plasm"]},
  {w:"membrane",part:"membrane",syl:["mem","brane"],col:"var(--membrane)",mean:"w_membrane",ok:["membrane","member ain","main brain","mem brain","membrain","membranes"]},
  {w:"mitochondria",part:"mito",syl:["mi","to","chon","dri","a"],col:"var(--mito)",mean:"w_mitochondria",ok:["mitochondria","mitochondrion","mitochondrian","might o condria","mighty condria","mito condria","mitochondrial"]}
];
async function words(){
  trail(1);show(`<h2>Build the words</h2><p class="muted">Each word you build brings one part back to Celly.</p>`,1);
  await watch("media/clip_words.mp4","Nine Cats Make Music, from the Cells video");
  await say("buildintro",{face:"happy"});
  for(let i=0;i<WORDS.length;i++)await buildWord(WORDS[i],i);
  await say("fourback",{face:"happy",pose:"dance"});Celly.setPose("idle");
  label();
}
async function buildWord(W,i){
  let order;do{order=W.syl.map((s,k)=>k).sort(()=>Math.random()-.5);}while(order.every((v,k)=>v===k));
  show(`<h2>Build the word · ${i+1} of ${WORDS.length}</h2>
   <div class="meaning"><span class="swatch" style="background:${W.col}"></span><p>${window.LINES[W.mean]}</p></div>
   <div class="slots" id="slots">${W.syl.map(()=>'<div class="slot"></div>').join("")}</div>
   <div class="tiles" id="tiles">${order.map(k=>`<button class="tile" data-k="${k}">${W.syl[k]}</button>`).join("")}</div><div id="more"></div>`,1);
  say([W.mean,"tapbeats"],{face:"normal"});
  let pos=0,mistakes=0;
  await new Promise(done=>card.querySelectorAll(".tile").forEach(b=>b.onclick=()=>{ac();const k=+b.dataset.k;
    if(k===pos){b.classList.add("used");const s=$("#slots").children[pos];s.textContent=W.syl[k];s.classList.add("filled");pos++;SFX.tap();say("s_"+W.syl[k],{face:"keep"});if(pos===W.syl.length)done();}
    else{mistakes++;b.classList.remove("shake");void b.offsetWidth;b.classList.add("shake");SFX.oops();say("notyet",{face:"oops"});}}));
  Celly.face("happy");Celly.pose("happy",900);SFX.chime();
  $("#tiles").outerHTML=`<div class="wordshow">${W.w}</div>`;
  await say(["built","n_"+(W.w==="mitochondria"?"mitochondria":W.w)],{face:"happy"});
  $("#more").innerHTML=`<div class="row"><button class="drum" id="drum">tap!</button><div class="beats" id="beats">${W.syl.map(()=>"<i></i>").join("")}</div></div>`;
  const drummed=new Promise(done=>{let n=0;$("#drum").onclick=()=>{ac();const d=$("#beats").children;if(n<d.length){d[n].classList.add("on");SFX.drum();say("s_"+W.syl[n],{face:"keep"});n++;if(n===d.length)setTimeout(done,800);}};});
  say("drum");await drummed;
  let said=null;
  if(canHear()){
    $("#more").innerHTML=`<div class="row"><button class="tbtn" id="noMic">Celly can't hear me</button></div>`;
    const test=a=>heardWord(a,W.w,W.ok);
    for(let attempt=0;attempt<2&&said===null;attempt++){
      await say(attempt===0?"sayword":["slowly",...W.syl.map(s=>"s_"+s),"n_"+W.w,"yousay"],{face:"normal"});
      const skip=new Promise(r=>$("#noMic").onclick=()=>{if(S.cancelHear)S.cancelHear();r({skip:true});});
      const got=await Promise.race([hear(7000,test),skip]);
      if(got.skip){said=undefined;break;}
      if(got.ok)said=true;else if(attempt===1)said=false;
    }
    if(said===true){SFX.sparkle();await say(praise(),{face:"happy"});}
    else if(said===false)await say("goodtry",{face:"normal"});
    if(said===undefined)said=null;
  }else{
    $("#more").innerHTML=`<div class="row"><button class="big" id="saidIt">I said it out loud</button></div>`;
    const saidC=waitClick("#saidIt");await say("sayword");await saidC;await say(praise(),{face:"happy"});
  }
  await partHome(W.part,$(".wordshow"));
  await say("back_"+W.w,{face:"happy"});
  rec("Build the word",W.w,mistakes===0,said);
}

/* ================= 2 · find the parts (tap Celly herself) ================= */
const LABELS=[
  {part:"nucleus",ask:"ask_nucleus",is:"is_nucleus",sayit:"sayit_nucleus",name:"nucleus",word:"nucleus",col:"#8E6CC9"},
  {part:"cytoplasm",ask:"ask_cytoplasm",is:"is_cytoplasm",sayit:"sayit_cytoplasm",name:"cytoplasm",word:"cytoplasm",col:"#FBE7A1"},
  {part:"membrane",ask:"ask_membrane",is:"is_membrane",sayit:"sayit_membrane",name:"cell surface membrane",word:"membrane",col:"#F27BA0"},
  {part:"mito",ask:"ask_mito",is:"is_mito",sayit:"sayit_mito",name:"mitochondria",word:"mitochondria",col:"#F29E4C"}
];
async function label(){
  bigStage(true);
  show(`<h2>Find the parts</h2><p class="muted">Are Celly's parts back in the right places? Tap them on Celly.</p>`,2);
  await watch("media/clip_cell.mp4","Build an animal cell, from the Cells video");
  show(`<h2>Find the parts</h2><p class="taphint">👆 Tap the part on Celly.</p><div class="labels" id="labels"></div><div id="more"></div>`,2);
  await say("labelintro",{face:"happy"});
  const tg=[...document.querySelectorAll("#cellyRig .tgt")];tg.forEach(t=>t.classList.add("tapme"));
  for(const L of LABELS){
    say(L.ask,{face:"normal"});let wrong=0;
    await new Promise(done=>tg.forEach(t=>t.onclick=async ev=>{ev.stopPropagation();ac();const got=t.dataset.part;
      if(got===L.part){tg.forEach(x=>x.onclick=null);done();}
      else{wrong++;SFX.oops();const info=LABELS.find(x=>x.part===got);await say([info.is,"tryagain",L.ask],{face:"oops"});}}));
    SFX.chime();Celly.face("happy");Celly.pose("happy",900);if(L.part==="nucleus")$("#cNuc").classList.add("pulse");
    const c=centre(Celly.target(L.part==="membrane"?"cytoplasm":L.part));confetti(c.x,c.y,25);
    $("#labels").insertAdjacentHTML("beforeend",`<span class="lab"><i style="background:${L.col}"></i>${L.name}</span>`);
    let said=null;
    if(canHear()){
      $("#more").innerHTML=`<div class="row"><button class="tbtn" id="noMic">Celly can't hear me</button></div>`;
      await say([praise(),"whatname"],{face:"happy"});
      const skip=new Promise(r=>$("#noMic").onclick=()=>{if(S.cancelHear)S.cancelHear();r({skip:true});});
      const W=WORDS.find(w=>w.w===L.word);
      const got=await Promise.race([hear(7000,a=>heardWord(a,L.word,W?W.ok:[])),skip]);
      if(got.ok){said=true;SFX.sparkle();await say(praise(),{face:"happy"});}
      else if(!got.skip){said=false;await say(L.sayit,{face:"normal"});}
      $("#more").innerHTML="";
    }else await say([praise(),L.is],{face:"happy"});
    $("#cNuc").classList.remove("pulse");
    rec("Find the parts",L.name,wrong===0,said);
  }
  tg.forEach(t=>{t.classList.remove("tapme");t.onclick=null;});
  await say("foundall",{face:"happy",pose:"dance"});Celly.setPose("idle");
  bigStage(false);brainBreak();
}

/* ================= 3 · brain break (from the video) ================= */
async function brainBreak(){
  show(`<h2>Brain break</h2><div class="move" id="move">Stand up!</div><div class="row"><button class="tbtn" id="skipBB">skip the brain break</button></div>`,3);
  let skipped=false;$("#skipBB").onclick=()=>{skipped=true;stopVoice();if(S.cancelHear)S.cancelHear();};
  const moves=[["bb_start","Stand up and copy Celly!","wave"],["bb_fist","✊ Make a fist: nucleus!","talk"],["bb_wiggle","🖐 Wiggle your fingers: cytoplasm!","wiggle"],["bb_circle","⭕ Draw a big circle: membrane!","spin"]];
  for(const [id,text,pose] of moves){if(skipped)break;$("#move").textContent=text;
    if(id==="bb_fist")$("#cNuc").classList.add("pulse");
    await say(id,{face:"happy",pose});Celly.setPose(pose);await sleep(2600);$("#cNuc").classList.remove("pulse");Celly.setPose("idle");}
  if(!skipped){$("#move").textContent="💪 Pump your arms and shout: ENERGY!";
    document.querySelectorAll("#cellyRig .mito").forEach(m=>m.classList.add("glow"));
    await say("bb_energy",{face:"happy",pose:"pump"});Celly.setPose("pump");
    const got=await hear(6000,a=>a[0].length>0);
    if(!skipped){if(got.ok){SFX.sparkle();confetti();await say("bb_heard",{face:"happy",pose:"dance"});}else{await sleep(2500);await say("bb_moves",{face:"happy",pose:"dance"});}}
    document.querySelectorAll("#cellyRig .mito").forEach(m=>m.classList.remove("glow"));
    if(!skipped){$("#move").textContent="😌 Sit down. One slow breath in… and out.";await say("bb_breath",{face:"normal",pose:"breath"});Celly.setPose("breath");await sleep(4200);}}
  Celly.setPose("idle");sortParts();
}

/* ================= 4 · plant cells only, or both? ================= */
const SORT=[
  {n:"nucleus",line:"n_nucleus",bin:"both",col:"var(--nucleus)"},
  {n:"cell wall",line:"n_wall",bin:"plant",col:"var(--wall)",yes:"yes_wall",cab:"wall"},
  {n:"cytoplasm",line:"n_cytoplasm",bin:"both",col:"var(--cyto)"},
  {n:"chloroplasts",line:"n_chloro",bin:"plant",col:"var(--chloro)",yes:"yes_chloro",cab:"chloro"},
  {n:"cell surface membrane",line:"n_csm",bin:"both",col:"var(--membrane)"},
  {n:"vacuole",line:"n_vacuole",bin:"plant",col:"var(--vacuole)",yes:"yes_vacuole",cab:"vacuole"},
  {n:"mitochondria",line:"n_mitochondria",bin:"both",col:"var(--mito)"}
];
async function sortParts(){
  show(`<h2>Plant cells only, or both?</h2><p class="muted">Meet Celly's friend.</p>`,4);
  await watch("media/clip_cabbage.mp4","Plant cell extras, from the Cells video");
  $("#actors").classList.add("withCab");SFX.chime();
  await say("cab_hi",{face:"happy",pose:"wave"});await say("cab_parts",{face:"normal"});
  show(`<h2>Plant cells only, or both?</h2>
   <div class="sortcard" id="sc"></div>
   <div class="bins">
    <button class="bin" id="b-plant">🥬 plant cells only<small>say “plant”</small><span class="got" id="g-plant"></span></button>
    <button class="bin" id="b-both">🥬 + 🙂 both plant and animal cells<small>say “both”</small><span class="got" id="g-both"></span></button>
   </div><div id="more"></div>`,4);
  await say("cab_how");
  for(const C of SORT){
    $("#sc").innerHTML=`<span class="swatch" style="background:${C.col}"></span>${C.n}`;$("#sc").style.animation="none";void $("#sc").offsetWidth;$("#sc").style.animation="";
    let wrong=0,settled=false;
    const ans=await new Promise(async done=>{
      const tryBin=async b=>{if(settled)return;ac();
        if(b===C.bin){settled=true;if(S.cancelHear)S.cancelHear();done(b);}
        else{wrong++;SFX.oops();const el=$("#b-"+b);el.classList.remove("wrong");void el.offsetWidth;el.classList.add("wrong");await say(C.bin==="plant"?"no_plant":"no_both",{face:"oops"});listenLoop();}};
      $("#b-plant").onclick=()=>tryBin("plant");$("#b-both").onclick=()=>tryBin("both");
      const listenLoop=async()=>{if(settled||!canHear())return;
        const got=await hear(8000,a=>heardAny(a,["both","animal","all of them"])?"both":heardAny(a,["plant","plants"])?"plant":null);
        if(settled)return;if(got.ok)tryBin(got.val);else if(!got.skipped&&got.text){await say("say_plantboth");listenLoop();}};
      await say([C.line,"q_plantboth"],{face:"normal"});listenLoop();});
    $("#g-"+ans).insertAdjacentHTML("beforeend",`<span>${C.n}</span>`);
    if(C.cab){SFX.whoosh();await fly(C.cab,centre($("#sc")),Cab.target(C.cab));Cab.part(C.cab,true);SFX.pop();SFX.chime();const c=centre(Cab.target(C.cab));confetti(c.x,c.y,30);await say(C.yes,{face:"happy"});}
    else{SFX.sparkle();await say("yes_both",{face:"happy"});}
    rec("Plant or both?",C.n,wrong===0,null);
  }
  await say("vwc",{face:"happy",pose:"dance"});Celly.setPose("idle");
  teach();
}

/* ================= 5 · teach Celly ================= */
const TEACH=[
  {k:"nucleus",item:"what the nucleus does",keys:["control","controls","controlling","boss","in charge","brain","tells","instructions","command"],opts:["It controls the cell.","It makes food from light.","It is a strong wall."],right:0},
  {k:"membrane",item:"what the membrane does",keys:["in and out","in or out","goes in","go in","comes in","come in","let","lets","enter","leave","out of","inside","outside","what goes"],opts:["It releases energy.","It controls what goes in and out.","It stores cell sap."],right:1},
  {k:"chloro",item:"what chloroplasts do",keys:["light","sun","food","photosynthesis","photosynthesise","photosynthesize","make","glucose","sugar"],opts:["They protect the cell.","They control the cell.","They use light to make food."],right:2}
];
async function teach(){
  for(let i=0;i<TEACH.length;i++){const T=TEACH[i];let ok=false,helped=false;
    show(`<h2>Teach Celly · ${i+1} of ${TEACH.length}</h2><p>Celly forgot something. ${canHear()?"Explain it to her in your own words.":"Tap the best answer."}</p>
     ${canHear()?`<div class="row"><button class="tbtn" id="showOpts">show me some answers</button></div>`:""}<div id="opts"></div>`,5);
    if(canHear()){
      let acc="",earlyOpts=false;$("#showOpts").onclick=()=>{earlyOpts=true;stopVoice();};
      await say(["t_q_"+T.k,"t_explain"],{face:"worried"});
      const r=await new Promise(async done=>{let fin=false;const end=v=>{if(!fin){fin=true;if(S.cancelHear)S.cancelHear();done(v);}};
        $("#showOpts").onclick=()=>end("opts");if(earlyOpts)return end("opts");
        for(let tries=0;tries<2&&!fin;tries++){
          const got=await hear(11000,(a,f)=>{if(f)acc+=" "+a[0];return heardAny([acc+" "+a[0]],T.keys)||null;});
          if(fin)return;if(got.ok)return end("ok");
          if(!got.text){await say("t_nohear",{face:"normal"});continue;}
          return end("help");}
        end("help");});
      if(r==="ok"){ok=true;SFX.sparkle();confetti();await say("t_ok_"+T.k,{face:"happy",pose:"happy"});}
      else if(r==="help"){helped=true;await say("t_help_"+T.k,{face:"think"});await hear(9000,()=>null);SFX.chime();await say("t_gotit",{face:"happy"});}
      else{helped=true;ok=await options(T);}
    }else{await say("t_q_"+T.k,{face:"worried"});ok=await options(T,true);}
    rec("Teach Celly",T.item,ok&&!helped,null);
    $("#opts").insertAdjacentHTML("afterend",`<div class="row"><button class="big" id="next">Next</button></div>`);await waitClick("#next");}
  finish();
}
function options(T,silent){return new Promise(res=>{$("#opts").innerHTML=`<div class="opts">${T.opts.map((o,k)=>`<button class="opt" data-k="${k}">${o}</button>`).join("")}</div>`;
  if(!silent)say("t_three");let wrong=0;
  $("#opts").querySelectorAll(".opt").forEach(b=>b.onclick=async()=>{ac();const k=+b.dataset.k;
    if(k===T.right){$("#opts").querySelectorAll(".opt").forEach(x=>x.onclick=null);b.classList.add("right");SFX.sparkle();await say("t_ok_"+T.k,{face:"happy",pose:"happy"});res(wrong===0);}
    else{wrong++;b.classList.add("wrong");SFX.oops();say("t_notquite",{face:"oops"});}});});}

/* ================= 6 · the end: certificate and grown-up summary ================= */
async function finish(){
  $("#actors").classList.remove("withCab");
  const total=S.results.length,first=S.results.filter(r=>r.first).length;
  const again=[...new Set(S.results.filter(r=>!r.first||r.said===false).map(r=>r.item))];
  const acts=[...new Set(S.results.map(r=>r.act))];
  const rows=acts.map(a=>`<tr><th>${a}</th><td>${S.results.filter(r=>r.act===a).map(r=>`<div>${r.item} ${r.first&&r.said!==false?'<span class="tag ok">secure</span>':'<span class="tag help">needs another go</span>'}</div>`).join("")}</td></tr>`).join("");
  const date=new Date().toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"});
  show(`<div class="cert" id="cert"><div class="t">Celly School certificate</div><h1>Cell Scientist</h1>
   <p>This is to say that</p><div class="n" id="certName">a brilliant scientist</div>
   <p>helped Celly get all her parts back.<br>7Ad Cells · Part 2 · ${date}</p>
   <label class="muted" for="nameIn">Your name (a grown-up can help):</label><input id="nameIn" autocomplete="off" maxlength="30">
   <div class="row"><button class="big" id="saveCert">Save my certificate</button></div></div>
   <details class="note"><summary>For the grown-up: how it went</summary>
   <p>${first} of ${total} right first time. “Needs another go” means your child got there with help, or Celly couldn't hear the word clearly. It is not a mark.
   ${again.length?`Practise these next, with workbook pages 13 to 15: <b>${again.join(", ")}</b>.`:"Everything looks secure. Next: Part 3 of the video, special cells."}</p>
   <div class="tablebox"><table>${rows}</table></div></details>
   <div class="row"><button class="big plain" id="restart">Play again</button></div>`,6);
  $("#nameIn").oninput=e=>{$("#certName").textContent=e.target.value.trim()||"a brilliant scientist";};
  $("#saveCert").onclick=saveCert;$("#restart").onclick=()=>location.reload();
  Celly.face("happy");Celly.setPose("dance");SFX.chime();confetti(undefined,undefined,120);setTimeout(()=>{SFX.sparkle();confetti(undefined,undefined,80);},700);
  await say("f_done",{face:"happy",pose:"dance"});await say("f_whole",{face:"happy",pose:"dance"});
  await say("f_cert",{face:"happy"});await say("f_next",{face:"happy",pose:"wave"});Celly.setPose("idle");Mic.stop();
}
function saveCert(){
  const W=1400,H=990,c=document.createElement("canvas");c.width=W;c.height=H;const g=c.getContext("2d");
  g.fillStyle="#FAF6E9";g.fillRect(0,0,W,H);g.strokeStyle="#81A63C";g.lineWidth=16;g.strokeRect(30,30,W-60,H-60);g.lineWidth=4;g.strokeRect(58,58,W-116,H-116);
  const F='"Lexend", "Segoe UI", Arial, sans-serif';g.fillStyle="#1F2A44";g.textAlign="center";
  g.font=`600 30px ${F}`;g.fillText("CELLY SCHOOL CERTIFICATE",W/2,150);g.font=`600 84px ${F}`;g.fillText("Cell Scientist",W/2,260);
  g.font=`400 34px ${F}`;g.fillText("This is to say that",W/2,340);g.font=`600 64px ${F}`;g.fillText($("#certName").textContent,W/2,430);
  g.font=`400 34px ${F}`;g.fillText("helped Celly get all her parts back.",W/2,500);g.fillStyle="#56607A";g.fillText("7Ad Cells · Part 2 · "+new Date().toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"}),W/2,556);
  g.font=`400 26px ${F}`;g.fillText("www.cellyschool.com",W/2,H-90);
  const svg=new XMLSerializer().serializeToString(rig).replace(/class="rig[^"]*"/,'class="rig"');
  const img=new Image();img.onload=()=>{g.drawImage(img,W/2-170,590,340,340);const a=document.createElement("a");a.download="Celly School certificate - Cell Scientist.png";a.href=c.toDataURL("image/png");document.body.appendChild(a);a.click();a.remove();};
  img.onerror=()=>{const a=document.createElement("a");a.download="Celly School certificate - Cell Scientist.png";a.href=c.toDataURL("image/png");a.click();};
  img.src="data:image/svg+xml;charset=utf-8,"+encodeURIComponent(svg.includes("xmlns=")?svg:svg.replace("<svg",'<svg xmlns="http://www.w3.org/2000/svg"'));
}

/* ================= go ================= */
setMode(S.mode);trail(0);start();
