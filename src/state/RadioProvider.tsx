import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { RadioStation, RadioTrack } from '../data/types';
import { archivePlaylist } from '../utils/archive';
import { getAudioContext, soundEffects } from '../utils/audio';
import { morseSchedule } from '../utils/morse';
import { usePip } from './pip';
import { RadioContext, type MorseProbe, type RadioState, type RadioStatus } from './radio';
import { themeGame } from './themes';

const MORSE_UNIT = 0.085; // seconds
const MORSE_FREQ = 640; // Hz

interface MorseRig {
  stop: () => void;
  probe: () => MorseProbe;
  setVolume: (v: number) => void;
}

/** Builds a looping Morse beacon with a bed of radio static, entirely in Web Audio. */
function startMorse(text: string, volume: number): MorseRig {
  const ctx = getAudioContext();
  const { tones, total } = morseSchedule(text);
  const cycle = total * MORSE_UNIT;

  const master = ctx.createGain();
  master.gain.value = volume;
  master.connect(ctx.destination);

  // Tone path
  const osc = ctx.createOscillator();
  osc.type = 'sine';
  osc.frequency.value = MORSE_FREQ;
  const toneGain = ctx.createGain();
  toneGain.gain.value = 0;
  osc.connect(toneGain).connect(master);

  // Static bed
  const noiseLen = ctx.sampleRate * 2;
  const noiseBuf = ctx.createBuffer(1, noiseLen, ctx.sampleRate);
  const data = noiseBuf.getChannelData(0);
  for (let i = 0; i < noiseLen; i++) data[i] = Math.random() * 2 - 1;
  const noise = ctx.createBufferSource();
  noise.buffer = noiseBuf;
  noise.loop = true;
  const band = ctx.createBiquadFilter();
  band.type = 'bandpass';
  band.frequency.value = 1800;
  band.Q.value = 0.7;
  const noiseGain = ctx.createGain();
  noiseGain.gain.value = 0.035;
  noise.connect(band).connect(noiseGain).connect(master);

  const t0 = ctx.currentTime + 0.15;
  let scheduledUntil = t0;
  const scheduleCycle = (start: number) => {
    for (const tone of tones) {
      const a = start + tone.start * MORSE_UNIT;
      const b = a + tone.length * MORSE_UNIT;
      toneGain.gain.setValueAtTime(0, a);
      toneGain.gain.linearRampToValueAtTime(0.35, a + 0.006);
      toneGain.gain.setValueAtTime(0.35, b - 0.006);
      toneGain.gain.linearRampToValueAtTime(0, b);
    }
    scheduledUntil = start + cycle;
  };
  scheduleCycle(t0);
  // Keep one cycle scheduled ahead of the playhead.
  const timer = window.setInterval(() => {
    if (ctx.currentTime > scheduledUntil - cycle * 0.5) scheduleCycle(scheduledUntil);
  }, 250);

  osc.start(t0);
  noise.start();

  return {
    stop: () => {
      window.clearInterval(timer);
      const now = ctx.currentTime;
      master.gain.setTargetAtTime(0, now, 0.03);
      osc.stop(now + 0.2);
      noise.stop(now + 0.2);
      window.setTimeout(() => master.disconnect(), 400);
    },
    probe: () => {
      const elapsed = ctx.currentTime - t0;
      if (elapsed < 0) return { on: false, charIndex: -1 };
      const u = (elapsed % cycle) / MORSE_UNIT;
      let charIndex = -1;
      let on = false;
      for (const tone of tones) {
        if (tone.start > u) break;
        charIndex = tone.charIndex;
        if (u < tone.start + tone.length) on = true;
      }
      return { on, charIndex };
    },
    setVolume: v => master.gain.setTargetAtTime(v, ctx.currentTime, 0.05),
  };
}

/** Copy of a record without one key. */
function without<T>(record: Record<string, T>, key: string) {
  const next = { ...record };
  delete next[key];
  return next;
}

export default function RadioProvider({ children }: { children: ReactNode }) {
  const { profile, settings } = usePip();
  const game = themeGame(settings.theme);
  const stations = useMemo(() => profile.stations.filter(s => !s.game || s.game === game), [profile.stations, game]);
  // The dial position, not the station: switching theme lands on the same slot of the other game's dial.
  const [slot, setSlot] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [streamStatus, setStreamStatus] = useState<RadioStatus>('idle');
  const [trackIndex, setTrackIndex] = useState(0);
  const [playlists, setPlaylists] = useState<Record<string, RadioTrack[]>>({});

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const morseRef = useRef<MorseRig | null>(null);
  const volumeRef = useRef(settings.volume);
  const failuresRef = useRef(0);

  const station: RadioStation | undefined = slot === null ? undefined : stations[Math.min(slot, stations.length - 1)];
  // The station's songs: its archive.org listing once read, otherwise its known tracks. null while loading.
  const tracks = useMemo<RadioTrack[] | null>(() => (!station || station.morse ? null
    : station.archive ? playlists[station.id] ?? null
    : station.tracks ?? []), [station, playlists]);
  const track = tracks?.length ? tracks[trackIndex % tracks.length] : null;
  // Procedural stations cannot buffer or fail to load, so they are simply "playing".
  const status: RadioStatus = !playing || !station ? 'idle'
    : station.morse ? 'playing'
    : tracks === null ? 'loading'
    : tracks.length === 0 ? 'error'
    : streamStatus;

  // One <audio> element for the whole session so music keeps playing across tabs.
  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'none';
    audioRef.current = audio;
    return () => {
      audio.pause();
      audio.removeAttribute('src');
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    volumeRef.current = settings.volume;
    if (audioRef.current) audioRef.current.volume = settings.volume;
    morseRef.current?.setVolume(settings.volume * 0.6);
  }, [settings.volume]);

  // Read the playlist the first time a station goes on air.
  useEffect(() => {
    const source = station?.archive;
    if (!playing || !station || !source || playlists[station.id]) return;
    const { id, tracks: known = [] } = station;
    archivePlaylist(source)
      .then(list => (list.length ? list : known), () => known)
      .then(list => setPlaylists(p => ({ ...p, [id]: list })));
  }, [playing, station, playlists]);

  // Drive playback from (station, track, playing). The track index is a dependency too,
  // so a one-song playlist starts over when it ends.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    morseRef.current?.stop();
    morseRef.current = null;

    if (!playing || !station) {
      audio.pause();
      return;
    }

    if (station.morse) {
      audio.pause();
      try {
        morseRef.current = startMorse(station.morse, volumeRef.current * 0.6);
      } catch (e) {
        console.warn('Morse beacon unavailable', e);
      }
      return;
    }

    // Still reading the playlist (or nothing to play): the previous station goes quiet.
    if (!track) {
      audio.pause();
      return;
    }
    if (audio.src !== track.src) audio.src = track.src;
    audio.volume = volumeRef.current;
    let current = true;
    // Switching src aborts the previous play(); a missing file is handled by the error event below.
    audio.play().catch((e: DOMException) => {
      if (current && e.name !== 'AbortError' && e.name !== 'NotSupportedError') setStreamStatus('error');
    });

    const onPlaying = () => {
      failuresRef.current = 0;
      setStreamStatus('playing');
    };
    const onWaiting = () => setStreamStatus('loading');
    // One dead link shouldn't take the station off the air: skip it, unless every song has failed.
    const onError = () => {
      if (++failuresRef.current < (tracks?.length ?? 0)) {
        setStreamStatus('loading');
        setTrackIndex(i => i + 1);
      } else {
        setStreamStatus('error');
      }
    };
    const onEnded = () => {
      setStreamStatus('loading');
      setTrackIndex(i => i + 1);
    };
    audio.addEventListener('loadstart', onWaiting);
    audio.addEventListener('playing', onPlaying);
    audio.addEventListener('waiting', onWaiting);
    audio.addEventListener('error', onError);
    audio.addEventListener('ended', onEnded);
    return () => {
      current = false;
      audio.removeEventListener('loadstart', onWaiting);
      audio.removeEventListener('playing', onPlaying);
      audio.removeEventListener('waiting', onWaiting);
      audio.removeEventListener('error', onError);
      audio.removeEventListener('ended', onEnded);
    };
  }, [playing, station, track, tracks, trackIndex]);

  useEffect(() => () => morseRef.current?.stop(), []);

  const tune = useCallback((id: string) => {
    const next = stations.findIndex(s => s.id === id);
    if (next < 0) return;
    soundEffects.radioStatic(0.3, 0.12);
    if (next !== slot) {
      setSlot(next);
      setTrackIndex(0);
    }
    failuresRef.current = 0;
    // A station that came up empty gets another try.
    setPlaylists(p => (p[id]?.length === 0 ? without(p, id) : p));
    setStreamStatus('loading');
    setPlaying(true);
  }, [stations, slot]);

  const toggle = useCallback(() => {
    if (slot === null) {
      tune(stations[0].id);
      return;
    }
    soundEffects.radioStatic(0.15, 0.08);
    setStreamStatus('loading');
    setPlaying(p => !p);
  }, [slot, stations, tune]);

  const stop = useCallback(() => setPlaying(false), []);

  const nextStation = useCallback(() => {
    tune(stations[((slot ?? -1) + 1) % stations.length].id);
  }, [slot, stations, tune]);

  const probeMorse = useCallback(() => morseRef.current?.probe() ?? null, []);

  const stationId = station?.id ?? null;
  const value = useMemo<RadioState>(() => ({
    stations, stationId, playing, status, track, tune, toggle, stop, nextStation, probeMorse,
  }), [stations, stationId, playing, status, track, tune, toggle, stop, nextStation, probeMorse]);

  return <RadioContext.Provider value={value}>{children}</RadioContext.Provider>;
}
