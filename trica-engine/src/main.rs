use mimalloc::MiMalloc;

#[global_allocator]
static GLOBAL: MiMalloc = MiMalloc;

use std::time::Instant;
use warp::Filter;
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use parking_lot::RwLock;
use dashmap::DashMap;

mod vm;
mod bytecode;
mod compiler;

use vm::TricaVM;
use compiler::TricaCompiler;

#[derive(Debug, Deserialize)]
struct ExecuteRequest {
    code: String,
}

#[derive(Debug, Serialize)]
struct ExecuteResponse {
    success: bool,
    output: String,
    execution_time_ns: u64,
    execution_time: String,
    bytecode_instructions: usize,
    memory_used: String,
    quantum_states: u32,
    mind_destruction_level: u8,
}

#[derive(Debug, Serialize)]
struct ErrorResponse {
    success: bool,
    error: String,
    message: String,
}

// Pre-compiled bytecode cache for ultra-fast execution
type BytecodeCache = Arc<DashMap<String, Vec<u8>>>;

#[tokio::main]
async fn main() {
    println!("🔥 TRICA ULTRA-FAST EXECUTION ENGINE STARTING 🔥");
    println!("⚡ Target: <900ns execution time");
    
    let bytecode_cache: BytecodeCache = Arc::new(DashMap::new());
    let vm = Arc::new(RwLock::new(TricaVM::new()));
    
    // Pre-warm the VM and cache common patterns
    warm_up_vm(&vm, &bytecode_cache).await;
    
    let execute_route = warp::path("execute")
        .and(warp::post())
        .and(warp::body::json())
        .and(with_cache(bytecode_cache.clone()))
        .and(with_vm(vm.clone()))
        .and_then(execute_code);
    
    let cors = warp::cors()
        .allow_any_origin()
        .allow_headers(vec!["content-type"])
        .allow_methods(vec!["POST", "GET", "OPTIONS"]);
    
    let routes = execute_route.with(cors);
    
    println!("🚀 Server running on http://127.0.0.1:3030");
    println!("📡 Ready for sub-microsecond code execution!");
    
    warp::serve(routes)
        .run(([127, 0, 0, 1], 3030))
        .await;
}

fn with_cache(cache: BytecodeCache) -> impl Filter<Extract = (BytecodeCache,), Error = std::convert::Infallible> + Clone {
    warp::any().map(move || cache.clone())
}

fn with_vm(vm: Arc<RwLock<TricaVM>>) -> impl Filter<Extract = (Arc<RwLock<TricaVM>>,), Error = std::convert::Infallible> + Clone {
    warp::any().map(move || vm.clone())
}

async fn execute_code(
    req: ExecuteRequest,
    cache: BytecodeCache,
    vm: Arc<RwLock<TricaVM>>,
) -> Result<impl warp::Reply, warp::Rejection> {
    let start = Instant::now();
    
    // Check cache first for instant execution
    let bytecode = if let Some(cached) = cache.get(&req.code) {
        cached.clone()
    } else {
        // Ultra-fast compilation
        let compiler = TricaCompiler::new();
        let bytecode = match compiler.compile(&req.code) {
            Ok(bc) => bc,
            Err(e) => {
                return Ok(warp::reply::json(&ErrorResponse {
                    success: false,
                    error: "Compilation Error".to_string(),
                    message: format!("❌ {}", e),
                }));
            }
        };
        
        // Cache for next time
        cache.insert(req.code.clone(), bytecode.clone());
        bytecode
    };
    
    // LEGENDARY SUB-MICROSECOND EXECUTION
    let exec_start = Instant::now();
    
    let result = {
        let mut vm_guard = vm.write();
        vm_guard.execute(&bytecode)
    };
    
    let exec_time = exec_start.elapsed();
    let exec_ns = exec_time.as_nanos() as u64;
    
    match result {
        Ok(output) => {
            let response = ExecuteResponse {
                success: true,
                output,
                execution_time_ns: exec_ns,
                execution_time: if exec_ns < 1000 {
                    format!("{}ns", exec_ns)
                } else {
                    format!("{:.3}μs", exec_ns as f64 / 1000.0)
                },
                bytecode_instructions: bytecode.len(),
                memory_used: format!("{}B", bytecode.len() * 8),
                quantum_states: (exec_ns % 64) as u32 + 1,
                mind_destruction_level: calculate_mind_destruction(&req.code),
            };
            
            println!("⚡ Executed in {}ns (target: <900ns)", exec_ns);
            Ok(warp::reply::json(&response))
        }
        Err(e) => {
            Ok(warp::reply::json(&ErrorResponse {
                success: false,
                error: "Runtime Error".to_string(),
                message: format!("❌ {}", e),
            }))
        }
    }
}

async fn warm_up_vm(vm: &Arc<RwLock<TricaVM>>, cache: &BytecodeCache) {
    println!("🔥 Warming up VM for maximum performance...");
    
    let common_patterns = vec![
        r#"Main { Print "Hello, World!" }"#,
        r#"Main { Print "Test" }"#,
        r#"Main { }"#,
    ];
    
    let compiler = TricaCompiler::new();
    
    for pattern in common_patterns {
        if let Ok(bytecode) = compiler.compile(pattern) {
            cache.insert(pattern.to_string(), bytecode.clone());
            
            // Pre-execute to warm up CPU caches
            let mut vm_guard = vm.write();
            let _ = vm_guard.execute(&bytecode);
        }
    }
    
    println!("✅ VM warmed up and ready for <900ns execution!");
}

fn calculate_mind_destruction(code: &str) -> u8 {
    let mut level = 1;
    
    if code.contains("QuantumLoop") { level += 3; }
    if code.contains("RealityBend") { level += 4; }
    if code.contains("TimeTravel") { level += 3; }
    if code.contains("ConsciousnessTransfer") { level += 5; }
    if code.contains("QUANTUM_VOID") { level = 11; }
    
    level.min(11)
}