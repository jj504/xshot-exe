"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { useReducedMotion } from "@/lib/useIsMobile";

interface Block {
  id: string; label: string; sublabel: string;
  x: number; y: number; w: number; h: number; meta?: string;
}
interface Conn { from: number; to: number; }

const C = {
  cyan100: "#00F0FF", cyan60: "rgba(0,240,255,0.6)",
  cyan15: "rgba(0,240,255,0.15)", white: "#E0F0F0",
  dim: "#B0C4C4", ghost: "#1A2A2E",
};
const SCR = "ABCDEFGHIJKLMNOPQRSTUVWXyz0123456789@#&*<>[]";
const PROMPT_TEXT = "> pipeline: moderate with gpt-4o, generate with flux, resize, deliver as api";
const BLK_D: Block[] = [
  { id: "01", label: "INGEST", sublabel: "input", x:0,y:0,w:88,h:52 },
  { id: "02", label: "GPT-4o", sublabel: "moderate", x:0,y:0,w:88,h:52, meta:"retry:3x" },
  { id: "03", label: "FLUX", sublabel: "generate", x:0,y:0,w:88,h:52, meta:"fallback:on" },
  { id: "04", label: "SHARP", sublabel: "resize", x:0,y:0,w:88,h:52, meta:"$0.58" },
  { id: "05", label: "OUTPUT", sublabel: "\u2192 api", x:0,y:0,w:88,h:52 },
];
const BLK_M: Block[] = [
  { id: "01", label: "INGEST", sublabel: "input", x:0,y:0,w:80,h:46 },
  { id: "02", label: "GPT-4o", sublabel: "moderate", x:0,y:0,w:80,h:46, meta:"retry:3x" },
  { id: "03", label: "FLUX", sublabel: "generate", x:0,y:0,w:80,h:46, meta:"fallback" },
  { id: "04", label: "OUTPUT", sublabel: "\u2192 api", x:0,y:0,w:80,h:46, meta:"$0.58" },
];
const CN_D: Conn[] = [{from:0,to:1},{from:1,to:2},{from:2,to:3},{from:3,to:4}];
const CN_M: Conn[] = [{from:0,to:1},{from:1,to:2},{from:2,to:3}];

function eo(t:number){return 1-Math.pow(1-t,3);}
function eio(t:number){return t<0.5?2*t*t:1-Math.pow(-2*t+2,2)/2;}
function cl(t:number){return Math.max(0,Math.min(1,t));}
function lr(a:number,b:number,t:number){return a+(b-a)*t;}
function dec(target:string,p:number):string{
  let s="";for(let i=0;i<target.length;i++){
    const cp=cl((p*target.length-i)/3);
    if(target[i]===" "){s+=" ";continue;}
    if(cp>=1)s+=target[i];else if(cp>0)s+=SCR[Math.floor(Math.random()*SCR.length)];else s+=" ";
  }return s;
}

interface Props{active?:boolean;onLocked?:()=>void;}

export default function AssemblyAnimation({active=false,onLocked}:Props){
  const cvRef=useRef<HTMLCanvasElement>(null);
  const aRef=useRef(0);const lkRef=useRef(false);
  const olRef=useRef(onLocked);olRef.current=onLocked;
  const rm=useReducedMotion();const[mob,setMob]=useState(false);
  useEffect(()=>{setMob(window.innerWidth<768);},[]);

  const lay=useCallback((blks:Block[],cw:number,ch:number,m:boolean)=>{
    const out=blks.map(b=>({...b}));
    if(m){const th=out.length*out[0].h+(out.length-1)*36;const sy=(ch-th)/2+16;const cx=cw/2;
      out.forEach((b,i)=>{b.x=cx-b.w/2;b.y=sy+i*(b.h+36);});
    }else{const gap=32;const tw=out.reduce((s,b)=>s+b.w,0)+(out.length-1)*gap;
      const sx=(cw-tw)/2;const cy=ch*0.42;let x=sx;
      out.forEach((b,i)=>{b.x=x;b.y=cy-b.h/2+(i%2===0?0:-4);x+=b.w+gap;});
    }return out;
  },[]);

  useEffect(()=>{
    if(!active)return;
    const cv=cvRef.current;if(!cv)return;
    const ctx=cv.getContext("2d");if(!ctx)return;
    const dpr=window.devicePixelRatio||1;
    const dw=cv.clientWidth;const dh=cv.clientHeight;
    cv.width=dw*dpr;cv.height=dh*dpr;ctx.scale(dpr,dpr);
    const m=dw<500;
    const blks=lay(m?BLK_M:BLK_D,dw,dh,m);
    const cns=m?CN_M:CN_D;
    const fSz=(base:number)=>m?base-1:base;
    const FL="bold "+fSz(11)+"px 'JetBrains Mono',monospace";
    const FS=fSz(10)+"px 'JetBrains Mono',monospace";
    const FM=fSz(9)+"px 'JetBrains Mono',monospace";
    const FP=fSz(11)+"px 'JetBrains Mono',monospace";
    const FT=fSz(10)+"px 'JetBrains Mono',monospace";

    const TP=300,TPD=600,TB=1000,TBS=500,TBD=250,TLD=200,TLND=300,TMD=150;
    const TG=TB+blks.length*TBS+200;
    const TPS=TG+600,TPU=800;
    const TC=TPS+TPU+200,TCD=500;
    const TSS=TC+TCD+100,TSD=400;
    const TLK=TSS+TSD+200;

    const cTgt={x:m?dw/2:blks[0].x+blks[0].w/2,y:blks[0].y+blks[0].h/2};
    const cPos={x:m?dw*0.2:30,y:blks[0].y+blks[0].h/2};
    const trail:{x:number;y:number;t:number}[]=[];

    if(rm){lkRef.current=true;olRef.current?.();ctx.clearRect(0,0,dw,dh);
      blks.forEach(b=>{ctx.strokeStyle=C.cyan60;ctx.lineWidth=1;ctx.strokeRect(b.x,b.y,b.w,b.h);
        ctx.font=FL;ctx.fillStyle=C.white;ctx.textAlign="center";ctx.textBaseline="middle";
        ctx.fillText(b.label,b.x+b.w/2,b.y+b.h/2-7);ctx.font=FS;ctx.fillStyle=C.dim;
        ctx.fillText(b.sublabel,b.x+b.w/2,b.y+b.h/2+8);
        if(b.meta){ctx.font=FM;ctx.fillStyle=b.meta.startsWith("$")?C.cyan100:C.dim;ctx.fillText(b.meta,b.x+b.w/2,b.y+b.h+14);}
      });cns.forEach(c=>{const f=blks[c.from],t=blks[c.to];ctx.strokeStyle=C.cyan60;ctx.lineWidth=1;ctx.beginPath();
        if(m){ctx.moveTo(f.x+f.w/2,f.y+f.h);ctx.lineTo(t.x+t.w/2,t.y);}
        else{ctx.moveTo(f.x+f.w,f.y+f.h/2);ctx.lineTo(t.x,t.y+t.h/2);}ctx.stroke();
      });ctx.font=FT;ctx.fillStyle=C.cyan100;ctx.textAlign="center";
      ctx.fillText("PIPELINE rx-0847  CONTRACTED \u25A0  POST /v1/rx-0847",dw/2,dh-(m?16:24));return;
    }

    const st=performance.now();

    const animate=(now:number)=>{
      const t=now-st;ctx.clearRect(0,0,dw,dh);

      // Prompt
      const pp=cl((t-TP)/TPD);
      if(pp>0){ctx.font=FP;ctx.textAlign="left";ctx.textBaseline="top";
        const fade=t>TB+500?Math.max(0.15,1-cl((t-TB-500)/800)):1;
        const ps=PROMPT_TEXT.slice(0,Math.floor(pp*PROMPT_TEXT.length));
        ctx.fillStyle="rgba(176,196,196,"+(0.8*fade)+")";
        ctx.fillText(ps,m?12:20,m?8:14);
        if(pp<1&&Math.floor(t/400)%2===0){const cx2=ctx.measureText(ps).width+(m?12:20);
          ctx.fillStyle=C.cyan100;ctx.fillText("\u2588",cx2,m?8:14);}
      }

      // Contract offset
      let co=0;if(t>=TC)co=eio(cl((t-TC)/TCD))*(m?6:12);

      // Blocks
      blks.forEach((b,i)=>{
        const bs=TB+i*TBS;const bp=cl((t-bs)/TBD);if(bp<=0)return;
        const cx=dw/2;const cf=co/(m?6:12);
        const bx=lr(b.x,lr(b.x,cx-b.w/2,0.15),cf);
        const by=lr(b.y,lr(b.y,dh*0.42-b.h/2,0.08),cf);

        // Glow
        if(bp>0&&bp<0.8){const ga=(1-bp/0.8)*0.15;
          ctx.shadowColor=C.cyan100;ctx.shadowBlur=20;
          ctx.fillStyle="rgba(0,240,255,"+ga+")";
          ctx.fillRect(bx-4,by-4,b.w+8,b.h+8);ctx.shadowBlur=0;}

        // Border draw
        const perim=2*(b.w+b.h);const drawn=eo(bp)*perim;
        ctx.strokeStyle=t>=TC?C.cyan100:C.cyan60;ctx.lineWidth=1;ctx.beginPath();
        const segs=[{fx:bx,fy:by,tx:bx+b.w,ty:by,len:b.w},{fx:bx+b.w,fy:by,tx:bx+b.w,ty:by+b.h,len:b.h},
          {fx:bx+b.w,fy:by+b.h,tx:bx,ty:by+b.h,len:b.w},{fx:bx,fy:by+b.h,tx:bx,ty:by,len:b.h}];
        let rem=drawn;for(const s of segs){if(rem<=0)break;const sp=cl(rem/s.len);
          ctx.moveTo(s.fx,s.fy);ctx.lineTo(lr(s.fx,s.tx,sp),lr(s.fy,s.ty,sp));rem-=s.len;}ctx.stroke();

        // Corner marks
        if(bp>0.5){const ml=5;ctx.strokeStyle=t>=TC?C.cyan100:C.cyan60;ctx.lineWidth=1.5;
          ctx.beginPath();ctx.moveTo(bx,by+ml);ctx.lineTo(bx,by);ctx.lineTo(bx+ml,by);ctx.stroke();
          ctx.beginPath();ctx.moveTo(bx+b.w-ml,by);ctx.lineTo(bx+b.w,by);ctx.lineTo(bx+b.w,by+ml);ctx.stroke();
          ctx.beginPath();ctx.moveTo(bx,by+b.h-ml);ctx.lineTo(bx,by+b.h);ctx.lineTo(bx+ml,by+b.h);ctx.stroke();
          ctx.beginPath();ctx.moveTo(bx+b.w-ml,by+b.h);ctx.lineTo(bx+b.w,by+b.h);ctx.lineTo(bx+b.w,by+b.h-ml);ctx.stroke();
          ctx.lineWidth=1;}

        // Labels
        const ls=bs+TBD*0.6;const lpv=cl((t-ls)/TLD);
        if(lpv>0){ctx.font=FL;ctx.textAlign="center";ctx.textBaseline="middle";
          ctx.fillStyle=C.white;ctx.fillText(dec(b.label,lpv),bx+b.w/2,by+b.h/2-7);
          ctx.font=FS;ctx.fillStyle=C.dim;ctx.fillText(dec(b.sublabel,lpv),bx+b.w/2,by+b.h/2+8);}

        // Meta
        if(b.meta){const ms=bs+TBD+TMD;const mp=cl((t-ms)/150);
          if(mp>0){ctx.font=FM;ctx.textAlign="center";
            ctx.fillStyle=b.meta.startsWith("$")?C.cyan100:C.dim;
            ctx.globalAlpha=mp;ctx.fillText(b.meta,bx+b.w/2,by+b.h+(m?13:15));ctx.globalAlpha=1;}}
      });

      // Connections
      cns.forEach(c=>{const ls2=TB+(c.from+1)*TBS-100;const lp2=cl((t-ls2)/TLND);if(lp2<=0)return;
        const f=blks[c.from],to=blks[c.to];const cf=co/(m?6:12);const cx=dw/2;
        let fx:number,fy:number,tx:number,ty:number;
        if(m){fx=lr(f.x+f.w/2,cx,cf*0.15);fy=lr(f.y+f.h,lr(f.y+f.h,dh*0.45,0.08),cf);
          tx=lr(to.x+to.w/2,cx,cf*0.15);ty=lr(to.y,lr(to.y,dh*0.45,0.08),cf);
        }else{fx=lr(f.x+f.w,lr(f.x+f.w,cx-f.w/2+f.w,0.15),cf);
          fy=lr(f.y+f.h/2,lr(f.y+f.h/2,dh*0.42,0.08),cf);
          tx=lr(to.x,lr(to.x,cx-to.w/2,0.15),cf);
          ty=lr(to.y+to.h/2,lr(to.y+to.h/2,dh*0.42,0.08),cf);}
        const px=lr(fx,tx,eo(lp2));const py=lr(fy,ty,eo(lp2));
        ctx.strokeStyle=t>=TC?C.cyan100:C.cyan60;ctx.lineWidth=1;
        ctx.beginPath();ctx.moveTo(fx,fy);ctx.lineTo(px,py);ctx.stroke();
        if(lp2>0.95&&lp2<1.05){ctx.beginPath();ctx.arc(tx,ty,3,0,Math.PI*2);ctx.fillStyle=C.cyan100;ctx.fill();}
      });

      // Cursor
      if(t>=TP&&t<TLK){const bi=Math.floor((t-TB)/TBS);
        if(bi>=0&&bi<blks.length){cTgt.x=blks[bi].x+blks[bi].w/2;cTgt.y=blks[bi].y+blks[bi].h/2;}
        else if(t>=TG){cTgt.x=dw/2;cTgt.y=dh-(m?44:56);}
        cPos.x+=(cTgt.x-cPos.x)*0.08;cPos.y+=(cTgt.y-cPos.y)*0.08;
        trail.push({x:cPos.x,y:cPos.y,t});while(trail.length>0&&t-trail[0].t>400)trail.shift();
        for(let i=0;i<trail.length-1;i++){const a=(i/trail.length)*0.2;
          ctx.strokeStyle="rgba(0,240,255,"+a+")";ctx.lineWidth=1;ctx.beginPath();
          ctx.moveTo(trail[i].x,trail[i].y);ctx.lineTo(trail[i+1].x,trail[i+1].y);ctx.stroke();}
        const ca=t>=TC?Math.max(0,1-cl((t-TC)/600)):1;
        if(ca>0){const sz=5;ctx.fillStyle="rgba(0,240,255,"+ca+")";ctx.beginPath();
          ctx.moveTo(cPos.x,cPos.y-sz);ctx.lineTo(cPos.x+sz,cPos.y);
          ctx.lineTo(cPos.x,cPos.y+sz);ctx.lineTo(cPos.x-sz,cPos.y);ctx.closePath();
          ctx.shadowColor=C.cyan100;ctx.shadowBlur=12;ctx.fill();ctx.shadowBlur=0;}
      }

      // GPU bar
      const gp=cl((t-TG)/400);
      if(gp>0){const barY=m?dh-50:dh-64;const barX=m?20:dw/2-160;const barW=m?dw-40:320;
        ctx.fillStyle=C.ghost;ctx.fillRect(barX,barY,barW,3);
        ctx.fillStyle=C.cyan100;ctx.fillRect(barX,barY,barW*0.7*eo(gp),3);
        ctx.font=FM;ctx.textAlign="left";ctx.textBaseline="top";ctx.fillStyle=C.dim;
        ctx.fillText(dec("GPU  A100 \u00B7 40GB",gp),barX,barY+8);
        ctx.textAlign="right";ctx.fillStyle=C.cyan100;ctx.fillText(dec("$0.58/run",gp),barX+barW,barY+8);}

      // Signal pulse
      const puT=t>=TLK?(((t-TLK)%8000<TPU)?cl(((t-TLK)%8000)/TPU):-1):cl((t-TPS)/TPU);
      if(puT>=0){const ns=cns.length;const si=Math.floor(puT*ns);const sT=(puT*ns)-si;
        const cn=cns[Math.min(si,ns-1)];if(cn){const f=blks[cn.from],to=blks[cn.to];
          let px2:number,py2:number;
          if(m){px2=lr(f.x+f.w/2,to.x+to.w/2,sT);py2=lr(f.y+f.h,to.y,sT);}
          else{px2=lr(f.x+f.w,to.x,sT);py2=lr(f.y+f.h/2,to.y+to.h/2,sT);}
          const pa=t>=TLK?0.25:0.9;ctx.beginPath();ctx.arc(px2,py2,t>=TLK?2:4,0,Math.PI*2);
          ctx.fillStyle="rgba(0,240,255,"+pa+")";ctx.shadowColor=C.cyan100;
          ctx.shadowBlur=t>=TLK?4:12;ctx.fill();ctx.shadowBlur=0;}}

      // Status
      const sp=cl((t-TSS)/TSD);
      if(sp>0){ctx.font=FT;ctx.textAlign="center";ctx.textBaseline="bottom";
        ctx.fillStyle=C.cyan100;ctx.fillText(dec("PIPELINE rx-0847  CONTRACTED \u25A0  POST /v1/rx-0847",sp),dw/2,dh-(m?8:14));}

      if(t>=TLK&&!lkRef.current){lkRef.current=true;olRef.current?.();}

      // Blink
      if(t>=TLK&&Math.floor((t-TLK)/1000)%2===0){ctx.font=FT;ctx.textAlign="center";ctx.fillStyle=C.cyan100;
        const sy=dh-(m?8:14);const sw=ctx.measureText("PIPELINE rx-0847  CONTRACTED \u25A0  POST /v1/rx-0847").width;
        ctx.fillRect(dw/2+sw/2+4,sy-10,7,10);}

      aRef.current=requestAnimationFrame(animate);
    };
    aRef.current=requestAnimationFrame(animate);
    return()=>cancelAnimationFrame(aRef.current);
  },[active,mob,lay,rm]);

  return(<canvas ref={cvRef} className="w-full h-auto"
    style={{aspectRatio:mob?"3 / 4":"4 / 3",maxWidth:mob?"360px":"540px"}} aria-hidden="true"/>);
}
