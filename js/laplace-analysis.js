/* Step-by-step Laplace derivation adapted to current parameters (plain text, no external libraries). */
(function(g){const M=g.MSD=g.MSD||{};
M.laplaceText=function(p,s){const f=M.f,a=M.analyse(p.m,p.c,p.k),{m,c,k}=p;
  const Fs={step:`F0/s = ${f(s.F0)}/s`,impulse:`J = ${f(s.J)}`,sine:`F0Ω/(s²+Ω²) = ${f(s.F0*s.Om)}/(s²+${f(s.Om*s.Om)})`}[s.type];
  const z=a.z,wn=a.wn,sg=z*wn,wd=wn*Math.sqrt(Math.abs(1-z*z)),d=wn*Math.sqrt(Math.abs(z*z-1));
  const sh=s.t0>0?`(t−${f(s.t0)})`:'t';
  const inv={
   'Undamped':{step:`x(t) = ${f(s.F0/k)}[1 − cos(${f(wn)}${sh})]`,impulse:`x(t) = ${f(s.J/(m*wn))} sin(${f(wn)}${sh})`},
   'Underdamped':{step:`x(t) = ${f(s.F0/k)}[1 − e^(−${f(sg)}${sh})(cos ${f(wd)}${sh} + ${f(sg/wd)} sin ${f(wd)}${sh})]`,impulse:`x(t) = ${f(s.J/(m*wd))} e^(−${f(sg)}${sh}) sin(${f(wd)}${sh})`},
   'Critically damped':{step:`x(t) = ${f(s.F0/k)}[1 − (1 + ${f(wn)}${sh}) e^(−${f(wn)}${sh})]`,impulse:`x(t) = ${f(s.J/m)} ${sh} e^(−${f(wn)}${sh})`},
   'Overdamped':{step:`x(t) = ${f(s.F0/k)}[1 + (s₂e^(s₁${sh}) − s₁e^(s₂${sh}))/(s₁−s₂)]`,impulse:`x(t) = ${f(s.J/(m*2*d))}[e^(s₁${sh}) − e^(s₂${sh})]`}}[a.cls];
  const X=s.F0/Math.hypot(k-m*s.Om*s.Om,c*s.Om),th=Math.atan2(c*s.Om,k-m*s.Om*s.Om);
  const zi=s.type!=='sine'?inv[s.type]:isFinite(X)?`x(t) = ${f(X)} sin(${f(s.Om)}t ${s.ph?'+ '+f(s.ph)+' ':''}− ${f(th)})  [steady state]\n   + transient (free-response terms decaying at ${f(sg)} s⁻¹)`
    :'Undamped resonance (Ω = ωn): response grows like t·cos(ωn t); only the numerical solution is shown.';
  return `1. Governing ODE:        ${f(m)} x'' + ${f(c)} x' + ${f(k)} x = F(t)
2. Transform each term: m[s²X − s·x(0) − x'(0)] + c[sX − x(0)] + kX = F(s)
3. Initial conditions:  x(0) = ${f(p.x0)} m,  x'(0) = ${f(p.v0)} m/s
4. Input transform:     F(s) = ${Fs}
5. Solve for X(s):      X(s) = [F(s) + ${f(m*p.x0)}s + ${f(m*p.v0+c*p.x0)}] / (${f(m)}s² + ${f(c)}s + ${f(k)})
6. Transfer function:   G(s) = X(s)/F(s) = 1 / (${f(m)}s² + ${f(c)}s + ${f(k)})
7. Characteristic eq.:  ${f(m)}s² + ${f(c)}s + ${f(k)} = 0
8. Roots (${a.cls}):  ${a.roots}
9. Inverse Laplace (zero initial conditions${s.type==='sine'?', steady state + transient':''}):
   ${zi}
   Non-zero x(0), x'(0) add the free-response terms from the X(s) numerator.`;};
})(typeof window!=='undefined'?window:globalThis);

