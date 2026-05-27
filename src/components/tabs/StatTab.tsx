import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import thumbsUpGif from '../../assets/correct-thumbs-up.gif';
import walkGif from '../../assets/derek-walk.gif';
import gamingGif from '../../assets/gaming.gif';
import { soundEffects } from '../../utils/audio';

type SubTab = 'STATUS' | 'SPECIAL' | 'PERKS';
const SUBTABS: SubTab[] = ['STATUS', 'SPECIAL', 'PERKS'];

const GREEN = '#14F814';
const BLACK = '#000000';

const SPECIAL = [
  { name: 'Java / Spring Boot',    value: 9, desc: 'Backend empresarial. REST APIs, JPA, Security, WebFlux reactivo y microservicios con Spring Cloud.' },
  { name: 'Angular / TypeScript',  value: 8, desc: 'SPAs enterprise con RxJS, NgRx, Angular Material, módulos lazy-loading y testing unitario.' },
  { name: 'React.js',              value: 7, desc: 'Componentes modernos con hooks, context API, Framer Motion y ecosistema frontend actual.' },
  { name: 'Microservicios',        value: 9, desc: 'Arquitectura limpia, DDD, mensajería con ActiveMQ, RabbitMQ y patrones de resiliencia.' },
  { name: 'Cloud (AWS / Azure)',   value: 7, desc: 'Despliegues con EC2, S3, RDS, Azure DevOps, pipelines CI/CD y gestión de entornos.' },
  { name: 'Python / LLMs',         value: 6, desc: 'Scripts de automatización, integración con Ollama, LangChain y modelos de lenguaje locales.' },
  { name: 'DevOps / Calidad',      value: 7, desc: 'SonarQube, JUnit, Mockito, cobertura de código, Docker y GitHub Actions.' },
];

const PERKS = [
  { name: 'CLEAN ARCHITECT',        rank: 3, desc: 'Principios SOLID, Clean Architecture y DDD aplicados en proyectos reales de alto tráfico.' },
  { name: 'REACTIVE MASTER',        rank: 3, desc: 'Programación reactiva con Spring WebFlux y RxJS en proyectos del sector asegurador.' },
  { name: 'MESSAGE BROKER EXPERT',  rank: 2, desc: 'Sistemas de mensajería asíncrona: ActiveMQ, RabbitMQ. Desacoplamiento de servicios.' },
  { name: 'CLOUD WALKER',           rank: 2, desc: 'Despliegue y gestión de servicios en AWS y Azure con pipelines automatizados.' },
  { name: 'LOCAL AI TINKERER',      rank: 1, desc: 'Experimentación con LLMs locales via Ollama. Integración de IA en flujos de desarrollo.' },
  { name: 'CAFEOMANIAC',            rank: 1, desc: '+15% de productividad garantizada con V60 a 92°C. Ratio 1:15. Sin bugs después del bloom.' },
];

const subStyle = (active: boolean): React.CSSProperties => ({
  background: 'transparent',
  border: 'none',
  color: active ? GREEN : 'rgba(20,248,20,0.4)',
  fontFamily: "'Share Tech Mono', monospace",
  fontSize: '1.1rem',
  cursor: 'pointer',
  padding: '2px 4px',
  borderBottom: active ? `2px solid ${GREEN}` : '2px solid transparent',
  textTransform: 'uppercase' as const,
  letterSpacing: '1px',
  textShadow: active ? `0 0 6px ${GREEN}` : 'none',
  transition: 'all 0.15s',
});

export default function StatTab() {
  const [subTab, setSubTab] = useState<SubTab>('SPECIAL');
  const [selectedSpecial, setSelectedSpecial] = useState(SPECIAL[0]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === 'a' || e.key === 'ArrowLeft') {
        const idx = SUBTABS.indexOf(subTab);
        setSubTab(SUBTABS[(idx - 1 + SUBTABS.length) % SUBTABS.length]);
        soundEffects.subTabSwitch();
      } else if (key === 'd' || e.key === 'ArrowRight') {
        const idx = SUBTABS.indexOf(subTab);
        setSubTab(SUBTABS[(idx + 1) % SUBTABS.length]);
        soundEffects.subTabSwitch();
      } else if ((key === 'w' || e.key === 'ArrowUp') && subTab === 'SPECIAL') {
        e.preventDefault();
        const idx = SPECIAL.findIndex(s => s.name === selectedSpecial.name);
        if (idx > 0) {
          setSelectedSpecial(SPECIAL[idx - 1]);
          soundEffects.hover();
        }
      } else if ((key === 's' || e.key === 'ArrowDown') && subTab === 'SPECIAL') {
        e.preventDefault();
        const idx = SPECIAL.findIndex(s => s.name === selectedSpecial.name);
        if (idx < SPECIAL.length - 1) {
          setSelectedSpecial(SPECIAL[idx + 1]);
          soundEffects.hover();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [subTab, selectedSpecial]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Sub-tabs */}
      <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1rem' }}>
        {(['STATUS', 'SPECIAL', 'PERKS'] as SubTab[]).map(t => (
          <button key={t} onClick={() => setSubTab(t)} style={subStyle(subTab === t)}>{t}</button>
        ))}
      </div>

      <div style={{ flex: 1, overflow: 'hidden', minHeight: 0 }}>
        <AnimatePresence mode="wait">

          {/* ── STATUS ── */}
          {subTab === 'STATUS' && (
            <motion.div key="status" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ display: 'flex', gap: '2rem', height: '100%' }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem', overflow: 'auto' }} className="no-scrollbar">
                <div style={{ border: `1px solid ${GREEN}`, padding: '1rem', boxShadow: `0 0 8px rgba(20,248,20,0.2)` }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', textShadow: `0 0 8px ${GREEN}` }}>JUAN PABLO SÁNCHEZ REY</div>
                  <div style={{ fontSize: '1.1rem', opacity: 0.8, marginTop: '4px' }}>Desarrollador Full Stack · Nivel 6</div>
                  <div style={{ fontSize: '0.9rem', opacity: 0.5, marginTop: '4px' }}>VAULT-TEC ID: JPSR-007 · Bucaramanga, Santander, COL</div>
                </div>
                <div style={{ border: `1px solid ${GREEN}`, padding: '1rem', fontSize: '1rem', lineHeight: 1.7, opacity: 0.85 }}>
                  <div style={{ opacity: 0.5, marginBottom: '0.5rem', fontSize: '0.85rem' }}>// BIO DEL SUPERVIVIENTE</div>
                  Más de <strong>4 años</strong> construyendo software empresarial escalable en el Wasteland digital.
                  Especialista en arquitecturas de microservicios, APIs REST robustas y frontends de alto rendimiento.
                  Actualmente activo en <strong>Nexos Software</strong>, desplegando soluciones en la nube y
                  liderando módulos críticos de integración empresarial.
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  {[['4+', 'AÑOS EXP.'], ['10+', 'PROYECTOS'], ['2', 'EMPRESAS'], ['3', 'CERTS.']].map(([v, k]) => (
                    <div key={k} style={{ border: `1px solid ${GREEN}`, padding: '0.75rem', textAlign: 'center' }}>
                      <div style={{ fontSize: '2rem', fontWeight: 'bold', textShadow: `0 0 10px ${GREEN}` }}>{v}</div>
                      <div style={{ fontSize: '0.8rem', opacity: 0.55 }}>{k}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <VaultBoyGIF size={320} src={thumbsUpGif} />
              </div>
            </motion.div>
          )}

          {/* ── SPECIAL ── */}
          {subTab === 'SPECIAL' && (
            <motion.div key="special" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ display: 'flex', gap: '2rem', height: '100%' }}>
              {/* List */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px', overflow: 'auto' }} className="no-scrollbar">
                {SPECIAL.map(attr => (
                  <div key={attr.name} onClick={() => setSelectedSpecial(attr)}
                    style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '6px 8px', cursor: 'pointer', transition: 'all 0.1s',
                      background: selectedSpecial.name === attr.name ? GREEN : 'transparent',
                      color: selectedSpecial.name === attr.name ? BLACK : GREEN,
                      fontSize: '1.1rem',
                    }}
                  >
                    <span>{attr.name}</span>
                    <span style={{ fontWeight: 'bold', fontSize: '1.3rem' }}>{attr.value}</span>
                  </div>
                ))}
              </div>
              {/* Detail */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <VaultBoyGIF size={240} src={walkGif} />
                </div>
                <div style={{ border: `1px solid ${GREEN}`, padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{selectedSpecial.name}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div key={i} style={{
                        flex: 1, height: '10px', border: `1px solid ${GREEN}`,
                        background: i < selectedSpecial.value ? GREEN : 'transparent',
                        boxShadow: i < selectedSpecial.value ? `0 0 4px ${GREEN}` : 'none',
                      }} />
                    ))}
                    <span style={{ fontWeight: 'bold', marginLeft: '6px' }}>{selectedSpecial.value}</span>
                  </div>
                  <p style={{ fontSize: '0.95rem', opacity: 0.8, lineHeight: 1.6, margin: 0 }}>{selectedSpecial.desc}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── PERKS ── */}
          {subTab === 'PERKS' && (
            <motion.div key="perks" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ display: 'flex', gap: '2rem', height: '100%' }}
            >
              <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', overflow: 'auto', alignContent: 'start' }} className="no-scrollbar">
                {PERKS.map(perk => (
                  <div key={perk.name} style={{ border: `1px solid ${GREEN}`, padding: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', alignItems: 'flex-start' }}>
                      <div style={{ fontSize: '1rem', fontWeight: 'bold', lineHeight: 1.3 }}>{perk.name}</div>
                      <div style={{ display: 'flex', gap: '3px', flexShrink: 0, marginLeft: '8px' }}>
                        {Array.from({ length: 3 }).map((_, i) => (
                          <div key={i} style={{
                            width: '11px', height: '11px', border: `1px solid ${GREEN}`,
                            background: i < perk.rank ? GREEN : 'transparent',
                          }} />
                        ))}
                      </div>
                    </div>
                    <p style={{ fontSize: '0.85rem', opacity: 0.7, lineHeight: 1.5, margin: 0 }}>{perk.desc}</p>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <VaultBoyGIF size={260} src={gamingGif} />
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function VaultBoyGIF({ size, src }: { size: number, src: string }) {
  return (
    <img 
      src={src} 
      alt="Vault Boy"
      style={{ 
        width: size, 
        height: size, 
        objectFit: 'contain',
        mixBlendMode: 'screen', // Removes the black background box entirely
        filter: 'sepia(100%) hue-rotate(75deg) saturate(500%) brightness(110%) contrast(120%)'
      }} 
    />
  );
}
