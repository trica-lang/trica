use crate::error::TricarError;
use std::collections::HashMap;

#[derive(Debug, Clone, PartialEq)]
pub enum TokenType {
    // Literals
    StringLiteral(String),
    NumberLiteral(f64),
    
    // Identifiers and Keywords
    Identifier(String),
    Include,
    Import,
    As,
    Main,
    Print,
    
    // Operators and Punctuation
    LeftBrace,      // {
    RightBrace,     // }
    LeftParen,      // (
    RightParen,     // )
    Dot,            // .
    Comma,          // ,
    Equal,          // =
    Plus,           // +
    Minus,          // -
    Star,           // *
    Slash,          // /
    Less,           // <
    Greater,        // >
    LessEqual,      // <=
    GreaterEqual,   // >=
    EqualEqual,     // ==
    NotEqual,       // !=
    
    // Special
    Newline,
    Eof,
}

#[derive(Debug, Clone)]
pub struct Token {
    pub token_type: TokenType,
    pub line: usize,
    pub column: usize,
}

pub struct Lexer {
    input: Vec<char>,
    position: usize,
    line: usize,
    column: usize,
    keywords: HashMap<String, TokenType>,
}

impl Lexer {
    pub fn new(input: &str) -> Self {
        let mut keywords = HashMap::new();
        keywords.insert("include".to_string(), TokenType::Include);
        keywords.insert("import".to_string(), TokenType::Import);
        keywords.insert("as".to_string(), TokenType::As);
        keywords.insert("Main".to_string(), TokenType::Main);
        keywords.insert("Print".to_string(), TokenType::Print);
        
        Self {
            input: input.chars().collect(),
            position: 0,
            line: 1,
            column: 1,
            keywords,
        }
    }
    
    pub fn tokenize(&mut self) -> Result<Vec<Token>, TricarError> {
        let mut tokens = Vec::new();
        
        while !self.is_at_end() {
            self.skip_whitespace();
            
            if self.is_at_end() {
                break;
            }
            
            let start_line = self.line;
            let start_column = self.column;
            
            match self.current_char() {
                // Comments
                '/' if self.peek() == Some('/') => {
                    self.skip_comment();
                    continue;
                }
                
                // String literals
                '"' => {
                    let string_val = self.read_string()?;
                    tokens.push(Token {
                        token_type: TokenType::StringLiteral(string_val),
                        line: start_line,
                        column: start_column,
                    });
                }
                
                // Numbers
                c if c.is_ascii_digit() => {
                    let number_val = self.read_number()?;
                    tokens.push(Token {
                        token_type: TokenType::NumberLiteral(number_val),
                        line: start_line,
                        column: start_column,
                    });
                }
                
                // Identifiers and keywords
                c if c.is_alphabetic() || c == '_' => {
                    let identifier = self.read_identifier();
                    let token_type = self.keywords.get(&identifier)
                        .cloned()
                        .unwrap_or(TokenType::Identifier(identifier));
                    
                    tokens.push(Token {
                        token_type,
                        line: start_line,
                        column: start_column,
                    });
                }
                
                // Single-character tokens
                '{' => {
                    self.advance();
                    tokens.push(Token {
                        token_type: TokenType::LeftBrace,
                        line: start_line,
                        column: start_column,
                    });
                }
                '}' => {
                    self.advance();
                    tokens.push(Token {
                        token_type: TokenType::RightBrace,
                        line: start_line,
                        column: start_column,
                    });
                }
                '(' => {
                    self.advance();
                    tokens.push(Token {
                        token_type: TokenType::LeftParen,
                        line: start_line,
                        column: start_column,
                    });
                }
                ')' => {
                    self.advance();
                    tokens.push(Token {
                        token_type: TokenType::RightParen,
                        line: start_line,
                        column: start_column,
                    });
                }
                '.' => {
                    self.advance();
                    tokens.push(Token {
                        token_type: TokenType::Dot,
                        line: start_line,
                        column: start_column,
                    });
                }
                ',' => {
                    self.advance();
                    tokens.push(Token {
                        token_type: TokenType::Comma,
                        line: start_line,
                        column: start_column,
                    });
                }
                '+' => {
                    self.advance();
                    tokens.push(Token {
                        token_type: TokenType::Plus,
                        line: start_line,
                        column: start_column,
                    });
                }
                '-' => {
                    self.advance();
                    tokens.push(Token {
                        token_type: TokenType::Minus,
                        line: start_line,
                        column: start_column,
                    });
                }
                '*' => {
                    self.advance();
                    tokens.push(Token {
                        token_type: TokenType::Star,
                        line: start_line,
                        column: start_column,
                    });
                }
                '/' => {
                    self.advance();
                    tokens.push(Token {
                        token_type: TokenType::Slash,
                        line: start_line,
                        column: start_column,
                    });
                }
                
                // Multi-character operators
                '=' => {
                    self.advance();
                    if self.current_char() == '=' {
                        self.advance();
                        tokens.push(Token {
                            token_type: TokenType::EqualEqual,
                            line: start_line,
                            column: start_column,
                        });
                    } else {
                        tokens.push(Token {
                            token_type: TokenType::Equal,
                            line: start_line,
                            column: start_column,
                        });
                    }
                }
                '<' => {
                    self.advance();
                    if self.current_char() == '=' {
                        self.advance();
                        tokens.push(Token {
                            token_type: TokenType::LessEqual,
                            line: start_line,
                            column: start_column,
                        });
                    } else {
                        tokens.push(Token {
                            token_type: TokenType::Less,
                            line: start_line,
                            column: start_column,
                        });
                    }
                }
                '>' => {
                    self.advance();
                    if self.current_char() == '=' {
                        self.advance();
                        tokens.push(Token {
                            token_type: TokenType::GreaterEqual,
                            line: start_line,
                            column: start_column,
                        });
                    } else {
                        tokens.push(Token {
                            token_type: TokenType::Greater,
                            line: start_line,
                            column: start_column,
                        });
                    }
                }
                '!' => {
                    self.advance();
                    if self.current_char() == '=' {
                        self.advance();
                        tokens.push(Token {
                            token_type: TokenType::NotEqual,
                            line: start_line,
                            column: start_column,
                        });
                    } else {
                        return Err(TricarError::UnexpectedCharacter {
                            ch: '!',
                            line: start_line,
                            column: start_column,
                        });
                    }
                }
                
                '\n' => {
                    self.advance();
                    tokens.push(Token {
                        token_type: TokenType::Newline,
                        line: start_line,
                        column: start_column,
                    });
                }
                
                c => {
                    return Err(TricarError::UnexpectedCharacter {
                        ch: c,
                        line: start_line,
                        column: start_column,
                    });
                }
            }
        }
        
        tokens.push(Token {
            token_type: TokenType::Eof,
            line: self.line,
            column: self.column,
        });
        
        Ok(tokens)
    }
    
    fn current_char(&self) -> char {
        self.input.get(self.position).copied().unwrap_or('\0')
    }
    
    fn peek(&self) -> Option<char> {
        self.input.get(self.position + 1).copied()
    }
    
    fn advance(&mut self) -> char {
        let ch = self.current_char();
        self.position += 1;
        
        if ch == '\n' {
            self.line += 1;
            self.column = 1;
        } else {
            self.column += 1;
        }
        
        ch
    }
    
    fn is_at_end(&self) -> bool {
        self.position >= self.input.len()
    }
    
    fn skip_whitespace(&mut self) {
        while !self.is_at_end() {
            match self.current_char() {
                ' ' | '\r' | '\t' => {
                    self.advance();
                }
                _ => break,
            }
        }
    }
    
    fn skip_comment(&mut self) {
        while !self.is_at_end() && self.current_char() != '\n' {
            self.advance();
        }
    }
    
    fn read_string(&mut self) -> Result<String, TricarError> {
        let start_line = self.line;
        let start_column = self.column;
        
        self.advance(); // Skip opening quote
        
        let mut value = String::new();
        
        while !self.is_at_end() && self.current_char() != '"' {
            if self.current_char() == '\n' {
                return Err(TricarError::UnterminatedString {
                    line: start_line,
                    column: start_column,
                });
            }
            
            if self.current_char() == '\\' {
                self.advance();
                match self.current_char() {
                    'n' => value.push('\n'),
                    't' => value.push('\t'),
                    'r' => value.push('\r'),
                    '\\' => value.push('\\'),
                    '"' => value.push('"'),
                    c => {
                        value.push('\\');
                        value.push(c);
                    }
                }
            } else {
                value.push(self.current_char());
            }
            
            self.advance();
        }
        
        if self.is_at_end() {
            return Err(TricarError::UnterminatedString {
                line: start_line,
                column: start_column,
            });
        }
        
        self.advance(); // Skip closing quote
        Ok(value)
    }
    
    fn read_number(&mut self) -> Result<f64, TricarError> {
        let start_line = self.line;
        let start_column = self.column;
        let mut number_str = String::new();
        
        while !self.is_at_end() && (self.current_char().is_ascii_digit() || self.current_char() == '.') {
            number_str.push(self.current_char());
            self.advance();
        }
        
        number_str.parse().map_err(|_| TricarError::InvalidNumber {
            text: number_str,
            line: start_line,
            column: start_column,
        })
    }
    
    fn read_identifier(&mut self) -> String {
        let mut identifier = String::new();
        
        while !self.is_at_end() && (self.current_char().is_alphanumeric() || self.current_char() == '_') {
            identifier.push(self.current_char());
            self.advance();
        }
        
        identifier
    }
}