"""Create an original short, soft spring-and-swish UI sound."""

import math
import struct
import wave
from pathlib import Path

rate = 44100
duration = 0.52
output = Path("public/audio/shiba-hop.wav")
output.parent.mkdir(parents=True, exist_ok=True)
phase = 0
samples = []
for n in range(int(rate * duration)):
    t = n / rate
    # Brief anticipation, then a descending spring tone with a soft, airy tail.
    onset = max(0, t - 0.11)
    frequency = 145 + 610 * math.exp(-onset * 13)
    phase += 2 * math.pi * frequency / rate
    envelope = min(1, onset / 0.012) * math.exp(-onset * 12) if t > 0.11 else 0
    tone = (math.sin(phase) + 0.14 * math.sin(phase * 2)) * envelope * 0.29
    air = (math.sin(n * 2.173) + math.sin(n * 1.317)) * math.exp(-((t - 0.17) / 0.06) ** 2) * 0.018
    samples.append(struct.pack("<h", int(max(-1, min(1, tone + air)) * 32767)))
with wave.open(str(output), "wb") as stream:
    stream.setnchannels(1)
    stream.setsampwidth(2)
    stream.setframerate(rate)
    stream.writeframes(b"".join(samples))
print(output)
