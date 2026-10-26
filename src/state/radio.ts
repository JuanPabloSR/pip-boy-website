import { createContext, useContext } from 'react';

export type RadioStatus = 'idle' | 'loading' | 'playing' | 'error';

export interface MorseProbe {
  /** Whether the beacon tone is sounding right now */
  on: boolean;
  /** Index of the character being keyed (into the station's morse text) */
  charIndex: number;
}

export interface RadioState {
  stationId: string | null;
  playing: boolean;
  status: RadioStatus;
  trackIndex: number;
  tune: (id: string) => void;
  toggle: () => void;
  stop: () => void;
  nextStation: () => void;
  /** Polled from animation frames; reads live audio timing without re-rendering. */
  probeMorse: () => MorseProbe | null;
}

export const RadioContext = createContext<RadioState | null>(null);

export function useRadio(): RadioState {
  const ctx = useContext(RadioContext);
  if (!ctx) throw new Error('useRadio must be used inside <RadioProvider>');
  return ctx;
}
