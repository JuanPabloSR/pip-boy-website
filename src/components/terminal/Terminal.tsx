import { useCallback, useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { X } from 'lucide-react';
import { falloutDate, falloutTime } from '../../hooks/useNow';
import { TABS, usePip, type TabId } from '../../state/pip';
import { useRadio } from '../../state/radio';
import { THEMES, type ThemeId } from '../../state/themes';
import { soundEffects } from '../../utils/audio';
import Hacking from './Hacking';

// 'plain' keeps the original case (emails, URLs) inside the all-caps terminal.
type Line = { text: string; kind?: 'cmd' | 'muted' | 'plain' };

const TEXT = {
  es: {
    bar: 'ROBCO INDUSTRIES (TM) TERMLINK PROTOCOL',
    welcome: ['BIENVENIDO A ROBCO INDUSTRIES (TM) TERMLINK', 'JPSR-OS V1.0 · Escribe AYUDA para ver los comandos.'],
    help: [
      'COMANDOS DISPONIBLES:',
      '  QUIEN        Ficha del morador',
      '  PERFIL       Perfil profesional',
      '  EXPERIENCIA  Trayectoria laboral',
      '  SKILLS       Habilidades técnicas',
      '  FORMACION    Estudios y certificaciones',
      '  PROYECTOS    Talleres / proyectos',
      '  CONTACTO     Canales de transmisión',
      '  CV           Descargar CV en PDF',
      '  IMPRIMIR     Imprimir CV',
      '  HACK         Minijuego de hackeo',
      '  RADIO [ON|OFF|SIG]   Controlar la radio',
      '  TEMA <FO4|FO3|NV|VAULT|WHITE>',
      '  IDIOMA <ES|EN>',
      '  IR <STAT|INV|DATA|MAP|RADIO>',
      '  LS · FECHA · LIMPIAR · SALIR',
    ],
    unknown: (c: string) => `COMANDO NO RECONOCIDO: ${c}. Escribe AYUDA.`,
    sudo: 'ACCESO DENEGADO. Este incidente será reportado al Supervisor del Refugio.',
    printing: 'Enviando expediente a la impresora...',
    downloading: 'Descargando expediente (PDF)...',
    hackWin: [
      '>> ACCESO CONCEDIDO <<',
      'Nota del morador: gracias por llegar hasta aquí. Si buscas a alguien',
      'que disfrute los detalles tanto como este Pip-Boy, escríbeme:',
    ],
    perk: 'PERK DESBLOQUEADO: HACKER (Rango 1)',
    themeOk: (n: string) => `Color de pantalla: ${n}.`,
    themeBad: 'Uso: TEMA FO4 | FO3 | NV | VAULT | WHITE',
    langOk: 'Idioma cambiado.',
    langBad: 'Uso: IDIOMA ES | EN',
    goBad: 'Uso: IR STAT | INV | DATA | MAP | RADIO',
    radioOn: 'Radio encendida.', radioOff: 'Radio apagada.',
    files: 'PERFIL.TXT  EXPERIENCIA.LOG  SKILLS.DAT  FORMACION.DOC  PROYECTOS.LST  CONTACTO.CFG  CV.PDF',
    coffee: ['   ( (', '    ) )', '  ........', '  |      |]', '  \\      /', '   `----´', 'V60 · 92 °C · 1:15. Sin bugs después del bloom.'],
    role: 'Rol', period: 'Período',
  },
  en: {
    bar: 'ROBCO INDUSTRIES (TM) TERMLINK PROTOCOL',
    welcome: ['WELCOME TO ROBCO INDUSTRIES (TM) TERMLINK', 'JPSR-OS V1.0 · Type HELP to list commands.'],
    help: [
      'AVAILABLE COMMANDS:',
      '  WHOAMI       Dweller card',
      '  ABOUT        Professional summary',
      '  EXPERIENCE   Work history',
      '  SKILLS       Technical skills',
      '  EDUCATION    Studies and certifications',
      '  PROJECTS     Workshops / projects',
      '  CONTACT      Transmission channels',
      '  CV           Download résumé (PDF)',
      '  PRINT        Print résumé',
      '  HACK         Hacking minigame',
      '  RADIO [ON|OFF|NEXT]  Control the radio',
      '  THEME <FO4|FO3|NV|VAULT|WHITE>',
      '  LANG <ES|EN>',
      '  GOTO <STAT|INV|DATA|MAP|RADIO>',
      '  LS · DATE · CLEAR · EXIT',
    ],
    unknown: (c: string) => `UNKNOWN COMMAND: ${c}. Type HELP.`,
    sudo: 'ACCESS DENIED. This incident will be reported to the Overseer.',
    printing: 'Sending file to the printer...',
    downloading: 'Downloading file (PDF)...',
    hackWin: [
      '>> ACCESS GRANTED <<',
      'Dweller note: thanks for making it this far. If you are looking for someone',
      'who enjoys the details as much as this Pip-Boy does, write to me:',
    ],
    perk: 'PERK UNLOCKED: HACKER (Rank 1)',
    themeOk: (n: string) => `Screen color: ${n}.`,
    themeBad: 'Usage: THEME FO4 | FO3 | NV | VAULT | WHITE',
    langOk: 'Language changed.',
    langBad: 'Usage: LANG ES | EN',
    goBad: 'Usage: GOTO STAT | INV | DATA | MAP | RADIO',
    radioOn: 'Radio on.', radioOff: 'Radio off.',
    files: 'ABOUT.TXT  EXPERIENCE.LOG  SKILLS.DAT  EDUCATION.DOC  PROJECTS.LST  CONTACT.CFG  CV.PDF',
    coffee: ['   ( (', '    ) )', '  ........', '  |      |]', '  \\      /', '   `----´', 'V60 · 92 °C · 1:15. No bugs after the bloom.'],
    role: 'Role', period: 'Period',
  },
};

// Every command accepts its Spanish and English name (and the file names from LS).
const ALIASES: Record<string, string> = {
  ayuda: 'help', help: 'help', '?': 'help',
  quien: 'whoami', quién: 'whoami', whoami: 'whoami',
  perfil: 'about', about: 'about', 'perfil.txt': 'about', 'about.txt': 'about',
  experiencia: 'exp', experience: 'exp', exp: 'exp', 'experiencia.log': 'exp', 'experience.log': 'exp',
  skills: 'skills', habilidades: 'skills', 'skills.dat': 'skills',
  formacion: 'edu', formación: 'edu', education: 'edu', edu: 'edu', 'formacion.doc': 'edu', 'education.doc': 'edu',
  proyectos: 'projects', projects: 'projects', 'proyectos.lst': 'projects', 'projects.lst': 'projects',
  contacto: 'contact', contact: 'contact', 'contacto.cfg': 'contact', 'contact.cfg': 'contact',
  cv: 'cv', 'cv.pdf': 'cv', resume: 'cv', descargar: 'cv', download: 'cv',
  imprimir: 'print', print: 'print',
  hack: 'hack', hackear: 'hack',
  radio: 'radio',
  tema: 'theme', theme: 'theme', color: 'theme',
  idioma: 'lang', lang: 'lang', language: 'lang',
  ir: 'goto', goto: 'goto', go: 'goto',
  ls: 'ls', dir: 'ls',
  cat: 'cat', type: 'cat', more: 'cat',
  fecha: 'date', date: 'date',
  limpiar: 'clear', clear: 'clear', cls: 'clear',
  salir: 'exit', exit: 'exit', quit: 'exit', q: 'exit',
  sudo: 'sudo',
  cafe: 'coffee', café: 'coffee', coffee: 'coffee',
};

export default function Terminal({ startWithHack }: { startWithHack: boolean }) {
  const pip = usePip();
  const { profile, settings, setOverlay, updateSettings, setTab, printCv, downloadCv } = pip;
  const radio = useRadio();
  const tx = TEXT[settings.lang];
  const [mode, setMode] = useState<'shell' | 'hack'>(startWithHack ? 'hack' : 'shell');
  const [lines, setLines] = useState<Line[]>(() => TEXT[settings.lang].welcome.map(text => ({ text, kind: 'muted' })));
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [cursor, setCursor] = useState(-1);
  const outRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const close = useCallback(() => setOverlay(null), [setOverlay]);

  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [close]);

  useEffect(() => {
    if (mode === 'shell') inputRef.current?.focus();
  }, [mode]);

  useEffect(() => {
    outRef.current?.scrollTo({ top: outRef.current.scrollHeight });
  }, [lines]);

  const print = (...out: (string | Line)[]) =>
    setLines(prev => [...prev, ...out.map(l => (typeof l === 'string' ? { text: l } : l))]);

  const run = (raw: string) => {
    const [first = '', ...args] = raw.trim().split(/\s+/);
    let cmd = ALIASES[first.toLowerCase()] ?? (first ? 'unknown' : '');
    let arg = (args[0] ?? '').toLowerCase();
    if (cmd === 'cat') {
      cmd = ALIASES[arg] ?? 'unknown';
      arg = '';
    }

    switch (cmd) {
      case '':
        return;
      case 'help':
        return print(...tx.help);
      case 'whoami':
        return print(profile.name.toUpperCase(), `${profile.title} · ${profile.headline}`, profile.location, `${profile.timezoneLabel}`);
      case 'about':
        return print(...profile.summary.flatMap(p => [p, '']));
      case 'exp':
        return print(...profile.quests.filter(q => q.group === 'main').flatMap(q => [
          `■ ${q.org.toUpperCase()} · ${q.period ?? ''}`,
          `  ${q.role ?? ''}`,
          ...q.stages.flatMap(s => [...(s.heading ? [`  [${s.heading}]`] : []), ...s.objectives.map(o => `  ${o.done ? '☑' : '☐'} ${o.text}`)]),
          ...(q.rewards ?? []).map(r => `  + ${r}`),
          '',
        ]));
      case 'skills':
        return print(...profile.skillGroups.map(g => `${g.label.toUpperCase().padEnd(24, '.')} ${g.items.join(', ')}`));
      case 'edu':
        return print(...profile.quests.filter(q => q.group === 'side').map(q => `✓ ${q.title} — ${q.org}${q.period ? ` (${q.period})` : ''}`));
      case 'projects':
        return print(...profile.workshops.flatMap(w => [`■ ${w.name.toUpperCase()} [${w.type}]`, `  ${w.description}`, `  ${w.stack.join(' · ')}`, '']));
      case 'contact':
        return print(
          { text: `EMAIL ..... ${profile.email}`, kind: 'plain' },
          { text: `LINKEDIN .. ${profile.linkedin}`, kind: 'plain' },
          { text: `GITHUB .... ${profile.github}`, kind: 'plain' },
          `TZ ........ ${profile.timezoneLabel}`,
        );
      case 'cv':
        print(tx.downloading);
        return downloadCv();
      case 'print':
        print(tx.printing);
        return printCv();
      case 'hack':
        return setMode('hack');
      case 'radio':
        if (arg === 'off' || arg === 'stop') { radio.stop(); return print(tx.radioOff); }
        if (arg === 'next' || arg === 'sig' || arg === 'siguiente') { radio.nextStation(); return print(tx.radioOn); }
        if (!radio.playing) radio.toggle();
        return print(tx.radioOn);
      case 'theme': {
        const theme = THEMES.find(t => t.id === (arg as ThemeId));
        if (!theme) return print(tx.themeBad);
        updateSettings({ theme: theme.id });
        return print(tx.themeOk(theme.label));
      }
      case 'lang':
        if (arg !== 'es' && arg !== 'en') return print(tx.langBad);
        updateSettings({ lang: arg });
        return print(TEXT[arg].langOk);
      case 'goto': {
        const target = arg.toUpperCase() as TabId;
        if (!TABS.includes(target)) return print(tx.goBad);
        setTab(target);
        return close();
      }
      case 'ls':
        return print(tx.files);
      case 'date':
        return print(`${falloutDate(new Date(), settings.lang)} · ${falloutTime(new Date(), settings.lang)}`);
      case 'clear':
        return setLines([]);
      case 'exit':
        return close();
      case 'sudo':
        soundEffects.deny();
        return print(tx.sudo);
      case 'coffee':
        return print(...tx.coffee);
      default:
        soundEffects.deny();
        return print(tx.unknown(first.toUpperCase()));
    }
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const value = input;
    setInput('');
    setCursor(-1);
    if (value.trim()) setHistory(h => [value, ...h].slice(0, 50));
    setLines(prev => [...prev, { text: `> ${value}`, kind: 'cmd' }]);
    soundEffects.typewriterClick();
    run(value);
  };

  const onInputKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp' && history.length) {
      e.preventDefault();
      const next = Math.min(cursor + 1, history.length - 1);
      setCursor(next);
      setInput(history[next]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = cursor - 1;
      setCursor(Math.max(next, -1));
      setInput(next >= 0 ? history[next] : '');
    } else if (e.key.length === 1) {
      soundEffects.typewriterClick();
    }
  };

  const onWin = useCallback(() => {
    setMode('shell');
    setLines(prev => [
      ...prev,
      ...tx.hackWin.map(text => ({ text })),
      { text: `  ${profile.email}`, kind: 'plain' as const },
      { text: '' },
      { text: tx.perk, kind: 'cmd' as const },
    ]);
  }, [tx, profile.email]);

  return (
    <div className="overlay" onClick={close} role="presentation">
      <section className="terminal power-on" role="dialog" aria-modal="true" aria-label={tx.bar} onClick={e => { e.stopPropagation(); if (mode === 'shell') inputRef.current?.focus(); }}>
        <div className="terminal-bar">
          <span>{tx.bar}</span>
          <button type="button" onClick={close} aria-label="Close"><X aria-hidden="true" style={{ width: '1rem', height: '1rem', verticalAlign: 'middle' }} /></button>
        </div>

        {mode === 'hack' ? (
          <Hacking lang={settings.lang} onWin={onWin} />
        ) : (
          <>
            <div className="terminal-out" ref={outRef} aria-live="polite">
              {lines.map((l, i) => <div key={i} className={l.kind}>{l.text || ' '}</div>)}
            </div>
            <form className="terminal-in" onSubmit={submit}>
              <span aria-hidden="true">&gt;</span>
              <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={onInputKey}
                aria-label="Command" autoComplete="off" autoCapitalize="characters" spellCheck={false} />
            </form>
          </>
        )}
      </section>
    </div>
  );
}
