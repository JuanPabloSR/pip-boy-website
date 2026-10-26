// Shape of every piece of content shown in the Pip-Boy.
// Both locales (profile.es.ts / profile.en.ts) implement this same interface,
// so adding a field here makes TypeScript point at every translation to update.

export type Lang = 'es' | 'en';

/** Icon names resolved in components/Icon.tsx */
export type IconName =
  | 'java' | 'angular' | 'react' | 'vue' | 'js' | 'python' | 'html'
  | 'shield' | 'shieldCheck' | 'testTube' | 'gauge' | 'bug'
  | 'syringe' | 'pill' | 'brain' | 'coffee' | 'users' | 'git' | 'zap'
  | 'monitor' | 'code' | 'terminal' | 'container' | 'cloud' | 'activity' | 'radar'
  | 'database' | 'message' | 'workflow' | 'network'
  | 'tape' | 'printer' | 'key'
  | 'scale' | 'bot' | 'rocket' | 'globe';

export interface SpecialStat {
  letter: 'S' | 'P' | 'E' | 'C' | 'I' | 'A' | 'L';
  /** Fallout attribute name, e.g. "FUERZA" */
  attribute: string;
  /** What it means for this profile, e.g. "Backend Java" */
  skill: string;
  value: number; // 1–10
  description: string;
  tags: string[];
}

export interface Perk {
  id: string;
  name: string;
  rank: number;
  maxRank: number;
  description: string;
}

export interface InvItem {
  id: string;
  name: string;
  /** Fallout flavour line shown under the name ("Rifle de combate · Backend") */
  kind: string;
  icon: IconName;
  equipped?: boolean;
  description: string;
  /** Sub-technologies, shown as weapon/armor mods */
  mods?: string[];
  /** Label/value rows shown in the stat block of the detail panel */
  stats: { label: string; value: string }[];
  /** Quantity column, only used for AMMO */
  qty?: number;
  /** Holotapes trigger actions instead of showing stats */
  action?: 'terminal' | 'hack' | 'download';
}

export type InvCategory = 'weapons' | 'apparel' | 'aid' | 'misc' | 'holo' | 'ammo';

export interface QuestObjective {
  text: string;
  done: boolean;
}

export interface Quest {
  id: string;
  group: 'main' | 'side';
  title: string;
  org: string;
  role?: string;
  period?: string;
  location?: string;
  status: 'active' | 'done';
  summary: string;
  /** Each stage is a block of objectives with an optional heading */
  stages: { heading?: string; objectives: QuestObjective[] }[];
  rewards?: string[];
}

export interface Workshop {
  id: string;
  name: string;
  type: string;
  status: string;
  description: string;
  stack: string[];
  highlights: string[];
  url?: string;
}

export interface StatLine {
  label: string;
  value: string;
}

export interface Waypoint {
  id: string;
  name: string;
  /** [lon, lat] */
  coords: [number, number];
  label: string;
  description: string;
  home?: boolean;
}

export interface RadioTrack {
  title: string;
  artist: string;
  src: string;
}

export interface RadioStation {
  id: string;
  name: string;
  freq: string;
  description: string;
  /** Streamed tracks; omitted for procedurally generated stations */
  tracks?: RadioTrack[];
  /** Procedural morse beacon: the message it keys out */
  morse?: string;
}

export interface Profile {
  name: string;
  shortName: string;
  title: string;
  headline: string;
  location: string;
  timezoneLabel: string;
  site: string;
  email: string;
  linkedin: string;
  github: string;
  /** Used to compute level / XP. YYYY-MM */
  careerStart: string;
  summary: string[];
  availability: string[];
  languages: { name: string; level: string }[];
  special: SpecialStat[];
  perks: Perk[];
  inventory: Record<InvCategory, InvItem[]>;
  quests: Quest[];
  workshops: Workshop[];
  stats: { heading: string; lines: StatLine[] }[];
  waypoints: Waypoint[];
  stations: RadioStation[];
  /** Plain skill groups used by the printable CV and the terminal */
  skillGroups: { label: string; items: string[] }[];
}
