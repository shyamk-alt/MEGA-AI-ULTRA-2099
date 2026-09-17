"use client";
import {useState} from "react";
export default function Page(){
 const [t,setT]=useState("TAP ORB");
 const [l,setL]=useState(false);
 const [sp,setSp]=useState(false);

 function talk(m){
  const u=new SpeechSynthesisUtterance(m);
  u.onstart=()=>setSp(true);
  u.onend=()=>{
   setSp(false);
   setT("TAP AGAIN");
  };
  speechSynthesis.speak(u);
 }

 function listen(){
  const W=window as any;
  const SR=W.webkitSpeechRecognition;
  if(!SR){
   alert("Use Chrome");
   return;
  }
  const r=new SR();
  r.lang="en-US";
  r.onstart=()=>{
   setL(true);
   setT("LISTENING...");
  };
  r.onresult=(e:any)=>{
   const q=e.results[0][0].transcript;
   setT("You: "+q);
   setL(false);
   let a="You said "+q;
   if(q.includes("hello"))a="Hello! I am Jarvis!";
   if(q.includes("time"))a=new Date().toLocaleTimeString();
   setT(a);
   talk(a);
  };
  r.onerror=()=>{
   setL(false);
   setT("Allow Mic");
  };
  r.onend=()=>setL(false);
  r.start();
 }

 return(
  <main style={{
   minHeight:"100vh",
   background:"black",
   display:"flex",
   flexDirection:"column",
   alignItems:"center",
   justifyContent:"center"
  }}>
   <div onClick={listen} style={{
    width:"240px",
    height:"240px",
    borderRadius:"50%",
    border:"2px solid cyan",
    display:"flex",
    alignItems:"center",
    justifyContent:"center",
    boxShadow:l?"0 0 60px red":"0 0 30px cyan",
    background:sp?"#0e7490":"black"
   }}>
    <span style={{fontSize:"50px"}}>
     {l?"🎤":sp?"🔊":"💙"}
    </span>
   </div>
   <h1 style={{color:"cyan",marginTop:"20px"}}>
    MEGA AI ULTRA 2099
   </h1>
   <p style={{color:"white",marginTop:"10px"}}>
    {t}
   </p>
   <button onClick={listen} style={{
    marginTop:"20px",
    padding:"12px 20px",
    background:l?"red":"cyan",
    border:"none",
    borderRadius:"20px",
    fontWeight:"bold"
   }}>
    {l?"STOP":"TAP TO SPEAK"}
   </button>
  </main>
 );
}
