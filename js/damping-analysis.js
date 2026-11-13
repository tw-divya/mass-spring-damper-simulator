/* wn, cc, zeta, classification (tolerance, not exact equality), roots, observations, exact solutions. */
(function(g){const M=g.MSD=g.MSD||{};
M.f=x=>(+(+x).toPrecision(4)).toString();
M.TOL=1e-3;
M.analyse=function(m,c,k){const f=M.f,wn=Math.sqrt(k/m),cc=2*Math.sqrt(m*k),z=c/cc;let cls,roots;
  if(c<1e-12){cls='Undamped';roots=`s = ±j${f(wn)}`;}
  else if(Math.abs(z-1)<M.TOL){cls='Critically damped';roots=`s₁ = s₂ = ${f(-wn)}`;}
  else if(z<1){cls='Underdamped';roots=`s = ${f(-z*wn)} ± j${f(wn*Math.sqrt(1-z*z))}`;}
  else{const d=wn*Math.sqrt(z*z-1);cls='Overdamped';roots=`s₁ = ${f(-z*wn+d)},  s₂ = ${f(-z*wn-d)}`;}
  return{wn,cc,z,cls,roots};};
M.observe=function(p,run){const a=M.analyse(p.m,p.c,p.k);
  return Object.assign(a,{xmax:Math.max(...run.x.map(Math.abs)),xend:run.x[run.x.length-1]});};
/* Homogeneous solution [x,v] at time t from (x0,v0). */
M.hom=function(m,c,k,x0,v0,t){const wn=Math.sqrt(k/m),z=c/(2*Math.sqrt(m*k)),s=z*wn;
  if(c<1e-12)return[x0*Math.cos(wn*t)+v0/wn*Math.sin(wn*t),-x0*wn*Math.sin(wn*t)+v0*Math.cos(wn*t)];
  if(Math.abs(z-1)<1e-9){const e=Math.exp(-wn*t),B=v0+wn*x0;return[e*(x0+B*t),e*(v0-wn*B*t)];}
  if(z<1){const wd=wn*Math.sqrt(1-z*z),e=Math.exp(-s*t),C=Math.cos(wd*t),S=Math.sin(wd*t),B=v0+s*x0;
    return[e*(x0*C+B/wd*S),e*(v0*C-(x0*wd+s*B/wd)*S)];}
  const d=wn*Math.sqrt(z*z-1),r1=-s+d,r2=-s-d,B=(v0-r1*x0)/(r2-r1),A=x0-B,e1=Math.exp(r1*t),e2=Math.exp(r2*t);
  return[A*e1+B*e2,A*r1*e1+B*r2*e2];};
/* Exact x(t) from inverse-Laplace results (superposition / shifted initial conditions). NaN at undamped resonance. */
M.analytic=function(p,s,t){const{m,c,k}=p;
  if(s.type==='sine'){const D=k-m*s.Om*s.Om,Q=c*s.Om,X=s.F0/Math.hypot(D,Q),th=Math.atan2(Q,D);
    if(!isFinite(X))return NaN;
    const xp=u=>X*Math.sin(s.Om*u+s.ph-th),vp=u=>X*s.Om*Math.cos(s.Om*u+s.ph-th);
    return xp(t)+M.hom(m,c,k,p.x0-xp(0),p.v0-vp(0),t)[0];}
  if(t<s.t0)return M.hom(m,c,k,p.x0,p.v0,t)[0];
  const st=M.hom(m,c,k,p.x0,p.v0,s.t0);
  return s.type==='step'?s.F0/k+M.hom(m,c,k,st[0]-s.F0/k,st[1],t-s.t0)[0]
                        :M.hom(m,c,k,st[0],st[1]+s.J/m,t-s.t0)[0];};
})(typeof window!=='undefined'?window:globalThis);

