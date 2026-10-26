import { useCallback, useRef } from 'react';
import { usePip } from '../state/pip';
import { soundEffects } from '../utils/audio';
import { isInteractive, useKeys } from './useKeys';

const SMALL_SCREEN = '(max-width: 860px)';

/**
 * W/S and ↑/↓ move the selection of a Pip-Boy list; Enter runs `onActivate`.
 * Also returns a ref for the detail pane plus a click helper that, on phones,
 * scrolls that pane into view after picking an item.
 */
export function useListNav(count: number, index: number, setIndex: (i: number) => void, onActivate?: (i: number) => void) {
  const { overlay } = usePip();
  const detailRef = useRef<HTMLDivElement>(null);

  useKeys(e => {
    const key = e.key.toLowerCase();
    if (key === 'w' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (index > 0) {
        setIndex(index - 1);
        soundEffects.hover();
      }
    } else if (key === 's' || e.key === 'ArrowDown') {
      e.preventDefault();
      if (index < count - 1) {
        setIndex(index + 1);
        soundEffects.hover();
      }
    } else if (e.key === 'Enter' && onActivate && !isInteractive(e.target)) {
      e.preventDefault();
      onActivate(index);
    }
  }, overlay === null && count > 0);

  const pick = useCallback((i: number) => {
    setIndex(i);
    soundEffects.hover();
    if (window.matchMedia(SMALL_SCREEN).matches) {
      window.setTimeout(() => detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 30);
    }
  }, [setIndex]);

  return { detailRef, pick };
}
