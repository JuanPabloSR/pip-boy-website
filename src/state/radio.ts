import { createContext, useContext } from 'react';
import type { RadioStation, RadioTrack } from '../data/types';

export type RadioStatus = 'idle' | 'loading' | 'playing' | 'error';

export interface MorseProbe {
  /** Whether the beacon tone is sounding right now */
  on: boolean;
  /** Index of the character being keyed (into the station's morse text) */
  charIndex: number;
}

export interface RadioState {
  /** Stations of the game the current theme belongs to, plus the ones every theme carries */
  stations: RadioStation[];
  stationId: string | null;
  playing: boolean;
  status: RadioStatus;
  /** Song on air (null for the beacon or while the playlist loads) */
  track: RadioTrack | null;
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
