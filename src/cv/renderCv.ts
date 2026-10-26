import type { Lang, Profile } from '../data/types';

// Plain-HTML résumé built from the same data as the Pip-Boy. Used for printing /
// "Save as PDF" and, at build time, as the <noscript> fallback for crawlers.

const LABELS = {
  es: {
    profile: 'Perfil profesional', experience: 'Experiencia laboral', achievements: 'Logros',
    skills: 'Habilidades técnicas', education: 'Formación y certificaciones', projects: 'Proyectos',
    languages: 'Idiomas', site: 'Versión interactiva',
  },
  en: {
    profile: 'Professional summary', experience: 'Work experience', achievements: 'Achievements',
    skills: 'Technical skills', education: 'Education & certifications', projects: 'Projects',
    languages: 'Languages', site: 'Interactive version',
  },
} satisfies Record<Lang, Record<string, string>>;

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const stripProtocol = (url: string) => url.replace(/^https?:\/\/(www\.)?/, '');

export function renderCvHtml(p: Profile, lang: Lang, siteUrl?: string): string {
  const L = LABELS[lang];
  const jobs = p.quests.filter(q => q.group === 'main');
  const education = p.quests.filter(q => q.group === 'side');

  const contact = [
    esc(p.location),
    `<a href="mailto:${esc(p.email)}">${esc(p.email)}</a>`,
    `<a href="${esc(p.linkedin)}">${esc(stripProtocol(p.linkedin))}</a>`,
    `<a href="${esc(p.github)}">${esc(stripProtocol(p.github))}</a>`,
    siteUrl ? `${L.site}: <a href="${esc(siteUrl)}">${esc(stripProtocol(siteUrl))}</a>` : '',
  ].filter(Boolean).join(' · ');

  const jobHtml = jobs.map(q => `
    <div class="cv-job">
      <h3>${esc(q.role ?? q.title)} — ${esc(q.org)}</h3>
      <div class="cv-meta">${[q.period, q.location].filter(Boolean).map(s => esc(s!)).join(' · ')}</div>
      <p>${esc(q.summary)}</p>
      ${q.stages.map(st => `
        ${st.heading ? `<p><strong>${esc(st.heading)}</strong></p>` : ''}
        <ul>${st.objectives.map(o => `<li>${esc(o.text)}</li>`).join('')}</ul>`).join('')}
      ${q.rewards?.length ? `<p><strong>${L.achievements}</strong></p><ul>${q.rewards.map(r => `<li>${esc(r)}</li>`).join('')}</ul>` : ''}
    </div>`).join('');

  const eduHtml = education.map(q =>
    `<li><strong>${esc(q.title)}</strong> — ${esc(q.org)}${q.period ? ` (${esc(q.period)})` : ''}${q.rewards?.length ? `. ${q.rewards.map(esc).join('; ')}` : ''}</li>`,
  ).join('');

  const projectsHtml = p.workshops.map(w =>
    `<li><strong>${esc(w.name)}</strong> (${esc(w.type)}): ${esc(w.description)}</li>`,
  ).join('');

  return `
    <header>
      <h1>${esc(p.name)}</h1>
      <div class="cv-sub">${esc(p.title)} | ${esc(p.headline)}</div>
      <div class="cv-contact">${contact}</div>
    </header>
    <h2>${L.profile}</h2>
    ${p.summary.map(s => `<p>${esc(s)}</p>`).join('')}
    <h2>${L.skills}</h2>
    <ul>${p.skillGroups.map(g => `<li><strong>${esc(g.label)}:</strong> ${g.items.map(esc).join(', ')}</li>`).join('')}</ul>
    <h2>${L.experience}</h2>
    ${jobHtml}
    <h2>${L.education}</h2>
    <ul>${eduHtml}</ul>
    <h2>${L.projects}</h2>
    <ul>${projectsHtml}</ul>
    <h2>${L.languages}</h2>
    <p>${p.languages.map(l => `${esc(l.name)}: ${esc(l.level)}`).join(' · ')}</p>
  `;
}
