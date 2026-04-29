@echo off
title DevTrack Pro Launcher
echo.
echo  ==========================================
echo   DevTrack Pro -- Starting Servers...
echo  ==========================================
echo.

echo [1/2] Starting Backend API on http://localhost:5000 ...
start "DevTrack Backend" cmd /k "cd /d C:\xampp\htdocs\devtrack-pro\backend && npm run dev"

timeout /t 3 /nobreak >nul

echo [2/2] Starting Frontend on http://localhost:5173 ...
start "DevTrack Frontend" cmd /k "cd /d C:\xampp\htdocs\devtrack-pro && npm run dev"

echo.
echo  Both servers are starting in separate windows.
echo  Backend  --> http://localhost:5000
echo  Frontend --> http://localhost:5173
echo.
echo  Make sure XAMPP MySQL is running before using the app!
echo.
pause
