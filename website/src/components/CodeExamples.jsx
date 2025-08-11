import React, { useState } from 'react';
import { Code } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './CodeExamples.css';

const CodeExamples = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [copiedIndex, setCopiedIndex] = useState(-1);

  const examples = [
    {
      title: "Hello World",
      description: "The deceptively simple beginning that hides infinite complexity",
      trica: `include <stdio.h>

Main {
    Print "Hello, World!"
    Print "Welcome to the mind-bending world of Trica"
}`,
      output: `Hello, World!
Welcome to the mind-bending world of Trica`,
      generated: `/*
 * Trica Ultra-Fast Compiled Output
 * Optimized for sub-microsecond execution
 */
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdint.h>

#define TRICA_INLINE __forceinline
#define TRICA_RESTRICT __restrict

static char* trica_last_output = NULL;

// Pre-computed string literals for maximum performance
static const char trica_str_0[] = "Hello, World!";
static const char trica_str_1[] = "Welcome to the mind-bending world of Trica";

TRICA_INLINE void trica_print(const char* TRICA_RESTRICT str) {
    fputs(str, stdout);
    if (trica_last_output != NULL) free(trica_last_output);
    size_t len = strlen(str);
    trica_last_output = (char*)malloc(len + 1);
    memcpy(trica_last_output, str, len + 1);
}

int main(void) {
    trica_print(trica_str_0);
    trica_print(trica_str_1);
    if (trica_last_output != NULL) free(trica_last_output);
    return 0;
}`
    },
    {
      title: "String Concatenation",
      description: "Simple + operators that trigger quantum-level optimizations",
      trica: `Main {
    greeting = "Hello" + " " + "World"
    message = "Trica is " + "ultra-fast"
    
    Print greeting + " - " + message
    Print "This simple syntax hides algorithmic madness"
}`,
      output: `Hello World - Trica is ultra-fast
This simple syntax hides algorithmic madness`,
      generated: `// Ultra-optimized string concatenation
TRICA_INLINE char* trica_concat(const char* TRICA_RESTRICT str1, const char* TRICA_RESTRICT str2) {
    size_t len1 = strlen(str1), len2 = strlen(str2);
    char* result = (char*)malloc(len1 + len2 + 1);
    memcpy(result, str1, len1);
    memcpy(result + len1, str2, len2 + 1);
    return result;
}

int main(void) {
    char* trica_var_greeting = trica_concat(trica_concat(trica_str_0, trica_str_1), trica_str_2);
    char* trica_var_message = trica_concat(trica_str_3, trica_str_4);
    trica_print(trica_concat(trica_concat(trica_var_greeting, trica_str_5), trica_var_message));
    trica_print(trica_str_6);
    return 0;
}`
    },
    {
      title: "Print.output Magic",
      description: "Property access that will physically destroy your understanding of reality",
      trica: `Main {
    Print "First message"
    lastOutput = Print.output
    Print "You said: " + lastOutput
    
    Print "Another message"
    Print "Previous: " + Print.output
}`,
      output: `First message
You said: First message
Another message
Previous: Another message`,
      generated: `TRICA_INLINE const char* trica_get_last_output(void) {
    return trica_last_output ? trica_last_output : "";
}

int main(void) {
    trica_print(trica_str_0);
    char* trica_var_lastOutput = trica_get_last_output();
    trica_print(trica_concat(trica_concat(trica_str_1, trica_var_lastOutput), trica_str_2));
    trica_print(trica_str_3);
    trica_print(trica_concat(trica_concat(trica_str_4, trica_get_last_output()), trica_str_5));
    return 0;
}`
    }
  ];

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(-1), 2000);
    });
  };

  return (
    <section id="examples" className="code-examples">
      <div className="container">
        <div className="examples-header">
          <div className="section-badge">
            <Code size={16} />
            <span>Code Examples</span>
          </div>

          <h2 className="section-title">
            Witness the <span className="text-gradient">Mind-Bending Magic</span>
          </h2>

          <p className="section-description">
            See how innocent-looking Trica code compiles into ultra-optimized C that will make your CPU weep with joy.
            Each example demonstrates the terrifying complexity hidden beneath simple syntax.
          </p>
        </div>

        <div className="examples-tabs">
          {examples.map((example, index) => (
            <button
              key={index}
              className={`tab ${activeTab === index ? 'active' : ''}`}
              onClick={() => setActiveTab(index)}
            >
              {example.title}
            </button>
          ))}
        </div>

        <div className="example-content">
          <div className="example-header">
            <h3 className="example-title">{examples[activeTab].title}</h3>
            <p className="example-description">{examples[activeTab].description}</p>
          </div>

          <div className="code-panels">
            <div className="code-panel">
              <div className="panel-header">
                <div className="panel-title">
                  <Code size={16} />
                  Trica Source
                </div>
                <button
                  className="copy-btn"
                  onClick={() => copyToClipboard(examples[activeTab].trica, 0)}
                >
                  {copiedIndex === 0 ? 'Copied!' : 'Copy'}
                </button>
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
                  {examples[activeTab].trica}
                </SyntaxHighlighter>
              </div>
            </div>

            <div className="code-panel">
              <div className="panel-header">
                <div className="panel-title">
                  <Code size={16} />
                  Output
                </div>
                <button
                  className="copy-btn"
                  onClick={() => copyToClipboard(examples[activeTab].output, 1)}
                >
                  {copiedIndex === 1 ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <div className="output-content">
                <pre>{examples[activeTab].output}</pre>
              </div>
            </div>
          </div>

          <div className="generated-code">
            <div className="panel-header">
              <div className="panel-title">
                <span className="text-gradient">? Generated Ultra-Fast C Code</span>
              </div>
              <button
                className="copy-btn"
                onClick={() => copyToClipboard(examples[activeTab].generated, 2)}
              >
                {copiedIndex === 2 ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <div className="code-content">
              <SyntaxHighlighter
                language="c"
                style={vscDarkPlus}
                customStyle={{
                  background: 'transparent',
                  padding: 0,
                  margin: 0,
                  fontSize: '13px',
                  fontFamily: 'JetBrains Mono, monospace'
                }}
              >
                {examples[activeTab].generated}
              </SyntaxHighlighter>
            </div>
          </div>
        </div>

        <div className="examples-footer">
          <div className="complexity-indicator">
            <div className="complexity-bar">
              <div className="complexity-fill"></div>
            </div>
            <span className="complexity-label">
              Complexity Level: <span className="text-gradient">MIND-DESTROYING</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CodeExamples;
