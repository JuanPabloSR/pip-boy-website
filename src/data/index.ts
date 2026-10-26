import type { Lang, Profile } from './types';
import es from './profile.es';
import en from './profile.en';

export const PROFILES: Record<Lang, Profile> = { es, en };

/** Whole months between careerStart (YYYY-MM) and `now`. */
export function monthsOfExperience(careerStart: string, now = new Date()): number {
  const [y, m] = careerStart.split('-').map(Number);
  return Math.max(0, (now.getFullYear() - y) * 12 + (now.getMonth() + 1 - m));
}

/**
 * Turns experience into a Fallout-style level: 1000 XP per month of work,
 * spent on a quadratic curve similar to Fallout 4's (75L² + 125L − 200).
 * The level therefore grows on its own as time passes.
 */
export function levelFromExperience(careerStart: string, now = new Date()) {
  const xp = monthsOfExperience(careerStart, now) * 1000;
  const needed = (l: number) => 75 * l * l + 125 * l - 200;
  let level = 1;
  while (needed(level + 1) <= xp) level++;
  const floor = needed(level);
  const ceil = needed(level + 1);
  return { level, xp, progress: (xp - floor) / (ceil - floor), nextAt: ceil };
}
