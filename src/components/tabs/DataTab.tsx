import { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { levelFromExperience, monthsOfExperience } from '../../data';
import { useListNav } from '../../hooks/useListNav';
import { useNow } from '../../hooks/useNow';
import { usePip } from '../../state/pip';
import SubTabs from '../SubTabs';
import VaultBoy from '../VaultBoy';

export default function DataTab() {
  const { t, subTab } = usePip();
  const active = subTab.DATA;
  return (
    <>
      <SubTabs tab="DATA" labels={[t.data.quests, t.data.workshops, t.data.stats]} />
      {active === 0 && <Quests />}
      {active === 1 && <Workshops />}
      {active === 2 && <Stats />}
    </>
  );
}

function Quests() {
  const { t, profile } = usePip();
  // Career first, then education, each group keeping data order.
  const quests = [...profile.quests.filter(q => q.group === 'main'), ...profile.quests.filter(q => q.group === 'side')];
  const [index, setIndex] = useState(0);
  const { detailRef, pick } = useListNav(quests.length, index, setIndex);
  const q = quests[index];

  return (
    <div className="split">
      <div className="pane">
        <div className="plist" role="listbox" aria-label={t.data.quests}>
          {quests.map((quest, i) => (
            <div key={quest.id} style={{ display: 'contents' }}>
              {(i === 0 || quests[i - 1].group !== quest.group) && (
                <div className="plist-group" role="presentation">{quest.group === 'main' ? t.quests.main : t.quests.side}</div>
              )}
              <button type="button" role="option" className="plist-item" aria-selected={i === index} onClick={() => pick(i)}>
                <span className={`marker ${quest.status === 'active' ? 'pulse' : ''}`} aria-hidden="true">
                  {quest.status === 'active' ? '◆' : '✓'}
                </span>
                <span className="label">
                  {quest.title}
                  <small>{[quest.org !== quest.title ? quest.org : quest.role, quest.period].filter(Boolean).join(' · ')}</small>
                </span>
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="pane" ref={detailRef}>
        <article className="detail" aria-live="polite">
          <div>
            <div className="detail-kicker">
              {q.group === 'main' ? t.quests.main : t.quests.side} · {q.status === 'active' ? t.quests.active : t.quests.done}
            </div>
            <h2 className="detail-title">{q.title}</h2>
            {q.role && <div className="dweller-title" style={{ fontSize: '1.05rem', marginTop: '0.2rem' }}>{q.role}</div>}
            {q.org !== q.title && <div className="dweller-title" style={{ fontSize: '1.05rem', marginTop: '0.2rem' }}>{q.org}</div>}
          </div>

          {(q.period || q.location) && (
            <div className="srows">
              {q.period && <div className="srow"><span>{t.quests.period}</span><b>{q.period}</b></div>}
              {q.location && <div className="srow"><span>{t.quests.location}</span><b>{q.location}</b></div>}
            </div>
          )}

          <p className="detail-text">{q.summary}</p>

          <div className="objectives">
            <span className="section-label">{t.quests.objectives}</span>
            {q.stages.map((stage, si) => (
              <div key={si} className="objectives">
                {stage.heading && <div className="stage-heading">{stage.heading}</div>}
                {stage.objectives.map((o, oi) => (
                  <div key={oi} className={`objective ${o.done ? 'done' : ''}`}>
                    <span className={`box ${o.done ? '' : 'pulse'}`} aria-hidden="true" />
                    <span>{o.text}<span className="sr-only"> ({o.done ? t.quests.done : t.quests.active})</span></span>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {q.rewards && q.rewards.length > 0 && (
            <div className="objectives">
              <span className="section-label">{t.quests.rewards}</span>
              {q.rewards.map((r, i) => <div key={i} className="reward">{r}</div>)}
            </div>
          )}
        </article>
      </div>
    </div>
  );
}

function Workshops() {
  const { t, profile } = usePip();
  const [index, setIndex] = useState(0);
  const { detailRef, pick } = useListNav(profile.workshops.length, index, setIndex);
  const w = profile.workshops[index];

  return (
    <div className="split">
      <div className="pane">
        <div className="plist" role="listbox" aria-label={t.data.workshops}>
          {profile.workshops.map((ws, i) => (
            <button key={ws.id} type="button" role="option" className="plist-item" aria-selected={i === index} onClick={() => pick(i)}>
              <span className="label">
                {ws.name}
                <small>{ws.type}</small>
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="pane" ref={detailRef}>
        <article className="detail" aria-live="polite">
          <div>
            <div className="detail-kicker">{w.type}</div>
            <h2 className="detail-title">{w.name}</h2>
          </div>
          <div className="srows">
            <div className="srow"><span>{t.workshops.type}</span><b>{w.type}</b></div>
            <div className="srow"><span>{t.workshops.status}</span><b>{w.status}</b></div>
          </div>
          <p className="detail-text">{w.description}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <span className="section-label">{t.workshops.stack}</span>
            <div className="chips">{w.stack.map(s => <span key={s} className="chip">{s}</span>)}</div>
          </div>
          <div className="objectives">
            <span className="section-label">{t.workshops.highlights}</span>
            {w.highlights.map(h => <div key={h} className="reward">{h}</div>)}
          </div>
          {w.url && (
            <div className="pbtn-row">
              <a className="pbtn" href={w.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink aria-hidden="true" />{t.workshops.open}
              </a>
            </div>
          )}
        </article>
      </div>
    </div>
  );
}

function Stats() {
  const { t, profile, settings } = usePip();
  const now = useNow(60_000);
  const months = monthsOfExperience(profile.careerStart, now);
  const [y, m] = profile.careerStart.split('-').map(Number);
  const days = Math.floor((now.getTime() - new Date(y, m - 1, 1).getTime()) / 86_400_000);
  const { level, xp } = levelFromExperience(profile.careerStart, now);
  const nf = new Intl.NumberFormat(settings.lang === 'es' ? 'es-CO' : 'en-US');
  const items = Object.values(profile.inventory).reduce((n, list) => n + list.length, 0);

  const live = [
    { label: t.stats.days, value: nf.format(days) },
    { label: t.stats.coffee, value: nf.format(Math.round(days * 2.2)) },
    { label: t.stats.level, value: String(level) },
    { label: t.stats.xp, value: `${nf.format(xp)} XP (${months} m)` },
    { label: t.stats.questsDone, value: String(profile.quests.filter(q => q.status === 'done').length) },
    { label: t.stats.perks, value: String(profile.perks.length) },
    { label: t.stats.items, value: String(items) },
  ];

  return (
    <div className="split wide-right">
      <div className="pane flex" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ height: 'clamp(180px, 40vh, 380px)' }}>
          <VaultBoy name={['stats', 'walk']} />
        </div>
      </div>
      <div className="pane">
        <div className="stat-table">
          {profile.stats.map(group => (
            <div key={group.heading} className="srows" style={{ marginBottom: '0.8rem' }}>
              <span className="section-label" style={{ marginBottom: '0.3rem' }}>{group.heading}</span>
              {group.lines.map(l => <div key={l.label} className="srow"><span>{l.label}</span><b>{l.value}</b></div>)}
            </div>
          ))}
          <div className="srows">
            <span className="section-label" style={{ marginBottom: '0.3rem' }}>{t.stats.progress}</span>
            {live.map(l => <div key={l.label} className="srow"><span>{l.label}</span><b>{l.value}</b></div>)}
          </div>
        </div>
      </div>
    </div>
  );
}
