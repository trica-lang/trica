use std::fmt;

#[derive(Debug, Clone)]
pub enum TricarError {
    // Lexer errors
    UnexpectedCharacter { ch: char, line: usize, column: usize },
    UnterminatedString { line: usize, column: usize },
    InvalidNumber { text: String, line: usize, column: usize },
    
    // Parser errors
    UnexpectedToken { expected: String, found: String, line: usize, column: usize },
    UnexpectedEof,
    MissingMainBlock,
    
    // Type checker errors
    TypeMismatch { expected: String, found: String, line: usize, column: usize },
    UndefinedVariable { name: String, line: usize, column: usize },
    UndefinedFunction { name: String, line: usize, column: usize },
    
    // Code generation errors
    CodegenError(String),
    
    // VM errors
    VMUndefinedVariable(String),
    UnsupportedOperation(String),
    StackUnderflow,
    InvalidBytecode,
    
    // IO errors
    IoError(String),
}

impl fmt::Display for TricarError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            TricarError::UnexpectedCharacter { ch, line, column } => {
                write!(f, "Unexpected character '{}' at line {}, column {}", ch, line, column)
            }
            TricarError::UnterminatedString { line, column } => {
                write!(f, "Unterminated string at line {}, column {}", line, column)
            }
            TricarError::InvalidNumber { text, line, column } => {
                write!(f, "Invalid number '{}' at line {}, column {}", text, line, column)
            }
            TricarError::UnexpectedToken { expected, found, line, column } => {
                write!(f, "Expected '{}', found '{}' at line {}, column {}", expected, found, line, column)
            }
            TricarError::UnexpectedEof => {
                write!(f, "Unexpected end of file")
            }
            TricarError::MissingMainBlock => {
                write!(f, "Missing Main {{}} block - all Trica programs must have a Main block")
            }
            TricarError::TypeMismatch { expected, found, line, column } => {
                write!(f, "Type mismatch: expected '{}', found '{}' at line {}, column {}", expected, found, line, column)
            }
            TricarError::UndefinedVariable { name, line, column } => {
                write!(f, "Undefined variable '{}' at line {}, column {}", name, line, column)
            }
            TricarError::UndefinedFunction { name, line, column } => {
                write!(f, "Undefined function '{}' at line {}, column {}", name, line, column)
            }
            TricarError::CodegenError(msg) => {
                write!(f, "Code generation error: {}", msg)
            }
            TricarError::IoError(msg) => {
                write!(f, "IO error: {}", msg)
            }
            TricarError::VMUndefinedVariable(name) => {
                write!(f, "Undefined variable '{}' in VM", name)
            }
            TricarError::UnsupportedOperation(op) => {
                write!(f, "Unsupported operation: {}", op)
            }
            TricarError::StackUnderflow => {
                write!(f, "Stack underflow in VM")
            }
            TricarError::InvalidBytecode => {
                write!(f, "Invalid bytecode instruction")
            }
        }
    }
}

impl std::error::Error for TricarError {}