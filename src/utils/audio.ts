let audioCtx: AudioContext | null = null;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioCtx;
}

function playTone(frequency: number, type: OscillatorType, duration: number, volume: number = 0.1, rampDown: boolean = true) {
  try {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') ctx.resume();
    
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    if (rampDown) {
      gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    } else {
      gainNode.gain.setValueAtTime(0, ctx.currentTime + duration);
    }

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start();
    oscillator.stop(ctx.currentTime + duration);
  } catch (e) {
    console.error("Audio playback failed", e);
  }
}

// Noise generator for that static/mechanical "clunk" feel
function playNoise(duration: number, volume: number = 0.1) {
  try {
    const ctx = getAudioContext();
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = buffer;
    
    // Add a lowpass filter to make it sound muffled/bassy like a dial turning
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 800;

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    noiseSource.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    noiseSource.start();
  } catch (e) {
    console.error("Noise playback failed", e);
  }
}

export const soundEffects = {
  tabSwitch: () => {
    // Fallout 4 heavy mechanical "clunk" when turning the main dial
    playTone(100, 'square', 0.08, 0.15); // Bassy thud
    playNoise(0.08, 0.3); // Mechanical friction
    setTimeout(() => playTone(80, 'square', 0.05, 0.1), 30);
  },
  subTabSwitch: () => {
    // Fallout 4 hollow button press / sub menu click
    playTone(400, 'square', 0.04, 0.05);
    playTone(800, 'triangle', 0.02, 0.02);
  },
  hover: () => {
    // Very subtle rapid click for scrolling
    playTone(600, 'square', 0.01, 0.02, false);
  },
  bootHum: () => {
    // Initial CRT power on hum
    playTone(60, 'sine', 1.5, 0.1);
    playTone(120, 'sine', 1.5, 0.05);
  },
  typewriterClick: () => {
    // Fast telemetry typing sound
    playTone(Math.random() * 500 + 1000, 'square', 0.01, 0.01, false);
  }
};
