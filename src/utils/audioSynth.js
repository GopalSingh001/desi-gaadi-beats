/**
 * Desi Gaadi Beats - High-End Web Audio Indian Synth Engine
 * Generates authentic Indian rhythms:
 * - Punjabi Dhol & Nagada (Dham-Dham)
 * - Mumbai Auto Jhankar Beats & Tapori grooves
 * - GT Road Late Night Sufi Harmonium & Sitar drones
 * - Haryana Roadways 145 BPM high-bass Ragni EDM
 * - Kaali Peeli Monsoon Vinyl Rain & Warm Sax
 * - Morning Tapri Chai Acoustic Sitar & Bansuri
 * - Desi Pressure Horns, Auto Meters & Truck Reverse melodies
 */

class DesiAudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.bassFilter = null;
    this.trebleFilter = null;
    this.analyser = null;
    this.currentTrack = null;
    this.isBassBoost = false;
    this.isJhankar = false;
  }

  initAudioContext() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();

      // Master Gain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.85, this.ctx.currentTime);

      // Bass Boost Filter (120Hz Low-Shelf)
      this.bassFilter = this.ctx.createBiquadFilter();
      this.bassFilter.type = 'lowshelf';
      this.bassFilter.frequency.setValueAtTime(140, this.ctx.currentTime);
      this.bassFilter.gain.setValueAtTime(0, this.ctx.currentTime);

      // Jhankar Treble Filter (3.5kHz High-Shelf)
      this.trebleFilter = this.ctx.createBiquadFilter();
      this.trebleFilter.type = 'highshelf';
      this.trebleFilter.frequency.setValueAtTime(3600, this.ctx.currentTime);
      this.trebleFilter.gain.setValueAtTime(0, this.ctx.currentTime);

      // Realtime Audio Visualizer Analyser
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 128;
      this.analyser.smoothingTimeConstant = 0.82;

      // Connect graph: Track -> Bass -> Treble -> Analyser -> MasterGain -> Destination
      this.bassFilter.connect(this.trebleFilter);
      this.trebleFilter.connect(this.analyser);
      this.analyser.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);
    } catch (e) {
      console.warn("AudioContext init error:", e);
    }
  }

  ensureContext() {
    this.initAudioContext();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setVolume(vol) {
    if (!this.masterGain || !this.ctx) return;
    const v = Math.max(0, Math.min(1, vol));
    this.masterGain.gain.setTargetAtTime(v, this.ctx.currentTime, 0.05);
  }

  setBassBoost(enabled) {
    this.isBassBoost = enabled;
    if (!this.bassFilter || !this.ctx) return;
    this.bassFilter.gain.setTargetAtTime(enabled ? 14 : 0, this.ctx.currentTime, 0.1);
  }

  setJhankar(enabled) {
    this.isJhankar = enabled;
    if (!this.trebleFilter || !this.ctx) return;
    this.trebleFilter.gain.setTargetAtTime(enabled ? 10 : 0, this.ctx.currentTime, 0.1);
  }

  getFrequencyData() {
    if (!this.analyser) return new Uint8Array(32);
    const data = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(data);
    return data;
  }

  // ==========================================
  // DESI SFX & HORNS
  // ==========================================

  playPressureHorn() {
    this.ensureContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const freqs = [310, 390, 465, 620]; // Heavy Indian Tata truck air horn chords

    freqs.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = idx % 2 === 0 ? 'sawtooth' : 'square';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.linearRampToValueAtTime(freq * 1.05, now + 0.1);
      osc.frequency.linearRampToValueAtTime(freq * 0.98, now + 0.5);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.25, now + 0.04);
      gain.gain.setValueAtTime(0.25, now + 0.45);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.75);
    });
  }

  playHornOkPlease() {
    this.ensureContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    [0, 0.15].forEach(delay => {
      const t = now + delay;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'triangle';
      osc2.type = 'sawtooth';
      osc1.frequency.setValueAtTime(440, t);
      osc2.frequency.setValueAtTime(554.37, t);

      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.3, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.masterGain);

      osc1.start(t);
      osc2.start(t);
      osc1.stop(t + 0.13);
      osc2.stop(t + 0.13);
    });
  }

  playAutoMeterClick() {
    this.ensureContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(35, now + 0.15);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.2);

    for (let i = 0; i < 4; i++) {
      const revTime = now + 0.08 + (i * 0.06);
      const revOsc = this.ctx.createOscillator();
      const revGain = this.ctx.createGain();

      revOsc.type = 'sawtooth';
      revOsc.frequency.setValueAtTime(70 + (i * 15), revTime);

      revGain.gain.setValueAtTime(0.2, revTime);
      revGain.gain.exponentialRampToValueAtTime(0.001, revTime + 0.05);

      revOsc.connect(revGain);
      revGain.connect(this.masterGain);

      revOsc.start(revTime);
      revOsc.stop(revTime + 0.06);
    }
  }

  playTruckReverseTune() {
    this.ensureContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const notes = [
      { f: 523.25, d: 0.15 },
      { f: 587.33, d: 0.15 },
      { f: 659.25, d: 0.15 },
      { f: 698.46, d: 0.2 },
      { f: 659.25, d: 0.15 },
      { f: 587.33, d: 0.15 },
      { f: 523.25, d: 0.3 }
    ];

    let t = now;
    notes.forEach(n => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(n.f, t);

      gain.gain.setValueAtTime(0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + n.d - 0.02);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(t);
      osc.stop(t + n.d);
      t += n.d;
    });
  }

  playTapriChaiChime() {
    this.ensureContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    [1760, 2637, 3520].forEach(f => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.65);
    });
  }

  playDesiSeeti() {
    this.ensureContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1400, now);
    osc.frequency.exponentialRampToValueAtTime(2400, now + 0.25);
    osc.frequency.linearRampToValueAtTime(2100, now + 0.45);

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.3, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.52);
  }

  // ==========================================
  // RICH PROCEDURAL INDIAN TRACK ENGINE
  // ==========================================

  startProceduralTrack(trackType) {
    this.stopProceduralTrack();
    this.ensureContext();
    if (!this.ctx) return;

    let isPlaying = true;
    let step = 0;
    let tempo = 136;
    let timerId = null;

    // Set tempo & scale according to Desi genre
    if (trackType === 'auto_banger') tempo = 138;
    else if (trackType === 'truck_retro') tempo = 92;
    else if (trackType === 'roadways_superfast') tempo = 146;
    else if (trackType === 'monsoon_lofi') tempo = 84;
    else if (trackType === 'tapri_chai') tempo = 96;
    else if (trackType === 'tractor_bass') tempo = 132;
    else if (trackType === 'baraat_dhol') tempo = 152;

    const stepInterval = (60 / tempo) / 4; // 16th notes

    // Authentic Indian Raga Scales (Bhairavi / Yaman / Bilawal / Bhairav)
    let scale = [220, 246.94, 261.63, 293.66, 329.63, 349.23, 392.00, 440];
    if (trackType === 'truck_retro') {
      // Raag Bhairavi (Soulful Dard)
      scale = [220, 233.08, 261.63, 293.66, 329.63, 349.23, 392.00, 440];
    } else if (trackType === 'roadways_superfast' || trackType === 'tractor_bass') {
      // Minor Pentatonic High Energy
      scale = [110, 130.81, 146.83, 164.81, 196.00, 220, 261.63, 293.66];
    } else if (trackType === 'tapri_chai' || trackType === 'monsoon_lofi') {
      // Raag Yaman / Romantic Retro
      scale = [220, 246.94, 277.18, 311.13, 329.63, 369.99, 415.30, 440];
    }

    const playBeat = () => {
      if (!isPlaying || !this.ctx) return;
      const t = this.ctx.currentTime;

      // 1. Heavy Dhol / Nagada / 808 Sub Kick (Dham)
      const isKickStep = (step % 4 === 0) || (trackType === 'roadways_superfast' && step % 8 === 6) || (trackType === 'baraat_dhol' && (step % 4 === 0 || step % 8 === 3));
      if (isKickStep) {
        const kickOsc = this.ctx.createOscillator();
        const kickGain = this.ctx.createGain();

        const baseFreq = (trackType === 'tractor_bass' || trackType === 'roadways_superfast') ? 130 : 100;
        kickOsc.frequency.setValueAtTime(baseFreq, t);
        kickOsc.frequency.exponentialRampToValueAtTime(32, t + 0.18);

        kickGain.gain.setValueAtTime(0.5, t);
        kickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.24);

        kickOsc.connect(kickGain);
        kickGain.connect(this.bassFilter);

        kickOsc.start(t);
        kickOsc.stop(t + 0.26);
      }

      // 2. Dholak Slap / Taali / Snare (Tilli)
      const isSnareStep = (step % 8 === 4) || (trackType === 'auto_banger' && (step % 4 === 2)) || (trackType === 'baraat_dhol' && (step % 4 === 2));
      if (isSnareStep) {
        const snareOsc = this.ctx.createOscillator();
        const snareGain = this.ctx.createGain();

        snareOsc.type = 'triangle';
        snareOsc.frequency.setValueAtTime(280, t);
        snareGain.gain.setValueAtTime(0.3, t);
        snareGain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

        snareOsc.connect(snareGain);
        snareGain.connect(this.trebleFilter);

        snareOsc.start(t);
        snareOsc.stop(t + 0.14);
      }

      // 3. Indian Jhankar Shaker / Ghungroo
      if (step % 2 === 0 || trackType === 'auto_banger' || trackType === 'baraat_dhol') {
        const hatOsc = this.ctx.createOscillator();
        const hatGain = this.ctx.createGain();

        hatOsc.type = 'square';
        hatOsc.frequency.setValueAtTime(1400 + (Math.random() * 500), t);

        hatGain.gain.setValueAtTime(0.06, t);
        hatGain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);

        hatOsc.connect(hatGain);
        hatGain.connect(this.trebleFilter);

        hatOsc.start(t);
        hatOsc.stop(t + 0.05);
      }

      // 4. Harmonium / Tanpura Drone & Sitar Melody Plucks
      if (step % 2 === 0) {
        const noteIdx = (Math.floor(step / 2) * 3) % scale.length;
        const melOsc = this.ctx.createOscillator();
        const melGain = this.ctx.createGain();

        melOsc.type = (trackType === 'truck_retro' || trackType === 'monsoon_lofi') ? 'sine' : 'sawtooth';
        melOsc.frequency.setValueAtTime(scale[noteIdx], t);

        melGain.gain.setValueAtTime((trackType === 'monsoon_lofi' || trackType === 'tapri_chai') ? 0.14 : 0.18, t);
        melGain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);

        melOsc.connect(melGain);
        melGain.connect(this.trebleFilter);

        melOsc.start(t);
        melOsc.stop(t + 0.25);
      }

      step = (step + 1) % 64;
      timerId = setTimeout(playBeat, stepInterval * 1000);
    };

    playBeat();

    this.currentTrack = {
      stop: () => {
        isPlaying = false;
        if (timerId) clearTimeout(timerId);
      }
    };
  }

  stopProceduralTrack() {
    if (this.currentTrack) {
      this.currentTrack.stop();
      this.currentTrack = null;
    }
  }
}

export const desiAudio = new DesiAudioEngine();
