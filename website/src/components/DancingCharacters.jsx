import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Music, Sparkles, Zap } from 'lucide-react';
import './DancingCharacters.css';

const DancingCharacters = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(0);
  const [danceStyle, setDanceStyle] = useState('trica-groove');
  const audioContextRef = useRef(null);
  const intervalRef = useRef(null);

  // Trica Music Generator using Web Audio API
  const generateTricaMusic = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }

    const ctx = audioContextRef.current;
    const now = ctx.currentTime;

    // Trica Theme Melody (in the key of "Mind Destruction")
    const melody = [
      { freq: 523.25, time: 0.0 },   // C5
      { freq: 659.25, time: 0.2 },   // E5
      { freq: 783.99, time: 0.4 },   // G5
      { freq: 1046.50, time: 0.6 },  // C6
      { freq: 783.99, time: 0.8 },   // G5
      { freq: 659.25, time: 1.0 },   // E5
      { freq: 523.25, time: 1.2 },   // C5
      { freq: 440.00, time: 1.4 },   // A4
    ];

    // Bass line (because every good Trica song needs BASS)
    const bassLine = [
      { freq: 130.81, time: 0.0 },   // C3
      { freq: 164.81, time: 0.4 },   // E3
      { freq: 196.00, time: 0.8 },   // G3
      { freq: 220.00, time: 1.2 },   // A3
    ];

    // Create oscillators for melody
    melody.forEach(note => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.frequency.setValueAtTime(note.freq, now + note.time);
      osc.type = 'sine';
      
      gain.gain.setValueAtTime(0, now + note.time);
      gain.gain.linearRampToValueAtTime(0.1, now + note.time + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, now + note.time + 0.15);
      
      osc.start(now + note.time);
      osc.stop(now + note.time + 0.2);
    });

    // Create oscillators for bass
    bassLine.forEach(note => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.frequency.setValueAtTime(note.freq, now + note.time);
      osc.type = 'sawtooth';
      
      gain.gain.setValueAtTime(0, now + note.time);
      gain.gain.linearRampToValueAtTime(0.05, now + note.time + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, now + note.time + 0.35);
      
      osc.start(now + note.time);
      osc.stop(now + note.time + 0.4);
    });

    // Add some "quantum percussion" (random bleeps and bloops)
    for (let i = 0; i < 8; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.frequency.setValueAtTime(800 + Math.random() * 400, now + i * 0.2);
      osc.type = 'square';
      
      gain.gain.setValueAtTime(0, now + i * 0.2);
      gain.gain.linearRampToValueAtTime(0.02, now + i * 0.2 + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.2 + 0.05);
      
      osc.start(now + i * 0.2);
      osc.stop(now + i * 0.2 + 0.1);
    }
  };

  const startDancing = () => {
    setIsPlaying(true);
    
    // Start the beat counter
    intervalRef.current = setInterval(() => {
      setCurrentBeat(prev => (prev + 1) % 8);
    }, 200); // 300 BPM (because Trica is FAST)

    // Generate music every 1.6 seconds (one full melody cycle)
    const musicInterval = setInterval(() => {
      if (audioContextRef.current) {
        generateTricaMusic();
      }
    }, 1600);

    // Store music interval for cleanup
    intervalRef.musicInterval = musicInterval;

    // Generate first music immediately
    generateTricaMusic();
  };

  const stopDancing = () => {
    setIsPlaying(false);
    setCurrentBeat(0);
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    if (intervalRef.musicInterval) {
      clearInterval(intervalRef.musicInterval);
      intervalRef.musicInterval = null;
    }
  };

  const changeDanceStyle = () => {
    const styles = ['trica-groove', 'quantum-shuffle', 'mind-destroyer', 'compiler-boogie'];
    const currentIndex = styles.indexOf(danceStyle);
    const nextIndex = (currentIndex + 1) % styles.length;
    setDanceStyle(styles[nextIndex]);
  };

  useEffect(() => {
    return () => {
      stopDancing();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const danceStyleNames = {
    'trica-groove': 'Trica Groove',
    'quantum-shuffle': 'Quantum Shuffle',
    'mind-destroyer': 'Mind Destroyer',
    'compiler-boogie': 'Compiler Boogie'
  };

  return (
    <section id="dancing-characters" className="dancing-characters">
      <div className="dance-stage">
        <div className="stage-lights">
          <div className={`light light-1 ${isPlaying ? 'active' : ''}`}></div>
          <div className={`light light-2 ${isPlaying ? 'active' : ''}`}></div>
          <div className={`light light-3 ${isPlaying ? 'active' : ''}`}></div>
        </div>

        <div className="dancers-container">
          {/* Dancer 1 - The Trica Enthusiast */}
          <div className={`dancer dancer-1 ${danceStyle} ${isPlaying ? 'dancing' : ''}`} data-beat={currentBeat}>
            <div className="dancer-head">
              <div className="face">
                <div className="eye eye-left">👁️</div>
                <div className="eye eye-right">👁️</div>
                <div className="mouth">{isPlaying ? '😄' : '😐'}</div>
              </div>
              <div className="hair"></div>
            </div>
            <div className="dancer-body">
              <div className="shirt">TRICA</div>
              <div className="arm arm-left"></div>
              <div className="arm arm-right"></div>
            </div>
            <div className="dancer-legs">
              <div className="leg leg-left"></div>
              <div className="leg leg-right"></div>
            </div>
            <div className="dance-effects">
              <Sparkles className="effect effect-1" />
              <Zap className="effect effect-2" />
            </div>
          </div>

          {/* Dancer 2 - The Code Compiler */}
          <div className={`dancer dancer-2 ${danceStyle} ${isPlaying ? 'dancing' : ''}`} data-beat={currentBeat}>
            <div className="dancer-head">
              <div className="face">
                <div className="eye eye-left">🤓</div>
                <div className="eye eye-right">🤓</div>
                <div className="mouth">{isPlaying ? '🎵' : '💻'}</div>
              </div>
              <div className="hair programmer-hair"></div>
            </div>
            <div className="dancer-body">
              <div className="shirt">C++</div>
              <div className="arm arm-left"></div>
              <div className="arm arm-right"></div>
            </div>
            <div className="dancer-legs">
              <div className="leg leg-left"></div>
              <div className="leg leg-right"></div>
            </div>
            <div className="dance-effects">
              <div className="code-particle">01</div>
              <div className="code-particle">∞</div>
              <div className="code-particle">{}</div>
            </div>
          </div>
        </div>

        <div className="dance-floor">
          <div className={`floor-tile ${currentBeat % 2 === 0 ? 'lit' : ''}`}></div>
          <div className={`floor-tile ${currentBeat % 2 === 1 ? 'lit' : ''}`}></div>
          <div className={`floor-tile ${currentBeat % 3 === 0 ? 'lit' : ''}`}></div>
          <div className={`floor-tile ${currentBeat % 3 === 1 ? 'lit' : ''}`}></div>
          <div className={`floor-tile ${currentBeat % 3 === 2 ? 'lit' : ''}`}></div>
        </div>
      </div>

      <div className="dance-controls">
        <button 
          className={`dance-btn primary ${isPlaying ? 'stop' : 'play'}`}
          onClick={isPlaying ? stopDancing : startDancing}
        >
          {isPlaying ? (
            <>
              <VolumeX size={20} />
              Stop the Madness
            </>
          ) : (
            <>
              <Music size={20} />
              Start Dancing!
            </>
          )}
        </button>

        <button 
          className="dance-btn secondary"
          onClick={changeDanceStyle}
          disabled={!isPlaying}
        >
          <Sparkles size={16} />
          {danceStyleNames[danceStyle]}
        </button>
      </div>

      <div className="dance-info">
        <h3>🎵 Trica Dance Party! 🎵</h3>
        <p>
          Watch these absolutely <strong>ridiculous</strong> characters dance to 
          procedurally generated Trica music! Each beat is synthesized in real-time 
          using the Web Audio API with frequencies that will <em>destroy your mind</em>!
        </p>
        <div className="beat-counter">
          Beat: <span className="beat-number">{currentBeat + 1}/8</span>
        </div>
      </div>
    </section>
  );
};

export default DancingCharacters;