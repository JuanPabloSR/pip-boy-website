---
name: promo-video
description: Make a short motion-graphics promo video (40–50 s) of a website or app for LinkedIn, Instagram Reels and YouTube, rendered from real captures of the site with an original code-generated soundtrack, in 16:9, 4:5 and 9:16, plus covers and post copy. Use when asked for a promo, launch or showcase video of a site/app, or vertical versions of one.
---

# Video promocional en motion graphics

Haz un video promocional de **40–50 s** de un sitio o app. Debe recorrer sus secciones con motion
graphics, música original y un cierre con nombre y URL. Entrégalo en tres formatos con portadas y
textos para publicar.

## Qué pedir o confirmar antes de empezar
- La URL o el repo del sitio, y qué secciones mostrar, en orden.
- El nombre, el cargo y la **URL final** del cierre (por ejemplo, un dominio propio aunque aún no esté
  conectado).
- El idioma de los textos en pantalla y del post.
- Las redes donde se va a publicar. Por defecto: LinkedIn (4:5), Instagram Reels (9:16) y YouTube o
  web (16:9).
- El estilo visual: tomarlo del propio sitio (colores, tipografías, iconografía).

## Guion (48 s, compases de 2 s a 120 BPM)

| s | Escena |
| --- | --- |
| 0–3 | Encendido o intro con la identidad del sitio (p. ej. un arranque de terminal) |
| 3–8 | Título gancho («Hice mi web personal… y es un ___») |
| 8 | *Drop*: entra la pantalla del sitio con un movimiento 3D |
| 8–44 | Una sección cada 4 s: rótulo «0N · SECCIÓN», título corto, 1 o 2 *lower thirds* con datos concretos y cámara que hace zoom a la zona relevante |
| 40–44 | Versión móvil (3 teléfonos) y rasgos: responsive, bilingüe, accesible |
| 44–48 | Cierre: personaje o logo, nombre, cargo, stack, URL en una pastilla y una pregunta para comentarios; apagado |

Mantén una barra de capítulos (con un personaje que camina) que marque el avance. En los cambios de
escena usa destellos y glitches cortos.

## Proceso

1. **Capturar el sitio real**, sin usar mockups.
   - Usa Playwright para las capturas: escritorio a DPR 2, temas a DPR 1 y móvil a DPR 3.
   - Graba clips en vivo de las interacciones con el screencast de CDP.
   - Sáltate pantallas de carga o de intro con localStorage o sessionStorage.
2. **Banda sonora original sintetizada por código**, con numpy y sin samples, para evitar problemas de
   derechos y que las redes no silencien el video:
   - synth retro a 120 BPM, con *drop* en 8 s;
   - un golpe en cada cambio de escena;
   - efectos temáticos sincronizados (p. ej. código Morse en la escena de radio);
   - cierre con acorde y apagado.
   - Normaliza a −14 LUFS (loudnorm).
3. **Composición HTML determinista.**
   - Una línea de tiempo de keyframes. Los valores no animados se mantienen: semántica *fill-forward*,
     para que nada «derive».
   - Un motor compartido (`engine.js`) para todos los formatos.
   - Una función `renderFrame(t)` que dibuja el instante exacto. Nada de `requestAnimationFrame` ni
     del reloj real.
   - La URL del cierre se recibe como parámetro (`?site=`), para cambiarla sin tocar el código.
4. **Render.**
   - Playwright abre la composición en un servidor local.
   - Por cada cuadro, a 30 fps, llama a `renderFrame(t)` y toma la captura en JPEG.
   - Pasa los cuadros por *pipe* a ffmpeg junto con el audio: `libx264 -crf 21 -tune film -preset
     slow`, `hqdn3d` para que el grano no infle el peso, AAC a 192k, `+faststart`.
   - Agrega un modo `--preview=t1,t2` que saque cuadros sueltos, para revisar sin renderizar todo.
5. **Formatos.**
   - 16:9 (1920×1080) para YouTube y web.
   - 4:5 (1080×1350) para el **feed de LinkedIn**.
   - 9:16 (1080×1920) para **Reels**, TikTok y Shorts.
   - En 9:16 deja libres las zonas que tapa la app: arriba unos 250 px, abajo un 35 % y la columna de
     botones a la derecha.
   - En vertical, usa más las capturas móviles y recorta la de escritorio como una ventana alta.
6. **Portadas** (`--cover`): el cierre sin la pregunta final, con una frase gancho, centrado. La del
   Reel debe caber en el recorte 3:4 de la cuadrícula de Instagram.
7. **Textos para publicar:**
   - post de LinkedIn con emojis por sección, el stack y una pregunta;
   - el link en el **primer comentario**;
   - variante corta y versión en inglés;
   - texto para Instagram con hashtags y la indicación de «link en la bio».

## Verificación obligatoria antes de entregar
- Revisa cuadros del video **ya codificado**, no solo los previews.
- Revisa en cada escena:
  - texto cortado;
  - títulos de dos líneas que tapen la ventana (mide en el navegador con `getBoundingClientRect`);
  - barras de selección asomando en los recortes;
  - elementos que se solapen en el cierre.
- Comprueba con `ffprobe` la resolución y la duración, y el volumen con `ebur128` (≈ −14 LUFS).
- Valida la sincronía de los efectos con el audio usando espectrograma y forma de onda, porque el
  asistente no puede escuchar.
- Pide al usuario que **escuche el video antes de publicar**.
- Peso orientativo: unos 70–90 MB por formato a 48 s. Si no se puede usar Git LFS, cada archivo debe
  quedar por debajo de 100 MB para poder subirlo a GitHub.

## Recomendaciones que acompañan la entrega
- **LinkedIn:** el 4:5, no el horizontal (en el feed móvil, el 16:9 es una franja pequeña). Súbelo como
  video nativo, con la portada, y el link en el primer comentario. Buen horario: martes a jueves,
  temprano o al mediodía.
- **Reels:** el 9:16 con su portada y el link en la bio, sin agregar música de la biblioteca.
- **Horizontal:** para YouTube, la web o presentaciones.
- Si el video muestra un dominio nuevo, publícalo cuando el dominio ya responda.

## Referencia
La implementación completa de este método está en `promo/` de este repositorio: `capture.cjs`,
`soundtrack.py`, `vaultboy_frames.py`, `render.cjs`, `comp/engine.js`, `comp/index.html`,
`comp/vertical.html`, `linkedin-post.md` y `README.md`.
