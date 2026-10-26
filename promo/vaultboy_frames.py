#!/usr/bin/env python3
"""Splits the site's Vault Boy APNGs into green-tinted frames for the promo (promo/comp/vb/).
Usage: python3 promo/vaultboy_frames.py   (needs pillow)"""
from pathlib import Path

from PIL import Image, ImageSequence

ROOT = Path(__file__).resolve().parent
SRC = ROOT.parent / 'src' / 'assets' / 'vaultboy'
OUT = ROOT / 'comp' / 'vb'
OUT.mkdir(parents=True, exist_ok=True)

for name in ['thumbs-up', 'walk']:
    for k, frame in enumerate(ImageSequence.Iterator(Image.open(SRC / f'{name}.png'))):
        alpha = frame.convert('RGBA').split()[3]
        green = Image.new('RGBA', frame.size, (20, 248, 20, 255))
        green.putalpha(alpha)
        green.save(OUT / f'{name}-{k:02d}.png')
    print('frames written for', name)
