"use client";
import { useEffect, useState } from "react";

export default function JarvisOrb({ state = "idle", speaking = false }: { state?: "idle"|"listening"|"thinking"|"speaking", speaking?: boolean }) {
  const [bars, setBars] = useState([3,5,8,5,3]);
  useEffect(() => {
    if (state === "speaking" || speaking) {
      const id = setInterval(() => setBars(Array.from({length:5},()=>Math.floor(Math.random()*12)+3)),120);
      return ()=>clearInterval(id);
    } else setBars([3,5,8,5,3]);
  }, [state, speaking]);
  const active = state==="listening"||state==="speaking"||speaking;
  return (
    <div className="relative flex items-center justify-center w-[320px] h-[320px]">
      <div className={`absolute rounded-full border-[1.5px] border-dashed ${active?'w-[300px] h-[300px] border-cyan-300/80 animate-[spin_2s_linear_infinite]':'w-[280px] h-[280px] border-cyan-500/20 animate-[spin_20s_linear_infinite]'}`} style={{boxShadow:active?'0 0 40px rgba(6,182,212,0.6)':'0 0 20px rgba(6,182,212,0.1)'}} />
      <div className={`absolute w-[240px] h-[240px] rounded-full border border-blue-400/20 ${state==="thinking"?'animate-[spin_1s_linear_infinite]':'animate-[spin_12s_linear_infinite_reverse]'}`}><div className="absolute top-0 left-1/2 w-[2px] h-3 bg-cyan-400 -translate-x-1/2 shadow-[0_0_10px_#22d3ee]" /><div className="absolute bottom-0 left-1/2 w-[2px] h-3 bg-cyan-400 -translate-x-1/2" /><div className="absolute left-0 top-1/2 w-3 h-[2px] bg-cyan-400 -translate-y-1/2" /><div className="absolute right-0 top-1/2 w-3 h-[2px] bg-cyan-400 -translate-y-1/2" /></div>
      <div className={`absolute w-[180px] h-[180px] rounded-full bg-cyan-500/10 blur-[8px] ${active?'animate-ping':'animate-pulse'}`} />
      <div className={`relative w-[130px] h-[130px] rounded-full flex items-center justify-center transition-all duration-500 ${state==="listening"?"scale-110 shadow-[0_0_80px_rgba(34,211,238,1)]":""} ${state==="thinking"?"scale-95 animate-pulse shadow-[0_0_60px_rgba(59,130,246,0.8)]":""} ${state==="speaking"||speaking?"scale-110 shadow-[0_0_90px_rgba(34,211,238,1),0_0_120px_rgba(59,130,246,0.6)]":"shadow-[0_0_60px_rgba(34,211,238,0.6)]"} bg-gradient-to-br from-cyan-200 via-blue-500 to-indigo-900`}>
        <div className="absolute inset-[3px] rounded-full bg-gradient-to-tr from-blue-900 via-cyan-600 to-white/80 overflow-hidden"><div className={`absolute inset-0 bg-gradient-to-br from-cyan-300/60 to-blue-600/60 ${active?'animate-[spin_3s_linear_infinite]':''}`} /></div>
        <div className="absolute top-[18%] left-[22%] w-[30%] h-[30%] bg-white/70 rounded-full blur-[3px]" />
        <div className="relative flex items-end gap-[3px] h-6 z-10">{bars.map((h,i)=><div key={i} className={`w-[4px] bg-white rounded-full transition-all duration-100 shadow-[0_0_8px_white] ${active?'':'opacity-40'}`} style={{height:`${h*2}px`}} />)}</div>
      </div>
      {state==="listening"&&<div className="absolute w-[340px] h-[340px] rounded-full border border-cyan-400/30 animate-ping" />}
    </div>
  );
}