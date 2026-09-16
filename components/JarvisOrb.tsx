"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { createOrbScene, type OrbSceneApi } from "@/lib/orbScene";

export default function JarvisOrb() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<OrbSceneApi | null>(null);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [aiReply, setAiReply] = useState("Hi! I'm MEGA AI 🥰 Tap to talk!");
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    const load = () => {
      const vs = window.speechSynthesis.getVoices();
      const sweet = vs.find(v => v.name.includes("Google UK English Female")) || vs.find(v => v.name.includes("Female")) || vs.find(v => v.name.includes("Google")) || vs[0];
      if (sweet) setVoice(sweet);
    };
    load();
    window.speechSynthesis.onvoiceschanged = load;
    setTimeout(load, 800);
  }, []);

  const speak = useCallback((t: string) => {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(t);
    if (voice) u.voice = voice;
    u.pitch = 1.2; u.rate = 0.9; u.volume = 1;
    u.onstart = () => (sceneRef.current as any)?.setState("speaking");
    u.onend = () => (sceneRef.current as any)?.setState("idle");
    window.speechSynthesis.speak(u);
  }, [voice]);

  const obey = useCallback((txt: string) => {
    const c = txt.toLowerCase();
    if (c.includes("youtube")) {
      speak("Okay, opening YouTube");
      setTimeout(() => window.open("https://youtube.com", "_blank"), 600);
      return true;
    }
    if (c.includes("google")) {
      speak("Okay, opening Google");
      setTimeout(() => window.open("https://google.com", "_blank"), 600);
      return true;
    }
    if (c.includes("instagram")) {
      speak("Okay, opening Instagram");
      setTimeout(() => window.open("https://instagram.com", "_blank"), 600);
      return true;
    }
    if (c.includes("search ")) {
      const q = txt.replace(/search/gi, "").trim();
      if (q) {
        speak(`Okay, searching for ${q}`);
        setTimeout(() => window.open(`https://google.com/search?q=${encodeURIComponent(q)}`, "_blank"), 600);
        return true;
      }
    }
    if (c.includes("play ")) {
      const q = txt.replace(/play/gi, "").trim();
      if (q) {
        speak(`Okay, playing ${q}`);
        setTimeout(() => window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`, "_blank"), 600);
        return true;
      }
    }
    return false;
  }, [speak]);

  const askAI = useCallback(async (txt: string) => {
    if (obey(txt)) { setAiReply(`Okay, opening ${txt}`); return; }
    try {
      (sceneRef.current as any)?.setState("thinking");
      setAiReply("Thinking...");
      const r = await fetch("/api/ask", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question: txt }) });
      const d = await r.json();
      const reply = d.reply || `You said ${txt}`;
      setAiReply(reply);
      speak(reply);
    } catch {
      const fb = `You said ${txt}`;
      setAiReply(fb);
      speak(fb);
    }
  }, [obey, speak]);

  const start = useCallback(() => {
    const SR = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (!SR) { alert("Please use Chrome!"); return; }
    const rec = new SR();
    rec.lang = "en-US";
    rec.onstart = () => { setListening(true); (sceneRef.current as any)?.setState("listening"); };
    rec.onend = () => setListening(false);
    rec.onresult = (e: any) => { const t = e.results[0][0].transcript; setTranscript(t); askAI(t); };
    rec.start();
  }, [askAI]);

  useEffect(() => { if (!containerRef.current) return; sceneRef.current = createOrbScene(containerRef.current); return () => sceneRef.current?.dispose(); }, []);

  return (
    <div style={{ width: "100vw", height: "100vh", background: "#000", position: "relative" }}>
      <div ref={containerRef} style={{ width: "100%", height: "100%" }} />
      <div style={{ position: "absolute", bottom: "8%", left: "50%", transform: "translateX(-50%)", textAlign: "center", width: "92%" }}>
        <div style={{ color: "#fff", fontSize: "18px", marginBottom: "12px" }}>{listening? "🎤 Listening..." : aiReply}</div>
        {transcript && <div style={{ color: "#aaa", fontSize: "12px" }}>You: {transcript}</div>}
        <button onClick={start} style={{ marginTop: "10px", padding: "16px 45px", borderRadius: "30px", border: "1px solid #fff", background: listening? "#fff" : "#000", color: listening? "#000" : "#fff", fontSize: "18px" }}>{listening? "Listening..." : "🎤 Talk"}</button>
      </div>
    </div>
  );
}