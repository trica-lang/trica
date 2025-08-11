# Trica Website Build Script
# Builds the React website for deployment to trica.k2lang.org

Write-Host "Building Trica Website..." -ForegroundColor Cyan

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found!" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Check if npm is installed
try {
    $npmVersion = npm --version
    Write-Host "✅ npm version: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm not found!" -ForegroundColor Red
    exit 1
}

# Install dependencies
Write-Host "`nInstalling dependencies..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install dependencies!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Dependencies installed successfully!" -ForegroundColor Green

# Build the website
Write-Host "`nBuilding website for production..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Website built successfully!" -ForegroundColor Green

# Show build info
if (Test-Path "build") {
    $buildSize = (Get-ChildItem "build" -Recurse | Measure-Object -Property Length -Sum).Sum
    $buildSizeMB = [math]::Round($buildSize / 1MB, 2)
    
    Write-Host "`n📦 Build Information:" -ForegroundColor Cyan
    Write-Host "Build directory: build/" -ForegroundColor Gray
    Write-Host "Total size: $buildSizeMB MB" -ForegroundColor Gray
    
    # List main files
    Write-Host "`nMain files:" -ForegroundColor Gray
    Get-ChildItem "build/static/js/*.js" | ForEach-Object {
        $size = [math]::Round($_.Length / 1KB, 1)
        Write-Host "  $($_.Name) ($size KB)" -ForegroundColor Gray
    }
    Get-ChildItem "build/static/css/*.css" | ForEach-Object {
        $size = [math]::Round($_.Length / 1KB, 1)
        Write-Host "  $($_.Name) ($size KB)" -ForegroundColor Gray
    }
}

Write-Host "`n🚀 Website is ready for deployment!" -ForegroundColor Green
Write-Host "Deploy the 'build' folder to trica.k2lang.org" -ForegroundColor Cyan

# Ask if user wants to start development server
$response = Read-Host "`nWould you like to start the development server? (y/N)"
if ($response -eq "y" -or $response -eq "Y") {
    Write-Host "🌐 Starting development server..." -ForegroundColor Cyan
    npm start
}
