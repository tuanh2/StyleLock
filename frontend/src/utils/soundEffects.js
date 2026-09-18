// Web Audio API Synthesizer for zero-latency, zero-dependency tactile UI audio
let audioCtx = null;

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

/**
 * Crisp subtle click sound for buttons, tabs, and interactive elements
 */
export function playClick() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    const now = ctx.currentTime;

    // Pitch envelope: drops quickly from 850Hz to 150Hz
    osc.frequency.setValueAtTime(850, now);
    osc.frequency.exponentialRampToValueAtTime(150, now + 0.035);

    // Gain envelope: fast attack, quick decay (35ms)
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.04);
  } catch (_) {}
}

/**
 * Vibrant celebratory "Ting... Ting! 🔔" chime when on-chain tasks complete
 */
export function playTingTing() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const playBell = (freq, startTime, duration, volume = 0.18) => {
      // Fundamental tone
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(freq, startTime);

      // Overtone / harmonic for rich bell timbre
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(freq * 2.01, startTime);

      gain1.gain.setValueAtTime(0, startTime);
      gain1.gain.linearRampToValueAtTime(volume, startTime + 0.008);
      gain1.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      gain2.gain.setValueAtTime(0, startTime);
      gain2.gain.linearRampToValueAtTime(volume * 0.45, startTime + 0.008);
      gain2.gain.exponentialRampToValueAtTime(0.0001, startTime + duration * 0.7);

      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);

      osc1.start(startTime);
      osc1.stop(startTime + duration + 0.05);
      osc2.start(startTime);
      osc2.stop(startTime + duration + 0.05);
    };

    const now = ctx.currentTime;
    // First "Ting" (C6 ~ 1046.5 Hz)
    playBell(1046.5, now, 0.35, 0.16);
    // Second "Ting" higher and brighter (E6 ~ 1318.5 Hz) 140ms later
    playBell(1318.5, now + 0.14, 0.55, 0.22);
  } catch (_) {}
}

/**
 * Coin / Bounty reward cash sound
 */
export function playCoin() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [987.77, 1318.51, 1760.0]; // B5 -> E6 -> A6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      const time = now + idx * 0.09;
      osc.frequency.setValueAtTime(freq, time);

      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(0.15, time + 0.006);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(time);
      osc.stop(time + 0.35);
    });
  } catch (_) {}
}

/**
 * Attach global click sound handler to all buttons and interactive controls
 */
export function initGlobalClickSound() {
  if (typeof window === 'undefined') return () => {};

  const handleClick = (e) => {
    const target = e.target;
    // Check if clicked element or its parent is interactive
    const interactive = target.closest(
      'button, a, [role="button"], input[type="submit"], input[type="button"], .cursor-pointer'
    );
    if (interactive) {
      playClick();
    }
  };

  document.addEventListener('click', handleClick, { capture: true, passive: true });
  return () => {
    document.removeEventListener('click', handleClick, { capture: true });
  };
}
