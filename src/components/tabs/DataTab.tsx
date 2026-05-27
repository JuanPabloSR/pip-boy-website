import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import walkGif from '../../assets/derek-walk.gif';
import { soundEffects } from '../../utils/audio';

const GREEN = '#14F814';
const BLACK = '#000000';

const MAIN_QUESTS = [
  { 
    id: 'q1', name: 'ADSO – Análisis y Desarrollo de Software', 
    institution: 'SENA', period: '09/2023 – 06/2026', 
    status: 'EN PROGRESO', xp: 750,
    note: 'Formación técnica integral enfocada en el ciclo de vida completo del software. Diseño de arquitecturas, modelado de bases de datos, y construcción de aplicaciones empresariales escalables con metodologías ágiles.'
  },
  { 
    id: 'q2', name: 'Training Desarrollo de Software', 
    institution: 'Sofka University', period: '11/2021 – 02/2022', 
    status: 'COMPLETADA', xp: 500,
    note: 'Entrenamiento intensivo (Bootcamp) bajo el modelo de la Liga de Sofka. Adquisición de habilidades avanzadas en Clean Architecture, SOLID, DDD, programación funcional y reactiva con Java, y bases de datos NoSQL.'
  },
];

const SIDE_QUESTS = [
  { id: 's1', name: 'EF SET English Certificate', institution: 'EF Education First', period: '2023', status: 'COMPLETADA', xp: 150, note: 'Nivel B1 – Upper Intermediate. Capacidad para interactuar fluidamente en entornos de desarrollo internacionales y lectura de documentación técnica compleja.' },
  { id: 's2', name: 'Universidad Spring Framework', institution: 'Udemy', period: '2022', status: 'COMPLETADA', xp: 200, note: 'Dominio avanzado del ecosistema Spring: Spring Boot, Spring Data JPA, Spring Security, y exposición de APIs RESTful bajo altos estándares de seguridad.' },
  { id: 's3', name: 'Universidad Desarrollo Web', institution: 'Udemy', period: '2022', status: 'COMPLETADA', xp: 180, note: 'Bases sólidas en Frontend: HTML5, CSS3, JavaScript moderno (ES6+), fundamentos de ReactJS y diseño responsive.' },
];

type QuestType = 'MAIN' | 'SIDE';
const QUEST_TYPES: QuestType[] = ['MAIN', 'SIDE'];
type Quest = typeof MAIN_QUESTS[0];

export default function DataTab() {
  const [type, setType] = useState<QuestType>('MAIN');
  const [selected, setSelected] = useState<Quest>(MAIN_QUESTS[0] as Quest);

  const quests: Quest[] = (type === 'MAIN' ? MAIN_QUESTS : SIDE_QUESTS) as Quest[];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === 'a' || e.key === 'ArrowLeft') {
        const idx = QUEST_TYPES.indexOf(type);
        const nextType = QUEST_TYPES[(idx - 1 + QUEST_TYPES.length) % QUEST_TYPES.length];
        setType(nextType);
        setSelected((nextType === 'MAIN' ? MAIN_QUESTS[0] : SIDE_QUESTS[0]) as Quest);
        soundEffects.subTabSwitch();
      } else if (key === 'd' || e.key === 'ArrowRight') {
        const idx = QUEST_TYPES.indexOf(type);
        const nextType = QUEST_TYPES[(idx + 1) % QUEST_TYPES.length];
        setType(nextType);
        setSelected((nextType === 'MAIN' ? MAIN_QUESTS[0] : SIDE_QUESTS[0]) as Quest);
        soundEffects.subTabSwitch();
      } else if (key === 'w' || e.key === 'ArrowUp') {
        e.preventDefault();
        const idx = quests.findIndex(q => q.id === selected.id);
        if (idx > 0) {
          setSelected(quests[idx - 1]);
          soundEffects.hover();
        }
      } else if (key === 's' || e.key === 'ArrowDown') {
        e.preventDefault();
        const idx = quests.findIndex(q => q.id === selected.id);
        if (idx < quests.length - 1) {
          setSelected(quests[idx + 1]);
          soundEffects.hover();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [type, selected, quests]);

  const subStyle = (active: boolean): React.CSSProperties => ({
    background: 'transparent', border: 'none',
    color: active ? GREEN : 'rgba(20,248,20,0.4)',
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: '1.1rem', cursor: 'pointer', padding: '2px 4px',
    textTransform: 'uppercase', letterSpacing: '1px',
    borderBottom: active ? `2px solid ${GREEN}` : '2px solid transparent',
    transition: 'all 0.15s',
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

      {/* Sub-tabs */}
      <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1rem', alignItems: 'center' }}>
        {QUEST_TYPES.map(t => (
          <button key={t} onClick={() => { setType(t); setSelected((t === 'MAIN' ? MAIN_QUESTS[0] : SIDE_QUESTS[0]) as Quest); }}
            style={subStyle(type === t)}>
            {t === 'MAIN' ? 'MAIN QUESTS' : 'SIDE QUESTS'}
          </button>
        ))}
        <span style={{ marginLeft: 'auto', color: 'rgba(20,248,20,0.25)', fontSize: '0.9rem' }}>WORKSHOPS  NOTES</span>
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', flex: 1, overflow: 'hidden', minHeight: 0 }}>
        {/* Quest list */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '3px', overflow: 'auto' }} className="no-scrollbar">
          {quests.map(q => (
            <div key={q.id} onClick={() => setSelected(q)}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '8px 10px', cursor: 'pointer', transition: 'all 0.1s',
                background: selected?.id === q.id ? GREEN : 'transparent',
                color: selected?.id === q.id ? BLACK : GREEN,
              }}>
              <span style={{ fontSize: '1.2rem', flexShrink: 0, opacity: q.status === 'COMPLETADA' ? 1 : 0.5 }}>
                {q.status === 'COMPLETADA' ? '✓' : '◎'}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '1rem', fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{q.name}</div>
                <div style={{ fontSize: '0.85rem', opacity: 0.65 }}>{q.institution} · {q.period}</div>
              </div>
              <span style={{ fontSize: '0.85rem', opacity: 0.55, flexShrink: 0 }}>+{q.xp} XP</span>
            </div>
          ))}
        </div>

        {/* Quest detail */}
        {selected && (
          <div style={{ flex: 1, border: `1px solid ${GREEN}`, padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', overflow: 'auto' }} className="no-scrollbar">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '2.5rem', lineHeight: 1, animation: selected.status !== 'COMPLETADA' ? 'pulse-glow 1.5s infinite' : 'none' }}>
                {selected.status === 'COMPLETADA' ? '✓' : '◎'}
              </span>
              <div>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', lineHeight: 1.3 }}>{selected.name}</div>
                <div style={{ fontSize: '0.9rem', opacity: 0.65, marginTop: '4px' }}>{selected.institution}</div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid rgba(20,248,20,0.3)', paddingTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.95rem' }}>
              <div><span style={{ opacity: 0.5 }}>PERÍODO: </span>{selected.period}</div>
              <div>
                <span style={{ opacity: 0.5 }}>ESTADO: </span>
                <span style={{ animation: selected.status !== 'COMPLETADA' ? 'pulse-glow 1.5s infinite' : 'none' }}>
                  {selected.status}
                </span>
              </div>
              {selected.note && <div style={{ marginTop: '0.5rem', lineHeight: 1.6 }}><span style={{ opacity: 0.5 }}>NOTA: </span>{selected.note}</div>}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
              <img 
                src={walkGif} 
                alt="Vault Boy"
                style={{ 
                  width: 120, 
                  height: 120, 
                  objectFit: 'contain',
                  mixBlendMode: 'screen',
                  filter: 'sepia(100%) hue-rotate(75deg) saturate(500%) brightness(110%) contrast(120%)'
                }} 
              />
            </div>

            <div style={{ marginTop: 'auto', borderTop: '1px solid rgba(20,248,20,0.3)', paddingTop: '0.75rem' }}>
              <div style={{ fontSize: '0.9rem', opacity: 0.6, marginBottom: '6px' }}>RECOMPENSA XP</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ flex: 1, height: '14px', border: `1px solid ${GREEN}`, padding: '1px' }}>
                  <div style={{
                    height: '100%', background: GREEN,
                    width: `${Math.min((selected.xp / 800) * 100, 100)}%`,
                    boxShadow: `0 0 6px ${GREEN}`,
                    transition: 'width 0.4s ease',
                  }} />
                </div>
                <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>+{selected.xp}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
