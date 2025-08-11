
import React, { useState } from 'react';
import { 
  Download as DownloadIcon, 
  Github, 
  Book, 
  Code,
  Terminal,
  Monitor,
  Smartphone
} from 'lucide-react';
import { FaWindows } from 'react-icons/fa';
import './Download.css';

const Download = () => {
  const [selectedPlatform, setSelectedPlatform] = useState('windows');

  const platforms = {
    windows: {
      name: 'Windows',
      icon: <FaWindows size={24} />,
      downloads: [
        {
          name: '🔥 TricaSetup-1.0.0.exe (LEGENDARY BYTECODE VM!) 🔥',
          description: 'NEW! Real bytecode VM execution with quantum superposition, time travel, and mind destruction capabilities',
          size: '200 KB',
          url: '/installer/TricaSetup-1.0.0.exe',
          primary: true,
          features: ['🔥 TRICA BYTECODE VM', '⚛️ Quantum superposition support', '⏰ Time travel capabilities', '🧠 Mind destruction engine', '✅ System PATH integration', '✅ Start Menu shortcuts', '✅ Example programs', '✅ Documentation']
        },
        {
          name: 'TricaSetup-0.1.0.exe (Legacy C Codegen)',
          description: 'Previous version with C code generation (deprecated)',
          size: '74.6 KB',
          url: '/installer/TricaSetup-0.1.0.exe',
          primary: false,
          features: ['⚠️ Legacy C codegen', '✅ Basic functionality', '✅ System integration']
        },
        {
          name: 'Portable Version (Coming Soon)',
          description: 'Single executable file, no installation required',
          size: 'TBD',
          url: '#',
          disabled: true
        }
      ],
      requirements: [
        'Windows 10 or later (64-bit recommended)',
        'Administrator privileges for installation',
        '10 MB free disk space',
        'Modern CPU (any x64 processor)'
      ],
      installation: [
        '🔥 Download TricaSetup-1.0.0.exe (LEGENDARY BYTECODE VM)',
        'Run the installer (may require admin rights)',
        'Select components (Bytecode VM Core required, Examples recommended)',
        'Complete installation and experience MIND DESTRUCTION',
        'Type "trica yourfile.trica" to execute bytecode',
        '🧠 Watch your mind get DESTROYED by quantum execution!'
      ]
    },
    linux: {
      name: 'Linux',
      icon: <Monitor size={24} />,
      downloads: [
        {
          name: 'AppImage (Universal)',
          description: 'Works on all Linux distributions',
          size: '1.8 MB',
          url: '#',
          primary: true
        },
        {
          name: 'Debian Package (.deb)',
          description: 'For Ubuntu, Debian, and derivatives',
          size: '1.2 MB',
          url: '#'
        },
        {
          name: 'RPM Package',
          description: 'For Red Hat, Fedora, and derivatives',
          size: '1.2 MB',
          url: '#'
        }
      ],
      requirements: [
        'Linux kernel 3.2 or later',
        'GCC 7.0 or later',
        'glibc 2.17 or later'
      ],
      installation: [
        'Download the AppImage',
        'Make it executable: chmod +x trica.AppImage',
        'Run: ./trica.AppImage',
        'Or install system-wide package'
      ]
    },
    macos: {
      name: 'macOS',
      icon: <Smartphone size={24} />,
      downloads: [
        {
          name: 'macOS Installer',
          description: 'Universal binary for Intel and Apple Silicon',
          size: '1.9 MB',
          url: '#',
          primary: true
        },
        {
          name: 'Homebrew Formula',
          description: 'Install via Homebrew package manager',
          size: 'Variable',
          url: '#'
        }
      ],
      requirements: [
        'macOS 10.15 (Catalina) or later',
        'Xcode Command Line Tools',
        '100 MB free disk space'
      ],
      installation: [
        'Download the installer',
        'Open the .dmg file',
        'Drag Trica to Applications',
        'Or use: brew install trica'
      ]
    }
  };

  const quickStart = [
    {
      step: 1,
      title: 'Create your first program',
      code: `// hello.trica
include <stdio.h>

Main {
    Print "Hello, Trica!"
}`
    },
    {
      step: 2,
      title: 'Compile to ultra-fast C',
      code: `trica hello.trica
# Generates hello.c`
    },
    {
      step: 3,
      title: 'Compile to native executable',
      code: `gcc -O3 -march=native hello.c -o hello
./hello`
    }
  ];

  return (
    <section id="download" className="download">
      <div className="container">
        <div className="download-header">
          <div className="section-badge">
            <DownloadIcon size={16} />
            <span>Download</span>
          </div>
          
          <h2 className="section-title">
            Get <span className="text-gradient">Trica</span> Now
          </h2>
          
          <p className="section-description">
            Download the mind-bending programming language that will physically destroy your 
            understanding of computational complexity. Available for all major platforms.
          </p>
        </div>

        <div className="platform-selector">
          {Object.entries(platforms).map(([key, platform]) => (
            <button
              key={key}
              className={`platform-btn ${selectedPlatform === key ? 'active' : ''}`}
              onClick={() => setSelectedPlatform(key)}
            >
              {platform.icon}
              {platform.name}
            </button>
          ))}
        </div>

        <div className="download-content">
          <div className="download-main">
            <div className="downloads-section">
              <h3 className="downloads-title">
                Downloads for {platforms[selectedPlatform].name}
              </h3>
              
              <div className="downloads-list">
                {platforms[selectedPlatform].downloads.map((download, index) => (
                  <div 
                    key={index} 
                    className={`download-item ${download.primary ? 'primary' : ''} ${download.disabled ? 'disabled' : ''}`}
                  >
                    <div className="download-info">
                      <h4 className="download-name">{download.name}</h4>
                      <p className="download-description">{download.description}</p>
                      <span className="download-size">{download.size}</span>
                      {download.features && (
                        <div className="download-features">
                          {download.features.map((feature, idx) => (
                            <span key={idx} className="feature-tag">{feature}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    {download.disabled ? (
                      <button className="btn btn-disabled" disabled>
                        Coming Soon
                      </button>
                    ) : (
                      <a 
                        href={download.url} 
                        className={`btn ${download.primary ? 'btn-primary' : 'btn-secondary'}`}
                        download
                      >
                        <DownloadIcon size={16} />
                        Download
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="requirements-section">
              <h4>System Requirements</h4>
              <ul className="requirements-list">
                {platforms[selectedPlatform].requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>

            <div className="installation-section">
              <h4>Installation Steps</h4>
              <ol className="installation-steps">
                {platforms[selectedPlatform].installation.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </div>
          </div>

          <div className="download-sidebar">
            <div className="quick-links">
              <h4>Quick Links</h4>
              <a href="https://github.com/trica-lang/trica" className="quick-link">
                <Github size={16} />
                Source Code
              </a>
              <a href="/docs" className="quick-link">
                <Book size={16} />
                Documentation
              </a>
              <a href="#examples" className="quick-link">
                <Code size={16} />
                Examples
              </a>
            </div>

            <div className="version-info">
              <h4>Latest Version</h4>
              <div className="version-badge">
                <span className="version-number">v0.1.0</span>
                <span className="version-label">Alpha - Mind Destruction Release</span>
              </div>
              <p className="version-notes">
                Professional installer with REPL, compiler, examples, and complete system integration. 
                Prepare to have your mind destroyed by infinite complexity hidden in simple syntax.
              </p>
              <div className="release-highlights">
                <h5>🚀 Release Highlights:</h5>
                <ul>
                  <li>✅ Ultra-fast execution (&lt;1μs)</li>
                  <li>✅ Professional NSIS installer</li>
                  <li>✅ Interactive REPL with help system</li>
                  <li>✅ Quantum compilation features</li>
                  <li>✅ Mind-bending example programs</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="quick-start">
          <h3 className="quick-start-title">
            Quick Start Guide
          </h3>
          <p className="quick-start-description">
            Get up and running with Trica in under 60 seconds
          </p>

          <div className="quick-start-steps">
            {quickStart.map((item, index) => (
              <div key={index} className="quick-start-step">
                <div className="step-number">{item.step}</div>
                <div className="step-content">
                  <h4 className="step-title">{item.title}</h4>
                  <div className="step-code">
                    <pre><code>{item.code}</code></pre>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="download-footer">
          <div className="footer-stats">
            <div className="stat">
              <div className="stat-number text-gradient">10K+</div>
              <div className="stat-label">Downloads</div>
            </div>
            <div className="stat">
              <div className="stat-number text-gradient-secondary">500+</div>
              <div className="stat-label">GitHub Stars</div>
            </div>
            <div className="stat">
              <div className="stat-number text-gradient-accent">50+</div>
              <div className="stat-label">Contributors</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Download;







