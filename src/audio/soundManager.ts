class SoundManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private bgmOscillators: OscillatorNode[] = [];
  private bgmGain: GainNode | null = null;
  private isBgmPlaying: boolean = false;

  private initCtx() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted && this.bgmGain && this.ctx) {
      this.bgmGain.gain.setValueAtTime(0, this.ctx.currentTime);
    } else if (!muted && this.bgmGain && this.ctx) {
      this.bgmGain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // Voice speech pronouncing "ضجااااااج!" (Dajaaaj)
  public playDajajVoice() {
    if (this.isMuted) return;
    this.initCtx();

    // 1. Text-to-Speech Utterance in Arabic
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel(); // Stop prior rapid speech
        const utterance = new SpeechSynthesisUtterance('دجاااااج!');
        utterance.lang = 'ar-SA';
        utterance.pitch = 1.4; // High energetic chicken pitch
        utterance.rate = 1.25;
        utterance.volume = 1.0;

        const voices = window.speechSynthesis.getVoices();
        const arVoice = voices.find((v) => v.lang.toLowerCase().includes('ar'));
        if (arVoice) {
          utterance.voice = arVoice;
        }

        window.speechSynthesis.speak(utterance);
      } catch {
        // Fallback silently if speech synthesis fails
      }
    }

    // 2. Web Audio Formant Synthesizer overlay for "DAJAAAJ" voice resonance
    if (this.ctx) {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const formantFilter = this.ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc2.type = 'square';

      // Vocal inflection: D (low) -> AJA (high pitch glide) -> AJ (dip)
      osc.frequency.setValueAtTime(220, t);
      osc.frequency.linearRampToValueAtTime(520, t + 0.12);
      osc.frequency.exponentialRampToValueAtTime(320, t + 0.35);

      osc2.frequency.setValueAtTime(110, t);
      osc2.frequency.linearRampToValueAtTime(260, t + 0.12);
      osc2.frequency.exponentialRampToValueAtTime(160, t + 0.35);

      // Formant filter resonant peak to simulate vowel "A" (1000Hz peak)
      formantFilter.type = 'bandpass';
      formantFilter.frequency.setValueAtTime(700, t);
      formantFilter.frequency.linearRampToValueAtTime(1200, t + 0.12);
      formantFilter.frequency.exponentialRampToValueAtTime(800, t + 0.35);
      formantFilter.Q.setValueAtTime(4.0, t);

      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.4, t + 0.05);
      gain.gain.setValueAtTime(0.4, t + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.38);

      osc.connect(formantFilter);
      osc2.connect(formantFilter);
      formantFilter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc2.start(t);
      osc.stop(t + 0.39);
      osc2.stop(t + 0.39);
    }
  }

  // Chicken Cluck Sound ("Dajaj" - synthesized using vocal formant filters and fast pitch envelope)
  public playCluck(pitchMultiplier = 1.0) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    
    // Primary vocal oscillator
    const osc = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc2.type = 'triangle';

    // Base chicken pitch ~280Hz - 420Hz
    const baseFreq = (300 + Math.random() * 100) * pitchMultiplier;
    
    osc.frequency.setValueAtTime(baseFreq, t);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, t + 0.04);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.7, t + 0.15);

    osc2.frequency.setValueAtTime(baseFreq * 1.2, t);
    osc2.frequency.exponentialRampToValueAtTime(baseFreq * 0.8, t + 0.15);

    // Formant filter (characteristic "bawk/cluck" resonance around 1200Hz)
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1100 + Math.random() * 300, t);
    filter.Q.setValueAtTime(3.5, t);

    // Volume envelope
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.35, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);

    osc.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc2.start(t);
    osc.stop(t + 0.17);
    osc2.stop(t + 0.17);

    // Quick secondary double-cluck 40% of the time
    if (Math.random() < 0.4) {
      setTimeout(() => this.playSubCluck(baseFreq * 1.1), 80);
    }
  }

  private playSubCluck(freq: number) {
    if (this.isMuted || !this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, t);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.6, t + 0.1);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1300, t);
    filter.Q.setValueAtTime(4, t);

    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.11);
  }

  // Catch sound effect (rewarding energetic pop)
  public playCatch() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, t);
    osc.frequency.exponentialRampToValueAtTime(880, t + 0.08);

    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.16);
  }

  // Golden chicken catch sound (sparkly arpeggio)
  public playGoldenCatch() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const t = this.ctx!.currentTime + idx * 0.05;
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(t);
      osc.stop(t + 0.13);
    });
  }

  // Rooster crowing sound (loud "Cock-a-doodle-doo" sound)
  public playRoosterCrow() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    // Frequency ramps up and holds like a rooster crow
    osc.frequency.setValueAtTime(350, t);
    osc.frequency.linearRampToValueAtTime(700, t + 0.15);
    osc.frequency.setValueAtTime(700, t + 0.35);
    osc.frequency.exponentialRampToValueAtTime(500, t + 0.6);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2000, t);

    gain.gain.setValueAtTime(0.01, t);
    gain.gain.linearRampToValueAtTime(0.35, t + 0.08);
    gain.gain.setValueAtTime(0.35, t + 0.4);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.65);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.66);
  }

  // Bomb chicken explosion / hit penalty sound
  public playBombHit() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    
    // Low rumble noise buffer
    const bufferSize = this.ctx.sampleRate * 0.3;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, t);
    filter.frequency.exponentialRampToValueAtTime(50, t + 0.3);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.3);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    whiteNoise.start(t);
  }

  // Escape sound (Chicken got into coop)
  public playEscape() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(320, t);
    osc.frequency.exponentialRampToValueAtTime(140, t + 0.2);

    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.23);
  }

  // Powerup trigger sound
  public playPowerup(type: 'freeze' | 'cornDecoy' | 'megaNet') {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    if (type === 'freeze') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, t);
      osc.frequency.linearRampToValueAtTime(400, t + 0.25);
    } else if (type === 'cornDecoy') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(300, t);
      osc.frequency.linearRampToValueAtTime(600, t + 0.15);
      osc.frequency.linearRampToValueAtTime(900, t + 0.3);
    } else {
      osc.type = 'square';
      osc.frequency.setValueAtTime(200, t);
      osc.frequency.exponentialRampToValueAtTime(800, t + 0.2);
    }

    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.31);
  }

  // Victory fanfare
  public playVictory() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const notes = [261.63, 329.63, 392.00, 523.25, 659.25]; // C, E, G, C, E
    notes.forEach((freq, idx) => {
      const t = this.ctx!.currentTime + idx * 0.1;
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(t);
      osc.stop(t + 0.26);
    });
  }

  // Realistic Hunting Rifle Gunshot Sound Effect
  public playGunshot() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;

    // 1. Initial Explosive Blast (White Noise Burst)
    const bufferSize = this.ctx.sampleRate * 0.15;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = buffer;

    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.setValueAtTime(3000, t);
    noiseFilter.frequency.exponentialRampToValueAtTime(400, t + 0.12);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.8, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);

    whiteNoise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);
    whiteNoise.start(t);

    // 2. Heavy Sub-Bass Punch (Rifle Blast Thud)
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();

    subOsc.type = 'triangle';
    subOsc.frequency.setValueAtTime(160, t);
    subOsc.frequency.exponentialRampToValueAtTime(35, t + 0.18);

    subGain.gain.setValueAtTime(0.7, t);
    subGain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);

    subOsc.connect(subGain);
    subGain.connect(this.ctx.destination);
    subOsc.start(t);
    subOsc.stop(t + 0.21);

    // 3. Metallic Shell Eject / Mechanical Cocking Click (0.1s delay)
    setTimeout(() => {
      if (this.isMuted || !this.ctx) return;
      const t2 = this.ctx.currentTime;
      const clickOsc = this.ctx.createOscillator();
      const clickGain = this.ctx.createGain();

      clickOsc.type = 'square';
      clickOsc.frequency.setValueAtTime(1800, t2);
      clickOsc.frequency.exponentialRampToValueAtTime(600, t2 + 0.04);

      clickGain.gain.setValueAtTime(0.2, t2);
      clickGain.gain.exponentialRampToValueAtTime(0.001, t2 + 0.04);

      clickOsc.connect(clickGain);
      clickGain.connect(this.ctx.destination);
      clickOsc.start(t2);
      clickOsc.stop(t2 + 0.05);
    }, 100);
  }

  // Game over sound
  public playGameOver() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const notes = [300, 260, 220, 180];
    notes.forEach((freq, idx) => {
      const t = this.ctx!.currentTime + idx * 0.15;
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(t);
      osc.stop(t + 0.21);
    });
  }

  // Cheerful background farm music loop
  public startBgm() {
    if (this.isBgmPlaying) return;
    this.initCtx();
    if (!this.ctx) return;

    this.isBgmPlaying = true;
    this.bgmGain = this.ctx.createGain();
    this.bgmGain.gain.setValueAtTime(this.isMuted ? 0 : 0.05, this.ctx.currentTime);
    this.bgmGain.connect(this.ctx.destination);

    // Simple rhythmic acoustic banjo loop
    const melody = [
      261.63, 329.63, 392.00, 329.63,
      261.63, 329.63, 392.00, 523.25,
      293.66, 349.23, 440.00, 349.23,
      293.66, 392.00, 493.88, 392.00
    ];

    let step = 0;
    const playNote = () => {
      if (!this.isBgmPlaying || !this.ctx || !this.bgmGain) return;
      
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(melody[step % melody.length], t);

      gain.gain.setValueAtTime(0.1, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

      osc.connect(gain);
      gain.connect(this.bgmGain);

      osc.start(t);
      osc.stop(t + 0.19);

      step++;
      if (this.isBgmPlaying) {
        setTimeout(playNote, 220);
      }
    };

    playNote();
  }

  public stopBgm() {
    this.isBgmPlaying = false;
  }
}

export const soundManager = new SoundManager();
