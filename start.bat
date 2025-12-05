@echo off
REM BizBloom AI - Start Both Servers
REM Usage: start.bat

echo.
echo ========================================
echo   BizBloom AI - Starting Servers...
echo ========================================
echo.

echo Starting Backend on http://localhost:8000...
start "BizBloom Backend" cmd /k "cd backend && .venv\Scripts\activate && python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"

REM Wait a few seconds for backend to start
timeout /t 3 /nobreak > nul

echo Starting Frontend on http://localhost:5173...
start "BizBloom Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo   Both servers are starting!
echo ========================================
echo.
echo    Frontend: http://localhost:5173
echo    Backend:  http://localhost:8000
echo    API Docs: http://localhost:8000/docs
echo.
echo Close the terminal windows to stop the servers.
echo ========================================
echo.

REM Open the frontend in default browser after a short delay
timeout /t 5 /nobreak > nul
start http://localhost:5173
