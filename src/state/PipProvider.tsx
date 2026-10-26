import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { PROFILES } from '../data';
import { UI } from '../i18n/ui';
import { setSfxEnabled } from '../utils/audio';
import { readStorage, writeStorage } from '../utils/storage';
import { PipContext, TABS, type Overlay, type PipState, type Settings, type TabId } from './pip';
import { THEMES, themeRgb } from './themes';

const SETTINGS_KEY = 'pipboy:settings';

function defaultSettings(): Settings {
  const prefersEnglish = typeof navigator !== 'undefined' && /^en\b/i.test(navigator.language);
  return { lang: prefersEnglish ? 'en' : 'es', theme: 'fo4', sfx: true, crt: true, font: 'pip', volume: 0.5 };
}

function loadSettings(): Settings {
  const base = defaultSettings();
  const stored = readStorage<Partial<Settings>>(SETTINGS_KEY);
  if (!stored) return base;
  const merged = { ...base, ...stored };
  // Guard against stale or hand-edited values.
  if (merged.lang !== 'es' && merged.lang !== 'en') merged.lang = base.lang;
  if (!THEMES.some(t => t.id === merged.theme)) merged.theme = base.theme;
  if (merged.font !== 'pip' && merged.font !== 'term') merged.font = base.font;
  merged.volume = Math.min(1, Math.max(0, Number(merged.volume) || 0));
  return merged;
}

function tabFromHash(): TabId {
  const hash = window.location.hash.replace('#', '').toUpperCase();
  return (TABS as string[]).includes(hash) ? (hash as TabId) : 'STAT';
}

export default function PipProvider({ children, onReboot }: { children: ReactNode; onReboot: () => void }) {
  const [settings, setSettings] = useState<Settings>(loadSettings);
  const [tab, setTabState] = useState<TabId>(tabFromHash);
  const [subTab, setSubTabs] = useState<Record<TabId, number>>({ STAT: 0, INV: 0, DATA: 0, MAP: 0, RADIO: 0 });
  const [overlay, setOverlay] = useState<Overlay>(null);

  const updateSettings = useCallback((patch: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...patch }));
  }, []);

  // Persist and apply settings to the document.
  useEffect(() => {
    writeStorage(SETTINGS_KEY, settings);
    const root = document.documentElement;
    root.style.setProperty('--pip-rgb', themeRgb(settings.theme).join(' '));
    root.dataset.crt = settings.crt ? 'on' : 'off';
    root.dataset.font = settings.font;
    root.lang = settings.lang;
    setSfxEnabled(settings.sfx);
  }, [settings]);

  const setTab = useCallback((next: TabId) => {
    setTabState(next);
    window.history.replaceState(null, '', `#${next.toLowerCase()}`);
  }, []);

  useEffect(() => {
    const onHash = () => setTabState(tabFromHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const setSubTab = useCallback((t: TabId, index: number) => {
    setSubTabs(prev => (prev[t] === index ? prev : { ...prev, [t]: index }));
  }, []);

  const printCv = useCallback(() => {
    setOverlay(null);
    // Let the overlay unmount before the print snapshot is taken.
    window.setTimeout(() => window.print(), 50);
  }, []);

  const reboot = useCallback(() => {
    setOverlay(null);
    onReboot();
  }, [onReboot]);

  const value = useMemo<PipState>(() => ({
    settings,
    updateSettings,
    profile: PROFILES[settings.lang],
    t: UI[settings.lang],
    tab,
    setTab,
    subTab,
    setSubTab,
    overlay,
    setOverlay,
    printCv,
    reboot,
  }), [settings, updateSettings, tab, setTab, subTab, setSubTab, overlay, printCv, reboot]);

  return <PipContext.Provider value={value}>{children}</PipContext.Provider>;
}
