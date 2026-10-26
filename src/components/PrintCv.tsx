import { useMemo } from 'react';
import { renderCvHtml } from '../cv/renderCv';
import { usePip } from '../state/pip';

/** Hidden on screen; it is what the browser prints (or saves as PDF). */
export default function PrintCv() {
  const { profile, settings } = usePip();
  // The markup is generated from our own static data, with every value escaped.
  const html = useMemo(() => renderCvHtml(profile, settings.lang, profile.site), [profile, settings.lang]);
  return <article className="print-cv" dangerouslySetInnerHTML={{ __html: html }} />;
}
