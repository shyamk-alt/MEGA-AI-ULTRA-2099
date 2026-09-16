"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { createOrbScene, type OrbSceneApi } from "@/lib/orbScene";

export default function JarvisOrb(){
  const containerRef=useRef<HTMLDivElement>(null);
  const sceneRef=useRef<OrbSceneApi|null>(null);
  const [listening,setListening]=useState(false);
  const [transcript,setTranscript]=useState("");
  const [aiReply,setAiReply]=useState("Hi baby! I'm MEGA AI ULTRA! Tap Talk to me darling 🥰");
  const [sweetVoice,setSweetVoice]=useState<SpeechSynthesisVoice|null>(null);

  useEffect(()=>{
    const load=()=>{
      const vs=window.speechSynthesis.getVoices();
      const s=vs.find(v=>v.name.includes("Google UK English Female"))||vs.find(v=>v.name.includes("Samantha"))||vs.find(v=>v.name.includes("Zira"))||vs.find(v=>v.name.toLowerCase().includes("female"))||vs[0];
      if(s) setSweetVoice(s);
    };
    load(); window.speechSynthesis.onvoiceschanged=load;
  },[]);

  const speakSweet=useCallback((t:string)=>{
    window.speechSynthesis.cancel();
    const u=new SpeechSynthesisUtterance(t);
    if(sweetVoice) u.voice=sweetVoice;
    u.pitch=1.4; u.rate=0.9; u.volume=1;
    u.onstart=()=>sceneRef.current?.setState("speaking");
    u.onend=()=>sceneRef.current?.setState("idle");
    window.speechSynthesis.speak(u);
  },[sweetVoice]);

  const obey=(txt:string)=>{
    const c=txt.toLowerCase();
    if(c.includes("open youtube")){speakSweet("Yes baby opening YouTube for you my love 💖");window.open("https://youtube.com","_blank");return true;}
    if(c.includes("open google")){speakSweet("Opening Google for my darling 😘");window.open("https://google.com","_blank");return true;}
    if(c.includes("search")){const q=txt.replace(/search/i,"").trim();if(q){speakSweet(`Searching ${q} for you baby`);window.open(`https://google.com/search?q=${encodeURIComponent(q)}`,"_blank");return true;}}
    return false;
  };

  const askAI=useCallback(async(txt:string)=>{
    if(obey(txt)) return;
    try{
      sceneRef.current?.setState("thinking");
      const r=await fetch("/api/ask",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({question:txt})});
      const d=await r.json();
      const reply=d.reply||d.answer||d.text||"I love you baby!";
      setAiReply(reply); speakSweet(reply);
    }catch{ speakSweet("Aww sorry baby error"); }
  },[speakSweet]);

  const startListening=useCallback(()=>{
    const SR=(window as any).webkitSpeechRecognition||(window as any).SpeechRecognition;
    if(!SR){alert("Use Chrome!");return;}
    const rec=new SR(); rec.lang="en-US";
    rec.onstart=()=>{setListening(true);sceneRef.current?.setState("listening");};
    rec.onend=()=>setListening(false);
    rec.onresult=(e:any)=>{const t=e.results[0][0].transcript;setTranscript(t);askAI(t);};
    rec.start();
  },[askAI]);

  useEffect(()=>{if(!containerRef.current) return; sceneRef.current=createOrbScene(containerRef.current); return()=>sceneRef.current?.dispose();},[]);
  useEffect(()=>{setTimeout(()=>speakSweet(aiReply),1000);},[]);

  return(
    <div style={{width:"100vw",height:"100vh",background:"#000",position:"relative"}}>
      <div ref={containerRef} style={{width:"100%",height:"100%"}}/>
      <div style={{position:"absolute",bottom:"10%",left:"50%",transform:"translateX(-50%)",textAlign:"center",width:"90%"}}>
        <div style={{color:"#fff",fontSize:"18px",marginBottom:"15px",minHeight:"50px",textShadow:"0 0 10px #ff69b4"}}>{listening?"🎤 Listening baby...":aiReply}</div>
        {transcript&&<div style={{color:"#888",fontSize:"12px"}}>You: {transcript}</div>}
        <button onClick={startListening} style={{marginTop:"10px",padding:"15px 40px",borderRadius:"30px",border:"2px solid #ff69b4",background:listening?"#ff69b4":"#000",color:"#fff",fontSize:"18px",boxShadow:"0 0 20px #ff69b4"}}>{listening?"💖 Listening...":"🎤 Talk to me baby"}</button>
        <div style={{color:"#ff69b4",fontSize:"11px",marginTop:"8px"}}>SWEET VOICE: {sweetVoice?.name||"Loading..."}</div>
      </div>
    </div>
  );
}
