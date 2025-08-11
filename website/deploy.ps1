# Trica Website Deployment Script
# Deploys the built website to trica.k2lang.org

param(
    [string]$Server = "trica.k2lang.org",
    [string]$Path = "/var/www/trica",
    [string]$User = "deploy"
)

Write-Host "Deploying Trica Website to $Server..." -ForegroundColor Cyan

# Check if build directory exists
if (-not (Test-Path "build")) {
    Write-Host "❌ Build directory not found!" -ForegroundColor Red
    Write-Host "Run 'npm run build' first to create the build directory." -ForegroundColor Yellow
    exit 1
}

# Check if rsync is available (for Windows, you might need WSL or install rsync)
try {
    rsync --version | Out-Null
    Write-Host "✅ rsync found" -ForegroundColor Green
} catch {
    Write-Host "❌ rsync not found!" -ForegroundColor Red
    Write-Host "Please install rsync or use WSL for deployment." -ForegroundColor Yellow
    Write-Host "Alternative: Manually copy the 'build' folder contents to your server." -ForegroundColor Yellow
    exit 1
}

# Create deployment archive
Write-Host "`nCreating deployment archive..." -ForegroundColor Yellow
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$archiveName = "trica-website-$timestamp.zip"

Compress-Archive -Path "build\*" -DestinationPath $archiveName -Force
Write-Host "✅ Created archive: $archiveName" -ForegroundColor Green

# Deploy using rsync (requires SSH access)
Write-Host "`nDeploying to server..." -ForegroundColor Yellow
Write-Host "Server: $Server" -ForegroundColor Gray
Write-Host "Path: $Path" -ForegroundColor Gray
Write-Host "User: $User" -ForegroundColor Gray

try {
    # Sync build directory to server
    rsync -avz --delete "build/" "${User}@${Server}:${Path}/"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Deployment successful!" -ForegroundColor Green
        Write-Host "🌐 Website is now live at https://$Server" -ForegroundColor Cyan
    } else {
        Write-Host "❌ Deployment failed!" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Deployment failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "`nManual deployment instructions:" -ForegroundColor Yellow
    Write-Host "1. Upload the contents of the 'build' folder to your web server" -ForegroundColor Gray
    Write-Host "2. Ensure the web server is configured to serve the index.html file" -ForegroundColor Gray
    Write-Host "3. Configure URL rewriting for React Router (if needed)" -ForegroundColor Gray
}

# Cleanup
Write-Host "`nCleaning up..." -ForegroundColor Yellow
Remove-Item $archiveName -Force
Write-Host "✅ Cleanup complete!" -ForegroundColor Green
