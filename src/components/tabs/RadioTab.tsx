import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import danceGif from '../../assets/vaultboy-dance.gif';
import VaultBoyDisplay from '../VaultBoyDisplay';
import { useAudio } from '../../App';
import { soundEffects } from '../../utils/audio';

const GREEN = '#14F814';
const BLACK = '#000000';

const STATIONS = [
  {
    id: 1, freq: '87.3 FM',
    name: 'Galaxy News Radio (FO3)',
    desc: 'Reproduciendo: "I Don\'t Want to Set the World on Fire" - The Ink Spots. Porque el Yermo necesita clásicos.',
    signal: 92,
    audioSrc: 'https://archive.org/download/Fallout_3_galaxy_news_radio-2008/The%20Ink%20Spots%20-%20I%20Don%27t%20Want%20to%20Set%20the%20World%20on%20Fire.mp3'
  },
  {
    id: 2, freq: '101.7 FM',
    name: 'Diamond City Radio (FO4)',
    desc: 'Reproduciendo: "Civilization" (Bongo, Bongo, Bongo) - Danny Kaye. Noticias y música desde la Gran Joya Verde.',
    signal: 78,
    audioSrc: 'https://archive.org/download/Fallout_3_galaxy_news_radio-2008/Danny%20Kaye%20and%20The%20Andrews%20Sisters%20-%20Civilization.mp3'
  },
  {
    id: 3, freq: '107.9 FM',
    name: 'Radio New Vegas (FNV)',
    desc: 'Reproduciendo: "Anything Goes" - Cole Porter. El Sr. New Vegas te ama.',
    signal: 85,
    audioSrc: 'https://archive.org/download/Fallout_3_galaxy_news_radio-2008/Cole%20Porter%20-%20Anything%20Goes.mp3'
  },
];

export default function RadioTab() {
  const { playing, setPlaying, currentStation, setCurrentStation } = useAudio();
  
  // Find which station is currently selected based on the global audio source
  const findCurrentStation = () => STATIONS.find(s => s.audioSrc === currentStation) || STATIONS[0];
  const [selected, setSelected] = useState(findCurrentStation);
  
  const [dots, setDots] = useState('');
  const [bars, setBars] = useState<number[]>(Array(36).fill(0));
  const [needle, setNeedle] = useState(selected.signal);

  // Sync selected station if global audio source changes externally
  useEffect(() => {
    const match = STATIONS.find(s => s.audioSrc === currentStation);
    if (match && match.id !== selected.id) {
      setSelected(match);
      setNeedle(match.signal);
    }
  }, [currentStation, selected.id]);

  // Animated ellipsis
  useEffect(() => {
    const iv = setInterval(() => setDots(d => d.length >= 3 ? '' : d + '.'), 450);
    return () => clearInterval(iv);
  }, []);

  // Needle wobble
  useEffect(() => {
    if (!playing) { setNeedle(0); return; }
    const iv = setInterval(() => {
      setNeedle(n => {
        const delta = (Math.random() - 0.5) * 5;
        return Math.max(selected.signal - 6, Math.min(selected.signal + 6, n + delta));
      });
    }, 150);
    return () => clearInterval(iv);
  }, [playing, selected.signal]);

  // Bar visualizer
  useEffect(() => {
    if (!playing) { setBars(Array(36).fill(4)); return; }
    let frame: number;
    const animate = () => {
      setBars(Array.from({ length: 36 }, (_, i) => {
        const base = (Math.sin(Date.now() / 200 + i * 0.5) + 1) / 2;
        return Math.max(5, base * 80 * (selected.signal / 100));
      }));
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [playing, selected.signal]);

  // Keyboard navigation for stations (W/S)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === 'w' || e.key === 'ArrowUp') {
        e.preventDefault();
        const idx = STATIONS.findIndex(s => s.id === selected.id);
        if (idx > 0) {
          const next = STATIONS[idx - 1];
          tuneStation(next);
        }
      } else if (key === 's' || e.key === 'ArrowDown') {
        e.preventDefault();
        const idx = STATIONS.findIndex(s => s.id === selected.id);
        if (idx < STATIONS.length - 1) {
          const next = STATIONS[idx + 1];
          tuneStation(next);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selected.id, setCurrentStation, setPlaying]);

  const tuneStation = (station: typeof STATIONS[0]) => {
    soundEffects.radioStatic(0.25, 0.15);
    setSelected(station);
    setNeedle(station.signal);
    setCurrentStation(station.audioSrc);
    setPlaying(true);
  };

  const btnStyle: React.CSSProperties = {
    background: 'transparent', border: `1px solid ${GREEN}`, color: GREEN,
    fontFamily: "'Share Tech Mono', monospace", fontSize: '1rem',
    cursor: 'pointer', padding: '4px 14px', textTransform: 'uppercase',
    letterSpacing: '1px', transition: 'all 0.15s',
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '1rem' }}>

      {/* ── Tuner / Dial ── */}
      <div style={{ border: `1px solid ${GREEN}`, padding: '1rem', boxShadow: `0 0 8px rgba(20,248,20,0.15)`, position: 'relative' }}>
        
        <div style={{ position: 'absolute', right: '1rem', top: '1rem', opacity: 0.8 }}>
          <VaultBoyDisplay src={danceGif} size={70} />
        </div>

        <div style={{ fontSize: '0.78rem', opacity: 0.4, marginBottom: '0.5rem', letterSpacing: '2px' }}>// SINTONIZADOR DE FRECUENCIAS</div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', letterSpacing: '4px', textShadow: `0 0 14px ${GREEN}, 0 0 28px rgba(20,248,20,0.4)` }}>
            {selected.freq}
          </div>
          <div style={{ fontSize: '1rem' }}>
            {playing
              ? <span style={{ animation: 'pulse-glow 1.2s infinite' }}>▶ EN AIRE{dots}</span>
              : <span style={{ opacity: 0.4 }}>■ APAGADO</span>
            }
          </div>
        </div>

        {/* Signal visualizer bars */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '52px', marginBottom: '0.75rem' }}>
          {bars.map((h, i) => (
            <div key={i} style={{
              flex: 1,
              height: `${h}%`,
              background: i < Math.floor((needle / 100) * bars.length) ? GREEN : 'rgba(20,248,20,0.12)',
              boxShadow: i < Math.floor((needle / 100) * bars.length) ? `0 0 3px ${GREEN}` : 'none',
              transition: 'height 0.05s',
            }} />
          ))}
        </div>

        {/* Signal strength meter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem' }}>
          <span style={{ opacity: 0.5, flexShrink: 0 }}>SEÑAL:</span>
          <div style={{ flex: 1, height: '10px', border: `1px solid ${GREEN}`, padding: '1px' }}>
            <div style={{
              width: `${needle}%`, height: '100%', background: GREEN,
              boxShadow: `0 0 5px ${GREEN}`, transition: 'width 0.15s',
            }} />
          </div>
          <span style={{ width: '38px', textAlign: 'right' }}>{Math.round(needle)}%</span>
        </div>
      </div>

      {/* ── Station list ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1, overflow: 'auto' }} className="no-scrollbar">
        <div style={{ fontSize: '0.78rem', opacity: 0.4, letterSpacing: '2px', marginBottom: '2px' }}>// ESTACIONES DISPONIBLES</div>
        {STATIONS.map(station => (
          <div key={station.id} onClick={() => tuneStation(station)}
            style={{
              display: 'flex', gap: '12px', alignItems: 'flex-start',
              padding: '10px 12px', cursor: 'pointer',
              border: selected.id === station.id ? `1px solid ${GREEN}` : '1px solid rgba(20,248,20,0.25)',
              background: selected.id === station.id ? 'rgba(20,248,20,0.06)' : 'transparent',
              transition: 'all 0.15s',
            }}>
            <div style={{ fontSize: '1.2rem', marginTop: '2px', flexShrink: 0 }}>
              {selected.id === station.id && playing
                ? <span style={{ animation: 'pulse-glow 0.8s infinite' }}>▶</span>
                : <span style={{ opacity: 0.35 }}>◆</span>
              }
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '1.05rem', fontWeight: 'bold' }}>{station.name}</span>
                <span style={{ fontSize: '0.9rem', opacity: 0.5, flexShrink: 0, marginLeft: '8px' }}>{station.freq}</span>
              </div>
              <div style={{ fontSize: '0.88rem', opacity: 0.65, lineHeight: 1.5 }}>{station.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Controls ── */}
      <div style={{ borderTop: `1px solid rgba(20,248,20,0.3)`, paddingTop: '0.75rem', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
        <button style={btnStyle} onClick={() => setPlaying((p: boolean) => !p)}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = GREEN; (e.currentTarget as HTMLElement).style.color = BLACK; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = GREEN; }}>
          {playing ? '■ STOP' : '▶ PLAY'}
        </button>
        <button style={btnStyle} onClick={() => {
          const idx = STATIONS.findIndex(s => s.id === selected.id);
          const next = STATIONS[(idx + 1) % STATIONS.length];
          tuneStation(next);
        }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = GREEN; (e.currentTarget as HTMLElement).style.color = BLACK; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = GREEN; }}>
          ⏭ SIGUIENTE
        </button>
        <span style={{ marginLeft: 'auto', fontSize: '0.78rem', opacity: 0.35, letterSpacing: '1px' }}>VAULT-TEC RADIO v2.3</span>
      </div>
    </motion.div>
  );
}
