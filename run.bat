@echo off
title VectorShop AI Full-Stack Launcher
echo ==============================================================
echo             VectorShop AI Full-Stack Launcher
echo ==============================================================
echo.
echo Terminating any active stray node processes to free ports...
taskkill /f /im node.exe >nul 2>&1
echo.

echo [1/3] Starting Database and REST API Backend Server (Port 5000)...
start cmd /k "title Backend API Server && npm run dev-server"

echo [2/3] Starting Customer Storefront (Port 5173)...
start cmd /k "title Customer Storefront && npm run dev-user"

echo [3/3] Starting Administrator Dashboard (Port 5174)...
start cmd /k "title Admin Dashboard && npm run dev-admin"

echo ==============================================================
echo All three servers are booting up in separate windows:
echo   - Customer Storefront:   http://localhost:5173
echo   - Administrator Panel:  http://localhost:5174
echo   - Backend Server Health: http://localhost:5000/api/health
echo.
echo Leave the command windows open while you test in the browser.
echo ==============================================================
pause
