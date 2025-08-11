import { useEffect } from 'react';

const SoundEffects = ({ phase, enabled = true }) => {
  useEffect(() => {
    if (!enabled) return;

    // Create audio context for sound synthesis
    let audioContext;
    let oscillator;
    let gainNode;

    try {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      const playTone = (frequency, duration, type = 'sine', volume = 0.1) => {
        if (!audioContext) return;
        
        oscillator = audioContext.createOscillator();
        gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
        oscillator.type = type;
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration);
      };

      // Phase-specific sound effects
      switch (phase) {
        case 0: // initializing
          playTone(220, 0.5, 'sine', 0.05);
          break;
        case 1: // quantum-loading
          playTone(330, 0.3, 'square', 0.03);
          setTimeout(() => playTone(440, 0.3, 'square', 0.03), 200);
          break;
        case 2: // mind-bending
          playTone(550, 0.4, 'sawtooth', 0.04);
          setTimeout(() => playTone(660, 0.4, 'sawtooth', 0.04), 150);
          setTimeout(() => playTone(770, 0.4, 'sawtooth', 0.04), 300);
          break;
        case 3: // reality-distortion
          playTone(880, 0.6, 'triangle', 0.06);
          setTimeout(() => playTone(440, 0.3, 'sine', 0.03), 300);
          break;
        case 4: // complete
          // Success chord
          playTone(523, 0.8, 'sine', 0.04); // C
          setTimeout(() => playTone(659, 0.8, 'sine', 0.04), 100); // E
          setTimeout(() => playTone(784, 0.8, 'sine', 0.04), 200); // G
          break;
        default:
          break;
      }
    } catch (error) {
      // Audio not supported or blocked
      console.log('Audio not available');
    }

    return () => {
      if (oscillator) {
        try {
          oscillator.stop();
        } catch (e) {
          // Already stopped
        }
      }
      if (audioContext && audioContext.state !== 'closed') {
        audioContext.close();
      }
    };
  }, [phase, enabled]);

  return null; // This component doesn't render anything
};

export default SoundEffects;