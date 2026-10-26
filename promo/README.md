# Video promocional (motion graphics)

Video de ~48 s para redes que recorre el Pip-Boy: arranque PIP-OS, título cinético, cada pestaña
con callouts, temas de color, versión móvil y cierre con Vault Boy. La banda sonora (synth a 120 BPM
+ efectos del Pip-Boy + baliza Morse) se sintetiza por código, así que no tiene problemas de copyright.

La composición (`comp/index.html`) es una línea de tiempo determinista: `render.cjs` la avanza cuadro
a cuadro con Playwright y manda los cuadros a ffmpeg.

## Regenerarlo

Requisitos: Node + Playwright (`npm i -D playwright && npx playwright install chromium`),
Python 3 con `numpy` y `pillow`, y ffmpeg.

```bash
npm run dev                          # en otra terminal, el sitio en http://localhost:5173
node promo/capture.cjs               # capturas y clips → promo/comp/{shots,clips}
python3 promo/vaultboy_frames.py     # cuadros de Vault Boy → promo/comp/vb
python3 promo/soundtrack.py          # banda sonora → promo/comp/soundtrack.wav
node promo/render.cjs                # → promo/out/pipboy-promo.mp4 (≈ 8 min)
```

- Cambiar la URL que aparece al final: `node promo/render.cjs --site=juanpablosanchez.dev`
- Revisar cuadros sueltos sin renderizar todo: `node promo/render.cjs --preview=8.5,16,30,45`
