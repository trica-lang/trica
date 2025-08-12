import React, { useState, useEffect } from 'react';
import { Download, ArrowRight, Sparkles, Zap, Brain, Infinity, Volume2, VolumeX } from 'lucide-react';
import MatrixRain from './MatrixRain.jsx';
import SoundEffects from './SoundEffects.jsx';
import './AnimatedLanding.css';

const AnimatedLanding = ({ onEnter }) => {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [showText, setShowText] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const [particles, setParticles] = useState([]);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Animation phases
  const phases = [
    'initializing',
    'quantum-loading',
    'mind-bending',
    'reality-distortion',
    'complete'
  ];

  // Generate particles
  useEffect(() => {
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      speed: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.8 + 0.2,
      color: ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b'][Math.floor(Math.random() * 4)]
    }));
    setParticles(newParticles);
  }, []);

  // Animation sequence
  useEffect(() => {
    const timers = [
      setTimeout(() => setCurrentPhase(1), 1000),
      setTimeout(() => setCurrentPhase(2), 2500),
      setTimeout(() => setCurrentPhase(3), 4000),
      setTimeout(() => {
        setCurrentPhase(4);
        setShowText(true);
      }, 5500),
      setTimeout(() => setShowButtons(true), 6500)
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  const glitchTexts = [
    "INITIALIZING QUANTUM COMPILER...",
    "LOADING INFINITE COMPLEXITY...",
    "BENDING REALITY MATRICES...",
    "DESTROYING CONVENTIONAL LOGIC...",
    "TRICA READY TO DESTROY YOUR MIND"
  ];

  return (
    <div className={`animated-landing ${phases[currentPhase]}`}>
      <SoundEffects phase={currentPhase} enabled={soundEnabled} />
      
      {/* Animated Background */}
      <div className="landing-background">
        <MatrixRain opacity={currentPhase >= 2 ? 0.3 : 0.1} />
        <div className="quantum-grid"></div>
        <div className="energy-waves"></div>
        
        {/* Floating Particles */}
        {particles.map(particle => (
          <div
            key={particle.id}
            className="floating-particle"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              backgroundColor: particle.color,
              opacity: particle.opacity,
              animationDuration: `${particle.speed}s`
            }}
          />
        ))}
      </div>

      {/* Central Logo Animation */}
      <div className="landing-center">
        <div className="logo-container">
          <div className="logo-ring outer-ring"></div>
          <div className="logo-ring middle-ring"></div>
          <div className="logo-ring inner-ring"></div>
          
          <div className="central-logo">
            <div className="logo-symbol">
              <div className="t-shape">
                <div className="t-horizontal"></div>
                <div className="t-vertical"></div>
              </div>
              <div className="logo-glow"></div>
            </div>
          </div>

          {/* Orbiting Icons */}
          <div className="orbiting-icons">
            <div className="orbit-icon icon-1"><Brain size={20} /></div>
            <div className="orbit-icon icon-2"><Zap size={20} /></div>
            <div className="orbit-icon icon-3"><Infinity size={20} /></div>
            <div className="orbit-icon icon-4"><Sparkles size={20} /></div>
          </div>
        </div>

        {/* Glitch Text */}
        <div className="glitch-container">
          <div className="glitch-text" data-text={glitchTexts[currentPhase]}>
            {glitchTexts[currentPhase]}
          </div>
        </div>

        {/* Main Content */}
        {showText && (
          <div className="landing-content">
            <h1 className="landing-title">
              <span className="title-line">Welcome to</span>
              <span className="title-main">TRICA</span>
              <span className="title-subtitle">Ultra-Fast Mind-Bending Programming Language</span>
            </h1>

            <div className="landing-features">
              <div className="feature-item" data-phase="0">
                <Zap className="feature-icon" />
                <span>Execution Time: &lt;1μs</span>
              </div>
              <div className="feature-item" data-phase="1">
                <Brain className="feature-icon" />
                <span>Infinite Complexity Hidden</span>
              </div>
              <div className="feature-item" data-phase="2">
                <Infinity className="feature-icon" />
                <span>Mind Destruction: Guaranteed</span>
              </div>
            </div>

            <p className="landing-description">
              Prepare to have your understanding of programming languages 
              <strong> physically destroyed</strong> by deceptively simple syntax 
              hiding <em>infinite algorithmic complexity</em>.
            </p>
          </div>
        )}

        {/* Action Buttons */}
        {showButtons && (
          <div className="landing-actions">
            <a 
              href="/installer/TricaSetup-1.1.7.exe"
              className="landing-btn primary-btn"
              download
            >
              <Download size={20} />
              <span>Download Installer</span>
              <div className="btn-glow"></div>
            </a>
            
            <button 
              className="landing-btn secondary-btn"
              onClick={onEnter}
            >
              <span>Enter Website</span>
              <ArrowRight size={20} />
              <div className="btn-glow"></div>
            </button>
          </div>
        )}

        {/* Control Buttons */}
        <div className="control-buttons">
          <button 
            className="control-btn"
            onClick={() => setSoundEnabled(!soundEnabled)}
            title={soundEnabled ? "Disable Sound" : "Enable Sound"}
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>
          <button className="skip-btn" onClick={onEnter}>
            Skip Animation
          </button>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="progress-container">
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${(currentPhase / 4) * 100}%` }}
          ></div>
        </div>
        <div className="progress-text">
          Phase {currentPhase + 1}/5: {phases[currentPhase].replace('-', ' ').toUpperCase()}
        </div>
      </div>

      {/* Corner Effects */}
      <div className="corner-effects">
        <div className="corner-effect top-left"></div>
        <div className="corner-effect top-right"></div>
        <div className="corner-effect bottom-left"></div>
        <div className="corner-effect bottom-right"></div>
      </div>
    </div>
  );
};

export default AnimatedLanding;