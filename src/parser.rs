use crate::ast::*;
use crate::error::TricarError;
use crate::lexer::{Token, TokenType};

pub struct Parser {
    tokens: Vec<Token>,
    current: usize,
}

impl Parser {
    pub fn new(tokens: Vec<Token>) -> Self {
        Self { tokens, current: 0 }
    }
    
    pub fn parse(&mut self) -> Result<Program, TricarError> {
        let mut includes = Vec::new();
        let mut imports = Vec::new();
        let mut main_block = None;
        
        // Skip initial newlines
        self.skip_newlines();
        
        // Parse includes and imports
        while !self.is_at_end() {
            match &self.peek().token_type {
                TokenType::Include => {
                    includes.push(self.parse_include()?);
                }
                TokenType::Import => {
                    imports.push(self.parse_import()?);
                }
                TokenType::Main => {
                    main_block = Some(self.parse_main_block()?);
                    break;
                }
                TokenType::Newline => {
                    self.advance();
                }
                _ => break,
            }
        }
        
        // Ensure we have a Main block
        let main_block = main_block.ok_or(TricarError::MissingMainBlock)?;
        
        Ok(Program {
            includes,
            imports,
            main_block,
        })
    }
    
    fn parse_include(&mut self) -> Result<Include, TricarError> {
        let include_token = self.consume(TokenType::Include, "Expected 'include'")?;
        let include_line = include_token.line;
        let include_column = include_token.column;
        
        let (path, is_system) = match &self.peek().token_type {
            TokenType::Less => {
                self.advance(); // consume <
                
                // Read everything until > as the header name
                let mut path = String::new();
                while !self.check(&TokenType::Greater) && !self.is_at_end() {
                    match &self.peek().token_type {
                        TokenType::Identifier(name) => {
                            path.push_str(name);
                            self.advance();
                        }
                        TokenType::Dot => {
                            path.push('.');
                            self.advance();
                        }
                        _ => {
                            return Err(TricarError::UnexpectedToken {
                                expected: "header name or '.'".to_string(),
                                found: format!("{:?}", self.peek().token_type),
                                line: self.peek().line,
                                column: self.peek().column,
                            });
                        }
                    }
                }
                
                self.consume(TokenType::Greater, "Expected '>'")?;
                (path, true)
            }
            TokenType::StringLiteral(path) => {
                let path = path.clone();
                self.advance();
                (path, false)
            }
            _ => {
                return Err(TricarError::UnexpectedToken {
                    expected: "< or string literal".to_string(),
                    found: format!("{:?}", self.peek().token_type),
                    line: self.peek().line,
                    column: self.peek().column,
                });
            }
        };
        
        self.skip_newlines();
        
        Ok(Include {
            path,
            is_system,
            line: include_line,
            column: include_column,
        })
    }
    
    fn parse_import(&mut self) -> Result<Import, TricarError> {
        let import_token = self.consume(TokenType::Import, "Expected 'import'")?;
        let import_line = import_token.line;
        let import_column = import_token.column;
        
        // Parse module path (e.g., user.input)
        let mut module_path = vec![self.consume_identifier("Expected module name")?];
        
        while self.match_token(&TokenType::Dot) {
            module_path.push(self.consume_identifier("Expected module name after '.'")?);
        }
        
        // Parse 'as alias'
        self.consume(TokenType::As, "Expected 'as'")?;
        let alias = self.consume_identifier("Expected alias name")?;
        
        self.skip_newlines();
        
        Ok(Import {
            module_path,
            alias,
            line: import_line,
            column: import_column,
        })
    }
    
    fn parse_main_block(&mut self) -> Result<MainBlock, TricarError> {
        let main_token = self.consume(TokenType::Main, "Expected 'Main'")?;
        let main_line = main_token.line;
        let main_column = main_token.column;
        
        self.consume(TokenType::LeftBrace, "Expected '{'")?;
        self.skip_newlines();
        
        let mut statements = Vec::new();
        
        while !self.check(&TokenType::RightBrace) && !self.is_at_end() {
            if self.match_token(&TokenType::Newline) {
                continue;
            }
            
            statements.push(self.parse_statement()?);
            self.skip_newlines();
        }
        
        self.consume(TokenType::RightBrace, "Expected '}'")?;
        
        Ok(MainBlock {
            statements,
            line: main_line,
            column: main_column,
        })
    }
    
    fn parse_statement(&mut self) -> Result<Statement, TricarError> {
        match &self.peek().token_type {
            TokenType::Print => {
                let print_token = self.advance();
                let print_line = print_token.line;
                let print_column = print_token.column;
                let expression = self.parse_expression()?;
                
                Ok(Statement::Print {
                    expression,
                    line: print_line,
                    column: print_column,
                })
            }
            TokenType::Identifier(_) => {
                // Could be assignment or expression
                let checkpoint = self.current;
                
                if let Ok(name) = self.consume_identifier("Expected identifier") {
                    if self.match_token(&TokenType::Equal) {
                        // Assignment
                        let value = self.parse_expression()?;
                        return Ok(Statement::Assignment {
                            name,
                            value,
                            line: self.tokens[checkpoint].line,
                            column: self.tokens[checkpoint].column,
                        });
                    }
                }
                
                // Reset and parse as expression
                self.current = checkpoint;
                let expression = self.parse_expression()?;
                
                Ok(Statement::Expression {
                    expression,
                    line: self.peek().line,
                    column: self.peek().column,
                })
            }
            _ => {
                let expression = self.parse_expression()?;
                Ok(Statement::Expression {
                    expression,
                    line: self.peek().line,
                    column: self.peek().column,
                })
            }
        }
    }
    
    fn parse_expression(&mut self) -> Result<Expression, TricarError> {
        self.parse_equality()
    }
    
    fn parse_equality(&mut self) -> Result<Expression, TricarError> {
        let mut expr = self.parse_comparison()?;
        
        while self.match_tokens(&[TokenType::EqualEqual, TokenType::NotEqual]) {
            let operator = match self.previous().token_type {
                TokenType::EqualEqual => BinaryOperator::Equal,
                TokenType::NotEqual => BinaryOperator::NotEqual,
                _ => unreachable!(),
            };
            
            let right = self.parse_comparison()?;
            let line = expr.line();
            let column = expr.column();
            
            expr = Expression::BinaryOp {
                left: Box::new(expr),
                operator,
                right: Box::new(right),
                line,
                column,
            };
        }
        
        Ok(expr)
    }
    
    fn parse_comparison(&mut self) -> Result<Expression, TricarError> {
        let mut expr = self.parse_term()?;
        
        while self.match_tokens(&[TokenType::Greater, TokenType::GreaterEqual, TokenType::Less, TokenType::LessEqual]) {
            let operator = match self.previous().token_type {
                TokenType::Greater => BinaryOperator::Greater,
                TokenType::GreaterEqual => BinaryOperator::GreaterEqual,
                TokenType::Less => BinaryOperator::Less,
                TokenType::LessEqual => BinaryOperator::LessEqual,
                _ => unreachable!(),
            };
            
            let right = self.parse_term()?;
            let line = expr.line();
            let column = expr.column();
            
            expr = Expression::BinaryOp {
                left: Box::new(expr),
                operator,
                right: Box::new(right),
                line,
                column,
            };
        }
        
        Ok(expr)
    }
    
    fn parse_term(&mut self) -> Result<Expression, TricarError> {
        let mut expr = self.parse_factor()?;
        
        while self.match_tokens(&[TokenType::Minus, TokenType::Plus]) {
            let operator = match self.previous().token_type {
                TokenType::Minus => BinaryOperator::Subtract,
                TokenType::Plus => BinaryOperator::Add,
                _ => unreachable!(),
            };
            
            let right = self.parse_factor()?;
            let line = expr.line();
            let column = expr.column();
            
            expr = Expression::BinaryOp {
                left: Box::new(expr),
                operator,
                right: Box::new(right),
                line,
                column,
            };
        }
        
        Ok(expr)
    }
    
    fn parse_factor(&mut self) -> Result<Expression, TricarError> {
        let mut expr = self.parse_unary()?;
        
        while self.match_tokens(&[TokenType::Slash, TokenType::Star]) {
            let operator = match self.previous().token_type {
                TokenType::Slash => BinaryOperator::Divide,
                TokenType::Star => BinaryOperator::Multiply,
                _ => unreachable!(),
            };
            
            let right = self.parse_unary()?;
            let line = expr.line();
            let column = expr.column();
            
            expr = Expression::BinaryOp {
                left: Box::new(expr),
                operator,
                right: Box::new(right),
                line,
                column,
            };
        }
        
        Ok(expr)
    }
    
    fn parse_unary(&mut self) -> Result<Expression, TricarError> {
        self.parse_postfix()
    }
    
    fn parse_postfix(&mut self) -> Result<Expression, TricarError> {
        let mut expr = self.parse_primary()?;
        
        while self.match_token(&TokenType::Dot) {
            let property = self.consume_identifier("Expected property name")?;
            let line = expr.line();
            let column = expr.column();
            
            expr = Expression::PropertyAccess {
                object: Box::new(expr),
                property,
                line,
                column,
            };
        }
        
        Ok(expr)
    }
    
    fn parse_primary(&mut self) -> Result<Expression, TricarError> {
        let token = self.advance();
        
        match &token.token_type {
            TokenType::StringLiteral(value) => {
                Ok(Expression::StringLiteral {
                    value: value.clone(),
                    line: token.line,
                    column: token.column,
                })
            }
            TokenType::NumberLiteral(value) => {
                Ok(Expression::NumberLiteral {
                    value: *value,
                    line: token.line,
                    column: token.column,
                })
            }
            TokenType::Identifier(name) => {
                Ok(Expression::Identifier {
                    name: name.clone(),
                    line: token.line,
                    column: token.column,
                })
            }
            TokenType::LeftParen => {
                let expr = self.parse_expression()?;
                self.consume(TokenType::RightParen, "Expected ')'")?;
                Ok(expr)
            }
            _ => {
                Err(TricarError::UnexpectedToken {
                    expected: "expression".to_string(),
                    found: format!("{:?}", token.token_type),
                    line: token.line,
                    column: token.column,
                })
            }
        }
    }
    
    // Helper methods
    fn match_token(&mut self, token_type: &TokenType) -> bool {
        if self.check(token_type) {
            self.advance();
            true
        } else {
            false
        }
    }
    
    fn match_tokens(&mut self, token_types: &[TokenType]) -> bool {
        for token_type in token_types {
            if self.check(token_type) {
                self.advance();
                return true;
            }
        }
        false
    }
    
    fn check(&self, token_type: &TokenType) -> bool {
        if self.is_at_end() {
            false
        } else {
            std::mem::discriminant(&self.peek().token_type) == std::mem::discriminant(token_type)
        }
    }
    
    fn advance(&mut self) -> &Token {
        if !self.is_at_end() {
            self.current += 1;
        }
        self.previous()
    }
    
    fn is_at_end(&self) -> bool {
        matches!(self.peek().token_type, TokenType::Eof)
    }
    
    fn peek(&self) -> &Token {
        &self.tokens[self.current]
    }
    
    fn previous(&self) -> &Token {
        &self.tokens[self.current - 1]
    }
    
    fn consume(&mut self, token_type: TokenType, message: &str) -> Result<&Token, TricarError> {
        if self.check(&token_type) {
            Ok(self.advance())
        } else {
            Err(TricarError::UnexpectedToken {
                expected: message.to_string(),
                found: format!("{:?}", self.peek().token_type),
                line: self.peek().line,
                column: self.peek().column,
            })
        }
    }
    
    fn consume_identifier(&mut self, message: &str) -> Result<String, TricarError> {
        match &self.peek().token_type {
            TokenType::Identifier(name) => {
                let name = name.clone();
                self.advance();
                Ok(name)
            }
            _ => {
                Err(TricarError::UnexpectedToken {
                    expected: message.to_string(),
                    found: format!("{:?}", self.peek().token_type),
                    line: self.peek().line,
                    column: self.peek().column,
                })
            }
        }
    }
    
    fn skip_newlines(&mut self) {
        while self.match_token(&TokenType::Newline) {
            // Skip newlines
        }
    }
}