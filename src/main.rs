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
        eprintln!("Usage: trica <file.trica>");
        process::exit(1);
    }
    
    let filename = &args[1];
    let start_time = Instant::now();
    
    match compile_file(filename) {
        Ok(_) => {
            let compile_time = start_time.elapsed();
            println!("Compilation completed in {:?}", compile_time);
        }
        Err(e) => {
            eprintln!("Error: {}", e);
            process::exit(1);
        }
    }
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
    
    // Execute on Trica VM
    let mut vm = TricaVM::new();
    vm.load_bytecode(bytecode);
    vm.execute()?;
    
    println!("🔥 TRICA BYTECODE EXECUTION COMPLETE 🔥");
    Ok(())
}