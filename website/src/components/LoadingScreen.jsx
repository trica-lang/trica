import React, { useState, useEffect } from 'react';
import './LoadingScreen.css';

const LoadingScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState('initializing');

  const stages = [
    { key: 'initializing', text: 'Initializing Trica Engine...', duration: 800 },
    { key: 'compiling', text: 'Compiling Mind-Bending Algorithms...', duration: 1000 },
    { key: 'optimizing', text: 'Optimizing Ultra-Fast Execution...', duration: 600 },
    { key: 'loading', text: 'Loading Infinite Complexity...', duration: 400 },
    { key: 'complete', text: 'Ready to Destroy Your Mind!', duration: 300 }
  ];

  useEffect(() => {
    let currentStageIndex = 0;
    let currentProgress = 0;

    const updateProgress = () => {
      if (currentStageIndex >= stages.length) {
        setTimeout(() => onComplete(), 500);
        return;
      }

      const currentStage = stages[currentStageIndex];
      setStage(currentStage.key);

      const increment = 100 / stages.length;
      const targetProgress = (currentStageIndex + 1) * increment;

      const progressInterval = setInterval(() => {
        currentProgress += 2;
        setProgress(Math.min(currentProgress, targetProgress));

        if (currentProgress >= targetProgress) {
          clearInterval(progressInterval);
          setTimeout(() => {
            currentStageIndex++;
            updateProgress();
          }, 200);
        }
      }, currentStage.duration / 50);
    };

    updateProgress();
  }, [onComplete]);

  return (
    <div className="loading-screen">
      <div className="loading-content">
        <div className="loading-logo">
          <div className="logo-t">T</div>
          <div className="logo-particles">
            {[...Array(12)].map((_, i) => (
              <div key={i} className={`particle particle-${i}`}></div>
            ))}
          </div>
        </div>
        
        <h1 className="loading-title">
          <span className="glitch" data-text="TRICA">TRICA</span>
        </h1>
        
        <div className="loading-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="progress-text">{Math.round(progress)}%</div>
        </div>
        
        <div className="loading-stage">
          {stages.find(s => s.key === stage)?.text}
        </div>
        
        <div className="loading-stats">
          <div className="stat">
            <span className="stat-value">∞</span>
            <span className="stat-label">Complexity</span>
          </div>
          <div className="stat">
            <span className="stat-value">&lt;1μs</span>
            <span className="stat-label">Execution</span>
          </div>
          <div className="stat">
            <span className="stat-value">100%</span>
            <span className="stat-label">Mind-Bending</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;