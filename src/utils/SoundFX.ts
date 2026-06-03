/* ============================================
   沉思谷物鱼 - Sound Effects (Web Audio API)
   Meditation Valley Fish
   ============================================ */

let audioCtx: AudioContext | null = null;

function ctx(): AudioContext {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioCtx;
}

/** Resume audio context (must be called from user gesture) */
export function resumeAudio() {
  if (audioCtx?.state === 'suspended') audioCtx.resume();
}

function tone(freq: number, start: number, duration: number, volume = 0.12, type: OscillatorType = 'sine') {
  const c = ctx();
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(volume, start);
  gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
  osc.connect(gain);
  gain.connect(c.destination);
  osc.start(start);
  osc.stop(start + duration);
}

// ── Sound Effects ──────────────────────────

/** Quest complete: ascending happy arpeggio */
export function playQuestComplete() {
  const c = ctx(); const t = c.currentTime;
  tone(523, t, 0.15, 0.1, 'triangle');       // C5
  tone(659, t + 0.1, 0.15, 0.1, 'triangle'); // E5
  tone(784, t + 0.2, 0.2, 0.12, 'triangle'); // G5
  tone(1047, t + 0.35, 0.3, 0.1, 'triangle');// C6
}

/** Fish caught: water splash + success */
export function playFishCaught() {
  const c = ctx(); const t = c.currentTime;
  // Splash (noise-like)
  tone(200, t, 0.1, 0.06, 'sawtooth');
  tone(300, t + 0.03, 0.08, 0.05, 'sawtooth');
  // Happy jingle
  tone(660, t + 0.15, 0.12, 0.09, 'triangle');
  tone(880, t + 0.25, 0.18, 0.1, 'triangle');
}

/** NPC talk: soft friendly pop */
export function playTalk() {
  const c = ctx(); const t = c.currentTime;
  tone(440, t, 0.06, 0.06, 'sine');
  tone(550, t + 0.04, 0.08, 0.05, 'sine');
}

/** Item use: gentle click */
export function playItemUse() {
  const c = ctx(); const t = c.currentTime;
  tone(800, t, 0.05, 0.06, 'sine');
  tone(1000, t + 0.03, 0.06, 0.04, 'sine');
}

/** Building placed: satisfying thud */
export function playBuild() {
  const c = ctx(); const t = c.currentTime;
  tone(150, t, 0.15, 0.08, 'triangle');
  tone(200, t + 0.05, 0.1, 0.06, 'triangle');
  tone(300, t + 0.12, 0.15, 0.07, 'triangle');
}

/** Gold earned: coin jingle */
export function playGold() {
  const c = ctx(); const t = c.currentTime;
  tone(1200, t, 0.06, 0.05, 'triangle');
  tone(1400, t + 0.06, 0.06, 0.05, 'triangle');
  tone(1600, t + 0.12, 0.08, 0.04, 'triangle');
}

/** Button click / UI: subtle tick */
export function playClick() {
  const c = ctx(); const t = c.currentTime;
  tone(600, t, 0.03, 0.04, 'sine');
}

/** Error / fail: low buzz */
export function playError() {
  const c = ctx(); const t = c.currentTime;
  tone(120, t, 0.15, 0.06, 'square');
  tone(100, t + 0.1, 0.15, 0.05, 'square');
}

/** Level / relationship up: warm ascending */
export function playLevelUp() {
  const c = ctx(); const t = c.currentTime;
  tone(400, t, 0.1, 0.08, 'triangle');
  tone(500, t + 0.08, 0.1, 0.08, 'triangle');
  tone(600, t + 0.16, 0.1, 0.08, 'triangle');
  tone(800, t + 0.24, 0.2, 0.1, 'triangle');
}

export { ctx as getAudioContext };
