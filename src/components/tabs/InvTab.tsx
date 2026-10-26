import { useState } from 'react';
import { Play } from 'lucide-react';
import type { InvCategory, InvItem } from '../../data/types';
import { useListNav } from '../../hooks/useListNav';
import { usePip } from '../../state/pip';
import { soundEffects } from '../../utils/audio';
import Icon from '../Icon';
import SubTabs from '../SubTabs';

const CATEGORIES: InvCategory[] = ['weapons', 'apparel', 'aid', 'misc', 'holo', 'ammo'];

export default function InvTab() {
  const { t, subTab } = usePip();
  const category = CATEGORIES[subTab.INV] ?? 'weapons';
  return (
    <>
      <SubTabs tab="INV" labels={CATEGORIES.map(c => t.inv[c])} />
      {/* keyed so the selection resets when the category changes */}
      <ItemBrowser key={category} category={category} />
    </>
  );
}

function ItemBrowser({ category }: { category: InvCategory }) {
  const { t, profile, setOverlay, downloadCv } = usePip();
  const items = profile.inventory[category];
  const [index, setIndex] = useState(0);

  const activate = (item: InvItem) => {
    if (!item.action) return;
    soundEffects.confirm();
    if (item.action === 'download') downloadCv();
    else setOverlay(item.action);
  };

  const { detailRef, pick } = useListNav(items.length, index, setIndex, i => activate(items[i]));
  const item = items[Math.min(index, items.length - 1)];

  return (
    <div className="split">
      <div className="pane">
        <div className="plist" role="listbox" aria-label={t.inv[category]}>
          {items.map((it, i) => (
            <button key={it.id} type="button" role="option" className="plist-item" aria-selected={i === index}
              onClick={() => pick(i)} onDoubleClick={() => activate(it)}>
              <span className="marker" aria-hidden="true">{it.equipped ? '■' : ''}</span>
              <span className="label">{it.name}</span>
              {it.qty !== undefined && <span className="value">{it.qty}</span>}
              {it.equipped && <span className="sr-only">{t.item.equipped}</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="pane" ref={detailRef}>
        <article className="detail" aria-live="polite">
          <div className="detail-hero">
            <Icon name={item.icon} className="big-icon" />
          </div>
          <div>
            <div className="detail-kicker">{item.kind}{item.equipped ? ` · ${t.item.equipped}` : ''}</div>
            <h2 className="detail-title">{item.name}</h2>
          </div>
          <p className="detail-text">{item.description}</p>

          {item.action && (
            <div className="pbtn-row">
              <button type="button" className="pbtn solid" onClick={() => activate(item)}>
                <Play aria-hidden="true" />{t.item.play}
              </button>
            </div>
          )}

          {item.mods && item.mods.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <span className="section-label">{t.item.mods}</span>
              <div className="chips">{item.mods.map(m => <span key={m} className="chip">{m}</span>)}</div>
            </div>
          )}

          <div className="srows">
            {item.stats.map(s => (
              <div key={s.label} className="srow"><span>{s.label}</span><b>{s.value}</b></div>
            ))}
          </div>
        </article>
      </div>
    </div>
  );
}
