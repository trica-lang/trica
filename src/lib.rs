pub mod lexer;
pub mod parser;
pub mod ast;
pub mod type_checker;
pub mod codegen;
pub mod error;

pub use lexer::Lexer;
pub use parser::Parser;
pub use type_checker::TypeChecker;
pub use codegen::CodeGenerator;
pub use error::TricarError;

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_lexer_basic() {
        let source = r#"
            include <stdio.h>
            Main {
                Print "Hello, World!"
            }
        "#;
        
        let mut lexer = Lexer::new(source);
        let tokens = lexer.tokenize().unwrap();
        
        // Should have tokens for include, <, stdio.h, >, Main, {, Print, "Hello, World!", }, EOF
        assert!(tokens.len() > 5);
    }
    
    #[test]
    fn test_parser_basic() {
        let source = r#"
            Main {
                Print "Hello, World!"
            }
        "#;
        
        let mut lexer = Lexer::new(source);
        let tokens = lexer.tokenize().unwrap();
        let mut parser = Parser::new(tokens);
        let ast = parser.parse().unwrap();
        
        assert_eq!(ast.main_block.statements.len(), 1);
    }
    
    #[test]
    fn test_type_checker_basic() {
        let source = r#"
            Main {
                Print "Hello, World!"
            }
        "#;
        
        let mut lexer = Lexer::new(source);
        let tokens = lexer.tokenize().unwrap();
        let mut parser = Parser::new(tokens);
        let ast = parser.parse().unwrap();
        let mut type_checker = TypeChecker::new();
        
        assert!(type_checker.check(&ast).is_ok());
    }
    
    #[test]
    fn test_codegen_basic() {
        let source = r#"
            Main {
                Print "Hello, World!"
            }
        "#;
        
        let mut lexer = Lexer::new(source);
        let tokens = lexer.tokenize().unwrap();
        let mut parser = Parser::new(tokens);
        let ast = parser.parse().unwrap();
        let mut codegen = CodeGenerator::new();
        
        let c_code = codegen.generate(&ast).unwrap();
        assert!(c_code.contains("Hello, World!"));
        assert!(c_code.contains("int main"));
    }
    
    #[test]
    fn test_string_concatenation() {
        let source = r#"
            Main {
                result = "Hello" + " " + "World"
                Print result
            }
        "#;
        
        let mut lexer = Lexer::new(source);
        let tokens = lexer.tokenize().unwrap();
        let mut parser = Parser::new(tokens);
        let ast = parser.parse().unwrap();
        let mut type_checker = TypeChecker::new();
        
        assert!(type_checker.check(&ast).is_ok());
    }
    
    #[test]
    fn test_print_output_property() {
        let source = r#"
            Main {
                Print "Test"
                last = Print.output
                Print last
            }
        "#;
        
        let mut lexer = Lexer::new(source);
        let tokens = lexer.tokenize().unwrap();
        let mut parser = Parser::new(tokens);
        let ast = parser.parse().unwrap();
        let mut type_checker = TypeChecker::new();
        
        assert!(type_checker.check(&ast).is_ok());
    }
}