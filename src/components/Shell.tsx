import { useRef, type ReactNode } from 'react';
import { Settings2, Terminal } from 'lucide-react';
import { levelFromExperience } from '../data';
import { useKeys } from '../hooks/useKeys';
import { falloutDate, falloutTime, useNow } from '../hooks/useNow';
import { TABS, usePip, type TabId } from '../state/pip';
import { soundEffects } from '../utils/audio';
import LangToggle from './LangToggle';

export default function Shell({ children }: { children: ReactNode }) {
  const { tab, setTab, t, overlay, setOverlay } = usePip();
  const mainRef = useRef<HTMLElement>(null);

  const go = (next: TabId) => {
    if (next === tab) return;
    soundEffects.tabSwitch();
    setTab(next);
  };

  useKeys(e => {
    const key = e.key.toLowerCase();
    const i = TABS.indexOf(tab);
    if (e.repeat) return;
    if (key === 'q') go(TABS[(i - 1 + TABS.length) % TABS.length]);
    else if (key === 'e') go(TABS[(i + 1) % TABS.length]);
    else if (/^[1-5]$/.test(e.key)) go(TABS[Number(e.key) - 1]);
    // ~ on US layouts, º on Spanish ones (same physical key), or ~ typed with AltGr.
    else if (e.key === '~' || e.key === '`' || e.key === 'º' || e.code === 'Backquote') {
      e.preventDefault();
      soundEffects.confirm();
      setOverlay('terminal');
    } else if (e.key === 'Escape') {
      // Nothing open to close, so Esc brings up the Pip-Boy menu (it closes it again from inside).
      soundEffects.confirm();
      setOverlay('settings');
    }
  }, overlay === null);

  return (
    <div className="pipboy crt-flicker">
      <a className="skip-link" href="#pip-main" onClick={e => { e.preventDefault(); mainRef.current?.focus(); }}>
        {t.a11y.skip}
      </a>

      <header className="pip-header">
        <button type="button" className="icon-btn" onClick={() => { soundEffects.confirm(); setOverlay('settings'); }}
          aria-label={t.a11y.settings} title={`${t.a11y.settings} (Esc)`} aria-keyshortcuts="Escape">
          <Settings2 aria-hidden="true" />
        </button>

        <nav className="pip-tabs" role="tablist" aria-label={t.a11y.mainNav}>
          {TABS.map(id => (
            <button key={id} type="button" role="tab" className="pip-tab" aria-selected={id === tab}
              aria-controls="pip-main" onClick={() => go(id)}>
              {t.tabs[id]}
            </button>
          ))}
        </nav>

        <LangToggle className="header-lang" />
        <button type="button" className="icon-btn" onClick={() => { soundEffects.confirm(); setOverlay('terminal'); }}
          aria-label={t.a11y.terminal} title={t.a11y.terminal}>
          <Terminal aria-hidden="true" />
        </button>
      </header>

      <main ref={mainRef} id="pip-main" className="pip-main" role="tabpanel" aria-label={t.tabs[tab]} tabIndex={-1}>
        {children}
      </main>

      <Footer />

      <div className="pip-hints" aria-hidden="true">
        <span><kbd>Q</kbd><kbd>E</kbd>{t.hints.tabs}</span>
        <span><kbd>A</kbd><kbd>D</kbd>{t.hints.sub}</span>
        <span><kbd>W</kbd><kbd>S</kbd>{t.hints.select}</span>
        <span><kbd>~</kbd>{t.hints.terminal}</span>
        <span><kbd>Esc</kbd>{t.hints.settings}</span>
      </div>
    </div>
  );
}

function Footer() {
  const { tab, t, profile, settings } = usePip();
  const now = useNow();
  const { level, progress } = levelFromExperience(profile.careerStart, now);
  const date = falloutDate(now, settings.lang);
  const time = falloutTime(now, settings.lang);
  const itemCount = Object.values(profile.inventory).reduce((n, list) => n + list.length, 0);

  const levelBox = (
    <div>
      <span>{t.footer.level} {level}</span>
      <span className="bar" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress * 100)}
        aria-label={`${t.footer.level} ${level}`}>
        <i style={{ width: `${Math.round(progress * 100)}%` }} />
      </span>
    </div>
  );

  let content: ReactNode;
  switch (tab) {
    case 'INV':
      content = (
        <>
          <div>⚖ {itemCount * 3}/250</div>
          <div><span className="grow" />✦ {t.item.caps} 744<span className="grow" /></div>
          <div>{t.item.dr} 90</div>
        </>
      );
      break;
    case 'DATA':
      content = (<><div>{date}</div>{levelBox}<div>{time}</div></>);
      break;
    case 'MAP':
      // The map footer shows the time at the location it names.
      content = (<><div>{date}</div><div><span className="grow" />{profile.location.split(',').slice(0, 2).join(',')}<span className="grow" /></div><div>{falloutTime(now, settings.lang, 'America/Bogota')}</div></>);
      break;
    default:
      content = (<><div>{t.footer.hp} 115/115</div>{levelBox}<div>{t.footer.ap} 90/90</div></>);
  }

  return <footer className="pip-footer">{content}</footer>;
}
