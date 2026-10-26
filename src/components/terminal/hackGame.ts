// Fallout terminal hacking: pick the password among same-length words.
// Each wrong guess reports its "likeness" (letters in the right position).
// Bracket pairs like [..] or (..) remove a dud or restore attempts.

export const MAX_ATTEMPTS = 4;
export const ROWS_PER_COLUMN = 16;
export const COLUMNS = 2;
export const ROW_WIDTH = 12;

const WORDS = [
  'SPRING', 'DOCKER', 'GITHUB', 'PYTHON', 'BACKUP', 'DEPLOY', 'COMMIT', 'BRANCH', 'SERVER', 'CLIENT',
  'ROUTER', 'BINARY', 'BUFFER', 'CURSOR', 'DOMAIN', 'ENGINE', 'FILTER', 'GLOBAL', 'HEADER', 'KERNEL',
  'LAMBDA', 'MODULE', 'OBJECT', 'PARSER', 'PLUGIN', 'RENDER', 'SCHEMA', 'SCRIPT', 'SOCKET', 'STRING',
  'SYNTAX', 'THREAD', 'TOKENS', 'VECTOR', 'WIDGET', 'VAULTS', 'RADIOS', 'NUKERS', 'MUTANT', 'MEMORY',
];
const JUNK = '!@#$%^&*-_=+|;:\'",.?/\\';
const PAIRS: [string, string][] = [['[', ']'], ['(', ')'], ['{', '}'], ['<', '>']];

export type Segment =
  | { kind: 'junk'; text: string }
  | { kind: 'word'; id: number; word: string; removed: boolean }
  | { kind: 'bracket'; id: number; text: string; used: boolean };

/** Log lines are stored as events and worded by the UI in the active language. */
export type LogEntry =
  | { kind: 'input'; text: string }
  | { kind: 'denied' | 'exact' | 'wait' | 'dud' | 'reset' | 'locked' }
  | { kind: 'likeness'; n: number };

export interface HackGame {
  rows: Segment[][];
  addresses: string[];
  password: string;
  attempts: number;
  log: LogEntry[];
  state: 'playing' | 'won' | 'locked';
}

const rand = (n: number) => Math.floor(Math.random() * n);
const junk = (n: number) => Array.from({ length: n }, () => JUNK[rand(JUNK.length)]).join('');

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = rand(i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function likeness(a: string, b: string) {
  let n = 0;
  for (let i = 0; i < Math.min(a.length, b.length); i++) if (a[i] === b[i]) n++;
  return n;
}

export function newGame(): HackGame {
  const totalRows = ROWS_PER_COLUMN * COLUMNS;
  const words = shuffle(WORDS).slice(0, 12);
  const password = words[rand(words.length)];
  const wordRows = new Set(shuffle([...Array(totalRows).keys()]).slice(0, words.length));
  const bracketRows = new Set(shuffle([...Array(totalRows).keys()].filter(r => !wordRows.has(r))).slice(0, 6));

  let wordIdx = 0;
  let bracketId = 0;
  const rows: Segment[][] = [];
  for (let r = 0; r < totalRows; r++) {
    if (wordRows.has(r)) {
      const word = words[wordIdx];
      const offset = rand(ROW_WIDTH - word.length + 1);
      rows.push([
        { kind: 'junk', text: junk(offset) },
        { kind: 'word', id: wordIdx, word, removed: false },
        { kind: 'junk', text: junk(ROW_WIDTH - offset - word.length) },
      ]);
      wordIdx++;
    } else if (bracketRows.has(r)) {
      const [open, close] = PAIRS[rand(PAIRS.length)];
      const inner = rand(4);
      const len = inner + 2;
      const offset = rand(ROW_WIDTH - len + 1);
      // Inner junk must not contain other bracket characters.
      const innerText = junk(inner).replace(/[[\](){}<>]/g, '.');
      rows.push([
        { kind: 'junk', text: junk(offset) },
        { kind: 'bracket', id: bracketId++, text: open + innerText + close, used: false },
        { kind: 'junk', text: junk(ROW_WIDTH - offset - len) },
      ]);
    } else {
      rows.push([{ kind: 'junk', text: junk(ROW_WIDTH) }]);
    }
  }

  const base = 0xf000 + rand(0x800);
  const addresses = Array.from({ length: totalRows }, (_, i) => `0x${(base + i * ROW_WIDTH).toString(16).toUpperCase()}`);
  return { rows, addresses, password, attempts: MAX_ATTEMPTS, log: [], state: 'playing' };
}

function mapSegments(game: HackGame, fn: (s: Segment) => Segment): Segment[][] {
  return game.rows.map(row => row.map(fn));
}

export function guessWord(game: HackGame, word: string): HackGame {
  if (game.state !== 'playing') return game;
  if (word === game.password) {
    return { ...game, state: 'won', log: [...game.log, { kind: 'input', text: word }, { kind: 'exact' }, { kind: 'wait' }] };
  }
  const attempts = game.attempts - 1;
  const log: LogEntry[] = [...game.log, { kind: 'input', text: word }, { kind: 'denied' }, { kind: 'likeness', n: likeness(word, game.password) }];
  if (attempts <= 0) return { ...game, attempts: 0, state: 'locked', log: [...log, { kind: 'locked' }] };
  return { ...game, attempts, log };
}

export function applyBracket(game: HackGame, id: number): HackGame {
  if (game.state !== 'playing') return game;
  const seg = game.rows.flat().find(s => s.kind === 'bracket' && s.id === id);
  if (!seg || seg.kind !== 'bracket' || seg.used) return game;

  const duds = game.rows.flat().filter(s => s.kind === 'word' && !s.removed && s.word !== game.password);
  const resetTries = duds.length === 0 || Math.random() < 0.25;
  const dudId = resetTries ? -1 : (duds[rand(duds.length)] as Extract<Segment, { kind: 'word' }>).id;

  const rows = mapSegments(game, s => {
    if (s.kind === 'bracket' && s.id === id) return { ...s, used: true };
    if (s.kind === 'word' && s.id === dudId) return { ...s, removed: true };
    return s;
  });
  return {
    ...game,
    rows,
    attempts: resetTries ? MAX_ATTEMPTS : game.attempts,
    log: [...game.log, { kind: 'input', text: seg.text }, { kind: resetTries ? 'reset' : 'dud' }],
  };
}
