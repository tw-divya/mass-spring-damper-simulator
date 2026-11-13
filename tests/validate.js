// Run: node tests/validate.js
for(const f of['rk4-solver','force-inputs','damping-analysis','laplace-analysis'])require('../js/'+f+'.js');
const M=globalThis.MSD;let fail=0;const ok=(n,c,i='')=>{console.log((c?'PASS ':'FAIL ')+n+' '+i);if(!c)fail++;};
// Tests 1-4: classification
[[2,'Underdamped'],[20,'Critically damped'],[30,'Overdamped'],[0,'Undamped']].forEach(([c,e],i)=>ok(`TEST ${i+1} c=${c}`,M.analyse(1,c,100).cls===e,M.analyse(1,c,100).cls));
const err=(p,fs,dt,T=8)=>{const r=M.simulate(p,fs,{dt,T});let e=0;r.t.forEach((t,i)=>e=Math.max(e,Math.abs(r.x[i]-M.analytic(p,fs.spec,t))));return e;};
const base={m:1,k:100,x0:0.05,v0:0};
for(const c of[0,2,20,30]){
  ok(`free response vs exact (c=${c})`,err({...base,c},M.makeForce('step',{F0:0,t0:0}),0.002)<1e-8);
  ok(`step vs exact (c=${c})`,err({...base,c,x0:0},M.makeForce('step',{F0:10,t0:1}),0.001)<1e-6,err({...base,c,x0:0},M.makeForce('step',{F0:10,t0:1}),0.001));
  ok(`impulse vs exact (c=${c})`,err({...base,c,x0:0},M.makeForce('impulse',{J:2,t0:1}),0.001)<1e-6);
  ok(`sine vs exact (c=${c})`,err({...base,c},M.makeForce('sine',{F0:5,Om:3,ph:0.4}),0.002)<1e-6);}
const ri=M.simulate({...base,c:2,x0:0,v0:0.3},M.makeForce('impulse',{J:2,t0:0}),{dt:0.01,T:1});
ok('impulse velocity jump v(0+)=v0+J/m',Math.abs(ri.v[0]-2.3)<1e-12,ri.v[0]);
ok('initial displacement sets x(0)',M.simulate({...base,c:2},M.makeForce('step',{F0:0,t0:0}),{dt:0.01,T:1}).x[0]===0.05);
ok('initial velocity moves mass',M.simulate({...base,c:2,x0:0,v0:1},M.makeForce('step',{F0:0,t0:0}),{dt:0.01,T:1}).x[10]>0);
ok('dt stability (0.05 vs 0.001) close',Math.abs(M.simulate({...base,c:2},M.makeForce('step',{F0:0,t0:0}),{dt:0.05,T:5}).x[100]-M.simulate({...base,c:2},M.makeForce('step',{F0:0,t0:0}),{dt:0.001,T:5}).x[5000])<1e-4);
ok('near-critical tolerance',M.analyse(1,20.0000001,100).cls==='Critically damped');
console.log(fail?`${fail} FAILED`:'ALL PASSED');process.exit(fail?1:0);

