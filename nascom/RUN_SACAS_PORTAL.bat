@echo off
title SACAS EXAM PORTAL Launcher
cd /d "%~dp0"

echo ==================================================
echo   SACAS EXAM PORTAL Automatic Setup & Launcher
echo ==================================================
echo.

:: 1. Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ⚠️ Node.js environment was not detected on this PC.
    echo 🚀 Automatically downloading and installing Node.js LTS...
    echo    (Please grant Administrator permission if Windows prompts)
    echo.
    
    :: Try Winget install first
    winget install OpenJS.NodeJS.LTS --silent --accept-package-agreements --accept-source-agreements >nul 2>nul
    
    :: Refresh PATH environment variables for current terminal session
    set "PATH=%ProgramFiles%\nodejs;%APPDATA%\npm;%PATH%"
    
    where node >nul 2>nul
    if %errorlevel% neq 0 (
        echo 📥 Downloading official Node.js installer package...
        powershell -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; ProgressPreference = 'SilentlyContinue'; Invoke-WebRequest -Uri 'https://nodejs.org/dist/v20.18.0/node-v20.18.0-x64.msi' -OutFile '$env:TEMP\node_setup.msi'; Start-Process msiexec.exe -ArgumentList '/i $env:TEMP\node_setup.msi /quiet /norestart' -Wait"
        set "PATH=%ProgramFiles%\nodejs;%APPDATA%\npm;%PATH%"
    )
    
    where node >nul 2>nul
    if %errorlevel% neq 0 (
        echo.
        echo ❌ Automatic Node.js download failed or requires manual approval.
        echo 💡 Please download and install Node.js manually from https://nodejs.org/
        echo.
        pause
        exit /b
    ) else (
        echo ✅ Node.js installed successfully!
    )
)

:: 2. Check and install package dependencies automatically if missing
if not exist "node_modules\" (
    echo 📦 Installing root dependencies...
    call npm install
)

if not exist "client\node_modules\" (
    echo 📦 Installing client dependencies...
    call npm --prefix client install
)

if not exist "server\node_modules\" (
    echo 📦 Installing server dependencies...
    call npm --prefix server install
)

:: 3. Start development servers
echo 🚀 Starting SACAS EXAM PORTAL servers...
start /b cmd /c "npm run dev"

echo Waiting for servers to initialize...
timeout /t 5 /nobreak >nul

echo 🌐 Opening SACAS EXAM PORTAL in your browser...
start http://localhost:5173

echo.
echo ==================================================
echo   Portal is live at http://localhost:5173
echo   Keep this window open while using the application.
echo ==================================================
echo.

cmd /k
