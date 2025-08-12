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
          <strong>🔥 LEGENDARY RELEASE:</strong> Trica v1.1.7 with TPKG Package Manager! 
          Real bytecode VM, quantum arithmetic, and Supabase-powered packages!
        </div>
        <a 
          href="/installer/TricaSetup-1.1.7.exe" 
          className="banner-cta"
          download
        >
          <Download size={14} />
          Download 1.1.7 (1.2 MB)
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