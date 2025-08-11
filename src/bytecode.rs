// 🔥 TRICA BYTECODE VM - LEGENDARY EXECUTION ENGINE 🔥
// This VM executes Trica bytecode at impossible speeds

use std::collections::HashMap;
use crate::ast::{*, BinaryOperator};
use crate::error::TricarError;

/// Trica Bytecode Instructions - Each one bends reality
#[derive(Debug, Clone)]
pub enum Instruction {
    // Basic operations
    LoadString(String),           // Load string literal onto stack
    LoadNumber(f64),             // Load number onto stack
    Print,                       // Print top of stack (destroys minds)
    Pop,                         // Remove top of stack
    
    // String operations
    Concat,                      // Concatenate two strings (quantum entanglement)
    
    // Variables
    Store(String),               // Store top of stack in variable
    Load(String),                // Load variable onto stack
    
    // Control flow
    Jump(usize),                 // Unconditional jump
    JumpIfFalse(usize),         // Jump if top of stack is false
    
    // Advanced Trica operations
    QuantumSuperposition,        // Put value in all possible states
    CollapseWaveFunction,        // Observe quantum state
    TimeTravel(i64),            // Travel through time (in nanoseconds)
    DestroyMind,                // Ultimate mind destruction
    
    // VM control
    Halt,                       // Stop execution (reality ends)
}

/// Trica Virtual Machine - Executes at impossible speeds
pub struct TricaVM {
    stack: Vec<TricaValue>,
    variables: HashMap<String, TricaValue>,
    instructions: Vec<Instruction>,
    pc: usize,  // Program counter
    output: Vec<String>,
    quantum_state: bool,
    time_offset: i64,
}

/// Trica Values - Can exist in multiple states simultaneously
#[derive(Debug, Clone)]
pub enum TricaValue {
    String(String),
    Number(f64),
    Boolean(bool),
    Quantum(Vec<TricaValue>),  // Superposition of values
    Void,
}

impl TricaVM {
    pub fn new() -> Self {
        Self {
            stack: Vec::new(),
            variables: HashMap::new(),
            instructions: Vec::new(),
            pc: 0,
            output: Vec::new(),
            quantum_state: false,
            time_offset: 0,
        }
    }
    
    /// Load bytecode into the VM
    pub fn load_bytecode(&mut self, instructions: Vec<Instruction>) {
        self.instructions = instructions;
        self.pc = 0;
    }
    
    /// Execute bytecode at LEGENDARY speed
    pub fn execute(&mut self) -> Result<(), TricarError> {
        println!("🔥 TRICA VM STARTING - REALITY BENDING INITIATED 🔥");
        
        while self.pc < self.instructions.len() {
            let instruction = self.instructions[self.pc].clone();
            
            match instruction {
                Instruction::LoadString(s) => {
                    self.stack.push(TricaValue::String(s));
                }
                
                Instruction::LoadNumber(n) => {
                    self.stack.push(TricaValue::Number(n));
                }
                
                Instruction::Print => {
                    if let Some(value) = self.stack.pop() {
                        let output = self.format_value(&value);
                        println!("🧠 {}", output);
                        self.output.push(output);
                    }
                }
                
                Instruction::Pop => {
                    self.stack.pop();
                }
                
                Instruction::Concat => {
                    if let (Some(b), Some(a)) = (self.stack.pop(), self.stack.pop()) {
                        let result = format!("{}{}", 
                            self.format_value(&a), 
                            self.format_value(&b)
                        );
                        self.stack.push(TricaValue::String(result));
                    }
                }
                
                Instruction::Store(name) => {
                    if let Some(value) = self.stack.pop() {
                        self.variables.insert(name, value);
                    }
                }
                
                Instruction::Load(name) => {
                    if let Some(value) = self.variables.get(&name) {
                        self.stack.push(value.clone());
                    } else {
                        return Err(TricarError::VMUndefinedVariable(name));
                    }
                }
                
                Instruction::QuantumSuperposition => {
                    if let Some(value) = self.stack.pop() {
                        // Put value in quantum superposition
                        let quantum_value = TricaValue::Quantum(vec![
                            value.clone(),
                            TricaValue::Void,
                            value,
                        ]);
                        self.stack.push(quantum_value);
                        self.quantum_state = true;
                        println!("⚛️  QUANTUM SUPERPOSITION ACTIVATED");
                    }
                }
                
                Instruction::CollapseWaveFunction => {
                    if let Some(TricaValue::Quantum(states)) = self.stack.pop() {
                        // Collapse to first non-void state
                        let collapsed = states.into_iter()
                            .find(|v| !matches!(v, TricaValue::Void))
                            .unwrap_or(TricaValue::Void);
                        self.stack.push(collapsed);
                        self.quantum_state = false;
                        println!("🌊 WAVE FUNCTION COLLAPSED");
                    }
                }
                
                Instruction::TimeTravel(offset) => {
                    self.time_offset += offset;
                    println!("⏰ TIME TRAVEL: {}ns offset", offset);
                }
                
                Instruction::DestroyMind => {
                    println!("🧠💥 MIND DESTRUCTION COMPLETE 💥🧠");
                    println!("🌀 REALITY HAS BEEN FUNDAMENTALLY ALTERED 🌀");
                }
                
                Instruction::Jump(addr) => {
                    self.pc = addr;
                    continue;
                }
                
                Instruction::JumpIfFalse(addr) => {
                    if let Some(TricaValue::Boolean(false)) = self.stack.last() {
                        self.pc = addr;
                        continue;
                    }
                }
                
                Instruction::Halt => {
                    println!("🔥 TRICA VM HALTED - REALITY RESTORED 🔥");
                    break;
                }
            }
            
            self.pc += 1;
        }
        
        Ok(())
    }
    
    fn format_value(&self, value: &TricaValue) -> String {
        match value {
            TricaValue::String(s) => s.clone(),
            TricaValue::Number(n) => n.to_string(),
            TricaValue::Boolean(b) => b.to_string(),
            TricaValue::Quantum(states) => {
                format!("⚛️[{}]", states.iter()
                    .map(|v| self.format_value(v))
                    .collect::<Vec<_>>()
                    .join(" | "))
            }
            TricaValue::Void => "∅".to_string(),
        }
    }
    
    pub fn get_output(&self) -> &Vec<String> {
        &self.output
    }
}

/// Bytecode Compiler - Converts AST to LEGENDARY bytecode
pub struct BytecodeCompiler {
    instructions: Vec<Instruction>,
}

impl BytecodeCompiler {
    pub fn new() -> Self {
        Self {
            instructions: Vec::new(),
        }
    }
    
    pub fn compile(&mut self, program: &Program) -> Result<Vec<Instruction>, TricarError> {
        println!("🔥 COMPILING TO TRICA BYTECODE 🔥");
        
        // Compile main block
        self.compile_main_block(&program.main_block)?;
        
        // Add halt instruction
        self.instructions.push(Instruction::Halt);
        
        println!("✅ BYTECODE COMPILATION COMPLETE - {} INSTRUCTIONS", self.instructions.len());
        Ok(self.instructions.clone())
    }
    
    fn compile_main_block(&mut self, main_block: &MainBlock) -> Result<(), TricarError> {
        for statement in &main_block.statements {
            self.compile_statement(statement)?;
        }
        Ok(())
    }
    
    fn compile_statement(&mut self, statement: &Statement) -> Result<(), TricarError> {
        match statement {
            Statement::Print { expression, .. } => {
                self.compile_expression(expression)?;
                self.instructions.push(Instruction::Print);
            }
            
            Statement::Assignment { name, value, .. } => {
                self.compile_expression(value)?;
                self.instructions.push(Instruction::Store(name.clone()));
            }
            
            Statement::Expression { expression, .. } => {
                self.compile_expression(expression)?;
                self.instructions.push(Instruction::Pop);
            }
        }
        Ok(())
    }
    
    fn compile_expression(&mut self, expr: &Expression) -> Result<(), TricarError> {
        match expr {
            Expression::StringLiteral { value, .. } => {
                self.instructions.push(Instruction::LoadString(value.clone()));
            }
            
            Expression::NumberLiteral { value, .. } => {
                self.instructions.push(Instruction::LoadNumber(*value));
            }
            
            Expression::Identifier { name, .. } => {
                self.instructions.push(Instruction::Load(name.clone()));
            }
            
            Expression::BinaryOp { left, operator, right, .. } => {
                self.compile_expression(left)?;
                self.compile_expression(right)?;
                
                match operator {
                    BinaryOperator::Add => self.instructions.push(Instruction::Concat),
                    _ => return Err(TricarError::UnsupportedOperation(format!("{:?}", operator))),
                }
            }
            
            Expression::PropertyAccess { .. } => {
                // For now, ignore property access
                self.instructions.push(Instruction::LoadString("".to_string()));
            }
            
            Expression::FunctionCall { .. } => {
                // For now, ignore function calls
                self.instructions.push(Instruction::LoadString("".to_string()));
            }
        }
        Ok(())
    }
}