"use client";
export default function JarvisOrb({ speaking = false }: any) {
  return (
    <div className="relative flex items-center justify-center w-[320px] h-[320px]">
      {/* Outer rotating */}
      <div className="absolute w-[280px] h-[280px] rounded-full border border-cyan-400/30 border-t-cyan-300 border-dashed animate-[spin_8s_linear_infinite]" style={{boxShadow:'0 0 30px rgba(34,211,238,0.3)'}} />
      {/* Middle */}
      <div className="absolute w-[220px] h-[220px] rounded-full border border-blue-500/20 border-b-blue-500 animate-[spin_6s_linear_infinite_reverse]" />
      {/* Glow */}
      <div className="absolute w-[170px] h-[170px] rounded-full bg-cyan-500/20 blur-[12px] animate-pulse" />
      {/* CORE BLUE 3D BALL */}
      <div className={`relative w-[130px] h-[130px] rounded-full bg-gradient-to-br from-cyan-200 via-blue-600 to-indigo-900 flex items-center justify-center transition-all duration-300 ${speaking?'scale-110 shadow-[0_0_80px_#22d3ee]':'shadow-[0_0_60px_rgba(34,211,238,0.7)]'}`}>
        <div className="absolute inset-1 rounded-full bg-gradient-to-tr from-blue-900 to-cyan-400/50" />
        <div className="absolute top-[20%] left-[25%] w-8 h-8 bg-white/70 rounded-full blur-[2px]" />
        {/* Siri bars */}
        <div className="relative flex gap-1 items-center z-10">
          <div className={`w-1 bg-white rounded-full ${speaking?'h-6 animate-pulse':'h-2 opacity-60'}`} />
          <div className={`w-1 bg-white rounded-full ${speaking?'h-8 animate-pulse delay-75':'h-3 opacity-60'}`} />
          <div className={`w-1 bg-white rounded-full ${speaking?'h-5 animate-pulse delay-150':'h-4 opacity-60'}`} />
          <div className={`w-1 bg-white rounded-full ${speaking?'h-7 animate-pulse delay-100':'h-3 opacity-60'}`} />
          <div className={`w-1 bg-white rounded-full ${speaking?'h-4 animate-pulse':'h-2 opacity-60'}`} />
        </div>
      </div>
    </div>
  );
}
