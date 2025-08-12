use crate::ast::*;
use crate::error::TricarError;
use std::collections::HashMap;

pub struct CodeGenerator {
    output: String,
    string_literals: HashMap<String, usize>,
    string_counter: usize,
    temp_counter: usize,
    variables: HashMap<String, String>,
}

impl CodeGenerator {
    pub fn new() -> Self {
        Self {
            output: String::new(),
            string_literals: HashMap::new(),
            string_counter: 0,
            temp_counter: 0,
            variables: HashMap::new(),
        }
    }

    pub fn generate(&mut self, program: &Program) -> Result<String, TricarError> {
        self.generate_header();
        // BLAZING FAST CODEGEN - DIRECT STATEMENTS!
        self.collect_string_literals_from_statements(&program.statements);
        self.generate_string_literals();
        self.generate_runtime_functions();
        self.generate_main_function_from_statements(&program.statements)?;
        Ok(self.output.clone())
    }

    fn generate_header(&mut self) {
        self.emit_line("/*");
        self.emit_line(" * Trica Ultra-Fast Compiled Output");
        self.emit_line(" */");
        self.emit_line("");
        self.emit_line("#include <stdio.h>");
        self.emit_line("#include <stdlib.h>");
        self.emit_line("#include <string.h>");
        self.emit_line("#include <stdint.h>");
        self.emit_line("");
        self.emit_line("#define TRICA_INLINE __forceinline");
        self.emit_line("#define TRICA_RESTRICT __restrict");
        self.emit_line("#define TRICA_LIKELY(x) __builtin_expect(!!(x), 1)");
        self.emit_line("#define TRICA_UNLIKELY(x) __builtin_expect(!!(x), 0)");
        self.emit_line("");
        self.emit_line("static char* trica_last_output = NULL;");
        self.emit_line("static size_t trica_last_output_len = 0;");
        self.emit_line("");
    }

    fn collect_string_literals(&mut self, main_block: &MainBlock) {
        for statement in &main_block.statements {
            self.collect_strings_from_statement(statement);
        }
    }
    
    // BLAZING FAST - Direct statement collection
    fn collect_string_literals_from_statements(&mut self, statements: &[Statement]) {
        for statement in statements {
            self.collect_strings_from_statement(statement);
        }
    }

    fn collect_strings_from_statement(&mut self, statement: &Statement) {
        match statement {
            Statement::Print { expression, .. } |
            Statement::Assignment { value: expression, .. } |
            Statement::Expression { expression, .. } => {
                self.collect_strings_from_expression(expression);
            }
        }
    }

    fn collect_strings_from_expression(&mut self, expression: &Expression) {
        match expression {
            Expression::StringLiteral { value, .. } => {
                if !self.string_literals.contains_key(value) {
                    self.string_literals.insert(value.clone(), self.string_counter);
                    self.string_counter += 1;
                }
            }
            Expression::NumberLiteral { value, .. } => {
                let val = value.to_string();
                if !self.string_literals.contains_key(&val) {
                    self.string_literals.insert(val, self.string_counter);
                    self.string_counter += 1;
                }
            }
            Expression::BinaryOp { left, right, .. } => {
                self.collect_strings_from_expression(left);
                self.collect_strings_from_expression(right);
            }
            Expression::PropertyAccess { object, .. } => {
                self.collect_strings_from_expression(object);
            }
            Expression::FunctionCall { args, .. } => {
                for arg in args {
                    self.collect_strings_from_expression(arg);
                }
            }
            _ => {}
        }
    }

    fn generate_string_literals(&mut self) {
        if self.string_literals.is_empty() {
            return;
        }
        self.emit_line("// Pre-computed string literals for maximum performance");
        for (literal, id) in self.string_literals.clone() {
            let escaped = self.escape_c_string(&literal);
            self.emit_line(&format!("static const char trica_str_{}[] = \"{}\";", id, escaped));
        }
        self.emit_line("");
    }

    fn generate_runtime_functions(&mut self) {
        self.emit_line("// Ultra-optimized runtime functions");
        self.emit_line("TRICA_INLINE void trica_print(const char* TRICA_RESTRICT str) {");
        self.emit_line("    fputs(str, stdout);");
        self.emit_line("    if (TRICA_UNLIKELY(trica_last_output != NULL)) free(trica_last_output);");
        self.emit_line("    size_t len = strlen(str);");
        self.emit_line("    trica_last_output = (char*)malloc(len + 1);");
        self.emit_line("    memcpy(trica_last_output, str, len + 1);");
        self.emit_line("    trica_last_output_len = len;");
        self.emit_line("}");
        self.emit_line("");
        self.emit_line("TRICA_INLINE char* trica_concat(const char* TRICA_RESTRICT str1, const char* TRICA_RESTRICT str2) {");
        self.emit_line("    size_t len1 = strlen(str1), len2 = strlen(str2);");
        self.emit_line("    char* result = (char*)malloc(len1 + len2 + 1);");
        self.emit_line("    memcpy(result, str1, len1);");
        self.emit_line("    memcpy(result + len1, str2, len2 + 1);");
        self.emit_line("    return result;");
        self.emit_line("}");
        self.emit_line("");
        self.emit_line("TRICA_INLINE const char* trica_get_last_output(void) {");
        self.emit_line("    return trica_last_output ? trica_last_output : \"\";");
        self.emit_line("}");
        self.emit_line("");
    }

    fn generate_main_function(&mut self, main_block: &MainBlock) -> Result<(), TricarError> {
        self.emit_line("int main(void) {");
        self.emit_line("    // Ultra-fast execution starts here");
        for statement in &main_block.statements {
            self.generate_statement(statement)?;
        }
        self.emit_line("    if (trica_last_output != NULL) free(trica_last_output);");
        self.emit_line("    return 0;");
        self.emit_line("}");
        Ok(())
    }
    
    // BLAZING FAST - Direct statement generation
    fn generate_main_function_from_statements(&mut self, statements: &[Statement]) -> Result<(), TricarError> {
        self.emit_line("int main(void) {");
        self.emit_line("    // BLAZING FAST execution starts here");
        for statement in statements {
            self.generate_statement(statement)?;
        }
        self.emit_line("    if (trica_last_output != NULL) free(trica_last_output);");
        self.emit_line("    return 0;");
        self.emit_line("}");
        Ok(())
    }

    fn generate_statement(&mut self, statement: &Statement) -> Result<(), TricarError> {
        match statement {
            Statement::Print { expression, .. } => {
                let val = self.generate_expression(expression)?;
                self.emit_line(&format!("    trica_print({});", val));
            }
            Statement::Assignment { name, value, .. } => {
                let val = self.generate_expression(value)?;
                let var = format!("trica_var_{}", name);
                self.emit_line(&format!("    char* {} = {};", var, val));
                self.variables.insert(name.clone(), var);
            }
            Statement::Expression { expression, .. } => {
                self.generate_expression(expression)?; // result ignored
            }
        }
        Ok(())
    }

    fn generate_expression(&mut self, expression: &Expression) -> Result<String, TricarError> {
        match expression {
            Expression::StringLiteral { value, .. } => {
                let id = self.string_literals[value];
                Ok(format!("trica_str_{}", id))
            }
            Expression::NumberLiteral { value, .. } => {
                let s = value.to_string();
                let id = self.string_literals[&s];
                Ok(format!("trica_str_{}", id))
            }
            Expression::Identifier { name, .. } => {
                self.variables.get(name)
                    .cloned()
                    .ok_or_else(|| TricarError::CodegenError(format!("Undefined variable: {}", name)))
            }
            Expression::PropertyAccess { object, property, .. } => {
                if let Expression::Identifier { name, .. } = object.as_ref() {
                    if name == "Print" && property == "output" {
                        return Ok("trica_get_last_output()".to_string());
                    }
                }
                Err(TricarError::CodegenError("Unsupported property access".to_string()))
            }
            Expression::BinaryOp { left, operator, right, .. } => {
                match operator {
                    BinaryOperator::Add => {
                        let l = self.generate_expression(left)?;
                        let r = self.generate_expression(right)?;
                        Ok(format!("trica_concat({}, {})", l, r))
                    }
                    _ => Err(TricarError::CodegenError("Unsupported binary operator".to_string())),
                }
            }
            _ => Err(TricarError::CodegenError("Unsupported expression type".to_string())),
        }
    }

    fn emit_line(&mut self, line: &str) {
        self.output.push_str(line);
        self.output.push('\n');
    }

    fn escape_c_string(&self, s: &str) -> String {
        s.chars()
            .map(|c| match c {
                '"' => "\\\"".to_string(),
                '\\' => "\\\\".to_string(),
                '\n' => "\\n".to_string(),
                '\t' => "\\t".to_string(),
                '\r' => "\\r".to_string(),
                c if c.is_ascii_graphic() || c == ' ' => c.to_string(),
                c => format!("\\x{:02x}", c as u8),
            })
            .collect()
    }
}
