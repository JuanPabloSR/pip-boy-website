// localStorage can be missing or throw (private mode, blocked cookies), so every
// access is wrapped and failures simply fall back to defaults.

export function readStorage<T>(key: string, storage: 'local' | 'session' = 'local'): T | null {
  try {
    const raw = (storage === 'local' ? window.localStorage : window.sessionStorage).getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function writeStorage(key: string, value: unknown, storage: 'local' | 'session' = 'local') {
  try {
    (storage === 'local' ? window.localStorage : window.sessionStorage).setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}
