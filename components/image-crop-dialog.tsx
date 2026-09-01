"use client";

import { useEffect, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { Crop, X } from "lucide-react";

export type CropPreset = {
  aspect: number;
  width: number;
  height: number;
};

type ImageCropDialogProps = {
  file: File;
  preset: CropPreset;
  processing: boolean;
  onCancel: () => void;
  onConfirm: (file: File) => Promise<void>;
};

function loadImage(source: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = source;
  });
}

async function createCroppedFile(source: string, area: Area, preset: CropPreset, originalName: string) {
  const image = await loadImage(source);
  const canvas = document.createElement("canvas");
  canvas.width = preset.width;
  canvas.height = preset.height;
  const context = canvas.getContext("2d");

  if (!context) throw new Error("Your browser could not prepare this image.");

  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.drawImage(
    image,
    area.x,
    area.y,
    area.width,
    area.height,
    0,
    0,
    preset.width,
    preset.height
  );

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((result) => result ? resolve(result) : reject(new Error("Image processing failed.")), "image/jpeg", 0.9);
  });
  const baseName = originalName.replace(/\.[^.]+$/, "") || "image";
  return new File([blob], `${baseName}-${preset.width}x${preset.height}.jpg`, { type: "image/jpeg" });
}

export default function ImageCropDialog({ file, preset, processing, onCancel, onConfirm }: ImageCropDialogProps) {
  const [source, setSource] = useState("");
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState<Area | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const objectUrl = URL.createObjectURL(file);
    setSource(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const confirmCrop = async () => {
    if (!source || !croppedArea) return;
    setError("");
    try {
      await onConfirm(await createCroppedFile(source, croppedArea, preset, file.name));
    } catch (cropError) {
      setError(cropError instanceof Error ? cropError.message : "Image processing failed.");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4" role="dialog" aria-modal="true" aria-label="Crop image">
      <div className="w-full max-w-3xl overflow-hidden rounded-lg border border-white/15 bg-[#0f1115] shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div>
            <h3 className="font-semibold text-white">Crop image</h3>
            <p className="mt-1 text-xs text-neutral-400">Output: {preset.width} × {preset.height}px</p>
          </div>
          <button className="rounded-md p-2 text-neutral-400 hover:bg-white/10 hover:text-white" onClick={onCancel} disabled={processing} aria-label="Close crop dialog">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="relative h-[52vh] min-h-[320px] max-h-[600px] bg-black">
          {source ? (
            <Cropper
              image={source}
              crop={crop}
              zoom={zoom}
              aspect={preset.aspect}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={(_, pixels) => setCroppedArea(pixels)}
              showGrid
            />
          ) : null}
        </div>

        <div className="space-y-4 p-5">
          <label className="flex items-center gap-4 text-sm text-neutral-300">
            <span className="w-12">Zoom</span>
            <input className="w-full accent-[#9ee7e5]" type="range" min="1" max="3" step="0.01" value={zoom} onChange={(event) => setZoom(Number(event.target.value))} />
          </label>
          {error ? <p className="text-sm text-red-300">{error}</p> : null}
          <div className="flex justify-end gap-3">
            <button className="rounded-md border border-white/15 px-4 py-2 text-sm font-semibold text-neutral-300 hover:border-white/30 hover:text-white" onClick={onCancel} disabled={processing}>Cancel</button>
            <button className="flex items-center gap-2 rounded-md bg-[#9ee7e5] px-4 py-2 text-sm font-semibold text-[#071012] hover:bg-white disabled:cursor-wait disabled:opacity-60" onClick={() => void confirmCrop()} disabled={processing || !croppedArea}>
              <Crop className="h-4 w-4" />
              {processing ? "Uploading..." : "Crop & Upload"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
