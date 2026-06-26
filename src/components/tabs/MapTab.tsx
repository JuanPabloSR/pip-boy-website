import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { geoMercator, geoPath } from 'd3-geo';
import type { Feature, FeatureCollection, Polygon, MultiPolygon } from 'geojson';
import walkGif from '../../assets/derek-walk.gif';
import santanderData from '../../assets/santander.geo.json';
import colombiaData from '../../assets/colombia.geo.json';

const GREEN = '#14F814';
const WIDTH = 380;
const HEIGHT = 540;
const ZOOM_SCALE = 4.2; // ratio between Santander and Colombia projections

// Santander cities [lon, lat]
const santanderCities: CityDef[] = [
  { name: 'BUCARAMANGA', coords: [-73.1198, 7.1254], capital: true },
  { name: 'FLORIDABLANCA', coords: [-73.0864, 7.0622] },
  { name: 'GIRÓN', coords: [-73.1710, 7.0684] },
  { name: 'PIEDECUESTA', coords: [-73.0505, 6.9872] },
  { name: 'B/BERMEJA', coords: [-73.8549, 7.0653] },
  { name: 'SAN GIL', coords: [-73.1347, 6.5544] },
  { name: 'SOCORRO', coords: [-73.2614, 6.4700] },
  { name: 'MÁLAGA', coords: [-72.7334, 6.7044] },
  { name: 'VÉLEZ', coords: [-73.6734, 6.0131] },
  { name: 'BARBOSA', coords: [-73.6143, 5.9317] },
  { name: 'EL PLAYÓN', coords: [-73.2050, 7.4700] },
  { name: 'RIONEGRO', coords: [-73.1543, 7.3821] },
  { name: 'LEBRIJA', coords: [-73.2161, 7.1145] },
  { name: 'SAN VICENTE', coords: [-73.4244, 6.8839] },
  { name: 'CIMITARRA', coords: [-73.9507, 6.3167] },
  { name: 'ZAPATOCA', coords: [-73.2690, 6.8138] },
  { name: 'BARICHARA', coords: [-73.2258, 6.6356] },
];

interface CityDef {
  name: string;
  coords: [number, number];
  capital?: boolean;
}

type MapView = 'santander' | 'colombia';

export default function MapTab() {
  const [view, setView] = useState<MapView>('santander');

  // Santander centroid in Colombia map pixel-space (% for transform-origin)
  const santanderOrigin = useMemo(() => {
    const projection = geoMercator().center([-74.0, 4.5]).scale(2400).translate([WIDTH / 2, HEIGHT / 2]);
    const collection = colombiaData as unknown as FeatureCollection<Polygon | MultiPolygon>;
    const feat = collection.features.find(f => (f.properties as { DPTO: string }).DPTO === '68');
    if (feat) {
      const c = geoPath().projection(projection).centroid(feat);
      return `${(c[0] / WIDTH) * 100}% ${(c[1] / HEIGHT) * 100}%`;
    }
    return '55% 35%';
  }, []);

  const toggle = () => setView(v => v === 'santander' ? 'colombia' : 'santander');
  const isSantander = view === 'santander';

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      style={{ display: 'flex', gap: '2rem', height: '100%', overflow: 'hidden' }}>

      {/* Left: Waypoints */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem', overflow: 'auto', minWidth: 0 }} className="no-scrollbar">
        <div style={{ fontSize: '0.85rem', opacity: 0.5, marginBottom: '0.25rem' }}>// WAYPOINTS ACTIVOS</div>

        <WaypointCard icon="◈" label="UBICACIÓN ACTUAL" value="Bucaramanga, Santander" sub="Colombia · COL-007 · Zona Andina" />
        <WaypointCard
          icon="✉" label="CANAL DE TRANSMISIÓN"
          value="juanpablosanchez744@gmail.com"
          link="mailto:juanpablosanchez744@gmail.com"
        />
        <WaypointCard
          icon="⬡" label="RED SOCIAL VAULT-TEC"
          value="linkedin.com/in/juan-pablo-sanchez-rey"
          link="https://linkedin.com/in/juan-pablo-sanchez-rey"
        />

        <div style={{ border: `1px solid ${GREEN}`, padding: '0.85rem', fontSize: '0.9rem', opacity: 0.75, lineHeight: 1.8, marginTop: '0.5rem' }}>
          <div style={{ fontWeight: 'bold', marginBottom: '0.4rem', fontSize: '1rem' }}>// SEÑAL DE RADIO LOCAL</div>
          <div>► ESTADO: <span style={{ textShadow: `0 0 6px ${GREEN}` }}>ONLINE</span></div>
          <div>► DISPONIBLE: Proyectos Full Stack, Consultoría, Freelance</div>
          <div>► ZONA HORARIA: UTC-5 (Bogotá, COL)</div>
        </div>
      </div>

      {/* Right: Map container */}
      <div style={{
        flex: 1.4, border: `1px solid rgba(20,248,20,0.35)`, position: 'relative',
        overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(0,0,0,0.9)',
      }}>
        {/* Grid overlay */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.06,
          backgroundImage: `linear-gradient(${GREEN} 1px, transparent 1px), linear-gradient(90deg, ${GREEN} 1px, transparent 1px)`,
          backgroundSize: '30px 30px',
          pointerEvents: 'none',
        }} />

        {/* Map switcher arrows */}
        <button onClick={toggle} style={arrowStyle('left')} aria-label="Previous map">◄</button>
        <button onClick={toggle} style={arrowStyle('right')} aria-label="Next map">►</button>

        {/* Map label */}
        <motion.span
          key={view}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          style={{
            position: 'absolute', top: '6px', left: '50%', transform: 'translateX(-50%)',
            fontSize: '0.7rem', letterSpacing: '2px', zIndex: 5,
          }}>
          {isSantander ? 'DPTO. SANTANDER' : 'REPÚBLICA DE COLOMBIA'}
        </motion.span>

        {/* ─── Layered maps with zoom transition ─── */}
        {/* Colombia layer */}
        <motion.div
          animate={{
            scale: isSantander ? ZOOM_SCALE : 1,
            opacity: isSantander ? 0 : 1,
          }}
          transition={{
            scale: { duration: 1.8, ease: [0.4, 0, 0.2, 1] },
            opacity: isSantander
              ? { duration: 1.0, delay: 0.4, ease: 'easeIn' }
              : { duration: 0.5, delay: 1.1, ease: 'easeOut' },
          }}
          style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transformOrigin: santanderOrigin,
            pointerEvents: isSantander ? 'none' : 'auto',
          }}
        >
          <ColombiaMapSVG />
        </motion.div>

        {/* Santander layer */}
        <motion.div
          animate={{
            scale: isSantander ? 1 : 1 / ZOOM_SCALE,
            opacity: isSantander ? 1 : 0,
          }}
          transition={{
            scale: { duration: 1.8, ease: [0.4, 0, 0.2, 1] },
            opacity: isSantander
              ? { duration: 0.5, delay: 1.1, ease: 'easeOut' }
              : { duration: 0.5, ease: 'easeIn' },
          }}
          style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transformOrigin: 'center center',
            pointerEvents: isSantander ? 'auto' : 'none',
          }}
        >
          <SantanderMapSVG />
        </motion.div>

        {/* Vault Boy */}
        <img
          src={walkGif}
          alt="Vault Boy"
          style={{
            position: 'absolute', bottom: '8px', left: '8px',
            width: 75, height: 75, objectFit: 'contain',
            mixBlendMode: 'screen',
            filter: 'sepia(100%) hue-rotate(75deg) saturate(500%) brightness(110%) contrast(120%)',
            opacity: 0.9, zIndex: 5,
          }}
        />

        {/* Corner labels */}
        <span style={{ position: 'absolute', top: '6px', left: '8px', fontSize: '0.62rem', opacity: 0.4, zIndex: 5 }}>
          {isSantander ? 'N 8°07\'' : 'N 12°27\''}
        </span>
        <span style={{ position: 'absolute', bottom: '6px', right: '8px', fontSize: '0.62rem', opacity: 0.4, zIndex: 5 }}>
          {isSantander ? 'W 73°32\'' : 'W 74°00\''}
        </span>
        <span style={{ position: 'absolute', bottom: '6px', left: '85px', fontSize: '0.6rem', opacity: 0.25, letterSpacing: '1px', zIndex: 5 }}>VAULT-TEC CARTOGRAPHY v3.2</span>

        {/* Page indicator */}
        <div style={{ position: 'absolute', bottom: '10px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '6px', zIndex: 5 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: isSantander ? GREEN : 'transparent', border: `1px solid ${GREEN}`, transition: 'background 0.3s' }} />
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: !isSantander ? GREEN : 'transparent', border: `1px solid ${GREEN}`, transition: 'background 0.3s' }} />
        </div>
      </div>
    </motion.div>
  );
}

// Santander map using real GeoJSON + d3-geo
function SantanderMapSVG() {
  const { pathD, projectedCities } = useMemo(() => {
    const projection = geoMercator()
      .center([-73.5, 6.9])
      .scale(10000)
      .translate([WIDTH / 2, HEIGHT / 2]);

    const pathGen = geoPath().projection(projection);
    const feature = santanderData as unknown as Feature<Polygon>;
    const d = pathGen(feature) || '';

    const projected = santanderCities.map(city => {
      const point = projection(city.coords);
      return { ...city, x: point?.[0] ?? 0, y: point?.[1] ?? 0 };
    });

    return { pathD: d, projectedCities: projected };
  }, []);

  return (
    <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} style={{ width: '88%', height: '88%' }}
      fill="none" stroke={GREEN} xmlns="http://www.w3.org/2000/svg">
      <path d={pathD} strokeWidth="2" fill="rgba(20,248,20,0.03)"
        strokeLinejoin="round" strokeLinecap="round"
        style={{ filter: `drop-shadow(0 0 4px ${GREEN})` }} />

      {projectedCities.map((city, i) => (
        <g key={i}>
          {city.capital ? (
            <>
              <circle cx={city.x} cy={city.y} r="5" fill="rgba(20,248,20,0.3)" stroke={GREEN} strokeWidth="1.5">
                <animate attributeName="r" values="5;8;5" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite" />
              </circle>
              <circle cx={city.x} cy={city.y} r="3" fill={GREEN} stroke="none" />
              <text x={city.x + 9} y={city.y + 3} fontSize="8" fill={GREEN} stroke="none"
                fontWeight="bold" letterSpacing="1" style={{ filter: `drop-shadow(0 0 4px ${GREEN})` }}>
                {city.name}
              </text>
            </>
          ) : (
            <>
              <circle cx={city.x} cy={city.y} r="2.5" fill="rgba(20,248,20,0.25)" stroke={GREEN} strokeWidth="0.8" />
              <text x={city.x + 5} y={city.y + 3} fontSize="5.5" fill={GREEN} stroke="none" opacity="0.6">
                {city.name}
              </text>
            </>
          )}
        </g>
      ))}

      <MapExtras />
    </svg>
  );
}

// Colombia map - all departments, Santander highlighted
function ColombiaMapSVG() {
  const { departments, santanderCenter } = useMemo(() => {
    const projection = geoMercator()
      .center([-74.0, 4.5])
      .scale(2400)
      .translate([WIDTH / 2, HEIGHT / 2]);

    const pathGen = geoPath().projection(projection);
    const collection = colombiaData as unknown as FeatureCollection<Polygon | MultiPolygon>;

    const deps = collection.features.map(f => ({
      d: pathGen(f) || '',
      isSantander: (f.properties as { DPTO: string }).DPTO === '68',
      name: (f.properties as { NAME: string }).NAME,
    }));

    const santFeature = collection.features.find(f => (f.properties as { DPTO: string }).DPTO === '68');
    let center: [number, number] = [0, 0];
    if (santFeature) {
      const centroid = geoPath().projection(projection).centroid(santFeature);
      center = [centroid[0], centroid[1]];
    }

    return { departments: deps, santanderCenter: center };
  }, []);

  return (
    <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} style={{ width: '88%', height: '88%' }}
      fill="none" stroke={GREEN} xmlns="http://www.w3.org/2000/svg">

      {departments.map((dep, i) => (
        <path key={i} d={dep.d}
          strokeWidth={dep.isSantander ? '2' : '0.6'}
          fill={dep.isSantander ? 'rgba(20,248,20,0.12)' : 'rgba(20,248,20,0.02)'}
          opacity={dep.isSantander ? 1 : 0.5}
          strokeLinejoin="round" strokeLinecap="round"
          style={dep.isSantander ? { filter: `drop-shadow(0 0 6px ${GREEN})` } : undefined}
        />
      ))}

      {/* Santander pulsing marker */}
      <circle cx={santanderCenter[0]} cy={santanderCenter[1]} r="6" fill="rgba(20,248,20,0.3)" stroke={GREEN} strokeWidth="1.5">
        <animate attributeName="r" values="6;10;6" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx={santanderCenter[0]} cy={santanderCenter[1]} r="4" fill={GREEN} stroke="none" />
      <text x={santanderCenter[0] + 10} y={santanderCenter[1] + 4} fontSize="9" fill={GREEN} stroke="none"
        fontWeight="bold" letterSpacing="1" style={{ filter: `drop-shadow(0 0 5px ${GREEN})` }}>
        SANTANDER
      </text>

      <MapExtras />
    </svg>
  );
}

// Shared decorative elements
function MapExtras() {
  return (
    <>
      {/* Compass Rose */}
      <g transform={`translate(${WIDTH - 30}, ${HEIGHT - 40})`} opacity="0.4">
        <line x1="0" y1="-14" x2="0" y2="14" strokeWidth="0.8" />
        <line x1="-14" y1="0" x2="14" y2="0" strokeWidth="0.8" />
        <line x1="-9" y1="-9" x2="9" y2="9" strokeWidth="0.4" />
        <line x1="9" y1="-9" x2="-9" y2="9" strokeWidth="0.4" />
        <text x="-3" y="-18" fontSize="7" fill={GREEN} stroke="none" fontWeight="bold">N</text>
        <text x="-2" y="24" fontSize="5" fill={GREEN} stroke="none">S</text>
        <text x="18" y="2" fontSize="5" fill={GREEN} stroke="none">E</text>
        <text x="-22" y="2" fontSize="5" fill={GREEN} stroke="none">W</text>
        <circle cx="0" cy="0" r="2.5" strokeWidth="0.8" fill="rgba(20,248,20,0.2)" />
      </g>

      {/* Scale bar */}
      <g transform="translate(12, 525)" opacity="0.3">
        <line x1="0" y1="0" x2="60" y2="0" strokeWidth="0.8" />
        <line x1="0" y1="-3" x2="0" y2="3" strokeWidth="0.8" />
        <line x1="30" y1="-2" x2="30" y2="2" strokeWidth="0.5" />
        <line x1="60" y1="-3" x2="60" y2="3" strokeWidth="0.8" />
        <text x="0" y="9" fontSize="5" fill={GREEN} stroke="none">0</text>
        <text x="22" y="9" fontSize="5" fill={GREEN} stroke="none">50km</text>
        <text x="48" y="9" fontSize="5" fill={GREEN} stroke="none">100km</text>
      </g>
    </>
  );
}

function arrowStyle(side: 'left' | 'right'): React.CSSProperties {
  return {
    position: 'absolute',
    [side]: '6px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'rgba(0,0,0,0.6)',
    border: `1px solid ${GREEN}`,
    color: GREEN,
    fontSize: '1rem',
    padding: '8px 6px',
    cursor: 'pointer',
    zIndex: 10,
    lineHeight: 1,
    textShadow: `0 0 6px ${GREEN}`,
  };
}

function WaypointCard({ icon, label, value, sub, link }: { icon: string; label: string; value: string; sub?: string; link?: string }) {
  const card = (
    <div style={{
      border: `1px solid ${GREEN}`, padding: '0.75rem',
      display: 'flex', alignItems: 'center', gap: '0.75rem',
      cursor: link ? 'pointer' : 'default', transition: 'background 0.15s',
    }}
      onMouseEnter={e => { if (link) (e.currentTarget as HTMLElement).style.background = 'rgba(20,248,20,0.08)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
    >
      <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>{icon}</span>
      <div>
        <div style={{ fontSize: '0.78rem', opacity: 0.5, letterSpacing: '1px' }}>{label}</div>
        <div style={{ fontSize: '0.95rem', lineHeight: 1.4, wordBreak: 'break-all' }}>{value}</div>
        {sub && <div style={{ fontSize: '0.78rem', opacity: 0.45 }}>{sub}</div>}
      </div>
    </div>
  );
  if (link) return <a href={link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>{card}</a>;
  return card;
}
