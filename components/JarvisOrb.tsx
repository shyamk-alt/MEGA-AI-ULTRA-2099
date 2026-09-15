
     "use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { createOrbScene, type OrbSceneApi } from "@/lib/orbScene";
import { HandTracker, type TrackerStatus } from "@/lib/handTracker";

type CameraState = "off" | "starting" | "on" | "error";
const MODE_LABEL: Record<TrackerStatus["mode"], string> = {
  idle: "STANDBY", spin: "SPIN", zoom: "ZOOM",
};

export default function JarvisOrb() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<OrbSceneApi | null>(null);
  const trackerRef = useRef<HandTracker | null>(null);

  const [camera, setCamera] = useState<CameraState>("off");
  const [status, setStatus] = useState<TrackerStatus>({ hands: 0, mode: "idle" });
  const [error, setError] = useState<string | null>(null);

  // VOICE STATE
  const [voiceOn, setVoiceOn] = useState(false);
  const [log, setLog] = useState('TAP VOICE BUTTON TO START');
  const recRef = useRef<any>(null);

  const speak = (t: string) => {
    setLog('ULTRON: ' + t);
    window.speechSynthesis.cancel();
    const m = new SpeechSynthesisUtterance(t);
    m.rate = 0.9; m.pitch = 0.8;
    window.speechSynthesis.speak(m);
  }

  const toggleVoice = () => {
    if (!voiceOn) {
      const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SR) { alert('Use Chrome browser!'); return; }
      const rec = new SR();
      rec.continuous = true; rec.lang = 'en-US';
      rec.onresult = (e: any) => {
        const cmd = e.results[e.results.length - 1][0].transcript.toLowerCase();
        setLog('YOU: ' + cmd);
        if (cmd.includes('ultron') || cmd.includes('hello')) speak('Yes Shyam, I am Ultron, online');
        else if (cmd.includes('kalam') || cmd.includes('abdul')) speak('A P J Abdul Kalam was the 11th President of India, Missile Man');
        else if (cmd.includes('mom') || cmd.includes('amma')) { speak('Opening WhatsApp for mom'); window.open('https://wa.me/?text=Amma%20I%20come%20late','_blank'); }
        else if (cmd.includes('youtube')) { speak('Opening YouTube'); window.open('https://youtube.com','_blank'); }
        else if (cmd.includes('whatsapp')) { speak('Opening WhatsApp'); window.open('https://wa.me/','_blank'); }
        else if (cmd.includes('reset')) { sceneRef.current?.resetView(); speak('View reset'); }
        else speak('You said ' + cmd);
      }
      rec.start(); recRef.current = rec; setVoiceOn(true);
      speak('Hello Shyam, I am Ultron, voice activated');
    } else {
      recRef.current?.stop(); setVoiceOn(false); speak('Voice off');
    }
  }

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const scene = createOrbScene(container);
    sceneRef.current = scene;
    return () => {
      trackerRef.current?.stop(); trackerRef.current = null;
      scene.dispose(); sceneRef.current = null;
    };
  }, []);

  const stopGestures = useCallback(() => {
    trackerRef.current?.stop(); trackerRef.current = null;
    setCamera("off"); setStatus({ hands: 0, mode: "idle" });
  }, []);

  const startGestures = useCallback(async () => {
    const video = videoRef.current; const overlay = overlayRef.current;
    if (!video ||!overlay || trackerRef.current) return;
    setCamera("starting"); setError(null);
    const tracker = new HandTracker(video, overlay, {
      onRotate: (dt, dp) => sceneRef.current?.rotateBy(dt, dp),
      onZoom: (factor) => sceneRef.current?.zoomBy(factor),
      onStatus: setStatus,
    });
    trackerRef.current = tracker;
    try { await tracker.start(); setCamera("on"); }
    catch (err) {
      trackerRef.current = null; tracker.stop(); setCamera("error");
      setError(err instanceof DOMException && err.name === "NotAllowedError"? "CAMERA ACCESS DENIED" : "TRACKING INIT FAILED");
    }
  }, []);

  const toggleGestures = useCallback(() => {
    if (trackerRef.current) stopGestures(); else void startGestures();
  }, [startGestures, stopGestures]);

  const cameraOn = camera === "on";

  return (
    <>
      <div ref={containerRef} className="orb-root" />
      <div className="overlay-vignette" />
      <div className="overlay-grain" />
      <div className="overlay-scanlines" />
      <div className="hud hud-title">U.L.T.R.O.N. 2099</div>

      <div className="hud hud-hint">
        <div><span className="key">DRAG</span> spin&nbsp;&nbsp;<span className="key">SCROLL</span> zoom</div>
        <div style={{color:'#0f0', marginTop:'8px', fontSize:'12px'}}>{log}</div>
      </div>

      <div className="hud hud-controls">
        <div className={`camera-panel${cameraOn? " visible" : ""}`}>
          <video ref={videoRef} muted playsInline className="camera-video" />
          <canvas ref={overlayRef} width={208} height={156} className="camera-overlay" />
          <div className="camera-status">
            {status.hands > 0? `${status.hands} HAND${status.hands > 1? "S" : ""} · ${MODE_LABEL[status.mode]}` : "SHOW HANDS"}
          </div>
        </div>
        {error && <div className="hud-error">{error}</div>}
        <div className="hud-row">
          <button type="button" className="hud-btn" onClick={toggleVoice} style={{background: voiceOn?'#00ff00':'gold', color:'black', fontWeight:'bold'}}>
            {voiceOn? "🔴 VOICE ON" : "🎤 VOICE OFF"}
          </button>
          <button type="button" className="hud-btn" aria-pressed={cameraOn} onClick={toggleGestures} disabled={camera === "starting"}>
            {camera === "starting"? "INITIALIZING…" : cameraOn? "GESTURES ON" : "GESTURES OFF"}
          </button>
        </div>
        <div className="hud-row">
          <button type="button" className="hud-btn" onClick={() => sceneRef.current?.zoomIn()}>+</button>
          <button type="button" className="hud-btn" onClick={() => sceneRef.current?.zoomOut()}>−</button>
          <button type="button" className="hud-btn" onClick={() => sceneRef.current?.resetView()}>RESET</button>
        </div>
      </div>
    </>
  );
}