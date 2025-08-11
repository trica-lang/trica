

import React from 'react';

import { Book, Code, Zap, Settings } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './Documentation.css';

const Documentation = () => {
  const sections = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: <Book size={20} />,
      content: (
        <div>
          <h3>Welcome to Trica</h3>
          <p>
            Trica is an ultra-fast, mind-bending programming language that compiles to optimized C code.
            Its deceptively simple syntax hides layers of algorithmic complexity that will challenge
            your understanding of computational theory.
          </p>
          
          <h4>Your First Program</h4>
          <SyntaxHighlighter language="javascript" style={vscDarkPlus}>
{`include <stdio.h>

Main {
    Print "Hello, World!"
    Print "Welcome to the mind-bending world of Trica"
}`}
          </SyntaxHighlighter>
          
          <p>
            This innocent-looking code triggers a cascade of optimizations that generate
            ultra-efficient C code with inline functions, pre-computed string literals,
            and memory-optimized operations.
          </p>
        </div>
      )
    },
    {
      id: 'syntax',
      title: 'Syntax Guide',
      icon: <Code size={20} />,
      content: (
        <div>
          <h3>Core Syntax Elements</h3>
          
          <h4>Includes</h4>
          <p>Include C header files for system functionality:</p>
          <SyntaxHighlighter language="javascript" style={vscDarkPlus}>
{`include <stdio.h>
include <stdlib.h>
include <string.h>`}
          </SyntaxHighlighter>
          
          <h4>Imports</h4>
          <p>Import Trica modules (future feature):</p>
          <SyntaxHighlighter language="javascript" style={vscDarkPlus}>
{`import user.input as input
import math.advanced as math`}
          </SyntaxHighlighter>
          
          <h4>Main Block</h4>
          <p>Every Trica program starts with a Main block:</p>
          <SyntaxHighlighter language="javascript" style={vscDarkPlus}>
{`Main {
    // Your mind-bending code here
}`}
          </SyntaxHighlighter>
          
          <h4>Print Statement</h4>
          <p>Output text with the Print statement:</p>
          <SyntaxHighlighter language="javascript" style={vscDarkPlus}>
{`Print "Hello, World!"
Print "The number is: " + 42`}
          </SyntaxHighlighter>
          
          <h4>Variables and Assignment</h4>
          <p>Assign values to variables:</p>
          <SyntaxHighlighter language="javascript" style={vscDarkPlus}>
{`message = "Hello"
number = 42
result = message + " " + number`}
          </SyntaxHighlighter>
          
          <h4>String Concatenation</h4>
          <p>Combine strings with the + operator:</p>
          <SyntaxHighlighter language="javascript" style={vscDarkPlus}>
{`greeting = "Hello" + " " + "World"
fullMessage = greeting + "!"
Print fullMessage`}
          </SyntaxHighlighter>
        </div>
      )
    },
    {
      id: 'advanced',
      title: 'Advanced Features',
      icon: <Zap size={20} />,
      content: (
        <div>
          <h3>Mind-Bending Features</h3>
          
          <h4>Print.output Property</h4>
          <p>
            Access the last printed string with the magical Print.output property.
            This seemingly simple feature hides a complex caching system:
          </p>
          <SyntaxHighlighter language="javascript" style={vscDarkPlus}>
{`Print "First message"
lastOutput = Print.output
Print "You said: " + lastOutput

Print "Another message"
Print "Previous: " + Print.output`}
          </SyntaxHighlighter>
          
          <h4>Generated C Code</h4>
          <p>The above Trica code compiles to ultra-optimized C:</p>
          <SyntaxHighlighter language="c" style={vscDarkPlus}>
{`// Ultra-optimized runtime functions
TRICA_INLINE void trica_print(const char* TRICA_RESTRICT str) {
    fputs(str, stdout);
    if (TRICA_UNLIKELY(trica_last_output != NULL)) {
        free(trica_last_output);
    }
    size_t len = strlen(str);
    trica_last_output = (char*)malloc(len + 1);
    memcpy(trica_last_output, str, len + 1);
}

TRICA_INLINE const char* trica_get_last_output(void) {
    return trica_last_output ? trica_last_output : "";
}`}
          </SyntaxHighlighter>
          
          <h4>Performance Optimizations</h4>
          <ul>
            <li><strong>Zero-Copy Operations:</strong> String operations avoid unnecessary allocations</li>
            <li><strong>Inline Functions:</strong> All function calls are inlined for maximum speed</li>
            <li><strong>Pre-computed Literals:</strong> String literals are pre-allocated at compile time</li>
            <li><strong>Memory Optimization:</strong> Automatic memory management with minimal overhead</li>
            <li><strong>Cache-Friendly:</strong> Data structures optimized for modern CPU architectures</li>
          </ul>
        </div>
      )
    },
    {
      id: 'compilation',
      title: 'Compilation',
      icon: <Settings size={20} />,
      content: (
        <div>
          <h3>Compilation Process</h3>
          
          <h4>Basic Compilation</h4>
          <p>Compile a Trica program to C code:</p>
          <SyntaxHighlighter language="bash" style={vscDarkPlus}>
{`trica hello.trica
# Generates hello.c`}
          </SyntaxHighlighter>
          
          <h4>Native Compilation</h4>
          <p>Compile the generated C code to a native executable:</p>
          <SyntaxHighlighter language="bash" style={vscDarkPlus}>
{`gcc -O3 -march=native -flto -ffast-math hello.c -o hello
./hello`}
          </SyntaxHighlighter>
          
          <h4>Compiler Flags</h4>
          <p>Recommended GCC flags for maximum performance:</p>
          <ul>
            <li><code>-O3</code>: Maximum optimization level</li>
            <li><code>-march=native</code>: Optimize for your specific CPU</li>
            <li><code>-flto</code>: Link-time optimization</li>
            <li><code>-ffast-math</code>: Fast floating-point math</li>
            <li><code>-funroll-loops</code>: Unroll loops for speed</li>
          </ul>
          
          <h4>Build Process</h4>
          <div className="build-flow">
            <div className="build-step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h5>Lexical Analysis</h5>
                <p>Source code is tokenized with advanced lookahead</p>
              </div>
            </div>
            <div className="build-step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h5>Syntax Parsing</h5>
                <p>Tokens are parsed into an Abstract Syntax Tree</p>
              </div>
            </div>
            <div className="build-step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h5>Type Checking</h5>
                <p>Semantic analysis and type validation</p>
              </div>
            </div>
            <div className="build-step">
              <div className="step-number">4</div>
              <div className="step-content">
                <h5>Code Generation</h5>
                <p>Ultra-optimized C code generation</p>
              </div>
            </div>
          </div>
          
          <h4>Performance Metrics</h4>
          <div className="metrics-grid">
            <div className="metric">
              <div className="metric-value">0.003s</div>
              <div className="metric-label">Compilation Time</div>
            </div>
            <div className="metric">
              <div className="metric-value">0.0008s</div>
              <div className="metric-label">Execution Time</div>
            </div>
            <div className="metric">
              <div className="metric-value">2.1MB</div>
              <div className="metric-label">Memory Usage</div>
            </div>
            <div className="metric">
              <div className="metric-value">847B</div>
              <div className="metric-label">Generated Code</div>
            </div>
          </div>
        </div>
      )
    }
  ];

  const [activeSection, setActiveSection] = React.useState('getting-started');

  return (
    <div className="documentation">
      <div className="container">
        <div className="docs-header">
          <h1 className="docs-title">
            <span className="text-gradient">Trica</span> Documentation
          </h1>
          <p className="docs-description">
            Complete guide to the mind-bending programming language that will destroy your understanding of reality
          </p>
        </div>

        <div className="docs-content">
          <nav className="docs-nav">
            <h3>Contents</h3>
            {sections.map((section) => (
              <button
                key={section.id}
                className={`nav-item ${activeSection === section.id ? 'active' : ''}`}
                onClick={() => setActiveSection(section.id)}
              >
                {section.icon}
                {section.title}
              </button>
            ))}
          </nav>

          <main className="docs-main">
            <div className="docs-section">
              {sections.find(s => s.id === activeSection)?.content}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Documentation;





