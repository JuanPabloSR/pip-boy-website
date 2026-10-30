#!/usr/bin/env node
/**
 * End-to-end check of the radio and the Esc menu against stubbed archive.org answers,
 * so it runs offline and doesn't depend on what the real items hold. It checks that:
 *   - each game theme shows its own stations, and Vault-Tec/Mk VI use Fallout 4's;
 *   - changing theme while listening retunes to the same slot of the new dial;
 *   - playlists keep only usable MP3s (no low-bitrate copies, clips, images, DJ files);
 *   - an unreachable listing falls back to the known tracks, dead links are skipped,
 *     and a one-song station loops;
 *   - Esc opens the menu when nothing is open and only closes the terminal when it is.
 *
 *   npm run dev                       # in another terminal
 *   node scripts/radio-check.cjs      # or: node scripts/radio-check.cjs http://localhost:5173/
 *
 * Needs Playwright with Chromium: `npm i -D playwright && npx playwright install chromium`.
 * To check the real archive.org items, open the deployed site and try every station.
 */
let chromium;
try {
  ({ chromium } = require('playwright'));
} catch {
  console.error('Playwright not found. Install it with: npm i -D playwright && npx playwright install chromium');
  process.exit(1);
}

const BASE = (process.argv[2] || 'http://localhost:5173/').replace(/\/?$/, '/');

/** A few seconds of a 440 Hz tone as a WAV file, served in place of every song. */
function tone(seconds = 6, rate = 8000) {
  const n = seconds * rate;
  const buf = Buffer.alloc(44 + n * 2);
  buf.write('RIFF', 0); buf.writeUInt32LE(36 + n * 2, 4); buf.write('WAVE', 8);
  buf.write('fmt ', 12); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(1, 22);
  buf.writeUInt32LE(rate, 24); buf.writeUInt32LE(rate * 2, 28); buf.writeUInt16LE(2, 32); buf.writeUInt16LE(16, 34);
  buf.write('data', 36); buf.writeUInt32LE(n * 2, 40);
  for (let i = 0; i < n; i++) buf.writeInt16LE(Math.round(Math.sin((2 * Math.PI * 440 * i) / rate) * 8000), 44 + i * 2);
  return buf;
}
const SONG = tone();

// Shaped like archive.org/metadata/<item> file lists.
const META = {
  Fallout4DiamondCityRadio: [
    { name: 'Atom Bomb Baby.mp3', source: 'original', length: '150', title: 'Atom Bomb Baby', creator: 'The Five Stars' },
    { name: 'Atom Bomb Baby_64kb.mp3', source: 'derivative', original: 'Atom Bomb Baby.mp3', length: '150' },
    { name: 'Uranium Fever.mp3', source: 'original', length: '02:30' },
    { name: 'Travis intro.mp3', source: 'original', length: '12' },
    { name: 'Fallout4DiamondCityRadio.png', source: 'original' },
  ],
  'fallout-3-new-vegas-4-music-compilation': [
    { name: 'Fallout 4 Classical Radio (all songs).mp3', source: 'original', length: '3600' },
    { name: 'Fallout New Vegas ALL Radio Songs.mp3', source: 'original', length: '3600' },
    { name: 'big iron.mp3', source: 'original', length: '230' },
  ],
  fallout3_enclave_radio: [
    { name: 'Stars and Stripes Forever.mp3', source: 'original', length: '200' },
    { name: 'Washington Post March.mp3', source: 'original', length: '180' },
  ],
  'fallout-new-vegas-the-radio-soundtrack-flac': [
    { name: "CD1/01 Ain't That A Kick In The Head.flac", source: 'original' },
    { name: "CD1/01 Ain't That A Kick In The Head.mp3", source: 'derivative', original: "CD1/01 Ain't That A Kick In The Head.flac", length: '140', title: "Ain't That A Kick In The Head", creator: 'Dean Martin' },
  ],
  'g.-i.-blues-full-album-vinyl-rip': [
    { name: 'Radio new vegas.3.mp3', source: 'original', length: '900' },
    { name: 'radio black mountaint.mp3', source: 'original', length: '600' },
    { name: '05 - Peggy Lee - Johnny Guitar.mp3', source: 'original', length: '170' },
  ],
};

const results = [];
const check = (ok, msg) => {
  results.push(`${ok ? 'PASS' : 'FAIL'}  ${msg}`);
  if (!ok) process.exitCode = 1;
};
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

/** A context whose archive.org requests are answered locally. */
async function stubbedContext(browser, { metadata = item => META[item], dead = () => false } = {}) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 860 } });
  const downloads = [];
  await context.route(/archive\.org\/metadata\//, route => {
    const item = decodeURIComponent(new URL(route.request().url()).pathname.split('/')[2]);
    const files = metadata(item);
    if (!files) return route.abort(); // like a blocked or failed request
    return route.fulfill({ contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify({ files }) });
  });
  await context.route(/archive\.org\/download\//, route => {
    const file = decodeURIComponent(route.request().url().replace(/^.*\/download\//, ''));
    downloads.push(file);
    return dead(file) ? route.fulfill({ status: 404, body: 'not found' }) : route.fulfill({ contentType: 'audio/wav', body: SONG });
  });
  await context.addInitScript(() => {
    sessionStorage.setItem('pipboy:booted', 'true');
    if (!localStorage.getItem('pipboy:settings'))
      localStorage.setItem('pipboy:settings', JSON.stringify({ lang: 'es', theme: 'fo4', sfx: false, crt: false, font: 'pip', volume: 0.3 }));
  });
  return { context, downloads };
}

(async () => {
  const browser = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const errors = [];
  try {
    // GNR's listing is unreachable (fallback to known tracks) and every Enclave link is dead.
    const { context, downloads } = await stubbedContext(browser, {
      metadata: item => (item === 'Fallout_3_galaxy_news_radio-2008' ? null : META[item]),
      dead: file => file.startsWith('fallout3_enclave_radio/'),
    });
    const page = await context.newPage();
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(`${BASE}#radio`);
    await page.waitForSelector('.plist-item');

    const label = sel => page.$$eval(sel, els => els.map(e => e.querySelector('.label').childNodes[0].textContent.trim()));
    const dial = () => label('.plist-item');
    const live = () => page.$$eval('.plist-item', els => els
      .filter(e => e.querySelector('.marker').textContent.trim())
      .map(e => e.querySelector('.label').childNodes[0].textContent.trim()));
    const status = () => page.textContent('[role=status]');
    const nowPlaying = () => page.evaluate(() => {
      const heading = [...document.querySelectorAll('.section-label')].find(e => /sonando|now playing/i.test(e.textContent));
      return (heading?.nextElementSibling?.textContent ?? '').trim();
    });
    const waitStatus = async re => {
      await page.waitForFunction(r => new RegExp(r, 'i').test(document.querySelector('[role=status]')?.textContent ?? ''), re.source, { timeout: 8000 }).catch(() => {});
      return status();
    };
    const menuOpen = async () => !!(await page.$('[role=dialog][aria-labelledby=settings-title]'));
    const tune = async name => {
      await page.click(`.plist-item:has-text("${name}")`);
      return waitStatus(/en el aire|on air|señal perdida|signal lost/);
    };
    const setTheme = async theme => {
      await page.keyboard.press('Escape');
      check(await menuOpen(), `Esc opens the menu (to pick ${theme})`);
      await page.click(`.swatch:has-text("${theme}")`);
      await page.keyboard.press('Escape');
      check(!(await menuOpen()), 'Esc closes the menu');
    };
    const FO4 = ['Diamond City Radio', 'Classical Radio', 'Señal de socorro'];

    check(same(await dial(), FO4), `Fallout 4 dial: ${await dial()}`);
    await tune('Diamond City Radio');
    check(/^(Atom Bomb Baby — The Five Stars|Uranium Fever)$/.test(await nowPlaying()), `DCR plays a listed song: "${await nowPlaying()}"`);
    check(!downloads.some(d => /_64kb|Travis intro|\.png/.test(d)), 'low-bitrate copies, short clips and images are left out');
    await tune('Classical Radio');
    check(/Classical Radio/.test(await nowPlaying()), `Classical Radio takes only its file from the compilation: "${await nowPlaying()}"`);

    await tune('Diamond City Radio');
    await setTheme('Fallout 3');
    check(same(await dial(), ['Galaxy News Radio', 'Enclave Radio', 'Señal de socorro']), `Fallout 3 dial: ${await dial()}`);
    check(same(await live(), ['Galaxy News Radio']), `theme change retunes DCR → GNR: ${await live()}`);
    await waitStatus(/en el aire/);
    check(/Set the World on Fire|Civilization|Anything Goes/.test(await nowPlaying()), `GNR falls back to its known tracks: "${await nowPlaying()}"`);
    check(/señal perdida/i.test(await tune('Enclave Radio')), `all Enclave links dead → "${await status()}"`);
    check(downloads.filter(d => d.startsWith('fallout3_enclave_radio/')).length >= 2, 'every Enclave song was tried before giving up');

    await setTheme('New Vegas');
    check(same(await dial(), ['Radio New Vegas', 'Mojave Music Radio', 'Señal de socorro']), `New Vegas dial: ${await dial()}`);
    check(same(await live(), ['Mojave Music Radio']), `theme change retunes Enclave → Mojave: ${await live()}`);
    await waitStatus(/en el aire/);
    check(await nowPlaying() === 'Johnny Guitar — Peggy Lee', `Mojave leaves out the station recordings: "${await nowPlaying()}"`);
    await tune('Radio New Vegas');
    check(await nowPlaying() === "Ain't That A Kick In The Head — Dean Martin", `RNV plays the MP3 copy of a FLAC upload: "${await nowPlaying()}"`);
    check(downloads.includes("fallout-new-vegas-the-radio-soundtrack-flac/CD1/01 Ain't That A Kick In The Head.mp3"), 'files inside folders keep their path');

    await tune('Señal de socorro');
    await setTheme('Vault-Tec');
    check(same(await dial(), FO4), `Vault-Tec uses the Fallout 4 dial: ${await dial()}`);
    check(same(await live(), ['Señal de socorro']), `the beacon stays tuned across themes: ${await live()}`);

    await page.keyboard.press('`');
    check(!!(await page.waitForSelector('section.terminal[role=dialog]', { timeout: 5000 }).catch(() => null)), '~ opens the terminal');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
    check(!(await page.$('section.terminal')) && !(await menuOpen()), 'Esc in the terminal only closes the terminal');

    await setTheme('Fallout 4');
    await page.keyboard.press('Escape');
    await page.click('button:has-text("English")');
    await page.keyboard.press('Escape');
    check(same(await dial(), ['Diamond City Radio', 'Classical Radio', 'Distress signal']), `English dial: ${await dial()}`);
    await context.close();

    // With no listing at all, DCR has a single known song: it must loop, not stall.
    const solo = await stubbedContext(browser, { metadata: () => null });
    const p2 = await solo.context.newPage();
    p2.on('pageerror', e => errors.push(e.message));
    await p2.goto(`${BASE}#radio`);
    await p2.click('.plist-item:has-text("Diamond City Radio")');
    await p2.waitForFunction(() => /en el aire/i.test(document.querySelector('[role=status]').textContent), null, { timeout: 8000 }).catch(() => {});
    await p2.waitForTimeout(9000); // the 6 s test song has ended and started over
    check(/en el aire/i.test(await p2.textContent('[role=status]')), `a one-song station loops: ${await p2.textContent('[role=status]')}`);
    await solo.context.close();

    check(errors.length === 0, `no page errors ${errors.join(' | ')}`);
  } catch (e) {
    check(false, `stopped: ${e.message.split('\n')[0]}`);
  } finally {
    console.log(results.join('\n'));
    await browser.close();
  }
})();
