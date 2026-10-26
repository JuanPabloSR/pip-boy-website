import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { geoMercator, geoPath, type GeoProjection } from 'd3-geo';
import type { Feature, FeatureCollection, MultiPolygon, Polygon } from 'geojson';
import { Check, Copy, Mail, MapPin, Radio } from 'lucide-react';
import colombiaData from '../../assets/colombia.geo.json';
import santanderData from '../../assets/santander.geo.json';
import type { Waypoint } from '../../data/types';
import { useListNav } from '../../hooks/useListNav';
import { falloutTime, useNow } from '../../hooks/useNow';
import { usePip } from '../../state/pip';
import { soundEffects } from '../../utils/audio';
import { GithubIcon, LinkedinIcon } from '../Icon';
import SubTabs from '../SubTabs';
import VaultBoy from '../VaultBoy';

const WIDTH = 380;
const HEIGHT = 540;
const ZOOM_SCALE = 4.2; // ratio between the Santander and Colombia projections
const SANTANDER_CODE = '68';
const ANTIOQUIA_CODE = '05';

// Santander towns [lon, lat]
const TOWNS: { name: string; coords: [number, number] }[] = [
  { name: 'FLORIDABLANCA', coords: [-73.0864, 7.0622] },
  { name: 'GIRÓN', coords: [-73.171, 7.0684] },
  { name: 'PIEDECUESTA', coords: [-73.0505, 6.9872] },
  { name: 'B/BERMEJA', coords: [-73.8549, 7.0653] },
  { name: 'SAN GIL', coords: [-73.1347, 6.5544] },
  { name: 'SOCORRO', coords: [-73.2614, 6.47] },
  { name: 'MÁLAGA', coords: [-72.7334, 6.7044] },
  { name: 'VÉLEZ', coords: [-73.6734, 6.0131] },
  { name: 'BARBOSA', coords: [-73.6143, 5.9317] },
  { name: 'EL PLAYÓN', coords: [-73.205, 7.47] },
  { name: 'RIONEGRO', coords: [-73.1543, 7.3821] },
  { name: 'LEBRIJA', coords: [-73.2161, 7.1145] },
  { name: 'SAN VICENTE', coords: [-73.4244, 6.8839] },
  { name: 'CIMITARRA', coords: [-73.9507, 6.3167] },
  { name: 'ZAPATOCA', coords: [-73.269, 6.8138] },
  { name: 'BARICHARA', coords: [-73.2258, 6.6356] },
];

const colombia = colombiaData as unknown as FeatureCollection<Polygon | MultiPolygon, { DPTO: string; NAME: string }>;
const santander = santanderData as unknown as Feature<Polygon>;

const worldProjection = () => geoMercator().center([-74.0, 4.5]).scale(2400).translate([WIDTH / 2, HEIGHT / 2]);
const localProjection = () => geoMercator().center([-73.5, 6.9]).scale(10000).translate([WIDTH / 2, HEIGHT / 2]);

export default function MapTab() {
  const { t, profile, subTab, setSubTab } = usePip();
  const isLocal = subTab.MAP === 0;
  const waypoints = profile.waypoints;
  const [index, setIndex] = useState(0);

  const select = (i: number) => {
    setIndex(i);
    // Waypoints outside Santander only exist on the world map.
    if (!isInsideSantander(waypoints[i])) setSubTab('MAP', 1);
  };
  const { detailRef, pick } = useListNav(waypoints.length, index, select);

  // Santander's centroid in world-map pixels, used as the zoom origin.
  const zoomOrigin = useMemo(() => {
    const feat = colombia.features.find(f => f.properties.DPTO === SANTANDER_CODE);
    if (!feat) return '55% 35%';
    const [x, y] = geoPath().projection(worldProjection()).centroid(feat);
    return `${(x / WIDTH) * 100}% ${(y / HEIGHT) * 100}%`;
  }, []);

  const switchMap = () => {
    soundEffects.subTabSwitch();
    setSubTab('MAP', isLocal ? 1 : 0);
  };

  const selectedId = waypoints[index]?.id;

  return (
    <>
      <SubTabs tab="MAP" labels={[t.map.local, t.map.world]} />
      <div className="split wide-right">
        <div className="pane flex" style={{ gap: '0.65rem' }}>
          <Contact />

          <span className="section-label" style={{ marginTop: '0.4rem' }}>// {t.mapUi.waypoints}</span>
          <div className="plist" role="listbox" aria-label={t.mapUi.waypoints}>
            {waypoints.map((wp, i) => (
              <button key={wp.id} type="button" role="option" className="plist-item" aria-selected={i === index} onClick={() => pick(i)}>
                <span className="marker" aria-hidden="true">{wp.home ? '◈' : '◇'}</span>
                <span className="label">
                  {wp.name}
                  <small>{wp.label}</small>
                </span>
              </button>
            ))}
          </div>
          <p className="detail-text" style={{ fontSize: '0.92rem' }} aria-live="polite">{waypoints[index]?.description}</p>
        </div>

        <div className="map-frame" ref={detailRef}>
          <button type="button" className="map-arrow" style={{ left: 6 }} onClick={switchMap} aria-label={t.mapUi.prev}>◄</button>
          <button type="button" className="map-arrow" style={{ right: 6 }} onClick={switchMap} aria-label={t.mapUi.next}>►</button>

          <span className="map-label" style={{ top: 8, left: 10 }}>
            {isLocal ? t.mapUi.santander : t.mapUi.colombia}
          </span>
          <span className="map-label" style={{ bottom: 8, right: 10 }}>N 7°07' · W 73°07'</span>

          {/* World layer zooms into Santander while the local layer zooms out of it */}
          <div role="img" aria-label={isLocal ? t.mapUi.santander : t.mapUi.colombia} style={{ position: 'absolute', inset: 0 }}>
          <motion.div className="map-layer"
            initial={false}
            animate={{ scale: isLocal ? ZOOM_SCALE : 1, opacity: isLocal ? 0 : 1 }}
            transition={{
              scale: { duration: 1.6, ease: [0.4, 0, 0.2, 1] },
              opacity: isLocal ? { duration: 0.9, delay: 0.4 } : { duration: 0.5, delay: 1 },
            }}
            inert={isLocal}
            style={{ transformOrigin: zoomOrigin, pointerEvents: isLocal ? 'none' : 'auto' }}>
            <WorldMap waypoints={waypoints} selectedId={selectedId} onSelect={id => pick(waypoints.findIndex(w => w.id === id))} />
          </motion.div>

          <motion.div className="map-layer"
            initial={false}
            animate={{ scale: isLocal ? 1 : 1 / ZOOM_SCALE, opacity: isLocal ? 1 : 0 }}
            transition={{
              scale: { duration: 1.6, ease: [0.4, 0, 0.2, 1] },
              opacity: isLocal ? { duration: 0.5, delay: 1 } : { duration: 0.5 },
            }}
            inert={!isLocal}
            style={{ pointerEvents: isLocal ? 'auto' : 'none' }}>
            <LocalMap waypoints={waypoints} selectedId={selectedId} onSelect={id => pick(waypoints.findIndex(w => w.id === id))} />
          </motion.div>
          </div>

          <div className="map-walker"><VaultBoy name={['map', 'walk-cat']} /></div>
          <span className="map-label map-credit" style={{ bottom: 8, left: '50%', transform: 'translateX(-50%)' }}>{t.mapUi.cartography} v3.2</span>
        </div>
      </div>
    </>
  );
}

function isInsideSantander(wp: Waypoint) {
  const [lon, lat] = wp.coords;
  return lon > -74.6 && lon < -72.4 && lat > 5.6 && lat < 8.2;
}

function Marker({ x, y, wp, selected, onSelect, size = 1 }: {
  x: number; y: number; wp: Waypoint; selected: boolean; onSelect: (id: string) => void; size?: number;
}) {
  const r = (wp.home ? 4 : 3) * size;
  return (
    // Mouse/touch shortcut only: the waypoint list is the accessible way to select.
    <g className="map-marker" onClick={() => onSelect(wp.id)}>
      <circle className="ring" cx={x} cy={y} r={r + 2} fill="rgb(var(--pip-rgb) / 0.25)" stroke="var(--pip)" strokeWidth={1.4}>
        <animate attributeName="r" values={`${r + 2};${r + 6};${r + 2}`} dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="1;0.35;1" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx={x} cy={y} r={r} fill="var(--pip)" stroke="none" />
      {selected && <rect x={x - r - 7} y={y - r - 7} width={2 * r + 14} height={2 * r + 14} fill="none" stroke="var(--pip)" strokeWidth={1} strokeDasharray="3 2" />}
      <text x={wp.home ? x + r + 8 : x - r - 8} y={y + 3.5} textAnchor={wp.home ? 'start' : 'end'}
        fontSize={12 * Math.min(size, 1.1)} fill="var(--pip)" stroke="#000" strokeWidth={3} paintOrder="stroke"
        fontWeight={700} letterSpacing={1}>
        {wp.name.toUpperCase()}
      </text>
      <circle cx={x} cy={y} r={14} fill="transparent" stroke="none" />
    </g>
  );
}

interface MapProps {
  waypoints: Waypoint[];
  selectedId?: string;
  onSelect: (id: string) => void;
}

function project(p: GeoProjection, coords: [number, number]) {
  const pt = p(coords);
  return { x: pt?.[0] ?? 0, y: pt?.[1] ?? 0 };
}

function LocalMap({ waypoints, selectedId, onSelect }: MapProps) {
  const { outline, towns, proj } = useMemo(() => {
    const p = localProjection();
    return {
      proj: p,
      outline: geoPath().projection(p)(santander) ?? '',
      // Towns right next to a waypoint would hide its marker and label.
      towns: TOWNS
        .filter(c => waypoints.every(wp => Math.hypot(wp.coords[0] - c.coords[0], wp.coords[1] - c.coords[1]) > 0.16))
        .map(c => ({ ...c, ...project(p, c.coords) })),
    };
  }, [waypoints]);

  return (
    <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} fill="none" stroke="var(--pip)" aria-hidden="true">
      <path d={outline} strokeWidth={2} fill="rgb(var(--pip-rgb) / 0.04)" strokeLinejoin="round"
        style={{ filter: 'drop-shadow(0 0 4px rgb(var(--pip-rgb) / 0.8))' }} />
      {towns.map(c => (
        <g key={c.name} opacity={0.6}>
          <circle cx={c.x} cy={c.y} r={2.2} fill="rgb(var(--pip-rgb) / 0.3)" strokeWidth={0.8} />
          <text x={c.x + 5} y={c.y + 3} fontSize={10.5} fill="var(--pip)" stroke="#000" strokeWidth={3} paintOrder="stroke">{c.name}</text>
        </g>
      ))}
      {waypoints.filter(isInsideSantander).map(wp => {
        const { x, y } = project(proj, wp.coords);
        return <Marker key={wp.id} x={x} y={y} wp={wp} selected={wp.id === selectedId} onSelect={onSelect} size={1.2} />;
      })}
      <MapExtras />
    </svg>
  );
}

function WorldMap({ waypoints, selectedId, onSelect }: MapProps) {
  const { departments, points } = useMemo(() => {
    const p = worldProjection();
    const path = geoPath().projection(p);
    return {
      departments: colombia.features.map(f => ({ d: path(f) ?? '', code: f.properties.DPTO })),
      points: waypoints.map(wp => ({ wp, ...project(p, wp.coords) })),
    };
  }, [waypoints]);

  const home = points.find(pt => pt.wp.home);

  return (
    <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} fill="none" stroke="var(--pip)" aria-hidden="true">
      {departments.map(dep => {
        const highlight = dep.code === SANTANDER_CODE;
        const secondary = dep.code === ANTIOQUIA_CODE;
        return (
          <path key={dep.code} d={dep.d}
            strokeWidth={highlight ? 2 : 0.6}
            fill={highlight ? 'rgb(var(--pip-rgb) / 0.14)' : secondary ? 'rgb(var(--pip-rgb) / 0.07)' : 'rgb(var(--pip-rgb) / 0.02)'}
            opacity={highlight ? 1 : secondary ? 0.8 : 0.5}
            strokeLinejoin="round"
            style={highlight ? { filter: 'drop-shadow(0 0 6px rgb(var(--pip-rgb) / 0.8))' } : undefined} />
        );
      })}
      {/* Remote link from home base to every other waypoint */}
      {home && points.filter(pt => !pt.wp.home).map(pt => (
        <line key={pt.wp.id} x1={home.x} y1={home.y} x2={pt.x} y2={pt.y} strokeWidth={1} strokeDasharray="4 3" opacity={0.75}>
          <animate attributeName="stroke-dashoffset" values="14;0" dur="1s" repeatCount="indefinite" />
        </line>
      ))}
      {points.map(pt => (
        <Marker key={pt.wp.id} x={pt.x} y={pt.y} wp={pt.wp} selected={pt.wp.id === selectedId} onSelect={onSelect} />
      ))}
      <MapExtras />
    </svg>
  );
}

function MapExtras() {
  return (
    <>
      <g transform={`translate(${WIDTH - 24}, 34)`} opacity={0.5}>
        <line x1={0} y1={-14} x2={0} y2={14} strokeWidth={0.8} />
        <line x1={-14} y1={0} x2={14} y2={0} strokeWidth={0.8} />
        <line x1={-9} y1={-9} x2={9} y2={9} strokeWidth={0.4} />
        <line x1={9} y1={-9} x2={-9} y2={9} strokeWidth={0.4} />
        <text x={-3} y={-18} fontSize={7} fill="var(--pip)" stroke="none" fontWeight={700}>N</text>
        <circle cx={0} cy={0} r={2.5} strokeWidth={0.8} fill="rgb(var(--pip-rgb) / 0.2)" />
      </g>
    </>
  );
}

function Contact() {
  const { t, profile, settings } = usePip();
  const [copied, setCopied] = useState(false);
  const now = useNow(15_000);
  const bogotaTime = falloutTime(now, settings.lang, 'America/Bogota');

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      soundEffects.confirm();
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      soundEffects.deny();
    }
  };

  return (
    <>
      <span className="section-label">// {t.mapUi.contact}</span>
      <div style={{ display: 'flex', gap: '4px' }}>
        <a className="waypoint" href={`mailto:${profile.email}`} style={{ flex: 1, minWidth: 0 }}>
          <Mail aria-hidden="true" />
          <span style={{ minWidth: 0 }}>
            <span className="wp-label">{t.mapUi.email}</span>
            <span className="wp-value" style={{ display: 'block', textTransform: 'none' }}>{profile.email}</span>
          </span>
        </a>
        <button type="button" className="pbtn" onClick={copy} aria-label={t.mapUi.copy} title={t.mapUi.copy} style={{ minWidth: '2.6rem' }}>
          {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
          <span className="sr-only" aria-live="polite">{copied ? t.mapUi.copied : ''}</span>
        </button>
      </div>
      <a className="waypoint" href={profile.linkedin} target="_blank" rel="noopener noreferrer">
        <LinkedinIcon />
        <span>
          <span className="wp-label">LinkedIn</span>
          <span className="wp-value" style={{ display: 'block', textTransform: 'none' }}>{profile.linkedin.replace(/^https:\/\/(www\.)?/, '')}</span>
        </span>
      </a>
      <a className="waypoint" href={profile.github} target="_blank" rel="noopener noreferrer">
        <GithubIcon />
        <span>
          <span className="wp-label">GitHub</span>
          <span className="wp-value" style={{ display: 'block', textTransform: 'none' }}>{profile.github.replace(/^https:\/\//, '')}</span>
        </span>
      </a>
      <div className="waypoint" style={{ flexDirection: 'column', gap: '0.25rem' }}>
        <span className="wp-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Radio aria-hidden="true" style={{ width: '1rem', height: '1rem', margin: 0 }} />
          {t.mapUi.signal}: <span className="pulse" style={{ color: 'var(--pip)' }}>{t.mapUi.online}</span>
        </span>
        {profile.availability.map(a => <span key={a} className="wp-sub" style={{ fontSize: '0.9rem' }}>► {a}</span>)}
        <span className="wp-sub" style={{ fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <MapPin aria-hidden="true" style={{ width: '0.95rem', height: '0.95rem', margin: 0 }} />
          {t.mapUi.localTime}: {bogotaTime} · {profile.timezoneLabel}
        </span>
      </div>
    </>
  );
}
