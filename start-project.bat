@echo off
echo ===================================================
echo        Starting AssetFlow (Hackathon Project)
echo ===================================================
echo.

echo [1/2] Starting Backend Server...
start "AssetFlow Backend" cmd /k "cd server && npm install && npm run dev"

echo [2/2] Starting Frontend Application...
start "AssetFlow Frontend" cmd /k "cd client && npm install && npm run dev"

echo.
echo Both servers are starting up in separate windows!
echo Make sure MongoDB Compass is running in the background.
echo.
pause
