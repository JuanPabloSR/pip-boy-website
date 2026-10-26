import { useEffect, useRef } from 'react';
import { useKeys } from '../hooks/useKeys';
import { usePip, type TabId } from '../state/pip';
import { soundEffects } from '../utils/audio';

/** Second-level navigation of a tab. A/D or ←/→ cycle through it. */
export default function SubTabs({ tab, labels }: { tab: TabId; labels: string[] }) {
  const { subTab, setSubTab, overlay } = usePip();
  const active = Math.min(subTab[tab], labels.length - 1);
  const listRef = useRef<HTMLDivElement>(null);

  // Keep the active sub-tab visible when the row overflows (phones).
  useEffect(() => {
    const list = listRef.current;
    const btn = list?.children[active] as HTMLElement | undefined;
    if (!list || !btn || list.scrollWidth <= list.clientWidth) return;
    list.scrollTo({ left: btn.offsetLeft - (list.clientWidth - btn.offsetWidth) / 2, behavior: 'smooth' });
  }, [active]);

  const go = (i: number) => {
    if (i === active) return;
    soundEffects.subTabSwitch();
    setSubTab(tab, i);
  };

  useKeys(e => {
    const key = e.key.toLowerCase();
    if (key === 'a' || e.key === 'ArrowLeft') go((active - 1 + labels.length) % labels.length);
    else if (key === 'd' || e.key === 'ArrowRight') go((active + 1) % labels.length);
  }, overlay === null && labels.length > 1);

  return (
    <div ref={listRef} className="subtabs" role="tablist" aria-label={tab}>
      {labels.map((label, i) => (
        <button
          key={label}
          type="button"
          role="tab"
          className="subtab"
          aria-selected={i === active}
          // Like FO4, sub-tabs fade out the further they are from the active one.
          style={{ opacity: i === active ? 1 : Math.max(0.35, 0.8 - 0.15 * Math.abs(i - active)) }}
          onClick={() => go(i)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
