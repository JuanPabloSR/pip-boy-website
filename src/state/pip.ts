import { createContext, useContext } from 'react';
import type { Lang, Profile } from '../data/types';
import type { UiStrings } from '../i18n/ui';
import type { ThemeId } from './themes';

export type TabId = 'STAT' | 'INV' | 'DATA' | 'MAP' | 'RADIO';
export const TABS: TabId[] = ['STAT', 'INV', 'DATA', 'MAP', 'RADIO'];

export type Overlay = null | 'settings' | 'terminal' | 'hack';

export interface Settings {
  lang: Lang;
  theme: ThemeId;
  sfx: boolean;
  crt: boolean;
  font: 'pip' | 'term';
  volume: number;
}

export interface PipState {
  settings: Settings;
  updateSettings: (patch: Partial<Settings>) => void;
  profile: Profile;
  t: UiStrings;
  tab: TabId;
  setTab: (tab: TabId) => void;
  /** Sub-tab per main tab, kept here so it survives tab switches. */
  subTab: Record<TabId, number>;
  setSubTab: (tab: TabId, index: number) => void;
  overlay: Overlay;
  setOverlay: (o: Overlay) => void;
  printCv: () => void;
  /** Downloads the pre-rendered PDF in the current language. */
  downloadCv: () => void;
  reboot: () => void;
}

export const PipContext = createContext<PipState | null>(null);

export function usePip(): PipState {
  const ctx = useContext(PipContext);
  if (!ctx) throw new Error('usePip must be used inside <PipProvider>');
  return ctx;
}
