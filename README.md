# Pip-Boy 3000 Mk IV · Juan Pablo Sánchez Rey

Portafolio y hoja de vida interactiva con la interfaz del Pip-Boy de **Fallout 4**
(con guiños a Fallout 3 y New Vegas). Desarrollador Full Stack · Java · Spring Boot · Angular · TypeScript.

![Vista previa](public/og-image.png)

## Qué hay dentro

| Pestaña | Contenido |
| --- | --- |
| **STAT** | *Estado* (ficha, perfil, CTA para descargar el CV), *S.P.E.C.I.A.L.* (cada atributo mapeado a una habilidad real) y *Perks* |
| **INV** | Stack técnico como inventario: *Armas* (lenguajes/frameworks), *Ropa* (testing y calidad), *Ayuda* (metodologías), *Varios* (cloud/DevOps/IDEs), *Holo* (terminal, minijuego, CV) y *Munición* (bases de datos y mensajería) |
| **DATA** | *Misiones* (experiencia laboral y formación con objetivos y logros), *Talleres* (proyectos) y *Estadísticas* |
| **MAP** | Mapa local (Santander) y del mundo (Colombia) con datos geográficos reales, contacto y hora local |
| **RADIO** | Galaxy News Radio, Diamond City Radio y una *Señal de socorro* en código Morse generada en tiempo real |

Extras:

- Pantalla de encendido + arranque real de **PIP-OS V7.1.0.8** (se salta con cualquier tecla; solo aparece una vez por sesión).
- **Terminal RobCo** (tecla `~` / `º` o el botón `>_`) con comandos: `ayuda`, `experiencia`, `skills`, `contacto`, `cv`, `tema nv`, `idioma en`, `radio`, `hack`…
- **Minijuego de hackeo** de terminales, con recompensa.
- **CV imprimible / PDF** generado desde los mismos datos (botón *Descargar CV* → "Guardar como PDF").
- **Bilingüe** (ES / EN, detecta el idioma del navegador).
- **Colores de pantalla**: Fallout 4, Fallout 3, New Vegas (ámbar), Vault-Tec (azul) y Mk VI (blanco).
- Efectos CRT, sonidos sintetizados con Web Audio (se pueden apagar en ⚙), `prefers-reduced-motion` respetado.
- Totalmente navegable con teclado y usable en móvil.
- SEO: JSON-LD (`schema.org/Person`), Open Graph, y el CV completo en `<noscript>` para buscadores.

### Controles

| Tecla | Acción |
| --- | --- |
| `Q` / `E` · `1`–`5` | Cambiar pestaña |
| `A` / `D` · `←` / `→` | Cambiar sub-pestaña |
| `W` / `S` · `↑` / `↓` | Moverse en la lista |
| `Enter` | Usar holocinta / sintonizar estación |
| `~` · `º` | Abrir terminal · `Esc` cierra |

## Editar el contenido

Todo el contenido vive en **`src/data/`**:

- `profile.es.ts` y `profile.en.ts`: perfil, SPECIAL, perks, inventario, misiones, proyectos, radio…
  Ambos cumplen la interfaz de `types.ts`, así que TypeScript avisa si una traducción queda incompleta.
- `shared.ts`: correo, LinkedIn, GitHub y pistas de radio (comunes a ambos idiomas).
- Los textos de la interfaz están en `src/i18n/ui.ts`.

El nivel del Pip-Boy se calcula solo a partir de `careerStart` (sube con el tiempo).

## Animaciones de Vault Boy

Las animaciones están en `src/assets/vaultboy/` como PNG animados **blancos sobre transparente**;
el sitio los colorea con el color de pantalla activo. Se cargan por nombre, y si falta alguno se usa uno por defecto:

| Archivo | Dónde aparece |
| --- | --- |
| `boot.png` | Splash de arranque |
| `status.png` | STAT › Estado |
| `special-s.png` … `special-l.png` | STAT › S.P.E.C.I.A.L. (uno por letra) |
| `perk-<id>.png` | STAT › Perks (ids en `profile.es.ts`) |
| `stats.png` | DATA › Estadísticas |
| `map.png` | MAP |

### Usar las animaciones originales de Fallout 4

Las animaciones originales del Pip-Boy son propiedad de Bethesda y vienen dentro de los archivos del juego,
así que no se incluyen aquí. Si tienes el juego puedes extraerlas tú mismo:

1. Abre `Fallout 4/Data/Fallout4 - Interface.ba2` con **BAE** (Bethesda Archive Extractor) o **Archive2** (Creation Kit) y extrae la carpeta `Interface/`.
2. Abre con **JPEXS Free Flash Decompiler** los `.swf` de la carpeta `Interface/` que contienen las animaciones de Vault Boy (el menú del Pip-Boy es `PipboyMenu.swf`; las ilustraciones de SPECIAL y perks están en sus propios `.swf`).
3. Exporta el sprite/clip de la animación que quieras como **PNG (secuencia de frames)** o **GIF**, con fondo transparente.
4. Conviértelo al formato del sitio:

   ```bash
   pip install pillow numpy
   python3 scripts/vaultboy_import.py ruta/a/los_frames special-s
   python3 scripts/vaultboy_import.py ruta/a/animacion.gif status
   ```

   El script detecta el tipo de fondo (`--mode alpha|dark|chroma` para forzarlo), recorta, escala y guarda en `src/assets/vaultboy/`.

## Desarrollo

```bash
npm install
npm run dev       # http://localhost:5173
npm run lint
npm run build     # genera dist/
npm run preview
```

### Despliegue

El build usa rutas relativas (`base: './'`), así que `dist/` funciona en la raíz de un dominio o en un subdirectorio
(GitHub Pages, Netlify, Vercel, Cloudflare Pages…).

Para que las vistas previas al compartir el enlace usen URLs absolutas, define la URL pública antes de compilar:

```bash
cp .env.example .env   # y edita VITE_SITE_URL
```

La imagen de vista previa es `public/og-image.png` (1200×630).

## Stack

React 19 · TypeScript · Vite · Framer Motion · d3-geo · Web Audio API · lucide-react.

---

*Fallout, Pip-Boy, Vault Boy, Vault-Tec y RobCo son marcas de Bethesda Softworks / ZeniMax Media.
Este es un proyecto personal, sin fines comerciales, hecho por un fan.*
