/** Web Audio synthesizer – all sounds generated procedurally, no files needed */

let ctx = null;
let masterGain = null;
let musicGain = null;
let sfxGain = null;
let musicOsc = null;
let musicInterval = null;
let initialized = false;

/** Initialize audio context on first user interaction */
export function initAudio() {
  if (initialized) return;
  try {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = ctx.createGain();
    masterGain.gain.value = 0.5;
    masterGain.connect(ctx.destination);

    musicGain = ctx.createGain();
    musicGain.gain.value = 0.15;
    musicGain.connect(masterGain);

    sfxGain = ctx.createGain();
    sfxGain.gain.value = 0.4;
    sfxGain.connect(masterGain);

    initialized = true;
  } catch (e) {
    // Audio not available, game still works
  }
}

/** Resume audio context if suspended */
export function resumeAudio() {
  if (ctx && ctx.state === 'suspended') {
    ctx.resume();
  }
}

function playNote(freq, duration, type = 'square', gain = 0.3, dest = sfxGain) {
  if (!ctx || !dest) return;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  g.gain.setValueAtTime(gain, ctx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  osc.connect(g);
  g.connect(dest);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + duration);
}

function playNoise(duration, gain = 0.1) {
  if (!ctx || !sfxGain) return;
  const bufferSize = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  const g = ctx.createGain();
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = 800;
  filter.Q.value = 1;
  g.gain.setValueAtTime(gain, ctx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  source.connect(filter);
  filter.connect(g);
  g.connect(sfxGain);
  source.start(ctx.currentTime);
}

/** Turkey gobble sound */
export function playGobble() {
  if (!ctx) return;
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(220, now);
  osc.frequency.linearRampToValueAtTime(440, now + 0.08);
  osc.frequency.linearRampToValueAtTime(180, now + 0.15);
  osc.frequency.linearRampToValueAtTime(350, now + 0.22);
  osc.frequency.linearRampToValueAtTime(160, now + 0.3);
  g.gain.setValueAtTime(0.2, now);
  g.gain.linearRampToValueAtTime(0.3, now + 0.08);
  g.gain.linearRampToValueAtTime(0.15, now + 0.2);
  g.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
  osc.connect(g);
  g.connect(sfxGain);
  osc.start(now);
  osc.stop(now + 0.35);
}

/** Jump sound */
export function playJump() {
  playNote(330, 0.12, 'square', 0.2);
  setTimeout(() => playNote(440, 0.1, 'square', 0.15), 40);
}

/** Double jump sound */
export function playDoubleJump() {
  playNote(440, 0.1, 'square', 0.2);
  setTimeout(() => playNote(660, 0.1, 'square', 0.15), 30);
  setTimeout(() => playNote(880, 0.08, 'square', 0.1), 60);
}

/** Dash sound */
export function playDash() {
  playNoise(0.15, 0.15);
  playNote(200, 0.1, 'sawtooth', 0.15);
}

/** Duck sound */
export function playDuck() {
  playNote(180, 0.08, 'triangle', 0.15);
}

/** Collect corn */
export function playCorn() {
  playNote(523, 0.08, 'square', 0.2);
  setTimeout(() => playNote(659, 0.08, 'square', 0.2), 60);
  setTimeout(() => playNote(784, 0.1, 'square', 0.15), 120);
}

/** Collect wishbone (extra life) */
export function playWishbone() {
  const notes = [523, 659, 784, 1047];
  notes.forEach((freq, i) => {
    setTimeout(() => playNote(freq, 0.15, 'square', 0.2), i * 80);
  });
}

/** Hit / damage */
export function playHit() {
  playNoise(0.3, 0.3);
  playNote(120, 0.3, 'sawtooth', 0.25);
  playNote(80, 0.4, 'square', 0.15);
}

/** Game over (caught) */
export function playCaught() {
  const notes = [392, 349, 311, 262, 196];
  notes.forEach((freq, i) => {
    setTimeout(() => playNote(freq, 0.3, 'square', 0.25), i * 150);
  });
  setTimeout(() => playNoise(0.5, 0.2), 600);
}

/** Victory (escaped!) */
export function playEscaped() {
  const melody = [523, 587, 659, 784, 880, 1047];
  melody.forEach((freq, i) => {
    setTimeout(() => playNote(freq, 0.2, 'square', 0.25), i * 100);
  });
  setTimeout(() => {
    playNote(1047, 0.5, 'square', 0.3);
    playNote(784, 0.5, 'triangle', 0.2);
  }, 650);
}

/** Stage transition fanfare */
export function playStageTransition() {
  const notes = [392, 440, 523, 587, 659];
  notes.forEach((freq, i) => {
    setTimeout(() => playNote(freq, 0.15, 'square', 0.2), i * 70);
  });
}

/** Menu select sound */
export function playSelect() {
  playNote(440, 0.08, 'square', 0.2);
  setTimeout(() => playNote(660, 0.1, 'square', 0.15), 50);
}

/** Footstep sound */
export function playFootstep() {
  playNote(100 + Math.random() * 50, 0.05, 'triangle', 0.08);
}

// --- Music system ---

const FARM_MELODY = [
  [392, 0.3], [440, 0.3], [523, 0.3], [440, 0.3],
  [392, 0.3], [349, 0.3], [392, 0.6],
  [440, 0.3], [523, 0.3], [587, 0.3], [523, 0.3],
  [440, 0.3], [392, 0.3], [349, 0.6],
];

const BARN_MELODY = [
  [330, 0.25], [392, 0.25], [440, 0.25], [392, 0.25],
  [330, 0.25], [294, 0.25], [330, 0.5],
  [392, 0.25], [440, 0.25], [523, 0.25], [440, 0.25],
  [392, 0.25], [330, 0.25], [294, 0.5],
];

const KITCHEN_MELODY = [
  [262, 0.2], [294, 0.2], [330, 0.2], [349, 0.2],
  [330, 0.2], [294, 0.2], [262, 0.4],
  [349, 0.2], [392, 0.2], [440, 0.2], [392, 0.2],
  [349, 0.2], [330, 0.2], [294, 0.4],
];

const MELODIES = { farm: FARM_MELODY, barn: BARN_MELODY, kitchen: KITCHEN_MELODY };

let currentMelody = null;
let melodyIndex = 0;

export function startMusic(stage) {
  stopMusic();
  if (!ctx || !musicGain) return;
  currentMelody = MELODIES[stage] || FARM_MELODY;
  melodyIndex = 0;

  function playNext() {
    if (!currentMelody) return;
    const [freq, dur] = currentMelody[melodyIndex % currentMelody.length];
    playNote(freq, dur * 0.8, 'triangle', 0.2, musicGain);
    // Bass note
    playNote(freq / 2, dur * 0.6, 'sine', 0.1, musicGain);
    melodyIndex++;
    musicInterval = setTimeout(playNext, dur * 400);
  }
  playNext();
}

export function stopMusic() {
  if (musicInterval) {
    clearTimeout(musicInterval);
    musicInterval = null;
  }
  currentMelody = null;
  melodyIndex = 0;
}
