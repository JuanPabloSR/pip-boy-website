import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import profile from './src/data/profile.es';
import { renderCvHtml } from './src/cv/renderCv';

/**
 * Injects crawler-friendly content into index.html at build time:
 * JSON-LD (schema.org Person), absolute social-preview URLs when VITE_SITE_URL
 * is set, and the full résumé inside <noscript> for clients without JavaScript.
 */
function seo(siteUrl: string): Plugin {
  const base = siteUrl.replace(/\/?$/, '/');
  const person = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    jobTitle: profile.title,
    description: profile.summary[0],
    email: `mailto:${profile.email}`,
    address: { '@type': 'PostalAddress', addressLocality: 'Bucaramanga', addressRegion: 'Santander', addressCountry: 'CO' },
    sameAs: [profile.linkedin, profile.github],
    knowsAbout: profile.skillGroups.flatMap(g => g.items).slice(0, 30),
    ...(siteUrl ? { url: base } : {}),
  };

  const meta = [
    `<script type="application/ld+json">${JSON.stringify(person).replace(/</g, '\\u003c')}</script>`,
    `<meta property="og:image" content="${siteUrl ? base : './'}og-image.png" />`,
    '<meta property="og:image:width" content="1200" />',
    '<meta property="og:image:height" content="630" />',
    `<meta property="og:image:alt" content="${profile.name} · Pip-Boy 3000" />`,
    ...(siteUrl ? [`<meta property="og:url" content="${base}" />`, `<link rel="canonical" href="${base}" />`] : []),
  ].join('\n    ');

  const noscript = `<noscript>
      <style>body{overflow:auto;background:#fff}#root{display:none}</style>
      <article class="cv-static" style="max-width:52rem;margin:0 auto;padding:2rem 1.25rem;background:#fff;font-family:Arial,sans-serif">
        ${renderCvHtml(profile, 'es', siteUrl || undefined)}
      </article>
    </noscript>`;

  return {
    name: 'pipboy-seo',
    transformIndexHtml: html => html.replace('<!--pipboy:seo-->', meta).replace('<!--pipboy:noscript-->', noscript),
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  return {
    // Relative base: the build works from a domain root or a sub-path (e.g. GitHub Pages).
    base: './',
    plugins: [react(), seo(env.VITE_SITE_URL || profile.site)],
  };
});
