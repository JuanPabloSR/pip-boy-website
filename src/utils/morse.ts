const CODE: Record<string, string> = {
  A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.', G: '--.', H: '....', I: '..', J: '.---',
  K: '-.-', L: '.-..', M: '--', N: '-.', O: '---', P: '.--.', Q: '--.-', R: '.-.', S: '...', T: '-',
  U: '..-', V: '...-', W: '.--', X: '-..-', Y: '-.--', Z: '--..',
  '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....',
  '6': '-....', '7': '--...', '8': '---..', '9': '----.',
};

export interface MorseTone {
  start: number; // in units
  length: number; // in units
  charIndex: number;
}

/**
 * Converts text to tone timings using standard Morse proportions:
 * dot = 1 unit, dash = 3, gap inside a letter = 1, between letters = 3, between words = 7.
 * Returns the tones plus the total cycle length (with a long pause before repeating).
 */
export function morseSchedule(text: string): { tones: MorseTone[]; total: number } {
  const tones: MorseTone[] = [];
  let t = 0;
  [...text.toUpperCase()].forEach((ch, charIndex) => {
    if (ch === ' ') {
      t += 4; // 3 already added after the previous letter → 7
      return;
    }
    const code = CODE[ch];
    if (!code) return;
    [...code].forEach((sym, i) => {
      const length = sym === '.' ? 1 : 3;
      tones.push({ start: t, length, charIndex });
      t += length + (i < code.length - 1 ? 1 : 0);
    });
    t += 3;
  });
  return { tones, total: t + 14 };
}

export function toMorse(text: string): string {
  return [...text.toUpperCase()].map(ch => (ch === ' ' ? '/' : CODE[ch] ?? '')).join(' ');
}
