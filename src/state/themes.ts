import type { RadioGame } from '../data/types';

export type ThemeId = 'fo4' | 'fo3' | 'nv' | 'vault' | 'white';

/** Pip-Boy screen colors from across the series. */
export const THEMES: { id: ThemeId; label: string; rgb: [number, number, number] }[] = [
  { id: 'fo4', label: 'Fallout 4', rgb: [20, 248, 20] },
  { id: 'fo3', label: 'Fallout 3', rgb: [26, 255, 128] },
  { id: 'nv', label: 'New Vegas', rgb: [255, 182, 66] },
  { id: 'vault', label: 'Vault-Tec', rgb: [46, 207, 255] },
  { id: 'white', label: 'Mk VI', rgb: [222, 242, 232] },
];

export const themeRgb = (id: ThemeId) => (THEMES.find(t => t.id === id) ?? THEMES[0]).rgb;

/** Which game's stations the radio carries under each theme; the non-game themes use Fallout 4's. */
export const themeGame = (id: ThemeId): RadioGame => (id === 'fo3' || id === 'nv' ? id : 'fo4');
