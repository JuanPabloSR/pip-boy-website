# Resumen del proyecto: sitio personal Pip-Boy

Notas de trabajo de la sesión de desarrollo del 26 al 30 de octubre de 2026. Recogen todo lo hablado y
hecho: datos, decisiones, recomendaciones, conclusiones y pendientes. Viven en el repositorio para no
perderlas al cambiar de cuenta.

> **El repositorio es público.** Este archivo no incluye datos personales ni laborales sensibles: ni
> condiciones económicas, ni procesos en curso, ni nombres de terceros, ni teléfono. Si no quieres que
> quede en `main`, bórralo antes de fusionar la rama.

---

## 0. Para retomar rápido

| Qué | Dónde |
| --- | --- |
| Sitio en vivo | https://juanpablosr.github.io/pip-boy-website/ |
| Repositorio | https://github.com/JuanPabloSR/pip-boy-website (público) |
| Rama con todo el trabajo | `claude/tender-fermi-9p2pw3`. `main` sigue con la versión original. |
| Lo publicado | rama `gh-pages`, último despliegue `f105c9b`, que corresponde al código `590f5f2` |
| Dominio elegido | `juanpablosanchezdev.com`: falta comprarlo y conectarlo |
| Videos y portadas | `promo/media/videos/` y `promo/media/covers/` |
| Textos para LinkedIn e Instagram | `promo/linkedin-post.md` |
| Skill para hacer videos así | `.claude/skills/promo-video/SKILL.md` |

**Lo más urgente:**
1. Probar las seis emisoras de radio en el sitio real (sección 7).
2. Comprar el dominio y conectarlo (sección 4).
3. Escuchar los videos y publicarlos (secciones 5 y 6).
4. Abrir el PR a `main` con *squash and merge* (sección 3).

---

## 1. Punto de partida y objetivo

**Lo que pediste.** Convertir este repositorio en tu página personal principal. Más que un portafolio,
un registro tuyo en línea, conservando el diseño de Pip-Boy:
- Fallout 4 como referencia principal, con mezcla de Fallout 3 y New Vegas.
- Tu hoja de vida integrada, a partir del perfil en Markdown y de tu LinkedIn.
- Permiso explícito para usar agentes que revisaran y corrigieran el trabajo. La meta era «algo mucho
  mejor de lo que ya está».

**Estado inicial del repositorio.**
- React con Tailwind.
- GIFs de Vault Boy con fondos de colores.
- `tsc` fallaba y ESLint daba 8 errores.
- La radio tenía 3 canciones de archive.org.

**Decisiones de partida.**
- **Privacidad.** El perfil que compartiste traía información personal: condiciones económicas,
  procesos en curso, nombres de personas y teléfono. Decidiste que **nada de eso va en la web**: solo
  perfil profesional, trayectoria, experiencia y conocimientos.
  - Se buscó en el código y no quedó ninguno de esos datos.
  - El cliente bancario actual aparece solo como **«entidad financiera»**, por acuerdos de
    confidencialidad (NDA).
- **Animaciones originales de Fallout 4.** Querías las del juego, pero son propiedad de Bethesda y
  vienen dentro de sus archivos, así que no se incluyen en el repositorio. Quedó un script para
  importarlas si las extraes tú: `scripts/vaultboy_import.py`, con los pasos en el README.
  - Mientras tanto se usan los GIFs que ya tenías, limpiados: fondo transparente y coloreados con el
    tema activo.
- **Documentación en primera persona**, como hecha por ti (README).

---

## 2. El sitio

### Stack
- React 19, TypeScript, Vite 8, Framer Motion, d3-geo, lucide-react y Web Audio API.
- Tailwind se reemplazó por CSS propio con variables, para los temas de color.

### Pestañas

| Pestaña | Contenido |
| --- | --- |
| **STAT** | *Estado*: ficha, perfil, indicadores y botones estilo FO4 `[C] DESCARGAR CV`, `[M] ESCRIBIRME`, `[L] LINKEDIN`, `[G] GITHUB`, más guía rápida. *S.P.E.C.I.A.L.*: cada atributo es una habilidad real. *Perks*. |
| **INV** | Stack técnico como inventario: armas (lenguajes y frameworks), ropa (testing), ayuda (metodologías), varios (cloud, DevOps, IDEs), holocintas (terminal, hackeo, CV) y munición (bases de datos y mensajería). |
| **DATA** | *Misiones* (experiencia y formación, con objetivos y logros), *Talleres* (proyectos) y *Estadísticas*. |
| **MAP** | Mapa local (Santander) y nacional (Colombia) con datos geográficos reales y hora local. |
| **RADIO** | Emisoras del juego del tema elegido y una *Señal de socorro* en Morse, generada en tiempo real (sección 7). |

### S.P.E.C.I.A.L.

| Atributo | Habilidad | Valor |
| --- | --- | --- |
| S Fuerza | Backend Java | 9 |
| P Percepción | Calidad y testing | 8 |
| E Resistencia | Cloud y DevOps | 7 |
| C Carisma | Comunicación | 8 |
| I Inteligencia | Arquitectura | 9 |
| A Agilidad | Frontend | 8 |
| L Suerte | IA y LLMs | 6 |

El café V60 es la «Nuka-Cola Quantum» del inventario.

### Contenido del CV integrado
Todo está en `src/data/profile.es.ts` y `src/data/profile.en.ts`.
- **Perfil:**
  - Juan Pablo Sánchez Rey, *Desarrollador Full Stack*: Java · Spring Boot · Angular · TypeScript.
  - Bucaramanga, Colombia (UTC-5).
  - Más de 4 años de experiencia. El nivel del Pip-Boy se calcula solo desde `careerStart: 2022-02`.
- **Experiencia:**
  - **Nexos Software**, de 09/2023 al presente, remoto (sede en Medellín). Analista de Desarrollo Full
    Stack.
    - Asignación actual: entidad financiera.
    - Antes: proyecto Carvajal Tecnología y Servicios (microservicios, microfrontends, pruebas,
      Azure/AWS), con sus logros.
  - **Sofka Technologies**, 02/2022 – 04/2023. Consultor Full Stack para clientes del sector
    financiero y asegurador.
- **Formación:**
  - Tecnólogo en Análisis y Desarrollo de Software (SENA), 09/2023 – 06/2026.
  - Bootcamp de IA, Talento Tech (MinTIC).
  - Sofka University, 11/2021 – 02/2022.
  - EF SET, 2023.
  - Udemy: Spring y Desarrollo Web, 2022.
- **Idiomas:** español nativo, inglés **B1** (EF SET).
- **Talleres:** este sitio, Plataforma distribuida Carvajal, Vera Villamizar Abogados (freelance),
  Proyecto Feco (Apache Camel) y Laboratorio de IA.

### Extras
- **Encendido:** pantalla de encendido y arranque de PIP-OS. Se salta con cualquier tecla o con
  «Saltar intro», y aparece una vez por sesión. Los buscadores y bots se lo saltan.
- **Terminal RobCo:** se abre con `~`/`º` o con el botón `>_`. Comandos: `ayuda`, `experiencia`,
  `skills`, `contacto`, `cv`, `imprimir`, `tema nv`, `idioma en`, `radio`, `hack`…
- **Hackeo:** minijuego de terminal en español, con alerta de bloqueo y recompensa.
- **CV en PDF real** de 2 páginas, en ES y EN (`public/cv/`), generado desde los mismos datos con
  `npm run cv:pdf`.
- **Bilingüe:** detecta el idioma del navegador. Hay un selector ES/EN en la cabecera y en la pantalla
  de encendido.
- **Cinco temas de color:** Fallout 4 (verde), Fallout 3, New Vegas (ámbar), Vault-Tec (azul) y Mk VI
  (blanco).
- **Efectos:** CRT y sonidos sintetizados, que se pueden apagar. Se respeta `prefers-reduced-motion`.
- **Accesibilidad:**
  - teclado completo y foco gestionado en los diálogos;
  - `inert` en el fondo cuando hay un diálogo abierto;
  - zonas táctiles grandes en móvil.
- **SEO y vistas previas:**
  - JSON-LD `Person` y Open Graph, con la imagen `public/og-image.png`;
  - el CV completo en `<noscript>`;
  - favicon con las iniciales JP.

### Controles

| Tecla | Acción |
| --- | --- |
| `Q` / `E` · `1`–`5` | Cambiar pestaña |
| `A` / `D` · `←` / `→` | Sub-pestaña |
| `W` / `S` · `↑` / `↓` | Moverse en la lista |
| `Enter` | Usar o sintonizar |
| `Espacio` | Encender o apagar la radio, en RADIO |
| `C` `M` `L` `G` | En Estado: CV, correo, LinkedIn, GitHub |
| `~` / `º` | Terminal |
| `Esc` | Abre el menú si no hay nada abierto; si hay algo abierto, lo cierra |

### Calidad y revisiones
- TypeScript, ESLint y el build de producción pasan limpios.
- **Agente revisor de código: 11 hallazgos, todos corregidos.**
  - Teclado:
    - el *skip link* cambiaba de pestaña;
    - Enter y Espacio le quitaban la acción a botones y links;
    - AltGr y `~` en teclado español;
    - repetición de teclas en el encendido;
    - el control de volumen se quedaba con las flechas.
  - Diálogos: no gestionaban el foco (ahora tienen `inert` y devuelven el foco al cerrar).
  - Radio: el falso «señal perdida» al cambiar de emisora.
  - Mapa: la semántica.
  - Otros:
    - `<noscript>`;
    - la detección de bots confundía el navegador interno de LinkedIn con un bot;
    - el osciloscopio consumía demasiado.
- **Agente de QA visual (8 tamaños de pantalla, ES y EN): hallazgos corregidos.**
  - CV y descarga:
    - el PDF del CV dejaba media página en blanco;
    - el botón «Descargar CV» no descargaba un archivo.
  - Teclado: Enter activaba el elemento equivocado después de un clic.
  - Pantallas pequeñas:
    - las de 720–768 px de alto recortaban la ficha;
    - las zonas táctiles en móvil eran pequeñas.
  - Mapa: etiquetas ilegibles.
  - Hackeo y radio:
    - el registro del hackeo salía en inglés;
    - la radio mostraba una canción mientras decía «señal perdida».
  - Otros:
    - el arranque era largo;
    - títulos y relojes;
    - la precarga de pestañas.
- **Pruebas propias:**
  - un «solucionador» automático del hackeo, que lo resuelve en 3 intentos;
  - revisión de capturas;
  - `npm run radio:check`: prueba de la radio y del `Esc` con respuestas simuladas de archive.org,
    29 comprobaciones en verde.

---

## 3. Publicación en GitHub Pages

**Cómo está hoy.**
- El sitio se publicó a mano en la rama `gh-pages`, que GitHub Pages sirve automáticamente.
- Para volver a publicar desde la rama de trabajo: `scripts/deploy-pages.sh`. Compila y sube `dist/` a
  `gh-pages`.
- Hay dos workflows:
  - `.github/workflows/deploy.yml` compila y publica en cada push a `main`;
  - `.github/workflows/ci.yml` corre lint y build en los PR.

**Recomendación.**
- Abrir un PR de `claude/tender-fermi-9p2pw3` a `main` y fusionarlo con **«Squash and merge»**.
- Así:
  - los commits quedan a tu nombre (hoy salen como coautoría de Claude);
  - cada cambio futuro en `main` se publica solo.
- Antes de fusionar, decide si quieres en `main`:
  - los videos (`promo/media/`, unos 290 MB);
  - este resumen.

  Si no, bórralos en el PR. Seguirán disponibles en la rama y en el historial del PR.

**Ojo.** `deploy.yml` arma la URL pública como `https://<usuario>.github.io/<repo>/`. Al conectar el
dominio hay que cambiar esa línea (sección 4).

---

## 4. Dominio

**Decisión.**
- Se consideraron `juansanchezdev` y `juanpablosanchezdev`; antes se había mencionado
  `juanpablosanchez.dev`.
- Elegiste **`juanpablosanchezdev.com`**: tu nombre completo, igual que en LinkedIn y en el CV.
- Los tres videos ya muestran esa URL en el cierre.

**Advertencia.** No conectes el sitio antes de que el DNS esté listo. Si se configura el dominio en
GitHub sin DNS, GitHub redirige el sitio a una dirección que no responde y la web se cae.

**Pasos, cuando compres el dominio:**
1. En el proveedor del dominio:
   - registros **A** de `@` hacia `185.199.108.153`, `185.199.109.153`, `185.199.110.153` y
     `185.199.111.153`;
   - **CNAME** de `www` → `juanpablosr.github.io`.
2. En el repositorio:
   1. Crear `public/CNAME` con `juanpablosanchezdev.com`.
   2. Cambiar `CONTACT.site` en `src/data/shared.ts` a `https://juanpablosanchezdev.com/`. De ahí salen
      el canonical, Open Graph, JSON-LD y los PDF.
   3. Cambiar `VITE_SITE_URL` en `deploy.yml`.
   4. Regenerar los PDF con `npm run dev` y `npm run cv:pdf`.
   5. Actualizar el link del README y publicar.
3. En GitHub → *Settings → Pages*:
   - poner el dominio personalizado;
   - activar **Enforce HTTPS** cuando aparezca disponible, que puede tardar un rato.
4. Actualizar el sitio web en tu perfil de LinkedIn.

---

## 5. Video promocional

**Pedido.** Un video en motion graphics de 40–50 s para LinkedIn que mostrara las secciones del sitio.
Después pediste versiones verticales para LinkedIn y para Instagram Reels, aprovechando lo ya hecho.

**Resultado.** Tres videos de **48 s**, H.264 + AAC, que cierran con `juanpablosanchezdev.com`:

| Archivo (`promo/media/videos/`) | Tamaño | Peso | Para |
| --- | --- | --- | --- |
| `pipboy-promo-4x5.mp4` | 1080×1350 | 70 MB | **Feed de LinkedIn** |
| `pipboy-promo-9x16.mp4` | 1080×1920 | 91 MB | **Instagram Reels**, TikTok, Shorts |
| `pipboy-promo.mp4` | 1920×1080 | 90 MB | YouTube, la web, presentaciones |

Portadas en `promo/media/covers/`:
- `cover-4x5.png` y `cover-9x16.png`;
- contenido: Vault Boy, «MI HOJA DE VIDA ES UN PIP-BOY», tu nombre, el cargo y la URL;
- la del Reel cabe completa en el recorte 3:4 de la cuadrícula del perfil.

**Guion:**

| Segundos | Escena |
| --- | --- |
| 0–3 | Encendido CRT y arranque del PIP-OS |
| 3–8 | Título «Hice mi web personal… es un PIP-BOY 3000 Mark IV» |
| 8 | *Drop*: entra la pantalla del sitio en 3D |
| 8–12 | 01 STAT · «Mi ficha de morador» (CV en PDF a un clic) |
| 12–16 | 02 S.P.E.C.I.A.L. · «Cada atributo es una habilidad real» |
| 16–20 | 03 INV · «Mi stack como inventario» |
| 20–24 | 04 DATA · «Mi experiencia como misiones» (Nexos · Sofka · SENA) |
| 24–28 | 05 MAP · «Desde Bucaramanga, Colombia» |
| 28–32 | 06 RADIO · «Radio del Yermo» (Morse «JPSR» sincronizada con el audio) |
| 32–36 | 07 TEMAS · «5 colores de la saga» |
| 36–40 | 08 TERMINAL · «Terminal RobCo + hackeo» |
| 40–44 | 09 MÓVIL · «Responsive · bilingüe · accesible» |
| 44–48 | Cierre: Vault Boy, tu nombre, cargo, URL y «¿Qué sección te gustó más?»; apagado CRT |

En todo el video, una barra de capítulos con un Vault Boy caminando marca el avance.

**Música.**
- Banda sonora original, sintetizada por código: synth retro a 120 BPM y efectos de Pip-Boy, en
  `promo/soundtrack.py`.
- Al no usar canciones, no tiene problemas de derechos de autor.
- Normalizada a −14 LUFS, el estándar de redes; medida a −13,3 LUFS.

**Cómo se hizo.**
- Composiciones HTML deterministas: `promo/comp/index.html` para 16:9 y `vertical.html` para 4:5 y
  9:16, sobre un motor compartido (`engine.js`).
- Se usaron capturas y clips reales del sitio (`promo/capture.cjs`).
- `promo/render.cjs` renderiza cuadro a cuadro con Playwright y codifica con ffmpeg (CRF 21, reducción
  de ruido para que el grano no infle el peso).

**Verificación.**
- Se revisaron cuadros de cada video final.
- Reels: lo importante queda fuera de las zonas que tapa la app (arriba unos 250 px, abajo un 35 %,
  botones a la derecha).
- Se corrigieron:
  - en 9:16, títulos de dos líneas que tapaban la ventana;
  - encuadres;
  - el destello del apagado.
- **El asistente no puede escuchar audio:** el sonido se verificó con espectrograma y medición de
  volumen. **Escúchalos antes de publicar.**

**Cómo regenerarlos.** Los comandos están en `promo/README.md`.
- `promo/media/render-assets.zip` trae las capturas y el audio exactos. Descomprimido en `promo/comp/`,
  permite volver a renderizar sin capturar de nuevo, por ejemplo con otra URL usando `--site=…`.
- Formatos: `--format=16x9|4x5|9x16`.
- Portadas: `--cover`.

**Estimación de costo.** Hacer las verticales costó cerca de un tercio de lo que costó el horizontal,
porque se reutilizaron capturas, música y motor.

**Detalle menor.** La escena RADIO del video muestra la radio anterior (Galaxy News Radio, Diamond City
Radio y Señal de socorro). Hoy la radio cambia según el tema. Es opcional actualizarla: recapturar el
clip de radio y volver a renderizar.

---

## 6. Recomendaciones para publicar

Los textos completos están en `promo/linkedin-post.md`: post en español, primer comentario con el link,
variante corta, versión en inglés y texto con hashtags para Instagram.

- **LinkedIn:**
  - Usa el **4:5**, no el horizontal. En el feed del celular el 4:5 ocupa casi toda la pantalla y el
    16:9 queda como una franja pequeña.
  - Súbelo como video nativo y elige `cover-4x5.png` como portada.
  - Pon el link en el **primer comentario**, no en el texto: los posts con links externos suelen tener
    menos alcance.
  - Buen horario en Colombia: martes a jueves, de 7:00 a 9:00 a. m. o al mediodía.
  - No necesita subtítulos: no tiene voz.
  - Opcional: mencionar que te apoyaste en IA para iterar más rápido.
- **Instagram Reels:**
  - Usa el **9:16** con `cover-9x16.png` como portada.
  - Pon `juanpablosanchezdev.com` en tu **bio**: los links en el texto del post no se pueden tocar.
  - No agregues música de la biblioteca: el audio original ya viene en el video.
  - Compártelo también en tu historia.
- **Horizontal:** para YouTube, la web o presentaciones.
- **Publica después de conectar el dominio**, porque los videos muestran esa URL.

---

## 7. Últimos ajustes: `Esc` y radio por juego

**`Esc` abre el menú.**
- Si no hay nada abierto, abre el menú (color, idioma, tipografía, sonido, CRT, imprimir, terminal,
  reiniciar).
- Si el menú o la terminal están abiertos, los cierra.
- Funciona como la pausa del juego. Aparece en la barra de atajos (`ESC MENÚ`) y en el tooltip del
  botón ⚙.

**La radio sigue al juego del tema:**

| Tema | Emisoras | Fuente en Internet Archive |
| --- | --- | --- |
| Fallout 4, Vault-Tec, Mk VI | Diamond City Radio | `Fallout4DiamondCityRadio` |
| | Classical Radio | archivo «Classical» dentro de `fallout-3-new-vegas-4-music-compilation` |
| Fallout 3 | Galaxy News Radio | `Fallout_3_galaxy_news_radio-2008` |
| | Enclave Radio | `fallout3_enclave_radio` |
| New Vegas | Radio New Vegas | `fallout-new-vegas-the-radio-soundtrack-flac` |
| | Mojave Music Radio | `g.-i.-blues-full-album-vinyl-rip` (sin los archivos «radio …») |
| Todos | Señal de socorro (Morse «JPSR EN LINEA») | generada en el navegador |

**Cómo funciona.**
- El navegador lee la lista de canciones de cada colección con la API pública de metadatos de
  archive.org (`src/utils/archive.ts`).
- Se queda solo con MP3 útiles y los mezcla en orden aleatorio.
- Si una canción no carga, salta a la siguiente.
- Si la lista no se puede leer, Galaxy News Radio y Diamond City usan las canciones conocidas que ya
  tenían.
- Una emisora de una sola canción la repite. Antes se quedaba en «Sintonizando…»: era un fallo
  existente y quedó corregido.
- Si cambias de tema con la radio sonando, pasa a la emisora equivalente del otro juego: DCR ↔ GNR ↔
  Radio New Vegas. La baliza se mantiene.

**Sin verificar.** El entorno de desarrollo bloquea archive.org, así que la lógica se probó con
respuestas simuladas (29 comprobaciones en verde), pero no se escucharon las emisoras reales. Falta
confirmar en tu navegador:
1. Que archive.org permita leer la lista desde tu sitio (CORS). Si no lo permite, GNR y DCR suenan con
   sus canciones conocidas y las otras cuatro dicen «Señal perdida».
2. Que cada colección tenga lo esperado. Las que más dudas generan son Classical Radio y Enclave Radio.

**Cómo probar:**
1. Abre el sitio y ve a RADIO.
2. Prueba cada emisora con los temas Fallout 4, Fallout 3 y New Vegas.
3. Anota cuáles dicen «Señal perdida».

---

## 8. Pendientes

**Tuyos:**
- [ ] Probar las 6 emisoras y anotar cuáles fallan (sección 7).
- [ ] Comprar `juanpablosanchezdev.com` y configurar el DNS (sección 4).
- [ ] Escuchar los videos antes de publicar.
- [ ] Publicar: LinkedIn con el 4:5 y Reels con el 9:16, después de conectar el dominio.
- [ ] Verificar datos del CV:
  - [ ] Carvajal quedó como fase anterior dentro de Nexos, y la entidad financiera como la asignación
        actual.
  - [ ] El EF SET quedó como **B1**. Antes decía «Upper Intermediate», que corresponde a B2. Confirma
        tu nivel real.
  - [ ] Si la landing de Vera Villamizar Abogados está publicada, agrega el link.
- [ ] Decidir si quieres en `main` los videos y este resumen.
- [ ] Opcional: extraer las animaciones originales de Vault Boy de Fallout 4 e importarlas (README).

**Para hacer en la próxima sesión:**
- [ ] Ajustar las fuentes de radio que fallen. Si archive.org no permite leer las listas, fijar las
      canciones a mano o servir las listas desde el propio sitio.
- [ ] Conectar el dominio: `CNAME`, `CONTACT.site`, `deploy.yml`, PDF y publicación (sección 4).
- [ ] Abrir el PR a `main`, fusionar con squash y confirmar el despliegue automático.
- [ ] Opcional: actualizar la escena de radio del video y re-renderizar.

---

## 9. Cómo retomar con otra cuenta

1. En claude.ai, con tu cuenta, conecta GitHub (usuario `JuanPabloSR`) y dale acceso a la app de Claude
   al repositorio `pip-boy-website`.
2. Crea un entorno en la nube. En *Network access*, agrega a *Allowed domains*:
   - `archive.org`, para poder probar la radio;
   - `lfs.github.com`, si quieres usar Git LFS. Los videos se subieron como archivos normales porque
     ese host estaba bloqueado.
3. Abre una sesión sobre el repositorio, rama `claude/tender-fermi-9p2pw3`, y pide: *«Lee
   `docs/resumen-del-proyecto.md` y sigamos con los pendientes»*.
4. Para hacer otro video con el mismo método, usa la skill de `.claude/skills/promo-video/SKILL.md`:
   - en Claude Code se carga sola desde el repositorio;
   - en claude.ai la puedes subir como skill.

Comandos locales:

```bash
git clone https://github.com/JuanPabloSR/pip-boy-website && cd pip-boy-website
git checkout claude/tender-fermi-9p2pw3
npm install
npm run dev                     # http://localhost:5173
npm run lint && npm run build
npm i -D playwright && npx playwright install chromium   # para PDF, pruebas y video
npm run cv:pdf                  # regenerar los PDF del CV (con dev corriendo)
npm run radio:check             # probar radio y Esc (con dev corriendo)
scripts/deploy-pages.sh         # publicar a mano en gh-pages
```

Para el video también hace falta ffmpeg y Python con `numpy` y `pillow`.

---

## 10. Mapa del repositorio

```
src/
  data/          contenido: profile.es.ts, profile.en.ts, shared.ts (contacto y emisoras), types.ts
  components/    Shell (cabecera, pie, atajos), BootScreen, SettingsPanel (menú), tabs/, terminal/
  state/         PipProvider (ajustes, pestañas, menú), RadioProvider (radio), themes.ts
  utils/         archive.ts (listas de archive.org), audio.ts (sonidos), morse.ts
  cv/            renderCv.ts (CV para imprimir), pdf.ts
  i18n/ui.ts     textos de la interfaz ES/EN
  styles/        pipboy.css
public/          cv/*.pdf, og-image.png, favicon.svg
scripts/         build-cv-pdf.cjs, radio-check.cjs, deploy-pages.sh, vaultboy_import.py
promo/           video: capture.cjs, soundtrack.py, vaultboy_frames.py, render.cjs, comp/, media/,
                 linkedin-post.md, README.md
.claude/skills/  promo-video: el método del video, como skill reutilizable
docs/            este resumen
```

---

## 11. Historial

| Commit | Qué |
| --- | --- |
| `7d2a5b0` | Reconstrucción del sitio con el CV completo, temas y diseño responsive |
| `13ea3ee` | Despliegue en GitHub Pages, CI, pulido de terminal y sub-pestañas |
| `cc0e0ed` | Selector ES/EN en el encendido y la cabecera |
| `c3f3668` | Arreglos de la revisión de código (teclado, foco, radio) |
| `756df52` | Arreglos de QA visual: PDF real, botones FO4, pulido |
| `fbf85f8` | Pipeline reproducible del video promocional |
| `6c3ea26` | Formatos verticales (Reels 9:16, LinkedIn 4:5) |
| `7fc635a` | Títulos del 9:16 corregidos y portadas |
| `590f5f2` | Radio por juego y `Esc` abre el menú |
| `0b3e98d` | Prueba de radio (`radio:check`) y script de publicación manual |
| `5c9a2ee` | Videos, portadas y recursos de render en `promo/media/` |

Publicaciones en `gh-pages`: `be3f249` (primera), `02efa59` (después de QA) y `f105c9b` (radio por
juego y `Esc`).

---

## 12. Limitaciones del entorno de esta sesión

Para no repetirlas en la próxima:
- **archive.org bloqueado:** la radio real no se pudo escuchar ni comprobar.
- **`github.io` no accesible desde el entorno:** el sitio se verificó con la API de GitHub y con tu
  revisión.
- **`lfs.github.com` bloqueado:** los videos se subieron como archivos normales de git, cada uno de
  menos de 100 MB.
- **Sin audio:** el sonido de los videos se verificó con espectrograma y medición, no de oído.
