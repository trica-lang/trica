// 🔥 TRICA <900ns BENCHMARK TOOL 🔥
use mimalloc::MiMalloc;

#[global_allocator]
static GLOBAL: MiMalloc = MiMalloc;

use std::time::Instant;

use trica::lexer::Lexer;
use trica::parser::Parser;
use trica::type_checker::TypeChecker;
use trica::bytecode::{BytecodeCompiler, TricaVM};

fn main() {
    println!("🔥 TRICA <900ns EXECUTION BENCHMARK 🔥");
    println!("⚡ Testing ultra-fast bytecode execution...\n");
    
    let test_cases = vec![
        r#"Main { Print "Hello, World!" }"#,
        r#"Main { Print "Test" }"#,
        r#"Main { }"#,
        r#"Main { Print "Quantum" }"#,
        r#"Main { Print "Speed" }"#,
    ];
    
    for (i, code) in test_cases.iter().enumerate() {
        println!("🧪 Test Case {}: {}", i + 1, code);
        
        // Compile once
        let bytecode = compile_code(code).expect("Compilation failed");
        
        // Run multiple times to get accurate timing
        let mut times = Vec::new();
        let iterations = 1000;
        
        for _ in 0..iterations {
            let mut vm = TricaVM::new();
            vm.load_bytecode(bytecode.clone());
            
            // ULTRA-PRECISE TIMING
            let start = Instant::now();
            vm.execute().expect("Execution failed");
            let duration = start.elapsed();
            
            times.push(duration.as_nanos() as u64);
        }
        
        // Calculate statistics
        times.sort();
        let min_ns = times[0];
        let max_ns = times[times.len() - 1];
        let median_ns = times[times.len() / 2];
        let avg_ns = times.iter().sum::<u64>() / times.len() as u64;
        
        println!("📊 Results ({} iterations):", iterations);
        println!("   Min:    {}ns", min_ns);
        println!("   Avg:    {}ns", avg_ns);
        println!("   Median: {}ns", median_ns);
        println!("   Max:    {}ns", max_ns);
        
        if min_ns < 900 {
            println!("   🏆 LEGENDARY: <900ns TARGET ACHIEVED!");
        } else if min_ns < 1000 {
            println!("   🔥 EXCELLENT: Sub-microsecond execution!");
        } else {
            println!("   ⚡ Fast: {:.3}μs", min_ns as f64 / 1000.0);
        }
        
        println!();
    }
    
    println!("🎉 BENCHMARK COMPLETE! 🎉");
}

fn compile_code(source: &str) -> Result<Vec<trica::bytecode::Instruction>, Box<dyn std::error::Error>> {
    // Lexical analysis
    let mut lexer = Lexer::new(source);
    let tokens = lexer.tokenize()?;
    
    // Parsing
    let mut parser = Parser::new(tokens);
    let ast = parser.parse()?;
    
    // Type checking
    let mut type_checker = TypeChecker::new();
    type_checker.check(&ast)?;
    
    // Bytecode compilation
    let mut compiler = BytecodeCompiler::new();
    let bytecode = compiler.compile(&ast)?;
    
    Ok(bytecode)
}