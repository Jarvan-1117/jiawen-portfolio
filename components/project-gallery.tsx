"use client";

import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Maximize2, X, ZoomIn, ZoomOut } from "lucide-react";
import type { ProjectFigure } from "@/data/portfolio";

export default function ProjectGallery({ figures }: { figures: ProjectFigure[] }) {
  const [selected, setSelected] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [scale, setScale] = useState(1);
  const dialog = useRef<HTMLDialogElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const id = useId();
  const figure = figures[selected];
  const move = (direction: number) => setSelected(index => (index + direction + figures.length) % figures.length);

  useEffect(() => {
    setScale(1);
    viewport.current?.scrollTo(0, 0);
  }, [selected, zoomed]);

  useEffect(() => {
    if (!zoomed || !dialog.current) return;
    const element = dialog.current;
    const overflow = document.body.style.overflow;
    element.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      element.close();
      document.body.style.overflow = overflow;
    };
  }, [zoomed]);

  if (!figure) return null;

  const controls = (
    <>
      <span className="gallery-counter whitespace-nowrap text-xs tabular-nums" aria-live="polite">{selected + 1} / {figures.length}</span>
      <button type="button" className="gallery-control focus-ring" onClick={() => move(-1)} aria-label="Previous image" title="Previous image" disabled={figures.length < 2}>
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button type="button" className="gallery-control focus-ring" onClick={() => move(1)} aria-label="Next image" title="Next image" disabled={figures.length < 2}>
        <ChevronRight className="h-4 w-4" />
      </button>
    </>
  );

  return (
    <section className="project-gallery mt-10" aria-label="Project images">
      <figure>
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 id={`${id}-title`} className="gallery-title text-base font-semibold">{figure.title}</h2>
          <div className="flex shrink-0 items-center gap-2">{controls}</div>
        </div>
        <button type="button" className="project-gallery-stage focus-ring relative block w-full overflow-hidden rounded-md border" onClick={() => setZoomed(true)} aria-label={`Enlarge ${figure.title}`} aria-haspopup="dialog" title="Enlarge image">
          <Image src={figure.src} alt={figure.alt} width={figure.width} height={figure.height} className="h-full w-full object-contain" unoptimized />
          <span className="gallery-zoom absolute bottom-3 right-3 grid h-9 w-9 place-items-center rounded-md border" aria-hidden="true"><ZoomIn className="h-5 w-5" /></span>
        </button>
        <figcaption className="gallery-caption mt-3 text-sm leading-6" aria-live="polite">{figure.caption}</figcaption>
      </figure>
      <div className="mt-4 flex gap-3 overflow-x-auto pb-2" role="group" aria-label="Choose project image">
        {figures.map((item, index) => (
          <button type="button" key={item.src} className="gallery-thumbnail focus-ring h-16 w-24 shrink-0 overflow-hidden rounded border p-1" onClick={() => setSelected(index)} aria-label={`Show ${item.title}`} aria-pressed={index === selected} title={item.title}>
            <Image src={item.src} alt="" className="h-full w-full object-contain" width={96} height={64} unoptimized />
          </button>
        ))}
      </div>
      <dialog ref={dialog} className="project-image-dialog" aria-labelledby={`${id}-zoom-title`} onClose={() => setZoomed(false)} onClick={event => { if (event.target === event.currentTarget) setZoomed(false); }} onKeyDown={event => {
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
          event.preventDefault();
          move(event.key === "ArrowLeft" ? -1 : 1);
        }
      }}>
        <div className="flex h-full min-h-0 flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <h2 id={`${id}-zoom-title`} className="gallery-title text-base font-semibold">{figure.title}</h2>
            <button type="button" className="gallery-control focus-ring shrink-0" onClick={() => setZoomed(false)} aria-label="Close image" title="Close image" autoFocus><X className="h-5 w-5" /></button>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" className="gallery-control focus-ring" onClick={() => setScale(value => Math.max(1, value - .5))} disabled={scale === 1} aria-label="Zoom out" title="Zoom out"><ZoomOut className="h-4 w-4" /></button>
            <span className="gallery-counter w-12 text-center text-xs tabular-nums">{Math.round(scale * 100)}%</span>
            <button type="button" className="gallery-control focus-ring" onClick={() => setScale(value => Math.min(3, value + .5))} disabled={scale === 3} aria-label="Zoom in" title="Zoom in"><ZoomIn className="h-4 w-4" /></button>
            <button type="button" className="gallery-control focus-ring" onClick={() => { setScale(1); viewport.current?.scrollTo(0, 0); }} aria-label="Fit image" title="Fit image"><Maximize2 className="h-4 w-4" /></button>
          </div>
          <div ref={viewport} className="gallery-image-viewport min-h-0 flex-1 overflow-auto bg-white">
            <div style={{ width: `${scale * 100}%`, height: `${scale * 100}%` }}>
              <Image src={figure.src} alt={figure.alt} width={figure.width} height={figure.height} className="h-full w-full object-contain" style={{ objectPosition: scale > 1 ? "left top" : "center" }} unoptimized />
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="gallery-caption min-w-0 text-sm leading-6 sm:flex-1">{figure.caption}</p>
            <div className="flex shrink-0 items-center justify-end gap-2">{controls}</div>
          </div>
        </div>
      </dialog>
    </section>
  );
}
