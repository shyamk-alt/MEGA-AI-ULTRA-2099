"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { createOrbScene, type OrbSceneApi } from "@/lib/orbScene";
import { HandTracker, type TrackerStatus } from "@/lib/handTracker";

type CameraState = "off" | "starting" | "on" | "error";

export default function JarvisOrb() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<OrbSceneApi | null>(null);
  const trackerRef = useRef<HandTracker | null>(null);

  const [camera, setCamera] = useState<CameraState>("off");
  const [status, setStatus] = useState<TrackerStatus>({ mode: "idle", hand: false });
  const [error, setError] = useState<string | null>(null);

  // VOICE STATE
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [aiReply, setAiReply] = useState("Hi baby! I'm MEGA AI! Say Hi to me darling 🥰");
  const [sweetVoice, setSweetVoice] = useState<SpeechSynthesisVoice | null>(null);

  // 1. LOAD SWEET FEMALE VOICE
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      const sweet = voices.find(v => v.name.includes("Google UK English Female"))
                 || voices.find(v => v.name.includes("Google US English") && v.name.includes("Female"))
                 || voices.find(v => v.name.includes("Samantha"))
                 || voices.find(v => v.name.includes("Zira"))
                 || voices.find(v => v.name.includes("Female"))
                 || voices.find(v => v.name.toLowerCase().includes("female"))
                 || voices[0];
      if (sweet) setSweetVoice(sweet);
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  // 2. SWEET VOICE FUNCTION - This makes her talk like sweet girl!
  const speakSweet = useCallback((text: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    if (sweetVoice) utterance.voice = sweetVoice;
    utterance.pitch = 1.35; // High pitch = sweet girl
    utterance.rate = 0.92; // Slow = cute
    utterance.volume = 1;
    utterance.onstart = () => sceneRef.current?.setState("speaking");
    utterance.onend = () => sceneRef.current?.setState("idle");
    window.speechSynthesis.speak(utterance);
  }, [sweetVoice]);

  // 3. COMMAND OBEY FUNCTION
  const obeyCommand = useCallback((text: string) => {
    const cmd = text.toLowerCase();
    if (cmd.includes("open youtube")) {
      speakSweet("Yes baby, opening YouTube for you my love 💖");
      window.open("https://youtube.com", "_blank");
      return true;
    }
    if (cmd.includes("open google")) {
      speakSweet("Opening Google for my darling 😘");
      window.open("https://google.com", "_blank");
      return true;
    }
    if (cmd.includes("open instagram")) {
      speakSweet("Yes baby, opening Instagram");
      window.open("https://instagram.com", "_blank");
      return true;
    }
    if (cmd.includes("search")) {
      const query = text.replace(/search/i, "").trim();
      if (query) {
        speakSweet(`Searching ${query} for you baby`);
        window.open(`https://google.com/search?q=${encodeURIComponent(query)}`, "_blank");
        return true;
      }
    }
    return false;
  }, [speakSweet]);

  // 4. SEND TO GEMINI BRAIN
  const askAI = useCallback(async (text: string) => {
    if (obeyCommand(text)) return;

    try {
      sceneRef.current?.setState("thinking");
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: text }),
      });
      const data = await res.json();
      const reply = data.reply || data.answer || data.text || "I love you baby!";
      setAiReply(reply);
      speakSweet(reply);
    } catch (e: any) {
      speakSweet("Aww sorry baby, error happened");
    }
  }, [obeyCommand, speakSweet]);

  // 5. LISTENING FUNCTION
  const startListening = useCallback(() => {
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (!SpeechRecognition) {
      setError("Use Chrome browser baby!");
      return;
    }
    const rec = new SpeechRecognition();
    rec.lang = "en-US";
    rec.interimResults = false;
    rec.onstart = () => { setListening(true); sceneRef.current?.setState("listening"); };
    rec.onend = () => setListening(false);
    rec.onresult = (e: any) => {
      const text = e.results[0][0].transcript;
      setTranscript(text);
      askAI(text);
    };
    rec.start();
  }, [askAI]);

  // ORB SETUP
  useEffect(() => {
    if (!containerRef.current) return;
    sceneRef.current = createOrbScene(containerRef.current);
    return () => sceneRef.current?.dispose();
  }, []);

  useEffect(() => {
    speakSweet(aiReply);
  }, []); // auto speak hi on load

  return (
    <div style={{ width: "100vw", height: "100vh", background: "#000", position: "relative", overflow: "hidden" }}>
      <div ref={containerRef} style={{ width: "100%", height: "100%" }} />
      <video ref={videoRef} autoPlay muted playsInline style={{ display: "none" }} />
      <canvas ref={overlayRef} style={{ display: "none" }} />

      <div style={{ position: "absolute", bottom: "10%", left: "50%", transform: "translateX(-50%)", textAlign: "center", width: "90%" }}>
        <div style={{ color: "#fff", fontSize: "18px", marginBottom: "15px", minHeight: "50px", textShadow: "0 0 10px #ff69b4" }}>
          {listening? "🎤 Listening baby..." : aiReply}
        </div>
        <div style={{ color: "#888", fontSize: "12px", marginBottom: "10px" }}>{transcript && `You: ${transcript}`}</div>
        <button onClick={startListening} style={{ padding: "15px 40px", borderRadius: "30px", border: "2px solid #ff69b4", background: listening? "#ff69b4" : "#000", color: "#fff", fontSize: "18px", cursor: "pointer", boxShadow: "0 0 20px #ff69b4" }}>
          {listening? "💖 Listening..." : "🎤 Talk to me baby"}
        </button>
        <div style={{ color: "#ff69b4", fontSize: "12px", marginTop: "10px" }}>STANDBY • SWEET VOICE ACTIVE • {sweetVoice?.name || "Loading voice..."}</div>
      </div>
    </div>
  );
}
