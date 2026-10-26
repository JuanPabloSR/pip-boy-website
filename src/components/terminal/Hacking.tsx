import { Fragment, useEffect, useState } from 'react';
import { soundEffects } from '../../utils/audio';
import { applyBracket, COLUMNS, guessWord, newGame, ROWS_PER_COLUMN, type HackGame } from './hackGame';

interface Props {
  lang: 'es' | 'en';
  onWin: () => void;
}

const TEXT = {
  es: { title: 'ROBCO INDUSTRIES (TM) TERMLINK PROTOCOL', enter: 'INTRODUZCA LA CONTRASEÑA', left: 'INTENTO(S) RESTANTE(S)', locked: 'TERMINAL BLOQUEADA. REINICIANDO...' },
  en: { title: 'ROBCO INDUSTRIES (TM) TERMLINK PROTOCOL', enter: 'ENTER PASSWORD NOW', left: 'ATTEMPT(S) LEFT', locked: 'TERMINAL LOCKED. REBOOTING...' },
};

export default function Hacking({ lang, onWin }: Props) {
  const [game, setGame] = useState<HackGame>(newGame);
  const [hot, setHot] = useState<string | null>(null);
  const tx = TEXT[lang];

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
    <div className="hack">
      <div className="hack-head">
        <div>{tx.title}</div>
        <div>{game.state === 'locked' ? tx.locked : tx.enter}</div>
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
                      <button key={i} type="button" className={`hack-glyph ${hot === key ? 'hot' : ''}`}
                        disabled={game.state !== 'playing'}
                        onMouseEnter={() => { setHot(key); soundEffects.hover(); }} onMouseLeave={() => setHot(null)}
                        onFocus={() => setHot(key)} onBlur={() => setHot(null)}
                        onClick={() => guess(seg.word)}>
                        {seg.word}
                      </button>
                    );
                  }
                  if (seg.used) return <Fragment key={i}>{'.'.repeat(seg.text.length)}</Fragment>;
                  return (
                    <button key={i} type="button" className="hack-glyph dud" disabled={game.state !== 'playing'}
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
        {game.log.slice(-14).join('\n')}
        {'\n>'}<span className="blink">▌</span>
      </div>
    </div>
  );
}
