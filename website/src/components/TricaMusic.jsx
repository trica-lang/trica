// 🎵 TRICA MUSIC SYSTEM - EPIC MIND-BENDING AUDIO 🎵
import { useEffect, useRef, useState } from 'react';

const TricaMusic = () => {
  const audioContextRef = useRef(null);
  const oscillatorsRef = useRef([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.1);

  useEffect(() => {
    // Initialize Web Audio API
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }

    // Start the epic Trica music automatically
    const startMusic = async () => {
      try {
        if (audioContextRef.current.state === 'suspended') {
          await audioContextRef.current.resume();
        }
        playTricaMusic();
      } catch (error) {
        console.log('Audio autoplay blocked, waiting for user interaction');
      }
    };

    startMusic();

    return () => {
      stopMusic();
    };
  }, []);

  const playTricaMusic = () => {
    if (isPlaying) return;

    const ctx = audioContextRef.current;
    const gainNode = ctx.createGain();
    gainNode.connect(ctx.destination);
    gainNode.gain.value = volume;

    // 🔥 TRICA CHORD PROGRESSION - MIND-BENDING HARMONIES 🔥
    const tricaChords = [
      // Quantum Chord (C Major with quantum dissonance)
      [261.63, 329.63, 392.00, 523.25, 659.25], // C E G C E
      
      // Reality Bending Chord (F Major with time distortion)
      [349.23, 440.00, 523.25, 698.46, 880.00], // F A C F A
      
      // Mind Destruction Chord (G Major with chaos)
      [392.00, 493.88, 587.33, 784.00, 987.77], // G B D G B
      
      // Infinite Recursion Chord (Am with feedback)
      [440.00, 523.25, 659.25, 880.00, 1046.50], // A C E A C
    ];

    let chordIndex = 0;
    let beatCount = 0;

    const playChord = (frequencies, duration = 2000) => {
      // Stop previous oscillators
      oscillatorsRef.current.forEach(osc => {
        try {
          osc.stop();
        } catch (e) {}
      });
      oscillatorsRef.current = [];

      frequencies.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();
        
        // Different waveforms for each note
        const waveforms = ['sine', 'triangle', 'sawtooth', 'square'];
        osc.type = waveforms[index % waveforms.length];
        
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        
        // Dynamic volume for each note
        oscGain.gain.setValueAtTime(volume * (0.3 + Math.random() * 0.4), ctx.currentTime);
        oscGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration / 1000);
        
        osc.connect(oscGain);
        oscGain.connect(gainNode);
        
        osc.start();
        osc.stop(ctx.currentTime + duration / 1000);
        
        oscillatorsRef.current.push(osc);
      });
    };

    const playSequence = () => {
      if (!isPlaying) return;

      const currentChord = tricaChords[chordIndex];
      
      // Add some quantum randomness
      const quantumChord = currentChord.map(freq => 
        freq * (0.98 + Math.random() * 0.04) // Slight frequency variation
      );
      
      playChord(quantumChord, 1800);
      
      // Add bass line
      setTimeout(() => {
        if (isPlaying) {
          const bassFreq = currentChord[0] / 2; // Octave down
          playChord([bassFreq], 1000);
        }
      }, 500);
      
      // Add high harmonics
      setTimeout(() => {
        if (isPlaying) {
          const harmonics = currentChord.map(f => f * 2); // Octave up
          playChord(harmonics, 800);
        }
      }, 1000);
      
      chordIndex = (chordIndex + 1) % tricaChords.length;
      beatCount++;
      
      // Change tempo based on beat count (gets more intense)
      const nextDelay = Math.max(1200 - (beatCount * 10), 800);
      
      setTimeout(playSequence, nextDelay);
    };

    setIsPlaying(true);
    playSequence();
  };

  const stopMusic = () => {
    setIsPlaying(false);
    oscillatorsRef.current.forEach(osc => {
      try {
        osc.stop();
      } catch (e) {}
    });
    oscillatorsRef.current = [];
  };

  const toggleMusic = () => {
    if (isPlaying) {
      stopMusic();
    } else {
      playTricaMusic();
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-black/80 backdrop-blur-sm rounded-lg p-3 border border-cyan-500/30">
      <div className="flex items-center gap-3">
        <button
          onClick={toggleMusic}
          className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg text-white font-bold text-sm hover:from-cyan-400 hover:to-purple-400 transition-all duration-300"
        >
          {isPlaying ? (
            <>
              <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
              🎵 TRICA MUSIC
            </>
          ) : (
            <>
              <span className="w-2 h-2 bg-white/50 rounded-full"></span>
              🔇 MUSIC OFF
            </>
          )}
        </button>
        
        <div className="flex items-center gap-2">
          <span className="text-cyan-400 text-xs">🔊</span>
          <input
            type="range"
            min="0"
            max="0.3"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="w-16 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>
      </div>
      
      {isPlaying && (
        <div className="mt-2 text-center">
          <div className="text-xs text-cyan-400 animate-pulse">
            🧠 MIND BENDING IN PROGRESS 🧠
          </div>
          <div className="flex justify-center gap-1 mt-1">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-1 h-3 bg-gradient-to-t from-cyan-500 to-purple-500 rounded-full animate-pulse"
                style={{
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: '0.8s'
                }}
              ></div>
            ))}
          </div>
        </div>
      )}
      
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: linear-gradient(45deg, #06b6d4, #8b5cf6);
          cursor: pointer;
        }
        
        .slider::-moz-range-thumb {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: linear-gradient(45deg, #06b6d4, #8b5cf6);
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
};

export default TricaMusic;