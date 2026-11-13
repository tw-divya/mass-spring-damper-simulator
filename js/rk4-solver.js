/* RK4 solver for m x'' + c x' + k x = F(t).  State y=[x,v]: x'=v, v'=(F-cv-kx)/m.
   Ideal impulses J*delta(t-t0) are applied as a velocity jump v+=J/m at the first grid point >= t0-dt/2. */
(function(g){const M=g.MSD=g.MSD||{};
M.simulate=function(p,force,o){
  const m=Math.max(p.m,1e-9),dt=Math.min(Math.max(o.dt,1e-4),0.05),n=Math.min(Math.round(o.T/dt),400000);
  const acc=(t,x,v,fr)=>((fr===undefined?force.F(t):force.F(t+dt*(1e-6+fr*(1-2e-6))))-p.c*v-p.k*x)/m;
  /* fr = fraction of the step (0, .5, 1): stage forces are sampled just inside the interval so a step discontinuity at a grid point is handled correctly. */
  const imp=(force.impulses||[]).slice().sort((a,b)=>a.t-b.t);let ii=0,x=p.x0,v=p.v0;
  const r={t:[],x:[],v:[],a:[],F:[],dt};
  for(let i=0;i<=n;i++){const t=i*dt;
    while(ii<imp.length&&imp[ii].t<=t+dt/2){v+=imp[ii].J/m;ii++;}
    r.t.push(t);r.x.push(x);r.v.push(v);r.a.push(acc(t,x,v));r.F.push(force.F(t));
    if(i===n)break;
    const h=dt/2,k1x=v,k1v=acc(t,x,v,0),
      k2x=v+h*k1v,k2v=acc(t,x+h*k1x,v+h*k1v,.5),
      k3x=v+h*k2v,k3v=acc(t,x+h*k2x,v+h*k2v,.5),
      k4x=v+dt*k3v,k4v=acc(t,x+dt*k3x,v+dt*k3v,1);
    x+=dt/6*(k1x+2*k2x+2*k3x+k4x);v+=dt/6*(k1v+2*k2v+2*k3v+k4v);}
  return r;};
})(typeof window!=='undefined'?window:globalThis);

