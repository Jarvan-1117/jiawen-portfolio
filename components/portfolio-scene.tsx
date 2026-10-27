"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { useReducedMotion } from "framer-motion";
import { Moon, Sun } from "lucide-react";

export type SceneMode = "day" | "night";
type SceneSettings = {
  mode: SceneMode;
  toggleMode: () => void;
  paused: boolean;
  togglePaused: () => void;
};

const SceneContext = createContext<SceneSettings | null>(null);
export const usePortfolioScene = () => useContext(SceneContext);

export default function PortfolioSceneProvider({ children, restoreMode = false }: { children: ReactNode; restoreMode?: boolean }) {
  const [mode, setMode] = useState<SceneMode>("day");
  const [paused, setPaused] = useState(false);
  const reducedMotion = useReducedMotion();
  const [motionOverride, setMotionOverride] = useState(false);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("portfolio-current-scene");
      if (restoreMode && (saved === "day" || saved === "night")) setMode(saved);
      else sessionStorage.setItem("portfolio-current-scene", "day");
    } catch { /* The visual theme also works without storage. */ }
  }, [restoreMode]);
  const toggleMode = () => {
    const next = mode === "day" ? "night" : "day";
    setMode(next);
    try { sessionStorage.setItem("portfolio-current-scene", next); } catch { /* Keep the in-memory theme. */ }
  };
  const effectivePaused = paused || (Boolean(reducedMotion) && !motionOverride);

  return (
    <SceneContext.Provider value={{
      mode, paused: effectivePaused, toggleMode,
      togglePaused: () => { setPaused(!effectivePaused); setMotionOverride(true); }
    }}>
      <div className="portfolio-cinematic" data-scene={mode}>{children}</div>
    </SceneContext.Provider>
  );
}

export function PortfolioSceneToggle() {
  const scene = usePortfolioScene();
  if (!scene) return null;
  const label = scene.mode === "day" ? "Switch to night mode" : "Switch to day mode";
  return (
    <button type="button" className="scene-control focus-ring rounded-md p-2" onClick={scene.toggleMode} aria-label={label} title={label} aria-pressed={scene.mode === "night"}>
      {scene.mode === "day" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
    </button>
  );
}

export function PortfolioVideoBackground({ active }: { active: boolean }) {
  const scene = usePortfolioScene();
  const mode = scene?.mode ?? "day";
  const video = useRef<HTMLVideoElement>(null);
  const [loadedMode, setLoadedMode] = useState<SceneMode | null>(null);
  const [documentVisible, setDocumentVisible] = useState(true);
  const paused = scene?.paused ?? false;

  useEffect(() => {
    const update = () => setDocumentVisible(!document.hidden);
    update();
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  useEffect(() => {
    const element = video.current;
    if (!element) return;
    let disposed = false;
    const shouldPlay = active && !paused && documentVisible;
    const markReady = () => {
      if (!disposed && element.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) setLoadedMode(mode);
    };
    const play = () => {
      if (!shouldPlay) return;
      void element.play().then(markReady).catch(() => undefined);
    };
    const onReady = () => {
      markReady();
      if (element.paused) play();
    };
    element.muted = true;
    // Media may have loaded before React hydrates, so an event alone is insufficient.
    element.addEventListener("loadeddata", onReady);
    element.addEventListener("canplay", onReady);
    element.addEventListener("playing", markReady);
    markReady();
    if (shouldPlay) {
      play();
    } else {
      element.pause();
    }
    return () => {
      disposed = true;
      element.removeEventListener("loadeddata", onReady);
      element.removeEventListener("canplay", onReady);
      element.removeEventListener("playing", markReady);
    };
  }, [active, paused, documentVisible, mode]);

  return (
    <div className="portfolio-video-background" aria-hidden="true">
      <div className="portfolio-video-background__frame" style={{ backgroundImage: `url(/videos/portfolio/${mode}-poster.webp)` }}>
        <video
          key={mode}
          ref={video}
          className={loadedMode === mode ? "scene-video scene-video--loaded" : "scene-video"}
          src={`/videos/portfolio/${mode}.mp4`}
          poster={`/videos/portfolio/${mode}-poster.webp`}
          muted
          playsInline
          loop
          preload="auto"
          autoPlay={active && !paused && documentVisible}
          disablePictureInPicture
        />
      </div>
    </div>
  );
}
