/* Force inputs: step F0 u(t-t0), impulse J delta(t-t0), sinusoid F0 sin(Om t + ph). */
(function(g){const M=g.MSD=g.MSD||{};
M.makeForce=function(type,q){const s=Object.assign({type},q);
  if(type==='step')return{spec:s,impulses:[],F:t=>t>=s.t0-1e-12?s.F0:0};
  if(type==='impulse')return{spec:s,impulses:[{t:s.t0,J:s.J}],F:()=>0};
  return{spec:s,impulses:[],F:t=>s.F0*Math.sin(s.Om*t+s.ph)};};
})(typeof window!=='undefined'?window:globalThis);

