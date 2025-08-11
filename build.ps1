# Trica Ultra-Fast Compiler Build Script
# Optimized for maximum performance

Write-Host "Building Trica Ultra-Fast Compiler..." -ForegroundColor Cyan

# Build in release mode for maximum optimization
cargo build --release

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Trica compiler built successfully!" -ForegroundColor Green
    
    # Test with hello world example
    Write-Host "`nTesting with hello.trica..." -ForegroundColor Yellow
    .\target\release\trica.exe .\examples\hello.trica
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Compilation successful! Generated ultra-fast C code." -ForegroundColor Green
        
        # Show the generated C code
        if (Test-Path ".\examples\hello.c") {
            Write-Host "`nGenerated C code:" -ForegroundColor Magenta
            Get-Content ".\examples\hello.c" | Select-Object -First 30
            Write-Host "... (truncated)" -ForegroundColor Gray
            
            # Try to compile with GCC if available
            Write-Host "`nAttempting to compile with GCC..." -ForegroundColor Yellow
            if (Get-Command gcc -ErrorAction SilentlyContinue) {
                gcc -O3 -march=native -flto -ffast-math -funroll-loops ".\examples\hello.c" -o ".\examples\hello.exe"
                if ($LASTEXITCODE -eq 0) {
                    Write-Host "✅ Successfully compiled to native executable!" -ForegroundColor Green
                    Write-Host "Running the ultra-fast executable..." -ForegroundColor Cyan
                    .\examples\hello.exe
                } else {
                    Write-Host "❌ GCC compilation failed" -ForegroundColor Red
                }
            } else {
                Write-Host "⚠️ GCC not found. Install GCC to compile to native executable." -ForegroundColor Yellow
            }
        }
    } else {
        Write-Host "❌ Compilation failed!" -ForegroundColor Red
    }
} else {
    Write-Host "❌ Build failed!" -ForegroundColor Red
}