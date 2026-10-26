import type { Lang } from '../data/types';

/**
 * Pre-rendered résumé PDFs live in public/cv/ (regenerate them with
 * `node scripts/build-cv-pdf.mjs` after editing src/data). Relative URL so it
 * works under any deploy path.
 */
export const cvPdfUrl = (lang: Lang) => `./cv/juan-pablo-sanchez-rey-cv-${lang}.pdf`;

export function downloadCvPdf(lang: Lang) {
  const a = document.createElement('a');
  a.href = cvPdfUrl(lang);
  a.download = '';
  document.body.appendChild(a);
  a.click();
  a.remove();
}
