"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { Volume2, VolumeX } from "lucide-react";

type AudioControls = {
  enabled: boolean;
  start: () => void;
  jump: () => void;
  toggle: () => void;
};
const AudioContext = createContext<AudioControls | null>(null);
export const usePortfolioAudio = () => useContext(AudioContext);
const AUDIO_KEY = "portfolio-audio-enabled";

export default function PortfolioAudioProvider({ children }: { children: ReactNode }) {
  const music = useRef<HTMLAudioElement>(null);
  const effect = useRef<HTMLAudioElement>(null);
  const [enabled, setEnabled] = useState(true);
  const started = useRef(false);

  useEffect(() => {
    try { if (localStorage.getItem(AUDIO_KEY) === "false") setEnabled(false); } catch { /* Optional preference storage. */ }
  }, []);

  const playMusic = useCallback(() => {
    if (!music.current) return;
    music.current.volume = 0.12;
    void music.current.play().catch(() => undefined);
  }, []);

  const start = () => {
    started.current = true;
    if (enabled) playMusic();
  };
  const jump = () => {
    if (!enabled || !effect.current) return;
    effect.current.volume = 0.4;
    effect.current.currentTime = 0;
    void effect.current.play().catch(() => undefined);
  };
  const toggle = () => {
    const next = !enabled;
    setEnabled(next);
    started.current = true;
    try { localStorage.setItem(AUDIO_KEY, String(next)); } catch { /* Keep the current-page preference. */ }
    if (next) playMusic();
    else { music.current?.pause(); effect.current?.pause(); }
  };

  useEffect(() => {
    if (!enabled) { music.current?.pause(); effect.current?.pause(); }
    const update = () => {
      if (document.hidden) { music.current?.pause(); effect.current?.pause(); }
      else if (enabled && started.current) playMusic();
    };
    document.addEventListener("visibilitychange", update);
    const unlock = () => {
      if (started.current) return;
      started.current = true;
      if (enabled) playMusic();
    };
    const unlockFromKeyboard = (event: KeyboardEvent) => {
      if (event.key === "Enter" || event.key === " ") unlock();
    };
    document.addEventListener("pointerdown", unlock);
    document.addEventListener("keydown", unlockFromKeyboard);
    return () => {
      document.removeEventListener("visibilitychange", update);
      document.removeEventListener("pointerdown", unlock);
      document.removeEventListener("keydown", unlockFromKeyboard);
    };
  }, [enabled, playMusic]);

  return (
    <AudioContext.Provider value={{ enabled, start, jump, toggle }}>
      {children}
      <audio ref={music} className="portfolio-music" src="/audio/easy-lemon.mp3" loop preload="none" aria-hidden="true" />
      <audio ref={effect} className="portfolio-jump-sound" src="/audio/shiba-hop.wav" preload="auto" aria-hidden="true" />
    </AudioContext.Provider>
  );
}

export function PortfolioAudioToggle({ className = "" }: { className?: string }) {
  const audio = usePortfolioAudio();
  if (!audio) return null;
  const label = audio.enabled ? "Mute music and sound effects" : "Enable music and sound effects";
  return (
    <button type="button" onClick={audio.toggle} className={`scene-control focus-ring ${className}`} aria-label={label} title={label} aria-pressed={audio.enabled}>
      {audio.enabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
    </button>
  );
}
