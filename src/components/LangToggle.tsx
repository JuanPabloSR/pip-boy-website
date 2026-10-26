import { usePip } from '../state/pip';
import { soundEffects } from '../utils/audio';

/** Compact ES | EN switch. */
export default function LangToggle({ className = '' }: { className?: string }) {
  const { settings, updateSettings } = usePip();
  return (
    <div className={`lang-toggle ${className}`} role="group" aria-label="Idioma / Language">
      {(['es', 'en'] as const).map(lang => (
        <button key={lang} type="button" aria-pressed={settings.lang === lang} lang={lang}
          onClick={e => {
            e.stopPropagation();
            if (settings.lang !== lang) soundEffects.subTabSwitch();
            updateSettings({ lang });
          }}>
          {lang === 'es' ? 'ES' : 'EN'}
        </button>
      ))}
    </div>
  );
}
