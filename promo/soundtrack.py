"""
Original soundtrack for the Pip-Boy promo: 120 BPM retro synth groove + Pip-Boy SFX.
Everything is synthesized here (no samples). Output: 48 s, 44.1 kHz, 16-bit stereo WAV.
Usage: python3 promo/soundtrack.py [out.wav=promo/comp/soundtrack.wav]   (needs numpy)

Timeline (seconds, bar = 2 s):
  0-4    boot hum, typewriter ticks, pad fades in, glitch hit at 3.0
  4-8    build: arp opens up, riser, snare roll
  8      DROP: impact + full groove
  12..40 scene changes every 4 s (whoosh + Pip-Boy tab clunk)
  28-32  radio: filtered groove, Morse "JPSR" + static
  32-36  theme flashes: click on every beat
  36-40  terminal: typing ticks
  44     final impact, drums out, chord swell
  47.3   power-down sweep
"""
import sys
import wave
from pathlib import Path

import numpy as np

SR = 44100
DUR = 48.0
N = int(SR * DUR)
BPM = 120
BEAT = 60 / BPM
BAR = BEAT * 4
rng = np.random.default_rng(7)
t_all = np.arange(N) / SR


def note_hz(midi):
    return 440.0 * 2 ** ((midi - 69) / 12)


def at(sec):
    return int(round(sec * SR))


def add(buf, sig, start_sec, gain=1.0):
    i = at(start_sec)
    if i >= len(buf):
        return
    j = min(len(buf), i + len(sig))
    buf[i:j] += sig[: j - i] * gain


def fft_filter(x, lo=None, hi=None, order=2):
    """Static Butterworth-shaped magnitude filter applied in the frequency domain."""
    n = len(x)
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(n, 1 / SR)
    g = np.ones_like(f)
    if hi:
        g *= 1 / np.sqrt(1 + (f / hi) ** (2 * order))
    if lo:
        with np.errstate(divide='ignore'):
            g *= 1 / np.sqrt(1 + (lo / np.maximum(f, 1e-6)) ** (2 * order))
    return np.fft.irfft(X * g, n)


def saw(freq, n, phase=0.0):
    t = np.arange(n) / SR
    return 2 * ((t * freq + phase) % 1.0) - 1


def square(freq, n, duty=0.5):
    t = np.arange(n) / SR
    return np.where((t * freq) % 1.0 < duty, 1.0, -1.0)


def sine(freq, n, phase=0.0):
    t = np.arange(n) / SR
    return np.sin(2 * np.pi * freq * t + phase)


def exp_env(n, decay, attack=0.002):
    t = np.arange(n) / SR
    a = np.clip(t / attack, 0, 1)
    return a * np.exp(-t / decay)


def noise(n):
    return rng.uniform(-1, 1, n)


def reverb(x, seconds=1.2, mix=0.25):
    m = int(SR * seconds)
    ir = noise(m) * np.exp(-np.arange(m) / SR / (seconds / 5))
    ir = fft_filter(ir, hi=5000)
    ir /= np.sqrt(np.sum(ir ** 2))
    size = 1 << int(np.ceil(np.log2(len(x) + m)))
    y = np.fft.irfft(np.fft.rfft(x, size) * np.fft.rfft(ir, size), size)[: len(x)]
    return x * (1 - mix) + y * mix


# ── Harmony: Am F C G (one chord per bar) ────────────────────────────────────
CHORDS = [
    [57, 60, 64],  # Am
    [53, 57, 60],  # F
    [48, 52, 55, 60],  # C
    [55, 59, 62],  # G
]
ROOTS = [45, 41, 48, 43]


def chord_at(sec):
    return int(sec // BAR) % 4


# ── Instruments ─────────────────────────────────────────────────────────────
def pad_track():
    L = np.zeros(N)
    R = np.zeros(N)
    for b in range(int(DUR / BAR)):
        start = b * BAR
        if start >= 47.5:
            break
        chord = CHORDS[b % 4]
        n = int(BAR * SR) + int(0.6 * SR)
        env = np.minimum(1, np.arange(n) / (0.25 * SR)) * np.clip((n - np.arange(n)) / (0.6 * SR), 0, 1)
        for k, m in enumerate(chord + [chord[0] + 12]):
            f = note_hz(m)
            L_v = saw(f * 2 ** (-7 / 1200), n, 0.1 * k) + 0.6 * saw(f * 2 ** (5 / 1200), n, 0.3)
            R_v = saw(f * 2 ** (7 / 1200), n, 0.2 * k) + 0.6 * saw(f * 2 ** (-5 / 1200), n, 0.7)
            add(L, L_v * env, start, 0.06)
            add(R, R_v * env, start, 0.06)
    L = fft_filter(L, hi=1800, order=2)
    R = fft_filter(R, hi=1800, order=2)
    return L, R


def bass_track():
    out = np.zeros(N)
    step = BEAT / 2
    t = 8.0
    while t < 44.0:
        root = ROOTS[chord_at(t)]
        f = note_hz(root)
        n = int(0.24 * SR)
        sig = 0.8 * sine(f, n) + 0.35 * fft_filter(saw(f, n), hi=600)
        env = exp_env(n, 0.16, 0.004)
        # radio section: lighter
        g = 0.5 if 28 <= t < 32 else 1.0
        add(out, sig * env, t, 0.42 * g)
        t += step
    return out


def arp_track():
    dark = np.zeros(N)
    bright = np.zeros(N)
    step = BEAT / 4
    pattern = [0, 1, 2, 3, 2, 1, 0, 2]
    t = 2.0
    i = 0
    while t < 46.0:
        chord = CHORDS[chord_at(t)]
        tones = chord + [m + 12 for m in chord]
        m = tones[pattern[i % len(pattern)] % len(tones)] + 12
        n = int(0.12 * SR)
        sig = square(note_hz(m), n, 0.3) * exp_env(n, 0.06, 0.002)
        add(dark, sig, t)
        add(bright, sig, t)
        t += step
        i += 1
    dark = fft_filter(dark, hi=900, order=2)
    bright = fft_filter(bright, hi=3500, order=2)
    # cutoff opens during the build (2 → 8 s), then stays bright; closes for the radio section
    x = np.clip((t_all - 2.0) / 6.0, 0, 1)
    x = np.where((t_all >= 28) & (t_all < 32), 0.15, x)
    x = np.where(t_all >= 44, np.clip(1 - (t_all - 44) / 2, 0, 1), x)
    mix = dark * (1 - x) + bright * x
    fade_in = np.clip((t_all - 2.0) / 2.0, 0, 1)
    mix *= fade_in * 0.11
    # ping-pong delay (dotted eighth)
    d = int(BEAT * 0.75 * SR)
    L = mix.copy()
    R = mix * 0.6
    echo = mix.copy()
    for k in range(1, 5):
        echo = np.concatenate([np.zeros(d), echo[:-d]]) * 0.42
        if k % 2:
            R += echo
        else:
            L += echo
    return L, R


def kick(n=None):
    n = n or int(0.4 * SR)
    t = np.arange(n) / SR
    f = 45 + 110 * np.exp(-t / 0.035)
    phase = 2 * np.pi * np.cumsum(f) / SR
    body = np.sin(phase) * np.exp(-t / 0.28)
    click = fft_filter(noise(n), lo=2000) * np.exp(-t / 0.004) * 0.3
    return body + click


def snare(n=None):
    n = n or int(0.3 * SR)
    t = np.arange(n) / SR
    nz = fft_filter(noise(n), lo=1200, hi=9000) * np.exp(-t / 0.12)
    tone = np.sin(2 * np.pi * 190 * t) * np.exp(-t / 0.06)
    return nz * 0.8 + tone * 0.5


def hat(open_=False):
    n = int((0.25 if open_ else 0.05) * SR)
    t = np.arange(n) / SR
    return fft_filter(noise(n), lo=7000) * np.exp(-t / (0.09 if open_ else 0.015))


def drums():
    out = np.zeros(N)
    duck = np.ones(N)
    K, S, H, HO = kick(), snare(), hat(), hat(True)
    t = 8.0
    beat = 0
    while t < 44.0:
        radio = 28 <= t < 32
        add(out, K, t, 0.55 if radio else 0.9)
        # sidechain ducking envelope
        i = at(t)
        n = int(0.22 * SR)
        j = min(N, i + n)
        duck[i:j] = np.minimum(duck[i:j], 1 - 0.55 * np.exp(-np.arange(j - i) / SR / 0.07))
        if beat % 2 == 1 and not radio:
            add(out, S, t, 0.5)
        if not radio:
            add(out, H, t + BEAT / 2, 0.22)
            add(out, H, t + BEAT / 4, 0.1)
            add(out, H, t + 3 * BEAT / 4, 0.1)
            if beat % 4 == 3:
                add(out, HO, t + BEAT / 2, 0.15)
        t += BEAT
        beat += 1
    # snare roll into the drop (7 → 8 s)
    for k in range(16):
        tt = 7.0 + k / 16
        add(out, S, tt, 0.12 + 0.3 * k / 16)
    return out, duck


# ── FX ──────────────────────────────────────────────────────────────────────
def impact():
    n = int(2.0 * SR)
    t = np.arange(n) / SR
    boom = np.sin(2 * np.pi * (38 + 40 * np.exp(-t / 0.08)) * t) * np.exp(-t / 0.7)
    crash = fft_filter(noise(n), lo=3000) * np.exp(-t / 0.5) * 0.35
    return boom + crash


def riser(seconds):
    n = int(seconds * SR)
    t = np.arange(n) / SR
    x = t / seconds
    nz = fft_filter(noise(n), lo=800) * x ** 2
    f = 220 + 900 * x ** 2
    tone = np.sin(2 * np.pi * np.cumsum(f) / SR) * x ** 3 * 0.25
    return (nz * 0.35 + tone)


def whoosh():
    n = int(0.55 * SR)
    t = np.arange(n) / SR
    bell = np.sin(np.pi * np.clip(t / 0.55, 0, 1)) ** 2
    return fft_filter(noise(n), lo=500, hi=6000) * bell


def tab_clunk():
    """Port of the site's tabSwitch(): solenoid thud + click + metallic ring."""
    n = int(0.12 * SR)
    t = np.arange(n) / SR
    thud = fft_filter(noise(n), hi=400) * np.exp(-t / 0.012) * 1.6
    click = fft_filter(noise(n), lo=2000, hi=6000) * np.exp(-t / 0.003) * 0.6
    ring = np.sin(2 * np.pi * 1200 * t) * np.exp(-t / 0.02) * 0.2 + np.sin(2 * np.pi * 800 * t) * np.exp(-t / 0.015) * 0.15
    return thud + click + ring


def tick():
    n = int(0.006 * SR)
    f = 1500 + rng.uniform(0, 800)
    return square(f, n) * np.exp(-np.arange(n) / SR / 0.002) * 0.5


def boot_hum():
    n = int(2.6 * SR)
    t = np.arange(n) / SR
    env = np.clip(t / 0.3, 0, 1) * np.clip((2.6 - t) / 1.0, 0, 1)
    hum = np.sin(2 * np.pi * 60 * t) * 0.6 + np.sin(2 * np.pi * 120 * t) * 0.3
    whine_f = 2000 * (15000 / 2000) ** np.clip((t - 0.1) / 0.7, 0, 1)
    whine = np.sin(2 * np.pi * np.cumsum(whine_f) / SR) * np.exp(-np.maximum(t - 0.2, 0) / 0.25) * 0.05
    crackle = fft_filter(noise(n), lo=1500, hi=5000) * np.exp(-t / 0.3) * 0.3
    return (hum * env + whine + crackle)


def confirm_beep():
    n = int(0.16 * SR)
    t = np.arange(n) / SR
    f = np.where(t < 0.06, 880, 1100)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.where(t < 0.1, 1, np.exp(-(t - 0.1) / 0.02)) * 0.5


def power_down():
    n = int(0.7 * SR)
    t = np.arange(n) / SR
    f = 800 * (40 / 800) ** np.clip(t / 0.5, 0, 1)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.25) * 0.6


MORSE = {'J': '.---', 'P': '.--.', 'S': '...', 'R': '.-.'}
MORSE_UNIT = 0.08
MORSE_START = 28.3


def morse_track():
    out = np.zeros(N)
    t = MORSE_START
    for ch in 'JPSR':
        code = MORSE[ch]
        for k, sym in enumerate(code):
            length = (1 if sym == '.' else 3) * MORSE_UNIT
            n = int(length * SR)
            env = np.ones(n)
            r = int(0.005 * SR)
            env[:r] = np.linspace(0, 1, r)
            env[-r:] = np.linspace(1, 0, r)
            add(out, sine(640, n) * env, t, 0.35)
            t += length + (MORSE_UNIT if k < len(code) - 1 else 0)
        t += 3 * MORSE_UNIT
    # static bed
    s, e = 28.0, 32.0
    n = int((e - s) * SR)
    bed = fft_filter(noise(n), lo=1200, hi=3000) * 0.05
    bed *= np.clip(np.arange(n) / (0.2 * SR), 0, 1) * np.clip((n - np.arange(n)) / (0.3 * SR), 0, 1)
    add(out, bed, s)
    return out


def main(path):
    padL, padR = pad_track()
    arpL, arpR = arp_track()
    bass = bass_track()
    drm, duck = drums()

    # pad: fades in during the intro, swells at the end
    pad_env = np.clip(t_all / 3.0, 0, 1) * np.clip((48.0 - t_all) / 1.2, 0, 1)
    pad_env = np.where(t_all >= 44, pad_env * 1.35, pad_env)
    padL *= pad_env * duck ** 0.7
    padR *= pad_env * duck ** 0.7
    bass *= duck

    fx = np.zeros(N)
    add(fx, boot_hum(), 0.0, 0.5)
    for k in range(70):  # typewriter ticks while the boot text types
        add(fx, tick(), 0.55 + k * 0.034, 0.5)
    add(fx, fft_filter(noise(int(0.25 * SR)), lo=2000) * np.exp(-np.arange(int(0.25 * SR)) / SR / 0.05), 3.0, 0.35)  # glitch
    add(fx, riser(2.0), 6.0, 0.6)
    add(fx, impact(), 8.0, 0.8)
    for s in [12, 16, 20, 24, 28, 32, 36, 40]:
        add(fx, whoosh(), s - 0.3, 0.25)
        add(fx, tab_clunk(), s, 0.7)
    for k in range(8):  # theme flashes on each beat
        add(fx, tab_clunk(), 32.0 + k * BEAT, 0.35)
    for k in range(40):  # terminal typing
        add(fx, tick(), 36.4 + k * 0.045, 0.4)
    add(fx, impact(), 44.0, 0.7)
    add(fx, confirm_beep(), 45.0, 0.4)
    add(fx, power_down(), 47.25, 0.6)
    fx += morse_track()

    rev_pad = reverb(padL + padR, 1.6, 0.35)
    L = rev_pad * 0.5 + padL * 0.5 + arpL + bass * 0.9 + drm + fx
    R = rev_pad * 0.5 + padR * 0.5 + arpR + bass * 0.9 + drm + fx
    L = reverb(L, 0.8, 0.12)
    R = reverb(R, 0.8, 0.12)

    stereo = np.stack([L, R], axis=1)
    stereo = np.tanh(stereo * 1.4) / np.tanh(1.4)  # soft clip / glue
    stereo /= np.max(np.abs(stereo)) / 0.89  # ~ -1 dBFS peak
    fade = np.clip((DUR - t_all) / 0.15, 0, 1)[:, None]
    stereo *= fade
    pcm = (stereo * 32767).astype('<i2')
    with wave.open(path, 'wb') as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())
    print('wrote', path)


if __name__ == '__main__':
    main(sys.argv[1] if len(sys.argv) > 1 else str(Path(__file__).parent / 'comp' / 'soundtrack.wav'))
