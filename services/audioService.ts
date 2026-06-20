import { Howl } from 'howler';

// Sounds path: Assumes these files are placed in /public/assets/sounds/
const SOUND_FILES = {
  HEN_CLUCK: '/assets/sounds/hen_cluck.mp3',
  SYCAMORE_LEAF: '/assets/sounds/sycamore_leaf.mp3',
};

export interface EnvironmentalFactors {
  plantDiversity: number;
  animalPresence: number;
  soilHealth: number;
  waterQuality: number;
  airPurity: number;
}

class AudioManager {
  private henCluck: Howl;
  private sycamoreLeaf: Howl;
  private isInitialized: boolean = false;

  // Web Audio bio-synthesizer properties
  private audioCtx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private oscEarth: OscillatorNode | null = null;
  private oscFlora: OscillatorNode | null = null;
  private oscEarthGain: GainNode | null = null;
  private oscFloraGain: GainNode | null = null;
  
  private noiseSource: AudioBufferSourceNode | null = null;
  private noiseFilter: BiquadFilterNode | null = null;
  private noiseGain: GainNode | null = null;

  private lfo: OscillatorNode | null = null;
  private lfoGain: GainNode | null = null;

  private isSynthPlaying: boolean = false;
  private volumeLevel: number = 0.5; // Starts active but controllable

  constructor() {
    this.henCluck = new Howl({
      src: [SOUND_FILES.HEN_CLUCK],
      volume: 0.5,
      html5: true, 
      onloaderror: (id: any, err: any) => console.error('Hen Cluck Load Error', id, err),
    });
    this.sycamoreLeaf = new Howl({
      src: [SOUND_FILES.SYCAMORE_LEAF],
      volume: 0.3,
      html5: true,
      onloaderror: (id: any, err: any) => console.error('Sycamore Leaf Load Error', id, err),
    });
  }

  initialize() {
    if (this.isInitialized) return;
    this.isInitialized = true;
    console.log('EnvirosAgro Audio System Initialized');
  }

  playHenCluck() {
    try {
      this.henCluck.play();
    } catch (e) {
      console.error('Failed to play hen cluck', e);
    }
  }

  playSycamoreLeafSound() {
    try {
      this.sycamoreLeaf.play();
    } catch (e) {
      console.error('Failed to play sycamore leaf sound', e);
    }
  }

  // --- Web Audio Bio-Synthesizer Implementation ---

  private ensureAudioContext() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
        this.masterGain = this.audioCtx.createGain();
        this.masterGain.gain.setValueAtTime(this.volumeLevel, this.audioCtx.currentTime);
        this.masterGain.connect(this.audioCtx.destination);
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  setVolume(level: number) {
    this.volumeLevel = level;
    if (this.audioCtx && this.masterGain) {
      this.masterGain.gain.setValueAtTime(level, this.audioCtx.currentTime);
    }
  }

  getVolume(): number {
    return this.volumeLevel;
  }

  isSoundActive(): boolean {
    return this.isSynthPlaying;
  }

  startScentSynth(factors: EnvironmentalFactors) {
    try {
      this.ensureAudioContext();
      if (!this.audioCtx || !this.masterGain) return;
      if (this.isSynthPlaying) {
        this.updateScentSynth(factors);
        return;
      }

      const ctx = this.audioCtx;

      // 1. Earth Resonance (Soil Health controls pitch and depth)
      this.oscEarth = ctx.createOscillator();
      this.oscEarth.type = 'triangle';
      this.oscEarthGain = ctx.createGain();
      
      // 2. Flora Vibrations (Plant Diversity controls higher sweet harmonic frequencies)
      this.oscFlora = ctx.createOscillator();
      this.oscFlora.type = 'sine';
      this.oscFloraGain = ctx.createGain();

      // 3. Leafy Breeze (Pure Air Purity controls white noise wind level)
      this.noiseGain = ctx.createGain();
      this.noiseFilter = ctx.createBiquadFilter();
      this.noiseFilter.type = 'lowpass';
      
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      this.noiseSource = ctx.createBufferSource();
      this.noiseSource.buffer = buffer;
      this.noiseSource.loop = true;

      // 4. Hydration Ripple (Water quality modulates oscillator volume using an slowly oscillating LFO)
      this.lfo = ctx.createOscillator();
      this.lfo.type = 'sine';
      this.lfoGain = ctx.createGain();

      // Connections
      this.oscEarth.connect(this.oscEarthGain);
      this.oscEarthGain.connect(this.masterGain);

      this.oscFlora.connect(this.oscFloraGain);
      this.oscFloraGain.connect(this.masterGain);

      this.noiseSource.connect(this.noiseFilter);
      this.noiseFilter.connect(this.noiseGain);
      this.noiseGain.connect(this.masterGain);

      // Connect LFO: modulate Flora Gain Node slightly to simulate running water/waves ripples
      this.lfo.connect(this.lfoGain);
      this.lfoGain.connect(this.oscFloraGain.gain); // Modulate gain dynamically

      // Start all nodes
      this.oscEarth.start(0);
      this.oscFlora.start(0);
      this.noiseSource.start(0);
      this.lfo.start(0);

      this.isSynthPlaying = true;
      
      // Initial state push
      this.updateScentSynth(factors);
      console.log('Bio-Scent Ambient Synthesizer Stream ACTIVE');
    } catch (e) {
      console.error('Failed to start scent synth', e);
    }
  }

  updateScentSynth(factors: EnvironmentalFactors) {
    try {
      if (!this.audioCtx || !this.isSynthPlaying) return;
      const ctx = this.audioCtx;
      const t = ctx.currentTime;

      // Map Soil Health to deep grounding freq (40Hz to 120Hz)
      if (this.oscEarth && this.oscEarthGain) {
        const earthFreq = 40 + (factors.soilHealth / 100) * 80;
        this.oscEarth.frequency.exponentialRampToValueAtTime(earthFreq, t + 0.5);
        this.oscEarthGain.gain.linearRampToValueAtTime(0.12, t + 0.3);
      }

      // Map Plant Diversity to middle flora freq (180Hz to 480Hz)
      if (this.oscFlora && this.oscFloraGain) {
        const floraFreq = 180 + (factors.plantDiversity / 100) * 300;
        this.oscFlora.frequency.exponentialRampToValueAtTime(floraFreq, t + 0.5);
        this.oscFloraGain.gain.linearRampToValueAtTime(0.08, t + 0.3);
      }

      // Map Water Quality to Hydration Ripple LFO speed & depth
      if (this.lfo && this.lfoGain) {
        const lfoSpeed = 0.1 + (factors.waterQuality / 100) * 2.4; // 0.1Hz to 2.5Hz
        this.lfo.frequency.linearRampToValueAtTime(lfoSpeed, t + 0.5);
        const lfoDepth = (factors.waterQuality / 100) * 0.05; // gain depth modulation swing
        this.lfoGain.gain.linearRampToValueAtTime(lfoDepth, t + 0.3);
      }

      // Map Air Purity to Breeze Level filter cutoff & intensity
      if (this.noiseFilter && this.noiseGain) {
        const filterCutoff = 150 + (factors.airPurity / 100) * 1200; // 150Hz to 1350Hz cut-off
        this.noiseFilter.frequency.exponentialRampToValueAtTime(filterCutoff, t + 0.5);
        const breezeVolume = (factors.airPurity / 100) * 0.08;
        this.noiseGain.gain.linearRampToValueAtTime(breezeVolume, t + 0.3);
      }

    } catch (e) {
      console.warn('Synthesizer adjustment failed', e);
    }
  }

  stopScentSynth() {
    try {
      if (!this.audioCtx || !this.isSynthPlaying) return;
      
      const t = this.audioCtx.currentTime;
      
      // Elegant fade out
      this.oscEarthGain?.gain.linearRampToValueAtTime(0, t + 0.3);
      this.oscFloraGain?.gain.linearRampToValueAtTime(0, t + 0.3);
      this.noiseGain?.gain.linearRampToValueAtTime(0, t + 0.3);

      setTimeout(() => {
        try {
          this.oscEarth?.stop();
          this.oscFlora?.stop();
          this.noiseSource?.stop();
          this.lfo?.stop();

          this.oscEarth = null;
          this.oscFlora = null;
          this.noiseSource = null;
          this.lfo = null;
          this.isSynthPlaying = false;
          console.log('Bio-Scent Ambient Synthesizer Stream STANDBY');
        } catch (err) {}
      }, 350);

    } catch (e) {
      console.error('Failed to stop scent synth', e);
    }
  }

  // Active trigger beep-swishing effect for dispensing
  triggerDispenseHum(durationMs: number = 3000) {
    try {
      this.ensureAudioContext();
      if (!this.audioCtx || !this.masterGain) return;

      const ctx = this.audioCtx;
      const t = ctx.currentTime;
      const dur = durationMs / 1000;

      // Ultrasonic active mist hum
      const oscMist = ctx.createOscillator();
      const gainMist = ctx.createGain();

      oscMist.type = 'sine';
      
      // Sweep sound: starts in sub-bass and sweeps quickly into sweet mid-frequencies (like a compressed mist nozzle opening!)
      oscMist.frequency.setValueAtTime(80, t);
      oscMist.frequency.exponentialRampToValueAtTime(1200, t + 0.4);
      oscMist.frequency.exponentialRampToValueAtTime(600, t + dur / 2);
      oscMist.frequency.exponentialRampToValueAtTime(20, t + dur);

      // Volume envelope: rapid attack, gentle sustain, fading to absolute quiet
      gainMist.gain.setValueAtTime(0, t);
      gainMist.gain.linearRampToValueAtTime(0.18, t + 0.25);
      gainMist.gain.linearRampToValueAtTime(0.1, t + dur - 0.5);
      gainMist.gain.linearRampToValueAtTime(0, t + dur);

      oscMist.connect(gainMist);
      gainMist.connect(this.masterGain);

      oscMist.start(t);
      oscMist.stop(t + dur);

      // Trigger standard sycamore leaf click for high physical feedback
      this.playSycamoreLeafSound();

    } catch (e) {
      console.error('Failed sweeping active mist hum', e);
    }
  }

  /**
   * Play dynamic Notification chime (Agromusika synthesized)
   */
  playNotificationPing() {
    try {
      this.ensureAudioContext();
      if (!this.audioCtx || !this.masterGain) return;
      const ctx = this.audioCtx;
      const t = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      // Pleasant high rising bell tone
      osc.frequency.setValueAtTime(523.25, t); // C5
      osc.frequency.exponentialRampToValueAtTime(783.99, t + 0.12); // G5
      osc.frequency.exponentialRampToValueAtTime(1046.50, t + 0.3); // C6

      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.15, t + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.8);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(t);
      osc.stop(t + 0.85);
    } catch (e) {
      console.error('Agromusika notification sound issue:', e);
    }
  }

  /**
   * Play sweet Success tone (Agromusika synthesized)
   */
  playSystemSuccess() {
    try {
      this.ensureAudioContext();
      if (!this.audioCtx || !this.masterGain) return;
      const ctx = this.audioCtx;
      const t = ctx.currentTime;

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'triangle';

      osc1.frequency.setValueAtTime(440, t); // A4
      osc1.frequency.setValueAtTime(554.37, t + 0.1); // C#5
      osc1.frequency.setValueAtTime(659.25, t + 0.2); // E5

      osc2.frequency.setValueAtTime(880, t);
      osc2.frequency.setValueAtTime(1108.74, t + 0.1);
      osc2.frequency.setValueAtTime(1318.51, t + 0.2);

      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.12, t + 0.03);
      gain.gain.setValueAtTime(0.12, t + 0.25);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.masterGain);

      osc1.start(t);
      osc2.start(t);
      osc1.stop(t + 0.65);
      osc2.stop(t + 0.65);
    } catch (e) {
      console.error('Success audio synthesis issue:', e);
    }
  }

  /**
   * Play warning/caution/error alert tone (Agromusika synthesized)
   */
  playSystemError() {
    try {
      this.ensureAudioContext();
      if (!this.audioCtx || !this.masterGain) return;
      const ctx = this.audioCtx;
      const t = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, t);
      osc.frequency.linearRampToValueAtTime(100, t + 0.35);

      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.15, t + 0.05);
      gain.gain.linearRampToValueAtTime(0.15, t + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(t);
      osc.stop(t + 0.45);
    } catch (e) {
      console.error('Error audio synthesis issue:', e);
    }
  }
}

export const audioManager = new AudioManager();
