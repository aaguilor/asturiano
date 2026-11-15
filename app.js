const scenes=[...document.querySelectorAll('.scene')];
const menu=document.querySelector('#menu');
scenes.forEach((s,i)=>{const a=document.createElement('a');a.href='#'+s.id;a.textContent=String(i+1).padStart(2,'0')+' — '+s.dataset.title;menu.append(a)});
const toggle=document.querySelector('#menu-toggle');
function closeMenu(){menu.hidden=true;toggle.setAttribute('aria-expanded','false')}
toggle.addEventListener('click',()=>{menu.hidden=!menu.hidden;toggle.setAttribute('aria-expanded',String(!menu.hidden))});
menu.addEventListener('click',e=>{if(e.target.closest('a'))closeMenu()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeMenu();toggle.focus()}});
const motion=document.querySelector('#motion');const pref=matchMedia('(prefers-reduced-motion: reduce)');let still=pref.matches;
function applyMotion(){document.body.classList.toggle('still',still);motion.textContent=still?'Activar movimiento':'Pausar movimiento';motion.setAttribute('aria-pressed',String(still));schedule()}
motion.addEventListener('click',()=>{const active=scenes.find(s=>{const r=s.getBoundingClientRect();return r.top<=innerHeight*.5&&r.bottom>innerHeight*.5});still=!still;applyMotion();if(active)active.scrollIntoView({behavior:'instant'})});pref.addEventListener('change',e=>{still=e.matches;applyMotion()});
const clamp=(n,a=0,b=1)=>Math.min(b,Math.max(a,n));const smooth=n=>n*n*(3-2*n);
const items=scenes.map(s=>({s,reveals:[...s.querySelectorAll('.reveal')]}));let pending=false;
function render(){pending=false;const vh=innerHeight;let active=0;items.forEach(({s,reveals},i)=>{const rect=s.getBoundingClientRect();if(rect.top<=vh*.5&&rect.bottom>vh*.5)active=i;if(still||rect.top>vh*1.3||rect.bottom<0)return;const travel=Math.max(1,rect.height-vh);const p=clamp(-rect.top/travel);s.style.setProperty('--zoom',String(1.03+p*.15));reveals.forEach((el,k)=>{const delay=Math.min(k*.025,.18);const entry=i===0?1:smooth(clamp((vh-rect.top)/vh*1.2-delay));const exit=smooth(clamp((p-.78)/.22));const opacity=entry*(1-exit);el.style.opacity=opacity.toFixed(3);el.style.transform=`translate3d(${exit*-20}px,${(1-entry)*65-exit*45}px,0)`});const count=s.querySelector('[data-count]');if(count){const entry=smooth(clamp((vh-rect.top)/vh-.15));count.textContent=String(Math.round(62*entry))}});document.querySelector('#counter').textContent=String(active+1).padStart(2,'0')+' / 11';document.querySelector('#chapter-label').textContent=scenes[active].dataset.title.toUpperCase();document.querySelector('#progress').style.width=clamp(scrollY/Math.max(1,document.documentElement.scrollHeight-vh))*100+'%';}
function schedule(){if(!pending){pending=true;requestAnimationFrame(render)}}
addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);applyMotion();
