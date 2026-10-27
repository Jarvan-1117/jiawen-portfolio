"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { useReducedMotion } from "framer-motion";
import { Play } from "lucide-react";
import Image from "next/image";
import { PortfolioAudioToggle, usePortfolioAudio } from "@/components/portfolio-audio";

type Stage = "waiting" | "crouching" | "exiting" | "transition" | "revealing" | "done";
const SEEN_KEY = "portfolio-video-intro-v2";
const IDLE = "/videos/portfolio/idle.mp4";
const ENTRANCE = "/videos/portfolio/entrance.mp4";
const EntranceActive = createContext(false);
export const useEntranceActive = () => useContext(EntranceActive);

export default function PortfolioEntrance({ children }: { children: ReactNode }) {
  const [stage, setStage] = useState<Stage>("waiting");
  const [hydrated, setHydrated] = useState(false);
  const [playbackBlocked, setPlaybackBlocked] = useState(false);
  const reducedMotion = useReducedMotion();
  const audio = usePortfolioAudio();
  const dogButton = useRef<HTMLButtonElement>(null);
  const idleVideo = useRef<HTMLVideoElement>(null);
  const entranceVideo = useRef<HTMLVideoElement>(null);
  const dialog = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const running = useRef(false);
  const active = stage !== "done";

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  const finish = useCallback((focusContent = true) => {
    clearTimers();
    setStage("done");
    try { sessionStorage.setItem(SEEN_KEY, "1"); } catch { /* Storage may be unavailable in private browsers. */ }
    if (focusContent) requestAnimationFrame(() => {
      content.current?.querySelector<HTMLElement>("h1")?.setAttribute("tabindex", "-1");
      content.current?.querySelector<HTMLElement>("h1")?.focus({ preventScroll: true });
    });
  }, [clearTimers]);

  useEffect(() => {
    setHydrated(true);
    let seen = false;
    try { seen = sessionStorage.getItem(SEEN_KEY) === "1"; } catch { /* The intro works without storage. */ }
    const replay = new URLSearchParams(window.location.search).get("intro") === "1";
    if ((seen && !replay) || window.location.hash) {
      finish(false);
      return;
    }

    dialog.current?.focus({ preventScroll: true });
  }, [finish]);

  useEffect(() => {
    if (!active) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [active]);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const reveal = useCallback(() => {
    clearTimers();
    setStage("revealing");
    timers.current = [setTimeout(() => finish(), 650)];
  }, [clearTimers, finish]);

  useEffect(() => {
    const element = idleVideo.current;
    if (!element) return;
    element.muted = true;
    if (stage === "waiting" && !reducedMotion) {
      void element.play().catch(() => undefined);
    } else {
      element.pause();
    }
  }, [stage, reducedMotion]);

  useEffect(() => {
    if (stage !== "transition") return;
    const element = entranceVideo.current;
    if (!element) return;
    element.muted = true;
    void element.play().catch(() => setPlaybackBlocked(true));
    const watchdog = setTimeout(() => reveal(), 25000);
    return () => {
      clearTimeout(watchdog);
      element.pause();
    };
  }, [stage, reveal]);

  const enter = () => {
    if (running.current) return;
    audio?.start();
    if (reducedMotion) { finish(); return; }
    running.current = true;
    audio?.jump();
    setStage("crouching");
    timers.current = [
      setTimeout(() => setStage("exiting"), 180),
      setTimeout(() => setStage("transition"), 900)
    ];
  };

  return (
    <>
      <div ref={content} inert={active ? true : undefined} aria-hidden={active ? true : undefined} className={active && stage !== "revealing" ? "portfolio-content portfolio-content--waiting" : "portfolio-content"}>
        <EntranceActive.Provider value={active}>{children}</EntranceActive.Provider>
      </div>
      {active && (
        <div
          ref={dialog}
          tabIndex={-1}
          className={`portfolio-entrance portfolio-entrance--${stage}`}
          role="dialog"
          aria-modal="true"
          aria-label="Welcome to Jiawen's portfolio"
          onKeyDown={(event) => {
            if (event.key === "Escape") { event.preventDefault(); finish(); }
            if (event.key === "Tab") {
              const buttons = [...event.currentTarget.querySelectorAll<HTMLButtonElement>("button:not(:disabled):not([tabindex='-1'])")];
              if (!buttons.length) return;
              const first = buttons[0];
              const last = buttons[buttons.length - 1];
              if (event.shiftKey && (document.activeElement === first || !buttons.includes(document.activeElement as HTMLButtonElement))) {
                event.preventDefault(); last.focus();
              } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault(); first.focus();
              }
            }
          }}
        >
          <video
            ref={entranceVideo}
            className="entrance-film"
            src={ENTRANCE}
            poster="/videos/portfolio/entrance-poster.webp"
            muted
            playsInline
            preload="auto"
            disablePictureInPicture
            aria-hidden="true"
            onEnded={reveal}
            onError={reveal}
          />
          <button type="button" className="entrance-skip" disabled={!hydrated} aria-label="Skip intro" title="Skip intro" onClick={() => { audio?.start(); finish(); }}>
            <Image src="/images/intro/skip-ui.webp" alt="" width={1792} height={1024} unoptimized aria-hidden="true" />
          </button>
          <PortfolioAudioToggle className="entrance-audio" />
          {playbackBlocked && stage === "transition" && (
            <button type="button" className="entrance-play focus-ring" onClick={() => {
              void entranceVideo.current?.play().then(() => setPlaybackBlocked(false)).catch(() => finish());
            }}><Play size={20} aria-hidden="true" /> Play introduction</button>
          )}
          <div className="entrance-dog-stage">
            <button
              ref={dogButton}
              type="button"
              disabled={!hydrated}
              className="entrance-dog"
              onClick={enter}
              aria-label="Play the dog animation and enter portfolio"
              aria-disabled={stage !== "waiting"}
              tabIndex={stage === "waiting" ? 0 : -1}
              title="Enter portfolio"
            >
              <video ref={idleVideo} className="entrance-idle-video" src={IDLE} poster="/videos/portfolio/idle-poster.webp" muted playsInline loop autoPlay={!reducedMotion} preload="auto" disablePictureInPicture aria-hidden="true" />
              <Image src="/images/intro/shiba-jump.webp" className="entrance-jump-image" alt="" width={1536} height={1024} unoptimized loading="eager" aria-hidden="true" />
            </button>
          </div>
          {stage === "waiting" && (
            <button type="button" className="entrance-click" disabled={!hydrated} onClick={enter} aria-label="Click to enter portfolio" title="Enter portfolio">
              <Image src="/images/intro/click-ui.webp" alt="" width={1280} height={1280} unoptimized aria-hidden="true" />
            </button>
          )}
          <span className="sr-only" role="status" aria-live="polite">
            {stage === "waiting" ? "Click the dog to enter, or skip the intro." : "The dog is jumping into Jiawen's arms."}
          </span>
        </div>
      )}
    </>
  );
}
