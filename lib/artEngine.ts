import { CosmicPRNG } from './prng';

export type ArtStyle =
  | 'nebula' | 'crystalline' | 'flowfield' | 'mandala' | 'constellation'
  | 'aurora' | 'fractal' | 'supernova' | 'blackhole' | 'wormhole'
  | 'plasma' | 'galaxy' | 'magnetar' | 'quasar' | 'pulsar'
  | 'interference' | 'voronoi_lines' | 'lissajous' | 'spirograph' | 'trefoil'
  | 'reaction_diffusion' | 'strange_attractor' | 'penrose' | 'celtic_knot' | 'amoeba'
  | 'bioluminescence' | 'coral' | 'mycelium' | 'lightning' | 'ice_crystal'
  | 'oil_slick' | 'chromatic_aberration' | 'glitch' | 'circuit' | 'datamosh'
  | 'watercolor' | 'impressionist' | 'pointillist' | 'chalkboard' | 'neon_sign'
  | 'stained_glass' | 'topography' | 'geode' | 'moiré' | 'diffraction'
  | 'hypercube' | 'klein_bottle' | 'torus_knot' | 'rose_curve' | 'epitrochoid'
  | 'interference_rings' | 'bismuth' | 'soap_bubble' | 'aurora_borealis' | 'dark_matter';

export interface ArtConfig {
  style: ArtStyle;
  palette: string[];
  seed: string;
}

export const ART_STYLES: ArtStyle[] = [
  'nebula','crystalline','flowfield','mandala','constellation',
  'aurora','fractal','supernova','blackhole','wormhole',
  'plasma','galaxy','magnetar','quasar','pulsar',
  'interference','voronoi_lines','lissajous','spirograph','trefoil',
  'reaction_diffusion','strange_attractor','penrose','celtic_knot','amoeba',
  'bioluminescence','coral','mycelium','lightning','ice_crystal',
  'oil_slick','chromatic_aberration','glitch','circuit','datamosh',
  'watercolor','impressionist','pointillist','chalkboard','neon_sign',
  'stained_glass','topography','geode','moiré','diffraction',
  'hypercube','klein_bottle','torus_knot','rose_curve','epitrochoid',
  'interference_rings','bismuth','soap_bubble','aurora_borealis','dark_matter',
];

// ─── Palette generation ──────────────────────────────────────────────────────

function generatePalette(rng: CosmicPRNG): string[] {
  const schemes = [
    () => { const b=rng.range(200,280); return [`hsl(${b},80%,8%)`,`hsl(${b+30},70%,30%)`,`hsl(${b+60},90%,55%)`,`hsl(${b+10},60%,70%)`,`hsl(180,100%,70%)`,`hsl(${b+120},80%,60%)`]; },
    () => { const b=rng.range(0,40); return [`hsl(${b},100%,8%)`,`hsl(${b+15},100%,28%)`,`hsl(${b+30},100%,50%)`,`hsl(${b+45},100%,65%)`,`hsl(60,100%,80%)`,`hsl(${b-10},80%,55%)`]; },
    () => { const b=rng.range(120,200); return [`hsl(${b},100%,4%)`,`hsl(${b},80%,18%)`,`hsl(${b+30},100%,40%)`,`hsl(${b-20},90%,60%)`,`hsl(${b+60},100%,75%)`,`hsl(0,0%,95%)`]; },
    () => { const b=rng.range(240,320); return [`hsl(${b},40%,6%)`,`hsl(${b+20},50%,22%)`,`hsl(${b},60%,45%)`,`hsl(${b+40},70%,60%)`,`hsl(45,90%,70%)`,`hsl(0,0%,90%)`]; },
    () => { const b=rng.range(280,360); return [`hsl(${b%360},90%,5%)`,`hsl(${(b+40)%360},80%,25%)`,`hsl(${(b+80)%360},100%,50%)`,`hsl(${(b+120)%360},90%,65%)`,`hsl(${(b+160)%360},70%,75%)`,`hsl(0,0%,98%)`]; },
    () => [`hsl(0,0%,3%)`,`hsl(220,10%,15%)`,`hsl(210,20%,35%)`,`hsl(200,30%,55%)`,`hsl(190,60%,75%)`,`hsl(180,100%,90%)`],
    () => { const h=rng.range(0,360); return [`hsl(${h},100%,3%)`,`hsl(${h},90%,15%)`,`hsl(${(h+30)%360},100%,40%)`,`hsl(${(h+60)%360},100%,60%)`,`hsl(${(h+90)%360},80%,75%)`,`hsl(60,100%,95%)`]; },
  ];
  return rng.pick(schemes)();
}

// ─── Utility helpers ─────────────────────────────────────────────────────────

function hsla(col: string, alpha: number): string {
  return col.replace('hsl(','hsla(').replace(')',`,${alpha})`);
}

function drawStars(ctx: CanvasRenderingContext2D, rng: CosmicPRNG, w: number, h: number, n=400) {
  for (let i=0;i<n;i++) {
    ctx.beginPath();
    ctx.arc(rng.range(0,w),rng.range(0,h),rng.range(0.2,1.5),0,Math.PI*2);
    ctx.fillStyle=`rgba(255,255,255,${rng.range(0.2,0.8)})`;
    ctx.fill();
  }
}

// ─── Style implementations ────────────────────────────────────────────────────

function drawNebula(ctx: CanvasRenderingContext2D, rng: CosmicPRNG, p: string[], w: number, h: number) {
  const bg=ctx.createRadialGradient(w/2,h/2,0,w/2,h/2,Math.max(w,h));
  bg.addColorStop(0,p[1]); bg.addColorStop(0.5,p[0]); bg.addColorStop(1,'#000005');
  ctx.fillStyle=bg; ctx.fillRect(0,0,w,h);
  for(let i=0;i<8;i++){
    const cx=rng.range(0.1,0.9)*w,cy=rng.range(0.1,0.9)*h,r=rng.range(0.1,0.4)*Math.min(w,h);
    const g=ctx.createRadialGradient(cx,cy,0,cx,cy,r);
    const c=p[rng.int(1,p.length)];
    g.addColorStop(0,hsla(c,0.3)); g.addColorStop(0.5,hsla(c,0.1)); g.addColorStop(1,'transparent');
    ctx.fillStyle=g; ctx.beginPath();
    ctx.ellipse(cx,cy,r*rng.range(0.5,1.5),r*rng.range(0.5,1.5),rng.range(0,Math.PI*2),0,Math.PI*2);
    ctx.fill();
  }
  drawStars(ctx,rng,w,h,800);
}

function drawCrystalline(ctx: CanvasRenderingContext2D, rng: CosmicPRNG, p: string[], w: number, h: number) {
  ctx.fillStyle=p[0]; ctx.fillRect(0,0,w,h);
  const n=rng.int(10,22);
  const sites:[number,number][]=[]; for(let i=0;i<n;i++) sites.push([rng.range(0,w),rng.range(0,h)]);
  const colorIdx=new Uint8Array(w*h); const step=3;
  for(let y=0;y<h;y+=step) for(let x=0;x<w;x+=step){
    let md=Infinity,ni=0;
    for(let i=0;i<sites.length;i++){const dx=x-sites[i][0],dy=y-sites[i][1],d=dx*dx+dy*dy;if(d<md){md=d;ni=i;}}
    for(let dy2=0;dy2<step&&y+dy2<h;dy2++) for(let dx2=0;dx2<step&&x+dx2<w;dx2++) colorIdx[(y+dy2)*w+(x+dx2)]=ni;
  }
  for(let i=0;i<sites.length;i++){
    const [cx,cy]=sites[i];
    const g=ctx.createRadialGradient(cx,cy,0,cx,cy,200);
    g.addColorStop(0,p[i%p.length]); g.addColorStop(1,p[(i+2)%p.length]);
    const angles:number[]=[];
    for(let a=0;a<360;a+=4){
      const rad=(a*Math.PI)/180; let r=8;
      while(r<600){const px=Math.round(cx+Math.cos(rad)*r),py=Math.round(cy+Math.sin(rad)*r);if(px<0||py<0||px>=w||py>=h||colorIdx[py*w+px]!==i)break;r++;}
      angles.push(r-1);
    }
    ctx.beginPath(); ctx.moveTo(cx+Math.cos(0)*angles[0],cy+Math.sin(0)*angles[0]);
    for(let a=1;a<angles.length;a++){const rad=(a*4*Math.PI)/180;ctx.lineTo(cx+Math.cos(rad)*angles[a],cy+Math.sin(rad)*angles[a]);}
    ctx.closePath(); ctx.fillStyle=g; ctx.fill();
    ctx.strokeStyle='rgba(255,255,255,0.15)'; ctx.lineWidth=0.8; ctx.stroke();
  }
  for(const [x,y] of sites){ctx.beginPath();ctx.arc(x,y,2.5,0,Math.PI*2);ctx.fillStyle='rgba(255,255,255,0.7)';ctx.fill();}
}

function drawFlowField(ctx: CanvasRenderingContext2D, rng: CosmicPRNG, p: string[], w: number, h: number) {
  ctx.fillStyle=p[0]; ctx.fillRect(0,0,w,h);
  const sc=rng.range(0.002,0.005),oct=rng.int(3,6);
  const N=(x:number,y:number):number=>{let v=0,a=1,f=sc;for(let o=0;o<oct;o++){v+=Math.sin(x*f)*Math.cos(y*f*1.3)*a;a*=0.5;f*=2.1;}return v;};
  ctx.globalAlpha=0.06; ctx.lineWidth=rng.range(0.5,1.5);
  for(let i=0;i<4000;i++){
    let x=rng.range(0,w),y=rng.range(0,h);
    ctx.strokeStyle=p[rng.int(1,p.length)]; ctx.beginPath(); ctx.moveTo(x,y);
    for(let s=0;s<rng.int(50,180);s++){const a=N(x,y)*Math.PI*4,sp=rng.range(2,6);x+=Math.cos(a)*sp;y+=Math.sin(a)*sp;if(x<0||y<0||x>w||y>h)break;ctx.lineTo(x,y);}
    ctx.stroke();
  }
  ctx.globalAlpha=1;
}

function drawMandala(ctx: CanvasRenderingContext2D, rng: CosmicPRNG, p: string[], w: number, h: number) {
  const bg=ctx.createRadialGradient(w/2,h/2,0,w/2,h/2,Math.max(w,h)/2);
  bg.addColorStop(0,p[1]); bg.addColorStop(1,p[0]); ctx.fillStyle=bg; ctx.fillRect(0,0,w,h);
  ctx.translate(w/2,h/2);
  const sym=rng.pick([6,8,10,12,16]);
  const layers=rng.int(5,10),maxR=Math.min(w,h)*0.45;
  for(let layer=0;layer<layers;layer++){
    const r=(maxR/layers)*(layer+1),as=(Math.PI*2)/sym;
    for(let petal=0;petal<sym;petal++){
      ctx.save(); ctx.rotate(petal*as);
      const col=p[(layer+petal)%p.length];
      ctx.strokeStyle=col; ctx.fillStyle=hsla(col,0.15); ctx.lineWidth=rng.range(0.5,2);
      const pl=r*rng.range(0.3,0.5),pw=r*rng.range(0.05,0.15);
      ctx.beginPath(); ctx.moveTo(0,r-pl);
      ctx.bezierCurveTo(pw,r-pl*0.6,pw,r-pl*0.4,0,r);
      ctx.bezierCurveTo(-pw,r-pl*0.4,-pw,r-pl*0.6,0,r-pl);
      ctx.fill(); ctx.stroke();
      if(rng.chance(0.6)){ctx.beginPath();ctx.arc(0,r-pl*0.5,pw*0.4,0,Math.PI*2);ctx.fillStyle=p[(layer+2)%p.length];ctx.fill();}
      ctx.restore();
    }
    ctx.beginPath();ctx.arc(0,0,r,0,Math.PI*2);ctx.strokeStyle=`rgba(255,255,255,${rng.range(0.04,0.15)})`;ctx.lineWidth=0.5;ctx.stroke();
  }
  const cg=ctx.createRadialGradient(0,0,0,0,0,maxR*0.1);cg.addColorStop(0,'white');cg.addColorStop(1,p[4]||p[2]);
  ctx.beginPath();ctx.arc(0,0,maxR*0.1,0,Math.PI*2);ctx.fillStyle=cg;ctx.fill();
  ctx.setTransform(1,0,0,1,0,0);
}

function drawConstellation(ctx: CanvasRenderingContext2D, rng: CosmicPRNG, p: string[], w: number, h: number) {
  ctx.fillStyle='#000008'; ctx.fillRect(0,0,w,h);
  const nb=ctx.createRadialGradient(w*0.3,h*0.4,0,w*0.3,h*0.4,w*0.7);
  nb.addColorStop(0,hsla(p[1],0.3)); nb.addColorStop(1,'transparent'); ctx.fillStyle=nb; ctx.fillRect(0,0,w,h);
  drawStars(ctx,rng,w,h,600);
  const nodes:[number,number,number][]=[];
  const nn=rng.int(20,40); for(let i=0;i<nn;i++) nodes.push([rng.range(0.05,0.95)*w,rng.range(0.05,0.95)*h,rng.range(1,5)]);
  for(let i=0;i<nodes.length;i++) for(let j=i+1;j<nodes.length;j++){
    const dx=nodes[j][0]-nodes[i][0],dy=nodes[j][1]-nodes[i][1],d=Math.sqrt(dx*dx+dy*dy);
    if(d<w*0.22&&rng.chance(0.4)){
      const g=ctx.createLinearGradient(nodes[i][0],nodes[i][1],nodes[j][0],nodes[j][1]);
      g.addColorStop(0,hsla(p[rng.int(1,4)],0.6)); g.addColorStop(1,hsla(p[rng.int(1,4)],0.2));
      ctx.beginPath();ctx.moveTo(nodes[i][0],nodes[i][1]);ctx.lineTo(nodes[j][0],nodes[j][1]);
      ctx.strokeStyle=g;ctx.lineWidth=rng.range(0.3,1.2);ctx.stroke();
    }
  }
  for(const [x,y,mag] of nodes){
    const r=mag*rng.range(2,5);
    const g=ctx.createRadialGradient(x,y,0,x,y,r*5);
    g.addColorStop(0,'rgba(255,255,255,0.9)');g.addColorStop(0.3,hsla(p[rng.int(1,p.length)],0.4));g.addColorStop(1,'transparent');
    ctx.fillStyle=g;ctx.fillRect(x-r*5,y-r*5,r*10,r*10);
    ctx.beginPath();ctx.arc(x,y,r*0.5,0,Math.PI*2);ctx.fillStyle='white';ctx.fill();
  }
}

function drawAurora(ctx: CanvasRenderingContext2D, rng: CosmicPRNG, p: string[], w: number, h: number) {
  ctx.fillStyle='#000510'; ctx.fillRect(0,0,w,h);
  for(let c=0;c<rng.int(4,8);c++){
    const bx=rng.range(0,w),cw=rng.range(w*0.15,w*0.4),ht=rng.range(h*0.3,h*0.7),yo=rng.range(0,h*0.3);
    const col=p[rng.int(1,p.length)],col2=p[rng.int(1,p.length)];
    ctx.save(); ctx.globalAlpha=rng.range(0.3,0.7);
    for(let s=0;s<30;s++){
      const x=bx+(s/30-0.5)*cw,wy=yo+Math.sin((s/30)*Math.PI*rng.range(2,5))*ht*0.2;
      const g=ctx.createLinearGradient(x,wy,x,wy+ht);
      g.addColorStop(0,'transparent');g.addColorStop(0.2,hsla(col,0.8));g.addColorStop(0.6,hsla(col2,0.5));g.addColorStop(1,'transparent');
      ctx.fillStyle=g;ctx.fillRect(x,wy,cw/30*1.5,ht);
    }
    ctx.restore();
  }
  drawStars(ctx,rng,w,h*0.5,500);
  const hg=ctx.createLinearGradient(0,h*0.7,0,h);hg.addColorStop(0,'transparent');hg.addColorStop(1,hsla(p[2],0.3));
  ctx.fillStyle=hg;ctx.fillRect(0,h*0.7,w,h*0.3);
}

function drawFractal(ctx: CanvasRenderingContext2D, rng: CosmicPRNG, p: string[], w: number, h: number) {
  ctx.fillStyle='#000'; ctx.fillRect(0,0,w,h);
  const cx=rng.range(-0.8,0.8),cy=rng.range(-0.8,0.8),zoom=rng.range(0.5,2.5),maxIter=rng.int(60,150);
  const id=ctx.createImageData(w,h);const d=id.data;
  const tc=document.createElement('canvas');tc.width=1;tc.height=1;const tctx=tc.getContext('2d')!;
  const parsed:number[][]=p.map(c=>{tctx.fillStyle=c;tctx.fillRect(0,0,1,1);const r=tctx.getImageData(0,0,1,1).data;return[r[0],r[1],r[2]];});
  for(let py=0;py<h;py++) for(let px=0;px<w;px++){
    const x0=(px/w-0.5)*4/zoom+cx,y0=(py/h-0.5)*4/zoom+cy;
    let x=0,y=0,iter=0;
    while(x*x+y*y<=4&&iter<maxIter){const xt=x*x-y*y+x0;y=2*x*y+y0;x=xt;iter++;}
    const i=(py*w+px)*4;
    if(iter===maxIter){d[i]=0;d[i+1]=0;d[i+2]=0;d[i+3]=255;}
    else{
      const t=iter/maxIter,ci=Math.floor(t*(p.length-1)),ct=(t*(p.length-1))%1;
      const c1=parsed[ci],c2=parsed[Math.min(ci+1,parsed.length-1)];
      d[i]=c1[0]+(c2[0]-c1[0])*ct;d[i+1]=c1[1]+(c2[1]-c1[1])*ct;d[i+2]=c1[2]+(c2[2]-c1[2])*ct;d[i+3]=255;
    }
  }
  ctx.putImageData(id,0,0);
}

function drawSupernova(ctx: CanvasRenderingContext2D, rng: CosmicPRNG, p: string[], w: number, h: number) {
  ctx.fillStyle='#000'; ctx.fillRect(0,0,w,h);
  const cx=w/2,cy=h/2,rays=rng.int(8,24);
  for(let i=0;i<rays;i++){
    const a=(i/rays)*Math.PI*2,len=rng.range(w*0.3,w*0.6);
    const g=ctx.createLinearGradient(cx,cy,cx+Math.cos(a)*len,cy+Math.sin(a)*len);
    g.addColorStop(0,'white'); g.addColorStop(0.1,p[rng.int(0,p.length)]);
    g.addColorStop(0.5,hsla(p[rng.int(1,p.length)],0.4)); g.addColorStop(1,'transparent');
    ctx.beginPath(); ctx.moveTo(cx,cy);
    const s=Math.PI*2/rays*0.3;
    ctx.lineTo(cx+Math.cos(a-s)*len*0.8,cy+Math.sin(a-s)*len*0.8);
    ctx.lineTo(cx+Math.cos(a)*len,cy+Math.sin(a)*len);
    ctx.lineTo(cx+Math.cos(a+s)*len*0.8,cy+Math.sin(a+s)*len*0.8);
    ctx.closePath(); ctx.fillStyle=g; ctx.fill();
  }
  for(let r=w*0.4;r>5;r*=0.82){
    const g=ctx.createRadialGradient(cx,cy,r*0.9,cx,cy,r);
    g.addColorStop(0,'transparent'); g.addColorStop(0.5,hsla(p[rng.int(0,p.length)],0.08)); g.addColorStop(1,'transparent');
    ctx.fillStyle=g; ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2); ctx.fill();
  }
  const cg=ctx.createRadialGradient(cx,cy,0,cx,cy,w*0.12);
  cg.addColorStop(0,'white'); cg.addColorStop(0.3,p[4]||p[2]); cg.addColorStop(1,'transparent');
  ctx.fillStyle=cg; ctx.fillRect(0,0,w,h);
  drawStars(ctx,rng,w,h,300);
}

function drawBlackhole(ctx: CanvasRenderingContext2D, rng: CosmicPRNG, p: string[], w: number, h: number) {
  ctx.fillStyle='#000'; ctx.fillRect(0,0,w,h);
  drawStars(ctx,rng,w,h,600);
  const cx=w/2,cy=h/2,bhr=w*0.12;
  // Accretion disk
  for(let i=0;i<6;i++){
    const r=bhr*(2+i*0.7),thick=bhr*0.3;
    const g=ctx.createRadialGradient(cx,cy,r-thick,cx,cy,r+thick);
    g.addColorStop(0,'transparent'); g.addColorStop(0.4,hsla(p[rng.int(1,p.length)],0.6)); g.addColorStop(0.6,hsla(p[rng.int(0,p.length)],0.8)); g.addColorStop(1,'transparent');
    ctx.save(); ctx.translate(cx,cy); ctx.scale(1,0.25); ctx.beginPath(); ctx.arc(0,0,r+thick,0,Math.PI*2); ctx.arc(0,0,Math.max(0,r-thick),0,Math.PI*2,true); ctx.fillStyle=g; ctx.fill(); ctx.restore();
  }
  // Gravitational lensing glow
  const lg=ctx.createRadialGradient(cx,cy,bhr,cx,cy,bhr*3);
  lg.addColorStop(0,hsla(p[2],0.5)); lg.addColorStop(1,'transparent');
  ctx.fillStyle=lg; ctx.fillRect(0,0,w,h);
  // Black center
  ctx.beginPath(); ctx.arc(cx,cy,bhr,0,Math.PI*2); ctx.fillStyle='#000'; ctx.fill();
}

function drawWormhole(ctx: CanvasRenderingContext2D, rng: CosmicPRNG, p: string[], w: number, h: number) {
  ctx.fillStyle='#000'; ctx.fillRect(0,0,w,h);
  const cx=w/2,cy=h/2,rings=rng.int(20,40);
  for(let i=0;i<rings;i++){
    const t=i/rings,r=(1-t)*w*0.48+t*5;
    const tilt=t*Math.PI*rng.range(3,8),perspective=0.1+t*0.4;
    ctx.save(); ctx.translate(cx,cy); ctx.scale(1,perspective);
    ctx.beginPath(); ctx.ellipse(0,0,r,r*0.3,tilt,0,Math.PI*2);
    const col=p[Math.floor(t*p.length)%p.length];
    ctx.strokeStyle=hsla(col,1-t*0.7); ctx.lineWidth=rng.range(1,3);
    ctx.stroke(); ctx.restore();
  }
  const cg=ctx.createRadialGradient(cx,cy,0,cx,cy,30);
  cg.addColorStop(0,'white'); cg.addColorStop(0.5,p[3]||p[1]); cg.addColorStop(1,'transparent');
  ctx.fillStyle=cg; ctx.fillRect(cx-40,cy-40,80,80);
}

function drawPlasma(ctx: CanvasRenderingContext2D, rng: CosmicPRNG, p: string[], w: number, h: number) {
  const id=ctx.createImageData(w,h);const d=id.data;
  const a1=rng.range(1,4),a2=rng.range(1,4),a3=rng.range(1,4),a4=rng.range(1,4);
  const tc=document.createElement('canvas');tc.width=1;tc.height=1;const tctx=tc.getContext('2d')!;
  const parsed:number[][]=p.map(c=>{tctx.fillStyle=c;tctx.fillRect(0,0,1,1);const r=tctx.getImageData(0,0,1,1).data;return[r[0],r[1],r[2]];});
  for(let y=0;y<h;y++) for(let x=0;x<w;x++){
    const v=(Math.sin(x/w*a1*Math.PI*2)+Math.sin(y/h*a2*Math.PI*2)+Math.sin((x+y)/(w+h)*a3*Math.PI*2)+Math.sin(Math.sqrt((x-w/2)**2+(y-h/2)**2)/(Math.min(w,h))*a4*Math.PI))/4;
    const t=(v+1)/2,ci=Math.floor(t*(p.length-1)),ct=(t*(p.length-1))%1;
    const c1=parsed[ci],c2=parsed[Math.min(ci+1,parsed.length-1)];
    const i=(y*w+x)*4;
    d[i]=c1[0]+(c2[0]-c1[0])*ct;d[i+1]=c1[1]+(c2[1]-c1[1])*ct;d[i+2]=c1[2]+(c2[2]-c1[2])*ct;d[i+3]=255;
  }
  ctx.putImageData(id,0,0);
}

function drawGalaxy(ctx: CanvasRenderingContext2D, rng: CosmicPRNG, p: string[], w: number, h: number) {
  ctx.fillStyle='#000008'; ctx.fillRect(0,0,w,h);
  const cx=w/2,cy=h/2,arms=rng.int(2,5),n=rng.int(8000,15000);
  const bg=ctx.createRadialGradient(cx,cy,0,cx,cy,w*0.5);
  bg.addColorStop(0,hsla(p[4]||p[2],0.8)); bg.addColorStop(0.2,hsla(p[1],0.4)); bg.addColorStop(1,'transparent');
  ctx.fillStyle=bg; ctx.fillRect(0,0,w,h);
  for(let i=0;i<n;i++){
    const arm=rng.int(0,arms),t=rng.float(),r=t*w*0.45;
    const a=(arm/arms)*Math.PI*2+t*Math.PI*rng.range(2,4)+rng.range(-0.3,0.3);
    const sx=rng.range(-1,1)*r*0.08,sy=rng.range(-1,1)*r*0.08;
    const x=cx+Math.cos(a)*r+sx,y=cy+Math.sin(a)*r*0.5+sy;
    ctx.beginPath(); ctx.arc(x,y,rng.range(0.2,1.2),0,Math.PI*2);
    ctx.fillStyle=`rgba(255,255,255,${rng.range(0.1,0.6)})`;ctx.fill();
  }
  drawStars(ctx,rng,w,h,200);
}

function drawMagnetar(ctx: CanvasRenderingContext2D, rng: CosmicPRNG, p: string[], w: number, h: number) {
  ctx.fillStyle='#000'; ctx.fillRect(0,0,w,h);
  const cx=w/2,cy=h/2,lines=rng.int(60,120);
  for(let i=0;i<lines;i++){
    const a=(i/lines)*Math.PI*2;
    ctx.beginPath(); ctx.moveTo(cx,cy);
    let x=cx,y=cy;
    for(let s=0;s<100;s++){
      const r=s*w*0.005;
      const curv=Math.sin(s*0.15)*rng.range(0.3,1.0);
      x=cx+Math.cos(a+curv)*r*s*0.05;
      y=cy+Math.sin(a+curv)*r*s*0.05;
      ctx.lineTo(x,y);
    }
    const col=p[rng.int(0,p.length)];
    ctx.strokeStyle=hsla(col,rng.range(0.3,0.8)); ctx.lineWidth=rng.range(0.5,2); ctx.stroke();
  }
  const cg=ctx.createRadialGradient(cx,cy,0,cx,cy,w*0.08);
  cg.addColorStop(0,'white');cg.addColorStop(0.5,p[2]);cg.addColorStop(1,'transparent');
  ctx.fillStyle=cg;ctx.fillRect(cx-w*0.1,cy-w*0.1,w*0.2,w*0.2);
}

function drawQuasar(ctx: CanvasRenderingContext2D, rng: CosmicPRNG, p: string[], w: number, h: number) {
  ctx.fillStyle='#000010'; ctx.fillRect(0,0,w,h);
  drawStars(ctx,rng,w,h,500);
  const cx=w/2,cy=h/2;
  // Jets
  for(const dir of [-1,1]){
    const g=ctx.createLinearGradient(cx,cy,cx,cy+dir*h*0.5);
    g.addColorStop(0,'white');g.addColorStop(0.1,p[2]);g.addColorStop(0.5,hsla(p[1],0.3));g.addColorStop(1,'transparent');
    ctx.save();ctx.translate(cx,cy);
    const jw=w*0.04;
    ctx.beginPath();ctx.moveTo(-jw,0);ctx.lineTo(jw,0);ctx.lineTo(jw*0.1,dir*h*0.5);ctx.lineTo(-jw*0.1,dir*h*0.5);ctx.closePath();
    ctx.fillStyle=g;ctx.fill();ctx.restore();
  }
  const ag=ctx.createRadialGradient(cx,cy,w*0.05,cx,cy,w*0.3);
  ag.addColorStop(0,hsla(p[4]||p[2],0.9));ag.addColorStop(0.5,hsla(p[1],0.2));ag.addColorStop(1,'transparent');
  ctx.save();ctx.translate(cx,cy);ctx.scale(1,0.3);
  ctx.beginPath();ctx.arc(0,0,w*0.3,0,Math.PI*2);ctx.fillStyle=ag;ctx.fill();ctx.restore();
  const cg=ctx.createRadialGradient(cx,cy,0,cx,cy,w*0.06);
  cg.addColorStop(0,'white');cg.addColorStop(1,p[3]||p[1]);
  ctx.beginPath();ctx.arc(cx,cy,w*0.06,0,Math.PI*2);ctx.fillStyle=cg;ctx.fill();
}

function drawPulsar(ctx: CanvasRenderingContext2D, rng: CosmicPRNG, p: string[], w: number, h: number) {
  ctx.fillStyle='#000'; ctx.fillRect(0,0,w,h);
  const cx=w/2,cy=h/2,pulses=rng.int(20,50);
  for(let i=0;i<pulses;i++){
    const r=(i/pulses)*w*0.5,col=p[i%p.length];
    const g=ctx.createRadialGradient(cx,cy,r*0.9,cx,cy,r);
    const alpha=rng.range(0.03,0.15);
    g.addColorStop(0,'transparent');g.addColorStop(0.5,hsla(col,alpha));g.addColorStop(1,'transparent');
    ctx.fillStyle=g;ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.fill();
  }
  for(let b=0;b<4;b++){
    const ba=rng.range(0,Math.PI*2);
    const g=ctx.createLinearGradient(cx,cy,cx+Math.cos(ba)*w*0.5,cy+Math.sin(ba)*w*0.5);
    g.addColorStop(0,'white');g.addColorStop(0.2,hsla(p[b%p.length],0.8));g.addColorStop(1,'transparent');
    ctx.beginPath();ctx.moveTo(cx-Math.sin(ba)*3,cy+Math.cos(ba)*3);
    ctx.lineTo(cx+Math.cos(ba)*w*0.5,cy+Math.sin(ba)*w*0.5);
    ctx.lineTo(cx+Math.sin(ba)*3,cy-Math.cos(ba)*3);ctx.closePath();
    ctx.fillStyle=g;ctx.fill();
  }
  ctx.beginPath();ctx.arc(cx,cy,w*0.03,0,Math.PI*2);ctx.fillStyle='white';ctx.fill();
}

function drawInterference(ctx: CanvasRenderingContext2D, rng: CosmicPRNG, p: string[], w: number, h: number) {
  ctx.fillStyle=p[0];ctx.fillRect(0,0,w,h);
  const sources:[number,number][]=[]; const ns=rng.int(3,7);
  for(let i=0;i<ns;i++) sources.push([rng.range(0.1,0.9)*w,rng.range(0.1,0.9)*h]);
  const id=ctx.createImageData(w,h);const d=id.data;
  const tc=document.createElement('canvas');tc.width=1;tc.height=1;const tctx=tc.getContext('2d')!;
  const parsed=p.map(c=>{tctx.fillStyle=c;tctx.fillRect(0,0,1,1);const r=tctx.getImageData(0,0,1,1).data;return[r[0],r[1],r[2]];});
  const wl=rng.range(20,60);
  for(let y=0;y<h;y++) for(let x=0;x<w;x++){
    let v=0; for(const [sx,sy] of sources) v+=Math.sin(Math.sqrt((x-sx)**2+(y-sy)**2)/wl*Math.PI*2);
    const t=(v/sources.length+1)/2,ci=Math.floor(t*(p.length-1)),ct=(t*(p.length-1))%1;
    const c1=parsed[ci],c2=parsed[Math.min(ci+1,parsed.length-1)];
    const i=(y*w+x)*4; d[i]=c1[0]+(c2[0]-c1[0])*ct;d[i+1]=c1[1]+(c2[1]-c1[1])*ct;d[i+2]=c1[2]+(c2[2]-c1[2])*ct;d[i+3]=255;
  }
  ctx.putImageData(id,0,0);
}

function gcd(a: number, b: number): number { return b === 0 ? a : gcd(b, a % b); }
function lcm(a: number, b: number): number { return (a * b) / gcd(a, b); }

function drawLissajous(ctx: CanvasRenderingContext2D, rng: CosmicPRNG, p: string[], w: number, h: number) {
  ctx.fillStyle=p[0]; ctx.fillRect(0,0,w,h);
  const cx=w/2,cy=h/2,rx=w*0.42,ry=h*0.42;
  const ratios=[[1,1],[1,2],[2,3],[3,4],[3,5],[4,5],[5,6],[1,3]];
  const [fa,fb]=rng.pick(ratios); const phi=rng.range(0,Math.PI);
  const layers=rng.int(3,7);
  for(let l=0;l<layers;l++){
    const scale=1-l*0.12; ctx.beginPath();
    ctx.globalAlpha=rng.range(0.3,0.8);
    for(let i=0;i<=1000;i++){
      const t=(i/1000)*Math.PI*2*lcm(fa,fb);
      const x=cx+Math.sin(fa*t+phi)*rx*scale,y=cy+Math.sin(fb*t)*ry*scale;
      i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
    }
    ctx.strokeStyle=p[l%p.length]; ctx.lineWidth=rng.range(0.5,2.5); ctx.stroke();
  }
  ctx.globalAlpha=1;
}

function drawSpirograph(ctx: CanvasRenderingContext2D, rng: CosmicPRNG, p: string[], w: number, h: number) {
  const bg=ctx.createRadialGradient(w/2,h/2,0,w/2,h/2,w*0.7);
  bg.addColorStop(0,p[1]);bg.addColorStop(1,p[0]);ctx.fillStyle=bg;ctx.fillRect(0,0,w,h);
  const cx=w/2,cy=h/2,R=w*0.4,layers=rng.int(3,8);
  for(let l=0;l<layers;l++){
    const r=R*rng.range(0.1,0.5),d=rng.range(0.1,r*0.9),k=r/R;
    ctx.beginPath(); ctx.globalAlpha=rng.range(0.4,0.9);
    for(let i=0;i<=5000;i++){
      const t=(i/5000)*Math.PI*2*rng.int(50,200);
      const x=cx+(R-r)*Math.cos(t)+d*Math.cos((1-k)*t);
      const y=cy+(R-r)*Math.sin(t)-d*Math.sin((1-k)*t);
      i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
    }
    ctx.strokeStyle=p[l%p.length]; ctx.lineWidth=rng.range(0.3,1.5); ctx.stroke();
  }
  ctx.globalAlpha=1;
}

function drawStrangeAttractor(ctx: CanvasRenderingContext2D, rng: CosmicPRNG, p: string[], w: number, h: number) {
  ctx.fillStyle='#000'; ctx.fillRect(0,0,w,h);
  const sigma=rng.range(8,14),rho=rng.range(24,32),beta=rng.range(2,3);
  const dt=0.005; let x=rng.range(-1,1),y=rng.range(-1,1),z=rng.range(20,30);
  // Burn-in
  for(let i=0;i<1000;i++){const dx=sigma*(y-x),dy=x*(rho-z)-y,dz=x*y-beta*z;x+=dx*dt;y+=dy*dt;z+=dz*dt;}
  let minX=Infinity,maxX=-Infinity,minY=Infinity,maxY=-Infinity;
  const pts:[number,number][]=[];
  for(let i=0;i<50000;i++){const dx=sigma*(y-x),dy=x*(rho-z)-y,dz=x*y-beta*z;x+=dx*dt;y+=dy*dt;z+=dz*dt;pts.push([x,z]);if(x<minX)minX=x;if(x>maxX)maxX=x;if(z<minY)minY=z;if(z>maxY)maxY=z;}
  ctx.globalAlpha=0.15;
  for(let i=1;i<pts.length;i++){
    const px=(pts[i][0]-minX)/(maxX-minX)*w*0.9+w*0.05;
    const py=(pts[i][1]-minY)/(maxY-minY)*h*0.9+h*0.05;
    const t=i/pts.length;
    ctx.beginPath();ctx.arc(px,py,0.4,0,Math.PI*2);ctx.fillStyle=p[Math.floor(t*p.length)%p.length];ctx.fill();
  }
  ctx.globalAlpha=1;
}

function drawBioluminescence(ctx: CanvasRenderingContext2D, rng: CosmicPRNG, p: string[], w: number, h: number) {
  ctx.fillStyle='#000508'; ctx.fillRect(0,0,w,h);
  const n=rng.int(60,120);
  for(let i=0;i<n;i++){
    const x=rng.range(0,w),y=rng.range(0,h),r=rng.range(5,40);
    const col=p[rng.int(0,p.length)];
    const g=ctx.createRadialGradient(x,y,0,x,y,r);
    g.addColorStop(0,hsla(col,0.9));g.addColorStop(0.4,hsla(col,0.4));g.addColorStop(1,'transparent');
    ctx.fillStyle=g; ctx.fillRect(x-r,y-r,r*2,r*2);
    // tentacles
    const tentacles=rng.int(3,8);
    for(let t=0;t<tentacles;t++){
      const ta=(t/tentacles)*Math.PI*2;
      ctx.beginPath();ctx.moveTo(x,y);
      for(let s=1;s<=10;s++){
        const tr=r*(1+s*0.3),tx=x+Math.cos(ta+Math.sin(s*0.5)*0.5)*tr,ty=y+Math.sin(ta+Math.sin(s*0.5)*0.5)*tr;
        ctx.lineTo(tx,ty);
      }
      ctx.strokeStyle=hsla(col,rng.range(0.2,0.5)); ctx.lineWidth=0.8; ctx.stroke();
    }
  }
}

function drawLightning(ctx: CanvasRenderingContext2D, rng: CosmicPRNG, p: string[], w: number, h: number) {
  ctx.fillStyle='#000010'; ctx.fillRect(0,0,w,h);
  drawStars(ctx,rng,w,h,400);
  const bolts=rng.int(3,8);
  function drawBolt(x1:number,y1:number,x2:number,y2:number,width:number,depth:number){
    if(depth===0||Math.abs(x2-x1)<2)return;
    const mx=(x1+x2)/2+(rng.range(-1,1)*(Math.abs(x2-x1)+Math.abs(y2-y1))*0.25);
    const my=(y1+y2)/2+(rng.range(-1,1)*(Math.abs(x2-x1)+Math.abs(y2-y1))*0.25);
    ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(mx,my);ctx.lineTo(x2,y2);
    ctx.strokeStyle=`rgba(200,220,255,${Math.min(1,width*0.3)})`;ctx.lineWidth=width;ctx.stroke();
    ctx.strokeStyle=`rgba(255,255,255,${Math.min(1,width*0.5)})`;ctx.lineWidth=width*0.3;ctx.stroke();
    drawBolt(x1,y1,mx,my,width*0.6,depth-1);drawBolt(mx,my,x2,y2,width*0.6,depth-1);
    if(rng.chance(0.3))drawBolt(mx,my,mx+(rng.range(-1,1)*w*0.2),my+(rng.range(0.1,0.5)*h),width*0.4,depth-1);
  }
  for(let b=0;b<bolts;b++) drawBolt(rng.range(w*0.1,w*0.9),0,rng.range(w*0.1,w*0.9),h,rng.range(2,5),rng.int(5,9));
  const flash=ctx.createRadialGradient(w/2,0,0,w/2,0,w*0.5);
  flash.addColorStop(0,`rgba(200,220,255,0.3)`);flash.addColorStop(1,'transparent');
  ctx.fillStyle=flash;ctx.fillRect(0,0,w,h);
}

function drawIceCrystal(ctx: CanvasRenderingContext2D, rng: CosmicPRNG, p: string[], w: number, h: number) {
  const bg=ctx.createLinearGradient(0,0,w,h);bg.addColorStop(0,p[0]);bg.addColorStop(1,p[1]);
  ctx.fillStyle=bg;ctx.fillRect(0,0,w,h);
  ctx.translate(w/2,h/2);
  const arms=6,layers=rng.int(8,16);
  function drawBranch(x:number,y:number,angle:number,len:number,depth:number){
    if(depth===0||len<5)return;
    const ex=x+Math.cos(angle)*len,ey=y+Math.sin(angle)*len;
    ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(ex,ey);
    const col=p[depth%p.length];ctx.strokeStyle=hsla(col,0.7+(depth/10)*0.3);ctx.lineWidth=depth*0.5;ctx.stroke();
    if(rng.chance(0.7))drawBranch(x+Math.cos(angle)*len*0.4,y+Math.sin(angle)*len*0.4,angle+Math.PI/3,len*0.5,depth-1);
    if(rng.chance(0.7))drawBranch(x+Math.cos(angle)*len*0.6,y+Math.sin(angle)*len*0.6,angle-Math.PI/3,len*0.5,depth-1);
    drawBranch(ex,ey,angle,len*rng.range(0.5,0.75),depth-1);
  }
  const br=Math.min(w,h)*0.45;
  for(let a=0;a<arms;a++) drawBranch(0,0,(a/arms)*Math.PI*2,br,layers);
  ctx.setTransform(1,0,0,1,0,0);
}

function drawCircuit(ctx: CanvasRenderingContext2D, rng: CosmicPRNG, p: string[], w: number, h: number) {
  ctx.fillStyle=p[0]; ctx.fillRect(0,0,w,h);
  const grid=40,cols=Math.floor(w/grid),rows=Math.floor(h/grid);
  const nodes:boolean[][]=Array.from({length:rows},()=>Array(cols).fill(false));
  for(let r=0;r<rows;r++) for(let c=0;c<cols;c++) nodes[r][c]=rng.chance(0.4);
  ctx.lineWidth=1.5;
  for(let r=0;r<rows;r++) for(let c=0;c<cols;c++){
    if(!nodes[r][c])continue;
    const x=c*grid+grid/2,y=r*grid+grid/2;
    const col=p[rng.int(1,p.length)];
    // Trace paths to neighbors
    for(const [dr,dc] of [[0,1],[1,0],[0,-1],[-1,0]]){
      const nr=r+dr,nc=c+dc;
      if(nr>=0&&nr<rows&&nc>=0&&nc<cols&&nodes[nr][nc]&&rng.chance(0.6)){
        ctx.beginPath();ctx.moveTo(x,y);
        if(dr===0){ctx.lineTo(x+dc*grid*0.4,y);ctx.lineTo(x+dc*grid*0.4,y+rng.range(-1,1)*grid*0.3);ctx.lineTo(nc*grid+grid/2,nr*grid+grid/2);}
        else{ctx.lineTo(x,y+dr*grid*0.4);ctx.lineTo(x+rng.range(-1,1)*grid*0.3,y+dr*grid*0.4);ctx.lineTo(nc*grid+grid/2,nr*grid+grid/2);}
        ctx.strokeStyle=hsla(col,0.7);ctx.stroke();
      }
    }
    // Node dot
    ctx.beginPath();ctx.arc(x,y,rng.range(2,5),0,Math.PI*2);ctx.fillStyle=col;ctx.fill();
    if(rng.chance(0.3)){ctx.beginPath();ctx.arc(x,y,rng.range(6,12),0,Math.PI*2);ctx.strokeStyle=hsla(col,0.4);ctx.lineWidth=0.5;ctx.stroke();}
  }
}

function drawWatercolor(ctx: CanvasRenderingContext2D, rng: CosmicPRNG, p: string[], w: number, h: number) {
  ctx.fillStyle='#f5f0e8'; ctx.fillRect(0,0,w,h);
  const strokes=rng.int(30,70);
  for(let s=0;s<strokes;s++){
    const cx=rng.range(0,w),cy=rng.range(0,h),r=rng.range(30,180);
    const col=p[rng.int(0,p.length)];
    ctx.save(); ctx.globalAlpha=rng.range(0.05,0.2);
    ctx.beginPath();
    for(let i=0;i<=20;i++){
      const a=(i/20)*Math.PI*2,er=r*(0.7+rng.float()*0.6),ex=cx+Math.cos(a)*er*rng.range(0.8,1.2),ey=cy+Math.sin(a)*er*rng.range(0.8,1.2);
      i===0?ctx.moveTo(ex,ey):ctx.lineTo(ex,ey);
    }
    ctx.closePath();
    const g=ctx.createRadialGradient(cx,cy,0,cx,cy,r);
    g.addColorStop(0,hsla(col,0.8));g.addColorStop(0.7,hsla(col,0.4));g.addColorStop(1,'transparent');
    ctx.fillStyle=g;ctx.fill();ctx.restore();
  }
  // Paper texture dots
  ctx.globalAlpha=0.03;
  for(let i=0;i<w*h/200;i++){ctx.beginPath();ctx.arc(rng.range(0,w),rng.range(0,h),0.5,0,Math.PI*2);ctx.fillStyle='rgba(0,0,0,0.5)';ctx.fill();}
  ctx.globalAlpha=1;
}

function drawPointillist(ctx: CanvasRenderingContext2D, rng: CosmicPRNG, p: string[], w: number, h: number) {
  ctx.fillStyle=p[0]; ctx.fillRect(0,0,w,h);
  const n=rng.int(30000,60000);
  for(let i=0;i<n;i++){
    const x=rng.range(0,w),y=rng.range(0,h);
    const d=Math.sqrt((x-w/2)**2+(y-h/2)**2);
    const t=1-Math.min(1,d/Math.max(w,h)*2);
    const col=p[Math.floor(t*p.length)%p.length];
    ctx.beginPath();ctx.arc(x,y,rng.range(1,5),0,Math.PI*2);
    ctx.fillStyle=hsla(col,rng.range(0.3,0.9));ctx.fill();
  }
}

function drawNeonSign(ctx: CanvasRenderingContext2D, rng: CosmicPRNG, p: string[], w: number, h: number) {
  ctx.fillStyle='#050508'; ctx.fillRect(0,0,w,h);
  const shapes=rng.int(5,12);
  for(let s=0;s<shapes;s++){
    const col=p[rng.int(0,p.length)];
    ctx.shadowBlur=30; ctx.shadowColor=col; ctx.strokeStyle=col; ctx.lineWidth=rng.range(2,5);
    const type=rng.int(0,4);
    if(type===0){ctx.beginPath();ctx.arc(rng.range(w*0.1,w*0.9),rng.range(h*0.1,h*0.9),rng.range(20,120),0,Math.PI*2);ctx.stroke();}
    else if(type===1){const x=rng.range(w*0.05,w*0.7),y=rng.range(h*0.05,h*0.7),sw=rng.range(50,200),sh=rng.range(50,200);ctx.strokeRect(x,y,sw,sh);}
    else if(type===2){ctx.beginPath();const pts=rng.int(3,8);for(let i=0;i<=pts;i++){const a=(i/pts)*Math.PI*2,r=rng.range(40,150),x=rng.range(w*0.2,w*0.8)+Math.cos(a)*r,y=rng.range(h*0.2,h*0.8)+Math.sin(a)*r;i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);}ctx.closePath();ctx.stroke();}
    else{ctx.beginPath();ctx.moveTo(rng.range(0,w),rng.range(0,h));for(let i=0;i<5;i++)ctx.lineTo(rng.range(0,w),rng.range(0,h));ctx.stroke();}
    ctx.shadowBlur=0;
  }
}

function drawStainedGlass(ctx: CanvasRenderingContext2D, rng: CosmicPRNG, p: string[], w: number, h: number) {
  ctx.fillStyle='#111'; ctx.fillRect(0,0,w,h);
  const n=rng.int(30,60);
  const pts:[number,number][]=[]; for(let i=0;i<n;i++) pts.push([rng.range(-50,w+50),rng.range(-50,h+50)]);
  pts.push([0,0],[w,0],[0,h],[w,h]);
  for(let i=0;i<pts.length;i++){
    const [px,py]=pts[i]; const col=p[rng.int(0,p.length)];
    const g=ctx.createRadialGradient(px,py,0,px,py,rng.range(60,150));
    g.addColorStop(0,hsla(col,0.9));g.addColorStop(0.6,hsla(col,0.6));g.addColorStop(1,'transparent');
    ctx.beginPath();
    const near=pts.map((q,j)=>{const d=Math.sqrt((q[0]-px)**2+(q[1]-py)**2);return{d,j};}).sort((a,b)=>a.d-b.d).slice(1,6);
    if(near.length<3)continue;
    ctx.moveTo((px+pts[near[0].j][0])/2,(py+pts[near[0].j][1])/2);
    for(const nb of near)ctx.lineTo((px+pts[nb.j][0])/2,(py+pts[nb.j][1])/2);
    ctx.closePath();ctx.fillStyle=g;ctx.fill();
    ctx.strokeStyle='rgba(0,0,0,0.8)';ctx.lineWidth=2;ctx.stroke();
  }
}

function drawTopography(ctx: CanvasRenderingContext2D, rng: CosmicPRNG, p: string[], w: number, h: number) {
  ctx.fillStyle=p[0]; ctx.fillRect(0,0,w,h);
  const levels=rng.int(20,40);
  for(let l=0;l<levels;l++){
    const t=l/levels,col=p[Math.floor(t*p.length)%p.length];
    const threshold=t;
    ctx.beginPath(); let started=false;
    const step=4;
    for(let y=0;y<=h;y+=step){
      for(let x=0;x<=w;x+=step){
        const v=(Math.sin(x/w*rng.range(3,8)*Math.PI+rng.float())+Math.sin(y/h*rng.range(2,6)*Math.PI+rng.float()))/2;
        const nv=(v+1)/2;
        if(Math.abs(nv-threshold)<0.025){!started?(ctx.moveTo(x,y),started=true):ctx.lineTo(x,y);}
      }
    }
    ctx.strokeStyle=hsla(col,0.5); ctx.lineWidth=0.8; ctx.stroke();
  }
}

function drawGeode(ctx: CanvasRenderingContext2D, rng: CosmicPRNG, p: string[], w: number, h: number) {
  const bg=ctx.createRadialGradient(w/2,h/2,0,w/2,h/2,w*0.7);
  bg.addColorStop(0,p[0]);bg.addColorStop(1,'#000');ctx.fillStyle=bg;ctx.fillRect(0,0,w,h);
  const cx=w/2,cy=h/2,layers=rng.int(15,30);
  for(let l=layers;l>=0;l--){
    const r=(l/layers)*Math.min(w,h)*0.48,col=p[l%p.length];
    const pts=rng.int(12,24);
    ctx.beginPath();
    for(let i=0;i<=pts;i++){
      const a=(i/pts)*Math.PI*2,er=r*(0.85+rng.float()*0.3);
      const x=cx+Math.cos(a)*er,y=cy+Math.sin(a)*er;
      i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
    }
    ctx.closePath();
    const g=ctx.createRadialGradient(cx,cy,r*0.7,cx,cy,r);
    g.addColorStop(0,hsla(col,0.9));g.addColorStop(0.5,col);g.addColorStop(1,hsla(col,0.5));
    ctx.fillStyle=g;ctx.fill();ctx.strokeStyle='rgba(255,255,255,0.15)';ctx.lineWidth=0.5;ctx.stroke();
  }
  const cg=ctx.createRadialGradient(cx,cy,0,cx,cy,w*0.08);cg.addColorStop(0,'white');cg.addColorStop(1,'transparent');
  ctx.fillStyle=cg;ctx.fillRect(cx-w*0.1,cy-w*0.1,w*0.2,w*0.2);
}

function drawMoire(ctx: CanvasRenderingContext2D, rng: CosmicPRNG, p: string[], w: number, h: number) {
  ctx.fillStyle=p[0]; ctx.fillRect(0,0,w,h);
  const layers=rng.int(2,4);
  for(let l=0;l<layers;l++){
    const spacing=rng.range(5,20),angle=rng.range(0,Math.PI);
    const col=p[l%p.length];
    ctx.save(); ctx.translate(w/2,h/2); ctx.rotate(angle);
    for(let y=-h;y<h;y+=spacing){
      ctx.beginPath();ctx.moveTo(-w,y);ctx.lineTo(w,y);
      ctx.strokeStyle=hsla(col,0.6); ctx.lineWidth=spacing*0.4; ctx.stroke();
    }
    ctx.restore();
  }
}

function drawRoseCurve(ctx: CanvasRenderingContext2D, rng: CosmicPRNG, p: string[], w: number, h: number) {
  const bg=ctx.createRadialGradient(w/2,h/2,0,w/2,h/2,w*0.7);bg.addColorStop(0,p[1]);bg.addColorStop(1,p[0]);ctx.fillStyle=bg;ctx.fillRect(0,0,w,h);
  ctx.translate(w/2,h/2);
  const k=rng.pick([2,3,4,5,6,7,8]),r=Math.min(w,h)*0.45;
  const layers=rng.int(3,8);
  for(let l=0;l<layers;l++){
    ctx.beginPath(); ctx.globalAlpha=rng.range(0.4,0.9);
    const scale=1-l*0.08;
    for(let i=0;i<=2000;i++){
      const t=(i/2000)*Math.PI*(k%2===0?2:1)*2;
      const rd=r*Math.cos(k*t)*scale;
      i===0?ctx.moveTo(rd*Math.cos(t),rd*Math.sin(t)):ctx.lineTo(rd*Math.cos(t),rd*Math.sin(t));
    }
    ctx.strokeStyle=p[l%p.length]; ctx.lineWidth=rng.range(0.5,2); ctx.stroke();
  }
  ctx.globalAlpha=1; ctx.setTransform(1,0,0,1,0,0);
}

function drawHypercube(ctx: CanvasRenderingContext2D, rng: CosmicPRNG, p: string[], w: number, h: number) {
  ctx.fillStyle=p[0]; ctx.fillRect(0,0,w,h);
  const cx=w/2,cy=h/2,s=Math.min(w,h)*0.3;
  const rotX=rng.range(0,Math.PI*2),rotY=rng.range(0,Math.PI*2),rotZ=rng.range(0,Math.PI*2);
  const project=(x4:number,y4:number,z4:number,w4:number):[number,number]=>{
    const wd=4,d=5;
    const pw4=d/(d-w4/wd)*x4,ph4=d/(d-w4/wd)*y4;
    const pz=d/(d-z4/wd)*pw4,qz=d/(d-z4/wd)*ph4;
    return [cx+pz*s,cy+qz*s];
  };
  // 16 vertices of 4D hypercube
  const verts:number[][]=[];
  for(let i=0;i<16;i++) verts.push([(i>>3&1)*2-1,(i>>2&1)*2-1,(i>>1&1)*2-1,(i>>0&1)*2-1]);
  const rot=(v:number[])=>{
    let [x,y,z,w4]=v;
    const cos=Math.cos,sin=Math.sin;
    [y,z]=[y*cos(rotX)-z*sin(rotX),y*sin(rotX)+z*cos(rotX)];
    [x,z]=[x*cos(rotY)+z*sin(rotY),-x*sin(rotY)+z*cos(rotY)];
    [x,y]=[x*cos(rotZ)-y*sin(rotZ),x*sin(rotZ)+y*cos(rotZ)];
    return[x,y,z,w4];
  };
  const projected=verts.map(v=>{const r=rot(v);return project(r[0],r[1],r[2],r[3]);});
  // Draw edges
  for(let i=0;i<16;i++) for(let j=i+1;j<16;j++){
    const diff=(i^j);if(diff===0||(diff&(diff-1))!==0)continue; // only power-of-2 differences = edges
    const col=p[(i+j)%p.length];
    ctx.beginPath();ctx.moveTo(projected[i][0],projected[i][1]);ctx.lineTo(projected[j][0],projected[j][1]);
    ctx.strokeStyle=hsla(col,0.7); ctx.lineWidth=rng.range(1,2.5); ctx.stroke();
  }
  for(const [px,py] of projected){ctx.beginPath();ctx.arc(px,py,3,0,Math.PI*2);ctx.fillStyle='white';ctx.fill();}
}

function drawTorusKnot(ctx: CanvasRenderingContext2D, rng: CosmicPRNG, p: string[], w: number, h: number) {
  ctx.fillStyle=p[0]; ctx.fillRect(0,0,w,h);
  const cx=w/2,cy=h/2,R=Math.min(w,h)*0.35,r=Math.min(w,h)*0.15;
  const pn=rng.int(2,5),qn=rng.int(3,7),n=5000;
  for(let l=0;l<rng.int(2,5);l++){
    ctx.beginPath(); ctx.globalAlpha=rng.range(0.5,1.0);
    for(let i=0;i<=n;i++){
      const t=(i/n)*Math.PI*2;
      const phi=t*pn,theta=t*qn;
      const x=(R+r*Math.cos(phi))*Math.cos(theta);
      const y=(R+r*Math.cos(phi))*Math.sin(theta);
      const z=r*Math.sin(phi);
      const scale=1+z/(Math.min(w,h)*0.8);
      const px=cx+x*scale,py=cy+y*scale;
      i===0?ctx.moveTo(px,py):ctx.lineTo(px,py);
    }
    ctx.strokeStyle=p[l%p.length]; ctx.lineWidth=rng.range(0.5,2.5); ctx.stroke();
  }
  ctx.globalAlpha=1;
}

function drawSoapBubble(ctx: CanvasRenderingContext2D, rng: CosmicPRNG, p: string[], w: number, h: number) {
  ctx.fillStyle='#000810'; ctx.fillRect(0,0,w,h);
  const n=rng.int(10,25);
  for(let i=0;i<n;i++){
    const cx=rng.range(w*0.1,w*0.9),cy=rng.range(h*0.1,h*0.9),r=rng.range(30,180);
    // Iridescent ring
    for(let ring=0;ring<8;ring++){
      const rr=r*(1-ring*0.05);
      const g=ctx.createRadialGradient(cx,cy,rr*0.9,cx,cy,rr);
      g.addColorStop(0,hsla(p[0],0.4));g.addColorStop(0.25,hsla(p[rng.int(0,p.length)],0.4));g.addColorStop(0.5,hsla(p[rng.int(0,p.length)],0.4));g.addColorStop(0.75,hsla(p[rng.int(0,p.length)],0.4));g.addColorStop(1,hsla(p[0],0.4));
      ctx.beginPath();ctx.arc(cx,cy,rr,0,Math.PI*2);ctx.strokeStyle=g;ctx.lineWidth=ring===0?2:0.5;ctx.stroke();
    }
    // Highlight
    ctx.beginPath();ctx.arc(cx-r*0.3,cy-r*0.3,r*0.15,0,Math.PI*2);ctx.fillStyle='rgba(255,255,255,0.3)';ctx.fill();
  }
}

function drawDarkMatter(ctx: CanvasRenderingContext2D, rng: CosmicPRNG, p: string[], w: number, h: number) {
  ctx.fillStyle='#000005'; ctx.fillRect(0,0,w,h);
  // Filaments (cosmic web)
  const nodes:[number,number][]=[]; const nn=rng.int(40,80);
  for(let i=0;i<nn;i++) nodes.push([rng.range(0,w),rng.range(0,h)]);
  // Connect nearby nodes with filaments
  for(let i=0;i<nodes.length;i++) for(let j=i+1;j<nodes.length;j++){
    const dx=nodes[j][0]-nodes[i][0],dy=nodes[j][1]-nodes[i][1],d=Math.sqrt(dx*dx+dy*dy);
    if(d<w*0.2){
      const alpha=Math.pow(1-d/(w*0.2),2)*0.4;
      const g=ctx.createLinearGradient(nodes[i][0],nodes[i][1],nodes[j][0],nodes[j][1]);
      const col=p[rng.int(1,p.length)];
      g.addColorStop(0,hsla(col,alpha));g.addColorStop(0.5,hsla(col,alpha*1.5));g.addColorStop(1,hsla(col,alpha));
      ctx.beginPath();ctx.moveTo(nodes[i][0],nodes[i][1]);ctx.lineTo(nodes[j][0],nodes[j][1]);
      ctx.strokeStyle=g;ctx.lineWidth=rng.range(0.3,2);ctx.stroke();
    }
  }
  // Halos at nodes
  for(const [nx,ny] of nodes){
    const r=rng.range(10,50);
    const g=ctx.createRadialGradient(nx,ny,0,nx,ny,r);
    g.addColorStop(0,hsla(p[rng.int(1,p.length)],0.6));g.addColorStop(1,'transparent');
    ctx.fillStyle=g;ctx.fillRect(nx-r,ny-r,r*2,r*2);
  }
  drawStars(ctx,rng,w,h,500);
}

// ─── Remaining styles with compact implementation ────────────────────────────

function drawTreefoil(ctx: CanvasRenderingContext2D, rng: CosmicPRNG, p: string[], w: number, h: number) {
  const bg=ctx.createRadialGradient(w/2,h/2,0,w/2,h/2,w*0.7);bg.addColorStop(0,p[1]);bg.addColorStop(1,p[0]);ctx.fillStyle=bg;ctx.fillRect(0,0,w,h);
  ctx.translate(w/2,h/2);const layers=rng.int(3,8),r=Math.min(w,h)*0.4;
  for(let l=0;l<layers;l++){
    ctx.beginPath();ctx.globalAlpha=rng.range(0.4,0.9);
    for(let i=0;i<=3000;i++){const t=(i/3000)*Math.PI*6;const rd=r*(1-l*0.1);const x=rd*Math.sin(t)*Math.cos(t/3);const y=rd*Math.sin(t)*Math.sin(t/3);i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);}
    ctx.strokeStyle=p[l%p.length];ctx.lineWidth=rng.range(0.5,2);ctx.stroke();
  }
  ctx.globalAlpha=1;ctx.setTransform(1,0,0,1,0,0);
}

function drawOilSlick(ctx: CanvasRenderingContext2D, rng: CosmicPRNG, p: string[], w: number, h: number) {
  ctx.fillStyle='#050810';ctx.fillRect(0,0,w,h);
  for(let l=0;l<8;l++){
    const n=20,points:[number,number][]=[]; for(let i=0;i<n;i++) points.push([rng.range(0,w),rng.range(0,h)]);
    ctx.beginPath();ctx.moveTo(points[0][0],points[0][1]);
    for(let i=1;i<n;i++)ctx.quadraticCurveTo(rng.range(0,w),rng.range(0,h),points[i][0],points[i][1]);
    ctx.closePath();const col=p[l%p.length];ctx.fillStyle=hsla(col,0.15);ctx.fill();
  }
  // iridescent sheen
  for(let i=0;i<30;i++){
    const x=rng.range(0,w),y=rng.range(0,h),r=rng.range(20,100);
    const g=ctx.createRadialGradient(x,y,0,x,y,r);
    g.addColorStop(0,hsla(p[rng.int(0,p.length)],0.3));g.addColorStop(1,'transparent');
    ctx.fillStyle=g;ctx.fillRect(x-r,y-r,r*2,r*2);
  }
}

function drawGlitch(ctx: CanvasRenderingContext2D, rng: CosmicPRNG, p: string[], w: number, h: number) {
  // Base
  const bg=ctx.createLinearGradient(0,0,w,h);bg.addColorStop(0,p[0]);bg.addColorStop(1,p[1]);ctx.fillStyle=bg;ctx.fillRect(0,0,w,h);
  // Glitch slices
  for(let i=0;i<rng.int(20,50);i++){
    const y=rng.range(0,h),sliceH=rng.range(1,30),shift=rng.range(-w*0.2,w*0.2);
    const col=p[rng.int(0,p.length)];
    ctx.fillStyle=hsla(col,rng.range(0.3,0.8));ctx.fillRect(shift,y,w,sliceH);
    // Channel shift
    ctx.globalCompositeOperation='screen';ctx.fillStyle=`rgba(255,0,0,0.1)`;ctx.fillRect(shift+5,y,w,sliceH);
    ctx.fillStyle=`rgba(0,0,255,0.1)`;ctx.fillRect(shift-5,y,w,sliceH);
    ctx.globalCompositeOperation='source-over';
  }
  // Scan lines
  ctx.globalAlpha=0.1;for(let y=0;y<h;y+=2){ctx.fillStyle='#000';ctx.fillRect(0,y,w,1);}ctx.globalAlpha=1;
}

function drawCoral(ctx: CanvasRenderingContext2D, rng: CosmicPRNG, p: string[], w: number, h: number) {
  const bg=ctx.createLinearGradient(0,0,0,h);bg.addColorStop(0,p[0]);bg.addColorStop(1,p[1]||p[0]);ctx.fillStyle=bg;ctx.fillRect(0,0,w,h);
  function drawBranch(x:number,y:number,angle:number,len:number,width:number,col:string,depth:number){
    if(depth===0||len<3)return;
    const ex=x+Math.cos(angle)*len,ey=y+Math.sin(angle)*len;
    ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(ex,ey);ctx.strokeStyle=col;ctx.lineWidth=width;ctx.stroke();
    if(rng.chance(0.8))drawBranch(ex,ey,angle+rng.range(-0.8,0.8),len*rng.range(0.5,0.85),width*0.7,p[(depth+1)%p.length],depth-1);
    if(rng.chance(0.6))drawBranch(ex,ey,angle-rng.range(0.3,1.0),len*rng.range(0.4,0.75),width*0.6,p[(depth+2)%p.length],depth-1);
    if(depth===1){ctx.beginPath();ctx.arc(ex,ey,width*2,0,Math.PI*2);ctx.fillStyle=p[rng.int(0,p.length)];ctx.fill();}
  }
  for(let i=0;i<rng.int(5,12);i++) drawBranch(rng.range(w*0.1,w*0.9),h,-(Math.PI/2)+rng.range(-0.3,0.3),rng.range(60,180),rng.range(3,8),p[rng.int(0,p.length)],rng.int(8,14));
}

function drawMycelium(ctx: CanvasRenderingContext2D, rng: CosmicPRNG, p: string[], w: number, h: number) {
  ctx.fillStyle=p[0];ctx.fillRect(0,0,w,h);
  const hyphae=rng.int(20,50);
  for(let h2=0;h2<hyphae;h2++){
    let x=rng.range(0,w),y=rng.range(0,h),angle=rng.range(0,Math.PI*2);
    const col=p[rng.int(0,p.length)];
    ctx.beginPath();ctx.moveTo(x,y);ctx.globalAlpha=rng.range(0.3,0.7);
    for(let s=0;s<rng.int(100,400);s++){
      angle+=rng.range(-0.3,0.3);x+=Math.cos(angle)*rng.range(1,4);y+=Math.sin(angle)*rng.range(1,4);
      if(x<0||y<0||x>w||y>h)break;ctx.lineTo(x,y);
      if(rng.chance(0.02)){ctx.stroke();ctx.beginPath();ctx.moveTo(x,y);}
    }
    ctx.strokeStyle=col;ctx.lineWidth=rng.range(0.3,1.5);ctx.stroke();
    ctx.globalAlpha=1;
  }
  // Spores
  for(let i=0;i<200;i++){ctx.beginPath();ctx.arc(rng.range(0,w),rng.range(0,h),rng.range(1,3),0,Math.PI*2);ctx.fillStyle=hsla(p[rng.int(0,p.length)],rng.range(0.2,0.6));ctx.fill();}
}

function drawChromaticAberration(ctx: CanvasRenderingContext2D, rng: CosmicPRNG, p: string[], w: number, h: number) {
  const bg=ctx.createRadialGradient(w/2,h/2,0,w/2,h/2,w*0.7);bg.addColorStop(0,p[2]);bg.addColorStop(1,p[0]);ctx.fillStyle=bg;ctx.fillRect(0,0,w,h);
  const shapes=rng.int(5,12);
  for(let s=0;s<shapes;s++){
    const cx=rng.range(w*0.1,w*0.9),cy=rng.range(h*0.1,h*0.9),r=rng.range(20,120);
    for(const[ch,shift] of [['rgba(255,0,0',5],['rgba(0,255,0',-5],['rgba(0,0,255',3]] as [string,number][]){
      ctx.beginPath();ctx.arc(cx+shift,cy-shift/2,r,0,Math.PI*2);ctx.fillStyle=`${ch},0.3)`;ctx.fill();
    }
  }
}

function drawDatamosh(ctx: CanvasRenderingContext2D, rng: CosmicPRNG, p: string[], w: number, h: number) {
  ctx.fillStyle=p[0];ctx.fillRect(0,0,w,h);
  for(let i=0;i<rng.int(50,200);i++){
    const x=rng.range(0,w),y=rng.range(0,h),bw=rng.range(10,200),bh=rng.range(5,60);
    const col=p[rng.int(0,p.length)];
    ctx.fillStyle=hsla(col,rng.range(0.3,0.9));ctx.fillRect(x,y,bw,bh);
    if(rng.chance(0.3)){const id=ctx.getImageData(Math.max(0,x-50),Math.max(0,y-50),Math.min(bw+50,w),Math.min(bh+50,h));ctx.putImageData(id,x+rng.range(-30,30),y+rng.range(-30,30));}
  }
  ctx.globalAlpha=0.05;for(let y=0;y<h;y+=3){ctx.fillStyle='#000';ctx.fillRect(0,y,w,1);}ctx.globalAlpha=1;
}

function drawChalkboard(ctx: CanvasRenderingContext2D, rng: CosmicPRNG, p: string[], w: number, h: number) {
  ctx.fillStyle='#0d1f0d';ctx.fillRect(0,0,w,h);
  // Chalk texture
  for(let i=0;i<w*h/100;i++){ctx.beginPath();ctx.arc(rng.range(0,w),rng.range(0,h),rng.range(0.3,1),0,Math.PI*2);ctx.fillStyle=`rgba(255,255,255,${rng.range(0.01,0.04)})`;ctx.fill();}
  // Math/art chalk drawings
  const drawings=rng.int(5,12);
  for(let d=0;d<drawings;d++){
    const x=rng.range(w*0.05,w*0.95),y=rng.range(h*0.05,h*0.95);
    const col=rng.pick(['rgba(255,255,255','rgba(255,200,100','rgba(150,220,255']);
    ctx.strokeStyle=`${col},${rng.range(0.4,0.9)})`;ctx.lineWidth=rng.range(1,3);
    const type=rng.int(0,4);
    if(type===0){ctx.beginPath();ctx.arc(x,y,rng.range(20,80),0,Math.PI*2);ctx.stroke();}
    else if(type===1){const sides=rng.int(3,8);ctx.beginPath();for(let i=0;i<=sides;i++){const a=(i/sides)*Math.PI*2,r=rng.range(20,80);i===0?ctx.moveTo(x+Math.cos(a)*r,y+Math.sin(a)*r):ctx.lineTo(x+Math.cos(a)*r,y+Math.sin(a)*r);}ctx.closePath();ctx.stroke();}
    else{ctx.beginPath();ctx.moveTo(x,y);for(let i=0;i<5;i++)ctx.lineTo(x+rng.range(-100,100),y+rng.range(-100,100));ctx.stroke();}
  }
}

function drawImpressionist(ctx: CanvasRenderingContext2D, rng: CosmicPRNG, p: string[], w: number, h: number) {
  ctx.fillStyle=p[0];ctx.fillRect(0,0,w,h);
  const strokes=rng.int(5000,12000);
  for(let i=0;i<strokes;i++){
    const x=rng.range(0,w),y=rng.range(0,h),len=rng.range(5,25),angle=rng.range(0,Math.PI*2),ww=rng.range(2,8);
    ctx.save();ctx.translate(x,y);ctx.rotate(angle);
    ctx.beginPath();ctx.ellipse(0,0,len/2,ww/2,0,0,Math.PI*2);
    ctx.fillStyle=hsla(p[rng.int(0,p.length)],rng.range(0.2,0.7));ctx.fill();ctx.restore();
  }
}

function drawPenrose(ctx: CanvasRenderingContext2D, rng: CosmicPRNG, p: string[], w: number, h: number) {
  ctx.fillStyle=p[0];ctx.fillRect(0,0,w,h);
  ctx.translate(w/2,h/2);
  const goldenRatio=(1+Math.sqrt(5))/2;
  type Triangle=[number,number[],number[],number[]];
  let triangles:Triangle[]=[];
  // Initial wheel of triangles
  for(let i=0;i<10;i++){
    const a1=(2*i-1)*Math.PI/10,a2=(2*i+1)*Math.PI/10;
    const r=Math.min(w,h)*0.45;
    triangles.push([0,[0,0],[Math.cos(a1)*r,Math.sin(a1)*r],[Math.cos(a2)*r,Math.sin(a2)*r]]);
  }
  for(let gen=0;gen<5;gen++){
    const next:Triangle[]=[];
    for(const[type,A,B,C] of triangles){
      if(type===0){const P=[A[0]+(B[0]-A[0])/goldenRatio,A[1]+(B[1]-A[1])/goldenRatio];next.push([0,C,P,B],[1,P,C,A]);}
      else{const Q=[B[0]+(A[0]-B[0])/goldenRatio,B[1]+(A[1]-B[1])/goldenRatio];const R=[B[0]+(C[0]-B[0])/goldenRatio,B[1]+(C[1]-B[1])/goldenRatio];next.push([1,R,C,A],[1,Q,R,B],[0,R,Q,A]);}
    }
    triangles=next;
  }
  for(const[type,A,B,C] of triangles){
    ctx.beginPath();ctx.moveTo(A[0],A[1]);ctx.lineTo(B[0],B[1]);ctx.lineTo(C[0],C[1]);ctx.closePath();
    const col=p[(type===0?0:2)%p.length];
    ctx.fillStyle=hsla(col,0.7);ctx.fill();ctx.strokeStyle='rgba(0,0,0,0.3)';ctx.lineWidth=0.3;ctx.stroke();
  }
  ctx.setTransform(1,0,0,1,0,0);
}

function drawCelticKnot(ctx: CanvasRenderingContext2D, rng: CosmicPRNG, p: string[], w: number, h: number) {
  const bg=ctx.createRadialGradient(w/2,h/2,0,w/2,h/2,w*0.7);bg.addColorStop(0,p[1]);bg.addColorStop(1,p[0]);ctx.fillStyle=bg;ctx.fillRect(0,0,w,h);
  ctx.translate(w/2,h/2);const r=Math.min(w,h)*0.4;const n=rng.pick([3,4,5,6]);
  for(let i=0;i<n;i++){
    const a1=(i/n)*Math.PI*2,a2=((i+1)/n)*Math.PI*2;
    for(let width=10;width>=1;width--){
      ctx.beginPath();ctx.lineWidth=width*2;
      const col=p[(i*2+width)%p.length];ctx.strokeStyle=width%2===0?col:'rgba(0,0,0,0.8)';
      ctx.beginPath();ctx.moveTo(Math.cos(a1)*r*0.3,Math.sin(a1)*r*0.3);
      ctx.bezierCurveTo(Math.cos(a1)*r,Math.sin(a1)*r,Math.cos(a2)*r,Math.sin(a2)*r,Math.cos(a2)*r*0.3,Math.sin(a2)*r*0.3);
      ctx.stroke();
    }
  }
  ctx.setTransform(1,0,0,1,0,0);
}

function drawAmoeba(ctx: CanvasRenderingContext2D, rng: CosmicPRNG, p: string[], w: number, h: number) {
  ctx.fillStyle=p[0];ctx.fillRect(0,0,w,h);
  const n=rng.int(3,9);
  for(let i=0;i<n;i++){
    const cx=rng.range(w*0.1,w*0.9),cy=rng.range(h*0.1,h*0.9),br=rng.range(50,200);
    const pts=rng.int(8,16);const col=p[rng.int(0,p.length)];
    ctx.beginPath();
    for(let j=0;j<=pts;j++){const a=(j/pts)*Math.PI*2,er=br*(0.6+rng.float()*0.8);const x=cx+Math.cos(a)*er,y=cy+Math.sin(a)*er;j===0?ctx.moveTo(x,y):ctx.lineTo(x,y);}
    ctx.closePath();
    const g=ctx.createRadialGradient(cx,cy,0,cx,cy,br);g.addColorStop(0,hsla(col,0.8));g.addColorStop(0.6,hsla(col,0.4));g.addColorStop(1,'transparent');
    ctx.fillStyle=g;ctx.fill();
    // Nucleus
    ctx.beginPath();ctx.arc(cx+rng.range(-br*0.2,br*0.2),cy+rng.range(-br*0.2,br*0.2),br*0.2,0,Math.PI*2);ctx.fillStyle=hsla(p[(rng.int(2,p.length))%p.length],0.6);ctx.fill();
  }
}

function drawDiffraction(ctx: CanvasRenderingContext2D, rng: CosmicPRNG, p: string[], w: number, h: number) {
  ctx.fillStyle='#000';ctx.fillRect(0,0,w,h);
  const cx=w/2,cy=h/2,rings=rng.int(30,60),slits=rng.int(2,8);
  for(let r=0;r<rings;r++){
    const radius=(r/rings)*Math.min(w,h)*0.5;
    const g=ctx.createLinearGradient(cx-radius,cy,cx+radius,cy);
    const col=p[r%p.length];
    ctx.beginPath();ctx.arc(cx,cy,radius,0,Math.PI*2);ctx.strokeStyle=hsla(col,rng.range(0.2,0.7));ctx.lineWidth=rng.range(0.5,3);ctx.stroke();
  }
  // Interference from slits
  for(let s=0;s<slits;s++){
    const sy=cy+(s/(slits-1||1)-0.5)*h*0.3;
    const g=ctx.createLinearGradient(cx,sy,w,sy);g.addColorStop(0,hsla(p[s%p.length],0.5));g.addColorStop(1,'transparent');
    for(let x=cx;x<w;x+=5){const y_val=sy+Math.sin((x-cx)*0.05)*50*(1-(x-cx)/w);ctx.beginPath();ctx.arc(x,y_val,1,0,Math.PI*2);ctx.fillStyle=hsla(p[s%p.length],0.4);ctx.fill();}
  }
}

function drawInterferenceRings(ctx: CanvasRenderingContext2D, rng: CosmicPRNG, p: string[], w: number, h: number) {
  ctx.fillStyle=p[0];ctx.fillRect(0,0,w,h);
  const sources:[number,number][]=[]; for(let i=0;i<rng.int(2,5);i++) sources.push([rng.range(w*0.2,w*0.8),rng.range(h*0.2,h*0.8)]);
  const maxR=Math.sqrt(w*w+h*h),rings=rng.int(30,80);
  for(let r=5;r<maxR;r+=maxR/rings){
    for(const[sx,sy] of sources){
      ctx.beginPath();ctx.arc(sx,sy,r,0,Math.PI*2);
      const t=r/maxR;ctx.strokeStyle=hsla(p[Math.floor(t*p.length)%p.length],0.15);ctx.lineWidth=1;ctx.stroke();
    }
  }
}

function drawBismuth(ctx: CanvasRenderingContext2D, rng: CosmicPRNG, p: string[], w: number, h: number) {
  ctx.fillStyle=p[0];ctx.fillRect(0,0,w,h);
  function drawStep(x:number,y:number,s:number,depth:number){
    if(depth===0||s<3)return;
    const col=p[depth%p.length];
    ctx.fillStyle=hsla(col,0.8);ctx.fillRect(x,y,s,s);
    ctx.strokeStyle='rgba(0,0,0,0.5)';ctx.lineWidth=0.5;ctx.strokeRect(x,y,s,s);
    // Highlight edge
    ctx.fillStyle='rgba(255,255,255,0.3)';ctx.fillRect(x,y,s,s*0.15);ctx.fillRect(x,y,s*0.15,s);
    const ns=s*rng.range(0.6,0.85);
    if(rng.chance(0.7))drawStep(x+s-ns*1.1,y,ns,depth-1);
    if(rng.chance(0.7))drawStep(x,y+s-ns*1.1,ns,depth-1);
  }
  drawStep(w*0.1,h*0.1,Math.min(w,h)*0.8,rng.int(6,10));
}

function drawEpitrochoid(ctx: CanvasRenderingContext2D, rng: CosmicPRNG, p: string[], w: number, h: number) {
  const bg=ctx.createRadialGradient(w/2,h/2,0,w/2,h/2,w);bg.addColorStop(0,p[1]);bg.addColorStop(1,p[0]);ctx.fillStyle=bg;ctx.fillRect(0,0,w,h);
  ctx.translate(w/2,h/2);const R=w*0.32,r2=R/rng.pick([2,3,4,5,6]),d=r2*rng.range(0.3,1.8);
  const layers=rng.int(3,7);
  for(let l=0;l<layers;l++){
    ctx.beginPath();ctx.globalAlpha=rng.range(0.4,0.9);
    const scale=1-l*0.1,steps=5000;
    for(let i=0;i<=steps;i++){const t=(i/steps)*Math.PI*2*r2;const x=((R+r2)*Math.cos(t)-d*Math.cos((R+r2)/r2*t))*scale;const y=((R+r2)*Math.sin(t)-d*Math.sin((R+r2)/r2*t))*scale;i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);}
    ctx.strokeStyle=p[l%p.length];ctx.lineWidth=rng.range(0.5,2);ctx.stroke();
  }
  ctx.globalAlpha=1;ctx.setTransform(1,0,0,1,0,0);
}

function drawKleinBottle(ctx: CanvasRenderingContext2D, rng: CosmicPRNG, p: string[], w: number, h: number) {
  ctx.fillStyle=p[0];ctx.fillRect(0,0,w,h);
  ctx.translate(w/2,h/2);const s=Math.min(w,h)*0.4;
  const layers=rng.int(3,6);
  for(let l=0;l<layers;l++){
    ctx.beginPath();ctx.globalAlpha=rng.range(0.3,0.8);const sc=1-l*0.1;
    for(let i=0;i<=3000;i++){
      const t=(i/3000)*Math.PI*2;const u=t;
      // Parametric Klein bottle projection
      let x,y;
      if(u<Math.PI){x=(2.5+1.5*Math.cos(u))*Math.cos(t);y=(2.5+1.5*Math.cos(u))*Math.sin(t);}
      else{x=(2.5+1.5*Math.cos(u))*Math.cos(t);y=(-2.5+1.5*Math.cos(u))*Math.sin(t);}
      i===0?ctx.moveTo(x*s*sc,y*s*0.4*sc):ctx.lineTo(x*s*sc,y*s*0.4*sc);
    }
    ctx.strokeStyle=p[l%p.length];ctx.lineWidth=rng.range(0.5,2);ctx.stroke();
  }
  ctx.globalAlpha=1;ctx.setTransform(1,0,0,1,0,0);
}

function drawReactionDiffusion(ctx: CanvasRenderingContext2D, rng: CosmicPRNG, p: string[], w: number, h: number) {
  // Simplified Turing pattern approximation
  const scale=4;const sw=Math.floor(w/scale),sh=Math.floor(h/scale);
  let A=new Float32Array(sw*sh).fill(1);let B=new Float32Array(sw*sh);
  // Seed
  for(let i=0;i<50;i++){const x=rng.int(0,sw),y=rng.int(0,sh);for(let dy=-3;dy<=3;dy++)for(let dx=-3;dx<=3;dx++){const idx=((y+dy+sh)%sh)*sw+((x+dx+sw)%sw);A[idx]=0.5;B[idx]=0.25;}}
  const f=rng.range(0.02,0.06),k=rng.range(0.05,0.07),dA=1.0,dB=0.5,dt=1;
  for(let iter=0;iter<80;iter++){
    const nA=new Float32Array(sw*sh),nB=new Float32Array(sw*sh);
    for(let y2=0;y2<sh;y2++)for(let x2=0;x2<sw;x2++){
      const i=y2*sw+x2;const l=y2*sw+((x2-1+sw)%sw),r=y2*sw+((x2+1)%sw),u=((y2-1+sh)%sh)*sw+x2,d=((y2+1)%sh)*sw+x2;
      const lapA=A[l]+A[r]+A[u]+A[d]-4*A[i],lapB=B[l]+B[r]+B[u]+B[d]-4*B[i];
      const a=A[i],b=B[i],abb=a*b*b;
      nA[i]=Math.max(0,Math.min(1,a+dt*(dA*lapA-abb+f*(1-a))));
      nB[i]=Math.max(0,Math.min(1,b+dt*(dB*lapB+abb-(k+f)*b)));
    }
    A=nA;B=nB;
  }
  const id=ctx.createImageData(w,h);const pixels=id.data;
  const tc2=document.createElement('canvas');tc2.width=1;tc2.height=1;const tctx2=tc2.getContext('2d')!;
  const parsed2=p.map(c=>{tctx2.fillStyle=c;tctx2.fillRect(0,0,1,1);const rd=tctx2.getImageData(0,0,1,1).data;return[rd[0],rd[1],rd[2]];});
  for(let y2=0;y2<h;y2++)for(let x2=0;x2<w;x2++){
    const si=Math.floor(y2/scale)*sw+Math.floor(x2/scale);const tv=A[si];
    const ci=Math.floor(tv*(p.length-1)),ct2=(tv*(p.length-1))%1;
    const c1=parsed2[ci],c2=parsed2[Math.min(ci+1,parsed2.length-1)];
    const pi=(y2*w+x2)*4;pixels[pi]=c1[0]+(c2[0]-c1[0])*ct2;pixels[pi+1]=c1[1]+(c2[1]-c1[1])*ct2;pixels[pi+2]=c1[2]+(c2[2]-c1[2])*ct2;pixels[pi+3]=255;
  }
  ctx.putImageData(id,0,0);
}

function drawAuroraBorealis(ctx: CanvasRenderingContext2D, rng: CosmicPRNG, p: string[], w: number, h: number) {
  ctx.fillStyle='#000205';ctx.fillRect(0,0,w,h);
  // Mountains/horizon
  const mpts:[number,number][]=[[0,h]];let mx=0;while(mx<w){mx+=rng.range(20,80);mpts.push([mx,h*rng.range(0.6,0.9)]);}mpts.push([w,h]);
  ctx.beginPath();for(const[x,y] of mpts)ctx.lineTo(x,y);ctx.closePath();ctx.fillStyle='#000308';ctx.fill();
  // Aurora bands
  for(let b=0;b<rng.int(4,8);b++){
    const by=rng.range(h*0.05,h*0.5),bamp=rng.range(h*0.05,h*0.15),col=p[rng.int(0,p.length)];
    ctx.save();ctx.globalAlpha=rng.range(0.3,0.6);
    ctx.beginPath();ctx.moveTo(0,by);
    for(let x=0;x<=w;x+=20)ctx.lineTo(x,by+Math.sin(x/w*Math.PI*rng.range(2,6))*bamp+rng.range(-20,20));
    for(let x=w;x>=0;x-=20)ctx.lineTo(x,by+bamp*2+Math.sin(x/w*Math.PI*rng.range(2,6))*bamp);
    ctx.closePath();
    const g=ctx.createLinearGradient(0,by,0,by+bamp*2);g.addColorStop(0,'transparent');g.addColorStop(0.3,hsla(col,0.8));g.addColorStop(0.7,hsla(p[(p.indexOf(col)+2)%p.length],0.4));g.addColorStop(1,'transparent');
    ctx.fillStyle=g;ctx.fill();ctx.restore();
  }
  drawStars(ctx,rng,w,h*0.6,400);
}

// ─── Dispatch map ─────────────────────────────────────────────────────────────

type DrawFn = (ctx: CanvasRenderingContext2D, rng: CosmicPRNG, p: string[], w: number, h: number) => void;

const DRAW_FNS: Record<ArtStyle, DrawFn> = {
  nebula:drawNebula, crystalline:drawCrystalline, flowfield:drawFlowField,
  mandala:drawMandala, constellation:drawConstellation, aurora:drawAurora,
  fractal:drawFractal, supernova:drawSupernova, blackhole:drawBlackhole,
  wormhole:drawWormhole, plasma:drawPlasma, galaxy:drawGalaxy,
  magnetar:drawMagnetar, quasar:drawQuasar, pulsar:drawPulsar,
  interference:drawInterference, voronoi_lines:drawCrystalline, lissajous:drawLissajous,
  spirograph:drawSpirograph, trefoil:drawTreefoil, reaction_diffusion:drawReactionDiffusion,
  strange_attractor:drawStrangeAttractor, penrose:drawPenrose, celtic_knot:drawCelticKnot,
  amoeba:drawAmoeba, bioluminescence:drawBioluminescence, coral:drawCoral,
  mycelium:drawMycelium, lightning:drawLightning, ice_crystal:drawIceCrystal,
  oil_slick:drawOilSlick, chromatic_aberration:drawChromaticAberration, glitch:drawGlitch,
  circuit:drawCircuit, datamosh:drawDatamosh, watercolor:drawWatercolor,
  impressionist:drawImpressionist, pointillist:drawPointillist, chalkboard:drawChalkboard,
  neon_sign:drawNeonSign, stained_glass:drawStainedGlass, topography:drawTopography,
  geode:drawGeode, 'moiré':drawMoire, diffraction:drawDiffraction,
  hypercube:drawHypercube, klein_bottle:drawKleinBottle, torus_knot:drawTorusKnot,
  rose_curve:drawRoseCurve, epitrochoid:drawEpitrochoid,
  interference_rings:drawInterferenceRings, bismuth:drawBismuth, soap_bubble:drawSoapBubble,
  aurora_borealis:drawAuroraBorealis, dark_matter:drawDarkMatter,
};

// ─── Main entry ──────────────────────────────────────────────────────────────

export function generateArt(canvas: HTMLCanvasElement, seed: string, size=1024): ArtConfig {
  const rng = new CosmicPRNG(seed);
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0,0,size,size);

  const palette = generatePalette(rng);
  const style = rng.pick(ART_STYLES);
  const drawFn = DRAW_FNS[style];

  try {
    drawFn(ctx, rng, palette, size, size);
  } catch(e) {
    console.error(`[artEngine] Error in style ${style}:`, e);
    drawNebula(ctx, rng, palette, size, size);
  }

  return { style, palette, seed };
}
