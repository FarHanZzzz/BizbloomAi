@echo off
REM BizBloom AI - One Command Setup Script for Windows
REM Usage: setup.bat

echo.
echo ========================================
echo   BizBloom AI - Starting Setup...
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python is not installed. Please install Python 3.10+ first.
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed. Please install Node.js 18+ first.
    exit /b 1
)

echo [INFO] Setting up Backend...
cd backend

REM Create virtual environment if it doesn't exist
if not exist ".venv" (
    echo Creating Python virtual environment...
    python -m venv .venv
)

REM Install Python dependencies
echo Installing Python dependencies...
call .venv\Scripts\pip.exe install -r requirements.txt -q

REM Copy .env.example to .env if .env doesn't exist
if not exist ".env" (
    echo Creating .env file from .env.example...
    copy .env.example .env
    echo [WARNING] Please update backend\.env with your API keys!
)

cd ..

echo [INFO] Setting up Frontend...
cd frontend

REM Install npm dependencies
echo Installing Node.js dependencies...
call npm install --silent

cd ..

echo.
echo ========================================
echo   Setup Complete!
echo ========================================
echo.
echo To start the application, run:
echo    start.bat
echo.
echo Or manually:
echo    Backend:  cd backend ^& .venv\Scripts\activate ^& uvicorn app.main:app --reload
echo    Frontend: cd frontend ^& npm run dev
echo ========================================
echo.
