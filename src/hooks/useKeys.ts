import { useEffect, useRef } from 'react';

const TEXT_INPUTS = new Set(['text', 'search', 'email', 'url', 'tel', 'password', 'number']);
const NAV_KEYS = new Set(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End', 'PageUp', 'PageDown']);

/** True when the keystroke belongs to a form control rather than to the Pip-Boy. */
function ownedByField(target: EventTarget | null, key: string) {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') return true;
  if (target instanceof HTMLInputElement) {
    // Sliders and checkboxes only need the navigation keys; letters stay shortcuts.
    return TEXT_INPUTS.has(target.type) || NAV_KEYS.has(key);
  }
  return false;
}

/** Links and controls handle Enter/Space themselves. */
export function isInteractive(target: EventTarget | null) {
  return target instanceof Element && !!target.closest('a[href], button, input, select, textarea, [role="button"]');
}

/**
 * Window-level keyboard shortcut handler. Ignores keystrokes while the user is
 * typing in a field or holding a modifier, so browser shortcuts keep working.
 * AltGr (reported as Ctrl+Alt on Windows) is allowed, since layouts such as
 * Spanish need it to type characters like ~.
 */
export function useKeys(handler: (e: KeyboardEvent) => void, enabled = true) {
  const latest = useRef(handler);
  useEffect(() => {
    latest.current = handler;
  });

  useEffect(() => {
    if (!enabled) return;
    const onKey = (e: KeyboardEvent) => {
      const altGr = e.getModifierState?.('AltGraph');
      if (e.defaultPrevented || e.metaKey || (!altGr && (e.ctrlKey || e.altKey)) || ownedByField(e.target, e.key)) return;
      latest.current(e);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [enabled]);
}
