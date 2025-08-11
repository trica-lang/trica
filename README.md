# Trica Programming Language

A clean, modern, lightweight, statically-typed programming language designed for extreme performance with sub-microsecond to sub-millisecond execution times.

## Features

- **Ultra-Fast Execution**: Sub-microsecond to sub-millisecond execution times
- **Static Typing**: Compile-time type checking for safety and performance
- **Zero-Cost Abstractions**: High-level features with no runtime overhead
- **AOT Compilation**: Ahead-of-time compilation to native machine code
- **Memory Safe**: Built-in memory safety without garbage collection overhead
- **Hybrid Syntax**: Clean syntax inspired by C and Python

## Quick Start

```trica
include <stdio.h>

Main {
    Print "Hello, World!"
}
```

## Architecture

- **Lexer**: High-performance tokenization
- **Parser**: Recursive descent parser with error recovery
- **Type Checker**: Static analysis and type inference
- **Code Generator**: LLVM-based native code generation
- **Runtime**: Minimal runtime with zero-cost abstractions

## Performance Goals

- Compilation: < 100ms for typical programs
- Execution: Sub-microsecond startup, sub-millisecond for complex operations
- Memory: Minimal footprint with predictable allocation patterns