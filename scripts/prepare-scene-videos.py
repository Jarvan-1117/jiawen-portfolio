"""Prepare local, silent, browser-compatible portfolio video assets."""

import argparse
import json
import subprocess
from pathlib import Path


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source-dir", required=True, type=Path)
    parser.add_argument("--ffmpeg", required=True, type=Path)
    parser.add_argument("--output-dir", type=Path, default=Path("public/videos/portfolio"))
    args = parser.parse_args()
    args.output_dir.mkdir(parents=True, exist_ok=True)

    clips = [
        ("idle", "Shiba_Inu_sitting_and_blinking_1080p_20261025082739.mp4", 0,
         "crop=1000:1080:460:0,scale=500:540"),
        ("entrance", "Man_catching_dog_on_sofa_1080p_20261025084330.mp4", 1.5,
         "scale=1920:1080"),
        ("day", "Man_stroking_dog_on_sofa_20261025083854.realesrgan.1.mkv", 0,
         "scale=1920:1080"),
        ("night", "Man_and_dog_sleeping_20261025083823.realesrgan.mkv", 0,
         "scale=1920:1080"),
    ]
    manifest = []
    for name, source_name, start, video_filter in clips:
        source = args.source_dir / source_name
        if not source.is_file():
            raise FileNotFoundError(source)
        output = args.output_dir / f"{name}.mp4"
        command = [str(args.ffmpeg), "-hide_banner", "-loglevel", "error", "-y"]
        if start:
            command += ["-ss", str(start)]
        command += [
            "-i", str(source), "-map", "0:v:0", "-an", "-sn", "-dn",
            "-map_metadata", "-1", "-vf", video_filter, "-r", "24",
            "-c:v", "libx264", "-preset", "medium", "-crf", "21",
            "-pix_fmt", "yuv420p", "-threads", "4", "-movflags", "+faststart",
            str(output),
        ]
        subprocess.run(command, check=True)
        subprocess.run([
            str(args.ffmpeg), "-hide_banner", "-loglevel", "error", "-y",
            "-i", str(output), "-frames:v", "1", "-c:v", "libwebp",
            "-quality", "86", str(args.output_dir / f"{name}-poster.webp"),
        ], check=True)
        manifest.append({"name": name, "source": source_name, "trim_start_seconds": start,
                         "output": output.name, "bytes": output.stat().st_size,
                         "audio": False})
        print(json.dumps(manifest[-1]), flush=True)
    (args.output_dir / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n")


if __name__ == "__main__":
    main()
