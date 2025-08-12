import React, { useState, useEffect } from 'react';
import { Download as DownloadIcon, Github, Play, Zap, Cpu, Brain } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './Hero.css';

const Hero = () => {
  const [currentExample, setCurrentExample] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  const codeExamples = [
    {
      title: "Hello World - Deceptively Simple",
      code: `include <stdio.h>

Main {
    Print "Hello, World!"
    Print "This simple syntax hides infinite complexity..."
}`,
      description: "What looks like basic syntax compiles to LEGENDARY bytecode executed by the Trica VM!"
    },
    {
      title: "Mind-Bending Property Access",
      code: `Main {
    Print "First message"
    lastOutput = Print.output
    Print "You said: " + lastOutput
    
    // This simple line triggers quantum-level optimizations
}`,
      description: "Print.output accesses the last printed string - but the implementation will destroy your mind."
    },
    {
      title: "String Concatenation Madness",
      code: `Main {
    greeting = "Hello" + " " + "World"
    message = "Trica is " + "ultra-fast"
    
    Print greeting + " - " + message
    // Each + operator hides algorithmic complexity beyond comprehension
}`,
      description: "Simple concatenation that compiles to quantum-entangled bytecode instructions!"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTyping(true);
      setTimeout(() => {
        setCurrentExample((prev) => (prev + 1) % codeExamples.length);
        setIsTyping(false);
      }, 300);
    }, 4000);

    return () => clearInterval(interval);
  }, [codeExamples.length]);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="hero">
      <div className="hero-bg">
        <div className="hero-particles"></div>
      </div>
      
      <div className="container">
        <div className="hero-content">
          <div className="hero-text">
            <div className="hero-badge">
              <Zap size={16} />
              <span>Ultra-Fast Compilation</span>
            </div>
            
            <h1 className="hero-title">
              <span className="text-gradient">Trica</span>
              <br />
              <span className="glitch" data-text="Mind-Bending">
                Mind-Bending
              </span>
              <br />
              Programming Language
            </h1>
            
            <p className="hero-description">
              Experience the programming language that will <strong>physically destroy your mind</strong> with its 
              deceptively simple syntax hiding <em>infinite algorithmic complexity</em>. 
              <strong>NEW in 1.1.7:</strong> TPKG Package Manager with Supabase integration!
            </p>

            <div className="hero-stats">
              <div className="stat">
                <div className="stat-number text-gradient">
                  <Brain size={20} /> 8
                </div>
                <div className="stat-label">Complexity Hidden</div>
              </div>
              <div className="stat">
                <div className="stat-number text-gradient-secondary">
                  <Zap size={20} /> &lt;1�s
                </div>
                <div className="stat-label">Execution Time</div>
              </div>
              <div className="stat">
                <div className="stat-number text-gradient-accent">
                  100%
                </div>
                <div className="stat-label">Mind Destruction</div>
              </div>
            </div>

            <div className="hero-actions">
              <a 
                href="/installer/TricaSetup-1.1.7.exe"
                className="btn btn-primary"
                download
              >
                <DownloadIcon size={18} />
                Download 1.1.7 + TPKG (1.2 MB)
              </a>
              <button 
                className="btn btn-secondary"
                onClick={() => scrollToSection('download')}
              >
                <DownloadIcon size={18} />
                More Downloads
              </button>
              <button 
                className="btn btn-ghost"
                onClick={() => scrollToSection('examples')}
              >
                <Play size={18} />
                See Examples
              </button>
            </div>
          </div>

          <div className="hero-code">
            <div className={`code-demo ${isTyping ? 'typing' : ''}`}>
              <div className="code-header">
                <div className="code-title">
                  {codeExamples[currentExample].title}
                </div>
                <div className="code-dots">
                  <div className="code-dot red"></div>
                  <div className="code-dot yellow"></div>
                  <div className="code-dot green"></div>
                </div>
              </div>
              
              <div className="code-content">
                <SyntaxHighlighter
                  language="javascript"
                  style={vscDarkPlus}
                  customStyle={{
                    background: 'transparent',
                    padding: 0,
                    margin: 0,
                    fontSize: '14px',
                    fontFamily: 'JetBrains Mono, monospace'
                  }}
                >
                  {codeExamples[currentExample].code}
                </SyntaxHighlighter>
              </div>
              
              <div className="code-description">
                {codeExamples[currentExample].description}
              </div>
            </div>

            <div className="code-indicators">
              {codeExamples.map((_, index) => (
                <button
                  key={index}
                  className={`indicator ${index === currentExample ? 'active' : ''}`}
                  onClick={() => setCurrentExample(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="hero-scroll-indicator">
        <div className="scroll-arrow animate-pulse">
          <span>Scroll to discover the madness</span>
          <div className="arrow-down"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
