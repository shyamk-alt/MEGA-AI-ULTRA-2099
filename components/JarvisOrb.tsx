"use client";
export default function JarvisOrb() {
  return (
    <div className="relative flex items-center justify-center w-[300px] h-[300px]">
      <div className="absolute w-[260px] h-[260px] rounded-full border border-cyan-400/40 border-t-cyan-200 animate-spin" style={{animationDuration:'8s', boxShadow:'0 0 30px cyan'}}></div>
      <div className="absolute w-[200px] h-[200px] rounded-full border border-blue-500/30 border-b-blue-400 animate-spin" style={{animationDuration:'6s', animationDirection:'reverse'}}></div>
      <div className="absolute w-[160px] h-[160px] rounded-full bg-cyan-500/20 blur-md animate-pulse"></div>
      <div className="relative w-[120px] h-[120px] rounded-full bg-gradient-to-br from-cyan-300 via-blue-600 to-blue-900 shadow-[0_0_60px_rgba(6,182,212,0.8)] flex items-center justify-center">
        <div className="w-6 h-6 bg-white/80 rounded-full blur-[1px] absolute top-5 left-6"></div>
        <div className="flex gap-1">
          <span className="w-1 h-3 bg-white/80 rounded-full animate-pulse"></span>
          <span className="w-1 h-5 bg-white rounded-full animate-pulse"></span>
          <span className="w-1 h-3 bg-white/80 rounded-full animate-pulse"></span>
        </div>
      </div>
    </div>
  );
}
