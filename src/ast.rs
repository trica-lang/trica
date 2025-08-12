

#[derive(Debug, Clone, PartialEq)]
pub struct Program {
    pub includes: Vec<Include>,
    pub imports: Vec<Import>,
    pub statements: Vec<Statement>,  // DIRECT STATEMENTS - NO MAIN BLOCK!
}

#[derive(Debug, Clone, PartialEq)]
pub struct Include {
    pub path: String,
    pub is_system: bool, // true for <>, false for ""
    pub line: usize,
    pub column: usize,
}

#[derive(Debug, Clone, PartialEq)]
pub struct Import {
    pub module_path: Vec<String>, // e.g., ["user", "input"]
    pub alias: String,
    pub line: usize,
    pub column: usize,
}

#[derive(Debug, Clone, PartialEq)]
pub struct MainBlock {
    pub statements: Vec<Statement>,
    pub line: usize,
    pub column: usize,
}

#[derive(Debug, Clone, PartialEq)]
pub enum Statement {
    Print {
        expression: Expression,
        line: usize,
        column: usize,
    },
    Assignment {
        name: String,
        value: Expression,
        line: usize,
        column: usize,
    },
    Expression {
        expression: Expression,
        line: usize,
        column: usize,
    },
}

#[derive(Debug, Clone, PartialEq)]
pub enum Expression {
    StringLiteral {
        value: String,
        line: usize,
        column: usize,
    },
    NumberLiteral {
        value: f64,
        line: usize,
        column: usize,
    },
    Identifier {
        name: String,
        line: usize,
        column: usize,
    },
    PropertyAccess {
        object: Box<Expression>,
        property: String,
        line: usize,
        column: usize,
    },
    FunctionCall {
        name: String,
        args: Vec<Expression>,
        line: usize,
        column: usize,
    },
    BinaryOp {
        left: Box<Expression>,
        operator: BinaryOperator,
        right: Box<Expression>,
        line: usize,
        column: usize,
    },
}

#[derive(Debug, Clone, PartialEq)]
pub enum BinaryOperator {
    Add,
    Subtract,
    Multiply,
    Divide,
    Equal,
    NotEqual,
    Less,
    Greater,
    LessEqual,
    GreaterEqual,
}

#[derive(Debug, Clone, PartialEq)]
pub enum Type {
    String,
    Number,
    Boolean,
    Void,
    Unknown,
}

impl Expression {
    pub fn line(&self) -> usize {
        match self {
            Expression::StringLiteral { line, .. } => *line,
            Expression::NumberLiteral { line, .. } => *line,
            Expression::Identifier { line, .. } => *line,
            Expression::PropertyAccess { line, .. } => *line,
            Expression::FunctionCall { line, .. } => *line,
            Expression::BinaryOp { line, .. } => *line,
        }
    }
    
    pub fn column(&self) -> usize {
        match self {
            Expression::StringLiteral { column, .. } => *column,
            Expression::NumberLiteral { column, .. } => *column,
            Expression::Identifier { column, .. } => *column,
            Expression::PropertyAccess { column, .. } => *column,
            Expression::FunctionCall { column, .. } => *column,
            Expression::BinaryOp { column, .. } => *column,
        }
    }
}