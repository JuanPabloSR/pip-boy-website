#!/usr/bin/env python3
"""
Convert a Vault Boy animation into the format the Pip-Boy site expects:
a white-on-transparent animated PNG, cropped and scaled, which the site then
tints with the active screen color.

Usage:
    python3 scripts/vaultboy_import.py <input> <slot> [--mode auto|alpha|dark|chroma] [--height 360]

<input>  a GIF / APNG / WebP file, or a folder of PNG frames (sorted by name),
         e.g. the frames JPEXS FFDec exports from Fallout 4's interface SWFs.
<slot>   output name. The site looks for these (see README):
         boot, status, special-s, special-p, special-e, special-c, special-i,
         special-a, special-l, perk-<id>, stats, map
         Anything missing falls back to the default animations.

Modes (auto picks one):
    alpha   frames already have a transparent background (game exports):
            brightness × alpha becomes the shape, so dark outlines stay dark.
    dark    bright figure on a dark/black background.
    chroma  saturated green figure on a muted background (fan-made GIFs).

Requires: pip install pillow numpy
"""
import argparse
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageSequence

OUT_DIR = Path(__file__).resolve().parent.parent / 'src' / 'assets' / 'vaultboy'


def load_frames(src: Path):
    if src.is_dir():
        files = sorted(p for p in src.iterdir() if p.suffix.lower() in {'.png', '.gif', '.webp'})
        if not files:
            sys.exit(f'No frames found in {src}')
        return [np.asarray(Image.open(f).convert('RGBA'), dtype=np.float32) for f in files], [1000 // 24] * len(files)
    im = Image.open(src)
    frames, durations = [], []
    for frame in ImageSequence.Iterator(im):
        frames.append(np.asarray(frame.convert('RGBA'), dtype=np.float32))
        durations.append(frame.info.get('duration', 100) or 100)
    return frames, durations


def smooth(x, a, b):
    t = np.clip((x - a) / (b - a), 0, 1)
    return t * t * (3 - 2 * t)


def luminance(f):
    return 0.2126 * f[..., 0] + 0.7152 * f[..., 1] + 0.0722 * f[..., 2]


def key_alpha(f):
    return (f[..., 3] / 255) * smooth(luminance(f), 40, 200)


def key_dark(f):
    return smooth(luminance(f), 25, 140)


def key_chroma(f):
    r, g, b = f[..., 0], f[..., 1], f[..., 2]
    return smooth(g - np.maximum(r, b), 110, 170) * smooth(g, 150, 200)


def detect_mode(frames):
    a = frames[0][..., 3]
    if (a < 250).mean() > 0.2:
        return 'alpha'
    f = frames[0]
    border = np.concatenate([f[0], f[-1], f[:, 0], f[:, -1]])
    if luminance(border).mean() < 40:
        return 'dark'
    return 'chroma'


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('input', type=Path)
    ap.add_argument('slot')
    ap.add_argument('--mode', default='auto', choices=['auto', 'alpha', 'dark', 'chroma'])
    ap.add_argument('--height', type=int, default=360, help='max output height in px (default 360)')
    args = ap.parse_args()

    frames, durations = load_frames(args.input)
    mode = detect_mode(frames) if args.mode == 'auto' else args.mode
    key = {'alpha': key_alpha, 'dark': key_dark, 'chroma': key_chroma}[mode]
    alphas = [key(f) for f in frames]

    union = np.maximum.reduce([a > 0.3 for a in alphas])
    if not union.any():
        sys.exit(f'Nothing detected with mode "{mode}". Try another --mode.')
    ys, xs = np.where(union)
    pad = 6
    y0, y1 = max(ys.min() - pad, 0), min(ys.max() + pad, union.shape[0])
    x0, x1 = max(xs.min() - pad, 0), min(xs.max() + pad, union.shape[1])

    out = []
    for a in alphas:
        a = a[y0:y1, x0:x1]
        h, w = a.shape
        rgba = np.zeros((h, w, 4), np.uint8)
        rgba[..., :3] = 255
        rgba[..., 3] = (a * 255).astype(np.uint8)
        im = Image.fromarray(rgba, 'RGBA')
        if h > args.height:
            im = im.resize((round(w * args.height / h), args.height), Image.LANCZOS)
        out.append(im)

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    dest = OUT_DIR / f'{args.slot}.png'
    out[0].save(dest, save_all=True, append_images=out[1:], duration=durations, loop=0, disposal=1, blend=0, optimize=True)
    print(f'{dest.relative_to(OUT_DIR.parent.parent.parent)}  ({len(out)} frames, mode={mode}, {out[0].width}x{out[0].height})')


if __name__ == '__main__':
    main()
