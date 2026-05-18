
import { Howl } from 'howler';

// Sounds path: Assumes these files are placed in /public/assets/sounds/
const SOUND_FILES = {
  HEN_CLUCK: '/assets/sounds/hen_cluck.mp3',
  SYCAMORE_LEAF: '/assets/sounds/sycamore_leaf.mp3',
};

class AudioManager {
  private henCluck: Howl;
  private sycamoreLeaf: Howl;
  private isInitialized: boolean = false;

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
}

export const audioManager = new AudioManager();
