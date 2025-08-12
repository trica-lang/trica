use crate::ast::*;
use crate::error::TricarError;
use std::collections::HashMap;

pub struct TypeChecker {
    variables: HashMap<String, Type>,
    functions: HashMap<String, FunctionSignature>,
}

#[derive(Debug, Clone)]
struct FunctionSignature {
    params: Vec<Type>,
    return_type: Type,
}

impl TypeChecker {
    pub fn new() -> Self {
        let mut functions = HashMap::new();
        
        // Built-in Print function
        functions.insert("Print".to_string(), FunctionSignature {
            params: vec![Type::String],
            return_type: Type::Void,
        });
        
        // Built-in Print.output property (returns last printed string)
        functions.insert("Print.output".to_string(), FunctionSignature {
            params: vec![],
            return_type: Type::String,
        });
        
        Self {
            variables: HashMap::new(),
            functions,
        }
    }
    
    pub fn check(&mut self, program: &Program) -> Result<(), TricarError> {
        // Type check includes (basic validation)
        for include in &program.includes {
            self.check_include(include)?;
        }
        
        // Type check imports (basic validation)
        for import in &program.imports {
            self.check_import(import)?;
        }
        
        // Type check main block
        // BLAZING FAST TYPE CHECKING - DIRECT STATEMENTS!
        for statement in &program.statements {
            self.check_statement(statement)?;
        }
        
        Ok(())
    }
    
    fn check_include(&self, _include: &Include) -> Result<(), TricarError> {
        // For now, just validate that the include path is reasonable
        // In a full implementation, we'd check if the header exists
        Ok(())
    }
    
    fn check_import(&mut self, import: &Import) -> Result<(), TricarError> {
        // Register the imported module as available
        // For now, we'll just add some basic validation
        
        // Special handling for known modules
        if import.module_path == vec!["user", "input"] {
            // Add user input functions to the function table
            self.functions.insert(format!("{}.input", import.alias), FunctionSignature {
                params: vec![Type::String],
                return_type: Type::String,
            });
        }
        
        Ok(())
    }
    
    fn check_main_block(&mut self, main_block: &MainBlock) -> Result<(), TricarError> {
        for statement in &main_block.statements {
            self.check_statement(statement)?;
        }
        Ok(())
    }
    
    fn check_statement(&mut self, statement: &Statement) -> Result<(), TricarError> {
        match statement {
            Statement::Print { expression, .. } => {
                let expr_type = self.check_expression(expression)?;
                
                // Print accepts strings, numbers, and other printable types
                match expr_type {
                    Type::String | Type::Number => Ok(()),
                    _ => Err(TricarError::TypeMismatch {
                        expected: "String or Number".to_string(),
                        found: format!("{:?}", expr_type),
                        line: expression.line(),
                        column: expression.column(),
                    })
                }
            }
            Statement::Assignment { name, value, line, column } => {
                let value_type = self.check_expression(value)?;
                
                // Check if variable already exists with different type
                if let Some(existing_type) = self.variables.get(name) {
                    if *existing_type != value_type && *existing_type != Type::Unknown {
                        return Err(TricarError::TypeMismatch {
                            expected: format!("{:?}", existing_type),
                            found: format!("{:?}", value_type),
                            line: *line,
                            column: *column,
                        });
                    }
                }
                
                // Register or update variable type
                self.variables.insert(name.clone(), value_type);
                Ok(())
            }
            Statement::Expression { expression, .. } => {
                self.check_expression(expression)?;
                Ok(())
            }
        }
    }
    
    fn check_expression(&mut self, expression: &Expression) -> Result<Type, TricarError> {
        match expression {
            Expression::StringLiteral { .. } => Ok(Type::String),
            Expression::NumberLiteral { .. } => Ok(Type::Number),
            
            Expression::Identifier { name, line, column } => {
                self.variables.get(name)
                    .cloned()
                    .ok_or_else(|| TricarError::UndefinedVariable {
                        name: name.clone(),
                        line: *line,
                        column: *column,
                    })
            }
            
            Expression::PropertyAccess { object, property, line: _line, column: _column } => {
                let _object_type = self.check_expression(object)?;
                
                // Handle special cases like Print.output
                if let Expression::Identifier { name, .. } = object.as_ref() {
                    let full_name = format!("{}.{}", name, property);
                    if let Some(signature) = self.functions.get(&full_name) {
                        return Ok(signature.return_type.clone());
                    }
                }
                
                // For now, return Unknown for other property accesses
                // In a full implementation, we'd have a proper type system for objects
                Ok(Type::Unknown)
            }
            
            Expression::FunctionCall { name, args, line, column } => {
                // Check if function exists
                let signature = self.functions.get(name)
                    .ok_or_else(|| TricarError::UndefinedFunction {
                        name: name.clone(),
                        line: *line,
                        column: *column,
                    })?.clone();
                
                // Check argument count
                if args.len() != signature.params.len() {
                    return Err(TricarError::TypeMismatch {
                        expected: format!("{} arguments", signature.params.len()),
                        found: format!("{} arguments", args.len()),
                        line: *line,
                        column: *column,
                    });
                }
                
                // Check argument types
                for (_i, (arg, expected_type)) in args.iter().zip(&signature.params).enumerate() {
                    let arg_type = self.check_expression(arg)?;
                    if arg_type != *expected_type && arg_type != Type::Unknown && *expected_type != Type::Unknown {
                        return Err(TricarError::TypeMismatch {
                            expected: format!("{:?}", expected_type),
                            found: format!("{:?}", arg_type),
                            line: arg.line(),
                            column: arg.column(),
                        });
                    }
                }
                
                Ok(signature.return_type)
            }
            
            Expression::BinaryOp { left, operator, right, line, column } => {
                let left_type = self.check_expression(left)?;
                let right_type = self.check_expression(right)?;
                
                match operator {
                    BinaryOperator::Add => {
                        match (left_type, right_type) {
                            (Type::Number, Type::Number) => Ok(Type::Number),
                            (Type::String, Type::String) => Ok(Type::String),
                            (Type::String, Type::Number) | (Type::Number, Type::String) => Ok(Type::String),
                            (l, r) => Err(TricarError::TypeMismatch {
                                expected: "Number + Number, String + String, or String + Number".to_string(),
                                found: format!("{:?} + {:?}", l, r),
                                line: *line,
                                column: *column,
                            })
                        }
                    }
                    BinaryOperator::Subtract | BinaryOperator::Multiply | BinaryOperator::Divide => {
                        match (left_type, right_type) {
                            (Type::Number, Type::Number) => Ok(Type::Number),
                            (l, r) => Err(TricarError::TypeMismatch {
                                expected: "Number".to_string(),
                                found: format!("{:?} and {:?}", l, r),
                                line: *line,
                                column: *column,
                            })
                        }
                    }
                    BinaryOperator::Equal | BinaryOperator::NotEqual => {
                        // Equality works on same types
                        if left_type == right_type || left_type == Type::Unknown || right_type == Type::Unknown {
                            Ok(Type::Boolean)
                        } else {
                            Err(TricarError::TypeMismatch {
                                expected: "matching types".to_string(),
                                found: format!("{:?} and {:?}", left_type, right_type),
                                line: *line,
                                column: *column,
                            })
                        }
                    }
                    BinaryOperator::Less | BinaryOperator::Greater | 
                    BinaryOperator::LessEqual | BinaryOperator::GreaterEqual => {
                        match (left_type, right_type) {
                            (Type::Number, Type::Number) => Ok(Type::Boolean),
                            (Type::String, Type::String) => Ok(Type::Boolean),
                            (l, r) => Err(TricarError::TypeMismatch {
                                expected: "Number or String".to_string(),
                                found: format!("{:?} and {:?}", l, r),
                                line: *line,
                                column: *column,
                            })
                        }
                    }
                }
            }
        }
    }
}