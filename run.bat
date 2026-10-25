@echo off
echo ========================================================
echo HOS - HOUSE OF SIMONS LUXURY PORTAL SETUP
echo ========================================================
echo Installing root, backend, and frontend dependencies...
call npm run install:all
echo.
echo Using the product catalog included in backend\database.json...
echo Starting concurrent servers on http://localhost:3000...
call npm run dev
pause
