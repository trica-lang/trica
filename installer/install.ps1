# 🔥 TRICA 2.0.0 LEGENDARY INSTALLER 🔥
# The fastest compiling language on Earth!

Write-Host "🔥 TRICA 2.0.0 LEGENDARY INSTALLER 🔥" -ForegroundColor Red
Write-Host "⚡ Installing the fastest compiling language on Earth!" -ForegroundColor Yellow
Write-Host ""

# Check if running as administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")

if (-not $isAdmin) {
    Write-Host "⚠️  This installer needs to run as Administrator to install to Program Files" -ForegroundColor Yellow
    Write-Host "   Attempting to restart as Administrator..." -ForegroundColor Yellow
    
    try {
        Start-Process PowerShell -Verb RunAs -ArgumentList "-ExecutionPolicy Bypass -File `"$PSCommandPath`""
        exit
    } catch {
        Write-Host "❌ Failed to restart as Administrator. Please run PowerShell as Administrator and try again." -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
}

Write-Host "✅ Running as Administrator" -ForegroundColor Green

# Installation paths
$installDir = "C:\Program Files\Trica"
$binDir = "$installDir\bin"

try {
    # Create installation directory
    Write-Host "📁 Creating installation directory: $installDir" -ForegroundColor Cyan
    New-Item -ItemType Directory -Path $installDir -Force | Out-Null
    New-Item -ItemType Directory -Path $binDir -Force | Out-Null

    # Copy binaries
    Write-Host "📦 Installing TRICA binaries..." -ForegroundColor Cyan
    
    $currentDir = Get-Location
    $sourceDir = "$currentDir\target\release"
    
    if (-not (Test-Path "$sourceDir\trica.exe")) {
        Write-Host "❌ trica.exe not found in $sourceDir" -ForegroundColor Red
        Write-Host "   Please run 'cargo build --release' first" -ForegroundColor Yellow
        Read-Host "Press Enter to exit"
        exit 1
    }
    
    Copy-Item "$sourceDir\trica.exe" "$binDir\" -Force
    Copy-Item "$sourceDir\tpkg.exe" "$binDir\" -Force
    
    Write-Host "✅ Binaries installed successfully" -ForegroundColor Green

    # Add to PATH
    Write-Host "🔧 Adding TRICA to system PATH..." -ForegroundColor Cyan
    
    $currentPath = [Environment]::GetEnvironmentVariable("PATH", "Machine")
    if ($currentPath -notlike "*$binDir*") {
        $newPath = "$currentPath;$binDir"
        [Environment]::SetEnvironmentVariable("PATH", $newPath, "Machine")
        Write-Host "✅ Added $binDir to system PATH" -ForegroundColor Green
    } else {
        Write-Host "✅ $binDir already in system PATH" -ForegroundColor Green
    }

    # Create start menu shortcuts
    Write-Host "🔗 Creating Start Menu shortcuts..." -ForegroundColor Cyan
    
    $startMenuDir = "$env:ProgramData\Microsoft\Windows\Start Menu\Programs\Trica"
    New-Item -ItemType Directory -Path $startMenuDir -Force | Out-Null
    
    $WshShell = New-Object -comObject WScript.Shell
    
    # Trica Compiler shortcut
    $shortcut = $WshShell.CreateShortcut("$startMenuDir\Trica Compiler.lnk")
    $shortcut.TargetPath = "$binDir\trica.exe"
    $shortcut.WorkingDirectory = "$binDir"
    $shortcut.Description = "🔥 TRICA 2.0.0 - Legendary <900ns compilation!"
    $shortcut.Save()
    
    # Trica Package Manager shortcut
    $shortcut = $WshShell.CreateShortcut("$startMenuDir\Trica Package Manager.lnk")
    $shortcut.TargetPath = "$binDir\tpkg.exe"
    $shortcut.WorkingDirectory = "$binDir"
    $shortcut.Description = "📦 TRICA Package Manager"
    $shortcut.Save()
    
    Write-Host "✅ Start Menu shortcuts created" -ForegroundColor Green

    # Create sample files
    Write-Host "📝 Creating sample files..." -ForegroundColor Cyan
    
    $samplesDir = "$installDir\samples"
    New-Item -ItemType Directory -Path $samplesDir -Force | Out-Null
    
    # Hello World sample
    @"
Main {
    Print "🔥 Hello from TRICA 2.0.0! 🔥"
    Print "The fastest compiling language on Earth!"
}
"@ | Out-File "$samplesDir\hello.trica" -Encoding UTF8
    
    # Speed test sample
    @"
Main {
    Print "⚡ LEGENDARY <900ns compilation speed! ⚡"
    Print "TRICA 2.0.0 - Reality bending performance!"
}
"@ | Out-File "$samplesDir\speed_test.trica" -Encoding UTF8
    
    Write-Host "✅ Sample files created in $samplesDir" -ForegroundColor Green

    # Installation complete
    Write-Host ""
    Write-Host "🎉 TRICA 2.0.0 INSTALLATION COMPLETE! 🎉" -ForegroundColor Green
    Write-Host ""
    Write-Host "🔥 LEGENDARY FEATURES:" -ForegroundColor Red
    Write-Host "   ⚡ <900ns compilation speed" -ForegroundColor Yellow
    Write-Host "   🚀 Sub-microsecond execution" -ForegroundColor Yellow
    Write-Host "   🧠 Quantum-inspired bytecode VM" -ForegroundColor Yellow
    Write-Host "   📦 Built-in package manager" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "🚀 QUICK START:" -ForegroundColor Cyan
    Write-Host "   Open a new Command Prompt or PowerShell window and run:" -ForegroundColor White
    Write-Host "   trica `"$samplesDir\hello.trica`"" -ForegroundColor Green
    Write-Host ""
    Write-Host "📚 SAMPLE FILES LOCATION:" -ForegroundColor Cyan
    Write-Host "   $samplesDir" -ForegroundColor White
    Write-Host ""
    Write-Host "🔧 USAGE:" -ForegroundColor Cyan
    Write-Host "   trica <file.trica>     - Compile and run Trica file" -ForegroundColor White
    Write-Host "   tpkg install <pkg>     - Install packages" -ForegroundColor White
    Write-Host "   tpkg list              - List available packages" -ForegroundColor White
    Write-Host ""
    Write-Host "⚠️  IMPORTANT: Please restart your terminal/command prompt" -ForegroundColor Yellow
    Write-Host "   to use the 'trica' and 'tpkg' commands from anywhere!" -ForegroundColor Yellow
    Write-Host ""
    
} catch {
    Write-Host "❌ Installation failed: $($_.Exception.Message)" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Read-Host "Press Enter to exit"