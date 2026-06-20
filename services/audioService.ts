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

  // Web Audio bio-synthesizer properties (Agromusika Engine)
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
  private volumeLevel: number = 0.4; // Controlled range [0..1]

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
    console.log('Agromusika Acoustic System Initialized');
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

  // --- Web Audio Agromusika Engine Implementation ---

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
    this.volumeLevel = Math.max(0, Math.min(1, level));
    if (this.masterGain && this.audioCtx) {
      this.masterGain.gain.setTargetAtTime(this.volumeLevel, this.audioCtx.currentTime, 0.1);
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

      // 1. Earth Resonance (Soil Health model: deep sub grounding frequency)
      this.oscEarth = ctx.createOscillator();
      this.oscEarth.type = 'triangle';
      this.oscEarthGain = ctx.createGain();
      this.oscEarthGain.gain.setValueAtTime(0, ctx.currentTime);
      
      // 2. Flora Vibrations (Plant Diversity model: sweet middle floral vibes)
      this.oscFlora = ctx.createOscillator();
      this.oscFlora.type = 'sine';
      this.oscFloraGain = ctx.createGain();
      this.oscFloraGain.gain.setValueAtTime(0, ctx.currentTime);

      // 3. Atmospheric Breeze (Air Purity model: white noise band-pass wind gusting)
      this.noiseGain = ctx.createGain();
      this.noiseGain.gain.setValueAtTime(0, ctx.currentTime);
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

      // 4. Hydration Water Ripple (Water Quality model: LFO routing)
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

      // LFO modulates Flora gain nodes dynamically for a ripple flow effect
      this.lfo.connect(this.lfoGain);
      this.lfoGain.connect(this.oscFloraGain.gain);

      // Start sound nodes
      this.oscEarth.start(0);
      this.oscFlora.start(0);
      this.noiseSource.start(0);
      this.lfo.start(0);

      this.isSynthPlaying = true;
      this.updateScentSynth(factors);
      console.log('Agromusika Synth: Activated');
    } catch (e) {
      console.error('Agromusika failed to initialize synthesis nodes', e);
    }
  }

  updateScentSynth(factors: EnvironmentalFactors) {
    try {
      if (!this.audioCtx || !this.isSynthPlaying) return;
      const ctx = this.audioCtx;
      const t = ctx.currentTime;

      // Soil Health maps to deep frequency (45Hz - 110Hz)
      if (this.oscEarth && this.oscEarthGain) {
        const earthFreq = 45 + (factors.soilHealth / 100) * 65;
        this.oscEarth.frequency.setTargetAtTime(earthFreq, t, 0.3);
        const gainVal = (factors.soilHealth / 100) * 0.12;
        this.oscEarthGain.gain.setTargetAtTime(gainVal, t, 0.3);
      }

      // Plant Diversity maps to mid floral harmony (160Hz - 440Hz)
      if (this.oscFlora && this.oscFloraGain) {
        const floraFreq = 160 + (factors.plantDiversity / 100) * 280;
        this.oscFlora.frequency.setTargetAtTime(floraFreq, t, 0.3);
        const gainVal = (factors.plantDiversity / 100) * 0.08;
        this.oscFloraGain.gain.setTargetAtTime(gainVal, t, 0.3);
      }

      // Water Quality maps to LFO Ripple rate (0.2Hz - 3.2Hz)
      if (this.lfo && this.lfoGain) {
        const lfoSpeed = 0.2 + (factors.waterQuality / 100) * 3.0;
        this.lfo.frequency.setTargetAtTime(lfoSpeed, t, 0.3);
        const lfoDepth = (factors.waterQuality / 100) * 0.04;
        this.lfoGain.gain.setTargetAtTime(lfoDepth, t, 0.3);
      }

      // Air Purity maps to breeze frequency cutoff (100Hz - 1600Hz)
      if (this.noiseFilter && this.noiseGain) {
        const filterCutoff = 100 + (factors.airPurity / 100) * 1500;
        this.noiseFilter.frequency.setTargetAtTime(filterCutoff, t, 0.3);
        const breezeVolume = (factors.airPurity / 100) * 0.06;
        this.noiseGain.gain.setTargetAtTime(breezeVolume, t, 0.3);
      }
    } catch (e) {
      console.warn('Agromusika synth update failure', e);
    }
  }

  stopScentSynth() {
    try {
      if (!this.audioCtx || !this.isSynthPlaying) return;
      const t = this.audioCtx.currentTime;
      
      // Fast fade out then teardown
      this.oscEarthGain?.gain.setTargetAtTime(0, t, 0.1);
      this.oscFloraGain?.gain.setTargetAtTime(0, t, 0.1);
      this.noiseGain?.gain.setTargetAtTime(0, t, 0.1);

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
          console.log('Agromusika Synth: Suspended');
        } catch (err) {}
      }, 250);
    } catch (e) {
      console.error('Agromusika teardown failure', e);
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

  /**
   * M2M cybernetic handshake audio sweep
   */
  triggerDispenseHum(durationMs: number = 3000) {
    try {
      this.ensureAudioContext();
      if (!this.audioCtx || !this.masterGain) return;

      const ctx = this.audioCtx;
      const t = ctx.currentTime;
      const dur = durationMs / 1000;

      const oscMist = ctx.createOscillator();
      const gainMist = ctx.createGain();

      oscMist.type = 'sine';
      oscMist.frequency.setValueAtTime(90, t);
      oscMist.frequency.exponentialRampToValueAtTime(1100, t + 0.3);
      oscMist.frequency.exponentialRampToValueAtTime(650, t + dur / 2);
      oscMist.frequency.exponentialRampToValueAtTime(30, t + dur);

      gainMist.gain.setValueAtTime(0, t);
      gainMist.gain.linearRampToValueAtTime(0.16, t + 0.2);
      gainMist.gain.linearRampToValueAtTime(0.1, t + dur - 0.4);
      gainMist.gain.linearRampToValueAtTime(0, t + dur);

      oscMist.connect(gainMist);
      gainMist.connect(this.masterGain);

      oscMist.start(t);
      oscMist.stop(t + dur);

      this.playSycamoreLeafSound();
    } catch (e) {
      console.error('Dispense hum audio synthesis issue:', e);
    }
  }
}

export const audioManager = new AudioManager();
