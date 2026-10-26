#!/usr/bin/env node
/**
 * Renders promo/comp/index.html frame by frame (deterministic timeline) and
 * encodes it with the soundtrack:
 *
 *   node promo/render.cjs [--site=juanpablosanchezdev.com] [--out=promo/out/pipboy-promo.mp4]
 *   node promo/render.cjs --format=9x16    # vertical for Reels/TikTok/Shorts (1080x1920)
 *   node promo/render.cjs --format=4x5     # vertical feed for LinkedIn (1080x1350)
 *   node promo/render.cjs --preview=8.5,16,30     # writes promo/out/preview-<format>/*.jpg
 *
 * Needs Playwright (Chromium) and ffmpeg with libx264.
 */
const { chromium } = require('playwright');
const { spawn } = require('node:child_process');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const FPS = 30;
const DURATION = 48;
const COMP = path.join(__dirname, 'comp');
const arg = name => (process.argv.find(a => a.startsWith(`--${name}=`)) || '').split('=').slice(1).join('=');
const FORMATS = {
  '16x9': { page: 'index.html', width: 1920, height: 1080 },
  '9x16': { page: 'vertical.html', width: 1080, height: 1920 },
  '4x5': { page: 'vertical.html', width: 1080, height: 1350 },
};
const format = arg('format') || '16x9';
const fmt = FORMATS[format];
if (!fmt) throw new Error(`Unknown --format=${format} (use ${Object.keys(FORMATS).join(', ')})`);
const out = arg('out') || path.join(__dirname, 'out', format === '16x9' ? 'pipboy-promo.mp4' : `pipboy-promo-${format}.mp4`);
const site = arg('site');
const preview = arg('preview');

const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.jpg': 'image/jpeg', '.png': 'image/png', '.json': 'application/json', '.wav': 'audio/wav' };
const server = http.createServer((req, res) => {
  const file = path.join(COMP, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (!file.startsWith(COMP) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404).end(); return; }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});

(async () => {
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const query = new URLSearchParams({ fmt: format, ...(site ? { site } : {}) });
  const url = `http://127.0.0.1:${server.address().port}/${fmt.page}?${query}`;
  const browser = await chromium.launch({ args: ['--force-color-profile=srgb', '--disable-lcd-text'] });
  const page = await browser.newPage({ viewport: { width: fmt.width, height: fmt.height } });
  page.on('pageerror', e => console.error('page error:', e.message));
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.evaluate(() => window.ready);
  const shoot = async t => {
    await page.evaluate(tt => window.renderFrame(tt), t);
    return page.screenshot({ type: 'jpeg', quality: 93 });
  };

  fs.mkdirSync(path.dirname(out), { recursive: true });
  if (preview) {
    const dir = path.join(path.dirname(out), `preview-${format}`);
    fs.mkdirSync(dir, { recursive: true });
    for (const t of preview.split(',').map(Number)) fs.writeFileSync(path.join(dir, `t${t.toFixed(2)}.jpg`), await shoot(t));
    console.log('previews in', dir);
  } else {
    const ff = spawn('ffmpeg', [
      '-y', '-hide_banner', '-loglevel', 'error',
      '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
      '-i', path.join(COMP, 'soundtrack.wav'),
      // light denoise keeps the film grain from bloating the file
      '-vf', 'hqdn3d=1.5:1.5:4:4', '-c:v', 'libx264', '-preset', 'slow', '-crf', '21', '-tune', 'film',
      '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-r', String(FPS),
      '-c:a', 'aac', '-b:a', '192k', '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11', '-shortest',
      '-movflags', '+faststart', out,
    ], { stdio: ['pipe', 'inherit', 'inherit'] });
    for (let i = 0; i < DURATION * FPS; i++) {
      if (!ff.stdin.write(await shoot(i / FPS))) await new Promise(r => ff.stdin.once('drain', r));
      if (i % 150 === 0) console.log(`frame ${i}/${DURATION * FPS}`);
    }
    ff.stdin.end();
    await new Promise(r => ff.on('close', r));
    console.log('wrote', out);
  }
  await browser.close();
  server.close();
})();
