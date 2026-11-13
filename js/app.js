/* Laboratory page controller: reads controls, runs the solver, draws animation, graphs, tables. */
(function(){const M=MSD,$=id=>document.getElementById(id),f=M.f;
const COL=['#22d3ee','#a78bfa','#f472b6','#facc15','#34d399','#fb923c'],CMP=[['Underdamped',0.1,'#22d3ee'],['Critically damped',1,'#a78bfa'],['Overdamped',2.5,'#f472b6']];
let exps=[],run,fi,p,pt=0,playing=false,last=performance.now(),hover=null,cmpRuns=[];
const N=id=>+$(id).value||0;
const P=()=>({m:Math.max(N('m'),0.5),k:Math.max(N('k'),1),c:Math.max(N('c'),0),x0:N('x0'),v0:N('v0')});
const FI=()=>M.makeForce($('ft').value,{F0:N('F0'),J:N('J'),t0:Math.max(N('t0'),0),Om:N('Om'),ph:N('ph')*Math.PI/180});
const SIM=q=>M.simulate(q,fi,{dt:N('dt')||0.005,T:Math.min(Math.max(N('T'),1),60)});
function update(){p=P();fi=FI();run=SIM(p);pt=0;
  $('vm').textContent=p.m.toFixed(1)+' kg';$('vk').textContent=p.k+' N/m';$('vc').textContent=f(p.c)+' N·s/m';
  document.querySelectorAll('.f').forEach(e=>e.classList.toggle('hide',!e.classList.contains('f-'+$('ft').value)));
  const a=M.analyse(p.m,p.c,p.k);
  $('info').innerHTML=`<span class="tag">${a.cls}</span><p class="mu">ωn = <b>${f(a.wn)}</b> rad/s · cc = <b>${f(a.cc)}</b> N·s/m · ζ = <b>${f(a.z)}</b><br>Characteristic roots: ${a.roots}</p>`;
  $('lap').textContent=M.laplaceText(p,fi.spec);
  cmpRuns=$('cmp').checked?CMP.map(([n,z,col])=>{const q={...p,c:z*a.cc};return{name:n+` (c=${f(q.c)})`,color:col,run:SIM(q)};}):[];
  let e=0,ok=true;run.t.forEach((t,i)=>{const y=M.analytic(p,fi.spec,t);if(isNaN(y))ok=false;else e=Math.max(e,Math.abs(y-run.x[i]));});
  $('err').textContent=ok?`Max |RK4 − exact inverse-Laplace| = ${e.toExponential(2)} m`:'No exact solution at undamped resonance (numerical only)';
  graphs();}
function series(key){const s=[];
  if(cmpRuns.length)cmpRuns.forEach(r=>s.push({name:r.name,color:r.color,t:r.run.t,y:r.run[key]}));
  else{s.push({name:'Current',color:COL[0],t:run.t,y:run[key]});exps.forEach(e=>s.push({name:e.name,color:e.color,t:e.run.t,y:e.run[key]}));
    if(key==='x'&&!isNaN(M.analytic(p,fi.spec,0)))s.push({name:'Analytical',color:'#fff',dash:true,t:run.t,y:run.t.map(t=>M.analytic(p,fi.spec,t))});}
  return s;}
function graph(cv,ser,title,hx){const w=cv.width=cv.clientWidth,h=cv.height=240,c=cv.getContext('2d'),L=60,R=12,T=28,B=34;
  let lo=1e99,hi=-1e99,tm=0;ser.forEach(s=>{s.y.forEach(v=>{if(isFinite(v)){lo=Math.min(lo,v);hi=Math.max(hi,v);}});tm=Math.max(tm,s.t[s.t.length-1]);});
  if(hi-lo<1e-9){hi+=1;lo-=1;}const pad=(hi-lo)*.08;lo-=pad;hi+=pad;cv._tm=tm;
  const X=t=>L+t/tm*(w-L-R),Y=v=>T+(hi-v)/(hi-lo)*(h-T-B);
  c.fillStyle='#0b1230';c.fillRect(0,0,w,h);c.font='11px sans-serif';c.lineWidth=1;
  for(let i=0;i<=5;i++){const v=lo+(hi-lo)*i/5,y=Y(v),t=tm*i/5,x=X(t);c.strokeStyle='#1c2656';c.beginPath();c.moveTo(L,y);c.lineTo(w-R,y);c.moveTo(x,T);c.lineTo(x,h-B);c.stroke();
    c.fillStyle='#94a3c8';c.fillText(v.toPrecision(2),4,y+4);c.fillText(t.toFixed(1),x-8,h-18);}
  if(lo<0&&hi>0){c.strokeStyle='#4a5a9a';c.beginPath();c.moveTo(L,Y(0));c.lineTo(w-R,Y(0));c.stroke();}
  c.fillStyle='#94a3c8';c.fillText('t (s)',w/2-10,h-4);c.fillStyle='#e6edff';c.font='bold 12px sans-serif';c.fillText(title,L,16);c.font='11px sans-serif';
  ser.forEach(s=>{c.strokeStyle=s.color;c.lineWidth=s.dash?1.5:2;c.setLineDash(s.dash?[5,4]:[]);c.beginPath();
    const st=Math.max(1,Math.floor(s.t.length/800));s.t.forEach((t,i)=>{if(i%st&&i<s.t.length-1)return;i?c.lineTo(X(t),Y(s.y[i])):c.moveTo(X(t),Y(s.y[i]));});c.stroke();});
  c.setLineDash([]);let lx=w-R;ser.slice().reverse().forEach(s=>{const wd=c.measureText(s.name).width+16;lx-=wd;c.fillStyle=s.color;c.fillRect(lx,8,8,8);c.fillStyle='#cbd5f5';c.fillText(s.name,lx+11,16);});
  if(hx!=null){const t=Math.min(Math.max(hx,0),1)*tm,x=X(t);c.strokeStyle='#ffffff66';c.beginPath();c.moveTo(x,T);c.lineTo(x,h-B);c.stroke();
    let y=T+14;c.fillStyle='#fff';ser.forEach(s=>{const i=Math.round(t/tm*(s.t.length-1));c.fillStyle=s.color;c.fillText(`t=${t.toFixed(2)} s: ${f(s.y[i])}`,Math.min(x+6,w-130),y);y+=13;});}}
const G=[['gx','x','Displacement x (m)'],['gv','v','Velocity v (m/s)'],['ga','a','Acceleration a (m/s²)'],['gF','F','Applied force F (N)'+($('ft')&&$('ft').value==='impulse'?' — impulse applied as v jump J/m':'')]];
function graphs(){G.forEach(([id,k,t])=>graph($(id),series(k),id==='gF'?t.split(' —')[0]+($('ft').value==='impulse'?' — impulse applied as velocity jump J/m':''):t,hover));}
G.forEach(([id])=>{const cv=$(id);cv.onmousemove=e=>{const r=cv.getBoundingClientRect();hover=(e.clientX-r.left-60)/(r.width-72);graphs();};cv.onmouseleave=()=>{hover=null;graphs();};});
function table(){$('tb').innerHTML=exps.map((e,i)=>`<tr><td>${i+1}  ${e.name}</td><td>${f(e.p.m)}</td><td>${f(e.p.k)}</td><td>${f(e.p.c)}</td><td>${f(e.o.wn)}</td><td>${f(e.o.cc)}</td><td>${f(e.o.z)}</td><td>${f(e.o.xmax)}</td><td>${f(e.o.xend)}</td><td>${e.o.cls}</td></tr>`).join('')||'<tr><td colspan="10" class="mu">No saved experiments yet. Set parameters, then choose Save experiment.</td></tr>';}
function frame(n){const dt=(n-last)/1000;last=n;if(run){if(playing){pt+=dt*N('sp');const T=run.t[run.t.length-1];if(pt>=T){pt=T;playing=false;}}
  const i=Math.min(run.t.length-1,Math.round(pt/run.dt)),mx=Math.max(...run.x.map(Math.abs),0.02),Fm=Math.max(...run.F.map(Math.abs),1e-9);
  M.drawSystem($('sim'),run.x[i],run.F[i]/Fm,110/mx);$('ro').textContent=`t=${run.t[i].toFixed(2)} s  v=${f(run.v[i])} m/s  a=${f(run.a[i])} m/s²`;}
  requestAnimationFrame(frame);}
document.querySelectorAll('input,select').forEach(e=>{if(e.id!=='sp'&&e.id!=='nm')e.addEventListener('input',update);});
document.querySelectorAll('.pre').forEach(b=>b.onclick=()=>{const a=M.analyse(N('m')||1,0,N('k')||1);$('c').value=Math.min(100,+(+b.dataset.z*a.cc).toFixed(6));update();});
$('bStart').onclick=()=>{if(pt>=run.t[run.t.length-1])pt=0;playing=true;};$('bPause').onclick=()=>playing=false;
$('bReset').onclick=()=>{playing=false;pt=0;};$('bRestart').onclick=()=>{pt=0;playing=true;};
$('bSave').onclick=()=>{exps.push({name:$('nm').value||'Exp '+(exps.length+1),p:{...p},spec:{...fi.spec},run,o:M.observe(p,run),color:COL[1+exps.length%5]});$('nm').value='';table();graphs();};
$('bClear').onclick=()=>{exps=[];table();graphs();};
$('bCSV').onclick=()=>{const s=fi.spec,hd=`# m=${p.m} kg, k=${p.k} N/m, c=${p.c} N.s/m, x0=${p.x0} m, v0=${p.v0} m/s, input=${s.type}, simulation output (RK4, dt=${run.dt} s)\nt_s,x_m,v_m_per_s,a_m_per_s2,F_N\n`;
  const b=new Blob([hd+run.t.map((t,i)=>[t,run.x[i],run.v[i],run.a[i],run.F[i]].join(',')).join('\n')],{type:'text/csv'}),a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='msd_experiment.csv';a.click();};
window.addEventListener('resize',graphs);update();table();requestAnimationFrame(frame);
})();

