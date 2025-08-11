@echo off
echo Building Trica Installer...

REM Check for NSIS installation
set NSIS_PATH=""
if exist "C:\Program Files\NSIS\makensis.exe" set NSIS_PATH="C:\Program Files\NSIS\makensis.exe"
if exist "C:\Program Files (x86)\NSIS\makensis.exe" set NSIS_PATH="C:\Program Files (x86)\NSIS\makensis.exe"

if %NSIS_PATH%=="" (
    echo ERROR: NSIS not found!
    echo Please install NSIS from https://nsis.sourceforge.io/Download
    pause
    exit /b 1
)

echo Found NSIS at %NSIS_PATH%

REM Build Trica first
echo Building Trica compiler...
cd ..
cargo build --release
if errorlevel 1 (
    echo ERROR: Failed to build Trica compiler!
    pause
    exit /b 1
)

echo Trica compiler built successfully!

REM Build installer
cd installer
echo Building installer...
%NSIS_PATH% simple-installer.nsi

if errorlevel 1 (
    echo ERROR: Failed to build installer!
    pause
    exit /b 1
)

echo Installer built successfully!
echo.
dir TricaInstaller-*.exe
echo.
echo Installer is ready to use!
pause