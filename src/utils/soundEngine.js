// Unique Sound Profiles for Every Single Iconic Indian Song with Synchronous Audio Unlocking

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.isPlaying = false;
    this.timerId = null;
    this.beatIndex = 0;
    this.currentSongId = null;
  }

  init() {
    try {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.85, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    } catch (e) {
      console.error("Audio Context Init Error:", e);
    }
  }

  setVolume(val) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(Math.max(0, Math.min(1, val)), this.ctx.currentTime);
    }
  }

  playHorn(vehicleType = 'auto') {
    this.init();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    if (vehicleType === 'truck') {
      osc1.frequency.setValueAtTime(180, t);
      osc2.frequency.setValueAtTime(270, t);
    } else if (vehicleType === 'roadways') {
      osc1.frequency.setValueAtTime(260, t);
      osc2.frequency.setValueAtTime(390, t);
    } else if (vehicleType === 'tractor') {
      osc1.frequency.setValueAtTime(140, t);
      osc2.frequency.setValueAtTime(210, t);
    } else {
      osc1.frequency.setValueAtTime(440, t);
      osc2.frequency.setValueAtTime(580, t);
    }

    osc1.type = 'sawtooth';
    osc2.type = 'sawtooth';

    gain.gain.setValueAtTime(0.65, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.6);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.masterGain);

    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + 0.6);
    osc2.stop(t + 0.6);
  }

  playKick(time, punch = 1, subDecay = 0.18) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.frequency.setValueAtTime(150 * punch, time);
    osc.frequency.exponentialRampToValueAtTime(30, time + subDecay);
    gain.gain.setValueAtTime(0.9, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + subDecay);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(time);
    osc.stop(time + subDecay);
  }

  playDholak(time, freq = 340, decay = 0.12) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, time);
    osc.frequency.exponentialRampToValueAtTime(90, time + decay);
    gain.gain.setValueAtTime(0.6, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + decay);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(time);
    osc.stop(time + decay);
  }

  playJhankarHiHat(time, freq = 6500) {
    if (!this.ctx) return;
    const bufferSize = this.ctx.sampleRate * 0.04;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = freq;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.35, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.04);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start(time);
    noise.stop(time + 0.04);
  }

  playHarmoniumTone(freq, time, duration = 0.3) {
    if (!this.ctx) return;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sawtooth';
    osc2.type = 'triangle';
    osc1.frequency.setValueAtTime(freq, time);
    osc2.frequency.setValueAtTime(freq * 1.005, time);

    gain.gain.setValueAtTime(0.35, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + duration);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.masterGain);

    osc1.start(time);
    osc2.start(time);
    osc1.stop(time + duration);
    osc2.stop(time + duration);
  }

  playSitarTone(freq, time, duration = 0.4) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, time);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.02, time + duration);

    gain.gain.setValueAtTime(0.4, time);
    gain.gain.exponentialRampToValueAtTime(0.005, time + duration);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + duration);
  }

  playSynthLead(freq, time, duration = 0.2, type = 'sawtooth') {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, time);
    gain.gain.setValueAtTime(0.38, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + duration);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + duration);
  }

  getSongProfile(songId) {
    switch (songId) {
      // 🛺 AUTO RICKSHAW
      case 'auto-1': // Aankh Maarey (138 BPM, Tapori C Major)
        return {
          tempo: 138,
          notes: [523.25, 493.88, 440.00, 392.00, 440.00, 523.25, 587.33, 523.25, 392.00, 329.63, 349.23, 392.00],
          drumType: 'tapori_jhankar',
          instrument: 'synth'
        };
      case 'auto-2': // Muqabla (135 BPM, Disco D Minor)
        return {
          tempo: 135,
          notes: [293.66, 349.23, 392.00, 415.30, 440.00, 392.00, 349.23, 293.66, 261.63, 293.66],
          drumType: 'street_disco',
          instrument: 'synth'
        };
      case 'auto-3': // Kisi Disco (140 BPM, Govinda G Major)
        return {
          tempo: 140,
          notes: [392.00, 440.00, 493.88, 587.33, 523.25, 493.88, 440.00, 392.00, 329.63, 392.00],
          drumType: 'govinda_banger',
          instrument: 'synth'
        };
      case 'auto-4': // Chalti Hai Kya 9 Se 12 (142 BPM)
        return {
          tempo: 142,
          notes: [440.00, 523.25, 587.33, 659.25, 587.33, 523.25, 440.00, 392.00, 440.00],
          drumType: 'tapori_jhankar',
          instrument: 'synth'
        };
      case 'auto-5': // Zingaat (148 BPM Fast)
        return {
          tempo: 148,
          notes: [587.33, 659.25, 698.46, 783.99, 698.46, 659.25, 587.33, 523.25, 587.33],
          drumType: 'zingaat_fast',
          instrument: 'synth'
        };

      // 🚛 TATA TRUCK GT ROAD
      case 'truck-1': // Achha Sila Diya (88 BPM D Minor)
        return {
          tempo: 88,
          notes: [293.66, 349.23, 329.63, 293.66, 277.18, 293.66, 349.23, 392.00, 349.23, 329.63, 293.66],
          drumType: 'slow_sufi_dholak',
          instrument: 'harmonium'
        };
      case 'truck-2': // Yeh Jo Halka Halka Suroor (94 BPM)
        return {
          tempo: 94,
          notes: [329.63, 392.00, 369.99, 329.63, 493.88, 440.00, 392.00, 329.63, 293.66, 329.63],
          drumType: 'qawwali_claps',
          instrument: 'harmonium'
        };
      case 'truck-3': // Dil Tod Ke Hasti Ho Mera (90 BPM)
        return {
          tempo: 90,
          notes: [220.00, 261.63, 329.63, 293.66, 246.94, 220.00, 196.00, 220.00],
          drumType: 'slow_sufi_dholak',
          instrument: 'harmonium'
        };
      case 'truck-4': // Pardesi Pardesi (86 BPM)
        return {
          tempo: 86,
          notes: [349.23, 415.30, 392.00, 349.23, 311.13, 349.23, 415.30, 466.16, 415.30],
          drumType: 'slow_sufi_dholak',
          instrument: 'harmonium'
        };
      case 'truck-5': // Bedardi Se Pyar (92 BPM)
        return {
          tempo: 92,
          notes: [261.63, 311.13, 293.66, 261.63, 246.94, 261.63, 311.13, 349.23],
          drumType: 'slow_sufi_dholak',
          instrument: 'sitar'
        };

      // 🚌 HARYANA ROADWAYS
      case 'bus-1': // 52 Gaj Ka Daman (145 BPM)
        return {
          tempo: 145,
          notes: [293.66, 329.63, 369.99, 440.00, 392.00, 369.99, 329.63, 293.66, 246.94, 293.66],
          drumType: 'haryanvi_bass',
          instrument: 'synth'
        };
      case 'bus-2': // Teri Aakhya Ka Yo Kajal (142 BPM)
        return {
          tempo: 142,
          notes: [277.18, 329.63, 369.99, 415.30, 369.99, 329.63, 277.18, 246.94, 277.18],
          drumType: 'haryanvi_bass',
          instrument: 'synth'
        };
      case 'bus-3': // Solid Body (140 BPM)
        return {
          tempo: 140,
          notes: [329.63, 392.00, 440.00, 493.88, 440.00, 392.00, 329.63, 293.66, 329.63],
          drumType: 'haryanvi_bass',
          instrument: 'synth'
        };
      case 'bus-4': // Bahu Kale Ki (146 BPM)
        return {
          tempo: 146,
          notes: [440.00, 493.88, 554.37, 659.25, 554.37, 493.88, 440.00, 369.99, 440.00],
          drumType: 'haryanvi_bass',
          instrument: 'synth'
        };
      case 'bus-5': // Goli Chal Javegi (144 BPM)
        return {
          tempo: 144,
          notes: [369.99, 440.00, 493.88, 554.37, 493.88, 440.00, 369.99, 329.63, 369.99],
          drumType: 'haryanvi_bass',
          instrument: 'synth'
        };

      // 🚖 KAALI PEELI MONSOON
      case 'kp-1': // Rimjhim Gire Sawan (84 BPM)
        return {
          tempo: 84,
          notes: [349.23, 440.00, 523.25, 440.00, 392.00, 349.23, 293.66, 329.63, 349.23],
          drumType: 'monsoon_lofi',
          instrument: 'sitar'
        };
      case 'kp-2': // Chura Liya Hai Tumne (88 BPM)
        return {
          tempo: 88,
          notes: [440.00, 493.88, 523.25, 659.25, 587.33, 523.25, 493.88, 440.00, 392.00, 440.00],
          drumType: 'monsoon_lofi',
          instrument: 'sitar'
        };
      case 'kp-3': // Yeh Shaam Mastani (85 BPM)
        return {
          tempo: 85,
          notes: [392.00, 493.88, 587.33, 659.25, 587.33, 493.88, 392.00, 329.63, 392.00],
          drumType: 'monsoon_lofi',
          instrument: 'sitar'
        };
      case 'kp-4': // O Mere Dil Ke Chain (82 BPM)
        return {
          tempo: 82,
          notes: [523.25, 440.00, 392.00, 329.63, 293.66, 329.63, 392.00, 440.00, 523.25],
          drumType: 'monsoon_lofi',
          instrument: 'sitar'
        };

      // 🚜 TRACTOR 5911
      case 'trac-1': // Same Beef (130 BPM)
        return {
          tempo: 130,
          notes: [146.83, 174.61, 196.00, 220.00, 196.00, 174.61, 146.83, 130.81, 146.83],
          drumType: 'tractor_sub',
          instrument: 'synth'
        };
      case 'trac-2': // 295 (135 BPM)
        return {
          tempo: 135,
          notes: [220.00, 261.63, 293.66, 329.63, 293.66, 261.63, 220.00, 196.00, 220.00],
          drumType: 'tractor_sub',
          instrument: 'synth'
        };
      case 'trac-3': // Tochan King (128 BPM)
        return {
          tempo: 128,
          notes: [130.81, 164.81, 196.00, 246.94, 196.00, 164.81, 130.81, 110.00, 130.81],
          drumType: 'tractor_sub',
          instrument: 'synth'
        };

      default:
        return {
          tempo: 135,
          notes: [261.63, 293.66, 329.63, 392.00, 440.00, 523.25],
          drumType: 'tapori_jhankar',
          instrument: 'synth'
        };
    }
  }

  startTrack(songId) {
    this.init();
    this.stop();
    this.isPlaying = true;
    this.currentSongId = songId;
    this.beatIndex = 0;

    const profile = this.getSongProfile(songId);
    const intervalMs = (60 / profile.tempo / 4) * 1000;

    this.timerId = setInterval(() => {
      if (!this.isPlaying || !this.ctx) return;
      const t = this.ctx.currentTime;
      const step = this.beatIndex % 16;

      // 1. DRUMS
      if (profile.drumType === 'tapori_jhankar' || profile.drumType === 'govinda_banger') {
        if (step === 0 || step === 4 || step === 8 || step === 12) this.playKick(t, 1.1, 0.16);
        if (step === 4 || step === 12 || step === 7 || step === 15) this.playDholak(t, 380, 0.1);
        if (step % 2 === 1) this.playJhankarHiHat(t, 7000);
      } else if (profile.drumType === 'street_disco') {
        if (step % 4 === 0) this.playKick(t, 1.2, 0.15);
        if (step === 4 || step === 12) this.playDholak(t, 420, 0.08);
        if (step % 2 === 0) this.playJhankarHiHat(t, 8000);
      } else if (profile.drumType === 'zingaat_fast') {
        if (step % 2 === 0) this.playKick(t, 1.3, 0.12);
        if (step % 4 === 2) this.playDholak(t, 460, 0.08);
        this.playJhankarHiHat(t, 7500);
      } else if (profile.drumType === 'slow_sufi_dholak') {
        if (step === 0 || step === 6 || step === 10) this.playKick(t, 0.9, 0.25);
        if (step === 4 || step === 12) this.playDholak(t, 260, 0.18);
        if (step % 4 === 2) this.playJhankarHiHat(t, 5000);
      } else if (profile.drumType === 'qawwali_claps') {
        if (step === 0 || step === 8) this.playKick(t, 1.0, 0.2);
        if (step === 4 || step === 12 || step === 6 || step === 14) this.playDholak(t, 320, 0.12);
        if (step % 2 === 1) this.playJhankarHiHat(t, 6000);
      } else if (profile.drumType === 'haryanvi_bass') {
        if (step % 4 === 0) this.playKick(t, 1.4, 0.15);
        if (step === 4 || step === 12) this.playDholak(t, 400, 0.09);
        if (step % 2 === 1) this.playJhankarHiHat(t, 7000);
      } else if (profile.drumType === 'monsoon_lofi') {
        if (step === 0 || step === 8 || step === 10) this.playKick(t, 0.7, 0.22);
        if (step === 4 || step === 12) this.playDholak(t, 240, 0.15);
        if (step % 4 === 2) this.playJhankarHiHat(t, 4500);
      } else if (profile.drumType === 'tractor_sub') {
        if (step === 0 || step === 6 || step === 8 || step === 14) this.playKick(t, 1.8, 0.35);
        if (step === 4 || step === 12) this.playDholak(t, 450, 0.1);
        if (step % 2 === 1) this.playJhankarHiHat(t, 6500);
      }

      // 2. MELODIES
      if (step % 2 === 0) {
        const noteIdx = Math.floor(this.beatIndex / 2) % profile.notes.length;
        const freq = profile.notes[noteIdx];

        if (profile.instrument === 'harmonium') {
          this.playHarmoniumTone(freq, t, 0.28);
        } else if (profile.instrument === 'sitar') {
          this.playSitarTone(freq, t, 0.35);
        } else {
          this.playSynthLead(freq, t, 0.2, profile.drumType === 'tractor_sub' ? 'square' : 'sawtooth');
        }
      }

      this.beatIndex++;
    }, intervalMs);
  }

  stop() {
    this.isPlaying = false;
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }
}

export const soundEngine = new SoundEngine();
