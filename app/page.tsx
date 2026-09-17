"use client";
export default function Page(){
 return(
  <main style={{minHeight:"100vh",background:"black",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
   <div style={{position:"relative",width:"300px",height:"300px",display:"flex",alignItems:"center",justifyContent:"center"}}>
    <div style={{position:"absolute",width:"260px",height:"260px",borderRadius:"50%",border:"1px solid rgba(34,211,238,0.4)",borderTop:"1px solid rgb(165,243,252)",boxShadow:"0 0 30px cyan"}}></div>
    <div style={{position:"absolute",width:"200px",height:"200px",borderRadius:"50%",border:"1px solid rgba(59,130,246,0.3)",borderBottom:"1px solid rgb(96,165,250)"}}></div>
    <div style={{position:"absolute",width:"160px",height:"160px",borderRadius:"50%",background:"rgba(6,182,212,0.2)",filter:"blur(10px)"}}></div>
    <div style={{position:"relative",width:"120px",height:"120px",borderRadius:"50%",background:"linear-gradient(to bottom right, #67e8f9, #2563eb, #1e3a8a)",boxShadow:"0 0 60px rgba(6,182,212,0.8)",display:"flex",alignItems:"center",justifyContent:"center"}}>
     <div style={{display:"flex",gap:"4px"}}>
      <span style={{width:"4px",height:"12px",background:"white",borderRadius:"10px"}}></span>
      <span style={{width:"4px",height:"20px",background:"white",borderRadius:"10px"}}></span>
      <span style={{width:"4px",height:"12px",background:"white",borderRadius:"10px"}}></span>
     </div>
    </div>
   </div>
   <h1 style={{color:"#22d3ee",marginTop:"30px",fontSize:"22px",fontWeight:"bold",letterSpacing:"2px"}}>MEGA AI ULTRA 2099</h1>
   <p style={{color:"rgba(255,255,255,0.5)",marginTop:"8px"}}>BLUE 3D JARVIS ACTIVE</p>
  </main>
 );
}
