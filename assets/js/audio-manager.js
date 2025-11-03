// Audio Manager for Wii-style sound effects
class AudioManager {
  constructor() {
    this.soundEnabled = true;
    this.ambientEnabled = false;
    this.ambientSound = null;
    this.audioContext = null;
    this.masterVolume = 0.7;
    this.init();
  }

  init() {
    // Initialize Web Audio API context
    if (typeof window !== 'undefined' && window.AudioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    // Load user preferences
    this.loadUserPreferences();

    // Set up event listeners
    this.setupEventListeners();
    
    // NOTE: Ambient sound will be controlled by settings manager after it loads
    // This avoids timing issues between audio manager and settings manager initialization
  }

  loadUserPreferences() {
    const savedSoundEnabled = localStorage.getItem('soundEnabled');
    if (savedSoundEnabled !== null) {
      this.soundEnabled = savedSoundEnabled === 'true';
    } else {
      // If no saved preference, check if it was saved with the settings manager key
      const savedSoundEnabledFromSettings = localStorage.getItem('setting_soundEnabled');
      if (savedSoundEnabledFromSettings !== null) {
        this.soundEnabled = savedSoundEnabledFromSettings === 'true';
      }
    }

    const savedAmbientEnabled = localStorage.getItem('ambientEnabled');
    if (savedAmbientEnabled !== null) {
      this.ambientEnabled = savedAmbientEnabled === 'true';
    } else {
      // If no saved preference, check if it was saved with the settings manager key
      const savedAmbientEnabledFromSettings = localStorage.getItem('setting_ambientEnabled');
      if (savedAmbientEnabledFromSettings !== null) {
        this.ambientEnabled = savedAmbientEnabledFromSettings === 'true';
      } else {
        // Default to true for ambient music
        this.ambientEnabled = true;
      }
    }

    const savedVolume = localStorage.getItem('masterVolume');
    if (savedVolume !== null) {
      this.masterVolume = parseFloat(savedVolume);
    }
  }

  generateTone(frequency, duration, type = 'square', volume = 1) {
    if (!this.soundEnabled || !this.audioContext) return;

    try {
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }

      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
      gainNode.gain.value = this.masterVolume * volume;

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.start();
      oscillator.stop(this.audioContext.currentTime + duration);
    } catch (error) {
      console.warn(`Error generating tone:`, error);
    }
  }

  playSound(soundName) {
    if (!this.soundEnabled || !this.audioContext) return;

    let frequency;
    let duration;
    let type;
    let volume = 1;

    switch (soundName) {
      case 'hover':
        frequency = 880; // A5
        duration = 0.05;
        type = 'sine';
        volume = 0.3;
        break;
      case 'click':
        frequency = 440; // A4
        duration = 0.08;
        type = 'square';
        volume = 0.5;
        break;
      case 'expand':
        frequency = 660; // E5
        duration = 0.1;
        type = 'sine';
        volume = 0.4;
        break;
      case 'pageLoad':
        frequency = 550; // C#5
        duration = 0.15;
        type = 'sine';
        volume = 0.6;
        break;
      case 'notification':
        frequency = 770; // G5
        duration = 0.2;
        type = 'square';
        volume = 0.7;
        break;
      case 'bubblePop':
        frequency = 220; // A3
        duration = 0.05;
        type = 'triangle';
        volume = 0.2;
        break;
      case 'airClick':
        frequency = 1320; // E6
        duration = 0.03;
        type = 'sine';
        volume = 0.2;
        break;
      default:
        console.warn(`Unknown sound name: ${soundName}`);
        return;
    }
    this.generateTone(frequency, duration, type, volume);
  }

  // Play ambient sound (looping background sound)
  playAmbientSound(url = 'assets/audio/Main Menu.mp3') {
    if (!this.ambientEnabled || !this.soundEnabled) return;

    console.log('Attempting to play ambient sound with URL:', url); // Debug log

    // Stop any existing ambient sound
    this.stopAmbientSound();

    try {
      // For ambient sound, we'll use the traditional HTML5 audio approach for looping
      this.ambientSound = new Audio(url);
      this.ambientSound.loop = true;
      this.ambientSound.volume = this.masterVolume * 0.4; // Lower volume for ambient sound
      this.ambientSound.preload = 'auto'; // Ensure audio is preloaded

      // Event listeners for debugging
      this.ambientSound.addEventListener('loadstart', () => {
        console.log('Ambient sound: load started');
      });

      this.ambientSound.addEventListener('canplay', () => {
        console.log('Ambient sound: can play');
      });

      this.ambientSound.addEventListener('canplaythrough', () => {
        console.log('Ambient sound: can play through, attempting to play');
        const playPromise = this.ambientSound.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.warn('Ambient sound autoplay prevented:', error);
            // If autoplay fails, we'll try again after user interaction
          });
        }
      }, { once: true });

      this.ambientSound.addEventListener('error', (e) => {
        console.error('Error loading ambient sound:', e);
        console.error('Media error:', this.ambientSound.error);
      });

      this.ambientSound.addEventListener('suspend', () => {
        console.log('Ambient sound: loading was suspended');
      });

      // Load the audio file
      this.ambientSound.load();
    } catch (error) {
      console.error('Error preparing ambient sound:', error);
    }
  }
    if (!this.ambientEnabled || !this.soundEnabled) return;

    console.log('Attempting to play ambient sound with URL:', url); // Debug log

    // Stop any existing ambient sound
    this.stopAmbientSound();

    try {
      // For ambient sound, we'll use the traditional HTML5 audio approach for looping
      this.ambientSound = new Audio(url);
      this.ambientSound.loop = true;
      this.ambientSound.volume = this.masterVolume * 0.4; // Lower volume for ambient sound
      this.ambientSound.preload = 'auto'; // Ensure audio is preloaded

      // Event listeners for debugging
      this.ambientSound.addEventListener('loadstart', () => {
        console.log('Ambient sound: load started');
      });

      this.ambientSound.addEventListener('canplay', () => {
        console.log('Ambient sound: can play');
      });

      this.ambientSound.addEventListener('canplaythrough', () => {
        console.log('Ambient sound: can play through, attempting to play');
        const playPromise = this.ambientSound.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.warn('Ambient sound autoplay prevented:', error);
            // If autoplay fails, we'll try again after user interaction
          });
        }
      }, { once: true });

      this.ambientSound.addEventListener('error', (e) => {
        console.error('Error loading ambient sound:', e);
        console.error('Media error:', this.ambientSound.error);
      });

      this.ambientSound.addEventListener('suspend', () => {
        console.log('Ambient sound: loading was suspended');
      });

      // Load the audio file
      this.ambientSound.load();
    } catch (error) {
      console.error('Error preparing ambient sound:', error);
    }
  }

  stopAmbientSound() {
    if (this.ambientSound) {
      this.ambientSound.pause();
      this.ambientSound = null;
    }
  }

  toggleSound(enabled) {
    this.soundEnabled = enabled;
    localStorage.setItem('soundEnabled', this.soundEnabled);

    if (!this.soundEnabled) {
      this.stopAmbientSound();
    }
  }

  toggleAmbient(enabled) {
    this.ambientEnabled = enabled;
    localStorage.setItem('ambientEnabled', this.ambientEnabled);

    if (this.ambientEnabled && this.soundEnabled) {
      // Ensure audio context is ready before playing ambient sound
      if (this.audioContext && this.audioContext.state === 'suspended') {
        this.audioContext.resume().then(() => {
          this.playAmbientSound();
        });
      } else {
        this.playAmbientSound();
      }
    } else {
      this.stopAmbientSound();
    }
  }

  setVolume(volume) {
    this.masterVolume = Math.max(0, Math.min(1, volume)); // Clamp between 0 and 1
    localStorage.setItem('masterVolume', this.masterVolume);
  }

  setupEventListeners() {
    // Handle audio context resume and ambient sound on user interaction (required by browsers)
    document.addEventListener('click', () => {
      if (this.audioContext && this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }
      
      // If ambient sound was blocked due to autoplay policy, try to start it now
      if (this.ambientEnabled && this.soundEnabled && (!this.ambientSound || this.ambientSound.paused)) {
        this.playAmbientSound();
      }
    }, { once: true });
  }

  // Convenience methods for specific sounds
  playHoverSound() {
    this.playSound('hover');
  }

  playClickSound() {
    this.playSound('click');
  }

  playExpandSound() {
    this.playSound('expand');
  }

  playPageLoadSound() {
    this.playSound('pageLoad');
  }

  playNotificationSound() {
    this.playSound('notification');
  }

  playBubblePopSound() {
    this.playSound('bubblePop');
  }

  playAirClickSound() {
    this.playSound('airClick');
  }
}

// Initialize the audio manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.audioManager = new AudioManager();
});

// Export for use in other modules (if using modules)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AudioManager;
}