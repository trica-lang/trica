import React, { useState, useEffect, useRef } from 'react';
import { Play, Square, RotateCcw, Download, Copy, Sparkles, Zap, Brain } from 'lucide-react';
import './TryOnline.css';

const TryOnline = () => {
  const [code, setCode] = useState(`// Welcome to Trica Online REPL!
// Prepare to have your mind DESTROYED! 🧠💥

Main {
    Print "Hello, Universe!"
    
    // Quantum loop that defies logic
    For i = 1 To ∞ {
        If (i % 2 == 0) {
            Print "Even: " + i
        } Else {
            Print "Odd: " + i
        }
        
        // Break at 10 to preserve sanity
        If (i >= 10) Break
    }
    
    // Mind-bending recursion
    Function Fibonacci(n) {
        Return (n <= 1) ? n : Fibonacci(n-1) + Fibonacci(n-2)
    }
    
    Print "Fibonacci(10) = " + Fibonacci(10)
    
    // Quantum superposition variable
    Var quantum = "alive" && "dead"
    Print "Schrödinger's variable: " + quantum
}`);

  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [executionTime, setExecutionTime] = useState(0);
  const outputRef = useRef(null);

  const examples = [
    {
      name: "Hello Universe",
      code: `Main {
    Print "Hello, Universe!"
    Print "Mind = DESTROYED 🧠💥"
}`
    },
    {
      name: "Quantum Loop",
      code: `Main {
    For i = 1 To 10 {
        Print "Iteration " + i + ": Reality bending..."
    }
    Print "Loop completed in <1μs!"
}`
    },
    {
      name: "Fibonacci Madness",
      code: `Function Fibonacci(n) {
    Return (n <= 1) ? n : Fibonacci(n-1) + Fibonacci(n-2)
}

Main {
    For i = 1 To 15 {
        Print "Fib(" + i + ") = " + Fibonacci(i)
    }
}`
    },
    {
      name: "Mind Destroyer",
      code: `Main {
    Var complexity = ∞
    Var simplicity = 1
    
    Print "Trica Paradox:"
    Print "Complexity: " + complexity
    Print "Syntax Simplicity: " + simplicity
    Print "Mind Status: DESTROYED"
    
    // This should be impossible but works
    While (true == false) {
        Print "Impossible loop executed!"
        Break // Escape the paradox
    }
}`
    }
  ];

  const runCode = async () => {
    setIsRunning(true);
    setOutput('');
    const startTime = performance.now();
    
    // Simulate compilation and execution
    const compilationSteps = [
      "🔄 Initializing Trica compiler...",
      "⚡ Parsing quantum syntax...",
      "🧠 Optimizing mind-bending logic...",
      "🚀 Generating ultra-fast C code...",
      "💥 Executing with <1μs precision..."
    ];

    for (let i = 0; i < compilationSteps.length; i++) {
      setOutput(prev => prev + compilationSteps[i] + '\n');
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    setOutput(prev => prev + '\n📤 OUTPUT:\n' + '='.repeat(40) + '\n');
    
    // Simulate actual code execution
    const lines = code.split('\n').filter(line => line.trim() && !line.trim().startsWith('//'));
    
    for (const line of lines) {
      if (line.includes('Print')) {
        const match = line.match(/Print\s+"([^"]+)"/);
        if (match) {
          setOutput(prev => prev + match[1] + '\n');
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      } else if (line.includes('For')) {
        const match = line.match(/For\s+\w+\s*=\s*(\d+)\s+To\s+(\d+)/);
        if (match) {
          const start = parseInt(match[1]);
          const end = Math.min(parseInt(match[2]), 20); // Limit for demo
          for (let i = start; i <= end; i++) {
            if (code.includes('Iteration')) {
              setOutput(prev => prev + `Iteration ${i}: Reality bending...\n`);
            } else if (code.includes('Even') || code.includes('Odd')) {
              const type = i % 2 === 0 ? 'Even' : 'Odd';
              setOutput(prev => prev + `${type}: ${i}\n`);
            } else if (code.includes('Fib')) {
              const fib = fibonacci(i);
              setOutput(prev => prev + `Fib(${i}) = ${fib}\n`);
            }
            await new Promise(resolve => setTimeout(resolve, 50));
          }
        }
      } else if (line.includes('Fibonacci(10)')) {
        setOutput(prev => prev + `Fibonacci(10) = ${fibonacci(10)}\n`);
        await new Promise(resolve => setTimeout(resolve, 100));
      } else if (line.includes('quantum')) {
        setOutput(prev => prev + "Schrödinger's variable: [SUPERPOSITION STATE]\n");
        await new Promise(resolve => setTimeout(resolve, 100));
      } else if (line.includes('complexity')) {
        setOutput(prev => prev + "Trica Paradox:\n");
        setOutput(prev => prev + "Complexity: ∞\n");
        setOutput(prev => prev + "Syntax Simplicity: 1\n");
        setOutput(prev => prev + "Mind Status: DESTROYED\n");
        await new Promise(resolve => setTimeout(resolve, 200));
      } else if (line.includes('Impossible loop')) {
        setOutput(prev => prev + "Impossible loop executed!\n");
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    const endTime = performance.now();
    const execTime = (endTime - startTime) / 1000;
    setExecutionTime(execTime);
    
    setOutput(prev => prev + '\n' + '='.repeat(40) + '\n');
    setOutput(prev => prev + `✅ Execution completed in ${execTime.toFixed(3)}s\n`);
    setOutput(prev => prev + `🚀 Trica performance: MIND-BENDINGLY FAST!\n`);
    setOutput(prev => prev + `🧠 Your mind has been successfully DESTROYED!\n`);
    
    setIsRunning(false);
  };

  const fibonacci = (n) => {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
  };

  const clearOutput = () => {
    setOutput('');
    setExecutionTime(0);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
  };

  const loadExample = (example) => {
    setCode(example.code);
    clearOutput();
  };

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  return (
    <section id="try-online" className="try-online">
      <div className="container">
        <div className="try-online-header">
          <div className="section-badge">
            <Play size={16} />
            <span>Try Online</span>
          </div>
          
          <h2 className="section-title">
            Experience <span className="text-gradient">Trica</span> Live
          </h2>
          
          <p className="section-description">
            Run Trica code directly in your browser and watch your mind get 
            <strong> physically destroyed</strong> by the infinite complexity 
            hidden behind simple syntax.
          </p>
        </div>

        <div className="repl-container">
          <div className="repl-sidebar">
            <h3 className="examples-title">
              <Sparkles size={16} />
              Mind-Bending Examples
            </h3>
            
            <div className="examples-list">
              {examples.map((example, index) => (
                <button
                  key={index}
                  className="example-btn"
                  onClick={() => loadExample(example)}
                >
                  <Zap size={14} />
                  {example.name}
                </button>
              ))}
            </div>

            <div className="repl-stats">
              <h4>Performance Stats</h4>
              <div className="stat-item">
                <span className="stat-label">Execution Time:</span>
                <span className="stat-value">{executionTime.toFixed(3)}s</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Mind Destruction:</span>
                <span className="stat-value text-gradient">100%</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Complexity Hidden:</span>
                <span className="stat-value">∞</span>
              </div>
            </div>
          </div>

          <div className="repl-main">
            <div className="code-editor">
              <div className="editor-header">
                <div className="editor-title">
                  <Brain size={16} />
                  Trica Code Editor
                </div>
                <div className="editor-actions">
                  <button className="editor-btn" onClick={copyCode} title="Copy Code">
                    <Copy size={14} />
                  </button>
                  <button className="editor-btn" onClick={() => setCode('')} title="Clear">
                    <RotateCcw size={14} />
                  </button>
                </div>
              </div>
              
              <textarea
                className="code-input"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Write your mind-bending Trica code here..."
                spellCheck={false}
              />
            </div>

            <div className="output-panel">
              <div className="output-header">
                <div className="output-title">
                  <Zap size={16} />
                  Execution Output
                </div>
                <div className="output-actions">
                  <button className="output-btn" onClick={clearOutput} title="Clear Output">
                    <RotateCcw size={14} />
                  </button>
                </div>
              </div>
              
              <div 
                ref={outputRef}
                className="output-content"
              >
                {output ? (
                  <pre>{output}</pre>
                ) : (
                  <div className="output-placeholder">
                    <Brain size={24} />
                    <p>Click "Run Code" to execute your Trica program</p>
                    <p>Prepare for mind destruction! 🧠💥</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="repl-controls">
          <button 
            className={`btn btn-primary ${isRunning ? 'running' : ''}`}
            onClick={runCode}
            disabled={isRunning}
          >
            {isRunning ? (
              <>
                <Square size={18} />
                Executing...
              </>
            ) : (
              <>
                <Play size={18} />
                Run Code
              </>
            )}
          </button>
          
          <button className="btn btn-secondary" onClick={clearOutput}>
            <RotateCcw size={18} />
            Clear Output
          </button>
          
          <a 
            href="/installer/TricaSetup-0.1.0.exe"
            className="btn btn-ghost"
            download
          >
            <Download size={18} />
            Download Full Version
          </a>
        </div>

        <div className="repl-footer">
          <div className="footer-note">
            <p>
              <strong>Note:</strong> This is a simulated Trica environment for demonstration. 
              The actual Trica compiler generates ultra-optimized C code with &lt;1μs execution time.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TryOnline;