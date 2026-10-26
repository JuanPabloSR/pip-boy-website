import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { usePip } from '../state/pip';
import { THEMES } from '../state/themes';
import { soundEffects } from '../utils/audio';

export default function SettingsPanel() {
  const { t, settings, updateSettings, setOverlay, printCv, reboot } = usePip();
  const closeRef = useRef<HTMLButtonElement>(null);
  const close = () => setOverlay(null);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOverlay(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [setOverlay]);

  const toggle = (on: boolean, set: (v: boolean) => void) => (
    <div className="pbtn-row" role="group">
      <button type="button" className="pbtn" aria-pressed={on} onClick={() => { set(true); soundEffects.confirm(); }}>{t.settings.on}</button>
      <button type="button" className="pbtn" aria-pressed={!on} onClick={() => set(false)}>{t.settings.off}</button>
    </div>
  );

  return (
    <div className="overlay" onClick={close} role="presentation">
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="settings-title" onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <h2 id="settings-title" style={{ fontSize: 'inherit' }}>{t.settings.title}</h2>
          <button ref={closeRef} type="button" className="pbtn" onClick={close} aria-label={t.settings.close}>
            <X aria-hidden="true" />
          </button>
        </div>

        <div className="setting">
          <span className="section-label">{t.settings.color}</span>
          <div className="swatches">
            {THEMES.map(theme => (
              <button key={theme.id} type="button" className="swatch" aria-pressed={settings.theme === theme.id}
                style={{ color: `rgb(${theme.rgb.join(' ')})` }}
                onClick={() => { updateSettings({ theme: theme.id }); soundEffects.subTabSwitch(); }}>
                <i style={{ background: `rgb(${theme.rgb.join(' ')})` }} />
                {theme.label}
              </button>
            ))}
          </div>
        </div>

        <div className="setting">
          <span className="section-label">{t.settings.language}</span>
          <div className="pbtn-row" role="group">
            <button type="button" className="pbtn" aria-pressed={settings.lang === 'es'} onClick={() => updateSettings({ lang: 'es' })}>Español</button>
            <button type="button" className="pbtn" aria-pressed={settings.lang === 'en'} onClick={() => updateSettings({ lang: 'en' })}>English</button>
          </div>
        </div>

        <div className="setting">
          <span className="section-label">{t.settings.font}</span>
          <div className="pbtn-row" role="group">
            <button type="button" className="pbtn" aria-pressed={settings.font === 'pip'} onClick={() => updateSettings({ font: 'pip' })}>{t.settings.fontPip}</button>
            <button type="button" className="pbtn" aria-pressed={settings.font === 'term'} onClick={() => updateSettings({ font: 'term' })}>{t.settings.fontTerm}</button>
          </div>
        </div>

        <div className="setting">
          <span className="section-label">{t.settings.sound}</span>
          {toggle(settings.sfx, v => updateSettings({ sfx: v }))}
        </div>

        <div className="setting">
          <span className="section-label">{t.settings.crt}</span>
          {toggle(settings.crt, v => updateSettings({ crt: v }))}
        </div>

        <div className="setting">
          <div className="pbtn-row">
            <button type="button" className="pbtn" onClick={printCv}>{t.settings.print}</button>
            <button type="button" className="pbtn" onClick={() => setOverlay('terminal')}>{t.settings.terminal}</button>
            <button type="button" className="pbtn" onClick={() => { soundEffects.powerDown(); reboot(); }}>{t.settings.reboot}</button>
          </div>
        </div>

        <div className="setting keys" style={{ marginBottom: 0 }}>
          <span className="section-label">{t.settings.keys}</span>
          <span>{t.settings.keyTabs}</span>
          <span>{t.settings.keySub}</span>
          <span>{t.settings.keyList}</span>
          <span>{t.settings.keyTerm}</span>
        </div>
      </section>
    </div>
  );
}
