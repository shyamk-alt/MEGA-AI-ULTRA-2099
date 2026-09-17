"use client";
import { useEffect, useRef, useState, useCallback } from "react";

export default function JarvisOrb() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [text, setText] = useState("SAY HEY MEGA");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const isListeningRef = useRef(false);

  const speak = useCallback((msg: string) => {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(msg);
    utter.rate = 0.95;
    utter.pitch = 1;
    utter.volume = 1;
    window.speechSynthesis.speak(utter);
  }, []);

  const openApp = (webUrl: string, appUrl: string) => {
    try {
      window.location.href = appUrl;
      setTimeout(() => window.open(webUrl, "_blank"), 1000);
    } catch {
      window.open(webUrl, "_blank");
    }
  };

  const handleCommand = useCallback((command: string) => {
    const c = command.toLowerCase();
    setText(`Heard: ${command}`);

    // === 1. OPEN ANY APP ===
    if (c.includes("whatsapp")) { setText("Opening WhatsApp..."); speak("Opening WhatsApp"); openApp("https://web.whatsapp.com", "whatsapp://"); return; }
    if (c.includes("youtube") || c.includes("yt")) { speak("Opening YouTube"); window.open("https://www.youtube.com", "_blank"); setText("Opening YouTube..."); return; }
    if (c.includes("instagram") || c.includes("insta")) { speak("Opening Instagram"); openApp("https://instagram.com", "instagram://"); setText("Opening Instagram..."); return; }
    if (c.includes("spotify")) { speak("Opening Spotify"); openApp("https://open.spotify.com", "spotify://"); setText("Opening Spotify..."); return; }
    if (c.includes("netflix")) { speak("Opening Netflix"); window.open("https://netflix.com", "_blank"); return; }
    if (c.includes("facebook") || c.includes("fb")) { speak("Opening Facebook"); openApp("https://facebook.com", "fb://"); return; }
    if (c.includes("twitter") || c.includes(" x app")) { speak("Opening Twitter"); window.open("https://x.com", "_blank"); return; }
    if (c.includes("telegram")) { speak("Opening Telegram"); openApp("https://web.telegram.org", "tg://"); return; }
    if (c.includes("gmail") || c.includes("mail")) { speak("Opening Gmail"); window.open("https://mail.google.com", "_blank"); return; }
    if (c.includes("maps") || c.includes("map")) { speak("Opening Maps"); window.open("https://maps.google.com", "_blank"); return; }
    if (c.includes("amazon")) { speak("Opening Amazon"); window.open("https://amazon.in", "_blank"); return; }
    if (c.includes("flipkart")) { speak("Opening Flipkart"); window.open("https://flipkart.com", "_blank"); return; }
    if (c.includes("chrome") || c.includes("google")) {
      if (c.includes("search")) {
        const q = c.replace("search","").replace("google","").replace("hey mega","").trim();
        speak(`Searching for ${q}`); window.open(`https://www.google.com/search?q=${encodeURIComponent(q)}`, "_blank"); return;
      }
    }

    // === 2. SMART COMMANDS ===
    if (c.includes("time")) { const t = new Date().toLocaleTimeString(); setText(t); speak(`Time is ${t}`); return; }
    if (c.includes("date")) { const d = new Date().toDateString(); setText(d); speak(`Today is ${d}`); return; }
    if (c.includes("play")) { const song = c.replace("play","").trim(); speak(`Playing ${song}`); window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(song)}`, "_blank"); return; }
    if (c.includes("search")) { const q = c.replace("search","").replace("hey mega","").trim(); speak(`Searching ${q}`); window.open(`https://www.google.com/search?q=${encodeURIComponent(q)}`, "_blank"); return; }
    if (c.includes("open")) {
      let site = c.replace("open","").replace("hey mega","").trim().split(" ")[0];
      if(site){ speak(`Opening ${site}`); window.open(`https://${site}.com`, "_blank"); return; }
    }

    // === 3. AI CHAT FOR EVERYTHING ELSE ===
    fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: command }),
    })
   .then((r) => r.json())
   .then((data) => {
        const reply = data.reply || data.text;
        if (reply) { setText(reply); speak(reply); }
        else { window.open(`https://www.google.com/search?q=${encodeURIComponent(command)}`, "_blank"); }
      })
   .catch(() => {
        window.open(`https://www.google.com/search?q=${encodeURIComponent(command)}`, "_blank");
      });
  }, [speak]);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) { setText("Use Chrome browser"); return; }

    const recog = new SpeechRecognition();
    recognitionRef.current = recog;
    recog.continuous = true;
    recog.interimResults = true;
    recog.lang = "en-US";

    recog.onstart = () => { isListeningRef.current = true; setIsListening(true); setText("LISTENING..."); };
    recog.onresult = (e: any) => {
      let finalText = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) finalText += e.results[i][0].transcript;
      }
      if (finalText.trim().length > 2) handleCommand(finalText.trim());
    };
    recog.onend = () => { if (isListeningRef.current) { try { recog.start(); } catch {} } else setIsListening(false); };
    recog.onerror = () => { if (isListeningRef.current) { try { recog.start(); } catch {} } };

    try { recog.start(); isListeningRef.current = true; } catch {}

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let id: number; let t = 0;
    const animate = () => {
      t += 0.015;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const x = canvas.width/2, y = canvas.height/2;
      const r = 90 + Math.sin(t*2)*8;
      const grad = ctx.createRadialGradient(x, y, 10, x, y, r);
      if (isListeningRef.current) { grad.addColorStop(0, "#ffeb3b"); grad.addColorStop(0.5, "#ff9800"); grad.addColorStop(1, "#ff3d00"); }
      else { grad.addColorStop(0, "#ff5722"); grad.addColorStop(1, "#3e0000"); }
      ctx.fillStyle = grad; ctx.shadowBlur = 30; ctx.shadowColor = "#ff5500";
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI*2); ctx.fill();
      id = requestAnimationFrame(animate);
    };
    animate();
    return () => { isListeningRef.current = false; try { recog.stop(); } catch {} cancelAnimationFrame(id); };
  }, [handleCommand]);

  return (
    <div
      onClick={() => { if (!isListeningRef.current && recognitionRef.current) { try { recognitionRef.current.start(); isListeningRef.current = true; setIsListening(true); } catch {} } }}
      style={{ background: "black", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "white" }}
    >
      <canvas ref={canvasRef} width={300} height={300} style={{ cursor: "pointer" }} />
      <h2 style={{ marginTop: 20, textAlign: "center", padding: "0 20px" }}>{text}</h2>
      <p style={{ opacity: 0.5, fontSize: 12, marginTop: 10 }}>{isListening? "● LISTENING - Say anything!" : "TAP ORB TO START"}</p>
    </div>
  );
}