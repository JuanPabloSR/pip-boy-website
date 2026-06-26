let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

// Creates a short noise burst with envelope shaping
function noiseBuffer(ctx: AudioContext, duration: number): AudioBuffer {
  const len = Math.floor(ctx.sampleRate * duration);
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  return buf;
}

// Metallic impulse for mechanical resonance
function metallicImpulse(ctx: AudioContext, freq: number, decay: number, vol: number) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(freq * 0.4, ctx.currentTime + decay);

  filter.type = 'bandpass';
  filter.frequency.value = freq;
  filter.Q.value = 12;

  gain.gain.setValueAtTime(vol, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + decay);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + decay);
}

// Mechanical click transient
function mechanicalClick(ctx: AudioContext, vol: number) {
  const buf = noiseBuffer(ctx, 0.012);
  const src = ctx.createBufferSource();
  src.buffer = buf;

  const hp = ctx.createBiquadFilter();
  hp.type = 'highpass';
  hp.frequency.value = 2000;

  const lp = ctx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = 6000;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(vol, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.012);

  src.connect(hp);
  hp.connect(lp);
  lp.connect(gain);
  gain.connect(ctx.destination);
  src.start();
}

// Relay / solenoid thud
function relayThud(ctx: AudioContext, vol: number) {
  const buf = noiseBuffer(ctx, 0.04);
  const src = ctx.createBufferSource();
  src.buffer = buf;

  const lp = ctx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = 400;
  lp.Q.value = 2;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(vol, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.04);

  src.connect(lp);
  lp.connect(gain);
  gain.connect(ctx.destination);
  src.start();
}

export const soundEffects = {
  // Main dial rotation - heavy mechanical clunk like the Pip-Boy rotary knob
  tabSwitch: () => {
    try {
      const ctx = getCtx();
      const t = ctx.currentTime;

      // Layer 1: Solenoid thud (low body)
      relayThud(ctx, 0.35);

      // Layer 2: Metallic click transient
      mechanicalClick(ctx, 0.25);

      // Layer 3: Resonant metallic ring (gives the "enclosed device" feel)
      metallicImpulse(ctx, 1200, 0.06, 0.08);
      metallicImpulse(ctx, 800, 0.04, 0.06);

      // Layer 4: Secondary settle click (the "snap into place" after rotation)
      const buf2 = noiseBuffer(ctx, 0.008);
      const src2 = ctx.createBufferSource();
      src2.buffer = buf2;
      const bp = ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.value = 3500;
      bp.Q.value = 5;
      const g2 = ctx.createGain();
      g2.gain.setValueAtTime(0, t);
      g2.gain.setValueAtTime(0.15, t + 0.025);
      g2.gain.exponentialRampToValueAtTime(0.0001, t + 0.038);
      src2.connect(bp);
      bp.connect(g2);
      g2.connect(ctx.destination);
      src2.start(t + 0.025);
    } catch (e) {
      console.error('tabSwitch audio failed', e);
    }
  },

  // Sub-tab button press - lighter, hollow click
  subTabSwitch: () => {
    try {
      const ctx = getCtx();
      const t = ctx.currentTime;

      // Sharp high-freq click
      const osc = ctx.createOscillator();
      osc.type = 'square';
      osc.frequency.setValueAtTime(1800, t);
      osc.frequency.exponentialRampToValueAtTime(600, t + 0.02);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.08, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.025);

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1200;
      filter.Q.value = 3;

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(t + 0.03);

      // Tiny mechanical body
      const buf = noiseBuffer(ctx, 0.015);
      const src = ctx.createBufferSource();
      src.buffer = buf;
      const lp = ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.value = 1500;
      const g2 = ctx.createGain();
      g2.gain.setValueAtTime(0.06, t);
      g2.gain.exponentialRampToValueAtTime(0.0001, t + 0.015);
      src.connect(lp);
      lp.connect(g2);
      g2.connect(ctx.destination);
      src.start();
    } catch (e) {
      console.error('subTabSwitch audio failed', e);
    }
  },

  // List item hover/scroll - quick electronic tick
  hover: () => {
    try {
      const ctx = getCtx();
      const t = ctx.currentTime;

      const osc = ctx.createOscillator();
      osc.type = 'square';
      osc.frequency.setValueAtTime(2200, t);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.04, t);
      gain.gain.setValueAtTime(0, t + 0.006);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(t + 0.008);
    } catch (e) {
      console.error('hover audio failed', e);
    }
  },

  // CRT power-on hum with capacitor charge
  bootHum: () => {
    try {
      const ctx = getCtx();
      const t = ctx.currentTime;

      // 60Hz mains hum
      const hum = ctx.createOscillator();
      hum.type = 'sine';
      hum.frequency.value = 60;
      const humGain = ctx.createGain();
      humGain.gain.setValueAtTime(0, t);
      humGain.gain.linearRampToValueAtTime(0.08, t + 0.3);
      humGain.gain.setValueAtTime(0.08, t + 1.2);
      humGain.gain.exponentialRampToValueAtTime(0.02, t + 2.0);
      humGain.gain.exponentialRampToValueAtTime(0.0001, t + 2.5);
      hum.connect(humGain);
      humGain.connect(ctx.destination);
      hum.start();
      hum.stop(t + 2.5);

      // 120Hz harmonic
      const harm = ctx.createOscillator();
      harm.type = 'sine';
      harm.frequency.value = 120;
      const harmGain = ctx.createGain();
      harmGain.gain.setValueAtTime(0, t);
      harmGain.gain.linearRampToValueAtTime(0.04, t + 0.4);
      harmGain.gain.exponentialRampToValueAtTime(0.0001, t + 2.0);
      harm.connect(harmGain);
      harmGain.connect(ctx.destination);
      harm.start();
      harm.stop(t + 2.0);

      // Capacitor charge whine (rising pitch)
      const whine = ctx.createOscillator();
      whine.type = 'sine';
      whine.frequency.setValueAtTime(2000, t + 0.1);
      whine.frequency.exponentialRampToValueAtTime(15000, t + 0.8);
      const whineGain = ctx.createGain();
      whineGain.gain.setValueAtTime(0, t);
      whineGain.gain.linearRampToValueAtTime(0.015, t + 0.2);
      whineGain.gain.exponentialRampToValueAtTime(0.0001, t + 1.0);
      whine.connect(whineGain);
      whineGain.connect(ctx.destination);
      whine.start(t + 0.1);
      whine.stop(t + 1.0);

      // Static crackle on power-up
      const staticBuf = noiseBuffer(ctx, 0.8);
      const staticSrc = ctx.createBufferSource();
      staticSrc.buffer = staticBuf;
      const bp = ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.value = 3000;
      bp.Q.value = 1;
      const staticGain = ctx.createGain();
      staticGain.gain.setValueAtTime(0, t);
      staticGain.gain.linearRampToValueAtTime(0.06, t + 0.05);
      staticGain.gain.exponentialRampToValueAtTime(0.01, t + 0.4);
      staticGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.8);
      staticSrc.connect(bp);
      bp.connect(staticGain);
      staticGain.connect(ctx.destination);
      staticSrc.start();
    } catch (e) {
      console.error('bootHum audio failed', e);
    }
  },

  // Teletype character print - rapid sharp electronic tick
  typewriterClick: () => {
    try {
      const ctx = getCtx();
      const t = ctx.currentTime;

      const osc = ctx.createOscillator();
      osc.type = 'square';
      const freq = 1500 + Math.random() * 800;
      osc.frequency.setValueAtTime(freq, t);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.025, t);
      gain.gain.setValueAtTime(0, t + 0.004);

      const filter = ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.value = 1000;

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(t + 0.006);
    } catch (e) {
      console.error('typewriterClick audio failed', e);
    }
  },

  // Radio static when tuning between stations
  radioStatic: (duration = 0.3, vol = 0.12) => {
    try {
      const ctx = getCtx();
      const t = ctx.currentTime;

      const buf = noiseBuffer(ctx, duration);
      const src = ctx.createBufferSource();
      src.buffer = buf;

      const bp = ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.value = 2000;
      bp.Q.value = 0.8;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(vol, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);

      src.connect(bp);
      bp.connect(gain);
      gain.connect(ctx.destination);
      src.start();
    } catch (e) {
      console.error('radioStatic audio failed', e);
    }
  },

  // Pip-Boy power down / screen off
  powerDown: () => {
    try {
      const ctx = getCtx();
      const t = ctx.currentTime;

      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, t);
      osc.frequency.exponentialRampToValueAtTime(40, t + 0.4);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.12, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(t + 0.5);

      // Discharge crackle
      const buf = noiseBuffer(ctx, 0.15);
      const src = ctx.createBufferSource();
      src.buffer = buf;
      const lp = ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.value = 600;
      const g2 = ctx.createGain();
      g2.gain.setValueAtTime(0.08, t + 0.05);
      g2.gain.exponentialRampToValueAtTime(0.0001, t + 0.2);
      src.connect(lp);
      lp.connect(g2);
      g2.connect(ctx.destination);
      src.start(t + 0.05);
    } catch (e) {
      console.error('powerDown audio failed', e);
    }
  },

  // Confirmation beep (positive action)
  confirm: () => {
    try {
      const ctx = getCtx();
      const t = ctx.currentTime;

      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, t);
      osc.frequency.setValueAtTime(1100, t + 0.06);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.06, t);
      gain.gain.setValueAtTime(0.06, t + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(t + 0.16);
    } catch (e) {
      console.error('confirm audio failed', e);
    }
  },

  // Error / denied beep
  deny: () => {
    try {
      const ctx = getCtx();
      const t = ctx.currentTime;

      const osc = ctx.createOscillator();
      osc.type = 'square';
      osc.frequency.setValueAtTime(200, t);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.06, t);
      gain.gain.setValueAtTime(0, t + 0.08);
      gain.gain.setValueAtTime(0.06, t + 0.12);
      gain.gain.setValueAtTime(0, t + 0.2);

      const lp = ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.value = 400;

      osc.connect(lp);
      lp.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(t + 0.22);
    } catch (e) {
      console.error('deny audio failed', e);
    }
  },
};
