/**
 * Desi Gaadi Beats - Web Audio Procedural Sound & Music Synthesizer
 * Provides authentic Indian driver SFX (Pressure Horns, Reverse Tunes, Auto Meters)
 * and rich procedural audio generation fallback for seamless playback.
 */

class DesiAudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.bassFilter = null;
    this.trebleFilter = null;
    this.analyser = null;
    this.currentPlayingSynth = null;
    this.isJhankar = false;
    this.isBassBoost = false;
    this.initAudioContext();
  }

  initAudioContext() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        
        // Master Gain
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.85, this.ctx.currentTime);

        // Equalizer Filters
        this.bassFilter = this.ctx.createBiquadFilter();
        this.bassFilter.type = 'lowshelf';
        this.bassFilter.frequency.setValueAtTime(160, this.ctx.currentTime);
        this.bassFilter.gain.setValueAtTime(0, this.ctx.currentTime);

        this.trebleFilter = this.ctx.createBiquadFilter();
        this.trebleFilter.type = 'highshelf';
        this.trebleFilter.frequency.setValueAtTime(3200, this.ctx.currentTime);
        this.trebleFilter.gain.setValueAtTime(0, this.ctx.currentTime);

        // Visualizer Analyser
        this.analyser = this.ctx.createAnalyser();
        this.analyser.fftSize = 128;
        this.analyser.smoothingTimeConstant = 0.8;

        // Routing: Synth/Source -> Bass -> Treble -> Analyser -> MasterGain -> Destination
        this.bassFilter.connect(this.trebleFilter);
        this.trebleFilter.connect(this.analyser);
        this.analyser.connect(this.masterGain);
        this.masterGain.connect(this.ctx.destination);
      }
    } catch (e) {
      console.warn("Web Audio API not yet initialized or supported:", e);
    }
  }

  ensureContext() {
    this.initAudioContext();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setVolume(volume) {
    if (!this.masterGain || !this.ctx) return;
    this.masterGain.gain.setTargetAtTime(Math.max(0, Math.min(1, volume)), this.ctx.currentTime, 0.05);
  }

  setBassBoost(enabled) {
    this.isBassBoost = enabled;
    if (!this.bassFilter || !this.ctx) return;
    this.bassFilter.gain.setTargetAtTime(enabled ? 12 : 0, this.ctx.currentTime, 0.1);
  }

  setJhankar(enabled) {
    this.isJhankar = enabled;
    if (!this.trebleFilter || !this.ctx) return;
    this.trebleFilter.gain.setTargetAtTime(enabled ? 9 : 0, this.ctx.currentTime, 0.1);
  }

  getFrequencyData() {
    if (!this.analyser) return new Uint8Array(32);
    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(dataArray);
    return dataArray;
  }

  // ==========================================
  // DESI HORN & DRIVER SOUND EFFECTS
  // ==========================================

  playPressureHorn() {
    this.ensureContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const notes = [293.66, 369.99, 440.0, 587.33]; // Multi-tone heavy Indian truck pressure horn
    
    notes.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = i % 2 === 0 ? 'sawtooth' : 'square';
      osc.frequency.setValueAtTime(freq, now);
      // Pitch slide up and down characteristic of air pressure horn
      osc.frequency.linearRampToValueAtTime(freq * 1.04, now + 0.12);
      osc.frequency.linearRampToValueAtTime(freq * 0.98, now + 0.55);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.22, now + 0.05);
      gain.gain.setValueAtTime(0.22, now + 0.45);
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
    
    // Two rapid sharp beeps (Classic Indian Car/Tata 407 horn)
    [0, 0.16].forEach(delay => {
      const t = now + delay;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'triangle';
      osc2.type = 'sawtooth';
      osc1.frequency.setValueAtTime(440, t);
      osc2.frequency.setValueAtTime(554.37, t); // Major 3rd interval

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

    // Mechanical heavy snap + 2-stroke engine chug sound
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'square';
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.15);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.22);

    // Auto rickshaw 2-stroke mini rev sound
    for (let i = 0; i < 4; i++) {
      const revTime = now + 0.1 + (i * 0.07);
      const revOsc = this.ctx.createOscillator();
      const revGain = this.ctx.createGain();

      revOsc.type = 'sawtooth';
      revOsc.frequency.setValueAtTime(65 + (i * 12), revTime);

      revGain.gain.setValueAtTime(0.18, revTime);
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

    // Iconic 8-bit truck reverse electronic music melody
    const notes = [
      { f: 523.25, d: 0.15 }, // C5
      { f: 587.33, d: 0.15 }, // D5
      { f: 659.25, d: 0.15 }, // E5
      { f: 698.46, d: 0.2 },  // F5
      { f: 659.25, d: 0.15 }, // E5
      { f: 587.33, d: 0.15 }, // D5
      { f: 523.25, d: 0.3 }   // C5
    ];

    let accTime = now;
    notes.forEach(note => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(note.f, accTime);

      gain.gain.setValueAtTime(0.25, accTime);
      gain.gain.exponentialRampToValueAtTime(0.001, accTime + note.d - 0.02);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(accTime);
      osc.stop(accTime + note.d);

      accTime += note.d;
    });
  }

  playTapriChaiChime() {
    this.ensureContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // Metal spoon tapping against heavy glass cup
    const freqs = [1760, 2637, 3520];
    freqs.forEach(f => {
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
  // PROCEDURAL DESI BEATS & MUSIC ENGINE
  // ==========================================

  startProceduralTrack(trackType, onUpdateProgress) {
    this.stopProceduralTrack();
    this.ensureContext();
    if (!this.ctx) return;

    let isPlaying = true;
    let step = 0;
    let tempo = 130; // BPM
    let timerId = null;

    if (trackType === 'auto_banger') tempo = 138;
    else if (trackType === 'truck_retro') tempo = 92;
    else if (trackType === 'roadways_superfast') tempo = 145;
    else if (trackType === 'monsoon_lofi') tempo = 84;
    else if (trackType === 'tapri_chai') tempo = 96;
    else if (trackType === 'tractor_bass') tempo = 132;
    else if (trackType === 'baraat_dhol') tempo = 150;

    const stepInterval = (60 / tempo) / 4; // 16th note

    const playBeat = () => {
      if (!isPlaying || !this.ctx) return;
      const t = this.ctx.currentTime;

      // 1. Kick / Dhol Bass (Dhama)
      if (step % 4 === 0 || (trackType === 'roadways_superfast' && step % 2 === 0)) {
        const kickOsc = this.ctx.createOscillator();
        const kickGain = this.ctx.createGain();
        kickOsc.frequency.setValueAtTime(trackType === 'roadways_superfast' ? 140 : 100, t);
        kickOsc.frequency.exponentialRampToValueAtTime(32, t + 0.18);
        kickGain.gain.setValueAtTime(0.45, t);
        kickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
        kickOsc.connect(kickGain);
        kickGain.connect(this.bassFilter);
        kickOsc.start(t);
        kickOsc.stop(t + 0.25);
      }

      // 2. Snare / Taali / Dhol Slap (Tilli)
      if (step % 8 === 4 || (trackType === 'auto_banger' && (step % 4 === 2))) {
        const snareOsc = this.ctx.createOscillator();
        const snareGain = this.ctx.createGain();
        snareOsc.type = 'triangle';
        snareOsc.frequency.setValueAtTime(260, t);
        snareGain.gain.setValueAtTime(0.28, t);
        snareGain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
        snareOsc.connect(snareGain);
        snareGain.connect(this.trebleFilter);
        snareOsc.start(t);
        snareOsc.stop(t + 0.15);
      }

      // 3. Indian Jhankar Shaker / Ghungroo / Hi-Hat
      if (step % 2 === 0 || trackType === 'auto_banger') {
        const hatOsc = this.ctx.createOscillator();
        const hatGain = this.ctx.createGain();
        hatOsc.type = 'highpass' ? 'square' : 'sawtooth';
        hatOsc.frequency.setValueAtTime(1200 + (Math.random() * 400), t);
        hatGain.gain.setValueAtTime(0.06, t);
        hatGain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
        hatOsc.connect(hatGain);
        hatGain.connect(this.trebleFilter);
        hatOsc.start(t);
        hatOsc.stop(t + 0.05);
      }

      // 4. Melodic Bassline / Sitar-Pluck Arpeggios
      const scale = [220, 246.94, 277.18, 293.66, 329.63, 369.99, 415.30, 440]; // Desi Bhairavi / Bilawal mode
      if (step % 2 === 0) {
        const noteIdx = (Math.floor(step / 2) * 3) % scale.length;
        const melodyOsc = this.ctx.createOscillator();
        const melodyGain = this.ctx.createGain();

        melodyOsc.type = trackType === 'monsoon_lofi' ? 'sine' : 'sawtooth';
        melodyOsc.frequency.setValueAtTime(scale[noteIdx], t);
        
        melodyGain.gain.setValueAtTime(trackType === 'monsoon_lofi' ? 0.12 : 0.16, t);
        melodyGain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);

        melodyOsc.connect(melodyGain);
        melodyGain.connect(this.trebleFilter);
        melodyOsc.start(t);
        melodyOsc.stop(t + 0.22);
      }

      step = (step + 1) % 64;
      timerId = setTimeout(playBeat, stepInterval * 1000);
    };

    playBeat();

    this.currentPlayingSynth = {
      stop: () => {
        isPlaying = false;
        if (timerId) clearTimeout(timerId);
      }
    };
  }

  stopProceduralTrack() {
    if (this.currentPlayingSynth) {
      this.currentPlayingSynth.stop();
      this.currentPlayingSynth = null;
    }
  }
}

export const desiAudio = new DesiAudioEngine();
