// Captures every asset the promo video needs from the running site
// (screenshots in comp/shots, real-time clips in comp/clips).
//   npm run dev            # in another terminal
//   node promo/capture.cjs [outDir=promo/comp] [url=http://localhost:5173/]
const { chromium } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');

const OUT = process.argv[2] || path.join(__dirname, 'comp');
const URL = process.argv[3] || 'http://localhost:5173/';
const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36';
fs.mkdirSync(path.join(OUT, 'shots'), { recursive: true });
fs.mkdirSync(path.join(OUT, 'clips'), { recursive: true });

const wait = ms => new Promise(r => setTimeout(r, ms));

async function newPage(browser, { width = 1600, height = 900, dpr = 2, theme = 'fo4', booted = true, mobile = false } = {}) {
  const ctx = await browser.newContext({
    viewport: { width, height }, deviceScaleFactor: dpr, userAgent: UA, locale: 'es-CO',
    isMobile: mobile, hasTouch: mobile,
  });
  const page = await ctx.newPage();
  await page.addInitScript(([th, b]) => {
    localStorage.setItem('pipboy:settings', JSON.stringify({ lang: 'es', theme: th, sfx: false }));
    if (b) sessionStorage.setItem('pipboy:booted', 'true');
  }, [theme, booted]);
  // Hide the keyboard hints row and the rolling CRT band for clean captures.
  await page.addInitScript(() => {
    document.addEventListener('DOMContentLoaded', () => {
      const s = document.createElement('style');
      s.textContent = '.crt-roll{display:none!important}.pip-hints{visibility:hidden}';
      document.head.appendChild(s);
    });
  });
  return { ctx, page };
}

async function shot(page, name, opts = {}) {
  await page.mouse.move(5, 895);
  await wait(opts.wait ?? 500);
  await page.screenshot({ path: path.join(OUT, 'shots', `${name}.jpg`), type: 'jpeg', quality: 92 });
  console.log('shot', name);
}

async function gotoTab(page, tab, sub) {
  await page.goto(`${URL}#${tab.toLowerCase()}`);
  await page.waitForSelector('.pip-tab[aria-selected="true"]');
  await page.evaluate(() => document.fonts.ready);
  await wait(600);
  if (sub !== undefined) {
    await page.locator('.subtab').nth(sub).click();
    await wait(400);
  }
}

/** Real-time capture through the DevTools screencast; frames saved with timestamps. */
async function clip(page, name, durationMs, action) {
  const dir = path.join(OUT, 'clips', name);
  fs.mkdirSync(dir, { recursive: true });
  const cdp = await page.context().newCDPSession(page);
  const frames = [];
  cdp.on('Page.screencastFrame', async f => {
    const i = frames.length;
    frames.push({ i, t: f.metadata.timestamp });
    fs.writeFileSync(path.join(dir, `${String(i).padStart(4, '0')}.jpg`), Buffer.from(f.data, 'base64'));
    await cdp.send('Page.screencastFrameAck', { sessionId: f.sessionId }).catch(() => {});
  });
  await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 90, maxWidth: 1600, maxHeight: 900, everyNthFrame: 1 });
  await wait(150);
  const t0 = Date.now();
  if (action) await action();
  await wait(Math.max(0, durationMs - (Date.now() - t0)));
  await cdp.send('Page.stopScreencast');
  await wait(200);
  const start = frames[0]?.t ?? 0;
  fs.writeFileSync(path.join(dir, 'frames.json'), JSON.stringify(frames.map(f => ({ i: f.i, t: +(f.t - start).toFixed(4) }))));
  console.log('clip', name, frames.length, 'frames');
}

(async () => {
  const browser = await chromium.launch();

  // ── Hi-res stills (DPR 2) ──
  {
    const { ctx, page } = await newPage(browser);
    await gotoTab(page, 'STAT', 0); await shot(page, 'stat-status');
    await gotoTab(page, 'STAT', 1); await shot(page, 'stat-special-s');
    await page.keyboard.press('s'); await page.keyboard.press('s'); await page.keyboard.press('s'); await page.keyboard.press('s');
    await shot(page, 'stat-special-i');
    await gotoTab(page, 'STAT', 2); await shot(page, 'stat-perks');
    await gotoTab(page, 'INV', 0); await shot(page, 'inv-weapons');
    await gotoTab(page, 'INV', 1); await shot(page, 'inv-apparel');
    await gotoTab(page, 'INV', 2);
    for (let i = 0; i < 6; i++) await page.keyboard.press('s');
    await shot(page, 'inv-aid-coffee');
    await gotoTab(page, 'INV', 4); await shot(page, 'inv-holo');
    await gotoTab(page, 'INV', 5); await shot(page, 'inv-ammo');
    await gotoTab(page, 'DATA', 0); await shot(page, 'data-quests');
    await gotoTab(page, 'DATA', 1); await shot(page, 'data-workshops');
    await gotoTab(page, 'DATA', 2); await shot(page, 'data-stats');
    await gotoTab(page, 'MAP', 0); await shot(page, 'map-local', { wait: 1200 });
    await gotoTab(page, 'MAP', 1); await shot(page, 'map-world', { wait: 2600 });
    // terminal
    await gotoTab(page, 'STAT', 0);
    await page.locator('.icon-btn').last().click();
    await wait(500);
    for (const cmd of ['quien', 'skills']) { await page.keyboard.type(cmd, { delay: 20 }); await page.keyboard.press('Enter'); }
    await shot(page, 'terminal');
    await page.keyboard.type('hack'); await page.keyboard.press('Enter');
    await wait(500);
    // one wrong guess so the log has content
    const word = await page.locator('.hack-glyph').filter({ hasText: /^[A-Z]{6}$/ }).first();
    await word.click();
    await word.hover();
    await shot(page, 'hack');
    await page.keyboard.press('Escape');
    // settings
    await page.locator('.icon-btn').first().click();
    await shot(page, 'settings');
    await ctx.close();
  }

  // ── Themes (DPR 1, full-frame flashes) ──
  for (const theme of ['fo4', 'fo3', 'nv', 'vault', 'white']) {
    const { ctx, page } = await newPage(browser, { dpr: 1, theme });
    await gotoTab(page, 'STAT', 1);
    await page.keyboard.press('s'); await page.keyboard.press('s');
    await shot(page, `theme-${theme}`);
    await ctx.close();
  }

  // ── Mobile (DPR 3) ──
  {
    const { ctx, page } = await newPage(browser, { width: 390, height: 844, dpr: 3, mobile: true });
    await gotoTab(page, 'STAT', 0); await shot(page, 'm-stat');
    await gotoTab(page, 'INV', 0); await shot(page, 'm-inv');
    await gotoTab(page, 'DATA', 0); await shot(page, 'm-data');
    await gotoTab(page, 'RADIO'); await page.locator('.plist-item').nth(2).click(); await shot(page, 'm-radio', { wait: 1500 });
    await ctx.close();
  }

  // ── Live clips (DPR 1) ──
  {
    const { ctx, page } = await newPage(browser, { dpr: 1, booted: false });
    await page.goto(URL);
    await page.evaluate(() => document.fonts.ready);
    await wait(800);
    await shot(page, 'power');
    await clip(page, 'boot', 4200, async () => { await page.mouse.click(800, 450); });
    await ctx.close();
  }
  {
    const { ctx, page } = await newPage(browser, { dpr: 1 });
    await gotoTab(page, 'MAP', 0);
    await wait(1500);
    await clip(page, 'map-zoom', 3000, async () => { await page.keyboard.press('d'); });
    await gotoTab(page, 'RADIO');
    await page.locator('.plist-item').nth(2).click();
    await wait(800);
    await clip(page, 'radio', 4200);
    await gotoTab(page, 'STAT', 1);
    await clip(page, 'special-nav', 3000, async () => {
      for (let i = 0; i < 6; i++) { await page.keyboard.press('s'); await wait(380); }
    });
    await clip(page, 'tabs', 3200, async () => {
      for (const k of ['e', 'e', 'e', 'e']) { await wait(650); await page.keyboard.press(k); }
    });
    await ctx.close();
  }
  await browser.close();
})();
