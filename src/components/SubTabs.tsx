import { useKeys } from '../hooks/useKeys';
import { usePip, type TabId } from '../state/pip';
import { soundEffects } from '../utils/audio';

/** Second-level navigation of a tab. A/D or ←/→ cycle through it. */
export default function SubTabs({ tab, labels }: { tab: TabId; labels: string[] }) {
  const { subTab, setSubTab, overlay } = usePip();
  const active = Math.min(subTab[tab], labels.length - 1);

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
    <div className="subtabs" role="tablist" aria-label={tab}>
      {labels.map((label, i) => (
        <button
          key={label}
          type="button"
          role="tab"
          className="subtab"
          aria-selected={i === active}
          onClick={() => go(i)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
