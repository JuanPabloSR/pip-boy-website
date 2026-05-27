import { motion } from 'framer-motion';
import walkGif from '../../assets/derek-walk.gif';

const GREEN = '#14F814';

export default function MapTab() {
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

      {/* Right: SVG Santander Map */}
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

        <SantanderMap />

        {/* ── Bucaramanga pulsing marker ── */}
        <div style={{ position: 'absolute', left: '58%', top: '18%', transform: 'translate(-50%,-50%)' }}>
          <div style={{
            width: '16px', height: '16px', borderRadius: '50%', background: GREEN,
            boxShadow: `0 0 0 0 ${GREEN}`,
            animation: 'ping 1.4s cubic-bezier(0,0,0.2,1) infinite',
            position: 'absolute', top: 0, left: 0,
          }} />
          <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: GREEN, position: 'relative', zIndex: 1, boxShadow: `0 0 8px ${GREEN}` }} />
        </div>
        <div style={{ position: 'absolute', left: 'calc(58% + 16px)', top: 'calc(18% - 8px)', fontSize: '0.7rem', color: GREEN, textShadow: `0 0 6px ${GREEN}`, fontWeight: 'bold', letterSpacing: '1px' }}>
          BUCARAMANGA
        </div>

        {/* Secondary city markers */}
        <CityDot left="28%" top="38%" label="BARRANC." />
        <CityDot left="52%" top="55%" label="SAN GIL" />
        <CityDot left="48%" top="68%" label="SOCORRO" />
        <CityDot left="68%" top="58%" label="MÁLAGA" />
        <CityDot left="35%" top="78%" label="VÉLEZ" />

        {/* Vault Boy */}
        <img
          src={walkGif}
          alt="Vault Boy"
          style={{
            position: 'absolute', bottom: '8px', left: '8px',
            width: 75, height: 75, objectFit: 'contain',
            mixBlendMode: 'screen',
            filter: 'sepia(100%) hue-rotate(75deg) saturate(500%) brightness(110%) contrast(120%)',
            opacity: 0.9,
          }}
        />

        {/* Corner labels */}
        <span style={{ position: 'absolute', top: '6px', left: '8px', fontSize: '0.62rem', opacity: 0.4 }}>N 8°09'</span>
        <span style={{ position: 'absolute', bottom: '6px', right: '8px', fontSize: '0.62rem', opacity: 0.4 }}>W 73°38'</span>
        <span style={{ position: 'absolute', top: '6px', right: '8px', fontSize: '0.62rem', opacity: 0.4 }}>DPTO. SANTANDER</span>
        <span style={{ position: 'absolute', bottom: '6px', left: '85px', fontSize: '0.6rem', opacity: 0.25, letterSpacing: '1px' }}>VAULT-TEC CARTOGRAPHY v3.1</span>
      </div>
    </motion.div>
  );
}

function CityDot({ left, top, label }: { left: string; top: string; label: string }) {
  return (
    <>
      <div style={{
        position: 'absolute', left, top, transform: 'translate(-50%,-50%)',
        width: '8px', height: '8px', borderRadius: '50%',
        border: `1px solid ${GREEN}`, background: 'rgba(20,248,20,0.3)',
      }} />
      <span style={{
        position: 'absolute',
        left: `calc(${left} + 8px)`,
        top: `calc(${top} - 6px)`,
        fontSize: '0.52rem', color: GREEN, opacity: 0.5, letterSpacing: '0.5px',
      }}>{label}</span>
    </>
  );
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

/**
 * SVG outline of Santander (Colombia) traced from reference image.
 * Key feature: deep western inlets (canyons/ríos) creating jagged "fingers".
 * Bucaramanga sits in the north-central area.
 */
function SantanderMap() {
  // Outline traced clockwise from top-left
  const outline = `
    M 220,50

    L 240,35 L 258,28 L 272,32 L 278,18 L 295,10 L 312,14 L 322,28
    L 338,18 L 352,10 L 368,20 L 380,32 L 388,48

    L 396,68 L 402,90 L 408,115 L 412,140 L 416,170 L 418,200

    L 416,230 L 414,258 L 416,285 L 418,310 L 416,340 L 414,365 L 416,390

    L 420,415 L 424,440 L 420,465 L 415,490 L 405,512 L 392,530

    L 375,545 L 355,555 L 332,565 L 308,572 L 282,578 L 258,580

    L 235,576 L 212,568 L 192,555 L 175,540 L 160,520 L 148,498

    L 138,475 L 128,450 L 120,428 L 112,405 L 105,385

    L 95,370 L 82,358 L 68,350 L 52,345
    L 58,332 L 72,322 L 82,315

    L 68,305 L 50,292 L 35,282 L 22,275
    L 32,262 L 48,252 L 62,245

    L 48,235 L 30,222 L 18,210 L 10,198
    L 20,186 L 38,178 L 52,172

    L 40,162 L 25,150 L 15,140 L 8,128
    L 18,118 L 35,112 L 52,108

    L 42,98 L 30,88 L 22,78 L 18,68
    L 30,62 L 48,58 L 62,56

    L 78,55 L 95,52 L 112,50 L 130,48 L 150,46
    L 172,48 L 195,48 L 220,50

    Z
  `;

  // Internal province borders
  const borders = [
    // Horizontal divisions
    "M 62,108 Q 160,130 260,115 Q 350,100 408,115",
    "M 52,172 Q 150,195 250,180 Q 340,168 416,170",
    "M 10,198 Q 80,230 160,260 Q 260,275 416,285",
    "M 105,385 Q 200,370 300,380 Q 380,388 416,390",
    "M 138,475 Q 230,460 320,470 Q 380,478 415,490",

    // Vertical divisions
    "M 278,18 Q 275,100 270,180 Q 268,280 270,380 Q 275,480 282,578",
    "M 180,46 Q 178,130 175,200 Q 172,300 175,400 Q 178,500 175,540",
    "M 370,20 Q 365,100 360,200 Q 358,300 360,400 Q 365,480 392,530",

    // Diagonal connectors
    "M 260,115 Q 240,148 220,180",
    "M 270,280 Q 310,320 340,365",
    "M 175,200 Q 140,240 120,280",
  ];

  // Rivers
  const rivers = [
    // Río Chicamocha — runs through western canyons
    "M 350,70 Q 300,130 260,180 Q 200,240 140,310 Q 100,360 68,400",
    // Río Suárez
    "M 200,400 Q 220,460 240,520 Q 260,555 282,578",
    // Río Sogamoso
    "M 260,180 Q 200,190 140,210 Q 80,230 30,250",
  ];

  return (
    <svg viewBox="-5 -5 440 600" style={{ width: '90%', height: '90%' }}
      fill="none" stroke="#14F814" xmlns="http://www.w3.org/2000/svg">

      {/* ── Department outline ── */}
      <path d={outline}
        strokeWidth="2"
        fill="rgba(20,248,20,0.04)"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* ── Internal province borders ── */}
      <g strokeWidth="0.6" opacity="0.35" strokeDasharray="4 3">
        {borders.map((d, i) => <path key={i} d={d} />)}
      </g>

      {/* ── Rivers ── */}
      <g strokeWidth="1" opacity="0.25" strokeDasharray="6 4" strokeLinecap="round">
        {rivers.map((d, i) => <path key={i} d={d} />)}
      </g>

      {/* ── Topographic contours ── */}
      <g strokeWidth="0.4" opacity="0.12">
        <ellipse cx="300" cy="120" rx="55" ry="30" />
        <ellipse cx="300" cy="120" rx="38" ry="20" />
        <ellipse cx="300" cy="120" rx="20" ry="10" />

        <ellipse cx="200" cy="350" rx="45" ry="35" />
        <ellipse cx="200" cy="350" rx="28" ry="20" />

        <ellipse cx="340" cy="430" rx="40" ry="28" />
        <ellipse cx="340" cy="430" rx="22" ry="14" />
      </g>

      {/* ── Elevation labels ── */}
      <text x="278" y="115" fontSize="6.5" fill="#14F814" stroke="none" opacity="0.45">3.200m</text>
      <text x="178" y="345" fontSize="6" fill="#14F814" stroke="none" opacity="0.35">1.800m</text>
      <text x="322" y="425" fontSize="6" fill="#14F814" stroke="none" opacity="0.35">2.400m</text>

      {/* ── Compass Rose ── */}
      <g transform="translate(400, 555)" opacity="0.45">
        <line x1="0" y1="-16" x2="0" y2="16" strokeWidth="1" />
        <line x1="-16" y1="0" x2="16" y2="0" strokeWidth="1" />
        <line x1="-10" y1="-10" x2="10" y2="10" strokeWidth="0.5" />
        <line x1="10" y1="-10" x2="-10" y2="10" strokeWidth="0.5" />
        <text x="-3" y="-20" fontSize="8" fill="#14F814" stroke="none" fontWeight="bold">N</text>
        <text x="-3" y="26" fontSize="6" fill="#14F814" stroke="none">S</text>
        <text x="20" y="3" fontSize="6" fill="#14F814" stroke="none">E</text>
        <text x="-25" y="3" fontSize="6" fill="#14F814" stroke="none">W</text>
        <circle cx="0" cy="0" r="3" strokeWidth="1" fill="rgba(20,248,20,0.2)" />
      </g>

      {/* ── Scale bar ── */}
      <g transform="translate(15, 575)" opacity="0.35">
        <line x1="0" y1="0" x2="70" y2="0" strokeWidth="1" />
        <line x1="0" y1="-3" x2="0" y2="3" strokeWidth="1" />
        <line x1="35" y1="-2" x2="35" y2="2" strokeWidth="0.7" />
        <line x1="70" y1="-3" x2="70" y2="3" strokeWidth="1" />
        <text x="0" y="10" fontSize="5.5" fill="#14F814" stroke="none">0</text>
        <text x="26" y="10" fontSize="5.5" fill="#14F814" stroke="none">50km</text>
        <text x="55" y="10" fontSize="5.5" fill="#14F814" stroke="none">100km</text>
      </g>
    </svg>
  );
}
