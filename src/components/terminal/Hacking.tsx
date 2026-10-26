import { Fragment, useEffect, useRef, useState } from 'react';
import { soundEffects } from '../../utils/audio';
import { applyBracket, COLUMNS, guessWord, newGame, ROWS_PER_COLUMN, type HackGame, type LogEntry } from './hackGame';

interface Props {
  lang: 'es' | 'en';
  onWin: () => void;
}

const TEXT = {
  es: {
    title: 'ROBCO INDUSTRIES (TM) TERMLINK PROTOCOL',
    enter: 'INTRODUZCA LA CONTRASEÑA',
    warning: '!!! ADVERTENCIA: BLOQUEO INMINENTE !!!',
    left: 'INTENTO(S) RESTANTE(S)',
    locked: 'TERMINAL BLOQUEADA. REINICIANDO...',
    log: {
      denied: 'Acceso denegado.', exact: '¡Coincidencia exacta!', wait: 'Espere mientras se accede al sistema.',
      dud: 'Señuelo eliminado.', reset: 'Intentos restablecidos.', locked: 'TERMINAL BLOQUEADA.', likeness: 'Similitud',
    },
  },
  en: {
    title: 'ROBCO INDUSTRIES (TM) TERMLINK PROTOCOL',
    enter: 'ENTER PASSWORD NOW',
    warning: '!!! WARNING: LOCKOUT IMMINENT !!!',
    left: 'ATTEMPT(S) LEFT',
    locked: 'TERMINAL LOCKED. REBOOTING...',
    log: {
      denied: 'Entry denied.', exact: 'Exact match!', wait: 'Please wait while system is accessed.',
      dud: 'Dud removed.', reset: 'Tries reset.', locked: 'TERMINAL LOCKED.', likeness: 'Likeness',
    },
  },
};

function logLine(entry: LogEntry, words: (typeof TEXT)['es']['log']) {
  if (entry.kind === 'input') return `>${entry.text}`;
  if (entry.kind === 'likeness') return `>${words.likeness}=${entry.n}`;
  return `>${words[entry.kind]}`;
}

export default function Hacking({ lang, onWin }: Props) {
  const [game, setGame] = useState<HackGame>(newGame);
  // The word (or bracket) under the cursor, previewed on the input line like in the games.
  const [hot, setHot] = useState<{ key: string; text: string } | null>(null);
  const tx = TEXT[lang];
  const rootRef = useRef<HTMLDivElement>(null);

  // Move keyboard focus into each new game (the dialog has no text input in this mode).
  // `addresses` only changes when a new board is generated.
  useEffect(() => {
    rootRef.current?.querySelector<HTMLButtonElement>('.hack-glyph:not(:disabled)')?.focus();
  }, [game.addresses]);

  useEffect(() => {
    if (game.state === 'won') {
      soundEffects.confirm();
      const id = window.setTimeout(onWin, 1400);
      return () => window.clearTimeout(id);
    }
    if (game.state === 'locked') {
      soundEffects.deny();
      const id = window.setTimeout(() => setGame(newGame()), 2200);
      return () => window.clearTimeout(id);
    }
  }, [game.state, onWin]);

  const guess = (word: string) => {
    const next = guessWord(game, word);
    if (next.state === 'playing') soundEffects.deny();
    setGame(next);
  };

  const bracket = (id: number) => {
    soundEffects.confirm();
    setGame(applyBracket(game, id));
  };

  const columns = Array.from({ length: COLUMNS }, (_, c) =>
    game.rows.slice(c * ROWS_PER_COLUMN, (c + 1) * ROWS_PER_COLUMN).map((row, r) => ({ row, addr: game.addresses[c * ROWS_PER_COLUMN + r] })),
  );

  return (
    <div className="hack" ref={rootRef}>
      <div className="hack-head">
        <div>{tx.title}</div>
        <div className={game.attempts === 1 && game.state === 'playing' ? 'pulse' : undefined}>
          {game.state === 'locked' ? tx.locked : game.attempts === 1 ? tx.warning : tx.enter}
        </div>
        <div>
          {game.attempts} {tx.left}: {'■ '.repeat(game.attempts)}
        </div>
      </div>

      {columns.map((col, c) => (
        <div key={c} className="hack-col">
          {col.map(({ row, addr }) => (
            <div key={addr} className="hack-row">
              <span className="addr">{addr}</span>
              <span>
                {row.map((seg, i) => {
                  if (seg.kind === 'junk') return <Fragment key={i}>{seg.text}</Fragment>;
                  if (seg.kind === 'word') {
                    if (seg.removed) return <Fragment key={i}>{'.'.repeat(seg.word.length)}</Fragment>;
                    const key = `w${seg.id}`;
                    return (
                      <button key={i} type="button" className={`hack-glyph ${hot?.key === key ? 'hot' : ''}`}
                        disabled={game.state !== 'playing'}
                        onMouseEnter={() => { setHot({ key, text: seg.word }); soundEffects.hover(); }} onMouseLeave={() => setHot(null)}
                        onFocus={() => setHot({ key, text: seg.word })} onBlur={() => setHot(null)}
                        onClick={() => guess(seg.word)}>
                        {seg.word}
                      </button>
                    );
                  }
                  if (seg.used) return <Fragment key={i}>{'.'.repeat(seg.text.length)}</Fragment>;
                  return (
                    <button key={i} type="button" className="hack-glyph" disabled={game.state !== 'playing'}
                      onMouseEnter={() => setHot({ key: `b${seg.id}`, text: seg.text })} onMouseLeave={() => setHot(null)}
                      onFocus={() => setHot({ key: `b${seg.id}`, text: seg.text })} onBlur={() => setHot(null)}
                      onClick={() => bracket(seg.id)}>
                      {seg.text}
                    </button>
                  );
                })}
              </span>
            </div>
          ))}
        </div>
      ))}

      <div className="hack-log" aria-live="polite">
        {game.log.slice(-14).map(entry => logLine(entry, tx.log)).join('\n')}
        {`\n>${hot?.text ?? ''}`}<span className="blink">▌</span>
      </div>
    </div>
  );
}
