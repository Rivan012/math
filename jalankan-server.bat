@echo off
title TIME QUEST - Server Lokal Edukasi Matematika
echo ========================================================
echo   Memulai Server Sinkronisasi TIME QUEST...
echo ========================================================
echo.

node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js belum terdeteksi di laptop ini!
    echo Silakan unduh dan pasang Node.js dari https://nodejs.org
    pause
    exit /b
)

start http://localhost:3000
node server.js

pause
