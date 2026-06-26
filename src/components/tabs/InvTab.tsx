import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import thumbsUpGif from '../../assets/correct-thumbs-up.gif';
import VaultBoyDisplay from '../VaultBoyDisplay';
import { soundEffects } from '../../utils/audio';

const GREEN = '#14F814';
const BLACK = '#000000';

const WEAPONS = [
  {
    id: 1, category: 'WEAPONS',
    name: 'NEXOS SOFTWARE',
    role: 'Analista Desarrollo Full Stack',
    period: '09/2023 – PRESENTE',
    equipped: true, weight: 4, value: 95,
    details: [
      'Arquitectura Empresarial: Diseño y desarrollo de microservicios escalables utilizando Java 17, Spring Boot 3 y Spring Cloud.',
      'Front-End Avanzado: Construcción de SPAs robustas utilizando Angular y React.js con Framer Motion.',
      'Sistemas Asíncronos: Integración y orquestación de servicios core mediante brokers de mensajería (ActiveMQ).',
      'Calidad y DevOps: Implementación de pipelines CI/CD en Azure DevOps. Aseguramiento de calidad con SonarQube, JUnit y Mockito (>85% cobertura).',
      'Metodología: Liderazgo y participación activa en células Scrum de alto rendimiento, garantizando entregas incrementales de valor.',
    ],
  },
];

const APPAREL = [
  {
    id: 2, category: 'APPAREL',
    name: 'SOFKA TECHNOLOGIES',
    role: 'Consultor Desarrollador Full Stack',
    period: '02/2022 – 04/2023',
    equipped: false, weight: 3, value: 80,
    details: [
      'Core Financiero/Asegurador: Desarrollo de ecosistemas reactivos y de baja latencia utilizando Spring WebFlux y Project Reactor.',
      'Arquitectura Limpia: Implementación estricta de Clean Architecture y Domain-Driven Design (DDD) para sistemas de alta criticidad.',
      'Event-Driven Architecture: Diseño de flujos de eventos de dominio a gran escala con RabbitMQ y Apache Kafka.',
      'Training de Élite: Graduado del exigente Sofka University Training Program, consolidando bases de ingeniería de software.',
      'Bases de Datos: Modelado avanzado de esquemas en bases de datos relacionales (PostgreSQL/MySQL) y NoSQL (MongoDB).',
    ],
  },
];

type Category = 'WEAPONS' | 'APPAREL';
const CATEGORIES: Category[] = ['WEAPONS', 'APPAREL'];
type Item = typeof WEAPONS[0];

export default function InvTab() {
  const [category, setCategory] = useState<Category>('WEAPONS');
  const [selected, setSelected] = useState<Item>(WEAPONS[0]);

  const items: Item[] = category === 'WEAPONS' ? WEAPONS : APPAREL;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === 'a' || e.key === 'ArrowLeft') {
        const idx = CATEGORIES.indexOf(category);
        const nextCat = CATEGORIES[(idx - 1 + CATEGORIES.length) % CATEGORIES.length];
        setCategory(nextCat);
        setSelected(nextCat === 'WEAPONS' ? WEAPONS[0] : APPAREL[0]);
        soundEffects.subTabSwitch();
      } else if (key === 'd' || e.key === 'ArrowRight') {
        const idx = CATEGORIES.indexOf(category);
        const nextCat = CATEGORIES[(idx + 1) % CATEGORIES.length];
        setCategory(nextCat);
        setSelected(nextCat === 'WEAPONS' ? WEAPONS[0] : APPAREL[0]);
        soundEffects.subTabSwitch();
      } else if (key === 'w' || e.key === 'ArrowUp') {
        e.preventDefault();
        const idx = items.findIndex(i => i.id === selected.id);
        if (idx > 0) {
          setSelected(items[idx - 1]);
          soundEffects.hover();
        }
      } else if (key === 's' || e.key === 'ArrowDown') {
        e.preventDefault();
        const idx = items.findIndex(i => i.id === selected.id);
        if (idx < items.length - 1) {
          setSelected(items[idx + 1]);
          soundEffects.hover();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [category, selected, items]);

  const subStyle = (active: boolean): React.CSSProperties => ({
    background: 'transparent', border: 'none',
    color: active ? GREEN : 'rgba(20,248,20,0.4)',
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: '1.1rem', cursor: 'pointer',
    padding: '2px 4px', textTransform: 'uppercase',
    letterSpacing: '1px',
    borderBottom: active ? `2px solid ${GREEN}` : '2px solid transparent',
    transition: 'all 0.15s',
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

      {/* Sub-tabs */}
      <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1rem' }}>
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => { setCategory(cat); setSelected(cat === 'WEAPONS' ? WEAPONS[0] : APPAREL[0]); }}
            style={subStyle(category === cat)}>{cat}</button>
        ))}
        <span style={{ color: 'rgba(20,248,20,0.25)', fontSize: '1rem', alignSelf: 'center', marginLeft: '1rem' }}>AID  MISC</span>
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', flex: 1, overflow: 'hidden', minHeight: 0 }}>
        {/* Item list */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '3px', overflow: 'auto' }} className="no-scrollbar">
          {items.map(item => (
            <div key={item.id} onClick={() => setSelected(item)}
              style={{
                display: 'flex', alignItems: 'flex-start', gap: '10px',
                padding: '8px 10px', cursor: 'pointer', transition: 'all 0.1s',
                background: selected?.id === item.id ? GREEN : 'transparent',
                color: selected?.id === item.id ? BLACK : GREEN,
              }}>
              <span style={{ marginTop: '2px', opacity: 0.7 }}>■</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '1.15rem', fontWeight: 'bold' }}>{item.name}</div>
                <div style={{ fontSize: '0.9rem', opacity: 0.7 }}>{item.role}</div>
              </div>
              {item.equipped && (
                <span style={{
                  border: `1px solid ${selected?.id === item.id ? BLACK : GREEN}`,
                  color: selected?.id === item.id ? BLACK : GREEN,
                  padding: '1px 5px', fontSize: '0.8rem', flexShrink: 0
                }}>EQ</span>
              )}
            </div>
          ))}
        </div>

        {/* Item detail */}
        {selected && (
          <div style={{ flex: 1, border: `1px solid ${GREEN}`, padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', overflow: 'auto' }} className="no-scrollbar">
            <div style={{ fontSize: '1.3rem', fontWeight: 'bold', textShadow: `0 0 6px ${GREEN}` }}>{selected.name}</div>
            <div style={{ fontSize: '1rem', opacity: 0.8 }}>{selected.role}</div>
            <div style={{ fontSize: '0.85rem', opacity: 0.5 }}>{selected.period}</div>
            
            <div style={{ borderTop: '1px solid rgba(20,248,20,0.3)', paddingTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {selected.details.map((d, i) => (
                <div key={i} style={{ fontSize: '0.9rem', lineHeight: 1.5, display: 'flex', gap: '8px' }}>
                  <span style={{ opacity: 0.4, flexShrink: 0 }}>›</span>{d}
                </div>
              ))}
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
              <VaultBoyDisplay src={thumbsUpGif} size={140} />
            </div>

            <div style={{ marginTop: 'auto', borderTop: '1px solid rgba(20,248,20,0.3)', paddingTop: '0.75rem', display: 'flex', gap: '2rem', fontSize: '1rem' }}>
              <div>VALOR <span style={{ fontWeight: 'bold', marginLeft: '8px' }}>{selected.value}</span></div>
              <div>PESO  <span style={{ fontWeight: 'bold', marginLeft: '8px' }}>{selected.weight}</span></div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom bar */}
      <div style={{ marginTop: '1rem', borderTop: '1px solid rgba(20,248,20,0.3)', paddingTop: '0.5rem', display: 'flex', gap: '2rem', fontSize: '0.85rem', opacity: 0.6 }}>
        <span>🎒 ITEMS: {WEAPONS.length + APPAREL.length}/10</span>
        <span>© CAPS: 576</span>
        <span style={{ marginLeft: 'auto' }}>⚡ EXP: 4+ AÑOS</span>
      </div>
    </motion.div>
  );
}
