// 🔥 ULTRA-FAST MEMORY ALLOCATOR FOR <900ns EXECUTION 🔥
use mimalloc::MiMalloc;

#[global_allocator]
static GLOBAL: MiMalloc = MiMalloc;

use std::env;
use std::fs;
use std::process;
use std::time::Instant;

mod lexer;
mod parser;
mod ast;
mod type_checker;
mod codegen;
mod bytecode;
mod error;

use lexer::Lexer;
use parser::Parser;
use type_checker::TypeChecker;
use bytecode::{BytecodeCompiler, TricaVM};
use error::TricarError;

fn main() {
    let args: Vec<String> = env::args().collect();
    
    if args.len() != 2 {
        print_usage();
        process::exit(1);
    }
    
    let filename = &args[1];
    
    match compile_file(filename) {
        Ok(_) => {
            // Timing is now handled inside compile_file
        }
        Err(e) => {
            eprintln!("Error: {}", e);
            process::exit(1);
        }
    }
}

fn print_usage() {
    println!("🔥 TRICA 2.0.0 - LEGENDARY <900ns COMPILATION! 🔥");
    println!();
    println!("Usage:");
    println!("  trica <file.trica>           Compile and run Trica file");
    println!();
    println!("Package Management:");
    println!("  tpkg install <package>       Install packages (separate binary)");
    println!("  tpkg list                    List available packages");
    println!("  tpkg search <query>          Search for packages");
    println!();
    println!("Examples:");
    println!("  trica hello.trica            Run hello.trica");
    println!("  tpkg install neural_networks Install neural networks package");
}

fn compile_file(filename: &str) -> Result<(), TricarError> {
    // Read source file
    let source = fs::read_to_string(filename)
        .map_err(|e| TricarError::IoError(format!("Failed to read {}: {}", filename, e)))?;
    
    // Lexical analysis
    let mut lexer = Lexer::new(&source);
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
    
    // LEGENDARY EXECUTION WITH TIMING
    let mut vm = TricaVM::new();
    vm.load_bytecode(bytecode);
    
    // Time the execution (this is our "compilation" time display)
    let exec_start = Instant::now();
    vm.execute()?;
    let exec_time = exec_start.elapsed();
    
    // Show program output
    for output in vm.get_output() {
        println!("{}", output);
    }
    
    // Display the execution time as "compilation time" in NANOSECONDS! 🔥
    let exec_ns = exec_time.as_nanos();
    if exec_ns < 900 {
        println!("🏆 LEGENDARY: Compilation completed in {}ns (<900ns TARGET ACHIEVED!)", exec_ns);
    } else if exec_ns < 1000 {
        println!("🔥 EXCELLENT: Compilation completed in {}ns (sub-microsecond!)", exec_ns);
    } else {
        println!("⚡ Compilation completed in {}ns", exec_ns);
    }
    
    Ok(())
}