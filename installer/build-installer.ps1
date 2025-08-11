# Trica Installer Build Script
# Builds the NSIS installer for Trica

Write-Host "Building Trica Installer..." -ForegroundColor Cyan

# Check if NSIS is installed
$nsisPath = ""
$possiblePaths = @(
    "${env:ProgramFiles}\NSIS\makensis.exe",
    "${env:ProgramFiles(x86)}\NSIS\makensis.exe",
    "C:\Program Files\NSIS\makensis.exe",
    "C:\Program Files (x86)\NSIS\makensis.exe"
)

foreach ($path in $possiblePaths) {
    if (Test-Path $path) {
        $nsisPath = $path
        break
    }
}

if (-not $nsisPath) {
    Write-Host "NSIS not found!" -ForegroundColor Red
    Write-Host "Please install NSIS from https://nsis.sourceforge.io/Download" -ForegroundColor Yellow
    Write-Host "After installation, run this script again." -ForegroundColor Yellow
    exit 1
}

Write-Host "Found NSIS at: $nsisPath" -ForegroundColor Green

# Ensure Trica is built
Write-Host "Building Trica compiler..." -ForegroundColor Yellow
Set-Location ".."
cargo build --release

if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to build Trica compiler!" -ForegroundColor Red
    exit 1
}

Write-Host "Trica compiler built successfully!" -ForegroundColor Green

# Build the installer
Set-Location "installer"
Write-Host "Building installer..." -ForegroundColor Yellow

& $nsisPath "trica-setup.nsi"

if ($LASTEXITCODE -eq 0) {
    Write-Host "Installer built successfully!" -ForegroundColor Green
    
    # Show the installer file
    $installerFile = Get-ChildItem "TricaSetup-*.exe" | Select-Object -First 1
    if ($installerFile) {
        Write-Host "Installer created: $($installerFile.Name)" -ForegroundColor Cyan
        Write-Host "Size: $([math]::Round($installerFile.Length / 1MB, 2)) MB" -ForegroundColor Gray
        
        # Ask if user wants to test the installer
        $response = Read-Host "Would you like to test the installer? (y/N)"
        if ($response -eq "y" -or $response -eq "Y") {
            Write-Host "Running installer..." -ForegroundColor Cyan
            Start-Process $installerFile.FullName
        }
    }
} else {
    Write-Host "Failed to build installer!" -ForegroundColor Red
    exit 1
}