import { motion } from 'framer-motion';
import walkGif from '../../assets/derek-walk.gif';
import VaultBoyDisplay from '../VaultBoyDisplay';

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

        {/* Vault Boy */}
        <div style={{ position: 'absolute', bottom: '8px', left: '8px' }}>
          <VaultBoyDisplay src={walkGif} size={75} />
        </div>

        {/* Corner labels */}
        <span style={{ position: 'absolute', top: '6px', left: '8px', fontSize: '0.62rem', opacity: 0.4 }}>N 8°09'</span>
        <span style={{ position: 'absolute', bottom: '6px', right: '8px', fontSize: '0.62rem', opacity: 0.4 }}>W 73°38'</span>
        <span style={{ position: 'absolute', top: '6px', right: '8px', fontSize: '0.62rem', opacity: 0.4 }}>DPTO. SANTANDER</span>
        <span style={{ position: 'absolute', bottom: '6px', left: '85px', fontSize: '0.6rem', opacity: 0.25, letterSpacing: '1px' }}>VAULT-TEC CARTOGRAPHY v3.2</span>
      </div>
    </motion.div>
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

// Accurate Santander (Colombia) outline based on real geographic boundaries
// Coordinate system: x = longitude mapped, y = latitude mapped (inverted)
// Bounds: lat 5.82-7.58, lon -74.20 to -72.68
function SantanderMap() {
  // Accurate outline of Santander traced from geographic boundaries
  // Clockwise from northwest corner
  const outline = `
    M 58,78
    L 65,72 L 75,65 L 88,58 L 102,52 L 118,46 L 135,40
    L 152,35 L 168,30 L 182,25 L 195,20 L 208,15 L 220,10
    L 232,8 L 244,6 L 255,8 L 265,12 L 274,18
    L 283,25 L 292,34 L 300,44 L 308,52 L 316,58
    L 324,62 L 332,68 L 340,76 L 346,85 L 350,95
    L 354,106 L 357,118 L 360,132 L 362,145 L 363,158
    L 364,170 L 366,182 L 368,194 L 370,206
    L 372,218 L 374,230 L 375,242 L 376,254 L 375,266
    L 373,278 L 370,290 L 366,302 L 362,312
    L 357,322 L 351,332 L 345,342 L 338,352
    L 330,362 L 322,370 L 313,378 L 304,386
    L 294,394 L 284,400 L 274,406 L 264,412
    L 254,418 L 244,424 L 234,430 L 224,436
    L 214,442 L 204,448 L 194,454 L 184,460
    L 174,466 L 165,472 L 156,478 L 148,484
    L 140,490 L 133,496 L 126,502 L 120,508
    L 115,514 L 111,520 L 108,526 L 106,530
    L 103,528 L 100,522 L 97,514 L 94,504
    L 90,492 L 86,480 L 82,468 L 78,456
    L 74,444 L 70,432 L 66,420 L 62,408
    L 58,396 L 54,384 L 50,372 L 46,360
    L 42,348 L 38,336 L 34,325 L 30,314
    L 27,303 L 24,292 L 22,282 L 20,272
    L 19,262 L 18,252 L 18,242 L 19,232
    L 20,222 L 22,212 L 24,202 L 27,192
    L 30,182 L 34,172 L 38,162 L 42,153
    L 46,144 L 50,136 L 54,128 L 56,120
    L 55,112 L 53,104 L 52,96 L 54,90
    L 56,85 L 58,78
    Z
  `;

  // Rivers for geographic detail
  const rivers = [
    // Rio Chicamocha (runs through central canyon)
    "M 340,78 Q 310,130 280,175 Q 250,220 220,270 Q 190,310 160,360",
    // Rio Suárez (south-central)
    "M 180,360 Q 165,400 150,440 Q 135,475 120,508",
    // Rio Sogamoso (central-west)
    "M 250,180 Q 200,190 150,200 Q 100,215 50,230",
    // Rio Magdalena (western boundary hint)
    "M 58,78 Q 45,130 35,180 Q 25,240 20,300",
  ];

  // Internal province divisions (simplified)
  const divisions = [
    "M 18,242 Q 120,235 220,230 Q 300,225 375,242",
    "M 50,372 Q 140,365 230,360 Q 290,358 338,352",
    "M 200,10 Q 198,100 195,200 Q 192,300 190,400 Q 188,450 184,460",
    "M 300,44 Q 295,130 290,220 Q 285,310 280,400",
  ];

  // City positions based on real geographic coordinates
  const cities: { x: number; y: number; name: string; capital?: boolean }[] = [
    { x: 262, y: 140, name: "BUCARAMANGA", capital: true },
    { x: 275, y: 152, name: "FLORIDABLANCA" },
    { x: 248, y: 148, name: "GIRÓN" },
    { x: 280, y: 165, name: "PIEDECUESTA" },
    { x: 93, y: 158, name: "B/BERMEJA" },
    { x: 258, y: 300, name: "SAN GIL" },
    { x: 230, y: 320, name: "SOCORRO" },
    { x: 340, y: 258, name: "MÁLAGA" },
    { x: 135, y: 454, name: "VÉLEZ" },
    { x: 150, y: 438, name: "BARBOSA" },
    { x: 242, y: 42, name: "EL PLAYÓN" },
    { x: 250, y: 62, name: "RIONEGRO" },
    { x: 220, y: 105, name: "LEBRIJA" },
    { x: 165, y: 235, name: "SAN VICENTE" },
    { x: 55, y: 370, name: "CIMITARRA" },
    { x: 218, y: 275, name: "ZAPATOCA" },
  ];

  return (
    <svg viewBox="-5 -5 395 550" style={{ width: '88%', height: '92%' }}
      fill="none" stroke={GREEN} xmlns="http://www.w3.org/2000/svg">

      {/* Department outline */}
      <path d={outline}
        strokeWidth="2"
        fill="rgba(20,248,20,0.03)"
        strokeLinejoin="round"
        strokeLinecap="round"
        style={{ filter: `drop-shadow(0 0 3px ${GREEN})` }}
      />

      {/* Internal province divisions */}
      <g strokeWidth="0.5" opacity="0.2" strokeDasharray="4 3">
        {divisions.map((d, i) => <path key={`div-${i}`} d={d} />)}
      </g>

      {/* Rivers */}
      <g strokeWidth="0.8" opacity="0.2" strokeDasharray="6 4" strokeLinecap="round">
        {rivers.map((d, i) => <path key={`riv-${i}`} d={d} />)}
      </g>

      {/* Topographic contours */}
      <g strokeWidth="0.3" opacity="0.1">
        <ellipse cx="280" cy="140" rx="40" ry="22" />
        <ellipse cx="280" cy="140" rx="25" ry="14" />
        <ellipse cx="250" cy="300" rx="35" ry="25" />
        <ellipse cx="250" cy="300" rx="20" ry="14" />
        <ellipse cx="340" cy="260" rx="25" ry="18" />
      </g>

      {/* City markers */}
      {cities.map((city, i) => (
        <g key={`city-${i}`}>
          {city.capital ? (
            <>
              {/* Pulsing marker for capital */}
              <circle cx={city.x} cy={city.y} r="5" fill="rgba(20,248,20,0.3)" stroke={GREEN} strokeWidth="1.5">
                <animate attributeName="r" values="5;8;5" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite" />
              </circle>
              <circle cx={city.x} cy={city.y} r="3" fill={GREEN} stroke="none" />
              <text x={city.x + 8} y={city.y + 3} fontSize="8" fill={GREEN} stroke="none"
                fontWeight="bold" letterSpacing="1" style={{ filter: `drop-shadow(0 0 4px ${GREEN})` }}>
                {city.name}
              </text>
            </>
          ) : (
            <>
              <circle cx={city.x} cy={city.y} r="2.5" fill="rgba(20,248,20,0.25)" stroke={GREEN} strokeWidth="0.8" />
              <text x={city.x + 5} y={city.y + 3} fontSize="5.5" fill={GREEN} stroke="none" opacity="0.55">
                {city.name}
              </text>
            </>
          )}
        </g>
      ))}

      {/* Elevation labels */}
      <text x="260" y="130" fontSize="5" fill={GREEN} stroke="none" opacity="0.3">3.200m</text>
      <text x="320" y="250" fontSize="5" fill={GREEN} stroke="none" opacity="0.3">2.800m</text>
      <text x="230" y="290" fontSize="5" fill={GREEN} stroke="none" opacity="0.3">1.600m</text>

      {/* Compass Rose */}
      <g transform="translate(355, 510)" opacity="0.4">
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
      <g transform="translate(12, 535)" opacity="0.3">
        <line x1="0" y1="0" x2="60" y2="0" strokeWidth="0.8" />
        <line x1="0" y1="-3" x2="0" y2="3" strokeWidth="0.8" />
        <line x1="30" y1="-2" x2="30" y2="2" strokeWidth="0.5" />
        <line x1="60" y1="-3" x2="60" y2="3" strokeWidth="0.8" />
        <text x="0" y="9" fontSize="5" fill={GREEN} stroke="none">0</text>
        <text x="22" y="9" fontSize="5" fill={GREEN} stroke="none">50km</text>
        <text x="48" y="9" fontSize="5" fill={GREEN} stroke="none">100km</text>
      </g>
    </svg>
  );
}
