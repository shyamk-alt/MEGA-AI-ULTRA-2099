"use client";
import { useCallback, useEffect, useRef, useState } from "react";

export default function JarvisOrb() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [aiReply, setAiReply] = useState("SAY HEY MEGA");
  const [wake, setWake] = useState(false);

  const speak = useCallback((t:string)=>{ speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(t); u.rate=0.9; speechSynthesis.speak(u); },[]);

  const openApp = (webUrl:string, appUrl:string) => {
    // Try to open REAL APP first, if fails open website
    window.location.href = appUrl;
    setTimeout(()=> window.open(webUrl,"_blank"), 800);
  };

  const obey = useCallback((txt:string)=>{
    const c=txt.toLowerCase();

    // NO LIMIT - REAL APPS
    if(c.includes("whatsapp")){
      openApp("https://web.whatsapp.com","whatsapp://");
      speak("Opening WhatsApp App"); return true;
    }
    if(c.includes("youtube")){
      if(c.includes("play")||c.includes("search")){
        const q=txt.replace(/.*youtube|play|search/gi,"").trim();
        openApp(`https://youtube.com/results?search_query=${encodeURIComponent(q)}`, `vnd.youtube://results?search_query=${encodeURIComponent(q)}`);
      } else {
        openApp("https://youtube.com","vnd.youtube://");
      }
      speak("Opening YouTube App"); return true;
    }
    if(c.includes("instagram")||c.includes("insta")){ openApp("https://instagram.com","instagram://"); speak("Opening Instagram App"); return true; }
    if(c.includes("spotify")){ openApp("https://open.spotify.com","spotify://"); speak("Opening Spotify"); return true; }
    if(c.includes("telegram")){ openApp("https://web.telegram.org","tg://"); speak("Opening Telegram"); return true; }
    if(c.includes("gmail")||c.includes("mail")){ openApp("https://mail.google.com","googlegmail://"); speak("Opening Gmail App"); return true; }
    if(c.includes("maps")||c.includes("map")){
      const place=txt.replace(/.*maps|map|open/gi,"").trim() || "";
      openApp(`https://maps.google.com/?q=${encodeURIComponent(place)}`, `geo:0,0?q=${encodeURIComponent(place)}`);
      speak("Opening Maps"); return true;
    }
    if(c.includes("camera")){ openApp("","camera://"); speak("Opening Camera"); return true; }
    if(c.includes("call")||c.includes("dial")){
      const num=txt.match(/\d{10,}/)?.[0] || "";
      if(num) window.location.href=`tel:${num}`;
      speak(`Calling ${num}`); return true;
    }
    if(c.includes("message")||c.includes("sms")){
      const num=txt.match(/\d{10,}/)?.[0] || "";
      window.location.href=`sms:${num}`;
      speak("Opening Messages"); return true;
    }
    if(c.includes("settings")){ window.location.href="app-settings:"; speak("Opening Settings"); return true; }
    if(c.includes("time")){ speak(`It is ${new Date().toLocaleTimeString()}`); setAiReply(new Date().toLocaleTimeString()); return true; }
    if(c.includes("flash")||c.includes("torch")){
      // @ts-ignore
      if(navigator.mediaDevices){ speak("Torch feature needs Android app"); }
      return true;
    }
    if(c.startsWith("open ")){ const site=txt.replace("open","").trim(); window.open(`https://${site}.com`,"_blank"); speak(`Opening ${site}`); return true; }
    return false;
  },[speak]);

  const askAI = useCallback(async(txt:string)=>{
    if(obey(txt)){ setAiReply(`OPENING ${txt.toUpperCase()}`); return; }
    setAiReply("THINKING..."); try{
      const r=await fetch("/api/ask",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({question:txt})});
      const d=await r.json(); if(d.reply){ setAiReply(d.reply.toUpperCase()); speak(d.reply); } else throw new Error();
    }catch{ setAiReply("ADD GROQ_API_KEY IN VERCEL"); }
  },[obey,speak]);

  useEffect(()=>{
    const canvas=canvasRef.current; if(!canvas) return; const ctx=canvas.getContext("2d")!;
    let w=canvas.width=innerWidth, h=canvas.height=innerHeight; let particles:any[]=[];
    for(let i=0;i<1100;i++){ const phi=Math.acos(-1+(2*i)/1100); const theta=Math.sqrt(1100*Math.PI)*phi; particles.push({phi,theta,speed:Math.random()*0.006+0.002}); }
    let rotY=0; const animate=()=>{
      ctx.fillStyle="rgba(0,0,0,0.2)"; ctx.fillRect(0,0,w,h); rotY+=wake?0.03:0.009; const cx=w/2,cy=h/2-30;
      particles.forEach((p:any)=>{p.theta+=p.speed; const x=145*Math.sin(p.phi)*Math.cos(p.theta+rotY); const y=145*Math.sin(p.phi)*Math.sin(p.theta+rotY); const z=145*Math.cos(p.phi); const scale=320/(320+z); const alpha=(z+150)/300; if(alpha>0){ ctx.beginPath(); ctx.arc(cx+x*scale,cy+y*scale,(wake?3:2)*scale,0,Math.PI*2); ctx.fillStyle=wake?`hsla(50,100%,65%,${alpha})`:`hsla(${28+alpha*25},100%,60%,${alpha})`; ctx.shadowBlur=wake?22:12; ctx.shadowColor="#ffae00"; ctx.fill(); }});
      ctx.strokeStyle=wake?"rgba(255,215,0,1)":"rgba(255,140,0,0.7)"; ctx.lineWidth=2.5; ctx.shadowBlur=30; ctx.shadowColor="#ffae00";
      for(let i=0;i<2;i++){ ctx.beginPath(); ctx.ellipse(cx,cy,168+i*20,168+i*20,i==0?rotY:rotY+1.6,0,Math.PI*2); ctx.stroke(); }
      const g=ctx.createRadialGradient(cx,cy,0,cx,cy,60); g.addColorStop(0,"#fff"); g.addColorStop(0.25,wake?"#ffd700":"#ffb700"); g.addColorStop(1,"rgba(255,80,0,0)"); ctx.fillStyle=g; ctx.beginPath(); ctx.arc(cx,cy,wake?70:48,0,Math.PI*2); ctx.fill(); requestAnimationFrame(animate);
    }; animate();
  },[wake]);

  useEffect(()=>{
    const SR=(window as any).webkitSpeechRecognition||(window as any).SpeechRecognition; if(!SR) return; const rec=new SR(); rec.continuous=true; rec.lang="en-US";
    rec.onend=()=>setTimeout(()=>rec.start(),400);
    rec.onresult=(e:any)=>{ const t=e.results[e.results.length-1][0].transcript; const lower=t.toLowerCase(); if(lower.includes("hey mega")||wake){ setWake(true); const clean=lower.replace(/hey mega/g,"").trim(); if(clean) askAI(clean); else {setAiReply("YES BOSS?"); speak("Yes boss?");} setTimeout(()=>setWake(false),10000); } else setAiReply(`SAY "HEY MEGA" • ${t.toUpperCase()}`); };
    try{ rec.start(); }catch{}
  },[askAI,wake,speak]);

  return (
    <div style={{width:"100vw",height:"100vh",background:"#000",overflow:"hidden",position:"relative",fontFamily:"monospace"}}>
      <canvas ref={canvasRef} style={{position:"absolute",inset:0}} />
      <div style={{position:"absolute",top:20,left:20,color:"#ffae00",fontSize:10,letterSpacing:3}}>ULTRON 2099 • NO LIMIT MODE • REAL APPS</div>
      <div style={{position:"absolute",bottom:90,width:"100%",textAlign:"center"}}><div style={{color:wake?"#ffd700":"#ffae00",fontSize:12,letterSpacing:4}}>{wake?"● GOD MODE - REAL APP ACCESS":"◉ SAY HEY MEGA"}</div><div style={{color:"#fff",marginTop:10,fontSize:13,padding:"0 20px"}}>{aiReply}</div></div>
      <div style={{position:"absolute",bottom:12,width:"100%",textAlign:"center",color:"#333",fontSize:7,letterSpacing:1}}>SAY: HEY MEGA OPEN WHATSAPP / YOUTUBE / INSTAGRAM / CALL 98765 / MESSAGE / MAPS / CAMERA / SPOTIFY</div>
    </div>
  );
}