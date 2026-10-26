#!/usr/bin/env node
/**
 * Renders the résumé PDFs (public/cv/*.pdf) from the running site, using the same
 * print stylesheet as the "Print" option. Run it after editing src/data:
 *
 *   npm run dev                 # in another terminal
 *   npm run cv:pdf              # or: node scripts/build-cv-pdf.cjs http://localhost:5173/
 *
 * Needs Playwright with Chromium: `npm i -D playwright && npx playwright install chromium`.
 */
const path = require('node:path');

let chromium;
try {
  ({ chromium } = require('playwright'));
} catch {
  console.error('Playwright not found. Install it with: npm i -D playwright && npx playwright install chromium');
  process.exit(1);
}

const url = process.argv[2] || 'http://localhost:5173/';
const outDir = path.resolve(__dirname, '..', 'public', 'cv');

(async () => {
  const browser = await chromium.launch();
  for (const lang of ['es', 'en']) {
    const context = await browser.newContext({ locale: lang === 'es' ? 'es-CO' : 'en-US' });
    const page = await context.newPage();
    await page.addInitScript(l => {
      localStorage.setItem('pipboy:settings', JSON.stringify({ lang: l }));
      sessionStorage.setItem('pipboy:booted', 'true');
    }, lang);
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    const file = path.join(outDir, `juan-pablo-sanchez-rey-cv-${lang}.pdf`);
    await page.pdf({
      path: file,
      format: 'Letter',
      margin: { top: '14mm', bottom: '16mm', left: '14mm', right: '14mm' },
    });
    console.log('wrote', path.relative(process.cwd(), file));
    await context.close();
  }
  await browser.close();
})();
