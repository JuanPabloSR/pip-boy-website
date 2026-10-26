import { useEffect, useState } from 'react';

/** Current time, refreshed every `intervalMs`. */
export function useNow(intervalMs = 30_000) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs]);
  return now;
}

/** Fallout 4 takes place in 2287: exactly 261 years after 2026. */
export const FALLOUT_YEAR_OFFSET = 261;

export function falloutDate(now: Date, lang: 'es' | 'en') {
  const dd = String(now.getDate()).padStart(2, '0');
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const yyyy = now.getFullYear() + FALLOUT_YEAR_OFFSET;
  return lang === 'es' ? `${dd}.${mm}.${yyyy}` : `${mm}.${dd}.${yyyy}`;
}

export function falloutTime(now: Date, lang: 'es' | 'en', timeZone?: string) {
  return now.toLocaleTimeString(lang === 'es' ? 'es-CO' : 'en-US', { hour: 'numeric', minute: '2-digit', timeZone }).toUpperCase();
}
