import React, { useState } from 'react';
import { Download, X, Sparkles } from 'lucide-react';
import './AnnouncementBanner.css';

const AnnouncementBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="announcement-banner">
      <div className="banner-content">
        <div className="banner-icon">
          <Sparkles size={16} />
        </div>
        <div className="banner-text">
          <strong>🔥 LEGENDARY RELEASE:</strong> Trica v1.0.0 with REAL BYTECODE VM! 
          Quantum superposition, time travel, and mind destruction capabilities!
        </div>
        <a 
          href="/installer/TricaSetup-1.0.0.exe" 
          className="banner-cta"
          download
        >
          <Download size={14} />
          Download 1.0.0 (200 KB)
        </a>
        <button 
          className="banner-close"
          onClick={() => setIsVisible(false)}
          aria-label="Close banner"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default AnnouncementBanner;