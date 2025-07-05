@echo off
echo Starting Career Mentor Agent Development Environment...
echo.

echo Starting Backend Server...
cd backend
start "Backend Server" cmd /k "venv\Scripts\activate && uvicorn main:app --reload --host 0.0.0.0 --port 8000"

echo.
echo Starting Frontend Server...
cd ..\frontend
start "Frontend Server" cmd /k "npm run dev"

echo.
echo Development servers are starting...
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3000
echo API Docs: http://localhost:8000/docs
echo.
echo Press any key to exit this script...
pause > nul 