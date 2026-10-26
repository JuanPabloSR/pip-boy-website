import { useCallback, useEffect, useRef, useState } from 'react';
import { Power } from 'lucide-react';
import { usePip } from '../state/pip';
import { soundEffects, unlockAudio } from '../utils/audio';
import LangToggle from './LangToggle';
import VaultBoy from './VaultBoy';

type Phase = 'power' | 'terminal' | 'splash';

// The text Fallout 4's Pip-Boy prints when it boots, plus a profile loader line.
const bootLines = (name: string) => [
  '*************** PIP-OS(R) V7.1.0.8 ***************',
  '',
  'COPYRIGHT 2075 ROBCO(R)',
  'LOADER V1.1',
  'EXEC VERSION 41.10',
  '64K RAM SYSTEM',
  '38911 BYTES FREE',
  'NO HOLOTAPE FOUND',
  'LOAD ROM(1): DEITRIX 303',
  '',
  `LOADING DWELLER PROFILE: ${name.toUpperCase()}`,
  'S.P.E.C.I.A.L. .......... [ OK ]',
  'INVENTORY ............... [ OK ]',
  'QUEST LOG ............... [ OK ]',
  'RADIO RECEIVER .......... [ OK ]',
];

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Power button → RobCo boot text → Vault Boy splash. Any key or tap skips ahead. */
export default function BootScreen({ onDone }: { onDone: () => void }) {
  const { t, profile } = usePip();
  const [phase, setPhase] = useState<Phase>('power');
  const [text, setText] = useState('');
  const finished = useRef(false);

  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    onDone();
  }, [onDone]);

  const advance = useCallback(() => {
    if (phase === 'power') {
      unlockAudio();
      soundEffects.bootHum();
      setPhase('terminal');
    } else if (phase === 'terminal') {
      setPhase('splash');
    } else {
      finish();
    }
  }, [phase, finish]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey || e.key === 'Tab') return;
      // Let the language buttons handle their own Enter/Space.
      if (e.target instanceof HTMLElement && e.target.closest('.lang-toggle')) return;
      e.preventDefault();
      advance();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [advance]);

  // Type the boot text character by character.
  useEffect(() => {
    if (phase !== 'terminal') return;
    const full = bootLines(profile.name).join('\n');
    if (reducedMotion()) {
      const id = window.setTimeout(() => { setText(full); setPhase('splash'); }, 600);
      return () => window.clearTimeout(id);
    }
    let i = 0;
    let timer = 0;
    const step = () => {
      // Print a few characters per tick; pause on line breaks like a real teletype.
      const chunk = 2 + Math.floor(Math.random() * 3);
      i = Math.min(full.length, i + chunk);
      setText(full.slice(0, i));
      if (full[i - 1] !== ' ') soundEffects.typewriterClick();
      if (i >= full.length) {
        timer = window.setTimeout(() => setPhase('splash'), 550);
        return;
      }
      const atBreak = full[i - 1] === '\n' || full.slice(i - chunk, i).includes('\n');
      const pause = full.slice(0, i).endsWith('38911 BYTES FREE') ? 380 : atBreak ? 70 : 16;
      timer = window.setTimeout(step, pause);
    };
    timer = window.setTimeout(step, 450);
    return () => window.clearTimeout(timer);
  }, [phase, profile.name]);

  useEffect(() => {
    if (phase !== 'splash') return;
    soundEffects.confirm();
    const id = window.setTimeout(finish, reducedMotion() ? 300 : 1700);
    return () => window.clearTimeout(id);
  }, [phase, finish]);

  return (
    <div className="boot" onClick={advance} role="presentation">
      {phase === 'power' && (
        <div className="boot-power">
          <button type="button" className="power-ring pbtn" style={{ borderRadius: '50%', padding: 0, outline: 'none' }}
            onClick={e => { e.stopPropagation(); advance(); }} aria-label={t.power.prompt} autoFocus>
            <Power aria-hidden="true" />
          </button>
          <div className="boot-model">{t.power.title}</div>
          <div className="boot-prompt pulse">{t.power.prompt}</div>
          <div className="boot-sub">{t.power.sound}</div>
          <LangToggle />
        </div>
      )}

      {phase === 'terminal' && (
        <div className="boot-term power-on" aria-live="off">
          {text}
          <span className="blink">▌</span>
        </div>
      )}

      {phase === 'splash' && (
        <div className="boot-splash power-on">
          <VaultBoy name={['boot', 'thumbs-up']} />
          <div className="boot-model">{t.power.title}</div>
          <div className="pulse">{t.power.initializing}...</div>
        </div>
      )}

      {phase !== 'power' && <div className="boot-skip">{t.power.skip}</div>}
    </div>
  );
}
