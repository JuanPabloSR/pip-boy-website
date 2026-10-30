# Video promocional (motion graphics)

Video de ~48 s para redes que recorre el Pip-Boy: arranque PIP-OS, título cinético, cada pestaña
con callouts, temas de color, versión móvil y cierre con Vault Boy. La banda sonora (synth a 120 BPM
+ efectos del Pip-Boy + baliza Morse) se sintetiza por código, así que no tiene problemas de copyright.

Hay tres formatos con la misma música y los mismos tiempos:

| Formato | Para | Composición |
| --- | --- | --- |
| `16x9` (1920×1080) | YouTube, la web, presentaciones | `comp/index.html` |
| `4x5` (1080×1350) | Feed de LinkedIn (ocupa casi toda la pantalla del celular) | `comp/vertical.html?fmt=4x5` |
| `9x16` (1080×1920) | Instagram Reels, TikTok, YouTube Shorts | `comp/vertical.html?fmt=9x16` |

En 9:16 todo lo importante queda dentro de la zona segura de Reels (sin tapar con el encabezado,
el texto de la publicación ni los botones laterales). Su portada también cabe completa en el recorte
3:4 que hace Instagram en la cuadrícula del perfil.

Las composiciones son líneas de tiempo deterministas sobre un motor común (`comp/engine.js`,
`comp/style.css`): `render.cjs` las avanza cuadro a cuadro con Playwright y manda los cuadros a ffmpeg.

## Archivos finales

Los videos ya renderizados (48 s, cierre con `juanpablosanchezdev.com`) y sus portadas están en
[`media/`](media/) (cada archivo pesa menos de 100 MB, el límite de GitHub por archivo):

| Archivo | Formato | Para |
| --- | --- | --- |
| `media/videos/pipboy-promo-4x5.mp4` | 1080×1350 | Feed de LinkedIn (portada: `media/covers/cover-4x5.png`) |
| `media/videos/pipboy-promo-9x16.mp4` | 1080×1920 | Instagram Reels (portada: `media/covers/cover-9x16.png`) |
| `media/videos/pipboy-promo.mp4` | 1920×1080 | YouTube, la web, presentaciones |

En GitHub se descargan con el botón *Download raw file* de cada archivo.

`media/render-assets.zip` trae las capturas, clips, cuadros de Vault Boy y la banda sonora con que se
renderizaron estos videos. Descomprimido en `comp/`, permite volver a renderizar exactamente lo mismo
(por ejemplo con otra URL) sin repetir las capturas:

```bash
cd promo/comp && unzip ../media/render-assets.zip && cd ../..
node promo/render.cjs --format=4x5 --site=otro-dominio.com
```

## Regenerarlo

Requisitos: Node + Playwright (`npm i -D playwright && npx playwright install chromium`),
Python 3 con `numpy` y `pillow`, y ffmpeg.

```bash
npm run dev                          # en otra terminal, el sitio en http://localhost:5173
node promo/capture.cjs               # capturas y clips → promo/comp/{shots,clips}
python3 promo/vaultboy_frames.py     # cuadros de Vault Boy → promo/comp/vb
python3 promo/soundtrack.py          # banda sonora → promo/comp/soundtrack.wav
node promo/render.cjs                # 16:9 → promo/out/pipboy-promo.mp4 (≈ 8 min)
node promo/render.cjs --format=4x5   # → promo/out/pipboy-promo-4x5.mp4
node promo/render.cjs --format=9x16  # → promo/out/pipboy-promo-9x16.mp4
node promo/render.cjs --format=4x5 --cover    # portada → promo/out/cover-4x5.png
node promo/render.cjs --format=9x16 --cover   # portada → promo/out/cover-9x16.png
```

- La URL del cierre es `juanpablosanchezdev.com`; para cambiarla: `--site=otro-dominio.com`
- Revisar cuadros sueltos sin renderizar todo: `node promo/render.cjs --format=9x16 --preview=8.5,16,30,45`
