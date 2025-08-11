
import React from 'react';
import { 
  Zap, 
  Cpu, 
  Code, 
  Layers, 
  TrendingUp,
  Shield,
  Target,
  Brain
} from 'lucide-react';
import './Features.css';

const Features = () => {
  const features = [
    {
      icon: <Brain size={32} />,
      title: "Mind-Bending Complexity",
      description: "Simple syntax that hides algorithmic complexity beyond human comprehension. Each line triggers quantum-level optimizations.",
      gradient: "gradient-primary"
    },
    {
      icon: <Zap size={32} />,
      title: "Sub-Microsecond Execution",
      description: "Compiles to ultra-optimized C code with zero-copy operations, SIMD instructions, and cache-friendly memory layouts.",
      gradient: "gradient-secondary"
    },
    {
      icon: <Cpu size={32} />,
      title: "Ultra-Fast Compilation",
      description: "Advanced lexer, parser, and code generator built in Rust. Compiles entire programs faster than you can blink.",
      gradient: "gradient-accent"
    },
    {
      icon: <Code size={32} />,
      title: "Deceptively Simple Syntax",
      description: "Clean, readable code that looks innocent but contains layers upon layers of hidden optimization magic.",
      gradient: "gradient-primary"
    },
    {
      icon: <Layers size={32} />,
      title: "Multi-Layer Architecture",
      description: "Sophisticated type system, advanced AST transformations, and intelligent code generation pipelines.",
      gradient: "gradient-secondary"
    },
    {
      icon: <TrendingUp size={32} />,
      title: "Performance Obsessed",
      description: "Every operation optimized for maximum throughput. Memory allocations, string operations, and I/O are all lightning-fast.",
      gradient: "gradient-accent"
    },
    {
      icon: <Shield size={32} />,
      title: "Memory Safe",
      description: "Built-in memory management with automatic cleanup. No memory leaks, no buffer overflows, just pure performance.",
      gradient: "gradient-primary"
    },
    {
      icon: <Target size={32} />,
      title: "Precision Engineered",
      description: "Every byte of generated code is crafted for maximum efficiency. No bloat, no waste, just pure computational power.",
      gradient: "gradient-secondary"
    }
  ];

  return (
    <section id="features" className="features">
      <div className="container">
        <div className="features-header">
          <div className="section-badge">
            <Brain size={16} />
            <span>Core Features</span>
          </div>
          
          <h2 className="section-title">
            Why Trica Will <span className="text-gradient">Destroy Your Mind</span>
          </h2>
          
          <p className="section-description">
            Beneath its innocent syntax lies a computational engine of unprecedented complexity. 
            Prepare to have your understanding of programming languages completely shattered.
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="feature-card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`feature-icon ${feature.gradient}`}>
                {feature.icon}
              </div>
              
              <h3 className="feature-title">{feature.title}</h3>
              
              <p className="feature-description">{feature.description}</p>
              
              <div className="feature-glow"></div>
            </div>
          ))}
        </div>

        <div className="features-showcase">
          <div className="showcase-item">
            <div className="showcase-number text-gradient">01</div>
            <div className="showcase-content">
              <h3>Lexical Analysis</h3>
              <p>Advanced tokenization with lookahead optimization and context-aware parsing</p>
            </div>
          </div>
          
          <div className="showcase-item">
            <div className="showcase-number text-gradient-secondary">02</div>
            <div className="showcase-content">
              <h3>Syntax Parsing</h3>
              <p>Recursive descent parser with error recovery and semantic analysis</p>
            </div>
          </div>
          
          <div className="showcase-item">
            <div className="showcase-number text-gradient-accent">03</div>
            <div className="showcase-content">
              <h3>Code Generation</h3>
              <p>Ultra-optimized C output with inline functions and memory optimization</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;







