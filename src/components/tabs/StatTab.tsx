import { useState } from 'react';
import { cvPdfUrl } from '../../cv/pdf';
import { levelFromExperience } from '../../data';
import { useKeys } from '../../hooks/useKeys';
import { useListNav } from '../../hooks/useListNav';
import { usePip, type TabId } from '../../state/pip';
import { soundEffects } from '../../utils/audio';
import SubTabs from '../SubTabs';
import VaultBoy from '../VaultBoy';

export default function StatTab() {
  const { t, subTab } = usePip();
  const labels = [t.stat.status, t.stat.special, t.stat.perks];
  const active = subTab.STAT;
  return (
    <>
      <SubTabs tab="STAT" labels={labels} />
      {active === 0 && <Status />}
      {active === 1 && <Special />}
      {active === 2 && <Perks />}
    </>
  );
}

/** FO4-style button prompt: a key cap plus a label, clickable like a link. */
function Prompt({ k, label, href, download, onClick, primary }: {
  k: string; label: string; href?: string; download?: boolean; onClick?: () => void; primary?: boolean;
}) {
  const cls = `prompt ${primary ? 'primary' : ''}`;
  const body = (<><kbd>{k}</kbd>{label}</>);
  if (href) {
    const external = href.startsWith('http');
    return (
      <a className={cls} href={href} download={download || undefined} onClick={onClick} aria-keyshortcuts={k}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
        {body}
      </a>
    );
  }
  return <button type="button" className={cls} onClick={onClick} aria-keyshortcuts={k}>{body}</button>;
}

function Status() {
  const { t, profile, setTab, settings, overlay, downloadCv } = usePip();
  const go = (tab: TabId) => { soundEffects.tabSwitch(); setTab(tab); };

  // Shortcuts for the prompts below.
  useKeys(e => {
    const key = e.key.toLowerCase();
    if (e.repeat) return;
    if (key === 'c') { soundEffects.confirm(); downloadCv(); }
    else if (key === 'm') window.location.href = `mailto:${profile.email}`;
    else if (key === 'l') window.open(profile.linkedin, '_blank', 'noopener');
    else if (key === 'g') window.open(profile.github, '_blank', 'noopener');
  }, overlay === null);

  const { level, progress } = levelFromExperience(profile.careerStart);
  const special = Object.fromEntries(profile.special.map(s => [s.letter, s.value * 10]));
  const limbs: [string, number][][] = [
    [[t.status.limbs.head, special.I], [t.status.limbs.lArm, special.S], [t.status.limbs.lLeg, special.E]],
    [[t.status.limbs.torso, special.P], [t.status.limbs.rArm, special.A], [t.status.limbs.rLeg, special.L]],
  ];
  const questsDone = profile.quests.filter(q => q.status === 'done').length;

  return (
    <div className="status">
      <section className="dweller" aria-labelledby="dweller-name">
        <div>
          <div className="section-label">// {t.status.bio}</div>
          <h1 id="dweller-name" className="dweller-name">{profile.name}</h1>
          <div className="dweller-title">{profile.title}</div>
          <div className="dweller-meta">{profile.headline}</div>
          <div className="dweller-meta" style={{ marginTop: '0.2rem' }}>
            {t.status.vaultId}: {profile.shortName}-744 · {profile.location}
          </div>
          <a className="dweller-email" href={`mailto:${profile.email}`}>✉ {profile.email}</a>
        </div>

        <div className="prompts">
          <Prompt k="C" label={t.status.printCv} href={cvPdfUrl(settings.lang)} download primary onClick={() => soundEffects.confirm()} />
          <Prompt k="M" label={t.status.email} href={`mailto:${profile.email}`} />
          <Prompt k="L" label={t.status.linkedin} href={profile.linkedin} />
          <Prompt k="G" label="GitHub" href={profile.github} />
        </div>

        <div className="kpis">
          <div className="kpi"><b>4+</b><span>{t.status.years}</span></div>
          <div className="kpi"><b>2</b><span>{t.status.companies}</span></div>
          <div className="kpi"><b>{profile.perks.length}</b><span>{t.status.perks}</span></div>
          <div className="kpi"><b>{questsDone}</b><span>{t.status.quests}</span></div>
        </div>

        {profile.summary.map((p, i) => <p key={i} className="detail-text">{p}</p>)}

        <nav className="guide" aria-label={t.status.guide}>
          <span className="section-label">{t.status.guide}</span>
          <button type="button" onClick={() => go('INV')}>INV · {t.status.guideInv}</button>
          <button type="button" onClick={() => go('DATA')}>DATA · {t.status.guideData}</button>
          <button type="button" onClick={() => go('MAP')}>MAP · {t.status.guideMap}</button>
          <button type="button" onClick={() => go('RADIO')}>RADIO · {t.status.guideRadio}</button>
        </nav>
      </section>

      <section className="figure" aria-label={`${t.status.level} ${level}`}>
        {limbs.map((col, c) => (
          <div key={c} style={{ gridColumn: c === 0 ? 1 : 3, gridRow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-around', height: '100%', width: '100%', alignItems: c === 0 ? 'flex-end' : 'flex-start' }}>
            {col.map(([label, value]) => (
              <div key={label} className="limb">
                <span>{label}</span>
                <span className="bar" role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={value} aria-label={label}>
                  <i style={{ width: `${value}%` }} />
                </span>
              </div>
            ))}
          </div>
        ))}
        <div className="figure-img">
          <VaultBoy name={['status', 'thumbs-up']} />
        </div>
        <div className="figure-caption" style={{ gridColumn: '1 / 4', gridRow: 2 }}>
          {profile.shortName} · {t.status.level} {level} · {Math.round(progress * 100)}% → {level + 1}
        </div>
      </section>
    </div>
  );
}

function Special() {
  const { t, profile } = usePip();
  const [index, setIndex] = useState(0);
  const { detailRef, pick } = useListNav(profile.special.length, index, setIndex);
  const s = profile.special[index];

  return (
    <div className="split">
      <div className="pane">
        <div className="plist" role="listbox" aria-label="S.P.E.C.I.A.L.">
          {profile.special.map((attr, i) => (
            <button key={attr.letter} type="button" role="option" className="plist-item" aria-selected={i === index} onClick={() => pick(i)}>
              <span className="label">
                {attr.attribute}
                <small>{attr.skill}</small>
              </span>
              <span className="value" style={{ fontSize: '1.4rem' }}>{attr.value}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="pane" ref={detailRef}>
        <article className="detail" aria-live="polite">
          <div className="special-hero">
            <span className="special-letter" aria-hidden="true">{s.letter}</span>
            <VaultBoy name={[`special-${s.letter.toLowerCase()}`, 'thumbs-up']} />
          </div>
          <div>
            <h2 className="detail-title">{s.attribute} · {s.skill}</h2>
          </div>
          <div className="segbar" role="meter" aria-valuemin={0} aria-valuemax={10} aria-valuenow={s.value} aria-label={t.special.points}>
            {Array.from({ length: 10 }, (_, i) => <i key={i} className={i < s.value ? 'on' : ''} />)}
            <b style={{ marginLeft: '0.5rem', fontSize: '1.3rem' }}>{s.value}</b>
          </div>
          <p className="detail-text">{s.description}</p>
          <div className="chips">{s.tags.map(tag => <span key={tag} className="chip">{tag}</span>)}</div>
        </article>
      </div>
    </div>
  );
}

function Stars({ rank, max }: { rank: number; max: number }) {
  return (
    <span className="stars" aria-hidden="true">
      {Array.from({ length: max }, (_, i) => <i key={i} className={i < rank ? 'on' : ''}>★</i>)}
    </span>
  );
}

function Perks() {
  const { t, profile } = usePip();
  const [index, setIndex] = useState(0);
  const { detailRef, pick } = useListNav(profile.perks.length, index, setIndex);
  const perk = profile.perks[index];

  return (
    <div className="split">
      <div className="pane">
        <div className="plist" role="listbox" aria-label={t.stat.perks}>
          {profile.perks.map((p, i) => (
            <button key={p.id} type="button" role="option" className="plist-item" aria-selected={i === index} onClick={() => pick(i)}>
              <span className="label">{p.name}</span>
              <span className="value"><Stars rank={p.rank} max={p.maxRank} /></span>
            </button>
          ))}
        </div>
      </div>

      <div className="pane" ref={detailRef}>
        <article className="detail" aria-live="polite">
          <div className="special-hero">
            <VaultBoy name={[`perk-${perk.id}`, 'walk']} />
          </div>
          <h2 className="detail-title">{perk.name}</h2>
          <div className="srows">
            <div className="srow">
              <span>{t.perks.rank}</span>
              <b>{perk.rank}/{perk.maxRank} <Stars rank={perk.rank} max={perk.maxRank} /></b>
            </div>
          </div>
          <p className="detail-text">{perk.description}</p>
        </article>
      </div>
    </div>
  );
}
