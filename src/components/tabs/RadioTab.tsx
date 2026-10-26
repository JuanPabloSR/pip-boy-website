import { useEffect, useRef, useState } from 'react';
import { Pause, Play, SkipForward } from 'lucide-react';
import { isInteractive, useKeys } from '../../hooks/useKeys';
import { useListNav } from '../../hooks/useListNav';
import { usePip } from '../../state/pip';
import { useRadio, type RadioState } from '../../state/radio';
import { toMorse } from '../../utils/morse';

export default function RadioTab() {
  const { t, settings, updateSettings, overlay } = usePip();
  const radio = useRadio();
  const stations = radio.stations;
  const [index, setIndex] = useState(() => Math.max(0, stations.findIndex(s => s.id === radio.stationId)));
  const { detailRef } = useListNav(stations.length, index, setIndex, i => {
    if (stations[i].id === radio.stationId) radio.toggle();
    else radio.tune(stations[i].id);
  });

  useKeys(e => {
    if (e.key === ' ' && !isInteractive(e.target)) {
      e.preventDefault();
      radio.toggle();
    }
  }, overlay === null);

  const current = stations.find(s => s.id === radio.stationId);
  const shown = current ?? stations[index];
  const { track } = radio;

  const statusText =
    radio.status === 'playing' ? t.radio.onAir :
    radio.status === 'loading' ? `${t.radio.loading}...` :
    radio.status === 'error' ? t.radio.lost : t.radio.off;

  return (
    <div className="split" style={{ marginTop: '0.4rem' }}>
      <div className="pane flex" style={{ gap: '0.6rem' }}>
        <span className="section-label">// {t.radio.stations}</span>
        <div className="plist" role="listbox" aria-label={t.radio.stations}>
          {stations.map((s, i) => {
            const live = s.id === radio.stationId && radio.playing;
            return (
              <button key={s.id} type="button" role="option" className="plist-item" aria-selected={i === index}
                onClick={() => { setIndex(i); if (live) radio.toggle(); else radio.tune(s.id); }}>
                <span className="marker" aria-hidden="true">{live ? '■' : ''}</span>
                <span className="label">
                  {s.name}
                  <small>{s.freq} FM{s.morse ? ` · ${t.radio.procedural}` : ''}</small>
                </span>
              </button>
            );
          })}
        </div>
        <p className="detail-text" style={{ fontSize: '0.92rem' }}>{stations[index].description}</p>
      </div>

      <div className="pane flex" ref={detailRef} style={{ gap: '0.8rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <div>
            <div className="section-label">{t.radio.tuner}</div>
            <div className="freq">{shown.freq} <span style={{ fontSize: '0.45em' }}>FM</span></div>
          </div>
          <div className={radio.status === 'playing' || radio.status === 'loading' ? 'pulse' : ''}
            style={{ textTransform: 'uppercase', letterSpacing: '0.08em', opacity: radio.status === 'idle' ? 0.55 : 1 }}
            role="status">
            {radio.status === 'playing' ? '▶ ' : '■ '}{statusText}
          </div>
        </div>

        <Oscilloscope radio={radio} morse={!!current?.morse} />

        <div style={{ minHeight: '3.2rem' }}>
          {current?.morse ? (
            <MorseTape radio={radio} text={current.morse} label={t.radio.decoded} />
          ) : (
            <>
              <div className="section-label">{t.radio.nowPlaying}</div>
              <div style={{ fontSize: '1.1rem', textTransform: 'uppercase' }}>
                {track && radio.status === 'playing' ? [track.title, track.artist].filter(Boolean).join(' — ') : radio.status === 'loading' ? `${t.radio.loading}...` : '—'}
              </div>
            </>
          )}
        </div>

        <div className="pbtn-row">
          <button type="button" className="pbtn solid" onClick={radio.toggle}>
            {radio.playing ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
            {radio.playing ? t.radio.stop : t.radio.play}
          </button>
          <button type="button" className="pbtn" onClick={() => {
            radio.nextStation();
            const i = stations.findIndex(s => s.id === radio.stationId);
            setIndex((i + 1) % stations.length);
          }}>
            <SkipForward aria-hidden="true" />{t.radio.next}
          </button>
        </div>

        <label className="volume">
          <span>{t.radio.volume}</span>
          <input type="range" min={0} max={1} step={0.05} value={settings.volume}
            onChange={e => updateSettings({ volume: Number(e.target.value) })} />
          <span style={{ width: '3ch', textAlign: 'right' }}>{Math.round(settings.volume * 100)}</span>
        </label>
      </div>
    </div>
  );
}

/** FO4-style waveform on a grid. The shape is synthesized; Morse tones are drawn from live timing. */
function Oscilloscope({ radio, morse }: { radio: RadioState; morse: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const live = useRef({ radio, morse });
  useEffect(() => {
    live.current = { radio, morse };
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let frame = 0;
    let raf = 0;
    let idle = 0;
    let rgb = '20 248 20';
    let amp = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const draw = (time: number) => {
      const { radio: r, morse: isMorse } = live.current;
      if (frame++ % 30 === 0) rgb = getComputedStyle(document.documentElement).getPropertyValue('--pip-rgb').trim() || rgb;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      const mid = h / 2;
      ctx.clearRect(0, 0, w, h);

      let target = 0;
      let freq = 3;
      let noise = 0.02;
      if (r.playing) {
        if (isMorse) {
          const probe = r.probeMorse();
          target = probe?.on ? 0.75 : 0;
          freq = 14;
          noise = 0.06;
        } else if (r.status === 'playing') {
          target = 0.35 + 0.3 * Math.abs(Math.sin(time / 900)) + 0.15 * Math.sin(time / 230);
          freq = 2.5 + Math.sin(time / 1700);
        } else {
          target = 0;
          noise = 0.25; // static while tuning / no signal
        }
      }
      amp += (target - amp) * 0.25;

      ctx.lineWidth = 2;
      ctx.strokeStyle = `rgb(${rgb})`; // the glow is a CSS drop-shadow on the canvas
      ctx.beginPath();
      const phase = time / 140;
      for (let x = 0; x <= w; x += 2) {
        const u = x / w;
        const y = Math.sin(u * Math.PI * 2 * freq + phase) * amp * 0.42
          + Math.sin(u * Math.PI * 2 * freq * 2.7 - phase * 1.3) * amp * 0.12
          + (Math.random() - 0.5) * noise;
        const py = mid - y * h * 0.9;
        if (x === 0) ctx.moveTo(x, py);
        else ctx.lineTo(x, py);
      }
      ctx.stroke();
      // Full frame rate only while something plays; a few frames per second otherwise.
      if (r.playing || amp > 0.01) raf = requestAnimationFrame(draw);
      else idle = window.setTimeout(() => { raf = requestAnimationFrame(draw); }, 250);
    };
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(idle);
      ro.disconnect();
    };
  }, []);

  return (
    <div className="scope" aria-hidden="true">
      <canvas ref={canvasRef} />
      <div className="scope-ticks">{[...'0123456789'].map(n => <span key={n}>{n}</span>)}</div>
    </div>
  );
}

/** Shows the beacon's message being keyed out letter by letter. */
function MorseTape({ radio, text, label }: { radio: RadioState; text: string; label: string }) {
  const [charIndex, setCharIndex] = useState(-1);
  useEffect(() => {
    if (!radio.playing) return;
    let raf = 0;
    let last = -2;
    const tick = () => {
      const probe = radio.probeMorse();
      const next = probe?.charIndex ?? -1;
      if (next !== last) {
        last = next;
        setCharIndex(next);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [radio]);

  const current = charIndex >= 0 ? text[charIndex] : '';
  return (
    <>
      <div className="section-label">{label}</div>
      <div className="morse-tape" aria-label={text}>
        <span>{text.slice(0, charIndex + 1)}</span>
        <span className="dim">{text.slice(charIndex + 1)}</span>
      </div>
      <div className="morse-tape" style={{ fontSize: '0.95rem', opacity: 0.75 }} aria-hidden="true">
        {current && current !== ' ' ? `${current}  ${toMorse(current)}` : ' '}
      </div>
    </>
  );
}
