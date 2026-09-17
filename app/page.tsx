"use client";
import { useState } from "react";
export default function Page(){
 const [txt,setTxt]=useState("TAP ORB TO TALK");
 const [listen,setListen]=useState(false);
 const [speak,setSpeak]=useState(false);

 const startListen=()=>{
  const SR=(window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  if(!SR){ alert("Mic not supported in this browser, try Chrome"); return; }
  const rec=new SR();
  rec.lang="en-US";
  rec.onstart=()=>{ setListen(true); setTxt("LISTENING..."); };
  rec.onresult=(e:any)=>{
   const t=e.results[0][0].transcript;
   setTxt("You: "+t);
   setListen(false);
   reply(t);
  };
  rec.onerror=()=>{ setListen(false); setTxt("Mic error, allow permission"); };
  rec.onend=()=>setListen(false);
  rec.start();
 };

 const reply=(q:string)=>{
  let ans="I heard you say "+q;
  if(q.toLowerCase().includes("hello")) ans="Hello Shyamk! I am Mega AI Ultra 2099, ready to help!";
  if(q.toLowerCase().includes("time")) ans="Current time is "+new Date().toLocaleTimeString();
  if(q.toLowerCase().includes("who are you")) ans="I am your Blue 3D Jarvis, Mega AI Ultra 2099";
  if(q.toLowerCase().includes("how are you")) ans="I am active and glowing blue, thank you!";
  setTxt(ans);
  const u=new SpeechSynthesisUtterance(ans);
  u.rate=0.9; u.pitch=1.1;
  u.onstart=()=>setSpeak(true);
  u.onend=()=>{ setSpeak(false); setTxt("TAP ORB TO TALK AGAIN"); };
  speechSynthesis.speak(u);
 };

 return(
  <main style={{minHeight:"100vh",background:"black",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"20px"}}>
   <div onClick={startListen} style={{cursor:"pointer",position:"relative",width:"280px",height:"280px",display:"flex",alignItems:"center",justifyContent:"center",transform:listen||speak?"scale(1.1)":"scale(1)",transition:"0.3s"}}>
    <div style={{position:"absolute",width:"260px",height:"260px",borderRadius:"50%",border:"2px solid cyan",boxShadow:listen?"0 0 80px red":speak?"0 0 80px cyan":"0 0 30px cyan",animation:listen||speak?"pulse 0.8s infinite":""}}></div>
    <div style={{position:"relative",width:"120px",height:"120px",borderRadius:"50%",background:listen?"red":"linear-gradient(to bottom right, #67e8f9, #2563eb)",display:"flex",alignItems:"center",justifyContent:"center"}}>
     <span style={{fontSize:"30px"}}>{listen?"🎤":speak?"🔊":"💙"}</span>
    </div>
   </div>
   <h1 style={{color:"cyan",marginTop:"30px",fontSize:"20px",fontWeight:"bold"}}>MEGA AI ULTRA 2099</h1>
   <p style={{color:"white",marginTop:"15px",textAlign:"center",maxWidth:"300px",minHeight:"40px"}}>{txt}</p>
   <button onClick={startListen} style={{marginTop:"20px",padding:"14px 28px",background:listen?"red":"cyan",color:listen?"white":"black",border:"none",borderRadius:"25px",fontWeight:"bold",fontSize:"16px"}}>{listen?"STOP LISTENING":"🎤 TAP TO SPEAK"}</button>
   <p style={{color:"gray",fontSize:"12px",marginTop:"15px"}}>Allow Mic permission when asked</p>
  </main>
 );
}
