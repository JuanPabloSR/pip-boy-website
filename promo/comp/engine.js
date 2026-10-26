'use strict';
/*
 * Shared timeline engine for the promo compositions.
 * The page defines these globals before loading this script:
 *   W, H, CX, CY   frame size and center
 *   stage, world, strip, flashEl   layers (see index.html / vertical.html)
 * Everything is driven by window.renderFrame(t), so a render is deterministic.
 */
const FPS = 30;
const DURATION = 48;

// ── Keyframe engine ─────────────────────────────────────────────────────────
const EASE = {
  lin: x => x,
  out: x => 1 - Math.pow(1 - x, 3),
  outExpo: x => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * x)),
  in: x => x * x * x,
  inOut: x => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2),
  back: x => { const c1 = 1.5, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); },
};
const PROPS = { x: 0, y: 0, s: 1, sx: 1, sy: 1, o: 1, rx: 0, ry: 0, rz: 0, blur: 0, br: 1 };
const tracks = [];
const updaters = [];

function el(tag, cls, parent = world, html = '') {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html) e.innerHTML = html;
  parent.appendChild(e);
  return e;
}
/**
 * anchor = 'center' (element centered on left/top) or 'free' (plain transform).
 * Keyframes hold their values: a property a keyframe does not mention keeps the
 * value it had at the previous keyframe (the first keyframe starts from defaults).
 */
function anim(e, kfs, { anchor = 'center', left = CX, top = CY } = {}) {
  if (anchor === 'center') { e.style.left = left + 'px'; e.style.top = top + 'px'; }
  const sorted = kfs.slice().sort((a, b) => a.t - b.t);
  let state = { ...PROPS };
  const full = sorted.map(k => { state = { ...state, ...k }; return state; });
  tracks.push({ e, kfs: full, anchor });
  return e;
}
function evalTrack(kfs, t) {
  if (t <= kfs[0].t) return kfs[0];
  for (let i = 1; i < kfs.length; i++) {
    const b = kfs[i];
    if (t < b.t) {
      const a = kfs[i - 1];
      const u = EASE[b.e || 'out'](Math.min(1, Math.max(0, (t - a.t) / (b.t - a.t))));
      const out = {};
      for (const p in PROPS) out[p] = a[p] + (b[p] - a[p]) * u;
      return out;
    }
  }
  return kfs[kfs.length - 1];
}
function applyTrack(tr, t) {
  const v = evalTrack(tr.kfs, t);
  const st = tr.e.style;
  st.opacity = v.o;
  st.visibility = v.o <= 0.002 ? 'hidden' : 'visible';
  const c = tr.anchor === 'center' ? 'translate(-50%,-50%) ' : '';
  st.transform = `${c}translate3d(${v.x}px,${v.y}px,0) perspective(2000px) rotateX(${v.rx}deg) rotateY(${v.ry}deg) rotateZ(${v.rz}deg) scale(${v.s * v.sx},${v.s * v.sy})`;
  const f = [];
  if (v.blur > 0.05) f.push(`blur(${v.blur.toFixed(2)}px)`);
  if (Math.abs(v.br - 1) > 0.01) f.push(`brightness(${v.br.toFixed(2)})`);
  st.filter = f.length ? f.join(' ') : 'none';
}
/** Visible only inside [a, b) with quick fades. */
function span(a, b, fadeIn = 0.25, fadeOut = 0.25, extra = {}) {
  return [
    { t: a - 0.001, o: 0, ...extra.from },
    { t: a + fadeIn, o: 1, ...extra.to, e: extra.ein || 'out' },
    { t: b - fadeOut, o: 1 },
    { t: b, o: 0, ...extra.exit, e: 'in' },
  ];
}
/** Split text into words that rise in with a stagger. */
function words(parent, text, start, { stagger = 0.07, dur = 0.55, dy = 70, end = null, outDur = 0.25 } = {}) {
  text.split(' ').forEach((w, i) => {
    const s = el('span', 'w', parent, w);
    parent.appendChild(document.createTextNode(' '));
    const t0 = start + i * stagger;
    const k = [{ t: t0, o: 0, y: dy, blur: 10 }, { t: t0 + dur, o: 1, y: 0, blur: 0, e: 'outExpo' }];
    if (end !== null) k.push({ t: end - outDur, o: 1, y: 0 }, { t: end, o: 0, y: -40, e: 'in' });
    anim(s, k, { anchor: 'free' });
  });
}
function block(cls, html, x, y, kfs, parent = world) {
  const e = el('div', 'a ' + cls, parent, html);
  return anim(e, kfs, { left: x, top: y });
}

// ── Seeded noise for grain & glitch ─────────────────────────────────────────
function mulberry(a) { return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const grainCanvas = document.getElementById('grain');
const grainCtx = grainCanvas.getContext('2d');
const grainImg = grainCtx.createImageData(grainCanvas.width, grainCanvas.height);
function drawGrain(frame) {
  const r = mulberry(frame * 9973 + 1);
  const d = grainImg.data;
  for (let i = 0; i < d.length; i += 4) { const v = r() * 255; d[i] = d[i + 1] = d[i + 2] = v; d[i + 3] = 255; }
  grainCtx.putImageData(grainImg, 0, 0);
}

// ── Images & clips ──────────────────────────────────────────────────────────
const imgCache = new Map();
function loadImg(src) {
  if (!imgCache.has(src)) {
    const im = new Image();
    im.src = src;
    imgCache.set(src, im.decode().then(() => im).catch(() => im));
    if (imgCache.size > 40) imgCache.delete(imgCache.keys().next().value);
  }
  return imgCache.get(src);
}
const clipMeta = {};
async function loadClipMeta(name) {
  clipMeta[name] = await (await fetch(`clips/${name}/frames.json`)).json();
}
function clipFrameAt(name, local) {
  const fr = clipMeta[name];
  let k = 0;
  while (k < fr.length - 1 && fr[k + 1].t <= local) k++;
  const a = fr[k], b = fr[Math.min(k + 1, fr.length - 1)];
  const frac = b.t > a.t ? Math.min(1, Math.max(0, (local - a.t) / (b.t - a.t))) : 0;
  return { a: `clips/${name}/${String(a.i).padStart(4, '0')}.jpg`, b: `clips/${name}/${String(b.i).padStart(4, '0')}.jpg`, frac };
}

/**
 * Feeds the site "screen": SCREEN is a list of { t, img } stills,
 * { t, clip, from, speed } real-time clips (frame-blended) or { t, mix: [a, b], dur } crossfades.
 */
function screenFeed(SCREEN, shotImg, clipCanvas) {
  const ctx = clipCanvas.getContext('2d');
  const cw = clipCanvas.width, ch = clipCanvas.height;
  let currentImg = '';
  const showCanvas = on => {
    clipCanvas.style.display = on ? '' : 'none';
    shotImg.style.display = on ? 'none' : '';
  };
  updaters.push(async t => {
    let cur = null;
    for (const s of SCREEN) if (s.t <= t) cur = s;
    if (!cur) return;
    if (cur.mix) {
      const [A, B] = await Promise.all(cur.mix.map(loadImg));
      const u = EASE.inOut(Math.min(1, Math.max(0, (t - cur.t) / cur.dur)));
      ctx.globalAlpha = 1;
      ctx.drawImage(A, 0, 0, cw, ch);
      ctx.globalAlpha = u;
      ctx.drawImage(B, 0, 0, cw, ch);
      showCanvas(true);
      currentImg = '';
    } else if (cur.img) {
      showCanvas(false);
      if (currentImg !== cur.img) {
        currentImg = cur.img;
        await loadImg(cur.img);
        shotImg.src = cur.img;
        await shotImg.decode().catch(() => {});
      }
    } else {
      const f = clipFrameAt(cur.clip, cur.from + (t - cur.t) * cur.speed);
      const [A, B] = await Promise.all([loadImg(f.a), loadImg(f.b)]);
      ctx.globalAlpha = 1;
      ctx.drawImage(A, 0, 0, cw, ch);
      if (f.frac > 0.05) { ctx.globalAlpha = f.frac; ctx.drawImage(B, 0, 0, cw, ch); }
      showCanvas(true);
    }
  });
}

// ── Vault Boy frames (pre-tinted PNGs from vaultboy_frames.py) ─────────────
const vbMeta = { 'walk': { n: 19, d: [100, 100, 100, 100, 100, 100, 100, 100, 100, 200, 100, 100, 100, 200, 100, 100, 100, 100, 100] }, 'thumbs-up': { n: 14, d: Array(14).fill(100) } };
function vbFrame(name, local, loop = true) {
  const m = vbMeta[name];
  const total = m.d.reduce((a, b) => a + b, 0) / 1000;
  let x = loop ? ((local % total) + total) % total : Math.min(local, total - 0.001);
  for (let k = 0; k < m.n; k++) { x -= m.d[k] / 1000; if (x < 0) return `vb/${name}-${String(k).padStart(2, '0')}.png`; }
  return `vb/${name}-${String(m.n - 1).padStart(2, '0')}.png`;
}
/** Swaps an <img> to the right animation frame for time t. */
function vbPlayer(img, frameAt) {
  let src = '';
  updaters.push(async t => {
    const next = frameAt(t);
    if (!next || next === src) return;
    src = next;
    await loadImg(next);
    img.src = next;
    await img.decode().catch(() => {});
  });
}

/**
 * Chapter rail: one tick per chapter, the current one lit, and Vault Boy
 * walking along the rail to reach each chapter as it starts.
 */
function chapterRail(chapters, { x0, x1, railTop, labelTop, walkerTop, walkerH, labelSize, start = 8, end = 44 }) {
  const railX = i => x0 + ((x1 - x0) / (chapters.length - 1)) * i;
  const rail = el('div', '', strip);
  rail.id = 'rail';
  Object.assign(rail.style, { left: x0 + 'px', width: (x1 - x0) + 'px', top: railTop + 'px' });
  const fill = el('div', '', strip);
  fill.id = 'railfill';
  Object.assign(fill.style, { left: x0 + 'px', top: (railTop - 1) + 'px' });
  const labels = chapters.map(([, name], i) => {
    const tick = el('div', 'tick', strip);
    Object.assign(tick.style, { left: railX(i) + 'px', top: (railTop - 4) + 'px' });
    const c = el('div', 'chap', strip, name);
    Object.assign(c.style, { left: railX(i) + 'px', top: labelTop + 'px', fontSize: labelSize + 'px' });
    return c;
  });
  const walker = el('img', '', strip);
  Object.assign(walker.style, { position: 'absolute', height: walkerH + 'px', top: walkerTop + 'px', filter: 'drop-shadow(0 0 6px rgba(20,248,20,.6))' });
  updaters.push(t => {
    const visible = t >= start && t < end;
    strip.style.opacity = visible ? Math.min(1, (t - start) / 0.4, (end - t) / 0.3) : 0;
    if (!visible) return;
    let x = railX(0);
    chapters.forEach(([s], i) => {
      const e = chapters[i + 1] ? chapters[i + 1][0] : end;
      if (t >= s && i + 1 < chapters.length) x = railX(i) + (railX(i + 1) - railX(i)) * Math.min(1, (t - s) / (e - s));
      if (t >= s && i + 1 === chapters.length) x = railX(i);
      labels[i].classList.toggle('on', t >= s && t < e);
    });
    fill.style.width = (x - x0) + 'px';
    walker.style.left = (x - walkerH * 0.35) + 'px';
  });
  vbPlayer(walker, t => (t >= start && t < end ? vbFrame('walk', t - start) : null));
}

/** White flashes on hits, RGB-split glitches, and the background fading out at the end. */
function flashesAndGlitches(FLASHES, GLITCHES, bgFadeAt = 47.2) {
  const bg = document.getElementById('bg');
  updaters.push(t => {
    bg.style.opacity = t < bgFadeAt ? 1 : Math.max(0, 1 - (t - bgFadeAt) / 0.3);
    let f = 0;
    for (const [a, s] of FLASHES) if (t >= a) f = Math.max(f, s * Math.exp(-(t - a) / 0.09));
    flashEl.style.opacity = f.toFixed(3);
    const g = GLITCHES.find(([a, d]) => t >= a && t < a + d);
    if (g) {
      const r = mulberry(Math.floor(t * FPS) * 31 + 5);
      stage.style.filter = `drop-shadow(${(r() * 14 - 7).toFixed(1)}px 0 0 rgba(255,0,90,.75)) drop-shadow(${(r() * -14 + 7).toFixed(1)}px 0 0 rgba(0,220,255,.75))`;
      bg.style.transform = `translateX(${(r() * 30 - 15).toFixed(1)}px)`;
    } else {
      stage.style.filter = 'none';
      bg.style.transform = 'none';
    }
  });
}

/** The CRT "line" that opens into the picture at the start and collapses at the end. */
function crtPowerOnOff() {
  world.style.transformOrigin = '50% 50%';
  anim(world, [
    { t: 0, sy: 0.004, sx: 0.6, br: 3 },
    { t: 0.22, sy: 0.004, sx: 1, br: 3, e: 'out' },
    { t: 0.5, sy: 1, sx: 1, br: 1, e: 'outExpo' },
    { t: 47.25, sy: 1, sx: 1, br: 1 },
    { t: 47.55, sy: 0.004, sx: 1, br: 3, e: 'in' },
    { t: 47.8, sy: 0.004, sx: 0.002, br: 3, e: 'in' },
  ], { anchor: 'free' });
}

/** URL shown on the end card: ?site=... (render.cjs --site), without protocol or trailing slash. */
function siteLabel(fallback) {
  return (new URLSearchParams(location.search).get('site') || fallback).replace(/^https?:\/\//, '').replace(/\/$/, '');
}

// ── Driver ─────────────────────────────────────────────────────────────────
function startDriver(clips) {
  window.ready = (async () => {
    await Promise.all([
      document.fonts.load('900 100px "Roboto Condensed"'),
      document.fonts.load('700 100px "Roboto Condensed"'),
      document.fonts.load('400 100px "Roboto Condensed"'),
      document.fonts.load('40px "Share Tech Mono"'),
    ]);
    await document.fonts.ready;
    await Promise.all(clips.map(loadClipMeta));
    return true;
  })();
  window.renderFrame = async t => {
    for (const tr of tracks) applyTrack(tr, t);
    for (const u of updaters) await u(t);
    drawGrain(Math.round(t * FPS));
    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
    return true;
  };
}
