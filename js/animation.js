/* Draws the mechanical model from solver output: x in metres, scale in px/m, Fn = force normalised to [-1,1]. */
(function(g){const M=g.MSD=g.MSD||{};
M.drawSystem=function(cv,x,Fn,scale){const c=cv.getContext('2d'),W=cv.width,H=cv.height,y=H/2,wall=26,eq=W*0.5,bw=76,bh=64;
  const mx=Math.min(Math.max(eq+x*scale,wall+bw+30),W-bw-70);
  c.clearRect(0,0,W,H);c.lineWidth=2.5;c.lineJoin='round';
  c.fillStyle='#1b2760';c.fillRect(0,y-95,wall,190);c.strokeStyle='#6d7bd6';c.strokeRect(0,y-95,wall,190);
  c.setLineDash([6,5]);c.strokeStyle='#7c8db5';c.beginPath();c.moveTo(eq+bw/2,y-100);c.lineTo(eq+bw/2,y+100);c.stroke();c.setLineDash([]);
  c.fillStyle='#7c8db5';c.font='12px sans-serif';c.fillText('equilibrium',eq+bw/2-32,y+116);
  const sy=y-26,n=14,L=mx-wall;c.strokeStyle='#22d3ee';c.beginPath();c.moveTo(wall,sy);c.lineTo(wall+L*.1,sy);
  for(let i=0;i<n;i++)c.lineTo(wall+L*(.1+.8*(i+.5)/n),sy+(i%2?16:-16));
  c.lineTo(wall+L*.9,sy);c.lineTo(mx,sy);c.stroke();
  const dy=y+26,hx=Math.min(Math.max(wall+75+(mx-eq),wall+14),wall+126);
  c.strokeStyle='#a78bfa';c.strokeRect(wall,dy-12,130,24);c.beginPath();c.moveTo(hx,dy);c.lineTo(mx,dy);c.moveTo(hx,dy-9);c.lineTo(hx,dy+9);c.stroke();
  const gr=c.createLinearGradient(mx,y-bh/2,mx+bw,y+bh/2);gr.addColorStop(0,'#4f46e5');gr.addColorStop(1,'#0e7490');
  c.fillStyle=gr;c.fillRect(mx,y-bh/2,bw,bh);c.strokeStyle='#67e8f9';c.strokeRect(mx,y-bh/2,bw,bh);
  c.fillStyle='#fff';c.font='bold 14px sans-serif';c.fillText('m',mx+bw/2-6,y+5);
  if(Math.abs(Fn)>0.02){const x0=mx+bw,x1=x0+Fn*70;c.strokeStyle='#f472b6';c.fillStyle='#f472b6';c.beginPath();c.moveTo(x0,y);c.lineTo(x1,y);c.stroke();
    const d=Fn>0?-9:9;c.beginPath();c.moveTo(x1,y);c.lineTo(x1+d,y-6);c.lineTo(x1+d,y+6);c.fill();c.fillText('F(t)',x0+8,y-12);}
  c.fillStyle='#e6edff';c.font='13px sans-serif';c.fillText(`x = ${x.toFixed(4)} m`,12,22);};
})(typeof window!=='undefined'?window:globalThis);

